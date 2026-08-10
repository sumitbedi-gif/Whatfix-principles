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
  pre: 'Scheduled maintenance this weekend. Reports will be ',
  em1: 'unavailable Saturday',
  mid: ' 02:00–06:00. Export anything you need ',
  em2: 'before Friday evening',
  post: '. Questions go to the support desk.',
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
    prompt: 'A welcome screen offers you the next step.',
    law: 'Hick’s Law',
    kicker: 'Every extra option taxes the decision.',
    a: (
      <Shot>
        <div className="flex h-full items-center justify-center">
          <div className="flex w-52 flex-col gap-1.5">
            {['Take the tour', 'Watch a video', 'Read the guide', 'Import your data', 'Invite your team'].map(
              (t) => (
                <button
                  key={t}
                  className="rounded bg-spread-ink px-3 py-1.5 text-[12px] font-medium text-white"
                >
                  {t}
                </button>
              ),
            )}
          </div>
        </div>
      </Shot>
    ),
    b: (
      <Shot>
        <div className="flex h-full items-center justify-center">
          <div className="flex w-52 flex-col items-center gap-2.5">
            <button className="w-full rounded bg-spread-orangeplate px-3 py-2 text-[13px] font-medium text-white">
              Take the tour
            </button>
            <span className="text-[11.5px] text-spread-ink/50 underline">or explore on your own</span>
          </div>
        </div>
      </Shot>
    ),
  },
  {
    prompt: 'You don’t know what “LOI” means. Where should the answer live?',
    law: 'Contiguity',
    kicker: 'The explanation belongs beside the thing it explains.',
    a: (
      <Shot>
        <div className="absolute right-3 top-3 w-48 rounded-[6px] border border-spread-ink/15 bg-white p-2.5 shadow-md">
          <p className="text-[10.5px] leading-relaxed text-spread-ink/70">
            LOI — length of interview
            <br />
            IR — incidence rate
            <br />
            DROP — drop-off rate
          </p>
        </div>
        <span className="absolute right-3 top-[74px] text-[11px] text-spread-ink/40">ⓘ definitions</span>
        <div className="mt-16 flex gap-2.5">
          {['LOI', 'IR', 'DROP'].map((m, i) => (
            <div key={m} className="flex-1 rounded-[6px] border border-[#e2ddd1] p-2.5">
              <p className="font-mono text-[9px] tracking-eyebrow text-spread-ink/50">{m}</p>
              <p className="mt-1 text-[17px] font-semibold text-spread-ink">{['12m', '47%', '9%'][i]}</p>
            </div>
          ))}
        </div>
      </Shot>
    ),
    b: (
      <Shot>
        <div className="mt-6 flex gap-2.5">
          {['LOI', 'IR', 'DROP'].map((m, i) => (
            <div
              key={m}
              className={`flex-1 rounded-[6px] border p-2.5 ${
                i === 0 ? 'border-spread-orangeplate' : 'border-[#e2ddd1]'
              }`}
            >
              <p className="font-mono text-[9px] tracking-eyebrow text-spread-ink/50">{m}</p>
              <p className="mt-1 text-[17px] font-semibold text-spread-ink">{['12m', '47%', '9%'][i]}</p>
            </div>
          ))}
        </div>
        <div className="ml-1 mt-2 w-44 rounded-[6px] bg-spread-ink p-2.5">
          <p className="text-[10.5px] leading-snug text-white">
            LOI — length of interview: average minutes to finish.
          </p>
        </div>
      </Shot>
    ),
  },
  {
    prompt: 'It’s tax week. The app wants to make sure you don’t forget.',
    law: 'Recognition over recall',
    kicker: 'Show the next step where and when it’s needed.',
    a: (
      <Shot>
        <div className="flex items-center justify-between">
          <Sk w={90} h={12} />
          <button className="rounded border border-[#d9d4c6] px-2.5 py-1 text-[11.5px] text-spread-ink/60">
            File taxes
          </button>
        </div>
        <div className="mt-4 flex flex-col gap-2">
          <Sk w="100%" h={40} />
          <Sk w="100%" h={40} />
        </div>
        <div className="absolute inset-0 bg-spread-ink/25" />
        <div className="absolute left-1/2 top-1/2 w-52 -translate-x-1/2 -translate-y-1/2 rounded-[7px] bg-white p-3.5 shadow-lg">
          <p className="text-[12.5px] font-semibold text-spread-ink">
            Don’t forget to file your taxes this week!
          </p>
          <button className="mt-2 rounded bg-spread-ink px-2.5 py-1 text-[11.5px] text-white">OK</button>
        </div>
      </Shot>
    ),
    b: (
      <Shot>
        <div className="flex items-center justify-between">
          <Sk w={90} h={12} />
          <div className="relative">
            <button className="rounded border-2 border-spread-orangeplate px-2.5 py-1 text-[11.5px] font-medium text-spread-ink">
              File taxes
            </button>
            <div className="absolute -bottom-7 right-0 whitespace-nowrap rounded bg-spread-orangeplate px-2 py-0.5 text-[10.5px] font-medium text-white">
              3 days left ↑
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-2">
          <Sk w="100%" h={40} />
          <Sk w="100%" h={40} />
        </div>
      </Shot>
    ),
  },
  {
    prompt: 'Two versions of the same feature announcement.',
    law: 'Coherence',
    kicker: 'Cut what doesn’t teach. Decoration competes with the message.',
    a: (
      <Shot>
        <div className="mx-auto flex h-full w-56 flex-col justify-center">
          <div
            className="h-16 rounded-[5px] border border-[#e2ddd1]"
            style={{
              backgroundImage:
                'repeating-linear-gradient(45deg, #efe9db 0 6px, transparent 6px 12px)',
            }}
          />
          <p className="mt-2 text-[12.5px] font-semibold text-spread-ink">Big news from the team!</p>
          <p className="mt-1 text-[10.5px] leading-snug text-spread-ink/60">
            We’ve been hard at work. Read about our journey, our roadmap, and everything shipping this
            quarter across the platform.
          </p>
          <div className="mt-1.5 flex gap-2 text-[10px] text-spread-orangedeep underline">
            <span>Blog</span>
            <span>Roadmap</span>
            <span>Webinar</span>
          </div>
          <div className="mt-2 flex gap-1.5">
            <button className="rounded bg-spread-ink px-2 py-1 text-[10.5px] text-white">Read more</button>
            <button className="rounded border border-[#d9d4c6] px-2 py-1 text-[10.5px] text-spread-ink/60">
              Later
            </button>
          </div>
        </div>
      </Shot>
    ),
    b: (
      <Shot>
        <div className="mx-auto flex h-full w-56 flex-col items-start justify-center">
          <p className="text-[13.5px] font-semibold text-spread-ink">
            Exports now run 4× faster.
          </p>
          <button className="mt-2.5 rounded bg-spread-orangeplate px-3 py-1.5 text-[12px] font-medium text-white">
            Try an export
          </button>
        </div>
      </Shot>
    ),
  },
]

function QuizView({ reduceMotion }: { reduceMotion: boolean }) {
  const [idx, setIdx] = useState(0)
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
