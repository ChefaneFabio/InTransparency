/**
 * Shared OpenAI client initialization.
 * Import from here instead of creating new instances in each module.
 */

import OpenAI from 'openai'

export const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null
