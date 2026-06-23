import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import type { StatementSegment } from '../config'

const ease = [0.22, 1, 0.36, 1] as const

/**
 * The fill-in-the-blank statement, as the cover's centerpiece. It starts with
 * the bracketed options showing ("[veteran / intermediate / first-timer]"); the
 * silence is the lesson. Clicking it makes one chosen value blur into each
 * slot, staggered, so the abstract template resolves into one vivid person.
 */
export function StatementReveal({
  segments,
}: {
  segments: StatementSegment[]
}) {
  const [filled, setFilled] = useState(false)
  // Stagger the blur-in across slots only.
  let slotIndex = -1

  return (
    <button
      type="button"
      onClick={() => setFilled(true)}
      aria-label={filled ? undefined : 'Reveal the statement'}
      className={`block max-w-lg text-balance text-[16px] leading-[1.7] text-grey-600 ${
        filled ? 'cursor-default' : 'cursor-pointer'
      }`}
    >
      {segments.map((seg, i) => {
        if (seg.text) return <span key={i}>{seg.text}</span>
        slotIndex += 1
        const delay = 0.06 + slotIndex * 0.14
        const options = seg.options ?? []
        return (
          <span key={i} className="relative">
            <AnimatePresence mode="wait">
              {filled ? (
                <motion.span
                  key="chosen"
                  initial={{ opacity: 0, y: '0.3em', filter: 'blur(7px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 0.5, ease, delay }}
                  className="font-semibold text-accent"
                >
                  {seg.chosen}
                </motion.span>
              ) : (
                <motion.span
                  key="options"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="font-medium text-grey-400"
                >
                  [{options.join(' / ')}]
                </motion.span>
              )}
            </AnimatePresence>
          </span>
        )
      })}
    </button>
  )
}
