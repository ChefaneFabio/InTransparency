'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'

export type Segment = 'students' | 'institutions' | 'companies'

interface SegmentContextValue {
  segment: Segment
  setSegment: (s: Segment) => void
  segmentClass: string
}

const segmentClassMap: Record<Segment, string> = {
  students: '',                    // teal default — no override needed
  institutions: 'segment-university',
  companies: 'segment-recruiter',
}

const SegmentContext = createContext<SegmentContextValue>({
  segment: 'students',
  setSegment: () => {},
  segmentClass: '',
})

export function SegmentProvider({ children }: { children: ReactNode }) {
  const [segment, setSegmentState] = useState<Segment>('students')
  const [mounted, setMounted] = useState(false)

  // Read from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('intransparency-segment') as Segment | null
      if (stored && ['students', 'institutions', 'companies'].includes(stored)) {
        setSegmentState(stored)
      }
    } catch {}
    setMounted(true)
  }, [])

  const setSegment = useCallback((s: Segment) => {
    setSegmentState(s)
    try {
      localStorage.setItem('intransparency-segment', s)
    } catch {}
  }, [])

  // Apply segment class to <body>
  useEffect(() => {
    if (!mounted) return
    const body = document.body
    // Remove all segment classes
    body.classList.remove('segment-recruiter', 'segment-university', 'segment-professor')
    // Add the active one
    const cls = segmentClassMap[segment]
    if (cls) {
      body.classList.add(cls)
    }
  }, [segment, mounted])

  return (
    <SegmentContext.Provider value={{ segment, setSegment, segmentClass: segmentClassMap[segment] }}>
      {children}
    </SegmentContext.Provider>
  )
}

export function useSegment() {
  return useContext(SegmentContext)
}
