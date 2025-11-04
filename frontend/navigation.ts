import { createLocalizedPathnamesNavigation } from 'next-intl/navigation'
import { locales, defaultLocale } from './i18n'

export const { Link, redirect, usePathname, useRouter } = createLocalizedPathnamesNavigation({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
  pathnames: {}
})
