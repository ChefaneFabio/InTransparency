import { createNavigation } from 'next-intl/navigation'
import { locales, defaultLocale } from './i18n'

// Create locale-aware navigation components for next-intl v4
export const { Link, redirect, usePathname, useRouter } = createNavigation({
  locales,
  defaultLocale,
  localePrefix: 'always'
})
