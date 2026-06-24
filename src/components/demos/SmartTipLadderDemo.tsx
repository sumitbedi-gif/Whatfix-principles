import type { AppProps, ToggleState } from './registry'

/**
 * The Smart Tip ladder lives inside SkeletonApp (see SmartTipLadder): an info
 * icon latched to the app's top-bar nav, with the Smart Tip below it. The plain
 * skeleton app is the backdrop (no metric cards). The Base/Good/Better choice
 * comes from the dock's segmented control (`state.rung`).
 */
export function smartTipLadderApp(state: ToggleState): AppProps {
  const rung = (state.rung as 'base' | 'good' | 'better') || 'base'
  return { focusField: false, smartTipRung: rung }
}
