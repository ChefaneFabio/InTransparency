'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useLocale } from 'next-intl'
import { Link } from '@/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { HelpCircle, X, MessageSquare, Sparkles } from 'lucide-react'
import { getGuideForPath, type PageGuide } from '@/lib/page-guide'
import type { JourneySegment } from '@/lib/journeys'

/**
 * Floating "?" help button — companion to <JourneyPanel/>.
 *
 * - JourneyPanel (bottom-left): "Where am I in my multi-step journey?"
 * - HelpButton (bottom-right, offset from chatbot): "What is THIS specific page?"
 *
 * Resolves the guide for the current pathname via lib/page-guide registry.
 * Falls back to a generic "Use the chat for help" panel for routes that
 * don't have a registered guide yet.
 *
 * Position: bottom-6 right-24 — far enough left of the chatbot launcher
 * (bottom-6 right-6) to avoid collision while sharing the same bottom rail.
 */

interface Props {
  segment: JourneySegment
}

const SEGMENT_THEME: Record<JourneySegment, { accent: string; ring: string }> = {
  student:     { accent: 'text-violet-600 dark:text-violet-300', ring: 'hover:ring-violet-300' },
  recruiter:   { accent: 'text-blue-600 dark:text-blue-300',     ring: 'hover:ring-blue-300' },
  institution: { accent: 'text-amber-700 dark:text-amber-300',   ring: 'hover:ring-amber-300' },
}

const SEEN_KEY_PREFIX = 'intransparency_pageguide_seen_'

export default function HelpButton({ segment }: Props) {
  const pathname = usePathname() || ''
  const locale = useLocale() as 'en' | 'it'
  const [open, setOpen] = useState(false)
  const [guide, setGuide] = useState<PageGuide | null>(null)
  const [showAttractor, setShowAttractor] = useState(false)
  const theme = SEGMENT_THEME[segment]

  // Strip locale to get a stable key — /it/dashboard/x and /en/dashboard/x
  // should be treated as the same page for the "seen" flag.
  const stableKey = pathname.replace(/^\/[a-z]{2}(?=\/)/, '')

  // Resolve guide whenever the path changes; show attractor pulse on first
  // visit to a route that has a registered guide (not for fallback pages).
  useEffect(() => {
    const resolved = getGuideForPath(pathname, locale)
    setGuide(resolved)
    setOpen(false)

    if (typeof window === 'undefined') return
    const seenKey = SEEN_KEY_PREFIX + stableKey
    const alreadySeen = !!localStorage.getItem(seenKey)
    if (resolved && !alreadySeen) {
      setShowAttractor(true)
      // Auto-fade after 6s if user doesn't engage
      const timer = setTimeout(() => setShowAttractor(false), 6000)
      return () => clearTimeout(timer)
    } else {
      setShowAttractor(false)
    }
  }, [pathname, stableKey, locale])

  const handleOpen = () => {
    setOpen(o => !o)
    setShowAttractor(false)
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(SEEN_KEY_PREFIX + stableKey, '1')
      } catch {
        // localStorage unavailable — silent
      }
    }
  }

  return (
    <>
      {/* "?" launcher — embedded in the top nav next to the language switcher.
          Pulses softly on first visit to a page with a registered guide. */}
      <button
        onClick={handleOpen}
        className={`relative inline-flex items-center justify-center h-9 w-9 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors focus:outline-none focus-visible:ring-2 ${theme.ring}`}
        aria-label={locale === 'it' ? 'Aiuto pagina' : 'Page help'}
        aria-expanded={open}
      >
        {showAttractor && (
          <span
            aria-hidden
            className={`absolute inset-1 rounded-md animate-ping ${theme.accent} opacity-25 bg-current`}
          />
        )}
        <HelpCircle className="h-4 w-4 relative" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Click-out overlay — invisible, only on mobile feel */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-30 bg-transparent"
              aria-hidden
            />

            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 320, damping: 26 }}
              className="fixed top-16 right-4 z-40 w-[340px] max-w-[calc(100vw-2rem)] rounded-2xl bg-card border shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 p-4 border-b">
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    {locale === 'it' ? 'Su questa pagina' : 'About this page'}
                  </p>
                  <h3 className="text-sm font-semibold text-foreground mt-1 leading-snug">
                    {guide?.about || (locale === 'it' ? 'Hai bisogno di aiuto?' : 'Need help with this page?')}
                  </h3>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="text-muted-foreground hover:text-foreground p-1 -m-1 shrink-0"
                  aria-label={locale === 'it' ? 'Chiudi' : 'Close'}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
                {/* Actions */}
                {guide?.actions?.length ? (
                  <div>
                    <p className="text-xs font-semibold text-foreground mb-2">
                      {locale === 'it' ? 'Cosa puoi fare qui' : 'What you can do here'}
                    </p>
                    <ul className="space-y-1.5">
                      {guide.actions.map((a, i) => (
                        <li key={i} className="text-sm text-muted-foreground leading-relaxed flex gap-2">
                          <span className={`${theme.accent} mt-1.5 h-1 w-1 rounded-full bg-current shrink-0`} />
                          <span>{a}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {locale === 'it'
                      ? 'Nessuna guida dettagliata per questa pagina — apri la chat per aiuto.'
                      : 'No detailed guide for this page yet — open the chat below for help.'}
                  </p>
                )}

                {/* Premium */}
                {guide?.premium?.length ? (
                  <div className="rounded-lg border border-amber-200 dark:border-amber-800/50 bg-amber-50/50 dark:bg-amber-950/20 p-3">
                    <p className="text-[10px] uppercase tracking-widest font-semibold text-amber-700 dark:text-amber-300">
                      {locale === 'it' ? 'Premium qui sblocca' : 'Premium unlocks here'}
                    </p>
                    <ul className="mt-1.5 space-y-1">
                      {guide.premium.map((p, i) => (
                        <li key={i} className="text-xs text-amber-900 dark:text-amber-100 leading-relaxed">
                          · {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {/* Tip */}
                {guide?.tip ? (
                  <div className="rounded-lg bg-muted/40 border border-border/60 p-3">
                    <p className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground">
                      {locale === 'it' ? 'Suggerimento' : 'Tip'}
                    </p>
                    <p className="text-sm text-foreground mt-1 leading-relaxed">{guide.tip}</p>
                  </div>
                ) : null}

                {/* Related pages */}
                {guide?.related?.length ? (
                  <div>
                    <p className="text-xs font-semibold text-foreground mb-2">
                      {locale === 'it' ? 'Collegate' : 'Related'}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {guide.related.map((r, i) => (
                        <Link
                          key={i}
                          href={r.href as any}
                          className="text-xs px-2.5 py-1 rounded-full border border-border bg-background hover:bg-muted/40 transition-colors text-foreground"
                          onClick={() => setOpen(false)}
                        >
                          {r.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Footer — open chat fallback */}
              <div className="p-3 border-t bg-muted/20">
                <p className="text-xs text-muted-foreground">
                  {locale === 'it'
                    ? 'Serve di più? Usa la chat in basso a destra — conosce anche questa pagina.'
                    : 'Need more? Use the chat (bottom-right) — it knows this page too.'}
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
