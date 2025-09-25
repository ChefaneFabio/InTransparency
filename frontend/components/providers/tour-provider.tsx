'use client'

import { createContext, useContext, ReactNode } from 'react'
import { ProductTour, defaultTours } from '@/components/ui/product-tour'
import { useProductTour } from '@/hooks/use-product-tour'

interface TourContextType {
  startTour: (tourName: string) => void
  endTour: () => void
  shouldShowTour: (tourName: string) => boolean
  resetTour: (tourName: string) => void
  resetAllTours: () => void
  isActive: boolean
  currentTour: string | null
}

const TourContext = createContext<TourContextType | undefined>(undefined)

export function useTour() {
  const context = useContext(TourContext)
  if (context === undefined) {
    throw new Error('useTour must be used within a TourProvider')
  }
  return context
}

interface TourProviderProps {
  children: ReactNode
}

export function TourProvider({ children }: TourProviderProps) {
  const tourHook = useProductTour()

  const getCurrentTourSteps = () => {
    if (!tourHook.currentTour) return []

    switch (tourHook.currentTour) {
      case 'dashboard':
        return defaultTours.dashboard
      case 'profile':
        return defaultTours.profile
      case 'recruiter':
        return defaultTours.recruiter
      default:
        return []
    }
  }

  return (
    <TourContext.Provider value={tourHook}>
      {children}

      {/* Tour Component */}
      {tourHook.isActive && tourHook.currentTour && (
        <ProductTour
          isOpen={tourHook.isActive}
          onClose={tourHook.endTour}
          steps={getCurrentTourSteps()}
          autoPlay={true}
        />
      )}
    </TourContext.Provider>
  )
}