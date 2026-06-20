# Design Spec: AI Employee Chat
**Milestone:** M3
**Priority:** Must Have
**Date:** June 2026
**Status:** Draft — Ready for Engineering Review

---

## Overview

The AI Employee Chat is the primary workspace where users interact with their AI employees. It is a focused, single-purpose interface: one employee, one brand, one conversation at a time. The employee's visual identity (colour + icon) is always visible in the header. The Brand Brain context is subtly indicated but never intrusive. Conversation history lives in a collapsible left panel. The input is generous and supports multi-line prompts. Responses stream token-by-token. Action controls appear only after a response completes, on hover.

The design reference points are Claude.ai (clean, minimal, streaming-first), Linear (speed, confidence, intentional spacing), and Arc Browser (personality through colour). It should not look like Jasper Canvas, a template gallery, or a feature-rich editor.

---

## User Flow

### Entry points
- From AI Employees page: click "Start task" on any employee card → navigates to `/dashboard/ai-employees/[id]/chat?brand=[activeBrandId]`
- From sidebar: future nav item (not in M3 scope)
- Direct URL: `/dashboard/ai-employees/[id]/chat?brand=[brandId]&conversation=[conversationId]`

### Happy path
1. User arrives from AI Employees page or direct URL
2. If no active conversation exists, empty state appears with 3–4 role-specific suggested prompts
3. User clicks a suggested prompt or types their own
4. Message sends, Brand Brain context is injected server-side (invisible)
5. Response streams token-by-token
6. On completion, action row fades in beneath the response
7. User can Copy, Save to Library, Regenerate, or send feedback
8. User continues conversation — context persists across turns
9. If Brand Brain is incomplete, a one-time warning appears after first message

### Error paths
- **AI call fails:** Inline error message appears in the thread: "Something went wrong. Try again." with a retry button. Conversation history stays intact.
- **No active brand:** Redirect to brand selection or show "Select a brand to begin" in the chat area.
- **Employee not found:** 404 state — "This employee doesn't exist or has been removed."
- **Network failure during streaming:** Show "Connection lost. Reconnecting..." with auto-retry. If retry fails, show error state.

### Exit points
- User clicks back/close → returns to AI Employees page
- User switches employee via header → new conversation starts for that employee
- User clicks brand switcher → brand context changes, conversation continues (same employee, different brand)

---

## Layout

### Desktop (1280px+)
```
┌──────────────────────────────────────────────────────────────────┐
│ ┌────────────┐ ┌───────────────────────────────────────────────┐ │
│ │            │ │ ┌─ Header ──────────────────────────────────┐ │ │
│ │  History   │ │ │ [Employee Icon] Name  ·  Role   [Switch] │ │ │
│ │  Panel     │ │ │ [Brand Brain ▸] Working for: Brand Name   │ │ │
│ │            │ │ └──────────────────────────────────────────┘ │ │
│ │  (260px)   │ │                                           │ │
│ │            │ │  ┌─ Message Thread ──────────────────────┐ │ │
│ │  Today     │ │  │                                      │ │ │
│ │  · Prompt 1│ │  │  User message                        │ │ │
│ │  · Prompt 2│ │  │                                      │ │ │
│ │            │ │  │  Assistant response (streamed)        │ │ │
│ │  Yesterday │ │  │  [Copy] [Save] [Regenerate] [👍 👎]  │ │ │
│ │  · Prompt 3│ │  │                                      │ │ │
│ │            │ │  │  User message                        │ │ │
│ │  [Collapse]│ │  │  Assistant response                  │ │ │
│ │            │ │  └──────────────────────────────────────┘ │ │
│ │            │ │                                           │ │
│ │            │ │  ┌─ Input Area ──────────────────────────┐ │ │
│ │            │ │  │ Type your prompt...            [Send] │ │ │
│ │            │ │  └──────────────────────────────────────┘ │ │
│ └────────────┘ └───────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

- **History panel:** 260px wide, fixed left, full height below topbar
- **Content area:** fills remaining width, max-width 860px centered within available space
- **Header:** sticky top of content area, 64px height
- **Message thread:** scrollable, padding 24px horizontal
- **Input area:** sticky bottom, 80px min-height (grows with content up to 200px)

### Tablet (768px–1279px)
- History panel: 240px wide
- Content area: fills remaining width
- Input area: same as desktop
- All other elements unchanged

### Mobile (375px–767px)
- History panel: **hidden by default**, accessible via a history toggle button in the header (shows as overlay/drawer when opened)
- Content area: full width
- Header: simplified — employee icon + name + brand indicator, no extra chrome
- Input area: docks to bottom of screen, 64px min-height
- Message thread: full-width messages, no side padding reduction
- Employee switcher: accessible via a dropdown in the header (not a full panel)

---

## Component Inventory

| Component | Type | Status | Notes |
|---|---|---|---|
| ChatLayout | New | Design | Shell: history panel + content area |
| ChatHeader | New | Design | Employee identity + brand indicator + employee switcher |
| EmployeeSwitcher | New | Design | Dropdown listing all employees with colour dots |
| BrandBrainIndicator | New | Design | Collapsed/expanded state showing brand context |
| ConversationHistory | New | Design | Left panel, grouped by date, collapsible |
| ConversationItem | New | Design | Individual conversation in history list |
| MessageThread | New | Design | Scrollable message list |
| UserMessage | New | Design | Right-aligned, surface-2 background |
| AssistantMessage | New | Design | Left-aligned, no background, streaming cursor |
| MessageActions | New | Design | Copy, Save, Regenerate, Feedback — hover-revealed |
| ChatInput | New | Design | Multi-line textarea + send button |
| EmptyState | New | Design | Suggested prompts, role-specific copy |
| StreamingCursor | New | Design | Blinking cursor at end of streaming text |
| BrandBrainWarning | New | Design | One-time inline banner |
| ErrorBanner | New | Design | Inline error with retry |
| SkeletonMessage | New | Design | Loading placeholder for message positions |

**No existing components are reused directly** — the chat surface is a new pattern. However, it extends the design system tokens (colours, radii, type roles, spacing) and follows the same visual language as existing cards and panels.

---

## Screen States

### Empty State
**Trigger:** User opens an employee with no existing conversation for the active brand.

**Layout:** Centered in the message thread area. No history panel items highlighted.

**Headline:** "[Employee name] is ready to work"
**Body:** "Start a conversation about [Brand Name]. The more context you provide in your Brand Brain, the better the output."
**Primary action:** None — user types or clicks a suggested prompt
**Suggested prompts (4, role-specific):**

| Employee | Suggested Prompts |
|---|---|
| Marketing Director | "What's our marketing strategy for [Brand Name] this quarter?" · "Analyze our competitive positioning" · "Suggest 3 campaign angles for [Brand Name]" · "What marketing channels should we prioritize?" |
| Content Director | "Write three Instagram captions for [Brand Name]'s latest post" · "Draft a blog brief about [Brand Name]" · "Create a content calendar for next week" · "Rewrite this in our brand voice: [paste text]" |
| SEO Director | "What are the top 10 SEO opportunities for [Brand Name]?" · "Audit our current keyword strategy" · "Suggest 5 blog topics that will rank" · "Analyze [competitor]'s SEO approach" |
| Creative Director | "Generate 5 visual concepts for [Brand Name]'s campaign" · "Describe a hero image for our landing page" · "Suggest a colour palette update for [Brand Name]" · "Create a mood board description for [Brand Name]" |

**Visual:** Each suggested prompt is a `mos-panel` card, 8px gap between them, full width up to 640px, centered. On hover: border transitions to `border-hover`, background shifts subtly. Click sends the prompt as a user message.

### Loading State
**Trigger:** Initial page load, fetching conversation history.

**Treatment:** 
- History panel: 3–4 `SkeletonConversationItem` elements (shimmer animation, 1200ms pulse)
- Message thread: 2–3 `SkeletonMessage` elements (user message skeleton + assistant message skeleton)
- Duration expectation: < 300ms (data should be cached or fast)

**Animation:** `animate-skeleton-pulse` class, `rgba(255,255,255,0.04)` base → `rgba(255,255,255,0.08)` peak.

### Streaming State
**Trigger:** User sends a message, AI response is being generated.

**Treatment:**
- User message appears immediately (no streaming)
- Assistant message appears with streaming text — text renders progressively
- A `StreamingCursor` (2px wide, 16px tall, `var(--brand-accent)` colour, blinking at 530ms interval) appears at the end of the streaming text
- No action row visible during streaming
- Message thread auto-scrolls to bottom as text streams (smooth scroll, 50ms debounce)
- If user scrolls up during streaming, auto-scroll pauses — a "Jump to latest" floating button appears

**StreamingCursor animation:**
```css
@keyframes cursor-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
.animate-cursor-blink {
  animation: cursor-blink 530ms ease-in-out infinite;
}
```

### Error State
**Trigger:** AI API call fails, network error, or streaming interruption.

**Headline:** "Something went wrong"
**Body:** "The request couldn't be completed. This might be a temporary issue — try again."
**Primary action:** "Try again" button → retries the last user message
**Placement:** Inline within the message thread, between the last user message and where the assistant response would appear. Full-width `mos-panel` with `border: 1px solid rgba(255,138,138,0.22)`, background `rgba(255,138,138,0.06)`.
**Conversation stays intact** — no data is lost.

### Nominal / Populated State
**Trigger:** Active conversation with multiple messages.

**Layout:**
- History panel shows all conversations for this employee, grouped by date ("Today", "Yesterday", "Previous 7 days", "Older")
- Each conversation item shows: first 40 chars of first user message (truncated), timestamp, brand name
- Active conversation is highlighted: `background: var(--color-surface-2)`, `border-left: 2px solid var(--brand-accent)`
- Message thread shows alternating user/assistant messages
- User messages: right-aligned, `mos-panel` background, max-width 75%
- Assistant messages: left-aligned, no background, max-width 85%, text in `var(--color-text-primary)`
- After each complete assistant message: action row fades in (200ms ease)
- Brand Brain warning appears once per session if incomplete: fixed banner below header, dismissible

### Brand Brain Incomplete Warning
**Trigger:** User sends first message in a session and the active brand's Brand Brain has < 3 fields populated.

**Headline:** "Your Brand Brain for [Brand Name] is incomplete"
**Body:** "The more you fill in, the better your results. Consider adding your brand's voice, audience, and products."
**Primary action:** "Open Brand Brain" → navigates to `/dashboard/brands/[slug]/settings`
**Dismissible:** Yes, with "Dismiss" text link. Appears only once per session (tracked via sessionStorage).
**Placement:** Below the header, full-width, `background: rgba(242,195,107,0.08)`, `border: 1px solid rgba(242,195,107,0.18)`, `border-radius: 8px`, padding 12px 16px.

### Employee Switching Mid-Conversation
**Trigger:** User clicks employee switcher in header while in an active conversation.

**Behaviour:**
- A new conversation is created for the selected employee (same brand)
- The current conversation is saved (not deleted)
- The message thread clears and shows the empty state for the new employee
- The header updates to show the new employee's identity (colour, icon, name)
- No confirmation dialog — this is a fast, reversible action

---

## Component Specifications

### ChatLayout

**Purpose:** Shell container for the entire chat interface.

**Dimensions:**
- Width: 100vw
- Height: 100vh (minus topbar offset)
- History panel: 260px wide (desktop), 240px (tablet), 0px/hidden (mobile)
- Content area: fills remaining width

**Colours:**
- Background: `var(--color-bg)`
- History panel background: `var(--color-surface-1)`
- History panel border-right: `1px solid var(--color-border)`

**Border radius:** N/A (full-height panels)

**Shadow:** None on layout shell.

**Interactive states:**
- History panel collapse: 260px → 0px, transition 200ms ease
- Mobile history drawer: slides in from left, 280px wide, overlay backdrop

### ChatHeader

**Purpose:** Displays active employee identity, brand context, and employee switcher.

**Dimensions:**
- Height: 64px
- Padding: 0 24px
- Border-bottom: `1px solid var(--color-border)`

**Colours:**
- Background: `rgba(8, 9, 15, 0.78)` with `backdrop-filter: blur(18px)`
- Border-bottom: `var(--color-border)`

**Typography:**
- Employee name: Subhead / 500 / −0.01em, `var(--color-text-primary)`
- Employee role: Caption / 400 / 0, `var(--color-text-secondary)`
- Brand indicator: Micro / 500 / +0.04em, uppercase, `var(--color-text-tertiary)`

**Content (left to right):**
1. Employee icon tile: 36×36px, `border-radius: 8px`, background `[employee-colour] at 15% opacity`, border `[employee-colour] at 25% opacity`, icon in `[employee-colour]`
2. Employee name + role: stacked, 8px gap
3. Spacer (flex-1)
4. BrandBrainIndicator
5. EmployeeSwitcher button: ghost button, `[employee-colour]` icon or generic `Bot` icon

**Employee colour mapping (inline style on icon tile):**

| Employee | Colour | CSS variable equivalent |
|---|---|---|
| Marketing Director | `#7c6ff7` | violet |
| Content Director | `#34d399` | green |
| Creative Director | `#f472b6` | pink |
| SEO Director | `#60a5fa` | blue |
| Analytics Director | `#fbbf24` | amber |
| Brand Strategist | `#a78bfa` | purple |
| Sales Director | `#f87171` | red |
| Customer Success | `#34d399` | green |
| Image Director | `#fb923c` | orange |
| Video Director | `#e879f9` | fuchsia |

**Interactive states:**

| State | Background | Border | Text | Transition |
|---|---|---|---|---|
| Default | transparent | none | `var(--color-text-primary)` | — |
| Hover (switcher btn) | `var(--color-surface-2)` | none | `var(--color-text-primary)` | 150ms ease |
| Focus (switcher btn) | `var(--color-surface-2)` | `2px solid var(--accent)` | `var(--color-text-primary)` | 150ms ease |

### BrandBrainIndicator

**Purpose:** Subtle indicator that Brand Brain context is active. Builds trust without dominating the UI.

**Dimensions:**
- Collapsed: auto height, ~32px
- Expanded: auto height, ~120px max
- Padding: 6px 12px (collapsed), 12px 16px (expanded)

**Colours:**
- Collapsed background: `var(--color-surface-2)`
- Collapsed border: `1px solid var(--color-border)`
- Expanded background: `var(--color-surface-2)`
- Expanded border: `1px solid var(--color-border-hover)`
- Text: `var(--color-text-secondary)` (label), `var(--color-text-primary)` (brand name)
- Accent dot: `var(--color-green)` (4px circle, indicates "active")

**Typography:**
- Label: Micro / 500 / +0.04em, uppercase, `var(--color-text-tertiary)`
- Brand name: Body / 400 / 0, `var(--color-text-primary)`

**Content (collapsed):**
```
[● green dot] Working for: [Brand Name] · Brand Brain active  [▸ expand]
```

**Content (expanded):**
```
[● green dot] Brand Brain context for [Brand Name]
─────────────────────────────────────────────
Mission: [first 80 chars of mission + "..." if longer]
Voice: [first 40 chars of voice adjectives]
Audience: [first 40 chars of target audience]
Products: [first 40 chars of product list]
[▾ collapse]
```

**Interactive states:**

| State | Background | Border | Transition |
|---|---|---|---|
| Default | `var(--color-surface-2)` | `var(--color-border)` | — |
| Hover | `var(--color-surface-2)` | `var(--color-border-hover)` | 150ms ease |
| Expanded | `var(--color-surface-2)` | `var(--color-border-hover)` | 200ms ease |

**Transition:** Height animates 200ms ease-out on expand/collapse.

### ConversationHistory (Left Panel)

**Purpose:** Lists all conversations for the current employee, grouped by date.

**Dimensions:**
- Width: 260px (desktop), 240px (tablet)
- Height: full viewport height minus header
- Padding: 16px
- Item height: 44px min

**Colours:**
- Background: `var(--color-surface-1)`
- Border-right: `1px solid var(--color-border)`
- Active item: `background: var(--color-surface-2)`, `border-left: 2px solid var(--brand-accent)`
- Hover item: `background: var(--color-surface-2)`
- Date label: `var(--color-text-tertiary)`

**Typography:**
- Date group label: Micro / 500 / +0.04em, uppercase, `var(--color-text-tertiary)`, 11px
- Conversation title: Body / 400 / 0, `var(--color-text-secondary)`, 13px, truncate at 1 line
- Timestamp: Caption / 400 / 0, `var(--color-text-tertiary)`, 11px

**Content rules:**
- Conversation title: first 50 chars of first user message, truncated with ellipsis. If no messages, "New conversation"
- Grouping: "Today" (created today), "Yesterday" (created yesterday), "Previous 7 days", "Older"
- Max visible items: 20 (scrollable beyond that)
- Empty history: show "No conversations yet" in muted text, centered

**Interactive states:**

| State | Background | Border-left | Transition |
|---|---|---|---|
| Default | transparent | none | — |
| Hover | `var(--color-surface-2)` | none | 100ms ease |
| Active | `var(--color-surface-2)` | `2px solid var(--brand-accent)` | — |

**Collapse behaviour:**
- Desktop: panel width animates 260px → 0px, 200ms ease. A thin 32px icon strip remains visible with history/back/forward icons.
- Mobile: panel is fully hidden. A history toggle button (clock icon) appears in the header. Tapping opens a 280px-wide drawer with backdrop overlay.

### MessageThread

**Purpose:** Scrollable container for the conversation.

**Dimensions:**
- Width: fills content area (max 860px centered)
- Height: fills space between header and input area
- Padding: 24px horizontal, 16px vertical
- Gap between messages: 16px

**Colours:**
- Background: `var(--color-bg)`
- No border

**Typography:**
- User message: Body / 400 / 0, `var(--color-text-primary)`, 14px, line-height 1.6
- Assistant message: Body / 400 / 0, `var(--color-text-primary)`, 14px, line-height 1.6
- Timestamps: Caption / 400 / 0, `var(--color-text-tertiary)`, 11px

**Scroll behaviour:**
- Auto-scroll to bottom on new message (smooth, 50ms debounce)
- If user has scrolled up > 150px from bottom, pause auto-scroll
- "Jump to latest" button: appears when scrolled up, fixed bottom-right of thread, `mos-panel` style, 36px circle with down arrow icon

### UserMessage

**Purpose:** Displays a message sent by the user.

**Dimensions:**
- Max-width: 75% of thread width
- Padding: 12px 16px
- Border-radius: `var(--r-lg)` = 12px (top-left: 4px, others: 12px — "tail" pointing left)

**Colours:**
- Background: `var(--color-surface-2)`
- Border: `1px solid var(--color-border)`
- Text: `var(--color-text-primary)`

**Typography:** Body / 400 / 0, 14px, line-height 1.6

**Content rules:**
- Minimum: 1 character
- Maximum: no hard limit — text wraps naturally
- Markdown: assistant messages render basic markdown (bold, italic, code, lists). User messages render as plain text.

**No interactive states** — user messages are static once sent.

### AssistantMessage

**Purpose:** Displays a response from the AI employee.

**Dimensions:**
- Max-width: 85% of thread width
- Padding: 0 (no container padding — text flows to edges)
- Border-radius: none (no background container)

**Colours:**
- Background: none (transparent)
- Text: `var(--color-text-primary)`
- Streaming cursor: `var(--brand-accent)` (current employee's accent colour)

**Typography:** Body / 400 / 0, 14px, line-height 1.6

**Content rules:**
- Renders markdown: bold (`**text**`), italic (`*text*`), code blocks (`` `inline` `` and fenced ` ``` `), unordered lists (`- item`), ordered lists (`1. item`)
- Code blocks: `background: var(--color-surface-3)`, `border-radius: 6px`, padding 12px 16px, font-family `Geist Mono`, font-size 12px
- Links: `color: var(--brand-accent-strong)`, underline on hover
- Minimum content: streaming cursor alone (1 character minimum before cursor appears)
- Maximum: no hard limit

**StreamingCursor:**
- 2px wide, 16px tall
- Colour: `var(--brand-accent)` (matches current employee)
- Animation: blink 530ms ease-in-out infinite
- Disappears 300ms after streaming completes (fade-out 200ms)

### MessageActions

**Purpose:** Quick actions on a completed assistant message.

**Trigger:** Appears on hover over an assistant message, or always visible on mobile/touch devices.

**Dimensions:**
- Height: 32px
- Padding: 4px
- Gap: 4px between buttons
- Position: below the assistant message, left-aligned

**Colours:**
- Background: `var(--color-surface-2)`
- Border: `1px solid var(--color-border)`
- Border-radius: `var(--r-md)` = 8px

**Buttons (4):**

| Button | Label | Icon | Variant |
|---|---|---|---|
| Copy | "Copy" | Copy | ghost |
| Save | "Save" | Bookmark | ghost |
| Regenerate | "Regenerate" | RefreshCw | ghost |
| Feedback | "👍" / "👎" | ThumbsUp / ThumbsDown | ghost |

**Typography:** Micro / 500 / +0.04em, uppercase, 11px, `var(--color-text-secondary)`

**Interactive states:**

| State | Background | Text | Transition |
|---|---|---|---|
| Default | transparent | `var(--color-text-tertiary)` | — |
| Hover | `var(--color-surface-3)` | `var(--color-text-primary)` | 100ms ease |
| Active | `var(--color-surface-3)` | `var(--color-accent)` | 50ms ease |
| Copied (Copy btn) | `var(--color-surface-3)` | `var(--color-green)` | — |

**Transition:** Fade in 200ms ease after streaming completes. On mobile: always visible, no hover required.

**Content rules:**
- Copy: copies full assistant message text to clipboard. Shows "Copied!" for 2 seconds after click.
- Save: saves message to a "Library" (future feature — for M3, show a toast "Saved to library").
- Regenerate: retries the last user message. Shows a "Regenerating..." state on the button.
- Feedback: thumbs up/down. Records feedback (future backend). Shows selected state for 1 second.

### ChatInput

**Purpose:** Multi-line text input for user prompts.

**Dimensions:**
- Min-height: 52px
- Max-height: 200px (then scrolls internally)
- Padding: 12px 16px
- Border-radius: `var(--r-lg)` = 12px
- Width: fills content area (max 860px)

**Colours:**
- Background: `var(--color-surface-2)`
- Border: `1px solid var(--color-border)`
- Focus border: `1px solid var(--brand-accent)`
- Focus ring: `0 0 0 3px rgba(124,156,255,0.18)`
- Text: `var(--color-text-primary)`
- Placeholder: `var(--color-text-tertiary)`

**Typography:** Body / 400 / 0, 14px, line-height 1.6

**Content rules:**
- Placeholder: "Message [Employee Name]..." (dynamic)
- Minimum: 1 character (send button disabled if empty)
- Maximum: 4000 characters (show counter at 3500: "3500/4000" in micro text)
- Shift+Enter: new line
- Enter (no shift): send message
- Auto-grow: textarea height grows with content up to 200px max

**Send button:**
- Position: right side of input, 36px circle
- Default: `background: var(--color-surface-3)`, `color: var(--color-text-tertiary)`
- Active (has text): `background: var(--brand-accent)`, `color: var(--color-bg)`
- Transition: 150ms ease on background and colour
- Icon: Send (arrow up) when empty, Send (arrow up) when has text — same icon, colour changes

**Interactive states:**

| State | Background | Border | Transition |
|---|---|---|---|
| Default | `var(--color-surface-2)` | `var(--color-border)` | — |
| Hover | `var(--color-surface-2)` | `var(--color-border-hover)` | 150ms ease |
| Focus | `var(--color-surface-2)` | `var(--brand-accent)` + ring | 150ms ease |

### EmptyState (Suggested Prompts)

**Purpose:** Eliminates the blank-page problem on first interaction.

**Dimensions:**
- Centered in message thread area
- Max-width: 640px
- Padding: 48px 24px

**Colours:**
- Background: none (transparent, sits on `var(--color-bg)`)
- Prompt cards: `var(--color-surface-2)` background, `var(--color-border)` border

**Typography:**
- Headline: Heading / 600 / −0.02em, `var(--color-text-primary)`, 18px
- Body: Body / 400 / 0, `var(--color-text-secondary)`, 14px
- Prompt text: Body / 400 / 0, `var(--color-text-primary)`, 14px

**Content:**
- Headline: "[Employee name] is ready to work"
- Body: "Start a conversation about [Brand Name]. The more context you provide in your Brand Brain, the better the output."
- 4 suggested prompt cards, each: `mos-panel` style, padding 14px 16px, `border-radius: 8px`, full width, 8px gap
- On hover: `border-color: var(--color-border-hover)`, cursor pointer
- On click: sends the prompt as a user message, transitions to populated state

**Animation:** Fade in 200ms ease on mount. Stagger: each card fades in 50ms after the previous (total 200ms stagger for 4 cards).

### SkeletonMessage

**Purpose:** Loading placeholder for messages during initial load.

**Dimensions:**
- User skeleton: max-width 75%, height 60px, `border-radius: 12px`
- Assistant skeleton: max-width 85%, height 120px, `border-radius: 0`

**Colours:**
- Background: `var(--color-surface-2)` (user), `transparent` (assistant — just text lines)
- Animation: `animate-skeleton-pulse`, `rgba(255,255,255,0.04)` → `rgba(255,255,255,0.08)`

**Animation:** 1200ms ease-in-out infinite pulse.

---

## Copy

| Element | Copy | Notes |
|---|---|---|
| Page title (header) | "[Employee Name]" | Dynamic from employee data |
| Employee role (header) | "[Employee Title]" | e.g. "Content Director" |
| Brand indicator (collapsed) | "Working for: [Brand Name] · Brand Brain active" | |
| Brand indicator (expanded) | "Brand Brain context for [Brand Name]" | |
| Empty state headline | "[Employee Name] is ready to work" | Dynamic |
| Empty state body | "Start a conversation about [Brand Name]. The more context you provide in your Brand Brain, the better the output." | |
| Input placeholder | "Message [Employee Name]..." | Dynamic |
| Error headline | "Something went wrong" | |
| Error body | "The request couldn't be completed. This might be a temporary issue — try again." | |
| Error action | "Try again" | |
| Brand Brain warning headline | "Your Brand Brain for [Brand Name] is incomplete" | |
| Brand Brain warning body | "The more you fill in, the better your results. Consider adding your brand's voice, audience, and products." | |
| Brand Brain warning action | "Open Brand Brain" | Links to brand settings |
| Brand Brain warning dismiss | "Dismiss" | Text link |
| Copy action (success) | "Copied!" | Shows for 2s |
| Save action (success) | "Saved to library" | Toast notification |
| Regenerate action (loading) | "Regenerating..." | Button text change |
| Character counter | "3500/4000" | Appears at 3500 chars |
| Jump to latest button | (no text, down arrow icon only) | |
| History empty | "No conversations yet" | |
| New conversation (untitled) | "New conversation" | |
| 404 state | "This employee doesn't exist or has been removed." | |

---

## Motion & Animation

| Element | Trigger | Animation | Duration | Easing |
|---|---|---|---|---|
| History panel collapse/expand | Click collapse button | Width transition | 200ms | ease |
| BrandBrainIndicator expand/collapse | Click expand/collapse | Height transition | 200ms | ease-out |
| MessageActions fade-in | Streaming completes | Opacity 0→1 | 200ms | ease |
| StreamingCursor | Text streaming | Blink | 530ms | ease-in-out infinite |
| StreamingCursor disappear | Streaming ends | Opacity 1→0 | 200ms | ease |
| Empty state cards | Page mount | Fade-in + stagger | 200ms each, 50ms stagger | ease |
| Skeleton pulse | Loading | Opacity pulse | 1200ms | ease-in-out infinite |
| Error banner | Error occurs | Fade-in | 200ms | ease |
| "Jump to latest" button | Scroll up >150px | Fade-in | 150ms | ease |
| Copy button "Copied!" | Copy success | Text swap | 0ms (instant) | — |
| Mobile history drawer | Toggle | Slide from left | 200ms | ease |
| Backdrop (mobile drawer) | Toggle | Opacity 0→1 | 200ms | ease |

**No animation on this screen:** Message text appearance (instant render, no fade-in for individual messages). Card hover lift (not applicable — no cards in chat).

---

## Accessibility

- [x] All interactive elements reachable by keyboard (Tab order specified below)
- [x] Focus ring visible on all interactive elements (`outline: 2px solid var(--brand-accent)`, offset 0)
- [x] Colour contrast meets WCAG AA (4.5:1 for body text, 3:1 for large text) — verified against token values
- [x] All icons have aria-label or are aria-hidden with adjacent text label
- [x] Error states announced to screen readers (`role="alert"` on error banner)
- [x] Loading states announced to screen readers (`aria-live="polite"` on message thread, `aria-busy="true"` during streaming)
- [x] Streaming text announced (`aria-live="polite"` on assistant message container)
- [x] Expand/collapse buttons have `aria-expanded` attribute
- [x] Employee switcher has `aria-label="Switch AI employee"`

**Tab order:**
1. Employee switcher button (header)
2. BrandBrainIndicator expand/collapse button
3. First conversation in history panel (if visible)
4. First suggested prompt (empty state) OR first message action button (populated state)
5. ChatInput textarea
6. Send button
7. "Jump to latest" button (if visible)

---

## Open Questions for Engineering

1. **Streaming endpoint:** What is the API route for streaming AI responses? Expected: `/api/chat/stream` or similar. Need to confirm the SSE contract (event format, error handling, cancellation).
2. **Conversation creation:** Should conversations be created eagerly (on page load, with a "New conversation" placeholder) or lazily (on first message send)? Recommendation: lazy — create on first message to avoid orphan conversations.
3. **Brand Brain injection:** The `serializeBrandForPrompt` function exists in `src/lib/brand-context-serializer.ts`. Confirm this is called server-side before the AI API call, and that the serialized context is never exposed to the client.
4. **Employee colour storage:** Employee accent colours are defined in the design spec but not yet in the Prisma schema. Options: (a) add an `accentColor` field to `AIEmployee`, (b) derive from employee name/type via a mapping function. Recommendation: add `accentColor` field for flexibility.
5. **Message persistence:** Messages are stored in the `Message` model. Confirm streaming messages are saved incrementally (on each chunk) or on completion. Recommendation: save on completion to avoid partial messages in DB.
6. **Save to Library:** The "Save" action references a Library feature that doesn't exist yet. For M3, implement as a no-op with a toast. Backend hook can be added in M4.

---

## Design Decisions Log

| Decision | What was chosen | What was rejected | Why |
|---|---|---|---|
| Chat as full page vs modal | Full page (`/dashboard/ai-employees/[id]/chat`) | Modal overlay | Full page gives more room for the conversation thread, matches Claude.ai pattern, feels more substantial. Modal would feel cramped for long conversations. |
| History panel always visible vs collapsible | Collapsible (default: open on desktop, closed on mobile) | Always visible | Users in deep work mode don't want chrome. Collapsible gives control. Default-open on desktop preserves discoverability. |
| Employee identity: icon + colour vs just name | Icon tile with employee colour + name + role | Text-only header | Colour is the fastest orienting signal. Users develop a mental map of "green = Content Director" within a few sessions. Icon reinforces the role metaphor. |
| Brand Brain indicator: collapsed vs always expanded | Collapsed by default, expandable | Always expanded | Always expanded adds visual noise. Collapsed builds trust through availability ("it's there if I need it") without demanding attention. |
| Action row: always visible vs hover-revealed | Hover-revealed on desktop, always visible on mobile | Always visible | Hover-revealed keeps the reading experience clean. Actions are secondary to the content. Mobile has no hover, so always visible there. |
| Streaming cursor colour | Employee accent colour | Neutral grey | Reinforces employee identity during streaming. User knows which "person" is typing. |
| Empty state: suggested prompts vs blank input | 4 role-specific suggested prompts | Blank input with placeholder | Blank input is the #1 cause of chat abandonment. Suggested prompts remove the blank-page problem and demonstrate the employee's capability immediately. |
| Employee switching: new conversation vs continue | New conversation | Continue existing thread | Different employees have different system prompts. Mixing them produces confused output. Starting fresh is the correct behaviour. |
| Input: single-line vs multi-line | Multi-line textarea (max 200px) | Single-line input | Marketing work requires thoughtful prompts. Multi-line signals that longer input is welcome and supported. |
| Error handling: inline vs full-page | Inline error banner in thread | Full-page error | Full-page errors break flow and feel like the product crashed. Inline errors keep the conversation intact and are less alarming. |
| Brand Brain warning: every message vs once per session | Once per session | Every message | Repeated warnings are annoying and condescending. Once per session is enough to surface the issue without nagging. |
| Markdown rendering: full vs limited | Full (bold, italic, code, lists, links) | Plain text only | Marketing output often includes formatted content (social captions with emphasis, code snippets for tracking URLs, lists for campaign ideas). Full markdown is expected. |
| Message alignment: all left vs user right | User right, assistant left | All left | Right-aligned user messages create clear visual separation and match the convention users know from iMessage, WhatsApp, ChatGPT. |