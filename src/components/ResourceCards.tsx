import { motion } from 'motion/react'
import {
  GraduationCap,
  LifeBuoy,
  Users,
  ArrowUpRight,
  type LucideIcon,
} from 'lucide-react'
import type { Resource } from '../config'

const ease = [0.22, 1, 0.36, 1] as const

const ICONS: Record<string, LucideIcon> = {
  graduation: GraduationCap,
  lifebuoy: LifeBuoy,
  users: Users,
}

/**
 * Three minimal resource cards, the places to keep referring back to. Each is a
 * link out, with a quiet icon, label, and display URL.
 */
export function ResourceCards({ resources }: { resources: Resource[] }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      {resources.map((r, i) => {
        const Icon = ICONS[r.icon] ?? Users
        return (
          <motion.a
            key={r.id}
            href={r.url}
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease, delay: i * 0.08 }}
            className="group flex w-full max-w-md items-center gap-4 rounded-2xl border border-grey-100 bg-white p-4 shadow-soft transition-colors hover:border-grey-300"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent">
              <Icon size={20} strokeWidth={1.9} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[14px] font-semibold tracking-[-0.01em] text-ink">
                {r.label}
              </span>
              <span className="block truncate text-[12.5px] text-grey-500">
                {r.display}
              </span>
            </span>
            <ArrowUpRight
              size={17}
              className="shrink-0 text-grey-300 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
            />
          </motion.a>
        )
      })}
    </div>
  )
}
