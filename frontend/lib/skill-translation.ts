/**
 * Skills Translation Layer
 *
 * Maps academic/Italian terminology to standardized industry terms.
 * Uses DB cache (SkillMapping) with GPT-4 fallback for unknown terms.
 * No 'use client' — server-side only.
 */

import prisma from '@/lib/prisma'
import { openai } from './openai-shared'

export interface TranslatedSkill {
  original: string
  industryTerms: string[]
  synonyms: string[]
  demandScore: number
}

/**
 * Translate a single academic skill term to industry equivalents.
 * Checks DB cache first, falls back to GPT-4 generation.
 */
export async function translateSkill(
  academicTerm: string,
  locale: string = 'en'
): Promise<TranslatedSkill> {
  const normalized = academicTerm.trim().toLowerCase()

  // 1. Check DB cache
  const cached = await prisma.skillMapping.findUnique({
    where: { academicTerm_locale: { academicTerm: normalized, locale } },
  })

  if (cached) {
    return {
      original: academicTerm,
      industryTerms: cached.industryTerms,
      synonyms: cached.synonyms,
      demandScore: cached.demandScore,
    }
  }

  // 2. GPT-4 fallback
  const generated = await generateSkillMapping(academicTerm, locale)

  // 3. Cache in DB
  try {
    await prisma.skillMapping.create({
      data: {
        academicTerm: normalized,
        industryTerms: generated.industryTerms,
        synonyms: generated.synonyms,
        locale,
        aiGenerated: true,
        demandScore: 0, // Will be updated by demand score job
      },
    })
  } catch {
    // Unique constraint race condition — ignore
  }

  return {
    original: academicTerm,
    industryTerms: generated.industryTerms,
    synonyms: generated.synonyms,
    demandScore: 0,
  }
}

/**
 * Batch translate multiple skills.
 */
export async function translateSkills(
  skills: string[],
  locale: string = 'en'
): Promise<TranslatedSkill[]> {
  const results: TranslatedSkill[] = []
  // Deduplicate
  const unique = Array.from(new Set(skills.map((s) => s.trim()).filter(Boolean)))

  // Batch DB lookup
  const normalized = unique.map((s) => s.toLowerCase())
  const cached = await prisma.skillMapping.findMany({
    where: { academicTerm: { in: normalized }, locale },
  })

  const cacheMap = new Map(cached.map((c) => [c.academicTerm, c]))

  for (const skill of unique) {
    const key = skill.toLowerCase()
    const hit = cacheMap.get(key)
    if (hit) {
      results.push({
        original: skill,
        industryTerms: hit.industryTerms,
        synonyms: hit.synonyms,
        demandScore: hit.demandScore,
      })
    } else {
      // Generate one at a time to avoid rate limits
      const translated = await translateSkill(skill, locale)
      results.push(translated)
    }
  }

  return results
}

/**
 * Use GPT-4 to map an academic term to industry equivalents.
 */
export async function generateSkillMapping(
  term: string,
  locale: string = 'en'
): Promise<{ industryTerms: string[]; synonyms: string[] }> {
  if (!openai) {
    // Fallback: return term as-is
    return { industryTerms: [term], synonyms: [] }
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      response_format: { type: 'json_object' },
      temperature: 0.3,
      max_tokens: 300,
      messages: [
        {
          role: 'system',
          content: `You are a skills taxonomy expert. Given an academic skill or course term, return its industry-standard equivalents and synonyms. Return JSON: { "industryTerms": string[], "synonyms": string[] }. industryTerms = how recruiters/job postings refer to this skill. synonyms = alternate phrasings, including ${locale !== 'en' ? `translations from ${locale} to English and vice versa` : 'common abbreviations'}.`,
        },
        {
          role: 'user',
          content: `Map this academic term to industry equivalents: "${term}"`,
        },
      ],
    })

    const content = response.choices[0]?.message?.content
    if (!content) return { industryTerms: [term], synonyms: [] }

    const parsed = JSON.parse(content)
    return {
      industryTerms: Array.isArray(parsed.industryTerms) ? parsed.industryTerms : [term],
      synonyms: Array.isArray(parsed.synonyms) ? parsed.synonyms : [],
    }
  } catch {
    return { industryTerms: [term], synonyms: [] }
  }
}

/**
 * Expand a skill name using SkillMapping synonyms.
 * Returns the original + all known synonyms/industry terms.
 */
export function resolveSkillSynonyms(
  skillName: string,
  mappings: Array<{ academicTerm: string; industryTerms: string[]; synonyms: string[] }>
): string[] {
  const lower = skillName.toLowerCase()
  const result = new Set<string>([skillName])

  for (const mapping of mappings) {
    const allTerms = [
      mapping.academicTerm,
      ...mapping.industryTerms,
      ...mapping.synonyms,
    ].map((t) => t.toLowerCase())

    if (allTerms.includes(lower)) {
      result.add(mapping.academicTerm)
      for (const t of mapping.industryTerms) result.add(t)
      for (const s of mapping.synonyms) result.add(s)
    }
  }

  return Array.from(result)
}
