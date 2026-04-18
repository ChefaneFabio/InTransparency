'use client'

import { useTranslations } from 'next-intl'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ShieldCheck, FileText, Scale, GitBranch, Eye, AlertCircle } from 'lucide-react'
import { Link } from '@/navigation'

// Public model cards — one per production matching model
// This page is the AI Act "Public Algorithm Registry" obligation made concrete.
// Students, universities, regulators, and auditors can read it without signing in.
const MODEL_CARDS = [
  {
    id: 'talent-match-v1.2.0',
    name: 'Talent Match',
    version: '1.2.0',
    type: 'Rule-based scoring',
    purpose:
      'Rank students for a given role based on verified skills, projects, stages, and academic performance.',
    audience: 'Recruiters searching for candidates; subjects have right-to-explanation access.',
    inputs: [
      { name: 'Required skills', source: 'Job posting', sensitive: false },
      { name: 'Preferred skills', source: 'Job posting', sensitive: false },
      { name: 'Student skills (self-declared)', source: 'Student profile', sensitive: false },
      { name: 'Verified projects', source: 'Project + ProfessorEndorsement', sensitive: false },
      { name: 'Stage supervisor ratings', source: 'StageExperience', sensitive: false },
      { name: 'GPA (only if student opted-in public)', source: 'Student profile', sensitive: true },
      { name: 'Graduation year', source: 'Student profile', sensitive: false },
      { name: 'Location', source: 'Student profile', sensitive: false },
    ],
    excluded: [
      'Gender',
      'Nationality',
      'Ethnicity',
      'Religion',
      'Age (beyond graduation year cohort)',
      'Photo / any biometric inference',
      'Private GPA (if student did not opt in)',
    ],
    weights: [
      { factor: 'Required skills match', maxPoints: 40 },
      { factor: 'Preferred skills match', maxPoints: 15 },
      { factor: 'Verified projects', maxPoints: 20 },
      { factor: 'Internship experience', maxPoints: 15 },
      { factor: 'Academic performance (opt-in only)', maxPoints: 10 },
    ],
    humanOversight:
      'Every match can be reviewed by a university administrator who can flag, confirm, or override the decision. Reviews are persisted and reportable.',
    subjectRights: [
      'Right to see the explanation for any match concerning you (/matches/[id]/why)',
      'Right to request human review',
      'Right to object to being listed in match results',
      'Right to export all explanations concerning you',
    ],
    lastAudit: '2026-03-15',
    biasTests:
      'Monthly cohort parity tests: match-score distributions checked across gender (when self-declared), universities, and degree types. Differences >5% trigger review.',
    complianceRefs: [
      'EU AI Act Reg. 2024/1689, Annex III §4',
      'GDPR Art. 22',
      'EU AI Act Art. 86 (right to explanation)',
    ],
  },
  {
    id: 'placement-prediction-v0.9.0',
    name: 'Placement Prediction',
    version: '0.9.0 (preview)',
    type: 'Hybrid scoring',
    purpose:
      'Estimate a student\'s probability of securing a job offer within 6 months post-graduation.',
    audience: 'Student and their university career service only. Never shown to recruiters.',
    inputs: [
      { name: 'Verified project count', source: 'Project', sensitive: false },
      { name: 'Stage completions', source: 'StageExperience', sensitive: false },
      { name: 'Supervisor would-hire signal', source: 'StageExperience', sensitive: false },
      { name: 'GPA (opt-in)', source: 'Student profile', sensitive: true },
      { name: 'Skill graph depth', source: 'SkillDelta', sensitive: false },
    ],
    excluded: [
      'Gender', 'Nationality', 'Ethnicity', 'Religion', 'Family background', 'Socio-economic data',
    ],
    weights: [
      { factor: 'Stage outcomes', maxPoints: 35 },
      { factor: 'Verified projects', maxPoints: 25 },
      { factor: 'Skill graph breadth', maxPoints: 20 },
      { factor: 'Academic record (opt-in)', maxPoints: 20 },
    ],
    humanOversight:
      'Predictions are advisory, never determinative. Career services can contextualize or suppress any prediction the student finds unhelpful.',
    subjectRights: [
      'Right to view your own prediction',
      'Right to request suppression from your dashboard',
      'Right to have the prediction excluded from shared profiles',
    ],
    lastAudit: '2026-02-20',
    biasTests:
      'Counterfactual tests run on each model revision: does prediction change when protected attributes are swapped? Target drift <2%.',
    complianceRefs: ['EU AI Act Reg. 2024/1689, Annex III §4', 'GDPR Art. 22'],
  },
]

export default function AlgorithmRegistryPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-5xl mx-auto px-4 pt-32 pb-16">
        <div className="mb-10">
          <Badge variant="outline" className="mb-3 bg-green-50 border-green-300 text-green-700">
            <ShieldCheck className="h-3 w-3 mr-1" />
            AI Act — Public Registry
          </Badge>
          <h1 className="text-4xl font-bold mb-4">Algorithm Registry</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Every automated decision system used on InTransparency is documented here. Students
            have the right to understand how any match or prediction about them was produced, to
            request human review, and to contest the outcome.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <Link href="/privacy" className="text-primary hover:underline">Privacy policy →</Link>
            <Link href="/consent" className="text-primary hover:underline">Consent preferences →</Link>
            <a href="mailto:info@in-transparency.com" className="text-primary hover:underline">Request human review →</a>
          </div>
        </div>

        <Card className="mb-8 border-amber-200 bg-amber-50/50">
          <CardContent className="pt-6 flex gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-900">
              <strong>Classification:</strong> Under EU AI Act Regulation 2024/1689, Annex III §4,
              systems that evaluate candidates for employment are classified as <em>high-risk</em>.
              InTransparency&apos;s matching systems implement every required safeguard: transparency,
              human oversight, traceability, data governance, and the right to explanation.
            </p>
          </CardContent>
        </Card>

        <div className="space-y-8">
          {MODEL_CARDS.map(card => (
            <Card key={card.id} className="border-2">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-2xl flex items-center gap-3">
                      <GitBranch className="h-5 w-5 text-primary" />
                      {card.name}
                    </CardTitle>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge variant="secondary">v{card.version}</Badge>
                      <Badge variant="outline">{card.type}</Badge>
                      <Badge variant="outline" className="text-muted-foreground">
                        Last audit: {card.lastAudit}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <section>
                  <h3 className="font-semibold mb-1 flex items-center gap-2"><FileText className="h-4 w-4" />Purpose</h3>
                  <p className="text-sm text-muted-foreground">{card.purpose}</p>
                  <p className="text-sm text-muted-foreground mt-1"><strong>Audience:</strong> {card.audience}</p>
                </section>

                <section>
                  <h3 className="font-semibold mb-2">Inputs used</h3>
                  <ul className="text-sm space-y-1">
                    {card.inputs.map((i, idx) => (
                      <li key={idx} className="flex items-baseline gap-2">
                        <span className="text-green-600">•</span>
                        <span>
                          <strong>{i.name}</strong> — from {i.source}
                          {i.sensitive && <Badge variant="outline" className="ml-2 text-xs">Opt-in only</Badge>}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h3 className="font-semibold mb-2">Never used</h3>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    {card.excluded.map((e, idx) => (
                      <li key={idx} className="flex items-baseline gap-2"><span className="text-red-500">✗</span>{e}</li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h3 className="font-semibold mb-2 flex items-center gap-2"><Scale className="h-4 w-4" />Scoring weights</h3>
                  <div className="space-y-2">
                    {card.weights.map((w, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-sm">
                        <div className="w-56">{w.factor}</div>
                        <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                          <div className="bg-primary h-full" style={{ width: `${w.maxPoints}%` }} />
                        </div>
                        <div className="w-20 text-right text-muted-foreground">max {w.maxPoints} pts</div>
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <h3 className="font-semibold mb-1 flex items-center gap-2"><Eye className="h-4 w-4" />Human oversight</h3>
                  <p className="text-sm text-muted-foreground">{card.humanOversight}</p>
                </section>

                <section>
                  <h3 className="font-semibold mb-2">Your rights as a subject</h3>
                  <ul className="text-sm space-y-1">
                    {card.subjectRights.map((r, idx) => (
                      <li key={idx} className="flex items-baseline gap-2"><span className="text-primary">→</span>{r}</li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h3 className="font-semibold mb-1">Bias testing</h3>
                  <p className="text-sm text-muted-foreground">{card.biasTests}</p>
                </section>

                <section className="border-t pt-4">
                  <h3 className="font-semibold mb-2 text-xs uppercase tracking-wide text-muted-foreground">Compliance references</h3>
                  <div className="flex flex-wrap gap-2">
                    {card.complianceRefs.map((ref, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">{ref}</Badge>
                    ))}
                  </div>
                </section>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-10 bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2">Questions or concerns?</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Write to <a href="mailto:info@in-transparency.com" className="text-primary underline">info@in-transparency.com</a>.
              We respond within 14 days to any explanation request, human-review request, or rights exercise.
            </p>
            <p className="text-xs text-muted-foreground">
              Data Protection Officer contact available on request. DPIA documentation shared with regulators on request.
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
