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
  | 'contiguityAnchor'
  | 'contiguityContext'
  | 'contiguityTiming'
  | 'hicksCta'
  | 'hicksLanguage'
  | 'hicksSelfHelp'
  | 'coherenceTooltip'
  | 'coherenceForm'
  | 'coherencePrune'

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
  /** Title shown in the index and as the detail page heading. */
  label: string
  /** One-line description in the index list. */
  summary: string
  status: PrincipleStatus
  /** One tight sentence shown on the cover screen, before jumping in. */
  cover?: string
  /** Lead paragraph(s) on the detail page, before the scenarios. */
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
      'Every principle after this one is just a way of answering a question you can’t answer yet: who is this for? You built the app, which makes you the world’s least typical user of it. The person on the other side has a different brain, a different day, and a different amount of fear than you do.',
      'PACT (Benyon’s framework) is the scaffold: People tells you who, Activities tells you what, Context tells you when and where, Technology tells you through what. You need all four before you design anything. Pick a lens on the right and watch the same task split into three very different people.',
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
        { text: '. Right now I’m ' },
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
    personaCards: [
      {
        id: 'grace',
        name: 'Grace',
        role: 'Sales Manager · Large enterprise',
        src: '/personas/persona-grace.png',
      },
      {
        id: 'lee',
        name: 'Lee',
        role: 'HR Specialist · Entry-level',
        src: '/personas/persona-lee.png',
      },
      {
        id: 'nigel',
        name: 'Nigel',
        role: 'CIO · Large enterprise',
        src: '/personas/persona-nigel.png',
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
      'Knowing your product isn’t knowing the names of the content types. It’s knowing what each one is for: its job, its cost, when it earns its place, and when it’s the wrong answer.',
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
  },
  {
    id: 'flow-state',
    ordinal: '03',
    label: 'Don’t break the flow state',
    summary: 'Match the interruption to the task. Deep focus deserves a gentle touch.',
    status: 'live',
    cover:
      'When someone is deep in a task, a blocking popup spends all their attention at once, and the first thing they learn is to dismiss you. Shape the interruption to the moment instead.',
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
      source: 'SC Johnson · Sitecore',
      body: '~900 users were drowning in a complex form. The fix wasn’t a popup explaining it; it was quiet hover tooltips that appeared only when needed.',
      metric: '268,487',
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
      'Cue the eye to what matters with weight, colour, or a single highlight. The catch authors forget: if everything is highlighted, nothing is.',
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
    ],
    proof: {
      source: 'AutoZone · AZ_Pro',
      body: 'A high-value feature shipped with no signal. 2,714 users found it in three weeks. The fix was one beacon with a “New” label, isolated against a flat UI.',
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
      'When the explanation sits away from the thing it explains, the user pays a working-memory tax just stitching the two together. Put the words on the element and comprehension is immediate.',
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
      'Decision time rises with the number and complexity of options, roughly logarithmically. More choices doesn’t mean more help; it means more hesitation, and often abandonment.',
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
      source: 'Global law firm',
      body: 'Attorneys needed off public AI tools and onto the sanctioned one. The popup gave exactly two CTAs, “Take me to Bing” and “Leave me here”. Constrained choice, clean action.',
      metric: '294',
      metricLabel: 'users redirected (547 times) in 90 days',
    },
  },
  {
    id: 'coherence',
    ordinal: '07',
    label: 'Coherence',
    summary: 'Cut what doesn’t teach. Decoration competes with the message.',
    status: 'live',
    cover:
      'People learn better when extraneous words, graphics, and detail are removed. Every non-essential element competes for the same limited working memory, so “nice to have” content actively lowers comprehension.',
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
      source: 'Luxury-automotive CLM',
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
    status: 'soon',
  },
  {
    id: 'match-their-model',
    ordinal: '09',
    label: 'Match their model',
    summary: 'Speak in the user’s concepts, not the system’s internals.',
    status: 'soon',
  },
  {
    id: 'goldilocks-nudge',
    ordinal: '10',
    label: 'The Goldilocks nudge',
    summary: 'Not too loud, not too quiet. Guidance sized to the stakes.',
    status: 'soon',
  },
]
