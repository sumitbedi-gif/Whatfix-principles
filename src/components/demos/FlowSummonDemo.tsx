import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Sparkles } from 'lucide-react'
import type { ToggleState } from './registry'
import { MiniCard } from './MiniCard'

const spring = { type: 'spring' as const, stiffness: 260, damping: 30 }
const ease = [0.22, 1, 0.36, 1] as const

/**
 * Off → modal forced on arrival (interrupts).
 * On  → a quiet "What's new" launcher; the user summons the same modal.
 */
export function FlowSummonOverlay({
  state,
  onDismiss,
}: {
  state: ToggleState
  onDismiss?: () => void
}) {
  const summoned = state.summoned
  const [open, setOpen] = useState(false)
  useEffect(() => setOpen(false), [summoned])

  const showModal = !summoned || open
  // Closing the modal: in summoned mode it returns to the launcher; in forced
  // mode there's nothing behind it, so it dismisses back to the interface.
  const closeModal = () => (summoned ? setOpen(false) : onDismiss?.())

  return (
    <>
      <AnimatePresence>
        {showModal && (
          <motion.div
            key="modal"
            className="absolute inset-0 z-20 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24, ease }}
          >
            <div
              className="absolute inset-0 rounded-2xl bg-ink/25 backdrop-blur-[2px]"
              onClick={closeModal}
            />
            <motion.div
              className="relative w-80"
              initial={{ opacity: 0, scale: 0.96, y: 6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3, ease }}
            >
              <MiniCard
                title="What’s new this release"
                body="Faster reports, a refreshed nav, and three new integrations."
                cta="See highlights"
                secondary="Close"
                onDismiss={closeModal}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {summoned && !open && (
          <motion.button
            key="launcher"
            onClick={() => setOpen(true)}
            className="absolute bottom-4 right-4 z-20 inline-flex items-center gap-1.5 rounded-full bg-accent py-2 pl-3 pr-3.5 text-[12px] font-medium text-white shadow-float"
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 28 }}
            transition={spring}
          >
            <Sparkles size={13} strokeWidth={2.25} />
            What’s new
          </motion.button>
        )}
      </AnimatePresence>
    </>
  )
}
