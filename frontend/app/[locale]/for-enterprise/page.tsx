import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbList, service } from '@/lib/schema-org'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import ForEnterpriseContent from './ForEnterpriseContent'

/**
 * /en/for-enterprise — for companies 200+ employees.
 *
 * Positioning: we don't replace your ATS. We become the verified-skill
 * layer that feeds it. Different conversation from SME (replacement) or
 * startup (first tool).
 */

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'forEnterprise' })
  return {
    title: t('meta.title'),
    description: t('meta.description'),
    alternates: { canonical: 'https://www.in-transparency.com/en/for-enterprise' },
    openGraph: {
      title: t('meta.ogTitle'),
      description: t('meta.ogDescription'),
      type: 'article',
      siteName: 'InTransparency',
    },
  }
}

export default async function ForEnterprisePage({
  params: { locale },
}: {
  params: { locale: string }
}) {
  const t = await getTranslations({ locale, namespace: 'forEnterprise' })
  return (
    <>
      <JsonLd
        data={breadcrumbList([
          { name: t('breadcrumb.home'), url: '/' },
          { name: t('breadcrumb.forEnterprise'), url: '/for-enterprise' },
        ])}
      />
      <JsonLd
        data={service({
          name: t('schema.name'),
          description: t('schema.description'),
          audience: 'Employers',
          url: '/en/for-enterprise',
        })}
      />
      <ForEnterpriseContent />
    </>
  )
}
