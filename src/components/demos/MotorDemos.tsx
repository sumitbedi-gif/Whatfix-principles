import type { AppProps, ToggleState } from './registry'

/** Motor 1: step-gated flow vs. one container tip + per-label info icons. */
export function motorFlowApp(state: ToggleState): AppProps {
  return { focusField: false, motorFlow: !!state.better }
}

/** Motor 2: manual typing vs. auto-fill-then-review. */
export function motorAutofillApp(state: ToggleState): AppProps {
  return { focusField: false, motorAutofill: !!state.better }
}

/** Motor 3: click-through tour vs. keyboard navigation. */
export function motorTourApp(state: ToggleState): AppProps {
  return { focusField: false, motorTour: !!state.better }
}
