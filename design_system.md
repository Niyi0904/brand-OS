# MarketingOS Design System

This document outlines the core visual specifications for MarketingOS. It is intended for both the engineering and graphics teams to ensure consistency across the product interface, marketing materials, and brand assets.

Our design philosophy is **Workspace Intelligence** — emphasizing a premium, focused, and Apple/Linear-inspired aesthetic. We prioritize clarity, deep warm surfaces, and a singular distinct accent color over generic neon "AI" glows.

---

## 🎨 Color Palette

We use a warm-dark palette. True black (`#000000`) is avoided in favor of warm, espresso-tinted darks that reduce eye strain and look more sophisticated.

### Brand Accent
The primary brand color is a warm Amber-Gold. This is the **only** accent color used for primary actions, active states, and highlights.

- **Primary Accent**: `#D4956A`
- **Strong Accent (Hover/Active)**: `#E8A87C`
- **Subtle Background**: `rgba(212, 149, 106, 0.10)`
- **Borders/Rings**: `rgba(212, 149, 106, 0.30)`

> [!IMPORTANT]  
> **No Custom Accents**: The ability to select custom workspace accent colors has been completely removed to enforce brand consistency. `#D4956A` is the universal brand color.

### Background & Surfaces
Surfaces are built in layers to establish a physical sense of depth.

- **App Background**: `#0C0B09` (Base layer)
- **Surface 1 (Sidebars/Panels)**: `#131210`
- **Surface 2 (Cards/Dropdowns)**: `#1A1916`
- **Surface 3 (Hover states/Inputs)**: `#222019`
- **Surface 4 (Active elements)**: `#2A2820`

### Typography Colors
Text opacity is used to establish hierarchy rather than distinct grey hex values.

- **Primary Text**: `rgba(255, 255, 255, 0.92)`
- **Secondary Text**: `rgba(255, 255, 255, 0.56)`
- **Tertiary/Muted Text**: `rgba(255, 255, 255, 0.32)`
- **Inverse Text (on Accent)**: `rgba(12, 11, 9, 0.96)`

### Semantic & Feedback Colors
Used strictly for status indicators and destructive actions.

- **Positive (Success)**: `#6EBF8B`
- **Warning (Caution)**: `#D4A847`
- **Danger (Error/Delete)**: `#E07070`
- **AI Action (Special AI features)**: `#8B91E8`

---

## ✍️ Typography

MarketingOS uses a combination of modern sans-serif for UI and a sophisticated serif for large display headings.

### 1. Display Font: Instrument Serif
Used exclusively for major marketing headlines, empty state titles, and large feature announcements. It should **never** be used for body text or UI components.
- **Style**: Italic is frequently used for emphasis (e.g., "Context is everything. *Automate it.*")

### 2. UI & Body Font: Geist (by Vercel)
Used for all product interfaces, buttons, sidebars, and body copy.
- **Weights**: Regular (400), Medium (500), SemiBold (600)
- **Monospace**: `Geist Mono` is used for code snippets, IDs, and tabular data.

### Sizing Scale
- `xs` (12px) - Metadata, tiny labels
- `sm` (13px) - Default UI text (Sidebar, Buttons, Inputs)
- `base` (14px) - Body copy, standard reading text
- `lg` (17px) - Card titles, important list items
- `3xl` (28px) - Page headers
- `6xl` (60px) - Landing page heroes

---

## 🔲 Elevation & Shadows

We do not use flat, solid borders for cards. Instead, we use multi-layered shadows combined with a very subtle inner white border to create a "glass" or "machined metal" effect.

### Drop Shadows
- **Cards (`shadow-sm`)**: `0 1px 3px rgba(0,0,0,0.45), 0 4px 8px rgba(0,0,0,0.22)`
- **Dropdowns & Modals (`shadow-float`)**: `0 8px 16px rgba(0,0,0,0.55), 0 24px 64px rgba(0,0,0,0.40)`

### Borders
- **Standard Border**: `rgba(255, 255, 255, 0.07)`
- **Strong Border (Hover)**: `rgba(255, 255, 255, 0.13)`
- **Accent Border**: `rgba(212, 149, 106, 0.30)`

---

## ⚡ Motion & Interactions

Interactions should feel instantaneous but organic. We use "spring" physics rather than linear or simple ease-in-out transitions.

- **Hover States**: Cards lift by `-1px` and shadow intensifies.
- **Click/Active States**: Buttons scale down to `0.97` instantly to provide physical tactile feedback.
- **Modals/Dropdowns**: Scale in from `0.96` and slide up slightly (`4px`) using a custom cubic-bezier spring: `cubic-bezier(0.16, 1, 0.3, 1)`.

---

## 🎨 Asset Guidelines for Graphics Team

When creating social media posts, ads, or App Store screenshots for MarketingOS:

1. **Avoid generic dark mode**: Do not use `#000000` or `#111111` for backgrounds. Pick up `#0C0B09` or `#131210` from the palette to match the app's warm tint.
2. **Focus on Typography**: Let *Instrument Serif* do the heavy lifting in your graphics. Keep the layouts minimal and grid-based.
3. **Restrain Glows**: Do not add artificial lens flares, glowing blobs, or neon purple gradients behind screenshots. If you need a glow or highlight, use a subtle radial gradient of the Brand Accent (`#D4956A`) at 10-15% opacity.
4. **App Window Frames**: When framing the app in marketing materials, use a dark, unified window frame (macOS style or custom minimal) with no white borders.
