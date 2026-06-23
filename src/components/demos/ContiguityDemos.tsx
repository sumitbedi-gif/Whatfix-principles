import type { Metric } from '../SkeletonApp'
import type { AppProps, ToggleState } from './registry'

/** The three dashboard metrics, with the plain-language definitions authors
 *  forget to surface in-app. */
export const METRICS: Metric[] = [
  {
    label: 'LOI',
    value: '14m',
    delta: '▲ 1.2m',
    deltaGood: false,
    def: 'Length of Interview: the average time a respondent takes to finish the survey.',
  },
  {
    label: 'Incidence',
    value: '62%',
    delta: '▲ 4%',
    deltaGood: true,
    def: 'Incidence Rate: the share of screened people who actually qualify for the survey.',
  },
  {
    label: 'Drop-off',
    value: '23%',
    delta: '▼ 2%',
    deltaGood: true,
    def: 'Drop-off Rate: the share who start the survey but abandon it before submitting.',
  },
]

/* ── Scenario 1 ── Detached legend vs. anchored Smart Tips ───────────────── */
/**
 * Off → one info icon by the dashboard title (the whole legend lives in a
 *       single detached bubble away from the cards).
 * On  → an info icon on every card, so each definition sits on the metric it
 *       explains. The eye never has to travel.
 * The icons + tooltips render inside SkeletonApp; this just sets the mode.
 */
export function contiguityAnchorApp(state: ToggleState): AppProps {
  return {
    focusField: false,
    metrics: METRICS,
    tipMode: state.anchor ? 'anchored' : 'detached',
  }
}

/* ── Scenario 2 ── Generic hover tip vs. contextual live data ────────────── */
/**
 * The hover field lives inside the app's form (see SkeletonApp's ContextField),
 * not in a floating card. Off → generic "what this field is" tip; on → the
 * actual record, surfaced right on the field.
 */
export function contiguityContextApp(state: ToggleState): AppProps {
  return {
    focusField: false,
    metrics: METRICS,
    contextField: !!state.contextual,
  }
}

/* ── Scenario 3 ── Temporal contiguity: wrong time vs. right time ─────────── */
/**
 * A two-tab app. Off → the walk-through nudge fires on load, whatever tab you're
 * on (mistimed). On → it appears only when you land on Tab 2 (Reports), paired
 * in time with arriving at the thing it explains.
 * Tabs + nudge live inside SkeletonApp; this just sets the timing mode.
 */
export function contiguityTimingApp(state: ToggleState): AppProps {
  return {
    focusField: false,
    tabs: true,
    nudgeTiming: state.timed ? 'right' : 'wrong',
  }
}
