/**
 * Line-art construction glyphs for the landing-page cards, one per principle.
 * All are drawn on a 96x96 grid, stroke-only (currentColor), thin uniform
 * weight, in the spirit of technical print illustrations: circles, fans,
 * hatches, registration marks. Each glyph encodes its principle:
 * overlapping personas, an orbit of tools, an unbroken wave, a beacon, etc.
 */

import type { ReactElement, ReactNode } from 'react'

const S = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.2,
  vectorEffect: 'non-scaling-stroke',
} as const

function Svg({ children, title }: { children: ReactNode; title: string }) {
  return (
    <svg viewBox="0 0 96 96" role="img" aria-label={title} className="h-full w-full">
      {children}
    </svg>
  )
}

/** 01 Know your user — three overlapping persona circles, hatched common ground. */
function GlyphUser() {
  return (
    <Svg title="Three overlapping circles">
      <defs>
        <clipPath id="g-user-a">
          <circle cx="41" cy="41" r="21" />
        </clipPath>
      </defs>
      <circle cx="41" cy="41" r="21" {...S} />
      <circle cx="55" cy="41" r="21" {...S} />
      <circle cx="48" cy="55" r="21" {...S} />
      {/* hatch the triple intersection */}
      <g clipPath="url(#g-user-a)">
        <g {...S}>
          <path d="M40 44 L56 60 M44 40 L60 56 M48 36 L64 52 M36 48 L52 64" />
        </g>
      </g>
    </Svg>
  )
}

/** 02 Know your product — an orbit of tools around one centre. */
function GlyphProduct() {
  return (
    <Svg title="Orbits with satellites">
      <circle cx="48" cy="48" r="10" {...S} />
      <circle cx="48" cy="48" r="22" {...S} />
      <circle cx="48" cy="48" r="34" {...S} />
      <circle cx="70" cy="48" r="3.2" {...S} />
      <circle cx="36" cy="29.5" r="3.2" {...S} />
      <circle cx="27" cy="70" r="3.2" {...S} transform="rotate(8 48 48)" />
      <path d="M48 10 L48 16 M48 80 L48 86 M10 48 L16 48 M80 48 L86 48" {...S} />
    </Svg>
  )
}

/** 03 Flow state — parallel waves passing uninterrupted through a frame. */
function GlyphFlow() {
  return (
    <Svg title="Unbroken waves through a frame">
      <rect x="26" y="22" width="44" height="52" {...S} />
      <path d="M10 38 C 22 30, 34 46, 48 38 S 74 30, 86 38" {...S} />
      <path d="M10 50 C 22 42, 34 58, 48 50 S 74 42, 86 50" {...S} />
      <path d="M10 62 C 22 54, 34 70, 48 62 S 74 54, 86 62" {...S} />
    </Svg>
  )
}

/** 04 Signaling — one beacon: concentric rings, radiating ticks, solid core. */
function GlyphSignal() {
  return (
    <Svg title="Beacon with radiating ticks">
      <circle cx="48" cy="48" r="6" fill="currentColor" stroke="none" />
      <circle cx="48" cy="48" r="15" {...S} />
      <circle cx="48" cy="48" r="25" {...S} />
      <g {...S}>
        <path d="M48 12 L48 20 M48 76 L48 84 M12 48 L20 48 M76 48 L84 48" />
        <path d="M22.5 22.5 L28 28 M68 68 L73.5 73.5 M73.5 22.5 L68 28 M28 68 L22.5 73.5" />
      </g>
    </Svg>
  )
}

/** 05 Contiguity — a label ring anchored flush to its referent square. */
function GlyphContiguity() {
  return (
    <Svg title="Circle anchored to a square">
      <rect x="18" y="34" width="34" height="34" {...S} />
      <circle cx="63" cy="40" r="15" {...S} />
      <circle cx="63" cy="40" r="2.4" fill="currentColor" stroke="none" />
      <path d="M52 45 L63 40" {...S} />
      <path d="M18 78 L52 78 M18 74 L18 82 M52 74 L52 82" {...S} />
    </Svg>
  )
}

/** 06 Hick's law — a fan of options converging to a single path. */
function GlyphHicks() {
  return (
    <Svg title="Fan of lines converging to one">
      <g {...S}>
        <path d="M16 20 L48 76 M28 20 L48 76 M40 20 L48 76 M56 20 L48 76 M68 20 L48 76 M80 20 L48 76" />
        <path d="M16 20 L80 20" />
      </g>
      <path d="M48 76 L48 88" stroke="currentColor" strokeWidth="2.6" fill="none" />
      <circle cx="48" cy="76" r="3" fill="currentColor" stroke="none" />
    </Svg>
  )
}

/** 07 Coherence — dashed excess pared away to one solid core. */
function GlyphCoherence() {
  return (
    <Svg title="Nested squares, outer ones dashed">
      <rect x="14" y="14" width="68" height="68" {...S} strokeDasharray="2.5 5" />
      <rect x="26" y="26" width="44" height="44" {...S} strokeDasharray="5 4" />
      <rect x="38" y="38" width="20" height="20" {...S} />
      <circle cx="48" cy="48" r="3" fill="currentColor" stroke="none" />
    </Svg>
  )
}

/** 08 Recognition over recall — an open eye built from two arcs. */
function GlyphRecognition() {
  return (
    <Svg title="Eye of two arcs">
      <path d="M14 48 C 30 26, 66 26, 82 48" {...S} />
      <path d="M14 48 C 30 70, 66 70, 82 48" {...S} />
      <circle cx="48" cy="48" r="11" {...S} />
      <circle cx="48" cy="48" r="4" fill="currentColor" stroke="none" />
      <path d="M48 30 L48 24 M48 66 L48 72" {...S} />
    </Svg>
  )
}

/** 09 Jakob's law — the same pattern, repeated and aligned. */
function GlyphJakob() {
  return (
    <Svg title="Two identical offset frames">
      <g {...S}>
        <rect x="18" y="18" width="42" height="42" />
        <path d="M18 32 L60 32 M32 32 L32 60" />
        <rect x="36" y="36" width="42" height="42" />
        <path d="M36 50 L78 50 M50 50 L50 78" />
      </g>
    </Svg>
  )
}

/** 10 Motor load — a long travel arc collapsing onto a near target. */
function GlyphMotor() {
  return (
    <Svg title="Arc from pointer to target">
      <circle cx="66" cy="62" r="14" {...S} />
      <circle cx="66" cy="62" r="6" {...S} />
      <circle cx="66" cy="62" r="1.8" fill="currentColor" stroke="none" />
      <path d="M16 26 C 40 8, 66 22, 68 46" {...S} strokeDasharray="4 4" />
      <path d="M14 20 L14 34 L24 28 Z" fill="currentColor" stroke="none" />
    </Svg>
  )
}

/** 11 Error prevention — the wrong path fenced off before the fact. */
function GlyphError() {
  return (
    <Svg title="Circle with a barred diagonal">
      <circle cx="48" cy="48" r="30" {...S} />
      <path d="M27 27 L69 69" {...S} />
      <g {...S}>
        <path d="M42 30 L36 36 M60 48 L54 54 M66 60 L60 66" />
      </g>
      <path d="M48 6 L48 12 M48 84 L48 90 M6 48 L12 48 M84 48 L90 48" {...S} />
    </Svg>
  )
}

/** 12 Segmentation — one long bar chunked into paced pieces. */
function GlyphSegment() {
  return (
    <Svg title="Bar divided into chunks">
      <g {...S}>
        <rect x="14" y="30" width="20" height="14" />
        <rect x="38" y="30" width="20" height="14" />
        <rect x="62" y="30" width="20" height="14" />
        <rect x="14" y="52" width="20" height="14" />
        <rect x="38" y="52" width="20" height="14" strokeDasharray="3 3" />
        <rect x="62" y="52" width="20" height="14" strokeDasharray="3 3" />
      </g>
      <path d="M18 37 L22 41 L30 33" {...S} />
      <path d="M42 37 L46 41 L54 33" {...S} />
      <path d="M66 37 L70 41 L78 33" {...S} />
      <path d="M18 59 L30 59" {...S} />
    </Svg>
  )
}

/** 13 Autonomy — one road, three chosen branches. */
function GlyphAutonomy() {
  return (
    <Svg title="Path branching three ways">
      <path d="M48 88 L48 54" {...S} />
      <path d="M48 54 C 48 40, 30 40, 26 22" {...S} strokeDasharray="4 4" />
      <path d="M48 54 C 48 36, 48 36, 48 20" {...S} />
      <path d="M48 54 C 48 40, 66 40, 70 22" {...S} strokeDasharray="4 4" />
      <circle cx="26" cy="16" r="4" {...S} />
      <circle cx="48" cy="14" r="4.5" fill="currentColor" stroke="none" />
      <circle cx="70" cy="16" r="4" {...S} />
      <circle cx="48" cy="88" r="2.4" fill="currentColor" stroke="none" />
    </Svg>
  )
}

/** 14 Exclusivity — a field of equals, one singled out and ringed. */
function GlyphExclusivity() {
  return (
    <Svg title="Dot grid with one ringed dot">
      <g fill="currentColor" stroke="none">
        {[24, 40, 56, 72].flatMap((x) =>
          [24, 40, 56, 72].map((y) =>
            x === 56 && y === 40 ? null : (
              <circle key={`${x}-${y}`} cx={x} cy={y} r="1.8" />
            ),
          ),
        )}
      </g>
      <circle cx="56" cy="40" r="3.2" fill="currentColor" stroke="none" />
      <circle cx="56" cy="40" r="9" {...S} />
      <circle cx="56" cy="40" r="14" {...S} strokeDasharray="2.5 4" />
    </Svg>
  )
}

/** 15 Modality — the same message as three primitive shapes. */
function GlyphModality() {
  return (
    <Svg title="Triangle, circle and square overlapping">
      <path d="M34 26 L52 58 L16 58 Z" {...S} />
      <circle cx="56" cy="44" r="18" {...S} />
      <rect x="44" y="52" width="26" height="26" {...S} />
    </Svg>
  )
}

/** Principle id → glyph. Falls back to the beacon if an id is unmapped. */
export const GLYPHS: Record<string, () => ReactElement> = {
  'know-your-user': GlyphUser,
  'know-your-product': GlyphProduct,
  'flow-state': GlyphFlow,
  'signaling-isolation': GlyphSignal,
  contiguity: GlyphContiguity,
  'hicks-law': GlyphHicks,
  coherence: GlyphCoherence,
  'recognition-recall': GlyphRecognition,
  'match-their-model': GlyphJakob,
  'reduce-motor-load': GlyphMotor,
  'error-prevention': GlyphError,
  segmentation: GlyphSegment,
  autonomy: GlyphAutonomy,
  exclusivity: GlyphExclusivity,
  'multimedia-modality': GlyphModality,
}

export function PrincipleGlyph({ id }: { id: string }) {
  const Glyph = GLYPHS[id] ?? GlyphSignal
  return <Glyph />
}
