'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { ConversationChat, type ChatMessage, type ProfileField } from '@/components/dashboard/shared/ConversationChat'

const UNI_PROFILE_FIELDS: ProfileField[] = [
  { key: 'name', label: 'Name', type: 'text' },
  { key: 'shortName', label: 'Short name', type: 'text' },
  { key: 'city', label: 'City', type: 'text' },
  { key: 'region', label: 'Region', type: 'text' },
  { key: 'country', label: 'Country', type: 'text' },
  { key: 'website', label: 'Website', type: 'text' },
  { key: 'email', label: 'Email', type: 'text' },
  { key: 'phone', label: 'Phone', type: 'text' },
  { key: 'programs', label: 'Programs', type: 'array' },
  { key: 'focusAreas', label: 'Focus areas', type: 'array' },
  { key: 'studentCount', label: 'Students', type: 'text' },
  { key: 'partnershipGoals', label: 'Goals', type: 'text' },
]

export default function UniversitySetupPage() {
  const t = useTranslations('universitySetup')
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

  const handleSendMessage = useCallback(async (text: string) => {
    const userMsg: ChatMessage = { role: 'user', content: text }
    setMessages(prev => [...prev, userMsg])
    setAnalyzing(true)

    const newHistory = [...conversationHistory, { role: 'user' as const, content: text }]

    try {
      const res = await fetch('/api/ai/onboard-institution', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newHistory, currentData: profile, locale, type: 'university' }),
      })

      if (res.ok) {
        const data = await res.json()
        if (data.profileData) {
          setProfile(prev => {
            const merged = { ...prev }
            for (const [key, value] of Object.entries(data.profileData)) {
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
      const res = await fetch('/api/dashboard/university/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      })
      if (!res.ok) throw new Error('Failed')
      router.push('/dashboard/university')
      router.refresh()
    } catch {
      alert(t('error'))
    } finally {
      setSubmitting(false)
    }
  }, [profile, router, t])

  const localizedFields = UNI_PROFILE_FIELDS.map(f => ({
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
      canCreate={!!(profile.name && profile.city)}
      messages={messages}
      analyzing={analyzing}
      submitting={submitting}
    />
  )
}
