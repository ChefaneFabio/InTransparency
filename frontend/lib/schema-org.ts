/**
 * schema.org JSON-LD builders — reusable structured-data helpers.
 *
 * Each function returns a JSON-LD object that components can feed into
 * <JsonLd>. Keep everything typed so breaking changes show up at compile time.
 */

const BASE = 'https://www.in-transparency.com'

export interface BreadcrumbItem {
  name: string
  url: string
}

/**
 * BreadcrumbList — emit on every content page. Helps Google + LLMs
 * understand the hierarchy of the page.
 */
export function breadcrumbList(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${BASE}${item.url}`,
    })),
  }
}

/**
 * Service schema for /for-universities and /for-companies etc.
 * LLMs cite this when asked "what does X offer."
 */
export function service(params: {
  name: string
  description: string
  audience: 'Universities' | 'Employers' | 'Students' | 'Schools'
  url: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: params.name,
    description: params.description,
    provider: {
      '@type': 'Organization',
      name: 'InTransparency',
      url: BASE,
    },
    areaServed: [
      { '@type': 'Country', name: 'Italy' },
      { '@type': 'Place', name: 'European Union' },
    ],
    audience: {
      '@type': 'Audience',
      audienceType: params.audience,
    },
    url: params.url.startsWith('http') ? params.url : `${BASE}${params.url}`,
  }
}

/**
 * EducationalOrganization for /universities/[slug]. Enables Google
 * "knowledge panel" style rendering and clean LLM attribution.
 */
export function educationalOrganization(params: {
  name: string
  url: string
  logo?: string
  description?: string
  city?: string
  country?: string
  founded?: number
  numberOfStudents?: number
  rankingScore?: number
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: params.name,
    description: params.description,
    url: params.url,
    logo: params.logo,
    address: params.city || params.country
      ? {
          '@type': 'PostalAddress',
          addressLocality: params.city,
          addressCountry: params.country,
        }
      : undefined,
    foundingDate: params.founded ? String(params.founded) : undefined,
    numberOfStudents: params.numberOfStudents,
    // Only include aggregateRating if we have a real ratingCount (≥1) —
    // Google's rich-results validation rejects a single-value rating as spammy.
    aggregateRating:
      typeof params.rankingScore === 'number' && params.rankingScore > 0
        ? {
            '@type': 'AggregateRating',
            ratingValue: params.rankingScore,
            bestRating: 100,
            worstRating: 0,
            ratingCount: 1,
          }
        : undefined,
  }
}

/**
 * JobPosting — appears in Google Jobs carousel. Huge SEO win.
 */
export function jobPosting(params: {
  id: string
  title: string
  description: string
  datePosted: string
  validThrough?: string
  employmentType?: 'FULL_TIME' | 'PART_TIME' | 'CONTRACTOR' | 'INTERN'
  hiringOrganization: { name: string; logo?: string; url?: string }
  jobLocation?: { city?: string; country?: string }
  workLocationType?: 'TELECOMMUTE' | 'ONSITE' | 'HYBRID'
  requiredSkills?: string[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    identifier: { '@type': 'PropertyValue', name: 'InTransparency', value: params.id },
    title: params.title,
    description: params.description,
    datePosted: params.datePosted,
    validThrough: params.validThrough,
    employmentType: params.employmentType,
    hiringOrganization: {
      '@type': 'Organization',
      name: params.hiringOrganization.name,
      logo: params.hiringOrganization.logo,
      sameAs: params.hiringOrganization.url,
    },
    jobLocation: params.jobLocation?.city
      ? {
          '@type': 'Place',
          address: {
            '@type': 'PostalAddress',
            addressLocality: params.jobLocation.city,
            addressCountry: params.jobLocation.country,
          },
        }
      : undefined,
    jobLocationType:
      params.workLocationType === 'TELECOMMUTE' ? 'TELECOMMUTE' : undefined,
    skills: params.requiredSkills?.join(', '),
  }
}

/**
 * HowTo — for the HowItWorks section on landing pages.
 * LLMs frequently cite HowTo when asked "how do I do X on platform Y."
 */
export function howTo(params: { name: string; steps: Array<{ name: string; text: string; url?: string }> }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: params.name,
    step: params.steps.map((s, idx) => ({
      '@type': 'HowToStep',
      position: idx + 1,
      name: s.name,
      text: s.text,
      url: s.url,
    })),
  }
}

/**
 * DefinedTermSet — for the glossary page. Maximally citable by LLMs
 * because they frequently answer definitional questions.
 */
export function definedTermSet(params: { name: string; terms: Array<{ term: string; definition: string; url?: string }> }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    name: params.name,
    hasDefinedTerm: params.terms.map(t => ({
      '@type': 'DefinedTerm',
      name: t.term,
      description: t.definition,
      url: t.url,
    })),
  }
}

/**
 * Dataset — for the statistics / facts page. Google Dataset Search indexes
 * these, and LLMs treat them as high-confidence factual citations.
 */
export function dataset(params: {
  name: string
  description: string
  url: string
  dateModified: string
  creator?: string
  variables?: string[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: params.name,
    description: params.description,
    url: params.url,
    dateModified: params.dateModified,
    creator: {
      '@type': 'Organization',
      name: params.creator ?? 'InTransparency',
      url: BASE,
    },
    variableMeasured: params.variables,
    license: 'https://creativecommons.org/licenses/by/4.0/',
    isAccessibleForFree: true,
  }
}
