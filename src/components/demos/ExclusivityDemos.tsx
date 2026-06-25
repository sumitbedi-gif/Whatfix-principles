import type { AppProps, ToggleState } from './registry'

/** Exclusivity 1: generic survey blast vs a "you were selected" reframe. */
export function exclusivitySurveyApp(state: ToggleState): AppProps {
  return { focusField: false, exclusivitySurvey: !!state.better }
}

/** Exclusivity 2: generic welcome vs a personalized, name-pulled greeting. */
export function exclusivityWelcomeApp(state: ToggleState): AppProps {
  return { focusField: false, exclusivityWelcome: !!state.better }
}
