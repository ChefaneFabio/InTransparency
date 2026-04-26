/**
 * Per-page contextual guides for the dashboard.
 *
 * Bilingual: pass `locale` to `getGuideForPath()` to get an Italian guide.
 * Italian falls back to English on any pathname not yet translated, so
 * coverage can grow incrementally without breaking the IT user.
 */

export type Locale = 'en' | 'it'

export interface PageGuide {
  /** What is this page, in one short sentence. */
  about: string
  /** Verb-led action list — "what can I do here". 3-5 bullets. */
  actions: string[]
  /** Premium-only features unlocked on this page (omit if none). */
  premium?: string[]
  /** Related pages worth a click. */
  related?: Array<{ label: string; href: string }>
  /** One pro tip — keyboard shortcut, hidden gem, etc. */
  tip?: string
}

// ────────────────────────────────────────────────────────────────────
// ITALIAN — high-traffic pages first; remaining IT calls fall back to EN.
// ────────────────────────────────────────────────────────────────────
const PAGE_GUIDES_IT: Record<string, PageGuide> = {
  // ── STUDENT ──
  '/dashboard/student': {
    about: 'La tua home — top match, attività recente, progressi del journey.',
    actions: [
      'Apri il prossimo step dal pannello journey (in basso a sinistra)',
      'Vedi i 3 lavori top consigliati dall\'AI',
      'Controlla le candidature in corso',
    ],
    related: [
      { label: 'Il tuo journey', href: '/dashboard/student/journey' },
      { label: 'Tutti i match', href: '/dashboard/student/matches' },
    ],
    tip: 'Clicca un milestone nella timeline per vedere le evidenze collegate.',
  },
  '/dashboard/student/journey': {
    about: 'Timeline visuale del tuo percorso dall\'iscrizione al primo lavoro.',
    actions: [
      'Marca i milestone completati man mano che li raggiungi',
      'Vedi le evidenze collegate a ogni milestone',
      'Usa l\'indicatore "prossimo" per sapere dove concentrarti',
    ],
    related: [
      { label: 'Auto-esplorazione', href: '/self-discovery' },
      { label: 'Skills graph', href: '/dashboard/student/skill-graph' },
    ],
  },
  '/dashboard/student/projects': {
    about: 'L\'inventario dei tuoi progetti — la base di tutte le evidenze verificate.',
    actions: [
      'Aggiungi un nuovo progetto con codice, file, media',
      'Chiedi un endorsement al professore su qualsiasi progetto',
      'Affina il framing man mano che la tua direzione si chiarisce',
    ],
    premium: ['Analisi AI illimitate (Free: 3 per progetto)'],
    related: [
      { label: 'Skills graph', href: '/dashboard/student/skill-graph' },
      { label: 'Credenziali', href: '/dashboard/student/credentials' },
    ],
    tip: 'Un progetto con un endorsement vale più di dieci senza.',
  },
  '/dashboard/student/projects/new': {
    about: 'Crea un nuovo progetto. Titolo, descrizione, disciplina, file — l\'AI estrae le competenze.',
    actions: [
      'Scegli la disciplina giusta per estrazioni AI accurate',
      'Carica codice/PDF/media che dimostrano il lavoro',
      'Aggiungi nome corso + voto se è accademico',
    ],
    tip: 'L\'URL GitHub fa il pull dei commit live + README pinnato.',
  },
  '/dashboard/student/profile': {
    about: 'La tua identità pubblica — quello che vedono i recruiter.',
    actions: [
      'Aggiungi una foto + una bio di una riga',
      'Carica un CV (o generane uno da /cv)',
      'Imposta il tuo stato (in cerca, passivo, non in cerca)',
    ],
    premium: ['URL portfolio personalizzato — tuonome.intransparency.com'],
    related: [
      { label: 'Genera CV', href: '/dashboard/student/cv' },
      { label: 'Impostazioni', href: '/dashboard/student/settings' },
    ],
  },
  '/dashboard/student/skills': {
    about: 'Le tue competenze verificate, dai progetti + corsi + endorsement.',
    actions: [
      'Sfoglia le competenze con i link alle prove',
      'Vedi competenze suggerite da aggiungere',
      'Endorsa una competenza sul profilo di un peer',
    ],
  },
  '/dashboard/student/matches': {
    about: 'Lavori consigliati dall\'AI ordinati per fit score sul tuo profilo.',
    actions: [
      'Clicca su un match per vedere il breakdown del fit score',
      'Candidati con un click — il portfolio si attacca automaticamente',
      'Salva i match per dopo dall\'icona segnalibro',
    ],
    related: [
      { label: 'Tutti i lavori', href: '/dashboard/student/jobs' },
      { label: 'Modifica fit profile', href: '/dashboard/student/fit-profile' },
    ],
    tip: 'Aggiorna il fit profile dopo ogni colloquio — affina il matching.',
  },
  '/dashboard/student/applications': {
    about: 'Tracker per ogni candidatura — stato, fase, messaggi recruiter.',
    actions: [
      'Vedi quali candidature avanzano vs ferme',
      'Apri i messaggi dei recruiter da ogni card',
      'Ritira candidature che non vuoi più',
    ],
  },
  '/dashboard/student/cv': {
    about: 'CV Europass costruito automaticamente da profilo + progetti. Download in un click.',
    actions: [
      'Scegli il formato (Europass / moderno / minimal)',
      'Rigenera dopo qualsiasi modifica al profilo',
      'Scarica come PDF o DOCX',
    ],
  },
  '/dashboard/student/upgrade': {
    about: 'Pitch Premium e checkout Stripe. Gratis se la tua università sponsorizza Premium.',
    actions: [
      'Confronta Free vs Premium',
      'Verifica se la tua istituzione sponsorizza Premium per te',
      'Inizia il trial 30 giorni — cancelli quando vuoi',
    ],
  },
  '/dashboard/student/messages': {
    about: 'Inbox delle conversazioni con i recruiter che ti hanno contattato.',
    actions: [
      'Rispondi ai recruiter che ti hanno contattato',
      'Marca le conversazioni come risolte',
      'Blocca contatti indesiderati',
    ],
  },
  '/dashboard/student/tirocinio': {
    about: 'Tracking del tirocinio — registro ore, valutazioni, scadenze.',
    actions: [
      'Logga le ore settimanalmente',
      'Invia valutazioni intermedie + finali',
      'Scarica convenzione + accordi firmati',
    ],
  },

  // ── RECRUITER ──
  '/dashboard/recruiter': {
    about: 'La tua home — action center, donut quota contatti, top candidati, AI consigli.',
    actions: [
      'Affronta gli item nell\'action center per primi',
      'Vedi i candidati top per ogni offerta aperta',
      'Controlla la quota contatti del mese',
    ],
    related: [
      { label: 'Cerca candidati', href: '/dashboard/recruiter/candidates' },
      { label: 'Pubblica offerta', href: '/dashboard/recruiter/jobs/new' },
    ],
    tip: 'Il donut mostra i contatti rimasti — la quota si resetta il 1° del mese.',
  },
  '/dashboard/recruiter/candidates': {
    about: 'Cerca profili studenti verificati. Filtra per competenze, università, fit score.',
    actions: [
      'Usa la ricerca naturale per descrivere il ruolo',
      'Filtra per disciplina, anno, università o match salvato',
      'Salva candidati per dopo (gratis, non scala dalla quota)',
      'Genera Decision Pack su qualsiasi candidato',
    ],
    premium: ['Contatti illimitati dopo i 5/mese gratis — Abbonamento €89/mese'],
    related: [
      { label: 'Ricerca AI', href: '/dashboard/recruiter/ai-talent-search' },
      { label: 'Talent match per offerta', href: '/dashboard/recruiter/talent-match' },
    ],
    tip: 'Salvare è gratis — solo l\'invio di un messaggio scala dalla quota.',
  },
  '/dashboard/recruiter/jobs': {
    about: 'Tutte le tue offerte — attive, draft, in pausa, chiuse.',
    actions: [
      'Pubblica una nuova offerta (incolla una JD esistente, l\'AI riempie il form)',
      'Attiva/chiudi un\'offerta',
      'Vedi candidature + visualizzazioni per offerta',
    ],
    related: [
      { label: 'Pubblica offerta', href: '/dashboard/recruiter/jobs/new' },
      { label: 'Pipeline (kanban)', href: '/dashboard/recruiter/pipeline' },
    ],
  },
  '/dashboard/recruiter/jobs/new': {
    about: 'Crea un\'offerta. Incolla una JD o URL — il parser AI riempie il form.',
    actions: [
      'Usa il banner "Incolla JD" per importare una descrizione esistente',
      'Oppure usa la chat conversazionale campo per campo',
      'Salva come draft per pubblicare dopo',
    ],
    tip: 'L\'import via incolla è il path più veloce — sotto i 5 secondi nella maggior parte dei casi.',
  },
  '/dashboard/recruiter/settings': {
    about: 'Identità del brand, dettagli azienda, integrazioni, notifiche. Il pulsante "Auto-fill dal dominio" riempie quasi tutto.',
    actions: [
      'Clicca "Auto-fill dal dominio" per logo + settore + descrizione',
      'Modifica la descrizione — appare su ogni offerta pubblicata',
      'Attiva solo le notifiche che ti servono',
    ],
    tip: 'Rifai il fetch del logo dopo un rebrand col pulsante "Re-fetch" sotto l\'anteprima logo.',
  },

  // ── INSTITUTION ──
  '/dashboard/university': {
    about: 'La tua home — salute placement, attività recente, azioni rapide su M1–M4.',
    actions: [
      'Rivedi gli item pendenti su Inbox / Offerte / CRM / Pipeline',
      'Apri il pannello journey per i passi setup ancora aperti',
      'Approfondisci dalle card Overview',
    ],
  },
  '/dashboard/university/students': {
    about: 'Anagrafica studenti verificati — la tua popolazione di responsabilità.',
    actions: [
      'Filtra per programma, anno, stato',
      'Aggiungi uno studente manualmente o importa CSV',
      'Approfondisci ogni studente per il portfolio completo',
    ],
    related: [
      { label: 'Import bulk', href: '/dashboard/university/students/import' },
      { label: 'Aggiungi studente', href: '/dashboard/university/students/add' },
    ],
  },
  '/dashboard/university/inbox': {
    about: 'M1 Mediation Inbox — i messaggi dei recruiter aspettano la tua approvazione qui.',
    actions: [
      'Approva un messaggio per inviarlo allo studente',
      'Modifica un messaggio prima di approvare (es. rimuovere contatti off-platform)',
      'Rifiuta messaggi che violano le regole di stage',
    ],
    tip: 'Conformità AI Act + GDPR: ogni approva/rifiuta è loggato nell\'audit trail.',
  },
  '/dashboard/university/offers': {
    about: 'M2 Moderazione Offerte — gli annunci legati alla tua istituzione aspettano l\'approvazione.',
    actions: [
      'Approva un\'offerta verificata per pubblicarla',
      'Blocca offerte che violano le tue regole',
      'Chiedi modifiche al recruiter direttamente',
    ],
  },
  '/dashboard/university/crm': {
    about: 'M3 CRM Aziende — kanban drag-and-drop dal primo contatto alla convenzione firmata.',
    actions: [
      'Trascina un\'azienda tra le fasi (lead → outreach → meeting → convenzione → attiva)',
      'Aggiungi una nuova azienda con un click',
      'Apri qualsiasi azienda per la storia completa dei touchpoint',
    ],
    premium: ['Fasi pipeline custom, viste multi-team, reporting avanzato'],
  },
  '/dashboard/university/placement-pipeline': {
    about: 'M4 Pipeline Placement — ciclo completo del tirocinio: ore, valutazioni, scadenze, convenzioni.',
    actions: [
      'Traccia placement attivi con logging ore real-time',
      'Schedula valutazioni intermedie/finali con reminder automatici',
      'Genera report di esito a fine tirocinio',
    ],
    premium: [
      'Reminder engine (automazione full, regole + cron)',
      'Generazione convenzione AI-personalizzata',
    ],
  },
  '/dashboard/university/conventions': {
    about: 'Convention Builder — genera accordi tripartiti conformi in 60 secondi.',
    actions: [
      'Scegli un template (curricolare / extracurricolare / PCTO / Erasmus)',
      'Auto-fill INAIL + CCNL dal profilo azienda',
      'Bulk-export convenzioni per firma in massa',
    ],
    premium: ['Clausole AI-personalizzate · template custom · bulk export'],
  },
  '/dashboard/university/analytics': {
    about: '7 tab di analytics: Overview, Placement, Skills Gap, Employers, Salary, Benchmark, Scorecard.',
    actions: [
      'Vedi l\'Overview per la salute top-line del placement',
      'Approfondisci Placement per breakdown per coorte',
    ],
    premium: ['Skills Gap, Employers, Salary, Benchmark, Scorecard — 5 tab avanzate'],
  },
  '/dashboard/university/audit-log': {
    about: 'Audit trail per azione. Free Core: ultimi 30 giorni. Premium: storia completa + export CSV.',
    actions: [
      'Filtra per utente, tipo azione, intervallo date',
      'Export CSV (Premium)',
      'Approfondisci ogni evento per payload completo + diff prima/dopo',
    ],
    premium: ['Storia completa oltre i 30 giorni · export CSV · accesso API'],
  },
  '/dashboard/university/assistant': {
    about: 'AI Staff Assistant — Q&A su placement, conformità, normative. 50 query/mese Free, illimitato Premium.',
    actions: [
      'Chiedi qualsiasi cosa in linguaggio naturale',
      'Cita fonti ufficiali (AI Act, GDPR, normative MIUR)',
      'Salva risposte utili come knowledge del team',
    ],
    premium: ['Query illimitate · training custom sui documenti della tua istituzione'],
  },
  '/dashboard/university/billing': {
    about: 'Free Core hero, upsell Institutional Premium e marketplace add-on.',
    actions: [
      'Conferma che il Free Core è attivo (workspace M1–M4 + AI assistant)',
      'Prova Institutional Premium con il trial 30 giorni',
      'Sfoglia 9 add-on istituzionali (white-label, SSO, MIUR pack, ATS bridge, ...)',
    ],
    related: [
      { label: 'Marketplace add-on', href: '/dashboard/university/add-ons' },
    ],
  },
}

// ────────────────────────────────────────────────────────────────────
// ENGLISH — full coverage. Italian falls back to this on any miss.
// Longest matching prefix wins, so detail pages can override the list view.
// ────────────────────────────────────────────────────────────────────
export const PAGE_GUIDES: Record<string, PageGuide> = {
  // ── STUDENT ──
  '/dashboard/student': {
    about: 'Your home base — top matches, recent activity, journey progress.',
    actions: [
      'Open the next step from your journey panel (bottom-left)',
      'Review your top-3 AI-recommended job matches',
      'Check applications progressing through company pipelines',
    ],
    related: [
      { label: 'Your journey', href: '/dashboard/student/journey' },
      { label: 'All matches', href: '/dashboard/student/matches' },
    ],
    tip: 'Click any milestone in the journey timeline to see the evidence behind it.',
  },
  '/dashboard/student/journey': {
    about: 'Visual timeline of your placement journey from enrollment to first job.',
    actions: [
      'Mark milestones complete as you achieve them',
      'See the evidence linked to each completed milestone',
      'Use the "next" indicator to know what to focus on',
    ],
    related: [
      { label: 'Self-discovery', href: '/self-discovery' },
      { label: 'Skills graph', href: '/dashboard/student/skill-graph' },
    ],
  },
  '/dashboard/student/projects': {
    about: 'Your inventory of projects — the foundation of all verified evidence.',
    actions: [
      'Add a new project with code, files, or media',
      'Request a professor endorsement on any project',
      'Edit framing as your career direction sharpens',
    ],
    premium: [
      'Unlimited AI project analyses (Free tier: 3 per project)',
    ],
    related: [
      { label: 'Skills graph', href: '/dashboard/student/skill-graph' },
      { label: 'Credentials', href: '/dashboard/student/credentials' },
    ],
    tip: 'A project with one professor endorsement counts more than ten unverified ones.',
  },
  '/dashboard/student/projects/new': {
    about: 'Create a new project. Title, description, discipline, files — the AI extracts skills automatically.',
    actions: [
      'Pick the right discipline so the AI skill-extraction is accurate',
      'Upload code/PDFs/media that demonstrate the work',
      'Add the course name + grade if it was academic',
    ],
    tip: 'GitHub URL pulls live commit data and pinned README content.',
  },
  '/dashboard/student/skill-graph': {
    about: 'Visual graph of your verified skills and how they connect.',
    actions: [
      'Drill into any skill to see which projects/courses sourced it',
      'Identify gaps the platform recommends you fill',
      'Compare your graph to job requirements you care about',
    ],
    premium: ['8 advanced analytics dashboards · forecast view · gap heatmap'],
  },
  '/dashboard/student/matches': {
    about: 'AI-recommended jobs ranked by fit score against your profile.',
    actions: [
      'Click into any match to see the fit-score breakdown',
      'Apply with one click — your portfolio attaches automatically',
      'Save matches for later from the bookmark icon',
    ],
    related: [
      { label: 'All jobs', href: '/dashboard/student/jobs' },
      { label: 'Edit fit profile', href: '/dashboard/student/fit-profile' },
    ],
    tip: 'Update your fit profile after every interview — it sharpens the matching.',
  },
  '/dashboard/student/applications': {
    about: 'Tracker for every job you\'ve applied to — status, stage, recruiter messages.',
    actions: [
      'See which applications are progressing vs stalled',
      'Open recruiter messages from each card',
      'Withdraw applications you no longer want',
    ],
  },
  '/dashboard/student/cv': {
    about: 'Auto-built Europass CV from your profile + projects. One-click download.',
    actions: [
      'Pick the format (Europass / modern / minimal)',
      'Re-generate after any profile change',
      'Download as PDF or DOCX',
    ],
  },
  '/dashboard/student/credentials': {
    about: 'Diplomas, certificates, signed Europass credentials — your verified record.',
    actions: [
      'Upload a transcript or certificate',
      'Share a signed credential link with employers',
      'Request institution to issue a verifiable credential (W3C VC)',
    ],
  },
  '/dashboard/student/upgrade': {
    about: 'Premium pitch and Stripe checkout. Free if your university sponsors Premium.',
    actions: [
      'Compare Free vs Premium feature matrix',
      'Check if your institution sponsors Premium for you',
      'Start the 30-day free trial — cancel anytime',
    ],
  },

  // ── RECRUITER ──
  '/dashboard/recruiter': {
    about: 'Your home — daily action center, contact-quota donut, top candidates, AI recommendations.',
    actions: [
      'Tackle items in the action center first',
      'Review top recommended candidates per open job',
      'Check your contact-quota usage for the month',
    ],
    related: [
      { label: 'Search candidates', href: '/dashboard/recruiter/candidates' },
      { label: 'Post a new job', href: '/dashboard/recruiter/jobs/new' },
    ],
    tip: 'The donut shows contacts left this month — quota resets on the 1st.',
  },
  '/dashboard/recruiter/candidates': {
    about: 'Search verified student profiles. Filter by skills, university, fit score.',
    actions: [
      'Use the natural-language search bar to describe the role',
      'Filter by discipline, graduation year, university, or saved match',
      'Bookmark candidates for later contact (no quota cost)',
      'Generate Decision Pack on any candidate from their profile',
    ],
    premium: ['Unlimited contacts after 5/month free quota — €89/mo Subscription'],
    related: [
      { label: 'AI talent search', href: '/dashboard/recruiter/ai-talent-search' },
      { label: 'Talent match per job', href: '/dashboard/recruiter/talent-match' },
    ],
    tip: 'Bookmarking is free — only sending a message counts against your quota.',
  },
  '/dashboard/recruiter/candidates/[id]': {
    about: 'Full candidate detail with verified-skills ribbon, projects, endorsements, decision pack.',
    actions: [
      'Read the verified-skills ribbon for at-a-glance evidence',
      'Open projects to see actual work',
      'Generate a Decision Pack to share with the hiring committee',
      'Contact directly (uses 1 contact from your monthly quota)',
    ],
  },
  '/dashboard/recruiter/jobs': {
    about: 'All your job postings — active, draft, paused, closed.',
    actions: [
      'Post a new job (paste an existing JD and AI fills the form)',
      'Toggle a job between active and closed',
      'See applicant count + view count per job',
    ],
    related: [
      { label: 'Post a new job', href: '/dashboard/recruiter/jobs/new' },
      { label: 'Pipeline (kanban)', href: '/dashboard/recruiter/pipeline' },
    ],
  },
  '/dashboard/recruiter/jobs/new': {
    about: 'Create a job. Paste an existing JD or URL — the AI parser fills the form for you.',
    actions: [
      'Use the "Paste JD" banner to import an existing description',
      'Or use the conversational chat to walk through field-by-field',
      'Save as draft to publish later',
    ],
    tip: 'The paste-import is the fastest path — most JDs auto-fill in under 5 seconds.',
  },
  '/dashboard/recruiter/pipeline': {
    about: 'Kanban view across all your jobs (NEW → SCREENED → INTERVIEW → OFFER → HIRED).',
    actions: [
      'Drag candidates between stages',
      'Open any candidate card for full detail',
      'Filter by job, by date, or by tag',
    ],
    premium: ['Unlimited stages, custom workflows, team seats — €89/mo Subscription'],
  },
  '/dashboard/recruiter/decision-pack': {
    about: 'One-page PDF artifact summarizing all evidence for a candidate. The closing artifact for hiring committees.',
    actions: [
      'Generate a new pack for any shortlisted candidate',
      'Share via link or download as PDF',
      'Customize sections (skills, projects, endorsements, fit score)',
    ],
  },
  '/dashboard/recruiter/settings': {
    about: 'Brand identity, company details, integrations, notifications. The "auto-fill from your domain" button populates most of it.',
    actions: [
      'Click "Auto-fill from your domain" to pull logo + industry + description',
      'Edit your About text — it shows on every job posting',
      'Toggle notifications you actually want',
    ],
    tip: 'Re-fetch your logo after a rebrand by clicking "Re-fetch" under the logo preview.',
  },
  '/dashboard/recruiter/integrations': {
    about: 'Connect your existing ATS — two-way sync keeps both systems in lockstep.',
    actions: [
      'Connect Greenhouse, Lever, Workday, or Esse3',
      'Configure which fields sync in each direction',
      'Test the connection before going live',
    ],
  },

  // ── INSTITUTION ──
  '/dashboard/university': {
    about: 'Your home — placement health, recent activity, quick actions across the M1–M4 workspace.',
    actions: [
      'Review pending items across Inbox / Offers / CRM / Pipeline',
      'Open the journey panel for setup steps you haven\'t completed',
      'Drill into placement metrics from the Overview cards',
    ],
  },
  '/dashboard/university/students': {
    about: 'Verified student roster — your responsible population.',
    actions: [
      'Filter by program, year, or status',
      'Add a student manually or bulk-import via CSV',
      'Drill into any student to see their full evidence portfolio',
    ],
    related: [
      { label: 'Bulk import', href: '/dashboard/university/students/import' },
      { label: 'Add a student', href: '/dashboard/university/students/add' },
    ],
  },
  '/dashboard/university/inbox': {
    about: 'M1 Mediation Inbox — recruiter messages to your students wait here for your approval.',
    actions: [
      'Approve a message to send it to the student',
      'Edit a message before approving (e.g., to remove off-platform contact info)',
      'Reject a message that violates your stage rules',
    ],
    tip: 'AI Act + GDPR compliance: every approve/reject is logged in the audit trail.',
  },
  '/dashboard/university/offers': {
    about: 'M2 Offer Moderation — job postings tied to your institution wait for approval before students see them.',
    actions: [
      'Approve a vetted offer to publish it to students',
      'Block offers that violate stage rules or exceed your hourly caps',
      'Request changes from the recruiter directly',
    ],
  },
  '/dashboard/university/crm': {
    about: 'M3 Company CRM — drag-and-drop kanban from first contact to signed convention.',
    actions: [
      'Drag a company between stages (lead → outreach → meeting → convention → active)',
      'Add a new company with one click',
      'Open any company to see the full history of touchpoints',
    ],
    premium: ['Custom pipeline stages, multi-team views, advanced reporting'],
  },
  '/dashboard/university/placement-pipeline': {
    about: 'M4 Placement Pipeline — full tirocinio lifecycle: hours, evaluations, deadlines, conventions.',
    actions: [
      'Track active placements with real-time hours logging',
      'Schedule mid/final evaluations with auto-reminders',
      'Generate end-of-tirocinio outcome reports',
    ],
    premium: [
      'Reminder engine (full automation, rules + cron)',
      'AI-personalized convention generation',
    ],
  },
  '/dashboard/university/conventions': {
    about: 'Convention Builder — generate compliant tripartite agreements in 60 seconds.',
    actions: [
      'Pick a template (curricular / extracurricular / PCTO / Erasmus)',
      'Auto-fill INAIL + CCNL references from the company profile',
      'Bulk-export conventions for batch signature',
    ],
    premium: ['AI-personalized clauses · custom templates · bulk export'],
  },
  '/dashboard/university/analytics': {
    about: '7-tab analytics: Overview, Placement, Skills Gap, Employers, Salary, Benchmark, Scorecard.',
    actions: [
      'Review the Overview for top-line placement health',
      'Drill into Placement for cohort-level breakdowns',
    ],
    premium: [
      'Skills Gap, Employers, Salary, Benchmark, Scorecard — 5 advanced tabs',
    ],
  },
  '/dashboard/university/audit-log': {
    about: 'Per-action audit trail. Free Core: last 30 days. Premium: full history + CSV export.',
    actions: [
      'Filter by user, action type, or date range',
      'Export as CSV (Premium)',
      'Drill into any event for full payload + before/after diff',
    ],
    premium: ['Full history beyond 30 days · CSV export · API access'],
  },
  '/dashboard/university/assistant': {
    about: 'AI Staff Assistant — Q&A on placement, compliance, regulations. 50 queries/mo Free, unlimited Premium.',
    actions: [
      'Ask anything in natural language',
      'Cite official sources from the AI Act, GDPR, MIUR regulations',
      'Save useful answers as team knowledge',
    ],
    premium: ['Unlimited queries · custom training on your institution\'s docs'],
  },
  '/dashboard/university/billing': {
    about: 'Free Core hero, Institutional Premium upsell, and the add-on marketplace.',
    actions: [
      'Confirm your Free Core is active (workspace M1–M4 + AI assistant)',
      'Try Institutional Premium with the 30-day free trial',
      'Browse 9 institutional add-ons (white-label, SSO, MIUR pack, ATS bridge, ...)',
    ],
    related: [
      { label: 'Add-on marketplace', href: '/dashboard/university/add-ons' },
    ],
  },
  '/dashboard/university/add-ons': {
    about: 'Browse + buy 9 institutional add-ons à la carte.',
    actions: [
      'White-label workspace (your domain, your brand)',
      'SSO / SAML / SCIM enterprise auth',
      'ATS bridge (Esse3, U-GOV, Workday)',
      'MIUR / ANVUR compliance pack',
    ],
  },

  // ── STUDENT (extended coverage) ──
  '/dashboard/student/profile': {
    about: 'Your public-facing identity — what recruiters see.',
    actions: [
      'Add a photo + a one-line bio',
      'Upload a CV (or generate one from /cv)',
      'Set your job-search status (active, passive, not looking)',
    ],
    premium: ['Custom portfolio URL — yourname.intransparency.com'],
    related: [
      { label: 'Generate CV', href: '/dashboard/student/cv' },
      { label: 'Settings', href: '/dashboard/student/settings' },
    ],
  },
  '/dashboard/student/skills': {
    about: 'Your verified skills, sourced from projects + courses + endorsements.',
    actions: [
      'Browse skills with proof links',
      'See suggested skills to add (gap analysis)',
      'Endorse a skill on a peer\'s profile',
    ],
  },
  '/dashboard/student/skill-path': {
    about: 'Your 12-month roadmap of skills to build, ordered by ROI for your target roles.',
    actions: [
      'Pick weekly challenges that move you forward',
      'See which skills unlock which roles',
      'Track completion of each milestone',
    ],
    premium: ['Full 12-month roadmap · weekly coaching'],
  },
  '/dashboard/student/jobs': {
    about: 'Browse all open jobs across the platform — filter by anything.',
    actions: [
      'Filter by discipline, city, contract type, salary band',
      'Save jobs for later (bookmark icon)',
      'Apply directly from any card',
    ],
    related: [
      { label: 'AI matches for you', href: '/dashboard/student/matches' },
    ],
  },
  '/dashboard/student/messages': {
    about: 'Inbox of conversations with recruiters who reached out to you.',
    actions: [
      'Reply to recruiters who contacted you',
      'Mark threads as resolved',
      'Block unwanted contact (also reports to staff for institutional users)',
    ],
  },
  '/dashboard/student/fit-profile': {
    about: 'Your fit profile — values, motivations, dealbreakers — that powers job matching.',
    actions: [
      'Re-run the 6-step self-discovery to update it',
      'Edit individual sections directly',
      'Import insights from a recent interview reflection',
    ],
    related: [
      { label: 'Self-discovery', href: '/self-discovery' },
    ],
  },
  '/dashboard/student/tirocinio': {
    about: 'Internship tracking — hours log, evaluations, deadlines.',
    actions: [
      'Log hours weekly so the institution sees real-time progress',
      'Submit mid + final evaluations',
      'Download convention + signed agreements',
    ],
  },
  '/dashboard/student/analytics': {
    about: 'Profile analytics — views, recruiter engagement, search position.',
    actions: [
      'See who viewed your profile this week',
      'Identify which projects drive the most engagement',
      'Compare your visibility to your discipline median',
    ],
    premium: ['8 advanced dashboards · cohort benchmarks · recruiter intent signals'],
  },
  '/dashboard/student/settings': {
    about: 'Account settings — language, notifications, dark mode.',
    actions: [
      'Toggle notifications you want',
      'Change interface language',
      'Manage connected accounts',
    ],
  },
  '/dashboard/student/privacy': {
    about: 'Privacy controls — what\'s public, who can contact you, GDPR exports.',
    actions: [
      'Set profile visibility per audience',
      'Block specific companies from seeing you',
      'Export all your data (GDPR Art. 15)',
      'Delete your account',
    ],
    related: [
      { label: 'Audit log', href: '/dashboard/student/privacy/audit-log' },
    ],
  },
  '/dashboard/student/integrations': {
    about: 'Connect GitHub, LinkedIn, AlmaLaurea — pull verified data automatically.',
    actions: [
      'Sync GitHub commits + repos',
      'Pull AlmaLaurea profile (Italy)',
      'Import LinkedIn experience (read-only)',
    ],
  },

  // ── RECRUITER (extended coverage) ──
  '/dashboard/recruiter/analytics': {
    about: 'Recruiter analytics — funnel conversion, source-of-hire, time-to-hire.',
    actions: [
      'Identify the highest-converting source of candidates',
      'Find pipeline-stage drop-off (where candidates ghost)',
      'Compare your time-to-hire to your industry median',
    ],
  },
  '/dashboard/recruiter/messages': {
    about: 'All your conversations with candidates in one inbox.',
    actions: [
      'Reply directly from the inbox',
      'Mark threads as resolved',
      'Search past conversations',
    ],
  },
  '/dashboard/recruiter/watchlist': {
    about: 'Saved candidates — your long-term talent pool.',
    actions: [
      'Bookmark candidates for later (no contact-quota cost)',
      'Tag for filtering ("for senior backend role 2026")',
      'Bulk-message your watchlist when a relevant role opens',
    ],
  },
  '/dashboard/recruiter/talent-match': {
    about: 'AI-suggested candidates per open job, ranked by fit score.',
    actions: [
      'Open any candidate to see fit-score breakdown',
      'One-click contact (uses 1 monthly contact)',
      'Filter the suggestion engine by must-have skills',
    ],
  },
  '/dashboard/recruiter/ai-talent-search': {
    about: 'Search candidates with natural language ("Python intern with ML thesis").',
    actions: [
      'Describe the role conversationally',
      'Refine results without rebuilding filters',
      'Save searches as alerts',
    ],
  },
  '/dashboard/recruiter/interview-kit': {
    about: 'AI-generated interview questions tailored to a role + candidate.',
    actions: [
      'Pick a job to generate kit for',
      'Customize question depth (junior / mid / senior)',
      'Export as PDF for the interviewing team',
    ],
  },
  '/dashboard/recruiter/hiring-advisor': {
    about: 'Conversational AI advisor for hiring decisions, grounded in candidate evidence.',
    actions: [
      'Ask "Should I hire X?" — get evidence-based reasoning',
      'Compare two candidates side-by-side',
      'Get suggested follow-up questions for an interview',
    ],
  },
  '/dashboard/recruiter/compare': {
    about: 'Side-by-side comparison of up to 4 candidates.',
    actions: [
      'Add candidates from any list page',
      'Toggle which evidence types to compare',
      'Export the comparison as a Decision Pack',
    ],
  },
  '/dashboard/recruiter/challenges': {
    about: 'Post company challenges — open problems for students to solve as projects.',
    actions: [
      'Post a new challenge (problem statement + expected outcome)',
      'Review submissions',
      'Convert top submitters into job applicants',
    ],
  },
  '/dashboard/recruiter/followers': {
    about: 'Students who follow your company — warm leads, already interested in you.',
    actions: [
      'Browse followers',
      'Send a bulk update when a new role opens',
      'Filter by university or discipline',
    ],
  },
  '/dashboard/recruiter/company-profile': {
    about: 'Your public company page — what students see when they browse companies.',
    actions: [
      'Preview the public-facing version',
      'Edit hero + about (or use Auto-fill in /settings)',
      'Add team members + culture content',
    ],
    related: [
      { label: 'Edit brand identity', href: '/dashboard/recruiter/settings' },
    ],
  },
  '/dashboard/recruiter/university-insights': {
    about: 'Aggregated insights: which universities → best hires for us.',
    actions: [
      'See which universities consistently send strong-fit candidates',
      'Drill into one university\'s historical placements with you',
      'Reach out to career offices directly',
    ],
  },
  '/dashboard/recruiter/documents': {
    about: 'Document library — NDAs, contract templates, policy docs.',
    actions: [
      'Upload templates that auto-attach to offer emails',
      'Manage versions',
      'Share with the hiring team',
    ],
  },

  // ── INSTITUTION (extended coverage) ──
  '/dashboard/university/programs': {
    about: 'Program-level insights: curriculum alignment, career destinations, skills intelligence, exchanges.',
    actions: [
      'Pick a tab to drill into (Curriculum / Career Paths / Skills Intelligence / Exchanges)',
      'Compare program outcomes to other universities',
      'Identify curriculum gaps relative to market demand',
    ],
    premium: ['Skills Intelligence + Curriculum Alignment'],
  },
  '/dashboard/university/internship-pipeline': {
    about: 'Earlier-stage pipeline (pre-tirocinio) — active sourcing for internships.',
    actions: [
      'Track companies you\'re sourcing from',
      'Coordinate stage placements for upcoming cohorts',
    ],
  },
  '/dashboard/university/courses': {
    about: 'All courses offered — filter by department, year, professor.',
    actions: [
      'Drill into any course to see student projects + outcomes',
      'Identify courses with high vs low project completion',
    ],
  },
  '/dashboard/university/projects': {
    about: 'All student projects across the institution — quality control + verification queue.',
    actions: [
      'Filter projects awaiting professor verification',
      'Bulk-approve verified projects',
      'Identify projects flagged for review',
    ],
  },
  '/dashboard/university/employer-crm': {
    about: 'Aggregate view of employers across all program managers — cross-team visibility.',
    actions: [
      'Search any company across teams',
      'Identify orphaned accounts (no active owner)',
      'Reassign accounts to staff',
    ],
  },
  '/dashboard/university/recruiters': {
    about: 'List of recruiters who\'ve engaged with the institution.',
    actions: [
      'Filter by company, recency, engagement depth',
      'Cold-warm-hot scoring',
    ],
  },
  '/dashboard/university/alumni': {
    about: 'Alumni database — outreach for hiring + mentoring opportunities.',
    actions: [
      'Filter by graduation year, current employer, role',
      'Send bulk update / call-for-mentors',
      'Track alumni-mediated hires',
    ],
  },
  '/dashboard/university/scorecard': {
    about: 'Standardized scorecard — placement %, time-to-hire, gross outcome — for accreditation.',
    actions: [
      'View the single-page scorecard',
      'Export as PDF for ANVUR / accreditation submissions',
      'Compare year-over-year trends',
    ],
    premium: ['MIUR-format reports · custom exports'],
  },
  '/dashboard/university/board': {
    about: 'C-suite dashboard — KPIs, outcomes summary for board reporting.',
    actions: [
      'Single-page overview for the academic senate',
      'Export presentation-ready slides',
    ],
  },
  '/dashboard/university/events': {
    about: 'Manage career fairs, employer days, alumni events.',
    actions: [
      'Schedule a new event with capacity + registration',
      'Send invites to filtered student segments',
      'Track attendance + lead capture',
    ],
  },
  '/dashboard/university/communications': {
    about: 'Mass communication — newsletters, alerts, announcements to students.',
    actions: [
      'Compose a newsletter with student-segment targeting',
      'Schedule for later send',
      'Track open + click rates',
    ],
  },
  '/dashboard/university/pcto': {
    about: 'PCTO management for high schools — Italian mandatory work experience.',
    actions: [
      'Track PCTO hours per student',
      'Match students with companies in /pcto/marketplace',
      'Generate hour-completion certificates',
    ],
  },
  '/dashboard/university/orientation': {
    about: 'High-school orientation funnel — pull future students from PCTO partner schools.',
    actions: [
      'Manage orientation events',
      'Track which schools convert into matriculations',
    ],
  },
  '/dashboard/university/parental-consent': {
    about: 'Parental-consent management for under-18 students.',
    actions: [
      'Send consent requests via email',
      'Track signed vs pending',
      'Bulk-import consent forms',
    ],
  },
  '/dashboard/university/integrations': {
    about: 'Connect Esse3, U-GOV, AlmaLaurea, ANVUR, MIUR data feeds.',
    actions: [
      'Configure each connector',
      'Schedule sync frequency',
      'View last sync status + errors',
    ],
    premium: ['ATS bridge add-on (€5k setup + €1.5k/yr)'],
  },
  '/dashboard/university/settings': {
    about: 'Institution settings — branding, user permissions, regional config.',
    actions: [
      'Set the institution logo + colours',
      'Manage staff roles + permissions',
      'Configure regional defaults (CCNL, INAIL, ESCO version)',
    ],
  },
}

/**
 * Resolve a guide for the given pathname using longest-prefix matching.
 * Returns null if no match — callers should render a generic fallback.
 *
 * Italian lookup tries IT first, falls back to EN if the page hasn't been
 * translated yet — so coverage can grow incrementally.
 */
export function getGuideForPath(pathname: string, locale: Locale = 'en'): PageGuide | null {
  const tables: Record<string, PageGuide>[] =
    locale === 'it' ? [PAGE_GUIDES_IT, PAGE_GUIDES] : [PAGE_GUIDES]

  // Drop locale prefix (/it/dashboard/... → /dashboard/...)
  const stripped = pathname.replace(/^\/[a-z]{2}(?=\/)/, '')

  for (const table of tables) {
    if (table[pathname]) return table[pathname]
    if (table[stripped]) return table[stripped]
  }
  // Longest-prefix match across all tables
  const allKeys = Array.from(new Set(tables.flatMap(t => Object.keys(t)))).sort(
    (a, b) => b.length - a.length
  )
  for (const k of allKeys) {
    if (stripped.startsWith(k) || pathname.startsWith(k)) {
      // Prefer IT if available
      for (const t of tables) {
        if (t[k]) return t[k]
      }
    }
  }
  // Old fallback path (kept for safety, shouldn't reach here)
  const keys = Object.keys(PAGE_GUIDES).sort((a, b) => b.length - a.length)
  for (const k of keys) {
    if (stripped.startsWith(k) || pathname.startsWith(k)) return PAGE_GUIDES[k]
  }
  return null
}
