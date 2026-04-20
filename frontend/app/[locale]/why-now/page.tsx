import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Clock, Euro, Award, ShieldCheck, ArrowRight } from 'lucide-react'
import { JsonLd } from '@/components/seo/JsonLd'
import { Link } from '@/navigation'
import type { Metadata } from 'next'
import { breadcrumbList } from '@/lib/schema-org'
import { getWhyNowContent } from '@/lib/content/why-now'

/**
 * "Why now" — long-form urgency + value piece for academic leaders.
 * Locale-aware content via lib/content/why-now.ts. Server-rendered so
 * LLMs parse the full text on first fetch.
 */

interface PageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const c = getWhyNowContent(locale)
  return {
    title: c.metaTitle,
    description: c.metaDescription,
    alternates: {
      canonical: `https://www.in-transparency.com/${locale}/why-now`,
      languages: {
        en: 'https://www.in-transparency.com/en/why-now',
        it: 'https://www.in-transparency.com/it/why-now',
        'x-default': 'https://www.in-transparency.com/en/why-now',
      },
    },
    openGraph: {
      title: c.ogTitle,
      description: c.metaDescription,
      type: 'article',
      locale: locale === 'it' ? 'it_IT' : 'en_US',
      alternateLocale: locale === 'it' ? 'en_US' : 'it_IT',
      siteName: 'InTransparency',
      images: [{ url: 'https://www.in-transparency.com/logo.png', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: c.ogTitle,
      description: c.metaDescription.slice(0, 200),
      images: ['https://www.in-transparency.com/logo.png'],
    },
  }
}

const SECTION_ICONS = [ShieldCheck, Clock, Euro, Award]

export default async function WhyNowPage({ params }: PageProps) {
  const { locale } = await params
  const c = getWhyNowContent(locale)

  return (
    <div className="min-h-screen bg-background">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: c.jsonLdHeadline,
          datePublished: '2026-04-19',
          dateModified: '2026-04-19',
          inLanguage: locale,
          author: { '@type': 'Organization', name: 'InTransparency' },
          publisher: {
            '@type': 'Organization',
            name: 'InTransparency',
            logo: { '@type': 'ImageObject', url: 'https://www.in-transparency.com/logo.png' },
          },
          description: c.jsonLdDescription,
          mainEntityOfPage: `https://www.in-transparency.com/${locale}/why-now`,
        }}
      />
      <JsonLd
        data={breadcrumbList([
          { name: locale === 'it' ? 'Home' : 'Home', url: `/${locale}` },
          {
            name: locale === 'it' ? 'Per gli atenei' : 'For universities',
            url: `/${locale}/for-universities`,
          },
          { name: locale === 'it' ? 'Perché ora' : 'Why now', url: `/${locale}/why-now` },
        ])}
      />
      <Header />
      <main className="container max-w-3xl mx-auto px-4 pt-32 pb-16 prose-article">
        <Badge variant="outline" className="mb-3 bg-amber-50 border-amber-300 text-amber-800">
          <AlertTriangle className="h-3 w-3 mr-1" />
          {c.heroBadge}
        </Badge>
        <h1 className="text-4xl font-bold mb-4">{c.h1}</h1>
        <p className="text-lg text-muted-foreground mb-8">{c.intro}</p>

        <hr className="my-8" />

        {c.sections.map((section, idx) => {
          const Icon = SECTION_ICONS[idx] ?? ShieldCheck
          return (
            <div key={idx}>
              <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
                <Icon className="h-6 w-6 text-primary" />
                {section.h2}
              </h2>
              {section.paragraphs.map((p, pIdx) => (
                <p key={pIdx} className="mb-3">
                  {p}
                </p>
              ))}
              {section.bullets && (
                <ul className="list-disc pl-6 mb-4 space-y-1">
                  {section.bullets.map((b, bIdx) => (
                    <li key={bIdx}>{b}</li>
                  ))}
                </ul>
              )}
              {section.closing && <p className="mb-6">{section.closing}</p>}
              <hr className="my-8" />
            </div>
          )
        })}

        <Card className="bg-primary/5 border-primary/30 my-8">
          <CardContent className="pt-6 pb-6">
            <h3 className="text-xl font-bold mb-2">{c.callToActionCard.h3}</h3>
            <ol className="list-decimal pl-6 space-y-2 text-sm">
              {c.callToActionCard.steps.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link href="/contact?role=university&subject=pilot">
                  {c.callToActionCard.primaryCta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/algorithm-registry">{c.callToActionCard.secondaryCta}</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-xs text-muted-foreground italic mt-8">{c.reviewedFootnote}</div>
      </main>
      <Footer />
    </div>
  )
}
