import { AnimatePresence, motion } from 'motion/react'
import type { ToggleState } from './registry'
import { MiniCard } from './MiniCard'

const spring = { type: 'spring' as const, stiffness: 260, damping: 30 }
const ease = [0.22, 1, 0.36, 1] as const

/**
 * Off → blocking modal over a dimmed form (breaks flow).
 * On  → peripheral toast bottom-right, form stays usable (respects flow).
 */
export function FlowInterruptOverlay({
  state,
  onDismiss,
}: {
  state: ToggleState
  onDismiss?: () => void
}) {
  const peripheral = state.peripheral
  return (
    <AnimatePresence mode="wait">
      {peripheral ? (
        <motion.div
          key="toast"
          className="absolute bottom-4 right-4 z-20 w-72"
          initial={{ opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 28 }}
          transition={spring}
        >
          <MiniCard
            condensed
            title="New: Dashboard 2.0"
            body="Redesigned analytics, whenever you’re ready."
            cta="Take a look"
            onDismiss={onDismiss}
          />
        </motion.div>
      ) : (
        <motion.div
          key="modal"
          className="absolute inset-0 z-20 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.24, ease }}
        >
          <div className="absolute inset-0 rounded-2xl bg-ink/25 backdrop-blur-[2px]" />
          <motion.div
            className="relative w-80"
            initial={{ opacity: 0, scale: 0.96, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.3, ease }}
          >
            <MiniCard
              title="Meet the new Dashboard"
              body="Redesigned analytics, custom widgets, and saved views, all in one place."
              cta="Explore now"
              secondary="Later"
              onDismiss={onDismiss}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
