'use client'

import { useState, useEffect, useCallback } from 'react'
import type { SkillPathResponse } from '@/lib/skill-path'

export function useSkillPath() {
  const [data, setData] = useState<SkillPathResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const fetchSkillPath = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/student/skill-path')
      if (!response.ok) {
        if (response.status === 401) {
          setError('unauthorized')
          return
        }
        throw new Error('Failed to fetch skill path data')
      }
      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [])

  const refresh = useCallback(async () => {
    try {
      setRefreshing(true)
      setError(null)
      const response = await fetch('/api/student/skill-path/refresh', {
        method: 'POST',
      })
      if (!response.ok) {
        throw new Error('Failed to refresh recommendations')
      }
      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh')
    } finally {
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchSkillPath()
  }, [fetchSkillPath])

  return { data, loading, error, refreshing, refresh }
}
