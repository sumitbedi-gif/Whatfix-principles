import { AnimatePresence, motion } from 'motion/react'
import { Info, Compass, X, ArrowRight } from 'lucide-react'
import { useState } from 'react'

/**
 * The wordless "dummy app" canvas, reused as the stage for every demo.
 *
 * Every piece of content is a grey skeleton bar/box. Guidance vehicles layer on
 * top of it (modal, toast, launcher, badges) so the popup always sits inside a
 * believable product. Props let each demo morph the relevant part:
 *   - dimmed:     the focused field reads as covered (blocking modal)
 *   - badges:     metric-card indices wearing a "New" badge (signalling)
 *   - focusField: show the accent focus ring + caret (in-flow cue)
 *   - metrics:    render real labelled data cards (LOI, IR, …) instead of bars
 *   - tipMode:    where field definitions live — 'detached' (one info icon by
 *                 the dashboard title) or 'anchored' (an info icon on each card)
 */
export interface Metric {
  /** Short label, e.g. "LOI". */
  label: string
  /** The headline value, e.g. "14m". */
  value: string
  /** Small delta line, e.g. "▲ 4%". */
  delta?: string
  /** Whether the delta reads as good (green) or bad (red). */
  deltaGood?: boolean
  /** The plain-language definition surfaced on hover. */
  def: string
}

interface SkeletonAppProps {
  dimmed?: boolean
  badges?: number[]
  /** Metric-card index that wears a pulsing beacon on its corner. */
  beacon?: number | null
  focusField?: boolean
  /** When provided, the three cards render real data instead of bars. */
  metrics?: Metric[]
  /** Where the field definitions live. Only meaningful with `metrics`. */
  tipMode?: 'detached' | 'anchored' | null
  /**
   * Turn the second form row into a real, hoverable contextual field. `false`
   * → generic tip (describes the field); `true` → contextual tip (the actual
   * record). `null`/undefined → ordinary skeleton row.
   */
  contextField?: boolean | null
  /** Render a two-tab strip in the top bar; Tab 2 shows a variant layout. */
  tabs?: boolean
  /**
   * Replace the main content with a real form whose labels carry help text.
   * false → verbose inline help under every label (clutter); true → the help
   * is tucked behind an "i" tip beside each label (coherent). null → off.
   */
  coherentForm?: boolean | null
  /**
   * Render a fixed three-button toolbar in the app (the coherence tooltip
   * walk-through anchors its tooltip to the active button). false → verbose
   * tooltip; true → crisp. null → no toolbar.
   */
  tooltipTour?: boolean | null
  /**
   * Temporal-contiguity nudge. 'wrong' → the nudge fires immediately, whatever
   * tab you're on. 'right' → it appears only when you land on Tab 2. null → no
   * nudge.
   */
  nudgeTiming?: 'wrong' | 'right' | null
}

function Bar({ className = '' }: { className?: string }) {
  return <div className={`rounded bg-grey-200 ${className}`} />
}

/** A pulsing accent beacon anchored to a card corner. */
function Beacon() {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="absolute -right-1.5 -top-1.5 grid h-3.5 w-3.5 place-items-center"
    >
      <motion.span
        className="absolute inset-0 rounded-full bg-accent"
        animate={{ scale: [1, 2.6], opacity: [0.45, 0] }}
        transition={{ duration: 1.8, ease: 'easeOut', repeat: Infinity }}
      />
      <motion.span
        className="absolute inset-0 rounded-full bg-accent"
        animate={{ scale: [1, 2.6], opacity: [0.45, 0] }}
        transition={{
          duration: 1.8,
          ease: 'easeOut',
          repeat: Infinity,
          delay: 0.9,
        }}
      />
      <span className="relative h-2.5 w-2.5 rounded-full bg-accent shadow-[0_0_0_3px_rgba(255,107,61,0.18)]" />
    </motion.span>
  )
}

/**
 * A circular info icon that reveals a tooltip on hover. `placement` decides
 * which side the bubble pops out of so it never clips the stage edge.
 */
function InfoTip({
  children,
  placement = 'bottom',
  big = false,
}: {
  children: React.ReactNode
  placement?: 'bottom' | 'right'
  big?: boolean
}) {
  const [open, setOpen] = useState(false)
  const pos =
    placement === 'right'
      ? 'left-full top-1/2 ml-2 -translate-y-1/2'
      : 'left-1/2 top-full mt-2 -translate-x-1/2'
  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <span
        className={`grid h-[18px] w-[18px] place-items-center rounded-full text-grey-400 transition-colors ${
          open ? 'text-accent' : 'hover:text-grey-600'
        }`}
      >
        <Info size={15} strokeWidth={2} />
      </span>
      <AnimatePresence>
        {open && (
          <motion.span
            initial={{ opacity: 0, scale: 0.94, y: placement === 'right' ? 0 : -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className={`absolute z-40 origin-top rounded-xl bg-ink px-3.5 py-3 text-left text-white shadow-float ${pos} ${
              big ? 'w-72' : 'w-52'
            }`}
          >
            {children}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  )
}

/**
 * A real form field that sits in the app (not a floating card). On hover it
 * shows a tooltip: generic when `contextual` is false (just describes the
 * field), or the live record when true (the contiguity payload, in place).
 */
function ContextField({ contextual }: { contextual: boolean }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="space-y-2">
      <span className="text-[11px] font-medium text-grey-500">
        Adoption status
      </span>
      <div
        className="relative"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <div className="flex h-9 w-full cursor-help items-center gap-2 rounded-lg border border-accent/60 bg-white px-3 text-[12.5px] text-ink shadow-[0_0_0_3px_theme(colors.accent.ring)]">
          <Info size={14} className="text-accent" strokeWidth={2.25} />
          At-risk · low usage
        </div>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="absolute left-0 top-full z-40 mt-2 w-72 origin-top rounded-xl bg-ink px-4 py-3 text-left text-white shadow-float"
            >
              {contextual ? (
                <div className="space-y-2 text-[12.5px] leading-snug">
                  <TipRow k="Account" v="Northwind Trading Co." />
                  <TipRow k="Owner" v="Priya Menon" />
                  <TipRow k="Adopted on" v="Mar 4, 2026" />
                  <TipRow k="Last active" v="11 days ago" />
                </div>
              ) : (
                <p className="text-[12.5px] leading-snug text-white/80">
                  This field shows the account’s adoption status.{' '}
                  <span className="text-white underline">Learn more</span> about
                  how it’s calculated.
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function TipRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="text-white/55">{k}</span>
      <span className="font-medium text-white">{v}</span>
    </div>
  )
}

const FORM_FIELDS = [
  {
    label: 'Contract value',
    help: 'Enter the total contract value in your account’s base currency, excluding tax. If the agreement spans multiple years, use the full committed amount across the entire term, not the annual figure, and round to the nearest whole unit.',
  },
  {
    label: 'Effective date',
    help: 'The date the contract legally takes effect. This may differ from the signature date; use the date specified in the agreement itself, and if no date is given, default to the first day of the billing cycle following signature.',
  },
  {
    label: 'Renewal terms',
    help: 'Describe how this contract renews. Specify whether it auto-renews or requires manual action, the notice period for cancellation, and any price escalators that apply at each renewal so downstream teams can plan ahead.',
  },
]

interface TourStep {
  target: string
  title: string
  verbose: string
  crisp: string
  note: string
}

const TOUR_STEPS: TourStep[] = [
  {
    target: 'New report',
    title: 'Create a report',
    verbose:
      'Click this button to start a new report. Use this whenever you need to generate a fresh analytics view from scratch, including when you are duplicating an existing layout, starting a quarterly summary, or building a one-off export for a stakeholder who has requested specific figures in a particular format.',
    crisp: 'Click to start a new report.',
    note: 'Reports can be duplicated from an existing layout.',
  },
  {
    target: 'Data source',
    title: 'Pick a data source',
    verbose:
      'Select the data source that feeds this report. You can choose from connected warehouses, uploaded files, or live integrations, and you may combine multiple sources, apply filters before they load, and set a refresh cadence that determines how often the underlying numbers are pulled in.',
    crisp: 'Choose where the data comes from.',
    note: 'You can combine multiple sources and set a refresh cadence.',
  },
  {
    target: 'Share',
    title: 'Share it',
    verbose:
      'Use this to share the finished report. Sharing supports per-person permissions, public links with optional expiry, scheduled email digests, and embedding in other tools, and every recipient can be given view-only or edit access depending on the role you assign them here.',
    crisp: 'Share the finished report.',
    note: 'Supports per-person permissions and scheduled digests.',
  },
]

/**
 * A real toolbar that lives in the app. The walk-through tooltip is anchored to
 * the active toolbar button (with a beak), so the targets are part of the UI
 * and only the tooltip appears on reveal.
 */
function TooltipTour({ crisp }: { crisp: boolean }) {
  const [step, setStep] = useState(0)
  // The tour is summoned by clicking anywhere on the canvas (not the toolbar
  // buttons). The toolbar itself is always part of the UI.
  const [revealed, setRevealed] = useState(false)
  const s = TOUR_STEPS[step]
  const last = step === TOUR_STEPS.length - 1
  const ease = [0.22, 1, 0.36, 1] as const

  return (
    <>
      {/* Click-anywhere-to-start layer, covering the whole app frame. */}
      {!revealed && (
        <button
          type="button"
          aria-label="Start the tour"
          onClick={() => {
            setStep(0)
            setRevealed(true)
          }}
          className="absolute inset-0 z-30 cursor-pointer"
        />
      )}

      <div className="mb-5 flex items-center gap-2.5">
        {TOUR_STEPS.map((st, i) => {
          const active = revealed && i === step
          return (
            <div key={st.target} className="relative">
              <button
                onClick={() => revealed && setStep(i)}
                className={`rounded-lg border px-3.5 py-2 text-[12.5px] font-medium transition-colors ${
                  active
                    ? 'border-accent bg-white text-ink shadow-[0_0_0_3px_theme(colors.accent.ring)]'
                    : 'border-grey-200 bg-grey-50 text-grey-500 hover:text-grey-700'
                }`}
              >
                {st.target}
              </button>

            <AnimatePresence>
              {active && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.97, y: 6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.22, ease }}
                  className="absolute left-0 top-full z-40 mt-3 w-[320px] rounded-2xl bg-white p-5 shadow-pop ring-1 ring-grey-200/50"
                >
                  {/* Beak pointing up at the button */}
                  <div className="absolute -top-1.5 left-6 h-3 w-3 rotate-45 rounded-[3px] border-l border-t border-grey-200/50 bg-white" />

                  <button
                    aria-label="Dismiss"
                    onClick={(e) => {
                      e.stopPropagation()
                      setRevealed(false)
                    }}
                    className="absolute right-3 top-3 grid h-6 w-6 place-items-center rounded-lg text-grey-300 transition-colors hover:bg-grey-100 hover:text-grey-600"
                  >
                    <X size={14} strokeWidth={2.25} />
                  </button>

                  <p className="text-[10.5px] font-semibold uppercase tracking-wide text-accent">
                    Step {step + 1} of {TOUR_STEPS.length}
                  </p>
                  {/* The crisp instruction line is the heading itself — no
                      separate title or body, one fewer line to read. */}
                  <h4 className="mt-1.5 pr-5 text-[14px] font-semibold tracking-[-0.01em] text-ink">
                    {s.crisp}
                  </h4>

                  {crisp ? (
                    <p className="mt-1.5 text-[12px] italic leading-relaxed text-grey-400">
                      Note: {s.note}{' '}
                      <span className="cursor-pointer font-medium not-italic text-accent">
                        (Learn more)
                      </span>
                    </p>
                  ) : (
                    <p className="mt-1.5 text-[12.5px] leading-relaxed text-grey-500">
                      {s.verbose}
                    </p>
                  )}

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex gap-1">
                      {TOUR_STEPS.map((_, i) => (
                        <span
                          key={i}
                          className={`h-1.5 rounded-full transition-all ${
                            i === step ? 'w-4 bg-accent' : 'w-1.5 bg-grey-200'
                          }`}
                        />
                      ))}
                    </div>
                    <button
                      onClick={() =>
                        last ? setRevealed(false) : setStep((p) => p + 1)
                      }
                      className="inline-flex items-center gap-1.5 rounded-lg bg-ink px-3.5 py-2 text-[12.5px] font-medium text-white"
                    >
                      {last ? 'Done' : 'Next'}
                      {!last && <ArrowRight size={13} strokeWidth={2.25} />}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            </div>
          )
        })}
      </div>
    </>
  )
}

/**
 * A contract form whose labels carry help text.
 * Verbose → three lines of static help under every label (clutter).
 * Coherent → the help is tucked behind an "i" tip beside each label.
 */
function CoherenceForm({ coherent }: { coherent: boolean }) {
  return (
    <div>
      <h3 className="mb-1 text-[14px] font-semibold tracking-[-0.01em] text-ink">
        New contract
      </h3>
      <p className="mb-5 text-[12px] text-grey-400">
        Fill in the details to create the contract.
      </p>

      <div className={coherent ? 'space-y-4' : 'divide-y divide-grey-100'}>
        {FORM_FIELDS.map((f) => (
          <div key={f.label} className={coherent ? '' : 'py-4 first:pt-0'}>
            <div className="mb-1.5 flex items-center gap-1.5">
              <span className="text-[12px] font-medium text-grey-600">
                {f.label}
              </span>
              {coherent && (
                <InfoTip placement="right">
                  <p className="text-[12px] leading-snug text-white/85">
                    {f.help}
                  </p>
                </InfoTip>
              )}
            </div>
            {!coherent && (
              <p className="mb-2 text-[11.5px] leading-relaxed text-grey-400">
                {f.help}
              </p>
            )}
            <div className="h-9 w-full rounded-lg border border-grey-200 bg-grey-50" />
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-end gap-2.5">
        <div className="h-8 w-20 rounded-lg border border-grey-200 bg-grey-50" />
        <div className="h-8 w-24 rounded-lg bg-grey-300" />
      </div>
    </div>
  )
}

function NewBadge() {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.6, y: -4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.6, y: -4 }}
      transition={{ type: 'spring', stiffness: 320, damping: 26 }}
      className="absolute -right-1.5 -top-1.5 rounded-full bg-accent px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white shadow-sm"
    >
      New
    </motion.span>
  )
}

/**
 * A single-line bottom-center nudge: arrives at the right moment with an inline
 * offer to help. Centered on the content area (offsets the sidebar on sm+).
 */
function WalkthroughNudge({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-6 z-30 flex justify-center sm:pl-40">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 280, damping: 26 }}
        style={{ transformOrigin: 'bottom center' }}
        className="pointer-events-auto flex items-center gap-3 rounded-full bg-white py-2 pl-3 pr-2 shadow-pop ring-1 ring-grey-200/60"
      >
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
          <Compass size={16} strokeWidth={2} />
        </span>
        <p className="whitespace-nowrap text-[13px] text-ink">
          New to Reports?{' '}
          <span className="text-grey-500">Take a quick look around.</span>
        </p>
        <button className="shrink-0 rounded-full bg-ink px-3.5 py-1.5 text-[12.5px] font-medium text-white">
          Show me
        </button>
        <button
          aria-label="Dismiss"
          onClick={onDismiss}
          className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-grey-300 transition-colors hover:bg-grey-100 hover:text-grey-600"
        >
          <X size={15} strokeWidth={2.25} />
        </button>
      </motion.div>
    </div>
  )
}

export function SkeletonApp({
  dimmed = false,
  badges = [],
  beacon = null,
  focusField = true,
  metrics,
  tipMode = null,
  contextField = null,
  tabs = false,
  nudgeTiming = null,
  coherentForm = null,
  tooltipTour = null,
}: SkeletonAppProps) {
  // Internal tab state for the temporal-contiguity demo.
  const [tab, setTab] = useState(0)
  const [dismissed, setDismissed] = useState(false)
  // Flipping the timing toggle is a fresh intent — re-arm the nudge.
  const [seenTiming, setSeenTiming] = useState(nudgeTiming)
  if (seenTiming !== nudgeTiming) {
    setSeenTiming(nudgeTiming)
    setDismissed(false)
  }
  // Clicking a tab is a fresh "arrival", so the nudge re-triggers on every
  // tab click (whether or not it was just dismissed).
  const selectTab = (i: number) => {
    setTab(i)
    setDismissed(false)
  }
  // 'wrong' → fires on any tab (the mistimed case). 'right' → only on Reports.
  const shouldNudge =
    nudgeTiming === 'wrong' || (nudgeTiming === 'right' && tab === 1)
  const nudgeOpen = shouldNudge && !dismissed
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-grey-200/70">
      {/* Browser chrome */}
      <div className="flex items-center gap-3 border-b border-grey-100 bg-grey-50 px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-grey-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-grey-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-grey-300" />
        </div>
        <div className="ml-2 h-5 w-full max-w-sm rounded-full bg-grey-100" />
      </div>

      {/* App top bar */}
      <div className="flex items-center justify-between border-b border-grey-100 px-5 py-3">
        <div className="flex items-center gap-4">
          <div className="h-5 w-5 rounded-md bg-grey-300" />
          {tabs ? (
            <div className="flex items-center gap-1">
              {['Overview', 'Reports'].map((label, i) => (
                <button
                  key={label}
                  onClick={() => selectTab(i)}
                  className={`relative rounded-lg px-3 py-1.5 text-[12.5px] font-medium transition-colors ${
                    tab === i
                      ? 'text-ink'
                      : 'text-grey-400 hover:text-grey-600'
                  }`}
                >
                  {label}
                  {tab === i && (
                    <motion.span
                      layoutId="tab-underline"
                      className="absolute inset-x-2 -bottom-[13px] h-0.5 rounded-full bg-accent"
                      transition={{ type: 'spring', stiffness: 500, damping: 36 }}
                    />
                  )}
                </button>
              ))}
            </div>
          ) : (
            <>
              <Bar className="h-2 w-12" />
              <Bar className="h-2 w-10" />
              <Bar className="h-2 w-14" />
            </>
          )}
        </div>
        <div className="h-6 w-6 rounded-full bg-grey-200" />
      </div>

      <div className="flex min-h-0 flex-1">
        {/* Sidebar */}
        <aside className="hidden w-40 shrink-0 flex-col gap-2.5 border-r border-grey-100 px-5 py-5 sm:flex">
          <Bar className="h-2 w-20" />
          <Bar className="h-2 w-16" />
          <Bar className="h-2 w-24" />
          <div className="my-1 h-px w-full bg-grey-100" />
          <Bar className="h-2 w-14" />
          <Bar className="h-2 w-20" />
          <Bar className="h-2 w-16" />
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1 overflow-y-auto px-6 py-6">
          {tooltipTour != null && <TooltipTour crisp={tooltipTour} />}
          {coherentForm != null ? (
            <CoherenceForm coherent={coherentForm} />
          ) : tabs && tab === 1 ? (
            /* Tab 2 — a different surface (the "Reports" area). */
            <div>
              <h3 className="mb-4 text-[13px] font-semibold tracking-[-0.01em] text-ink">
                Reports
              </h3>
              <div className="rounded-2xl border border-grey-100 bg-white p-5 shadow-soft">
                <div className="mb-4 flex items-center justify-between">
                  <Bar className="h-2.5 w-24 bg-grey-300" />
                  <Bar className="h-2 w-16" />
                </div>
                {/* Faux chart */}
                <div className="flex h-32 items-end gap-2.5">
                  {[40, 65, 35, 80, 55, 70, 45, 90].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t bg-grey-200"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>
              <div className="mt-4 space-y-2.5">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-xl border border-grey-100 bg-grey-50 px-3 py-2.5"
                  >
                    <div className="h-7 w-7 rounded-lg bg-grey-200" />
                    <Bar className="h-1.5 w-32" />
                    <Bar className="ml-auto h-1.5 w-12" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
          {/* Dashboard header — carries the detached definitions affordance:
              one info icon beside the title that explains every field at once. */}
          {metrics && (
            <div className="mb-3 flex items-center gap-1.5">
              <h3 className="text-[13px] font-semibold tracking-[-0.01em] text-ink">
                Survey performance
              </h3>
              {tipMode === 'detached' && (
                <InfoTip big>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-white/55">
                    Field definitions
                  </p>
                  <ul className="mt-1.5 space-y-1.5">
                    {metrics.map((m) => (
                      <li key={m.label} className="text-[12px] leading-snug">
                        <span className="font-semibold">{m.label}</span>
                        <span className="text-white/70"> — {m.def}</span>
                      </li>
                    ))}
                  </ul>
                </InfoTip>
              )}
            </div>
          )}

          {/* Metric cards — grey bars by default; real data when `metrics` set. */}
          <div className="mb-6 grid grid-cols-3 gap-3">
            {[0, 1, 2].map((i) => {
              const badged = badges.includes(i)
              const beaconed = beacon === i
              const metric = metrics?.[i]
              return (
                <div
                  key={i}
                  className={`relative rounded-xl border bg-grey-50 p-3 transition-colors duration-300 ${
                    badged || beaconed ? 'border-accent/40' : 'border-grey-100'
                  }`}
                >
                  <AnimatePresence>{badged && <NewBadge />}</AnimatePresence>
                  <AnimatePresence>{beaconed && <Beacon />}</AnimatePresence>
                  {metric ? (
                    <>
                      <div className="mb-2 flex items-center gap-1">
                        <span className="text-[11px] font-medium uppercase tracking-wide text-grey-500">
                          {metric.label}
                        </span>
                        {tipMode === 'anchored' && (
                          <InfoTip placement="bottom">
                            <p className="text-[12px] leading-snug">
                              <span className="font-semibold">{metric.label}</span>
                              <span className="text-white/75"> — {metric.def}</span>
                            </p>
                          </InfoTip>
                        )}
                      </div>
                      <div className="text-[22px] font-semibold leading-none tracking-[-0.02em] text-ink">
                        {metric.value}
                      </div>
                      {metric.delta && (
                        <div
                          className={`mt-1.5 text-[11px] font-medium ${
                            metric.deltaGood ? 'text-good' : 'text-bad'
                          }`}
                        >
                          {metric.delta}
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <Bar className="mb-2.5 h-1.5 w-10" />
                      <Bar className="mb-2 h-4 w-16 bg-grey-300" />
                      <Bar className="h-1.5 w-12" />
                    </>
                  )}
                </div>
              )
            })}
          </div>

          {/* Form card */}
          <div className="rounded-2xl border border-grey-100 bg-white p-5 shadow-soft">
            <div className="mb-4 flex items-center justify-between">
              <Bar className="h-2.5 w-28 bg-grey-300" />
              <Bar className="h-2 w-8" />
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Bar className="h-1.5 w-16" />
                <div className="h-9 w-full rounded-lg border border-grey-200 bg-grey-50" />
              </div>

              {/* Focused field — in-flow cue, or a real contextual field. */}
              {contextField != null ? (
                <ContextField contextual={contextField} />
              ) : (
                <div className="space-y-2">
                  <Bar className="h-1.5 w-20" />
                  <div
                    className={`flex h-9 w-full items-center rounded-lg border px-3 transition-shadow duration-300 ${
                      focusField && !dimmed
                        ? 'border-accent bg-white shadow-[0_0_0_3px_theme(colors.accent.ring)]'
                        : 'border-grey-200 bg-grey-50'
                    }`}
                  >
                    <div className="h-1.5 w-32 rounded bg-grey-200" />
                    {focusField && !dimmed && (
                      <span className="ml-1 h-4 w-px animate-caret bg-accent" />
                    )}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Bar className="h-1.5 w-12" />
                  <div className="h-9 w-full rounded-lg border border-grey-200 bg-grey-50" />
                </div>
                <div className="space-y-2">
                  <Bar className="h-1.5 w-12" />
                  <div className="h-9 w-full rounded-lg border border-grey-200 bg-grey-50" />
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5">
              <div className="h-8 w-20 rounded-lg border border-grey-200 bg-grey-50" />
              <div className="h-8 w-24 rounded-lg bg-grey-300" />
            </div>
          </div>
            </>
          )}
        </main>
      </div>

      {/* Temporal-contiguity nudge — slides up from the bottom of the stage. */}
      <AnimatePresence>
        {nudgeOpen && (
          <WalkthroughNudge onDismiss={() => setDismissed(true)} />
        )}
      </AnimatePresence>
    </div>
  )
}
