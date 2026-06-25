import type { AppProps, ToggleState } from './registry'

/** Modality 1: flows-only vs an inline quick answer for a quick-fact question. */
export function modalityQuickReadApp(state: ToggleState): AppProps {
  return { focusField: false, modalityQuickRead: !!state.better }
}

/** Modality 2: one article vs Article + Flow + Video for a task question. */
export function modalityMultiApp(state: ToggleState): AppProps {
  return { focusField: false, modalityMulti: !!state.better }
}
