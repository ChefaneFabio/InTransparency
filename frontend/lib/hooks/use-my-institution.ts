'use client'

import { useEffect, useState } from 'react'

export interface MyInstitution {
  id: string
  name: string
  slug: string
  type: string
  plan: 'CORE' | 'PREMIUM'
  city: string | null
  region: string | null
  country: string | null
  role: string | null
}

export interface UseMyInstitutionResult {
  institution: MyInstitution | null
  loading: boolean
  error: string | null
}

/**
 * Resolves the caller's primary staff institution (falling back to the
 * first available affiliation). Used by workspace pages that need the
 * institution id + plan to decide whether to show the PREMIUM upgrade
 * banner.
 */
export function useMyInstitution(): UseMyInstitutionResult {
  const [institution, setInstitution] = useState<MyInstitution | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch('/api/me/institutions')
      .then(r => (r.ok ? r.json() : Promise.reject(new Error('Failed'))))
      .then((data: { institutions?: MyInstitution[] }) => {
        if (cancelled) return
        const all = data.institutions || []
        if (!all.length) {
          setInstitution(null)
          setLoading(false)
          return
        }
        const staff = all.find(i =>
          i.role && ['INSTITUTION_ADMIN', 'INSTITUTION_STAFF', 'ACADEMIC_TUTOR'].includes(i.role)
        )
        setInstitution(staff || all[0])
        setLoading(false)
      })
      .catch(e => {
        if (cancelled) return
        setError(e.message || 'Failed to load institution')
        setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return { institution, loading, error }
}
