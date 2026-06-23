import { useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import type { PactKey } from '../config'

const ease = [0.22, 1, 0.36, 1] as const

interface Sticker {
  src: string
  lens: PactKey
  /** Position as a percentage of the board (center of the sticker). */
  x: number
  y: number
  /** Subtle hand-placed rotation, degrees. */
  rotate: number
  /** Width as a percentage of the board. */
  w: number
  /** Handwritten label shown under the sticker when its lens is active. */
  label: string
}

/**
 * The 11 hand-drawn cutouts, scattered like the reference sticker sheet. Each
 * belongs to a PACT lens; selecting a lens keeps its stickers (with a
 * handwritten label) and fades the rest. Hand-tuned so nothing overlaps or
 * clips the board.
 */
const STICKERS: Sticker[] = [
  // Row 1
  { src: 'activity-2.png', lens: 'activities', x: 5, y: 5, rotate: -4, w: 19, label: 'many times a day' },
  { src: 'activity-1.png', lens: 'activities', x: 29, y: 4, rotate: 3, w: 17, label: 'every now and then' },
  { src: 'people-1.png', lens: 'people', x: 52, y: 4, rotate: -2, w: 11, label: 'nervous novice' },
  { src: 'context-2.png', lens: 'context', x: 74, y: 5, rotate: 5, w: 12, label: 'on the move' },
  // Row 2
  { src: 'context-1.png', lens: 'context', x: 5, y: 32, rotate: 4, w: 12, label: 'racing the clock' },
  { src: 'people-2.png', lens: 'people', x: 29, y: 33, rotate: -3, w: 17, label: 'calm veteran' },
  { src: 'tech-1.png', lens: 'technology', x: 53, y: 32, rotate: 2, w: 14, label: 'on a call' },
  { src: 'tech-2.png', lens: 'technology', x: 76, y: 32, rotate: -5, w: 13, label: 'reading a tablet' },
  // Row 3
  { src: 'tech-3.png', lens: 'technology', x: 12, y: 58, rotate: 3, w: 13, label: 'on the phone' },
  { src: 'tech-4.png', lens: 'technology', x: 40, y: 59, rotate: -2, w: 14, label: 'one hand on a tablet' },
  { src: 'activity-3.png', lens: 'activities', x: 73, y: 68, rotate: 4, w: 21, label: 'once a quarter' },
]

/** A static film-grain canvas, multiply-blended over the board. */
function Grain() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const w = (canvas.width = 320)
    const h = (canvas.height = 320)
    const img = ctx.createImageData(w, h)
    const d = img.data
    for (let i = 0; i < d.length; i += 4) {
      const v = 120 + Math.random() * 135
      d[i] = d[i + 1] = d[i + 2] = v
      d[i + 3] = 26
    }
    ctx.putImageData(img, 0, 0)
  }, [])
  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full rounded-2xl"
      style={{ mixBlendMode: 'multiply', opacity: 0.55 }}
    />
  )
}

/**
 * The brown, lightly grungy board with all cutouts by default. Selecting a PACT
 * lens highlights that lens's stickers and fades the rest, while the board
 * stays put. With no active lens, everything sits at full weight.
 */
export function PactStickerBoard({ active }: { active: PactKey | null }) {
  return (
    <div
      className="relative h-full w-full overflow-hidden rounded-2xl"
      style={{
        backgroundColor: '#b3a489',
        backgroundImage: `
          radial-gradient(circle at 22% 28%, rgba(255,250,240,0.10), transparent 45%),
          radial-gradient(circle at 78% 72%, rgba(60,45,25,0.12), transparent 50%)
        `,
      }}
    >
      <Grain />
      {/* Soft vignette for depth */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl shadow-[inset_0_0_90px_rgba(40,30,15,0.28)]" />

      {STICKERS.map((s, i) => {
        const dim = active != null && s.lens !== active
        const highlighted = active != null && s.lens === active
        return (
          <motion.div
            key={s.src}
            className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
            style={{ left: `${s.x}%`, top: `${s.y}%`, width: `${s.w}%` }}
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: dim ? 0.1 : 1, scale: dim ? 0.9 : 1, y: 0 }}
            transition={{ duration: 0.45, ease, delay: 0.03 * i }}
          >
            <img
              src={`/pact-stickers/${s.src}`}
              alt=""
              className="w-full select-none drop-shadow-[0_5px_9px_rgba(0,0,0,0.25)]"
              style={{ rotate: `${s.rotate}deg` }}
              draggable={false}
            />
            <motion.span
              className="font-hand pointer-events-none mt-2 whitespace-nowrap text-center text-[20px] leading-none text-white/90 [text-shadow:_0_1px_3px_rgba(0,0,0,0.45)]"
              animate={{ opacity: highlighted ? 1 : 0, y: highlighted ? 0 : -3 }}
              transition={{ duration: 0.3, ease, delay: highlighted ? 0.15 : 0 }}
            >
              {s.label}
            </motion.span>
          </motion.div>
        )
      })}
    </div>
  )
}
