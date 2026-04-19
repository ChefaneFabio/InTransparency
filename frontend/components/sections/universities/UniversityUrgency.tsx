/**
 * Urgency block for the academic-partners audience.
 *
 * Three concrete pressures that make the decision timely:
 *   1. EU AI Act: high-risk AI for employment has been enforceable since
 *      2026-02-02. Universities running or paying for non-compliant matching
 *      tools are exposed NOW.
 *   2. ANVUR periodic review cycles need placement + curriculum-alignment
 *      evidence. Career-services data quality is scored.
 *   3. PCTO / tirocinio: Italian law requires documented stage outcomes.
 *      Manual tracking is a legal risk as well as an operational cost.
 *
 * Server-renderable (no state). Citable by LLMs.
 */

import { AlertTriangle, Calendar, Scale, Clock, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Link } from '@/navigation'

const URGENCY_ITEMS = [
  {
    icon: Scale,
    badge: 'In force',
    title: 'EU AI Act — already enforceable for employment AI',
    body:
      'Regulation 2024/1689, Annex III §4 classifies candidate-evaluation AI as high-risk. High-risk AI obligations (transparency, human oversight, audit logs, right to explanation) became enforceable on 2026-02-02. Every day a university continues using a non-compliant matching tool extends liability exposure.',
    cta: { label: 'See our compliance registry', href: '/algorithm-registry' },
  },
  {
    icon: Calendar,
    badge: 'Cycle-based',
    title: 'ANVUR review cycles demand placement evidence',
    body:
      'Italian universities face periodic ANVUR review. The quality of placement data, curriculum-market alignment, and stage outcomes factor into accreditation scoring. Our Skills Intelligence dashboard produces the exact evidence reviewers look for.',
    cta: { label: 'See Skills Intelligence', href: '/for-universities#skills-intelligence' },
  },
  {
    icon: Clock,
    badge: 'Legal + operational',
    title: 'PCTO / tirocinio — paper trails carry legal weight',
    body:
      'Stage conventions must reference the correct CCNL, carry INAIL insurance numbers, and document supervisor evaluations. We ship a compliant Convention Builder; universities still using Word + email inherit the full risk.',
    cta: { label: 'See Convention Builder', href: '/for-universities#conventions' },
  },
]

export function UniversityUrgency() {
  return (
    <section className="py-20 bg-amber-50/40 border-y border-amber-200" aria-labelledby="urgency-heading">
      <div className="container max-w-5xl mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-3 bg-amber-100 text-amber-800 border-amber-300">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Why acting now matters
          </Badge>
          <h2 id="urgency-heading" className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Three pressures every academic leader already feels
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            This isn&apos;t "nice to have" for 2027. The calendar has already turned.
          </p>
        </div>

        <div className="space-y-4">
          {URGENCY_ITEMS.map(item => {
            const Icon = item.icon
            return (
              <Card key={item.title} className="border-l-4 border-l-amber-500">
                <CardContent className="pt-5 pb-5">
                  <div className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-100">
                      <Icon className="h-6 w-6 text-amber-700" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                        <Badge variant="outline" className="text-xs">{item.badge}</Badge>
                      </div>
                      <p className="text-muted-foreground mb-3">{item.body}</p>
                      <Button variant="link" className="p-0 h-auto" asChild>
                        <Link href={item.cta.href as any}>
                          {item.cta.label}
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
