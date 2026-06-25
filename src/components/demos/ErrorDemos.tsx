import type { AppProps, ToggleState } from './registry'

/** Error prevention 1: submit-time error vs type-time format Smart Tip. */
export function errorValidateApp(state: ToggleState): AppProps {
  return { focusField: false, errorValidate: !!state.better }
}

/** Error prevention 2: catastrophic send vs an intercepting blocker. */
export function errorBlockerApp(state: ToggleState): AppProps {
  return { focusField: false, errorBlocker: !!state.better }
}

/** Error prevention 3: avoidable ticket vs a deflection blocker. */
export function errorDeflectApp(state: ToggleState): AppProps {
  return { focusField: false, errorDeflect: !!state.better }
}
