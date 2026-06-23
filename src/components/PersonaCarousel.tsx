import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import type { PersonaCard } from '../config'

const ease = [0.22, 1, 0.36, 1] as const

/**
 * A gaming-style persona carousel. The center card is in focus; the two
 * neighbours sit smaller and blurred on either side (it loops). Arrows or the
 * neighbour cards rotate the selection. Clicking the center card opens it
 * full-screen as a modal; clicking the backdrop closes it.
 */
export function PersonaCarousel({ cards }: { cards: PersonaCard[] }) {
  const [index, setIndex] = useState(0)
  const [open, setOpen] = useState(false)
  const n = cards.length

  const go = (dir: number) => setIndex((i) => (i + dir + n) % n)

  // Relative offset of card `i` from the center, in the range [-floor, ...].
  const offsetOf = (i: number) => {
    let d = i - index
    if (d > n / 2) d -= n
    if (d < -n / 2) d += n
    return d
  }

  return (
    <div className="flex h-full flex-col items-center justify-center">
      {/* Stage, overflow hidden so neighbour cards never spill the canvas. */}
      <div className="relative flex h-[300px] w-full items-center justify-center overflow-hidden sm:h-[360px]">
        {cards.map((card, i) => {
          const offset = offsetOf(i)
          const isCenter = offset === 0
          // Only render the center and its immediate neighbours.
          if (Math.abs(offset) > 1) return null
          return (
            <motion.button
              key={card.id}
              type="button"
              onClick={() => (isCenter ? setOpen(true) : setIndex(i))}
              className="absolute aspect-[3/2] w-[60%] max-w-[440px] overflow-hidden rounded-2xl bg-white shadow-pop ring-1 ring-grey-200/60"
              animate={{
                x: `${offset * 46}%`,
                scale: isCenter ? 1 : 0.78,
                filter: isCenter ? 'blur(0px)' : 'blur(2.5px)',
                opacity: isCenter ? 1 : 0.5,
                zIndex: isCenter ? 20 : 10,
              }}
              transition={{ duration: 0.45, ease }}
              style={{ cursor: isCenter ? 'zoom-in' : 'pointer' }}
            >
              <img
                src={card.src}
                alt={`${card.name}, ${card.role}`}
                className="h-full w-full object-cover object-top"
              />
              {!isCenter && (
                <span className="absolute inset-0 bg-white/30" aria-hidden />
              )}
            </motion.button>
          )
        })}
      </div>

      {/* Controls */}
      <div className="mt-6 flex items-center gap-5">
        <button
          onClick={() => go(-1)}
          aria-label="Previous persona"
          className="grid h-10 w-10 place-items-center rounded-full bg-white text-grey-500 shadow-soft ring-1 ring-grey-200/60 transition-colors hover:text-ink"
        >
          <ChevronLeft size={18} strokeWidth={2.25} />
        </button>

        <div className="min-w-[180px] text-center">
          <p className="text-[15px] font-semibold tracking-[-0.01em] text-ink">
            {cards[index].name}
          </p>
          <p className="text-[12.5px] text-grey-500">{cards[index].role}</p>
        </div>

        <button
          onClick={() => go(1)}
          aria-label="Next persona"
          className="grid h-10 w-10 place-items-center rounded-full bg-white text-grey-500 shadow-soft ring-1 ring-grey-200/60 transition-colors hover:text-ink"
        >
          <ChevronRight size={18} strokeWidth={2.25} />
        </button>
      </div>

      {/* Dots */}
      <div className="mt-4 flex gap-1.5">
        {cards.map((c, i) => (
          <button
            key={c.id}
            onClick={() => setIndex(i)}
            aria-label={`Go to ${c.name}`}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? 'w-5 bg-accent' : 'w-1.5 bg-grey-300 hover:bg-grey-400'
            }`}
          />
        ))}
      </div>

      {/* Full-screen modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-3 backdrop-blur-sm sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease }}
            onClick={() => setOpen(false)}
          >
            <motion.img
              key={cards[index].id}
              src={cards[index].src}
              alt={`${cards[index].name}, ${cards[index].role}`}
              className="max-h-[94vh] w-full max-w-[1400px] rounded-2xl bg-white object-contain shadow-pop"
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3, ease }}
              onClick={(e) => e.stopPropagation()}
            />
            <button
              aria-label="Close"
              onClick={() => setOpen(false)}
              className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-grey-600 shadow-float transition-colors hover:text-ink"
            >
              <X size={18} strokeWidth={2.25} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
