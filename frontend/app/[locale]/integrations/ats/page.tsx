import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbList } from '@/lib/schema-org'
import type { Metadata } from 'next'
import { Workflow, Code2, ArrowRight, Zap, ExternalLink } from 'lucide-react'
import { Link } from '@/navigation'

/**
 * /en/integrations/ats — wire InTransparency events into your existing ATS.
 *
 * The pattern is identical for all major ATS products: they accept inbound
 * candidate POSTs via their API. We fire a webhook on match.created; a small
 * relay function (shown here for Greenhouse + Lever) turns that into a
 * candidate-create call. No custom middleware required.
 */

export const metadata: Metadata = {
  title: 'ATS integration — Greenhouse, Lever, Workday | InTransparency',
  description:
    'Concrete code: feed verified candidates from InTransparency into Greenhouse, Lever, Workday, and any ATS with a REST API. Webhook relay patterns in Python, Node, and raw cURL.',
  alternates: { canonical: 'https://www.in-transparency.com/en/integrations/ats' },
  openGraph: {
    title: 'ATS integration — Greenhouse, Lever, Workday',
    description: 'Verified candidates into your existing pipeline in minutes.',
    type: 'article',
    siteName: 'InTransparency',
  },
}

const GREENHOUSE_EXAMPLE = `// Deno / Node webhook relay: InTransparency → Greenhouse Harvest API
// Env: GREENHOUSE_API_KEY, INTRANSPARENCY_WEBHOOK_SECRET, GREENHOUSE_JOB_ID
import crypto from 'node:crypto'

export default async function relay(req: Request): Promise<Response> {
  // 1. Verify the signature
  const body = await req.text()
  const sig = req.headers.get('X-InTransparency-Signature') || ''
  const expected = 'sha256=' + crypto
    .createHmac('sha256', process.env.INTRANSPARENCY_WEBHOOK_SECRET!)
    .update(body).digest('hex')
  if (sig !== expected) return new Response('bad signature', { status: 401 })

  const { event, data } = JSON.parse(body)
  if (event !== 'match.created' || data.matchScore < 70) {
    return new Response('ignored', { status: 200 })
  }

  // 2. Fetch the candidate's full profile from InTransparency
  const candidate = await fetch(
    'https://www.in-transparency.com/api/agents/companies/' + data.candidateSlug,
  ).then(r => r.json())

  // 3. Create a prospect in Greenhouse — the "Prospects" stage is perfect
  // for sourced leads; they convert to candidates once a recruiter adds them
  // to a job.
  await fetch('https://harvest.greenhouse.io/v1/candidates', {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + Buffer.from(process.env.GREENHOUSE_API_KEY + ':').toString('base64'),
      'Content-Type': 'application/json',
      'On-Behalf-Of': process.env.GREENHOUSE_USER_ID!,
    },
    body: JSON.stringify({
      first_name: data.candidateName.split(' ')[0],
      last_name: data.candidateName.split(' ').slice(1).join(' '),
      email_addresses: [{ value: candidate.email, type: 'personal' }],
      applications: [{ job_id: Number(process.env.GREENHOUSE_JOB_ID) }],
      attachments: [{
        filename: 'intransparency-evidence.pdf',
        type: 'other',
        url: 'https://www.in-transparency.com/en/matches/' + data.matchId + '/why',
      }],
      custom_fields: {
        intransparency_match_score: data.matchScore,
        intransparency_match_id: data.matchId,
      },
    }),
  })

  return new Response('ok', { status: 200 })
}`

const LEVER_EXAMPLE = `# Python / FastAPI webhook relay: InTransparency → Lever API
# Env: LEVER_API_KEY, INTRANSPARENCY_WEBHOOK_SECRET, LEVER_POSTING_ID
import hashlib, hmac, os, json, httpx
from fastapi import FastAPI, Request, HTTPException

app = FastAPI()

@app.post("/webhooks/intransparency")
async def relay(req: Request):
    body = await req.body()
    sig = req.headers.get("X-InTransparency-Signature", "")
    expected = "sha256=" + hmac.new(
        os.environ["INTRANSPARENCY_WEBHOOK_SECRET"].encode(),
        body, hashlib.sha256,
    ).hexdigest()
    if not hmac.compare_digest(sig, expected):
        raise HTTPException(401, "bad signature")

    payload = json.loads(body)
    if payload["event"] != "match.created": return {"ok": True}
    data = payload["data"]
    if data["matchScore"] < 70: return {"ok": True}

    # Lever: create an opportunity (candidate attached to a posting)
    async with httpx.AsyncClient(auth=(os.environ["LEVER_API_KEY"], "")) as client:
        r = await client.post(
            "https://api.lever.co/v1/opportunities",
            json={
                "name": data["candidateName"],
                "origin": "sourced",
                "sources": ["InTransparency"],
                "postings": [os.environ["LEVER_POSTING_ID"]],
                "tags": [f"intransparency-score-{data['matchScore']}"],
                "links": [data["url"]],
            },
        )
        r.raise_for_status()
    return {"ok": True}`

const CURL_EXAMPLE = `# Step 1: Create an InTransparency agent key with webhook scope
curl -X POST https://www.in-transparency.com/api/agents/keys \\
  -H "Cookie: <your session>" \\
  -H "Content-Type: application/json" \\
  -d '{"name":"ATS-relay","scopes":["agent:webhook"]}'
# Response: { "key": "ita_...", ... } — save it once; never shown again

# Step 2: Register your webhook endpoint with InTransparency
curl -X POST https://www.in-transparency.com/api/agents/webhooks \\
  -H "Authorization: Bearer ita_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://your-relay.example.com/webhooks/intransparency",
    "events": ["match.created", "credential.issued"]
  }'
# Response includes { "secret": "..." } — store as INTRANSPARENCY_WEBHOOK_SECRET`

export default function AtsIntegrationPage() {
  return (
    <div className="min-h-screen bg-background">
      <JsonLd
        data={breadcrumbList([
          { name: 'Home', url: '/' },
          { name: 'Integrations', url: '/integrations' },
          { name: 'ATS', url: '/integrations/ats' },
        ])}
      />
      <Header />
      <main className="container max-w-4xl mx-auto px-4 pt-32 pb-16">
        <div className="mb-8">
          <Badge variant="outline" className="mb-3">
            <Workflow className="h-3 w-3 mr-1" />
            ATS integration
          </Badge>
          <h1 className="text-4xl font-bold mb-3">Feed your ATS with verified candidates</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Every major ATS accepts inbound candidate POSTs. We fire webhook events when a
            matching candidate appears. Connect the two with a tiny relay function — ~40 lines of
            code — and your recruiters see InTransparency candidates in Greenhouse, Lever, or
            Workday without leaving their usual workflow.
          </p>
        </div>

        <Card className="mb-6 bg-primary/5 border-primary/30">
          <CardContent className="pt-5 pb-5 flex items-start gap-3">
            <Zap className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="font-semibold mb-1">The integration pattern</h2>
              <p className="text-sm text-muted-foreground">
                <strong>1.</strong> Create an agent API key with <code className="bg-background px-1 border rounded">agent:webhook</code>{' '}
                scope.{' '}
                <strong>2.</strong> Register your relay URL with a <code className="bg-background px-1 border rounded">match.created</code> subscription — you get back an HMAC secret.{' '}
                <strong>3.</strong> In your relay, verify the signature and translate our event into your ATS&apos;s native &quot;create candidate&quot; API call.
              </p>
            </div>
          </CardContent>
        </Card>

        <h2 className="text-2xl font-bold mb-3">1. Set up the webhook</h2>
        <Card className="mb-8">
          <CardContent className="pt-4 pb-4">
            <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">{CURL_EXAMPLE}</pre>
          </CardContent>
        </Card>

        <h2 className="text-2xl font-bold mb-3">2. Relay to Greenhouse (Node/Deno)</h2>
        <Card className="mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Greenhouse Harvest API</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">{GREENHOUSE_EXAMPLE}</pre>
          </CardContent>
        </Card>

        <h2 className="text-2xl font-bold mb-3 mt-8">3. Relay to Lever (Python)</h2>
        <Card className="mb-8">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Lever Opportunities API</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">{LEVER_EXAMPLE}</pre>
          </CardContent>
        </Card>

        <h2 className="text-2xl font-bold mb-4">Other ATS products</h2>
        <div className="grid md:grid-cols-2 gap-3 mb-8">
          {[
            { name: 'Workday Recruiting', note: 'Use Workday REST API + the same webhook pattern. Map match score into a Custom Field.' },
            { name: 'SmartRecruiters', note: 'Candidates API + sourced-origin tag.' },
            { name: 'Recruitee', note: 'Candidates API + source tag.' },
            { name: 'Teamtailor', note: 'Candidates API v3. Supports attachments for evidence packet.' },
            { name: 'Personio', note: 'Applications API — candidate + application in one call.' },
            { name: 'Ashby', note: 'Candidates API with source attribution. Matching pattern identical.' },
          ].map(a => (
            <Card key={a.name}>
              <CardContent className="pt-4 pb-4">
                <h3 className="font-semibold text-sm">{a.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{a.note}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mb-4">
          <CardContent className="pt-5 pb-5 text-sm">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Code2 className="h-4 w-4" />
              Reference documents
            </h3>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
              <a href="/openapi.yaml" className="text-primary hover:underline inline-flex items-center gap-1">
                OpenAPI spec
                <ExternalLink className="h-3 w-3" />
              </a>
              <a href="/en/integrations/agents" className="text-primary hover:underline inline-flex items-center gap-1">
                Agent integration guide
                <ExternalLink className="h-3 w-3" />
              </a>
              <a href="/api/agents/index" className="text-primary hover:underline inline-flex items-center gap-1">
                Agent API index
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/contact?subject=ats-integration">
              Talk to us about your ATS
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/for-enterprise">Enterprise page</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  )
}
