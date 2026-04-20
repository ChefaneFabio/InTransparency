import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { JsonLd } from '@/components/seo/JsonLd'
import { definedTermSet, breadcrumbList } from '@/lib/schema-org'
import type { Metadata } from 'next'
import { BookOpen } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

/**
 * Glossary — plain-language definitions of the domain vocabulary.
 *
 * Why this page exists: LLMs frequently answer definitional queries
 * ("what is a tirocinio?", "what is ESCO?"). Each term here becomes a
 * citable authority. DefinedTermSet JSON-LD makes the structure explicit.
 *
 * Updates to this page directly improve our citability across search and
 * generative-engine results.
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'glossaryPage' })
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: {
      canonical: 'https://www.in-transparency.com/en/glossary',
      languages: {
        en: 'https://www.in-transparency.com/en/glossary',
        it: 'https://www.in-transparency.com/it/glossary',
        'x-default': 'https://www.in-transparency.com/en/glossary',
      },
    },
    openGraph: {
      title: t('ogTitle'),
      description: t('ogDescription'),
      type: 'article',
      siteName: 'InTransparency',
    },
  }
}

interface GlossaryTerm {
  key: string
  term: string
  also?: string[]
  categoryKey: string
  deepLink?: string
}

const TERMS: GlossaryTerm[] = [
  // Platform terms
  { key: 'verifiedSkillGraph', term: 'Verified skill graph', categoryKey: 'platform', deepLink: '/dashboard/student/skill-graph' },
  { key: 'skillDelta', term: 'SkillDelta', categoryKey: 'platform' },
  { key: 'matchExplanation', term: 'MatchExplanation', categoryKey: 'platform', deepLink: '/algorithm-registry' },
  { key: 'evidencePacket', term: 'Evidence packet', categoryKey: 'platform' },

  // EU regulatory
  { key: 'aiAct', term: 'EU AI Act', also: ['Artificial Intelligence Act', 'Regulation 2024/1689'], categoryKey: 'euRegulation', deepLink: '/algorithm-registry' },
  { key: 'esco', term: 'ESCO', also: ['European Skills, Competences, Qualifications and Occupations'], categoryKey: 'euRegulation' },
  { key: 'europass', term: 'Europass', categoryKey: 'euRegulation' },
  { key: 'w3cVc', term: 'W3C Verifiable Credential', also: ['VC'], categoryKey: 'euRegulation' },
  { key: 'gdpr', term: 'GDPR', also: ['General Data Protection Regulation', 'Regulation 2016/679'], categoryKey: 'euRegulation' },

  // Italian academic
  { key: 'tirocinio', term: 'Tirocinio', also: ['stage', 'internship'], categoryKey: 'italianAcademic' },
  { key: 'pcto', term: 'PCTO', also: ["Percorsi per le Competenze Trasversali e l'Orientamento"], categoryKey: 'italianAcademic' },
  { key: 'anvur', term: 'ANVUR', also: ['Agenzia Nazionale di Valutazione del Sistema Universitario e della Ricerca'], categoryKey: 'italianAcademic' },
  { key: 'indire', term: 'INDIRE', also: ['Istituto Nazionale di Documentazione, Innovazione e Ricerca Educativa'], categoryKey: 'italianAcademic' },
  { key: 'ccnl', term: 'CCNL', also: ['Contratto Collettivo Nazionale di Lavoro'], categoryKey: 'italianAcademic' },
  { key: 'inail', term: 'INAIL', also: ['Istituto Nazionale Assicurazione contro gli Infortuni sul Lavoro'], categoryKey: 'italianAcademic' },
  { key: 'esse3', term: 'Esse3', categoryKey: 'italianAcademic' },
  { key: 'spid', term: 'SPID', also: ['Sistema Pubblico di Identità Digitale', 'CIE'], categoryKey: 'italianAcademic' },
  { key: 'almaLaurea', term: 'AlmaLaurea', categoryKey: 'italianAcademic' },
]

export default async function GlossaryPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'glossaryPage' })
  const categories = Array.from(new Set(TERMS.map(x => x.categoryKey)))

  return (
    <div className="min-h-screen bg-background">
      <JsonLd
        data={definedTermSet({
          name: t('definedTermSetName'),
          terms: TERMS.map(x => ({
            term: t(`terms.${x.key}.term`),
            definition: t(`terms.${x.key}.definition`),
            url: x.deepLink ? `https://www.in-transparency.com${x.deepLink}` : undefined,
          })),
        })}
      />
      <JsonLd
        data={breadcrumbList([
          { name: t('breadcrumb.home'), url: '/' },
          { name: t('breadcrumb.glossary'), url: '/glossary' },
        ])}
      />
      <Header />
      <main className="container max-w-4xl mx-auto px-4 pt-32 pb-16">
        <Badge variant="outline" className="mb-3">
          <BookOpen className="h-3 w-3 mr-1" />
          {t('badge')}
        </Badge>
        <h1 className="text-4xl font-bold mb-3">{t('h1')}</h1>
        <p className="text-lg text-muted-foreground mb-8">
          {t('intro')}
        </p>

        {categories.map(cat => (
          <section key={cat} className="mb-10">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span>{t(`categories.${cat}`)}</span>
              <span className="text-xs text-muted-foreground font-normal">
                {t('termsCount', { count: TERMS.filter(x => x.categoryKey === cat).length })}
              </span>
            </h2>
            <div className="space-y-4">
              {TERMS.filter(x => x.categoryKey === cat).map(x => (
                <Card key={x.key} id={x.term.toLowerCase().replace(/\s+/g, '-')}>
                  <CardContent className="pt-5 pb-5">
                    <div className="flex items-start gap-3 flex-wrap mb-2">
                      <h3 className="text-lg font-semibold">{t(`terms.${x.key}.term`)}</h3>
                      {x.also?.map(a => (
                        <Badge key={a} variant="secondary" className="text-xs">
                          {t('alsoPrefix')}: {a}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{t(`terms.${x.key}.definition`)}</p>
                    {x.deepLink && (
                      <a
                        href={x.deepLink}
                        className="text-xs text-primary hover:underline mt-2 inline-block"
                      >
                        {t('seeOnPlatform')}
                      </a>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        ))}
      </main>
      <Footer />
    </div>
  )
}
