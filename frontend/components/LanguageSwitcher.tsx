'use client'

import { useLocale, useTranslations } from 'next-intl'
import { usePathname, useRouter } from '@/navigation'
import { Button } from '@/components/ui/button'
import { Globe } from 'lucide-react'

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const switchLanguage = (newLocale: 'it' | 'en') => {
    router.replace(pathname, { locale: newLocale })
  }

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-gray-600" />
      <Button
        variant={locale === 'it' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => switchLanguage('it')}
        className="h-8 px-3"
      >
        IT
      </Button>
      <Button
        variant={locale === 'en' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => switchLanguage('en')}
        className="h-8 px-3"
      >
        EN
      </Button>
    </div>
  )
}
