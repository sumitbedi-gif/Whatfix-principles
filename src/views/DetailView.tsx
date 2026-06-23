import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowLeft, Users } from 'lucide-react'
import type { PactKey, Principle } from '../config'
import { ScenarioAccordion } from '../components/ScenarioAccordion'
import { Playground } from '../components/Playground'
import { PersonaGallery } from '../components/PersonaGallery'
import { PersonaCarousel } from '../components/PersonaCarousel'
import { ToolOrbit } from '../components/ToolOrbit'
import { PrincipleCover } from './PrincipleCover'

const ease = [0.22, 1, 0.36, 1] as const

export function DetailView({ principle }: { principle: Principle }) {
  // Each principle opens on its cover; "Jump to playground" enters the demo.
  const [phase, setPhase] = useState<'cover' | 'playground'>('cover')

  // Reset to the cover whenever the principle changes.
  useEffect(() => setPhase('cover'), [principle.id])

  return (
    <AnimatePresence mode="wait">
      {phase === 'cover' ? (
        <motion.div
          key="cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3, ease }}
        >
          <PrincipleCover
            principle={principle}
            onEnter={() => setPhase('playground')}
          />
        </motion.div>
      ) : (
        <motion.div
          key="playground"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.34, ease }}
        >
          {principle.pact ? (
            <FrameworkLayout principle={principle} />
          ) : principle.intents ? (
            <ToolsLayout principle={principle} />
          ) : (
            <PlaygroundLayout principle={principle} />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function PlaygroundLayout({ principle }: { principle: Principle }) {
  const scenarios = principle.scenarios ?? []
  const [activeIdx, setActiveIdx] = useState(0)
  const active = scenarios[activeIdx]

  return (
    <div className="flex h-screen flex-col lg:flex-row">
      {/* LEFT, scrollable editorial column */}
      <div className="no-scrollbar flex w-full flex-col overflow-y-auto px-7 pb-16 pt-7 lg:w-[30%] lg:px-9">
        {/* Back goes straight to the index list; the cover only appears when
            entering a principle from the list. */}
        <a
          href="#/"
          className="group inline-flex w-fit items-center gap-1.5 text-[13px] text-grey-500 transition-colors hover:text-ink"
        >
          <ArrowLeft
            size={14}
            className="transition-transform group-hover:-translate-x-0.5"
          />
          All principles
        </a>

        <div className="mt-12">
          <span className="font-mono text-[11px] uppercase tracking-eyebrow text-grey-400">
            Principle {principle.ordinal}
          </span>
          <h1 className="font-display mt-3 text-[36px] leading-[1.05] sm:text-[40px]">
            {principle.label}
          </h1>

          {principle.intro?.map((para, i) => (
            <p
              key={i}
              className="mt-5 text-[15px] leading-[1.65] text-grey-600 first-of-type:mt-7"
            >
              {para}
            </p>
          ))}
        </div>

        {/* Scenario accordions, selecting one drives the playground */}
        <div className="mt-9 space-y-3">
          <span className="font-mono text-[11px] uppercase tracking-eyebrow text-grey-400">
            Scenarios
          </span>
          <div className="space-y-3 pt-1">
            {scenarios.map((s, i) => (
              <ScenarioAccordion
                key={s.id}
                scenario={s}
                index={i}
                active={i === activeIdx}
                onSelect={() => setActiveIdx(i)}
              />
            ))}
          </div>
        </div>

        {/* Proof */}
        {principle.proof && (
          <div className="mt-10 border-t border-grey-200 pt-7">
            <span className="font-mono text-[11px] uppercase tracking-eyebrow text-grey-400">
              In the wild · {principle.proof.source}
            </span>
            <p className="mt-3 text-[14px] leading-relaxed text-grey-600">
              {principle.proof.body}
            </p>
            <div className="mt-4 flex items-baseline gap-2.5">
              <span className="font-display text-[32px] text-ink">
                {principle.proof.metric}
              </span>
              <span className="text-[12.5px] text-grey-500">
                {principle.proof.metricLabel}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT, fixed playground stage */}
      <div className="relative flex flex-1 flex-col bg-white p-5 lg:py-7 lg:pr-7">
        {active && <Playground scenarioId={active.id} demo={active.demo} />}
      </div>
    </div>
  )
}

/* ── Framework layout (Know your user / PACT) ───────────────────────────── */

function PactAccordion({
  letter,
  label,
  blurb,
  points,
  active,
  onSelect,
}: {
  letter: string
  label: string
  blurb: string
  points: { term: string; detail: string }[]
  active: boolean
  onSelect: () => void
}) {
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
          className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg font-display text-[15px] transition-colors ${
            active ? 'bg-accent text-white' : 'bg-grey-200 text-grey-500'
          }`}
        >
          {letter}
        </span>
        <span className="flex-1">
          <span
            className={`block text-[13.5px] font-medium tracking-[-0.01em] ${
              active ? 'text-ink' : 'text-grey-600'
            }`}
          >
            {label}
          </span>
          <span className="block text-[12px] text-grey-400">{blurb}</span>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {active && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease }}
          >
            <div className="space-y-2.5 px-4 pb-4 pl-[56px] pt-0.5">
              {points.map((p) => (
                <p key={p.term} className="text-[12.5px] leading-relaxed text-grey-600">
                  <span className="font-medium text-ink">{p.term}:</span>{' '}
                  {p.detail}
                </p>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function FrameworkLayout({ principle }: { principle: Principle }) {
  const pact = principle.pact ?? []
  const cards = principle.personaCards ?? []
  // The right panel shows either a PACT lens or the persona-card carousel.
  const [active, setActive] = useState<PactKey | 'examples'>(
    pact[0]?.key ?? 'people',
  )
  const activeDimension = pact.find((d) => d.key === active)

  return (
    <div className="flex h-screen flex-col lg:flex-row">
      {/* LEFT, editorial column with the PACT rail */}
      <div className="no-scrollbar flex w-full flex-col overflow-y-auto px-7 pb-16 pt-7 lg:w-[34%] lg:px-9">
        <a
          href="#/"
          className="group inline-flex w-fit items-center gap-1.5 text-[13px] text-grey-500 transition-colors hover:text-ink"
        >
          <ArrowLeft
            size={14}
            className="transition-transform group-hover:-translate-x-0.5"
          />
          All principles
        </a>

        <div className="mt-12">
          <span className="font-mono text-[11px] uppercase tracking-eyebrow text-grey-400">
            Principle {principle.ordinal}
          </span>
          <h1 className="font-display mt-3 text-[36px] leading-[1.05] sm:text-[40px]">
            {principle.label}
          </h1>

          {principle.intro?.map((para, i) => (
            <p
              key={i}
              className="mt-5 text-[15px] leading-[1.65] text-grey-600 first-of-type:mt-7"
            >
              {para}
            </p>
          ))}
        </div>

        {/* PACT rail, selecting a letter swaps the persona lens */}
        <div className="mt-9 space-y-3">
          <span className="font-mono text-[11px] uppercase tracking-eyebrow text-grey-400">
            The PACT framework
          </span>
          <div className="space-y-3 pt-1">
            {pact.map((d) => (
              <PactAccordion
                key={d.key}
                letter={d.letter}
                label={d.label}
                blurb={d.blurb}
                points={d.points}
                active={d.key === active}
                onSelect={() => setActive(d.key)}
              />
            ))}
          </div>
        </div>

        {/* Some examples, opens the persona-card carousel on the right */}
        {cards.length > 0 && (
          <div className="mt-9 space-y-3">
            <span className="font-mono text-[11px] uppercase tracking-eyebrow text-grey-400">
              Some examples
            </span>
            <div className="pt-1">
              <button
                onClick={() => setActive('examples')}
                className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3.5 text-left transition-colors duration-200 ${
                  active === 'examples'
                    ? 'border-grey-300 bg-white shadow-card'
                    : 'border-grey-200 bg-grey-50 hover:border-grey-300'
                }`}
              >
                <span
                  className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg transition-colors ${
                    active === 'examples'
                      ? 'bg-accent text-white'
                      : 'bg-grey-200 text-grey-500'
                  }`}
                >
                  <Users size={15} strokeWidth={2} />
                </span>
                <span className="flex-1">
                  <span
                    className={`block text-[13.5px] font-medium tracking-[-0.01em] ${
                      active === 'examples' ? 'text-ink' : 'text-grey-600'
                    }`}
                  >
                    Real persona cards
                  </span>
                  <span className="block text-[12px] text-grey-400">
                    Three real users. Flip through and open one.
                  </span>
                </span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT, persona lens gallery, or the persona-card carousel */}
      <div className="relative flex flex-1 flex-col bg-white p-5 lg:py-7 lg:pr-7">
        <div className="flex-1 rounded-3xl bg-panel p-6 sm:p-8">
          {active === 'examples'
            ? cards.length > 0 && <PersonaCarousel cards={cards} />
            : principle.personas &&
              activeDimension && (
                <PersonaGallery
                  personas={principle.personas}
                  dimension={activeDimension}
                />
              )}
        </div>
      </div>
    </div>
  )
}

/* ── Tools layout (Know your product / intents → orbit) ──────────────────── */

function IntentAccordion({
  index,
  title,
  job,
  line,
  active,
  onSelect,
}: {
  index: number
  title: string
  job: string
  line: string
  active: boolean
  onSelect: () => void
}) {
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
          className={`flex-1 text-[13.5px] font-medium leading-snug tracking-[-0.01em] ${
            active ? 'text-ink' : 'text-grey-600'
          }`}
        >
          {title}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {active && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease }}
          >
            <div className="px-4 pb-4 pl-[52px] pt-0.5">
              <p className="text-[12px] font-semibold uppercase tracking-wide text-accent">
                {job}
              </p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-grey-600">
                {line}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ToolsLayout({ principle }: { principle: Principle }) {
  const intents = principle.intents ?? []
  const tools = principle.tools ?? []
  // Start neutral (all tools equal); selecting an intent highlights its set.
  const [activeId, setActiveId] = useState<string | null>(null)
  const activeIntent = intents.find((it) => it.id === activeId)
  const activeTools = activeIntent?.tools ?? []

  return (
    <div className="flex h-screen flex-col lg:flex-row">
      {/* LEFT, editorial column with the intent rail */}
      <div className="no-scrollbar flex w-full flex-col overflow-y-auto px-7 pb-16 pt-7 lg:w-[34%] lg:px-9">
        <a
          href="#/"
          className="group inline-flex w-fit items-center gap-1.5 text-[13px] text-grey-500 transition-colors hover:text-ink"
        >
          <ArrowLeft
            size={14}
            className="transition-transform group-hover:-translate-x-0.5"
          />
          All principles
        </a>

        <div className="mt-12">
          <span className="font-mono text-[11px] uppercase tracking-eyebrow text-grey-400">
            Principle {principle.ordinal}
          </span>
          <h1 className="font-display mt-3 text-[36px] leading-[1.05] sm:text-[40px]">
            {principle.label}
          </h1>

          {principle.intro?.map((para, i) => (
            <p
              key={i}
              className="mt-5 text-[15px] leading-[1.65] text-grey-600 first-of-type:mt-7"
            >
              {para}
            </p>
          ))}
        </div>

        {/* Intent rail, selecting a job highlights its tools in the orbit */}
        <div className="mt-9 space-y-3">
          <span className="font-mono text-[11px] uppercase tracking-eyebrow text-grey-400">
            Start from the job
          </span>
          <div className="space-y-3 pt-1">
            {intents.map((it, i) => (
              <IntentAccordion
                key={it.id}
                index={i}
                title={it.title}
                job={it.job}
                line={it.line}
                active={it.id === activeId}
                onSelect={() =>
                  setActiveId((cur) => (cur === it.id ? null : it.id))
                }
              />
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT, orbiting constellation of Studio tools */}
      <div className="relative flex flex-1 flex-col bg-white p-5 lg:py-7 lg:pr-7">
        <div className="flex-1 rounded-3xl bg-panel p-6 sm:p-8">
          <ToolOrbit tools={tools} activeTools={activeTools} />
        </div>
      </div>
    </div>
  )
}
