import { useEffect } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { CONFIG, type Principle } from '../config'
import { BrandMark } from '../components/BrandMark'
import { PrincipleGlyph } from '../components/PrincipleGlyphs'

/**
 * The landing page is a dark editorial "print spread": cream plates on warm
 * charcoal, one orange spot colour, mono labels with dotted leaders, halftone
 * icon plates with crop marks. Detail pages keep their light look; only this
 * view is dark, so it owns the body background while mounted.
 */

const EASE = [0.16, 1, 0.3, 1] as const

/** Two rows of fine leader dots, in the current text colour. */
function DotLeader({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`h-[7px] min-w-6 flex-1 opacity-40 ${className}`}
      style={{
        backgroundImage:
          'radial-gradient(circle, currentColor 1px, transparent 1.1px)',
        backgroundSize: '6px 4px',
      }}
    />
  )
}

/** Thin L-brackets in the four corners of a plate. */
function CropMarks() {
  const edge = 'absolute h-3 w-3 border-current opacity-50'
  return (
    <div aria-hidden className="pointer-events-none absolute inset-2">
      <span className={`${edge} left-0 top-0 border-l border-t`} />
      <span className={`${edge} right-0 top-0 border-r border-t`} />
      <span className={`${edge} bottom-0 left-0 border-b border-l`} />
      <span className={`${edge} bottom-0 right-0 border-b border-r`} />
    </div>
  )
}

function Diamond({ filled = false }: { filled?: boolean }) {
  return (
    <span
      aria-hidden
      className={`inline-block h-[7px] w-[7px] rotate-45 ${
        filled ? 'bg-current' : 'border border-current'
      }`}
    />
  )
}

/** Cream masthead strip: edition marks, a ruler of the fifteen ordinals. */
function TopPlate() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="bg-spread-paper text-spread-ink [clip-path:polygon(0_0,100%_0,100%_calc(100%-14px),calc(100%-14px)_100%,14px_100%,0_calc(100%-14px))]"
    >
      <div className="flex items-center gap-5 px-5 pb-2.5 pt-3 font-mono text-[10px] uppercase tracking-eyebrow sm:px-7">
        <span>026</span>
        <div className="hidden flex-1 items-center justify-between opacity-60 md:flex">
          {CONFIG.map((p) => (
            <span key={p.id}>{p.ordinal}</span>
          ))}
        </div>
        <DotLeader className="md:hidden" />
        <span>027</span>
      </div>
      <div className="flex items-center gap-4 border-t border-spread-ink/20 px-5 pb-3 pt-2.5 sm:px-7">
        <span className="font-mono text-[10px] font-medium uppercase tracking-eyebrow">
          Build for the brain
        </span>
        <DotLeader />
        <span className="hidden items-center gap-2 font-mono text-[10px] uppercase tracking-eyebrow sm:flex">
          <Diamond /> 15 principles
        </span>
        <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-eyebrow">
          <Diamond filled /> 36 live demos
        </span>
      </div>
    </motion.header>
  )
}

/** Tan hero panel: wordmark, giant serif title, the working thesis. */
function Hero() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.12, ease: EASE }}
      className="mt-8 bg-spread-tan text-spread-ink [clip-path:polygon(22px_0,100%_0,100%_calc(100%-22px),calc(100%-22px)_100%,0_100%,0_22px)]"
    >
      <div className="px-6 pb-10 pt-7 sm:px-10 sm:pb-14 sm:pt-9">
        <div className="flex items-center gap-4">
          <a href="#/" aria-label="Whatfix home" className="shrink-0">
            <BrandMark className="h-6 w-auto" />
          </a>
          <DotLeader />
          <span className="font-mono text-[10px] uppercase tracking-eyebrow opacity-70">
            Author enablement
          </span>
        </div>
        <h1 className="mt-10 max-w-4xl font-display text-[clamp(44px,7.5vw,94px)] leading-[0.97]">
          Things every Whatfix author should know
        </h1>
        <p className="mt-7 max-w-md text-[15px] leading-relaxed opacity-80">
          A working set of principles for guidance that respects attention,
          earns a glance, and never trains the user to dismiss you.
        </p>
      </div>
    </motion.section>
  )
}

/** Mono rule on the charcoal, between hero and the card plates. */
function SectionRule() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3, ease: EASE }}
      className="mt-14 flex items-center gap-4 text-spread-paper"
    >
      <Diamond />
      <span className="font-mono text-[10px] uppercase tracking-eyebrow">
        The principles
      </span>
      <DotLeader />
      <span className="font-mono text-[10px] uppercase tracking-eyebrow opacity-60">
        001 — 015
      </span>
    </motion.div>
  )
}

function PrincipleCard({
  principle,
  index,
}: {
  principle: Principle
  index: number
}) {
  const live = principle.status === 'live'
  const num = String(index + 1).padStart(3, '0')

  const body = (
    <>
      {/* Title + icon plate. flex-1 keeps caption seams aligned across a row. */}
      <div className="relative flex flex-1 flex-col rounded-[8px] bg-spread-paper px-5 pb-5 pt-4 transition-colors duration-200 [clip-path:polygon(0_0,calc(100%-16px)_0,100%_16px,100%_100%,0_100%)] group-hover:bg-spread-orange group-focus-visible:bg-spread-orange">
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-grotesk text-[19px] font-semibold leading-snug tracking-[-0.015em]">
            {principle.label}
          </h2>
          <span className="pt-1 font-mono text-[10px] tracking-eyebrow opacity-50">
            {num}
          </span>
        </div>
        <div
          className="relative mt-4 min-h-[208px] flex-1 rounded-[5px]"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(29,28,23,0.15) 0.9px, transparent 1px)',
            backgroundSize: '7px 7px',
          }}
        >
          <CropMarks />
          <div className="absolute inset-0 p-5">
            <PrincipleGlyph id={principle.id} />
          </div>
        </div>
      </div>

      {/* Registration diamond in the seam. */}
      <div className="relative">
        <span
          aria-hidden
          className="absolute left-1/2 top-1/2 z-10 h-[9px] w-[9px] -translate-x-1/2 -translate-y-1/2 rotate-45 bg-spread-bg"
        />
      </div>

      {/* Caption chip, a separate plate under a thin charcoal seam. */}
      <div className="relative mt-1 min-h-[64px] rounded-[8px] bg-spread-paper py-3.5 pl-5 pr-9 transition-colors duration-200 group-hover:bg-spread-orangedeep group-focus-visible:bg-spread-orangedeep">
        <p className="text-[13px] leading-relaxed opacity-85">
          {principle.summary}
        </p>
        <span
          aria-hidden
          className="absolute right-4 top-1/2 h-6 w-[3px] -translate-y-1/2 opacity-40"
          style={{
            backgroundImage:
              'radial-gradient(circle, currentColor 1px, transparent 1.1px)',
            backgroundSize: '3px 6px',
          }}
        />
      </div>
    </>
  )

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 26 },
        shown: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.55, ease: EASE },
        },
      }}
      className="flex"
    >
      {live ? (
        <a
          href={`#/${principle.id}`}
          className="group flex w-full flex-col text-spread-ink outline-none"
        >
          {body}
        </a>
      ) : (
        <div className="flex w-full flex-col text-spread-ink opacity-50">
          {body}
        </div>
      )}
    </motion.div>
  )
}

/** Tan colophon strip mirroring the masthead. */
function FooterPlate() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.5, ease: EASE }}
      className="mt-14 bg-spread-tan text-spread-ink [clip-path:polygon(14px_0,calc(100%-14px)_0,100%_14px,100%_100%,0_100%,0_14px)]"
    >
      <div className="flex items-center gap-4 px-5 py-3.5 font-mono text-[10px] uppercase tracking-eyebrow sm:px-7">
        <span>Sumit Bedi · Product Design</span>
        <DotLeader />
        <span className="hidden normal-case tracking-normal sm:inline">
          You are not your user.
        </span>
        <DotLeader className="hidden sm:block" />
        <span>MMXXVI</span>
      </div>
    </motion.footer>
  )
}

export function IndexView() {
  const reduceMotion = useReducedMotion()

  // Own the page background while the spread is mounted, so overscroll and
  // short viewports stay charcoal instead of flashing the detail-page white.
  useEffect(() => {
    const prev = document.body.style.backgroundColor
    document.body.style.backgroundColor = '#272621'
    return () => {
      document.body.style.backgroundColor = prev
    }
  }, [])

  return (
    <div
      className="min-h-screen bg-spread-bg"
      style={{
        backgroundImage:
          'linear-gradient(rgba(234,227,211,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(234,227,211,0.045) 1px, transparent 1px)',
        backgroundSize: '140px 140px',
      }}
    >
      <div className="mx-auto w-full max-w-[1200px] px-4 pb-16 pt-6 sm:px-8 sm:pt-8">
        <TopPlate />
        <Hero />
        <SectionRule />
        <motion.div
          className="mt-6 grid grid-cols-1 gap-x-1 gap-y-6 sm:grid-cols-2 sm:gap-y-1 lg:grid-cols-3"
          initial={reduceMotion ? 'shown' : 'hidden'}
          animate="shown"
          variants={{
            shown: { transition: { staggerChildren: 0.07, delayChildren: 0.4 } },
          }}
        >
          {CONFIG.map((p, i) => (
            <PrincipleCard key={p.id} principle={p} index={i} />
          ))}
        </motion.div>
        <FooterPlate />
      </div>
    </div>
  )
}
