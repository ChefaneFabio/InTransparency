'use client'

import { Link } from '@/navigation'
import Image from 'next/image'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Menu, X, User, GraduationCap, Building2, Briefcase } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { useTranslations } from 'next-intl'
import { useSegment, type Segment } from '@/lib/segment-context'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { segment: activeSegment, setSegment: setActiveSegment } = useSegment()
  const { data: session } = useSession()
  const isAuthenticated = !!session?.user
  const t = useTranslations('nav')

  const logout = () => signOut({ callbackUrl: '/' })

  const segments: { id: Segment; label: string; icon: typeof GraduationCap }[] = [
    { id: 'students', label: t('forStudents'), icon: GraduationCap },
    { id: 'institutions', label: t('forInstitutions'), icon: Building2 },
    { id: 'companies', label: t('forCompanies'), icon: Briefcase },
  ]

  // Navigation links change based on active segment
  const navigationBySegment: Record<Segment, { name: string; href: string }[]> = {
    students: [
      { name: t('howItWorks'), href: '/for-students' },
      { name: t('highSchoolStudents'), href: '/students/high-school' },
      { name: t('itsStudents'), href: '/students/its' },
      { name: t('universityStudents'), href: '/students/university' },
      { name: t('explorePortfolios'), href: '/explore' },
      { name: t('aiJobSearch'), href: '/demo/ai-search' },
      { name: t('contact'), href: '/contact' },
    ],
    institutions: [
      { name: t('howItWorks'), href: '/for-academic-partners' },
      { name: t('forHighSchools'), href: '/per-scuole-superiori' },
      { name: t('forITS'), href: '/for-its-institutes' },
      { name: t('forUniversities'), href: '/per-universita' },
      { name: t('pricing'), href: '/pricing' },
      { name: t('contact'), href: '/contact' },
    ],
    companies: [
      { name: t('howItWorks'), href: '/for-companies' },
      { name: t('searchTalent'), href: '/explore' },
      { name: t('aiJobSearch'), href: '/demo/ai-search' },
      { name: t('pricing'), href: '/pricing' },
      { name: t('contact'), href: '/contact' },
    ],
  }

  const navigation = navigationBySegment[activeSegment]

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      {/* Secondary segment bar */}
      <div className="bg-foreground/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-8">
            <div className="flex items-center gap-1">
              {segments.map((seg) => {
                const Icon = seg.icon
                const isActive = activeSegment === seg.id
                return (
                  <button
                    key={seg.id}
                    onClick={() => setActiveSegment(seg.id)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'text-white/50 hover:text-white/80'
                    }`}
                  >
                    <Icon className="h-3 w-3" />
                    <span className="hidden sm:inline">{seg.label}</span>
                  </button>
                )
              })}
            </div>
            <div className="flex items-center gap-3 text-xs text-white/50">
              <Link href="/mission" className="hover:text-white/80 transition-colors hidden sm:inline">
                {t('mission')}
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
          <Link href="/" className="-m-1.5 p-1.5 flex items-center">
            <Image
              src="/images/banner.jpg"
              alt="InTransparency"
              width={351}
              height={120}
              className="h-[36px] w-auto"
              priority
            />
          </Link>
        </div>

        {/* Mobile hamburger */}
        <div className="flex lg:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileMenuOpen(true)}
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
              <Link href="/" className="-m-1.5 p-1.5">
                <Image
                  src="/images/banner.jpg"
                  alt="InTransparency"
                  width={351}
                  height={120}
                  className="h-10 w-auto"
                />
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="h-6 w-6" aria-hidden="true" />
              </Button>
            </div>

            {/* Mobile segment selector */}
            <div className="mt-4 flex gap-2 border-b border-border pb-4">
              {segments.map((seg) => {
                const Icon = seg.icon
                const isActive = activeSegment === seg.id
                return (
                  <button
                    key={seg.id}
                    onClick={() => setActiveSegment(seg.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground bg-muted'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
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
                  {/* Always show Mission in mobile */}
                  <Link
                    href="/mission"
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
