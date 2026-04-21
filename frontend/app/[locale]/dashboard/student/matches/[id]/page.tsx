import { notFound, redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import { getTranslations } from 'next-intl/server'
import { authOptions } from '@/lib/auth/config'
import { getExplanationForSubject, type MatchFactor } from '@/lib/match-explanation'
import prisma from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Link } from '@/navigation'
import {
  ShieldCheck,
  CheckCircle,
  Info,
  ExternalLink,
  ArrowLeft,
  Scale,
  Cpu,
  Calendar,
} from 'lucide-react'

const LABEL_VARIANT: Record<string, 'default' | 'secondary' | 'outline'> = {
  STRONG_MATCH: 'default',
  MATCH: 'default',
  WEAK_MATCH: 'secondary',
  NO_MATCH: 'outline',
}

const KNOWN_FACTORS = [
  'requiredSkills',
  'preferredSkills',
  'verifiedProjects',
  'verifiedDepth',
  'internshipExperience',
  'academicPerformance',
] as const

export default async function StudentMatchDetailPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>
}) {
  const { id, locale } = await params
  const t = await getTranslations('studentMatchDetail')

  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    redirect(`/${locale}/auth/signin`)
  }
  if (session.user.role !== 'STUDENT') {
    redirect(`/${locale}/dashboard`)
  }

  const explanation = await getExplanationForSubject(id, session.user.id)
  if (!explanation) notFound()

  // Fetch the full record for modelType (getExplanationForSubject omits it)
  const fullRecord = await prisma.matchExplanation.findUnique({
    where: { id },
    select: {
      modelType: true,
      counterpartyId: true,
      contextType: true,
      contextId: true,
    },
  })

  // Enrich with recruiter + job context (best-effort)
  const [recruiter, job] = await Promise.all([
    fullRecord?.counterpartyId
      ? prisma.user.findUnique({
          where: { id: fullRecord.counterpartyId },
          select: { firstName: true, lastName: true, company: true },
        })
      : Promise.resolve(null),
    fullRecord?.contextType === 'JOB' && fullRecord.contextId
      ? prisma.job.findUnique({
          where: { id: fullRecord.contextId },
          select: { title: true, companyName: true },
        })
      : Promise.resolve(null),
  ])

  const decisionLabel = explanation.decisionLabel ?? 'MATCH'
  const factors = (explanation.factors ?? []) as MatchFactor[]

  const companyName =
    job?.companyName ?? recruiter?.company ?? t('anonymousRecruiter')
  const jobTitle = job?.title ?? null
  const recruiterName =
    [recruiter?.firstName, recruiter?.lastName].filter(Boolean).join(' ') || null

  return (
    <div className="container max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="mb-4 -ml-2">
          <Link href="/dashboard/student/matches">
            <ArrowLeft className="h-4 w-4 mr-1" />
            {t('backToMatches')}
          </Link>
        </Button>

        <Badge
          variant="outline"
          className="mb-3 bg-green-50 border-green-300 text-green-700"
        >
          <ShieldCheck className="h-3 w-3 mr-1" />
          {t('badge')}
        </Badge>
        <h1 className="text-3xl font-bold mb-1">{t('title')}</h1>
        <p className="text-muted-foreground">
          {jobTitle
            ? t('introWithJob', { job: jobTitle, company: companyName })
            : t('introWithCompany', { company: companyName })}
          {recruiterName && <span className="text-xs ml-1">({recruiterName})</span>}
        </p>
      </div>

      {/* Score card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{t('overallScore')}</span>
            <Badge variant={LABEL_VARIANT[decisionLabel] ?? 'outline'}>
              {t(`decisionLabels.${decisionLabel}` as any)}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-3 mb-3">
            <span className="text-5xl font-bold text-primary">
              {Math.round(explanation.matchScore)}
            </span>
            <span className="text-muted-foreground">/ 100</span>
          </div>
          <Progress value={explanation.matchScore} className="h-3" />

          <div className="grid sm:grid-cols-3 gap-3 mt-5 text-xs">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              <span>
                {t('computedOn', {
                  date: new Date(explanation.createdAt).toLocaleDateString(locale),
                })}
              </span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Cpu className="h-3.5 w-3.5" />
              <span>{t('modelVersion', { version: explanation.modelVersion })}</span>
            </div>
            {fullRecord?.modelType && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Scale className="h-3.5 w-3.5" />
                <span>{t('modelType', { type: fullRecord.modelType })}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Factors */}
      <h2 className="text-xl font-semibold mb-4">{t('contributingFactors')}</h2>
      {factors.length === 0 ? (
        <Card className="mb-6">
          <CardContent className="pt-6 text-sm text-muted-foreground">
            {t('noFactors')}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4 mb-8">
          {factors.map((f, idx) => {
            const label = (KNOWN_FACTORS as readonly string[]).includes(f.name)
              ? t(`factorLabels.${f.name}` as any)
              : f.name
            const weightPct = Math.round((f.weight ?? 0) * 100)
            return (
              <Card key={idx}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-2 gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <h3 className="font-semibold truncate">{label}</h3>
                      <Badge variant="outline" className="text-[10px]">
                        {t(`categories.${f.category}` as any)}
                      </Badge>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <Badge variant="outline" className="text-xs">
                        {t('pointsContribution', {
                          points: Math.round(f.contribution ?? 0),
                        })}
                      </Badge>
                      {weightPct > 0 && (
                        <span className="text-[10px] text-muted-foreground">
                          {t('weight', { percent: weightPct })}
                        </span>
                      )}
                    </div>
                  </div>
                  {f.humanReason && (
                    <p className="text-sm text-muted-foreground ml-7 mb-3">
                      {f.humanReason}
                    </p>
                  )}
                  {f.evidence && f.evidence.length > 0 && (
                    <div className="ml-7 mt-3">
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1.5">
                        {t('evidence')}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {f.evidence.map((e, eIdx) => (
                          <Badge
                            key={eIdx}
                            variant="secondary"
                            className="font-normal text-xs"
                          >
                            {e.label}
                            {e.detail && (
                              <span className="text-muted-foreground ml-1">
                                — {e.detail}
                              </span>
                            )}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Rights box (AI Act Art. 86 + GDPR Art. 22) */}
      <Card className="bg-primary/5 border-primary/20 mb-6">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <Info className="h-4 w-4" />
            {t('rights.title')}
          </h3>
          <p className="text-sm text-muted-foreground mb-3">{t('rights.body')}</p>
          <ul className="text-sm space-y-2 text-muted-foreground">
            <li>→ {t('rights.humanReview')}</li>
            <li>→ {t('rights.object')}</li>
            <li>→ {t('rights.exportRight')}</li>
          </ul>
          <div className="flex flex-wrap gap-3 mt-4">
            <Button variant="outline" asChild>
              <a
                href={`mailto:info@in-transparency.com?subject=${encodeURIComponent(
                  t('rights.requestReviewSubject', { id })
                )}`}
              >
                {t('rights.requestReviewButton')}
              </a>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/algorithm-registry">
                {t('rights.readModelCardButton')}
                <ExternalLink className="h-3 w-3 ml-1" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
