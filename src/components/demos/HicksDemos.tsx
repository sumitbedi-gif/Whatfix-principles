import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { X, LifeBuoy, Search, Play, FileText, ChevronRight } from 'lucide-react'
import type { AppProps, ToggleState } from './registry'

const ease = [0.22, 1, 0.36, 1] as const

/* Both Hick's-Law demos are popups over a calm app. */
export function hicksApp(): AppProps {
  return { focusField: false }
}

/* ── Scenario 1 ── Five competing CTAs vs. one primary + one quiet ───────── */
/**
 * A welcome modal with an image bleeding to the top edges.
 * Off → five equal-weight CTAs; the eye stalls.
 * On  → one primary action + one quiet secondary.
 */
export function HicksCtaOverlay({
  state,
  onDismiss,
}: {
  state: ToggleState
  onDismiss?: () => void
}) {
  const refined = !!state.refined
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center">
      <motion.div
        className="absolute inset-0 rounded-2xl bg-ink/25 backdrop-blur-[2px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.28, ease }}
      />
      <motion.div
        className="relative w-[340px] overflow-hidden rounded-2xl bg-white shadow-pop ring-1 ring-grey-200/50"
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, ease }}
      >
        {/* Edge-to-edge hero image */}
        <div className="relative h-32 w-full overflow-hidden bg-grey-100">
          <img
            src="https://images.unsplash.com/photo-1620121692029-d088224ddc74?auto=format&fit=crop&w=680&q=80"
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          <button
            aria-label="Dismiss"
            onClick={onDismiss}
            className="absolute right-2.5 top-2.5 grid h-7 w-7 place-items-center rounded-lg bg-white/85 text-grey-500 backdrop-blur transition-colors hover:text-ink"
          >
            <X size={15} strokeWidth={2.25} />
          </button>
        </div>

        <div className="p-5">
          <h4 className="text-[17px] font-semibold tracking-[-0.01em] text-ink">
            Welcome to your dashboard
          </h4>
          <p className="mt-1.5 text-[13px] leading-relaxed text-grey-500">
            Everything your team ships, in one place. Here’s how to get the most
            out of it from day one.
          </p>

          <AnimatePresence mode="wait">
            {refined ? (
              <motion.div
                key="refined"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.28, ease }}
                className="mt-5 flex items-center gap-2"
              >
                <span className="rounded-lg bg-ink px-4 py-2 text-[13px] font-medium text-white">
                  Let’s go
                </span>
                <span className="px-3 py-2 text-[13px] font-medium text-grey-400">
                  Remind me later
                </span>
              </motion.div>
            ) : (
              <motion.div
                key="overload"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.28, ease }}
                className="mt-5 space-y-2"
              >
                <div className="grid grid-cols-2 gap-2">
                  {['Take the tour', 'Watch the video', 'Learn more', 'Let’s go'].map(
                    (c) => (
                      <span
                        key={c}
                        className="rounded-lg border border-grey-200 bg-grey-50 px-3 py-2 text-center text-[12.5px] font-medium text-ink"
                      >
                        {c}
                      </span>
                    ),
                  )}
                </div>
                <span className="block w-full rounded-lg border border-grey-200 bg-grey-50 px-3 py-2 text-center text-[12.5px] font-medium text-grey-500">
                  Don’t show me again
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}

/* ── Scenario 2 ── Flat language grid vs. recommended + others ───────────── */
interface Lang {
  flag: string
  name: string
}

const LANGS: Lang[] = [
  { flag: '🇬🇧', name: 'English' },
  { flag: '🇫🇷', name: 'French' },
  { flag: '🇩🇪', name: 'German' },
  { flag: '🇪🇸', name: 'Spanish' },
  { flag: '🇯🇵', name: 'Japanese' },
  { flag: '🇮🇳', name: 'Hindi' },
  { flag: '🇧🇷', name: 'Portuguese' },
  { flag: '🇨🇳', name: 'Chinese' },
  { flag: '🇸🇦', name: 'Arabic' },
]

/** The three the author judges most relevant for this user. */
const RECOMMENDED = ['English', 'French', 'Hindi']

function LangChip({ lang, primary }: { lang: Lang; primary?: boolean }) {
  return (
    <span
      className={`flex min-w-0 items-center gap-2 rounded-xl border px-2.5 py-2.5 text-[13px] transition-colors ${
        primary
          ? 'border-grey-200 bg-grey-100 text-ink'
          : 'border-grey-200 bg-white text-grey-600'
      }`}
    >
      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white text-[15px] shadow-sm ring-1 ring-grey-200/60">
        {lang.flag}
      </span>
      <span className="min-w-0 flex-1 truncate font-medium">{lang.name}</span>
    </span>
  )
}

/**
 * Off → 9 languages in a flat grid; a scan with no structure.
 * On  → split into a small Recommended set + the rest, so the decision becomes
 *       "accept the obvious one or browse".
 */
export function HicksLanguageOverlay({
  state,
  onDismiss,
}: {
  state: ToggleState
  onDismiss?: () => void
}) {
  const refined = !!state.refined
  const recommended = LANGS.filter((l) => RECOMMENDED.includes(l.name))
  const others = LANGS.filter((l) => !RECOMMENDED.includes(l.name))

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center">
      <motion.div
        className="absolute inset-0 rounded-2xl bg-ink/25 backdrop-blur-[2px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.28, ease }}
      />
      <motion.div
        className="relative w-[440px] rounded-2xl bg-white p-6 shadow-pop ring-1 ring-grey-200/50"
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, ease }}
      >
        <button
          aria-label="Dismiss"
          onClick={onDismiss}
          className="absolute right-3.5 top-3.5 grid h-7 w-7 place-items-center rounded-lg text-grey-400 transition-colors hover:bg-grey-100 hover:text-ink"
        >
          <X size={15} strokeWidth={2.25} />
        </button>
        <h4 className="text-[16px] font-semibold tracking-[-0.01em] text-ink">
          Choose your language
        </h4>
        <p className="mt-1 text-[12.5px] text-grey-500">
          You can change this anytime in settings.
        </p>

        <AnimatePresence mode="wait">
          {refined ? (
            <motion.div
              key="grouped"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.28, ease }}
              className="mt-4"
            >
              <p className="text-[11px] font-semibold uppercase tracking-wide text-grey-400">
                Recommended
              </p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {recommended.map((l) => (
                  <LangChip key={l.name} lang={l} primary />
                ))}
              </div>
              <p className="mt-4 text-[11px] font-semibold uppercase tracking-wide text-grey-400">
                All other languages
              </p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {others.map((l) => (
                  <LangChip key={l.name} lang={l} />
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="flat"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.28, ease }}
              className="mt-4 grid grid-cols-3 gap-2"
            >
              {LANGS.map((l) => (
                <LangChip key={l.name} lang={l} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-5 flex justify-end">
          <button
            onClick={onDismiss}
            className="rounded-lg bg-ink px-4 py-2 text-[13px] font-medium text-white"
          >
            Continue
          </button>
        </div>
      </motion.div>
    </div>
  )
}

/* ── Scenario 3 ── Self-Help: a long flat list vs. a contextual few ──────── */
/** The Self-Help widget lives on the app itself (a FAB), so it's always on. */
export function hicksSelfHelpApp(): AppProps {
  return { focusField: false }
}

interface Flow {
  icon: typeof Play
  label: string
}

/** The full library — what a generic Self-Help dumps on every page. */
const ALL_FLOWS: Flow[] = [
  { icon: Play, label: 'Take the product tour' },
  { icon: FileText, label: 'Set up your first project' },
  { icon: FileText, label: 'Invite your team' },
  { icon: FileText, label: 'Connect an integration' },
  { icon: FileText, label: 'Build a custom report' },
  { icon: FileText, label: 'Configure notifications' },
  { icon: FileText, label: 'Manage billing & plans' },
  { icon: FileText, label: 'Export your data' },
  { icon: FileText, label: 'Set up single sign-on' },
]

/** Only what's relevant to the page the user is actually on. */
const CONTEXTUAL_FLOWS: Flow[] = [
  { icon: Play, label: 'How to read this dashboard' },
  { icon: FileText, label: 'Build a custom report' },
]

function FlowRow({ flow }: { flow: Flow }) {
  const Icon = flow.icon
  return (
    <button className="group flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-grey-50">
      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-accent-soft text-accent">
        <Icon size={14} strokeWidth={2} />
      </span>
      <span className="min-w-0 flex-1 truncate text-[13px] text-ink">
        {flow.label}
      </span>
      <ChevronRight
        size={15}
        className="shrink-0 text-grey-300 transition-colors group-hover:text-grey-500"
      />
    </button>
  )
}

/**
 * Off → the Self-Help panel lists the entire flow library; the user scrolls and
 *       hunts. On → just the one or two flows relevant to this page.
 * The FAB is always present; clicking it opens the panel.
 */
export function HicksSelfHelpOverlay({ state }: { state: ToggleState }) {
  const refined = !!state.refined
  const [open, setOpen] = useState(true)
  // Re-open the panel when toggling so the contrast is visible immediately.
  useEffect(() => setOpen(true), [refined])

  const flows = refined ? CONTEXTUAL_FLOWS : ALL_FLOWS

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            className="absolute bottom-[72px] right-4 z-20 w-[300px] overflow-hidden rounded-2xl bg-white shadow-pop ring-1 ring-grey-200/50"
            initial={{ opacity: 0, scale: 0.94, y: 12, originX: 1, originY: 1 }}
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
                Search for help…
              </span>
            </div>

            {refined && (
              <p className="px-4 pt-3 text-[11px] font-semibold uppercase tracking-wide text-grey-400">
                For this page
              </p>
            )}

            <div
              className={`space-y-0.5 px-1.5 py-2 ${
                refined ? '' : 'max-h-[208px] overflow-y-auto'
              }`}
            >
              {flows.map((f) => (
                <FlowRow key={f.label} flow={f} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* The Self-Help FAB — always present. */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="absolute bottom-4 right-4 z-20 grid h-12 w-12 place-items-center rounded-full bg-accent text-white shadow-float transition-transform hover:scale-105"
        aria-label="Self Help"
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="x"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.18 }}
            >
              <X size={20} strokeWidth={2.25} />
            </motion.span>
          ) : (
            <motion.span
              key="help"
              initial={{ opacity: 0, rotate: 90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -90 }}
              transition={{ duration: 0.18 }}
            >
              <LifeBuoy size={20} strokeWidth={2} />
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </>
  )
}
