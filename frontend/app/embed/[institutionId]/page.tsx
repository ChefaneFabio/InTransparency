import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import InstitutionWidget from '@/components/embed/InstitutionWidget'

interface EmbedPageProps {
  params: {
    institutionId: string
  }
  searchParams: {
    primaryColor?: string
    secondaryColor?: string
    showLogo?: string
    maxMatches?: string
    refreshInterval?: string
  }
}

export default async function EmbedPage({ params, searchParams }: EmbedPageProps) {
  const { institutionId } = params

  // Fetch institution details
  const institution = await prisma.institution.findUnique({
    where: { id: institutionId },
    select: {
      name: true,
      logoUrl: true,
      subscriptionTier: true,
      brandingConfig: true
    }
  })

  if (!institution) {
    notFound()
  }

  // Verify Premium Embed access
  if (!['PREMIUM_EMBED', 'ENTERPRISE_CUSTOM'].includes(institution.subscriptionTier || '')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Upgrade Required</h1>
          <p className="text-gray-600 mb-6">
            The embeddable widget is available with Premium Embed tier (€500/year).
          </p>
          <a
            href="https://intransparency.com/pricing"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            View Pricing
          </a>
        </div>
      </div>
    )
  }

  // Get branding from DB or URL params
  const branding = institution.brandingConfig as any || {}
  const primaryColor = searchParams.primaryColor || branding.primaryColor || '#3b82f6'
  const secondaryColor = searchParams.secondaryColor || branding.secondaryColor || '#10b981'
  const showLogo = searchParams.showLogo === 'false' ? false : (branding.showLogo ?? true)
  const maxMatches = parseInt(searchParams.maxMatches || branding.maxMatches || '5')
  const refreshInterval = parseInt(searchParams.refreshInterval || branding.refreshInterval || '30000')

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <InstitutionWidget
        institutionId={institutionId}
        institutionName={institution.name}
        logoUrl={institution.logoUrl || undefined}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        showLogo={showLogo}
        maxMatches={maxMatches}
        refreshInterval={refreshInterval}
      />
    </div>
  )
}
