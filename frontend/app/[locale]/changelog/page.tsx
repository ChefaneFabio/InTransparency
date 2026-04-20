import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbList } from '@/lib/schema-org'
import { CHANGELOG, type ChangelogEntry } from '@/lib/content/changelog'
import type { Metadata } from 'next'
import { Rss, Sparkles, ArrowRight } from 'lucide-react'
import { Link } from '@/navigation'

/**
 * Changelog — product updates feed.
 *
 * Emits a BlogPosting JSON-LD per entry so LLMs cite recent changes and
 * Google shows freshness signals. RSS feed lives at /feed.xml.
 */

export const metadata: Metadata = {
  title: 'Changelog — InTransparency product updates',
  description: 'Shipping log for the InTransparency platform: features, compliance, performance, infrastructure.',
  alternates: {
    canonical: 'https://www.in-transparency.com/en/changelog',
    languages: {
      en: 'https://www.in-transparency.com/en/changelog',
      it: 'https://www.in-transparency.com/it/changelog',
      'x-default': 'https://www.in-transparency.com/en/changelog',
    },
    types: {
      'application/rss+xml': 'https://www.in-transparency.com/feed.xml',
    },
  },
  openGraph: {
    title: 'Changelog — InTransparency product updates',
    description: 'What we shipped, when, and why.',
    type: 'article',
    siteName: 'InTransparency',
  },
}

const CATEGORY_STYLE: Record<ChangelogEntry['category'], string> = {
  feature: 'bg-primary/10 text-primary border-primary/30',
  infrastructure: 'bg-slate-100 text-slate-700 border-slate-300',
  compliance: 'bg-amber-50 text-amber-800 border-amber-300',
  performance: 'bg-emerald-50 text-emerald-800 border-emerald-300',
  content: 'bg-blue-50 text-blue-800 border-blue-300',
}

const BASE = 'https://www.in-transparency.com'

export default function ChangelogPage() {
  // Emit one BlogPosting per entry, wrapped in an ItemList
  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: CHANGELOG.map((e, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      item: {
        '@type': 'BlogPosting',
        headline: e.title,
        datePublished: e.date,
        dateModified: e.date,
        url: `${BASE}/en/changelog#${e.slug}`,
        description: e.summary,
        author: { '@type': 'Organization', name: 'InTransparency' },
        publisher: {
          '@type': 'Organization',
          name: 'InTransparency',
          logo: { '@type': 'ImageObject', url: `${BASE}/logo.png` },
        },
        articleSection: e.category,
      },
    })),
  }

  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={itemList} />
      <JsonLd
        data={breadcrumbList([
          { name: 'Home', url: '/' },
          { name: 'Changelog', url: '/changelog' },
        ])}
      />
      <Header />
      <main className="container max-w-3xl mx-auto px-4 pt-32 pb-16">
        <div className="flex items-start justify-between mb-8 gap-4">
          <div>
            <Badge variant="outline" className="mb-3">
              <Sparkles className="h-3 w-3 mr-1" />
              Shipping log
            </Badge>
            <h1 className="text-4xl font-bold mb-2">Changelog</h1>
            <p className="text-lg text-muted-foreground">
              What we shipped, when, and why. Freshest at the top.
            </p>
          </div>
          <a
            href="/feed.xml"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
            title="RSS feed"
          >
            <Rss className="h-4 w-4" />
            RSS
          </a>
        </div>

        <div className="space-y-4">
          {CHANGELOG.map(entry => (
            <article key={entry.slug} id={entry.slug}>
              <Card className="hover:border-primary/40 transition-colors">
                <CardContent className="pt-5 pb-5">
                  <div className="flex items-center gap-3 flex-wrap mb-2">
                    <time className="text-sm text-muted-foreground">{entry.date}</time>
                    <Badge variant="outline" className={`text-xs ${CATEGORY_STYLE[entry.category]}`}>
                      {entry.category}
                    </Badge>
                  </div>
                  <h2 className="text-lg font-semibold mb-2">
                    <a href={`#${entry.slug}`} className="hover:text-primary">
                      {entry.title}
                    </a>
                  </h2>
                  <p className="text-sm text-muted-foreground mb-3">{entry.summary}</p>
                  {entry.body && (
                    <p className="text-sm text-muted-foreground whitespace-pre-line">{entry.body}</p>
                  )}
                  {entry.link && (
                    <Link
                      href={entry.link as any}
                      className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                    >
                      Go to the change
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  )}
                </CardContent>
              </Card>
            </article>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
