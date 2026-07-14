# Implementation Plan

## Overview

This plan fixes the Brand Brain Settings page by following the exploratory bugfix workflow:
1. **Explore** — write property-based tests against unfixed code to confirm each bug exists
2. **Preserve** — write property-based tests against unfixed code to capture correct baseline behavior
3. **Implement** — apply each fix in isolation, verifying exploration tests pass and preservation tests remain green
4. **Checkpoint** — confirm the full suite passes with no regressions

The bugs addressed are: dual-save data loss (B1), tag/row fields missing from FormData (B2), accent colour controlled-input disconnect (B3), brand name not updating `Brand.name` (B4), `foundedYear` serialising to the string `"null"` (B5), optimistic "saved" before server confirms (B6), stale saved message never clearing (B7), no unsaved-changes indicator (B8), inline validation errors silently swallowed (B9), raw `fetch()` to internal API routes (B10), `window.dispatchEvent` coupling (B11), and TypeScript `any` casts (B12).

## Task Dependency Graph

```json
{
  "waves": [
    { "wave": 1, "tasks": ["1", "2"] },
    { "wave": 2, "tasks": ["3", "4", "5", "6"] },
    { "wave": 3, "tasks": ["7"] },
    { "wave": 4, "tasks": ["8", "9"] },
    { "wave": 5, "tasks": ["10"] },
    { "wave": 6, "tasks": ["11"] }
  ]
}
```

Wave 1 (tasks 1–2) must complete first — exploration and preservation tests must exist before any fix verification sub-tasks can run. Wave 2 fixes (3–6) are independent of each other and can run in parallel. Wave 3 (task 7) eliminates the dual-save architecture and must precede wave 4 because `useBrandBrainForm` is required by both the atomic transaction wiring (task 8) and the `SaveBar` mount (task 9). Wave 5 (integration) and wave 6 (checkpoint) follow all fixes.

## Tasks

- [x] 1. Write bug condition exploration tests (BEFORE implementing any fix)
  - **Property 1: Bug Condition** - Dual-Save Data Loss, Missing FormData Fields, and Optimistic State
  - **CRITICAL**: These tests MUST FAIL on unfixed code — failure confirms the bugs exist
  - **DO NOT attempt to fix the tests or the code when they fail**
  - **GOAL**: Surface counterexamples that demonstrate each bug exists
  - **Scoped PBT Approach**: Scope each property to the concrete failing case(s) to ensure reproducibility

  - **B1 — Dual-save data overwrites unrelated fields**
    - Simulate a section auto-save FormData that includes only brand-identity fields
    - Assert that after the save, unrelated fields (e.g. `competitorList`, `faqList`) remain unchanged in the database
    - Run on UNFIXED code — expect FAILURE (the `|| null` fallback in `updateData` will set unrelated fields to null)
    - Document counterexample: saving brand-identity section zeroes out `competitorList`

  - **B2 — Tag and repeating-row fields missing from top-level FormData**
    - Render `SettingsForm` with non-empty `coreValues`, `productList`, and `competitorList`
    - Capture `new FormData(formRef.current)` without submitting
    - Assert `formData.get("coreValues") !== null` and parses to a non-empty JSON array
    - Assert `formData.get("productList") !== null` and parses to a non-empty JSON array
    - Run on UNFIXED code — expect FAILURE (TagInput/RepeatingRow do not write hidden inputs)
    - Document counterexample: `formData.get("coreValues")` returns `null`

  - **B3 — Accent colour controlled input disconnect**
    - Render `AppearanceSection` with `accentColour="#5b21b6"`, call `handleSelect("#ff0000")`
    - Capture `new FormData(formRef.current).get("accentColour")`
    - Assert value equals `"#ff0000"`
    - Run on UNFIXED code — expect FAILURE (imperative DOM mutation does not update the controlled input)
    - Document counterexample: `formData.get("accentColour")` returns `""` or the original value

  - **B5 — foundedYear renders as the string "null"**
    - Call the page serialisation logic with `brain.foundedYear = null`
    - Assert the resulting string passed as `defaultValue` to the input is `""`, not `"null"`
    - Run on UNFIXED code — expect FAILURE (`String(null)` produces `"null"`)
    - Document counterexample: input displays the literal string `"null"`

  - **B6 — Optimistic "saved" shown before server confirms**
    - Mount `useSectionAutoSave` (or equivalent save hook) with a mock fetch that never resolves
    - Assert `saveState` is NOT `"saved"` at 201 ms (before server response)
    - Run on UNFIXED code — expect FAILURE (optimistic timer fires at 200 ms unconditionally)
    - Document counterexample: `saveState === "saved"` at 201 ms with fetch still in-flight

  - Mark task complete when all exploration tests are written, run, and failures are documented
  - _Requirements: 1.1, 1.2, 1.3, 1.5, 1.9, 1.12_

- [x] 2. Write preservation property tests (BEFORE implementing any fix)
  - **Property 2: Preservation** - Existing Correct Behaviors Must Survive the Refactor
  - **IMPORTANT**: Follow observation-first methodology — run UNFIXED code, observe output, encode it
  - **GOAL**: Establish a green baseline that must remain green after every implementation step

  - **P1 — Existing M2 field round-trip (text fields)**
    - For all plain text fields (`tagline`, `websiteUrl`, `industry`, `missionStatement`, `brandPromise`, `toneDescription`, `writingStyleNotes`, `thingsToAvoid`, `primaryAudience`, `audienceDemographics`, `audiencePainPoints`, `audienceVocabulary`, `pricingTier`, `keyDifferentiators`, `competitiveAdvantages`, `thingsNeverDo`, `topicsToOwn`, `topicsToAvoid`, `freeformNotes`, `contentExamples`, `brandStory`)
    - Observe: saving a value via the current top-level action persists it and it loads correctly on refresh
    - Write property: for all non-empty string inputs to these fields, `save → reload → read` produces the original value
    - Verify test PASSES on UNFIXED code

  - **P2 — Per-user brand isolation**
    - Observe: `prisma.brand.findFirst({ where: { slug, userId } })` returns only the current user's brand
    - Write property: for any two distinct user IDs and same brand slug, each user reads only their own brand
    - Verify test PASSES on UNFIXED code

  - **P3 — Auth redirect**
    - Observe: unauthenticated requests to the settings page redirect to `/auth/signin`
    - Write property: absence of a valid session always produces a redirect, never a 200 with form data
    - Verify test PASSES on UNFIXED code

  - **P4 — revalidatePath fires after successful save**
    - Observe: after `updateBrandBrainAction` succeeds, `revalidatePath` is called for both the settings path and the dashboard layout
    - Write property: a successful save action always invokes both revalidation calls
    - Verify test PASSES on UNFIXED code

  - **P5 — computeBrandBrainCompleteness score monotonicity**
    - Observe: filling any M2 field increases or maintains the completeness score; clearing it decreases or maintains it
    - Write property: score with more fields filled ≥ score with fewer fields filled (for the same field set)
    - Verify test PASSES on UNFIXED code

  - **P6 — Legacy M1 fields not overwritten**
    - Observe: a brand with legacy M1 fields (`mission`, `vision`, `targetAudience`, etc.) retains those values after an M2 save
    - Write property: `updateBrandBrainAction` with M2-only FormData does not null out legacy M1 fields
    - Verify test PASSES on UNFIXED code

  - Mark task complete when all preservation tests are written, run, and passing on UNFIXED code
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.8, 3.9, 3.10_

- [x] 3. Fix B5 — foundedYear serialises to the string "null"

  - [x] 3.1 Fix foundedYear null serialisation in `page.tsx`
    - Replace `String(brain.foundedYear)` with `brain.foundedYear != null ? String(brain.foundedYear) : ""`
    - The `!= null` guard catches both `null` and `undefined`
    - _Bug_Condition: `brain.foundedYear` is `null`, causing `String(null)` → `"null"` passed as `defaultValue`_
    - _Expected_Behavior: `defaultValue` is `""` when no year is stored; input renders empty_
    - _Preservation: All other page.tsx data-passing paths remain unchanged_
    - _Requirements: 1.9, 2.5_

  - [x] 3.2 Guard against the string `"null"` in `updateBrandBrainAction`
    - Replace bare `parseInt(formData.get("foundedYear"))` with the guarded version:
      ```typescript
      const yearStr = formData.get("foundedYear") as string | null;
      const foundedYear =
        yearStr && yearStr !== "" && yearStr !== "null"
          ? (parseInt(yearStr, 10) || null)
          : null;
      ```
    - _Bug_Condition: isBugCondition(input) where `yearStr === "null"` (submitted by stale client)_
    - _Expected_Behavior: `foundedYear` stored as `null`, not `NaN` or a corrupted integer_
    - _Requirements: 1.9, 2.5_

  - [x] 3.3 Verify Property 1 (B5 exploration test) now passes
    - **Property 1: Expected Behavior** - foundedYear Never Renders as "null"
    - **IMPORTANT**: Re-run the SAME test from task 1 — do NOT write a new test
    - **EXPECTED OUTCOME**: Test PASSES (confirms B5 is fixed)
    - _Requirements: 2.5_

  - [x] 3.4 Verify Property 2 preservation tests still pass
    - **Property 2: Preservation** - Existing Fields Unaffected
    - Run all preservation tests from task 2
    - **EXPECTED OUTCOME**: All PASS (no regressions from this targeted fix)

- [x] 4. Fix B3 — Accent colour never reaches FormData

  - [x] 4.1 Replace imperative DOM mutation in `AppearanceSection` with a controlled hidden input
    - Remove `document.getElementById("accentColour").value = color`
    - Add `<input type="hidden" name="accentColour" value={selected} />` inside the section JSX
    - The colour picker and swatch continue calling `setSelected(color)`; React updates the hidden input automatically
    - Remove the separate `<input name="accentColour">` in `SettingsForm` that was never controlled
    - _Bug_Condition: isBugCondition(input) where `selected !== initialAccentColour` but the DOM mutation targets a different element_
    - _Expected_Behavior: `formData.get("accentColour") === selected` at submit time_
    - _Preservation: `Brand.accentColour` → `var(--brand-accent)` wiring in dashboard layout is not touched_
    - _Requirements: 1.3, 2.3, 3.7_

  - [x] 4.2 Verify Property 1 (B3 exploration test) now passes
    - **Property 1: Expected Behavior** - Accent Colour Round-Trip
    - Re-run the same test from task 1
    - **EXPECTED OUTCOME**: Test PASSES
    - _Requirements: 3.7_

  - [x] 4.3 Verify Property 2 preservation tests still pass
    - **Property 2: Preservation** - Existing Fields Unaffected
    - **EXPECTED OUTCOME**: All PASS

- [x] 5. Fix B2 — Tag and repeating-row fields missing from FormData

  - [x] 5.1 Add controlled hidden input for `coreValues` in `MissionValuesSection`
  - [x] 5.2 Add controlled hidden input for `voiceAdjectives` in `VoiceToneSection`
  - [x] 5.3 Add controlled hidden inputs for `primaryKeywords` and `secondaryKeywords` in `SeoKeywordsSection`
  - [x] 5.4 Add controlled hidden input for `productList` in `ProductsServicesSection`
  - [x] 5.5 Add controlled hidden input for `competitorList` in `CompetitorsSection`
  - [x] 5.6 Add controlled hidden input for `faqList` in `FaqsSection`
  - [x] 5.7 Verify Property 1 (B2 exploration test) now passes
  - [x] 5.8 Verify Property 2 preservation tests still pass

- [x] 6. Fix B12 — TypeScript `any` casts in parse functions

  - [x] 6.1 Replace `any` casts in `CompetitorsSection`
  - [x] 6.2 Replace `any` casts in `ProductsServicesSection`
  - [x] 6.3 Replace `any` casts in `FaqsSection`
  - [x] 6.4 Run TypeScript compiler check

- [x] 7. Eliminate dual-save architecture — delete `useSectionAutoSave` and `window.dispatchEvent`

  - [x] 7.1 Create `use-brand-brain-form.ts` hook
    - Implement `useBrandBrainForm` with: `values: BrainFieldMap`, `isDirty: boolean`, `saveState: SaveState`, `fieldErrors`, `onFieldChange`, `handleActionResult`, `markSaving`
    - `isDirty` computed by comparing `values` to `initialValues` snapshot
    - `initialValues` snapshot updated only on successful `handleActionResult` — never mid-edit
    - `saveState` transitions: `idle → saving` (via `markSaving`) → `saved` (via `handleActionResult` success) → `idle` after 3 s
    - `saveState` transitions: `saving → error` (via `handleActionResult` with errors)
    - No timer path from `saving` to `saved` — `"saved"` is only reachable after action resolves
    - _Bug_Condition: isBugCondition(state) where `saveState === "saved"` before the action promise resolves_
    - _Expected_Behavior: `saveState === "saving"` while action is in-flight; `"saved"` only after `handleActionResult` receives `result.message`_
    - _Preservation: `isDirty` returns to `false` only on confirmed success, not on error_
    - _Requirements: 1.5, 1.12, 1.13, 2.8, 2.9_

  - [x] 7.2 Remove `useSectionAutoSave` from all 10 section files
  - [x] 7.3 Remove `window.dispatchEvent` / `window.addEventListener` coupling
  - [x] 7.4 Add `onFieldChange` and `errors` props to every section component
  - [x] 7.5 Update `SettingsForm` to use `useBrandBrainForm`
  - [x] 7.6 Verify Property 1 (B1 and B6 exploration tests) now pass
  - [x] 7.7 Verify Property 2 preservation tests still pass

- [x] 8. Fix B4 — Brand name only updates `BrandBrain`, not `Brand.name`

  - [x] 8.1 Wrap `Brand.update` and `BrandBrain.upsert` in `prisma.$transaction` in `updateBrandBrainAction`
    - Replace the nested `prisma.brand.update` + `brandBrain: { upsert: ... }` with:
      ```typescript
      await prisma.$transaction([
        prisma.brand.update({ where: { id: brand.id }, data: { name, logo, accentColour } }),
        prisma.brandBrain.upsert({ where: { brandId: brand.id }, update: brainUpdateData, create: { brandId: brand.id, ...brainUpdateData } }),
      ]);
      ```
    - Guard `name` update: `name: brandName ? brandName : undefined` (empty string does not overwrite)
    - _Bug_Condition: isBugCondition(input) where `brandName` is updated but `BrandBrain.upsert` subsequently fails_
    - _Expected_Behavior: Both operations succeed or both roll back — no partial state_
    - _Preservation: `revalidatePath` calls remain after the transaction, unchanged_
    - _Requirements: 1.8, 1.11, 2.4_

  - [x] 8.2 Verify Property 1 (B4 exploration test: atomicity) now passes
    - **Property 1: Expected Behavior** - Atomic Brand Name and Brain Update
    - Re-run the same test from task 1
    - **EXPECTED OUTCOME**: Test PASSES
    - _Requirements: 2.4_

  - [x] 8.3 Verify Property 2 preservation tests still pass
    - **Property 2: Preservation** - Existing Fields Unaffected
    - **EXPECTED OUTCOME**: All PASS

- [x] 9. Add `SaveBar`, `FieldError`, and `useBeforeUnload` — fix B7, B8, B9

  - [x] 9.1 Create `components/ui/field-error.tsx`
    - Export `FieldError({ messages }: { messages?: string[] }): React.ReactElement | null`
    - Renders `<ul role="alert" aria-live="polite">` with one `<li>` per message in `var(--color-danger)` text
    - Returns `null` when `messages` is undefined or empty
    - Named export only — no default export
    - _Requirements: 1.15, 2.11_

  - [x] 9.2 Wire `FieldError` into all section fields that have Zod counterparts
    - Pass `errors` prop (from `useActionState` via `useBrandBrainForm`) down to each section
    - Render `<FieldError messages={errors?.fieldName} />` below each mapped input
    - Add conditional `border-[var(--color-danger)]` class to invalid inputs using `cn()`
    - _Requirements: 1.15, 2.11_

  - [x] 9.3 Add scroll-to-first-error in `SettingsForm`
    - Add a `useEffect` that runs when `actionState?.errors` changes:
      ```typescript
      useEffect(() => {
        if (actionState?.errors) {
          const firstError = document.querySelector("[data-field-error]");
          firstError?.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, [actionState?.errors]);
      ```
    - _Requirements: 2.11_

  - [x] 9.4 Create `use-before-unload.ts` hook
    - Export `useBeforeUnload(isDirty: boolean): void`
    - Attaches `beforeunload` handler when `isDirty` is true, removes it when false
    - Handler calls `e.preventDefault()` and sets `e.returnValue = ""`
    - Use in `SettingsForm`: `useBeforeUnload(isDirty)`
    - _Bug_Condition: isBugCondition(state) where `isDirty === true` and the user navigates away_
    - _Expected_Behavior: Browser shows native "Leave site?" dialog_
    - _Requirements: 1.14, 2.10_

  - [x] 9.5 Create `components/ui/save-bar.tsx`
    - Export `SaveBar({ isDirty, saveState, isPending }: SaveBarProps): React.ReactElement | null`
    - Returns `null` when `!isDirty && saveState === "idle"`
    - Renders sticky bar at bottom of viewport
    - "Save now" button is `type="submit"` inside the `<form>` — no `onClick` needed
    - Shows save state labels: saving spinner, "Saved ✓", "Error — please retry"
    - Named export only
    - _Bug_Condition: isBugCondition(state) where `state?.message` persists after new edits, showing stale "✓ Saved"_
    - _Expected_Behavior: `SaveBar` re-appears on next dirty edit; stale saved message not visible outside `SaveBar`_
    - _Requirements: 1.13, 1.14, 2.8, 2.9_

  - [x] 9.6 Mount `SaveBar` inside `SettingsForm` and remove the old static save button
    - Replace the static bottom `<Button type="submit">Save changes</Button>` with `<SaveBar isDirty={isDirty} saveState={saveState} isPending={isPending} />`
    - _Requirements: 2.8, 2.9_

  - [x] 9.7 Verify Property 1 (B7, B8, B9 exploration tests) now pass
    - **Property 1: Expected Behavior** - Dirty Indicator, Validation Errors, No Stale Message
    - Re-run the same tests from task 1
    - **EXPECTED OUTCOME**: All PASS
    - _Requirements: 2.8, 2.9, 2.10, 2.11_

  - [x] 9.8 Verify Property 2 preservation tests still pass
    - **Property 2: Preservation** - Existing Correct Behaviors
    - **EXPECTED OUTCOME**: All PASS

- [ ] 10. End-to-end integration verification

  - [~] 10.1 Run full TypeScript compilation check
    - Run `npx tsc --noEmit` across the entire project
    - **EXPECTED OUTCOME**: Zero errors, zero `any`-type violations in modified files
    - _Requirements: 2.16_

  - [~] 10.2 Verify complete save round-trip manually
    - Load `/dashboard/brands/[slug]/settings`
    - Edit fields in 3 different sections including tag fields and a repeating row
    - Confirm `SaveBar` appears (dirty indicator)
    - Click "Save now"
    - Confirm `SaveBar` shows "Saving..." then "Saved ✓" then disappears after 3 s
    - Refresh the page
    - Confirm all edited values are present — no field is blank or shows `"null"`
    - _Requirements: 2.1, 2.2, 2.3, 2.8, 2.9_

  - [~] 10.3 Verify accent colour and brand name persistence
    - Change accent colour and brand name, save, refresh
    - Confirm brand name in sidebar reflects the new value
    - Confirm `var(--brand-accent)` reflects the new colour
    - _Requirements: 2.4, 3.7_

  - [~] 10.4 Verify no cross-section data loss
    - Save brand-identity section fields only (using SaveBar)
    - Reload and verify `competitorList`, `faqList`, `coreValues` are all intact
    - _Requirements: 1.1, 2.3, 3.9_

  - [~] 10.5 Verify legacy M1 fields not overwritten
    - Confirm a brand with legacy M1 fields retains those values after an M2 settings save
    - _Requirements: 3.10_

- [~] 11. Checkpoint — Ensure all tests pass
  - Run the full test suite
  - Confirm all Property 1 (Bug Condition) exploration tests pass (bugs are fixed)
  - Confirm all Property 2 (Preservation) tests still pass (no regressions)
  - Confirm TypeScript reports zero errors
  - Confirm no `fetch()` calls to internal API routes remain in section components or form hooks
  - Confirm no `window.dispatchEvent` / `window.addEventListener("brain-field-change")` references remain
  - Confirm no `any` types in parse functions
  - Ask the user if any questions arise before marking this checkpoint complete

## Notes

- **No new Prisma schema fields** — all M2 fields already exist. Schema additions for Marketing Strategy, Social Media, Legal & Compliance, AI Context, and Target Audience extended fields are out of scope and tracked separately in requirements 2.6–2.7.
- **`/api/brand-brain/[sectionId]` route is preserved** — it is no longer called by the settings form after the refactor, but it must continue to authenticate and respond correctly per requirement 3.11.
- **`useSectionAutoSave`** is the only deleted file. Every other existing file is modified in-place — the goal is the smallest possible diff that eliminates all bugs.
- **Task ordering for fixes (3–9) is flexible** — each fix is independent except where the dependency graph above notes an explicit ordering constraint. Fixes may be applied in parallel branches if desired.
- **`console.warn` in `useSectionAutoSave`** is automatically resolved when the hook is deleted in task 7.2.
- **`useEffect` prop-sync patterns** in `SeoKeywordsSection` are removed as part of task 5.3 (the hidden-input pattern eliminates the need for prop-to-state sync entirely).
- All new components (`SaveBar`, `FieldError`) use named exports only, consistent with project rules. No default exports.
- All new hooks (`use-brand-brain-form.ts`, `use-before-unload.ts`) use `@/` path aliases and are co-located with the settings feature.
