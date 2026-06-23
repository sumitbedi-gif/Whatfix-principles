import { AnimatePresence, motion } from 'motion/react'
import {
  Monitor,
  Smartphone,
  MonitorSmartphone,
  Smile,
  Frown,
  Gauge,
} from 'lucide-react'
import type { PactDimension, PactKey, Persona } from '../config'

const ease = [0.22, 1, 0.36, 1] as const

const TONE: Record<
  Persona['tone'],
  { ring: string; chip: string; disc: string; Icon: typeof Smile; label: string }
> = {
  calm: {
    ring: 'ring-good/30',
    chip: 'bg-good/10 text-good',
    disc: 'bg-good/10 text-good',
    Icon: Smile,
    label: 'calm',
  },
  anxious: {
    ring: 'ring-accent/30',
    chip: 'bg-accent-soft text-accent',
    disc: 'bg-accent-soft text-accent',
    Icon: Frown,
    label: 'anxious',
  },
  rushed: {
    ring: 'ring-bad/30',
    chip: 'bg-bad/10 text-bad',
    disc: 'bg-bad/10 text-bad',
    Icon: Gauge,
    label: 'rushed',
  },
}

/** Device glyph inferred from the technology lens copy. */
function deviceFor(persona: Persona) {
  const t = persona.lenses.technology.headline.toLowerCase()
  if (t.includes('phone')) return Smartphone
  if (t.includes('dual') || t.includes('monitor')) return Monitor
  return MonitorSmartphone
}

function initials(name: string) {
  // "The veteran" → "V"; "The field worker" → "FW"
  const words = name.replace(/^the\s+/i, '').split(/\s+/)
  return words
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
}

function PersonaCard({
  persona,
  lens,
  index,
}: {
  persona: Persona
  lens: PactKey
  index: number
}) {
  const tone = TONE[persona.tone]
  const Device = deviceFor(persona)
  const view = persona.lenses[lens]

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease, delay: index * 0.06 }}
      className={`flex flex-col rounded-2xl border border-grey-100 bg-white p-5 shadow-soft ring-1 ${tone.ring}`}
    >
      {/* Portrait, illustration slot, falls back to an initialled disc. */}
      <div className="flex items-center gap-3">
        {persona.illustration ? (
          <img
            src={persona.illustration}
            alt=""
            className="h-12 w-12 rounded-full object-cover"
          />
        ) : (
          <span
            className={`grid h-12 w-12 shrink-0 place-items-center rounded-full text-[15px] font-semibold ${tone.disc}`}
          >
            {initials(persona.name)}
          </span>
        )}
        <div className="min-w-0">
          <p className="text-[14px] font-semibold tracking-[-0.01em] text-ink">
            {persona.name}
          </p>
          <div className="mt-1 flex items-center gap-1.5">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-medium ${tone.chip}`}
            >
              <tone.Icon size={11} strokeWidth={2.25} />
              {tone.label}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-grey-100 px-2 py-0.5 text-[10.5px] font-medium text-grey-500">
              <Device size={11} strokeWidth={2.25} />
            </span>
          </div>
        </div>
      </div>

      {/* The active lens view, animates on lens change. */}
      <div className="mt-4 border-t border-grey-100 pt-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={lens}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.24, ease }}
          >
            <p className="text-[14px] font-semibold tracking-[-0.01em] text-ink">
              {view.headline}
            </p>
            <p className="mt-1.5 text-[12.5px] leading-relaxed text-grey-500">
              {view.detail}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

/**
 * Three contrasting people, the same task, seen through one PACT lens at a
 * time. Switching the lens (from the rail) re-renders every card, same humans,
 * four views. The interaction is choosing the lens; there's no toggle.
 *
 * When the active lens carries an illustration (`dimension.lensImage`), the
 * panel shows that against white instead of the cards.
 */
export function PersonaGallery({
  personas,
  dimension,
}: {
  personas: Persona[]
  dimension: PactDimension
}) {
  const lens = dimension.key

  if (dimension.lensImage) {
    return (
      <div className="flex h-full items-center justify-center rounded-2xl bg-white px-6">
        <AnimatePresence mode="wait">
          <motion.img
            key={lens}
            src={dimension.lensImage.src}
            alt=""
            initial={{ opacity: 0, scale: 0.98, filter: 'blur(12px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(12px)' }}
            transition={{ duration: 0.5, ease }}
            className="max-h-[58%] w-auto max-w-[78%] object-contain"
          />
        </AnimatePresence>
      </div>
    )
  }

  return (
    <div className="grid h-full grid-cols-1 content-center gap-4 sm:grid-cols-3">
      {personas.map((p, i) => (
        <PersonaCard key={p.id} persona={p} lens={lens} index={i} />
      ))}
    </div>
  )
}
