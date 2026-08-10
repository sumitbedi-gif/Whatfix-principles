/**
 * Remembers the principle the presenter last opened, so the index can restore
 * position on return (grid scrolls to the card, timeline centers it).
 * Module memory covers the SPA session; sessionStorage survives a reload
 * mid-presentation. Both are best-effort.
 */

const KEY = 'bfb-last-principle'
const MODE_KEY = 'bfb-view-mode'
let memory: string | null = null
let modeMemory: 'grid' | 'timeline' | 'deck' | 'quiz' | null = null

export function rememberLastPrinciple(id: string) {
  memory = id
  try {
    sessionStorage.setItem(KEY, id)
  } catch {
    /* storage unavailable: module memory still works */
  }
}

export function readLastPrinciple(): string | null {
  if (memory) return memory
  try {
    return sessionStorage.getItem(KEY)
  } catch {
    return null
  }
}

/** The index arrangement the presenter last chose. */
export function rememberViewMode(mode: 'grid' | 'timeline' | 'deck' | 'quiz') {
  modeMemory = mode
  try {
    sessionStorage.setItem(MODE_KEY, mode)
  } catch {
    /* storage unavailable: module memory still works */
  }
}

export function readViewMode(): 'grid' | 'timeline' | 'deck' | 'quiz' {
  if (modeMemory) return modeMemory
  try {
    const stored = sessionStorage.getItem(MODE_KEY)
    return stored === 'timeline' || stored === 'deck' || stored === 'quiz'
      ? stored
      : 'grid'
  } catch {
    return 'grid'
  }
}
