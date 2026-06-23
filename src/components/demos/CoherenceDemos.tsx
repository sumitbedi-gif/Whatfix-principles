import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { UploadCloud, FileUp } from 'lucide-react'
import type { AppProps, ToggleState } from './registry'

const ease = [0.22, 1, 0.36, 1] as const

/* All three coherence demos sit on a calm app. */
export function coherenceApp(): AppProps {
  return { focusField: false }
}

/* ── Scenario 1 ── A wordy tooltip walk-through vs. a crisp one ───────────── */
/** The toolbar + tooltip live inside SkeletonApp (see TooltipTour), so the
 *  targets are part of the UI. This just sets verbose vs. crisp. */
export function coherenceTooltipApp(state: ToggleState): AppProps {
  return { focusField: false, tooltipTour: !!state.crisp }
}

/* ── Scenario 2 ── A form clogged with help text vs. on-demand "i" tips ───── */
export function coherenceFormApp(state: ToggleState): AppProps {
  return { focusField: false, coherentForm: !!state.coherent }
}

/* ── Scenario 3 ── Coherence by subtraction, proven with data ─────────────── */
export function coherencePruneApp(): AppProps {
  return { focusField: false }
}

interface Fmt {
  label: string
  pct: number
}
const FORMATS: Fmt[] = [
  { label: 'PDF', pct: 61 },
  { label: 'DOCX', pct: 33 },
  { label: 'XML', pct: 4 },
  { label: 'RTF', pct: 2 },
]
/** Formats that survive the prune (the ones people actually use). */
const KEPT = new Set(['PDF', 'DOCX'])

export function CoherencePruneOverlay({ state }: { state: ToggleState }) {
  const pruned = !!state.pruned
  // Usage percentages stay hidden until the user clicks a control; toggling on
  // removes the clutter outright.
  const [showUsage, setShowUsage] = useState(false)
  const usage = showUsage && !pruned

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center">
      <div className="w-[420px] rounded-2xl bg-white p-6 shadow-pop ring-1 ring-grey-200/50">
        <h4 className="text-[15px] font-semibold tracking-[-0.01em] text-ink">
          Upload a contract
        </h4>
        <p className="mt-1 text-[12.5px] text-grey-500">
          {pruned
            ? 'The one path people actually take.'
            : usage
              ? 'Usage over the last 3 months.'
              : 'Choose how to add your file.'}
        </p>

        {/* Primary upload controls */}
        <div className="mt-4 space-y-2.5">
          {/* Drag & drop, always kept (the 82% path) */}
          <button
            onClick={() => setShowUsage(true)}
            className="relative flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-accent/40 bg-accent-soft py-7"
          >
            <UploadCloud size={24} className="text-accent" strokeWidth={1.8} />
            <p className="text-[13px] font-medium text-ink">
              Drag & drop your contract
            </p>
            {usage && <UsageTag pct={82} />}
          </button>

          {/* Redundant "Upload Contract" button, removed when pruned */}
          <AnimatePresence>
            {!pruned && (
              <motion.button
                onClick={() => setShowUsage(true)}
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.3, ease }}
                className="relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl border border-grey-200 bg-grey-50 py-3 text-[13px] font-medium text-grey-600"
              >
                <FileUp size={16} strokeWidth={2} />
                Upload Contract
                {usage && <UsageTag pct={4} low />}
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Format chips */}
        <p className="mt-5 text-[11px] font-semibold uppercase tracking-wide text-grey-400">
          Accepted formats
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {FORMATS.map((f) => {
            const kept = KEPT.has(f.label)
            return (
              <AnimatePresence key={f.label}>
                {(!pruned || kept) && (
                  <motion.button
                    onClick={() => setShowUsage(true)}
                    initial={false}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.25, ease }}
                    className={`relative inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[12.5px] font-medium ${
                      pruned && kept
                        ? 'border-grey-200 bg-grey-50 text-ink'
                        : 'border-grey-200 bg-white text-grey-600'
                    }`}
                  >
                    {f.label}
                    {usage && (
                      <span
                        className={`text-[10.5px] font-semibold ${
                          f.pct < 5 ? 'text-bad' : 'text-grey-400'
                        }`}
                      >
                        {f.pct}%
                      </span>
                    )}
                  </motion.button>
                )}
              </AnimatePresence>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/** A tiny usage-percentage annotation pinned to a control. */
function UsageTag({ pct, low = false }: { pct: number; low?: boolean }) {
  return (
    <span
      className={`absolute right-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
        low ? 'bg-bad/10 text-bad' : 'bg-white/70 text-grey-500'
      }`}
    >
      {pct}% used
    </span>
  )
}
