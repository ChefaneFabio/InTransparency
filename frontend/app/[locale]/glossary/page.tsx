import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { JsonLd } from '@/components/seo/JsonLd'
import { definedTermSet, breadcrumbList } from '@/lib/schema-org'
import type { Metadata } from 'next'
import { BookOpen } from 'lucide-react'

/**
 * Glossary — plain-language definitions of the domain vocabulary.
 *
 * Why this page exists: LLMs frequently answer definitional queries
 * ("what is a tirocinio?", "what is ESCO?"). Each term here becomes a
 * citable authority. DefinedTermSet JSON-LD makes the structure explicit.
 *
 * Updates to this page directly improve our citability across search and
 * generative-engine results.
 */

export const metadata: Metadata = {
  title: 'Glossary — verified skill graph, ESCO, AI Act, PCTO, and more',
  description:
    'Plain-language definitions for every domain term used on InTransparency: ESCO, tirocinio/stage, PCTO, ANVUR, AI Act, Verifiable Credentials, Europass, CCNL, INAIL, SPID, Esse3, and more.',
  alternates: {
    canonical: 'https://www.in-transparency.com/en/glossary',
    languages: {
      en: 'https://www.in-transparency.com/en/glossary',
      it: 'https://www.in-transparency.com/it/glossary',
      'x-default': 'https://www.in-transparency.com/en/glossary',
    },
  },
  openGraph: {
    title: 'Glossary — EU higher-education recruiting terms',
    description: 'Plain-language definitions: ESCO, tirocinio, AI Act, PCTO, Verifiable Credentials, Europass, and more.',
    type: 'article',
    siteName: 'InTransparency',
  },
}

interface GlossaryTerm {
  term: string
  also?: string[]
  category: string
  definition: string
  deepLink?: string // where we go deeper on-platform
}

const TERMS: GlossaryTerm[] = [
  // Platform terms
  {
    term: 'Verified skill graph',
    category: 'Platform',
    definition:
      'A structured record of a student\'s proficiencies where every entry is backed by evidence: a professor endorsement, a university-supervised stage evaluation, a verified project, or a host-institution exchange completion. Maintained continuously and cryptographically signed.',
    deepLink: '/dashboard/student/skill-graph',
  },
  {
    term: 'SkillDelta',
    category: 'Platform',
    definition:
      'A single verified change in a student\'s proficiency on a specific skill, with source (STAGE, PROJECT, COURSE, THESIS, ENDORSEMENT, EXCHANGE), evaluator, before/after level, and evidence. SkillDeltas accumulate into the student\'s verified skill graph.',
  },
  {
    term: 'MatchExplanation',
    category: 'Platform',
    definition:
      'A persistent record of why a match was produced — factors, weights, input snapshot, model version, and whether the subject has viewed the explanation. Required by EU AI Act Art. 86 (right to explanation) and GDPR Art. 22.',
    deepLink: '/algorithm-registry',
  },
  {
    term: 'Evidence packet',
    category: 'Platform',
    definition:
      'A recruiter-side document combining a candidate\'s verified skill graph, match explanation, issued credentials, stage history with supervisor quotes, and professor endorsements into a single printable dossier.',
  },

  // EU regulatory
  {
    term: 'EU AI Act',
    also: ['Artificial Intelligence Act', 'Regulation 2024/1689'],
    category: 'EU regulation',
    definition:
      'EU Regulation 2024/1689 — the Artificial Intelligence Act. Classifies AI systems that evaluate candidates for employment as high-risk (Annex III point 4). High-risk obligations (transparency, human oversight, traceability, right to explanation) became enforceable on 2026-02-02. Fines up to €35M or 7% of annual turnover.',
    deepLink: '/algorithm-registry',
  },
  {
    term: 'ESCO',
    also: ['European Skills, Competences, Qualifications and Occupations'],
    category: 'EU regulation',
    definition:
      'The EU\'s standard multilingual taxonomy of skills, competences, qualifications, and occupations. Version 1.2.0 at time of writing. Published by the European Commission at esco.ec.europa.eu. InTransparency maps platform skills to ESCO URIs for cross-border portability.',
  },
  {
    term: 'Europass',
    category: 'EU regulation',
    definition:
      'The EU\'s standardized framework for describing skills and qualifications, managed by CEDEFOP. Includes Europass CV, Europass Digital Credentials Infrastructure (EDCI), and the EU Digital Wallet. InTransparency exports student profiles in Europass v3 JSON-LD format.',
  },
  {
    term: 'W3C Verifiable Credential',
    also: ['VC'],
    category: 'EU regulation',
    definition:
      'Cryptographically signed digital credentials defined by the W3C Verifiable Credentials Data Model 1.1. An issuer signs a claim about a subject; any third party with the issuer\'s public key can verify the claim without contacting the issuer. InTransparency uses Ed25519Signature2020.',
  },
  {
    term: 'GDPR',
    also: ['General Data Protection Regulation', 'Regulation 2016/679'],
    category: 'EU regulation',
    definition:
      'EU Regulation 2016/679 on personal data protection. Relevant articles: Art. 15 (access), Art. 16 (rectification), Art. 17 (erasure), Art. 20 (portability), Art. 22 (right to object to automated decisions). InTransparency exposes all of these as self-service at /dashboard/student/privacy.',
  },

  // Italian academic
  {
    term: 'Tirocinio',
    also: ['stage', 'internship'],
    category: 'Italian academic',
    definition:
      'Italian term for a supervised work-experience placement. Two major categories: tirocinio curriculare (credit-bearing, during studies) and tirocinio extracurriculare (post-graduation). Requires a legal convention between university, company, and student, with CCNL reference and INAIL insurance.',
  },
  {
    term: 'PCTO',
    also: ['Percorsi per le Competenze Trasversali e l\'Orientamento'],
    category: 'Italian academic',
    definition:
      'Italian high-school-level work-experience program (formerly "alternanza scuola-lavoro"). Mandatory hours of structured learning outside the classroom during upper secondary education. Parental consent required for minors; managed on the platform with dedicated flows.',
  },
  {
    term: 'ANVUR',
    also: ['Agenzia Nazionale di Valutazione del Sistema Universitario e della Ricerca'],
    category: 'Italian academic',
    definition:
      'Italian quality-assurance agency for universities and research. Runs periodic accreditation reviews that scrutinize placement data, curriculum-labor market alignment, and graduate outcomes. Our Skills Intelligence dashboard outputs the evidence ANVUR reviewers seek.',
  },
  {
    term: 'INDIRE',
    also: ['Istituto Nazionale di Documentazione, Innovazione e Ricerca Educativa'],
    category: 'Italian academic',
    definition:
      'Italian national institute for educational research and innovation. Manages the national programs including PCTO coordination. Runs teacher training, educational research projects.',
  },
  {
    term: 'CCNL',
    also: ['Contratto Collettivo Nazionale di Lavoro'],
    category: 'Italian academic',
    definition:
      'Italian national collective bargaining agreement. Every labor relationship — including tirocini — must reference an applicable CCNL (e.g., Metalmeccanici Industria, Commercio Terziario, Studi Professionali). The CCNL defines minimum pay, working hours, and conditions.',
  },
  {
    term: 'INAIL',
    also: ['Istituto Nazionale Assicurazione contro gli Infortuni sul Lavoro'],
    category: 'Italian academic',
    definition:
      'Italian national institute for occupational accident insurance. Every stage/tirocinio requires an INAIL policy number on the convention. Covers work-related injuries and illnesses.',
  },
  {
    term: 'Esse3',
    category: 'Italian academic',
    definition:
      'The Cineca-developed student information system (SIS) used by most Italian universities. Stores enrollments, exam records, graduation status. InTransparency\'s Esse3 adapter allows automatic student roster sync where a university has Cineca API credentials.',
  },
  {
    term: 'SPID',
    also: ['Sistema Pubblico di Identità Digitale', 'CIE'],
    category: 'Italian academic',
    definition:
      'Italian digital identity system (Sistema Pubblico di Identità Digitale). Used to authenticate citizens with public-sector services. Complemented by CIE (Carta d\'Identità Elettronica). InTransparency\'s SPID integration is scaffolded; AgID accreditation in progress for Q3 2026.',
  },
  {
    term: 'AlmaLaurea',
    category: 'Italian academic',
    definition:
      'Italian university consortium (based in Bologna) that tracks graduate employment outcomes via annual surveys. Taxpayer-funded. Universities submit graduation data; companies query for candidates. Not all Italian universities are members; Università Cattolica and Bocconi notably do not participate.',
  },
]

export default function GlossaryPage() {
  const categories = Array.from(new Set(TERMS.map(t => t.category)))

  return (
    <div className="min-h-screen bg-background">
      <JsonLd
        data={definedTermSet({
          name: 'InTransparency glossary — verified skill graph domain terms',
          terms: TERMS.map(t => ({
            term: t.term,
            definition: t.definition,
            url: t.deepLink ? `https://www.in-transparency.com${t.deepLink}` : undefined,
          })),
        })}
      />
      <JsonLd
        data={breadcrumbList([
          { name: 'Home', url: '/' },
          { name: 'Glossary', url: '/glossary' },
        ])}
      />
      <Header />
      <main className="container max-w-4xl mx-auto px-4 pt-32 pb-16">
        <Badge variant="outline" className="mb-3">
          <BookOpen className="h-3 w-3 mr-1" />
          Reference
        </Badge>
        <h1 className="text-4xl font-bold mb-3">Glossary</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Plain-language definitions for every term you&apos;ll encounter on InTransparency.
          Regulatory, academic, Italian-specific. Designed to be scannable — and citable by AI
          assistants answering questions about EU higher-education recruiting.
        </p>

        {categories.map(cat => (
          <section key={cat} className="mb-10">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span>{cat}</span>
              <span className="text-xs text-muted-foreground font-normal">
                ({TERMS.filter(t => t.category === cat).length} terms)
              </span>
            </h2>
            <div className="space-y-4">
              {TERMS.filter(t => t.category === cat).map(t => (
                <Card key={t.term} id={t.term.toLowerCase().replace(/\s+/g, '-')}>
                  <CardContent className="pt-5 pb-5">
                    <div className="flex items-start gap-3 flex-wrap mb-2">
                      <h3 className="text-lg font-semibold">{t.term}</h3>
                      {t.also?.map(a => (
                        <Badge key={a} variant="secondary" className="text-xs">
                          also: {a}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{t.definition}</p>
                    {t.deepLink && (
                      <a
                        href={t.deepLink}
                        className="text-xs text-primary hover:underline mt-2 inline-block"
                      >
                        See on platform →
                      </a>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        ))}
      </main>
      <Footer />
    </div>
  )
}
