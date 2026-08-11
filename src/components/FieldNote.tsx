import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Camera, X } from 'lucide-react'
import type { Principle } from '../config'

/**
 * A photo spotted in the wild: a small button opens a modal, and clicking the
 * photo flips between the before and after shots. Built for live presenting,
 * so the flip is one click anywhere on the image and Esc closes.
 */
export function FieldNote({ note }: { note: NonNullable<Principle['fieldNote']> }) {
  const [open, setOpen] = useState(false)
  const [after, setAfter] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        setOpen(false)
      }
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [open])

  const shot = after ? note.after : note.before

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setAfter(false)
          setOpen(true)
        }}
        className="mt-6 inline-flex items-center gap-2 rounded-full border border-grey-200 px-3 py-1.5 text-[12.5px] text-grey-600 transition-colors hover:border-accent hover:text-accent"
      >
        <Camera size={14} />
        {note.label}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 p-5 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-white"
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-5 py-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-[10px] uppercase tracking-eyebrow text-grey-400">
                    {note.caption}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-eyebrow ${
                      after
                        ? 'bg-good/10 text-good'
                        : 'bg-bad/10 text-bad'
                    }`}
                  >
                    {after ? 'Proposed' : 'As found'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="text-grey-400 transition-colors hover:text-ink"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Click anywhere on the photo to flip. */}
              <button
                type="button"
                onClick={() => setAfter((v) => !v)}
                className="group relative block w-full cursor-pointer bg-grey-50"
                aria-label="Flip between the two versions"
              >
                <div className="relative flex h-[52vh] items-center justify-center overflow-hidden">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.img
                      key={shot.src}
                      src={shot.src}
                      alt={shot.caption}
                      initial={{ opacity: 0, scale: 1.01 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full w-full object-contain"
                    />
                  </AnimatePresence>
                </div>
                <span className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-ink/75 px-2.5 py-1 font-mono text-[9px] uppercase tracking-eyebrow text-white opacity-0 transition-opacity group-hover:opacity-100">
                  Click to flip
                </span>
              </button>

              <p className="px-5 py-4 text-[13.5px] leading-relaxed text-grey-600">
                {shot.caption}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
