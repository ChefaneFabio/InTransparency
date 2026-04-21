'use client'

import { Link, useRouter } from '@/navigation'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Menu, X, User } from 'lucide-react'
import { Logo } from '@/components/layout/Logo'
import { useSession, signOut } from 'next-auth/react'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { useTranslations } from 'next-intl'
import { useSegment, type Segment } from '@/lib/segment-context'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { segment: activeSegment, setSegment: setActiveSegment } = useSegment()
  const router = useRouter()
  const pathname = usePathname()
  const { data: session } = useSession()
  const isAuthenticated = !!session?.user
  const t = useTranslations('nav')

  const logout = () => signOut({ callbackUrl: '/' })

  const segments: { id: Segment; label: string }[] = [
    { id: 'students', label: t('forStudents') },
    { id: 'institutions', label: t('forInstitutions') },
    { id: 'companies', label: t('forCompanies') },
  ]

  // Navigation links change based on active segment
  const navigationBySegment: Record<Segment, { name: string; href: string }[]> = {
    students: [
      { name: t('forUniversityStudents'), href: '/for-university-students' },
      { name: t('forItsStudents'), href: '/for-its-students' },
      { name: t('forHighSchoolStudents'), href: '/for-high-school-students' },
      { name: t('explorePortfolios'), href: '/explore' },
      { name: t('pricing'), href: '/pricing' },
      { name: t('contact'), href: '/contact' },
    ],
    institutions: [
      { name: t('forUniversities'), href: '/for-universities' },
      { name: t('forITS'), href: '/for-its-institutes' },
      { name: t('forHighSchools'), href: '/for-high-schools' },
      { name: t('pricing'), href: '/pricing' },
      { name: t('contact'), href: '/contact' },
    ],
    companies: [
      { name: t('forStartups'), href: '/for-startups' },
      { name: t('forSme'), href: '/for-sme' },
      { name: t('forEnterprise'), href: '/for-enterprise' },
      { name: t('forAgencies'), href: '/for-agencies' },
      { name: t('searchTalent'), href: '/explore' },
      { name: t('pricing'), href: '/pricing' },
    ],
  }

  const navigation = navigationBySegment[activeSegment]

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:rounded"
      >
        {t('skipToMain')}
      </a>
      {/* Secondary segment bar */}
      <div className="bg-foreground/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-8">
            <div className="flex items-center gap-1">
              {segments.map((seg) => {
                const isActive = activeSegment === seg.id
                return (
                  <button
                    key={seg.id}
                    onClick={() => {
                      setActiveSegment(seg.id)
                      // Navigate to the segment's landing page when switching segments
                      const segmentPages: Record<string, string> = {
                        students: '/for-students',
                        institutions: '/for-universities',
                        companies: '/for-companies',
                      }
                      // Navigate away from any segment-specific page (landing, auth, student sub-pages, etc.)
                      const isOnSegmentPage = pathname && (
                        pathname.includes('/for-') ||
                        pathname.includes('/auth/register') ||
                        pathname.includes('/students/') ||
                        pathname.includes('/per-')
                      )
                      if (isOnSegmentPage) {
                        router.push(segmentPages[seg.id])
                      }
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'text-white/50 hover:text-white/80'
                    }`}
                  >
                    <span className="hidden sm:inline">{seg.label}</span>
                  </button>
                )
              })}
            </div>
            <div className="flex items-center gap-3 text-xs text-white/50">
              <Link href="/about" className="hover:text-white/80 transition-colors hidden sm:inline">
                {t('about')}
              </Link>
              <Link href={'/eu-compliance' as any} className="hover:text-white/80 transition-colors hidden md:inline">
                Compliance
              </Link>
              <Link href={'/integrations/agents' as any} className="hover:text-white/80 transition-colors hidden md:inline">
                Agents
              </Link>
              <Link href={'/glossary' as any} className="hover:text-white/80 transition-colors hidden lg:inline">
                Glossary
              </Link>
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </div>

      {/* Primary nav */}
      <nav
        className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-1.5 bg-background/80 backdrop-blur-md border-b border-border/50"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Logo size="md" />
        </div>

        {/* Mobile hamburger */}
        <div className="flex lg:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={mobileMenuOpen}
          >
            <Menu className="h-6 w-6" aria-hidden="true" />
          </Button>
        </div>

        {/* Desktop nav links */}
        <div className="hidden lg:flex lg:gap-x-5">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium leading-6 text-foreground/70 hover:text-foreground transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Desktop auth buttons */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-3 lg:items-center">
          {isAuthenticated ? (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard">
                  <User className="mr-2 h-4 w-4" />
                  {t('dashboard')}
                </Link>
              </Button>
              <Button variant="outline" size="sm" onClick={logout}>
                {t('signOut')}
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/auth/login">{t('signIn')}</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/auth/register">{t('getStarted')}</Link>
              </Button>
            </>
          )}
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden">
          <div className="fixed inset-0 z-50" />
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-background px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-border">
            <div className="flex items-center justify-between">
              <Logo size="sm" />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-6 w-6" aria-hidden="true" />
              </Button>
            </div>

            {/* Mobile segment selector */}
            <div className="mt-4 flex gap-2 border-b border-border pb-4">
              {segments.map((seg) => {
                const isActive = activeSegment === seg.id
                return (
                  <button
                    key={seg.id}
                    onClick={() => {
                      setActiveSegment(seg.id)
                      const segmentPages: Record<string, string> = {
                        students: '/for-students',
                        institutions: '/for-universities',
                        companies: '/for-companies',
                      }
                      const isOnSegmentPage = pathname && (
                        pathname.includes('/for-') ||
                        pathname.includes('/auth/register') ||
                        pathname.includes('/students/') ||
                        pathname.includes('/per-')
                      )
                      if (isOnSegmentPage) {
                        setMobileMenuOpen(false)
                        router.push(segmentPages[seg.id])
                      }
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground bg-muted'
                    }`}
                  >
                    {seg.label}
                  </button>
                )
              })}
            </div>

            <div className="mt-4 flow-root">
              <div className="-my-6 divide-y divide-border">
                <div className="space-y-1 py-6">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-medium leading-7 text-foreground hover:bg-muted"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                  {/* Always show About in mobile */}
                  <Link
                    href="/about"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-medium leading-7 text-muted-foreground hover:bg-muted"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('mission')}
                  </Link>
                </div>

                <div className="py-6">
                  {isAuthenticated ? (
                    <div className="space-y-2">
                      <Link
                        href="/dashboard"
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-foreground hover:bg-muted"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {t('dashboard')}
                      </Link>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          logout()
                          setMobileMenuOpen(false)
                        }}
                      >
                        {t('signOut')}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Link
                        href="/auth/login"
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-foreground hover:bg-muted"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {t('signIn')}
                      </Link>
                      <Button className="w-full" asChild>
                        <Link href="/auth/register" onClick={() => setMobileMenuOpen(false)}>
                          {t('getStarted')}
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
