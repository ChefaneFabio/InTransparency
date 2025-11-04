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

  // TODO: Fetch institution details once Institution model is added to schema
  // For now, using mock/default values
  const institution = {
    name: 'Politecnico di Milano', // Default institution name
    logoUrl: null,
    subscriptionTier: 'PREMIUM_EMBED', // Allow widget access for demo
    brandingConfig: {}
  }

  // Get branding from URL params or defaults
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
