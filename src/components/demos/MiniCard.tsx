import { X } from 'lucide-react'
import type { ReactNode } from 'react'

/**
 * Guidance card shared by the flow demos. Crisp and quiet: hairline ring,
 * layered pop shadow, generous padding, no heavy chrome.
 */
export function MiniCard({
  title,
  body,
  cta,
  secondary,
  condensed = false,
  onDismiss,
}: {
  title: string
  body: ReactNode
  cta: string
  secondary?: string
  condensed?: boolean
  onDismiss?: () => void
}) {
  return (
    <div className="relative rounded-2xl bg-white shadow-pop ring-1 ring-grey-200/50">
      <button
        aria-label="Dismiss"
        onClick={onDismiss}
        className="absolute right-3 top-3 grid h-7 w-7 place-items-center rounded-lg text-grey-400 transition-colors hover:bg-grey-100 hover:text-ink"
      >
        <X size={15} strokeWidth={2.25} />
      </button>
      <div className={condensed ? 'p-5 pr-11' : 'p-6 pr-12'}>
        <h4
          className={`font-semibold tracking-[-0.01em] text-ink ${
            condensed ? 'text-[15px]' : 'text-[16px]'
          }`}
        >
          {title}
        </h4>
        <p
          className={`mt-2 leading-relaxed text-grey-500 ${
            condensed ? 'text-[13px]' : 'text-[13.5px]'
          }`}
        >
          {body}
        </p>
        <div className="mt-4 flex items-center gap-1.5">
          <span className="inline-flex items-center rounded-lg bg-ink px-3.5 py-2 text-[13px] font-medium text-white">
            {cta}
          </span>
          {secondary && (
            <span className="px-2.5 py-2 text-[13px] font-medium text-grey-400">
              {secondary}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
