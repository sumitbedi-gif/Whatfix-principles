import { motion } from 'motion/react'

interface SwitchProps {
  on: boolean
  onChange: (on: boolean) => void
  label: string
  /** Lay the label beside the toggle (one line) instead of stacked below. */
  inline?: boolean
}

/** A labelled iOS-style toggle, matching the reference's demo controls. */
export function Switch({ on, onChange, label, inline = false }: SwitchProps) {
  const toggle = (
    <span
      className={`flex h-6 w-10 shrink-0 items-center rounded-full px-0.5 transition-colors duration-200 ${
        on ? 'bg-accent' : 'bg-grey-300'
      }`}
    >
      <motion.span
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 34 }}
        className="h-5 w-5 rounded-full bg-white shadow-sm"
        style={{ marginLeft: on ? 'auto' : 0 }}
      />
    </span>
  )
  const text = (
    <span
      className={`text-[12px] transition-colors ${
        on ? 'text-ink' : 'text-grey-500'
      }`}
    >
      {label}
    </span>
  )
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className={
        inline
          ? 'group flex flex-row-reverse items-center gap-2'
          : 'group flex flex-col items-center gap-2'
      }
    >
      {toggle}
      {text}
    </button>
  )
}
