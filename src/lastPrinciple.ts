/**
 * Remembers the principle the presenter last opened, so the index can restore
 * position on return (grid scrolls to the card, timeline centers it).
 * Module memory covers the SPA session; sessionStorage survives a reload
 * mid-presentation. Both are best-effort.
 */

const KEY = 'bfb-last-principle'
let memory: string | null = null

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
