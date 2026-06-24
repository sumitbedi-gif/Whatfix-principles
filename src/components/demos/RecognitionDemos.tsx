import type { AppProps, ToggleState } from './registry'

/**
 * Recognition demo 1: a real "File taxes" button lives in the app's top bar.
 * Toggle on, a contextual Smart Tip appears latched to it (the button, the
 * deadline, the next click), so recall becomes recognition.
 */
export function recognitionCueApp(state: ToggleState): AppProps {
  return { focusField: false, recognitionCue: !!state.contextual }
}

/**
 * Recognition demo 2: a real input field. Off, blurring shows a red format
 * error after the fact (recall). On, focusing shows the expected format up
 * front (recognition).
 */
export function recognitionFieldApp(state: ToggleState): AppProps {
  return { focusField: false, recognitionField: !!state.contextual }
}

/**
 * Recognition demo 3: a Self-Help widget on the tax page. Off, a flat scroll of
 * cryptic items (recall); on, the same help in named folders (recognition).
 */
export function recognitionHelpApp(state: ToggleState): AppProps {
  return { focusField: false, recognitionHelp: !!state.contextual }
}
