'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Loader2, ChevronDown, ChevronUp, Link as LinkIcon, FileText } from 'lucide-react'
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
    <div className="rounded-xl border border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/40 dark:to-cyan-950/40 mb-4">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
      >
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-md">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
              Have an existing job description?
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              Paste it (or a URL) and we'll auto-fill the form in seconds.
            </p>
          </div>
        </div>
        {open ? (
          <ChevronUp className="h-4 w-4 text-blue-700 dark:text-blue-300" />
        ) : (
          <ChevronDown className="h-4 w-4 text-blue-700 dark:text-blue-300" />
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
              <div className="inline-flex rounded-lg border border-blue-200 dark:border-blue-800 bg-white/60 dark:bg-slate-900/60 p-0.5">
                <button
                  onClick={() => setMode('text')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    mode === 'text'
                      ? 'bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-200 shadow-sm'
                      : 'text-blue-700/70 dark:text-blue-300/70 hover:text-blue-900 dark:hover:text-blue-100'
                  }`}
                >
                  <FileText className="h-3 w-3" />
                  Paste text
                </button>
                <button
                  onClick={() => setMode('url')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    mode === 'url'
                      ? 'bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-200 shadow-sm'
                      : 'text-blue-700/70 dark:text-blue-300/70 hover:text-blue-900 dark:hover:text-blue-100'
                  }`}
                >
                  <LinkIcon className="h-3 w-3" />
                  From URL
                </button>
              </div>

              {mode === 'text' ? (
                <Textarea
                  value={text}
                  onChange={e => setText(e.target.value)}
                  placeholder="Paste the full job description here. Italian or English both work."
                  rows={5}
                  className="bg-white dark:bg-slate-900 border-blue-200 dark:border-blue-800 text-sm"
                  disabled={loading}
                />
              ) : (
                <Input
                  type="url"
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  placeholder="https://example.com/jobs/senior-developer"
                  className="bg-white dark:bg-slate-900 border-blue-200 dark:border-blue-800 text-sm"
                  disabled={loading}
                />
              )}

              {error && (
                <p className="text-xs text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-md px-3 py-2">
                  {error}
                </p>
              )}

              <div className="flex items-center justify-between gap-3">
                <p className="text-[11px] text-blue-700/80 dark:text-blue-300/80">
                  We'll fill what we can; you review and edit before publishing.
                </p>
                <Button
                  onClick={handleParse}
                  disabled={!canParse || loading}
                  size="sm"
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:opacity-90 text-white shadow-md"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                      Reading…
                    </>
                  ) : done ? (
                    <>
                      <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                      Done · check the fields
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                      Auto-fill the form
                    </>
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
