'use client'

import { useEffect, useState, use } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { ShieldCheck, CheckCircle, Info, ExternalLink, AlertCircle } from 'lucide-react'
import { Link } from '@/navigation'

interface MatchFactor {
  name: string
  category: string
  weight: number
  value: number | string
  contribution: number
  evidence?: Array<{ type: string; id?: string; label: string; detail?: string }>
  humanReason?: string
}

interface Explanation {
  id: string
  matchScore: number
  decisionLabel: string | null
  factors: MatchFactor[]
  modelVersion: string
  createdAt: string
}

const FACTOR_LABELS: Record<string, string> = {
  requiredSkills: 'Skills that matched what they were looking for',
  preferredSkills: 'Bonus skills they wanted',
  verifiedProjects: 'Your verified projects',
  internshipExperience: 'Your stage / internship record',
  academicPerformance: 'Your academic performance',
}

export default function WhyThisMatchPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>
}) {
  const { id } = use(params)
  const [explanation, setExplanation] = useState<Explanation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/match/${id}/why`)
      .then(async r => {
        if (!r.ok) throw new Error(r.status === 404 ? 'notFound' : 'error')
        return r.json()
      })
      .then(data => setExplanation(data.explanation))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-3xl mx-auto px-4 pt-32 pb-16">
        <div className="mb-8">
          <Badge variant="outline" className="mb-3 bg-green-50 border-green-300 text-green-700">
            <ShieldCheck className="h-3 w-3 mr-1" />
            AI Act — Right to Explanation
          </Badge>
          <h1 className="text-3xl font-bold mb-2">Why were you matched?</h1>
          <p className="text-muted-foreground">
            A recruiter saw your profile as a match for a role. Here is exactly what contributed to
            that decision — nothing hidden, nothing proprietary.
          </p>
        </div>

        {loading && (
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        )}

        {error === 'notFound' && (
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="pt-6 flex gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0" />
              <p className="text-sm">
                This explanation was not found, or you are not the subject. Only the student the
                match concerns can view the full explanation.
              </p>
            </CardContent>
          </Card>
        )}

        {explanation && (
          <>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Overall match score</span>
                  <Badge variant={explanation.matchScore >= 70 ? 'default' : 'secondary'}>
                    {explanation.decisionLabel?.replace('_', ' ')}
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
                <p className="text-xs text-muted-foreground mt-3">
                  Computed on {new Date(explanation.createdAt).toLocaleDateString()} by{' '}
                  <Link href="/algorithm-registry" className="underline text-primary">
                    model {explanation.modelVersion}
                  </Link>
                </p>
              </CardContent>
            </Card>

            <h2 className="text-xl font-semibold mb-4">What contributed to the score</h2>
            <div className="space-y-4 mb-8">
              {explanation.factors.map((f, idx) => (
                <Card key={idx}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <h3 className="font-semibold">{FACTOR_LABELS[f.name] ?? f.name}</h3>
                      </div>
                      <Badge variant="outline">+{Math.round(f.contribution)} pts</Badge>
                    </div>
                    {f.humanReason && (
                      <p className="text-sm text-muted-foreground ml-7 mb-3">{f.humanReason}</p>
                    )}
                    {f.evidence && f.evidence.length > 0 && (
                      <div className="ml-7 mt-3 flex flex-wrap gap-2">
                        {f.evidence.map((e, eIdx) => (
                          <Badge key={eIdx} variant="secondary" className="font-normal">
                            {e.label}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-primary/5 border-primary/20 mb-6">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Your rights
                </h3>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li>
                    → <strong>Human review:</strong> if you disagree with this match, a human at
                    your institution can review and override it.
                  </li>
                  <li>
                    → <strong>Object:</strong> you can remove yourself from future matching by this
                    recruiter.
                  </li>
                  <li>
                    → <strong>Export:</strong> you can export every explanation involving you.
                  </li>
                </ul>
                <div className="flex gap-3 mt-4">
                  <Button variant="outline" asChild>
                    <a href="mailto:info@in-transparency.com?subject=Human%20review%20request">
                      Request human review
                    </a>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/algorithm-registry">
                      Read the model card
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </main>
      <Footer />
    </div>
  )
}
