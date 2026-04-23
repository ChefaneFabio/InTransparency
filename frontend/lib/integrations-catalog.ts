/**
 * Integrations catalog — shared across student / recruiter / university
 * integration pages. Each entry describes a 3rd-party integration we
 * offer or plan to offer, grouped by role and category.
 *
 * Status semantics:
 *   - live          : fully implemented, just connect
 *   - beta          : works but may have rough edges
 *   - coming_soon   : planned, sign up for waitlist
 *   - enterprise    : available for enterprise customers only
 *   - premium       : requires PREMIUM plan (institutional only)
 */

export type IntegrationStatus =
  | 'live'
  | 'beta'
  | 'coming_soon'
  | 'enterprise'
  | 'premium'

export type IntegrationRole = 'student' | 'recruiter' | 'university'

export interface Integration {
  id: string
  name: string
  description: string
  category: string
  status: IntegrationStatus
  /** URL to icon/logo (served from /public/integrations/...) */
  iconEmoji: string // quick fallback — swap to SVG logos once sourced
  /** Where the user goes to connect or learn more */
  href?: string
  /** If null/undefined the action is a mailto to request */
  requestEmailSubject?: string
}

/* ────────────────────────────────────────────────────────────────── */
/* UNIVERSITY / ITS INTEGRATIONS                                      */
/* ────────────────────────────────────────────────────────────────── */

export const UNIVERSITY_INTEGRATIONS: Integration[] = [
  // — Italian higher-ed systems
  {
    id: 'esse3',
    name: 'Esse3',
    description:
      "Sincronizza anagrafica studenti, carriere, esami, lauree direttamente dal gestionale Cineca più diffuso in Italia.",
    category: 'student-information',
    status: 'premium',
    iconEmoji: '🎓',
    requestEmailSubject: 'Integrazione Esse3',
  },
  {
    id: 'almalaurea',
    name: 'AlmaLaurea',
    description:
      "Import automatico dei dati placement di AlmaLaurea. Sincronizza outcome occupazionali 1 / 3 / 5 anni dalla laurea.",
    category: 'student-information',
    status: 'premium',
    iconEmoji: '📊',
    requestEmailSubject: 'Integrazione AlmaLaurea',
  },
  {
    id: 'anvur-mur',
    name: 'ANVUR / MUR Reports',
    description:
      'Generazione automatica dei report SUA-RD / SUA-CdS con dati placement. Export in formato richiesto dal ministero.',
    category: 'compliance',
    status: 'premium',
    iconEmoji: '🏛️',
    requestEmailSubject: 'Report ANVUR/MUR',
  },
  {
    id: 'spid-cie',
    name: 'SPID / CIE',
    description:
      "Login studenti con Sistema Pubblico di Identità Digitale e Carta d'Identità Elettronica. Accreditamento AgID in corso.",
    category: 'authentication',
    status: 'coming_soon',
    iconEmoji: '🆔',
    requestEmailSubject: 'Integrazione SPID / CIE',
  },

  // — EU standards
  {
    id: 'edci',
    name: 'EDCI (European Digital Credentials)',
    description:
      'Emissione di credenziali digitali firmate, compatibili con lo European Digital Wallet. Verificabili cross-EU.',
    category: 'credentials',
    status: 'live',
    iconEmoji: '🇪🇺',
    href: '/dashboard/university/credentials',
  },
  {
    id: 'europass',
    name: 'Europass',
    description:
      "Export dei profili studente in formato Europass JSON-LD. Integrazione diretta con l'European Learning Model.",
    category: 'credentials',
    status: 'live',
    iconEmoji: '📜',
  },
  {
    id: 'open-badges',
    name: 'Open Badges 3.0',
    description:
      "Emissione e verifica di Open Badges IMS Global 3.0 per progetti, competenze e stage completati.",
    category: 'credentials',
    status: 'live',
    iconEmoji: '🏅',
  },
  {
    id: 'erasmus-ola',
    name: 'Erasmus+ Online Learning Agreement',
    description:
      'Export automatico degli OLA degli studenti in scambio. Supporta il formato JSON-LD richiesto dalla Commissione EU.',
    category: 'mobility',
    status: 'premium',
    iconEmoji: '✈️',
  },
  {
    id: 'esco',
    name: 'ESCO',
    description:
      'Normalizzazione competenze con il taxonomy ESCO v1.2.0 (European Skills, Competences & Occupations). 93+ skills mapping.',
    category: 'standards',
    status: 'live',
    iconEmoji: '🔖',
  },

  // — Auth / SSO
  {
    id: 'sso-saml',
    name: 'SAML 2.0 / Shibboleth',
    description:
      "Single Sign-On per staff e studenti tramite l'Identity Provider dell'ateneo. Supporta IDEM Italia e eduGAIN.",
    category: 'authentication',
    status: 'enterprise',
    iconEmoji: '🔐',
    requestEmailSubject: 'Integrazione SSO SAML',
  },
  {
    id: 'oauth-google',
    name: 'Google Workspace',
    description:
      "Login con account Google institutional. Sync calendari per career days ed eventi.",
    category: 'authentication',
    status: 'live',
    iconEmoji: '🟢',
  },
  {
    id: 'oauth-microsoft',
    name: 'Microsoft 365',
    description:
      "Login con account istituzionale Microsoft. Sync con Teams, Outlook e SharePoint.",
    category: 'authentication',
    status: 'live',
    iconEmoji: '🟦',
  },

  // — Workflow & Docs
  {
    id: 'docusign',
    name: 'DocuSign',
    description:
      'Firma digitale delle convenzioni di tirocinio. Workflow ateneo → azienda → studente con notifiche.',
    category: 'documents',
    status: 'coming_soon',
    iconEmoji: '✍️',
    requestEmailSubject: 'DocuSign integration',
  },
  {
    id: 'slack',
    name: 'Slack',
    description:
      'Notifiche al career office quando arrivano messaggi da aziende, offerte da approvare, scadenze di stage.',
    category: 'communication',
    status: 'beta',
    iconEmoji: '💬',
  },

  // — AI agents
  {
    id: 'mcp-server',
    name: 'MCP Server',
    description:
      'Model Context Protocol. Espone il workspace istituzionale a Claude Desktop / Cursor / Zed come tool — staff assistant disponibile anche dal desktop.',
    category: 'ai',
    status: 'live',
    iconEmoji: '🤖',
    href: 'https://www.in-transparency.com/mcp-server.js',
  },
]

/* ────────────────────────────────────────────────────────────────── */
/* RECRUITER INTEGRATIONS                                             */
/* ────────────────────────────────────────────────────────────────── */

export const RECRUITER_INTEGRATIONS: Integration[] = [
  // — ATS
  {
    id: 'greenhouse',
    name: 'Greenhouse',
    description:
      "Sync candidati shortlistati e applicazioni direttamente nel tuo ATS Greenhouse.",
    category: 'ats',
    status: 'coming_soon',
    iconEmoji: '🌱',
    requestEmailSubject: 'Integrazione Greenhouse',
  },
  {
    id: 'lever',
    name: 'Lever',
    description:
      "Push candidati e job posting verso Lever. Sync status bidirezionale.",
    category: 'ats',
    status: 'coming_soon',
    iconEmoji: '⚖️',
    requestEmailSubject: 'Integrazione Lever',
  },
  {
    id: 'workday',
    name: 'Workday',
    description:
      'Integrazione enterprise per large account. Sync requisizioni + candidati.',
    category: 'ats',
    status: 'enterprise',
    iconEmoji: '📋',
    requestEmailSubject: 'Integrazione Workday',
  },

  // — CRM
  {
    id: 'hubspot',
    name: 'HubSpot',
    description:
      "Sync candidati e aziende partner con il tuo HubSpot CRM. Trigger automatici su outcome.",
    category: 'crm',
    status: 'beta',
    iconEmoji: '🔶',
  },
  {
    id: 'salesforce',
    name: 'Salesforce',
    description:
      "Integrazione enterprise Salesforce. Sync talent pool + pipeline stages.",
    category: 'crm',
    status: 'enterprise',
    iconEmoji: '☁️',
    requestEmailSubject: 'Integrazione Salesforce',
  },

  // — Comms
  {
    id: 'slack',
    name: 'Slack',
    description:
      'Notifiche in canali Slack quando un candidato risponde, accetta un interview, firma un offer.',
    category: 'communication',
    status: 'live',
    iconEmoji: '💬',
  },
  {
    id: 'microsoft-teams',
    name: 'Microsoft Teams',
    description:
      "Notifiche e posting in canali Teams. Link diretti ai profili candidati.",
    category: 'communication',
    status: 'live',
    iconEmoji: '🟦',
  },

  // — Calendar & Video
  {
    id: 'google-calendar',
    name: 'Google Calendar',
    description:
      "Pianificazione interview direttamente sul calendario. Invito automatico a candidato + intervistatore.",
    category: 'scheduling',
    status: 'live',
    iconEmoji: '📅',
  },
  {
    id: 'outlook',
    name: 'Outlook Calendar',
    description:
      'Sync interview schedule con Outlook. Notifiche meeting e update automatici.',
    category: 'scheduling',
    status: 'live',
    iconEmoji: '📆',
  },
  {
    id: 'zoom',
    name: 'Zoom',
    description:
      "Link Zoom generato automaticamente per ogni interview. Recording opzionale (con consenso del candidato).",
    category: 'video',
    status: 'beta',
    iconEmoji: '🎥',
  },
  {
    id: 'google-meet',
    name: 'Google Meet',
    description:
      'Link Google Meet per ogni interview. Integrazione nativa con Google Calendar.',
    category: 'video',
    status: 'live',
    iconEmoji: '📹',
  },

  // — Documents
  {
    id: 'docusign',
    name: 'DocuSign',
    description:
      'Firma digitale degli offer letter. Template riutilizzabili, audit trail.',
    category: 'documents',
    status: 'beta',
    iconEmoji: '✍️',
  },

  // — Job boards
  {
    id: 'linkedin-crosspost',
    name: 'LinkedIn Jobs',
    description:
      "Crossposting automatico delle offerte. Sync candidati LinkedIn.",
    category: 'job-boards',
    status: 'coming_soon',
    iconEmoji: '💼',
    requestEmailSubject: 'LinkedIn integration',
  },
  {
    id: 'indeed',
    name: 'Indeed',
    description:
      'Crossposting delle tue offerte su Indeed. Sync applicazioni.',
    category: 'job-boards',
    status: 'coming_soon',
    iconEmoji: '🔵',
  },

  // — AI
  {
    id: 'mcp-server',
    name: 'MCP Server',
    description:
      "Model Context Protocol. Il talent assistant InTransparency è disponibile anche in Claude Desktop / Cursor / Zed — cerca candidati dal tuo terminale.",
    category: 'ai',
    status: 'live',
    iconEmoji: '🤖',
    href: 'https://www.in-transparency.com/mcp-server.js',
  },
]

/* ────────────────────────────────────────────────────────────────── */
/* STUDENT INTEGRATIONS                                               */
/* ────────────────────────────────────────────────────────────────── */

export const STUDENT_INTEGRATIONS: Integration[] = [
  // — Import profile
  {
    id: 'linkedin-import',
    name: 'LinkedIn',
    description:
      "Importa la tua esperienza e le competenze da LinkedIn per pre-compilare il profilo. Nessun sync bidirezionale — il tuo profilo resta sul tuo LinkedIn.",
    category: 'profile-import',
    status: 'live',
    iconEmoji: '💼',
  },
  {
    id: 'github',
    name: 'GitHub',
    description:
      'Importa i tuoi repository come progetti. Estrai linguaggi, tool e commit activity come evidenza di competenze.',
    category: 'profile-import',
    status: 'live',
    iconEmoji: '🐙',
  },
  {
    id: 'orcid',
    name: 'ORCID',
    description:
      "Per studenti di dottorato o Master in research: sync pubblicazioni e contributi da ORCID.",
    category: 'profile-import',
    status: 'coming_soon',
    iconEmoji: '🟢',
  },
  {
    id: 'kaggle',
    name: 'Kaggle',
    description:
      "Per data scientists: importa competizioni, notebook, rank come progetti verificati.",
    category: 'profile-import',
    status: 'coming_soon',
    iconEmoji: '📊',
  },

  // — Storage
  {
    id: 'google-drive',
    name: 'Google Drive',
    description:
      'Carica CV, progetti e attestati direttamente da Google Drive. Sync automatico quando aggiorni i file.',
    category: 'storage',
    status: 'live',
    iconEmoji: '📁',
  },
  {
    id: 'dropbox',
    name: 'Dropbox',
    description:
      'Import di CV, portfolio e documenti da Dropbox.',
    category: 'storage',
    status: 'coming_soon',
    iconEmoji: '📦',
  },

  // — Academic
  {
    id: 'university-sso',
    name: 'Login con il tuo ateneo',
    description:
      "Accedi con le credenziali della tua università (SAML/Shibboleth IDEM o SPID). Profilo pre-verificato.",
    category: 'authentication',
    status: 'beta',
    iconEmoji: '🎓',
  },

  // — Export
  {
    id: 'europass-export',
    name: 'Europass',
    description:
      "Esporta il tuo profilo in formato Europass JSON-LD. Compatibile con European Digital Wallet.",
    category: 'export',
    status: 'live',
    iconEmoji: '📜',
    href: '/dashboard/student/cv',
  },
  {
    id: 'eu-wallet',
    name: 'EU Digital Wallet',
    description:
      "Ricevi le tue credenziali come Verifiable Credentials W3C (Ed25519). Portabilità cross-EU garantita.",
    category: 'export',
    status: 'live',
    iconEmoji: '🇪🇺',
    href: '/dashboard/student/credentials',
  },
  {
    id: 'open-badges-wallet',
    name: 'Open Badges',
    description:
      "Ricevi Open Badges 3.0 per ogni progetto, endorsement e stage completato. Importabili in Credly, LinkedIn, Badgr.",
    category: 'export',
    status: 'live',
    iconEmoji: '🏅',
  },

  // — Communication
  {
    id: 'calendar-sync',
    name: 'Google / Outlook Calendar',
    description:
      "Sync interview e deadline tirocinio con il tuo calendario. Notifiche automatiche.",
    category: 'scheduling',
    status: 'live',
    iconEmoji: '📅',
  },
]

/* ────────────────────────────────────────────────────────────────── */
/* Per-role accessor                                                  */
/* ────────────────────────────────────────────────────────────────── */

export function integrationsForRole(role: IntegrationRole): Integration[] {
  switch (role) {
    case 'student':    return STUDENT_INTEGRATIONS
    case 'recruiter':  return RECRUITER_INTEGRATIONS
    case 'university': return UNIVERSITY_INTEGRATIONS
  }
}

/* ────────────────────────────────────────────────────────────────── */
/* Category labels (Italian-first, EN fallback)                       */
/* ────────────────────────────────────────────────────────────────── */

export const CATEGORY_LABELS_IT: Record<string, string> = {
  'student-information': 'Sistema informativo studenti',
  'compliance': 'Compliance ministeriale',
  'credentials': 'Credenziali digitali',
  'mobility': 'Mobilità internazionale',
  'standards': 'Standard EU',
  'authentication': 'Autenticazione e SSO',
  'communication': 'Comunicazione',
  'documents': 'Firma e documenti',
  'ai': 'AI agents',
  'ats': 'Applicant Tracking Systems',
  'crm': 'CRM',
  'scheduling': 'Calendario',
  'video': 'Video call',
  'job-boards': 'Job board',
  'profile-import': 'Import del profilo',
  'storage': 'Storage cloud',
  'export': 'Export e portabilità',
}

export const CATEGORY_LABELS_EN: Record<string, string> = {
  'student-information': 'Student information systems',
  'compliance': 'Ministerial compliance',
  'credentials': 'Digital credentials',
  'mobility': 'International mobility',
  'standards': 'EU standards',
  'authentication': 'Authentication & SSO',
  'communication': 'Communication',
  'documents': 'Signing & documents',
  'ai': 'AI agents',
  'ats': 'Applicant Tracking Systems',
  'crm': 'CRM',
  'scheduling': 'Calendar',
  'video': 'Video call',
  'job-boards': 'Job boards',
  'profile-import': 'Profile import',
  'storage': 'Cloud storage',
  'export': 'Export & portability',
}
