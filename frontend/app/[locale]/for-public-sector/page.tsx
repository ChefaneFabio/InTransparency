import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbList } from '@/lib/schema-org'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import ForPublicSectorContent from './ForPublicSectorContent'

/**
 * /en/for-public-sector — procurement-ready summary for EU ministries,
 * national agencies, regional authorities, and university consortia.
 */

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'forPublicSector' })
  return {
    title: t('meta.title'),
    description: t('meta.description'),
    alternates: { canonical: 'https://www.in-transparency.com/en/for-public-sector' },
    openGraph: {
      title: t('meta.ogTitle'),
      description: t('meta.ogDescription'),
      type: 'article',
      siteName: 'InTransparency',
    },
  }
}

export default async function PublicSectorPage({
  params: { locale },
}: {
  params: { locale: string }
}) {
  const t = await getTranslations({ locale, namespace: 'forPublicSector' })
  return (
    <>
      <JsonLd
        data={breadcrumbList([
          { name: t('breadcrumb.home'), url: '/' },
          { name: t('breadcrumb.forPublicSector'), url: '/for-public-sector' },
        ])}
      />
      <ForPublicSectorContent />
    </>
  )
}
