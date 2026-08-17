import { useEffect, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { type Principle } from '../config'
import { PrincipleGlyph } from '../components/PrincipleGlyphs'
import { readLastPrinciple, rememberViewMode } from '../lastPrinciple'
import { readShortSet, writeShortSet, visiblePrinciples } from '../shortSet'

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

type ViewMode = 'grid' | 'timeline' | 'deck' | 'quiz'

/** Whisper-quiet mode switch, the only chrome any view carries. */
function ModeSwitch({ active }: { active: ViewMode }) {
  return (
    <div className="flex items-center justify-end gap-5 px-6 pt-5 text-spread-paper">
      {(['quiz', 'grid', 'timeline', 'deck'] as ViewMode[]).map((m) => (
        <a
          key={m}
          href={m === 'grid' ? '#/' : `#/${m}`}
          onClick={() => rememberViewMode(m)}
          className={`font-mono text-[9px] uppercase tracking-eyebrow transition-opacity ${
            m === active ? 'text-spread-orange' : 'opacity-40 hover:opacity-100'
          }`}
          aria-current={m === active ? 'true' : undefined}
        >
          {m}
        </a>
      ))}
    </div>
  )
}


/** Tiny corner toggle: crunch the deck down to the six-principle demo set. */
function ShortSetToggle({
  on,
  onChange,
}: {
  on: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!on)}
      className="fixed bottom-4 left-4 z-40 flex items-center gap-2 rounded-full border border-spread-paper/15 bg-spread-bg/80 px-3 py-1.5 font-mono text-[9px] uppercase tracking-eyebrow text-spread-paper/50 backdrop-blur transition-colors hover:text-spread-paper"
      aria-pressed={on}
      title="Toggle the short demo set (6 principles)"
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${on ? 'bg-spread-orange' : 'bg-spread-paper/30'}`}
      />
      {on ? 'Short set · 6' : 'Full · 15'}
    </button>
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

function GridView({ reduceMotion, shortSet }: { reduceMotion: boolean; shortSet: boolean }) {
  const list = visiblePrinciples(shortSet)
  return (
    <motion.div
      className="mt-6 grid grid-cols-1 gap-x-1 gap-y-6 sm:grid-cols-2 sm:gap-y-1 lg:grid-cols-3"
      initial={reduceMotion ? 'shown' : 'hidden'}
      animate="shown"
      variants={{
        shown: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
      }}
    >
      {list.map((p, i) => (
        <GridCard key={p.id} principle={p} index={i} />
      ))}
    </motion.div>
  )
}

const GAP = 16

function TimelineView({ reduceMotion, shortSet }: { reduceMotion: boolean; shortSet: boolean }) {
  const list = visiblePrinciples(shortSet)
  const stripRef = useRef<HTMLDivElement>(null)
  const [stripW, setStripW] = useState(0)
  const [center, setCenter] = useState(() => {
    const i = list.findIndex((p) => p.id === readLastPrinciple())
    return i >= 0 ? i : 0
  })

  useEffect(() => {
    setCenter((c) => Math.min(c, list.length - 1))
  }, [list.length])

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
        setCenter((c) => Math.min(c + 1, list.length - 1))
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault()
        setCenter((c) => Math.max(c - 1, 0))
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        setCenter((c) => {
          window.location.hash = `#/${list[c].id}`
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
          {list.map((p, i) => {
            const isCenter = i === center
            const num = String(i + 1).padStart(3, '0')
            return (
              <motion.div
                key={p.id}
                className="shrink-0"
                style={{ width: cardW }}
                initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                animate={{
                  // Side cards stay bright cream: a projector washes dimmed
                  // plates over charcoal into black-on-black.
                  opacity: isCenter ? 1 : 0.85,
                  y: 0,
                  scale: isCenter ? 1 : 0.94,
                  filter: isCenter ? 'blur(0px)' : 'blur(1px)',
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
          {String(center + 1).padStart(3, '0')} / {String(list.length).padStart(3, '0')}
        </span>
        <button
          type="button"
          onClick={() => setCenter((c) => Math.min(c + 1, list.length - 1))}
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

/**
 * Deck mode: a pure presentation surface. No hero, no chrome, just one big
 * card dealt onto the charcoal with a hinted pile behind it, so the room
 * never learns how many are left. Cream by default, orange on hover;
 * ←/→ (clicker Page keys) deal the next card, Enter opens it.
 */
/**
 * A coherent physical model: the pile sits beneath the stage, the discard is
 * off to the left. Dealing forward throws the card to the discard while the
 * next rises from the pile. Going back retrieves the discarded card from
 * where it disappeared, while the current one sinks back into the pile.
 */
const fromPile = { opacity: 0, x: 0, y: 34, scale: 0.93, rotate: 2.6 }
const toDiscard = { opacity: 0, x: -190, y: 14, scale: 0.97, rotate: -8 }
const deckVariants = {
  enter: (d: number) => (d >= 0 ? fromPile : toDiscard),
  center: { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 },
  exit: (d: number) => (d >= 0 ? toDiscard : fromPile),
}

function DeckView({ reduceMotion, shortSet }: { reduceMotion: boolean; shortSet: boolean }) {
  const list = visiblePrinciples(shortSet)
  const [center, setCenter] = useState(() => {
    const i = list.findIndex((p) => p.id === readLastPrinciple())
    return i >= 0 ? i : 0
  })
  const [dir, setDir] = useState(1)

  const go = (d: number) =>
    setCenter((c) => {
      const next = Math.min(Math.max(c + d, 0), list.length - 1)
      if (next !== c) setDir(d)
      return next
    })

  useEffect(() => {
    setCenter((c) => Math.min(c, list.length - 1))
  }, [list.length])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault()
        go(1)
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault()
        go(-1)
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        setCenter((c) => {
          window.location.hash = `#/${list[c].id}`
          return c
        })
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const p = list[center]
  const num = String(center + 1).padStart(3, '0')

  return (
    <div className="flex min-h-screen flex-col">
      <ModeSwitch active="deck" />

      <div className="flex flex-1 flex-col items-center justify-center pb-12">
        <div className="relative w-[min(92vw,560px)]">
          {/* The pile: constant, so the remaining count is never legible. */}
          <div
            aria-hidden
            className="absolute inset-0 translate-y-3.5 rotate-[2.2deg] rounded-[10px] bg-spread-paper/30"
          />
          <div
            aria-hidden
            className="absolute inset-0 translate-y-7 scale-[0.97] -rotate-[1.7deg] rounded-[10px] bg-spread-paper/15"
          />
          <AnimatePresence mode="popLayout" custom={dir} initial={false}>
            <motion.div
              key={p.id}
              className="relative z-10"
              custom={dir}
              variants={deckVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { type: 'spring', stiffness: 240, damping: 26, mass: 0.9 }
              }
            >
              <a
                href={`#/${p.id}`}
                className="group flex h-[min(68vh,620px)] w-full flex-col outline-none"
                aria-label={`Open ${p.label}`}
              >
                <Plates principle={p} num={num} fixedTitle />
              </a>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-8 flex items-center gap-6 text-spread-paper">
          <button
            type="button"
            onClick={() => go(-1)}
            className="font-mono text-[12px] tracking-eyebrow opacity-50 transition-opacity hover:opacity-100"
            aria-label="Previous principle"
          >
            ←
          </button>
          <span className="font-mono text-[10px] uppercase tracking-eyebrow opacity-70">
            {num}
          </span>
          <button
            type="button"
            onClick={() => go(1)}
            className="font-mono text-[12px] tracking-eyebrow opacity-50 transition-opacity hover:opacity-100"
            aria-label="Next principle"
          >
            →
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Quiz mode ──────────────────────────────────────────────────────────────
 * The post-lunch opener: six A/B situations the room votes on (Mentimeter or
 * hands) before any principle is named. Each board hides a reveal chip naming
 * the law, shown on the presenter's Enter. ←/→ move between situations.
 */

/** A small white app canvas the mockups live on. */
function Shot({ children }: { children: ReactNode }) {
  return (
    <div className="relative h-[250px] overflow-hidden rounded-[6px] border border-spread-ink/10 bg-white p-4">
      {children}
    </div>
  )
}

/** Grey skeleton bar. */
function Sk({ w, h = 9, className = '' }: { w: number | string; h?: number; className?: string }) {
  return (
    <div
      className={`rounded-[3px] bg-[#e2ddd1] ${className}`}
      style={{ width: w, height: h }}
    />
  )
}

/** A wordless form with one focused field: the user is mid-task. */
function SkForm() {
  return (
    <div className="flex h-full flex-col gap-3">
      <Sk w={110} h={12} />
      <div className="mt-1 flex flex-col gap-2.5">
        <div className="rounded-[5px] border border-[#e2ddd1] p-2.5">
          <Sk w={140} h={7} />
        </div>
        <div className="rounded-[5px] border-2 border-spread-orangeplate p-2.5">
          <Sk w={90} h={7} className="bg-[#efe9db]" />
        </div>
        <div className="rounded-[5px] border border-[#e2ddd1] p-2.5">
          <Sk w={120} h={7} />
        </div>
      </div>
    </div>
  )
}

/**
 * Cycles through phases for the quiz boards' ambient loops. `starts[i]` is
 * the ms offset at which phase i begins; the whole cycle repeats every
 * `period` ms. Returns the current phase index.
 */
function useCycle(starts: number[], period: number): number {
  const [phase, setPhase] = useState(0)
  useEffect(() => {
    let timers: number[] = []
    const run = () => {
      timers.forEach(clearTimeout)
      timers = []
      setPhase(0)
      starts.forEach((t, i) => {
        if (i > 0) timers.push(window.setTimeout(() => setPhase(i), t))
      })
    }
    run()
    const iv = window.setInterval(run, period)
    return () => {
      window.clearInterval(iv)
      timers.forEach(clearTimeout)
    }
    // starts/period are inline constants at each call site.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return phase
}

/** Board 01-A: the modal barges in over the focused form, then leaves. */
function FlowModalLoop() {
  const reduce = useReducedMotion() ?? false
  const phase = useCycle([0, 700, 3400], 4800)
  const shown = reduce || phase === 1
  return (
    <Shot>
      <SkForm />
      <AnimatePresence>
        {shown && (
          <motion.div
            key="modal"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="absolute inset-0 bg-spread-ink/30" />
            <div className="absolute left-1/2 top-1/2 w-48 -translate-x-1/2 -translate-y-1/2">
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 4 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="overflow-hidden rounded-[7px] bg-white shadow-lg"
              >
                <div className="h-1 bg-spread-orangeplate" />
                <div className="p-3.5">
                  <p className="text-[13px] font-semibold text-spread-ink">Meet the new dashboard</p>
                  <p className="mt-1 text-[11.5px] text-spread-ink/60">
                    Redesigned analytics, custom views.
                  </p>
                  <button className="mt-2.5 rounded bg-spread-orangeplate px-2.5 py-1 text-[11.5px] font-medium text-white">
                    Explore now
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Shot>
  )
}

/** Board 01-B: the same message slides in as a toast, waits, slides out. */
function FlowToastLoop() {
  const reduce = useReducedMotion() ?? false
  const phase = useCycle([0, 700, 3700], 4800)
  const shown = reduce || phase === 1
  return (
    <Shot>
      <SkForm />
      <div className="absolute bottom-3 right-3 w-44">
        <AnimatePresence>
          {shown && (
            <motion.div
              key="toast"
              initial={{ opacity: 0, x: 64 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 64 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="overflow-hidden rounded-[7px] border border-spread-ink/10 bg-white shadow-md"
            >
              <div className="h-1 bg-spread-orangeplate" />
              <div className="p-3">
                <p className="text-[12.5px] font-semibold text-spread-ink">New: Dashboard 2.0</p>
                <p className="mt-0.5 text-[11px] text-spread-ink/60">Whenever you’re ready.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Shot>
  )
}

/** Board 05-A: the mail goes out, then the reply lands. */
function MailThreadLoop() {
  const reduce = useReducedMotion() ?? false
  const phase = useCycle([0, 1500, 4600], 5600)
  const replyShown = reduce || phase === 1
  return (
    <Shot>
      <div className="mx-auto w-[280px] overflow-hidden rounded-[8px] border border-[#e2ddd1] bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-[#efeadd] px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-[#e2ddd1]" />
          <span className="h-2 w-2 rounded-full bg-[#e2ddd1]" />
          <span className="ml-1 text-[11.5px] font-semibold text-spread-ink">Final deck</span>
          <span className="ml-auto text-[10px] text-spread-ink/40">Inbox</span>
        </div>
        <div className="px-3 py-2.5">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-spread-ink text-[10px] font-semibold text-white">
              S
            </span>
            <span className="text-[11px] font-medium text-spread-ink">You</span>
            <span className="text-[10px] text-spread-ink/40">to Leadership · 10:42</span>
          </div>
          <p className="mt-1.5 text-[12px] leading-snug text-spread-ink/80">
            Hi all, please find the final deck attached. Would love your thoughts before Friday.
          </p>
        </div>
        <AnimatePresence>
          {replyShown && (
            <motion.div
              key="reply"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="border-t border-[#efeadd] bg-bad/5 px-3 py-2.5"
            >
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#5b7fb3] text-[10px] font-semibold text-white">
                  R
                </span>
                <span className="text-[11px] font-medium text-spread-ink">Ravi</span>
                <span className="text-[10px] text-spread-ink/40">10:44</span>
              </div>
              <p className="mt-1.5 text-[12px] font-medium leading-snug text-bad">
                Hey, where is the attached PDF?
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Shot>
  )
}

/** Board 05-B: Send is pressed, the intercept dialog catches it. */
function MailInterceptLoop() {
  const reduce = useReducedMotion() ?? false
  const phase = useCycle([0, 1400, 1750, 4700], 5800)
  // phase 1 = Send pressed, phase 2 = dialog up, phase 3 = reset beat.
  const pressed = !reduce && phase === 1
  const dialogShown = reduce || phase === 2
  return (
    <Shot>
      <motion.div
        animate={{ opacity: dialogShown ? 0.55 : 1 }}
        transition={{ duration: 0.25 }}
        className="mx-auto w-[280px] overflow-hidden rounded-[8px] border border-[#e2ddd1] bg-white"
      >
        <div className="flex items-center gap-2 border-b border-[#efeadd] px-3 py-2">
          <span className="text-[11.5px] font-semibold text-spread-ink">New message</span>
          <span className="ml-auto text-[10px] text-spread-ink/40">To: Leadership</span>
        </div>
        <p className="px-3 py-2 text-[12px] leading-snug text-spread-ink/80">
          Hi all, please find the final deck attached. Would love your thoughts before Friday.
        </p>
        <div className="flex items-center gap-2.5 border-t border-[#efeadd] px-3 py-2">
          <motion.span
            animate={{ scale: pressed ? 0.88 : 1 }}
            transition={{ duration: 0.15 }}
            className="rounded bg-spread-ink px-2.5 py-1 text-[10.5px] text-white"
          >
            Send
          </motion.span>
          <span className="text-[12px] text-spread-ink/40">📎</span>
        </div>
      </motion.div>
      <AnimatePresence>
        {dialogShown && (
          <motion.div
            key="dialog"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="absolute inset-0 bg-spread-ink/20" />
            <div className="absolute left-1/2 top-1/2 w-60 -translate-x-1/2 -translate-y-1/2">
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.28, ease: EASE }}
                className="rounded-[8px] bg-white p-4 shadow-xl"
              >
                <p className="text-[13px] font-semibold text-spread-ink">No attachment found</p>
                <p className="mt-1 text-[11.5px] leading-snug text-spread-ink/60">
                  You wrote “attached”, but there are no files attached to this message.
                </p>
                <div className="mt-3 flex gap-1.5">
                  <button className="rounded bg-spread-orangeplate px-2.5 py-1 text-[11.5px] font-medium text-white">
                    Attach file
                  </button>
                  <button className="rounded border border-[#d9d4c6] px-2.5 py-1 text-[11.5px] text-spread-ink/60">
                    Send anyway
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Shot>
  )
}

const NOTICE = {
  pre: 'Scheduled maintenance this weekend. Reports will be unavailable ',
  em1: 'Saturday 02:00–06:00',
  mid: '. Export anything you need ',
  em2: 'before Friday evening',
  post: '. Questions go to the support desk.',
}

/**
 * Renders the generated raster image if it exists (drop files into
 * public/quiz/), otherwise the hand-drawn vector fallback.
 */
function ImgOr({
  src,
  alt,
  fallback,
}: {
  src: string
  alt: string
  fallback: ReactNode
}) {
  const [failed, setFailed] = useState(false)
  if (failed) return <>{fallback}</>
  return (
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className="h-full w-full object-contain"
    />
  )
}

/** A flat-pack bookshelf diagram: numbered legend vs. labels on the parts. */
function Shelf({ labeled }: { labeled: boolean }) {
  const tag =
    'absolute whitespace-nowrap text-[10px] font-medium text-spread-ink/80'
  const numChip =
    'absolute flex h-4 w-4 items-center justify-center rounded-full bg-spread-ink text-[9px] font-semibold text-white'
  return (
    <div className="relative h-[150px] w-[150px]">
      <div className="absolute inset-0 rounded-[3px] border-2 border-spread-ink/70" />
      <div className="absolute left-0 right-0 top-1/3 h-[2px] bg-spread-ink/70" />
      <div className="absolute left-0 right-0 top-2/3 h-[2px] bg-spread-ink/70" />
      <span className="absolute -top-1.5 right-5 h-3 w-3 rounded-full border-2 border-spread-ink/70 bg-white" />
      {labeled ? (
        <>
          <span className={`${tag} -left-2 top-10 -translate-x-full`}>side panel —</span>
          <span className={`${tag} -right-2 top-[52%] translate-x-full`}>— shelf</span>
          <span className={`${tag} -top-1 right-10 -translate-y-full`}>cam screw ↘</span>
        </>
      ) : (
        <>
          <span className={`${numChip} -left-2 top-10`}>1</span>
          <span className={`${numChip} left-1/2 top-[30%]`}>2</span>
          <span className={`${numChip} -top-2 right-3`}>3</span>
        </>
      )}
    </div>
  )
}

interface QuizBoard {
  prompt: string
  law: string
  kicker: string
  a: ReactNode
  b: ReactNode
}

const QUIZ: QuizBoard[] = [
  {
    prompt: 'You’re deep in a form, mid-task. An announcement arrives.',
    law: 'Don’t break the flow state',
    kicker: 'Deep focus deserves a gentle, peripheral touch.',
    a: <FlowModalLoop />,
    b: <FlowToastLoop />,
  },
  {
    prompt: 'Same notice, same words. Which one do you actually read?',
    law: 'Signaling & isolation',
    kicker: 'If everything is equal, nothing is read.',
    a: (
      <Shot>
        <SkForm />
        <div className="absolute inset-0 bg-spread-ink/30" />
        <div className="absolute left-1/2 top-1/2 w-[270px] -translate-x-1/2 -translate-y-1/2 rounded-[8px] bg-white p-4 shadow-lg">
          <p className="text-[12px] leading-relaxed text-spread-ink/80">
            {NOTICE.pre}
            {NOTICE.em1}
            {NOTICE.mid}
            {NOTICE.em2}
            {NOTICE.post}
          </p>
          <button className="mt-2.5 rounded bg-spread-ink px-2.5 py-1 text-[11px] text-white">
            Got it
          </button>
        </div>
      </Shot>
    ),
    b: (
      <Shot>
        <SkForm />
        <div className="absolute inset-0 bg-spread-ink/30" />
        <div className="absolute left-1/2 top-1/2 w-[270px] -translate-x-1/2 -translate-y-1/2 rounded-[8px] bg-white p-4 shadow-lg">
          <p className="text-[12.5px] font-semibold text-spread-ink">Scheduled maintenance</p>
          <p className="mt-1 text-[12px] leading-relaxed text-spread-ink/80">
            {NOTICE.pre}
            <strong className="font-semibold text-spread-orangedeep">{NOTICE.em1}</strong>
            {NOTICE.mid}
            <strong className="font-semibold text-spread-orangedeep">{NOTICE.em2}</strong>
            {NOTICE.post}
          </p>
          <button className="mt-2.5 rounded bg-spread-ink px-2.5 py-1 text-[11px] text-white">
            Got it
          </button>
        </div>
      </Shot>
    ),
  },
  {
    prompt: 'One bookshelf, two instruction sheets. Which one gets built tonight?',
    law: 'Contiguity',
    kicker: 'The explanation belongs beside the thing it explains.',
    a: (
      <div className="relative h-[300px] overflow-hidden rounded-[6px] border border-spread-ink/10 bg-[#f2ece0]">
        <ImgOr
          src="/quiz/ikea-a.png"
          alt="Assembly sheet: numbered parts, legend at the bottom of the page"
          fallback={
            <div className="flex h-full flex-col items-center justify-center gap-4">
              <Shelf labeled={false} />
              <p className="text-[10.5px] text-spread-ink/60">
                1 — side panel&ensp;·&ensp;2 — shelf&ensp;·&ensp;3 — cam screw&ensp;·&ensp;see page 4
              </p>
            </div>
          }
        />
      </div>
    ),
    b: (
      <div className="relative h-[300px] overflow-hidden rounded-[6px] border border-spread-ink/10 bg-[#f2ece0]">
        <ImgOr
          src="/quiz/ikea-b.png"
          alt="Assembly sheet: labels sit directly on the parts"
          fallback={
            <div className="flex h-full items-center justify-center">
              <Shelf labeled />
            </div>
          }
        />
      </div>
    ),
  },
  {
    prompt: 'Same question, asked two ways. Which one can you answer instantly?',
    law: 'Recognition over recall',
    kicker: 'You knew it the moment you saw it. Choosing beats retrieving.',
    a: (
      <Shot>
        <div className="mx-auto flex h-full w-64 flex-col justify-center">
          <p className="text-[14px] font-semibold leading-snug text-spread-ink">
            In which year did the first human land on the Moon?
          </p>
          <div className="mt-4 flex h-10 items-center rounded-[6px] border border-[#d9d4c6] px-3">
            <span className="text-[12px] text-spread-ink/35">Type the year…</span>
            <span className="ml-0.5 h-4 w-[1.5px] bg-spread-ink/50" />
          </div>
        </div>
      </Shot>
    ),
    b: (
      <Shot>
        <div className="mx-auto flex h-full w-64 flex-col justify-center">
          <p className="text-[14px] font-semibold leading-snug text-spread-ink">
            In which year did the first human land on the Moon?
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {['1965', '1969', '1972', '1975'].map((y) => (
              <span
                key={y}
                className="flex h-10 items-center justify-center rounded-[6px] border border-[#d9d4c6] text-[13px] text-spread-ink/80"
              >
                {y}
              </span>
            ))}
          </div>
        </div>
      </Shot>
    ),
  },
  {
    prompt: 'You typed “deck attached” and hit Send. Nothing is attached.',
    law: 'Error prevention > error messages',
    kicker: 'The cheapest mistake is the one that never happens.',
    a: <MailThreadLoop />,
    b: <MailInterceptLoop />,
  },
]

function QuizView({ reduceMotion }: { reduceMotion: boolean }) {
  // ?board=N (1-based) deep-links a situation, e.g. /?board=4#/quiz.
  const [idx, setIdx] = useState(() => {
    const n = Number(new URLSearchParams(window.location.search).get('board'))
    return Number.isInteger(n) && n >= 1 && n <= QUIZ.length ? n - 1 : 0
  })
  const [revealed, setRevealed] = useState(false)
  const [dir, setDir] = useState(1)

  const go = (d: number) => {
    setIdx((i) => {
      const next = Math.min(Math.max(i + d, 0), QUIZ.length - 1)
      if (next !== i) {
        setDir(d)
        setRevealed(false)
      }
      return next
    })
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault()
        go(1)
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault()
        go(-1)
      } else if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowUp') {
        e.preventDefault()
        setRevealed((v) => !v)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const board = QUIZ[idx]

  return (
    <div className="flex min-h-screen flex-col">
      <ModeSwitch active="quiz" />
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-6 pb-12">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={idx}
            initial={reduceMotion ? false : { opacity: 0, x: dir * 44 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, x: dir * -44 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            <p className="text-center font-mono text-[10px] uppercase tracking-eyebrow text-spread-paper/60">
              Situation {String(idx + 1).padStart(2, '0')}
            </p>
            <h2 className="mx-auto mt-3 max-w-2xl text-center font-grotesk text-[clamp(20px,2.6vw,30px)] font-semibold leading-snug text-spread-paper">
              {board.prompt}
            </h2>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {(['A', 'B'] as const).map((letter) => (
                <div key={letter} className="rounded-[8px] bg-spread-paper p-4 [clip-path:polygon(0_0,calc(100%-16px)_0,100%_16px,100%_100%,0_100%)]">
                  <div className="flex items-baseline justify-between px-1 pb-3">
                    <span className="font-grotesk text-[22px] font-semibold text-spread-ink">
                      {letter}
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-eyebrow text-spread-ink/40">
                      vote {letter}
                    </span>
                  </div>
                  {letter === 'A' ? board.a : board.b}
                </div>
              ))}
            </div>

            <div className="mt-6 flex min-h-[64px] items-center justify-center">
              <AnimatePresence>
                {revealed && (
                  <motion.div
                    key="law"
                    initial={reduceMotion ? false : { opacity: 0, y: 10, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: EASE }}
                    className="rounded-[8px] bg-spread-orangeplate px-6 py-3.5 text-center text-spread-paper"
                  >
                    <p className="font-mono text-[9px] uppercase tracking-eyebrow opacity-80">
                      The law
                    </p>
                    <p className="mt-0.5 font-grotesk text-[17px] font-semibold">{board.law}</p>
                    <p className="text-[12.5px] opacity-90">{board.kicker}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-2 flex items-center justify-center gap-6 text-spread-paper">
          <button
            type="button"
            onClick={() => go(-1)}
            className="font-mono text-[12px] opacity-50 transition-opacity hover:opacity-100"
            aria-label="Previous situation"
          >
            ←
          </button>
          <span className="font-mono text-[10px] uppercase tracking-eyebrow opacity-70">
            {String(idx + 1).padStart(2, '0')} / {String(QUIZ.length).padStart(2, '0')}
          </span>
          <button
            type="button"
            onClick={() => go(1)}
            className="font-mono text-[12px] opacity-50 transition-opacity hover:opacity-100"
            aria-label="Next situation"
          >
            →
          </button>
          <span className="hidden font-mono text-[9px] uppercase tracking-eyebrow opacity-50 sm:inline">
            Enter reveals the law
          </span>
        </div>
      </div>
    </div>
  )
}

export function IndexView({ mode }: { mode: ViewMode }) {
  const reduceMotion = useReducedMotion() ?? false
  const [shortSet, setShortSet] = useState(readShortSet)
  const setShort = (v: boolean) => {
    writeShortSet(v)
    setShortSet(v)
  }

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
    // Only the grid scrolls; timeline and deck are full-screen surfaces.
    if (mode !== 'grid') return
    const last = readLastPrinciple()
    const target = last && document.getElementById(`card-${last}`)
    if (target) {
      target.scrollIntoView({ block: 'center' })
    } else {
      window.scrollTo({ top: 0 })
    }
    // Mount-only: mode switches while mounted shouldn't yank the scroll.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const spreadBg = {
    backgroundImage:
      'linear-gradient(rgba(234,227,211,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(234,227,211,0.045) 1px, transparent 1px)',
    backgroundSize: '140px 140px',
  }

  // Every mode is a bare surface: charcoal, the quiet switch, the cards.
  if (mode === 'quiz') {
    return (
      <div className="min-h-screen bg-spread-bg" style={spreadBg}>
        <QuizView reduceMotion={reduceMotion} />
      </div>
    )
  }

  if (mode === 'deck') {
    return (
      <div className="min-h-screen bg-spread-bg" style={spreadBg}>
        <DeckView reduceMotion={reduceMotion} shortSet={shortSet} />
        <ShortSetToggle on={shortSet} onChange={setShort} />
      </div>
    )
  }

  if (mode === 'timeline') {
    return (
      <div className="flex min-h-screen flex-col bg-spread-bg" style={spreadBg}>
        <ModeSwitch active="timeline" />
        <div className="flex flex-1 flex-col justify-center pb-12">
          <TimelineView reduceMotion={reduceMotion} shortSet={shortSet} />
        </div>
        <ShortSetToggle on={shortSet} onChange={setShort} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-spread-bg" style={spreadBg}>
      <ModeSwitch active="grid" />
      <div className="mx-auto w-full max-w-[1200px] px-4 pb-16 pt-4 sm:px-8">
        <GridView reduceMotion={reduceMotion} shortSet={shortSet} />
      </div>
      <ShortSetToggle on={shortSet} onChange={setShort} />
    </div>
  )
}
