/**
 * Self-Discovery onboarding — P7
 *
 * Addresses HR feedback: "capire chi sei" before "mostrarti al mondo."
 * Students answer guided prompts before their profile is exposed to recruiters.
 *
 * The last step reconciles self-perception against the verified skill graph —
 * a conversation starter with career services, not a judgement.
 */

export const CORE_VALUES = [
  'Impact', 'Learning', 'Autonomy', 'Stability', 'Income', 'Community',
  'Creativity', 'Craft', 'Recognition', 'Balance', 'Adventure', 'Family',
  'Health', 'Honesty', 'Service', 'Independence', 'Growth', 'Leadership',
  'Curiosity', 'Excellence', 'Simplicity', 'Justice', 'Beauty', 'Purpose',
  'Challenge', 'Fun', 'Tradition', 'Innovation', 'Connection', 'Mastery',
]

export const MOTIVATIONS = [
  'Solve hard technical problems',
  'Help people directly',
  'Build something lasting',
  'Lead and shape teams',
  'Travel and work internationally',
  'Make money to support family',
  'Contribute to scientific progress',
  'Create art / beauty / delight',
  'Reform institutions',
  'Become the best at my craft',
  'Start my own company',
  'Stay close to home and community',
]

export const DEALBREAKERS = [
  'Long commute',
  'No remote option',
  'Forced relocation',
  'Work over 50h/week',
  'No growth path',
  'Non-inclusive culture',
  'Ethically questionable sector',
  'Rigid hierarchy',
  'Lack of learning budget',
  'No stability / frequent layoffs',
]

export const ENERGIZING_ACTIVITIES = [
  'Deep focus work alone',
  'Whiteboard problem-solving',
  'Pair programming',
  'Presenting to an audience',
  'Teaching / mentoring',
  'Writing and documenting',
  'User research / interviews',
  'Designing visual things',
  'Data analysis',
  'Networking / meeting new people',
  'Organizing / planning',
  'Building physical things',
]

export const STEPS = [
  {
    id: 1,
    key: 'values',
    title: 'What matters to you',
    description: 'Pick 5-7 values that describe what you want from work and life.',
  },
  {
    id: 2,
    key: 'strengths',
    title: "What you're good at",
    description: 'Reflect on moments where you were in flow. What were you doing?',
  },
  {
    id: 3,
    key: 'projects',
    title: "What you've already done",
    description: 'Tag your past projects — roles played, skills used, pride felt.',
  },
  {
    id: 4,
    key: 'interests',
    title: 'Where you want to go',
    description: 'Motivations and dealbreakers. No wrong answers.',
  },
  {
    id: 5,
    key: 'skills',
    title: 'Self-assess your skills',
    description: "Rate yourself honestly — we'll compare to what your record shows.",
  },
  {
    id: 6,
    key: 'reconcile',
    title: 'Your discovery report',
    description: "Where your self-perception matches your verified record — and where it doesn't.",
  },
] as const

export type StepKey = typeof STEPS[number]['key']
