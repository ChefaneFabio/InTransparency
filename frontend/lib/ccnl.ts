/**
 * CCNL (Contratto Collettivo Nazionale di Lavoro) — Italian national collective
 * bargaining agreements. Conventions/tirocini must reference the correct CCNL
 * to be legally valid under Italian labor law.
 *
 * This is a curated list of the most common CCNLs encountered in entry-level
 * placements. The full Italian catalog has ~900 active agreements — universities
 * can add their own via the `extra` field in the Convention Builder.
 *
 * Source: CNEL CCNL database (https://www.cnel.it/Archivio-Contratti/Contratti-Collettivi)
 */

export interface CCNLEntry {
  code: string
  name: string
  sector: string
  notes?: string
}

export const CCNL_CATALOG: CCNLEntry[] = [
  {
    code: 'METALMECCANICI_INDUSTRIA',
    name: 'Metalmeccanici — Industria',
    sector: 'Manufacturing / Engineering',
    notes: 'Most common for engineering stages in manufacturing companies.',
  },
  {
    code: 'METALMECCANICI_ARTIGIANATO',
    name: 'Metalmeccanici — Artigianato',
    sector: 'Manufacturing / Crafts',
  },
  {
    code: 'COMMERCIO_TERZIARIO',
    name: 'Commercio / Terziario',
    sector: 'Retail / Services',
    notes: 'Covers most marketing, sales, retail internships.',
  },
  {
    code: 'STUDI_PROFESSIONALI',
    name: 'Studi Professionali',
    sector: 'Professional firms (legal, accounting, architecture)',
  },
  {
    code: 'BANCHE_ABI',
    name: 'Credito / Banche (ABI)',
    sector: 'Banking & Finance',
  },
  {
    code: 'ASSICURAZIONI_ANIA',
    name: 'Assicurazioni (ANIA)',
    sector: 'Insurance',
  },
  {
    code: 'TELECOMUNICAZIONI',
    name: 'Telecomunicazioni',
    sector: 'Telecom',
  },
  {
    code: 'INDUSTRIA_CHIMICA_FARMACEUTICA',
    name: 'Chimica / Farmaceutica — Industria',
    sector: 'Chemicals / Pharma',
  },
  {
    code: 'ALIMENTARI_INDUSTRIA',
    name: 'Alimentari — Industria',
    sector: 'Food manufacturing',
  },
  {
    code: 'EDILIZIA_INDUSTRIA',
    name: 'Edilizia — Industria',
    sector: 'Construction',
  },
  {
    code: 'AIIC_INFORMATICA',
    name: 'Informatica / ICT (Confcommercio)',
    sector: 'IT / Software',
    notes: 'Applies to many tech startups.',
  },
  {
    code: 'SANITA_PRIVATA',
    name: 'Sanità Privata (ARIS / AIOP)',
    sector: 'Private healthcare',
  },
  {
    code: 'TURISMO_CONFCOMMERCIO',
    name: 'Turismo (Confcommercio)',
    sector: 'Tourism / Hospitality',
  },
  {
    code: 'SCUOLA_PRIVATA_AGIDAE',
    name: 'Scuola Privata (AGIDAE)',
    sector: 'Private education',
  },
  {
    code: 'UNIVERSITA_PUBBLICA',
    name: 'Università (CCNL Istruzione e Ricerca)',
    sector: 'Public universities',
    notes: 'Applies when stage is at a university, not at an external partner.',
  },
  {
    code: 'AGRICOLTURA_OPERAI',
    name: 'Agricoltura — Operai',
    sector: 'Agriculture',
  },
  {
    code: 'NON_PROFIT_UNEBA',
    name: 'Non-profit (UNEBA)',
    sector: 'Third sector',
    notes: 'Social cooperatives, NGOs, foundations.',
  },
  {
    code: 'OTHER',
    name: 'Altro (specificare)',
    sector: '—',
    notes: 'When none of the above matches — specify the CCNL name in notes.',
  },
]

export function findCcnlByCode(code: string): CCNLEntry | undefined {
  return CCNL_CATALOG.find(c => c.code === code)
}
