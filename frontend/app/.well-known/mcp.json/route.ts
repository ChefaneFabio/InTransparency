import { NextResponse } from 'next/server'

/**
 * GET /.well-known/mcp.json
 *
 * Advertises our MCP server location + how to install it. Agent hosts
 * (Claude Desktop, Cursor, Zed) can discover us via the /.well-known/ path
 * and offer one-click install once MCP discovery standardizes.
 *
 * For now, the human-facing integrations page walks users through the
 * claude_desktop_config.json change needed.
 */
export async function GET() {
  return NextResponse.json(
    {
      name: 'InTransparency',
      description: 'Verified skill graph of European higher education.',
      serverScript: 'https://www.in-transparency.com/mcp-server.js',
      installInstructions: 'https://www.in-transparency.com/en/integrations/agents',
      runtime: 'node',
      protocolVersion: '2024-11-05',
      transport: 'stdio',
      tools: [
        'intransparency_search_companies',
        'intransparency_lookup_company',
        'intransparency_search_jobs',
        'intransparency_lookup_job',
        'intransparency_verify_credential',
        'intransparency_resolve_esco',
        'intransparency_get_algorithms',
        'intransparency_get_glossary',
        'intransparency_get_changelog',
        'intransparency_get_facts',
      ],
      contact: 'info@in-transparency.com',
    },
    {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600',
        'Access-Control-Allow-Origin': '*',
      },
    }
  )
}
