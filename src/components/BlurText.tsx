import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

/**
 * Buttery text entrance: each word resolves into focus (blur → 0) while it
 * fades and rises slightly, staggered gently. The blur-in is what makes it read
 * as smooth rather than a hard fade. Honours reduced-motion.
 */
const ease = [0.22, 1, 0.36, 1] as const

export function BlurText({
  text,
  className = '',
  as = 'p',
  stagger = 0.045,
  delay = 0,
}: {
  text: string
  className?: string
  as?: 'h1' | 'p' | 'span'
  stagger?: number
  delay?: number
}) {
  const reduce = useReducedMotion()
  const MotionTag = motion[as] as typeof motion.p
  const words = text.split(' ')

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren: delay } },
  }
  const word = {
    hidden: reduce
      ? { opacity: 0 }
      : { opacity: 0, y: '0.45em', filter: 'blur(8px)' },
    show: {
      opacity: 1,
      y: '0em',
      filter: 'blur(0px)',
      transition: { duration: 0.6, ease },
    },
  }

  return (
    <MotionTag
      className={className}
      variants={container}
      initial="hidden"
      animate="show"
    >
      {words.map((w, i) => (
        <span key={i}>
          <motion.span
            variants={word}
            style={{ display: 'inline-block', willChange: 'transform, filter' }}
          >
            {w}
          </motion.span>
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </MotionTag>
  ) as ReactNode
}
