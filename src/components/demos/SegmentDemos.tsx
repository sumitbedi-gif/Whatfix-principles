import type { AppProps, ToggleState } from './registry'

/** Segmentation 1: scattered task list vs. Day 1-4 segmented stages. */
export function segmentTasksApp(state: ToggleState): AppProps {
  return { focusField: false, segmentTasks: !!state.better }
}

/** Segmentation 2: a 40-step march vs. chunked tour with a checkpoint. */
export function segmentStepsApp(state: ToggleState): AppProps {
  return { focusField: false, segmentSteps: !!state.better }
}
