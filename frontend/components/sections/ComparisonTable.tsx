'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link } from '@/navigation'
import { motion } from 'framer-motion'
import { useSegment } from '@/lib/segment-context'
import { useTranslations } from 'next-intl'

export function ComparisonTable() {
  const { segment } = useSegment()
  const t = useTranslations('home.comparison')

  const rows = [0, 1, 2, 3, 4, 5] as const

  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <p className="text-sm font-medium tracking-wide text-primary uppercase mb-3">
            {t('badge')}
          </p>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
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
          {/* Comparison header */}
          <div className="grid grid-cols-3 gap-4 mb-2">
            <div />
            <div className="text-center">
              <Badge variant="outline" className="text-muted-foreground border-border">
                {t(`${segment}.traditionalLabel`)}
              </Badge>
            </div>
            <div className="text-center">
              <Badge className="bg-primary text-primary-foreground">
                InTransparency
              </Badge>
            </div>
          </div>

          {/* Comparison rows */}
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              {rows.map((index) => (
                <div
                  key={index}
                  className={`grid grid-cols-3 gap-4 px-5 py-3.5 items-center ${
                    index % 2 === 0 ? 'bg-card' : 'bg-muted/20'
                  } ${index < 5 ? 'border-b border-border/50' : ''}`}
                >
                  <p className="text-sm font-medium text-foreground">
                    {t(`${segment}.rows.${index}.feature`)}
                  </p>
                  <div className="flex items-center justify-center gap-1.5">
                    <XCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
                    <span className="text-xs text-muted-foreground">
                      {t(`${segment}.rows.${index}.traditional`)}
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-1.5">
                    <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="text-xs text-foreground font-medium">
                      {t(`${segment}.rows.${index}.ours`)}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* CTA below comparison */}
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
