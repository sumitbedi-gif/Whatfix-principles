import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Analytics } from '@vercel/analytics/react'
import { CONFIG } from './config'
import { IndexView } from './views/IndexView'
import { DetailView } from './views/DetailView'
import {
  rememberLastPrinciple,
  rememberViewMode,
  readViewMode,
} from './lastPrinciple'

/**
 * Minimal hash router: "#/" is the index, "#/<principle-id>" is a detail page.
 * No router dependency; the hash is the single source of navigation state.
 */
function useHashRoute() {
  const [hash, setHash] = useState(() => window.location.hash.slice(1) || '/')
  useEffect(() => {
    const onHash = () => setHash(window.location.hash.slice(1) || '/')
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  return hash
}

function App() {
  const route = useHashRoute()
  const id = route.replace(/^\//, '')
  const principle =
    id && CONFIG.find((p) => p.id === id && p.status === 'live')

  // The chosen arrangement is a sticky preference, so leaving a principle
  // returns to the same mode it was opened from, whatever the back link says.
  const mode = principle
    ? 'grid'
    : id === 'timeline' || id === 'deck'
      ? id
      : readViewMode()

  // Remember where the presenter went, so the index can restore position.
  useEffect(() => {
    if (principle) rememberLastPrinciple(principle.id)
  }, [principle])

  // Keep the URL honest: showing timeline/deck at "#/" rewrites to its own
  // hash (and makes the Grid tab's "#/" a real hash change).
  useEffect(() => {
    if (!principle) {
      rememberViewMode(mode)
      if (mode !== 'grid' && id !== mode) {
        window.location.replace(`#/${mode}`)
      }
    }
  }, [principle, mode, id])

  // Detail pages open at the top. Returning to the index (or switching the
  // index's grid/timeline mode) leaves scroll to the IndexView restore logic.
  useEffect(() => {
    if (principle) window.scrollTo({ top: 0 })
  }, [route, principle])

  return (
    <div className="min-h-full bg-canvas text-ink">
      <AnimatePresence mode="wait">
        {principle ? (
          <motion.div
            key={principle.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            <DetailView principle={principle} />
          </motion.div>
        ) : (
          <motion.div
            key="index"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            <IndexView mode={mode} />
          </motion.div>
        )}
      </AnimatePresence>
      <Analytics />
    </div>
  )
}

export default App
