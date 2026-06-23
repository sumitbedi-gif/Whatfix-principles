import type { AppProps, ToggleState } from './registry'

/**
 * Badges render inside the SkeletonApp's metric cards.
 * Off → one card badged (isolated cue, the eye lands).
 * On  → every card badged (over-signalling, the eye lands nowhere).
 */
export function signalBadgesApp(state: ToggleState): AppProps {
  return {
    focusField: false,
    badges: state.overdo ? [0, 1, 2] : [1],
  }
}
