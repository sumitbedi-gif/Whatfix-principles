# PRODUCT.md — Build for the Brain playground

register: brand

## What this is

An interactive knowledge base + live demo playground teaching Whatfix content
authors 15 UX/learning-psychology principles ("Build for the Brain"). Each
principle opens to an editorial detail page with toggleable live demos
(current behaviour → better approach) on a wordless skeleton app, backed by an
anonymized real customer proof with a verified metric.

Built by Sumit Bedi (Product Design, Whatfix). Originally a 2-day virtual
workshop that went viral internally; now also the on-screen companion for a
one-hour on-stage session (opened via a link from Google Slides, projected in
an auditorium). Hosted on Vercel, shared with authors as a reference.

## Users

- Whatfix content authors (create in-app guidance: flows, smart tips, pop-ups).
  They are practitioners, not designers; the site must feel aspirational but
  never intimidating.
- Live audience at workshop sessions, viewing it projected on stage.

## Brand voice

Three words: **inevitable, engineered, warm-ink**. A psychology field manual
printed by a careful press, not a SaaS site. Punchy, research-cited,
emotionally resonant. Core thesis repeated throughout: "You are not your user."

## Anti-references

- Colourful SaaS dashboard aesthetics, feature-grid marketing pages.
- Anything that reads as a tooltip vendor tutorial.
- Fake metrics or named customers: all proofs stay anonymized.

## Strategic principles

- The playground practices what it preaches: restraint, signaling, coherence.
- Landing page is the stage-facing showpiece (brand register); detail pages
  serve the demos (product register) and keep their light editorial look.
- Everything is config-driven from `src/config.ts`; visual changes must not
  alter content or interaction structure.
