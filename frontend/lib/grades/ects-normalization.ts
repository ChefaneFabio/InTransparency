// ECTS Grade Normalization Utility
// Maps national grading systems to ECTS scale (A-F) and a normalized 0-100 score.
// Pure TypeScript — importable from both server and client code.

export type EctsGradeLetter = 'A' | 'B' | 'C' | 'D' | 'E' | 'F'

export interface GradeResult {
  normalizedScore: number // 0-100
  ectsGrade: EctsGradeLetter
  ectsLabel: string // "Excellent", "Very Good", "Good", "Satisfactory", "Sufficient", "Fail"
  originalGrade: string
  country: string
}

interface CountryInfo {
  code: string
  name: string
  scale: string
}

const ECTS_LABELS: Record<EctsGradeLetter, string> = {
  A: 'Excellent',
  B: 'Very Good',
  C: 'Good',
  D: 'Satisfactory',
  E: 'Sufficient',
  F: 'Fail',
}

/**
 * Given a normalized 0-100 score, return the ECTS grade letter and label.
 */
export function getEctsGrade(normalizedScore: number): { grade: EctsGradeLetter; label: string } {
  if (normalizedScore >= 85) return { grade: 'A', label: ECTS_LABELS.A }
  if (normalizedScore >= 70) return { grade: 'B', label: ECTS_LABELS.B }
  if (normalizedScore >= 55) return { grade: 'C', label: ECTS_LABELS.C }
  if (normalizedScore >= 40) return { grade: 'D', label: ECTS_LABELS.D }
  if (normalizedScore >= 20) return { grade: 'E', label: ECTS_LABELS.E }
  return { grade: 'F', label: ECTS_LABELS.F }
}

// ─── Country-specific normalizers ────────────────────────────────────────────
// Each returns a 0-100 score or null if the grade string is invalid.

const normalizeItaly = (raw: string): number | null => {
  const trimmed = raw.trim().toLowerCase()

  // Handle "30L" or "30 e lode" or "30l" variants
  if (/^30\s*[le]/i.test(trimmed) || trimmed === '30l') {
    return 100
  }

  // Handle "X/30" format
  const slashMatch = trimmed.match(/^(\d+(?:\.\d+)?)\s*\/\s*30$/)
  const numericStr = slashMatch ? slashMatch[1] : trimmed
  const value = parseFloat(numericStr)

  if (isNaN(value) || value < 18 || value > 30) return null

  // Map 18-30 to 40-100
  // 30 → 97 (not 100, that's reserved for 30L)
  // 28-30 → 85-97 (A/B range)
  // 25-27 → 70-84
  // 22-24 → 55-69
  // 18-21 → 40-54
  if (value >= 28) return 85 + ((value - 28) / 2) * 12 // 85-97
  if (value >= 25) return 70 + ((value - 25) / 2) * 14 // 70-84 (approx)
  if (value >= 22) return 55 + ((value - 22) / 2) * 14 // 55-69
  return 40 + ((value - 18) / 3) * 14 // 40-54

}

const normalizeGermany = (raw: string): number | null => {
  const value = parseFloat(raw.replace(',', '.'))
  if (isNaN(value) || value < 1.0 || value > 5.0) return null

  // Inverted scale: 1.0 best, 5.0 fail
  if (value > 4.0) return Math.max(0, 40 - (value - 4.0) * 40) // below 4.0 → fail territory
  if (value <= 1.0) return 100
  if (value <= 1.5) return 95 + (1.5 - value) * 10 // 95-100
  if (value <= 2.5) return 75 + ((2.5 - value) / 1.0) * 19 // 75-94
  if (value <= 3.5) return 55 + ((3.5 - value) / 1.0) * 19 // 55-74
  return 40 + ((4.0 - value) / 0.5) * 14 // 40-54
}

const normalizeFrance = (raw: string): number | null => {
  const slashMatch = raw.trim().match(/^(\d+(?:\.\d+)?)\s*\/\s*20$/)
  const numericStr = slashMatch ? slashMatch[1] : raw.trim()
  const value = parseFloat(numericStr)

  if (isNaN(value) || value < 0 || value > 20) return null

  if (value >= 16) return 85 + ((value - 16) / 4) * 15 // 85-100
  if (value >= 14) return 70 + ((value - 14) / 2) * 15 // 70-85
  if (value >= 12) return 55 + ((value - 12) / 2) * 15 // 55-70
  if (value >= 10) return 40 + ((value - 10) / 2) * 15 // 40-55
  return (value / 10) * 39 // 0-39
}

const normalizeSpain = (raw: string): number | null => {
  const slashMatch = raw.trim().match(/^(\d+(?:\.\d+)?)\s*\/\s*10$/)
  const numericStr = slashMatch ? slashMatch[1] : raw.trim()
  const value = parseFloat(numericStr)

  if (isNaN(value) || value < 0 || value > 10) return null

  if (value >= 9) return 90 + ((value - 9) / 1) * 10 // 90-100
  if (value >= 7) return 70 + ((value - 7) / 2) * 20 // 70-90
  if (value >= 5) return 50 + ((value - 5) / 2) * 20 // 50-70
  return (value / 5) * 49 // 0-49
}

const normalizeUK = (raw: string): number | null => {
  const trimmed = raw.trim().toLowerCase()

  // Handle class names
  if (trimmed === 'first' || trimmed === '1st') return 85
  if (trimmed === '2:1' || trimmed === 'upper second' || trimmed === '2.1') return 65
  if (trimmed === '2:2' || trimmed === 'lower second' || trimmed === '2.2') return 55
  if (trimmed === 'third' || trimmed === '3rd') return 45

  // Handle percentage
  const pctMatch = trimmed.match(/^(\d+(?:\.\d+)?)\s*%?$/)
  if (!pctMatch) return null
  const value = parseFloat(pctMatch[1])
  if (isNaN(value) || value < 0 || value > 100) return null

  // UK percentages map almost directly, but recalibrate for ECTS
  if (value >= 70) return 85 + ((value - 70) / 30) * 15 // 85-100
  if (value >= 60) return 70 + ((value - 60) / 10) * 15 // 70-85
  if (value >= 50) return 55 + ((value - 50) / 10) * 15 // 55-70
  if (value >= 40) return 40 + ((value - 40) / 10) * 15 // 40-55
  return (value / 40) * 39 // 0-39
}

const normalizeNetherlands = (raw: string): number | null => {
  const value = parseFloat(raw.replace(',', '.'))
  if (isNaN(value) || value < 1 || value > 10) return null

  if (value >= 9) return 90 + ((value - 9) / 1) * 10 // 90-100
  if (value >= 8) return 78 + ((value - 8) / 1) * 12 // 78-90
  if (value >= 7) return 65 + ((value - 7) / 1) * 13 // 65-78
  if (value >= 6) return 50 + ((value - 6) / 1) * 15 // 50-65
  return (value / 6) * 49 // below 6 → fail
}

const normalizeAustria = (raw: string): number | null => {
  const value = parseFloat(raw.replace(',', '.'))
  if (isNaN(value) || value < 1 || value > 5) return null

  // Inverted: 1 = best, 5 = fail
  const intVal = Math.round(value)
  switch (intVal) {
    case 1: return 95
    case 2: return 78
    case 3: return 62
    case 4: return 50
    case 5: return 20
    default: return null
  }
}

const normalizeSwitzerland = (raw: string): number | null => {
  const value = parseFloat(raw.replace(',', '.'))
  if (isNaN(value) || value < 1 || value > 6) return null

  if (value >= 5.5) return 90 + ((value - 5.5) / 0.5) * 10 // 90-100
  if (value >= 5.0) return 78 + ((value - 5.0) / 0.5) * 12 // 78-90
  if (value >= 4.5) return 65 + ((value - 4.5) / 0.5) * 13 // 65-78
  if (value >= 4.0) return 50 + ((value - 4.0) / 0.5) * 15 // 50-65
  return (value / 4.0) * 49 // below 4 → fail
}

const normalizePoland = (raw: string): number | null => {
  const value = parseFloat(raw.replace(',', '.'))
  if (isNaN(value) || value < 2 || value > 5) return null

  if (value >= 5) return 92
  if (value >= 4.5) return 80
  if (value >= 4) return 68
  if (value >= 3.5) return 55
  if (value >= 3) return 42
  return 20 // 2 = fail
}

// ─── Country registry ────────────────────────────────────────────────────────

type NormalizerFn = (raw: string) => number | null

const NORMALIZERS: Record<string, NormalizerFn> = {
  IT: normalizeItaly,
  DE: normalizeGermany,
  FR: normalizeFrance,
  ES: normalizeSpain,
  GB: normalizeUK,
  NL: normalizeNetherlands,
  AT: normalizeAustria,
  CH: normalizeSwitzerland,
  PL: normalizePoland,
}

const COUNTRY_INFO: CountryInfo[] = [
  { code: 'IT', name: 'Italy', scale: '18-30 (30L)' },
  { code: 'DE', name: 'Germany', scale: '1.0-5.0 (inverted)' },
  { code: 'FR', name: 'France', scale: '0-20' },
  { code: 'ES', name: 'Spain', scale: '0-10' },
  { code: 'GB', name: 'United Kingdom', scale: '0-100% / Class' },
  { code: 'NL', name: 'Netherlands', scale: '1-10' },
  { code: 'AT', name: 'Austria', scale: '1-5 (inverted)' },
  { code: 'CH', name: 'Switzerland', scale: '1-6' },
  { code: 'PL', name: 'Poland', scale: '2-5' },
]

// ─── Exported functions ──────────────────────────────────────────────────────

/**
 * Normalize a grade string from a given country to the ECTS scale.
 * Returns null if the grade or country is unsupported / invalid.
 */
export function normalizeGrade(grade: string, country: string): GradeResult | null {
  const code = country.toUpperCase()
  const normalizer = NORMALIZERS[code]
  if (!normalizer) return null

  const score = normalizer(grade)
  if (score === null) return null

  const clamped = Math.max(0, Math.min(100, Math.round(score)))
  const ects = getEctsGrade(clamped)

  return {
    normalizedScore: clamped,
    ectsGrade: ects.grade,
    ectsLabel: ects.label,
    originalGrade: grade,
    country: code,
  }
}

/**
 * Return the list of supported countries with their grading scale info.
 */
export function getSupportedCountries(): CountryInfo[] {
  return COUNTRY_INFO
}

/**
 * Format a grade for display, e.g. "28/30 (ECTS: B)"
 */
export function formatGradeDisplay(grade: string, country: string): string {
  const result = normalizeGrade(grade, country)
  if (!result) return grade
  return `${grade} (ECTS: ${result.ectsGrade})`
}
