/**
 * Command palette registry — keyed actions a user can fire from Cmd+K.
 *
 * Two kinds of commands:
 *   - `nav` → goto a route
 *   - `action` → run a callback (e.g., open a modal, copy a link)
 *
 * Bilingual: every command has en + it labels and (optional) hints.
 * Filtered per role so a recruiter doesn't see student-only actions.
 */

import type { Locale } from '@/lib/journeys'

export type CommandRole = 'student' | 'recruiter' | 'institution' | 'all'

export interface Command {
  id: string
  /** Bilingual labels. */
  label: { en: string; it: string }
  /** Optional shorter hint (subtitle line). */
  hint?: { en: string; it: string }
  /** Group label shown as a section header in the palette. */
  group: { en: string; it: string }
  /** Where to navigate (or omit if action-based). */
  href?: string
  /** Synonyms used for fuzzy filtering (lowercase). */
  keywords?: string[]
  /** Which roles see this command. */
  roles: CommandRole[]
}

export const COMMANDS: Command[] = [
  // ── STUDENT ──
  { id: 'student.home', label: { en: 'Go to dashboard', it: 'Vai al dashboard' }, group: { en: 'Navigate', it: 'Vai a' }, href: '/dashboard/student', roles: ['student'], keywords: ['home'] },
  { id: 'student.journey', label: { en: 'Open my journey', it: 'Apri il mio journey' }, group: { en: 'Navigate', it: 'Vai a' }, href: '/dashboard/student/journey', roles: ['student'], keywords: ['progress', 'percorso'] },
  { id: 'student.projects', label: { en: 'My projects', it: 'I miei progetti' }, group: { en: 'Navigate', it: 'Vai a' }, href: '/dashboard/student/projects', roles: ['student'] },
  { id: 'student.new-project', label: { en: 'Add a new project', it: 'Aggiungi un nuovo progetto' }, hint: { en: 'Capture work, request endorsement', it: 'Carica lavoro, chiedi endorsement' }, group: { en: 'Create', it: 'Crea' }, href: '/dashboard/student/projects/new', roles: ['student'], keywords: ['create', 'new', 'aggiungi', 'nuovo'] },
  { id: 'student.matches', label: { en: 'Job matches', it: 'Match di lavoro' }, group: { en: 'Navigate', it: 'Vai a' }, href: '/dashboard/student/matches', roles: ['student'], keywords: ['jobs', 'lavori'] },
  { id: 'student.applications', label: { en: 'My applications', it: 'Le mie candidature' }, group: { en: 'Navigate', it: 'Vai a' }, href: '/dashboard/student/applications', roles: ['student'] },
  { id: 'student.cv', label: { en: 'Generate Europass CV', it: 'Genera CV Europass' }, group: { en: 'Create', it: 'Crea' }, href: '/dashboard/student/cv', roles: ['student'], keywords: ['resume', 'curriculum'] },
  { id: 'student.skills', label: { en: 'My verified skills', it: 'Le mie competenze verificate' }, group: { en: 'Navigate', it: 'Vai a' }, href: '/dashboard/student/skills', roles: ['student'] },
  { id: 'student.skill-path', label: { en: 'My skill path', it: 'Il mio skill path' }, group: { en: 'Navigate', it: 'Vai a' }, href: '/dashboard/student/skill-path', roles: ['student'] },
  { id: 'student.fit-profile', label: { en: 'My fit profile', it: 'Il mio fit profile' }, group: { en: 'Navigate', it: 'Vai a' }, href: '/dashboard/student/fit-profile', roles: ['student'] },
  { id: 'student.self-discovery', label: { en: 'Run self-discovery', it: 'Auto-esplorazione' }, hint: { en: '6-step exploration of values + skills', it: '6 passi: valori + competenze' }, group: { en: 'Create', it: 'Crea' }, href: '/self-discovery', roles: ['student'], keywords: ['discovery', 'capire chi sei'] },
  { id: 'student.messages', label: { en: 'Messages', it: 'Messaggi' }, group: { en: 'Navigate', it: 'Vai a' }, href: '/dashboard/student/messages', roles: ['student'] },
  { id: 'student.upgrade', label: { en: 'Upgrade to Premium', it: 'Passa a Premium' }, hint: { en: '€3.99/mo · 30-day trial', it: '€3,99/mese · trial 30 giorni' }, group: { en: 'Account', it: 'Account' }, href: '/dashboard/student/upgrade', roles: ['student'], keywords: ['premium', 'paid'] },

  // ── RECRUITER ──
  { id: 'recruiter.home', label: { en: 'Go to dashboard', it: 'Vai al dashboard' }, group: { en: 'Navigate', it: 'Vai a' }, href: '/dashboard/recruiter', roles: ['recruiter'], keywords: ['home'] },
  { id: 'recruiter.candidates', label: { en: 'Search candidates', it: 'Cerca candidati' }, group: { en: 'Navigate', it: 'Vai a' }, href: '/dashboard/recruiter/candidates', roles: ['recruiter'], keywords: ['talent', 'students'] },
  { id: 'recruiter.ai-search', label: { en: 'AI Talent Search', it: 'Ricerca AI talenti' }, hint: { en: 'Natural-language candidate search', it: 'Ricerca candidati in linguaggio naturale' }, group: { en: 'Navigate', it: 'Vai a' }, href: '/dashboard/recruiter/ai-talent-search', roles: ['recruiter'] },
  { id: 'recruiter.jobs', label: { en: 'My job postings', it: 'Le mie offerte' }, group: { en: 'Navigate', it: 'Vai a' }, href: '/dashboard/recruiter/jobs', roles: ['recruiter'] },
  { id: 'recruiter.new-job', label: { en: 'Post a new job', it: 'Pubblica una nuova offerta' }, hint: { en: 'Paste a JD — AI fills the form', it: 'Incolla una JD — l\'AI riempie il form' }, group: { en: 'Create', it: 'Crea' }, href: '/dashboard/recruiter/jobs/new', roles: ['recruiter'], keywords: ['create', 'new', 'pubblica'] },
  { id: 'recruiter.pipeline', label: { en: 'Pipeline kanban', it: 'Pipeline kanban' }, group: { en: 'Navigate', it: 'Vai a' }, href: '/dashboard/recruiter/pipeline', roles: ['recruiter'] },
  { id: 'recruiter.decision-pack', label: { en: 'Decision packs', it: 'Decision pack' }, hint: { en: 'PDF artifacts for hiring committees', it: 'Artefatti PDF per il comitato di selezione' }, group: { en: 'Navigate', it: 'Vai a' }, href: '/dashboard/recruiter/decision-pack', roles: ['recruiter'] },
  { id: 'recruiter.messages', label: { en: 'Messages', it: 'Messaggi' }, group: { en: 'Navigate', it: 'Vai a' }, href: '/dashboard/recruiter/messages', roles: ['recruiter'] },
  { id: 'recruiter.watchlist', label: { en: 'Watchlist', it: 'Candidati salvati' }, group: { en: 'Navigate', it: 'Vai a' }, href: '/dashboard/recruiter/watchlist', roles: ['recruiter'], keywords: ['saved', 'bookmark'] },
  { id: 'recruiter.analytics', label: { en: 'Analytics', it: 'Analytics' }, group: { en: 'Navigate', it: 'Vai a' }, href: '/dashboard/recruiter/analytics', roles: ['recruiter'] },
  { id: 'recruiter.settings', label: { en: 'Brand & settings', it: 'Brand e impostazioni' }, hint: { en: 'Auto-fill from your domain', it: 'Auto-fill dal tuo dominio' }, group: { en: 'Account', it: 'Account' }, href: '/dashboard/recruiter/settings', roles: ['recruiter'] },
  { id: 'recruiter.integrations', label: { en: 'Integrations', it: 'Integrazioni' }, hint: { en: 'Greenhouse, Lever, Workday, Esse3', it: 'Greenhouse, Lever, Workday, Esse3' }, group: { en: 'Account', it: 'Account' }, href: '/dashboard/recruiter/integrations', roles: ['recruiter'] },

  // ── INSTITUTION ──
  { id: 'inst.home', label: { en: 'Go to dashboard', it: 'Vai al dashboard' }, group: { en: 'Navigate', it: 'Vai a' }, href: '/dashboard/university', roles: ['institution'] },
  { id: 'inst.students', label: { en: 'Students', it: 'Studenti' }, group: { en: 'Navigate', it: 'Vai a' }, href: '/dashboard/university/students', roles: ['institution'] },
  { id: 'inst.import-students', label: { en: 'Import students', it: 'Importa studenti' }, hint: { en: 'CSV / Excel / AlmaLaurea', it: 'CSV / Excel / AlmaLaurea' }, group: { en: 'Create', it: 'Crea' }, href: '/dashboard/university/students/import', roles: ['institution'] },
  { id: 'inst.inbox', label: { en: 'M1 Mediation Inbox', it: 'M1 Mediation Inbox' }, group: { en: 'Workspace', it: 'Workspace' }, href: '/dashboard/university/inbox', roles: ['institution'] },
  { id: 'inst.offers', label: { en: 'M2 Offer Moderation', it: 'M2 Moderazione Offerte' }, group: { en: 'Workspace', it: 'Workspace' }, href: '/dashboard/university/offers', roles: ['institution'] },
  { id: 'inst.crm', label: { en: 'M3 Company CRM', it: 'M3 CRM Aziende' }, group: { en: 'Workspace', it: 'Workspace' }, href: '/dashboard/university/crm', roles: ['institution'] },
  { id: 'inst.placement-pipeline', label: { en: 'M4 Placement Pipeline', it: 'M4 Pipeline Placement' }, group: { en: 'Workspace', it: 'Workspace' }, href: '/dashboard/university/placement-pipeline', roles: ['institution'] },
  { id: 'inst.conventions', label: { en: 'Convention Builder', it: 'Convention Builder' }, hint: { en: 'Generate compliant agreements in 60s', it: 'Genera accordi conformi in 60 secondi' }, group: { en: 'Create', it: 'Crea' }, href: '/dashboard/university/conventions', roles: ['institution'] },
  { id: 'inst.analytics', label: { en: 'Analytics', it: 'Analytics' }, group: { en: 'Navigate', it: 'Vai a' }, href: '/dashboard/university/analytics', roles: ['institution'] },
  { id: 'inst.programs', label: { en: 'Programs', it: 'Programmi' }, group: { en: 'Navigate', it: 'Vai a' }, href: '/dashboard/university/programs', roles: ['institution'] },
  { id: 'inst.audit-log', label: { en: 'Audit log', it: 'Audit log' }, hint: { en: 'AI Act compliance trail', it: 'Audit trail conformità AI Act' }, group: { en: 'Navigate', it: 'Vai a' }, href: '/dashboard/university/audit-log', roles: ['institution'] },
  { id: 'inst.assistant', label: { en: 'AI Staff Assistant', it: 'AI Staff Assistant' }, group: { en: 'Navigate', it: 'Vai a' }, href: '/dashboard/university/assistant', roles: ['institution'] },
  { id: 'inst.billing', label: { en: 'Billing & add-ons', it: 'Fatturazione e add-on' }, group: { en: 'Account', it: 'Account' }, href: '/dashboard/university/billing', roles: ['institution'] },

  // ── ALL ──
  { id: 'all.pricing', label: { en: 'View pricing', it: 'Vedi prezzi' }, group: { en: 'Help', it: 'Aiuto' }, href: '/pricing', roles: ['all'] },
  { id: 'all.faq', label: { en: 'Frequently asked questions', it: 'Domande frequenti' }, group: { en: 'Help', it: 'Aiuto' }, href: '/faq', roles: ['all'] },
  { id: 'all.compliance', label: { en: 'EU compliance overview', it: 'Conformità EU' }, group: { en: 'Help', it: 'Aiuto' }, href: '/eu-compliance', roles: ['all'], keywords: ['gdpr', 'ai act', 'eidas'] },
]

export function getCommandsForRole(role: CommandRole): Command[] {
  return COMMANDS.filter(c => c.roles.includes(role) || c.roles.includes('all'))
}

/**
 * Cheap fuzzy match — substring + keyword check, locale-aware.
 * Ranks: label matches > keyword matches > hint matches.
 */
export function filterCommands(commands: Command[], query: string, locale: Locale = 'en'): Command[] {
  const q = query.trim().toLowerCase()
  if (!q) return commands

  const tokens = q.split(/\s+/)
  const matches = commands
    .map(c => {
      const label = c.label[locale].toLowerCase()
      const hint = c.hint?.[locale]?.toLowerCase() || ''
      const keywords = (c.keywords || []).join(' ')
      const hay = `${label} ${hint} ${keywords}`
      const score = tokens.every(t => hay.includes(t))
        ? (label.includes(q) ? 3 : keywords.includes(q) ? 2 : hint.includes(q) ? 1 : 0.5)
        : 0
      return { c, score }
    })
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(x => x.c)
  return matches
}
