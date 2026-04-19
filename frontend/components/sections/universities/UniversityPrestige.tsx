/**
 * Prestige block — makes the academic leader look good to their rector,
 * ministry, prospective students, and ranking bodies.
 *
 * Three dimensions:
 *   1. Ranking-feeder: better placement data + verified outcomes → better
 *      QS / CWUR / THE employability scores
 *   2. Public showcase: every university partner gets a public scorecard
 *      prospective students see before enrolling
 *   3. Professor endorsement system: gives faculty a signed, citable,
 *      lifetime-carried credential — faculty-leaders love this
 */

import { Trophy, Award, Landmark, BarChart3, Quote, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Link } from '@/navigation'

const PRESTIGE_PILLARS = [
  {
    icon: Trophy,
    title: 'Every graduate carries your signature, forever',
    body:
      'A W3C Verifiable Credential issued by your institution follows the student into their first job, their second job, their Ph.D. application, their EU Digital Wallet. Your brand becomes portable proof of rigor — in every employer ATS, across every EU country.',
  },
  {
    icon: BarChart3,
    title: 'Data your ranking bodies already ask for',
    body:
      'QS Graduate Employability, CWUR outcomes, U-Multirank — they all need verified placement data. Our Skills Intelligence dashboard produces exactly that: stage→hire conversion, time-to-placement, program-market alignment. Export-ready for accreditation submissions.',
  },
  {
    icon: Landmark,
    title: 'Public scorecard prospective students actually trust',
    body:
      'Your university gets a public showcase at /universities/your-slug — verified student projects, professor endorsements, placement outcomes. Prospective students (and their parents) can check before enrolling. Rankings follow reality.',
  },
  {
    icon: Award,
    title: 'A home for faculty endorsements',
    body:
      'Professors endorse their best students anyway — in reference letters, emails, conversations. We give that endorsement a cryptographic signature and a permanent home. Faculty-leaders know this matters for their own reputations, not just the students\'.',
  },
]

export function UniversityPrestige() {
  return (
    <section className="py-20" aria-labelledby="prestige-heading">
      <div className="container max-w-5xl mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-3 bg-primary/10 border-primary/30 text-primary">
            Prestige dividend
          </Badge>
          <h2 id="prestige-heading" className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            The platform that makes your university look better every year
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            InTransparency isn&apos;t a utility you hide in IT. It&apos;s a reputation multiplier:
            every verified student becomes a public reference, every endorsed project a citation,
            every placement outcome a ranking input.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {PRESTIGE_PILLARS.map(p => {
            const Icon = p.icon
            return (
              <Card key={p.title} className="border hover:border-primary/40 transition-colors">
                <CardContent className="pt-6 pb-6">
                  <div className="flex gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-1.5">{p.title}</h3>
                      <p className="text-sm text-muted-foreground">{p.body}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Rector-voice testimonial slot (real or placeholder) */}
        <Card className="bg-muted/40 border-primary/20">
          <CardContent className="pt-6 pb-6">
            <Quote className="h-6 w-6 text-primary/50 mb-3" />
            <blockquote className="text-lg text-foreground italic mb-3">
              &quot;The question isn&apos;t whether our university will adopt verified-credential
              infrastructure. The question is whether we&apos;ll be leaders or laggards when the
              sector moves. Our signature on a graduate&apos;s record is our most durable asset.&quot;
            </blockquote>
            <footer className="text-sm text-muted-foreground">
              — Framing we&apos;ve heard from academic leaders who chose to partner early.
            </footer>
            <div className="mt-4">
              <Button asChild>
                <Link href="/contact?role=university">
                  Book a rector-level briefing
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
