import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import type { Statement } from '../config'

const ease = [0.22, 1, 0.36, 1] as const

/**
 * The fill-in-the-blank statement, as the cover's centerpiece. It starts with
 * the first slot offering the expertise choices ("[a veteran / intermediate /
 * a first-timer]") and the rest blank. Pick one and the whole statement fills
 * to a coherent persona, blurring in slot by slot. The picker stays live, so
 * switching persona re-fills the rest accordingly.
 */
export function StatementReveal({ statement }: { statement: Statement }) {
  const { segments, options, placeholders, presets } = statement
  // Which preset is chosen, or null before any pick.
  const [choice, setChoice] = useState<number | null>(null)
  const preset = choice == null ? null : presets[choice]

  return (
    <div className="max-w-lg text-pretty text-[16px] leading-[1.7] text-grey-600">
      {segments.map((seg, i) => {
        if (seg.text) return <span key={i}>{seg.text}</span>
        const slot = seg.slot ?? 0

        // Slot 0 is the picker. Before a choice it shows the bracket options;
        // each option is individually clickable.
        if (slot === 0 && choice == null) {
          return (
            <span key={i} className="font-medium text-grey-400">
              [
              {options.map((opt, oi) => (
                <span key={opt}>
                  {oi > 0 && ' / '}
                  <button
                    type="button"
                    onClick={() => setChoice(oi)}
                    className="rounded px-0.5 underline-offset-2 transition-colors hover:text-accent hover:underline"
                  >
                    {opt}
                  </button>
                </span>
              ))}
              ]
            </span>
          )
        }

        // Filled slot, blur the chosen value in. Re-keys per choice so a new
        // pick re-animates.
        if (preset) {
          const delay = slot === 0 ? 0 : 0.06 + slot * 0.12
          return (
            <span key={i} className="relative">
              <AnimatePresence mode="wait">
                <motion.button
                  key={`${choice}-${slot}`}
                  type="button"
                  // Only the picker stays interactive after filling.
                  onClick={
                    slot === 0
                      ? () => setChoice((c) => ((c ?? 0) + 1) % presets.length)
                      : undefined
                  }
                  initial={{ opacity: 0, y: '0.3em', filter: 'blur(7px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 0.5, ease, delay }}
                  className={`whitespace-nowrap font-semibold text-accent ${
                    slot === 0
                      ? 'rounded underline decoration-accent/30 underline-offset-2 hover:decoration-accent'
                      : 'cursor-default'
                  }`}
                >
                  {preset.fills[slot]}
                </motion.button>
              </AnimatePresence>
            </span>
          )
        }

        // Other slots before any pick, a placeholder hint. Kept legible for
        // projection (grey-500 + medium weight), and non-breaking.
        return (
          <span key={i} className="whitespace-nowrap font-medium text-grey-500">
            [{placeholders[slot] ?? ''}]
          </span>
        )
      })}
    </div>
  )
}
