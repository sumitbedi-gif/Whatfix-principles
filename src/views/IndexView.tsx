import { useEffect, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { CONFIG, type Principle } from '../config'
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
        shown: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
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

function DeckView({ reduceMotion }: { reduceMotion: boolean }) {
  const [center, setCenter] = useState(() => {
    const i = CONFIG.findIndex((p) => p.id === readLastPrinciple())
    return i >= 0 ? i : 0
  })
  const [dir, setDir] = useState(1)

  const go = (d: number) =>
    setCenter((c) => {
      const next = Math.min(Math.max(c + d, 0), CONFIG.length - 1)
      if (next !== c) setDir(d)
      return next
    })

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
          window.location.hash = `#/${CONFIG[c].id}`
          return c
        })
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const p = CONFIG[center]
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

const NOTICE = {
  pre: 'Scheduled maintenance this weekend. Reports will be unavailable ',
  em1: 'Saturday 02:00–06:00',
  mid: '. Export anything you need ',
  em2: 'before Friday evening',
  post: '. Questions go to the support desk.',
}

/** A television remote, busy or calm. */
function Remote({ simple }: { simple: boolean }) {
  return (
    <div className="flex w-[86px] flex-col items-center gap-2 rounded-[18px] bg-[#2e2d28] px-3 py-4">
      <div className="flex w-full justify-between">
        <span className="h-3.5 w-3.5 rounded-full bg-spread-orangeplate/90" />
        <span className="h-3.5 w-3.5 rounded-full bg-white/25" />
      </div>
      {simple ? (
        <>
          <div className="mt-1 flex h-16 w-16 items-center justify-center rounded-full border border-white/25">
            <span className="text-[9px] font-medium tracking-wide text-white/80">OK</span>
          </div>
          <div className="mt-1 h-10 w-4 rounded-full bg-white/15" />
          <div className="h-2.5 w-10 rounded-full bg-white/25" />
        </>
      ) : (
        <>
          {[0, 1, 2, 3].map((r) => (
            <div key={r} className="flex gap-2">
              {[0, 1, 2].map((c) => (
                <span key={c} className="h-3.5 w-3.5 rounded-full bg-white/20" />
              ))}
            </div>
          ))}
          <div className="mt-0.5 flex h-11 w-11 items-center justify-center rounded-full border border-white/25">
            <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
          </div>
          <div className="flex gap-1.5">
            {['#c65b4e', '#5f9e6e', '#c9a83f', '#5b7fb3'].map((c) => (
              <span key={c} className="h-2 w-3.5 rounded-sm" style={{ background: c }} />
            ))}
          </div>
          {[0, 1].map((r) => (
            <div key={r} className="flex gap-2">
              {[0, 1, 2].map((c) => (
                <span key={c} className="h-2 w-4 rounded-full bg-white/15" />
              ))}
            </div>
          ))}
        </>
      )}
    </div>
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
    a: (
      <Shot>
        <SkForm />
        <div className="absolute inset-0 bg-spread-ink/30" />
        <div className="absolute left-1/2 top-1/2 w-48 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[7px] bg-white shadow-lg">
          <div className="h-1 bg-spread-orangeplate" />
          <div className="p-3.5">
            <p className="text-[13px] font-semibold text-spread-ink">Meet the new dashboard</p>
            <p className="mt-1 text-[11.5px] text-spread-ink/60">Redesigned analytics, custom views.</p>
            <button className="mt-2.5 rounded bg-spread-orangeplate px-2.5 py-1 text-[11.5px] font-medium text-white">
              Explore now
            </button>
          </div>
        </div>
      </Shot>
    ),
    b: (
      <Shot>
        <SkForm />
        <div className="absolute bottom-3 right-3 w-44 overflow-hidden rounded-[7px] border border-spread-ink/10 bg-white shadow-md">
          <div className="h-1 bg-spread-orangeplate" />
          <div className="p-3">
            <p className="text-[12.5px] font-semibold text-spread-ink">New: Dashboard 2.0</p>
            <p className="mt-0.5 text-[11px] text-spread-ink/60">Whenever you’re ready.</p>
          </div>
        </div>
      </Shot>
    ),
  },
  {
    prompt: 'Same notice, same words. Which one do you actually read?',
    law: 'Signaling & isolation',
    kicker: 'If everything is equal, nothing is read.',
    a: (
      <Shot>
        <div className="flex h-full items-center justify-center">
          <p className="max-w-[270px] text-[13.5px] leading-relaxed text-spread-ink/80">
            {NOTICE.pre}
            {NOTICE.em1}
            {NOTICE.mid}
            {NOTICE.em2}
            {NOTICE.post}
          </p>
        </div>
      </Shot>
    ),
    b: (
      <Shot>
        <div className="flex h-full items-center justify-center">
          <p className="max-w-[270px] text-[13.5px] leading-relaxed text-spread-ink/80">
            {NOTICE.pre}
            <strong className="font-semibold text-spread-orangedeep">{NOTICE.em1}</strong>
            {NOTICE.mid}
            <strong className="font-semibold text-spread-orangedeep">{NOTICE.em2}</strong>
            {NOTICE.post}
          </p>
        </div>
      </Shot>
    ),
  },
  {
    prompt: 'Movie night at a friend’s place. Which remote do you reach for?',
    law: 'Hick’s Law',
    kicker: 'Every extra option taxes the decision — on any device.',
    a: (
      <Shot>
        <div className="flex h-full items-center justify-center">
          <Remote simple={false} />
        </div>
      </Shot>
    ),
    b: (
      <Shot>
        <div className="flex h-full items-center justify-center">
          <Remote simple />
        </div>
      </Shot>
    ),
  },
  {
    prompt: 'One bookshelf, two instruction sheets. Which one gets built tonight?',
    law: 'Contiguity',
    kicker: 'The explanation belongs beside the thing it explains.',
    a: (
      <Shot>
        <div className="flex h-full flex-col items-center justify-center gap-4">
          <Shelf labeled={false} />
          <p className="text-[10.5px] text-spread-ink/60">
            1 — side panel&ensp;·&ensp;2 — shelf&ensp;·&ensp;3 — cam screw&ensp;·&ensp;see page 4
          </p>
        </div>
      </Shot>
    ),
    b: (
      <Shot>
        <div className="flex h-full items-center justify-center">
          <Shelf labeled />
        </div>
      </Shot>
    ),
  },
  {
    prompt: 'You need to call Priya. Go.',
    law: 'Recognition over recall',
    kicker: 'Choosing from what you see beats dredging from memory.',
    a: (
      <Shot>
        <div className="flex h-full flex-col items-center justify-center gap-2.5">
          <div className="flex h-8 w-40 items-center rounded-[5px] border border-[#d9d4c6] px-2.5">
            <span className="text-[11px] text-spread-ink/35">Priya’s number was…</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((k) => (
              <span
                key={k}
                className="flex h-8 w-11 items-center justify-center rounded-[5px] border border-[#d9d4c6] text-[12px] text-spread-ink/70"
              >
                {k}
              </span>
            ))}
          </div>
        </div>
      </Shot>
    ),
    b: (
      <Shot>
        <div className="flex h-full flex-col items-center justify-center gap-2">
          {[
            { n: 'Anaya', tone: '#5b7fb3' },
            { n: 'Priya', tone: '#c65b4e' },
            { n: 'Rohan', tone: '#5f9e6e' },
          ].map(({ n, tone }) => (
            <div
              key={n}
              className={`flex w-48 items-center gap-2.5 rounded-[7px] border p-2 ${
                n === 'Priya' ? 'border-spread-orangeplate' : 'border-[#e2ddd1]'
              }`}
            >
              <span
                className="flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold text-white"
                style={{ background: tone }}
              >
                {n[0]}
              </span>
              <span className="flex-1 text-[12.5px] text-spread-ink">{n}</span>
              {n === 'Priya' && (
                <span className="rounded bg-spread-orangeplate px-2 py-0.5 text-[10.5px] font-medium text-white">
                  Call
                </span>
              )}
            </div>
          ))}
        </div>
      </Shot>
    ),
  },
  {
    prompt: 'You typed “deck attached” and hit Send. Nothing is attached.',
    law: 'Error prevention > error messages',
    kicker: 'The cheapest mistake is the one that never happens.',
    a: (
      <Shot>
        <div className="mx-auto mt-1 w-60 rounded-[7px] border border-[#e2ddd1]">
          <p className="border-b border-[#efeadd] px-3 py-1.5 text-[10.5px] text-spread-ink/50">
            To: leadership@company.com
          </p>
          <p className="px-3 py-2 text-[11.5px] leading-snug text-spread-ink/80">
            Hi all, the final deck is attached. Would love thoughts before Friday.
          </p>
          <div className="px-3 pb-2.5">
            <span className="rounded bg-spread-ink px-2.5 py-1 text-[10.5px] text-white">Sent ✓</span>
          </div>
        </div>
        <div className="mx-auto mt-3 w-60 rounded-[7px] border border-bad/40 bg-bad/10 px-3 py-2">
          <p className="text-[11px] font-medium text-bad">
            Re: re: re: “There’s no attachment.”
          </p>
        </div>
      </Shot>
    ),
    b: (
      <Shot>
        <div className="mx-auto mt-1 w-60 rounded-[7px] border border-[#e2ddd1] opacity-50">
          <p className="border-b border-[#efeadd] px-3 py-1.5 text-[10.5px] text-spread-ink/50">
            To: leadership@company.com
          </p>
          <p className="px-3 py-2 text-[11.5px] leading-snug text-spread-ink/80">
            Hi all, the final deck is attached. Would love thoughts before Friday.
          </p>
        </div>
        <div className="absolute left-1/2 top-1/2 w-56 -translate-x-1/2 -translate-y-1/2 rounded-[8px] bg-white p-3.5 shadow-lg">
          <p className="text-[12.5px] font-semibold text-spread-ink">No attachment found</p>
          <p className="mt-1 text-[11px] leading-snug text-spread-ink/60">
            You wrote “attached”, but nothing is attached yet.
          </p>
          <div className="mt-2.5 flex gap-1.5">
            <button className="rounded bg-spread-orangeplate px-2.5 py-1 text-[11px] font-medium text-white">
              Attach file
            </button>
            <button className="rounded border border-[#d9d4c6] px-2.5 py-1 text-[11px] text-spread-ink/60">
              Send anyway
            </button>
          </div>
        </div>
      </Shot>
    ),
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
        <DeckView reduceMotion={reduceMotion} />
      </div>
    )
  }

  if (mode === 'timeline') {
    return (
      <div className="flex min-h-screen flex-col bg-spread-bg" style={spreadBg}>
        <ModeSwitch active="timeline" />
        <div className="flex flex-1 flex-col justify-center pb-12">
          <TimelineView reduceMotion={reduceMotion} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-spread-bg" style={spreadBg}>
      <ModeSwitch active="grid" />
      <div className="mx-auto w-full max-w-[1200px] px-4 pb-16 pt-4 sm:px-8">
        <GridView reduceMotion={reduceMotion} />
      </div>
    </div>
  )
}
