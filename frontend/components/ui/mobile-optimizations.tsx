'use client'

import { useEffect, useState } from 'react'

export function useMobileDetection() {
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait')

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth
      const height = window.innerHeight

      setIsMobile(width < 768)
      setIsTablet(width >= 768 && width < 1024)
      setOrientation(width > height ? 'landscape' : 'portrait')
    }

    checkDevice()
    window.addEventListener('resize', checkDevice)
    window.addEventListener('orientationchange', checkDevice)

    return () => {
      window.removeEventListener('resize', checkDevice)
      window.removeEventListener('orientationchange', checkDevice)
    }
  }, [])

  return { isMobile, isTablet, orientation }
}

export function useTouchGestures() {
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0)
  }, [])

  const addTouchClasses = (element: HTMLElement) => {
    if (isTouch) {
      element.classList.add('touch-device')

      // Add visual feedback for touch interactions
      const addTouchFeedback = (e: TouchEvent) => {
        const target = e.currentTarget as HTMLElement
        target?.classList.add('touch-active')
      }

      const removeTouchFeedback = (e: TouchEvent) => {
        setTimeout(() => {
          const target = e.currentTarget as HTMLElement
          target?.classList.remove('touch-active')
        }, 150)
      }

      element.addEventListener('touchstart', addTouchFeedback)
      element.addEventListener('touchend', removeTouchFeedback)

      return () => {
        element.removeEventListener('touchstart', addTouchFeedback)
        element.removeEventListener('touchend', removeTouchFeedback)
      }
    }
  }

  return { isTouch, addTouchClasses }
}

// Mobile-optimized components
export function MobileOptimizedCard({
  children,
  className = '',
  touchFeedback = true
}: {
  children: React.ReactNode
  className?: string
  touchFeedback?: boolean
}) {
  const { isMobile } = useMobileDetection()
  const { isTouch } = useTouchGestures()

  const baseClasses = `
    ${isMobile ? 'rounded-lg p-4 mx-2' : 'rounded-xl p-6'}
    ${touchFeedback && isTouch ? 'active:scale-[0.98] transition-transform duration-150' : ''}
    ${className}
  `

  return (
    <div className={baseClasses}>
      {children}
    </div>
  )
}

export function MobileOptimizedButton({
  children,
  onClick,
  variant = 'default',
  size = 'default',
  className = '',
  ...props
}: {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'default' | 'lg'
  className?: string
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { isMobile } = useMobileDetection()
  const { isTouch } = useTouchGestures()

  const sizeClasses = {
    sm: isMobile ? 'px-3 py-2 text-sm min-h-[44px]' : 'px-3 py-2 text-sm',
    default: isMobile ? 'px-4 py-3 min-h-[48px]' : 'px-4 py-2',
    lg: isMobile ? 'px-6 py-4 text-lg min-h-[52px]' : 'px-6 py-3 text-lg'
  }

  const baseClasses = `
    ${sizeClasses[size]}
    ${isTouch ? 'active:scale-95 transition-transform duration-150' : ''}
    ${isMobile ? 'font-medium' : ''}
    ${className}
  `

  return (
    <button
      onClick={onClick}
      className={baseClasses}
      {...props}
    >
      {children}
    </button>
  )
}

export function MobileKeyboardSpacer() {
  const [keyboardHeight, setKeyboardHeight] = useState(0)

  useEffect(() => {
    const handleResize = () => {
      if (window.visualViewport) {
        const heightDiff = window.innerHeight - window.visualViewport.height
        setKeyboardHeight(heightDiff > 150 ? heightDiff : 0)
      }
    }

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize)
      return () => window.visualViewport?.removeEventListener('resize', handleResize)
    }
  }, [])

  return keyboardHeight > 0 ? (
    <div style={{ height: keyboardHeight }} className="keyboard-spacer" />
  ) : null
}

// iOS Safari specific fixes
export function useIOSSafariFixes() {
  useEffect(() => {
    // Fix for iOS Safari address bar height changes
    const setViewHeight = () => {
      const vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    }

    setViewHeight()
    window.addEventListener('resize', setViewHeight)
    window.addEventListener('orientationchange', setViewHeight)

    return () => {
      window.removeEventListener('resize', setViewHeight)
      window.removeEventListener('orientationchange', setViewHeight)
    }
  }, [])

  useEffect(() => {
    // Prevent zoom on input focus in iOS Safari
    const preventZoom = (e: FocusEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        const viewport = document.querySelector('meta[name="viewport"]')
        if (viewport) {
          viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0')
        }
      }
    }

    const restoreZoom = () => {
      const viewport = document.querySelector('meta[name="viewport"]')
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1')
      }
    }

    document.addEventListener('focusin', preventZoom)
    document.addEventListener('focusout', restoreZoom)

    return () => {
      document.removeEventListener('focusin', preventZoom)
      document.removeEventListener('focusout', restoreZoom)
    }
  }, [])
}

// Pull-to-refresh functionality
export function usePullToRefresh(onRefresh: () => Promise<void>) {
  const [isPulling, setIsPulling] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)

  useEffect(() => {
    let startY = 0
    let isRefreshing = false

    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY === 0) {
        startY = e.touches[0].clientY
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (window.scrollY === 0 && !isRefreshing) {
        const currentY = e.touches[0].clientY
        const diff = currentY - startY

        if (diff > 0) {
          e.preventDefault()
          setPullDistance(Math.min(diff * 0.5, 80))
          setIsPulling(diff > 60)
        }
      }
    }

    const handleTouchEnd = async () => {
      if (isPulling && !isRefreshing) {
        isRefreshing = true
        try {
          await onRefresh()
        } finally {
          isRefreshing = false
          setIsPulling(false)
          setPullDistance(0)
        }
      } else {
        setIsPulling(false)
        setPullDistance(0)
      }
    }

    document.addEventListener('touchstart', handleTouchStart, { passive: false })
    document.addEventListener('touchmove', handleTouchMove, { passive: false })
    document.addEventListener('touchend', handleTouchEnd)

    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [isPulling, onRefresh])

  return { isPulling, pullDistance }
}