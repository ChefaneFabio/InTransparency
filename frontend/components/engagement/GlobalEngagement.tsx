'use client'

import { ScrollProgress } from './ScrollProgress'
import { BackToTop } from './BackToTop'
import { CookieBanner } from './CookieBanner'
import { SocialProofToast } from './SocialProofToast'
import { usePathname } from 'next/navigation'

export function GlobalEngagement() {
  const pathname = usePathname()
  const isDashboard = pathname?.includes('/dashboard')

  return (
    <>
      <ScrollProgress />
      <BackToTop />
      <CookieBanner />
      {!isDashboard && <SocialProofToast />}
    </>
  )
}
