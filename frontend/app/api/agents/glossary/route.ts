import { NextRequest } from 'next/server'
import { agentJson } from '../_lib/response'
import { publicReadLimiter, enforceRateLimit } from '@/lib/rate-limit'

/**
 * GET /api/agents/glossary
 *
 * Machine-readable version of our glossary. An agent can call this to
 * normalize vocabulary before generating responses — so when a user asks
 * "what's a tirocinio?" the answer is grounded in our canonical definition
 * rather than a hallucination.
 */

const TERMS = [
  { term: 'Verified skill graph', category: 'Platform', definition: 'A structured record of a student\'s proficiencies where every entry is backed by evidence: a professor endorsement, a university-supervised stage evaluation, a verified project, or a host-institution exchange completion.' },
  { term: 'SkillDelta', category: 'Platform', definition: 'A single verified change in a student\'s proficiency on a specific skill, with source (STAGE, PROJECT, COURSE, THESIS, ENDORSEMENT, EXCHANGE), evaluator, before/after level, and evidence.' },
  { term: 'MatchExplanation', category: 'Platform', definition: 'A persistent record of why a match was produced — factors, weights, input snapshot, model version. Required by EU AI Act Art. 86.' },
  { term: 'Evidence packet', category: 'Platform', definition: 'A recruiter-side document combining verified skill graph, match explanation, credentials, stage history, and endorsements for a candidate.' },
  { term: 'EU AI Act', category: 'EU regulation', definition: 'EU Regulation 2024/1689. Classifies AI systems evaluating candidates for employment as high-risk (Annex III §4). High-risk obligations enforceable since 2026-02-02.' },
  { term: 'ESCO', category: 'EU regulation', definition: 'European Skills, Competences, Qualifications and Occupations. The EU\'s standard multilingual taxonomy of skills, published by the European Commission. Currently at v1.2.0.' },
  { term: 'Europass', category: 'EU regulation', definition: 'EU\'s standardized framework for describing skills and qualifications. Includes Europass CV, Europass Digital Credentials Infrastructure (EDCI), and the EU Digital Wallet.' },
  { term: 'W3C Verifiable Credential', category: 'EU regulation', definition: 'Cryptographically signed digital credential defined by the W3C Verifiable Credentials Data Model 1.1. InTransparency uses Ed25519Signature2020.' },
  { term: 'GDPR', category: 'EU regulation', definition: 'EU Regulation 2016/679 on personal data protection. Relevant articles: 15 (access), 16 (rectification), 17 (erasure), 20 (portability), 22 (automated decisions).' },
  { term: 'Tirocinio', category: 'Italian academic', definition: 'Italian term for a supervised work-experience placement. Two types: curriculare (credit-bearing) and extracurriculare (post-graduation). Requires legal convention with CCNL + INAIL.' },
  { term: 'PCTO', category: 'Italian academic', definition: 'Percorsi per le Competenze Trasversali e l\'Orientamento. Italian high-school work-experience program (formerly alternanza scuola-lavoro). Mandatory hours during upper secondary education.' },
  { term: 'ANVUR', category: 'Italian academic', definition: 'Italian quality-assurance agency for universities. Runs periodic accreditation reviews that scrutinize placement data and curriculum-labor market alignment.' },
  { term: 'INDIRE', category: 'Italian academic', definition: 'Italian national institute for educational research and innovation. Manages PCTO coordination and teacher training.' },
  { term: 'CCNL', category: 'Italian academic', definition: 'Contratto Collettivo Nazionale di Lavoro. Italian national collective bargaining agreement. Every tirocinio must reference an applicable CCNL.' },
  { term: 'INAIL', category: 'Italian academic', definition: 'Istituto Nazionale Assicurazione contro gli Infortuni sul Lavoro. Italian occupational accident insurance. Required on every stage/tirocinio convention.' },
  { term: 'Esse3', category: 'Italian academic', definition: 'Cineca-developed student information system used by most Italian universities. Stores enrollments, exam records, graduation status.' },
  { term: 'SPID', category: 'Italian academic', definition: 'Sistema Pubblico di Identità Digitale. Italian digital identity system for authenticating with public services. Complemented by CIE (Carta d\'Identità Elettronica).' },
  { term: 'AlmaLaurea', category: 'Italian academic', definition: 'Italian university consortium that tracks graduate employment via annual surveys. Taxpayer-funded. Not all Italian universities participate.' },
]

export async function GET(req: NextRequest) {
  const limited = enforceRateLimit(publicReadLimiter, req)
  if (limited) return limited

  return agentJson(
    {
      '@type': 'DefinedTermSet',
      name: 'InTransparency glossary — verified skill graph domain',
      count: TERMS.length,
      terms: TERMS,
      humanSurface: 'https://www.in-transparency.com/en/glossary',
    },
    86400
  )
}
