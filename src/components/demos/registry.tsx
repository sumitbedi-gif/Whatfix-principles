import type { ReactNode } from 'react'
import type { DemoKind } from '../../config'
import { FlowInterruptOverlay } from './FlowInterruptDemo'
import { FlowSummonOverlay } from './FlowSummonDemo'
import { SignalTextOverlay } from './SignalTextDemo'
import { signalBadgesApp } from './SignalBadgesDemo'
import { smartBeaconApp } from './SmartBeaconDemo'
import { smartTipLadderApp } from './SmartTipLadderDemo'
import {
  contiguityAnchorApp,
  contiguityContextApp,
  contiguityTimingApp,
} from './ContiguityDemos'
import {
  hicksApp,
  HicksCtaOverlay,
  HicksLanguageOverlay,
  hicksSelfHelpApp,
  HicksSelfHelpOverlay,
} from './HicksDemos'
import {
  coherenceTooltipApp,
  coherenceFormApp,
  coherencePruneApp,
  CoherencePruneOverlay,
} from './CoherenceDemos'
import {
  recognitionCueApp,
  recognitionFieldApp,
  recognitionHelpApp,
} from './RecognitionDemos'
import {
  jakobLanguageApp,
  jakobIconApp,
  jakobModelApp,
} from './JakobDemos'
import {
  motorFlowApp,
  motorAutofillApp,
  motorTourApp,
} from './MotorDemos'
import type { Metric } from '../SkeletonApp'

/** Toggles store booleans; a segmented control stores its chosen option id. */
export type ToggleState = Record<string, boolean | string>

export interface AppProps {
  dimmed?: boolean
  badges?: number[]
  beacon?: number | null
  focusField?: boolean
  metrics?: Metric[]
  tipMode?: 'detached' | 'anchored' | null
  contextField?: boolean | null
  tabs?: boolean
  nudgeTiming?: 'wrong' | 'right' | null
  coherentForm?: boolean | null
  tooltipTour?: boolean | null
  smartTipRung?: 'base' | 'good' | 'better'
  recognitionCue?: boolean | null
  recognitionField?: boolean | null
  recognitionHelp?: boolean | null
  jakobLanguage?: boolean | null
  jakobIcon?: boolean | null
  jakobModel?: boolean | null
  motorFlow?: boolean | null
  motorAutofill?: boolean | null
  motorTour?: boolean | null
}

interface DemoEntry {
  /** Derive SkeletonApp props from the toggle state. */
  app: (state: ToggleState) => AppProps
  /** Guidance vehicle layered over the app. `onDismiss` closes the popup; the
   *  user clicks the interface to bring it back. */
  Overlay: (props: { state: ToggleState; onDismiss?: () => void }) => ReactNode
}

const empty = () => null

export const DEMOS: Record<DemoKind, DemoEntry> = {
  flowInterrupt: {
    // Blocking modal dims the form; peripheral toast leaves it focused.
    app: (s) => ({ dimmed: !s.peripheral, focusField: true }),
    Overlay: FlowInterruptOverlay,
  },
  flowSummon: {
    app: (s) => ({ focusField: !!s.summoned, dimmed: !s.summoned }),
    Overlay: FlowSummonOverlay,
  },
  signalText: {
    // The signalling text demo keeps the form calm; the notice is the subject.
    app: () => ({ focusField: false }),
    Overlay: SignalTextOverlay,
  },
  signalBadges: {
    // Badges live in the app itself; no overlay.
    app: signalBadgesApp,
    Overlay: empty,
  },
  smartBeacon: {
    // The beacon lives on a metric card inside the app; no overlay.
    app: smartBeaconApp,
    Overlay: empty,
  },
  signalLadder: {
    // The latched Smart Tip + ladder control live inside the app; no overlay.
    app: smartTipLadderApp,
    Overlay: empty,
  },
  contiguityAnchor: {
    // Definitions move from a detached title icon to per-card icons.
    app: contiguityAnchorApp,
    Overlay: empty,
  },
  contiguityContext: {
    // The contextual field lives inside the app form; no overlay.
    app: contiguityContextApp,
    Overlay: empty,
  },
  contiguityTiming: {
    // Tabs + the timed nudge live inside the app; no overlay.
    app: contiguityTimingApp,
    Overlay: empty,
  },
  hicksCta: {
    app: hicksApp,
    Overlay: HicksCtaOverlay,
  },
  hicksLanguage: {
    app: hicksApp,
    Overlay: HicksLanguageOverlay,
  },
  hicksSelfHelp: {
    // The Self-Help FAB lives on the app and is always present.
    app: hicksSelfHelpApp,
    Overlay: HicksSelfHelpOverlay,
  },
  coherenceTooltip: {
    // The toolbar + tooltip live inside the app; no overlay.
    app: coherenceTooltipApp,
    Overlay: empty,
  },
  coherenceForm: {
    // The form lives inside the app; no overlay.
    app: coherenceFormApp,
    Overlay: empty,
  },
  coherencePrune: {
    app: coherencePruneApp,
    Overlay: CoherencePruneOverlay,
  },
  recognitionCue: {
    // The button + tip live in the app's top bar; no overlay.
    app: recognitionCueApp,
    Overlay: empty,
  },
  recognitionField: {
    // The input field + format tip live in the app; no overlay.
    app: recognitionFieldApp,
    Overlay: empty,
  },
  recognitionHelp: {
    // The Self-Help widget lives in the app; no overlay.
    app: recognitionHelpApp,
    Overlay: empty,
  },
  jakobLanguage: {
    app: jakobLanguageApp,
    Overlay: empty,
  },
  jakobIcon: {
    app: jakobIconApp,
    Overlay: empty,
  },
  jakobModel: {
    app: jakobModelApp,
    Overlay: empty,
  },
  motorFlow: {
    // The typeable form + gated flow live inside the app; no overlay.
    app: motorFlowApp,
    Overlay: empty,
  },
  motorAutofill: {
    // The auto-filling form lives inside the app; no overlay.
    app: motorAutofillApp,
    Overlay: empty,
  },
  motorTour: {
    // The keyboard-driven tour lives inside the app; no overlay.
    app: motorTourApp,
    Overlay: empty,
  },
}
