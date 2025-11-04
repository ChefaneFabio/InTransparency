import { createSharedPathnamesNavigation } from 'next-intl/navigation'
import { locales } from './i18n'

// Create locale-aware navigation components
export const { Link, redirect, usePathname, useRouter } = createSharedPathnamesNavigation({ locales })
