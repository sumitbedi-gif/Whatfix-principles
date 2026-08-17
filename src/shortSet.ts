import { CONFIG, type Principle } from './config'

/**
 * "Short set": the crunched-down running order for a time-boxed demo (~20 min).
 * When on, every view shows only these principles, renumbered 01..06 in this
 * order, so the session reads as a complete six-principle story rather than a
 * subset of fifteen.
 */
export const SHORT_SET_IDS = [
  'know-your-product',
  'flow-state',
  'contiguity',
  'hicks-law',
  'error-prevention',
  'multimedia-modality',
] as const

const KEY = 'bfb-short-set'
let memory: boolean | null = null

export function readShortSet(): boolean {
  if (memory !== null) return memory
  try {
    return sessionStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}

export function writeShortSet(on: boolean) {
  memory = on
  try {
    sessionStorage.setItem(KEY, on ? '1' : '0')
  } catch {
    /* storage unavailable: module memory still works */
  }
}

/** The principles to show, renumbered when the short set is on. */
export function visiblePrinciples(shortSet: boolean): Principle[] {
  if (!shortSet) return CONFIG
  return SHORT_SET_IDS.map((id, i) => {
    const p = CONFIG.find((c) => c.id === id)
    return p && { ...p, ordinal: String(i + 1).padStart(2, '0') }
  }).filter(Boolean) as Principle[]
}
