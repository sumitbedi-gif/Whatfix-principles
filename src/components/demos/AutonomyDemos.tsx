import type { AppProps, ToggleState } from './registry'

/** Autonomy 1: auto-run flow vs a choice pop-up gating the path. */
export function autonomyChoiceApp(state: ToggleState): AppProps {
  return { focusField: false, autonomyChoice: !!state.better }
}

/** Autonomy 2: linear flow over a filled section vs a branched skip. */
export function autonomyBranchApp(state: ToggleState): AppProps {
  return { focusField: false, autonomyBranch: !!state.better }
}

/** Autonomy 3: profile-click swaps user; veteran auto-hides the task list. */
export function autonomyDetectApp(): AppProps {
  return { focusField: false, autonomyDetect: true }
}
