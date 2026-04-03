/**
 * Shared Anthropic (Claude) client initialization.
 * Import from here instead of creating new instances in each module.
 */

import Anthropic from '@anthropic-ai/sdk'

/** Lazy-initialized Anthropic client. Throws at call time if ANTHROPIC_API_KEY is not set. */
let _anthropic: Anthropic | null = null

export const anthropic = new Proxy({} as Anthropic, {
  get(_target, prop) {
    if (!_anthropic) {
      if (!process.env.ANTHROPIC_API_KEY) {
        throw new Error('ANTHROPIC_API_KEY is not configured')
      }
      _anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
    }
    return (_anthropic as any)[prop]
  },
})

/** Default model for all AI calls */
export const AI_MODEL = 'claude-sonnet-4-20250514'
