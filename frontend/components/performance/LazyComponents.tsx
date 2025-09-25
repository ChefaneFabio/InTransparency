'use client'

import { Suspense, lazy, useState, useEffect, useRef, ReactNode } from 'react'
import { Loader2 } from 'lucide-react'

// Loading component
const LoadingSpinner = ({ message = 'Loading...' }: { message?: string }) => (
  <div className="flex items-center justify-center py-8">
    <div className="text-center">
      <Loader2 className="h-8 w-8 animate-spin mx-auto text-teal-600 mb-2" />
      <p className="text-gray-600 text-sm">{message}</p>
    </div>
  </div>
)

// Intersection Observer hook for lazy loading
export function useIntersectionObserver(
  targetRef: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsIntersecting(true)
        observer.disconnect()
      }
    }, {
      threshold: 0.1,
      ...options
    })

    const target = targetRef.current
    if (target) {
      observer.observe(target)
    }

    return () => {
      observer.disconnect()
    }
  }, [targetRef, options])

  return isIntersecting
}

// Component for lazy loading when in viewport
export function LazySection({
  children,
  fallback,
  rootMargin = '50px'
}: {
  children: ReactNode
  fallback?: ReactNode
  rootMargin?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isVisible = useIntersectionObserver(ref, { rootMargin })

  return (
    <div ref={ref}>
      {isVisible ? children : (fallback || <LoadingSpinner />)}
    </div>
  )
}

// Image lazy loading component
export function LazyImage({
  src,
  alt,
  className = '',
  width,
  height,
  placeholder = 'blur'
}: {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
  placeholder?: 'blur' | 'empty'
}) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)
  const isVisible = useIntersectionObserver(imgRef, { rootMargin: '50px' })

  const handleLoad = () => setIsLoaded(true)
  const handleError = () => setHasError(true)

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
      {hasError ? (
        <div className="flex items-center justify-center bg-gray-100 text-gray-400 h-full">
          <span className="text-sm">Failed to load image</span>
        </div>
      ) : (
        <>
          {/* Placeholder */}
          {!isLoaded && placeholder === 'blur' && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          )}

          {/* Actual image - only load when visible */}
          {isVisible && (
            <img
              src={src}
              alt={alt}
              width={width}
              height={height}
              onLoad={handleLoad}
              onError={handleError}
              className={`${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 w-full h-full object-cover`}
            />
          )}
        </>
      )}
    </div>
  )
}

// Code splitting utilities
export const LazyDashboard = lazy(() => import('@/app/dashboard/student/page'))
export const LazyProjectForm = lazy(() => import('@/components/forms/project/ProjectForm'))
export const LazyAdvancedSearch = lazy(() => import('@/components/search/AdvancedSearch'))
export const LazyMessageCenter = lazy(() => import('@/components/messaging/MessageCenter'))

// Performance monitoring component
export function PerformanceMonitor() {
  useEffect(() => {
    // Monitor Core Web Vitals
    if (typeof window !== 'undefined' && 'performance' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          // Log performance metrics
          console.log(`${entry.name}: ${entry.startTime}ms`)

          // Send to analytics if needed
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming
            console.log({
              loadComplete: navEntry.loadEventEnd - navEntry.loadEventStart,
              domContentLoaded: navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart,
              totalLoadTime: navEntry.loadEventEnd - navEntry.navigationStart
            })
          }
        }
      })

      observer.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint'] })

      return () => observer.disconnect()
    }
  }, [])

  return null
}

// Bundle analyzer component for development
export function BundleAnalyzer() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // Analyze bundle size and report large components
      const analyzeBundle = () => {
        const scripts = Array.from(document.querySelectorAll('script'))
        const totalSize = scripts.reduce((sum, script) => {
          if (script.src && script.src.includes('/_next/')) {
            // This would need to be implemented with actual bundle analysis
            return sum + (script.innerHTML?.length || 0)
          }
          return sum
        }, 0)

        console.log(`Total bundle size: ${(totalSize / 1024).toFixed(2)}KB`)
      }

      setTimeout(analyzeBundle, 1000)
    }
  }, [])

  return null
}

// Memory usage monitor
export function useMemoryMonitor() {
  const [memoryUsage, setMemoryUsage] = useState<number | null>(null)

  useEffect(() => {
    const checkMemory = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory
        setMemoryUsage(memory.usedJSHeapSize / 1024 / 1024) // MB
      }
    }

    const interval = setInterval(checkMemory, 5000)
    checkMemory()

    return () => clearInterval(interval)
  }, [])

  return memoryUsage
}

// Preload critical resources
export function ResourcePreloader() {
  useEffect(() => {
    // Preload critical images and fonts
    const criticalResources = [
      '/icons/icon-192x192.png',
      '/icons/icon-512x512.png'
    ]

    criticalResources.forEach(resource => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = resource.endsWith('.png') ? 'image' : 'font'
      link.href = resource
      document.head.appendChild(link)
    })
  }, [])

  return null
}

// Suspense wrapper with error boundary
export function SuspenseWrapper({
  children,
  fallback,
  errorMessage = 'Something went wrong loading this component.'
}: {
  children: ReactNode
  fallback?: ReactNode
  errorMessage?: string
}) {
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const handleError = () => setHasError(true)
    window.addEventListener('error', handleError)
    return () => window.removeEventListener('error', handleError)
  }, [])

  if (hasError) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <p className="text-red-600 mb-2">{errorMessage}</p>
          <button
            onClick={() => {
              setHasError(false)
              window.location.reload()
            }}
            className="text-sm text-teal-600 hover:text-teal-700 underline"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  return (
    <Suspense fallback={fallback || <LoadingSpinner />}>
      {children}
    </Suspense>
  )
}