import { useEffect } from 'react'
import { motion } from 'motion/react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import type { Principle } from '../config'
import { BlurText } from '../components/BlurText'
import { StatementReveal } from '../components/StatementReveal'

const ease = [0.22, 1, 0.36, 1] as const

/**
 * The cover state for a principle: title + intro centered on white, with a
 * subtle "Jump to playground" link. Built for live presenting, frame the idea
 * here, then drop into the interactive playground. → / Enter also advance.
 */
export function PrincipleCover({
  principle,
  onEnter,
}: {
  principle: Principle
  onEnter: () => void
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight' || e.key === 'Enter') {
        e.preventDefault()
        onEnter()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onEnter])

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col px-6">
      <header className="pt-7">
        <a
          href="#/"
          className="group inline-flex items-center gap-1.5 text-[13px] text-grey-500 transition-colors hover:text-ink"
        >
          <ArrowLeft
            size={14}
            className="transition-transform group-hover:-translate-x-0.5"
          />
          All principles
        </a>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center pb-24 text-center">
        <motion.span
          className="font-mono text-[11px] uppercase tracking-eyebrow text-grey-400"
          initial={{ opacity: 0, filter: 'blur(6px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.6, ease }}
        >
          Principle {principle.ordinal}
        </motion.span>

        <BlurText
          as="h1"
          text={principle.label}
          className="font-display mt-4 text-[44px] leading-[1.04] sm:text-[56px]"
          stagger={0.06}
          delay={0.15}
        />

        {principle.statement ? (
          <motion.div
            className="mt-7 flex flex-col items-center"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.15 + principle.label.split(' ').length * 0.06 + 0.15,
              ease,
            }}
          >
            <StatementReveal segments={principle.statement} />
            <p className="mt-4 text-[12.5px] text-grey-400">
              Tap the statement to meet one real user.
            </p>
          </motion.div>
        ) : (
          principle.cover && (
            <BlurText
              as="p"
              text={principle.cover}
              className="mt-7 max-w-lg text-balance text-[16px] leading-[1.7] text-grey-600"
              stagger={0.018}
              delay={0.15 + principle.label.split(' ').length * 0.06 + 0.15}
            />
          )
        )}

        <motion.button
          onClick={onEnter}
          className="group mt-12 inline-flex items-center gap-2 text-[14px] font-medium text-grey-500 transition-colors hover:text-ink"
          initial={{ opacity: 0, y: 6, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.6, delay: 1.15, ease }}
        >
          Jump to playground
          <ArrowRight
            size={15}
            className="transition-transform group-hover:translate-x-1"
          />
        </motion.button>
      </div>
    </div>
  )
}
