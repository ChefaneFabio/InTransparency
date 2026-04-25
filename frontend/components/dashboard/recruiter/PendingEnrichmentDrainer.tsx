'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

const PENDING_ENRICHMENT_KEY = 'intransparency_pending_recruiter_enrichment'

interface PendingEnrichment {
  companyName?: string
  companyWebsite?: string
  companyLogo?: string
  domain?: string
}

/**
 * Drains the domain enrichment that was stashed in sessionStorage during
 * recruiter signup, writes it to /api/dashboard/recruiter/settings, and shows
 * a brief confirmation toast.
 *
 * Mounted once on the recruiter dashboard. Self-removes after one run.
 */
export default function PendingEnrichmentDrainer() {
  const [confirmation, setConfirmation] = useState<PendingEnrichment | null>(null)

  useEffect(() => {
    const stored = sessionStorage.getItem(PENDING_ENRICHMENT_KEY)
    if (!stored) return
    sessionStorage.removeItem(PENDING_ENRICHMENT_KEY)

    let parsed: PendingEnrichment
    try {
      parsed = JSON.parse(stored) as PendingEnrichment
    } catch {
      return
    }
    if (!parsed.companyName) return

    // Fire-and-forget — the user can edit anything later from settings
    fetch('/api/dashboard/recruiter/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        companyName: parsed.companyName,
        companyWebsite: parsed.companyWebsite,
        companyLogo: parsed.companyLogo,
      }),
    })
      .then(r => {
        if (r.ok) setConfirmation(parsed)
      })
      .catch(() => {
        // silent — non-blocking
      })
  }, [])

  return (
    <AnimatePresence>
      {confirmation && (
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          className="fixed top-20 right-4 z-50 max-w-sm rounded-xl border bg-card shadow-xl p-4 flex items-start gap-3"
        >
          {confirmation.companyLogo && (
            <img
              src={confirmation.companyLogo}
              alt={confirmation.companyName}
              className="h-10 w-10 rounded bg-white object-contain shrink-0 border"
              onError={e => {
                (e.target as HTMLImageElement).style.display = 'none'
              }}
            />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground">
              Profile pre-filled
            </p>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              We set up <strong className="text-foreground">{confirmation.companyName}</strong> from your work email. Review and complete it from{' '}
              <a href="/dashboard/recruiter/settings" className="underline font-medium text-foreground hover:no-underline">
                Settings
              </a>
              .
            </p>
          </div>
          <button
            onClick={() => setConfirmation(null)}
            className="text-muted-foreground hover:text-foreground shrink-0"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
