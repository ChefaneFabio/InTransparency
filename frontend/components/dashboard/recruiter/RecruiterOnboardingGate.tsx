'use client'

import { useEffect, useState } from 'react'
import RecruiterOnboardingChat from './RecruiterOnboardingChat'

const ONBOARDING_DISMISSED_KEY = 'intransparency_onboarding_dismissed'
const PENDING_ENRICHMENT_KEY = 'intransparency_pending_recruiter_enrichment'

/**
 * Decides whether to show the conversational onboarding flow on the recruiter
 * dashboard. Triggers only when ALL of these are true:
 *   - The recruiter has no RecruiterSettings yet (companyName empty)
 *   - They haven't dismissed the flow this session
 *
 * Reads the seeded company name from the domain-enrichment that was stashed
 * at signup time, so the AI can open with "Set up Brembo + a first job?"
 * instead of "Tell me your company name?".
 */
export default function RecruiterOnboardingGate() {
  const [show, setShow] = useState(false)
  const [seedName, setSeedName] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (sessionStorage.getItem(ONBOARDING_DISMISSED_KEY)) return

    // Read pre-stashed enrichment for the seed name (best-effort)
    try {
      const stored = sessionStorage.getItem(PENDING_ENRICHMENT_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed?.companyName) setSeedName(parsed.companyName)
      }
    } catch {
      // ignore
    }

    // Decide based on whether RecruiterSettings already has a company name
    fetch('/api/dashboard/recruiter/settings')
      .then(r => (r.ok ? r.json() : null))
      .then(data => {
        if (!data?.settings?.companyName) {
          setShow(true)
        }
      })
      .catch(() => {
        // If the settings call fails, don't block the dashboard — just skip
      })
  }, [])

  if (!show) return null

  return <RecruiterOnboardingChat seedCompanyName={seedName} onDismiss={() => setShow(false)} />
}
