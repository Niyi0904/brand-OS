<RULE[marketing_os_design]>
# MarketingOS Design System (Workspace Intelligence)

**Context**: You are working on MarketingOS, a premium, Apple/Linear-inspired SaaS product.
When generating code, graphics, copy, or marketing materials for this project, you MUST adhere to the following design constraints to maintain the "Workspace Intelligence" aesthetic.

## 🎨 Color Palette & Aesthetics
1. **Brand Accent**: The universal brand accent color is Amber-Gold (`#D4956A`). Do NOT use custom accent colors, generic blues, or neon purples.
2. **Backgrounds**: Use a warm-dark palette. Do NOT use true black (`#000000`).
   - App Background: `#0C0B09`
   - Surface 1 (Sidebars/Panels): `#131210`
   - Surface 2 (Cards/Dropdowns): `#1A1916`
3. **Typography Colors**: Use opacity for hierarchy.
   - Primary Text: `rgba(255, 255, 255, 0.92)`
   - Secondary Text: `rgba(255, 255, 255, 0.56)`
   - Tertiary Text: `rgba(255, 255, 255, 0.32)`
4. **No "AI Tropes"**: Do NOT add glowing blobs, neon gradients, glassmorphism overloads, or lens flares.

## ✍️ Typography
1. **Display Font**: Use **Instrument Serif** for major marketing headlines, heroes, and large feature announcements. Often use italics for emphasis (e.g. *Automate it.*).
2. **UI & Body Font**: Use **Geist** for all product interfaces, body copy, and UI components. Use `Geist Mono` for code and IDs.

## 🔲 UI Structure & Generation (for Graphics & Code)
1. **Elevation**: Do not use flat white borders for dark cards. Use multi-layered drop shadows (`shadow-md`, `shadow-lg`) combined with a subtle white inner border (`0 0 0 1px rgba(255, 255, 255, 0.06)`).
2. **Mockups**: When framing the app in marketing materials, use a dark, unified window frame with no white borders.
3. **Consistency**: Always defer to the tokens defined in `src/app/globals.css`.
</RULE[marketing_os_design]>
