'use client'

import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Sparkles, Check, Mail, ArrowLeft, Info } from 'lucide-react'
import { Link } from '@/navigation'
import { useMyInstitution } from '@/lib/hooks/use-my-institution'
import InstitutionAddonGrid from '@/components/pricing/InstitutionAddonGrid'
import { INSTITUTION_ADDONS } from '@/lib/config/institution-addons'

/**
 * Billing & add-ons page for institution staff.
 * Core workspace is free forever — this page is the add-on marketplace +
 * a contact channel for commercial discussion. If the URL has ?addon=KEY
 * (deep-link from the /add-ons grid), highlight that card.
 */
export default function UniversityBillingPage() {
  const { institution, loading } = useMyInstitution()
  const searchParams = useSearchParams()
  const requestedAddon = searchParams?.get('addon')
  const matchedAddon = requestedAddon
    ? INSTITUTION_ADDONS.find(a => a.key === requestedAddon)
    : null

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      <Link
        href="/dashboard/university"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Dashboard
      </Link>

      {/* Hero — reflects the real model */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-200/70 dark:border-emerald-900/50 bg-gradient-to-br from-emerald-50 via-white to-blue-50 dark:from-emerald-950/30 dark:via-slate-950 dark:to-blue-950/30 p-6 sm:p-10 shadow-sm">
        <div
          aria-hidden
          className="absolute -top-24 -right-12 w-64 h-64 rounded-full bg-gradient-to-br from-emerald-400/20 to-transparent blur-3xl pointer-events-none"
        />
        <div className="relative flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Billing & add-ons</h1>
            <p className="text-sm text-muted-foreground">
              Your core workspace is free, forever. Add modules when you're ready to scale.
            </p>
          </div>
        </div>

        <div className="relative mt-6 inline-flex items-center gap-2 bg-white/70 dark:bg-slate-900/70 backdrop-blur border rounded-full px-3 py-1.5 text-sm">
          {loading ? (
            <span className="text-muted-foreground">Loading…</span>
          ) : institution ? (
            <>
              <Check className="h-4 w-4 text-emerald-600" />
              <span className="font-medium">{institution.name}</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-emerald-700 dark:text-emerald-300 font-medium">
                Full workspace active
              </span>
            </>
          ) : (
            <span className="text-muted-foreground">No institution linked</span>
          )}
        </div>
      </div>

      {/* Deep-link highlight — if the user came from /add-ons?addon=X */}
      {matchedAddon && (
        <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-purple-50/40 dark:from-primary/10 dark:to-purple-950/20">
          <CardContent className="p-6 flex items-start gap-3">
            <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold">
                Request for <span className="text-primary">{matchedAddon.title}</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {matchedAddon.description}
              </p>
              <div className="mt-3">
                <a href={`mailto:fabio@in-transparency.com?subject=Add-on%20request%3A%20${encodeURIComponent(matchedAddon.title)}${institution?.name ? '%20for%20' + encodeURIComponent(institution.name) : ''}`}>
                  <Button size="sm">
                    <Mail className="mr-2 h-4 w-4" />
                    Email us about this add-on
                  </Button>
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Explainer */}
      <div className="rounded-xl border bg-muted/30 p-4 flex items-start gap-3">
        <Info className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Nothing to pay for Core.</span>{' '}
          Inbox, offer moderation, CRM, placement pipeline, AI Assistant, audit log,
          reminder engine — all included. The marketplace below is for optional modules
          that help you scale, integrate with your existing systems, or extend tools to every student.
        </p>
      </div>

      {/* Add-on marketplace — same grid as /dashboard/university/add-ons */}
      <div>
        <h2 className="text-xl font-bold mb-4">Optional add-ons</h2>
        <InstitutionAddonGrid authenticated cols={2} />
      </div>

      {/* Contact */}
      <Card>
        <CardContent className="p-6 sm:p-8 text-center">
          <h2 className="text-lg font-bold mb-1">Anything else?</h2>
          <p className="text-sm text-muted-foreground mb-4 max-w-xl mx-auto">
            Not seeing what your institution needs? Tell us — every module above started
            as a real institutional ask.
          </p>
          <a href="mailto:fabio@in-transparency.com?subject=Institution%20add-on%20inquiry">
            <Button variant="outline">
              <Mail className="mr-2 h-4 w-4" />
              fabio@in-transparency.com
            </Button>
          </a>
        </CardContent>
      </Card>
    </div>
  )
}
