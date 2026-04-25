import { NextRequest, NextResponse } from 'next/server'
import { aiLimiter, getClientIp } from '@/lib/rate-limit'
import { anthropic, AI_MODEL } from '@/lib/openai-shared'

/**
 * GET /api/recruiter/enrich-domain?email=foo@brembo.it
 * GET /api/recruiter/enrich-domain?domain=brembo.it
 *
 * Public endpoint (rate-limited). Returns a best-effort enrichment for a
 * company domain so we can autofill the recruiter signup + RecruiterSettings
 * form. No third-party API key required for the baseline pass:
 *
 *   - companyName  → titlecased second-level domain
 *   - companyWebsite → https://{domain}
 *   - companyLogo  → Clearbit Logo CDN (free, no auth)
 *
 * If `?ai=1` is passed and Claude is configured, we additionally infer
 * industry + a 1-sentence description. Skipped silently if the AI call
 * fails — the baseline fields are always returned so the UX never breaks.
 */

const FREE_PROVIDERS = new Set([
  'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'live.com',
  'icloud.com', 'mail.com', 'protonmail.com', 'gmx.com', 'tutanota.com',
  'libero.it', 'virgilio.it', 'tin.it', 'alice.it',
])

function extractDomain(input: string): string | null {
  const trimmed = input.trim().toLowerCase()
  if (!trimmed) return null
  // email → take part after @
  if (trimmed.includes('@')) {
    const parts = trimmed.split('@')
    return parts[1] || null
  }
  // strip protocol + path
  return trimmed.replace(/^https?:\/\//, '').replace(/\/.*$/, '').replace(/^www\./, '')
}

function titlecaseFromDomain(domain: string): string {
  // brembo.it → "Brembo", iberdrola.com → "Iberdrola", st-microelectronics.com → "St Microelectronics"
  const sld = domain.split('.')[0] || domain
  return sld
    .split(/[-_]/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

interface AiInferredFields {
  industry?: string
  description?: string
  companySizeGuess?: string
}

async function inferAiFields(companyName: string, domain: string): Promise<AiInferredFields> {
  try {
    const prompt = `You are helping pre-fill a recruiter onboarding form.

Company name: "${companyName}"
Company website: ${domain}

If you recognise this company, return a JSON object with these fields (all optional — omit any you're not confident about):
- industry: one short label, e.g. "Automotive", "Fintech", "Pharma", "SaaS / B2B Software"
- description: ONE sentence, max 18 words, factual ("Italian automotive brake systems manufacturer.")
- companySizeGuess: one of "1-10", "11-50", "51-200", "201-500", "500+"

If you don't recognise the company, return {}.

Reply with ONLY the JSON object, no markdown fences, no commentary.`

    const result = await anthropic.messages.create({
      model: AI_MODEL,
      max_tokens: 200,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = result.content
      .filter(b => b.type === 'text')
      .map(b => (b as { type: 'text'; text: string }).text)
      .join('')
      .trim()

    // Strip ```json fences if Claude wraps the response despite instructions
    const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()
    const parsed = JSON.parse(cleaned)
    return {
      industry: typeof parsed.industry === 'string' ? parsed.industry : undefined,
      description: typeof parsed.description === 'string' ? parsed.description : undefined,
      companySizeGuess: typeof parsed.companySizeGuess === 'string' ? parsed.companySizeGuess : undefined,
    }
  } catch {
    return {}
  }
}

export async function GET(req: NextRequest) {
  // Rate-limit by IP — this is a public endpoint
  const ip = getClientIp(req)
  const { success } = aiLimiter.check(ip)
  if (!success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const { searchParams } = new URL(req.url)
  const raw = searchParams.get('email') || searchParams.get('domain') || ''
  const useAi = searchParams.get('ai') === '1'

  const domain = extractDomain(raw)
  if (!domain || !domain.includes('.')) {
    return NextResponse.json({ skipped: true, reason: 'invalid_input' }, { status: 200 })
  }

  if (FREE_PROVIDERS.has(domain)) {
    return NextResponse.json({
      skipped: true,
      reason: 'free_provider',
      message: 'Looks like a personal email. Use your work email so we can pre-fill your company profile.',
    })
  }

  const companyName = titlecaseFromDomain(domain)
  const baseline = {
    companyName,
    companyWebsite: `https://${domain}`,
    // Route through our own proxy — avoids CSP issues, hides recruiter
    // email domain from Clearbit, and falls back gracefully when the logo
    // isn't found (no 408 timeouts in the browser console).
    companyLogo: `/api/recruiter/logo-proxy?domain=${encodeURIComponent(domain)}`,
    domain,
  }

  if (!useAi) {
    return NextResponse.json(baseline)
  }

  const inferred = await inferAiFields(companyName, domain)
  return NextResponse.json({
    ...baseline,
    companyIndustry: inferred.industry,
    companyDescription: inferred.description,
    companySize: inferred.companySizeGuess,
    aiInferred: !!(inferred.industry || inferred.description || inferred.companySizeGuess),
  })
}
