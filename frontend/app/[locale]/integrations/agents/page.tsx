import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbList } from '@/lib/schema-org'
import type { Metadata } from 'next'
import { Sparkles, Terminal, Zap, Code2, ExternalLink, ShieldCheck } from 'lucide-react'
import { Link } from '@/navigation'

/**
 * Integrations page — connect InTransparency to AI agent hosts.
 *
 * Written for three audiences in descending order of technical depth:
 *   1. Developers wiring their own agents (OpenAPI + direct API calls)
 *   2. Claude Desktop / Cursor / Zed users (MCP server)
 *   3. ChatGPT users (plugin / Action discovery)
 */

export const metadata: Metadata = {
  title: 'Agent integrations — connect Claude, ChatGPT, Gemini to InTransparency',
  description:
    'The InTransparency verified skill graph is available as an agent tool. Install the MCP server in Claude Desktop / Cursor / Zed, import the OpenAPI spec into LangChain / LlamaIndex, or use our ChatGPT plugin. Read-only, no authentication needed for public data.',
  alternates: { canonical: 'https://www.in-transparency.com/en/integrations/agents' },
  openGraph: {
    title: 'Agent integrations — connect Claude, ChatGPT, Gemini to InTransparency',
    description: 'Query the verified skill graph of EU higher education from any AI agent.',
    type: 'article',
    siteName: 'InTransparency',
  },
}

export default function AgentIntegrationsPage() {
  return (
    <div className="min-h-screen bg-background">
      <JsonLd
        data={breadcrumbList([
          { name: 'Home', url: '/' },
          { name: 'Integrations', url: '/integrations' },
          { name: 'AI Agents', url: '/integrations/agents' },
        ])}
      />
      <Header />
      <main className="container max-w-4xl mx-auto px-4 pt-32 pb-16">
        <div className="mb-8">
          <Badge variant="outline" className="mb-3">
            <Sparkles className="h-3 w-3 mr-1" />
            Agent-native
          </Badge>
          <h1 className="text-4xl font-bold mb-3">
            Connect InTransparency to your AI agent
          </h1>
          <p className="text-lg text-muted-foreground">
            Every recruiter using Claude or ChatGPT for candidate research runs into the same
            wall: agents can&apos;t trust self-declared CV data. InTransparency solves that by
            exposing our verified skill graph as an agent tool — queryable from Claude Desktop,
            Cursor, Zed, ChatGPT, LangChain, LlamaIndex, and any agent framework that speaks
            OpenAPI or MCP.
          </p>
        </div>

        <Card className="mb-8 border-primary/30 bg-primary/5">
          <CardContent className="pt-5 pb-5 flex gap-3">
            <ShieldCheck className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <strong>Read-only, public, no authentication.</strong> The agent surface exposes only
              data that&apos;s already publicly accessible on the website — company profiles, job
              listings, the algorithm registry, credential verification, glossary. Rate-limited
              per IP. CORS-open for cross-origin use.
            </div>
          </CardContent>
        </Card>

        <h2 className="text-2xl font-bold mt-12 mb-4 flex items-center gap-2">
          <Zap className="h-6 w-6 text-primary" />
          Option 1 — Claude Desktop / Cursor / Zed (MCP)
        </h2>
        <p className="text-muted-foreground mb-4">
          The InTransparency MCP server is a single Node.js file with zero dependencies.
          Download it, reference it in your host&apos;s MCP config, restart the host. The tools
          appear in your next session.
        </p>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-base">1. Download the server</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>Save it anywhere on your machine:</p>
            <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
{`curl -O https://www.in-transparency.com/mcp-server.js`}
            </pre>
          </CardContent>
        </Card>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-base">2. Add it to Claude Desktop</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              Edit{' '}
              <code className="bg-muted px-1">
                ~/Library/Application Support/Claude/claude_desktop_config.json
              </code>{' '}
              (macOS) or{' '}
              <code className="bg-muted px-1">%APPDATA%\Claude\claude_desktop_config.json</code>{' '}
              (Windows) and add:
            </p>
            <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
{`{
  "mcpServers": {
    "intransparency": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-server.js"]
    }
  }
}`}
            </pre>
            <p>Restart Claude Desktop. The 10 InTransparency tools appear in the tool picker.</p>
          </CardContent>
        </Card>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-base">3. Available tools</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-1">
              <li>
                <code className="bg-muted px-1">intransparency_search_companies</code> — search
                published employer profiles
              </li>
              <li>
                <code className="bg-muted px-1">intransparency_lookup_company</code> — fetch a
                specific company by slug
              </li>
              <li>
                <code className="bg-muted px-1">intransparency_search_jobs</code> — filter active
                jobs by skill / location / company
              </li>
              <li>
                <code className="bg-muted px-1">intransparency_lookup_job</code> — full job
                description by ID
              </li>
              <li>
                <code className="bg-muted px-1">intransparency_verify_credential</code> —
                cryptographically validate a W3C VC by share token
              </li>
              <li>
                <code className="bg-muted px-1">intransparency_resolve_esco</code> — map a skill
                to its EU ESCO URI
              </li>
              <li>
                <code className="bg-muted px-1">intransparency_get_algorithms</code> — public
                algorithm registry (AI Act Annex III)
              </li>
              <li>
                <code className="bg-muted px-1">intransparency_get_glossary</code> — domain
                vocabulary
              </li>
              <li>
                <code className="bg-muted px-1">intransparency_get_changelog</code> — product
                updates
              </li>
              <li>
                <code className="bg-muted px-1">intransparency_get_facts</code> — dated,
                sourced quantitative facts
              </li>
            </ul>
          </CardContent>
        </Card>

        <h2 className="text-2xl font-bold mt-12 mb-4 flex items-center gap-2">
          <Terminal className="h-6 w-6 text-primary" />
          Option 2 — ChatGPT plugin / GPT Action
        </h2>
        <p className="text-muted-foreground mb-4">
          Our OpenAI plugin manifest is at{' '}
          <code className="bg-muted px-1">/.well-known/ai-plugin.json</code>. For custom GPTs,
          import the action from{' '}
          <code className="bg-muted px-1">https://www.in-transparency.com/openapi.yaml</code> —
          all endpoints are auto-discovered, no auth needed.
        </p>
        <Card className="mb-4">
          <CardContent className="pt-4 pb-4 text-sm">
            <p className="mb-2">In the ChatGPT &quot;Configure Action&quot; dialog:</p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Choose <strong>Import from URL</strong></li>
              <li>
                Paste:{' '}
                <code className="bg-muted px-1">https://www.in-transparency.com/openapi.yaml</code>
              </li>
              <li>Authentication: <strong>None</strong></li>
            </ol>
          </CardContent>
        </Card>

        <h2 className="text-2xl font-bold mt-12 mb-4 flex items-center gap-2">
          <Code2 className="h-6 w-6 text-primary" />
          Option 3 — LangChain / LlamaIndex / agentsdk
        </h2>
        <p className="text-muted-foreground mb-4">
          Any framework that consumes OpenAPI 3.1 will auto-generate tool definitions from our
          spec. Examples:
        </p>
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-base">LangChain (Python)</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
{`from langchain_community.agent_toolkits.openapi import planner
from langchain_community.tools.openapi.utils.openapi_utils import OpenAPISpec

spec = OpenAPISpec.from_url(
    "https://www.in-transparency.com/openapi.yaml"
)
agent = planner.create_openapi_agent(spec, requests_wrapper, llm)`}
            </pre>
          </CardContent>
        </Card>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-base">Direct API (any language)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-2">No auth. No SDK. Just HTTP GET.</p>
            <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
{`# Root discovery document
curl https://www.in-transparency.com/api/agents/index

# Find companies hiring data analysts in Italy
curl "https://www.in-transparency.com/api/agents/jobs?skill=Python&location=Milano"

# Verify a credential
curl https://www.in-transparency.com/api/agents/verify-credential/{TOKEN}`}
            </pre>
          </CardContent>
        </Card>

        <h2 className="text-2xl font-bold mt-12 mb-4">Reference documents</h2>
        <div className="grid md:grid-cols-2 gap-3">
          <ReferenceLink href="/openapi.yaml" label="OpenAPI 3.1 spec" />
          <ReferenceLink href="/.well-known/ai-plugin.json" label="OpenAI plugin manifest" />
          <ReferenceLink href="/.well-known/mcp.json" label="MCP manifest" />
          <ReferenceLink href="/mcp-server.js" label="MCP server source" />
          <ReferenceLink href="/llms-full.txt" label="Full machine-readable reference" />
          <ReferenceLink href="/api/agents/index" label="Live agent index (JSON)" />
          <ReferenceLink href="/api/credentials/public-key" label="VC public key (offline verification)" />
          <ReferenceLink href="/en/algorithm-registry" label="Algorithm registry (human view)" />
        </div>

        <h2 className="text-2xl font-bold mt-12 mb-4">Licensing + attribution</h2>
        <p className="text-muted-foreground text-sm">
          Content returned by the agent API is published under Creative Commons BY 4.0. Attribute
          to &quot;InTransparency&quot; with a link to{' '}
          <Link href="/" className="text-primary hover:underline">
            https://www.in-transparency.com
          </Link>
          . For any use beyond read-only querying, email{' '}
          <a href="mailto:info@in-transparency.com" className="text-primary hover:underline">
            info@in-transparency.com
          </a>
          .
        </p>
      </main>
      <Footer />
    </div>
  )
}

function ReferenceLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-2 p-3 rounded-lg border bg-card hover:border-primary/40 transition-colors text-sm"
    >
      <Code2 className="h-4 w-4 text-muted-foreground" />
      <span className="flex-1">{label}</span>
      <ExternalLink className="h-3 w-3 text-muted-foreground" />
    </a>
  )
}
