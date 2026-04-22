'use client'

import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Sparkles,
  Check,
  Mail,
  ArrowLeft,
  Inbox,
  FileSignature,
  Building2,
  GraduationCap,
  Lock,
} from 'lucide-react'
import { Link } from '@/navigation'
import { useMyInstitution } from '@/lib/hooks/use-my-institution'
import { GlassCard } from '@/components/dashboard/shared/GlassCard'

const FEATURES = [
  { icon: Inbox,         key: 'inbox',     titleEn: 'Mediation Inbox',       titleIt: 'Mediation Inbox',          descEn: 'Moderate every recruiter message before it reaches your students.', descIt: 'Modera ogni messaggio dei recruiter prima che raggiunga i tuoi studenti.' },
  { icon: FileSignature, key: 'offers',    titleEn: 'Offer Moderation',      titleIt: 'Moderazione Offerte',       descEn: 'Approve, edit, or reject job offers before they go live.',           descIt: 'Approva, modifica o rifiuta le offerte prima della pubblicazione.' },
  { icon: Building2,     key: 'crm',       titleEn: 'Company CRM',           titleIt: 'CRM Aziende',               descEn: 'Pipeline from first contact to signed convention, drag-and-drop.',   descIt: 'Dalla presa di contatto alla convenzione firmata, drag & drop.' },
  { icon: GraduationCap, key: 'placement', titleEn: 'Placement Pipeline',    titleIt: 'Pipeline Tirocini',         descEn: 'Hours log, evaluations, deadlines — visible to student, tutors, company.', descIt: 'Ore, valutazioni, scadenze — visibili a studente, tutor, azienda.' },
]

export default function UniversityBillingPage() {
  const { institution, loading } = useMyInstitution()
  const t = useTranslations()
  // Best-effort locale detection via useTranslations isn't trivial here;
  // we just show Italian text since institutions in-market are Italian.
  const isPremium = institution?.plan === 'PREMIUM'

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      <Link
        href="/dashboard/university"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Dashboard
      </Link>

      {/* Hero */}
      <div className="rounded-2xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50 p-6 sm:p-10 shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-lg">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Institutional Workspace — PREMIUM
            </h1>
            <p className="text-sm text-muted-foreground">
              M1 Inbox · M2 Offer moderation · M3 Company CRM · M4 Placement pipeline
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-6">
          {loading ? (
            <div className="h-10 w-48 bg-white/50 rounded animate-pulse" />
          ) : institution ? (
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm text-gray-700">
                <span className="font-medium">{institution.name}</span>
              </span>
              {isPremium ? (
                <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide bg-green-100 text-green-800 px-2.5 py-1 rounded">
                  <Check className="h-3 w-3" />
                  PREMIUM active
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide bg-amber-100 text-amber-800 px-2.5 py-1 rounded">
                  <Lock className="h-3 w-3" />
                  CORE — preview only
                </span>
              )}
            </div>
          ) : (
            <span className="text-sm text-muted-foreground">No institution linked</span>
          )}
        </div>
      </div>

      {isPremium ? (
        <Card>
          <CardContent className="p-6 text-center">
            <Check className="h-10 w-10 text-green-600 mx-auto mb-3" />
            <h2 className="text-lg font-semibold mb-1">You're all set</h2>
            <p className="text-sm text-muted-foreground">
              All four institutional modules are unlocked for {institution?.name || 'your institution'}.
              To change your plan, contact us.
            </p>
            <a href="mailto:fabio@in-transparency.com" className="inline-flex items-center gap-1 text-sm text-primary mt-4">
              <Mail className="h-4 w-4" /> fabio@in-transparency.com
            </a>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Feature grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FEATURES.map(f => {
              const Icon = f.icon
              return (
                <GlassCard key={f.key} hover={false}>
                  <div className="p-5">
                    <div className="flex items-start gap-3">
                      <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{f.titleIt}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{f.descIt}</p>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              )
            })}
          </div>

          {/* CTA */}
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-blue-50 to-purple-50">
            <CardContent className="p-6 sm:p-8 text-center">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Ready to unlock PREMIUM?
              </h2>
              <p className="text-sm text-muted-foreground mb-5 max-w-xl mx-auto">
                Pricing is custom per institution based on active students and modules.
                Email us for a demo & quote.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a href="mailto:fabio@in-transparency.com?subject=PREMIUM%20upgrade%20request">
                  <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0">
                    <Mail className="mr-2 h-4 w-4" />
                    Get a quote
                  </Button>
                </a>
                <Link href="/dashboard/university">
                  <Button size="lg" variant="outline">
                    Explore on CORE
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
