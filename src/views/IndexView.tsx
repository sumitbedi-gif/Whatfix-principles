import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { CONFIG, type Principle } from '../config'
import { BrandMark } from '../components/BrandMark'
import { PrincipleGlyph } from '../components/PrincipleGlyphs'
import { readLastPrinciple, rememberViewMode } from '../lastPrinciple'

/**
 * The landing page is a dark editorial "print spread": cream plates on warm
 * charcoal, one orange spot colour, mono labels with dotted leaders, halftone
 * icon plates with crop marks. Two arrangements of the same 15 cards:
 *
 *  - #/          grid: the 3x5 composite plate.
 *  - #/timeline  stage mode: a horizontal filmstrip, one card centered and
 *                orange, neighbours blurred. Driven by ←/→ (or a presenter
 *                clicker's Page keys) and Enter, so it can be run from a
 *                podium without precise pointing.
 *
 * Returning from a principle restores position: the grid scrolls to that
 * card, the timeline centers it.
 */

const EASE = [0.16, 1, 0.3, 1] as const

/** Two rows of fine leader dots, in the current text colour. */
function DotLeader({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`h-[7px] min-w-6 flex-1 opacity-40 ${className}`}
      style={{
        backgroundImage:
          'radial-gradient(circle, currentColor 1px, transparent 1.1px)',
        backgroundSize: '6px 4px',
      }}
    />
  )
}

/** Thin L-brackets in the four corners of a plate. */
function CropMarks() {
  const edge = 'absolute h-3 w-3 border-current opacity-50'
  return (
    <div aria-hidden className="pointer-events-none absolute inset-2">
      <span className={`${edge} left-0 top-0 border-l border-t`} />
      <span className={`${edge} right-0 top-0 border-r border-t`} />
      <span className={`${edge} bottom-0 left-0 border-b border-l`} />
      <span className={`${edge} bottom-0 right-0 border-b border-r`} />
    </div>
  )
}

function Diamond({ filled = false }: { filled?: boolean }) {
  return (
    <span
      aria-hidden
      className={`inline-block h-[7px] w-[7px] rotate-45 ${
        filled ? 'bg-current' : 'border border-current'
      }`}
    />
  )
}

/** Tan hero panel: wordmark, giant serif title, the working thesis. */
function Hero() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.08, ease: EASE }}
      className="bg-spread-tan text-spread-ink [clip-path:polygon(22px_0,100%_0,100%_calc(100%-22px),calc(100%-22px)_100%,0_100%,0_22px)]"
    >
      <div className="px-6 pb-8 pt-7 sm:px-10 sm:pb-10 sm:pt-9">
        <div className="flex items-center gap-4">
          <a href="#/" aria-label="Whatfix home" className="shrink-0">
            <BrandMark className="h-6 w-auto" />
          </a>
          <DotLeader />
          <span className="font-mono text-[10px] uppercase tracking-eyebrow opacity-70">
            Author enablement
          </span>
        </div>
        <h1 className="mt-10 max-w-4xl font-display text-[clamp(44px,7.5vw,94px)] leading-[0.97]">
          Things every Whatfix author should know
        </h1>
        <p className="mt-7 max-w-md text-[15px] leading-relaxed opacity-80">
          A working set of principles for guidance that respects attention,
          earns a glance, and never trains the user to dismiss you.
        </p>
        <div className="mt-9 flex items-center gap-4 border-t border-spread-ink/20 pt-4 font-mono text-[10px] uppercase tracking-eyebrow opacity-80">
          <span className="flex items-center gap-2">
            <Diamond /> 15 principles
          </span>
          <span className="flex items-center gap-2">
            <Diamond filled /> 36 live demos
          </span>
        </div>
      </div>
    </motion.section>
  )
}

type ViewMode = 'grid' | 'timeline'

/** Mono rule between hero and cards, with the grid/timeline switch. */
function SectionRule({ mode }: { mode: ViewMode }) {
  const tab = (m: ViewMode, label: string) => (
    <a
      href={m === 'grid' ? '#/' : '#/timeline'}
      onClick={() => rememberViewMode(m)}
      className={`flex items-center gap-2 font-mono text-[10px] uppercase tracking-eyebrow transition-colors ${
        mode === m
          ? 'text-spread-orange'
          : 'opacity-60 hover:opacity-100'
      }`}
      aria-current={mode === m ? 'true' : undefined}
    >
      <Diamond filled={mode === m} /> {label}
    </a>
  )
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3, ease: EASE }}
      className="mt-14 flex items-center gap-4 text-spread-paper"
    >
      <span className="font-mono text-[10px] uppercase tracking-eyebrow">
        The principles
      </span>
      <DotLeader />
      {tab('grid', 'Grid')}
      {tab('timeline', 'Timeline')}
      <span className="hidden font-mono text-[10px] uppercase tracking-eyebrow opacity-60 sm:inline">
        001 — 015
      </span>
    </motion.div>
  )
}

/**
 * The two cream plates + seam diamond of one card. `active` renders the
 * orange spot-colour state statically (timeline center); `interactive`
 * wires the same state to the parent `.group`'s hover/focus, always in
 * paper-white text for contrast on orange.
 */
function Plates({
  principle,
  num,
  active = false,
  fixedTitle = false,
}: {
  principle: Principle
  num: string
  active?: boolean
  fixedTitle?: boolean
}) {
  // The group-hover/focus variants only take effect under a `.group` parent
  // (the grid's anchor); elsewhere they're inert, so the same markup serves
  // both the interactive grid card and the static timeline cards.
  return (
    <>
      <div
        className={`relative flex flex-1 flex-col rounded-[8px] px-5 pb-5 pt-4 transition-colors duration-200 [clip-path:polygon(0_0,calc(100%-16px)_0,100%_16px,100%_100%,0_100%)] ${
          active
            ? 'bg-spread-orangeplate text-spread-paper'
            : 'bg-spread-paper text-spread-ink group-hover:bg-spread-orangeplate group-hover:text-spread-paper group-focus-visible:bg-spread-orangeplate group-focus-visible:text-spread-paper'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <h2
            className={`font-grotesk text-[19px] font-semibold leading-snug tracking-[-0.015em] ${
              fixedTitle ? 'min-h-[52px]' : ''
            }`}
          >
            {principle.label}
          </h2>
          <span className="pt-1 font-mono text-[10px] tracking-eyebrow opacity-60">
            {num}
          </span>
        </div>
        <div
          className={`relative mt-4 min-h-[208px] flex-1 rounded-[5px] transition-colors duration-200 ${
            active
              ? 'text-spread-paper/30'
              : 'text-spread-ink/15 group-hover:text-spread-paper/30 group-focus-visible:text-spread-paper/30'
          }`}
          style={{
            backgroundImage:
              'radial-gradient(circle, currentColor 0.9px, transparent 1px)',
            backgroundSize: '7px 7px',
          }}
        >
          <div
            className={`absolute inset-0 transition-colors duration-200 ${
              active
                ? 'text-spread-paper'
                : 'text-spread-ink group-hover:text-spread-paper group-focus-visible:text-spread-paper'
            }`}
          >
            <CropMarks />
            <div className="absolute inset-0 p-5">
              <PrincipleGlyph id={principle.id} />
            </div>
          </div>
        </div>
      </div>

      {/* Registration diamond in the seam. */}
      <div className="relative">
        <span
          aria-hidden
          className="absolute left-1/2 top-1/2 z-10 h-[9px] w-[9px] -translate-x-1/2 -translate-y-1/2 rotate-45 bg-spread-bg"
        />
      </div>

      {/* Caption chip, a separate plate under a thin charcoal seam. */}
      <div
        className={`relative mt-1 min-h-[64px] rounded-[8px] py-3.5 pl-5 pr-9 transition-colors duration-200 ${
          active
            ? 'bg-spread-orangedeep text-spread-paper'
            : 'bg-spread-paper text-spread-ink group-hover:bg-spread-orangedeep group-hover:text-spread-paper group-focus-visible:bg-spread-orangedeep group-focus-visible:text-spread-paper'
        }`}
      >
        <p className="text-[13px] leading-relaxed opacity-85">
          {principle.summary}
        </p>
        <span
          aria-hidden
          className="absolute right-4 top-1/2 h-6 w-[3px] -translate-y-1/2 opacity-40"
          style={{
            backgroundImage:
              'radial-gradient(circle, currentColor 1px, transparent 1.1px)',
            backgroundSize: '3px 6px',
          }}
        />
      </div>
    </>
  )
}

function GridCard({
  principle,
  index,
}: {
  principle: Principle
  index: number
}) {
  const live = principle.status === 'live'
  const num = String(index + 1).padStart(3, '0')
  return (
    <motion.div
      id={`card-${principle.id}`}
      variants={{
        hidden: { opacity: 0, y: 26 },
        shown: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
      }}
      className="flex"
    >
      {live ? (
        <a
          href={`#/${principle.id}`}
          className="group flex w-full flex-col outline-none"
        >
          <Plates principle={principle} num={num} />
        </a>
      ) : (
        <div className="flex w-full flex-col opacity-50">
          <Plates principle={principle} num={num} />
        </div>
      )}
    </motion.div>
  )
}

function GridView({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <motion.div
      className="mt-6 grid grid-cols-1 gap-x-1 gap-y-6 sm:grid-cols-2 sm:gap-y-1 lg:grid-cols-3"
      initial={reduceMotion ? 'shown' : 'hidden'}
      animate="shown"
      variants={{
        shown: { transition: { staggerChildren: 0.07, delayChildren: 0.4 } },
      }}
    >
      {CONFIG.map((p, i) => (
        <GridCard key={p.id} principle={p} index={i} />
      ))}
    </motion.div>
  )
}

const GAP = 16

function TimelineView({ reduceMotion }: { reduceMotion: boolean }) {
  const stripRef = useRef<HTMLDivElement>(null)
  const [stripW, setStripW] = useState(0)
  const [center, setCenter] = useState(() => {
    const i = CONFIG.findIndex((p) => p.id === readLastPrinciple())
    return i >= 0 ? i : 0
  })

  useEffect(() => {
    const el = stripRef.current
    if (!el) return
    const measure = () => setStripW(el.clientWidth)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Podium controls: arrows or a clicker's Page keys move, Enter/Space opens.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault()
        setCenter((c) => Math.min(c + 1, CONFIG.length - 1))
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault()
        setCenter((c) => Math.max(c - 1, 0))
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        setCenter((c) => {
          window.location.hash = `#/${CONFIG[c].id}`
          return c
        })
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const cardW = stripW === 0 ? 380 : stripW < 640 ? Math.max(260, stripW * 0.78) : 380
  const x = (stripW - cardW) / 2 - center * (cardW + GAP)

  return (
    <div className="mt-6">
      <div ref={stripRef} className="relative overflow-hidden py-1">
        <motion.div
          className="flex items-stretch"
          style={{ gap: GAP }}
          initial={false}
          animate={{ x }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { type: 'spring', stiffness: 260, damping: 32 }
          }
        >
          {CONFIG.map((p, i) => {
            const isCenter = i === center
            const num = String(i + 1).padStart(3, '0')
            return (
              <motion.div
                key={p.id}
                className="shrink-0"
                style={{ width: cardW }}
                initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                animate={{
                  opacity: isCenter ? 1 : 0.45,
                  y: 0,
                  scale: isCenter ? 1 : 0.94,
                  filter: isCenter ? 'blur(0px)' : 'blur(1.5px)',
                }}
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : {
                        duration: 0.45,
                        ease: EASE,
                        delay: Math.min(Math.abs(i - center) * 0.06, 0.4),
                      }
                }
              >
                {isCenter ? (
                  <a
                    href={`#/${p.id}`}
                    className="flex h-full w-full flex-col outline-none"
                    aria-label={`Open ${p.label}`}
                  >
                    <Plates principle={p} num={num} active fixedTitle />
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => setCenter(i)}
                    className="flex h-full w-full cursor-pointer flex-col text-left outline-none"
                    aria-label={`Go to ${p.label}`}
                    tabIndex={-1}
                  >
                    <Plates principle={p} num={num} fixedTitle />
                  </button>
                )}
              </motion.div>
            )
          })}
        </motion.div>
      </div>
      <div className="mt-5 flex items-center gap-4 text-spread-paper">
        <button
          type="button"
          onClick={() => setCenter((c) => Math.max(c - 1, 0))}
          className="font-mono text-[11px] tracking-eyebrow opacity-60 transition-opacity hover:opacity-100"
          aria-label="Previous principle"
        >
          ←
        </button>
        <span className="font-mono text-[10px] uppercase tracking-eyebrow">
          {String(center + 1).padStart(3, '0')} / 015
        </span>
        <button
          type="button"
          onClick={() => setCenter((c) => Math.min(c + 1, CONFIG.length - 1))}
          className="font-mono text-[11px] tracking-eyebrow opacity-60 transition-opacity hover:opacity-100"
          aria-label="Next principle"
        >
          →
        </button>
        <DotLeader />
        <span className="hidden font-mono text-[9px] uppercase tracking-eyebrow opacity-50 sm:inline">
          ← → move · Enter opens
        </span>
      </div>
    </div>
  )
}

/** Tan colophon strip mirroring the masthead. */
function FooterPlate() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.5, ease: EASE }}
      className="mt-14 bg-spread-tan text-spread-ink [clip-path:polygon(14px_0,calc(100%-14px)_0,100%_14px,100%_100%,0_100%,0_14px)]"
    >
      <div className="flex items-center gap-4 px-5 py-3.5 font-mono text-[10px] uppercase tracking-eyebrow sm:px-7">
        <span>Sumit Bedi · Product Design</span>
        <DotLeader />
        <span className="hidden normal-case tracking-normal sm:inline">
          You are not your user.
        </span>
        <DotLeader className="hidden sm:block" />
        <span>MMXXVI</span>
      </div>
    </motion.footer>
  )
}

export function IndexView({ mode }: { mode: ViewMode }) {
  const reduceMotion = useReducedMotion() ?? false

  // Own the page background while the spread is mounted, so overscroll and
  // short viewports stay charcoal instead of flashing the detail-page white.
  useEffect(() => {
    const prev = document.body.style.backgroundColor
    document.body.style.backgroundColor = '#272621'
    return () => {
      document.body.style.backgroundColor = prev
    }
  }, [])

  // Returning from a principle: land back where the presenter left off.
  // Grid scrolls that card to center; timeline scrolls the strip into view
  // (the strip itself centers the card). Fresh visits start at the top.
  useEffect(() => {
    const last = readLastPrinciple()
    if (!last) return
    const target =
      mode === 'grid'
        ? document.getElementById(`card-${last}`)
        : document.getElementById('principle-strip')
    if (target) {
      target.scrollIntoView({ block: 'center' })
    } else {
      window.scrollTo({ top: 0 })
    }
    // Mount-only: mode switches while mounted shouldn't yank the scroll.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      className="min-h-screen bg-spread-bg"
      style={{
        backgroundImage:
          'linear-gradient(rgba(234,227,211,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(234,227,211,0.045) 1px, transparent 1px)',
        backgroundSize: '140px 140px',
      }}
    >
      <div className="mx-auto w-full max-w-[1200px] px-4 pb-16 pt-6 sm:px-8 sm:pt-8">
        <Hero />
        <SectionRule mode={mode} />
        <div id="principle-strip">
          {mode === 'grid' ? (
            <GridView reduceMotion={reduceMotion} />
          ) : (
            <TimelineView reduceMotion={reduceMotion} />
          )}
        </div>
        <FooterPlate />
      </div>
    </div>
  )
}
