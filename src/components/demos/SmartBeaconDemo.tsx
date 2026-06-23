import type { AppProps, ToggleState } from './registry'

/**
 * A single conditional beacon, anchored to a feature card in the app. It pulses
 * to draw the eye. The story is verbal: this cue only lights for the segment
 * who hasn't adopted the feature, and retires once they engage, so it stays
 * rare and therefore sharp. No toggle: it simply appears on reveal.
 */
export function smartBeaconApp(_: ToggleState): AppProps {
  return { focusField: false, beacon: 0 }
}
