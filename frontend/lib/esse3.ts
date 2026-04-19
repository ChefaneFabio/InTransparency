/**
 * Esse3 adapter — Italian university student record system.
 *
 * Esse3 (by Cineca) is the de-facto SIS for most Italian public and private
 * universities. When a university signs up with InTransparency, connecting
 * Esse3 lets us auto-import student records instead of asking career services
 * to manually export CSVs.
 *
 * Integration model: each university provides a Cineca API endpoint + service
 * account. We authenticate, pull the list of enrolled students, and keep it
 * synced nightly.
 *
 * Status: INTERFACE ONLY. Real implementation requires per-university API
 * credentials and Cineca's cooperation. UI surfaces "Esse3 connection" as a
 * setup step on the university dashboard.
 */

export interface Esse3Student {
  matricola: string // Student ID
  codiceFiscale?: string
  firstName: string
  lastName: string
  email: string
  degreeCode?: string // Corso di laurea code
  degreeName?: string
  enrollmentYear?: number
  academicYear?: string // e.g. "2025/2026"
  status?: 'ENROLLED' | 'GRADUATED' | 'WITHDRAWN'
}

export interface Esse3Config {
  baseUrl: string // e.g. https://esse3.university.it/api
  clientId: string
  clientSecret: string
  universityName: string
}

/**
 * STUB — when credentials are provisioned, this fetches enrolled students
 * and upserts them to the platform. For now, documents the signature.
 */
export async function syncStudentsFromEsse3(
  _config: Esse3Config
): Promise<{ imported: number; updated: number; errors: string[] }> {
  throw new Error(
    'Esse3 integration is not yet wired. Connect your Cineca API credentials in the university dashboard.'
  )
}

/**
 * Check whether a university has an Esse3 connection configured.
 * Reads from UniversitySettings.integrations JSON field.
 */
export function hasEsse3Connection(universitySettings: { integrations?: unknown } | null): boolean {
  if (!universitySettings?.integrations) return false
  const integ = universitySettings.integrations as Record<string, unknown>
  return !!integ.esse3
}
