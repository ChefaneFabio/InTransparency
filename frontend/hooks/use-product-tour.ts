'use client'

import { useState, useEffect } from 'react'

interface TourStep {
  id: number
  title: string
  description: string
  target: string
  position: 'top' | 'bottom' | 'left' | 'right'
  highlight: boolean
  action?: {
    type: 'click' | 'hover' | 'focus'
    element: string
  }
}

interface TourState {
  isActive: boolean
  currentTour: string | null
  hasSeenTour: Record<string, boolean>
}

const TOUR_STORAGE_KEY = 'intransparency-tour-state'

export function useProductTour() {
  const [tourState, setTourState] = useState<TourState>({
    isActive: false,
    currentTour: null,
    hasSeenTour: {}
  })

  // Load tour state from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(TOUR_STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        setTourState(prev => ({
          ...prev,
          hasSeenTour: parsed.hasSeenTour || {}
        }))
      }
    } catch (error) {
      console.warn('Failed to load tour state:', error)
    }
  }, [])

  // Save tour state to localStorage
  const saveTourState = (newState: Partial<TourState>) => {
    const updated = { ...tourState, ...newState }
    setTourState(updated)

    try {
      localStorage.setItem(TOUR_STORAGE_KEY, JSON.stringify({
        hasSeenTour: updated.hasSeenTour
      }))
    } catch (error) {
      console.warn('Failed to save tour state:', error)
    }
  }

  const startTour = (tourName: string) => {
    saveTourState({
      isActive: true,
      currentTour: tourName
    })
  }

  const endTour = () => {
    const tourName = tourState.currentTour
    if (tourName) {
      saveTourState({
        isActive: false,
        currentTour: null,
        hasSeenTour: {
          ...tourState.hasSeenTour,
          [tourName]: true
        }
      })
    } else {
      saveTourState({
        isActive: false,
        currentTour: null
      })
    }
  }

  const shouldShowTour = (tourName: string): boolean => {
    return !tourState.hasSeenTour[tourName]
  }

  const resetTour = (tourName: string) => {
    saveTourState({
      hasSeenTour: {
        ...tourState.hasSeenTour,
        [tourName]: false
      }
    })
  }

  const resetAllTours = () => {
    saveTourState({
      hasSeenTour: {}
    })
  }

  return {
    tourState,
    startTour,
    endTour,
    shouldShowTour,
    resetTour,
    resetAllTours,
    isActive: tourState.isActive,
    currentTour: tourState.currentTour
  }
}