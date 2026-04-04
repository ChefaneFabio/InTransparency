/**
 * Shared conversational AI helper.
 * Used by all segment flows: student projects, recruiter jobs, university/techpark onboarding.
 */

import { anthropic, AI_MODEL } from './openai-shared'

export interface ConversationMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface ConversationResult {
  message: string
  data: Record<string, any>
  completeness: number
}

/**
 * Run a conversational AI turn.
 * @param systemPrompt - Segment-specific system prompt with field definitions
 * @param messages - Full conversation history
 * @param imageContents - Base64 images to include on first message (optional)
 */
export async function runConversationTurn(
  systemPrompt: string,
  messages: ConversationMessage[],
  imageContents?: Array<{ base64: string; mediaType: string }>
): Promise<ConversationResult> {
  const claudeMessages: Array<{ role: 'user' | 'assistant'; content: any }> = []

  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i]
    if (msg.role === 'user') {
      const content: any[] = []

      // Add images only on first user message
      if (i === 0 && imageContents) {
        for (const img of imageContents) {
          content.push({
            type: 'image',
            source: { type: 'base64', media_type: img.mediaType, data: img.base64 },
          })
        }
      }

      content.push({ type: 'text', text: msg.content })
      claudeMessages.push({ role: 'user', content })
    } else {
      claudeMessages.push({ role: 'assistant', content: msg.content })
    }
  }

  const response = await anthropic.messages.create({
    model: AI_MODEL,
    max_tokens: 1200,
    system: systemPrompt,
    messages: claudeMessages,
  })

  const rawText = response.content[0].type === 'text' ? response.content[0].text : ''
  return parseConversationResponse(rawText)
}

/**
 * Parse AI response: extract conversational text, JSON data, and completeness.
 */
export function parseConversationResponse(rawText: string): ConversationResult {
  let message = rawText
  let data: Record<string, any> = {}
  let completeness = 0

  const dataMatch = rawText.match(/<project_data>\s*([\s\S]*?)\s*<\/project_data>/)
  if (dataMatch) {
    try { data = JSON.parse(dataMatch[1]) } catch { /* keep empty */ }
    message = rawText.slice(0, rawText.indexOf('<project_data>')).trim()
  }

  const completenessMatch = rawText.match(/<completeness>\s*(\d+)\s*<\/completeness>/)
  if (completenessMatch) {
    completeness = parseInt(completenessMatch[1])
    message = message.replace(/<completeness>\s*\d+\s*<\/completeness>/, '').trim()
  }

  return { message, data, completeness }
}

/**
 * Build a system prompt for any segment's conversational flow.
 */
export function buildSystemPrompt(opts: {
  role: string
  description: string
  fields: Array<{ name: string; description: string; required?: boolean }>
  currentData: Record<string, any>
  locale: string
  conversationGuide: string
}): string {
  const lang = opts.locale === 'it' ? 'Italian' : 'English'

  const fieldList = opts.fields.map(f =>
    `- ${f.name}${f.required ? ' (required)' : ''}: ${f.description}`
  ).join('\n')

  return `You are a friendly ${opts.role} for InTransparency.

${opts.description}

RULES:
- Respond in ${lang} (or match the user's language if they switch)
- Be warm and professional
- Ask 1-3 follow-up questions at a time, grouped by topic
- Don't ask about fields that are irrelevant to this specific case
- Extract information progressively from what the user shares

COLLECTABLE FIELDS:
${fieldList}

CURRENT DATA (already collected):
${JSON.stringify(opts.currentData, null, 2)}

CONVERSATION GUIDE:
${opts.conversationGuide}

RESPONSE FORMAT:
Always end your response with:
<project_data>
{ ...all fields extracted so far (cumulative)... }
</project_data>
<completeness>NUMBER</completeness>

Your conversational text goes BEFORE the tags.`
}

/**
 * Fetch an image URL and return base64 for Claude vision.
 */
export async function fetchImageAsBase64(url: string): Promise<{ base64: string; mediaType: string } | null> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) })
    if (!res.ok) return null
    const buffer = await res.arrayBuffer()
    return {
      base64: Buffer.from(buffer).toString('base64'),
      mediaType: res.headers.get('content-type') || 'image/jpeg',
    }
  } catch {
    return null
  }
}
