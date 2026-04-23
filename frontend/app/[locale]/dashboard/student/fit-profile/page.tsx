'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import {
  ConversationChat,
  type ChatMessage,
  type ProfileField,
} from '@/components/dashboard/shared/ConversationChat'
import { emptyFitProfile, type FitProfile } from '@/lib/fit-profile'

const FIT_FIELDS: ProfileField[] = [
  { key: 'goal', label: 'Goal', type: 'text' },
  { key: 'scope', label: 'Ideal environment', type: 'text' },
  { key: 'motivations', label: 'What drives you', type: 'array' },
  { key: 'cultureFit', label: 'Culture fit', type: 'array' },
  { key: 'positionTypes', label: 'Role type', type: 'array' },
  { key: 'companySizes', label: 'Company size', type: 'array' },
  { key: 'industries', label: 'Industries', type: 'array' },
  { key: 'geographies', label: 'Where', type: 'array' },
  { key: 'wishes', label: 'Wishes', type: 'array' },
  { key: 'dealBreakers', label: 'Dealbreakers', type: 'array' },
]

export default function FitProfilePage() {
  const t = useTranslations()
  const locale = useLocale()

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [history, setHistory] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([])
  const [profile, setProfile] = useState<FitProfile>(emptyFitProfile())
  const [completeness, setCompleteness] = useState(0)
  const [analyzing, setAnalyzing] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Load existing profile on mount
  useEffect(() => {
    let cancelled = false
    fetch('/api/student/fit-profile')
      .then(r => (r.ok ? r.json() : null))
      .then(data => {
        if (cancelled || !data) return
        setProfile(data.profile)
        setCompleteness(Math.round((data.profile.completion ?? 0) * 100))
        setMessages([
          {
            role: 'system',
            content:
              locale === 'it'
                ? "Ciao! Aiutiamoci a capire che tipo di ruolo ti farebbe stare bene. Tra 3 anni, dove ti vedi? Puoi rispondere con una frase libera — niente pressioni."
                : "Let's map what role would actually suit you. In 3 years, where do you see yourself? Just a sentence — no pressure.",
          },
        ])
      })
    return () => {
      cancelled = true
    }
  }, [locale])

  const send = useCallback(
    async (text: string) => {
      const userMsg: ChatMessage = { role: 'user', content: text }
      setMessages(prev => [...prev, userMsg])
      setAnalyzing(true)

      const newHistory = [...history, { role: 'user' as const, content: text }]

      try {
        const res = await fetch('/api/student/fit-profile/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: newHistory, currentData: profile, locale }),
        })

        if (!res.ok) throw new Error('Request failed')
        const data = await res.json()

        // Merge extracted data into profile
        if (data.profileData) {
          setProfile(prev => {
            const merged: FitProfile = { ...prev }
            for (const [k, v] of Object.entries(data.profileData)) {
              if (v === undefined || v === null || v === '') continue
              if (Array.isArray(v) && Array.isArray((prev as any)[k])) {
                ;(merged as any)[k] = Array.from(new Set([...(prev as any)[k], ...v]))
              } else {
                ;(merged as any)[k] = v
              }
            }
            return merged
          })
        }
        if (typeof data.completeness === 'number') setCompleteness(data.completeness)

        const aiMessage = data.message || '…'
        setMessages(prev => [...prev, { role: 'assistant', content: aiMessage }])
        setHistory([...newHistory, { role: 'assistant', content: aiMessage }])
      } catch {
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content:
              locale === 'it'
                ? 'Qualcosa è andato storto. Riprova tra qualche secondo.'
                : 'Something went wrong. Try again in a moment.',
          },
        ])
      } finally {
        setAnalyzing(false)
      }
    },
    [history, profile, locale]
  )

  const save = useCallback(async () => {
    setSubmitting(true)
    try {
      const res = await fetch('/api/student/fit-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile }),
      })
      if (!res.ok) throw new Error('save failed')
      const data = await res.json()
      setProfile(data.profile)
      setCompleteness(Math.round((data.profile.completion ?? 0) * 100))
    } catch {
      alert(locale === 'it' ? 'Salvataggio fallito' : 'Save failed')
    } finally {
      setSubmitting(false)
    }
  }, [profile, locale])

  return (
    <ConversationChat
      welcomeMessage={
        locale === 'it'
          ? "Parliamo di che tipo di ruolo ti farebbe stare bene — motivazioni, cultura, ambiente. Non è una candidatura: è per capire cosa matchare."
          : "Let's talk about what role would actually suit you — motivation, culture, environment. Not a job search; it's so we can match you right."
      }
      placeholder={
        locale === 'it'
          ? 'Scrivi qui… es. "mi piacerebbe lavorare in una startup a Milano con autonomia"'
          : 'Type here… e.g. "I want a startup role in Milan with early ownership"'
      }
      analyzingText={locale === 'it' ? 'Sto analizzando…' : 'Thinking…'}
      createButtonText={locale === 'it' ? 'Salva profilo' : 'Save profile'}
      creatingText={locale === 'it' ? 'Salvo…' : 'Saving…'}
      incompleteText={
        locale === 'it' ? 'Racconta almeno il tuo obiettivo' : 'Tell me at least your goal'
      }
      errorText={locale === 'it' ? 'Errore. Riprova.' : 'Error. Try again.'}
      profileTitle={locale === 'it' ? 'Il tuo fit profile' : 'Your fit profile'}
      completenessLabel={locale === 'it' ? 'Completezza' : 'Completeness'}
      profileFields={FIT_FIELDS}
      profile={profile as any}
      completeness={completeness}
      onSendMessage={async text => send(text)}
      onProfileChange={(field, value) =>
        setProfile(prev => ({ ...prev, [field]: value }))
      }
      onArrayAdd={(field, value) => {
        if (!value.trim()) return
        setProfile(prev => ({
          ...prev,
          [field]: Array.from(new Set([...((prev as any)[field] || []), value.trim()])),
        }))
      }}
      onArrayRemove={(field, index) => {
        setProfile(prev => ({
          ...prev,
          [field]: ((prev as any)[field] || []).filter((_: any, i: number) => i !== index),
        }))
      }}
      onCreate={save}
      canCreate={!!profile.goal?.trim()}
      messages={messages}
      analyzing={analyzing}
      submitting={submitting}
    />
  )
}
