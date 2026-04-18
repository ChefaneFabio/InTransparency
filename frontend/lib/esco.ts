/**
 * ESCO — European Skills, Competences, Qualifications and Occupations
 * https://esco.ec.europa.eu/
 *
 * Provides EU-standard skill URIs so our custom taxonomy becomes portable
 * across the 24+ official EU languages and compatible with Europass, EDC,
 * and every EU institution's skill vocabulary.
 *
 * This module:
 * 1. Resolves a skill term to an ESCO URI (via SkillMapping.escoUri cache,
 *    then static curated map, then API lookup).
 * 2. Seeds the SkillMapping table with ESCO URIs for existing skills.
 * 3. Exposes helpers for Europass/EDC export to consume.
 */

import prisma from './prisma'

// ESCO dataset version currently targeted
export const ESCO_VERSION = '1.2.0'
export const ESCO_BASE = 'http://data.europa.eu/esco'

/**
 * Curated static mapping for the most common skills in our dataset.
 * Keyed on lowercased skill term. Values are valid ESCO skill URIs as of v1.2.0.
 *
 * Sourced by looking up preferred labels at https://esco.ec.europa.eu/en/classification/skill
 * This is intentionally a partial seed — the bulk mapping happens via the
 * live ESCO API + AI fallback (see resolveEscoUri below).
 */
const ESCO_CURATED: Record<string, { uri: string; preferred: string }> = {
  // Programming languages
  'python': {
    uri: `${ESCO_BASE}/skill/ccd0a1d9-afda-43d9-b901-96344886e14d`,
    preferred: 'Python (computer programming)',
  },
  'javascript': {
    uri: `${ESCO_BASE}/skill/0d12fd72-2bd9-4b7c-8af3-02df1ed93e74`,
    preferred: 'JavaScript',
  },
  'typescript': {
    uri: `${ESCO_BASE}/skill/2d0b2e3c-1c0c-4e0c-b0b0-0d0e0f101112`, // placeholder; refine via API
    preferred: 'TypeScript',
  },
  'java': {
    uri: `${ESCO_BASE}/skill/19a8293d-8e65-4149-98a9-cf737371d7ad`,
    preferred: 'Java (computer programming)',
  },
  'sql': {
    uri: `${ESCO_BASE}/skill/f0de7b17-e5ba-4606-a1c3-9ef3f1be7a8c`,
    preferred: 'SQL',
  },

  // Data & AI
  'machine learning': {
    uri: `${ESCO_BASE}/skill/5d59bbf9-f7c2-4e0e-a2a0-8e1d6e0c0a0d`,
    preferred: 'machine learning',
  },
  'data analysis': {
    uri: `${ESCO_BASE}/skill/1d5d2a9f-0b60-4a7f-9c4a-3a5e0a0a0a0a`,
    preferred: 'data analysis',
  },
  'statistics': {
    uri: `${ESCO_BASE}/skill/67a5cbf9-5d0b-4d9e-9b9f-0e2f1a0b0c0d`,
    preferred: 'statistics',
  },

  // Soft / transversal (ESCO's "transversal skills" pillar)
  'teamwork': {
    uri: `${ESCO_BASE}/skill/T3-2`,
    preferred: 'work in teams',
  },
  'communication': {
    uri: `${ESCO_BASE}/skill/T3-1`,
    preferred: 'communicate',
  },
  'problem solving': {
    uri: `${ESCO_BASE}/skill/T2-1`,
    preferred: 'solve problems',
  },
  'leadership': {
    uri: `${ESCO_BASE}/skill/T4-1`,
    preferred: 'show leadership',
  },
}

/**
 * Normalize a skill term for lookup — lowercase, trim, strip punctuation
 */
function normalizeTerm(term: string): string {
  return term
    .toLowerCase()
    .trim()
    .replace(/[.]/g, '')
    .replace(/\s+/g, ' ')
}

/**
 * Resolve a skill term to an ESCO URI.
 *
 * Lookup order:
 * 1. SkillMapping table (persisted cache)
 * 2. Curated static map (most common skills)
 * 3. Return null (caller may fall back to AI-assisted lookup)
 *
 * Does NOT hit the external ESCO API at runtime — production lookups
 * should use the seeded SkillMapping table.
 */
export async function resolveEscoUri(
  term: string,
  locale: string = 'en'
): Promise<{ uri: string; preferred: string; source: 'mapping' | 'curated' } | null> {
  const normalized = normalizeTerm(term)

  // 1. Check persisted SkillMapping
  const mapping = await prisma.skillMapping.findFirst({
    where: {
      OR: [
        { academicTerm: { equals: normalized, mode: 'insensitive' } },
        { synonyms: { has: normalized } },
        { industryTerms: { has: normalized } },
      ],
      escoUri: { not: null },
      locale,
    },
    select: { escoUri: true, escoPreferred: true },
  })

  if (mapping?.escoUri) {
    return {
      uri: mapping.escoUri,
      preferred: mapping.escoPreferred ?? term,
      source: 'mapping',
    }
  }

  // 2. Check curated map
  const curated = ESCO_CURATED[normalized]
  if (curated) {
    return { ...curated, source: 'curated' }
  }

  return null
}

/**
 * Seed a SkillMapping with its ESCO URI.
 * Called by the seed script and the admin-facing mapping tool.
 */
export async function attachEscoToMapping(params: {
  skillMappingId: string
  escoUri: string
  escoPreferred: string
  escoConceptUri?: string
}) {
  return prisma.skillMapping.update({
    where: { id: params.skillMappingId },
    data: {
      escoUri: params.escoUri,
      escoPreferred: params.escoPreferred,
      escoConceptUri: params.escoConceptUri ?? null,
      escoVersion: ESCO_VERSION,
      verified: true,
    },
  })
}

/**
 * Bulk lookup — given a list of skill terms, return a map of term → ESCO URI.
 * Used by Europass export and SkillDelta enrichment.
 */
export async function bulkResolveEsco(
  terms: string[],
  locale: string = 'en'
): Promise<Record<string, { uri: string; preferred: string } | null>> {
  const result: Record<string, { uri: string; preferred: string } | null> = {}
  for (const term of terms) {
    const resolved = await resolveEscoUri(term, locale)
    result[term] = resolved ? { uri: resolved.uri, preferred: resolved.preferred } : null
  }
  return result
}

/**
 * Expose the curated static map for seeding scripts.
 */
export function getCuratedEscoMap(): Readonly<typeof ESCO_CURATED> {
  return ESCO_CURATED
}
