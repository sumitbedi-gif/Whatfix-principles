import { AnimatePresence, motion } from 'motion/react'
import { TriangleAlert, X } from 'lucide-react'
import type { ToggleState } from './registry'

const ease = [0.22, 1, 0.36, 1] as const

/**
 * A signalled phrase. Off → plain body text, indistinguishable from the rest of
 * the sentence. On → it lights up: bold + accent with a soft highlighter sweep,
 * staggered by `order` so the eye is led phrase to phrase.
 */
function Phrase({ text, order, on }: { text: string; order: number; on: boolean }) {
  const delay = 0.06 + order * 0.18
  return (
    <span
      className={`relative whitespace-nowrap transition-[font-weight] ${
        on ? 'font-semibold' : 'font-normal'
      }`}
    >
      {on && (
        <motion.span
          aria-hidden
          className="absolute inset-x-[-3px] inset-y-[-2px] -z-0 origin-left rounded"
          style={{ backgroundColor: 'rgba(255,107,61,0.20)' }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: [0, 1, 1], opacity: [0, 1, 0] }}
          transition={{ duration: 0.7, ease, delay, times: [0, 0.45, 1] }}
        />
      )}
      <motion.span
        className="relative"
        // Off colour matches the body text exactly (grey-500), so an inactive
        // phrase is indistinguishable from the rest of the sentence.
        animate={{ color: on ? '#ff6b3d' : '#85858b' }}
        transition={{ duration: 0.3, ease, delay: on ? delay : 0 }}
      >
        {text}
      </motion.span>
    </span>
  )
}

/**
 * The signalling notice as a modal over the app.
 * Off → flat notice in two paragraphs, every word equal weight.
 * On  → the critical issue and the deadline light up, and a warning icon
 *       appears at the top to sharpen the effect.
 */
export function SignalTextOverlay({
  state,
  onDismiss,
}: {
  state: ToggleState
  onDismiss?: () => void
}) {
  const on = !!state.signal
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center">
      <motion.div
        className="absolute inset-0 rounded-2xl bg-ink/20 backdrop-blur-[2px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease }}
      />
      <motion.div
        className="relative w-[340px] rounded-2xl bg-white shadow-pop ring-1 ring-grey-200/50"
        initial={{ opacity: 0, scale: 0.96, y: 6 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, ease }}
      >
        <button
          aria-label="Dismiss"
          onClick={onDismiss}
          className="absolute right-3 top-3 grid h-7 w-7 place-items-center rounded-lg text-grey-400 transition-colors hover:bg-grey-100 hover:text-ink"
        >
          <X size={15} strokeWidth={2.25} />
        </button>

        <div className="p-6 pr-12">
          <div className="flex items-center gap-2">
            <AnimatePresence>
              {on && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.5, rotate: -8 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ type: 'spring', stiffness: 360, damping: 22 }}
                  className="grid h-5 w-5 place-items-center text-accent"
                >
                  <TriangleAlert size={17} strokeWidth={2.25} />
                </motion.span>
              )}
            </AnimatePresence>
            <h4 className="text-[16px] font-semibold tracking-[-0.01em] text-ink">
              Account notice
            </h4>
          </div>

          <p className="mt-2.5 text-[13.5px] leading-relaxed text-grey-500">
            A <Phrase text="critical security issue" order={0} on={on} /> was
            found on your account. Our systems flagged unusual activity on a
            recent sign-in.
          </p>
          <p className="mt-2.5 text-[13.5px] leading-relaxed text-grey-500">
            Please verify your billing details by{' '}
            <Phrase text="5:00 PM on June 18" order={1} on={on} /> to avoid any
            interruption to your service.
          </p>

          <div className="mt-4 flex items-center gap-1.5">
            <span className="rounded-lg bg-ink px-3.5 py-2 text-[13px] font-medium text-white">
              Review account
            </span>
            <button
              onClick={onDismiss}
              className="rounded-lg px-2.5 py-2 text-[13px] font-medium text-grey-400 transition-colors hover:text-ink"
            >
              Dismiss
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
