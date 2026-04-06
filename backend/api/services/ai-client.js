/**
 * Anthropic (Claude) client for the Render backend.
 * Lazy-initialized to ensure env vars are available.
 */

const Anthropic = require('@anthropic-ai/sdk')

let _client = null

function getClient() {
  if (!_client) {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY is not configured')
    }
    _client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  }
  return _client
}

const AI_MODEL = 'claude-sonnet-4-20250514'

/**
 * Run a conversation turn with Claude.
 * @param {string} systemPrompt
 * @param {Array<{role: string, content: any}>} messages
 * @param {number} maxTokens
 * @returns {Promise<string>}
 */
async function chatCompletion(systemPrompt, messages, maxTokens = 1200) {
  const client = getClient()
  const response = await client.messages.create({
    model: AI_MODEL,
    max_tokens: maxTokens,
    system: systemPrompt,
    messages,
  })
  return response.content[0].type === 'text' ? response.content[0].text : ''
}

module.exports = { getClient, chatCompletion, AI_MODEL }
