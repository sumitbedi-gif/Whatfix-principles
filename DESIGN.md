# DESIGN.md — Build for the Brain playground

Two coexisting worlds, one voice:

## 1. Landing page (dark print-spread, stage-facing)

Aesthetic lane: **retro print catalogue / technical spec sheet**. Reference:
warm charcoal spread with cream feature cards, halftone-dot icon plates,
line-art geometric glyphs, crop-mark corner brackets, diamond registration
marks (◆/◇), dotted leader lines after mono labels, tan panels with giant
high-contrast serif.

- Background: warm charcoal `#272621` with a faint large-cell grid
  (1px lines, cream at ~4-5% opacity). Never neutral black.
- Paper: cream `#EAE3D3` (cards), tan `#C9B795` (panels/bars), ink `#1D1C17`.
- Accent: print orange `#EB5B2D`, deep `#C74A22` (hover/active card state:
  the whole card flips orange, like a spot-colour plate).
- Cards: title + tiny mono index (001…015), halftone icon plate with corner
  crop marks and a unique line-art glyph, caption chip as a separate strip
  below (4px charcoal gap). One clipped corner (diagonal cut) per card.
- Type: Fraunces (giant display serif, hero/tan panels), Archivo 500/600
  (card titles, grotesque), Geist Mono (uppercase labels, 10-11px,
  0.14em tracking).
- Motion: cards enter one by one (staggered ~80ms, y+fade, expo ease-out).
  No bounce. Print stays still after arrival; hover is a colour-plate swap,
  not a lift.

## 2. Detail pages (light editorial, unchanged)

- Canvas `#ffffff`, ink `#18181b`, cool greys, accent `#ff6b3d`.
- Fraunces display + Inter UI + Geist Mono eyebrows.
- Motion 200-400ms, gentle ease/soft spring; only infinite animation is the
  skeleton caret + one beacon ping.
- Aesthetic: Linear/Vercel/Stripe restraint. Demos live on a soft panel
  `#f6f6f7`.

## Shared

- Semantic good `#2f9e6b` / bad `#d6453d` only for verdict chips.
- Radius 12-16px (landing cards may go tighter, 10px, for print feel).
- Soft low-opacity shadows on light; **no shadows on the dark spread**
  (print has no elevation).
