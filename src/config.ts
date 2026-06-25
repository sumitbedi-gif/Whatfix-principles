/**
 * Single source of truth for the playground.
 *
 * The site is an InterfaceCraft-style knowledge base: a centered index of
 * principles, each opening to an editorial detail page made of prose blocks and
 * interactive demo cards. A demo card renders a live component (chosen by
 * `demo.kind`) plus labelled toggles that morph it in place.
 *
 * Adding a principle, a prose block, or a demo is a config-only change, except
 * a brand-new `demo.kind`, which also needs its interactive component authored
 * in components/demos.
 */

export type PrincipleStatus = 'live' | 'soon'

/** Which interactive component a demo card renders. */
export type DemoKind =
  | 'flowInterrupt'
  | 'flowSummon'
  | 'signalText'
  | 'signalBadges'
  | 'smartBeacon'
  | 'signalLadder'
  | 'contiguityAnchor'
  | 'contiguityContext'
  | 'contiguityTiming'
  | 'hicksCta'
  | 'hicksLanguage'
  | 'hicksSelfHelp'
  | 'coherenceTooltip'
  | 'coherenceForm'
  | 'coherencePrune'
  | 'recognitionCue'
  | 'recognitionField'
  | 'recognitionHelp'
  | 'jakobLanguage'
  | 'jakobIcon'
  | 'jakobModel'
  | 'motorFlow'
  | 'motorAutofill'
  | 'motorTour'
  | 'errorValidate'
  | 'errorBlocker'
  | 'errorDeflect'
  | 'segmentTasks'
  | 'segmentSteps'
  | 'autonomyChoice'
  | 'autonomyBranch'
  | 'autonomyDetect'
  | 'exclusivitySurvey'
  | 'exclusivityWelcome'
  | 'modalityQuickRead'
  | 'modalityMulti'

export interface Toggle {
  id: string
  label: string
  /** Whether it starts on. */
  defaultOn?: boolean
}

export interface Demo {
  kind: DemoKind
  /** Optional caption shown under the demo card. */
  caption?: string
  /** Labelled switches rendered beneath the live component. */
  toggles: Toggle[]
  /**
   * Skip the click-to-reveal gate: the demo's content is present from the
   * start (no overlay popup to summon). For demos where the interaction is a
   * hover, not a reveal.
   */
  alwaysOn?: boolean
  /**
   * A segmented control rendered in the dock (instead of toggles), for demos
   * that step through ordered states. The chosen segment id is exposed to the
   * demo via the `state` map under this control's `id`.
   */
  segmented?: { id: string; options: { id: string; label: string }[] }
}

/** A run of body copy. `em` segments are signalled (bold + accent). */
export interface BodySegment {
  text: string
  em?: boolean
}

export interface Proof {
  source: string
  body: string
  metric: string
  metricLabel: string
}

/**
 * One scenario = a left-rail accordion (title + info) bound to a right-pane
 * demo. Selecting it expands the info and swaps the playground to its demo.
 */
export interface Scenario {
  id: string
  /** Accordion heading, e.g. "The mid-task interrupt". */
  title: string
  /** Body paragraphs revealed when the accordion expands. */
  info: string[]
  demo: Demo
}

/**
 * The PACT framework (Benyon: People, Activities, Contexts, Technologies).
 * Each letter is a left-rail accordion AND the lens the persona gallery shows.
 */
export type PactKey = 'people' | 'activities' | 'context' | 'technology'

export interface PactDimension {
  key: PactKey
  /** Single letter shown in the rail, e.g. "P". */
  letter: string
  /** Full label, e.g. "People". */
  label: string
  /** One-line summary of what this lens tells you. */
  blurb: string
  /** The sub-dimensions revealed when the accordion expands. */
  points: { term: string; detail: string }[]
  /** Optional illustration shown (against white) when this lens is active. */
  lensImage?: { src: string; caption?: string }
}

/** One persona, described across all four PACT lenses for the same task. */
export interface Persona {
  id: string
  /** Short name/role, e.g. "Priya · veteran analyst". */
  name: string
  /** Optional illustration path (drops into the card). */
  illustration?: string
  /** Accent tint key for the card. */
  tone: 'calm' | 'anxious' | 'rushed'
  /** What this persona shows under each PACT lens. */
  lenses: Record<PactKey, { headline: string; detail: string }>
}

/**
 * Know-your-product: a "tool" is one Studio content type, placed in the orbit.
 * `icon` is a key resolved to a lucide icon in ToolOrbit.
 */
export interface Tool {
  id: string
  label: string
  icon: string
}

/**
 * An intent (job to be done). Selecting it highlights the tool ids it resolves
 * to and dims the rest. `line` is the spoken framing for that job.
 */
export interface Intent {
  id: string
  /** Accordion heading, e.g. "I need to inform, without stopping them." */
  title: string
  /** The job, in a phrase. */
  job: string
  /** Longer framing shown when expanded. */
  line: string
  /** Tool ids that light up for this intent. */
  tools: string[]
}

/** An external resource shown as a minimal card in Know-your-product. */
export interface Resource {
  id: string
  /** Lucide icon key, resolved in the resources panel. */
  icon: string
  label: string
  url: string
  /** Display URL (without protocol). */
  display: string
}

/** A full pre-designed persona card (image), shown in the examples carousel. */
export interface PersonaCard {
  id: string
  /** Short name, e.g. "Grace". */
  name: string
  /** One-line role, e.g. "Sales Manager · Large enterprise". */
  role: string
  /** Path to the full card image. */
  src: string
}

export interface Principle {
  id: string
  /** Two-digit ordinal, e.g. "01". */
  ordinal: string
  /** Which workshop day this principle belongs to. Defaults to 1. */
  day?: 1 | 2
  /** Title shown in the index and as the detail page heading. */
  label: string
  /** One-line description in the index list. */
  summary: string
  status: PrincipleStatus
  /** One tight sentence shown on the cover screen, before jumping in. */
  cover?: string
  /**
   * Lead paragraph(s) on the detail page, before the scenarios. Wrap a phrase
   * in **double asterisks** to highlight it (orange) as the key takeaway. Used
   * on the non-interactive principles so the reader can spot, at a glance, what
   * the principle is really about.
   */
  intro?: string[]
  /** Selectable scenarios; each drives the right-side playground. */
  scenarios?: Scenario[]
  proof?: Proof
  /**
   * A "framework" principle (e.g. Know your user) renders the PACT rail + a
   * persona gallery instead of toggle scenarios. When `pact` is set, the detail
   * view uses the framework layout.
   */
  pact?: PactDimension[]
  personas?: Persona[]
  /**
   * Full persona-card images shown in the "Some examples" section as an
   * interactive carousel (center card focused, neighbours blurred; click to
   * open full-screen).
   */
  personaCards?: PersonaCard[]
  /**
   * A "tools" principle (Know your product) renders intent accordions + an
   * orbiting constellation of Studio content types that highlight per intent.
   */
  tools?: Tool[]
  intents?: Intent[]
  /** External resources shown in a "Resources" section beside the tool orbit. */
  resources?: Resource[]
  /**
   * The fill-in-the-blank statement shown on the cover. The first slot is a
   * picker (e.g. expertise); choosing a value fills every other slot to a
   * coherent persona via `statement.presets`.
   */
  statement?: Statement
}

export interface StatementSegment {
  /** Static prose run between slots. */
  text?: string
  /** Marks a fillable slot; `slot` indexes into a preset's `fills`. */
  slot?: number
}

export interface StatementPreset {
  /** The picker label for this persona, e.g. "a veteran". */
  choice: string
  /** The value that blurs into each slot, in slot order. */
  fills: string[]
}

export interface Statement {
  /** The statement broken into prose + slots. Slot 0 is the picker. */
  segments: StatementSegment[]
  /** The choices shown in the first slot, before any pick. */
  options: string[]
  /** Subtle hint shown in each non-picker slot before a pick, in slot order. */
  placeholders: string[]
  /** One coherent fill set per picker choice. */
  presets: StatementPreset[]
}

export const CONFIG: Principle[] = [
  {
    id: 'know-your-user',
    ordinal: '01',
    label: 'Know your user',
    summary: 'Design for the person on the other side, not the average of everyone.',
    status: 'live',
    cover:
      'You are not your user. You built the app, so you’re the least typical person to use it. Before any tooltip, you have to actually meet the person on the other side.',
    intro: [
      'You are not your user. So before you design anything, what’s their state at this exact moment?',
      'Every principle that follows is an answer to that one question. Carry the PACT lens through all of them: People tells you who, Activities what, Context when and where, Technology through what. Pick a lens on the right and watch the same task split into very different people.',
    ],
    statement: {
      // Each slot maps to a PACT letter, so filling it in literally answers
      // the framework: P · A · A · P · C · T · goal.
      segments: [
        { text: 'I’m ' },
        { slot: 0 },
        { text: ' at this. I do this task ' },
        { slot: 1 },
        { text: ', and it’s ' },
        { slot: 2 },
        { text: '. Usually I feel ' },
        { slot: 3 },
        { text: ', working ' },
        { slot: 4 },
        { text: ' on ' },
        { slot: 5 },
        { text: ', and what I really want is to ' },
        { slot: 6 },
        { text: '.' },
      ],
      options: ['a veteran', 'intermediate', 'a first-timer'],
      placeholders: [
        'expertise',
        'how often',
        'the stakes',
        'mood',
        'where',
        'device',
        'the goal',
      ],
      presets: [
        {
          choice: 'a veteran',
          fills: [
            'a veteran',
            'many times a day',
            'routine',
            'calm',
            'at a quiet desk',
            'dual monitors',
            'finish and move on',
          ],
        },
        {
          choice: 'intermediate',
          fills: [
            'intermediate',
            'a few times a week',
            'familiar but fiddly',
            'mostly confident',
            'between meetings',
            'my work laptop',
            'get it right without asking',
          ],
        },
        {
          choice: 'a first-timer',
          fills: [
            'a first-timer',
            'once a quarter',
            'high-stakes',
            'anxious',
            'from a noisy floor',
            'a shared terminal',
            'not get it wrong',
          ],
        },
      ],
    },
    pact: [
      {
        key: 'people',
        letter: 'P',
        label: 'People',
        blurb: 'Who they are, on spectrums, not labels.',
        lensImage: {
          src: '/personas/people-watercolour.png',
          caption: 'Same task, same app. A calm veteran and an anxious novice are not the same user.',
        },
        points: [
          { term: 'Expertise', detail: 'veteran ↔ intermediate ↔ first-timer (most apps serve all three at once)' },
          { term: 'Physical', detail: 'vision, motor, hearing, accessibility needs' },
          { term: 'Psychological', detail: 'confidence vs. anxiety, tolerance for interruption, the mental model they arrive with' },
          { term: 'Language & locale', detail: 'the words they use, not the words the app uses' },
          { term: 'Attitude', detail: 'eager, skeptical, or resentful of change' },
        ],
      },
      {
        key: 'activities',
        letter: 'A',
        label: 'Activities',
        blurb: 'What they’re actually doing.',
        lensImage: {
          src: '/personas/activities.png',
          caption: 'The same person, two tasks. An everyday action and a once-a-month one need very different guidance.',
        },
        points: [
          { term: 'Frequency', detail: 'many-times-a-day vs. once-a-quarter. This alone decides tooltip vs. flow.' },
          { term: 'Complexity', detail: 'simple and habitual vs. complex and rare' },
          { term: 'Stakes', detail: 'trivial vs. costly-if-wrong vs. irreversible' },
          { term: 'Continuity', detail: 'one focused task vs. constantly interrupted and resumed' },
        ],
      },
      {
        key: 'context',
        letter: 'C',
        label: 'Context',
        blurb: 'The conditions around the moment.',
        lensImage: {
          src: '/personas/context.png',
          caption: 'Working leisurely versus racing a deadline changes everything about how guidance should land.',
        },
        points: [
          { term: 'Time pressure', detail: 'leisurely vs. racing a deadline or a customer on the phone' },
          { term: 'Physical environment', detail: 'quiet desk vs. noisy floor vs. on the move' },
          { term: 'Social', detail: 'alone vs. observed vs. rushed by a colleague' },
          { term: 'Organizational', detail: 'is this change mandated, supported, or resented?' },
        ],
      },
      {
        key: 'technology',
        letter: 'T',
        label: 'Technology',
        blurb: 'What they’re working through.',
        lensImage: {
          src: '/personas/technology.png',
          caption: 'Laptop, tablet, or phone. The device reshapes what guidance can even do.',
        },
        points: [
          { term: 'Device & screen', detail: 'dual monitors vs. a phone' },
          { term: 'Input', detail: 'mouse, touch, or keyboard-only' },
          { term: 'Performance & network', detail: 'fast vs. laggy. Laggy guidance feels broken.' },
          { term: 'Access & constraints', detail: 'permissions, browser, assistive tech' },
        ],
      },
    ],
    personas: [
      {
        id: 'veteran',
        name: 'The veteran',
        tone: 'calm',
        lenses: {
          people: { headline: 'Calm expert', detail: 'Done this a thousand times. Confident, low fear, wants speed over hand-holding.' },
          activities: { headline: 'Many times a day', detail: 'Routine and habitual. A tooltip every time would just be noise.' },
          context: { headline: 'Quiet desk', detail: 'Focused, dual-monitor setup, no one rushing them.' },
          technology: { headline: 'Dual monitors', detail: 'Fast machine, keyboard shortcuts, expects instant response.' },
        },
      },
      {
        id: 'first-timer',
        name: 'The first-timer',
        tone: 'anxious',
        lenses: {
          people: { headline: 'Anxious novice', detail: 'First time here. High fear of doing it wrong, arrives with no mental model.' },
          activities: { headline: 'Once, high-stakes', detail: 'Rare and costly-if-wrong. Needs a guided flow, not a hint.' },
          context: { headline: 'Shared terminal', detail: 'Observed, a little rushed, not their own space.' },
          technology: { headline: 'Shared desktop', detail: 'Locked-down browser, unfamiliar setup, limited permissions.' },
        },
      },
      {
        id: 'field',
        name: 'The field worker',
        tone: 'rushed',
        lenses: {
          people: { headline: 'Rushed & mobile', detail: 'Intermediate, but distracted. Splitting attention between this and the world.' },
          activities: { headline: 'Interrupted', detail: 'Constantly stopped and resumed, so guidance must survive a context switch.' },
          context: { headline: 'On the move', detail: 'Noisy, moving, maybe a customer waiting. Racing the clock.' },
          technology: { headline: 'Phone, one hand', detail: 'Small touch screen, patchy network. Laggy guidance feels broken.' },
        },
      },
    ],
  },
  {
    id: 'know-your-product',
    ordinal: '02',
    label: 'Know your product',
    summary: 'Guidance only lands when it speaks the product’s own language.',
    status: 'live',
    cover:
      'Knowing your product isn’t knowing the names of the content types. It’s **knowing what each one is for:** its job, its cost, when it earns its place, and when it’s the wrong answer.',
    intro: [
      'Last principle, you learned to read the user. Now you learn the tools, because matching one to the other, at the right moment, is the entire job. The same message can succeed as a Smart Tip and fail as a modal. The tool is half the design.',
      'So don’t organize by content type. Organize by the job to be done. Start from the moment and work back to the tool. Pick an intent on the right and watch which tools earn their place, and which are the wrong answer.',
    ],
    tools: [
      { id: 'flow', label: 'Flow', icon: 'flow' },
      { id: 'link', label: 'Link', icon: 'link' },
      { id: 'video', label: 'Video', icon: 'video' },
      { id: 'article', label: 'Article', icon: 'article' },
      { id: 'beacon', label: 'Beacon', icon: 'beacon' },
      { id: 'smart-tip', label: 'Smart Tip', icon: 'smartTip' },
      { id: 'launcher', label: 'Launcher', icon: 'launcher' },
      { id: 'blocker', label: 'Blocker', icon: 'blocker' },
      { id: 'cues', label: 'Cues', icon: 'cues' },
      { id: 'popup', label: 'Pop-up', icon: 'popup' },
      { id: 'survey', label: 'Survey', icon: 'survey' },
      { id: 'mirror', label: 'Mirror', icon: 'mirror' },
      { id: 'task-list', label: 'Task List', icon: 'taskList' },
      { id: 'self-help', label: 'Self-Help', icon: 'selfHelp' },
      { id: 'quick-read', label: 'Quick Read', icon: 'quickRead' },
    ],
    intents: [
      {
        id: 'inform',
        title: 'I need to inform, without stopping them.',
        job: 'Presence without interruption.',
        line: 'Low stakes, don’t break flow. The job is to be present without taking over: a quiet inline note, a cue at the edge of attention, a non-blocking pop-up they can ignore.',
        tools: ['smart-tip', 'beacon', 'cues', 'popup'],
      },
      {
        id: 'guide',
        title: 'I need to guide them through something.',
        job: 'Walk beside them.',
        line: 'A real task, step by step. Walk beside them with an interactive flow, break a multi-session journey into a task list, or let them practice safely in a mirror.',
        tools: ['flow', 'task-list', 'mirror', 'video'],
      },
      {
        id: 'prevent',
        title: 'I need to prevent a mistake.',
        job: 'Stop the error before it happens.',
        line: 'High stakes, costly if wrong. Stop the error before it happens: block the path, or warn at the exact point of action with a Smart Tip.',
        tools: ['blocker', 'smart-tip'],
      },
      {
        id: 'nudge',
        title: 'I need to nudge at exactly the right moment.',
        job: 'Appear only when relevant, then disappear.',
        line: 'Timing is everything. Appear only when it’s relevant, then disappear: a conditional cue or beacon, a just-in-time pop-up, a launcher they pull when ready.',
        tools: ['cues', 'beacon', 'popup', 'launcher'],
      },
      {
        id: 'self-serve',
        title: 'I need them to find help on their own.',
        job: 'Be there when they come looking.',
        line: 'Self-service, on demand. Be there when they come looking: a Self-Help widget, searchable articles and videos, and Quick Reads they pull up themselves.',
        tools: ['self-help', 'article', 'video', 'quick-read', 'link'],
      },
    ],
    resources: [
      {
        id: 'university',
        icon: 'graduation',
        label: 'Whatfix University',
        url: 'https://university.whatfix.com/self-signup',
        display: 'university.whatfix.com/self-signup',
      },
      {
        id: 'support',
        icon: 'lifebuoy',
        label: 'Whatfix Support',
        url: 'https://support.whatfix.com',
        display: 'support.whatfix.com',
      },
      {
        id: 'community',
        icon: 'users',
        label: 'Whatfix Community',
        url: 'https://community.whatfix.com',
        display: 'community.whatfix.com',
      },
    ],
  },
  {
    id: 'flow-state',
    ordinal: '03',
    label: 'Don’t break the flow state',
    summary: 'Match the interruption to the task. Deep focus deserves a gentle touch.',
    status: 'live',
    cover:
      'When someone is deep in a task, a blocking popup spends all their attention at once, and the first thing they learn is to **dismiss you.** Shape the interruption to the moment instead.',
    intro: [
      'When someone is deep in a task, their attention is the scarcest thing you have. A blocking popup spends all of it at once, and the first thing they learn is to dismiss you.',
      'The fix is rarely “no guidance.” It is guidance shaped to the moment: peripheral, dismissible, summoned rather than forced. Match the interruption to the task and the flow is never broken.',
    ],
    scenarios: [
      {
        id: 'mid-task-interrupt',
        title: 'The mid-task interrupt',
        info: [
          'A centered modal lands directly over the field they were typing in. The first instinct is to close it, unread.',
          'Flip it to a toast and the same message waits at the edge of attention instead, leaving the form fully focused and usable.',
        ],
        demo: {
          kind: 'flowInterrupt',
          caption: 'Toggle Peripheral to move the message out of the way.',
          toggles: [{ id: 'peripheral', label: 'Peripheral', defaultOn: false }],
        },
      },
      {
        id: 'forced-vs-summoned',
        title: 'Forced vs. summoned',
        info: [
          'Even an announcement can respect flow if it arrives on the user’s terms.',
          'Force it on arrival and it interrupts. Park it as a quiet launcher and they open it when ready, the same message, now invited.',
        ],
        demo: {
          kind: 'flowSummon',
          caption: 'Let them summon it, then click the launcher.',
          toggles: [{ id: 'summoned', label: 'Let them summon it', defaultOn: false }],
        },
      },
    ],
    proof: {
      source: 'Consumer-goods CMS rollout',
      body: '~900 users were drowning in a complex form. The fix wasn’t a popup explaining it; it was quiet hover tooltips that appeared only when needed.',
      metric: '~270K',
      metricLabel: 'guidance views, flow never broken',
    },
  },
  {
    id: 'signaling-isolation',
    ordinal: '04',
    label: 'Signaling & isolation',
    summary: 'Cue the eye to what matters. The thing that stands out is the thing remembered.',
    status: 'live',
    cover:
      '**Cue the eye to what matters** with weight, colour, or a single highlight. The catch authors forget: if everything is highlighted, nothing is.',
    intro: [
      'Signaling cues the eye to what matters through weight, colour, or a single highlight. The isolation effect (von Restorff) is its partner: the distinctive item is recalled far above its neighbours.',
      'The corollary authors forget is the whole game. If everything is highlighted, nothing is. One cue against a flat background does the work; ten cues cancel each other out.',
    ],
    scenarios: [
      {
        id: 'signal-in-text',
        title: 'The flat wall of text',
        info: [
          'Same notice, same words. A flat paragraph gives the eye nowhere to land, so it reads nothing.',
          'Signal just the critical issue and the deadline, and attention goes straight to what matters.',
        ],
        demo: {
          kind: 'signalText',
          caption: 'Signal the essentials to emphasise the two phrases that matter.',
          toggles: [{ id: 'signal', label: 'Signal the essentials', defaultOn: false }],
        },
      },
      {
        id: 'isolate-the-new',
        title: 'One badge, or every badge',
        info: [
          'The same logic governs the whole screen. One “New” badge isolates the feature that shipped, and the eye lands on it.',
          'Badge every card and you are back to a flat UI, only noisier. Too much signal is no signal.',
        ],
        demo: {
          kind: 'signalBadges',
          caption: 'Badge everything to watch the single cue dissolve.',
          toggles: [{ id: 'overdo', label: 'Badge everything', defaultOn: false }],
        },
      },
      {
        id: 'conditional-beacon',
        title: 'A beacon only the right people see',
        info: [
          'A static beacon that is always on, for everyone, becomes wallpaper within days. Habituation kills it: the eye learns to skip what is always there.',
          'The durable version is conditional. The cue appears only for the segment who has not adopted the feature yet, and retires itself once they engage, so it stays rare, and rare stays sharp.',
        ],
        demo: {
          kind: 'smartBeacon',
          caption: 'Click the stage: the beacon lights only for non-adopters.',
          toggles: [],
        },
      },
      {
        id: 'smart-tip-ladder',
        title: 'Base, good, better',
        info: [
          'Signalling isn’t only weight and colour, it’s the words. The same Smart Tip can be vague, specific, or specific and scannable, and only the last one survives a glance.',
          'Climb the ladder: name the exact things (not “information”), bold the terms the eye should catch, and show an example of what they’ll get. Each rung makes the cue easier to act on.',
        ],
        demo: {
          kind: 'signalLadder',
          alwaysOn: true,
          caption: 'Step from Base to Good to Better.',
          toggles: [],
          segmented: {
            id: 'rung',
            options: [
              { id: 'base', label: 'Base' },
              { id: 'good', label: 'Good' },
              { id: 'better', label: 'Better' },
            ],
          },
        },
      },
    ],
    proof: {
      source: 'Auto-parts B2B portal',
      body: 'A high-value feature shipped with no signal. ~2,700 users found it in three weeks. The fix was one beacon with a “New” label, isolated against a flat UI.',
      metric: '+629%',
      metricLabel: 'engagement the next month',
    },
  },
  {
    id: 'contiguity',
    ordinal: '05',
    label: 'Contiguity',
    summary: 'Keep related words and visuals together, in space and in time.',
    status: 'live',
    cover:
      'Contiguity is about space and time: put the explanation beside the thing it explains, and deliver it at the moment it’s needed. **The right help, in the right place** is when guidance stops being noise.',
    intro: [
      'The contiguity principle is simple: related words and visuals belong together, in space and in time. When an explanation lives away from what it explains, the eye has to leave, find the legend, read it, and travel back, holding both in mind.',
      'That round trip is a working-memory tax. Placed directly on the element, the same explanation lands instantly. The strongest form removes the journey entirely: bring the information to the point of work.',
    ],
    scenarios: [
      {
        id: 'detached-vs-anchored',
        title: 'Detached vs. anchored',
        info: [
          'The dashboard shows LOI, Incidence, and Drop-off, but the definitions live in one icon by the title. The eye must leave the metric, open the legend, read all three, and travel back.',
          'Toggle Anchor the tips and each definition moves onto its own card. Hover a metric and its meaning is right there, beside the number it explains.',
        ],
        demo: {
          kind: 'contiguityAnchor',
          alwaysOn: true,
          caption:
            'Hover the info icon by the title (detached), then anchor the tips and hover a card.',
          toggles: [{ id: 'anchor', label: 'Anchor the tips', defaultOn: false }],
        },
      },
      {
        id: 'generic-vs-contextual',
        title: 'Generic vs. contextual',
        info: [
          'Same field, same hover. By default the tooltip only describes what the field is, in the abstract, and points elsewhere to “learn more”.',
          'Toggle Bring the data in and the hover surfaces the actual record, owner, adoption date, last active, right where the question is asked.',
        ],
        demo: {
          kind: 'contiguityContext',
          alwaysOn: true,
          caption: 'Hover the highlighted field, then bring the data in.',
          toggles: [
            { id: 'contextual', label: 'Bring the data in', defaultOn: false },
          ],
        },
      },
      {
        id: 'right-time',
        title: 'The right moment',
        info: [
          'Contiguity is about time as well as space. By default the walk-through fires the moment the page loads, before the user has even gone where it applies, so it lands as noise and gets dismissed.',
          'Toggle Time it right and the nudge waits. Switch to the Reports tab and it arrives exactly then, paired with the moment it’s relevant.',
        ],
        demo: {
          kind: 'contiguityTiming',
          alwaysOn: true,
          caption: 'Switch to the Reports tab to see when the nudge arrives.',
          toggles: [{ id: 'timed', label: 'Time it right', defaultOn: false }],
        },
      },
    ],
    proof: {
      source: 'Market-research firm',
      body: 'Employees couldn’t interpret dashboard metrics like LOI, Incidence, and Drop-off. No in-app definitions existed, so people pinged senior staff repeatedly. Hover Smart Tips placed on each metric dropped related support queries to zero.',
      metric: '44%',
      metricLabel: 'engagement across the 48-user base',
    },
  },
  {
    id: 'hicks-law',
    ordinal: '06',
    label: 'Hick’s Law',
    summary: 'Every extra choice taxes the decision. Narrow the path.',
    status: 'live',
    cover:
      '**Decision time rises with the number and complexity of options,** roughly logarithmically. More choices doesn’t mean more help; it means more hesitation, and often abandonment.',
    intro: [
      'Hick’s Law: the time to decide rises with the number and complexity of options, roughly as log₂(n+1). Each option you add taxes the user before they have done anything at all.',
      'Two levers reduce it. Remove options, or, when you can’t, structure them, group, rank, default, so the user navigates categories instead of scanning a flat list. A recommended choice collapses the decision to “accept or browse”, the cheapest decision of all.',
    ],
    scenarios: [
      {
        id: 'too-many-ctas',
        title: 'Five CTAs, or two',
        info: [
          'The welcome popup offers five competing actions of equal weight. Every button is a decision the user has to make before they can act, so the eye stalls.',
          'Toggle Better approach and it becomes one primary action plus one quiet secondary. Two clear paths move people; five freeze them.',
        ],
        demo: {
          kind: 'hicksCta',
          caption: 'Click the stage, then flip to the two-CTA version.',
          toggles: [{ id: 'refined', label: 'Better approach', defaultOn: false }],
        },
      },
      {
        id: 'structure-the-list',
        title: 'Flat list, or grouped',
        info: [
          'Sometimes you can’t cut the options. Nine languages in a flat grid force a scan with no footholds, every item competing equally.',
          'Toggle Better approach to split them into a small Recommended set and the rest. The decision collapses to “accept the obvious one or browse”.',
        ],
        demo: {
          kind: 'hicksLanguage',
          caption: 'Click the stage, then group the options.',
          toggles: [{ id: 'refined', label: 'Better approach', defaultOn: false }],
        },
      },
      {
        id: 'self-help-overload',
        title: 'A help menu of everything',
        info: [
          'Open the Self-Help widget and it lists the entire flow library, every guide for every page, so the user scrolls and hunts for the one they need.',
          'Toggle Better approach and the same widget shows only the one or two flows relevant to this page. The decision shrinks from “scan thirty” to “pick from two”.',
        ],
        demo: {
          kind: 'hicksSelfHelp',
          alwaysOn: true,
          caption: 'Open the Self-Help widget, then make it contextual.',
          toggles: [{ id: 'refined', label: 'Better approach', defaultOn: false }],
        },
      },
    ],
    proof: {
      source: 'Global legal-services firm',
      body: 'Attorneys needed off public AI tools and onto the sanctioned one. The popup gave exactly two CTAs, “Take me there” and “Leave me here”. Constrained choice, clean action.',
      metric: '~290',
      metricLabel: 'users redirected (~550 times) in 90 days',
    },
  },
  {
    id: 'coherence',
    ordinal: '07',
    label: 'Coherence',
    summary: 'Cut what doesn’t teach. Decoration competes with the message.',
    status: 'live',
    cover:
      '**People learn better when extraneous words, graphics, and detail are removed.** Every non-essential element competes for the same limited working memory, so “nice to have” content actively lowers comprehension.',
    intro: [
      'The coherence principle (Mayer) is the most counterintuitive one for authors: it asks you to subtract, not add. Every extra word, graphic, or “nice to have” detail competes for the same limited working memory, so it lowers comprehension rather than raising it.',
      'This isn’t tidying for aesthetics. Stripping extraneous material produced roughly a 105% average performance gain in Mayer & Moreno’s work, one of the largest effects in the literature. Even interesting additions hurt if they aren’t essential.',
    ],
    scenarios: [
      {
        id: 'wordy-tooltips',
        title: 'The wall-of-text tour',
        info: [
          'A three-step walk-through where every tooltip is a paragraph. The user clicks Next, hits another wall of text, and stops reading by step two.',
          'Toggle Make it coherent and each step shrinks to one essential line plus a Learn more for anyone who wants the detail. The guidance survives; the noise doesn’t.',
        ],
        demo: {
          kind: 'coherenceTooltip',
          alwaysOn: true,
          caption: 'Click the canvas to start the tour, then make it coherent.',
          toggles: [{ id: 'crisp', label: 'Make it coherent', defaultOn: false }],
        },
      },
      {
        id: 'cluttered-form',
        title: 'Help text everywhere',
        info: [
          'A form where every label drags three lines of help beneath it. The fields you actually fill in are buried, and you scroll past instructions you may not need.',
          'Toggle Make it coherent and the help tucks behind an “i” beside each label. The screen is clean; the explanation is one hover away for those who want it.',
        ],
        demo: {
          kind: 'coherenceForm',
          alwaysOn: true,
          caption: 'Make it coherent, then hover an “i” to recover the detail.',
          toggles: [{ id: 'coherent', label: 'Make it coherent', defaultOn: false }],
        },
      },
      {
        id: 'prune-on-data',
        title: 'Cut what nobody uses',
        info: [
          'The hardest part of coherence is knowing what to cut. This upload screen has two buttons doing one job and four formats, with usage shown on each.',
          'Toggle Remove the dead weight and the controls under 5% usage retire themselves, leaving the one path people actually take. Less, proven by evidence rather than taste.',
        ],
        demo: {
          kind: 'coherencePrune',
          caption: 'Click a control to reveal its usage, then remove the dead weight.',
          toggles: [
            { id: 'pruned', label: 'Remove the dead weight', defaultOn: false },
          ],
        },
      },
    ],
    proof: {
      source: 'Automotive contract-management tool',
      body: 'An upload screen had duplicate “Upload Contract” and drag-and-drop buttons plus four formats. Three months of tracking showed over 80% used drag-and-drop and under 5% used some formats, so the underused controls were retired on evidence.',
      metric: '<5%',
      metricLabel: 'usage on the controls that were cut',
    },
  },
  {
    id: 'recognition-recall',
    ordinal: '08',
    label: 'Recognition over recall',
    summary: 'Show the option rather than asking them to remember it.',
    status: 'live',
    cover:
      'Recognition is near-effortless; **recall from a blank mind is slow and fails often.** Put the right option in front of the user at the moment it’s needed, instead of asking them to remember it.',
    intro: [
      'Seeing a cue and going “ah, that one” costs almost nothing. Dredging up what to do, when, and where from memory costs a lot, and often just fails. That’s why “set a reminder in your head” never works.',
      'So the author’s job is to make the next step recognisable: show the control, the deadline, and the click, right where and when they’re needed. Toggle each scenario to turn recall into recognition.',
    ],
    scenarios: [
      {
        id: 'reminder-vs-cue',
        title: 'A reminder, or a cue',
        info: [
          'A generic pop-up on login says “Don’t forget to file your taxes.” It’s vague and unanchored, and still leaves the user to recall where, how, and by when.',
          'Toggle Better approach and the cue lands on the actual button, with the real deadline: “Start filing, 3 days left.” The next step is simply visible, so there’s nothing to remember.',
        ],
        demo: {
          kind: 'recognitionCue',
          alwaysOn: true,
          caption: 'Click the stage for the reminder, then toggle the cue on.',
          toggles: [
            { id: 'contextual', label: 'Better approach', defaultOn: false },
          ],
        },
      },
      {
        id: 'format-up-front',
        title: 'Catch it after, or show it first',
        info: [
          'A lone input field asks for a policy number. Type, click away, and it turns red: “Incorrect format.” You had to recall the format, and got it wrong.',
          'Toggle Better approach and the moment you focus the field, the expected format appears: “Use ABC-12345.” You recognise it instead of recalling it, and the error never happens.',
        ],
        demo: {
          kind: 'recognitionField',
          alwaysOn: true,
          caption: 'Type and click away. Then toggle and focus the field again.',
          toggles: [
            { id: 'contextual', label: 'Better approach', defaultOn: false },
          ],
        },
      },
      {
        id: 'help-folders',
        title: 'A junk drawer, or labelled folders',
        info: [
          'Open Self-Help and it’s a long flat list of cryptic names like “Form 1040-B” and “TXN config.” You can only find something if you already recall its exact label.',
          'Toggle Better approach and the same help sits in clean, named folders, File taxes, Reset your password, Know your link. You browse and recognise the article or video you need.',
        ],
        demo: {
          kind: 'recognitionHelp',
          alwaysOn: true,
          caption: 'Open Self-Help, then organise it into folders.',
          toggles: [
            { id: 'contextual', label: 'Better approach', defaultOn: false },
          ],
        },
      },
    ],
    proof: {
      source: 'B2B finance platform',
      body: 'Users kept missing a recurring month-end approval; there was no prompt and the action was buried in the nav, driving support escalations. Surfacing the task on the dashboard at the moment it was due, instead of relying on people to remember, turned recall into recognition.',
      metric: '~40%',
      metricLabel: 'fewer escalations, ~$8.3K saved per 1,000 users',
    },
  },
  {
    id: 'match-their-model',
    ordinal: '09',
    day: 2,
    label: 'Jakob’s Law',
    summary: 'Users arrive expecting yours to work like every product they already know.',
    status: 'soon',
    cover:
      'Users spend almost all their time in other products, so **they arrive expecting yours to behave like the ones they already know.** Their mental model is pre-built, and fighting it costs you.',
    intro: [
      'Two ideas fused. Jakob’s Law: every convention a user learned elsewhere transfers to your product as an expectation. Mental models (Norman): people act on their internal picture of how something works, not on how it actually works.',
      'So the author’s job is to meet the model the user already carries, their language, their icons, their conventions, rather than forcing them to learn yours. Match the model and guidance feels invisible; violate it and even correct help gets missed.',
    ],
    scenarios: [
      {
        id: 'speak-their-language',
        title: 'Speak their language, literally',
        info: [
          'Three tooltips guide the form, all in English. A user who reads another language pays a mental-translation tax: working memory spent decoding instead of doing.',
          'Toggle Better approach and a language selector flips all the guidance into their own language at once. Same content, their words, no tax.',
        ],
        demo: {
          kind: 'jakobLanguage',
          alwaysOn: true,
          caption: 'Toggle to switch all guidance into the user’s language.',
          toggles: [{ id: 'better', label: 'Better approach', defaultOn: false }],
        },
      },
      {
        id: 'match-their-icon',
        title: 'Match the icon in their head',
        info: [
          'The help affordance is a branded robot mascot the org loves. Users don’t read it as help, so it’s invisible: the help is present but functionally lost.',
          'Toggle Better approach and it becomes the conventional “?” everyone already associates with help. A cue only works if it matches the symbol already in their head.',
        ],
        demo: {
          kind: 'jakobIcon',
          alwaysOn: true,
          caption: 'Toggle the mascot into the help icon people recognise.',
          toggles: [{ id: 'better', label: 'Better approach', defaultOn: false }],
        },
      },
      {
        id: 'dont-fight-the-model',
        title: 'Don’t fight a model they own',
        info: [
          'Self-Help offers two flows. “How to add to cart” is redundant: everyone already owns that model, so guidance there is noise. “Find product catalog info” is genuinely novel, with no pre-existing model.',
          'Toggle Better approach to see which earns its place. Spend the help budget only on what’s new to them, not on the step they could do in their sleep. Both flows are runnable, click to play either.',
        ],
        demo: {
          kind: 'jakobModel',
          alwaysOn: true,
          caption: 'Open Self-Help and run either flow; toggle to mark which is worth it.',
          toggles: [{ id: 'better', label: 'Better approach', defaultOn: false }],
        },
      },
    ],
    proof: {
      source: 'Global quick-service restaurant chain',
      body: 'The workforce was hand-translating 10–15-step tooltips via public AI tools or peers, 30 minutes to a full day per article. An in-app pop-up offering 11 languages, shown once and saved as a preference, made guidance match the model they arrived with.',
      metric: '~60%',
      metricLabel: 'more unique engagement; a 95% faster top flow',
    },
  },
  {
    id: 'reduce-motor-load',
    ordinal: '10',
    day: 2,
    label: 'Reduce the motor load',
    summary: 'Every click, keystroke, and pointer journey is a tax. Charge less of it.',
    status: 'soon',
    cover:
      '**Every click is an interaction cost.** Every movement is an interaction cost. The fewer steps between the user and the outcome, the better the guidance.',
    intro: [
      'Fitts’s Law: the time to hit a target rises with distance and falls with size. The broader motor-load idea (Weinschenk): physical effort suppresses adoption even when the user fully understands the task. Knowing what to do and being willing to do it are two different costs.',
      'So there’s a ladder of fixes, each cheaper than the last: fewer steps, then automate the step, then remove the journey to the step. Each scenario climbs one rung, and the click count drops as you go.',
    ],
    scenarios: [
      {
        id: 'fewer-steps',
        title: 'Don’t gate every field',
        info: [
          'A walk-through latches to one field at a time: fill it, click Next, read the tooltip, click Next. One task becomes a dozen click-read-click micro-interruptions, watch the click counter climb.',
          'Toggle Better approach and the guidance collapses onto the form itself: one Smart Tip on the container plus a small “i” beside each label. The user fills the whole thing in a single pass and pulls help only where needed.',
        ],
        demo: {
          kind: 'motorFlow',
          alwaysOn: true,
          caption: 'Type and click Next through the gated flow; toggle to fill it in one pass.',
          toggles: [{ id: 'better', label: 'Better approach', defaultOn: false }],
        },
      },
      {
        id: 'automate-the-step',
        title: 'Type it, or just review it',
        info: [
          'The same form, filled by hand. Every field is a run of keystrokes, and every keystroke is a chance to mistype.',
          'Toggle Better approach and a background flow auto-fills the fields, you watch them type themselves and just confirm. The cheapest click is the one that never happens; the user shifts from author to reviewer, and the entry errors go with it.',
        ],
        demo: {
          kind: 'motorAutofill',
          alwaysOn: true,
          caption: 'Toggle to let the flow fill the form for you, then review.',
          toggles: [{ id: 'better', label: 'Better approach', defaultOn: false }],
        },
      },
      {
        id: 'skip-the-pointer',
        title: 'Click through it, or key through it',
        info: [
          'A five-step overview tour. To move, the pointer has to travel to the Next button and back, every step, every time.',
          'Toggle Better approach and the arrow keys drive it: ← and → step the tour with the hands never leaving the keyboard. Same content, no pointer journey at all.',
        ],
        demo: {
          kind: 'motorTour',
          alwaysOn: true,
          caption: 'Click Next through the tour; toggle to drive it with ← and → instead.',
          toggles: [{ id: 'better', label: 'Better approach', defaultOn: false }],
        },
      },
    ],
    proof: {
      source: 'Retail product-lifecycle tool',
      body: 'An error-prone “Season” field took roughly 30 seconds to fill by hand, every time, across thousands of records. A flow that auto-populated it on page view turned authoring into reviewing, and the misrouting errors from manual entry disappeared with the keystrokes.',
      metric: '~90 hrs',
      metricLabel: 'saved across ~11,000 auto-filled entries',
    },
  },

  /* ── Day 2 ── coming soon ────────────────────────────────────────────────── */
  {
    id: 'error-prevention',
    ordinal: '11',
    day: 2,
    label: 'Error prevention > Error messages',
    summary: 'The cheapest error to fix is the one that never happens.',
    status: 'soon',
    cover:
      'The usual instinct is to explain an error after it happens. The principle says **intercept it before.** The cheapest error to fix is the one that never happens at all.',
    intro: [
      'Nielsen ranks “error prevention” above even the best error message, and poka-yoke (Shingo’s mistake-proofing) says the same: design the failure out at the source instead of catching it downstream. Prevention is cheap; correction is expensive and erodes trust.',
      'There’s a timing rule inside it: catch the problem at the point of entry, not at the final submit, because a late error forces the user to retrace everything. The strongest form removes the wrong choice entirely, so the mistake simply can’t be made.',
    ],
    scenarios: [
      {
        id: 'validate-at-source',
        title: 'Catch it at entry, not at submit',
        info: [
          'A 3-page form. The phone field accepts anything, and the format error only surfaces when you hit Submit on the last page, so you have to go back and fix it after filling everything.',
          'Toggle Better approach and a Smart Tip validates the field as you type, with Next blocked until it’s right. The error never reaches submit, and the form is first-time-right.',
        ],
        demo: {
          kind: 'errorValidate',
          alwaysOn: true,
          caption: 'Fill the phone field; toggle to validate as you type instead of at submit.',
          toggles: [{ id: 'better', label: 'Better approach', defaultOn: false }],
        },
      },
      {
        id: 'block-the-catastrophe',
        title: 'Make the catastrophe impossible',
        info: [
          'A single Send button with a huge blast radius: one click messages ~40,000 people, and there’s no undo. For an irreversible action, no error message after the fact is good enough.',
          'Toggle Better approach and a blocker intercepts the click the instant it’s attempted, holding the action until the audience is reviewed. The mistake is designed out, not just discouraged.',
        ],
        demo: {
          kind: 'errorBlocker',
          alwaysOn: true,
          caption: 'Hit Send; toggle to intercept the catastrophic action with a blocker.',
          toggles: [{ id: 'better', label: 'Better approach', defaultOn: false }],
        },
      },
      {
        id: 'deflect-the-ticket',
        title: 'Intercept only at the costly step',
        info: [
          'A support-ticket page. Choose “Password reset”, hit Submit, and a ticket is created, a ticket a self-serve flow could have handled. The cost shows up downstream as rework.',
          'Toggle Better approach and a blocker tooltip intercepts only at this decision point, offering to run the password flow instead. One decisive intercept where the expensive mistake happens, silent everywhere else.',
        ],
        demo: {
          kind: 'errorDeflect',
          alwaysOn: true,
          caption: 'Submit a password ticket; toggle to deflect it to self-serve.',
          toggles: [{ id: 'better', label: 'Better approach', defaultOn: false }],
        },
      },
    ],
    proof: {
      source: 'Alumni-engagement foundation',
      body: 'Event managers kept hitting “Create New List” and accidentally pulling the entire 400,000-person database; one incident blasted 40,000 people with the wrong invite, triggering a multi-team crisis. A blocker on those buttons exited the form before any data loaded and redirected to the right workflow, making the full-database pull impossible, with no backend change.',
      metric: '40,000',
      metricLabel: 'wrong-audience sends, designed out at the source',
    },
  },
  {
    id: 'segmentation',
    ordinal: '12',
    day: 2,
    label: 'Segmentation',
    summary: 'Break the journey into chunks the user can actually hold.',
    status: 'soon',
    cover:
      'Segmentation is **chunking.** Break a long, continuous stream into learner-paced pieces, because the back half of an unbroken sequence simply washes out.',
    intro: [
      'Mayer’s segmenting principle: user-paced segments reliably beat one continuous stream. The reason is cognitive load, working memory holds only about four things at once (Cowan), so a long undivided sequence overruns it and the rest is lost.',
      'Chunking lets the brain process, consolidate, and breathe between segments. The job is to find the natural seams and let the user pace through them, instead of dumping everything at once.',
    ],
    scenarios: [
      {
        id: 'segmented-tasklist',
        title: 'A scattered list, or a paced journey',
        info: [
          'A task list that dumps every onboarding step into one flat scroll. No order, no grouping, no sense of progress, it reads as one overwhelming wall.',
          'Toggle Better approach and the same tasks are chunked into Day 1 to Day 4 stages, each a small cluster with its own progress. The same twelve tasks now read as “four small things”, and the user always knows where they are.',
        ],
        demo: {
          kind: 'segmentTasks',
          alwaysOn: true,
          caption: 'Open the task list; toggle to chunk it into paced stages.',
          toggles: [{ id: 'better', label: 'Better approach', defaultOn: false }],
        },
      },
      {
        id: 'chunked-flow',
        title: 'The 40-step march, or a breakpoint',
        info: [
          'A 40-step walk-through: Next, Next, Next, with no pause and no end in sight. By step fifteen the user has lost the thread, and there’s nowhere to stop and resume.',
          'Toggle Better approach and the flow is broken into segments. After the first chunk a checkpoint appears, “Nice, setup is done. Continue, or pick this up later?”, so the user consolidates, feels progress, and can resume without starting over.',
        ],
        demo: {
          kind: 'segmentSteps',
          alwaysOn: true,
          caption: 'Click Next through the march; toggle to chunk it with a checkpoint.',
          toggles: [{ id: 'better', label: 'Better approach', defaultOn: false }],
        },
      },
    ],
    proof: {
      source: 'Fintech onboarding',
      body: 'Customer success was burning roughly 2 hours per onboarding, about 70 to 80 hours a month, walking every new user through manually. A task list, chunked into paced stages and shown only to the right cohort, bundled the required flows into a sequence users completed themselves, cutting the team out of the repetitive walkthrough.',
      metric: '~70-80 hrs',
      metricLabel: 'of CSM time saved per month',
    },
  },
  {
    id: 'autonomy',
    ordinal: '13',
    day: 2,
    label: 'Autonomy',
    summary: 'Hand the user the wheel: whether, what, and how much help they get.',
    status: 'soon',
    cover:
      'Force guidance on someone who didn’t ask, especially an expert, and you signal “I don’t trust you.” **Hand the user the wheel** instead, and a path they chose is one they’ll actually follow.',
    intro: [
      'Self-Determination Theory (Deci & Ryan): intrinsic motivation rests on autonomy (I chose this) and competence (I can do this). Guidance forced on a user violates both, and they disengage from all of your content, not just this one.',
      'The expertise-reversal effect adds the corollary: help that aids a novice actively harms an expert. So the safest way to serve both is to let the user self-select, whether they want help, what they learn, and how much, rather than guessing for them.',
    ],
    scenarios: [
      {
        id: 'choose-the-path',
        title: 'Auto-run, or let them choose',
        info: [
          'The moment the user lands, a walk-through just starts. No consent, no choice, the same forced path for everyone, whether they need it or not.',
          'Toggle Better approach and a pop-up offers the choice first: Process A, Process B, or “I’ll explore on my own.” The user picks, and the chosen flow launches from there. Autonomy at the entry point.',
        ],
        demo: {
          kind: 'autonomyChoice',
          alwaysOn: true,
          caption: 'Watch the flow auto-run; toggle to offer the choice first.',
          toggles: [{ id: 'better', label: 'Better approach', defaultOn: false }],
        },
      },
      {
        id: 'branch-on-state',
        title: 'Walk every step, or branch',
        info: [
          'A two-section form where Section A is already filled. The linear flow walks every field anyway, telling the user to “fill this” on a field that’s already done. It insults the expert and wastes their time.',
          'Toggle Better approach and the flow branches on state: it sees Section A is satisfied and skips straight to Section B. Adapt to what the user has actually done, instead of assuming zero knowledge.',
        ],
        demo: {
          kind: 'autonomyBranch',
          alwaysOn: true,
          caption: 'Step through the flow; toggle to branch past the finished section.',
          toggles: [{ id: 'better', label: 'Better approach', defaultOn: false }],
        },
      },
      {
        id: 'detect-the-veteran',
        title: 'Detect the veteran, step back',
        info: [
          'A workspace with a hand-holding task list (bottom-left) and Self-Help (bottom-right). The task list is right for a newcomer, but a power user finds it noise: heavy guidance reads as “I don’t trust you to know.”',
          'Click the profile, top-right, to switch to a veteran. The task list quietly disappears, and the quiet Self-Help stays one click away if they want it. No toggle here: the experience adapts to who the user is.',
        ],
        demo: {
          kind: 'autonomyDetect',
          alwaysOn: true,
          caption: 'Click the profile (top-right) to switch users and watch the guidance adapt.',
          toggles: [],
        },
      },
    ],
    proof: {
      source: 'Automotive contract-management tool',
      body: 'The training sandbox was lost, so people had to onboard directly in production. A persona-gateway pop-up let users self-select their experience level and routed each accordingly: new users learned safely via guided flows, while veterans kept working uninterrupted with light-touch help. The team specifically praised separating new from existing users to avoid unnecessary disruption.',
      metric: '977',
      metricLabel: 'users routed to the right path (70 guided, 813 left to work)',
    },
  },
  {
    id: 'exclusivity',
    ordinal: '14',
    day: 2,
    label: 'Exclusivity',
    summary: 'An ask aimed at everyone is aimed at no one. Make it personal.',
    status: 'soon',
    cover:
      'A generic blast aimed at “everyone” is aimed at no one. **Targeting beats broadcasting:** the same ask, framed as personal and selective, clears the filter that screens out noise.',
    intro: [
      'Cialdini’s principles of influence: people act when an ask feels personally directed, scarcity (“a selected few”), social proof (“people like you did this”), and self-relevance. The brain filters generic appeals as noise, but a personally-addressed one gets through.',
      'For an author, that means the lift is often in the framing, not the offer. “You, specifically, were chosen” converts where “we’d love your feedback” is ignored. Same survey, same moment, different result.',
    ],
    scenarios: [
      {
        id: 'selected-survey',
        title: 'A blast, or “you were selected”',
        info: [
          'A feedback survey delivered as a generic notice: “We’d love your feedback, take our survey.” Shown to everyone, filtered out as noise by almost everyone.',
          'Toggle Better approach and the same survey is reframed with exclusivity and self-relevance: “You’ve been specifically selected, your input shapes what we build next.” The ask is identical; the framing is the whole lift.',
        ],
        demo: {
          kind: 'exclusivitySurvey',
          alwaysOn: true,
          caption: 'Toggle to reframe the same survey as a personal, selective ask.',
          toggles: [{ id: 'better', label: 'Better approach', defaultOn: false }],
        },
      },
      {
        id: 'personalized-welcome',
        title: 'Generic, or addressed to you',
        info: [
          'A welcome pop-up that greets everyone the same way: “Welcome to the dashboard.” Polite, and instantly forgettable.',
          'Toggle Better approach and the greeting pulls the user’s name from a variable: “Hey Sumit, welcome back.” A message addressed to you reads as meant for you, and self-relevance is what clears the filter.',
        ],
        demo: {
          kind: 'exclusivityWelcome',
          alwaysOn: true,
          caption: 'Toggle to personalise the welcome with the user’s name.',
          toggles: [{ id: 'better', label: 'Better approach', defaultOn: false }],
        },
      },
    ],
    proof: {
      source: 'Pharma in-app feedback',
      body: 'A feedback survey shared as a static in-app text link drew 11 responses in 5 days. Replaced with a proactive, targeted pop-up at login (capped at two views) with the survey embedded inline, it drove a 5x increase in responses, purely by making the ask visible and personally directed instead of passive.',
      metric: '5x',
      metricLabel: 'more responses, from the same survey',
    },
  },
  {
    id: 'multimedia-modality',
    ordinal: '15',
    day: 2,
    label: 'Multimedia & modality',
    summary: 'The same answer in the wrong format fails. Match channel to question.',
    status: 'soon',
    cover:
      'The channel you deliver an answer through changes how well it lands. **The same answer in the wrong format fails:** match the modality to the question, the moment, and the user.',
    intro: [
      'Mayer’s modality principle: for complex material, narration over a visual beats a wall of on-screen text, the spoken and visual channels share the load instead of overloading one. The effect is strongest exactly when the content is hard.',
      'The author’s translation is a decision rule. A flow is right for “walk me through it now”, a video for “show me how it works”, an article for “let me scan and reference”, and a quick answer for “just tell me one fact.” Pick the channel the brain can absorb in that moment.',
    ],
    scenarios: [
      {
        id: 'quick-answer',
        title: 'Make them work, or just answer',
        info: [
          'A user needs one fact, “how many leaves do I have left?”, and Self-Help hands back flows to run. A heavy modality for a light question: they just wanted a number.',
          'Toggle Better approach and the same search answers inline: a quick-answer card thinks for a beat, then types out “You have 34 leaves left.” The flows stay below for when you actually want to act. The lightest modality that fits the need.',
        ],
        demo: {
          kind: 'modalityQuickRead',
          alwaysOn: true,
          caption: 'Open Self-Help; toggle to answer the fact inline instead of launching a flow.',
          toggles: [{ id: 'better', label: 'Better approach', defaultOn: false }],
        },
      },
      {
        id: 'pick-your-format',
        title: 'One format, or let them pick',
        info: [
          'A user searches “how do I file a support ticket?” and gets a single article, a wall of text. Right for some, wrong for the person who’d rather watch or be walked through it.',
          'Toggle Better approach and Self-Help returns the same topic in three modalities, an article to scan, a flow to be walked through live, and a narrated video to watch, and the user picks the channel that fits their moment.',
        ],
        demo: {
          kind: 'modalityMulti',
          alwaysOn: true,
          caption: 'Open Self-Help; toggle to offer the answer as article, flow, and video.',
          toggles: [{ id: 'better', label: 'Better approach', defaultOn: false }],
        },
      },
    ],
    proof: {
      source: 'Consulting CRM support',
      body: 'A team fielded around 10 repetitive “how to dedupe a record” questions a week, roughly 10 minutes each. Turning the guide into searchable Self-Help that summarized the steps inline when users searched “deduplication”, the lightest modality for the question, cut those queries about 75% and saved roughly 70 to 80 minutes a week.',
      metric: '~75%',
      metricLabel: 'fewer repetitive questions',
    },
  },
]
