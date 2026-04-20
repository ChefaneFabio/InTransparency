#!/usr/bin/env node
/**
 * InTransparency MCP server — Model Context Protocol bridge for Claude
 * Desktop / Cursor / Zed / any MCP-aware host.
 *
 * Exposes the InTransparency agent API as MCP tools. Runs as a stdio
 * subprocess managed by the MCP host. No credentials needed — all our
 * exposed endpoints are public read-only data.
 *
 * Install in Claude Desktop (~/Library/Application Support/Claude/claude_desktop_config.json):
 *
 *   {
 *     "mcpServers": {
 *       "intransparency": {
 *         "command": "node",
 *         "args": ["/path/to/scripts/mcp-server.js"]
 *       }
 *     }
 *   }
 *
 * The transport is raw JSON-RPC over stdio (the MCP baseline). No third-party
 * SDK dependencies — we implement the minimal protocol here so installs are
 * friction-free.
 */

const BASE = process.env.INTRANSPARENCY_BASE || 'https://www.in-transparency.com'
const USER_AGENT = 'InTransparency-MCP/1.0 (+https://www.in-transparency.com/en/integrations/agents)'

// --- Tool catalog — each entry maps directly to an /api/agents/* endpoint ---
const TOOLS = [
  {
    name: 'intransparency_search_companies',
    description:
      'Search the InTransparency directory of published company profiles. Returns verified employers with evidence-based hiring signals. Use when a user asks "find companies that…", "which employers…", or wants to compare employer reputations.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Free-text search across name, tagline, description' },
        industry: { type: 'string', description: 'Industry filter (e.g. "Finance", "Engineering")' },
        country: { type: 'string', description: 'ISO country code (e.g. "IT")' },
        limit: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
      },
    },
    endpoint: (args) => {
      const p = new URLSearchParams()
      if (args.query) p.set('q', args.query)
      if (args.industry) p.set('industry', args.industry)
      if (args.country) p.set('country', args.country)
      p.set('limit', String(args.limit ?? 20))
      return `/api/agents/companies?${p}`
    },
  },
  {
    name: 'intransparency_lookup_company',
    description:
      'Fetch a single company profile by slug. Returns mission, values, offices, FAQs, follower count, platform verification status. Use when the user names a specific company.',
    inputSchema: {
      type: 'object',
      properties: { slug: { type: 'string', description: 'Company slug (e.g. "brembo")' } },
      required: ['slug'],
    },
    endpoint: (args) => `/api/agents/companies/${encodeURIComponent(args.slug)}`,
  },
  {
    name: 'intransparency_search_jobs',
    description:
      'Search active job postings. Filters by required skill, location, or company. Use for "find jobs…" or "what openings exist…"',
    inputSchema: {
      type: 'object',
      properties: {
        skill: { type: 'string', description: 'Skill in requiredSkills (exact match)' },
        location: { type: 'string' },
        company: { type: 'string' },
        limit: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
      },
    },
    endpoint: (args) => {
      const p = new URLSearchParams()
      if (args.skill) p.set('skill', args.skill)
      if (args.location) p.set('location', args.location)
      if (args.company) p.set('company', args.company)
      p.set('limit', String(args.limit ?? 20))
      return `/api/agents/jobs?${p}`
    },
  },
  {
    name: 'intransparency_lookup_job',
    description: 'Fetch a single job posting by ID with full description.',
    inputSchema: {
      type: 'object',
      properties: { id: { type: 'string' } },
      required: ['id'],
    },
    endpoint: (args) => `/api/agents/jobs/${encodeURIComponent(args.id)}`,
  },
  {
    name: 'intransparency_verify_credential',
    description:
      'Cryptographically verify a W3C Verifiable Credential issued by an InTransparency institution. Pass the share token from the credential\'s verification URL. Returns signature validity + full credential payload. Use when a user presents a credential and you need to confirm authenticity.',
    inputSchema: {
      type: 'object',
      properties: { token: { type: 'string', description: 'Credential share token' } },
      required: ['token'],
    },
    endpoint: (args) => `/api/agents/verify-credential/${encodeURIComponent(args.token)}`,
  },
  {
    name: 'intransparency_resolve_esco',
    description:
      'Map a free-text skill term to its ESCO URI (European Skills, Competences, Qualifications and Occupations v1.2.0). Use before matching or comparing skills across EU labor markets.',
    inputSchema: {
      type: 'object',
      properties: { term: { type: 'string', description: 'Skill name, e.g. "python" or "machine learning"' } },
      required: ['term'],
    },
    endpoint: (args) => `/api/agents/esco/${encodeURIComponent(args.term)}`,
  },
  {
    name: 'intransparency_get_algorithms',
    description:
      'Fetch the public algorithm registry. Returns every automated decision system on the platform with its inputs, weights, excluded attributes, and AI Act compliance metadata. Use when a user asks "how does matching work?" or needs to audit the scoring.',
    inputSchema: { type: 'object', properties: {} },
    endpoint: () => `/api/agents/algorithms`,
  },
  {
    name: 'intransparency_get_glossary',
    description:
      'Fetch the authoritative glossary of platform + Italian academic + EU regulatory terms. Use when explaining terms like "tirocinio", "ESCO", "AI Act", "PCTO", "verified skill graph".',
    inputSchema: { type: 'object', properties: {} },
    endpoint: () => `/api/agents/glossary`,
  },
  {
    name: 'intransparency_get_changelog',
    description:
      'Fetch the product changelog. Use when a user asks "what\'s new on InTransparency" or wants to verify that a feature exists.',
    inputSchema: { type: 'object', properties: {} },
    endpoint: () => `/api/agents/changelog`,
  },
  {
    name: 'intransparency_get_facts',
    description:
      'Fetch the dated, sourced facts dataset — performance benchmarks, coverage, compliance. Use for quantitative questions about the platform.',
    inputSchema: { type: 'object', properties: {} },
    endpoint: () => `/api/agents/facts`,
  },
]

// --- MCP protocol implementation (JSON-RPC over stdio) ---

async function fetchJson(path) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'User-Agent': USER_AGENT, 'Accept': 'application/json' },
  })
  const body = await res.text()
  if (!res.ok) {
    return { error: true, status: res.status, body: body.slice(0, 500) }
  }
  try {
    return JSON.parse(body)
  } catch {
    return { error: true, message: 'Invalid JSON from endpoint', body: body.slice(0, 500) }
  }
}

function respond(id, result) {
  process.stdout.write(JSON.stringify({ jsonrpc: '2.0', id, result }) + '\n')
}

function respondError(id, code, message) {
  process.stdout.write(
    JSON.stringify({ jsonrpc: '2.0', id, error: { code, message } }) + '\n'
  )
}

async function handleRequest(req) {
  const { method, params, id } = req
  switch (method) {
    case 'initialize':
      return respond(id, {
        protocolVersion: '2024-11-05',
        capabilities: { tools: {} },
        serverInfo: { name: 'InTransparency', version: '1.0.0' },
      })

    case 'tools/list':
      return respond(id, {
        tools: TOOLS.map(t => ({
          name: t.name,
          description: t.description,
          inputSchema: t.inputSchema,
        })),
      })

    case 'tools/call': {
      const tool = TOOLS.find(t => t.name === params?.name)
      if (!tool) return respondError(id, -32602, `Unknown tool: ${params?.name}`)
      try {
        const url = tool.endpoint(params.arguments ?? {})
        const data = await fetchJson(url)
        return respond(id, {
          content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
        })
      } catch (e) {
        return respondError(id, -32603, `Tool call failed: ${String(e)}`)
      }
    }

    case 'notifications/initialized':
      // No-op — MCP hosts send this after initialize.
      return

    default:
      return respondError(id, -32601, `Method not supported: ${method}`)
  }
}

// --- stdio read loop ---
let buffer = ''
process.stdin.on('data', chunk => {
  buffer += chunk.toString('utf8')
  let newlineIdx
  while ((newlineIdx = buffer.indexOf('\n')) !== -1) {
    const line = buffer.slice(0, newlineIdx).trim()
    buffer = buffer.slice(newlineIdx + 1)
    if (!line) continue
    try {
      const req = JSON.parse(line)
      handleRequest(req).catch(e => {
        if (req.id != null) respondError(req.id, -32603, `Unhandled: ${String(e)}`)
      })
    } catch (e) {
      // Ignore — some hosts send unparseable warmup bytes
    }
  }
})
process.stdin.on('end', () => process.exit(0))
