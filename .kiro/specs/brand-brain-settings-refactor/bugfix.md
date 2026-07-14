# Bugfix Requirements Document

## Introduction

The Brand Brain Settings page at `src/app/dashboard/brands/[slug]/settings/page.tsx` is the most critical configuration surface in MarketingOS — every AI employee reads this data before every task. The page has a dual save architecture: section components auto-save individually via `fetch()` to `/api/brand-brain/[sectionId]`, while the top-level form also attempts a Server Action save via `updateBrandBrainAction`. This split architecture, combined with several implementation gaps, produces a set of concrete defects that cause data loss, silent failures, broken persistence, and a UI that misleads users into thinking their data is saved when it is not. The refactor must fix every defect below while also rebuilding the page into a professional, enterprise-grade settings experience — without removing or renaming any existing input fields.

---

## Bug Analysis

### Current Behavior (Defect)

**Save Architecture Conflicts**

1.1 WHEN a user edits a field inside a section component and the section auto-save fires, THEN the system saves only the fields sent in that single FormData payload, leaving all other fields of the same section blank in the database — because each section only includes its own fields, and the API route's `updateData` loop writes `null` for any field not present in the payload when the `|| null` fallback is applied.

1.2 WHEN a user clicks the top-level "Save changes" button after having made edits via section auto-saves, THEN the system sends a full-page FormData that does NOT include tag-based fields (`coreValues`, `voiceAdjectives`, `primaryKeywords`, `secondaryKeywords`) or repeating-row fields (`productList`, `competitorList`, `faqList`) because those components manage state in local React state and never write hidden inputs back into the parent `<form>`, causing those fields to be overwritten with empty strings.

1.3 WHEN the top-level form collects `<input name="accentColour">` from the AppearanceSection, THEN the system receives an empty string because `AppearanceSection` manages selection in local React state (`useState`) and only updates a hidden DOM element imperatively via `document.getElementById("accentColour")`, which has no effect on the controlled form submission since the `<input name="accentColour">` rendered inside the `<form>` is a completely separate element.

1.4 WHEN the `useSectionAutoSave` hook fires a `fetch()` to `/api/brand-brain/[sectionId]`, THEN the system rejects the request with HTTP 403 because the CSRF guard in `validateCsrf` checks that `origin.host === host`, but the `fetch()` call does not set any special headers, so the browser sends the page origin — which does match in same-origin requests — but fails entirely when the request is made from a non-standard port, a proxy environment, or when the `host` header is absent, resulting in silent data loss with no user-visible error message in production.

1.5 WHEN a section auto-save call fails for any reason, THEN the system shows an `error` save state that auto-resets to `idle` after 2 seconds with no retry mechanism, no user action required, and no indication of which fields were not saved, causing the user to believe their data is safe while it was never persisted.

**Field Persistence & Data Loss**

1.6 WHEN a user saves tag-input fields (`coreValues`, `voiceAdjectives`, `primaryKeywords`, `secondaryKeywords`) via section auto-save and then refreshes the page, THEN the system correctly loads the JSON array string from the database BUT the `useEffect` sync in each section component triggers a `JSON.parse` and calls `setLocalState` only when the prop value changes — and since the prop is a string and React compares by reference after each `router.refresh()`, this works correctly on first load but silently breaks when the prop value is an empty string `""` on a brand with no previously saved data, because `JSON.parse("")` throws and the catch block returns `[]`, which is correct — however the `useEffect` dependency is the raw prop string, meaning if the server returns `null` which is coerced to `""` at the page level, the initial `useState` and the `useEffect` will both produce `[]` correctly, but if any intermediate save corrupts the JSON (e.g. `[object Object]` from a stringify bug), the tags will silently disappear on refresh.

1.7 WHEN a user edits a repeating-row field (e.g. `productList`, `competitorList`, `faqList`) via the section component and that section auto-save fires, THEN the `brandBrain` API route writes the update correctly — but when the top-level "Save changes" button is subsequently clicked, the Server Action `updateBrandBrainAction` reads `formData.get("productList")` which returns `null` because the `<RepeatingRow>` component never renders a hidden `<input>` inside the `<form>`, so the Server Action overwrites the database field with an empty string `""`.

1.8 WHEN the `BrandIdentitySection` brand-name auto-save fires via `fetch()` to `/api/brand-brain/brand-identity`, THEN the API route updates `brandBrain` fields only (not the parent `Brand.name`), because the `sectionFieldMap` for `brand-identity` maps `brandName → name` but the update is applied only to `prisma.brandBrain.upsert`, not `prisma.brand.update`, meaning the brand name displayed in the sidebar and page header never actually updates despite showing "saved".

1.9 WHEN a user enters a value in the `foundedYear` field (a `<input type="number">`) and the section auto-save fires, THEN the API route receives the value as a string, calls `parseInt`, and stores it correctly — but when the top-level Server Action runs, it also calls `parseInt` on the string from `formData.get("foundedYear")`, and if the user has navigated away and back (triggering a page reload), the `<input defaultValue={foundedYear}>` receives an empty string `""` because `brain.foundedYear` is passed as `String(brain.foundedYear)` which returns `"null"` when `brain.foundedYear` is `null`, causing the year field to display the string `"null"` to the user.

**Missing Fields Not Mapped to Save**

1.10 WHEN the settings page collects brand information, THEN the system has no input fields for the following fields that are required per the M2 spec and referenced in the `settings-form.tsx` `COMPLETENESS_FIELDS` array but are absent from the schema mappings and UI: `customerPersonas`, `demographics`, `painPoints`, `goals`, `interests` (Target Audience section), `personality`, `communicationGuidelines`, `vocabulary` (Voice & Tone section), `features`, `benefits`, `valueProposition` (Products & Services section), `marketingGoals`, `channels`, `campaignPreferences`, `kpis`, `budget` (Marketing Strategy), `targetLocations`, `searchIntent`, `rankingGoals` (SEO), `platforms`, `brandHandles`, `postingFrequency`, `engagementStyle` (Social Media), `policies`, `restrictions`, `brandGuidelines`, `requiredDisclaimers` (Legal & Compliance), `brandKnowledge`, `additionalInstructions`, `aiBehavior`, `thingsAiMustAvoid` (AI Context) — none of these fields exist in the Prisma schema, resulting in undefined behavior if they are added to the UI without a schema migration.

1.11 WHEN the top-level Server Action `updateBrandBrainAction` runs, THEN the system sends a single `prisma.brand.update` with a nested `brandBrain.upsert`, but if the `brandBrain` upsert fails (e.g. a unique constraint or network issue), the entire transaction rolls back — however the brand `name` and `logo` update are part of the same `prisma.brand.update` call and not protected by an explicit `$transaction`, meaning partial state is possible if the outer update succeeds but the nested upsert fails.

**UI State & User Feedback Defects**

1.12 WHEN a section auto-save fires and the optimistic "saved" indicator appears after 200ms, THEN the system shows a green "saved" state even if the actual `fetch()` is still in-flight or has not yet received a response, giving the user false confidence that their data is persisted when it may not be.

1.13 WHEN the top-level "Save changes" button is clicked, THEN the system shows a loading state correctly via `isPending` from `useTransition`, but the success message rendered as `{state?.message && !state.errors && <div>✓ Saved</div>}` is never cleared after the next interaction — it persists indefinitely until another form action runs, so the user sees a stale "saved" message even after making new unsaved changes.

1.14 WHEN the user makes changes to fields and has not yet saved them, THEN the system shows no unsaved-changes indicator and no sticky save bar, meaning the user can navigate away and lose all unsaved data with no warning.

1.15 WHEN a Zod validation error is returned from `updateBrandBrainAction`, THEN the system returns `{ errors: parsed.error.flatten().fieldErrors }` and the `settings-form.tsx` checks `state?.message && !state.errors` to show success — but there is no code that renders the field-level errors from `state.errors` in the UI, so validation failures are silently swallowed with no visible error message shown to the user.

1.16 WHEN the page first loads, THEN the system renders all section components immediately with no loading skeleton, causing a layout shift as content populates — and if the Prisma query is slow (e.g. cold start), the user sees a blank or partially rendered form with no indication that data is loading.

**Architecture & Rules Violations**

1.17 WHEN section components call `useSectionAutoSave` which internally calls `fetch()` directly to an internal Next.js API route, THEN the system violates the project rule "Never write a raw `fetch()` call to an internal Next.js API route — use Server Actions or direct db calls", meaning this entire auto-save layer is architecturally incorrect and must be replaced with Server Actions.

1.18 WHEN `settings-form.tsx` uses `useEffect` to listen for `brain-field-change` custom DOM events and sync `liveValues` state, THEN the system introduces an implicit coupling between the section components and the form via `window.dispatchEvent`, which is an anti-pattern that breaks encapsulation, is impossible to type-safely, and is unnecessary given that a proper form state management approach would eliminate the need for it entirely.

1.19 WHEN section components use `useEffect` to sync their local state from incoming props (e.g. `useEffect(() => { setLocalValues(...) }, [coreValues])`), THEN the system partially violates the "never use `useEffect` + `useState` to fetch server data" rule — the sync is not fetching, but it does create a pattern where stale closure values and prop-state divergence can cause inputs to reset to server values mid-edit if the parent component re-renders.

1.20 WHEN `CompetitorsSection` and `ProductsServicesSection` parse incoming `competitorList`/`productList` JSON strings in `useState` initializers, THEN the system uses `any` casts (`p: any`, `c: any`) inside the parse functions, violating the strict TypeScript no-`any` rule.

1.21 WHEN the `BrandBrain` API route at `/api/brand-brain/[sectionId]` handles the section update, THEN the system uses `console.warn` for auto-save failures (inside `use-section-auto-save.ts`) — while `console.log` is forbidden, `console.warn` in the client-side hook is not production-appropriate error handling.

---

### Expected Behavior (Correct)

**Save Architecture**

2.1 WHEN a user edits any field and triggers a save, THEN the system SHALL use Server Actions (not raw `fetch()`) for all data mutation, with one Server Action per section that accepts only that section's fields, validates with Zod, and writes atomically to the database without overwriting unrelated fields.

2.2 WHEN the top-level "Save all" action is triggered, THEN the system SHALL collect all field values — including tag-based and repeating-row fields — through a unified form state that syncs hidden inputs or uses React controlled components, ensuring every field value is included in the FormData before submission.

2.3 WHEN a section's Server Action save runs, THEN the system SHALL use `prisma.brandBrain.upsert` scoped only to the fields of that section, never setting unrelated fields to null or empty.

2.4 WHEN the brand name is saved from the Brand Identity section, THEN the system SHALL update both `Brand.name` and `BrandBrain.tagline`/identity fields in a single `prisma.$transaction`, ensuring the brand name in the sidebar and the brain data are always consistent.

2.5 WHEN `foundedYear` is read from the database and passed to the form, THEN the system SHALL pass it as `brain.foundedYear ? String(brain.foundedYear) : ""` (not `String(brain.foundedYear)` which produces `"null"`), and the input SHALL display an empty field — not the string `"null"` — when no year is stored.

**Field Coverage**

2.6 WHEN the settings page is rendered, THEN the system SHALL include UI inputs and corresponding database fields for all sections defined in the user's request: Brand Identity, Company Information, Target Audience, Brand Voice & Tone, Products & Services, Competitors, Marketing Strategy, SEO, Social Media, Legal & Compliance, and AI Context — with a Prisma schema migration adding any fields not currently present.

2.7 WHEN new schema fields are added for missing sections (Marketing Strategy, Social Media, Legal & Compliance, AI Context, Company Information), THEN the system SHALL create and apply a Prisma migration, update the `BrandBrain` model, update `brandBrainSchema` in `validations.ts`, update `updateBrandBrainAction` to include the new fields, and update `computeBrandBrainCompleteness` and `SECTION_DEFINITIONS` in `brand-utils.ts` to include the new fields in the completeness score.

**User Feedback & State**

2.8 WHEN a save operation is triggered, THEN the system SHALL show a save state that transitions: idle → saving (immediately) → saved (only after the Server Action returns successfully) → idle (after 3 seconds), never showing "saved" before confirmation from the server.

2.9 WHEN the user makes any change to a field, THEN the system SHALL display an "Unsaved changes" indicator and a sticky save bar at the bottom of the viewport, and the indicator SHALL disappear only after a successful save confirmation.

2.10 WHEN the user attempts to navigate away with unsaved changes, THEN the system SHALL warn the user using a browser `beforeunload` event or a Next.js navigation guard.

2.11 WHEN a Zod validation error occurs, THEN the system SHALL render the field-level error messages inline below the corresponding inputs, scroll to the first error, and highlight the invalid field with a red border and error label.

2.12 WHEN a save operation fails at the server, THEN the system SHALL display a visible error toast or inline error message describing the failure, and SHALL NOT silently reset the error state after a timeout without the user acknowledging the failure.

2.13 WHEN the page first loads, THEN the system SHALL render loading skeletons for each section card while data is being fetched from the server, eliminating layout shift.

**Architecture Compliance**

2.14 WHEN section components need to save data, THEN the system SHALL use Server Actions with `useActionState` per the project rules, eliminating all raw `fetch()` calls to internal API routes.

2.15 WHEN fields like `coreValues`, `voiceAdjectives`, `primaryKeywords`, `secondaryKeywords`, `productList`, `competitorList`, and `faqList` are managed via `TagInput` or `RepeatingRow` components, THEN the system SHALL write the serialized JSON value into a hidden `<input>` inside the form so it is included in the `FormData` on every save — eliminating the reliance on `window.dispatchEvent` for state propagation.

2.16 WHEN section components are typed, THEN the system SHALL use explicit types instead of `any` for all parsed JSON structures (e.g. `{ name: string; oneLiner: string }[]` instead of `any[]`).

2.17 WHEN the settings page renders section components, THEN the system SHALL use a reusable component architecture: `SettingsSection`, `SettingsCard`, `FormField`, `TextInput`, `TextArea`, `Select`, `MultiSelect`, `Toggle`, `FileUploader`, `SaveBar`, `ValidationProvider` — with all components using named exports and accepting props only.

**UI/UX Requirements**

2.18 WHEN the settings page is displayed, THEN the system SHALL render sections as cards in a responsive grid layout (single column on mobile, two-column on tablet+), with consistent spacing, labels, placeholders, required indicators, and character counters on relevant fields.

2.19 WHEN long textarea inputs are present, THEN the system SHALL use auto-resizing textareas that grow with content and never require manual scrolling within the input.

2.20 WHEN save operations complete successfully, THEN the system SHALL display a success toast notification that auto-dismisses after 3 seconds.

2.21 WHEN the page is rendered on mobile, THEN the system SHALL be fully functional with correct touch targets, readable labels, and no horizontal overflow.

2.22 WHEN interactive elements are rendered, THEN the system SHALL support full keyboard navigation, have proper ARIA labels, visible focus states, and be compatible with screen readers.

---

### Unchanged Behavior (Regression Prevention)

3.1 WHEN a user saves the `brandStory`, `freeformNotes`, or `contentExamples` fields, THEN the system SHALL CONTINUE TO persist and load these values correctly from the `additional-context` section without change.

3.2 WHEN the `computeBrandBrainCompleteness` function is called, THEN the system SHALL CONTINUE TO return a 0–100 integer score based on the M2 field definitions, and the score SHALL increase when new fields are filled and decrease when they are cleared.

3.3 WHEN the `serializeBrandForPrompt` function is called with a `BrandBrain` record, THEN the system SHALL CONTINUE TO produce a string prompt context that AI employees can consume, including all previously populated fields.

3.4 WHEN the brand slug is used as a URL parameter at `/dashboard/brands/[slug]/settings`, THEN the system SHALL CONTINUE TO load the correct brand's data for the authenticated user and return `notFound()` for brands that do not belong to that user.

3.5 WHEN the Auth.js session is absent or expired, THEN the system SHALL CONTINUE TO redirect the user to `/auth/signin` from both the page Server Component and any Server Action called from that page.

3.6 WHEN the `UploadThing` logo uploader completes successfully, THEN the system SHALL CONTINUE TO store the returned URL and include it in the next save operation so the logo persists after page refresh.

3.7 WHEN the accent colour is changed and saved, THEN the system SHALL CONTINUE TO update `Brand.accentColour` in the database and the colour SHALL be reflected in the sidebar and dashboard layout on the next page load via the CSS variable `var(--brand-accent)`.

3.8 WHEN the `revalidatePath` calls in the Server Action fire after a successful save, THEN the system SHALL CONTINUE TO revalidate `/dashboard/brands/${slug}/settings` and `/dashboard` layout so that the sidebar brand name and completeness score reflect the latest saved data.

3.9 WHEN any existing M2 field (`tagline`, `websiteUrl`, `industry`, `foundedYear`, `missionStatement`, `coreValues`, `brandPromise`, `voiceAdjectives`, `toneDescription`, `writingStyleNotes`, `thingsToAvoid`, `primaryAudience`, `audienceDemographics`, `audiencePainPoints`, `audienceVocabulary`, `productList`, `pricingTier`, `keyDifferentiators`, `competitorList`, `competitiveAdvantages`, `thingsNeverDo`, `primaryKeywords`, `secondaryKeywords`, `topicsToOwn`, `topicsToAvoid`, `faqList`, `freeformNotes`, `contentExamples`, `brandStory`) is saved, THEN the system SHALL CONTINUE TO persist that field and load it correctly on page refresh without data loss.

3.10 WHEN legacy M1 fields (`mission`, `vision`, `values`, `targetAudience`, `customerPersonas`, `products`, `services`, `toneOfVoice`, `brandColors`, `typography`, `competitors`, `seoKeywords`, `goals`, `preferredPlatforms`, `writingStyle`, `marketingStrategy`, `offers`, `businessInfo`, `locations`, `faqs`, `brandRules`) exist in the database for a brand, THEN the system SHALL CONTINUE TO preserve those values and not overwrite them with empty strings when an M2 save runs.

3.11 WHEN the `/api/brand-brain/[sectionId]` route exists and is called, THEN the system SHALL CONTINUE TO authenticate the user via Auth.js and return 401 for unauthenticated requests.

3.12 WHEN `prisma.brand.findFirst` is called with `{ where: { slug, userId } }`, THEN the system SHALL CONTINUE TO enforce per-user brand isolation so that one user cannot read or modify another user's brand data.
