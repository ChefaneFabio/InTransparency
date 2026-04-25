'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, X, CheckCircle2 } from 'lucide-react'

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
          className="fixed top-20 right-4 z-50 max-w-sm rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/60 dark:to-cyan-950/60 dark:border-blue-800 shadow-2xl p-4 flex items-start gap-3"
        >
          {confirmation.companyLogo && (
            <img
              src={confirmation.companyLogo}
              alt={confirmation.companyName}
              className="h-10 w-10 rounded bg-white object-contain shrink-0"
              onError={e => {
                (e.target as HTMLImageElement).style.display = 'none'
              }}
            />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5" />
              Profile pre-filled
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-200 mt-0.5 leading-relaxed">
              We set up <strong>{confirmation.companyName}</strong> from your work email. Review and complete it from{' '}
              <a href="/dashboard/recruiter/settings" className="underline font-medium hover:text-blue-900 dark:hover:text-blue-50">
                Settings
              </a>
              .
            </p>
          </div>
          <button
            onClick={() => setConfirmation(null)}
            className="text-blue-600 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-100 shrink-0"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
          <CheckCircle2 className="absolute -top-2 -right-2 h-5 w-5 text-emerald-500 bg-white rounded-full" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
