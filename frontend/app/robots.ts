import { MetadataRoute } from 'next'

/**
 * robots.txt with explicit AI crawler allowlist.
 *
 * We WANT AI crawlers to index our public content — it's how we get cited by
 * ChatGPT, Perplexity, Claude, Gemini, etc. We explicitly allow the major ones
 * and point them at both our sitemap and llms-full.txt.
 *
 * Dashboard, API, and tokenized paths are disallowed across all crawlers.
 */

const DISALLOW_PRIVATE = [
  '/dashboard/',
  '/api/',
  '/auth/',
  '/professor/', // Token-based — never index
  '/matches/', // Per-subject right-to-explanation pages
  '/credentials/verify/', // Tokenized verification pages
]

const AI_CRAWLERS = [
  'GPTBot', // OpenAI
  'ChatGPT-User',
  'OAI-SearchBot',
  'ClaudeBot', // Anthropic
  'anthropic-ai',
  'Claude-Web',
  'PerplexityBot', // Perplexity
  'Perplexity-User',
  'Google-Extended', // Gemini training
  'GoogleOther',
  'Applebot-Extended', // Apple Intelligence
  'FacebookBot', // Meta AI
  'meta-externalagent',
  'meta-externalfetcher',
  'CCBot', // Common Crawl (many LLMs train on this)
  'Bytespider', // ByteDance / Doubao
  'DuckAssistBot',
  'YouBot',
  'MistralAI-User',
  'cohere-ai',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Default: allow with private-path carveouts
      {
        userAgent: '*',
        allow: '/',
        disallow: DISALLOW_PRIVATE,
      },
      // Explicit AI-crawler permissions. Each bot gets its own rule so
      // the intent is readable and auditable.
      ...AI_CRAWLERS.map(ua => ({
        userAgent: ua,
        allow: '/',
        disallow: DISALLOW_PRIVATE,
      })),
    ],
    sitemap: 'https://www.in-transparency.com/sitemap.xml',
    host: 'https://www.in-transparency.com',
  }
}
