/**
 * Shared Anthropic (Claude) client initialization.
 * Import from here instead of creating new instances in each module.
 */

import Anthropic from '@anthropic-ai/sdk'

export const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null

/** Default model for all AI calls */
export const AI_MODEL = 'claude-sonnet-4-20250514'
