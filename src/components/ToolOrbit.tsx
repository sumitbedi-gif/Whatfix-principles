import { motion } from 'motion/react'
import {
  Signpost,
  Link as LinkIcon,
  Film,
  Newspaper,
  Radio,
  MessageSquareWarning,
  PanelTopOpen,
  Ban,
  Send,
  AppWindow,
  ClipboardCheck,
  MonitorPlay,
  LifeBuoy,
  Sparkles,
  ListChecks,
  type LucideIcon,
} from 'lucide-react'
import type { Tool } from '../config'

/** Studio content-type → closest lucide icon. */
const ICONS: Record<string, LucideIcon> = {
  flow: Signpost,
  link: LinkIcon,
  video: Film,
  article: Newspaper,
  beacon: Radio,
  smartTip: MessageSquareWarning,
  launcher: PanelTopOpen,
  blocker: Ban,
  cues: Send,
  popup: AppWindow,
  survey: ClipboardCheck,
  mirror: MonitorPlay,
  selfHelp: LifeBuoy,
  quickRead: Sparkles,
  taskList: ListChecks,
}

const ROTATION = 64 // seconds per full revolution, slow, continuous

/**
 * A constellation of Studio content types orbiting a slow circle. When an
 * intent is active, the tools it resolves to glow and scale up while the rest
 * dim, the rotation never stops. With no intent, all sit at rest weight.
 */
export function ToolOrbit({
  tools,
  activeTools,
}: {
  tools: Tool[]
  /** Tool ids to highlight; empty = neutral (all equal). */
  activeTools: string[]
}) {
  const n = tools.length
  const hasActive = activeTools.length > 0

  return (
    <div className="flex h-full items-center justify-center">
      <div className="relative aspect-square w-full max-w-[520px]">
        {/* Rotating ring */}
        <motion.div
          className="absolute inset-0"
          animate={{ rotate: 360 }}
          transition={{ duration: ROTATION, ease: 'linear', repeat: Infinity }}
        >
          {tools.map((tool, i) => {
            const angle = (i / n) * 2 * Math.PI - Math.PI / 2
            // Radius as a percentage of the ring box.
            const r = 45
            const x = 50 + r * Math.cos(angle)
            const y = 50 + r * Math.sin(angle)
            const Icon = ICONS[tool.icon] ?? Radio
            const active = activeTools.includes(tool.id)
            const dim = hasActive && !active

            return (
              <div
                key={tool.id}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                {/* Counter-rotate so the tile stays upright. */}
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{
                    duration: ROTATION,
                    ease: 'linear',
                    repeat: Infinity,
                  }}
                >
                  <motion.div
                    animate={{
                      scale: active ? 1.12 : dim ? 0.9 : 1,
                      opacity: dim ? 0.28 : 1,
                    }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="flex w-[76px] flex-col items-center gap-1.5"
                  >
                    <span
                      className={`grid h-12 w-12 place-items-center rounded-2xl border transition-colors duration-300 ${
                        active
                          ? 'border-accent/40 bg-accent text-white shadow-float'
                          : 'border-grey-200 bg-white text-grey-500 shadow-soft'
                      }`}
                    >
                      <Icon size={20} strokeWidth={1.9} />
                    </span>
                    <span
                      className={`text-[11px] font-medium transition-colors duration-300 ${
                        active ? 'text-ink' : 'text-grey-400'
                      }`}
                    >
                      {tool.label}
                    </span>
                  </motion.div>
                </motion.div>
              </div>
            )
          })}
        </motion.div>

        {/* Calm center label */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <p className="font-display text-[20px] leading-tight text-ink">
            Multiple tools
          </p>
          <p className="mt-0.5 text-[11.5px] text-grey-400">
            {hasActive ? 'for this job' : 'one job each'}
          </p>
        </div>
      </div>
    </div>
  )
}
