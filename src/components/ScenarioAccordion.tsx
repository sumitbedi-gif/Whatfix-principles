import { AnimatePresence, motion } from 'motion/react'
import { Plus } from 'lucide-react'
import type { Scenario } from '../config'

interface ScenarioAccordionProps {
  scenario: Scenario
  index: number
  active: boolean
  onSelect: () => void
}

/**
 * A left-rail scenario card. Clicking selects it (driving the right-side
 * playground) and expands its info. Only one is open at a time.
 */
export function ScenarioAccordion({
  scenario,
  index,
  active,
  onSelect,
}: ScenarioAccordionProps) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border transition-colors duration-200 ${
        active
          ? 'border-grey-300 bg-white shadow-card'
          : 'border-grey-200 bg-grey-50 hover:border-grey-300'
      }`}
    >
      <button
        onClick={onSelect}
        className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
      >
        <span
          className={`grid h-6 w-6 shrink-0 place-items-center rounded-md font-mono text-[11px] transition-colors ${
            active ? 'bg-accent text-white' : 'bg-grey-200 text-grey-500'
          }`}
        >
          {index + 1}
        </span>
        <span
          className={`flex-1 text-[13.5px] font-medium tracking-[-0.01em] ${
            active ? 'text-ink' : 'text-grey-600'
          }`}
        >
          {scenario.title}
        </span>
        <Plus
          size={15}
          className={`shrink-0 text-grey-400 transition-transform duration-300 ${
            active ? 'rotate-45' : ''
          }`}
        />
      </button>

      <AnimatePresence initial={false}>
        {active && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="space-y-2.5 px-4 pb-4 pl-[52px] pt-0.5">
              {scenario.info.map((para, i) => (
                <p key={i} className="text-[13px] leading-relaxed text-grey-600">
                  {para}
                </p>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
