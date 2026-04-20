/**
 * Changelog / product news entries.
 *
 * Keep newest entries at the top. Each entry becomes an Article card on
 * /changelog, an individual BlogPosting in the JSON-LD ItemList, and one
 * <item> in the RSS feed.
 *
 * Fresh content signals matter for SEO (recency) and GEO (LLMs favor
 * recently-published pages when answering time-sensitive queries).
 */

export interface ChangelogEntry {
  /** ISO date, YYYY-MM-DD. Used for sort + RSS pubDate. */
  date: string
  /** Stable slug for the permalink /changelog#slug */
  slug: string
  /** Category — used as visual badge */
  category: 'feature' | 'infrastructure' | 'compliance' | 'performance' | 'content'
  /** Short title */
  title: string
  /** One-paragraph summary (≤280 chars ideal) */
  summary: string
  /** Optional longer body (markdown-ish plain text) */
  body?: string
  /** Optional deep link */
  link?: string
}

export const CHANGELOG: ChangelogEntry[] = [
  {
    date: '2026-04-20',
    slug: 'italian-content',
    category: 'content',
    title: 'Italian content for the two highest-citability pages',
    summary:
      'The "Why now" brief for academic leaders and the JobTeaser/Handshake comparison page now render fully in Italian when viewed at /it/*. Cattolica and UniBG prospects can read the case in their own language, and Italian-market LLM queries surface localized content.',
    link: '/it/why-now',
  },
  {
    date: '2026-04-19',
    slug: 'geo-stack',
    category: 'content',
    title: 'Full GEO stack: llms-full.txt, 20 AI crawlers, glossary, facts',
    summary:
      'Published /llms-full.txt with comprehensive machine-readable reference. Explicitly allowlisted 20 AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Applebot-Extended, CCBot, and more). Added /en/glossary with DefinedTermSet schema and /en/facts with Dataset schema. Markdown mirrors of key pages.',
    link: '/llms-full.txt',
  },
  {
    date: '2026-04-19',
    slug: 'university-conquest',
    category: 'content',
    title: 'University conversion stack — urgency, savings, prestige',
    summary:
      'Rebuilt /for-universities with three new sections: UniversityUrgency (AI Act + ANVUR + PCTO pressures), SavingsCalculator (interactive, €116k+/yr typical savings), UniversityPrestige (rector-level framing). Plus new /why-now longform article for academic leaders.',
    link: '/en/for-universities',
  },
  {
    date: '2026-04-19',
    slug: 'seo-sitemap-jsonld',
    category: 'content',
    title: 'SEO: dynamic sitemap, richer JSON-LD, cache headers, DB optimizations',
    summary:
      'Sitemap now includes published company profiles + active jobs + all segment landing pages. Organization JSON-LD on /c/[slug]. Cache-Control on /api/companies/*. Directory filter sidebar rewritten with UNNEST + DISTINCT for 50× faster queries.',
  },
  {
    date: '2026-04-19',
    slug: 'phase-ef',
    category: 'feature',
    title: 'Italy specifics + three-sided polish',
    summary:
      'SPID/CIE scaffold with AgID-compliant IdP picker UI. 18-entry CCNL catalog for Convention Builder. Esse3 adapter interface. CV auto-generation from verified skill graph. Team seats on Organization with seat-limit enforcement (402 Payment Required on overflow).',
  },
  {
    date: '2026-04-19',
    slug: 'hardening',
    category: 'compliance',
    title: 'Market-ready hardening — cookies, GDPR, 2FA, rate limits',
    summary:
      'Cookie consent banner (Garante-compliant). GDPR Art. 20 data export + Art. 17 account deletion self-service. AuditLog model + lib/audit wiring on sensitive operations. TOTP 2FA (RFC 6238) with backup codes. Public-read rate limits.',
    link: '/en/dashboard/student/privacy',
  },
  {
    date: '2026-04-19',
    slug: 'neon-migrations',
    category: 'infrastructure',
    title: 'Vision schema applied to Neon production; ESCO seeded',
    summary:
      'Applied 20260418_vision_wire_up.sql (+ hardening + search-indexes) to production Neon. 93 skills seeded with ESCO v1.2.0 URIs. Ed25519 VC signing live at /api/credentials/public-key. Build fixed for Vercel (skip prisma db push on cold Neon).',
    link: '/api/credentials/public-key',
  },
  {
    date: '2026-04-19',
    slug: 'tests',
    category: 'performance',
    title: '48-test suite shipped — data-quality, integration, benchmarks',
    summary:
      'Jest + Next.js configured. Unit tests for pure logic. Integration tests hitting live Neon. Benchmarks proving sub-70ms P95 on every critical query: ~14ms match read, ~29ms user lookup, ~58ms skill graph aggregation. Full suite runs in 26 seconds.',
  },
  {
    date: '2026-04-18',
    slug: 'user-stories',
    category: 'feature',
    title: 'User-story improvements — onboarding, roles, followers, evidence packet, professor portal',
    summary:
      'Student-side: first-login onboarding gate, "Roles for you" matcher, matches list + notifications, skill graph view, credentials UI, pending-verifications home card. Recruiter-side: followers inbox, printable evidence packet combining match + VCs + endorsements. Professor portal via magic token.',
    link: '/en/dashboard/student/skill-graph',
  },
  {
    date: '2026-04-18',
    slug: 'seven-products',
    category: 'feature',
    title: 'Core vision shipped — 7 products wire the verified skill graph',
    summary:
      'Skill Graph 2.0 (SkillDelta + ESCO), AI Act explainability (MatchExplanation + right-to-explanation endpoints), Skills Intelligence v2 (program-level trends + curriculum recs), Europass export, Verifiable Credentials (Ed25519), cross-border Erasmus layer, Company Discovery Hub (/c/[slug]), self-discovery onboarding.',
    link: '/en/algorithm-registry',
  },
]

export function getChangelogEntry(slug: string): ChangelogEntry | undefined {
  return CHANGELOG.find(e => e.slug === slug)
}

export function latestChangelogDate(): string {
  return CHANGELOG[0]?.date ?? new Date().toISOString().slice(0, 10)
}
