# 🎨 Design System

## Congicore – Intelligent. Immersive. Yours.

This document defines the visual design system, UI components, and user experience guidelines for Congicore. The goal is to create a modern, premium, knowledge-focused interface with a consistent signature look built on the project's real Tailwind palette.

---

## 1. Design Principles

| | | |
|:---:|:---:|:---:|
| 👥 **User-Centered** | 🌿 **Minimal & Clean** | 🧊 **Consistent** |
| Simple and intuitive for learners and knowledge workers. | Reduce clutter and focus on content. | Follow a unified design system across every page. |
| Deep personal AI experience — the twin answers *from your knowledge*. | Content is the hero; AI features stay one click away. | Same tokens, components and patterns everywhere. |

## 2. Color Palette

Signature colors used across the application (from `tailwind.config.ts`).

| Swatch | Token | Hex | Usage |
|---|---|---|---|
| 🟪 | **chromeViolet** | `#5F2CFF` | Main brand color — buttons, links, active states, glow shadows |
| 🟣 | **chromeViolet.light / dark** | `#7B4FFF` / `#4B1ECC` | Hover / pressed states of brand color |
| 🔵 | **hyperCobalt** | `#0038FF` | High-energy accents, glows, focus rings |
| 🌿 | **mintFoam** | `#D6FFCB` | Success messages, completed tasks, positive glow |
| 🩵 | **glassBlue** | `#DFF6FF` | Glass surfaces, inner-glow borders, soft highlights |
| 🪵 | **skinSand** | `#FFD8B8` | Warm accents, avatars, soft highlights |
| 🟢 | **carbonTeal** | `#042F32` (dark `#021A1C`, surface `#073B3F`) | Dark surface background |
| 🟤 | **toxicViolet** | `#3D007A` (dark `#25004D`, surface `#4D0596`) | Alternate dark surfaces / gradients |
| ⚪ | **softChrome** | `#E8ECF1` | Muted text on dark, neutral borders |
| 🟥 | **destructive** | `#EF4444` (semantic) | Error messages, delete actions, validation alerts |
| 🟨 | **warning** | `#F59E0B` (semantic) | Warnings, caution states |

**Surface model:** dark-first UI — carbonTeal / toxicViolet surfaces, glassBlue `rgba(223,246,255,0.12)` glass overlays, chromeViolet glow shadows (`shadow-glow-violet`, `shadow-card`, `shadow-card-hover`).

## 3. Typography

We use **Geist Sans** (via `next/font`) as the primary font — clean, modern and highly readable, with Geist Mono for code.

| | |
|---|---|
| **Aa** | **Geist Sans — Primary Font** |
| | Clean, modern and highly readable |

### Type Scale

| Style | Size | Weight | Usage |
|---|---|---|---|
| Display / Hero | 48–60px | 800–900 | Landing headlines |
| H1 | 30–36px | 700–800 | Page titles |
| H2 | 24px | 600–700 | Section titles |
| H3 | 20px | 600 | Card titles |
| Body | 14–16px | 400 | Paragraphs, UI text |
| Small / Caption | 12–13px | 400–500 | Meta text, badges |
| Code / Mono | 13–14px | 400 | Geist Mono, snippets, IDs |

## 4. UI Components

Standard components to be used throughout the application (Radix UI primitives + CVA + tailwind-merge under `src/components/ui`).

### Buttons

| Variant | Look | Usage |
|---|---|---|
| **Primary** | chromeViolet fill, white text, `shadow-glow-sm` | Main actions (Ask Twin, Upload, Save) |
| **Secondary** | glass surface / softChrome border | Supporting actions |
| **Destructive** | `#EF4444` fill | Delete document, remove memory |
| **Ghost** | transparent, hover glass | Icon actions, toolbars |

### Other Standards

- **Cards** — rounded-2xl, dark surface + inner glow, `shadow-card` → `shadow-card-hover` on hover.
- **Inputs** — dark glass background, softChrome border, violet focus ring.
- **Badges** — priority: 🔴 `High` (#EF4444), 🟡 `Medium` (#F59E0B), 🟢 `Low` (#10B981); status: ✅ Completed (mint), 🔄 In Progress (amber).
- **Graph** — D3 force layout: nodes tinted by concept type, violet/cobalt glow on hover, mint links for strong relations.
- **Charts** — Recharts with violet/cobalt series, mint for positive deltas.
- **Toasts** — Radix toast, dark glass, violet accent border, bottom-right.
- **Animation** — subtle `float` (6s), `shimmer`, `glow` keyframes only where they aid hierarchy; respect `prefers-reduced-motion`.

## 5. Layout & Spacing

| Token | Value | Usage |
|---|---|---|
| Page padding | 24px (mobile 16px) | Content gutters |
| Card gap | 16–24px | Grid rhythm |
| Radius scale | sm → 3xl (0.25–1.5rem) | Buttons sm/lg, cards 2xl |
| Max content width | ~1200–1280px | Dashboard, settings pages |
