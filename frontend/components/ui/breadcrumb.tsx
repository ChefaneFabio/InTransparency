'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BreadcrumbItem {
  label: string
  href?: string
  icon?: React.ReactNode
}

interface BreadcrumbProps {
  className?: string
  customItems?: BreadcrumbItem[]
  separator?: React.ReactNode
}

const routeConfig: Record<string, string> = {
  // Dashboard routes
  'dashboard': 'Dashboard',
  'student': 'Student',
  'recruiter': 'Recruiter',
  'university': 'University',
  'admin': 'Admin',

  // Student dashboard sections
  'profile': 'Profile',
  'edit': 'Edit',
  'projects': 'Projects',
  'new': 'New',
  'jobs': 'Jobs',
  'applications': 'Applications',
  'messages': 'Messages',
  'analytics': 'Analytics',
  'courses': 'Courses',

  // Recruiter dashboard sections
  'candidates': 'Candidates',
  'post-job': 'Post Job',
  'students': 'Students',
  'search': 'Search',

  // Auth routes
  'auth': 'Authentication',
  'login': 'Sign In',
  'register': 'Register',
  'forgot-password': 'Forgot Password',
  'role-selection': 'Select Role',

  // Company routes
  'companies': 'Companies',
  'create': 'Create',

  // Other routes
  'cv-samples': 'CV Samples',
  'pricing': 'Pricing',
  'about': 'About',
  'legal': 'Legal',
  'terms': 'Terms of Service',
  'privacy': 'Privacy Policy',
  'survey': 'Survey',
  'company': 'Company',
  'thank-you': 'Thank You',
  'validation': 'Validation',
  'mvp': 'MVP',
  'demo': 'Demo',
  'targeting-examples': 'Targeting Examples',
  'progression-demo': 'Progression Demo',
  'linkedin-integration': 'LinkedIn Integration',
  'opportunities': 'Opportunities',
  'send-surveys': 'Send Surveys',
  'survey-results': 'Survey Results'
}

export function Breadcrumb({ className, customItems, separator = <ChevronRight className="h-4 w-4" /> }: BreadcrumbProps) {
  const pathname = usePathname()

  // If custom items are provided, use them instead of auto-generation
  if (customItems && customItems.length > 0) {
    return (
      <nav aria-label="Breadcrumb" className={cn("flex items-center space-x-2 text-sm text-gray-600", className)}>
        {customItems.map((item, index) => (
          <div key={index} className="flex items-center">
            {index > 0 && <span className="mx-2 text-gray-400">{separator}</span>}
            {item.href ? (
              <Link
                href={item.href}
                className="flex items-center hover:text-blue-600 transition-colors"
              >
                {item.icon && <span className="mr-1">{item.icon}</span>}
                {item.label}
              </Link>
            ) : (
              <span className="flex items-center text-gray-900 font-medium">
                {item.icon && <span className="mr-1">{item.icon}</span>}
                {item.label}
              </span>
            )}
          </div>
        ))}
      </nav>
    )
  }

  // Auto-generate breadcrumbs from pathname
  const pathSegments = pathname.split('/').filter(segment => segment !== '')

  // Don't show breadcrumbs on home page or if there are no segments
  if (pathSegments.length === 0) {
    return <div className="h-6"></div> // Maintain consistent spacing
  }

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Home', href: '/', icon: <Home className="h-4 w-4" /> }
  ]

  let currentPath = ''
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`
    const isLast = index === pathSegments.length - 1

    // Handle dynamic routes (e.g., [id])
    let label = routeConfig[segment] || segment

    // Check if it's a dynamic route parameter
    if (segment.match(/^[a-f0-9-]+$/i) && segment.length > 20) {
      // Likely a UUID or ID - show shortened version
      label = `ID: ${segment.substring(0, 8)}...`
    } else if (!routeConfig[segment]) {
      // Capitalize first letter if no config found
      label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')
    }

    breadcrumbItems.push({
      label,
      href: isLast ? undefined : currentPath
    })
  })

  // Mobile: show only first and last 2 items if more than 3 items
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640
  const displayItems = isMobile && breadcrumbItems.length > 3
    ? [
        breadcrumbItems[0],
        { label: '...', href: undefined },
        ...breadcrumbItems.slice(-2)
      ]
    : breadcrumbItems

  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center space-x-1 text-sm text-gray-600 overflow-x-auto", className)}>
      {displayItems.map((item, index) => (
        <div key={index} className="flex items-center whitespace-nowrap">
          {index > 0 && <span className="mx-2 text-gray-400">{separator}</span>}
          {item.href ? (
            <Link
              href={item.href}
              className="flex items-center hover:text-blue-600 transition-colors"
            >
              {item.icon && <span className="mr-1">{item.icon}</span>}
              {item.label}
            </Link>
          ) : (
            <span className="flex items-center text-gray-900 font-medium">
              {item.icon && <span className="mr-1">{item.icon}</span>}
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  )
}