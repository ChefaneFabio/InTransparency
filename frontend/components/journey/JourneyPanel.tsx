'use client'

import { useEffect, useState, useCallback } from 'react'
import { Link } from '@/navigation'
import { useLocale } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ChevronUp, ChevronDown, X, RotateCcw } from 'lucide-react'
import { getJourney, type JourneySegment } from '@/lib/journeys'

/**
 * Ambient journey companion.
 *
 * Floating panel docked bottom-left of the dashboard. Always available on
 * login, shows current progress + next action collapsed; click to expand
 * to the full checklist. Dismissable per session, re-openable from a
 * subtle re-open chip in the same corner.
 *
 * State is stored in localStorage (per browser) — keeps individual step
 * completions ('manual' done, 'auto' done) and the "dismissed" flag.
 *
 * Detection: each step can declare an async `detect()` that hits an API to
 * check if the action has been done. We run all detections in parallel on
 * mount + on focus. Manual completions stay sticky even if detection
 * later returns false.
 */

interface Props {
  segment: JourneySegment
  /**
   * Localised "Show journey again" label for the re-open pill.
   * Defaults to English; pass a translated string from the layout.
   */
  reopenLabel?: string
}

type StepState = 'todo' | 'done' | 'doneAuto'

const STORAGE_PREFIX = 'intransparency_journey_'
const FIRST_SEEN_PREFIX = 'intransparency_journey_seen_'

interface PersistedState {
  steps: Record<string, StepState>
  dismissed: boolean
  expanded: boolean
  /** Set to true after the first auto-expand so we don't keep popping. */
  firstSeen?: boolean
}

function loadState(journeyKey: string): PersistedState {
  if (typeof window === 'undefined') return { steps: {}, dismissed: false, expanded: false, firstSeen: false }
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + journeyKey)
    if (!raw) return { steps: {}, dismissed: false, expanded: false, firstSeen: false }
    const parsed = JSON.parse(raw)
    return {
      steps: parsed.steps || {},
      dismissed: !!parsed.dismissed,
      expanded: !!parsed.expanded,
      firstSeen: !!parsed.firstSeen || !!localStorage.getItem(FIRST_SEEN_PREFIX + journeyKey),
    }
  } catch {
    return { steps: {}, dismissed: false, expanded: false, firstSeen: false }
  }
}

function saveState(journeyKey: string, state: PersistedState) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_PREFIX + journeyKey, JSON.stringify(state))
    if (state.firstSeen) localStorage.setItem(FIRST_SEEN_PREFIX + journeyKey, '1')
  } catch {
    // localStorage unavailable (private mode, quota) — silent
  }
}

const SEGMENT_THEME: Record<JourneySegment, { accent: string; ring: string; bg: string }> = {
  student: {
    accent: 'text-violet-600 dark:text-violet-300',
    ring: 'ring-violet-200 dark:ring-violet-800/40',
    bg: 'bg-gradient-to-br from-violet-500 to-purple-600',
  },
  recruiter: {
    accent: 'text-blue-600 dark:text-blue-300',
    ring: 'ring-blue-200 dark:ring-blue-800/40',
    bg: 'bg-gradient-to-br from-blue-500 to-cyan-500',
  },
  institution: {
    accent: 'text-amber-700 dark:text-amber-300',
    ring: 'ring-amber-200 dark:ring-amber-800/40',
    bg: 'bg-gradient-to-br from-amber-500 to-orange-500',
  },
}

export default function JourneyPanel({ segment, reopenLabel }: Props) {
  const locale = useLocale() as 'en' | 'it'
  const journey = getJourney(segment, locale)
  const theme = SEGMENT_THEME[segment]
  const L = locale === 'it'
    ? {
        reopen: reopenLabel || 'Mostra journey',
        next: 'Prossimo',
        allDone: 'Tutto fatto — bel lavoro.',
        hide: 'Nascondi journey',
        markDone: (label: string) => `Marca "${label}" completato`,
        markUndone: (label: string) => `Marca "${label}" non completato`,
        allCheckedOff: 'Tutto spuntato. Il pannello continua a tracciare la tua attività — togli la spunta a uno step per rivisitarlo.',
      }
    : {
        reopen: reopenLabel || 'Show journey',
        next: 'Next',
        allDone: 'All done — nice work.',
        hide: 'Hide journey',
        markDone: (label: string) => `Mark "${label}" done`,
        markUndone: (label: string) => `Mark "${label}" not done`,
        allCheckedOff: "Everything's checked off. The journey panel will keep tracking your activity — uncheck any step to revisit.",
      }
  const [stepStates, setStepStates] = useState<Record<string, StepState>>({})
  const [expanded, setExpanded] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [firstSeen, setFirstSeen] = useState(true) // default true so we don't auto-expand pre-hydration
  const [hydrated, setHydrated] = useState(false)

  // Hydrate from localStorage. If this is the user's first time seeing the
  // journey panel ever, auto-expand so they actually notice it instead of
  // walking past the collapsed pill.
  useEffect(() => {
    const loaded = loadState(journey.key)
    setStepStates(loaded.steps)
    setDismissed(loaded.dismissed)
    setFirstSeen(!!loaded.firstSeen)
    if (!loaded.firstSeen && !loaded.dismissed) {
      setExpanded(true) // auto-pop on first visit
    } else {
      setExpanded(loaded.expanded)
    }
    setHydrated(true)
  }, [journey.key])

  // Once hydrated and rendered expanded, mark first-seen so we don't keep
  // auto-expanding on every navigation.
  useEffect(() => {
    if (hydrated && expanded && !firstSeen) {
      setFirstSeen(true)
    }
  }, [hydrated, expanded, firstSeen])

  // Persist
  useEffect(() => {
    if (!hydrated) return
    saveState(journey.key, { steps: stepStates, dismissed, expanded, firstSeen })
  }, [stepStates, dismissed, expanded, firstSeen, hydrated, journey.key])

  // Run detections in parallel — on mount + on tab refocus
  const runDetections = useCallback(async () => {
    const detections = await Promise.all(
      journey.steps.map(async step => {
        if (!step.detect) return null
        try {
          const done = await step.detect()
          return done ? step.key : null
        } catch {
          return null
        }
      })
    )
    setStepStates(prev => {
      const next = { ...prev }
      let changed = false
      for (const key of detections) {
        if (!key) continue
        // Only auto-promote if not already manually marked done
        if (next[key] !== 'done') {
          next[key] = 'doneAuto'
          changed = true
        }
      }
      return changed ? next : prev
    })
  }, [journey.steps])

  useEffect(() => {
    if (!hydrated) return
    runDetections()
    const onFocus = () => runDetections()
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [hydrated, runDetections])

  const toggleStep = (key: string) => {
    setStepStates(prev => ({
      ...prev,
      [key]: prev[key] === 'done' || prev[key] === 'doneAuto' ? 'todo' : 'done',
    }))
  }

  const isDone = (s: StepState | undefined) => s === 'done' || s === 'doneAuto'
  const completedCount = journey.steps.filter(s => isDone(stepStates[s.key])).length
  const totalCount = journey.steps.length
  const allDone = completedCount === totalCount
  const nextStep = journey.steps.find(s => !isDone(stepStates[s.key]))
  const pct = Math.round((completedCount / totalCount) * 100)

  if (!hydrated) return null

  // ── Dismissed: tiny re-open pill ──
  if (dismissed) {
    return (
      <button
        onClick={() => setDismissed(false)}
        className="fixed bottom-4 left-4 z-30 flex items-center gap-2 px-3 py-2 rounded-full bg-card border shadow-md text-xs text-muted-foreground hover:text-foreground hover:shadow-lg transition-all"
        aria-label={L.reopen}
      >
        <RotateCcw className="h-3 w-3" />
        {L.reopen}
        <span className={`text-[10px] font-semibold ${theme.accent}`}>{completedCount}/{totalCount}</span>
      </button>
    )
  }

  return (
    <AnimatePresence>
      <motion.div
        key={journey.key}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 16 }}
        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
        className="fixed bottom-4 left-4 z-30 w-[320px] max-w-[calc(100vw-2rem)] rounded-2xl bg-card border shadow-2xl overflow-hidden"
      >
        {/* Header — always visible */}
        <button
          onClick={() => setExpanded(e => !e)}
          className="w-full text-left p-3.5 flex items-start gap-3 hover:bg-muted/30 transition-colors"
        >
          {/* Progress ring */}
          <div className="relative h-10 w-10 shrink-0">
            <svg viewBox="0 0 36 36" className="h-10 w-10 -rotate-90">
              <circle cx="18" cy="18" r="15" fill="none" className="stroke-muted" strokeWidth="3" />
              <motion.circle
                cx="18" cy="18" r="15" fill="none"
                strokeWidth="3"
                strokeLinecap="round"
                className={theme.accent}
                stroke="currentColor"
                strokeDasharray={`${(pct / 100) * 94.25} 94.25`}
                initial={{ strokeDasharray: '0 94.25' }}
                animate={{ strokeDasharray: `${(pct / 100) * 94.25} 94.25` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-foreground">
              {completedCount}/{totalCount}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground leading-tight">{journey.title}</p>
            {allDone ? (
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">{L.allDone}</p>
            ) : nextStep ? (
              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                {L.next}: <span className="text-foreground font-medium">{nextStep.label}</span>
              </p>
            ) : null}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <span
              role="button"
              tabIndex={0}
              onClick={e => {
                e.stopPropagation()
                setDismissed(true)
              }}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.stopPropagation()
                  setDismissed(true)
                }
              }}
              className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors cursor-pointer"
              aria-label={L.hide}
            >
              <X className="h-3.5 w-3.5" />
            </span>
            <span aria-hidden className="text-muted-foreground p-1">
              {expanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
            </span>
          </div>
        </button>

        {/* Expanded body — full checklist */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="overflow-hidden border-t"
            >
              <div className="p-3 space-y-2 max-h-[60vh] overflow-y-auto">
                <p className="text-xs text-muted-foreground px-1.5 pb-1 leading-relaxed">{journey.subtitle}</p>
                {journey.steps.map((step, i) => {
                  const state = stepStates[step.key]
                  const done = isDone(state)
                  return (
                    <div
                      key={step.key}
                      className={`group rounded-lg border p-3 transition-colors ${
                        done ? 'bg-muted/30 border-muted' : 'bg-background border-border hover:border-foreground/20'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <button
                          type="button"
                          onClick={() => toggleStep(step.key)}
                          className={`mt-0.5 h-4 w-4 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                            done
                              ? 'bg-emerald-500 text-white'
                              : 'border-2 border-muted-foreground/30 hover:border-foreground/60'
                          }`}
                          aria-label={done ? L.markUndone(step.label) : L.markDone(step.label)}
                        >
                          {done && <Check className="h-2.5 w-2.5" strokeWidth={3} />}
                        </button>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-muted-foreground/60 tabular-nums">{i + 1}</span>
                            <p className={`text-sm font-medium ${done ? 'text-muted-foreground line-through decoration-muted-foreground/40' : 'text-foreground'}`}>
                              {step.label}
                            </p>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{step.hint}</p>
                          {!done && (
                            <Link
                              href={step.href as any}
                              className={`inline-flex items-center mt-2 text-xs font-medium ${theme.accent} hover:underline`}
                            >
                              {step.cta} →
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
                {allDone && (
                  <p className="text-xs text-emerald-700 dark:text-emerald-400 px-1.5 pt-1 leading-relaxed">
                    {L.allCheckedOff}
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  )
}
