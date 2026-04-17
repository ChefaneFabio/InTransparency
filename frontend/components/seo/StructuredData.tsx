export function StructuredData() {
  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'InTransparency',
    url: 'https://in-transparency.vercel.app',
    logo: 'https://in-transparency.vercel.app/logo.png',
    description: 'Verified academic portfolios connecting graduates with employers through transparent, trusted credentials.',
    sameAs: [
      'https://www.linkedin.com/company/intransparency',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'info@in-transparency.com',
      telephone: '+39-344-494-2399',
      contactType: 'customer support',
      availableLanguage: ['English', 'Italian'],
    },
  }

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'InTransparency',
    url: 'https://in-transparency.vercel.app',
    description: 'The platform that bridges universities, students, and employers through verified academic credentials.',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://in-transparency.vercel.app/en/explore?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
    </>
  )
}
