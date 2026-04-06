'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { ConversationChat, type ChatMessage, type ProfileField } from '@/components/dashboard/shared/ConversationChat'
import { GlassCard } from '@/components/dashboard/shared/GlassCard'

const JOB_PROFILE_FIELDS: ProfileField[] = [
  { key: 'title', label: 'Title', type: 'text' },
  { key: 'jobType', label: 'Type', type: 'badge' },
  { key: 'workLocation', label: 'Location type', type: 'badge' },
  { key: 'location', label: 'Location', type: 'text' },
  { key: 'requiredSkills', label: 'Required skills', type: 'array' },
  { key: 'preferredSkills', label: 'Preferred skills', type: 'array' },
  { key: 'education', label: 'Education', type: 'text' },
  { key: 'experience', label: 'Experience', type: 'text' },
  { key: 'languages', label: 'Languages', type: 'array' },
  { key: 'salaryMin', label: 'Salary min', type: 'text' },
  { key: 'salaryMax', label: 'Salary max', type: 'text' },
  { key: 'salaryPeriod', label: 'Salary period', type: 'text' },
  { key: 'companyName', label: 'Company', type: 'text' },
  { key: 'companyIndustry', label: 'Industry', type: 'text' },
  { key: 'expiresAt', label: 'Deadline', type: 'text' },
]

export default function NewJobPage() {
  const t = useTranslations('postJob')
  const locale = useLocale()
  const router = useRouter()

  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'system', content: t('chat.welcome') },
  ])
  const [conversationHistory, setConversationHistory] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([])
  const [profile, setProfile] = useState<Record<string, any>>({})
  const [completeness, setCompleteness] = useState(0)
  const [analyzing, setAnalyzing] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSendMessage = useCallback(async (text: string, attachments: Array<{ type: 'image' | 'document'; url: string; name: string }>) => {
    const userMsg: ChatMessage = { role: 'user', content: text || 'Attached files', attachments: attachments.length > 0 ? attachments : undefined }
    setMessages(prev => [...prev, userMsg])
    setAnalyzing(true)

    const newHistory = [...conversationHistory, { role: 'user' as const, content: text }]

    try {
      const res = await fetch('/api/ai/analyze-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newHistory, currentData: profile, locale }),
      })

      if (res.ok) {
        const data = await res.json()
        if (data.jobData) {
          setProfile(prev => {
            const merged = { ...prev }
            for (const [key, value] of Object.entries(data.jobData)) {
              if (value !== undefined && value !== null && value !== '') {
                if (Array.isArray(value) && Array.isArray(prev[key])) {
                  merged[key] = Array.from(new Set([...(prev[key] || []), ...(value as string[])]))
                } else {
                  merged[key] = value
                }
              }
            }
            return merged
          })
        }
        if (data.completeness) setCompleteness(data.completeness)
        const aiMessage = data.message || t('chat.followUp')
        setMessages(prev => [...prev, { role: 'assistant', content: aiMessage }])
        setConversationHistory([...newHistory, { role: 'assistant', content: aiMessage }])
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: t('chat.error') }])
        setConversationHistory(newHistory)
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: t('chat.error') }])
      setConversationHistory(newHistory)
    } finally {
      setAnalyzing(false)
    }
  }, [conversationHistory, profile, locale, t])

  const handleCreate = useCallback(async () => {
    setSubmitting(true)
    try {
      const slug = (profile.title || 'job').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 60) + '-' + Date.now().toString(36)
      const res = await fetch('/api/dashboard/recruiter/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...profile,
          slug,
          status: 'DRAFT',
          isPublic: false,
          internalApply: true,
        }),
      })
      if (!res.ok) throw new Error('Failed')
      router.push('/dashboard/recruiter/jobs')
      router.refresh()
    } catch {
      alert(t('error'))
    } finally {
      setSubmitting(false)
    }
  }, [profile, router, t])

  // Localize field labels
  const localizedFields = JOB_PROFILE_FIELDS.map(f => ({
    ...f,
    label: t(`profile.${f.key}`, { defaultValue: f.label }),
  }))

  return (
    <ConversationChat
      welcomeMessage={t('chat.welcome')}
      placeholder={t('chat.placeholder')}
      analyzingText={t('chat.analyzing')}
      createButtonText={t('chat.looksGood')}
      creatingText={t('chat.creating')}
      incompleteText={t('chat.incompleteProfile')}
      errorText={t('chat.error')}
      profileTitle={t('profile.title')}
      completenessLabel={t('profile.completeness')}
      profileFields={localizedFields}
      profile={profile}
      completeness={completeness}
      onSendMessage={handleSendMessage}
      onProfileChange={(field, value) => setProfile(prev => ({ ...prev, [field]: value }))}
      onArrayAdd={(field, value) => {
        if (!value.trim()) return
        setProfile(prev => ({ ...prev, [field]: Array.from(new Set([...(prev[field] || []), value.trim()])) }))
      }}
      onArrayRemove={(field, index) => {
        setProfile(prev => ({ ...prev, [field]: (prev[field] || []).filter((_: any, i: number) => i !== index) }))
      }}
      onCreate={handleCreate}
      canCreate={!!(profile.title && profile.description && profile.jobType)}
      messages={messages}
      analyzing={analyzing}
      submitting={submitting}
    />
  )
}
