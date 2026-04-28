'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link } from '@/navigation'
import { motion } from 'framer-motion'
import { useSegment } from '@/lib/segment-context'
import { useTranslations } from 'next-intl'

/**
 * Tabbed "pick your competitor" comparison.
 *
 * Visitor's segment (from useSegment) picks the 3 named competitors;
 * a tab row lets them swap which competitor is shown side-by-side
 * with InTransparency. The "ours" column varies per competitor — each
 * comparison highlights different InTransparency strengths so the
 * narrative stays sharp.
 *
 * Locked 2026-04-28. Per-segment competitor lists:
 * - students:    LinkedIn / Indeed / JobTeaser
 * - companies:   LinkedIn Recruiter / Indeed / Agencies (Adecco, Manpower)
 * - institutions: AlmaLaurea / JobTeaser / Excel
 */

const COMPETITORS_BY_SEGMENT: Record<string, readonly string[]> = {
  students:     ['linkedin', 'indeed', 'jobteaser'],
  institutions: ['almalaurea', 'jobteaser', 'excel'],
  companies:    ['linkedinRecruiter', 'indeed', 'agencies'],
}

export function ComparisonTable() {
  const { segment } = useSegment()
  const t = useTranslations('home.comparison')

  const competitorKeys = COMPETITORS_BY_SEGMENT[segment] ?? COMPETITORS_BY_SEGMENT.students
  const [activeKey, setActiveKey] = useState<string>(competitorKeys[0])

  // Reset active tab when segment changes (segment context can swap below us)
  const safeActiveKey = competitorKeys.includes(activeKey) ? activeKey : competitorKeys[0]

  const rows = [0, 1, 2, 3, 4, 5] as const

  return (
    <section className="py-12 sm:py-16 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <p className="text-sm font-medium tracking-widest text-primary uppercase mb-4">
            {t('badge')}
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-5">
            {t(`${segment}.title`)}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t(`${segment}.subtitle`)}
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          {/* Tab row — pick competitor */}
          <div className="text-center mb-6">
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">
              {t(`${segment}.tabsLabel`)}
            </div>
            <div className="inline-flex flex-wrap items-center justify-center gap-2 p-1.5 bg-card border border-border rounded-lg">
              {competitorKeys.map(key => {
                const isActive = key === safeActiveKey
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActiveKey(key)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                    }`}
                  >
                    {t(`${segment}.competitors.${key}.name`)}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Comparison header */}
          <div className="grid grid-cols-3 gap-4 mb-2">
            <div />
            <div className="text-center">
              <Badge variant="outline" className="text-muted-foreground border-border">
                {t(`${segment}.competitors.${safeActiveKey}.name`)}
              </Badge>
            </div>
            <div className="text-center">
              <Badge className="bg-primary text-primary-foreground">InTransparency</Badge>
            </div>
          </div>

          {/* Comparison rows */}
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              {rows.map(index => (
                <div
                  key={`${safeActiveKey}-${index}`}
                  className={`grid grid-cols-3 gap-4 px-5 py-3.5 items-center ${
                    index % 2 === 0 ? 'bg-card' : 'bg-muted/20'
                  } ${index < 5 ? 'border-b border-border/50' : ''}`}
                >
                  <p className="text-sm font-medium text-foreground">
                    {t(`${segment}.competitors.${safeActiveKey}.rows.${index}.feature`)}
                  </p>
                  <div className="flex items-center justify-center gap-1.5">
                    <XCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
                    <span className="text-xs text-muted-foreground">
                      {t(`${segment}.competitors.${safeActiveKey}.rows.${index}.them`)}
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-1.5">
                    <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="text-xs text-foreground font-medium">
                      {t(`${segment}.competitors.${safeActiveKey}.rows.${index}.ours`)}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="text-center mt-8">
            <Button asChild size="lg">
              <Link href="/auth/register">
                {t('cta')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
