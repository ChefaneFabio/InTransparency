'use client'

import NextLink from 'next/link'
import { usePathname as useNextPathname, useRouter as useNextRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { ComponentProps, forwardRef } from 'react'

// Custom Link component that handles locale routing
export const Link = forwardRef<HTMLAnchorElement, ComponentProps<typeof NextLink>>(
  ({ href, ...props }, ref) => {
    const locale = useLocale()

    // Convert href to string if it's an object
    const hrefString = typeof href === 'string' ? href : href.pathname || '/'

    // Add locale prefix only for English (Italian is default with 'as-needed')
    const localizedHref = locale === 'en' && !hrefString.startsWith('/en') && !hrefString.startsWith('http')
      ? `/en${hrefString}`
      : hrefString

    return <NextLink ref={ref} href={localizedHref} {...props} />
  }
)

Link.displayName = 'LocalizedLink'

// Custom useRouter that wraps Next.js router with locale-aware methods
export function useRouter() {
  const router = useNextRouter()
  const locale = useLocale()

  return {
    ...router,
    push: (href: string, options?: any) => {
      const localizedHref = locale === 'en' && !href.startsWith('/en') && !href.startsWith('http')
        ? `/en${href}`
        : href
      return router.push(localizedHref, options)
    },
    replace: (href: string, options?: any) => {
      const localizedHref = locale === 'en' && !href.startsWith('/en') && !href.startsWith('http')
        ? `/en${href}`
        : href
      return router.replace(localizedHref, options)
    }
  }
}

// Custom usePathname that returns pathname without locale prefix
export function usePathname() {
  const pathname = useNextPathname()
  // Remove locale prefix if present
  return pathname.replace(/^\/(en|it)/, '') || '/'
}

// Re-export redirect (not commonly used in client components)
export { redirect } from 'next/navigation'
