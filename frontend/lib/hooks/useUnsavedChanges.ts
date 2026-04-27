'use client'

import { useEffect, useMemo } from 'react'

/**
 * Generic unsaved-changes hook.
 *
 * Pass two values (or two structurally-comparable refs/objects) and a flag
 * for "saving in progress". Returns:
 *   - `isDirty` — whether current differs from baseline
 *   - guards: warns the user if they try to close the tab with unsaved changes
 *
 * Companion to <UnsavedChangesBar/> (the sticky save bar). Lift your form
 * state, snapshot the baseline on load, then call this hook.
 *
 * Lifted out of components/dashboard/recruiter/settings-tabs/GeneralPanel.tsx
 * so any form (job edit, profile edit, convention builder, etc.) can use it.
 */

export function useUnsavedChanges<T>(current: T, baseline: T, opts?: { saving?: boolean }): boolean {
  const isDirty = useMemo(
    () => JSON.stringify(current) !== JSON.stringify(baseline),
    [current, baseline]
  )

  // beforeunload guard — browser-level "you have unsaved changes" prompt
  useEffect(() => {
    if (!isDirty || opts?.saving) return
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      // Modern browsers ignore the message but require returnValue to show the prompt
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [isDirty, opts?.saving])

  return isDirty
}
