'use client'

import { useEffect, useState, useMemo } from 'react'
import { Link } from '@/navigation'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Brain,
  Users,
  Target,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Briefcase,
  MessageCircle,
  Zap,
  AlertTriangle,
  Loader2,
  Lightbulb,
  Download,
  TrendingUp,
  TrendingDown,
  Minus,
  UserPlus,
  BookOpen,
  GraduationCap,
  Quote,
  BarChart3,
  Mic,
  Rocket,
  Calendar,
  Search,
  Star,
  Eye,
  Edit3,
  Compass,
  Heart,
  ClipboardList,
} from 'lucide-react'
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts'

// ============================================================================
// TYPES
// ============================================================================

interface BigFiveData {
  personality: string | null
  openness: number
  conscientiousness: number
  extraversion: number
  agreeableness: number
  neuroticism: number
  opennessPercentile: number
  conscientiousnessPercentile: number
  extraversionPercentile: number
  agreeablenessPercentile: number
  neuroticismPercentile: number
  strengths: string[]
  developmentAreas: string[]
  careerFit: string[]
}

interface DISCData {
  dominance: number
  influence: number
  steadiness: number
  compliance: number
  dominancePercentile: number
  influencePercentile: number
  steadinessPercentile: number
  compliancePercentile: number
  primaryStyle: string
  secondaryStyle: string | null
  workStyle: string | null
  communicationStyle: string | null
  motivators: string[]
  stressors: string[]
  idealTeamRole: string | null
}

interface CompetencyData {
  communication: number
  teamwork: number
  leadership: number
  problemSolving: number
  adaptability: number
  emotionalIntelligence: number
  timeManagement: number
  conflictResolution: number
  communicationPercentile: number
  teamworkPercentile: number
  leadershipPercentile: number
  problemSolvingPercentile: number
  adaptabilityPercentile: number
  emotionalIntelligencePercentile: number
  timeManagementPercentile: number
  conflictResolutionPercentile: number
  overallScore: number
  overallPercentile: number
  topStrengths: string[]
  developmentAreas: string[]
}

interface HistoryEntry {
  date: string
  [key: string]: string | number
}

interface HistoryData {
  bigFive: HistoryEntry[]
  disc: HistoryEntry[]
  competency: HistoryEntry[]
}

interface PeerAverages {
  bigFive: { openness: number; conscientiousness: number; extraversion: number; agreeableness: number; neuroticism: number; count: number } | null
  competency: { communication: number; teamwork: number; leadership: number; problemSolving: number; adaptability: number; emotionalIntelligence: number; timeManagement: number; conflictResolution: number; overallScore: number; count: number } | null
}

interface PersonalityResponse {
  bigFive: BigFiveData | null
  disc: DISCData | null
  competency: CompetencyData | null
  history: HistoryData
  peerAverages: PeerAverages
  university: string | null
  hasAnyAssessment: boolean
}

// ============================================================================
// COACHING TIPS MAP
// ============================================================================

const coachingTips: Record<string, string> = {
  'Stress management': 'Practice 5-minute mindfulness before high-pressure moments. Track your stress triggers in a journal for one week.',
  'Public speaking': 'Start with 2-minute presentations to small groups. Record yourself and review. Join a campus speaking club.',
  'Active listening': 'In your next meeting, summarize what others say before responding. Ask clarifying questions instead of jumping to solutions.',
  'Risk tolerance': 'Set aside one hour per week for low-stakes experimentation. Try a new approach on a non-critical task.',
  'Time management': 'Use the Pomodoro technique: 25 minutes focused work, 5-minute break. Plan your top 3 priorities each morning.',
  'Conflict resolution': 'Practice the "I feel... when... because..." framework. Seek to understand before being understood.',
  'Leadership': 'Volunteer to lead one small project or meeting. Focus on enabling others rather than doing everything yourself.',
  'Teamwork': 'Ask teammates for feedback after each project. Practice delegating one task you normally do yourself.',
  'Communication': 'Before sending important messages, re-read them from the recipient\'s perspective. Practice the "headline first" approach.',
  'Problem solving': 'When facing a challenge, write down 3 possible solutions before picking one. Practice breaking big problems into smaller parts.',
  'Adaptability': 'Once a week, deliberately change a routine. Reflect on what you learned from unexpected situations.',
  'Emotional intelligence': 'Practice naming your emotions throughout the day. Before reacting, pause and ask "What am I feeling right now?"',
}

const defaultTip = 'Reflect on situations where this comes up. Set a small, specific goal to practice this skill this week.'

// ============================================================================
// DISC STYLE LABELS & COMPATIBILITY
// ============================================================================

const discStyleLabels: Record<string, string> = {
  DOMINANCE: 'Dominance',
  INFLUENCE: 'Influence',
  STEADINESS: 'Steadiness',
  COMPLIANCE: 'Compliance',
  DI: 'Dominance-Influence',
  DC: 'Dominance-Compliance',
  IS: 'Influence-Steadiness',
  IC: 'Influence-Compliance',
  DS: 'Dominance-Steadiness',
  SC: 'Steadiness-Compliance',
}

const discBarColors = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6']

const teamCompatibility: Record<string, { bestWith: string[]; tips: string; challengeWith: string[]; challengeTip: string }> = {
  DOMINANCE: {
    bestWith: ['Steadiness', 'Compliance'],
    tips: 'S-types balance your pace with patience, while C-types provide the data you need to make confident decisions.',
    challengeWith: ['Dominance'],
    challengeTip: 'Two D-types can clash over control. Agree on decision boundaries upfront.',
  },
  INFLUENCE: {
    bestWith: ['Compliance', 'Steadiness'],
    tips: 'C-types help ground your ideas with analysis, while S-types provide reliable follow-through on your vision.',
    challengeWith: ['Dominance'],
    challengeTip: 'D-types may find your storytelling too slow. Lead with the bottom line, then add color.',
  },
  STEADINESS: {
    bestWith: ['Influence', 'Dominance'],
    tips: 'I-types bring the energy to get things started, while D-types push you past your comfort zone for growth.',
    challengeWith: ['Dominance'],
    challengeTip: 'D-types may push too fast. Speak up early about what you need to do your best work.',
  },
  COMPLIANCE: {
    bestWith: ['Steadiness', 'Influence'],
    tips: 'S-types share your need for quality, while I-types help you communicate your findings with impact.',
    challengeWith: ['Influence'],
    challengeTip: 'I-types may skip details you value. Provide concise summaries rather than full reports.',
  },
  DI: {
    bestWith: ['Steadiness', 'Compliance'],
    tips: 'You bring energy and drive — pair with S-types for follow-through and C-types for quality control.',
    challengeWith: ['Compliance'],
    challengeTip: 'C-types may feel rushed. Schedule review checkpoints to honor their need for accuracy.',
  },
  DC: {
    bestWith: ['Influence', 'Steadiness'],
    tips: 'You are results-focused and precise. I-types help you rally the team, S-types keep morale steady.',
    challengeWith: ['Influence'],
    challengeTip: 'I-types may seem unfocused to you. Appreciate their ability to build relationships and buy-in.',
  },
  IS: {
    bestWith: ['Dominance', 'Compliance'],
    tips: 'You excel at relationships and reliability. D-types push initiatives forward, C-types ensure quality.',
    challengeWith: ['Dominance'],
    challengeTip: 'D-types may seem abrupt. Remember they respect efficiency — keep updates brief.',
  },
  IC: {
    bestWith: ['Dominance', 'Steadiness'],
    tips: 'You balance people skills with precision. D-types add urgency, S-types add stability to your plans.',
    challengeWith: ['Dominance'],
    challengeTip: 'D-types may override your careful analysis. Present conclusions first, then methodology.',
  },
  DS: {
    bestWith: ['Influence', 'Compliance'],
    tips: 'You combine drive with patience. I-types energize the team, C-types ensure nothing is overlooked.',
    challengeWith: ['Influence'],
    challengeTip: 'I-types may seem scattered. Channel their enthusiasm toward specific goals.',
  },
  SC: {
    bestWith: ['Influence', 'Dominance'],
    tips: 'You are reliable and precise. I-types bring creativity, D-types push for bold moves you might hesitate on.',
    challengeWith: ['Dominance'],
    challengeTip: 'D-types may push for speed over quality. Set clear quality standards early in projects.',
  },
}

// ============================================================================
// LEARNING RESOURCE LINKS
// ============================================================================

const learningResources: Record<string, { course: string; description: string }> = {
  'Stress management': { course: 'Resilience & Well-being', description: 'Build mental resilience and healthy coping strategies' },
  'Public speaking': { course: 'Presentation Skills', description: 'Master confident public speaking and storytelling' },
  'Active listening': { course: 'Communication Fundamentals', description: 'Develop empathetic listening and feedback skills' },
  'Risk tolerance': { course: 'Innovation & Entrepreneurship', description: 'Learn to evaluate risks and embrace calculated uncertainty' },
  'Time management': { course: 'Productivity & Planning', description: 'Master prioritization, scheduling, and focus techniques' },
  'Conflict resolution': { course: 'Negotiation & Mediation', description: 'Navigate disagreements constructively and find win-win solutions' },
  'Leadership': { course: 'Leadership Foundations', description: 'Develop your leadership voice and team management skills' },
  'Teamwork': { course: 'Collaboration & Teamwork', description: 'Build trust, delegate effectively, and thrive in group settings' },
  'Communication': { course: 'Business Communication', description: 'Write clearly, present confidently, and influence effectively' },
  'Problem solving': { course: 'Critical Thinking', description: 'Sharpen analytical reasoning and creative problem-solving' },
  'Adaptability': { course: 'Change Management', description: 'Build flexibility and thrive in uncertain environments' },
  'Emotional intelligence': { course: 'Emotional Intelligence', description: 'Strengthen self-awareness, empathy, and relationship management' },
}

// ============================================================================
// INTERVIEW PREP TIPS (by DISC primary style)
// ============================================================================

const interviewTipsByStyle: Record<string, { strengths: string[]; watchOuts: string[]; tips: string[] }> = {
  DOMINANCE: {
    strengths: ['You project confidence and decisiveness', 'You give direct, concise answers', 'You naturally talk about results and impact'],
    watchOuts: ['May come across as aggressive or dismissive', 'May interrupt or rush the interviewer', 'May undersell collaboration skills'],
    tips: ['Prepare examples that show you listening to others', 'Practice pausing before answering — 2 seconds feels right', 'Balance "I achieved" with "We accomplished" stories'],
  },
  INFLUENCE: {
    strengths: ['You build instant rapport with interviewers', 'You tell engaging stories with energy', 'You show genuine enthusiasm for the role'],
    watchOuts: ['May ramble or go off-topic', 'May seem light on details or data', 'May over-promise capabilities'],
    tips: ['Use the STAR method to keep stories focused', 'Prepare specific metrics and numbers for your achievements', 'Practice concise answers — aim for 90-second responses'],
  },
  STEADINESS: {
    strengths: ['You come across as thoughtful and reliable', 'You give well-considered, honest answers', 'You naturally demonstrate team orientation'],
    watchOuts: ['May seem too passive or low-energy', 'May undersell individual accomplishments', 'May hesitate on ambition-related questions'],
    tips: ['Prepare "impact" stories where YOU drove the outcome', 'Practice projecting enthusiasm — lean forward, use hand gestures', 'Have a clear, confident answer for "Where do you see yourself in 5 years?"'],
  },
  COMPLIANCE: {
    strengths: ['You give precise, well-structured answers', 'You demonstrate deep technical knowledge', 'You ask insightful questions about the role'],
    watchOuts: ['May over-explain or get too technical', 'May seem cold or unapproachable', 'May focus on problems rather than solutions'],
    tips: ['Lead with the conclusion, then add supporting detail', 'Practice small talk for the first 2 minutes', 'For behavioral questions, emphasize the positive outcome, not just the analysis'],
  },
  DI: {
    strengths: ['You combine confidence with warmth', 'You naturally talk about leading teams to results', 'You are persuasive and energetic'],
    watchOuts: ['May dominate the conversation', 'May seem impatient with slow-paced interviews', 'May lack detail in answers'],
    tips: ['Let the interviewer guide the pace', 'Prepare data-backed stories alongside your narrative', 'Ask questions that show you listen, not just lead'],
  },
  DC: {
    strengths: ['You project competence and authority', 'You give direct, data-driven answers', 'You demonstrate strategic thinking'],
    watchOuts: ['May seem intimidating or cold', 'May not show enough warmth or team spirit', 'May be overly critical of current employer'],
    tips: ['Smile and make eye contact — these matter', 'Include stories about mentoring or helping teammates', 'Frame challenges positively — what you learned, not what went wrong'],
  },
  IS: {
    strengths: ['You are warm, friendly, and easy to talk to', 'You demonstrate loyalty and commitment', 'You show excellent listening skills'],
    watchOuts: ['May not advocate strongly enough for yourself', 'May seem uncomfortable with conflict questions', 'May be vague about career ambitions'],
    tips: ['Prepare a confident "elevator pitch" about your value', 'Practice answering "Tell me about a conflict" with specific examples', 'Show ambition — they want to see growth potential'],
  },
  IC: {
    strengths: ['You balance empathy with analytical thinking', 'You demonstrate thoroughness and attention to detail', 'You show genuine curiosity about the company'],
    watchOuts: ['May overthink or seem indecisive', 'May struggle with "big picture" questions', 'May come across as anxious or over-prepared'],
    tips: ['For vision questions, prepare a clear 30-second answer', 'Show excitement alongside your analysis', 'Relax — your preparation is a strength, not a weakness'],
  },
  DS: {
    strengths: ['You combine drive with dependability', 'You give balanced, thoughtful answers', 'You demonstrate patience with results focus'],
    watchOuts: ['May send mixed signals about pace preferences', 'May undersell your innovative side', 'May be too modest about achievements'],
    tips: ['Lead with your best achievement — own it', 'Show that you can both drive and support', 'Prepare examples of handling fast-paced change'],
  },
  SC: {
    strengths: ['You demonstrate reliability and precision', 'You give careful, accurate answers', 'You show deep commitment to quality'],
    watchOuts: ['May seem risk-averse or resistant to change', 'May not show enough leadership presence', 'May be too self-critical'],
    tips: ['Prepare a story about a time you took initiative', 'Show adaptability — talk about a time you embraced change', 'Practice answering quickly — your first answer is usually good enough'],
  },
}

// ============================================================================
// STRENGTH-BASED PROJECT SUGGESTIONS
// ============================================================================

const projectSuggestions: Record<string, { title: string; description: string; icon: 'briefcase' | 'users' | 'brain' | 'rocket' | 'mic' | 'target' }> = {
  'Communication': { title: 'Blog / Content Series', description: 'Write a blog series or create content that explains complex topics simply', icon: 'mic' },
  'Teamwork': { title: 'Open-Source Contribution', description: 'Join an open-source project and contribute through code reviews and collaboration', icon: 'users' },
  'Leadership': { title: 'Student Club Project', description: 'Lead a project for a student organization — plan, delegate, and deliver', icon: 'rocket' },
  'Problem solving': { title: 'Hackathon / Case Competition', description: 'Participate in a hackathon or case competition to solve real problems under pressure', icon: 'brain' },
  'Adaptability': { title: 'Cross-Functional Project', description: 'Work on a project outside your comfort zone — different tech, field, or team', icon: 'target' },
  'Emotional intelligence': { title: 'Mentoring / Tutoring', description: 'Mentor a junior student or tutor peers — build empathy and patience', icon: 'users' },
  'Time management': { title: 'Multi-Phase Portfolio Project', description: 'Plan and execute a personal project with milestones, deadlines, and deliverables', icon: 'target' },
  'Conflict resolution': { title: 'Mediation Workshop', description: 'Organize or participate in a peer mediation or negotiation workshop', icon: 'users' },
  'Public speaking': { title: 'Conference Talk / Workshop', description: 'Present at a meetup, conference, or lead a workshop for your peers', icon: 'mic' },
  'Stress management': { title: 'Wellness App / Initiative', description: 'Build an app or lead an initiative focused on student wellness', icon: 'brain' },
  'Active listening': { title: 'User Research Project', description: 'Conduct user interviews and build something based on real user needs', icon: 'target' },
  'Risk tolerance': { title: 'Startup MVP', description: 'Build a minimum viable product for a startup idea and test it with real users', icon: 'rocket' },
}

// ============================================================================
// DAILY MICRO-CHALLENGES
// ============================================================================

const microChallenges: Record<string, string[]> = {
  'Stress management': [
    'Take 3 deep breaths before your next meeting or class',
    'Write down 3 things you are grateful for right now',
    'Do a 5-minute body scan meditation during a break',
    'Identify your #1 stress trigger today and write one way to manage it',
    'Take a 15-minute walk without your phone',
    'Say "no" to one non-essential request today',
    'Stretch for 5 minutes between tasks',
  ],
  'Public speaking': [
    'Explain a concept to a friend in 60 seconds or less',
    'Record a 30-second voice memo about your day and listen back',
    'Make one comment or ask one question in class today',
    'Practice introducing yourself with a "hook" — something memorable',
    'Stand in front of a mirror and deliver your elevator pitch',
    'Volunteer to present first in your next group assignment',
    'Watch one TED talk and note what makes it engaging',
  ],
  'Active listening': [
    'In your next conversation, wait 3 seconds before responding',
    'Summarize what someone says before giving your opinion',
    'Put your phone face-down during your next conversation',
    'Ask 2 follow-up questions in your next discussion',
    'Notice when your mind wanders in conversation and bring it back',
    'Paraphrase a classmate\'s point in a study session',
    'Listen to a podcast and write a 3-sentence summary',
  ],
  'Time management': [
    'Plan your top 3 priorities before you start working today',
    'Try one 25-minute Pomodoro focus session',
    'Track how you spend the next 2 hours — no judgment, just observe',
    'Batch your email/messages into 2 check-in slots today',
    'Set a timer for your longest task and try to finish 10% faster',
    'Before bed, lay out tomorrow\'s schedule in 5 minutes',
    'Identify your peak focus hours and protect them tomorrow',
  ],
  'Leadership': [
    'Give genuine positive feedback to one person today',
    'Ask a teammate "How can I help?" and follow through',
    'Share a useful resource or article with your team or class',
    'Make a decision quickly on something you have been postponing',
    'Delegate one small task you would normally do yourself',
    'Write down your team\'s top goal and share it with them',
    'Ask for honest feedback from one person you trust',
  ],
  'Teamwork': [
    'Send an encouraging message to a teammate',
    'Offer to help someone with their part of a group project',
    'Share credit publicly — name someone who helped you recently',
    'Ask a team member for their perspective before sharing yours',
    'Volunteer for a task no one else has picked up',
    'Set up a quick 10-minute check-in with a project partner',
    'Write a brief "thank you" note to someone you collaborated with',
  ],
  'Communication': [
    'Before sending your next important message, re-read it from the receiver\'s perspective',
    'Explain a complex concept using only simple words',
    'Practice the "bottom line up front" approach in your next email',
    'Give constructive feedback to someone using "I noticed... I suggest..."',
    'Ask for clarification instead of assuming you understand',
    'Write a 280-character summary of your current project',
    'Practice maintaining eye contact in your next face-to-face conversation',
  ],
  'Conflict resolution': [
    'Think of a recent disagreement — how could you have handled it differently?',
    'Practice saying "I see your point, and here is what I think..."',
    'Find common ground with someone you disagree with today',
    'Listen to understand, not to respond, in your next debate',
    'Write down both sides of an argument you care about',
    'Apologize for something small — practice makes it easier for big things',
    'Try to find a win-win solution to a minor problem today',
  ],
}

const defaultMicroChallenges = [
  'Reflect on one moment today where this skill would have helped',
  'Set one tiny goal related to this skill for tomorrow',
  'Ask a friend how they handle this — learn from their approach',
  'Spend 5 minutes journaling about your progress in this area',
  'Find one article or video about improving this skill',
  'Practice this skill in a low-stakes situation today',
  'Rate yourself 1-10 on this skill — what would move you up by 1?',
]

// ============================================================================
// FAMOUS PERSONALITIES
// ============================================================================

const famousPersonalities: Record<string, { name: string; description: string; trait: string }[]> = {
  DOMINANCE: [
    { name: 'Steve Jobs', description: 'Visionary leader who demanded excellence and drove Apple to redefine entire industries', trait: 'Results-driven leadership' },
    { name: 'Serena Williams', description: 'Fierce competitor who dominated tennis with relentless drive and mental toughness', trait: 'Competitive determination' },
  ],
  INFLUENCE: [
    { name: 'Oprah Winfrey', description: 'Built a media empire through authentic connection and inspiring storytelling', trait: 'Inspiring communication' },
    { name: 'Richard Branson', description: 'Charismatic entrepreneur who built Virgin by energizing people around bold ideas', trait: 'Enthusiastic vision' },
  ],
  STEADINESS: [
    { name: 'Keanu Reeves', description: 'Known for kindness, consistency, and genuine care for everyone he works with', trait: 'Humble reliability' },
    { name: 'Tim Duncan', description: 'The "Big Fundamental" — quiet, consistent excellence and unwavering team loyalty', trait: 'Steady excellence' },
  ],
  COMPLIANCE: [
    { name: 'Marie Curie', description: 'Meticulous scientist whose precision and dedication led to two Nobel Prizes', trait: 'Rigorous analysis' },
    { name: 'Bill Gates', description: 'Analytical thinker who built Microsoft through systematic problem-solving and attention to detail', trait: 'Strategic precision' },
  ],
  DI: [
    { name: 'Elon Musk', description: 'Combines bold vision with infectious enthusiasm to rally teams around ambitious goals', trait: 'Visionary energy' },
    { name: 'Barack Obama', description: 'Decisive leader who inspired millions through charisma and clear communication', trait: 'Charismatic leadership' },
  ],
  DC: [
    { name: 'Angela Merkel', description: 'Led with quiet authority, combining decisive action with thorough analysis', trait: 'Measured authority' },
    { name: 'Jeff Bezos', description: 'Data-driven strategist who built Amazon through relentless focus on metrics and results', trait: 'Analytical drive' },
  ],
  IS: [
    { name: 'Emma Watson', description: 'Combines warmth with steadfast advocacy, building bridges through genuine connection', trait: 'Compassionate consistency' },
    { name: 'Fred Rogers', description: 'Patient, empathetic communicator who made everyone feel valued and understood', trait: 'Gentle influence' },
  ],
  IC: [
    { name: 'Malala Yousafzai', description: 'Combines passionate advocacy with careful, articulate messaging', trait: 'Purposeful precision' },
    { name: 'Lin-Manuel Miranda', description: 'Creative genius who blends emotional storytelling with meticulous craft', trait: 'Creative rigor' },
  ],
  DS: [
    { name: 'Satya Nadella', description: 'Transformed Microsoft through patient, empathetic leadership combined with clear direction', trait: 'Patient ambition' },
    { name: 'Jacinda Ardern', description: 'Led with compassion and calm decisiveness during crises', trait: 'Compassionate strength' },
  ],
  SC: [
    { name: 'Warren Buffett', description: 'Patient, analytical investor known for discipline, humility, and long-term thinking', trait: 'Disciplined patience' },
    { name: 'Jane Goodall', description: 'Combined meticulous observation with patient, steady dedication to her mission', trait: 'Devoted precision' },
  ],
}

// ============================================================================
// STUDY STYLE GUIDE
// ============================================================================

const studyStyles: Record<string, { method: string; description: string; icon: 'eye' | 'users' | 'brain' | 'edit' | 'compass' }[]> = {
  DOMINANCE: [
    { method: 'Goal-Based Sprints', description: 'Set aggressive study targets with deadlines. Break material into chunks and race through them.', icon: 'compass' },
    { method: 'Teach to Learn', description: 'Explain concepts to others — your confidence grows when you can articulate ideas clearly.', icon: 'users' },
    { method: 'Practice Problems First', description: 'Skip theory-heavy reading. Dive into problems, then learn theory to fill gaps.', icon: 'brain' },
  ],
  INFLUENCE: [
    { method: 'Study Groups', description: 'You learn best by discussing ideas with others. Form a study group and teach each other.', icon: 'users' },
    { method: 'Mind Maps & Visuals', description: 'Create colorful mind maps and diagrams. Your visual memory is strong.', icon: 'eye' },
    { method: 'Story-Based Learning', description: 'Connect concepts to real-world stories. Narrative helps you remember abstract ideas.', icon: 'edit' },
  ],
  STEADINESS: [
    { method: 'Consistent Routine', description: 'Same time, same place, every day. Your strength is steady, reliable habits.', icon: 'compass' },
    { method: 'Spaced Repetition', description: 'Review material at increasing intervals. Your patience makes this method very effective.', icon: 'brain' },
    { method: 'Collaborative Review', description: 'Review notes with a study partner. You process better when you can discuss at your pace.', icon: 'users' },
  ],
  COMPLIANCE: [
    { method: 'Structured Notes', description: 'Create detailed, organized notes with clear hierarchies. Your systematic approach is your superpower.', icon: 'edit' },
    { method: 'Deep Reading', description: 'Read primary sources and textbooks thoroughly. You retain detail better than most.', icon: 'eye' },
    { method: 'Practice Exams', description: 'Take timed practice tests under realistic conditions. You perform well with preparation.', icon: 'brain' },
  ],
  DI: [
    { method: 'Active Discussion', description: 'Lead study sessions and debate ideas. You learn by talking through problems.', icon: 'users' },
    { method: 'Project-Based Learning', description: 'Apply concepts to real projects immediately. Theory sticks when it is actionable.', icon: 'compass' },
    { method: 'Video & Podcasts', description: 'Use multimedia resources — your attention is captured by dynamic content.', icon: 'eye' },
  ],
  DC: [
    { method: 'Case Study Analysis', description: 'Study through real-world cases. You excel at analyzing situations and extracting principles.', icon: 'brain' },
    { method: 'Solo Deep Work', description: 'Block 2-3 hour solo sessions for deep focus. You do your best thinking alone.', icon: 'compass' },
    { method: 'Summary Frameworks', description: 'Create one-page summaries of each topic. Synthesizing helps you master material.', icon: 'edit' },
  ],
  IS: [
    { method: 'Study Buddy System', description: 'Find a regular study partner. You stay motivated through social accountability.', icon: 'users' },
    { method: 'Audio Learning', description: 'Record lectures and re-listen. Your auditory processing is strong.', icon: 'eye' },
    { method: 'Comfort-First Environment', description: 'Study in a comfortable, familiar space. You need to feel settled to focus well.', icon: 'compass' },
  ],
  IC: [
    { method: 'Research-Based Learning', description: 'Dive deep into topics that interest you. Your curiosity drives retention.', icon: 'brain' },
    { method: 'Discussion + Notes', description: 'Discuss ideas with others, then write up your own synthesis. Best of both worlds.', icon: 'edit' },
    { method: 'Visual Organizers', description: 'Use flowcharts and concept maps to connect ideas systematically.', icon: 'eye' },
  ],
  DS: [
    { method: 'Methodical Progress', description: 'Study in order, chapter by chapter. Your patience and drive create thoroughness.', icon: 'compass' },
    { method: 'Flashcard Systems', description: 'Build and review flashcard decks. Systematic repetition suits your style.', icon: 'brain' },
    { method: 'Group + Solo Mix', description: 'Alternate between group review and solo practice. You need both.', icon: 'users' },
  ],
  SC: [
    { method: 'Detailed Outlines', description: 'Create comprehensive outlines before studying. Structure helps you feel confident.', icon: 'edit' },
    { method: 'Quality Over Speed', description: 'Study fewer topics more deeply rather than rushing. Depth is your advantage.', icon: 'brain' },
    { method: 'Peer Review', description: 'Exchange notes with a classmate for quality checking. You catch details others miss.', icon: 'users' },
  ],
}

// ============================================================================
// COMMUNICATION PLAYBOOK
// ============================================================================

const communicationPlaybook: Record<string, { approach: string; doThis: string[]; avoidThis: string[] }> = {
  DOMINANCE: {
    approach: 'Be direct, brief, and focus on results. Get to the point quickly.',
    doThis: ['Lead with the bottom line', 'Offer options, not just problems', 'Be concise — bullet points over paragraphs'],
    avoidThis: ['Rambling or excessive small talk', 'Being vague about outcomes', 'Challenging them publicly'],
  },
  INFLUENCE: {
    approach: 'Be enthusiastic, personal, and collaborative. Show you are excited about the idea.',
    doThis: ['Start with a friendly greeting', 'Share stories and examples', 'Let them brainstorm verbally'],
    avoidThis: ['Being overly formal or cold', 'Drowning them in data', 'Cutting off their ideas'],
  },
  STEADINESS: {
    approach: 'Be patient, warm, and give them time to process. Avoid sudden changes.',
    doThis: ['Explain changes step by step', 'Give advance notice of new plans', 'Show genuine care for their concerns'],
    avoidThis: ['Rushing decisions', 'Making abrupt changes without context', 'Being aggressive or confrontational'],
  },
  COMPLIANCE: {
    approach: 'Be precise, well-prepared, and data-driven. Come with facts.',
    doThis: ['Provide written details in advance', 'Use data and evidence', 'Give them time to analyze'],
    avoidThis: ['Being disorganized or vague', 'Relying only on feelings or opinions', 'Pressuring for instant decisions'],
  },
}

// ============================================================================
// WEEKLY REFLECTION PROMPTS
// ============================================================================

const reflectionPrompts: Record<string, string[]> = {
  'Stress management': [
    'What was your biggest stressor this week? How did you handle it?',
    'When did you feel most calm this week? What contributed to that feeling?',
    'What is one boundary you could set next week to protect your energy?',
    'Describe a moment when you chose a healthy coping strategy over a harmful one.',
  ],
  'Public speaking': [
    'Did you speak up in any group setting this week? How did it feel?',
    'What is one message you wish you had delivered more confidently?',
    'Who is a speaker you admire? What specifically makes them effective?',
    'What is your biggest fear about public speaking? Is it based on evidence?',
  ],
  'Leadership': [
    'Did you take initiative on anything this week? What happened?',
    'Who did you help or empower this week? How did it feel?',
    'What decision did you avoid making? What held you back?',
    'Describe a leader you respect. What specific behavior do you want to adopt?',
  ],
  'Communication': [
    'Was there a misunderstanding this week? What could you have said differently?',
    'When were you most clearly understood? What made that communication effective?',
    'Did you practice active listening? What did you learn?',
    'What is one communication habit you want to build next week?',
  ],
  'Teamwork': [
    'How did you contribute to a group effort this week?',
    'Was there a moment you could have helped a teammate but did not? What stopped you?',
    'Did you receive or give feedback this week? How did it go?',
    'What makes you a good teammate? What could make you better?',
  ],
  'Time management': [
    'What was your biggest time waster this week? How can you reduce it?',
    'Did you accomplish your top priorities? If not, what got in the way?',
    'When were you most productive? What conditions helped?',
    'What is one time management technique you want to try next week?',
  ],
  'Adaptability': [
    'How did you handle an unexpected change this week?',
    'What did you learn from a situation that did not go as planned?',
    'When did you step outside your comfort zone? What happened?',
    'What is one thing you have been resisting changing? Why?',
  ],
  'Emotional intelligence': [
    'What emotions came up strongly this week? Did you name them in the moment?',
    'How did you respond to someone else\'s emotions? Were you empathetic?',
    'When did you pause before reacting? What was the result?',
    'What triggered a strong reaction? Looking back, how would you handle it differently?',
  ],
}

const defaultReflectionPrompts = [
  'Describe a moment this week where this skill was relevant. What happened?',
  'What is one thing you did well in this area? What could you improve?',
  'Who do you know that excels at this? What can you learn from them?',
  'Set one intention for next week related to this skill.',
]

// ============================================================================
// NETWORKING TIPS
// ============================================================================

const networkingTips: Record<string, { approach: string; iceBreakers: string[]; followUp: string; tips: string[] }> = {
  DOMINANCE: {
    approach: 'You are naturally direct — use it. Focus on high-value connections and lead with your achievements.',
    iceBreakers: ['What is the biggest challenge in your field right now?', 'I am working on [X] — who should I talk to about this?', 'What is the one thing you would change about [industry]?'],
    followUp: 'Send a concise follow-up within 24 hours with a specific action item or resource.',
    tips: ['Focus on quality over quantity — 3 deep conversations beat 20 handshakes', 'Ask for advice, not favors — people respond better to "What would you recommend?"', 'Follow up with value — share an article or introduction, not just "nice meeting you"'],
  },
  INFLUENCE: {
    approach: 'You are a natural connector. Your warmth makes people want to talk to you — leverage that.',
    iceBreakers: ['What is the most exciting project you are working on?', 'I loved your talk/post about [X] — what inspired that?', 'Who else at this event should I meet? I would love your recommendations!'],
    followUp: 'Connect them with someone else in your network — be the bridge.',
    tips: ['Your strength is making people feel valued — use that deliberately', 'Keep a mental note of what people care about for future conversations', 'Do not just collect contacts — nurture relationships with regular check-ins'],
  },
  STEADINESS: {
    approach: 'You build trust naturally. Focus on fewer, deeper connections rather than working the room.',
    iceBreakers: ['How did you get started in your field?', 'What do you enjoy most about your work?', 'I am interested in learning more about [X] — would you have time for a coffee?'],
    followUp: 'Send a warm, personal message referencing something specific from your conversation.',
    tips: ['It is okay to attend events with a friend — you do not have to network solo', 'Prepare 2-3 questions in advance so you feel confident starting conversations', 'Your follow-up game is your superpower — people remember who stays in touch'],
  },
  COMPLIANCE: {
    approach: 'Prepare thoroughly. Research attendees in advance and have specific questions ready.',
    iceBreakers: ['I read your paper/article on [X] — I had a question about [specific point]', 'What data or trends are you seeing in [field]?', 'I am researching [topic] — have you come across any good resources?'],
    followUp: 'Share a relevant resource, paper, or data point that connects to your conversation.',
    tips: ['Use events with structured formats (panels, workshops) where you can ask prepared questions', 'Quality of conversation matters more than quantity — 1-2 great connections per event is a win', 'LinkedIn is your friend — connect online first, then meet in person'],
  },
}

// ============================================================================
// SMART GOAL TEMPLATES
// ============================================================================

const smartGoalTemplates: Record<string, { goal: string; specific: string; measurable: string; achievable: string; relevant: string; timebound: string }> = {
  'Stress management': {
    goal: 'Build a daily stress management habit',
    specific: 'Practice a 5-minute breathing exercise before my first class/meeting each day',
    measurable: 'Track completion in a habit tracker — aim for 5 out of 7 days per week',
    achievable: 'Start with just 2 minutes and increase to 5 minutes by week 2',
    relevant: 'Reducing stress will improve my focus, sleep quality, and academic performance',
    timebound: 'Build this habit over 4 weeks, then evaluate and adjust',
  },
  'Public speaking': {
    goal: 'Become more confident speaking in front of groups',
    specific: 'Volunteer to present or speak up in at least one class/meeting per week',
    measurable: 'Log each speaking opportunity and rate my confidence 1-10 afterward',
    achievable: 'Start with small comments in class, then work up to 5-minute presentations',
    relevant: 'Strong communication skills are essential for my career and help me share my ideas',
    timebound: 'Track progress for 6 weeks, then give a 10-minute presentation',
  },
  'Leadership': {
    goal: 'Develop leadership skills through practice',
    specific: 'Take the lead on one project, meeting, or initiative per month',
    measurable: 'After each leadership experience, collect feedback from 2 team members',
    achievable: 'Start by leading a study group or small team task, then take on bigger roles',
    relevant: 'Leadership experience will strengthen my resume and prepare me for management roles',
    timebound: 'Complete 3 leadership experiences in the next 3 months',
  },
  'Communication': {
    goal: 'Improve written and verbal communication clarity',
    specific: 'Before sending important messages, re-read from the receiver\'s perspective and edit for clarity',
    measurable: 'Track how many messages I revise before sending — aim for 80% of important messages',
    achievable: 'Focus on emails and Slack messages first, then expand to presentations',
    relevant: 'Clear communication reduces misunderstandings and builds professional credibility',
    timebound: 'Practice this daily for 4 weeks, then ask a colleague for feedback',
  },
  'Teamwork': {
    goal: 'Be a more effective team contributor',
    specific: 'Ask for feedback from teammates after every group project and implement one suggestion',
    measurable: 'Collect feedback from at least 2 people per project, document improvements',
    achievable: 'Start by asking one trusted teammate, then expand to the full team',
    relevant: 'Strong teamwork skills are valued in every career path and make projects more enjoyable',
    timebound: 'Apply this to the next 3 group projects over the coming semester',
  },
  'Time management': {
    goal: 'Master daily prioritization and focus',
    specific: 'Each morning, write down 3 top priorities and use 25-minute Pomodoro sessions for deep work',
    measurable: 'Track number of Pomodoro sessions completed and priority items achieved each day',
    achievable: 'Start with 2 Pomodoro sessions per day and increase to 4 by week 3',
    relevant: 'Better time management means less stress, higher quality work, and more free time',
    timebound: 'Follow this system for 30 days, then review and optimize',
  },
  'Conflict resolution': {
    goal: 'Handle disagreements more constructively',
    specific: 'Practice the "I feel... when... because..." framework in the next disagreement',
    measurable: 'Journal about each conflict situation: what happened, how I responded, what I would change',
    achievable: 'Start by practicing in low-stakes situations like deciding on lunch plans',
    relevant: 'Conflict resolution skills improve relationships and create better team outcomes',
    timebound: 'Practice deliberately for 6 weeks, reviewing journal entries weekly',
  },
  'Adaptability': {
    goal: 'Become more comfortable with change and uncertainty',
    specific: 'Once per week, deliberately try something new or change a routine',
    measurable: 'Log each new experience and reflect on what I learned and how I felt',
    achievable: 'Start small: take a different route, try a new tool, attend an unfamiliar event',
    relevant: 'Adaptability is the #1 skill employers look for in a rapidly changing world',
    timebound: 'Complete 8 "change experiments" over the next 8 weeks',
  },
}

// ============================================================================
// DECISION-MAKING STYLE
// ============================================================================

const decisionStyles: Record<string, { style: string; description: string; strengths: string[]; blindSpots: string[]; tip: string }> = {
  DOMINANCE: {
    style: 'Decisive Commander',
    description: 'You make decisions quickly and confidently. You trust your gut, weigh options fast, and commit without looking back.',
    strengths: ['Fast under pressure', 'Willing to take bold risks', 'Cuts through analysis paralysis'],
    blindSpots: ['May skip important details', 'Can overlook team input', 'May regret impulsive choices'],
    tip: 'Before big decisions, take 10 minutes to write down 3 risks. If you can live with the worst case, go for it.',
  },
  INFLUENCE: {
    style: 'Intuitive Collaborator',
    description: 'You decide based on feel and social input. You talk through options, gauge reactions, and go with what excites you and others.',
    strengths: ['Great at building consensus', 'Sees creative possibilities others miss', 'Energizes the team around the choice'],
    blindSpots: ['May avoid unpopular decisions', 'Can be swayed by enthusiasm over data', 'May change direction too often'],
    tip: 'After brainstorming, sleep on it. Check if your excitement holds up the next morning before committing.',
  },
  STEADINESS: {
    style: 'Thoughtful Evaluator',
    description: 'You take your time, weigh options carefully, and prefer decisions that preserve stability and team harmony.',
    strengths: ['Considers long-term consequences', 'Seeks input from all stakeholders', 'Makes reliable, consistent choices'],
    blindSpots: ['Can be too slow in fast-moving situations', 'May avoid necessary tough calls', 'Can get stuck in deliberation'],
    tip: 'Set a decision deadline for yourself. "I will decide by Friday" prevents overthinking while giving you space to think.',
  },
  COMPLIANCE: {
    style: 'Analytical Optimizer',
    description: 'You gather data, analyze options systematically, and choose the most logical path. You want to be right.',
    strengths: ['Thorough risk assessment', 'Data-driven and objective', 'Catches flaws others miss'],
    blindSpots: ['Can over-analyze and miss the window', 'May struggle when data is incomplete', 'Can seem detached from people impact'],
    tip: 'Use the 70% rule: if you have 70% of the information, decide. Waiting for 100% means deciding too late.',
  },
  DI: {
    style: 'Bold Visionary',
    description: 'You combine speed with social intelligence. You decide fast, rally support, and course-correct as you go.',
    strengths: ['Moves quickly with team buy-in', 'Balances ambition with persuasion', 'Comfortable with pivoting'],
    blindSpots: ['May oversell decisions to get support', 'Can move before the team is ready', 'May lack follow-through on details'],
    tip: 'After deciding, assign one person to track execution. Your strength is the vision, not the spreadsheet.',
  },
  DC: {
    style: 'Strategic Executor',
    description: 'You combine speed with precision. You analyze just enough, then act decisively and hold course.',
    strengths: ['Efficient decision-making', 'Balances data with action', 'Strong follow-through'],
    blindSpots: ['May seem cold or dismissive of feelings', 'Can be inflexible once committed', 'May undervalue team morale'],
    tip: 'After making your decision, share the "why" with your team. People support what they understand.',
  },
  IS: {
    style: 'Harmonious Consensus Builder',
    description: 'You decide collaboratively, ensuring everyone is heard. You prefer choices that maintain relationships and stability.',
    strengths: ['Excellent stakeholder management', 'Builds lasting buy-in', 'Considers people impact deeply'],
    blindSpots: ['Can be too slow for urgent situations', 'May compromise quality for harmony', 'Can avoid necessary conflict'],
    tip: 'Practice saying "I\'ve heard everyone, and here\'s what I\'ve decided." You can be kind AND decisive.',
  },
  IC: {
    style: 'Empathetic Analyst',
    description: 'You blend emotional intelligence with careful analysis. You consider both data and human impact.',
    strengths: ['Holistic decision-making', 'Catches both logical and emotional risks', 'Builds trust through thoroughness'],
    blindSpots: ['Can overthink simple decisions', 'May struggle to prioritize head vs heart', 'Can seem indecisive'],
    tip: 'For routine decisions, use a simple framework: "Does this move us forward? Yes/No." Save deep analysis for big calls.',
  },
  DS: {
    style: 'Patient Driver',
    description: 'You combine ambition with patience. You push for results but give decisions time to mature.',
    strengths: ['Balances urgency with wisdom', 'Strong execution with team support', 'Reliable and determined'],
    blindSpots: ['May hold conflicting impulses (fast vs careful)', 'Can be hard to read', 'May delay when action is needed'],
    tip: 'Trust your first instinct more often. Your patience already filters out bad ideas — your gut is well-calibrated.',
  },
  SC: {
    style: 'Careful Custodian',
    description: 'You make decisions methodically and protectively. You want to get it right and keep things stable.',
    strengths: ['Minimizes risk effectively', 'Very thorough preparation', 'Consistent and dependable choices'],
    blindSpots: ['Can miss opportunities by waiting too long', 'May resist necessary changes', 'Can be overly cautious'],
    tip: 'Ask yourself: "What is the cost of NOT deciding?" Sometimes inaction is the riskiest choice.',
  },
}

// ============================================================================
// WORK ENVIRONMENT FIT
// ============================================================================

const workEnvironmentFit: Record<string, { ideal: string[]; tolerable: string[]; avoid: string[] }> = {
  DOMINANCE: {
    ideal: ['Fast-paced, results-oriented culture', 'Autonomy to make decisions', 'Clear goals with freedom on how to achieve them', 'Competitive environment that rewards performance'],
    tolerable: ['Structured environments if they can lead', 'Remote work with clear KPIs'],
    avoid: ['Micromanagement', 'Slow bureaucratic processes', 'Roles with no decision-making authority'],
  },
  INFLUENCE: {
    ideal: ['Collaborative, open office culture', 'Team brainstorming and social interaction', 'Creative freedom and variety', 'Recognition and public appreciation'],
    tolerable: ['Structured roles if they involve people', 'Hybrid work with team days'],
    avoid: ['Isolated solo work for long periods', 'Highly repetitive tasks', 'Environments that suppress creativity'],
  },
  STEADINESS: {
    ideal: ['Stable, predictable environment', 'Supportive team with clear roles', 'Consistent routines and processes', 'Work-life balance prioritized'],
    tolerable: ['Some change if well-communicated', 'Open offices if they have quiet spaces'],
    avoid: ['Chaotic, constantly changing priorities', 'High-pressure competitive cultures', 'Frequent restructuring or uncertainty'],
  },
  COMPLIANCE: {
    ideal: ['Structured with clear expectations', 'Quiet, focused work environment', 'Access to data, tools, and resources', 'Quality valued over speed'],
    tolerable: ['Team settings if discussions are structured', 'Fast pace if standards are maintained'],
    avoid: ['Ambiguous roles and goals', 'Emotional or unpredictable cultures', 'Environments that sacrifice quality for speed'],
  },
  DI: {
    ideal: ['Dynamic startup-like culture', 'Leading teams on exciting projects', 'Mix of strategy and social interaction'],
    tolerable: ['Corporate roles with influence', 'Remote with frequent video calls'],
    avoid: ['Rigid hierarchies with no voice', 'Pure solo research roles'],
  },
  DC: {
    ideal: ['Strategy-focused organizations', 'Data-driven with clear authority', 'High-performance teams'],
    tolerable: ['Large corporations with clear ladders', 'Remote with measurable outputs'],
    avoid: ['Consensus-heavy slow cultures', 'Roles without tangible impact metrics'],
  },
  IS: {
    ideal: ['Warm, people-first cultures', 'Stable teams with strong bonds', 'Service-oriented organizations'],
    tolerable: ['Changing environments if team stays consistent', 'Larger orgs with good culture'],
    avoid: ['Cold, transactional workplaces', 'High-turnover environments'],
  },
  IC: {
    ideal: ['Research-oriented with collaborative teams', 'Innovation labs or design studios', 'Places that value both empathy and precision'],
    tolerable: ['Corporate R&D departments', 'Academic environments'],
    avoid: ['Pure sales cultures', 'Environments that dismiss thoughtfulness as slowness'],
  },
  DS: {
    ideal: ['Growth-stage companies', 'Roles bridging strategy and operations', 'Environments valuing both results and people'],
    tolerable: ['Large orgs with clear goals', 'Mixed remote-office setups'],
    avoid: ['All-talk-no-action cultures', 'Highly political environments'],
  },
  SC: {
    ideal: ['Quality-focused organizations', 'Established companies with good processes', 'Roles requiring deep expertise'],
    tolerable: ['Startups if processes are respected', 'Remote with async communication'],
    avoid: ['Move-fast-break-things cultures', 'Constant pivoting without reason'],
  },
}

// ============================================================================
// CONFLICT STYLE PROFILE
// ============================================================================

const conflictStyles: Record<string, { style: string; description: string; naturalResponse: string; strengths: string[]; growthAreas: string[]; tip: string }> = {
  DOMINANCE: {
    style: 'Competing',
    description: 'You face conflict head-on. You advocate strongly for your position and push for the outcome you believe is right.',
    naturalResponse: 'You confront the issue directly and push for resolution — sometimes forcefully.',
    strengths: ['Not afraid of tough conversations', 'Gets issues resolved quickly', 'Stands up for what matters'],
    growthAreas: ['Can damage relationships', 'May "win" the argument but lose the team', 'Others may stop sharing concerns'],
    tip: 'Before pushing your view, ask: "What am I missing?" One question transforms competing into collaborating.',
  },
  INFLUENCE: {
    style: 'Compromising',
    description: 'You seek middle ground that keeps everyone reasonably happy. You value harmony but will negotiate for a fair deal.',
    naturalResponse: 'You try to find a solution that gives everyone something, often using humor to defuse tension.',
    strengths: ['Keeps relationships intact', 'Finds creative middle ground', 'Maintains team morale'],
    growthAreas: ['May settle for "good enough" when "best" is needed', 'Can avoid the real issue', 'Compromises may not fully solve problems'],
    tip: 'Sometimes the best outcome is not 50/50. Ask: "What does the best possible solution look like?" before splitting the difference.',
  },
  STEADINESS: {
    style: 'Accommodating',
    description: 'You prioritize relationships over winning. You often yield to maintain harmony and avoid disruption.',
    naturalResponse: 'You tend to give in to avoid conflict, focusing on preserving the relationship.',
    strengths: ['Protects relationships', 'Creates psychological safety', 'Team members feel heard and valued'],
    growthAreas: ['May suppress own needs', 'Others may take advantage', 'Resentment can build silently'],
    tip: 'Practice saying: "I want to find a solution that works for both of us." Your needs matter as much as theirs.',
  },
  COMPLIANCE: {
    style: 'Collaborating',
    description: 'You approach conflict analytically, seeking the objectively best solution. You want to solve the root cause, not just the symptom.',
    naturalResponse: 'You analyze the situation, gather facts, and propose a logical solution.',
    strengths: ['Finds root causes', 'Solutions are thorough and lasting', 'Removes emotion from decisions'],
    growthAreas: ['Can seem cold or dismissive of feelings', 'May over-analyze simple disagreements', 'Others may feel unheard emotionally'],
    tip: 'Start with "I understand this is frustrating" before jumping to analysis. Acknowledge feelings first, solve second.',
  },
  DI: {
    style: 'Assertive Negotiator',
    description: 'You push for your position but use charm and persuasion rather than force.',
    naturalResponse: 'You advocate energetically, using stories and enthusiasm to win people over.',
    strengths: ['Persuasive and engaging', 'Keeps energy positive during disagreements', 'Good at reframing issues'],
    growthAreas: ['May oversimplify complex issues', 'Can be seen as manipulative', 'May avoid data that contradicts your view'],
    tip: 'Back up your enthusiasm with specific data. "I feel strongly about this AND here is the evidence" is unbeatable.',
  },
  DC: {
    style: 'Strategic Competitor',
    description: 'You approach conflict with both logic and determination. You build your case and push firmly.',
    naturalResponse: 'You present a well-researched argument and expect it to be accepted based on merit.',
    strengths: ['Strong, evidence-based arguments', 'Does not back down from important issues', 'Respected for thoroughness'],
    growthAreas: ['Can seem intimidating', 'May dismiss emotional arguments', 'Can create win-lose dynamics'],
    tip: 'Show that you have considered the other side: "I see your point about X, and here is how we can address it while also..."',
  },
  IS: {
    style: 'Diplomatic Peacemaker',
    description: 'You seek solutions that preserve relationships above all. You listen deeply and mediate naturally.',
    naturalResponse: 'You listen to all sides, empathize, and look for common ground.',
    strengths: ['Excellent mediator', 'Creates safe spaces for honest dialogue', 'People trust your intentions'],
    growthAreas: ['May avoid necessary confrontation', 'Can take on too much emotional labor', 'May sacrifice own needs for peace'],
    tip: 'Disagreement is not the same as conflict. Practice stating your view clearly: "I care about this team, AND I disagree because..."',
  },
  IC: {
    style: 'Thoughtful Mediator',
    description: 'You combine empathy with analysis, seeking solutions that are both fair and logical.',
    naturalResponse: 'You listen carefully, then propose a well-reasoned solution that addresses everyone\'s concerns.',
    strengths: ['Balances logic and emotion', 'Thorough problem-solving', 'Builds lasting resolutions'],
    growthAreas: ['Can take too long to resolve', 'May over-complicate simple disagreements', 'Can seem indecisive under pressure'],
    tip: 'Set a time limit for deliberation. "Let me think about this until tomorrow and come back with a proposal."',
  },
  DS: {
    style: 'Firm Diplomat',
    description: 'You push for results while being patient and respectful. You are firm but not aggressive.',
    naturalResponse: 'You state your position clearly, listen to responses, and look for practical compromises.',
    strengths: ['Balanced assertiveness', 'Persistent without being pushy', 'Good at sustained negotiation'],
    growthAreas: ['May send mixed signals', 'Can be hard to read in high-stakes moments', 'May compromise when they should hold firm'],
    tip: 'Be clear about your non-negotiables upfront: "I am flexible on X and Y, but Z is essential for me."',
  },
  SC: {
    style: 'Cautious Consensus Seeker',
    description: 'You prefer to avoid conflict, but when faced with it, you use careful analysis and patience to find the best path forward.',
    naturalResponse: 'You withdraw to think, research the issue, then return with a measured, fair proposal.',
    strengths: ['Well-thought-out resolutions', 'Rarely escalates conflict', 'Fair and balanced approach'],
    growthAreas: ['May avoid conflict too long', 'Can seem passive or disengaged', 'Others may not know where you stand'],
    tip: 'Speak up earlier rather than later. A small comment today prevents a big issue next month.',
  },
}

// ============================================================================
// ENERGY MANAGEMENT
// ============================================================================

const energyProfiles: Record<string, { energizers: string[]; drainers: string[]; peakTime: string; recoveryTip: string }> = {
  DOMINANCE: {
    energizers: ['Tackling big challenges', 'Making important decisions', 'Seeing measurable progress', 'Competing and winning'],
    drainers: ['Waiting for others to act', 'Repetitive administrative tasks', 'Being micromanaged', 'Long meetings with no decisions'],
    peakTime: 'Early morning — you are sharpest when you can attack your biggest challenge first thing.',
    recoveryTip: 'When drained, do something physical. A workout, walk, or even cleaning your desk resets your energy.',
  },
  INFLUENCE: {
    energizers: ['Brainstorming with others', 'Public recognition and praise', 'Creative projects', 'Social events and networking'],
    drainers: ['Working alone for long periods', 'Detailed data entry or analysis', 'Being ignored or unappreciated', 'Rigid, repetitive routines'],
    peakTime: 'Late morning — you hit your stride after some social interaction and coffee.',
    recoveryTip: 'When drained, call a friend or take a social break. Five minutes of connection refuels you better than coffee.',
  },
  STEADINESS: {
    energizers: ['Helping others succeed', 'Working in a trusted team', 'Completing tasks thoroughly', 'Peaceful, predictable environments'],
    drainers: ['Sudden changes or surprises', 'Interpersonal conflict', 'Being rushed or pressured', 'Chaotic, noisy environments'],
    peakTime: 'Mid-morning — you do your best work after settling into your routine.',
    recoveryTip: 'When drained, take a quiet break. Read, walk in nature, or listen to calm music. Solitude recharges you.',
  },
  COMPLIANCE: {
    energizers: ['Solving complex problems', 'Having time to think deeply', 'Working with quality standards', 'Learning new systems or skills'],
    drainers: ['Vague instructions or goals', 'Emotional confrontations', 'Being asked to cut corners', 'Excessive small talk'],
    peakTime: 'Early morning or late evening — you think best when the world is quiet.',
    recoveryTip: 'When drained, organize something. Clean your inbox, organize notes, or plan tomorrow. Order restores your energy.',
  },
  DI: {
    energizers: ['Leading exciting projects', 'Pitching ideas to groups', 'Fast-paced collaboration', 'Celebrating team wins'],
    drainers: ['Bureaucracy and red tape', 'Solo administrative work', 'Being held back by slow processes', 'Lack of recognition'],
    peakTime: 'Mid-morning after warming up with social interaction.',
    recoveryTip: 'Exercise or social activity — you recharge through movement and people.',
  },
  DC: {
    energizers: ['Strategic planning', 'Data-driven problem solving', 'Achieving measurable targets', 'Working with competent people'],
    drainers: ['Emotional drama', 'Incompetence in others', 'Meetings without agendas', 'Ambiguity and politics'],
    peakTime: 'Early morning — deep work before interruptions start.',
    recoveryTip: 'Solo exercise or reading. You recharge through controlled, focused activities.',
  },
  IS: {
    energizers: ['Meaningful conversations', 'Helping others', 'Stable team bonding', 'Creative collaboration'],
    drainers: ['Aggressive confrontation', 'Rushed deadlines', 'Being overlooked', 'Cold, transactional interactions'],
    peakTime: 'Late morning — you need a warm-up with your team before peak focus.',
    recoveryTip: 'Call a close friend or journal. Emotional processing recharges you.',
  },
  IC: {
    energizers: ['Research and discovery', 'Thoughtful team discussions', 'Creative problem-solving', 'Being asked for expertise'],
    drainers: ['Superficial interactions', 'Rushed decisions without data', 'Being dismissed', 'Loud, chaotic environments'],
    peakTime: 'Late morning or early afternoon — after time to settle and think.',
    recoveryTip: 'Curl up with a book or deep-dive into something that fascinates you.',
  },
  DS: {
    energizers: ['Achieving goals with the team', 'Steady progress on big projects', 'Mentoring others', 'Structured challenges'],
    drainers: ['Constant pivoting', 'Lack of follow-through from others', 'Being pushed to be someone else', 'Political games'],
    peakTime: 'Morning — consistent and reliable peak.',
    recoveryTip: 'A combination: a solo walk followed by reconnecting with a trusted person.',
  },
  SC: {
    energizers: ['Deep focused work', 'Completing quality deliverables', 'Working with reliable people', 'Mastering a skill'],
    drainers: ['Unpredictable changes', 'Being asked to improvise', 'Superficial or rushed work', 'Excessive social demands'],
    peakTime: 'Early morning or evening — quiet hours when you can focus deeply.',
    recoveryTip: 'Alone time in a structured activity: puzzles, cooking, organizing, or reading.',
  },
}

// ============================================================================
// MENTORSHIP PROFILE
// ============================================================================

const mentorshipProfiles: Record<string, { idealMentor: string; mentorTraits: string[]; asaMentee: string; menteeStrengths: string[]; menteeGrowth: string[] }> = {
  DOMINANCE: {
    idealMentor: 'A successful, no-nonsense leader who has achieved big things and can challenge you with direct feedback.',
    mentorTraits: ['Has a strong track record of results', 'Gives direct, honest feedback', 'Challenges you to think bigger', 'Respects your autonomy'],
    asaMentee: 'You are action-oriented and want practical, applicable advice. You may push back, but you respect mentors who stand their ground.',
    menteeStrengths: ['Quick to implement advice', 'Asks pointed questions', 'Seeks measurable outcomes'],
    menteeGrowth: ['Practice patience — let the mentor finish before responding', 'Be open to advice that challenges your assumptions', 'Show vulnerability — mentors help more when they see the real you'],
  },
  INFLUENCE: {
    idealMentor: 'An inspiring, well-connected leader who can open doors and help you develop your personal brand.',
    mentorTraits: ['Strong network and willing to make introductions', 'Encouraging and positive', 'Helps you channel your energy productively', 'Shares stories, not just advice'],
    asaMentee: 'You bring energy and enthusiasm to every session. You are coachable and eager, but may need help with follow-through.',
    menteeStrengths: ['Enthusiastic and engaged', 'Great at building rapport with mentors', 'Open to new ideas and perspectives'],
    menteeGrowth: ['Take notes during sessions and review them later', 'Set specific action items after each meeting', 'Follow through consistently — do not just get inspired, act on it'],
  },
  STEADINESS: {
    idealMentor: 'A patient, experienced guide who takes time to understand you and provides consistent, reliable support.',
    mentorTraits: ['Patient and a good listener', 'Consistent in scheduling and follow-up', 'Helps build confidence gradually', 'Creates a safe space for honest conversation'],
    asaMentee: 'You are loyal and consistent. You show up prepared and follow through, but may need encouragement to take bigger risks.',
    menteeStrengths: ['Reliable and consistent attendance', 'Thoughtful preparation for sessions', 'Implements advice carefully and thoroughly'],
    menteeGrowth: ['Share your ambitions — mentors cannot help with goals they do not know about', 'Ask for challenging advice, not just reassurance', 'Be willing to try things that feel uncomfortable'],
  },
  COMPLIANCE: {
    idealMentor: 'A subject matter expert who can provide deep knowledge, structured guidance, and evidence-based advice.',
    mentorTraits: ['Deep expertise in your field', 'Structured approach to mentoring', 'Provides data and resources', 'Respects your analytical nature'],
    asaMentee: 'You come prepared with research and specific questions. You value depth over breadth and apply advice systematically.',
    menteeStrengths: ['Extremely well-prepared for sessions', 'Asks specific, insightful questions', 'Documents and applies advice systematically'],
    menteeGrowth: ['Share your feelings, not just your analysis', 'Be open to advice based on experience, not just data', 'Practice implementing advice before it feels perfect'],
  },
  DI: {
    idealMentor: 'A strategic leader who balances vision with execution and can help you channel your energy.',
    mentorTraits: ['Ambitious and well-connected', 'Balances inspiration with accountability', 'Helps you prioritize', 'Can match your energy'],
    asaMentee: 'Dynamic and engaging, you bring ideas and energy. You need help with focus and follow-through.',
    menteeStrengths: ['Brings creative ideas to sessions', 'Quick to act on advice', 'Builds great mentor relationships'],
    menteeGrowth: ['Slow down and listen before pitching your ideas', 'Ask for help with accountability, not just vision', 'Follow through on the boring parts, not just the exciting ones'],
  },
  DC: {
    idealMentor: 'A strategic, data-driven executive who can help you see blind spots and develop people skills.',
    mentorTraits: ['Results-oriented and analytical', 'Can challenge your thinking with data', 'Helps develop emotional intelligence', 'Respected authority in their field'],
    asaMentee: 'You are focused and prepared, but may resist feedback that feels "soft." You want ROI from every session.',
    menteeStrengths: ['Clear about what they want from mentoring', 'Action-oriented and efficient', 'Values measurable outcomes'],
    menteeGrowth: ['Be open to "soft skill" advice — EQ is a competitive advantage', 'Show appreciation — mentors invest time because they care', 'Practice vulnerability in safe mentor conversations'],
  },
  IS: {
    idealMentor: 'A warm, experienced professional who combines empathy with gentle challenge.',
    mentorTraits: ['Approachable and empathetic', 'Gently pushes boundaries', 'Reliable and consistent', 'Helps build confidence and voice'],
    asaMentee: 'You are loyal and grateful. You build deep mentor relationships but may need encouragement to assert yourself.',
    menteeStrengths: ['Deeply appreciative', 'Consistent and reliable', 'Builds lasting mentor relationships'],
    menteeGrowth: ['Practice asking for what you need directly', 'Share your career ambitions openly', 'Do not just agree — share your real opinion with your mentor'],
  },
  IC: {
    idealMentor: 'A thoughtful expert who values both emotional and intellectual depth.',
    mentorTraits: ['Intellectually curious', 'Good listener', 'Encourages both thinking and feeling', 'Provides structured exploration'],
    asaMentee: 'You bring curiosity and depth. You want to understand the "why" behind advice.',
    menteeStrengths: ['Asks deeply thoughtful questions', 'Processes advice thoroughly', 'Integrates multiple perspectives'],
    menteeGrowth: ['Trust your instincts more — not everything needs full analysis', 'Act faster on advice instead of over-thinking it', 'Share what you are feeling, not just what you are thinking'],
  },
  DS: {
    idealMentor: 'A balanced leader who models both ambition and patience.',
    mentorTraits: ['Consistent and goal-oriented', 'Patient but pushes when needed', 'Models work-life balance', 'Provides both strategy and support'],
    asaMentee: 'Reliable and determined. You follow through but may need help accelerating.',
    menteeStrengths: ['Consistent follow-through', 'Balanced perspective', 'Open to both challenge and support'],
    menteeGrowth: ['Ask for stretch challenges more often', 'Share your bigger vision, not just next steps', 'Take more risks in mentor conversations — test bold ideas'],
  },
  SC: {
    idealMentor: 'A patient expert who values quality and provides structured, detailed guidance.',
    mentorTraits: ['Deep domain expertise', 'Patient and methodical', 'Values quality over speed', 'Provides detailed, actionable advice'],
    asaMentee: 'You are thorough and dependable. You implement advice carefully but may be too cautious.',
    menteeStrengths: ['Extremely thorough in applying advice', 'Consistent attendance and preparation', 'Deeply respects the mentoring relationship'],
    menteeGrowth: ['Practice saying "good enough" and moving on', 'Ask your mentor about calculated risks they have taken', 'Share your aspirations — you may be aiming too low'],
  },
}

// ============================================================================
// PERSONAL BRAND TEMPLATES
// ============================================================================

const personalBrandTemplates: Record<string, string> = {
  DOMINANCE: 'A results-driven professional who thrives on challenge, makes bold decisions with confidence, and consistently delivers high-impact outcomes.',
  INFLUENCE: 'An energetic communicator and natural relationship-builder who inspires teams, generates creative solutions, and brings enthusiasm to every project.',
  STEADINESS: 'A reliable, team-oriented professional who builds trust through consistency, supports colleagues generously, and delivers thoughtful, quality work.',
  COMPLIANCE: 'A detail-oriented analytical thinker who ensures accuracy, makes data-driven decisions, and brings systematic rigor to complex problems.',
  DI: 'A dynamic leader who combines bold vision with infectious energy, rallying teams around ambitious goals and driving results through persuasion and action.',
  DC: 'A strategic thinker who pairs analytical precision with decisive action, delivering data-backed results with authority and efficiency.',
  IS: 'A warm, people-first professional who builds deep trust, supports team success, and creates positive, productive environments through genuine care.',
  IC: 'A thoughtful innovator who combines empathetic communication with analytical depth, bridging the gap between data and human impact.',
  DS: 'A determined, patient achiever who balances ambitious drive with steady reliability, earning trust through consistent results and supportive leadership.',
  SC: 'A meticulous, dependable expert who combines deep analytical skills with unwavering commitment to quality, ensuring excellence in every deliverable.',
}

// ============================================================================
// COMPONENT
// ============================================================================

export default function PersonalityInsightsPage() {
  const t = useTranslations('personalityInsights')
  const [data, setData] = useState<PersonalityResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/dashboard/student/personality')
        if (res.ok) {
          setData(await res.json())
        }
      } catch (err) {
        console.error('Failed to fetch personality data:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!data?.hasAnyAssessment) {
    return <EmptyState />
  }

  const handleExportPDF = () => {
    window.print()
  }

  // Merge all development areas
  const allDevelopmentAreas: string[] = []
  if (data.bigFive?.developmentAreas) {
    for (const area of data.bigFive.developmentAreas) {
      if (allDevelopmentAreas.indexOf(area) === -1) allDevelopmentAreas.push(area)
    }
  }
  if (data.competency?.developmentAreas) {
    for (const area of data.competency.developmentAreas) {
      if (allDevelopmentAreas.indexOf(area) === -1) allDevelopmentAreas.push(area)
    }
  }

  // Merge all strengths
  const allStrengths: string[] = []
  if (data.bigFive?.strengths) {
    for (const s of data.bigFive.strengths) {
      if (allStrengths.indexOf(s) === -1) allStrengths.push(s)
    }
  }
  if (data.competency?.topStrengths) {
    for (const s of data.competency.topStrengths) {
      if (allStrengths.indexOf(s) === -1) allStrengths.push(s)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('title')}</h1>
          <p className="text-muted-foreground mt-1">{t('subtitle')}</p>
        </div>
        <Button variant="outline" onClick={handleExportPDF} className="print:hidden gap-2">
          <Download className="h-4 w-4" />
          {t('export.pdf')}
        </Button>
      </div>

      {/* Overview */}
      <OverviewSection bigFive={data.bigFive} disc={data.disc} competency={data.competency} />

      {/* Personality Narrative */}
      <NarrativeSection bigFive={data.bigFive} disc={data.disc} competency={data.competency} />

      {/* Big Five */}
      {data.bigFive && <BigFiveSection data={data.bigFive} />}

      {/* Peer Comparison */}
      {data.peerAverages && (data.peerAverages.bigFive || data.peerAverages.competency) && (
        <PeerComparisonSection
          bigFive={data.bigFive}
          competency={data.competency}
          peerAverages={data.peerAverages}
          university={data.university}
        />
      )}

      {/* DISC */}
      {data.disc && <DISCSection data={data.disc} />}

      {/* Team Compatibility */}
      {data.disc && <TeamCompatibilitySection primaryStyle={data.disc.primaryStyle} />}

      {/* Famous Personalities */}
      {data.disc && <FamousPersonalitiesSection primaryStyle={data.disc.primaryStyle} />}

      {/* Interview Prep */}
      {data.disc && <InterviewPrepSection primaryStyle={data.disc.primaryStyle} />}

      {/* Communication Playbook */}
      {data.disc && <CommunicationPlaybookSection />}

      {/* Study Style Guide */}
      {data.disc && <StudyStyleSection primaryStyle={data.disc.primaryStyle} />}

      {/* Networking Tips */}
      {data.disc && <NetworkingTipsSection primaryStyle={data.disc.primaryStyle} />}

      {/* Decision-Making Style */}
      {data.disc && <DecisionStyleSection primaryStyle={data.disc.primaryStyle} />}

      {/* Work Environment Fit */}
      {data.disc && <WorkEnvironmentSection primaryStyle={data.disc.primaryStyle} />}

      {/* Conflict Style */}
      {data.disc && <ConflictStyleSection primaryStyle={data.disc.primaryStyle} />}

      {/* Energy Management */}
      {data.disc && <EnergyManagementSection primaryStyle={data.disc.primaryStyle} />}

      {/* Mentorship Profile */}
      {data.disc && <MentorshipSection primaryStyle={data.disc.primaryStyle} />}

      {/* Personal Brand */}
      {data.disc && <PersonalBrandSection primaryStyle={data.disc.primaryStyle} bigFive={data.bigFive} competency={data.competency} />}

      {/* Career Fit & Growth */}
      {(data.bigFive || data.competency) && (
        <CareerSection bigFive={data.bigFive} competency={data.competency} />
      )}

      {/* Strength-Based Project Suggestions */}
      {allStrengths.length > 0 && <ProjectSuggestionsSection strengths={allStrengths} />}

      {/* Goal Setting */}
      {allDevelopmentAreas.length > 0 && <GoalSettingSection developmentAreas={allDevelopmentAreas} />}

      {/* Daily Micro-Challenges */}
      {allDevelopmentAreas.length > 0 && <MicroChallengesSection developmentAreas={allDevelopmentAreas} />}

      {/* Weekly Reflection */}
      {allDevelopmentAreas.length > 0 && <WeeklyReflectionSection developmentAreas={allDevelopmentAreas} />}

      {/* Job Matching CTA */}
      {data.bigFive && data.bigFive.careerFit.length > 0 && <JobMatchingSection careerFit={data.bigFive.careerFit} />}

      {/* Comparison Over Time */}
      {data.history && <ComparisonSection history={data.history} />}
    </div>
  )
}

// ============================================================================
// EMPTY STATE
// ============================================================================

const EmptyState = () => {
  const t = useTranslations('personalityInsights')
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Card className="max-w-md text-center">
        <CardContent className="pt-8 pb-8 space-y-4">
          <Brain className="h-12 w-12 text-muted-foreground mx-auto" />
          <h2 className="text-xl font-semibold">{t('noAssessments.title')}</h2>
          <p className="text-muted-foreground">{t('noAssessments.description')}</p>
          <Link href="/dashboard/student/certifications">
            <Button className="mt-2">
              {t('noAssessments.cta')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}

// ============================================================================
// OVERVIEW SECTION
// ============================================================================

const OverviewSection = ({
  bigFive,
  disc,
  competency,
}: {
  bigFive: BigFiveData | null
  disc: DISCData | null
  competency: CompetencyData | null
}) => {
  const t = useTranslations('personalityInsights')

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 dark:bg-primary/10">
              <Brain className="h-5 w-5 text-primary dark:text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('overview.personalityType')}</p>
              <p className="font-semibold text-lg">{bigFive?.personality || '—'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 dark:bg-primary/10">
              <Users className="h-5 w-5 text-primary dark:text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('overview.workStyle')}</p>
              <p className="font-semibold text-lg">
                {disc ? discStyleLabels[disc.primaryStyle] || disc.primaryStyle : '—'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 dark:bg-primary/10">
              <Target className="h-5 w-5 text-primary dark:text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('overview.softSkills')}</p>
              <p className="font-semibold text-lg">
                {competency ? `${Math.round(competency.overallScore)}/100` : '—'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ============================================================================
// NARRATIVE SECTION
// ============================================================================

const NarrativeSection = ({
  bigFive,
  disc,
  competency,
}: {
  bigFive: BigFiveData | null
  disc: DISCData | null
  competency: CompetencyData | null
}) => {
  const t = useTranslations('personalityInsights')

  const narrative = useMemo(() => {
    const parts: string[] = []

    if (bigFive?.personality) {
      parts.push(t('narrative.personalityIntro', { type: bigFive.personality }))
    }

    if (bigFive) {
      const highest = [
        { name: 'openness', score: bigFive.openness },
        { name: 'conscientiousness', score: bigFive.conscientiousness },
        { name: 'extraversion', score: bigFive.extraversion },
        { name: 'agreeableness', score: bigFive.agreeableness },
      ].sort((a, b) => b.score - a.score)

      if (highest[0].score > 65) {
        parts.push(t('narrative.highTrait', { trait: highest[0].name }))
      }
    }

    if (disc) {
      const styleName = discStyleLabels[disc.primaryStyle] || disc.primaryStyle
      parts.push(t('narrative.discStyle', { style: styleName }))
    }

    if (competency) {
      if (competency.overallScore >= 70) {
        parts.push(t('narrative.strongCompetency'))
      } else if (competency.overallScore >= 50) {
        parts.push(t('narrative.growingCompetency'))
      }
    }

    if (bigFive && bigFive.strengths.length > 0) {
      const topTwo = bigFive.strengths.slice(0, 2).join(' and ')
      parts.push(t('narrative.strengthHighlight', { strengths: topTwo }))
    }

    if (bigFive && bigFive.careerFit.length > 0) {
      const topCareers = bigFive.careerFit.slice(0, 2).join(' and ')
      parts.push(t('narrative.careerHint', { careers: topCareers }))
    }

    return parts.join(' ')
  }, [bigFive, disc, competency, t])

  if (!narrative) return null

  return (
    <Card className="bg-primary/5 dark:bg-primary/5 border-primary/20 dark:border-primary/20">
      <CardContent className="pt-6 pb-6">
        <div className="flex gap-3">
          <Quote className="h-6 w-6 text-primary shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-sm mb-2">{t('narrative.title')}</h3>
            <p className="text-sm leading-relaxed">{narrative}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// BIG FIVE SECTION
// ============================================================================

const BigFiveSection = ({ data }: { data: BigFiveData }) => {
  const t = useTranslations('personalityInsights')

  const radarData = [
    { trait: 'Openness', score: data.openness, fullMark: 100 },
    { trait: 'Conscientiousness', score: data.conscientiousness, fullMark: 100 },
    { trait: 'Extraversion', score: data.extraversion, fullMark: 100 },
    { trait: 'Agreeableness', score: data.agreeableness, fullMark: 100 },
    { trait: 'Stability', score: 100 - data.neuroticism, fullMark: 100 },
  ]

  const traits = [
    { name: 'Openness', score: data.openness, percentile: data.opennessPercentile },
    { name: 'Conscientiousness', score: data.conscientiousness, percentile: data.conscientiousnessPercentile },
    { name: 'Extraversion', score: data.extraversion, percentile: data.extraversionPercentile },
    { name: 'Agreeableness', score: data.agreeableness, percentile: data.agreeablenessPercentile },
    { name: 'Emotional Stability', score: 100 - data.neuroticism, percentile: 100 - data.neuroticismPercentile },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          {t('bigFive.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="trait" tick={{ fontSize: 12 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Radar name="Score" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-3">
          {traits.map((trait) => (
            <div key={trait.name} className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{trait.name}</span>
                <Badge variant="secondary" className="text-xs">
                  {t('bigFive.percentile', { value: 100 - trait.percentile })}
                </Badge>
              </div>
              <Progress value={trait.score} className="h-2" />
            </div>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {data.strengths.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                {t('bigFive.strengths')}
              </h3>
              <ul className="space-y-1">
                {data.strengths.map((s) => (
                  <li key={s} className="text-sm text-muted-foreground flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-primary shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {data.developmentAreas.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <Target className="h-4 w-4 text-amber-500" />
                {t('bigFive.development')}
              </h3>
              <ul className="space-y-1">
                {data.developmentAreas.map((d) => (
                  <li key={d} className="text-sm text-muted-foreground flex items-center gap-2">
                    <Target className="h-3 w-3 text-amber-500 shrink-0" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// PEER COMPARISON SECTION
// ============================================================================

const PeerComparisonSection = ({
  bigFive,
  competency,
  peerAverages,
  university,
}: {
  bigFive: BigFiveData | null
  competency: CompetencyData | null
  peerAverages: PeerAverages
  university: string | null
}) => {
  const t = useTranslations('personalityInsights')

  const bigFiveComparison = bigFive && peerAverages.bigFive
    ? [
        { trait: 'Openness', you: Math.round(bigFive.openness), peers: peerAverages.bigFive.openness },
        { trait: 'Conscientiousness', you: Math.round(bigFive.conscientiousness), peers: peerAverages.bigFive.conscientiousness },
        { trait: 'Extraversion', you: Math.round(bigFive.extraversion), peers: peerAverages.bigFive.extraversion },
        { trait: 'Agreeableness', you: Math.round(bigFive.agreeableness), peers: peerAverages.bigFive.agreeableness },
        { trait: 'Stability', you: Math.round(100 - bigFive.neuroticism), peers: Math.round(100 - peerAverages.bigFive.neuroticism) },
      ]
    : null

  const compComparison = competency && peerAverages.competency
    ? [
        { skill: 'Communication', you: Math.round(competency.communication), peers: peerAverages.competency.communication },
        { skill: 'Teamwork', you: Math.round(competency.teamwork), peers: peerAverages.competency.teamwork },
        { skill: 'Leadership', you: Math.round(competency.leadership), peers: peerAverages.competency.leadership },
        { skill: 'Problem Solving', you: Math.round(competency.problemSolving), peers: peerAverages.competency.problemSolving },
        { skill: 'Adaptability', you: Math.round(competency.adaptability), peers: peerAverages.competency.adaptability },
        { skill: 'EQ', you: Math.round(competency.emotionalIntelligence), peers: peerAverages.competency.emotionalIntelligence },
        { skill: 'Time Mgmt', you: Math.round(competency.timeManagement), peers: peerAverages.competency.timeManagement },
        { skill: 'Conflict Res.', you: Math.round(competency.conflictResolution), peers: peerAverages.competency.conflictResolution },
      ]
    : null

  const peerCount = peerAverages.bigFive?.count || peerAverages.competency?.count || 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          {t('peerComparison.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-sm text-muted-foreground">
          {t('peerComparison.subtitle', { university: university || 'your university', count: peerCount })}
        </p>

        {bigFiveComparison && (
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">{t('peerComparison.personalityTraits')}</h3>
            <div className="space-y-2">
              {bigFiveComparison.map((item) => (
                <div key={item.trait} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium">{item.trait}</span>
                    <span className="text-muted-foreground">
                      {t('peerComparison.youVsPeers', { you: item.you, peers: item.peers })}
                    </span>
                  </div>
                  <div className="relative h-3 rounded-full bg-muted overflow-hidden">
                    <div className="absolute inset-y-0 left-0 bg-primary rounded-full" style={{ width: `${item.you}%` }} />
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-amber-500"
                      style={{ left: `${item.peers}%` }}
                      title={`Peer avg: ${item.peers}`}
                    />
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                <span className="flex items-center gap-1"><span className="w-3 h-2 bg-primary rounded" />{t('peerComparison.you')}</span>
                <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-amber-500" />{t('peerComparison.peerAvg')}</span>
              </div>
            </div>
          </div>
        )}

        {compComparison && (
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">{t('peerComparison.competencies')}</h3>
            <div className="space-y-2">
              {compComparison.map((item) => (
                <div key={item.skill} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium">{item.skill}</span>
                    <span className={item.you >= item.peers ? 'text-primary' : 'text-amber-600'}>
                      {item.you >= item.peers ? '+' : ''}{item.you - item.peers} {t('peerComparison.vsPeers')}
                    </span>
                  </div>
                  <div className="relative h-3 rounded-full bg-muted overflow-hidden">
                    <div className="absolute inset-y-0 left-0 bg-primary rounded-full" style={{ width: `${item.you}%` }} />
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-amber-500"
                      style={{ left: `${item.peers}%` }}
                      title={`Peer avg: ${item.peers}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// ============================================================================
// DISC SECTION
// ============================================================================

const DISCSection = ({ data }: { data: DISCData }) => {
  const t = useTranslations('personalityInsights')

  const barData = [
    { name: 'D', score: data.dominance, label: 'Dominance' },
    { name: 'I', score: data.influence, label: 'Influence' },
    { name: 'S', score: data.steadiness, label: 'Steadiness' },
    { name: 'C', score: data.compliance, label: 'Compliance' },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          {t('disc.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge className="bg-primary/10 text-primary dark:bg-primary/10 dark:text-primary">
            {discStyleLabels[data.primaryStyle] || data.primaryStyle}
          </Badge>
          {data.secondaryStyle && (
            <Badge variant="outline">
              {discStyleLabels[data.secondaryStyle] || data.secondaryStyle}
            </Badge>
          )}
        </div>

        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip
                formatter={(value: number, _name: string, props: any) => [
                  `${value}`,
                  props.payload.label,
                ]}
              />
              <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                {barData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={discBarColors[index]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {data.workStyle && (
            <Card className="bg-muted/50">
              <CardContent className="pt-4 pb-4">
                <h4 className="font-semibold text-sm flex items-center gap-2 mb-2">
                  <Briefcase className="h-4 w-4 text-primary" />
                  {t('disc.howYouWork')}
                </h4>
                <p className="text-sm text-muted-foreground">{data.workStyle}</p>
              </CardContent>
            </Card>
          )}

          {data.communicationStyle && (
            <Card className="bg-muted/50">
              <CardContent className="pt-4 pb-4">
                <h4 className="font-semibold text-sm flex items-center gap-2 mb-2">
                  <MessageCircle className="h-4 w-4 text-primary" />
                  {t('disc.howYouCommunicate')}
                </h4>
                <p className="text-sm text-muted-foreground">{data.communicationStyle}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {data.motivators.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                {t('disc.motivators')}
              </h4>
              <div className="flex flex-wrap gap-2">
                {data.motivators.map((m) => (
                  <Badge key={m} className="bg-primary/10 text-primary dark:bg-primary/10 dark:text-primary">
                    {m}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {data.stressors.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                {t('disc.stressors')}
              </h4>
              <div className="flex flex-wrap gap-2">
                {data.stressors.map((s) => (
                  <Badge key={s} className="bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                    {s}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {data.idealTeamRole && (
          <Card className="bg-primary/5 dark:bg-primary/5 border-primary/20 dark:border-primary/20">
            <CardContent className="pt-4 pb-4">
              <h4 className="font-semibold text-sm flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-primary" />
                {t('disc.teamRole')}
              </h4>
              <p className="text-sm">{data.idealTeamRole}</p>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  )
}

// ============================================================================
// TEAM COMPATIBILITY SECTION
// ============================================================================

const TeamCompatibilitySection = ({ primaryStyle }: { primaryStyle: string }) => {
  const t = useTranslations('personalityInsights')
  const compat = teamCompatibility[primaryStyle]
  if (!compat) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5 text-primary" />
          {t('teamCompat.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Card className="bg-primary/5 dark:bg-primary/5 border-primary/20 dark:border-primary/20">
          <CardContent className="pt-4 pb-4">
            <h4 className="font-semibold text-sm flex items-center gap-2 mb-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              {t('teamCompat.bestWith')}
            </h4>
            <div className="flex flex-wrap gap-2 mb-2">
              {compat.bestWith.map((style) => (
                <Badge key={style} className="bg-primary/10 text-primary dark:bg-primary/10 dark:text-primary">
                  {style}
                </Badge>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">{compat.tips}</p>
          </CardContent>
        </Card>

        <Card className="bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800/50">
          <CardContent className="pt-4 pb-4">
            <h4 className="font-semibold text-sm flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              {t('teamCompat.challengeWith')}
            </h4>
            <div className="flex flex-wrap gap-2 mb-2">
              {compat.challengeWith.map((style) => (
                <Badge key={style} className="bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                  {style}
                </Badge>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">{compat.challengeTip}</p>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// INTERVIEW PREP SECTION
// ============================================================================

const InterviewPrepSection = ({ primaryStyle }: { primaryStyle: string }) => {
  const t = useTranslations('personalityInsights')
  const tips = interviewTipsByStyle[primaryStyle]
  if (!tips) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mic className="h-5 w-5 text-rose-600" />
          {t('interview.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{t('interview.subtitle')}</p>

        <div className="grid gap-4 md:grid-cols-3">
          {/* Strengths in interview */}
          <Card className="bg-primary/5 dark:bg-primary/5 border-primary/20 dark:border-primary/20">
            <CardContent className="pt-4 pb-4">
              <h4 className="font-semibold text-sm flex items-center gap-2 mb-3">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                {t('interview.yourStrengths')}
              </h4>
              <ul className="space-y-2">
                {tips.strengths.map((s) => (
                  <li key={s} className="text-xs text-muted-foreground flex items-start gap-2">
                    <CheckCircle2 className="h-3 w-3 text-primary shrink-0 mt-0.5" />
                    {s}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Watch outs */}
          <Card className="bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800/50">
            <CardContent className="pt-4 pb-4">
              <h4 className="font-semibold text-sm flex items-center gap-2 mb-3">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                {t('interview.watchOuts')}
              </h4>
              <ul className="space-y-2">
                {tips.watchOuts.map((w) => (
                  <li key={w} className="text-xs text-muted-foreground flex items-start gap-2">
                    <AlertTriangle className="h-3 w-3 text-amber-500 shrink-0 mt-0.5" />
                    {w}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Action tips */}
          <Card className="bg-primary/5 dark:bg-primary/5 border-primary/20 dark:border-primary/20">
            <CardContent className="pt-4 pb-4">
              <h4 className="font-semibold text-sm flex items-center gap-2 mb-3">
                <Lightbulb className="h-4 w-4 text-primary" />
                {t('interview.prepTips')}
              </h4>
              <ul className="space-y-2">
                {tips.tips.map((tip) => (
                  <li key={tip} className="text-xs text-muted-foreground flex items-start gap-2">
                    <ArrowRight className="h-3 w-3 text-primary shrink-0 mt-0.5" />
                    {tip}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// CAREER SECTION (with learning resource links)
// ============================================================================

const CareerSection = ({
  bigFive,
  competency,
}: {
  bigFive: BigFiveData | null
  competency: CompetencyData | null
}) => {
  const t = useTranslations('personalityInsights')

  const competencyItems = competency
    ? [
        { name: 'Communication', score: competency.communication, percentile: competency.communicationPercentile },
        { name: 'Teamwork', score: competency.teamwork, percentile: competency.teamworkPercentile },
        { name: 'Leadership', score: competency.leadership, percentile: competency.leadershipPercentile },
        { name: 'Problem Solving', score: competency.problemSolving, percentile: competency.problemSolvingPercentile },
        { name: 'Adaptability', score: competency.adaptability, percentile: competency.adaptabilityPercentile },
        { name: 'Emotional Intelligence', score: competency.emotionalIntelligence, percentile: competency.emotionalIntelligencePercentile },
        { name: 'Time Management', score: competency.timeManagement, percentile: competency.timeManagementPercentile },
        { name: 'Conflict Resolution', score: competency.conflictResolution, percentile: competency.conflictResolutionPercentile },
      ]
    : []

  const allDevelopmentAreas: string[] = []
  if (bigFive?.developmentAreas) {
    for (const area of bigFive.developmentAreas) {
      if (allDevelopmentAreas.indexOf(area) === -1) allDevelopmentAreas.push(area)
    }
  }
  if (competency?.developmentAreas) {
    for (const area of competency.developmentAreas) {
      if (allDevelopmentAreas.indexOf(area) === -1) allDevelopmentAreas.push(area)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-500" />
          {t('career.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {bigFive && bigFive.careerFit.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">{t('career.fitSuggestions')}</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {bigFive.careerFit.map((career) => (
                <Card key={career} className="bg-muted/50">
                  <CardContent className="pt-4 pb-4 flex items-center gap-3">
                    <Briefcase className="h-4 w-4 text-primary shrink-0" />
                    <span className="text-sm font-medium">{career}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {competencyItems.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">{t('career.topStrengths')}</h3>
            <div className="space-y-2">
              {competencyItems
                .slice()
                .sort((a, b) => b.score - a.score)
                .map((item) => (
                  <div key={item.name} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{item.name}</span>
                      <span className="text-xs text-muted-foreground">{Math.round(item.score)}/100</span>
                    </div>
                    <Progress value={item.score} className="h-2" />
                  </div>
                ))}
            </div>
          </div>
        )}

        {allDevelopmentAreas.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-amber-500" />
              {t('career.coachingTips')}
            </h3>
            <div className="space-y-3">
              {allDevelopmentAreas.map((area) => {
                const resource = learningResources[area]
                return (
                  <Card key={area} className="bg-amber-50/50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800/50">
                    <CardContent className="pt-4 pb-4">
                      <h4 className="font-medium text-sm mb-1">{area}</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        {coachingTips[area] || defaultTip}
                      </p>
                      {resource && (
                        <Link href="/dashboard/student/courses" className="inline-flex items-center gap-1.5 text-xs font-medium text-primary dark:text-primary hover:underline">
                          <GraduationCap className="h-3 w-3" />
                          {t('career.exploreCourse', { course: resource.course })}
                        </Link>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// ============================================================================
// PROJECT SUGGESTIONS SECTION
// ============================================================================

const ProjectSuggestionsSection = ({ strengths }: { strengths: string[] }) => {
  const t = useTranslations('personalityInsights')

  const iconMap: Record<string, typeof Briefcase> = {
    briefcase: Briefcase,
    users: Users,
    brain: Brain,
    rocket: Rocket,
    mic: Mic,
    target: Target,
  }

  const suggestions = strengths
    .map((s) => {
      const suggestion = projectSuggestions[s]
      return suggestion ? { ...suggestion, strength: s } : null
    })
    .filter((s): s is NonNullable<typeof s> => s !== null)
    .slice(0, 4)

  if (suggestions.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Rocket className="h-5 w-5 text-orange-600" />
          {t('projects.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{t('projects.subtitle')}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {suggestions.map((s) => {
            const Icon = iconMap[s.icon] || Briefcase
            return (
              <Card key={s.strength} className="bg-muted/50">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30 shrink-0">
                      <Icon className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{s.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{s.description}</p>
                      <Badge variant="secondary" className="mt-2 text-xs">
                        {t('projects.basedOn', { strength: s.strength })}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
        <div className="flex justify-center pt-2 print:hidden">
          <Link href="/dashboard/student/projects">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowRight className="h-4 w-4" />
              {t('projects.viewProjects')}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// MICRO-CHALLENGES SECTION
// ============================================================================

const MicroChallengesSection = ({ developmentAreas }: { developmentAreas: string[] }) => {
  const t = useTranslations('personalityInsights')

  // Pick today's challenge based on day of year
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)

  const challenges = developmentAreas.slice(0, 3).map((area) => {
    const pool = microChallenges[area] || defaultMicroChallenges
    const index = dayOfYear % pool.length
    return { area, challenge: pool[index] }
  })

  if (challenges.length === 0) return null

  return (
    <Card className="bg-primary/5 dark:bg-primary/5 border-primary/20 dark:border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          {t('microChallenges.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{t('microChallenges.subtitle')}</p>
        <div className="space-y-3">
          {challenges.map((c) => (
            <div key={c.area} className="flex items-start gap-3 p-3 bg-white/60 dark:bg-white/5 rounded-lg">
              <div className="p-1.5 rounded-full bg-primary/10 dark:bg-emerald-900/40 shrink-0 mt-0.5">
                <Target className="h-3 w-3 text-primary dark:text-emerald-400" />
              </div>
              <div>
                <span className="text-xs font-semibold text-primary dark:text-emerald-400">{c.area}</span>
                <p className="text-sm mt-0.5">{c.challenge}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground text-center pt-1">{t('microChallenges.refreshNote')}</p>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// JOB MATCHING SECTION
// ============================================================================

const JobMatchingSection = ({ careerFit }: { careerFit: string[] }) => {
  const t = useTranslations('personalityInsights')

  return (
    <Card className="bg-primary/5 dark:bg-primary/5 border-primary/20 dark:border-primary/20">
      <CardContent className="pt-6 pb-6">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="p-3 rounded-xl bg-primary/10 dark:bg-primary/10 shrink-0">
            <Search className="h-6 w-6 text-primary dark:text-primary" />
          </div>
          <div className="text-center sm:text-left flex-1">
            <h3 className="font-semibold">{t('jobMatching.title')}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {t('jobMatching.subtitle', { careers: careerFit.slice(0, 3).join(', ') })}
            </p>
          </div>
          <div className="flex gap-2 print:hidden">
            <Link href="/dashboard/student/jobs">
              <Button size="sm" className="gap-2">
                <Briefcase className="h-4 w-4" />
                {t('jobMatching.browseJobs')}
              </Button>
            </Link>
            <Link href="/dashboard/student/ai-job-search">
              <Button size="sm" variant="outline" className="gap-2">
                <Sparkles className="h-4 w-4" />
                {t('jobMatching.aiSearch')}
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// COMPARISON OVER TIME SECTION
// ============================================================================

const ComparisonSection = ({ history }: { history: HistoryData }) => {
  const t = useTranslations('personalityInsights')

  const hasBigFiveHistory = history.bigFive.length > 1
  const hasCompetencyHistory = history.competency.length > 1

  if (!hasBigFiveHistory && !hasCompetencyHistory) return null

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString(undefined, { month: 'short', year: 'numeric' })
  }

  const bigFiveChartData = history.bigFive.map((entry) => ({
    date: formatDate(entry.date),
    Openness: entry.openness,
    Conscientiousness: entry.conscientiousness,
    Extraversion: entry.extraversion,
    Agreeableness: entry.agreeableness,
    Stability: 100 - (entry.neuroticism as number),
  }))

  const competencyChartData = history.competency.map((entry) => ({
    date: formatDate(entry.date),
    Overall: entry.overallScore,
    Communication: entry.communication,
    Teamwork: entry.teamwork,
    Leadership: entry.leadership,
  }))

  const getChangeIcon = (current: number, previous: number) => {
    const diff = current - previous
    if (diff > 2) return <TrendingUp className="h-3 w-3 text-primary" />
    if (diff < -2) return <TrendingDown className="h-3 w-3 text-red-500" />
    return <Minus className="h-3 w-3 text-muted-foreground" />
  }

  const lineColors = ['#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6', '#ef4444']

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          {t('comparison.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-sm text-muted-foreground">{t('comparison.subtitle')}</p>

        {hasBigFiveHistory && (
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">{t('comparison.bigFiveOverTime')}</h3>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={bigFiveChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="Openness" stroke={lineColors[0]} strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="Conscientiousness" stroke={lineColors[1]} strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="Extraversion" stroke={lineColors[2]} strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="Agreeableness" stroke={lineColors[3]} strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="Stability" stroke={lineColors[4]} strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {history.bigFive.length >= 2 && (
              <div className="flex flex-wrap gap-3">
                {(['openness', 'conscientiousness', 'extraversion', 'agreeableness'] as const).map((trait) => {
                  const latest = history.bigFive[history.bigFive.length - 1]
                  const previous = history.bigFive[history.bigFive.length - 2]
                  const curr = latest[trait] as number
                  const prev = previous[trait] as number
                  const diff = Math.round(curr - prev)
                  return (
                    <div key={trait} className="flex items-center gap-1 text-xs">
                      {getChangeIcon(curr, prev)}
                      <span className="capitalize">{trait}</span>
                      <span className={diff > 0 ? 'text-primary' : diff < 0 ? 'text-red-600' : 'text-muted-foreground'}>
                        {diff > 0 ? `+${diff}` : diff}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {hasCompetencyHistory && (
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">{t('comparison.competencyOverTime')}</h3>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={competencyChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="Overall" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="Communication" stroke="#22c55e" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="Teamwork" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="Leadership" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        <div className="flex justify-center pt-2 print:hidden">
          <Link href="/dashboard/student/certifications">
            <Button variant="outline" size="sm" className="gap-2">
              <BookOpen className="h-4 w-4" />
              {t('comparison.retakeCta')}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// FAMOUS PERSONALITIES SECTION
// ============================================================================

const FamousPersonalitiesSection = ({ primaryStyle }: { primaryStyle: string }) => {
  const t = useTranslations('personalityInsights')
  const people = famousPersonalities[primaryStyle]
  if (!people || people.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-primary" />
          {t('famousPersonalities.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{t('famousPersonalities.subtitle')}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {people.map((person) => (
            <Card key={person.name} className="bg-muted/50">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-yellow-100 dark:bg-yellow-900/30 shrink-0">
                    <Star className="h-4 w-4 text-primary dark:text-yellow-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">{person.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{person.description}</p>
                    <Badge variant="secondary" className="mt-2 text-xs">{person.trait}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// STUDY STYLE SECTION
// ============================================================================

const StudyStyleSection = ({ primaryStyle }: { primaryStyle: string }) => {
  const t = useTranslations('personalityInsights')
  const styles = studyStyles[primaryStyle]
  if (!styles || styles.length === 0) return null

  const iconMap: Record<string, typeof Eye> = {
    eye: Eye,
    users: Users,
    brain: Brain,
    edit: Edit3,
    compass: Compass,
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-cyan-600" />
          {t('studyStyle.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{t('studyStyle.subtitle')}</p>
        <div className="grid gap-3 sm:grid-cols-3">
          {styles.map((style) => {
            const Icon = iconMap[style.icon] || BookOpen
            return (
              <Card key={style.method} className="bg-cyan-50/50 dark:bg-cyan-900/10 border-cyan-200 dark:border-cyan-800/50">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                    <h4 className="font-semibold text-sm">{style.method}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground">{style.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// COMMUNICATION PLAYBOOK SECTION
// ============================================================================

const CommunicationPlaybookSection = () => {
  const t = useTranslations('personalityInsights')

  const styles = ['DOMINANCE', 'INFLUENCE', 'STEADINESS', 'COMPLIANCE'] as const
  const styleColors: Record<string, string> = {
    DOMINANCE: 'border-red-200 dark:border-red-800/50 bg-red-50/50 dark:bg-red-900/10',
    INFLUENCE: 'border-amber-200 dark:border-amber-800/50 bg-amber-50/50 dark:bg-amber-900/10',
    STEADINESS: 'border-primary/20 dark:border-primary/20 bg-primary/5 dark:bg-primary/5',
    COMPLIANCE: 'border-primary/20 dark:border-primary/20 bg-primary/5 dark:bg-primary/5',
  }
  const styleTextColors: Record<string, string> = {
    DOMINANCE: 'text-red-600 dark:text-red-400',
    INFLUENCE: 'text-amber-600 dark:text-amber-400',
    STEADINESS: 'text-primary dark:text-primary',
    COMPLIANCE: 'text-primary dark:text-primary',
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-violet-600" />
          {t('commPlaybook.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{t('commPlaybook.subtitle')}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {styles.map((style) => {
            const playbook = communicationPlaybook[style]
            return (
              <Card key={style} className={styleColors[style]}>
                <CardContent className="pt-4 pb-4">
                  <h4 className={`font-semibold text-sm mb-2 ${styleTextColors[style]}`}>
                    {t('commPlaybook.withStyle', { style: discStyleLabels[style] })}
                  </h4>
                  <p className="text-xs text-muted-foreground mb-2">{playbook.approach}</p>
                  <div className="space-y-1">
                    {playbook.doThis.map((tip) => (
                      <div key={tip} className="flex items-start gap-1.5 text-xs">
                        <CheckCircle2 className="h-3 w-3 text-primary shrink-0 mt-0.5" />
                        <span>{tip}</span>
                      </div>
                    ))}
                    {playbook.avoidThis.map((tip) => (
                      <div key={tip} className="flex items-start gap-1.5 text-xs">
                        <AlertTriangle className="h-3 w-3 text-amber-500 shrink-0 mt-0.5" />
                        <span>{tip}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// WEEKLY REFLECTION SECTION
// ============================================================================

const WeeklyReflectionSection = ({ developmentAreas }: { developmentAreas: string[] }) => {
  const t = useTranslations('personalityInsights')

  // Pick this week's prompt based on week of year
  const weekOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (7 * 86400000))

  const prompts = developmentAreas.slice(0, 3).map((area) => {
    const pool = reflectionPrompts[area] || defaultReflectionPrompts
    const index = weekOfYear % pool.length
    return { area, prompt: pool[index] }
  })

  if (prompts.length === 0) return null

  return (
    <Card className="bg-primary/5 dark:bg-primary/5 border-primary/20 dark:border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Edit3 className="h-5 w-5 text-violet-600" />
          {t('reflection.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{t('reflection.subtitle')}</p>
        <div className="space-y-3">
          {prompts.map((p) => (
            <div key={p.area} className="flex items-start gap-3 p-3 bg-white/60 dark:bg-white/5 rounded-lg">
              <div className="p-1.5 rounded-full bg-violet-100 dark:bg-violet-900/40 shrink-0 mt-0.5">
                <Edit3 className="h-3 w-3 text-violet-600 dark:text-violet-400" />
              </div>
              <div>
                <span className="text-xs font-semibold text-violet-700 dark:text-violet-400">{p.area}</span>
                <p className="text-sm mt-0.5 italic">{p.prompt}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground text-center pt-1">{t('reflection.refreshNote')}</p>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// NETWORKING TIPS SECTION
// ============================================================================

const NetworkingTipsSection = ({ primaryStyle }: { primaryStyle: string }) => {
  const t = useTranslations('personalityInsights')

  // Map composite styles to their primary for networking tips
  const baseStyle = primaryStyle.length <= 2 && primaryStyle !== 'DI' && primaryStyle !== 'DC' && primaryStyle !== 'IS' && primaryStyle !== 'IC' && primaryStyle !== 'DS' && primaryStyle !== 'SC'
    ? primaryStyle
    : primaryStyle.charAt(0) === 'D' ? 'DOMINANCE'
    : primaryStyle.charAt(0) === 'I' ? 'INFLUENCE'
    : primaryStyle.charAt(0) === 'S' ? 'STEADINESS'
    : 'COMPLIANCE'

  const tips = networkingTips[baseStyle]
  if (!tips) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-pink-600" />
          {t('networking.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{tips.approach}</p>

        {/* Ice Breakers */}
        <div className="space-y-2">
          <h4 className="font-semibold text-sm">{t('networking.iceBreakers')}</h4>
          <div className="space-y-2">
            {tips.iceBreakers.map((breaker) => (
              <div key={breaker} className="flex items-start gap-2 p-2 bg-muted/50 rounded-lg">
                <Quote className="h-3 w-3 text-pink-500 shrink-0 mt-1" />
                <p className="text-xs italic">&ldquo;{breaker}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="space-y-2">
          <h4 className="font-semibold text-sm">{t('networking.tips')}</h4>
          <ul className="space-y-1">
            {tips.tips.map((tip) => (
              <li key={tip} className="text-xs text-muted-foreground flex items-start gap-2">
                <ArrowRight className="h-3 w-3 text-pink-500 shrink-0 mt-0.5" />
                {tip}
              </li>
            ))}
          </ul>
        </div>

        {/* Follow Up */}
        <Card className="bg-pink-50 dark:bg-pink-900/10 border-pink-200 dark:border-pink-800/50">
          <CardContent className="pt-3 pb-3">
            <h4 className="font-semibold text-xs flex items-center gap-1.5 mb-1">
              <Zap className="h-3 w-3 text-pink-500" />
              {t('networking.followUp')}
            </h4>
            <p className="text-xs text-muted-foreground">{tips.followUp}</p>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// GOAL SETTING SECTION
// ============================================================================

const GoalSettingSection = ({ developmentAreas }: { developmentAreas: string[] }) => {
  const t = useTranslations('personalityInsights')
  const [expandedGoal, setExpandedGoal] = useState<string | null>(null)

  const goals = developmentAreas
    .map((area) => {
      const template = smartGoalTemplates[area]
      return template ? { area, ...template } : null
    })
    .filter((g): g is NonNullable<typeof g> => g !== null)
    .slice(0, 3)

  if (goals.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-primary" />
          {t('goalSetting.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{t('goalSetting.subtitle')}</p>
        <div className="space-y-3">
          {goals.map((g) => (
            <Card key={g.area} className="bg-primary/5/50 dark:bg-teal-900/10 border-teal-200 dark:border-teal-800/50">
              <CardContent className="pt-4 pb-4">
                <button
                  onClick={() => setExpandedGoal(expandedGoal === g.area ? null : g.area)}
                  className="w-full text-left"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <Badge variant="secondary" className="text-xs mb-1">{g.area}</Badge>
                      <h4 className="font-medium text-sm">{g.goal}</h4>
                    </div>
                    <ArrowRight className={`h-4 w-4 text-primary transition-transform ${expandedGoal === g.area ? 'rotate-90' : ''}`} />
                  </div>
                </button>
                {expandedGoal === g.area && (
                  <div className="mt-3 space-y-2 border-t border-teal-200 dark:border-teal-800/50 pt-3">
                    <div>
                      <span className="text-xs font-semibold text-teal-700 dark:text-teal-400">S — {t('goalSetting.specific')}</span>
                      <p className="text-xs text-muted-foreground">{g.specific}</p>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-teal-700 dark:text-teal-400">M — {t('goalSetting.measurable')}</span>
                      <p className="text-xs text-muted-foreground">{g.measurable}</p>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-teal-700 dark:text-teal-400">A — {t('goalSetting.achievable')}</span>
                      <p className="text-xs text-muted-foreground">{g.achievable}</p>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-teal-700 dark:text-teal-400">R — {t('goalSetting.relevant')}</span>
                      <p className="text-xs text-muted-foreground">{g.relevant}</p>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-teal-700 dark:text-teal-400">T — {t('goalSetting.timebound')}</span>
                      <p className="text-xs text-muted-foreground">{g.timebound}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// DECISION-MAKING STYLE SECTION
// ============================================================================

const DecisionStyleSection = ({ primaryStyle }: { primaryStyle: string }) => {
  const t = useTranslations('personalityInsights')
  const ds = decisionStyles[primaryStyle]
  if (!ds) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Compass className="h-5 w-5 text-sky-600" />
          {t('decisionStyle.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge className="bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300">{ds.style}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">{ds.description}</p>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              {t('decisionStyle.strengths')}
            </h4>
            <ul className="space-y-1">
              {ds.strengths.map((s) => (
                <li key={s} className="text-xs text-muted-foreground flex items-start gap-2">
                  <CheckCircle2 className="h-3 w-3 text-primary shrink-0 mt-0.5" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <Eye className="h-4 w-4 text-amber-500" />
              {t('decisionStyle.blindSpots')}
            </h4>
            <ul className="space-y-1">
              {ds.blindSpots.map((b) => (
                <li key={b} className="text-xs text-muted-foreground flex items-start gap-2">
                  <AlertTriangle className="h-3 w-3 text-amber-500 shrink-0 mt-0.5" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Card className="bg-sky-50 dark:bg-sky-900/10 border-sky-200 dark:border-sky-800/50">
          <CardContent className="pt-3 pb-3">
            <h4 className="font-semibold text-xs flex items-center gap-1.5 mb-1">
              <Lightbulb className="h-3 w-3 text-sky-500" />
              {t('decisionStyle.tip')}
            </h4>
            <p className="text-xs text-muted-foreground">{ds.tip}</p>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// WORK ENVIRONMENT SECTION
// ============================================================================

const WorkEnvironmentSection = ({ primaryStyle }: { primaryStyle: string }) => {
  const t = useTranslations('personalityInsights')
  const env = workEnvironmentFit[primaryStyle]
  if (!env) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-primary" />
          {t('workEnv.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-primary/5 dark:bg-primary/5 border-primary/20 dark:border-primary/20">
            <CardContent className="pt-4 pb-4">
              <h4 className="font-semibold text-sm flex items-center gap-2 mb-2 text-green-700 dark:text-green-400">
                <CheckCircle2 className="h-4 w-4" />
                {t('workEnv.ideal')}
              </h4>
              <ul className="space-y-1.5">
                {env.ideal.map((item) => (
                  <li key={item} className="text-xs text-muted-foreground flex items-start gap-1.5">
                    <CheckCircle2 className="h-3 w-3 text-primary shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800/50">
            <CardContent className="pt-4 pb-4">
              <h4 className="font-semibold text-sm flex items-center gap-2 mb-2 text-amber-700 dark:text-amber-400">
                <Minus className="h-4 w-4" />
                {t('workEnv.tolerable')}
              </h4>
              <ul className="space-y-1.5">
                {env.tolerable.map((item) => (
                  <li key={item} className="text-xs text-muted-foreground flex items-start gap-1.5">
                    <Minus className="h-3 w-3 text-amber-500 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800/50">
            <CardContent className="pt-4 pb-4">
              <h4 className="font-semibold text-sm flex items-center gap-2 mb-2 text-red-700 dark:text-red-400">
                <AlertTriangle className="h-4 w-4" />
                {t('workEnv.avoid')}
              </h4>
              <ul className="space-y-1.5">
                {env.avoid.map((item) => (
                  <li key={item} className="text-xs text-muted-foreground flex items-start gap-1.5">
                    <AlertTriangle className="h-3 w-3 text-red-500 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// CONFLICT STYLE SECTION
// ============================================================================

const ConflictStyleSection = ({ primaryStyle }: { primaryStyle: string }) => {
  const t = useTranslations('personalityInsights')
  const cs = conflictStyles[primaryStyle]
  if (!cs) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-orange-600" />
          {t('conflictStyle.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300">{cs.style}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">{cs.description}</p>

        <Card className="bg-muted/50">
          <CardContent className="pt-3 pb-3">
            <h4 className="font-semibold text-xs mb-1">{t('conflictStyle.naturalResponse')}</h4>
            <p className="text-xs text-muted-foreground">{cs.naturalResponse}</p>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              {t('conflictStyle.strengths')}
            </h4>
            <ul className="space-y-1">
              {cs.strengths.map((s) => (
                <li key={s} className="text-xs text-muted-foreground flex items-start gap-2">
                  <CheckCircle2 className="h-3 w-3 text-primary shrink-0 mt-0.5" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <Target className="h-4 w-4 text-amber-500" />
              {t('conflictStyle.growthAreas')}
            </h4>
            <ul className="space-y-1">
              {cs.growthAreas.map((g) => (
                <li key={g} className="text-xs text-muted-foreground flex items-start gap-2">
                  <Target className="h-3 w-3 text-amber-500 shrink-0 mt-0.5" />
                  {g}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Card className="bg-orange-50 dark:bg-orange-900/10 border-orange-200 dark:border-orange-800/50">
          <CardContent className="pt-3 pb-3">
            <h4 className="font-semibold text-xs flex items-center gap-1.5 mb-1">
              <Lightbulb className="h-3 w-3 text-orange-500" />
              {t('conflictStyle.tip')}
            </h4>
            <p className="text-xs text-muted-foreground">{cs.tip}</p>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// ENERGY MANAGEMENT SECTION
// ============================================================================

const EnergyManagementSection = ({ primaryStyle }: { primaryStyle: string }) => {
  const t = useTranslations('personalityInsights')
  const energy = energyProfiles[primaryStyle]
  if (!energy) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          {t('energy.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="bg-primary/5 dark:bg-primary/5 border-primary/20 dark:border-primary/20">
            <CardContent className="pt-4 pb-4">
              <h4 className="font-semibold text-sm flex items-center gap-2 mb-2 text-green-700 dark:text-green-400">
                <Zap className="h-4 w-4" />
                {t('energy.energizers')}
              </h4>
              <ul className="space-y-1.5">
                {energy.energizers.map((item) => (
                  <li key={item} className="text-xs text-muted-foreground flex items-start gap-1.5">
                    <Zap className="h-3 w-3 text-primary shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800/50">
            <CardContent className="pt-4 pb-4">
              <h4 className="font-semibold text-sm flex items-center gap-2 mb-2 text-red-700 dark:text-red-400">
                <AlertTriangle className="h-4 w-4" />
                {t('energy.drainers')}
              </h4>
              <ul className="space-y-1.5">
                {energy.drainers.map((item) => (
                  <li key={item} className="text-xs text-muted-foreground flex items-start gap-1.5">
                    <AlertTriangle className="h-3 w-3 text-red-500 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-muted/50">
          <CardContent className="pt-3 pb-3">
            <h4 className="font-semibold text-xs mb-1">{t('energy.peakTime')}</h4>
            <p className="text-xs text-muted-foreground">{energy.peakTime}</p>
          </CardContent>
        </Card>

        <Card className="bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800/50">
          <CardContent className="pt-3 pb-3">
            <h4 className="font-semibold text-xs flex items-center gap-1.5 mb-1">
              <Lightbulb className="h-3 w-3 text-primary" />
              {t('energy.recoveryTip')}
            </h4>
            <p className="text-xs text-muted-foreground">{energy.recoveryTip}</p>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// MENTORSHIP SECTION
// ============================================================================

const MentorshipSection = ({ primaryStyle }: { primaryStyle: string }) => {
  const t = useTranslations('personalityInsights')
  const profile = mentorshipProfiles[primaryStyle]
  if (!profile) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-primary" />
          {t('mentorship.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Ideal Mentor */}
        <div className="space-y-2">
          <h4 className="font-semibold text-sm">{t('mentorship.idealMentor')}</h4>
          <p className="text-sm text-muted-foreground">{profile.idealMentor}</p>
          <div className="flex flex-wrap gap-2">
            {profile.mentorTraits.map((trait) => (
              <Badge key={trait} variant="secondary" className="text-xs">{trait}</Badge>
            ))}
          </div>
        </div>

        {/* As a Mentee */}
        <div className="space-y-2">
          <h4 className="font-semibold text-sm">{t('mentorship.asaMentee')}</h4>
          <p className="text-sm text-muted-foreground">{profile.asaMentee}</p>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <h5 className="text-xs font-semibold text-green-700 dark:text-green-400">{t('mentorship.menteeStrengths')}</h5>
              {profile.menteeStrengths.map((s) => (
                <div key={s} className="text-xs text-muted-foreground flex items-start gap-1.5">
                  <CheckCircle2 className="h-3 w-3 text-primary shrink-0 mt-0.5" />
                  {s}
                </div>
              ))}
            </div>
            <div className="space-y-1">
              <h5 className="text-xs font-semibold text-amber-700 dark:text-amber-400">{t('mentorship.menteeGrowth')}</h5>
              {profile.menteeGrowth.map((g) => (
                <div key={g} className="text-xs text-muted-foreground flex items-start gap-1.5">
                  <ArrowRight className="h-3 w-3 text-amber-500 shrink-0 mt-0.5" />
                  {g}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-center pt-2 print:hidden">
          <Link href="/dashboard/student/mentoring">
            <Button variant="outline" size="sm" className="gap-2">
              <GraduationCap className="h-4 w-4" />
              {t('mentorship.findMentor')}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// PERSONAL BRAND SECTION
// ============================================================================

const PersonalBrandSection = ({
  primaryStyle,
  bigFive,
  competency,
}: {
  primaryStyle: string
  bigFive: BigFiveData | null
  competency: CompetencyData | null
}) => {
  const t = useTranslations('personalityInsights')

  const baseStatement = personalBrandTemplates[primaryStyle]
  if (!baseStatement) return null

  // Build an enhanced statement
  const parts: string[] = [baseStatement]

  if (bigFive && bigFive.strengths.length > 0) {
    const topStrength = bigFive.strengths[0]
    parts.push(t('personalBrand.strengthAdd', { strength: topStrength }))
  }

  if (competency && competency.overallScore >= 70) {
    parts.push(t('personalBrand.competencyAdd'))
  }

  const fullStatement = parts.join(' ')

  const handleCopy = () => {
    navigator.clipboard.writeText(fullStatement)
  }

  return (
    <Card className="bg-primary/5 dark:bg-primary/5 border-primary/20 dark:border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-primary" />
          {t('personalBrand.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{t('personalBrand.subtitle')}</p>

        <Card className="bg-white/60 dark:bg-white/5">
          <CardContent className="pt-4 pb-4">
            <p className="text-sm leading-relaxed italic">&ldquo;{fullStatement}&rdquo;</p>
          </CardContent>
        </Card>

        <div className="flex justify-center print:hidden">
          <Button variant="outline" size="sm" onClick={handleCopy} className="gap-2">
            <ClipboardList className="h-4 w-4" />
            {t('personalBrand.copy')}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
