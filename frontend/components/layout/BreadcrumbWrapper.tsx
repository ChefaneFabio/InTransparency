'use client'

import { usePathname } from 'next/navigation'
import { Breadcrumb } from '@/components/ui/breadcrumb'

export function BreadcrumbWrapper() {
  const pathname = usePathname()

  // Pages that should not show breadcrumbs
  const excludedPaths = [
    '/',  // Home page
  ]

  // Check if current path should show breadcrumbs
  const shouldShowBreadcrumbs = !excludedPaths.includes(pathname)

  if (!shouldShowBreadcrumbs) {
    return null
  }

  return (
    <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b">
      <div className="max-w-7xl mx-auto px-4 py-2">
        <Breadcrumb />
      </div>
    </div>
  )
}