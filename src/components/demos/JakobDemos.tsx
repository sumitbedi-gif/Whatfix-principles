import type { AppProps, ToggleState } from './registry'

/** Jakob 1: guidance in English vs. the user's own language. */
export function jakobLanguageApp(state: ToggleState): AppProps {
  return { focusField: false, jakobLanguage: !!state.better }
}

/** Jakob 2: an unrecognized mascot help icon vs. the conventional "?". */
export function jakobIconApp(state: ToggleState): AppProps {
  return { focusField: false, jakobIcon: !!state.better }
}

/** Jakob 3: product page + Self-Help; toggle annotates redundant vs. worth-it. */
export function jakobModelApp(state: ToggleState): AppProps {
  return { focusField: false, jakobModel: !!state.better }
}
