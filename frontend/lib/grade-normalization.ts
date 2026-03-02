/**
 * Grade Normalization Utility
 *
 * Converts grades from various European grading systems to a normalized 0-100 scale
 * for cross-country comparison. Pure utility — no 'use client'.
 */

export interface GradingSystemConfig {
  country: string
  name: string
  scaleMin: number
  scaleMax: number
  passThreshold: number
  inverted: boolean // true if lower number = better (e.g., Germany)
  notes: string
}

const GRADING_SYSTEMS: Record<string, GradingSystemConfig> = {
  IT: {
    country: 'IT',
    name: 'Italian System',
    scaleMin: 18,
    scaleMax: 30,
    passThreshold: 18,
    inverted: false,
    notes: 'cum laude = 100',
  },
  DE: {
    country: 'DE',
    name: 'German System',
    scaleMin: 1.0,
    scaleMax: 5.0,
    passThreshold: 4.0,
    inverted: true, // 1.0 is best
    notes: '1.0 = best, 5.0 = worst',
  },
  FR: {
    country: 'FR',
    name: 'French System',
    scaleMin: 0,
    scaleMax: 20,
    passThreshold: 10,
    inverted: false,
    notes: '20 = perfect, 16+ = très bien',
  },
  ES: {
    country: 'ES',
    name: 'Spanish System',
    scaleMin: 0,
    scaleMax: 10,
    passThreshold: 5,
    inverted: false,
    notes: '10 = matrícula de honor',
  },
  UK: {
    country: 'UK',
    name: 'UK Percentage',
    scaleMin: 0,
    scaleMax: 100,
    passThreshold: 40,
    inverted: false,
    notes: 'First = 70+, 2:1 = 60-69, 2:2 = 50-59, Third = 40-49',
  },
  NL: {
    country: 'NL',
    name: 'Dutch System',
    scaleMin: 1,
    scaleMax: 10,
    passThreshold: 5.5,
    inverted: false,
    notes: '10 = outstanding, 6 = satisfactory',
  },
}

// UK classification-based grades
const UK_CLASSIFICATIONS: Record<string, number> = {
  first: 85,
  '1st': 85,
  '2:1': 67,
  'upper second': 67,
  '2:2': 55,
  'lower second': 55,
  third: 45,
  '3rd': 45,
  pass: 42,
}

// ECTS letter grades to normalized score
const ECTS_GRADES: Record<string, number> = {
  A: 95,
  B: 82,
  C: 70,
  D: 60,
  E: 52,
  FX: 30,
  F: 15,
}

/**
 * Normalize a raw grade to a 0-100 scale for cross-country comparison.
 *
 * @param rawGrade - The grade as entered (e.g., "28", "1.3", "B+", "First")
 * @param country - ISO 3166-1 alpha-2 country code (e.g., "IT", "DE", "UK")
 * @returns Normalized score 0-100, or null if parsing fails
 */
export function normalizeGrade(rawGrade: string, country: string): number | null {
  const trimmed = rawGrade.trim()
  const upper = trimmed.toUpperCase()

  // Handle ECTS letter grades for any country
  if (ECTS_GRADES[upper] !== undefined) {
    return ECTS_GRADES[upper]
  }

  // Handle Italian "cum laude" / "30 e lode"
  if (country === 'IT') {
    if (/lode|laude/i.test(trimmed) || trimmed === '30L') {
      return 100
    }
  }

  // Handle UK classification strings
  if (country === 'UK') {
    const lowerTrimmed = trimmed.toLowerCase()
    for (const [classification, score] of Object.entries(UK_CLASSIFICATIONS)) {
      if (lowerTrimmed.includes(classification)) {
        return score
      }
    }
  }

  // Parse numeric value
  const numericMatch = trimmed.match(/[\d]+([.,]\d+)?/)
  if (!numericMatch) return null

  const numeric = parseFloat(numericMatch[0].replace(',', '.'))
  if (isNaN(numeric)) return null

  const system = GRADING_SYSTEMS[country]
  if (!system) {
    // Unknown country — if it looks like a percentage, use directly
    if (numeric >= 0 && numeric <= 100) return numeric
    return null
  }

  // Clamp to scale
  const clamped = Math.max(
    Math.min(numeric, system.inverted ? system.scaleMax : system.scaleMax),
    system.inverted ? system.scaleMin : system.scaleMin
  )

  if (system.inverted) {
    // German: 1.0 = 100, 4.0 (pass) = ~50, 5.0 = 0
    // Linear mapping: normalized = (scaleMax - grade) / (scaleMax - scaleMin) * 100
    const normalized = ((system.scaleMax - clamped) / (system.scaleMax - system.scaleMin)) * 100
    return Math.round(Math.max(0, Math.min(100, normalized)))
  }

  // Normal systems: linear mapping from [scaleMin..scaleMax] to [passNormalized..100]
  // We map the full scale to 0-100, where passThreshold maps to ~50
  const range = system.scaleMax - system.scaleMin
  if (range === 0) return null
  const normalized = ((clamped - system.scaleMin) / range) * 100
  return Math.round(Math.max(0, Math.min(100, normalized)))
}

/**
 * Format a normalized 0-100 score for display in a target country's grading system.
 *
 * @param normalized - Score on 0-100 scale
 * @param targetCountry - Country code to format for
 * @returns Formatted string (e.g., "28/30", "1.7", "15/20")
 */
export function formatGradeForDisplay(normalized: number, targetCountry: string): string {
  const system = GRADING_SYSTEMS[targetCountry]
  if (!system) return `${Math.round(normalized)}%`

  if (system.inverted) {
    // German: reverse mapping
    const grade = system.scaleMax - (normalized / 100) * (system.scaleMax - system.scaleMin)
    return `${Math.max(system.scaleMin, Math.min(system.scaleMax, grade)).toFixed(1)}`
  }

  const range = system.scaleMax - system.scaleMin
  const grade = system.scaleMin + (normalized / 100) * range

  // Country-specific formatting
  switch (targetCountry) {
    case 'IT': {
      const rounded = Math.round(grade)
      if (normalized >= 100) return '30 e lode'
      return `${rounded}/30`
    }
    case 'FR':
      return `${Math.round(grade * 2) / 2}/20`
    case 'ES':
      return `${(Math.round(grade * 10) / 10).toFixed(1)}/10`
    case 'UK':
      return `${Math.round(grade)}%`
    case 'NL':
      return `${(Math.round(grade * 10) / 10).toFixed(1)}/10`
    default:
      return `${Math.round(grade)}`
  }
}

/**
 * Get the grading system configuration for a country.
 */
export function getGradingSystemInfo(country: string): GradingSystemConfig | null {
  return GRADING_SYSTEMS[country] || null
}

/**
 * Get all supported country codes.
 */
export function getSupportedCountries(): string[] {
  return Object.keys(GRADING_SYSTEMS)
}
