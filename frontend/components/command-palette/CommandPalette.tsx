'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ArrowRight, ArrowDown, ArrowUp, CornerDownLeft } from 'lucide-react'
import {
  COMMANDS,
  filterCommands,
  type Command,
  type CommandRole,
} from '@/lib/commands'

/**
 * Cmd+K command palette — global navigator + action launcher.
 *
 * Pattern: Linear/Vercel/Notion. ⌘K (or ⌃K on non-mac) opens an overlay,
 * type to fuzzy-filter all commands, ↑↓ to navigate, Enter to fire.
 *
 * Per-role filtering so a recruiter doesn't see student commands.
 * Bilingual: labels + groups switch on the active locale.
 */

interface Props {
  role: CommandRole
}

export default function CommandPalette({ role }: Props) {
  const router = useRouter()
  const locale = useLocale() as 'en' | 'it'
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIdx, setActiveIdx] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const allowedCommands = COMMANDS.filter(
    c => c.roles.includes(role) || c.roles.includes('all')
  )
  const visible = filterCommands(allowedCommands, query, locale)

  // Group by group label
  const grouped = visible.reduce<Record<string, Command[]>>((acc, c) => {
    const g = c.group[locale]
    if (!acc[g]) acc[g] = []
    acc[g].push(c)
    return acc
  }, {})
  const flat = Object.values(grouped).flat() // for keyboard navigation

  // Open / close on Cmd+K
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isToggle = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k'
      if (isToggle) {
        e.preventDefault()
        setOpen(o => !o)
      } else if (e.key === 'Escape' && open) {
        setOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // Reset state when opening
  useEffect(() => {
    if (open) {
      setQuery('')
      setActiveIdx(0)
      // Focus input on next tick (after dialog has mounted)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  // Reset active index when query changes
  useEffect(() => {
    setActiveIdx(0)
  }, [query])

  const fireCommand = useCallback(
    (c: Command) => {
      setOpen(false)
      if (c.href) {
        router.push(c.href)
      }
    },
    [router]
  )

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx(i => Math.min(flat.length - 1, i + 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx(i => Math.max(0, i - 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const cmd = flat[activeIdx]
      if (cmd) fireCommand(cmd)
    }
  }

  // Scroll active row into view
  useEffect(() => {
    if (!listRef.current) return
    const active = listRef.current.querySelector(`[data-cmd-idx="${activeIdx}"]`)
    if (active) {
      ;(active as HTMLElement).scrollIntoView({ block: 'nearest' })
    }
  }, [activeIdx])

  const L =
    locale === 'it'
      ? {
          placeholder: 'Cerca o vai a…',
          empty: 'Nessun comando trovato.',
          hint: 'navigare',
          run: 'eseguire',
          close: 'chiudere',
        }
      : {
          placeholder: 'Search or jump to…',
          empty: 'No matching commands.',
          hint: 'navigate',
          run: 'run',
          close: 'close',
        }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm"
            aria-hidden
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            className="fixed left-1/2 top-[12vh] -translate-x-1/2 z-50 w-[640px] max-w-[calc(100vw-2rem)] rounded-2xl bg-card border shadow-2xl overflow-hidden"
          >
            {/* Search input */}
            <div className="flex items-center gap-2 px-4 py-3 border-b">
              <Search className="h-4 w-4 text-muted-foreground shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={L.placeholder}
                className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
              />
              <kbd className="text-[10px] text-muted-foreground border rounded px-1.5 py-0.5">esc</kbd>
            </div>

            {/* Results */}
            <div ref={listRef} className="max-h-[55vh] overflow-y-auto py-2">
              {flat.length === 0 ? (
                <p className="px-4 py-8 text-sm text-center text-muted-foreground">{L.empty}</p>
              ) : (
                Object.entries(grouped).map(([groupName, items]) => (
                  <div key={groupName} className="mb-2">
                    <p className="px-4 py-1.5 text-[10px] uppercase tracking-widest text-muted-foreground">
                      {groupName}
                    </p>
                    {items.map(c => {
                      const idx = flat.indexOf(c)
                      const active = idx === activeIdx
                      return (
                        <button
                          key={c.id}
                          data-cmd-idx={idx}
                          onClick={() => fireCommand(c)}
                          onMouseEnter={() => setActiveIdx(idx)}
                          className={`w-full text-left flex items-center justify-between gap-3 px-4 py-2 text-sm transition-colors ${
                            active ? 'bg-muted text-foreground' : 'text-foreground/90 hover:bg-muted/50'
                          }`}
                        >
                          <div className="min-w-0">
                            <p className="truncate">{c.label[locale]}</p>
                            {c.hint && (
                              <p className="text-xs text-muted-foreground truncate">{c.hint[locale]}</p>
                            )}
                          </div>
                          {active && (
                            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                          )}
                        </button>
                      )
                    })}
                  </div>
                ))
              )}
            </div>

            {/* Footer hints */}
            <div className="border-t px-4 py-2 flex items-center gap-4 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <kbd className="border rounded px-1 py-0.5"><ArrowUp className="h-2.5 w-2.5" /></kbd>
                <kbd className="border rounded px-1 py-0.5"><ArrowDown className="h-2.5 w-2.5" /></kbd>
                {L.hint}
              </span>
              <span className="flex items-center gap-1">
                <kbd className="border rounded px-1 py-0.5"><CornerDownLeft className="h-2.5 w-2.5" /></kbd>
                {L.run}
              </span>
              <span className="flex items-center gap-1 ml-auto">
                <kbd className="border rounded px-1 py-0.5">esc</kbd>
                {L.close}
              </span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
