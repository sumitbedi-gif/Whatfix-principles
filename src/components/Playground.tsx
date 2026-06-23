import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import type { Demo } from '../config'
import { Switch } from './Switch'
import { SkeletonApp } from './SkeletonApp'
import { DEMOS, type ToggleState } from './demos/registry'

export type { ToggleState }
export interface DemoProps {
  state: ToggleState
}

/**
 * The right-hand stage. A full skeleton app fills the playground. The demo
 * stays hidden until the presenter clicks the canvas, then its guidance vehicle
 * appears and the toggles morph it as usual. `scenarioId` resets both the
 * reveal and the toggle state when the scenario changes.
 */
export function Playground({
  scenarioId,
  demo,
}: {
  scenarioId: string
  demo: Demo
}) {
  const initial = useMemo(
    () => Object.fromEntries(demo.toggles.map((t) => [t.id, !!t.defaultOn])),
    [demo],
  )
  const [state, setState] = useState<ToggleState>(initial)
  // `alwaysOn` demos start revealed: their content is present from the off and
  // the interaction is a hover, not a click-to-summon.
  const [revealed, setRevealed] = useState(!!demo.alwaysOn)

  // Reset reveal + toggles when the scenario changes.
  const [seen, setSeen] = useState(scenarioId)
  if (seen !== scenarioId) {
    setSeen(scenarioId)
    setState(initial)
    setRevealed(!!demo.alwaysOn)
  }

  const entry = DEMOS[demo.kind]
  // Demo effects (dim, badges, overlay) only apply once revealed; before that
  // the app sits clean and calm.
  const appProps = revealed ? entry.app(state) : { focusField: false }
  const Overlay = entry.Overlay

  return (
    <div className="flex h-full flex-col">
      {/* Stage — full app fills it, demo reveals on click */}
      <div className="relative flex-1 overflow-hidden rounded-3xl bg-panel p-6 sm:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={scenarioId}
            className="relative h-full w-full"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            <SkeletonApp {...appProps} />
            {revealed && (
              <Overlay
                state={state}
                // `alwaysOn` demos have no popup to dismiss; their content is
                // permanent. For the rest, the X closes the popup and clicking
                // the interface brings it back.
                onDismiss={demo.alwaysOn ? undefined : () => setRevealed(false)}
              />
            )}

            {/* Invisible click-to-reveal layer (no visible hint). */}
            {!revealed && (
              <button
                type="button"
                onClick={() => setRevealed(true)}
                className="absolute inset-0 z-30 cursor-pointer"
                aria-label="Reveal the guidance"
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls dock — a single compact line, right-aligned, so it keeps a
          small vertical footprint and leaves the stage as tall as possible on
          shorter screens. Caption on the left, toggle(s) on the right. */}
      {(demo.toggles.length > 0 || demo.caption) && (
        <div className="mt-3 flex items-center justify-end gap-4">
          {demo.caption && (
            <p className="hidden flex-1 truncate text-[12px] text-grey-400 sm:block">
              {demo.caption}
            </p>
          )}
          {demo.toggles.length > 0 && (
            <div className="flex items-center gap-5 rounded-full bg-grey-50 px-4 py-2 ring-1 ring-grey-200/60">
              {demo.toggles.map((t) => (
                <Switch
                  key={t.id}
                  inline
                  label={t.label}
                  on={!!state[t.id]}
                  onChange={(on) => setState((s) => ({ ...s, [t.id]: on }))}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
