import { useState } from 'react'
import { motion } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { CONFIG, type Principle } from '../config'
import { BrandMark } from '../components/BrandMark'

export function IndexView() {
  const [day, setDay] = useState<1 | 2>(1)
  const principles = CONFIG.filter((p) => (p.day ?? 1) === day)
  return (
    <div className="mx-auto w-full max-w-2xl px-6">
      <DayToggle day={day} onChange={setDay} />

      <header className="flex justify-center pt-9">
        <a href="#/" aria-label="Whatfix home" className="inline-block">
          <BrandMark className="h-7 w-auto" />
        </a>
      </header>

      {/* Centered title block */}
      <div className="pt-24 text-center sm:pt-32">
        <motion.h1
          className="font-display text-[52px] leading-[0.98] sm:text-[60px]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          Things every Whatfix
          <br />
          author should know
        </motion.h1>
        <motion.p
          className="mx-auto mt-6 max-w-sm text-[14px] leading-relaxed text-grey-500"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
        >
          A working set of principles for guidance that respects attention,
          earns a glance, and never trains the user to dismiss you.
        </motion.p>
      </div>

      {/* Principle list */}
      <ul key={day} className="mt-20 pb-28 sm:mt-24">
        {principles.map((p, i) => (
          <PrincipleRow key={p.id} principle={p} index={i} />
        ))}
      </ul>
    </div>
  )
}

/**
 * A minimal, Apple-style segmented toggle pinned to the top-right corner.
 * Both days are selectable; the white pill glides between them via a shared
 * layoutId. Day 2's principles are all still "soon", so a quiet caption notes
 * that when Day 2 is active.
 */
function DayToggle({
  day,
  onChange,
}: {
  day: 1 | 2
  onChange: (d: 1 | 2) => void
}) {
  return (
    <div className="fixed right-6 top-6 z-50 flex flex-col items-end gap-1.5">
      <div className="relative flex items-center rounded-full bg-grey-100/90 p-1 backdrop-blur">
        {([1, 2] as const).map((d) => (
          <button
            key={d}
            onClick={() => onChange(d)}
            className={`relative z-10 rounded-full px-4 py-1.5 text-[12.5px] font-medium transition-colors ${
              day === d ? 'text-ink' : 'text-grey-400 hover:text-grey-600'
            }`}
          >
            {day === d && (
              <motion.span
                layoutId="day-pill"
                className="absolute inset-0 -z-10 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
                transition={{ type: 'spring', stiffness: 500, damping: 38 }}
              />
            )}
            Day {d}
          </button>
        ))}
      </div>
      <motion.span
        initial={false}
        animate={{ opacity: day === 2 ? 1 : 0, y: day === 2 ? 0 : -3 }}
        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
        className="pr-1 text-[11px] text-grey-400"
      >
        Coming soon
      </motion.span>
    </div>
  )
}

function PrincipleRow({
  principle,
  index,
}: {
  principle: Principle
  index: number
}) {
  const live = principle.status === 'live'
  const inner = (
    <div className="flex items-center justify-between gap-6 py-[18px]">
      <div className="min-w-0">
        <h2
          className={`text-[15px] font-medium tracking-[-0.01em] ${
            live ? 'text-ink' : 'text-grey-400'
          }`}
        >
          {principle.label}
        </h2>
        <p
          className={`mt-1 text-[14px] leading-relaxed ${
            live ? 'text-grey-500' : 'text-grey-400'
          }`}
        >
          {principle.summary}
        </p>
      </div>
      {live ? (
        <ArrowUpRight
          size={15}
          className="shrink-0 text-grey-300 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink"
        />
      ) : (
        <span className="shrink-0 rounded-full bg-grey-100 px-2 py-0.5 font-mono text-[9px] uppercase tracking-eyebrow text-grey-400">
          soon
        </span>
      )}
    </div>
  )

  return (
    <motion.li
      className="border-b border-grey-200/70 first:border-t"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: 0.12 + index * 0.025,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {live ? (
        <a
          href={`#/${principle.id}`}
          className="group -mx-3 block rounded-lg px-3 transition-colors hover:bg-grey-50"
        >
          {inner}
        </a>
      ) : (
        <div className="-mx-3 cursor-not-allowed px-3">{inner}</div>
      )}
    </motion.li>
  )
}
