import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { CONFIG } from './config'
import { IndexView } from './views/IndexView'
import { DetailView } from './views/DetailView'

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

  // Scroll to top whenever the route changes.
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [route])

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
            <IndexView />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
