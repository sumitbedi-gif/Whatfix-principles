import { AnimatePresence, motion } from 'motion/react'
import {
  Info,
  Compass,
  X,
  ArrowRight,
  Clock,
  Bell,
  LifeBuoy,
  Search,
  FileText,
  Play,
  Folder,
  ChevronDown,
  Bot,
  Languages,
  ShoppingCart,
  MousePointer2,
  Check,
  ArrowLeft,
  Keyboard,
  MousePointerClick,
  Sparkles,
  ShieldAlert,
  KeyRound,
  ChevronLeft,
  CheckCircle2,
  ListChecks,
  Circle,
  Clock3,
  Compass as CompassIcon,
  GraduationCap,
  MessageSquareText,
  Star,
  PartyPopper,
  Zap,
  Video,
} from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

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
 *   - tipMode:    where field definitions live, 'detached' (one info icon by
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
  /** Latch a Smart Tip to a metric card at the given quality rung. */
  smartTipRung?: 'base' | 'good' | 'better'
  /**
   * Recognition demo 1: a real "File taxes" button in the top bar. false → no
   * cue; true → a contextual Smart Tip auto-appears latched to it.
   */
  recognitionCue?: boolean | null
  /**
   * Recognition demo 2: a real input field. false → blur shows a red format
   * error (recall); true → focus shows the format up front (recognition).
   */
  recognitionField?: boolean | null
  /**
   * Recognition demo 3: a Self-Help widget. false → a long flat list of vague,
   * cryptic items (recall); true → the same help organised into named, browsable
   * folders (recognition).
   */
  recognitionHelp?: boolean | null
  /** Jakob 1: guidance localized. false → English tips; true → user's language. */
  jakobLanguage?: boolean | null
  /** Jakob 2: help icon. false → unrecognized mascot; true → conventional "?". */
  jakobIcon?: boolean | null
  /** Jakob 3: product page + Self-Help with two flows; toggle annotates them. */
  jakobModel?: boolean | null
  /**
   * Motor 1: a typeable form. false → a step-gated Flow (click Next per field,
   * a click counter climbs); true → one container tip + per-label info icons,
   * filled in a single pass.
   */
  motorFlow?: boolean | null
  /**
   * Motor 2: the same form. false → type every field by hand; true → a flow
   * auto-fills the fields (typing animation) and the user only reviews.
   */
  motorAutofill?: boolean | null
  /**
   * Motor 3: a five-step overview tour. false → click Next/Back; true → drive
   * it with the ← / → arrow keys, no pointer journey.
   */
  motorTour?: boolean | null
  /**
   * Error-prevention 1: a 3-page form. false → the format error only surfaces
   * at submit (retrace); true → a Smart Tip validates the field as you type.
   */
  errorValidate?: boolean | null
  /**
   * Error-prevention 2: a high-blast-radius submit. false → it fires; true → a
   * blocker intercepts the click and stops the catastrophic action.
   */
  errorBlocker?: boolean | null
  /**
   * Error-prevention 3: a ticket page. false → a password ticket gets created
   * (avoidable); true → a blocker tooltip deflects to the self-serve flow.
   */
  errorDeflect?: boolean | null
  /**
   * Segmentation 1: a task-list widget. false → a flat, scattered onboarding
   * list; true → the same tasks chunked into Day 1-4 stages with progress.
   */
  segmentTasks?: boolean | null
  /**
   * Segmentation 2: a long stepped tour. false → a 40-step march, Next forever;
   * true → broken into chunks with a checkpoint after the first segment.
   */
  segmentSteps?: boolean | null
  /**
   * Autonomy 1: a flow on arrival. false → it auto-runs, forced on everyone;
   * true → a pop-up first lets the user choose which path (or to explore).
   */
  autonomyChoice?: boolean | null
  /**
   * Autonomy 2: a two-section form where Section A is already filled. false → a
   * linear flow walks every field anyway; true → it branches, skipping the done
   * section straight to submit.
   */
  autonomyBranch?: boolean | null
  /**
   * Autonomy 3: a skeleton with a profile name + task list. No toggle: clicking
   * the name to a veteran auto-hides the hand-holding task list.
   */
  autonomyDetect?: boolean | null
  /**
   * Exclusivity 1: a survey pop-up. false → a generic "take our survey" blast;
   * true → reframed as "you were specifically selected".
   */
  exclusivitySurvey?: boolean | null
  /**
   * Exclusivity 2: a welcome pop-up. false → generic "Welcome to the dashboard";
   * true → personalized by name pulled from a variable.
   */
  exclusivityWelcome?: boolean | null
  /**
   * Modality 1: Self-Help search for a quick fact. false → returns flows to run;
   * true → answers the fact inline (shimmer + typed answer) before the flows.
   */
  modalityQuickRead?: boolean | null
  /**
   * Modality 2: Self-Help search for a task. false → one article (wall of text);
   * true → the same topic as Article + Flow + Video, user picks.
   */
  modalityMulti?: boolean | null
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
                  <div className="absolute -top-[5px] left-6 z-10 h-2.5 w-2.5 rotate-45 rounded-[2px] border-l border-t border-grey-200/60 bg-white" />

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
                  {/* The crisp instruction line is the heading itself, no
                      separate title or body, one fewer line to read. */}
                  <h4 className="mt-1.5 pr-5 text-[14px] font-semibold tracking-[-0.01em] text-ink">
                    {s.crisp}
                  </h4>

                  {crisp ? (
                    <p className="mt-1.5 text-[14px] italic leading-relaxed text-grey-600">
                      Note: {s.note}{' '}
                      <span className="cursor-pointer font-medium not-italic text-accent">
                        (Learn more)
                      </span>
                    </p>
                  ) : (
                    <p className="mt-1.5 text-[14px] leading-relaxed text-grey-600">
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

/** A tiny faux analytics dashboard, drawn inline (no asset needed). */
function MiniDashboard() {
  return (
    <div className="overflow-hidden rounded-lg ring-1 ring-grey-200/70">
      <div className="flex h-5 items-center gap-1 bg-[#5b1f2e] px-2">
        <span className="h-1.5 w-1.5 rounded-full bg-white/50" />
        <span className="h-1.5 w-1.5 rounded-full bg-white/50" />
        <span className="ml-2 h-1.5 w-16 rounded bg-white/25" />
      </div>
      <div className="flex gap-2 bg-white p-2.5">
        <div className="flex flex-1 flex-col gap-1.5">
          <div className="h-1.5 w-12 rounded bg-grey-200" />
          <div className="flex items-end gap-1">
            {[40, 70, 30, 90, 55].map((h, i) => (
              <div
                key={i}
                className="w-2 rounded-sm bg-accent/70"
                style={{ height: `${h * 0.35}px` }}
              />
            ))}
          </div>
        </div>
        <div className="grid h-12 w-12 place-items-center">
          <div className="h-10 w-10 rounded-full border-[3px] border-accent/70 border-r-grey-200" />
        </div>
      </div>
    </div>
  )
}

/**
 * The Base/Good/Better Smart Tip, latched to an info icon on a metric card so
 * it points at a real element. The rung is chosen from the dock's segmented
 * control (passed in); this only renders the latched icon + tip.
 */
function SmartTipLadder({ rung }: { rung: 'base' | 'good' | 'better' }) {
  const ease = [0.22, 1, 0.36, 1] as const
  return (
    <span className="absolute -right-6 top-1/2 z-30 -translate-y-1/2">
      <span className="grid h-[18px] w-[18px] place-items-center text-grey-400">
        <Info size={15} strokeWidth={2} />
      </span>

      {/* Tip hangs below the icon, offset right with a beak over the icon. */}
      <div className="absolute left-0 top-full z-40 mt-2.5 w-[290px]">        <div className="relative rounded-xl bg-white p-4 text-left shadow-pop ring-1 ring-grey-200/60">
          <div className="absolute -top-[5px] left-2 z-10 h-2.5 w-2.5 rotate-45 rounded-[2px] border-l border-t border-grey-200/60 bg-white" style={{zIndex:10}} />
          <h4 className="text-[14px] font-semibold tracking-[-0.01em] text-ink">
            {rung === 'base' ? 'New Accounts tab' : 'New: Accounts tab'}
          </h4>

          <AnimatePresence>
            {rung === 'better' && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 10 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.35, ease }}
              >
                <MiniDashboard />
              </motion.div>
            )}
          </AnimatePresence>

          <p className="mt-2.5 text-[12.5px] leading-relaxed text-grey-600">
            {rung === 'base' ? (
              'Account-level information can be found in under this new tab.'
            ) : (
              <>
                Find your{' '}
                <span className="font-semibold text-ink">
                  account-level files, notes, contacts, and activity
                </span>{' '}
                under your new Accounts tab.
              </>
            )}
          </p>

          <div className="mt-3.5 flex items-center gap-2">
            <span className="rounded-md border border-grey-200 bg-white px-3 py-1.5 text-[12px] font-medium text-grey-600">
              Close
            </span>
            <span className="rounded-md bg-[#1f5fbf] px-3 py-1.5 text-[12px] font-medium text-white">
              Show me
            </span>
          </div>
        </div>
      </div>
    </span>
  )
}

/**
 * Recognition demo 1, the OFF state: a vague generic reminder pop-up, centred
 * and unanchored. It only says "remember", leaving where/how/when to recall.
 * Summoned by clicking the canvas, then dismissable.
 */
function GenericReminder({ onDismiss }: { onDismiss: () => void }) {
  const ease = [0.22, 1, 0.36, 1] as const
  return (
    <motion.div
      className="absolute inset-0 z-30 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease }}
    >
      <div
        className="absolute inset-0 rounded-2xl bg-ink/20 backdrop-blur-[2px]"
        onClick={onDismiss}
      />
      <motion.div
        className="relative w-[320px] rounded-2xl bg-white p-6 text-center shadow-pop ring-1 ring-grey-200/50"
        initial={{ opacity: 0, scale: 0.96, y: 6 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.3, ease }}
      >
        <button
          aria-label="Dismiss"
          onClick={onDismiss}
          className="absolute right-3 top-3 grid h-7 w-7 place-items-center rounded-lg text-grey-400 transition-colors hover:bg-grey-100 hover:text-ink"
        >
          <X size={15} strokeWidth={2.25} />
        </button>
        <span className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-grey-100 text-grey-400">
          <Bell size={18} strokeWidth={2} />
        </span>
        <h4 className="mt-3 text-[16px] font-semibold tracking-[-0.01em] text-ink">
          Don’t forget to file your taxes
        </h4>
        <p className="mt-1.5 text-[13px] leading-relaxed text-grey-500">
          The deadline is coming up soon. Make sure you complete your filing on
          time.
        </p>
        <button
          onClick={onDismiss}
          className="mt-4 inline-block rounded-lg bg-ink px-4 py-2 text-[13px] font-medium text-white"
        >
          Got it
        </button>
      </motion.div>
    </motion.div>
  )
}

/**
 * Recognition demo 1: a real "File taxes" action button that lives in the top
 * bar. When `better`, a contextual Smart Tip auto-appears latched to it, with
 * the next step and deadline, so the user recognises rather than recalls.
 */
function RecognitionCue({
  better,
  revealed,
}: {
  better: boolean
  revealed: boolean
}) {
  const ease = [0.22, 1, 0.36, 1] as const
  return (
    <span className="relative">
      {/* The button is always present, in a plain outline style. */}
      <span className="inline-flex items-center rounded-lg border border-grey-300 px-3 py-1.5 text-[12.5px] font-medium text-grey-600">
        File taxes
      </span>

      <AnimatePresence>
        {better && revealed && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3, ease }}
            className="absolute left-0 top-full z-40 mt-2.5 w-[260px]"
          >            <div className="relative rounded-xl bg-white p-4 text-left shadow-pop ring-1 ring-grey-200/60">
              <div className="absolute -top-[5px] left-6 z-10 h-2.5 w-2.5 rotate-45 rounded-[2px] border-l border-t border-grey-200/60 bg-white" style={{zIndex:10}} />
              <div className="flex items-center gap-1.5">
                <Clock size={13} className="text-accent" strokeWidth={2.25} />
                <span className="text-[11px] font-semibold uppercase tracking-wide text-accent">
                  3 days left
                </span>
              </div>
              <h4 className="mt-1.5 text-[14px] font-semibold tracking-[-0.01em] text-ink">
                Start filing your taxes
              </h4>
              <p className="mt-1 text-[12.5px] leading-relaxed text-grey-600">
                Pick up where you left off. It takes about ten minutes.
              </p>
              <div className="mt-3">
                <span className="inline-block rounded-md bg-ink px-3 py-1.5 text-[12px] font-medium text-white">
                  Start now
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  )
}

/**
 * Recognition demo 2: a real input field. By default, blurring it shows a red
 * "Incorrect format" error (the user had to recall the format). When `better`,
 * focusing it shows the expected format up front, so they recognise it.
 */
function RecognitionField({ better }: { better: boolean }) {
  const [value, setValue] = useState('')
  const [focused, setFocused] = useState(false)
  const [touched, setTouched] = useState(false)
  const ease = [0.22, 1, 0.36, 1] as const
  // Valid format: ABC-12345 (3 letters, dash, 5 digits).
  const valid = /^[A-Za-z]{3}-\d{5}$/.test(value.trim())
  const showError = !better && touched && !focused && value.trim() !== '' && !valid

  return (
    <div className="w-[300px]">
      <span className="mb-1.5 block text-[12px] font-medium text-grey-600">
        Policy number
      </span>
      <div className="relative">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => {
            setFocused(true)
            setTouched(true)
          }}
          onBlur={() => setFocused(false)}
          placeholder="Enter your policy number"
          className={`h-9 w-full rounded-lg border px-3 text-[13px] text-ink outline-none transition-colors placeholder:text-grey-300 ${
            showError
              ? 'border-bad bg-bad/5 ring-2 ring-bad/15'
              : focused
                ? 'border-accent ring-2 ring-accent/15'
                : 'border-grey-200 bg-grey-50'
          }`}
        />

        {/* Format Smart Tip, shown on focus in the better version. */}
        <AnimatePresence>
          {better && focused && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.22, ease }}
              className="absolute left-0 top-full z-40 mt-2.5 w-full"
            >              <div className="relative rounded-xl bg-white p-3.5 text-left shadow-pop ring-1 ring-grey-200/60">
                <div className="absolute -top-[5px] left-6 z-10 h-2.5 w-2.5 rotate-45 rounded-[2px] border-l border-t border-grey-200/60 bg-white" style={{zIndex:10}} />
                <p className="text-[12.5px] leading-relaxed text-grey-600">
                  Use the format{' '}
                  <span className="rounded bg-grey-100 px-1.5 py-0.5 font-mono text-[12px] font-medium text-ink">
                    ABC-12345
                  </span>{' '}
                  , three letters, a dash, then five digits.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* The after-the-fact error, in the recall version. */}
      <AnimatePresence>
        {showError && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease }}
            className="mt-1.5 text-[12px] font-medium text-bad"
          >
            Incorrect format. Please check and try again.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

/* Recognition demo 3, the OFF state: a flat scroll of vague, cryptic items. */
const HELP_FLAT = [
  'Form 1040-B',
  'TXN config',
  'Acct setup 2',
  'Link param ref',
  'Pwd policy v3',
  'W-2 import (legacy)',
  'Refund status API',
  'Doc upload v2',
  'Filing draft autosave',
  'Sched C addendum',
  'eSign setup',
  'Deduction matrix',
  '2FA reset flow',
  'State return sync',
  'Prior-year rollover',
]

/* Recognition demo 3, the ON state: the same help, in named folders. */
const HELP_FOLDERS: {
  name: string
  items: { icon: 'article' | 'video'; label: string }[]
}[] = [
  {
    name: 'File taxes',
    items: [
      { icon: 'article', label: 'Start a new filing' },
      { icon: 'video', label: 'Upload last year’s return' },
      { icon: 'article', label: 'Check your refund status' },
    ],
  },
  {
    name: 'Reset your password',
    items: [
      { icon: 'article', label: 'Change your password' },
      { icon: 'video', label: 'Set up two-factor login' },
    ],
  },
  {
    name: 'Know your link',
    items: [
      { icon: 'article', label: 'What a filing link is' },
      { icon: 'article', label: 'Share a link with your accountant' },
      { icon: 'video', label: 'Set a link to expire' },
    ],
  },
  {
    name: 'Documents',
    items: [
      { icon: 'article', label: 'Import a W-2' },
      { icon: 'video', label: 'Upload a supporting document' },
    ],
  },
]

/**
 * Recognition demo 3: a Self-Help widget on the tax page. Off, a long flat
 * scroll of cryptic items, you must recall the exact name. On, the same help
 * sits in clean, named, expandable folders, so you browse and recognise.
 */
function RecognitionHelp({ folders }: { folders: boolean }) {
  const ease = [0.22, 1, 0.36, 1] as const
  const [open, setOpen] = useState(true)
  const [expanded, setExpanded] = useState<string | null>('File taxes')

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            className="absolute bottom-[76px] right-4 z-30 flex max-h-[440px] w-[320px] flex-col overflow-hidden rounded-2xl bg-white shadow-pop ring-1 ring-grey-200/50"
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ duration: 0.26, ease }}
            style={{ transformOrigin: 'bottom right' }}
          >
            <div className="flex items-center justify-between border-b border-grey-100 px-4 py-3">
              <div className="flex items-center gap-2">
                <LifeBuoy size={16} className="text-accent" strokeWidth={2} />
                <span className="text-[13.5px] font-semibold text-ink">
                  Self Help
                </span>
              </div>
              <button
                aria-label="Close"
                onClick={() => setOpen(false)}
                className="grid h-6 w-6 place-items-center rounded-md text-grey-400 transition-colors hover:bg-grey-100 hover:text-ink"
              >
                <X size={14} strokeWidth={2.25} />
              </button>
            </div>

            <div className="flex items-center gap-2 border-b border-grey-100 px-4 py-2.5">
              <Search size={14} className="text-grey-400" strokeWidth={2} />
              <span className="text-[12.5px] text-grey-400">
                {folders ? 'Search or browse below…' : 'Search for help…'}
              </span>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-1.5 py-2">
              {folders ? (
                HELP_FOLDERS.map((f) => {
                  const isOpen = expanded === f.name
                  return (
                    <div key={f.name}>
                      <button
                        onClick={() =>
                          setExpanded((cur) => (cur === f.name ? null : f.name))
                        }
                        className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-grey-50"
                      >
                        <Folder
                          size={15}
                          className="shrink-0 text-accent"
                          strokeWidth={2}
                        />
                        <span className="flex-1 text-[13px] font-medium text-ink">
                          {f.name}
                        </span>
                        <span className="text-[11px] text-grey-400">
                          {f.items.length}
                        </span>
                        <ChevronDown
                          size={14}
                          className={`shrink-0 text-grey-400 transition-transform ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease }}
                            className="overflow-hidden"
                          >
                            <div className="space-y-0.5 pb-1 pl-6 pr-1">
                              {f.items.map((it) => (
                                <button
                                  key={it.label}
                                  className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left transition-colors hover:bg-grey-50"
                                >
                                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-accent-soft text-accent">
                                    {it.icon === 'video' ? (
                                      <Play size={12} strokeWidth={2} />
                                    ) : (
                                      <FileText size={12} strokeWidth={2} />
                                    )}
                                  </span>
                                  <span className="text-[12.5px] text-grey-700">
                                    {it.label}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })
              ) : (
                <div className="space-y-0.5">
                  {HELP_FLAT.map((label, i) => (
                    <button
                      key={label}
                      className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-grey-50"
                    >
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-grey-100 text-grey-400">
                        {i % 3 === 0 ? (
                          <Play size={12} strokeWidth={2} />
                        ) : (
                          <FileText size={12} strokeWidth={2} />
                        )}
                      </span>
                      <span className="text-[12.5px] text-grey-500">{label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* The Self-Help FAB. */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="absolute bottom-4 right-4 z-30 grid h-12 w-12 place-items-center rounded-full bg-accent text-white shadow-float transition-transform hover:scale-105"
        aria-label="Self Help"
      >
        {open ? (
          <X size={20} strokeWidth={2.25} />
        ) : (
          <LifeBuoy size={20} strokeWidth={2} />
        )}
      </button>
    </>
  )
}

/* ── Jakob 1 ── Speak their language ──────────────────────────────────────── */
const JAKOB_FIELDS = [
  {
    label: 'Account name',
    en: { title: 'Account name', body: 'Enter the legal name on the account.' },
    xx: {
      title: 'Kontoname',
      body: 'Geben Sie den rechtlichen Namen des Kontos ein.',
    },
  },
  {
    label: 'Tax region',
    en: { title: 'Tax region', body: 'Choose the region where you file taxes.' },
    xx: {
      title: 'Steuerregion',
      body: 'Wählen Sie die Region, in der Sie Steuern zahlen.',
    },
  },
  {
    label: 'Filing date',
    en: { title: 'Filing date', body: 'The date your return is due.' },
    xx: {
      title: 'Abgabedatum',
      body: 'Das Datum, an dem Ihre Erklärung fällig ist.',
    },
  },
]

/**
 * Jakob 1: a stepped walk-through (like the coherence tour) over three form
 * fields. You step Next/Back through the tooltips; toggling flips the language
 * inside the tooltip from English to the user's own.
 */
function JakobLanguage({ localized }: { localized: boolean }) {
  const ease = [0.22, 1, 0.36, 1] as const
  const [step, setStep] = useState(0)
  const last = step === JAKOB_FIELDS.length - 1
  const first = step === 0

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-[14px] font-semibold tracking-[-0.01em] text-ink">
            Account details
          </h3>
          <p className="text-[12px] text-grey-400">
            Fill in the details to continue.
          </p>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[12px] font-medium transition-colors ${
            localized
              ? 'border-accent/40 bg-accent-soft text-accent'
              : 'border-grey-200 text-grey-500'
          }`}
        >
          <Languages size={13} strokeWidth={2} />
          {localized ? 'Deutsch' : 'English'}
        </span>
      </div>

      <div className="space-y-4">
        {JAKOB_FIELDS.map((f, i) => {
          const active = i === step
          const t = localized ? f.xx : f.en
          return (
            <div key={f.label} className="relative space-y-1.5">
              <span className="text-[12px] font-medium text-grey-600">
                {f.label}
              </span>
              <div
                className={`h-9 w-[300px] rounded-lg border px-3 transition-shadow ${
                  active
                    ? 'border-accent bg-white shadow-[0_0_0_3px_theme(colors.accent.ring)]'
                    : 'border-grey-200 bg-grey-50'
                }`}
              />

              {/* The stepped tooltip, latched to the active field. */}
              <AnimatePresence>
                {active && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.24, ease }}
                    className="absolute left-[320px] top-0 z-40 w-[280px]"
                  >
                    <div className="relative rounded-xl bg-white p-4 shadow-pop ring-1 ring-grey-200/60">
                      <div className="absolute -left-[5px] top-7 z-10 h-2.5 w-2.5 rotate-45 rounded-[2px] border-b border-l border-grey-200/60 bg-white" />
                      <p className="text-[10.5px] font-semibold uppercase tracking-wide text-accent">
                        Step {step + 1} of {JAKOB_FIELDS.length}
                      </p>
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={localized ? 'xx' : 'en'}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.2, ease }}
                        >
                          <h4 className="mt-1 text-[14px] font-semibold tracking-[-0.01em] text-ink">
                            {t.title}
                          </h4>
                          <p className="mt-1 text-[12.5px] leading-relaxed text-grey-600">
                            {t.body}
                          </p>
                        </motion.div>
                      </AnimatePresence>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex gap-1">
                          {JAKOB_FIELDS.map((_, j) => (
                            <span
                              key={j}
                              className={`h-1.5 rounded-full transition-all ${
                                j === step ? 'w-4 bg-accent' : 'w-1.5 bg-grey-200'
                              }`}
                            />
                          ))}
                        </div>
                        <div className="flex items-center gap-1.5">
                          {!first && (
                            <button
                              onClick={() => setStep((p) => p - 1)}
                              className="rounded-lg px-2.5 py-1.5 text-[12px] font-medium text-grey-400 transition-colors hover:text-ink"
                            >
                              Back
                            </button>
                          )}
                          <button
                            onClick={() => !last && setStep((p) => p + 1)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-ink px-3.5 py-1.5 text-[12px] font-medium text-white"
                          >
                            {last ? 'Done' : 'Next'}
                            {!last && <ArrowRight size={12} strokeWidth={2.25} />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/** A help icon latched beside a field label: a robot mascot (unrecognized) or
 *  the conventional "i" (recognized), with a tooltip on hover. */
function JakobHelpIcon({
  conventional,
  jargon,
  plain,
}: {
  conventional: boolean
  jargon: string
  plain: string
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span
        className={`grid h-[18px] w-[18px] place-items-center rounded-full transition-colors ${
          conventional
            ? 'text-grey-400 hover:text-grey-600'
            : 'text-grey-500 ring-1 ring-grey-300'
        }`}
      >
        <AnimatePresence mode="wait" initial={false}>
          {conventional ? (
            <motion.span
              key="info"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.2 }}
            >
              <Info size={15} strokeWidth={2} />
            </motion.span>
          ) : (
            <motion.span
              key="bot"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.2 }}
            >
              <Bot size={13} strokeWidth={2} />
            </motion.span>
          )}
        </AnimatePresence>
      </span>
      <AnimatePresence>
        {hovered && (
          <motion.span
            initial={{ opacity: 0, scale: 0.94, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-1/2 top-full z-40 mt-2 w-60 origin-top -translate-x-1/2 rounded-xl bg-ink px-3.5 py-3 text-left text-[12px] leading-snug text-white shadow-float"
          >
            {conventional ? plain : jargon}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  )
}

const JAKOB_ICON_FIELDS = [
  {
    label: 'Billing address',
    jargon:
      'Primary AR-side remittance locus per the entity’s GL mapping; drives invoice routing and tax-nexus resolution downstream.',
    plain: 'The address your invoices are sent to.',
  },
  {
    label: 'Cost centre',
    jargon:
      'The CC dimension keyed to the org hierarchy node for P&L attribution and intercompany cross-charge allocation.',
    plain: 'The internal code this spend is booked against.',
  },
  {
    label: 'Approval chain',
    jargon:
      'Sequential approver topology enforced by the DOA matrix; gates submission via threshold-based escalation policies.',
    plain: 'Who signs off before this is submitted.',
  },
]

/**
 * Jakob 2: three fields, each with a latched help icon. Off, the icon is a
 * branded robot mascot users don't read as help, so it's invisible. Toggle, and
 * each becomes the conventional "i" everyone already recognises.
 */
function JakobIcon({ conventional }: { conventional: boolean }) {
  return (
    <div>
      <div className="mb-5">
        <h3 className="text-[14px] font-semibold tracking-[-0.01em] text-ink">
          Expense setup
        </h3>
        <p className="text-[12px] text-grey-400">
          {conventional
            ? 'Hover the “i” beside any field for help, in plain words.'
            : 'There’s help on each field, if you can spot it, and parse it.'}
        </p>
      </div>

      <div className="space-y-5">
        {JAKOB_ICON_FIELDS.map((f) => (
          <div key={f.label} className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <span className="text-[12px] font-medium text-grey-600">
                {f.label}
              </span>
              <JakobHelpIcon
                conventional={conventional}
                jargon={f.jargon}
                plain={f.plain}
              />
            </div>
            <div className="h-9 w-[300px] rounded-lg border border-grey-200 bg-grey-50" />
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Jakob 3 ── Don't fight an existing model (store + Self-Help flows) ────── */
const CATALOG = ['Aspen Mug', 'Birch Bottle', 'Cedar Tote', 'Drift Cap']
const REFERRAL_CODE = 'WELCOME10'

/**
 * Jakob 3: a tiny store with a shared product page. Self-Help holds two flows
 * over the SAME interface. The redundant one walks you through "Add to cart"
 * (everyone owns that model). The worth-it one teaches a genuinely novel step:
 * a referral code field, with a tip that appears the moment you focus it. The
 * toggle marks which flow earns the help budget.
 */
function JakobModel({ annotate }: { annotate: boolean }) {
  const ease = [0.22, 1, 0.36, 1] as const
  const [helpOpen, setHelpOpen] = useState(true)
  const [flow, setFlow] = useState<null | 'cart' | 'referral'>(null)
  const [page, setPage] = useState<'catalog' | 'product'>('catalog')
  const [selected, setSelected] = useState<number | null>(null)
  const [added, setAdded] = useState(false)
  // Referral flow state:
  const [showCode, setShowCode] = useState(false)
  const [codeFocused, setCodeFocused] = useState(false)
  const [code, setCode] = useState('')
  const [applied, setApplied] = useState(false)

  const reset = () => {
    setFlow(null)
    setPage('catalog')
    setSelected(null)
    setAdded(false)
    setShowCode(false)
    setCodeFocused(false)
    setCode('')
    setApplied(false)
  }
  const startFlow = (f: 'cart' | 'referral') => {
    reset()
    setFlow(f)
  }
  const item = selected != null ? CATALOG[selected] : null

  return (
    <>
      {page === 'catalog' ? (
        /* Catalog: both flows start here, pick a product to open its page. */
        <div>
          <h3 className="mb-1 text-[14px] font-semibold tracking-[-0.01em] text-ink">
            Shop
          </h3>
          <p className="mb-4 text-[12px] text-grey-400">
            Pick a product to open it.
          </p>
          <div className="grid grid-cols-4 gap-3">
            {CATALOG.map((name, i) => (
              <button
                key={name}
                onClick={() => {
                  setSelected(i)
                  setPage('product')
                }}
                className="rounded-xl border border-grey-100 bg-grey-50 p-2.5 text-left transition-colors hover:border-grey-300"
              >
                <div className="mb-2 aspect-square rounded-lg bg-grey-100" />
                <p className="truncate text-[11.5px] font-medium text-ink">
                  {name}
                </p>
                <p className="text-[11px] text-grey-400">$24</p>
              </button>
            ))}
          </div>

          {/* Tooltip nudging the user to pick a product (either flow). */}
          <AnimatePresence>
            {flow !== null && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.26, ease }}
                className="relative mt-4 w-[260px]"
              >
                <div className="absolute -top-[5px] left-8 z-10 h-2.5 w-2.5 rotate-45 rounded-[2px] border-l border-t border-grey-200/60 bg-white" />
                <div className="rounded-xl bg-white p-4 shadow-pop ring-1 ring-grey-200/60">
                  <p className="text-[10.5px] font-semibold uppercase tracking-wide text-accent">
                    {flow === 'cart' ? 'How to add to cart' : 'Apply a referral code'}
                  </p>
                  <h4 className="mt-1 text-[14px] font-semibold tracking-[-0.01em] text-ink">
                    Pick a product
                  </h4>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-grey-600">
                    Select any product to open its page.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        /* Shared product-detail page in a familiar storefront layout. */
        <div>
          <button
            onClick={() => setPage('catalog')}
            className="mb-3 inline-flex items-center gap-1 text-[12px] text-grey-400 transition-colors hover:text-ink"
          >
            <ArrowLeft size={13} strokeWidth={2} />
            Back to shop
          </button>

          <div className="grid grid-cols-[120px_1fr] gap-5">
            {/* Gallery */}
            <div className="space-y-2">
              <div className="aspect-square rounded-xl bg-grey-100" />
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-7 w-7 rounded-md bg-grey-100" />
                ))}
              </div>
            </div>

            {/* Details */}
            <div className="relative">
              <p className="text-[15px] font-semibold tracking-[-0.01em] text-ink">
                {item}
              </p>
              <div className="mt-1.5 flex items-center gap-1">
                {[0, 1, 2, 3].map((i) => (
                  <Bar key={i} className="h-2 w-2 rounded-full bg-grey-200" />
                ))}
                <Bar className="ml-1.5 h-1.5 w-16" />
              </div>
              <p className="mt-3 text-[18px] font-semibold text-ink">$24.00</p>
              <div className="mt-3 space-y-1.5">
                <Bar className="h-1.5 w-full" />
                <Bar className="h-1.5 w-5/6" />
                <Bar className="h-1.5 w-2/3" />
              </div>

              {/* Buy buttons, the cart flow latches to this row. */}
              <div className="relative mt-5 flex items-center gap-2.5">
                <button
                  onClick={() => flow === 'cart' && setAdded(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-ink px-4 py-2.5 text-[13px] font-medium text-white"
                >
                  <ShoppingCart size={15} strokeWidth={2} />
                  Add to cart
                </button>
                <button className="rounded-lg border border-grey-300 px-4 py-2.5 text-[13px] font-medium text-grey-700">
                  Buy now
                </button>

                <AnimatePresence>
                  {flow === 'cart' && !added && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.26, ease }}
                      className="absolute left-0 top-full z-40 mt-2.5 w-[260px]"
                    >
                      <div className="absolute -top-[5px] left-8 z-10 h-2.5 w-2.5 rotate-45 rounded-[2px] border-l border-t border-grey-200/60 bg-white" />
                      <div className="rounded-xl bg-white p-4 shadow-pop ring-1 ring-grey-200/60">
                        <p className="text-[10.5px] font-semibold uppercase tracking-wide text-accent">
                          Add to cart
                        </p>
                        <h4 className="mt-1 text-[14px] font-semibold tracking-[-0.01em] text-ink">
                          Click “Add to cart”
                        </h4>
                        <p className="mt-1 text-[12.5px] leading-relaxed text-grey-600">
                          That’s the whole flow. You already knew this one.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Referral code field, the novel flow latches here. */}
              <div className="relative mt-5 border-t border-grey-100 pt-4">
                {!showCode ? (
                  <div className="relative inline-flex">
                    <button
                      onClick={() => flow === 'referral' && setShowCode(true)}
                      className="rounded-lg border border-grey-300 px-3 py-2 text-[12.5px] font-medium text-grey-700 transition-colors hover:border-grey-400"
                    >
                      + Add referral code
                    </button>
                    <AnimatePresence>
                      {flow === 'referral' && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.98 }}
                          transition={{ duration: 0.26, ease }}
                          className="absolute left-0 top-full z-40 mt-2.5 w-[260px]"
                        >
                          <div className="absolute -top-[5px] left-8 z-10 h-2.5 w-2.5 rotate-45 rounded-[2px] border-l border-t border-grey-200/60 bg-white" />
                          <div className="rounded-xl bg-white p-4 shadow-pop ring-1 ring-grey-200/60">
                            <p className="text-[10.5px] font-semibold uppercase tracking-wide text-accent">
                              Apply a referral code · Step 1 of 2
                            </p>
                            <h4 className="mt-1 text-[14px] font-semibold tracking-[-0.01em] text-ink">
                              Open the referral field
                            </h4>
                            <p className="mt-1 text-[12.5px] leading-relaxed text-grey-600">
                              Click “Add referral code.” This part isn’t obvious,
                              so here’s the help.
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="relative">
                    <span className="mb-1.5 block text-[12px] font-medium text-grey-600">
                      Referral code
                    </span>
                    <div className="flex items-center gap-2">
                      <input
                        value={code}
                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                        onFocus={() => setCodeFocused(true)}
                        onBlur={() => setCodeFocused(false)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && code.trim()) setApplied(true)
                        }}
                        placeholder="Enter code"
                        className={`h-9 w-44 rounded-lg border px-3 text-[13px] uppercase text-ink outline-none transition-colors placeholder:normal-case placeholder:text-grey-300 ${
                          applied
                            ? 'border-good bg-good/5'
                            : codeFocused
                              ? 'border-accent ring-2 ring-accent/15'
                              : 'border-grey-200 bg-grey-50'
                        }`}
                      />
                      <button
                        onClick={() => code.trim() && setApplied(true)}
                        className="rounded-lg bg-ink px-3.5 py-2 text-[12.5px] font-medium text-white"
                      >
                        Apply
                      </button>
                    </div>
                    <AnimatePresence>
                      {flow === 'referral' && codeFocused && !applied && (
                        <motion.div
                          initial={{ opacity: 0, y: 6, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.98 }}
                          transition={{ duration: 0.22, ease }}
                          className="absolute left-0 top-full z-40 mt-2.5 w-[260px]"
                        >
                          <div className="absolute -top-[5px] left-6 z-10 h-2.5 w-2.5 rotate-45 rounded-[2px] border-l border-t border-grey-200/60 bg-white" />
                          <div className="rounded-xl bg-white p-3.5 shadow-pop ring-1 ring-grey-200/60">
                            <p className="text-[12.5px] leading-relaxed text-grey-600">
                              Use code{' '}
                              <span className="rounded bg-grey-100 px-1.5 py-0.5 font-mono text-[12px] font-medium text-ink">
                                {REFERRAL_CODE}
                              </span>{' '}
                              for 10% off, then press Enter.
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Flow completion: a congratulatory "Done!" popup (both flows). */}
      <AnimatePresence>
        {(added || applied) && (
          <motion.div
            className="absolute inset-0 z-40 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease }}
          >
            <div className="absolute inset-0 bg-ink/20 backdrop-blur-[2px]" />
            <motion.div
              className="relative w-[280px] rounded-2xl bg-white p-6 text-center shadow-pop ring-1 ring-grey-200/50"
              initial={{ opacity: 0, scale: 0.94, y: 6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3, ease }}
            >
              <span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-good/10 text-good">
                <Check size={22} strokeWidth={2.5} />
              </span>
              <h4 className="mt-3 text-[16px] font-semibold tracking-[-0.01em] text-ink">
                Done!
              </h4>
              <p className="mt-1 text-[13px] text-grey-500">
                {added
                  ? `You’ve added ${item ?? 'your item'} to the cart.`
                  : 'Your referral code is applied. 10% off your order.'}
              </p>
              <button
                onClick={reset}
                className="mt-4 rounded-lg bg-ink px-4 py-2 text-[13px] font-medium text-white"
              >
                Got it
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Self-Help panel with both flows. */}
      <AnimatePresence>
        {helpOpen && flow === null && (
          <motion.div
            key="help"
            className="absolute bottom-[76px] right-4 z-30 w-[300px] overflow-hidden rounded-2xl bg-white shadow-pop ring-1 ring-grey-200/50"
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ duration: 0.26, ease }}
            style={{ transformOrigin: 'bottom right' }}
          >
            <div className="flex items-center gap-2 border-b border-grey-100 px-4 py-3">
              <LifeBuoy size={16} className="text-accent" strokeWidth={2} />
              <span className="text-[13.5px] font-semibold text-ink">
                Self Help
              </span>
            </div>
            <div className="space-y-1 p-2">
              <FlowItem
                icon={<ShoppingCart size={14} strokeWidth={2} />}
                title="How to add to cart"
                meta={annotate ? 'redundant' : '1 step'}
                redundant={annotate}
                onClick={() => startFlow('cart')}
              />
              <FlowItem
                icon={<MousePointer2 size={14} strokeWidth={2} />}
                title="Apply a referral code"
                meta={annotate ? 'worth it' : '2 steps'}
                worthIt={annotate}
                onClick={() => startFlow('referral')}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Self-Help FAB / exit-flow control. */}
      <button
        onClick={() => (flow !== null ? reset() : setHelpOpen((o) => !o))}
        className="absolute bottom-4 right-4 z-30 grid h-12 w-12 place-items-center rounded-full bg-accent text-white shadow-float transition-transform hover:scale-105"
        aria-label="Self Help"
      >
        {helpOpen || flow !== null ? (
          <X size={20} strokeWidth={2.25} />
        ) : (
          <LifeBuoy size={20} strokeWidth={2} />
        )}
      </button>
    </>
  )
}

function FlowItem({
  icon,
  title,
  meta,
  redundant,
  worthIt,
  onClick,
}: {
  icon: React.ReactNode
  title: string
  meta: string
  redundant?: boolean
  worthIt?: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2.5 text-left transition-colors hover:bg-grey-50"
    >
      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-accent-soft text-accent">
        {icon}
      </span>
      <span className="min-w-0 flex-1 text-[13px] font-medium text-ink">
        {title}
      </span>
      <span
        className={`shrink-0 rounded-full px-2 py-0.5 text-[10.5px] font-semibold ${
          redundant
            ? 'bg-bad/10 text-bad'
            : worthIt
              ? 'bg-good/10 text-good'
              : 'text-grey-400'
        }`}
      >
        {meta}
      </span>
    </button>
  )
}

/* ── Motor load ── Reduce the physical cost of the task ────────────────────── */

/** The shared "Add a vendor" form: label + the help text each field carries. */
const MOTOR_FIELDS = [
  { label: 'Vendor name', help: 'The supplier’s registered business name.', fill: 'Northwind Trading' },
  { label: 'Contact email', help: 'Where invoices and notices are sent.', fill: 'ap@northwind.co' },
  { label: 'Tax ID', help: 'The vendor’s government tax identifier.', fill: 'GB-4471902' },
  { label: 'Payment terms', help: 'Days until an invoice is due.', fill: 'Net 30' },
  { label: 'Category', help: 'How this spend is classified.', fill: 'Logistics' },
  { label: 'Account code', help: 'The ledger code this is booked against.', fill: '6200-014' },
]

/** A field row whose input is real and typeable. */
function MotorInput({
  value,
  onChange,
  active,
  placeholder,
  readOnly = false,
}: {
  value: string
  onChange?: (v: string) => void
  active?: boolean
  placeholder?: string
  readOnly?: boolean
}) {
  return (
    <input
      type="text"
      value={value}
      readOnly={readOnly}
      placeholder={placeholder}
      onChange={(e) => onChange?.(e.target.value)}
      className={`h-9 w-full rounded-lg border bg-white px-3 text-[13px] text-ink outline-none transition-shadow placeholder:text-grey-300 ${
        active
          ? 'border-accent shadow-[0_0_0_3px_theme(colors.accent.ring)]'
          : 'border-grey-200 focus:border-grey-300'
      }`}
    />
  )
}

/**
 * Motor 1: a typeable "Add a vendor" form.
 *
 * OFF, a walk-through gates one field at a time: the active field is ringed and
 * a tooltip sits directly to its right (beak touching it). You type, hit Next,
 * and it moves to the next field, the click counter climbing as it goes.
 *
 * ON, the gating is gone: the same fields, an "i" beside each label, and a
 * single calm tooltip beside the form. The whole thing fills in one pass.
 */
function MotorFlow({ better }: { better: boolean }) {
  const ease = [0.22, 1, 0.36, 1] as const
  const [values, setValues] = useState<string[]>(() => MOTOR_FIELDS.map(() => ''))
  const [step, setStep] = useState(0)
  const [clicks, setClicks] = useState(0)
  const [tipDone, setTipDone] = useState(false)
  const last = step === MOTOR_FIELDS.length - 1

  const set = (i: number, v: string) =>
    setValues((prev) => prev.map((x, j) => (j === i ? v : x)))

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-[14px] font-semibold tracking-[-0.01em] text-ink">
            Add a vendor
          </h3>
          <p className="text-[12px] text-grey-400">
            {better
              ? 'Fill the form in one pass. Hover any “i” if you need help.'
              : 'The walk-through gates one field at a time.'}
          </p>
        </div>
        {/* The click counter, the visible motor cost of the gated flow. */}
        {!better && (
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-grey-200 px-2.5 py-1.5 text-[12px] font-medium text-grey-500">
            <MousePointerClick size={13} strokeWidth={2} />
            {clicks} {clicks === 1 ? 'click' : 'clicks'}
          </span>
        )}
      </div>

      {better ? (
        <MotorForm
          values={values}
          onChange={set}
          dismissed={tipDone}
          onDismiss={() => setTipDone(true)}
        />
      ) : (
        /* OFF: the gated step-flow. The form is a fixed-width container (same
           width as the ON state) and the single tooltip is absolutely
           positioned OUTSIDE it, beside the active field, so the form never
           resizes and the tooltip always sits in the same place. */
        <div className="w-[340px] space-y-4 rounded-2xl border border-grey-100 bg-white p-5 shadow-soft">
          {MOTOR_FIELDS.map((f, i) => {
            const active = i === step
            return (
              <div key={f.label} className="space-y-1.5">
                <div className="flex h-[18px] items-center">
                  <span className="text-[12px] font-medium text-grey-600">
                    {f.label}
                  </span>
                </div>
                {/* The input is the tooltip's anchor: a relative box exactly the
                    input's height, so centring the tooltip on it lands the beak
                    on the field. The tooltip is absolute, so it escapes the
                    container to the right without resizing it. */}
                <div className="relative">
                  <MotorInput
                    value={values[i]}
                    onChange={(v) => set(i, v)}
                    active={active}
                  />
                  {/* The positioning wrapper is a plain div so Framer's inline
                      transform on the motion child can't clobber the centring
                      translate. It centres the card on the input. */}
                  <div className="absolute left-[calc(100%+44px)] top-1/2 z-40 w-[260px] -translate-y-1/2">
                    <AnimatePresence>
                      {active && (
                        <motion.div
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -6 }}
                          transition={{ duration: 0.22, ease }}
                          className="relative rounded-xl bg-white p-4 shadow-pop ring-1 ring-grey-200/60"
                        >
                          <div className="absolute -left-[5px] top-1/2 z-10 h-2.5 w-2.5 -translate-y-1/2 rotate-45 rounded-[2px] border-b border-l border-grey-200/60 bg-white" />
                          <p className="text-[10.5px] font-semibold uppercase tracking-wide text-accent">
                            Step {step + 1} of {MOTOR_FIELDS.length}
                          </p>
                          <h4 className="mt-1 text-[14px] font-semibold tracking-[-0.01em] text-ink">
                            {f.label}
                          </h4>
                          <p className="mt-1 text-[12.5px] leading-relaxed text-grey-600">
                            {f.help}
                          </p>
                          <div className="mt-3 flex items-center justify-between">
                            <div className="flex gap-1">
                              {MOTOR_FIELDS.map((_, j) => (
                                <span
                                  key={j}
                                  className={`h-1.5 rounded-full transition-all ${
                                    j === step ? 'w-4 bg-accent' : 'w-1.5 bg-grey-200'
                                  }`}
                                />
                              ))}
                            </div>
                            <div className="flex items-center gap-1.5">
                              {step > 0 && (
                                <button
                                  onClick={() => {
                                    setClicks((c) => c + 1)
                                    setStep((p) => p - 1)
                                  }}
                                  className="rounded-lg px-2.5 py-1.5 text-[12px] font-medium text-grey-400 transition-colors hover:text-ink"
                                >
                                  Back
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  setClicks((c) => c + 1)
                                  setStep((p) =>
                                    p < MOTOR_FIELDS.length - 1 ? p + 1 : p,
                                  )
                                }}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-ink px-3.5 py-1.5 text-[12px] font-medium text-white"
                              >
                                {last ? 'Done' : 'Next'}
                                {!last && <ArrowRight size={12} strokeWidth={2.25} />}
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

/**
 * The calm "one pass" form, shared by motor 1 (ON) and motor 2. The form sits
 * in a fixed-width column with an info icon beside every label, and a single
 * tooltip latched to the right of the container, in the same beaked card style
 * as the stepped flow, that says guidance lives on the icons. `readOnly` is for
 * the auto-fill case (motor 2 ON), where the fields type themselves;
 * `fillingRow` rings the field currently filling.
 */
function MotorForm({
  values,
  onChange,
  readOnly = false,
  fillingRow = null,
  dismissed = false,
  onDismiss,
}: {
  values: string[]
  onChange?: (i: number, v: string) => void
  readOnly?: boolean
  fillingRow?: number | null
  dismissed?: boolean
  onDismiss?: () => void
}) {
  const ease = [0.22, 1, 0.36, 1] as const
  return (
    <div className="relative w-[340px]">
      <div className="space-y-4 rounded-2xl border border-grey-100 bg-white p-5 shadow-soft">
        {MOTOR_FIELDS.map((f, i) => (
          <div key={f.label} className="space-y-1.5">
            <div className="flex h-[18px] items-center gap-1.5">
              <span className="text-[12px] font-medium text-grey-600">
                {f.label}
              </span>
              <MotorInfoIcon help={f.help} />
            </div>
            <MotorInput
              value={values[i]}
              onChange={onChange ? (v) => onChange(i, v) : undefined}
              active={fillingRow === i}
              readOnly={readOnly}
            />
          </div>
        ))}
      </div>

      {/* One tooltip latched to the right of the whole form (beak pointing at
          it), in the same card style as the stepped flow. The positioning
          wrapper is a plain div so Framer's transform can't clobber the
          centring translate. */}
      <div className="absolute left-[calc(100%+24px)] top-1/2 z-40 w-[260px] -translate-y-1/2">
        <AnimatePresence>
          {!dismissed && (
            <motion.div
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              transition={{ duration: 0.24, ease }}
              className="relative rounded-xl bg-white p-4 shadow-pop ring-1 ring-grey-200/60"
            >
              <div className="absolute -left-[5px] top-1/2 z-10 h-2.5 w-2.5 -translate-y-1/2 rotate-45 rounded-[2px] border-b border-l border-grey-200/60 bg-white" />
              <p className="text-[10.5px] font-semibold uppercase tracking-wide text-accent">
                Fill it your way
              </p>
              <p className="mt-1 text-[12.5px] leading-relaxed text-grey-600">
                Everything’s on one screen. Fill it top to bottom, and hover the{' '}
                <span className="inline-flex h-[15px] w-[15px] -translate-y-px items-center justify-center align-middle text-grey-500">
                  <Info size={13} strokeWidth={2} />
                </span>{' '}
                beside any label if you need to know more.
              </p>
              {onDismiss && (
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={onDismiss}
                    className="rounded-lg bg-ink px-3.5 py-1.5 text-[12px] font-medium text-white"
                  >
                    Done
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

/** Info icon beside a label (motor 1, ON state). Hover reveals the help. */
function MotorInfoIcon({ help }: { help: string }) {
  const [hovered, setHovered] = useState(false)
  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span className="grid h-[18px] w-[18px] place-items-center rounded-full text-grey-400 transition-colors hover:text-grey-600">
        <Info size={15} strokeWidth={2} />
      </span>
      <AnimatePresence>
        {hovered && (
          <motion.span
            initial={{ opacity: 0, scale: 0.94, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-1/2 top-full z-40 mt-2 w-52 origin-top -translate-x-1/2 rounded-xl bg-ink px-3.5 py-2.5 text-left text-[12px] leading-snug text-white shadow-float"
          >
            {help}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  )
}

/**
 * Motor 2: the same form. OFF, the user types every field by hand (an empty
 * form with a caret). ON, a background flow auto-fills each field with a typing
 * animation, top to bottom, and the user only has to review and confirm.
 */
function MotorAutofill({ better }: { better: boolean }) {
  const ease = [0.22, 1, 0.36, 1] as const
  const [values, setValues] = useState<string[]>(() => MOTOR_FIELDS.map(() => ''))
  const [fillingRow, setFillingRow] = useState<number | null>(null)
  // Manual edits (OFF state) are user-driven; only re-arm autofill when toggled.
  const timers = useRef<number[]>([])

  useEffect(() => {
    // Clear any running animation when the toggle flips.
    timers.current.forEach((t) => window.clearTimeout(t))
    timers.current = []
    if (!better) {
      setValues(MOTOR_FIELDS.map(() => ''))
      setFillingRow(null)
      return
    }
    // Auto-fill: type each field in sequence, character by character.
    setValues(MOTOR_FIELDS.map(() => ''))
    let delay = 350
    MOTOR_FIELDS.forEach((f, row) => {
      const startAt = delay
      timers.current.push(
        window.setTimeout(() => setFillingRow(row), startAt),
      )
      for (let c = 1; c <= f.fill.length; c++) {
        const slice = f.fill.slice(0, c)
        timers.current.push(
          window.setTimeout(() => {
            setValues((prev) => prev.map((x, j) => (j === row ? slice : x)))
          }, startAt + c * 38),
        )
      }
      delay = startAt + f.fill.length * 38 + 240
    })
    timers.current.push(
      window.setTimeout(() => setFillingRow(null), delay),
    )
    return () => {
      timers.current.forEach((t) => window.clearTimeout(t))
      timers.current = []
    }
  }, [better])

  const set = (i: number, v: string) =>
    setValues((prev) => prev.map((x, j) => (j === i ? v : x)))

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-[14px] font-semibold tracking-[-0.01em] text-ink">
            Add a vendor
          </h3>
          <p className="text-[12px] text-grey-400">
            {better
              ? 'The fields fill themselves. You just review and confirm.'
              : 'Fill the form in one pass.'}
          </p>
        </div>
        {better && (
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.24, ease }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-accent/40 bg-accent-soft px-2.5 py-1.5 text-[12px] font-medium text-accent"
          >
            <Sparkles size={13} strokeWidth={2} />
            Auto-filling
          </motion.span>
        )}
      </div>

      {/* Same form as scenario 1's ON state, including the latched tooltip,
          which stays put while the fields type themselves. */}
      <MotorForm
        values={values}
        onChange={better ? undefined : set}
        readOnly={better}
        fillingRow={fillingRow}
      />
    </div>
  )
}

/** Where the tooltip sits relative to the highlighted element. */
type TourSide = 'right' | 'bottom'

/** The five overview steps, each targeting a real region of the dashboard. */
const MOTOR_TOUR_STEPS: {
  target: 'sidebar' | 'topbar' | 'metrics' | 'activity'
  side: TourSide
  title: string
  body: string
}[] = [
  {
    target: 'sidebar',
    side: 'right',
    title: 'Navigation',
    body: 'Every section of the workspace lives here. This is how you move around.',
  },
  {
    target: 'topbar',
    side: 'bottom',
    title: 'The top bar',
    body: 'Switch views and reach your account and settings from here.',
  },
  {
    target: 'metrics',
    side: 'bottom',
    title: 'Your metrics',
    body: 'The three cards summarise the numbers you check most often.',
  },
  {
    target: 'activity',
    side: 'bottom',
    title: 'Recent activity',
    body: 'The latest changes across the workspace, newest first.',
  },
]

/** The flow tooltip used by the tour: a beaked card with Next/Back (OFF) or the
 *  arrow-key hint (ON). Shared by every step so the look never drifts. */
function TourTooltip({
  step,
  side,
  onBack,
  onNext,
}: {
  step: number
  side: TourSide
  onBack: () => void
  onNext: () => void
}) {
  const total = MOTOR_TOUR_STEPS.length
  const last = step === total - 1
  const first = step === 0
  const s = MOTOR_TOUR_STEPS[step]
  // Beak points back at the highlighted element: left edge for a right-side
  // tooltip, top edge for a bottom-side one.
  const beak =
    side === 'right'
      ? 'absolute -left-[5px] top-7 border-b border-l'
      : 'absolute -top-[5px] left-7 border-l border-t'
  return (
    <div className="relative w-[250px] rounded-xl bg-white p-4 shadow-pop ring-1 ring-grey-200/60">
      <div
        className={`${beak} z-10 h-2.5 w-2.5 rotate-45 rounded-[2px] border-grey-200/60 bg-white`}
      />
      <p className="text-[10.5px] font-semibold uppercase tracking-wide text-accent">
        Step {step + 1} of {total}
      </p>
      <h4 className="mt-1 text-[14px] font-semibold tracking-[-0.01em] text-ink">
        {s.title}
      </h4>
      <p className="mt-1 text-[12.5px] leading-relaxed text-grey-600">
        {s.body}
      </p>
      <div className="mt-3 flex items-center justify-between">
        <div className="flex gap-1">
          {MOTOR_TOUR_STEPS.map((_, j) => (
            <span
              key={j}
              className={`h-1.5 rounded-full transition-all ${
                j === step ? 'w-4 bg-accent' : 'w-1.5 bg-grey-200'
              }`}
            />
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          {!first && (
            <button
              onClick={onBack}
              className="rounded-lg px-2.5 py-1.5 text-[12px] font-medium text-grey-400 transition-colors hover:text-ink"
            >
              Back
            </button>
          )}
          <button
            onClick={onNext}
            className="inline-flex items-center gap-1.5 rounded-lg bg-ink px-3.5 py-1.5 text-[12px] font-medium text-white"
          >
            {last ? 'Done' : 'Next'}
            {!last && <ArrowRight size={12} strokeWidth={2.25} />}
          </button>
        </div>
      </div>
    </div>
  )
}

/** A region of the tour dashboard: highlighted (ringed, lifted) when it's the
 *  active step, dimmed when another step is active. Renders its own tooltip. */
function TourTarget({
  active,
  anyActive,
  side,
  step,
  onBack,
  onNext,
  className = '',
  children,
}: {
  active: boolean
  anyActive: boolean
  side: TourSide
  step: number
  onBack: () => void
  onNext: () => void
  className?: string
  children: React.ReactNode
}) {
  const ease = [0.22, 1, 0.36, 1] as const
  // Tooltip placement relative to the target.
  const place =
    side === 'right'
      ? 'left-[calc(100%+20px)] top-1/2 -translate-y-1/2'
      : 'left-1/2 top-[calc(100%+20px)] -translate-x-1/2'
  return (
    <div
      className={`relative rounded-xl transition-all duration-300 ${className} ${
        active
          ? 'z-30 ring-2 ring-accent ring-offset-2 ring-offset-white'
          : anyActive
            ? 'opacity-40'
            : ''
      }`}
    >
      {children}
      <div className={`pointer-events-none absolute z-40 ${place}`}>
        <AnimatePresence>
          {active && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.2, ease }}
              className="pointer-events-auto"
            >
              <TourTooltip
                step={step}
                side={side}
                onBack={onBack}
                onNext={onNext}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

/**
 * Motor 3: a five-step overview tour over a real dashboard. Each step highlights
 * an actual element (nav, top bar, metrics, activity, help) with a flow tooltip.
 * OFF, you click Next/Back. ON, the ← / → arrow keys drive it, no pointer
 * journey, with the keys shown in the tooltip so the shortcut is discoverable.
 */
function MotorTour({ better }: { better: boolean }) {
  const [step, setStep] = useState(0)
  const total = MOTOR_TOUR_STEPS.length

  const back = () => setStep((p) => Math.max(p - 1, 0))
  const next = () => setStep((p) => Math.min(p + 1, total - 1))

  // ON: bind the arrow keys.
  useEffect(() => {
    if (!better) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        setStep((p) => Math.min(p + 1, total - 1))
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        setStep((p) => Math.max(p - 1, 0))
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [better, total])

  const at = MOTOR_TOUR_STEPS[step].target
  const prop = (target: typeof at) => ({
    active: at === target,
    anyActive: true,
    step,
    onBack: back,
    onNext: next,
  })

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-[14px] font-semibold tracking-[-0.01em] text-ink">
            Workspace tour
          </h3>
          <p className="text-[12px] text-grey-400">
            {better
              ? 'Use ← and → to move through the tour, hands stay on the keyboard.'
              : 'Click Next to move through the tour, one step at a time.'}
          </p>
        </div>
        {better && (
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-accent/40 bg-accent-soft px-2.5 py-1.5 text-[12px] font-medium text-accent">
            <Keyboard size={13} strokeWidth={2} />
            Keyboard
          </span>
        )}
      </div>

      {/* A little dashboard, sized so every target stays well inside the stage
          and no tooltip is ever clipped. The right column is capped so the
          bottom tooltips have room and nothing pushes off the right edge. */}
      <div className="flex gap-10">
        {/* Sidebar */}
        <TourTarget {...prop('sidebar')} side="right" className="w-40 shrink-0">
          <div className="flex h-full flex-col gap-2.5 rounded-xl border border-grey-100 bg-white p-4">
            <div className="h-2 w-20 rounded bg-grey-300" />
            <div className="h-2 w-14 rounded bg-grey-200" />
            <div className="h-2 w-24 rounded bg-grey-200" />
            <div className="my-1 h-px w-full bg-grey-100" />
            <div className="h-2 w-14 rounded bg-grey-200" />
            <div className="h-2 w-20 rounded bg-grey-200" />
          </div>
        </TourTarget>

        <div className="flex min-w-0 max-w-[560px] flex-1 flex-col gap-5">
          {/* Top bar */}
          <TourTarget {...prop('topbar')} side="bottom">
            <div className="flex items-center justify-between rounded-xl border border-grey-100 bg-white px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded bg-grey-300" />
                <div className="h-2 w-16 rounded bg-grey-200" />
              </div>
              <div className="h-6 w-6 rounded-full bg-grey-200" />
            </div>
          </TourTarget>

          {/* Metric cards */}
          <TourTarget {...prop('metrics')} side="bottom">
            <div className="grid grid-cols-3 gap-3">
              {['Revenue', 'Active', 'Churn'].map((m) => (
                <div
                  key={m}
                  className="rounded-xl border border-grey-100 bg-white p-3"
                >
                  <div className="h-2 w-12 rounded bg-grey-200" />
                  <div className="mt-2 h-4 w-14 rounded bg-grey-300" />
                </div>
              ))}
            </div>
          </TourTarget>

          {/* Recent activity */}
          <TourTarget {...prop('activity')} side="bottom">
            <div className="rounded-xl border border-grey-100 bg-white p-4">
              <div className="h-2 w-20 rounded bg-grey-300" />
              <div className="mt-3 space-y-2.5">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className="h-6 w-6 shrink-0 rounded-full bg-grey-200" />
                    <div className="h-2 flex-1 rounded bg-grey-100" />
                  </div>
                ))}
              </div>
            </div>
          </TourTarget>
        </div>
      </div>
    </div>
  )
}

/* ── Error prevention ── Stop the mistake before it happens ────────────────── */

/** Three pages of five fields each. The phone field (page 1, field 0) is the
 *  one that must match a format; everything else is free text. */
const EP_PAGES: { label: string; placeholder: string; phone?: boolean }[][] = [
  [
    { label: 'Phone number', placeholder: '(555) 123-4567', phone: true },
    { label: 'Full name', placeholder: 'Jordan Avery' },
    { label: 'Job title', placeholder: 'Operations lead' },
    { label: 'Department', placeholder: 'Customer success' },
    { label: 'Employee ID', placeholder: 'EMP-2041' },
  ],
  [
    { label: 'Street address', placeholder: '14 Park Lane' },
    { label: 'City', placeholder: 'Austin' },
    { label: 'State', placeholder: 'TX' },
    { label: 'Postal code', placeholder: '78701' },
    { label: 'Country', placeholder: 'United States' },
  ],
  [
    { label: 'Manager', placeholder: 'Riley Chen' },
    { label: 'Start date', placeholder: '2026-07-01' },
    { label: 'Cost centre', placeholder: '6200-014' },
    { label: 'Office', placeholder: 'HQ, floor 3' },
    { label: 'Notes', placeholder: 'Optional' },
  ],
]

/** Valid phone: exactly 10 digits once non-digits are stripped. */
function phoneValid(v: string) {
  return v.replace(/\D/g, '').length === 10
}

/**
 * A centered result pop-up, shared by every error-prevention scenario's
 * submit/sent outcome. It portals into the playground stage so it centres on
 * the canvas, not the form column. `tone` picks the icon and accent: 'good' for
 * a success/sent confirmation, 'bad' for an error/catastrophe.
 */
function ErrorResultModal({
  open,
  tone,
  title,
  body,
  onClose,
}: {
  open: boolean
  tone: 'good' | 'bad'
  title: string
  body: string
  onClose: () => void
}) {
  const ease = [0.22, 1, 0.36, 1] as const
  // Centre on the playground stage if present, else fall back to in-place.
  const stage =
    typeof document !== 'undefined'
      ? document.getElementById('playground-stage')
      : null
  const content = (
    <AnimatePresence>
      {open && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div
            className="absolute inset-0 bg-ink/30 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease }}
            onClick={onClose}
          />
          <motion.div
            className="relative w-[300px] rounded-2xl bg-white p-6 text-center shadow-pop ring-1 ring-grey-200/50"
            initial={{ opacity: 0, scale: 0.94, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 4 }}
            transition={{ duration: 0.28, ease }}
          >
            <motion.span
              className={`mx-auto grid h-14 w-14 place-items-center rounded-full ${
                tone === 'good' ? 'bg-good/10 text-good' : 'bg-bad/10 text-bad'
              }`}
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 360, damping: 18, delay: 0.08 }}
            >
              {tone === 'good' ? (
                <CheckCircle2 size={30} strokeWidth={2} />
              ) : (
                <ShieldAlert size={30} strokeWidth={2} />
              )}
            </motion.span>
            <h4 className="mt-4 text-[16px] font-semibold tracking-[-0.01em] text-ink">
              {title}
            </h4>
            <p className="mt-1.5 text-[12.5px] leading-relaxed text-grey-500">
              {body}
            </p>
            <button
              onClick={onClose}
              className="mt-5 w-full rounded-lg bg-ink py-2 text-[12.5px] font-medium text-white"
            >
              Got it
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
  return stage ? createPortal(content, stage) : content
}

/**
 * Error-prevention 1: a 3-page, 15-field form. OFF, the phone field accepts
 * anything and the format error only surfaces when you hit Submit on the last
 * page as a pop-up. ON, a Smart Tip validates the field as you type and shows
 * the expected format up front, so the error is caught at entry.
 */
function ErrorValidate({ better }: { better: boolean }) {
  const ease = [0.22, 1, 0.36, 1] as const
  const [page, setPage] = useState(0)
  const [values, setValues] = useState<Record<string, string>>({})
  const [phoneFocused, setPhoneFocused] = useState(false)
  const [submitError, setSubmitError] = useState(false)
  const lastPage = page === EP_PAGES.length - 1

  const key = (p: number, i: number) => `${p}-${i}`
  const phone = values[key(0, 0)] ?? ''
  const phoneOk = phoneValid(phone)

  const submit = () => {
    // OFF: the bad format is only caught here, after every page is filled,
    // and surfaces as a pop-up. ON, a valid phone was required to get here.
    if (!phoneOk) setSubmitError(true)
    else setSubmitError(false)
  }

  return (
    <div className="w-[340px]">
      <ErrorResultModal
        open={submitError}
        tone="bad"
        title="Can’t submit yet"
        body="The phone number on page 1 is invalid. Go back and fix the format to submit."
        onClose={() => setSubmitError(false)}
      />
      <div className="mb-4">
        <h3 className="text-[14px] font-semibold tracking-[-0.01em] text-ink">
          New employee record
        </h3>
        <p className="text-[12px] text-grey-400">
          Page {page + 1} of {EP_PAGES.length}
        </p>
      </div>

      <div className="space-y-4 rounded-2xl border border-grey-100 bg-white p-5 shadow-soft">
        {EP_PAGES[page].map((f, i) => {
          const isPhone = !!f.phone
          const k = key(page, i)
          return (
            <div key={k} className="space-y-1.5">
              <span className="text-[12px] font-medium text-grey-600">
                {f.label}
              </span>
              <div className="relative">
                <input
                  value={values[k] ?? ''}
                  onChange={(e) => {
                    setValues((p) => ({ ...p, [k]: e.target.value }))
                    if (isPhone) setSubmitError(false)
                  }}
                  onFocus={() => isPhone && setPhoneFocused(true)}
                  onBlur={() => isPhone && setPhoneFocused(false)}
                  placeholder={f.placeholder}
                  // OFF state shows no inline error: the only signal is the
                  // submit pop-up, so the field never reads as "wrong" on blur.
                  className="h-9 w-full rounded-lg border border-grey-200 bg-white px-3 text-[13px] text-ink outline-none transition-colors placeholder:text-grey-300 focus:border-accent focus:ring-2 focus:ring-accent/15"
                />

                {/* ON: the format Smart Tip, shown while typing the phone. */}
                <AnimatePresence>
                  {better && isPhone && phoneFocused && !phoneOk && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.2, ease }}
                      className="absolute left-0 top-full z-40 mt-2.5 w-full"
                    >
                      <div className="relative rounded-xl bg-white p-3.5 text-left shadow-pop ring-1 ring-grey-200/60">
                        <div className="absolute -top-[5px] left-6 z-10 h-2.5 w-2.5 rotate-45 rounded-[2px] border-l border-t border-grey-200/60 bg-white" />
                        <p className="text-[12.5px] leading-relaxed text-grey-600">
                          Enter a 10-digit number, for example{' '}
                          <span className="rounded bg-grey-100 px-1.5 py-0.5 font-mono text-[12px] font-medium text-ink">
                            (555) 123-4567
                          </span>
                          . We’ll check it before you move on.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 0))}
          disabled={page === 0}
          className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-[12.5px] font-medium transition-colors ${
            page === 0 ? 'text-grey-300' : 'text-grey-500 hover:text-ink'
          }`}
        >
          <ChevronLeft size={14} strokeWidth={2.25} />
          Back
        </button>

        {lastPage ? (
          <button
            onClick={submit}
            className="rounded-lg bg-ink px-4 py-2 text-[12.5px] font-medium text-white"
          >
            Submit
          </button>
        ) : (
          <button
            onClick={() => setPage((p) => p + 1)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-ink px-4 py-2 text-[12.5px] font-medium text-white"
          >
            Next
            <ArrowRight size={13} strokeWidth={2.25} />
          </button>
        )}
      </div>
    </div>
  )
}

/**
 * Error-prevention 2: a one-button action with a huge blast radius. OFF, the
 * "Send announcement" button fires and the broadcast goes out to ~40,000 people.
 * ON, an invisible blocker intercepts the click and a tooltip explains the
 * action is held until the audience is reviewed, the mistake never happens.
 */
const EP_AUDIENCES = [
  { label: 'Beta testers', count: '~120' },
  { label: 'Enterprise admins', count: '~40' },
  { label: 'Newsletter opt-ins', count: '~3,200' },
  { label: 'All contacts', count: '~40,000' },
]

function ErrorBlocker({ better }: { better: boolean }) {
  const ease = [0.22, 1, 0.36, 1] as const
  const [audience, setAudience] = useState(EP_AUDIENCES[3]) // All contacts
  const [open, setOpen] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [sent, setSent] = useState(false)
  // The catastrophe is messaging the entire contact list.
  const isCatastrophe = audience.label === 'All contacts'
  // ON: hovering Send while All contacts is selected shows the blocker.
  const showBlocker = better && isCatastrophe && hovered

  const click = () => {
    // ON blocks the catastrophic send; everything else goes through.
    if (better && isCatastrophe) return
    setSent(true)
  }

  return (
    <div className="w-[360px]">
      <ErrorResultModal
        open={sent}
        tone="good"
        title={`Sent to ${audience.count} folks`}
        body={
          isCatastrophe
            ? 'The announcement just went out to your entire contact list. There’s no undo.'
            : `The announcement went out to ${audience.label}.`
        }
        onClose={() => setSent(false)}
      />

      <div className="mb-4">
        <h3 className="text-[14px] font-semibold tracking-[-0.01em] text-ink">
          Send announcement
        </h3>
        <p className="text-[12px] text-grey-400">
          This message goes to everyone in the selected audience.
        </p>
      </div>

      <div className="rounded-2xl border border-grey-100 bg-white p-5 shadow-soft">
        <div className="space-y-1.5">
          <span className="text-[12px] font-medium text-grey-600">Audience</span>
          {/* A simple custom dropdown of cohorts + the whole list. */}
          <div className="relative">
            <button
              onClick={() => setOpen((o) => !o)}
              className="flex h-9 w-full items-center justify-between rounded-lg border border-grey-200 bg-white px-3 text-[13px] text-ink"
            >
              <span>{audience.label}</span>
              <span className="flex items-center gap-2">
                <span className="rounded-full bg-grey-100 px-2 py-0.5 text-[11px] font-medium text-grey-500">
                  {audience.count}
                </span>
                <ChevronDown
                  size={15}
                  strokeWidth={2}
                  className={`text-grey-400 transition-transform ${open ? 'rotate-180' : ''}`}
                />
              </span>
            </button>
            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.16, ease }}
                  className="absolute left-0 top-full z-40 mt-1.5 w-full overflow-hidden rounded-lg border border-grey-200 bg-white shadow-pop"
                >
                  {EP_AUDIENCES.map((a) => (
                    <button
                      key={a.label}
                      onClick={() => {
                        setAudience(a)
                        setOpen(false)
                      }}
                      className={`flex w-full items-center justify-between px-3 py-2 text-left text-[13px] transition-colors hover:bg-grey-50 ${
                        a.label === audience.label
                          ? 'font-medium text-ink'
                          : 'text-grey-600'
                      }`}
                    >
                      <span>{a.label}</span>
                      <span className="text-[11px] text-grey-400">{a.count}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-4 space-y-1.5">
          <span className="text-[12px] font-medium text-grey-600">Message</span>
          <div className="space-y-2 rounded-lg border border-grey-200 bg-grey-50 px-3 py-3">
            <Bar className="h-2 w-40" />
            <Bar className="h-2 w-52" />
            <Bar className="h-2 w-32" />
          </div>
        </div>

        <div className="relative mt-5 flex justify-end">
          <button
            onClick={click}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className={`rounded-lg px-4 py-2 text-[12.5px] font-medium text-white ${
              showBlocker ? 'cursor-not-allowed bg-grey-400' : 'bg-ink'
            }`}
          >
            Send
          </button>

          {/* ON: the hover blocker, latched above the button. No buttons. */}
          <AnimatePresence>
            {showBlocker && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2, ease }}
                className="absolute bottom-full right-0 z-40 mb-3 w-[280px]"
              >
                <div className="relative rounded-xl bg-white p-4 shadow-pop ring-1 ring-grey-200/60">
                  <div className="absolute -bottom-[5px] right-8 z-10 h-2.5 w-2.5 rotate-45 rounded-[2px] border-b border-r border-grey-200/60 bg-white" />
                  <div className="flex items-start gap-2.5">
                    <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-bad/10 text-bad">
                      <ShieldAlert size={15} strokeWidth={2} />
                    </span>
                    <div>
                      <p className="text-[13px] font-semibold text-ink">
                        This action is blocked
                      </p>
                      <p className="mt-1 text-[12.5px] leading-relaxed text-grey-600">
                        You’re about to message ~40,000 people. Kindly review the
                        audience before sending.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

const EP_REQUEST_TYPES = [
  'Hardware issue',
  'Password reset',
  'Access request',
  'Software install',
  'Something else',
]

/**
 * Error-prevention 3: a "submit a ticket" page. OFF, choosing "Password reset"
 * and hitting Submit just creates the ticket, a ticket that a self-serve flow
 * could have handled. ON, hovering Submit on a password request surfaces a
 * blocker tooltip that offers the self-serve flow, so the ticket never gets
 * filed.
 */
function ErrorDeflect({ better }: { better: boolean }) {
  const ease = [0.22, 1, 0.36, 1] as const
  const [type, setType] = useState(EP_REQUEST_TYPES[1]) // Password reset
  const [open, setOpen] = useState(false)
  const [created, setCreated] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [resolved, setResolved] = useState(false)
  const isPassword = type === 'Password reset'
  // ON: hovering Submit on a password request shows the deflection tooltip.
  const deflect = better && isPassword && hovered

  const submit = () => {
    // ON blocks the avoidable password ticket; everything else files normally.
    if (better && isPassword) return
    setCreated(true)
  }

  return (
    <div className="w-[340px]">
      {/* OFF (or "file anyway"): the avoidable ticket is created, as a pop-up. */}
      <ErrorResultModal
        open={created}
        tone="good"
        title="Ticket created"
        body={
          isPassword
            ? `Filed a “${type}” ticket. A self-serve reset could have handled this with no ticket.`
            : `Filed a “${type}” ticket. We’ll route it to the right team.`
        }
        onClose={() => setCreated(false)}
      />
      {/* ON: the user self-resolved, no ticket filed, as a pop-up. */}
      <ErrorResultModal
        open={resolved}
        tone="good"
        title="Password reset"
        body="No ticket filed. The avoidable request never reached the queue."
        onClose={() => setResolved(false)}
      />

      <div className="mb-4">
        <h3 className="text-[14px] font-semibold tracking-[-0.01em] text-ink">
          Submit a ticket
        </h3>
        <p className="text-[12px] text-grey-400">
          Tell us what you need and we’ll route it.
        </p>
      </div>

      <div className="space-y-4 rounded-2xl border border-grey-100 bg-white p-5 shadow-soft">
        <div className="space-y-1.5">
          <span className="text-[12px] font-medium text-grey-600">
            Type of request
          </span>
          {/* A simple custom dropdown. */}
          <div className="relative">
            <button
              onClick={() => setOpen((o) => !o)}
              className="flex h-9 w-full items-center justify-between rounded-lg border border-grey-200 bg-white px-3 text-[13px] text-ink"
            >
              {type}
              <ChevronDown
                size={15}
                strokeWidth={2}
                className={`text-grey-400 transition-transform ${open ? 'rotate-180' : ''}`}
              />
            </button>
            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.16, ease }}
                  className="absolute left-0 top-full z-40 mt-1.5 w-full overflow-hidden rounded-lg border border-grey-200 bg-white shadow-pop"
                >
                  {EP_REQUEST_TYPES.map((t) => (
                    <button
                      key={t}
                      onClick={() => {
                        setType(t)
                        setOpen(false)
                        setCreated(false)
                      }}
                      className={`block w-full px-3 py-2 text-left text-[13px] transition-colors hover:bg-grey-50 ${
                        t === type ? 'font-medium text-ink' : 'text-grey-600'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="space-y-1.5">
          <span className="text-[12px] font-medium text-grey-600">Details</span>
          <div className="space-y-2 rounded-lg border border-grey-200 bg-grey-50 px-3 py-3">
            <Bar className="h-2 w-44" />
            <Bar className="h-2 w-36" />
          </div>
        </div>

        <div className="flex justify-end">
          {/* The hover group spans the button AND its tooltip, so moving the
              cursor onto a tooltip link doesn't dismiss it. */}
          <div
            className="relative"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <button
              onClick={submit}
              className={`rounded-lg px-4 py-2 text-[12.5px] font-medium text-white ${
                deflect ? 'cursor-not-allowed bg-grey-400' : 'bg-ink'
              }`}
            >
              Submit ticket
            </button>

            {/* ON: the deflection blocker tooltip, on hover. */}
            <AnimatePresence>
              {deflect && !resolved && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.22, ease }}
                  className="absolute bottom-full right-0 z-40 mb-3 w-[290px]"
                >
                  <div className="relative rounded-xl bg-white p-4 shadow-pop ring-1 ring-grey-200/60">
                    <div className="absolute -bottom-[5px] right-8 z-10 h-2.5 w-2.5 rotate-45 rounded-[2px] border-b border-r border-grey-200/60 bg-white" />
                    <div className="flex items-start gap-2.5">
                      <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
                        <KeyRound size={15} strokeWidth={2} />
                      </span>
                      <div>
                        <p className="text-[13px] font-semibold text-ink">
                          Looks like a password request
                        </p>
                        <p className="mt-1 text-[12.5px] leading-relaxed text-grey-600">
                          You can{' '}
                          <button
                            onClick={() => {
                              setHovered(false)
                              setResolved(true)
                            }}
                            className="font-medium text-accent underline decoration-accent/30 underline-offset-2 hover:decoration-accent"
                          >
                            reset it yourself
                          </button>{' '}
                          in under a minute, no ticket needed. Or{' '}
                          <button
                            onClick={() => {
                              setHovered(false)
                              setCreated(true)
                            }}
                            className="text-grey-500 underline decoration-grey-300 underline-offset-2 hover:text-ink"
                          >
                            file it anyway
                          </button>
                          .
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Segmentation ── Chunk the journey, don't dump it ──────────────────────── */

/** The full onboarding task set. OFF shows them flat; ON groups by stage. */
const SEG_TASKS = [
  { label: 'Complete your profile', stage: 'Day 1' },
  { label: 'Connect your workspace', stage: 'Day 1' },
  { label: 'Invite your team', stage: 'Day 1' },
  { label: 'Import your data', stage: 'Day 2' },
  { label: 'Set up your first project', stage: 'Day 2' },
  { label: 'Configure notifications', stage: 'Day 2' },
  { label: 'Build a dashboard', stage: 'Day 3' },
  { label: 'Create an automation', stage: 'Day 3' },
  { label: 'Connect an integration', stage: 'Day 3' },
  { label: 'Publish to your team', stage: 'Day 4' },
  { label: 'Review the analytics', stage: 'Day 4' },
  { label: 'Schedule a check-in', stage: 'Day 4' },
]
const SEG_STAGES = ['Day 1', 'Day 2', 'Day 3', 'Day 4']

/**
 * Segmentation 1: a task-list widget (reusing the Self-Help FAB + panel shell,
 * bottom-left, with the task-list icon). OFF, every onboarding task is dumped
 * into one flat scattered list, a wall. ON, the same tasks are chunked into
 * Day 1-4 stages with per-stage progress, so it reads as "four small things".
 */
function SegmentTasks({ segmented }: { segmented: boolean }) {
  const ease = [0.22, 1, 0.36, 1] as const
  const [open, setOpen] = useState(true)
  const [expanded, setExpanded] = useState<string | null>('Day 1')
  // A couple of Day-1 tasks pre-done, so progress reads as real.
  const done = new Set([SEG_TASKS[0].label, SEG_TASKS[1].label])

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            className="absolute bottom-[76px] left-4 z-30 flex max-h-[440px] w-[320px] flex-col overflow-hidden rounded-2xl bg-white shadow-pop ring-1 ring-grey-200/50"
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ duration: 0.26, ease }}
            style={{ transformOrigin: 'bottom left' }}
          >
            <div className="flex items-center justify-between border-b border-grey-100 px-4 py-3">
              <div className="flex items-center gap-2">
                <ListChecks size={16} className="text-accent" strokeWidth={2} />
                <span className="text-[13.5px] font-semibold text-ink">
                  Getting started
                </span>
              </div>
              <button
                aria-label="Close"
                onClick={() => setOpen(false)}
                className="grid h-6 w-6 place-items-center rounded-md text-grey-400 transition-colors hover:bg-grey-100 hover:text-ink"
              >
                <X size={14} strokeWidth={2.25} />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-1.5 py-2">
              {segmented ? (
                /* ON: chunked into Day 1-4 folders (the Self-Help accordion). */
                SEG_STAGES.map((stage) => {
                  const items = SEG_TASKS.filter((t) => t.stage === stage)
                  const doneCount = items.filter((t) => done.has(t.label)).length
                  const isOpen = expanded === stage
                  return (
                    <div key={stage}>
                      <button
                        onClick={() =>
                          setExpanded((cur) => (cur === stage ? null : stage))
                        }
                        className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-grey-50"
                      >
                        <Folder size={15} className="shrink-0 text-accent" strokeWidth={2} />
                        <span className="flex-1 text-[13px] font-medium text-ink">
                          {stage}
                        </span>
                        <span className="text-[11px] text-grey-400">
                          {doneCount}/{items.length}
                        </span>
                        <ChevronDown
                          size={14}
                          className={`shrink-0 text-grey-400 transition-transform ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease }}
                            className="overflow-hidden"
                          >
                            <div className="space-y-0.5 pb-1 pl-6 pr-1">
                              {items.map((t) => (
                                <SegTaskRow
                                  key={t.label}
                                  label={t.label}
                                  done={done.has(t.label)}
                                />
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })
              ) : (
                /* OFF: a flat, scattered dump of every task. */
                <div className="space-y-0.5">
                  {SEG_TASKS.map((t) => (
                    <SegTaskRow key={t.label} label={t.label} done={done.has(t.label)} flat />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* The task-list FAB, bottom-left. */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="absolute bottom-4 left-4 z-30 grid h-12 w-12 place-items-center rounded-full bg-accent text-white shadow-float transition-transform hover:scale-105"
        aria-label="Getting started"
      >
        {open ? <X size={20} strokeWidth={2.25} /> : <ListChecks size={20} strokeWidth={2} />}
      </button>
    </>
  )
}

/** One task row: a checkbox + label, used flat or inside a stage. */
function SegTaskRow({
  label,
  done,
  flat = false,
}: {
  label: string
  done: boolean
  flat?: boolean
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5">
      {done ? (
        <CheckCircle2 size={16} className="shrink-0 text-good" strokeWidth={2} />
      ) : (
        <Circle size={16} className="shrink-0 text-grey-300" strokeWidth={2} />
      )}
      <span
        className={`text-[12.5px] ${
          done
            ? 'text-grey-400 line-through'
            : flat
              ? 'text-grey-500'
              : 'text-grey-700'
        }`}
      >
        {label}
      </span>
    </div>
  )
}

/** The three boxes the segmentation tour latches onto, with per-step copy. */
const SEG_TOUR_BOXES = [
  { title: 'Your metrics', body: 'The numbers you’ll check most often live here.' },
  { title: 'Filters', body: 'Narrow the view to what you care about.' },
  { title: 'Date range', body: 'Set the window the dashboard reports on.' },
]

/**
 * Segmentation 2: a tour latched onto three skeleton boxes. OFF, the tooltip
 * reads "Step N of 40", a march with no end in sight; Next just moves to the
 * next box. ON, the same tour is chunked: it steps through the boxes and after
 * a couple of steps a center pop-up celebrates the finished segment and offers
 * the next process or later, so the user consolidates and feels progress.
 */
function SegmentSteps({ chunked }: { chunked: boolean }) {
  const ease = [0.22, 1, 0.36, 1] as const
  const [step, setStep] = useState(0) // index into SEG_TOUR_BOXES
  const [done, setDone] = useState(false)
  const total = 40
  // ON: the first segment ends after the third box.
  const segmentEnd = SEG_TOUR_BOXES.length - 1

  const next = () => {
    if (chunked && step === segmentEnd) {
      setDone(true)
      return
    }
    setStep((s) => (s + 1) % SEG_TOUR_BOXES.length)
  }

  const box = SEG_TOUR_BOXES[step]

  return (
    <div className="relative h-full">
      <div className="mb-5">
        <h3 className="text-[14px] font-semibold tracking-[-0.01em] text-ink">
          Workspace setup
        </h3>
        <p className="text-[12px] text-grey-400">
          A guided walk-through of everything you can configure.
        </p>
      </div>

      {/* Three boxes; the active one is ringed and carries the tooltip. */}
      <div className="grid grid-cols-3 gap-4">
        {SEG_TOUR_BOXES.map((b, i) => {
          const active = i === step && !done
          const last = i === SEG_TOUR_BOXES.length - 1
          const first = i === 0
          // Keep the tooltip inside the canvas: align the first box's tip to
          // the left edge, the last box's to the right edge, the middle centred.
          const tipPos = first
            ? 'left-0'
            : last
              ? 'right-0'
              : 'left-1/2 -translate-x-1/2'
          // The beak tracks the box centre regardless of the card's edge.
          const beakPos = first
            ? 'left-7'
            : last
              ? 'right-7'
              : 'left-1/2 -translate-x-1/2'
          return (
            <div key={b.title} className="relative">
              <div
                className={`rounded-xl border bg-white p-3 transition-all ${
                  active
                    ? 'border-accent ring-2 ring-accent/20'
                    : 'border-grey-100'
                }`}
              >
                <div className="h-2 w-12 rounded bg-grey-200" />
                <div className="mt-2 h-4 w-14 rounded bg-grey-300" />
              </div>

              {/* The walk-through tooltip, latched below the active box. */}
              <AnimatePresence>
                {active && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2, ease }}
                    className={`absolute top-[calc(100%+12px)] z-40 w-[260px] ${tipPos}`}
                  >
                    <div className="relative rounded-xl bg-white p-4 shadow-pop ring-1 ring-grey-200/60">
                      <div className={`absolute -top-[5px] z-10 h-2.5 w-2.5 rotate-45 rounded-[2px] border-l border-t border-grey-200/60 bg-white ${beakPos}`} />
                      <p className="text-[10.5px] font-semibold uppercase tracking-wide text-accent">
                        Step {step + 1} of {chunked ? SEG_TOUR_BOXES.length : total}
                        {chunked && <span className="ml-1.5 text-grey-400">· Setup</span>}
                      </p>
                      <h4 className="mt-1 text-[14px] font-semibold tracking-[-0.01em] text-ink">
                        {box.title}
                      </h4>
                      <p className="mt-1 text-[12.5px] leading-relaxed text-grey-600">
                        {chunked
                          ? box.body
                          : `${box.body} Just one of forty, with no end in sight.`}
                      </p>
                      <div className="mt-3 flex justify-end">
                        <button
                          onClick={next}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-ink px-3.5 py-1.5 text-[12px] font-medium text-white"
                        >
                          Next
                          <ArrowRight size={12} strokeWidth={2.25} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>

      <div className="mt-5 rounded-xl border border-grey-100 bg-white p-4">
        <div className="h-2 w-24 rounded bg-grey-300" />
        <div className="mt-3 space-y-2">
          <div className="h-2 w-full rounded bg-grey-100" />
          <div className="h-2 w-4/5 rounded bg-grey-100" />
        </div>
      </div>

      {/* ON: the segment-complete pop-up (portals to the stage centre). */}
      <SegmentDoneModal
        open={done}
        onContinue={() => {
          setDone(false)
          setStep(0)
        }}
        onLater={() => setDone(false)}
      />
    </div>
  )
}

/** The celebratory "segment complete" pop-up, centred on the playground stage. */
function SegmentDoneModal({
  open,
  onContinue,
  onLater,
}: {
  open: boolean
  onContinue: () => void
  onLater: () => void
}) {
  const ease = [0.22, 1, 0.36, 1] as const
  const stage =
    typeof document !== 'undefined'
      ? document.getElementById('playground-stage')
      : null
  const content = (
    <AnimatePresence>
      {open && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div
            className="absolute inset-0 bg-ink/30 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease }}
            onClick={onLater}
          />
          <motion.div
            className="relative w-[300px] rounded-2xl bg-white p-6 text-center shadow-pop ring-1 ring-grey-200/50"
            initial={{ opacity: 0, scale: 0.94, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 4 }}
            transition={{ duration: 0.28, ease }}
          >
            <motion.span
              className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-good/10 text-good"
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 360, damping: 18, delay: 0.08 }}
            >
              <CheckCircle2 size={30} strokeWidth={2} />
            </motion.span>
            <h4 className="mt-4 text-[16px] font-semibold tracking-[-0.01em] text-ink">
              Nice, that segment’s done
            </h4>
            <p className="mt-1.5 text-[12.5px] leading-relaxed text-grey-500">
              You’ve finished setup. Keep going to configuration, or pick it up
              later.
            </p>
            <div className="mt-5 flex items-center justify-center gap-2">
              <button
                onClick={onContinue}
                className="rounded-lg bg-ink px-4 py-2 text-[12.5px] font-medium text-white"
              >
                Next process
              </button>
              <button
                onClick={onLater}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[12.5px] font-medium text-grey-400 transition-colors hover:text-ink"
              >
                <Clock3 size={13} strokeWidth={2} />
                Later
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
  return stage ? createPortal(content, stage) : content
}

/* ── Autonomy ── Hand the user the wheel ───────────────────────────────────── */

/** A centred pop-up over the playground stage, used by the autonomy demos. */
function StageModal({
  open,
  onClose,
  children,
  bare = false,
}: {
  open: boolean
  onClose?: () => void
  children: React.ReactNode
  /** Drop the default padding so content can bleed to the card edges. */
  bare?: boolean
}) {
  const ease = [0.22, 1, 0.36, 1] as const
  const stage =
    typeof document !== 'undefined'
      ? document.getElementById('playground-stage')
      : null
  const content = (
    <AnimatePresence>
      {open && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div
            className="absolute inset-0 bg-ink/30 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease }}
            onClick={onClose}
          />
          <motion.div
            className={`relative w-[340px] overflow-hidden rounded-2xl bg-white shadow-pop ring-1 ring-grey-200/50 ${
              bare ? '' : 'p-6'
            }`}
            initial={{ opacity: 0, scale: 0.94, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 4 }}
            transition={{ duration: 0.28, ease }}
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
  return stage ? createPortal(content, stage) : content
}

const AUTO_PATHS = [
  { id: 'a', icon: 'learn', title: 'Learn Process A', sub: 'Set up your first project' },
  { id: 'b', icon: 'learn', title: 'Learn Process B', sub: 'Invite and manage your team' },
  { id: 'explore', icon: 'explore', title: 'I’ll explore on my own', sub: 'No walk-through, thanks' },
]

/**
 * Autonomy 1: a flow on arrival. OFF, the moment the page loads a walk-through
 * just starts, the same forced path for everyone. ON, a pop-up offers the choice
 * first (Process A, Process B, or explore), and the chosen flow launches from
 * there, so the path is one the user actually picked.
 */
/** The boxes the autonomy flow latches onto, per chosen path. */
const AUTO_FLOW_BOXES: Record<string, { title: string; body: string }[]> = {
  a: [
    { title: 'New project', body: 'Start here to spin up your first project.' },
    { title: 'Add details', body: 'Name it and set an owner.' },
    { title: 'Publish', body: 'Share it with your team when you’re ready.' },
  ],
  b: [
    { title: 'Team', body: 'Open your team settings here.' },
    { title: 'Invite', body: 'Add the people you work with.' },
    { title: 'Roles', body: 'Set who can do what.' },
  ],
  forced: [
    { title: 'Step one', body: 'Here’s the first thing to do.' },
    { title: 'Step two', body: 'Now this.' },
    { title: 'Step three', body: 'And finally this.' },
  ],
}

function AutonomyChoice({ better }: { better: boolean }) {
  const ease = [0.22, 1, 0.36, 1] as const
  // OFF auto-runs the forced flow immediately; ON waits on the choice pop-up.
  const [choosing, setChoosing] = useState(better)
  const [path, setPath] = useState<string | null>(better ? null : 'forced')
  const [step, setStep] = useState(0)

  // Re-arm when the toggle flips.
  const [seenBetter, setSeenBetter] = useState(better)
  if (seenBetter !== better) {
    setSeenBetter(better)
    setChoosing(better)
    setPath(better ? null : 'forced')
    setStep(0)
  }

  // The running flow's boxes (null if exploring or still choosing).
  const boxes = path && path !== 'explore' ? AUTO_FLOW_BOXES[path] : null
  const running = boxes && step < boxes.length

  return (
    <div className="relative h-full">
      <div className="mb-5">
        <h3 className="text-[14px] font-semibold tracking-[-0.01em] text-ink">
          Welcome to the workspace
        </h3>
        <p className="text-[12px] text-grey-400">
          {better
            ? 'You choose what to learn, and when.'
            : 'A walk-through starts the moment you arrive.'}
        </p>
      </div>

      {/* Three boxes the flow latches onto. */}
      <div className="grid grid-cols-3 gap-4">
        {[0, 1, 2].map((i) => {
          const active = running && step === i
          const last = boxes ? i === boxes.length - 1 : false
          // Keep the tooltip in-canvas: left box aligns left, right aligns right.
          const tipPos = i === 0 ? 'left-0' : i === 2 ? 'right-0' : 'left-1/2 -translate-x-1/2'
          const beakPos = i === 0 ? 'left-7' : i === 2 ? 'right-7' : 'left-1/2 -translate-x-1/2'
          return (
            <div key={i} className="relative">
              <div
                className={`rounded-xl border bg-white p-3 transition-all ${
                  active ? 'border-accent ring-2 ring-accent/20' : 'border-grey-100'
                }`}
              >
                <div className="h-2 w-12 rounded bg-grey-200" />
                <div className="mt-2 h-4 w-14 rounded bg-grey-300" />
              </div>

              <AnimatePresence>
                {active && boxes && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2, ease }}
                    className={`absolute top-[calc(100%+12px)] z-40 w-[240px] ${tipPos}`}
                  >
                    <div className="relative rounded-xl bg-white p-4 shadow-pop ring-1 ring-grey-200/60">
                      <div className={`absolute -top-[5px] z-10 h-2.5 w-2.5 rotate-45 rounded-[2px] border-l border-t border-grey-200/60 bg-white ${beakPos}`} />
                      <p className="text-[10.5px] font-semibold uppercase tracking-wide text-accent">
                        Step {step + 1} of {boxes.length}
                      </p>
                      <h4 className="mt-1 text-[14px] font-semibold tracking-[-0.01em] text-ink">
                        {boxes[step].title}
                      </h4>
                      <p className="mt-1 text-[12.5px] leading-relaxed text-grey-600">
                        {boxes[step].body}
                      </p>
                      <div className="mt-3 flex justify-end">
                        <button
                          onClick={() => setStep((s) => s + 1)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-ink px-3.5 py-1.5 text-[12px] font-medium text-white"
                        >
                          {last ? 'Done' : 'Next'}
                          {!last && <ArrowRight size={12} strokeWidth={2.25} />}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
      <div className="mt-5 rounded-xl border border-grey-100 bg-white p-4">
        <div className="h-2 w-24 rounded bg-grey-300" />
        <div className="mt-3 space-y-2">
          <div className="h-2 w-full rounded bg-grey-100" />
          <div className="h-2 w-4/5 rounded bg-grey-100" />
        </div>
      </div>

      {/* ON: the choice pop-up that gates the flow. */}
      <StageModal open={better && choosing}>
        <h4 className="text-[16px] font-semibold tracking-[-0.01em] text-ink">
          What would you like to do?
        </h4>
        <p className="mt-1 text-[12.5px] text-grey-500">
          Pick a path, or skip the guidance entirely.
        </p>
        <div className="mt-4 space-y-2">
          {AUTO_PATHS.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setPath(p.id)
                setStep(0)
                setChoosing(false)
              }}
              className="flex w-full items-center gap-3 rounded-xl border border-grey-200 px-3.5 py-3 text-left transition-colors hover:border-accent hover:bg-accent-soft/40"
            >
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-accent-soft text-accent">
                {p.icon === 'explore' ? (
                  <CompassIcon size={16} strokeWidth={2} />
                ) : (
                  <GraduationCap size={16} strokeWidth={2} />
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[13px] font-medium text-ink">
                  {p.title}
                </span>
                <span className="block text-[11.5px] text-grey-400">{p.sub}</span>
              </span>
              <ArrowRight size={14} strokeWidth={2} className="shrink-0 text-grey-300" />
            </button>
          ))}
        </div>
      </StageModal>
    </div>
  )
}

/** The branched-form fields. Section A is empty (needs filling); Section B is
 *  a prerequisite that's already satisfied. */
const AUTO_SECTION_A = [
  { label: 'Project name', value: '' },
  { label: 'Owner', value: '' },
  { label: 'Start date', value: '' },
]
const AUTO_SECTION_B = [
  { label: 'Company name', value: 'Northwind Trading' },
  { label: 'Tax ID', value: 'GB-4471902' },
  { label: 'Billing email', value: 'ap@northwind.co' },
]

/**
 * Autonomy 2: a two-section form with one Submit at the bottom. Section A is
 * empty; Section B is a prerequisite that's already filled. OFF, a linear flow
 * walks every field of both sections, then Submit. ON, the flow branches: it
 * walks Section A, sees Section B is already satisfied, and jumps straight to
 * the Submit button.
 */
function AutonomyBranch({ better }: { better: boolean }) {
  const ease = [0.22, 1, 0.36, 1] as const
  // Steps reference fields by section/idx, plus a final 'submit' step.
  type Step = { section: 'A' | 'B'; idx: number } | { section: 'submit' }
  const steps: Step[] = better
    ? [...AUTO_SECTION_A.map((_, i) => ({ section: 'A' as const, idx: i })), { section: 'submit' as const }]
    : [
        ...AUTO_SECTION_A.map((_, i) => ({ section: 'A' as const, idx: i })),
        ...AUTO_SECTION_B.map((_, i) => ({ section: 'B' as const, idx: i })),
        { section: 'submit' as const },
      ]
  const [step, setStep] = useState(0)
  const [seenBetter, setSeenBetter] = useState(better)
  if (seenBetter !== better) {
    setSeenBetter(better)
    setStep(0)
  }
  const cur = steps[step]
  const onSubmit = cur && cur.section === 'submit'

  const fieldActive = (section: 'A' | 'B', idx: number) =>
    cur && cur.section === section && 'idx' in cur && cur.idx === idx

  const renderSection = (
    title: string,
    fields: { label: string; value: string }[],
    sectionId: 'A' | 'B',
    filled: boolean,
  ) => (
    <div className="rounded-2xl border border-grey-100 bg-white p-4 shadow-soft">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[12px] font-semibold uppercase tracking-wide text-grey-500">
          {title}
        </span>
        {filled && (
          <span className="inline-flex items-center gap-1 rounded-full bg-good/10 px-2 py-0.5 text-[10.5px] font-medium text-good">
            <CheckCircle2 size={11} strokeWidth={2.5} />
            Already done
          </span>
        )}
      </div>
      <div className="space-y-3">
        {fields.map((f, i) => {
          const active = fieldActive(sectionId, i)
          return (
            <div key={f.label} className="space-y-1.5">
              <span className="text-[12px] font-medium text-grey-600">{f.label}</span>
              {/* The field box is the tooltip anchor: a relative wrapper exactly
                  its own height, so the beak lands on the field centre. */}
              <div className="relative">
                <div
                  className={`flex h-9 w-full items-center rounded-lg border px-3 text-[13px] transition-shadow ${
                    active ? 'border-accent ring-2 ring-accent/15' : 'border-grey-200'
                  } ${f.value ? 'bg-grey-50 text-ink' : 'bg-white text-grey-300'}`}
                >
                  {f.value || 'Empty'}
                </div>

                {/* Plain positioning wrapper so Framer's x-transform on the
                    motion child can't clobber the centring translate. */}
                <div className="absolute left-[calc(100%+20px)] top-1/2 z-40 w-[230px] -translate-y-1/2">
                  <AnimatePresence>
                    {active && (
                      <motion.div
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -6 }}
                        transition={{ duration: 0.2, ease }}
                        className="relative rounded-xl bg-white p-3.5 shadow-pop ring-1 ring-grey-200/60"
                      >
                        <div className="absolute -left-[5px] top-1/2 z-10 h-2.5 w-2.5 -translate-y-1/2 rotate-45 rounded-[2px] border-b border-l border-grey-200/60 bg-white" />
                        <p className="text-[10.5px] font-semibold uppercase tracking-wide text-accent">
                          Step {step + 1} of {steps.length}
                        </p>
                        <p className="mt-1 text-[12.5px] leading-relaxed text-grey-600">
                          {filled
                            ? `Confirm ${f.label.toLowerCase()}.`
                            : `Enter ${f.label.toLowerCase()}.`}
                          {filled && (
                            <span className="text-grey-400"> (Already filled.)</span>
                          )}
                        </p>
                        <div className="mt-2.5 flex justify-end">
                          <button
                            onClick={() => setStep((s) => s + 1)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-ink px-3 py-1.5 text-[12px] font-medium text-white"
                          >
                            Next
                            <ArrowRight size={12} strokeWidth={2.25} />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

  return (
    <div className="w-[330px] space-y-4">
      <div>
        <h3 className="text-[14px] font-semibold tracking-[-0.01em] text-ink">
          Create a project
        </h3>
        <p className="text-[12px] text-grey-400">
          {better
            ? 'Section B is already done, so the flow skips it and goes to Submit.'
            : 'The flow walks every field, even the section that’s already filled.'}
        </p>
      </div>
      {renderSection('Section A · Project', AUTO_SECTION_A, 'A', false)}
      {renderSection('Section B · Company', AUTO_SECTION_B, 'B', true)}

      {/* The overall Submit, the flow's final latch target. */}
      <div className="flex justify-end">
        <div className="relative">
          <button
            className={`rounded-lg px-5 py-2 text-[12.5px] font-medium text-white transition-shadow ${
              onSubmit ? 'bg-ink ring-2 ring-accent/40 ring-offset-2 ring-offset-white' : 'bg-ink'
            }`}
          >
            Submit
          </button>
          <div className="absolute right-[calc(100%+20px)] top-1/2 z-40 w-[230px] -translate-y-1/2">
            <AnimatePresence>
              {onSubmit && (
                <motion.div
                  initial={{ opacity: 0, x: 6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 6 }}
                  transition={{ duration: 0.2, ease }}
                  className="relative rounded-xl bg-white p-3.5 shadow-pop ring-1 ring-grey-200/60"
                >
                  <div className="absolute -right-[5px] top-1/2 z-10 h-2.5 w-2.5 -translate-y-1/2 rotate-45 rounded-[2px] border-r border-t border-grey-200/60 bg-white" />
                  <p className="text-[10.5px] font-semibold uppercase tracking-wide text-accent">
                    Step {step + 1} of {steps.length}
                  </p>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-grey-600">
                    {better
                      ? 'That’s it. Section B was already done, so submit when you’re ready.'
                      : 'All fields covered. Submit to finish.'}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}

const AUTO_PEOPLE = [
  {
    name: 'Alex Rivera',
    role: 'New this week',
    veteran: false,
    photo:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&fit=crop&crop=faces',
  },
  {
    name: 'Sam Okafor',
    role: 'Power user · 3 yrs',
    veteran: true,
    photo:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=96&h=96&fit=crop&crop=faces',
  },
]
const AUTO_TASKS = [
  'Complete your profile',
  'Connect your workspace',
  'Invite your team',
  'Import your data',
]
const AUTO_HELP = [
  { icon: 'article' as const, label: 'Getting started guide' },
  { icon: 'video' as const, label: 'Build your first dashboard' },
  { icon: 'article' as const, label: 'Keyboard shortcuts' },
  { icon: 'video' as const, label: 'Invite and manage your team' },
]

/**
 * Autonomy 3: a workspace with a profile (top-right), a task-list widget
 * (bottom-left), and Self-Help (bottom-right). No toggle: clicking the profile
 * swaps the user. The newcomer gets the hand-holding task list; switch to the
 * veteran and it disappears, leaving the quiet Self-Help they can reach on demand.
 */
function AutonomyDetect() {
  const [who, setWho] = useState(0)
  const [tasksOpen, setTasksOpen] = useState(true)
  const [helpOpen, setHelpOpen] = useState(false)
  const person = AUTO_PEOPLE[who]
  const showTasks = !person.veteran

  return (
    <div className="relative h-full">
      {/* Header with a clickable profile, top-right. */}
      <div className="mb-5 flex items-start justify-between">
        <div>
          <h3 className="text-[14px] font-semibold tracking-[-0.01em] text-ink">
            Your workspace
          </h3>
          <p className="text-[12px] text-grey-400">
            Click the profile to switch user; the guidance adapts.
          </p>
        </div>
        <button
          onClick={() => setWho((w) => (w + 1) % AUTO_PEOPLE.length)}
          className="group flex items-center gap-2.5 rounded-full border border-grey-200 bg-white py-1 pl-1 pr-3 transition-colors hover:border-grey-300"
        >
          <img
            src={person.photo}
            alt={person.name}
            className="h-8 w-8 rounded-full object-cover"
          />
          <span className="text-left">
            <span className="block text-[12.5px] font-semibold leading-tight text-ink">
              {person.name}
            </span>
            <span className="block text-[10.5px] leading-tight text-grey-400">
              {person.role}
            </span>
          </span>
        </button>
      </div>

      {/* The app body. */}
      <div className="grid grid-cols-3 gap-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-xl border border-grey-100 bg-white p-3">
            <div className="h-2 w-12 rounded bg-grey-200" />
            <div className="mt-2 h-4 w-14 rounded bg-grey-300" />
          </div>
        ))}
      </div>
      <div className="mt-3 rounded-xl border border-grey-100 bg-white p-4">
        <div className="h-2 w-24 rounded bg-grey-300" />
        <div className="mt-3 space-y-2">
          <div className="h-2 w-full rounded bg-grey-100" />
          <div className="h-2 w-4/5 rounded bg-grey-100" />
        </div>
      </div>

      {/* Task-list widget, bottom-left, hidden for the veteran. */}
      <AnimatePresence>
        {showTasks && (
          <>
            {tasksOpen && (
              <motion.div
                key="tasks-panel"
                className="absolute bottom-[76px] left-4 z-30 w-[300px] overflow-hidden rounded-2xl bg-white shadow-pop ring-1 ring-grey-200/50"
                initial={{ opacity: 0, scale: 0.94, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: 12 }}
                transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformOrigin: 'bottom left' }}
              >
                <div className="flex items-center justify-between border-b border-grey-100 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <ListChecks size={16} className="text-accent" strokeWidth={2} />
                    <span className="text-[13.5px] font-semibold text-ink">
                      Getting started
                    </span>
                  </div>
                  <button
                    aria-label="Close"
                    onClick={() => setTasksOpen(false)}
                    className="grid h-6 w-6 place-items-center rounded-md text-grey-400 transition-colors hover:bg-grey-100 hover:text-ink"
                  >
                    <X size={14} strokeWidth={2.25} />
                  </button>
                </div>
                <div className="space-y-1 p-2">
                  {AUTO_TASKS.map((t, i) => (
                    <div key={t} className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5">
                      {i === 0 ? (
                        <CheckCircle2 size={15} className="shrink-0 text-good" strokeWidth={2} />
                      ) : (
                        <Circle size={15} className="shrink-0 text-grey-300" strokeWidth={2} />
                      )}
                      <span
                        className={`text-[12.5px] ${
                          i === 0 ? 'text-grey-400 line-through' : 'text-grey-600'
                        }`}
                      >
                        {t}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
            <motion.button
              key="tasks-fab"
              onClick={() => setTasksOpen((o) => !o)}
              className="absolute bottom-4 left-4 z-30 grid h-12 w-12 place-items-center rounded-full bg-accent text-white shadow-float transition-transform hover:scale-105"
              aria-label="Getting started"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            >
              {tasksOpen ? <X size={20} strokeWidth={2.25} /> : <ListChecks size={20} strokeWidth={2} />}
            </motion.button>
          </>
        )}
      </AnimatePresence>

      {/* Self-Help widget, bottom-right, always present. */}
      <AnimatePresence>
        {helpOpen && (
          <motion.div
            className="absolute bottom-[76px] right-4 z-30 w-[270px] overflow-hidden rounded-2xl bg-white shadow-pop ring-1 ring-grey-200/50"
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: 'bottom right' }}
          >
            <div className="flex items-center gap-2 border-b border-grey-100 px-4 py-3">
              <LifeBuoy size={16} className="text-accent" strokeWidth={2} />
              <span className="text-[13.5px] font-semibold text-ink">Self Help</span>
            </div>
            <div className="flex items-center gap-2 border-b border-grey-100 px-4 py-2.5">
              <Search size={14} className="text-grey-400" strokeWidth={2} />
              <span className="text-[12.5px] text-grey-400">Search for help…</span>
            </div>
            <div className="space-y-0.5 p-1.5">
              {AUTO_HELP.map((h) => (
                <button
                  key={h.label}
                  className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-grey-50"
                >
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-accent-soft text-accent">
                    {h.icon === 'video' ? (
                      <Play size={12} strokeWidth={2} />
                    ) : (
                      <FileText size={12} strokeWidth={2} />
                    )}
                  </span>
                  <span className="text-[12.5px] text-grey-700">{h.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setHelpOpen((o) => !o)}
        className="absolute bottom-4 right-4 z-30 grid h-12 w-12 place-items-center rounded-full bg-ink text-white shadow-float transition-transform hover:scale-105"
        aria-label="Self Help"
      >
        {helpOpen ? <X size={20} strokeWidth={2.25} /> : <LifeBuoy size={20} strokeWidth={2} />}
      </button>
    </div>
  )
}

/* ── Exclusivity ── Target the ask, don't broadcast it ─────────────────────── */

/** A faint dashboard behind the pop-ups, plus a "show again" pill when closed. */
function ExclusivityStage({
  open,
  onReopen,
  children,
}: {
  open: boolean
  onReopen: () => void
  children: React.ReactNode
}) {
  return (
    <div className="relative h-full">
      <div className="grid grid-cols-3 gap-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-xl border border-grey-100 bg-white p-3">
            <div className="h-2 w-12 rounded bg-grey-200" />
            <div className="mt-2 h-4 w-14 rounded bg-grey-300" />
          </div>
        ))}
      </div>
      <div className="mt-3 rounded-xl border border-grey-100 bg-white p-4">
        <div className="h-2 w-24 rounded bg-grey-300" />
        <div className="mt-3 space-y-2">
          <div className="h-2 w-full rounded bg-grey-100" />
          <div className="h-2 w-4/5 rounded bg-grey-100" />
        </div>
      </div>

      {!open && (
        <button
          onClick={onReopen}
          className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-grey-200 px-3 py-1.5 text-[12px] font-medium text-grey-500 transition-colors hover:text-ink"
        >
          <ArrowRight size={13} strokeWidth={2.25} />
          Show the pop-up again
        </button>
      )}

      {children}
    </div>
  )
}

/**
 * Exclusivity 1: a feedback survey pop-up. OFF, it's a generic blast, "we'd love
 * your feedback", aimed at everyone and ignored by almost everyone. ON, the same
 * survey is reframed with exclusivity and self-relevance, "you were specifically
 * selected", so the ask clears the mental filter and converts.
 */
function ExclusivitySurvey({ targeted }: { targeted: boolean }) {
  const [open, setOpen] = useState(true)
  // Re-open the pop-up when the toggle flips, so the reframing is visible.
  const [seen, setSeen] = useState(targeted)
  if (seen !== targeted) {
    setSeen(targeted)
    setOpen(true)
  }

  return (
    <ExclusivityStage open={open} onReopen={() => setOpen(true)}>
      <StageModal open={open} onClose={() => setOpen(false)} bare={targeted}>
        {targeted ? (
          /* ON: a premium, personally-directed survey card. */
          <div>
            {/* Full-bleed gradient header with a soft starburst. */}
            <div className="relative overflow-hidden bg-gradient-to-br from-accent to-[#c2410c] px-6 pb-7 pt-6 text-center">
              <div className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-white/15 blur-2xl" />
              <div className="pointer-events-none absolute -bottom-12 -left-6 h-28 w-28 rounded-full bg-white/10 blur-2xl" />
              <motion.span
                className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white/95 text-accent shadow-lg"
                initial={{ scale: 0.5, opacity: 0, rotate: -8 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 340, damping: 17, delay: 0.06 }}
              >
                <Star size={26} strokeWidth={2} fill="currentColor" />
              </motion.span>
            </div>

            <div className="px-6 pb-6 pt-5 text-center">
              <h4 className="text-[17px] font-semibold tracking-[-0.01em] text-ink">
                Your input shapes what we build next
              </h4>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-grey-500">
                You’re one of a small group we’re asking. Two minutes, and it
                goes straight to the team deciding what ships.
              </p>

              {/* A light social-proof row, faces + count. */}
              <div className="mt-4 flex items-center justify-center gap-2">
                <div className="flex -space-x-2">
                  {[
                    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=48&h=48&fit=crop&crop=faces',
                    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=48&h=48&fit=crop&crop=faces',
                    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=48&h=48&fit=crop&crop=faces',
                  ].map((src) => (
                    <img
                      key={src}
                      src={src}
                      alt=""
                      className="h-6 w-6 rounded-full object-cover ring-2 ring-white"
                    />
                  ))}
                </div>
                <span className="text-[11.5px] text-grey-400">
                  40 others already shared theirs
                </span>
              </div>

              <div className="mt-5 flex items-center gap-2">
                <button
                  onClick={() => setOpen(false)}
                  className="flex-1 rounded-lg bg-accent px-4 py-2.5 text-[12.5px] font-semibold text-white shadow-sm transition-colors hover:bg-accent/90"
                >
                  Share my input
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-[12.5px] font-medium text-grey-400 transition-colors hover:text-ink"
                >
                  Maybe later
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* OFF: a plain, generic feedback notice. */
          <div className="text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-grey-100 text-grey-400">
              <MessageSquareText size={24} strokeWidth={2} />
            </span>
            <h4 className="mt-4 text-[17px] font-semibold tracking-[-0.01em] text-ink">
              We’d love your feedback
            </h4>
            <p className="mt-1.5 text-[12.5px] leading-relaxed text-grey-500">
              Help us improve by taking our feedback survey when you get a chance.
            </p>
            <div className="mt-5 flex items-center justify-center gap-2">
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg bg-ink px-4 py-2 text-[12.5px] font-medium text-white"
              >
                Take the survey
              </button>
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-[12.5px] font-medium text-grey-400 transition-colors hover:text-ink"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
      </StageModal>
    </ExclusivityStage>
  )
}

/** The name the personalized welcome pulls from a variable. */
const EXCL_USER_NAME = 'Sumit'

/**
 * Exclusivity 2: a welcome pop-up. OFF, it's a generic "welcome to the
 * dashboard" shown to everyone. ON, it's personalized, the name is pulled from
 * a variable and addressed directly, so the greeting reads as meant for you.
 */
function ExclusivityWelcome({ targeted }: { targeted: boolean }) {
  const [open, setOpen] = useState(true)
  const [seen, setSeen] = useState(targeted)
  if (seen !== targeted) {
    setSeen(targeted)
    setOpen(true)
  }

  return (
    <ExclusivityStage open={open} onReopen={() => setOpen(true)}>
      <StageModal open={open} onClose={() => setOpen(false)}>
        <div className="text-center">
          <motion.span
            className={`mx-auto grid h-14 w-14 place-items-center rounded-2xl ${
              targeted ? 'bg-accent text-white' : 'bg-grey-100 text-grey-400'
            }`}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 340, damping: 18, delay: 0.06 }}
          >
            {targeted ? (
              <PartyPopper size={26} strokeWidth={2} />
            ) : (
              <Compass size={24} strokeWidth={2} />
            )}
          </motion.span>

          <h4 className="mt-4 text-[17px] font-semibold tracking-[-0.01em] text-ink">
            {targeted ? (
              <>
                Hey{' '}
                <span className="text-accent">{EXCL_USER_NAME}</span>, welcome
                back
              </>
            ) : (
              'Welcome to the dashboard'
            )}
          </h4>
          <p className="mt-1.5 text-[12.5px] leading-relaxed text-grey-500">
            {targeted
              ? `Your projects are right where you left them, ${EXCL_USER_NAME}. Pick up the report you started yesterday?`
              : 'Here’s where you’ll find your projects, reports, and team activity.'}
          </p>

          <div className="mt-5 flex items-center justify-center gap-2">
            <button
              onClick={() => setOpen(false)}
              className="rounded-lg bg-ink px-4 py-2 text-[12.5px] font-medium text-white"
            >
              {targeted ? 'Resume my report' : 'Get started'}
            </button>
            <button
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2 text-[12.5px] font-medium text-grey-400 transition-colors hover:text-ink"
            >
              Dismiss
            </button>
          </div>
        </div>
      </StageModal>
    </ExclusivityStage>
  )
}

/* ── Multimedia / Modality ── Match the channel to the question ────────────── */

/** A tiny typewriter for the QuickRead answer. */
function Typewriter({ text }: { text: string }) {
  const [n, setN] = useState(0)
  const timers = useRef<number[]>([])
  useEffect(() => {
    timers.current.forEach((t) => window.clearTimeout(t))
    timers.current = []
    setN(0)
    for (let c = 1; c <= text.length; c++) {
      timers.current.push(window.setTimeout(() => setN(c), 220 + c * 22))
    }
    return () => {
      timers.current.forEach((t) => window.clearTimeout(t))
      timers.current = []
    }
  }, [text])
  return (
    <span>
      {text.slice(0, n)}
      {n < text.length && <span className="text-accent">▍</span>}
    </span>
  )
}

/** The Self-Help shell both modality demos share: a FAB + a panel whose search
 *  bar is pre-filled with the scenario's query, with results passed in. */
function ModalitySelfHelp({
  query,
  children,
}: {
  query: string
  children: React.ReactNode
}) {
  const ease = [0.22, 1, 0.36, 1] as const
  const [open, setOpen] = useState(true)
  return (
    <div className="relative h-full">
      {/* A faint dashboard behind the widget. */}
      <div className="grid grid-cols-3 gap-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-xl border border-grey-100 bg-white p-3">
            <div className="h-2 w-12 rounded bg-grey-200" />
            <div className="mt-2 h-4 w-14 rounded bg-grey-300" />
          </div>
        ))}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            className="absolute bottom-[76px] right-4 z-30 flex max-h-[440px] w-[330px] flex-col overflow-hidden rounded-2xl bg-white shadow-pop ring-1 ring-grey-200/50"
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ duration: 0.26, ease }}
            style={{ transformOrigin: 'bottom right' }}
          >
            <div className="flex items-center justify-between border-b border-grey-100 px-4 py-3">
              <div className="flex items-center gap-2">
                <LifeBuoy size={16} className="text-accent" strokeWidth={2} />
                <span className="text-[13.5px] font-semibold text-ink">Self Help</span>
              </div>
              <button
                aria-label="Close"
                onClick={() => setOpen(false)}
                className="grid h-6 w-6 place-items-center rounded-md text-grey-400 transition-colors hover:bg-grey-100 hover:text-ink"
              >
                <X size={14} strokeWidth={2.25} />
              </button>
            </div>

            {/* The search bar, pre-filled with the scenario's query. */}
            <div className="flex items-center gap-2 border-b border-grey-100 px-4 py-2.5">
              <Search size={14} className="text-grey-400" strokeWidth={2} />
              <span className="text-[12.5px] text-ink">{query}</span>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen((o) => !o)}
        className="absolute bottom-4 right-4 z-30 grid h-12 w-12 place-items-center rounded-full bg-accent text-white shadow-float transition-transform hover:scale-105"
        aria-label="Self Help"
      >
        {open ? <X size={20} strokeWidth={2.25} /> : <LifeBuoy size={20} strokeWidth={2} />}
      </button>
    </div>
  )
}

/** A result row in Self-Help: an icon tile + label + meta. */
function ModalityResult({
  icon,
  label,
  meta,
}: {
  icon: 'flow' | 'article' | 'video'
  label: string
  meta: string
}) {
  const Icon = icon === 'video' ? Video : icon === 'article' ? FileText : Play
  return (
    <button className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-grey-50">
      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-accent-soft text-accent">
        <Icon size={13} strokeWidth={2} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[12.5px] font-medium text-ink">{label}</span>
        <span className="block text-[11px] text-grey-400">{meta}</span>
      </span>
      <ArrowRight size={13} strokeWidth={2} className="shrink-0 text-grey-300" />
    </button>
  )
}

/**
 * Modality 1: a quick-fact question in Self-Help. OFF, the search returns two
 * flows to run, a heavy modality for a light question. ON, the same search
 * answers the fact inline (a shimmering card, then a typed answer) before the
 * flows, matching the lightest modality to the need.
 */
function ModalityQuickRead({ better }: { better: boolean }) {
  // Brief shimmer before the answer types in, so it reads as "thinking".
  const [ready, setReady] = useState(false)
  useEffect(() => {
    setReady(false)
    if (!better) return
    const t = window.setTimeout(() => setReady(true), 700)
    return () => window.clearTimeout(t)
  }, [better])

  return (
    <ModalitySelfHelp query="How do I change my password?">
      {better && (
        <div className="mb-1 px-1 pt-1">
          <div className="rounded-xl border border-accent/40 bg-white p-3">
            <div className="flex items-center gap-1.5">
              <Zap size={13} strokeWidth={2.25} className="text-accent" />
              <span className="text-[10.5px] font-semibold uppercase tracking-wide text-accent">
                Quick answer
              </span>
            </div>
            {ready ? (
              <p className="mt-1.5 text-[13px] leading-relaxed text-ink">
                <Typewriter text="Open Settings, choose Security, then Change password. Enter your current password, set a new one, and save." />
              </p>
            ) : (
              /* Shimmer placeholder while the answer is "generating". */
              <div className="mt-2 space-y-2">
                <div className="h-2.5 w-full animate-pulse rounded bg-grey-200" />
                <div className="h-2.5 w-3/4 animate-pulse rounded bg-grey-200" />
              </div>
            )}
          </div>
        </div>
      )}

      <p className="px-2.5 pb-1 pt-2 text-[10.5px] font-semibold uppercase tracking-wide text-grey-400">
        {better ? 'Or take an action' : 'Top results'}
      </p>
      <ModalityResult icon="flow" label="Change your password" meta="Flow · 4 steps" />
      <ModalityResult icon="flow" label="Set up two-factor login" meta="Flow · 3 steps" />
    </ModalitySelfHelp>
  )
}

/**
 * Modality 2: a task question in Self-Help. OFF, the search returns a single
 * article, one forced format. ON, the same topic comes back in three modalities
 * (article, flow, video) and the user picks the channel that fits the moment.
 */
function ModalityMulti({ better }: { better: boolean }) {
  return (
    <ModalitySelfHelp query="How do I file a support ticket?">
      {better ? (
        <>
          <p className="px-2.5 pb-1 pt-2 text-[10.5px] font-semibold uppercase tracking-wide text-grey-400">
            Pick the format that fits
          </p>
          <ModalityResult icon="article" label="File a ticket: written guide" meta="Article · 2 min read" />
          <ModalityResult icon="flow" label="Walk me through it now" meta="Flow · in your app" />
          <ModalityResult icon="video" label="Watch how it works" meta="Video · 90 sec" />
        </>
      ) : (
        <>
          <p className="px-2.5 pb-1 pt-2 text-[10.5px] font-semibold uppercase tracking-wide text-grey-400">
            Top result
          </p>
          <div className="rounded-lg px-2.5 py-2">
            <div className="flex items-center gap-2.5">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-grey-100 text-grey-400">
                <FileText size={13} strokeWidth={2} />
              </span>
              <span className="text-[12.5px] font-medium text-ink">
                Filing a support ticket
              </span>
            </div>
            {/* A wall of text, the only format on offer. */}
            <div className="mt-2.5 space-y-1.5 pl-[38px]">
              {[
                'w-full',
                'w-full',
                'w-5/6',
                'w-full',
                'w-4/6',
                'w-full',
                'w-3/4',
              ].map((w, i) => (
                <div key={i} className={`h-2 rounded bg-grey-100 ${w}`} />
              ))}
            </div>
          </div>
        </>
      )}
    </ModalitySelfHelp>
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
  smartTipRung,
  recognitionCue = null,
  recognitionField = null,
  recognitionHelp = null,
  jakobLanguage = null,
  jakobIcon = null,
  jakobModel = null,
  motorFlow = null,
  motorAutofill = null,
  motorTour = null,
  errorValidate = null,
  errorBlocker = null,
  errorDeflect = null,
  segmentTasks = null,
  segmentSteps = null,
  autonomyChoice = null,
  autonomyBranch = null,
  autonomyDetect = null,
  exclusivitySurvey = null,
  exclusivityWelcome = null,
  modalityQuickRead = null,
  modalityMulti = null,
}: SkeletonAppProps) {
  // Internal tab state for the temporal-contiguity demo.
  const [tab, setTab] = useState(0)
  const [dismissed, setDismissed] = useState(false)
  // Recognition demo 1: the guidance (pop-up or cue) is summoned by a click.
  const [cueRevealed, setCueRevealed] = useState(false)
  const [reminderOpen, setReminderOpen] = useState(true)
  // Flipping the timing toggle is a fresh intent, re-arm the nudge.
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
          ) : recognitionCue != null ? (
            <>
              <Bar className="h-2 w-12" />
              <Bar className="h-2 w-10" />
              <RecognitionCue
                better={recognitionCue}
                revealed={cueRevealed}
              />
            </>
          ) : (
            <>
              <Bar className="h-2 w-12" />
              <Bar className="h-2 w-10" />
              {/* The Smart Tip ladder latches its info icon to this nav item. */}
              <span className="relative">
                <Bar className="h-2 w-14" />
                {smartTipRung && <SmartTipLadder rung={smartTipRung} />}
              </span>
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
          {motorFlow != null ? (
            <MotorFlow better={motorFlow} />
          ) : motorAutofill != null ? (
            <MotorAutofill better={motorAutofill} />
          ) : motorTour != null ? (
            <MotorTour better={motorTour} />
          ) : errorValidate != null ? (
            <ErrorValidate better={errorValidate} />
          ) : errorBlocker != null ? (
            <ErrorBlocker better={errorBlocker} />
          ) : errorDeflect != null ? (
            <ErrorDeflect better={errorDeflect} />
          ) : segmentSteps != null ? (
            <SegmentSteps chunked={segmentSteps} />
          ) : autonomyChoice != null ? (
            <AutonomyChoice better={autonomyChoice} />
          ) : autonomyBranch != null ? (
            <AutonomyBranch better={autonomyBranch} />
          ) : autonomyDetect != null ? (
            <AutonomyDetect />
          ) : exclusivitySurvey != null ? (
            <ExclusivitySurvey targeted={exclusivitySurvey} />
          ) : exclusivityWelcome != null ? (
            <ExclusivityWelcome targeted={exclusivityWelcome} />
          ) : modalityQuickRead != null ? (
            <ModalityQuickRead better={modalityQuickRead} />
          ) : modalityMulti != null ? (
            <ModalityMulti better={modalityMulti} />
          ) : jakobLanguage != null ? (
            <JakobLanguage localized={jakobLanguage} />
          ) : jakobIcon != null ? (
            <JakobIcon conventional={jakobIcon} />
          ) : jakobModel != null ? (
            <JakobModel annotate={jakobModel} />
          ) : recognitionField != null ? (
            <div>
              <h3 className="mb-1 text-[14px] font-semibold tracking-[-0.01em] text-ink">
                Verify your policy
              </h3>
              <p className="mb-5 text-[12px] text-grey-400">
                Enter your policy number to continue.
              </p>
              <div className="rounded-2xl border border-grey-100 bg-white p-5 shadow-soft">
                <RecognitionField better={recognitionField} />
              </div>
            </div>
          ) : coherentForm != null ? (
            <CoherenceForm coherent={coherentForm} />
          ) : tabs && tab === 1 ? (
            /* Tab 2, a different surface (the "Reports" area). */
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
          {/* Dashboard header, carries the detached definitions affordance:
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
                        <span className="text-white/70">, {m.def}</span>
                      </li>
                    ))}
                  </ul>
                </InfoTip>
              )}
            </div>
          )}

          {/* Metric cards, grey bars by default; real data when `metrics` set. */}
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
                              <span className="text-white/75">, {metric.def}</span>
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

              {/* Focused field, in-flow cue, or a real contextual field. */}
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

      {/* Temporal-contiguity nudge, slides up from the bottom of the stage. */}
      <AnimatePresence>
        {nudgeOpen && (
          <WalkthroughNudge onDismiss={() => setDismissed(true)} />
        )}
      </AnimatePresence>

      {/* Recognition demo 1: click the canvas to summon the guidance. The
          button stays always-on; only the pop-up / cue is click-gated. */}
      {recognitionCue != null && !cueRevealed && (
        <button
          type="button"
          aria-label="Show the guidance"
          onClick={() => {
            setCueRevealed(true)
            setReminderOpen(true)
          }}
          className="absolute inset-0 z-20 cursor-pointer"
        />
      )}
      <AnimatePresence>
        {recognitionCue === false && cueRevealed && reminderOpen && (
          <GenericReminder onDismiss={() => setReminderOpen(false)} />
        )}
      </AnimatePresence>

      {/* Recognition demo 3: the Self-Help widget (flat list vs. folders). */}
      {recognitionHelp != null && <RecognitionHelp folders={recognitionHelp} />}

      {/* Segmentation 1: the task-list widget (flat vs. Day 1-4 stages). */}
      {segmentTasks != null && <SegmentTasks segmented={segmentTasks} />}
    </div>
  )
}
