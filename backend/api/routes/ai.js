/**
 * AI routes — handles all Claude-powered AI features.
 * Migrated from Vercel to Render for longer timeouts and no serverless limits.
 */

const express = require('express')
const { chatCompletion } = require('../services/ai-client')

const router = express.Router()

/**
 * POST /api/ai/analyze-project
 * Conversational project intake.
 */
router.post('/analyze-project', async (req, res) => {
  try {
    const { messages = [], currentProjectData = {}, locale = 'en', imageUrls = [], documentUrls = [] } = req.body
    if (messages.length === 0) return res.status(400).json({ error: 'Messages required' })

    const lang = locale === 'it' ? 'Italian' : 'English'

    const systemPrompt = `You are a friendly project intake assistant for InTransparency. Help the student build a complete project profile through conversation.

STUDENT: ${req.userId || 'Unknown'}
CURRENT DATA: ${JSON.stringify(currentProjectData)}

RULES:
- Respond in ${lang}
- Ask 1-3 follow-up questions at a time
- Extract: title, description, discipline, projectType, skills, tools, competencies, role, teamSize, duration, courseName, grade, professor, outcome, client, githubUrl, liveUrl
- InTransparency serves ALL disciplines (tech, business, healthcare, law, design, engineering, arts, education, trades, architecture, media)
- No cheap emojis

End with:
<project_data>{ ...fields... }</project_data>
<completeness>NUMBER</completeness>`

    const claudeMessages = messages.map(m => ({
      role: m.role,
      content: m.content,
    }))

    const reply = await chatCompletion(systemPrompt, claudeMessages)

    let message = reply
    let projectData = {}
    let completeness = 0

    const dataMatch = reply.match(/<project_data>\s*([\s\S]*?)\s*<\/project_data>/)
    if (dataMatch) {
      try { projectData = JSON.parse(dataMatch[1]) } catch {}
      message = reply.slice(0, reply.indexOf('<project_data>')).trim()
    }

    const compMatch = reply.match(/<completeness>\s*(\d+)\s*<\/completeness>/)
    if (compMatch) {
      completeness = parseInt(compMatch[1])
      message = message.replace(/<completeness>\s*\d+\s*<\/completeness>/, '').trim()
    }

    res.json({ message, projectData, completeness })
  } catch (error) {
    console.error('Analyze project error:', error.message)
    res.status(500).json({ message: '', projectData: {}, completeness: 0 })
  }
})

/**
 * POST /api/ai/analyze-job
 * Conversational job posting.
 */
router.post('/analyze-job', async (req, res) => {
  try {
    const { messages = [], currentData = {}, locale = 'en' } = req.body
    if (messages.length === 0) return res.status(400).json({ error: 'Messages required' })

    const lang = locale === 'it' ? 'Italian' : 'English'

    const systemPrompt = `You are a job posting assistant for InTransparency. Help recruiters create compelling job postings through conversation.

CURRENT DATA: ${JSON.stringify(currentData)}

Extract: title, description, responsibilities, requirements, jobType, workLocation, location, remoteOk, salaryMin, salaryMax, requiredSkills, preferredSkills, education, experience, languages, companyName

RULES:
- Respond in ${lang}
- All industries, not just tech
- No cheap emojis

End with:
<project_data>{ ...fields... }</project_data>
<completeness>NUMBER</completeness>`

    const reply = await chatCompletion(systemPrompt, messages)

    let message = reply
    let jobData = {}
    let completeness = 0

    const dataMatch = reply.match(/<project_data>\s*([\s\S]*?)\s*<\/project_data>/)
    if (dataMatch) {
      try { jobData = JSON.parse(dataMatch[1]) } catch {}
      message = reply.slice(0, reply.indexOf('<project_data>')).trim()
    }

    const compMatch = reply.match(/<completeness>\s*(\d+)\s*<\/completeness>/)
    if (compMatch) {
      completeness = parseInt(compMatch[1])
      message = message.replace(/<completeness>\s*\d+\s*<\/completeness>/, '').trim()
    }

    res.json({ message, jobData, completeness })
  } catch (error) {
    console.error('Analyze job error:', error.message)
    res.status(500).json({ message: '', jobData: {}, completeness: 0 })
  }
})

/**
 * POST /api/ai/career-coach
 * Personalized career advisor.
 */
router.post('/career-coach', async (req, res) => {
  try {
    const { messages = [], locale = 'en', studentContext = {} } = req.body
    if (messages.length === 0) return res.status(400).json({ error: 'Messages required' })

    const lang = locale === 'it' ? 'Italian' : 'English'

    const systemPrompt = `You are an expert career coach for InTransparency. You give specific, actionable advice based on verified student data.

STUDENT: ${JSON.stringify(studentContext)}

RULES:
- Respond in ${lang}
- Be direct and actionable
- Reference specific skills and projects
- All disciplines, not just tech
- No cheap emojis
- Max 300 words`

    const reply = await chatCompletion(systemPrompt, messages, 1000)
    res.json({ message: reply })
  } catch (error) {
    console.error('Career coach error:', error.message)
    res.status(500).json({ error: 'Failed to get advice' })
  }
})

/**
 * POST /api/ai/stage-coach
 * Internship preparation and reflection.
 */
router.post('/stage-coach', async (req, res) => {
  try {
    const { messages = [], mode = 'guide', locale = 'en', studentContext = {} } = req.body
    if (messages.length === 0) return res.status(400).json({ error: 'Messages required' })

    const lang = locale === 'it' ? 'Italian' : 'English'
    const modeDescriptions = {
      prepare: 'Help student prepare for an upcoming internship. Practical advice: what to expect, questions to ask, skills to review.',
      reflect: 'Help student reflect on a completed internship. Extract learnings, skills, tools. Generate a project profile. Include <project_data>{...}</project_data> when ready.',
      guide: 'General internship guidance. Types of stages, Italian labor law, CV tips, interview prep.',
    }

    const systemPrompt = `You are an internship coach for InTransparency.

MODE: ${mode} — ${modeDescriptions[mode] || modeDescriptions.guide}
STUDENT: ${JSON.stringify(studentContext)}

RULES:
- Respond in ${lang}
- Be practical and specific to student's discipline
- No cheap emojis`

    const reply = await chatCompletion(systemPrompt, messages, 1000)

    let projectData = null
    const dataMatch = reply.match(/<project_data>\s*([\s\S]*?)\s*<\/project_data>/)
    if (dataMatch) {
      try { projectData = JSON.parse(dataMatch[1]) } catch {}
    }

    res.json({ message: reply.replace(/<project_data>[\s\S]*?<\/project_data>/, '').trim(), projectData })
  } catch (error) {
    console.error('Stage coach error:', error.message)
    res.status(500).json({ error: 'Failed to get advice' })
  }
})

/**
 * POST /api/ai/international-guide
 * Advice on stages abroad, Erasmus+, country preparation.
 */
router.post('/international-guide', async (req, res) => {
  try {
    const { messages = [], locale = 'en', studentContext = {} } = req.body
    if (messages.length === 0) return res.status(400).json({ error: 'Messages required' })

    const lang = locale === 'it' ? 'Italian' : 'English'

    const systemPrompt = `You are an international mobility advisor for InTransparency.

STUDENT: ${JSON.stringify(studentContext)}

KNOWLEDGE: Erasmus+ Traineeship (2-12 months, €650-750/month grant), Vulcanus Japan, IAESTE, AIESEC.
Country guidance: Germany, UK, France, Spain, Netherlands, Switzerland, Ireland, Nordics.
Practical: visa, cost of living, housing, language requirements, cultural differences.

RULES:
- Respond in ${lang}
- Be specific: real cities, salary ranges, grant amounts
- Consider student's language skills
- No cheap emojis`

    const reply = await chatCompletion(systemPrompt, messages, 1200)
    res.json({ message: reply })
  } catch (error) {
    console.error('International guide error:', error.message)
    res.status(500).json({ error: 'Failed to get advice' })
  }
})

/**
 * POST /api/ai/onboard-institution
 * University/tech park onboarding conversation.
 */
router.post('/onboard-institution', async (req, res) => {
  try {
    const { messages = [], currentData = {}, locale = 'en', type = 'university' } = req.body
    if (messages.length === 0) return res.status(400).json({ error: 'Messages required' })

    const lang = locale === 'it' ? 'Italian' : 'English'
    const isTP = type === 'techpark'

    const systemPrompt = `You are an onboarding assistant for InTransparency, helping ${isTP ? 'tech parks' : 'academic institutions'} set up their profile.

CURRENT DATA: ${JSON.stringify(currentData)}

RULES:
- Respond in ${lang}
- Ask 1-3 questions at a time
- No cheap emojis

End with:
<project_data>{ ...fields... }</project_data>
<completeness>NUMBER</completeness>`

    const reply = await chatCompletion(systemPrompt, messages)

    let message = reply
    let profileData = {}
    let completeness = 0

    const dataMatch = reply.match(/<project_data>\s*([\s\S]*?)\s*<\/project_data>/)
    if (dataMatch) {
      try { profileData = JSON.parse(dataMatch[1]) } catch {}
      message = reply.slice(0, reply.indexOf('<project_data>')).trim()
    }

    const compMatch = reply.match(/<completeness>\s*(\d+)\s*<\/completeness>/)
    if (compMatch) {
      completeness = parseInt(compMatch[1])
      message = message.replace(/<completeness>\s*\d+\s*<\/completeness>/, '').trim()
    }

    res.json({ message, profileData, completeness })
  } catch (error) {
    console.error('Onboard institution error:', error.message)
    res.status(500).json({ message: '', profileData: {}, completeness: 0 })
  }
})

/**
 * POST /api/ai/cv-translate
 * Translate CV content to target language.
 */
router.post('/cv-translate', async (req, res) => {
  try {
    const { sections = {}, targetLanguage = 'English' } = req.body

    if (Object.keys(sections).length === 0) {
      return res.json({ translations: {} })
    }

    const reply = await chatCompletion(
      'You are a professional CV translator. Return ONLY valid JSON with the same keys, translated values.',
      [{ role: 'user', content: `Translate to ${targetLanguage}:\n${JSON.stringify(sections, null, 2)}` }],
      2000
    )

    let translations = {}
    try {
      translations = JSON.parse(reply.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim())
    } catch {}

    res.json({ translations, targetLanguage })
  } catch (error) {
    console.error('CV translate error:', error.message)
    res.status(500).json({ error: 'Translation failed' })
  }
})

module.exports = router
