import { motion } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { CONFIG, type Principle } from '../config'
import { BrandMark } from '../components/BrandMark'

export function IndexView() {
  // The workshop is over, so every principle now lives in one combined list.
  const principles = CONFIG
  return (
    <div className="mx-auto w-full max-w-2xl px-6">
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
      <ul className="mt-20 pb-28 sm:mt-24">
        {principles.map((p, i) => (
          <PrincipleRow key={p.id} principle={p} index={i} />
        ))}
      </ul>
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
