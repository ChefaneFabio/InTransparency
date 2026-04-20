import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbList } from '@/lib/schema-org'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
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

export default async function AgentIntegrationsPage() {
  const t = await getTranslations('integrationsAgents')
  return (
    <div className="min-h-screen bg-background">
      <JsonLd
        data={breadcrumbList([
          { name: t('breadcrumbHome'), url: '/' },
          { name: t('breadcrumbIntegrations'), url: '/integrations' },
          { name: t('breadcrumbAgents'), url: '/integrations/agents' },
        ])}
      />
      <Header />
      <main className="container max-w-4xl mx-auto px-4 pt-32 pb-16">
        <div className="mb-8">
          <Badge variant="outline" className="mb-3">
            <Sparkles className="h-3 w-3 mr-1" />
            {t('agentNative')}
          </Badge>
          <h1 className="text-4xl font-bold mb-3">
            {t('heroTitle')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('heroDesc')}
          </p>
        </div>

        <Card className="mb-8 border-primary/30 bg-primary/5">
          <CardContent className="pt-5 pb-5 flex gap-3">
            <ShieldCheck className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              {t.rich('readOnlyNotice', { strong: (chunks) => <strong>{chunks}</strong> })}
            </div>
          </CardContent>
        </Card>

        <h2 className="text-2xl font-bold mt-12 mb-4 flex items-center gap-2">
          <Zap className="h-6 w-6 text-primary" />
          {t('option1Title')}
        </h2>
        <p className="text-muted-foreground mb-4">
          {t('option1Desc')}
        </p>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-base">{t('step1Title')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>{t('step1Save')}</p>
            <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
{`curl -O https://www.in-transparency.com/mcp-server.js`}
            </pre>
          </CardContent>
        </Card>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-base">{t('step2Title')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              {t('step2EditPrefix')}{' '}
              <code className="bg-muted px-1">
                ~/Library/Application Support/Claude/claude_desktop_config.json
              </code>{' '}
              (macOS) {t('or')}{' '}
              <code className="bg-muted px-1">%APPDATA%\Claude\claude_desktop_config.json</code>{' '}
              (Windows) {t('andAdd')}
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
            <p>{t('step2Restart')}</p>
          </CardContent>
        </Card>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-base">{t('step3Title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-1">
              <li>
                <code className="bg-muted px-1">intransparency_search_companies</code> — {t('tool_search_companies')}
              </li>
              <li>
                <code className="bg-muted px-1">intransparency_lookup_company</code> — {t('tool_lookup_company')}
              </li>
              <li>
                <code className="bg-muted px-1">intransparency_search_jobs</code> — {t('tool_search_jobs')}
              </li>
              <li>
                <code className="bg-muted px-1">intransparency_lookup_job</code> — {t('tool_lookup_job')}
              </li>
              <li>
                <code className="bg-muted px-1">intransparency_verify_credential</code> — {t('tool_verify_credential')}
              </li>
              <li>
                <code className="bg-muted px-1">intransparency_resolve_esco</code> — {t('tool_resolve_esco')}
              </li>
              <li>
                <code className="bg-muted px-1">intransparency_get_algorithms</code> — {t('tool_get_algorithms')}
              </li>
              <li>
                <code className="bg-muted px-1">intransparency_get_glossary</code> — {t('tool_get_glossary')}
              </li>
              <li>
                <code className="bg-muted px-1">intransparency_get_changelog</code> — {t('tool_get_changelog')}
              </li>
              <li>
                <code className="bg-muted px-1">intransparency_get_facts</code> — {t('tool_get_facts')}
              </li>
            </ul>
          </CardContent>
        </Card>

        <h2 className="text-2xl font-bold mt-12 mb-4 flex items-center gap-2">
          <Terminal className="h-6 w-6 text-primary" />
          {t('option2Title')}
        </h2>
        <p className="text-muted-foreground mb-4">
          {t('option2DescPrefix')}{' '}
          <code className="bg-muted px-1">/.well-known/ai-plugin.json</code>. {t('option2DescMid')}{' '}
          <code className="bg-muted px-1">https://www.in-transparency.com/openapi.yaml</code> —
          {t('option2DescSuffix')}
        </p>
        <Card className="mb-4">
          <CardContent className="pt-4 pb-4 text-sm">
            <p className="mb-2">{t('chatgptDialog')}</p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>{t.rich('chooseImport', { strong: (chunks) => <strong>{chunks}</strong> })}</li>
              <li>
                {t('paste')}{' '}
                <code className="bg-muted px-1">https://www.in-transparency.com/openapi.yaml</code>
              </li>
              <li>{t.rich('authNone', { strong: (chunks) => <strong>{chunks}</strong> })}</li>
            </ol>
          </CardContent>
        </Card>

        <h2 className="text-2xl font-bold mt-12 mb-4 flex items-center gap-2">
          <Code2 className="h-6 w-6 text-primary" />
          {t('option3Title')}
        </h2>
        <p className="text-muted-foreground mb-4">
          {t('option3Desc')}
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
            <CardTitle className="text-base">{t('directApiTitle')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-2">{t('directApiDesc')}</p>
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

        <h2 className="text-2xl font-bold mt-12 mb-4">{t('referenceDocs')}</h2>
        <div className="grid md:grid-cols-2 gap-3">
          <ReferenceLink href="/openapi.yaml" label={t('ref_openapi')} />
          <ReferenceLink href="/.well-known/ai-plugin.json" label={t('ref_plugin_manifest')} />
          <ReferenceLink href="/.well-known/mcp.json" label={t('ref_mcp_manifest')} />
          <ReferenceLink href="/mcp-server.js" label={t('ref_mcp_source')} />
          <ReferenceLink href="/llms-full.txt" label={t('ref_llms_full')} />
          <ReferenceLink href="/api/agents/index" label={t('ref_agent_index')} />
          <ReferenceLink href="/api/credentials/public-key" label={t('ref_public_key')} />
          <ReferenceLink href="/en/algorithm-registry" label={t('ref_algorithm_registry')} />
        </div>

        <h2 className="text-2xl font-bold mt-12 mb-4">{t('licensingTitle')}</h2>
        <p className="text-muted-foreground text-sm">
          {t('licensingPrefix')}{' '}
          <Link href="/" className="text-primary hover:underline">
            https://www.in-transparency.com
          </Link>
          . {t('licensingSuffix')}{' '}
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
