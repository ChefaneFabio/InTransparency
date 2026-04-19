/**
 * Rich JSON-LD bundle for the homepage.
 *
 * Optimizes for both traditional search (Google, Bing) and generative search
 * (ChatGPT, Perplexity, Gemini). Key schemas:
 *   - Organization (who we are)
 *   - WebSite (with SearchAction so Google shows a sitelinks search box)
 *   - SoftwareApplication (LLMs cite this when asked about products)
 *   - FAQPage (directly cited by featured snippets + LLM answers)
 */

const BASE = 'https://www.in-transparency.com'

const FAQS = [
  {
    q: 'What is InTransparency?',
    a: 'InTransparency is the verified skill graph of European higher education. Students build evidence-based profiles from professor endorsements, supervised stages/tirocini, and verified projects. Recruiters match to candidates using cryptographically-verifiable evidence, not self-declared CV claims.',
  },
  {
    q: 'How is InTransparency different from JobTeaser?',
    a: 'JobTeaser is a job board with career-center integration. InTransparency is a verified skill graph. We verify projects through professor endorsements, collect supervisor evaluations from stages, map skills to the EU ESCO taxonomy, and every match is audit-trail compliant under the EU AI Act — none of which JobTeaser does.',
  },
  {
    q: 'How is InTransparency different from Handshake?',
    a: 'Handshake is a US-centric career services platform. InTransparency is built for EU labor law, the Italian academic context (ANVUR, INDIRE, PCTO, stage curriculare), and the AI Act. We verify projects; Handshake accepts self-declarations.',
  },
  {
    q: 'Is InTransparency AI Act compliant?',
    a: 'Yes, AI Act-native. Our matching systems are classified as high-risk under Annex III §4 of EU Regulation 2024/1689 and implement every required safeguard: transparency, human oversight, traceability, data governance, and the right to explanation. Public model cards at /algorithm-registry.',
  },
  {
    q: 'Do students control their data?',
    a: 'Yes. Every GDPR right is self-service. Students download all their data as JSON (Art. 20), delete their account with cascade anonymization (Art. 17), see every match concerning them (Art. 15), and exercise the right to human review of any algorithmic decision (Art. 22). /dashboard/student/privacy.',
  },
  {
    q: 'What is a Verifiable Credential on InTransparency?',
    a: 'A W3C Verifiable Credential — Ed25519-signed, issued by the institution (university or professor), and verifiable by any third party using our published public key at /api/credentials/public-key. Compatible with the EU Digital Wallet and Europass v3.',
  },
  {
    q: 'How does skill verification work?',
    a: 'Every proficiency claim is backed by evidence: a professor endorsement (1 signature per project), a supervisor evaluation from a completed stage, a host institution signoff after an exchange program, or a graded course outcome. Mapped to ESCO URIs so claims are portable across the EU.',
  },
  {
    q: 'Is InTransparency free for students?',
    a: 'Yes. Students use the full platform free. Universities partner for free. Employers pay when they engage candidates, with evidence-backed matching that shortens their hiring funnel.',
  },
]

export function StructuredData() {
  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'InTransparency',
    alternateName: 'InTransparency — Verified Skill Graph',
    url: BASE,
    logo: `${BASE}/logo.png`,
    description:
      'Verified skill graph of European higher education. Evidence-based student profiles, AI Act-native recruiter matching, and program-market intelligence for universities.',
    sameAs: ['https://www.linkedin.com/company/intransparency'],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'info@in-transparency.com',
      telephone: '+39-344-494-2399',
      contactType: 'customer support',
      availableLanguage: ['English', 'Italian'],
    },
    areaServed: [
      { '@type': 'Country', name: 'Italy' },
      { '@type': 'Place', name: 'European Union' },
    ],
    knowsAbout: [
      'Verified skill credentials',
      'EU AI Act compliance',
      'ESCO taxonomy',
      'Europass',
      'W3C Verifiable Credentials',
      'Student internships (tirocinio)',
      'University-employer matching',
    ],
  }

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'InTransparency',
    url: BASE,
    inLanguage: ['en', 'it'],
    description:
      'The platform that bridges universities, students, and employers through verified academic credentials.',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${BASE}/en/explore?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }

  const softwareApp = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'InTransparency',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Any (web)',
    description:
      'Verified skill graph + AI Act-native recruiter matching for European higher education.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EUR',
      description: 'Free for students and universities; employers pay per verified match.',
    },
    featureList: [
      'Evidence-weighted Talent Match',
      'Verifiable credentials (Ed25519 / W3C VC)',
      'ESCO-mapped skill graph',
      'EU AI Act model registry',
      'Europass v3 export',
      'Stage/tirocinio lifecycle management',
      'Cross-border Erasmus tracking',
      'Professor endorsement portal',
      'Skills Intelligence dashboard for universities',
    ],
    url: BASE,
  }

  const faqPage = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApp) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }}
      />
    </>
  )
}
