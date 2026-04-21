/**
 * Locale-aware content for the "Why now" longform piece.
 *
 * Content lives here (not in messages/*.json) because:
 *   1. It's long-form prose, not UI strings
 *   2. It's authored in prose, not key-by-key
 *   3. It changes together — we update the English piece + Italian piece
 *      in the same commit so they stay synchronized
 *
 * Locale falls back to English if the key isn't present.
 */

export type Locale = 'en' | 'it'

export interface WhyNowContent {
  metaTitle: string
  metaDescription: string
  ogTitle: string
  heroBadge: string
  h1: string
  intro: string
  sections: Array<{
    h2: string
    paragraphs: string[]
    bullets?: string[]
    closing?: string
  }>
  callToActionCard: {
    h3: string
    listLead: string
    steps: string[]
    primaryCta: string
    secondaryCta: string
  }
  reviewedFootnote: string
  jsonLdHeadline: string
  jsonLdDescription: string
}

const en: WhyNowContent = {
  metaTitle: 'Why Italian universities need a verified skill graph — 2026 inflection',
  metaDescription:
    'The EU AI Act is already enforceable for employment AI. ANVUR cycles demand placement evidence. PCTO compliance has legal weight. Manual tracking costs universities 1+ FTE per 10k students. Here is what changed in 2026 and why verified credentials are no longer optional.',
  ogTitle: 'Why now — the 2026 inflection for university recruiting infrastructure',
  heroBadge: 'The 2026 inflection',
  h1: 'Why Italian universities need a verified skill graph — now',
  intro:
    'This is a plain-language brief for rectors, career-service directors, and faculty curriculum committees. If you make one infrastructure decision this academic year, it should be about verified credentials. Here\'s the why, backed by dates and regulations.',
  sections: [
    {
      h2: '1. The EU AI Act is enforceable for employment AI today',
      paragraphs: [
        'Regulation (EU) 2024/1689 — the AI Act — classifies AI systems used to evaluate candidates for employment as high-risk under Annex III, point 4. High-risk AI obligations entered into force on 2 February 2026. Key duties:',
      ],
      bullets: [
        'Transparency on the system\'s purpose, inputs, and limitations',
        'Human oversight in place, with authority to override',
        'Traceability / audit logs of decisions',
        'Right to explanation for affected individuals (Art. 86)',
        'Data governance (Art. 10) — training data lineage + bias testing',
      ],
      closing:
        'What this means for universities: if your career service uses or recommends any matching tool — including third-party recruiter platforms — that doesn\'t meet these obligations, your institution is exposed. The enforcement regime and fines (up to €35M or 7% of annual turnover) target both providers and institutional deployers.',
    },
    {
      h2: '2. ANVUR cycles demand evidence career services don\'t have',
      paragraphs: [
        'Italian universities face periodic ANVUR evaluations for accreditation. The quality of placement data, curriculum-to-labour-market alignment, and documented stage outcomes factor into the final scoring. The gap between what reviewers want and what most career services can produce is widening every year:',
      ],
      bullets: [
        'Placement data freshness — end-of-year surveys with 15% response rates yield data 6–12 months stale by submission',
        'Skills alignment evidence — hard to produce without a verified skill graph and labour-market overlay',
        'Stage outcomes documentation — paper-based conventions and email chains don\'t survive the audit',
      ],
      closing:
        'InTransparency\'s Skills Intelligence dashboard produces the exact evidence reviewers look for: program-level gap indices, alignment scores, 12-month trends, stage→hire conversion, time-to-placement. Export-ready.',
    },
    {
      h2: '3. Manual tracking costs more than you think',
      paragraphs: [
        'We modelled the cost of running an Italian career service without verified-credential infrastructure. For a typical 10,000-student university with 5 FTE career staff and 120 events/year, the hidden costs break down as:',
      ],
      bullets: [
        '~4,000 staff hours/year on manual placement tracking, stage paperwork, survey chasing, event logistics',
        '~€116,000/year in fully-loaded labour costs reallocable to higher-value work',
        '€8,000+/year in subscription costs for placement tools and survey platforms',
      ],
      closing:
        'InTransparency is free for universities. The platform is funded by employers who pay for verified-evidence matching — universities reclaim budget and time in the same motion.',
    },
    {
      h2: '4. Reputation is the long-term dividend',
      paragraphs: [
        'Every verified student profile carries the issuing university\'s signature — and continues to carry it into every employer ATS, every Ph.D. application, every EU Digital Wallet for the rest of the student\'s career. Your institution\'s name becomes portable proof of rigor across 27 EU countries.',
        'In parallel, international ranking bodies — QS Graduate Employability, THE impact scores, U-Multirank — are rapidly shifting weight toward verified placement outcomes. A university that can produce verified data today has a compounding advantage over one that starts from surveys.',
        'Prospective students and parents read employability stats. A public university scorecard with verifiable projects, verifiable endorsements, and verifiable placements is the most credible recruitment asset you can publish.',
      ],
    },
  ],
  callToActionCard: {
    h3: 'What to do in the next 30 days',
    listLead: '',
    steps: [
      'Audit your current matching tools for AI Act compliance. If your career service recommends third-party recruiter platforms, check their algorithm disclosures. If there are none, you\'re exposed.',
      'Quantify your manual overhead — use our calculator or your own numbers. The opportunity cost is almost always higher than leaders assume.',
      'Book a pilot conversation. InTransparency is free for universities, ESCO-mapped, AI-Act-native. A pilot is a 30-day commitment with no vendor lock-in.',
    ],
    primaryCta: 'Book a pilot conversation',
    secondaryCta: 'Read our compliance registry',
  },
  reviewedFootnote:
    'Last reviewed: 2026-04-19. This page is intentionally static and cite-friendly. For regulatory questions, email info@in-transparency.com.',
  jsonLdHeadline: 'Why Italian universities need a verified skill graph — 2026 inflection',
  jsonLdDescription:
    'The EU AI Act is already enforceable for employment AI. ANVUR cycles demand placement evidence. PCTO compliance has legal weight.',
}

const it: WhyNowContent = {
  metaTitle: 'Perché gli atenei italiani hanno bisogno di un grafico di competenze verificato — il punto di svolta del 2026',
  metaDescription:
    'L\'AI Act europeo è già in vigore per l\'IA nell\'occupazione. I cicli ANVUR richiedono prove di placement. La conformità PCTO ha peso legale. Il tracciamento manuale costa agli atenei 1+ FTE ogni 10.000 studenti. Ecco cosa è cambiato nel 2026 e perché le credenziali verificate non sono più opzionali.',
  ogTitle: 'Perché ora — il punto di svolta 2026 per l\'infrastruttura di recruiting universitaria',
  heroBadge: 'Il punto di svolta del 2026',
  h1: 'Perché gli atenei italiani hanno bisogno di un grafico di competenze verificato — ora',
  intro:
    'Questo è un brief in linguaggio semplice per rettori, direttori dei career service e commissioni curriculari. Se c\'è una decisione infrastrutturale da prendere in questo anno accademico, riguarda le credenziali verificate. Ecco il perché, con date e regolamenti alla mano.',
  sections: [
    {
      h2: '1. L\'AI Act europeo è già applicabile all\'IA nell\'occupazione',
      paragraphs: [
        'Il Regolamento (UE) 2024/1689 — l\'AI Act — classifica i sistemi di IA utilizzati per valutare candidati per l\'occupazione come ad alto rischio ai sensi dell\'Allegato III, punto 4. Gli obblighi per IA ad alto rischio sono entrati in vigore il 2 febbraio 2026. Doveri chiave:',
      ],
      bullets: [
        'Trasparenza su scopo, input e limiti del sistema',
        'Supervisione umana attiva, con autorità di override',
        'Tracciabilità / audit log delle decisioni',
        'Diritto alla spiegazione per gli interessati (Art. 86)',
        'Governance dei dati (Art. 10) — lineage dei dati di training + test di bias',
      ],
      closing:
        'Cosa significa per gli atenei: se il vostro career service utilizza o raccomanda strumenti di matching — inclusi portali terzi di recruiter — che non rispettano questi obblighi, la vostra istituzione è esposta. Il regime sanzionatorio (fino a €35M o 7% del fatturato annuo) colpisce sia i fornitori che chi distribuisce il sistema.',
    },
    {
      h2: '2. I cicli ANVUR richiedono evidenze che i career service non hanno',
      paragraphs: [
        'Gli atenei italiani affrontano valutazioni ANVUR periodiche per l\'accreditamento. La qualità dei dati di placement, l\'allineamento curriculum-mercato del lavoro e la documentazione degli esiti degli stage incidono sul punteggio finale. Il divario tra ciò che i valutatori cercano e ciò che i career service riescono a produrre si allarga ogni anno:',
      ],
      bullets: [
        'Freschezza dei dati di placement — survey di fine anno con 15% di risposta producono dati vecchi di 6-12 mesi',
        'Evidenze di allineamento delle competenze — difficili da produrre senza un grafico di competenze verificato e overlay sul mercato',
        'Documentazione degli esiti di stage — convenzioni su carta e catene di email non reggono all\'audit',
      ],
      closing:
        'La dashboard Skills Intelligence di InTransparency produce esattamente le evidenze richieste: indici di gap per corso di laurea, punteggi di allineamento, trend a 12 mesi, conversione stage→assunzione, tempo al placement. Pronte per l\'export.',
    },
    {
      h2: '3. Il tracciamento manuale costa più di quanto pensiate',
      paragraphs: [
        'Abbiamo modellato il costo di gestire un career service italiano senza infrastruttura di credenziali verificate. Per un ateneo-tipo da 10.000 studenti con 5 FTE career staff e 120 eventi/anno, i costi nascosti si scompongono così:',
      ],
      bullets: [
        '~4.000 ore staff/anno su tracciamento placement manuale, pratiche stage, solleciti survey, logistica eventi',
        '~€116.000/anno in costi del lavoro pienamente caricati riallocabili ad attività a maggior valore',
        '€8.000+/anno in abbonamenti a strumenti di placement e piattaforme di survey',
      ],
      closing:
        'InTransparency è gratuito per gli atenei. La piattaforma è finanziata dalle aziende che pagano per un matching basato su evidenze verificate — gli atenei recuperano budget e tempo nello stesso gesto.',
    },
    {
      h2: '4. La reputazione è il dividendo di lungo termine',
      paragraphs: [
        'Ogni profilo studente verificato porta la firma dell\'ateneo emittente — e continua a portarla in ogni ATS aziendale, ogni candidatura PhD, ogni EU Digital Wallet per tutta la carriera dello studente. Il nome della vostra istituzione diventa prova portabile di rigore in 27 paesi UE.',
        'In parallelo, gli enti di ranking internazionali — QS Graduate Employability, THE impact scores, U-Multirank — stanno rapidamente spostando peso verso gli esiti di placement verificati. Un ateneo che oggi produce dati verificati ha un vantaggio composto rispetto a chi parte dalle survey.',
        'Studenti prospect e genitori leggono le statistiche di occupabilità. Una scorecard pubblica d\'ateneo con progetti verificabili, endorsement verificabili e placement verificabili è l\'asset di recruitment più credibile che possiate pubblicare.',
      ],
    },
  ],
  callToActionCard: {
    h3: 'Cosa fare nei prossimi 30 giorni',
    listLead: '',
    steps: [
      'Fate l\'audit degli strumenti di matching attualmente in uso per verificarne la conformità all\'AI Act. Se il career service raccomanda piattaforme recruiter di terze parti, controllate le loro disclosure algoritmiche. Se non ci sono, siete esposti.',
      'Quantificate il vostro overhead manuale — usate il nostro calcolatore o i vostri numeri. Il costo-opportunità è quasi sempre più alto di quanto i leader immaginino.',
      'Prenotate una conversazione pilota. InTransparency è gratuito per gli atenei, ESCO-mapped, AI-Act-native. Un pilota è un impegno di 30 giorni senza vendor lock-in.',
    ],
    primaryCta: 'Prenota una conversazione pilota',
    secondaryCta: 'Leggi il nostro registro di conformità',
  },
  reviewedFootnote:
    'Ultima revisione: 2026-04-19. Questa pagina è intenzionalmente statica e citabile. Per domande regolatorie: info@in-transparency.com.',
  jsonLdHeadline: 'Perché gli atenei italiani hanno bisogno di un grafico di competenze verificato — punto di svolta 2026',
  jsonLdDescription:
    'L\'AI Act europeo è già applicabile all\'IA nell\'occupazione. I cicli ANVUR richiedono evidenze di placement. La conformità PCTO ha peso legale.',
}

const CONTENT: Record<Locale, WhyNowContent> = { en, it }

export function getWhyNowContent(locale: string): WhyNowContent {
  return CONTENT[(locale as Locale)] ?? CONTENT.en
}
