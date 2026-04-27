'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useLocale } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

/**
 * Sticky bottom-right save bar that appears only when there are unsaved
 * changes. Shows "Discard / Save" while dirty, and "All changes saved"
 * briefly after a successful save.
 *
 * Bilingual via useLocale.
 *
 * Usage:
 *   <UnsavedChangesBar
 *     isDirty={isDirty}
 *     saved={saveState === 'saved'}
 *     saving={saving}
 *     onDiscard={() => setForm(original)}
 *     onSave={handleSave}
 *   />
 */

interface Props {
  isDirty: boolean
  saved: boolean
  saving: boolean
  onDiscard: () => void
  onSave: () => void
}

export default function UnsavedChangesBar({ isDirty, saved, saving, onDiscard, onSave }: Props) {
  const locale = useLocale()
  const isIt = locale === 'it'
  const visible = isDirty || saved

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 26 }}
          className="fixed bottom-4 inset-x-4 sm:left-auto sm:right-4 sm:max-w-md z-40"
        >
          <div className="rounded-2xl border bg-card shadow-2xl px-4 py-3 flex items-center gap-3">
            {saved ? (
              <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400 flex-1">
                {isIt ? 'Tutte le modifiche salvate.' : 'All changes saved.'}
              </p>
            ) : (
              <>
                <p className="text-sm font-medium text-foreground flex-1">
                  {isIt ? 'Modifiche non salvate' : 'Unsaved changes'}
                </p>
                <Button variant="ghost" size="sm" onClick={onDiscard} disabled={saving}>
                  {isIt ? 'Annulla' : 'Discard'}
                </Button>
                <Button onClick={onSave} disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                      {isIt ? 'Salvataggio…' : 'Saving…'}
                    </>
                  ) : (
                    isIt ? 'Salva modifiche' : 'Save changes'
                  )}
                </Button>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
