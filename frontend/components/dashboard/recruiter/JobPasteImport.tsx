'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'

interface ParsedJob {
  title?: string
  description?: string
  responsibilities?: string
  requirements?: string
  niceToHave?: string
  jobType?: string
  workLocation?: string
  location?: string
  remoteOk?: boolean
  salaryMin?: number
  salaryMax?: number
  salaryCurrency?: string
  requiredSkills?: string[]
  preferredSkills?: string[]
  education?: string
  experience?: string
  languages?: string[]
  seniority?: string
}

interface Props {
  /** Called with the parsed structured fields. The parent merges into job state. */
  onParsed: (parsed: ParsedJob) => void
}

/**
 * "Paste a JD or URL → AI fills the form" banner. Sits above the
 * conversational chat on the new-job page. Skips the back-and-forth for
 * recruiters who already have a written job description.
 */
export default function JobPasteImport({ onParsed }: Props) {
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<'text' | 'url'>('text')
  const [text, setText] = useState('')
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  const handleParse = async () => {
    setError(null)
    setLoading(true)
    setDone(false)
    try {
      const res = await fetch('/api/ai/parse-job-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mode === 'url' ? { url } : { text }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to parse')
      }
      onParsed(data.parsed || {})
      setDone(true)
      setText('')
      setUrl('')
      // Auto-collapse after success so the chat takes focus
      setTimeout(() => {
        setOpen(false)
        setDone(false)
      }, 1500)
    } catch (e: any) {
      setError(e.message || 'Failed to parse')
    } finally {
      setLoading(false)
    }
  }

  const canParse = mode === 'text' ? text.trim().length > 30 : /^https?:\/\/\S+/.test(url.trim())

  return (
    <div className="rounded-xl border border-border/60 bg-muted/30 mb-4">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
      >
        <div>
          <p className="text-sm font-semibold text-foreground">
            Have an existing job description?
          </p>
          <p className="text-sm text-muted-foreground mt-0.5">
            Paste it (or a URL) and we'll auto-fill the form in seconds.
          </p>
        </div>
        {open ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3">
              {/* Mode toggle */}
              <div className="inline-flex rounded-lg border border-border/60 bg-background p-0.5">
                <button
                  onClick={() => setMode('text')}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    mode === 'text'
                      ? 'bg-foreground text-background'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Paste text
                </button>
                <button
                  onClick={() => setMode('url')}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    mode === 'url'
                      ? 'bg-foreground text-background'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  From URL
                </button>
              </div>

              {mode === 'text' ? (
                <Textarea
                  value={text}
                  onChange={e => setText(e.target.value)}
                  placeholder="Paste the full job description here. Italian or English both work."
                  rows={5}
                  className="text-sm"
                  disabled={loading}
                />
              ) : (
                <Input
                  type="url"
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  placeholder="https://example.com/jobs/senior-developer"
                  className="text-sm"
                  disabled={loading}
                />
              )}

              {error && (
                <p className="text-sm text-rose-700 dark:text-rose-400">
                  {error}
                </p>
              )}

              <div className="flex items-center justify-between gap-3">
                <p className="text-xs text-muted-foreground">
                  We'll fill what we can; you review and edit before publishing.
                </p>
                <Button onClick={handleParse} disabled={!canParse || loading} size="sm">
                  {loading ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                      Reading
                    </>
                  ) : done ? (
                    'Done · check the fields'
                  ) : (
                    'Auto-fill the form'
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
