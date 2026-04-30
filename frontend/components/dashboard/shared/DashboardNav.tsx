'use client'

import { useState } from 'react'
import { signOut } from 'next-auth/react'
import { Link, usePathname } from '@/navigation'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { Menu, X, ChevronDown, ChevronRight, Home, LogOut } from 'lucide-react'
import { dashboardNavConfig, getUniversityNavForType, type DashboardRole, type NavGroup } from '@/lib/dashboard-nav-config'
import NotificationBell from '@/components/notifications/NotificationBell'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import HelpButton from '@/components/help/HelpButton'

const ROLE_TO_HELP_SEGMENT: Record<DashboardRole, 'student' | 'recruiter' | 'institution' | null> = {
  student: 'student',
  recruiter: 'recruiter',
  university: 'institution',
  institution: 'institution',
  professor: null,
  techpark: null,
} as any

interface DashboardNavProps {
  role: DashboardRole
  institutionType?: string
}

export function DashboardNav({ role, institutionType }: DashboardNavProps) {
  const pathname = usePathname()
  const t = useTranslations('dashboardNav')
  const tNav = useTranslations('nav')
  const config = (role === 'university' || role === 'institution') && institutionType
    ? getUniversityNavForType(institutionType)
    : dashboardNavConfig[role]
  const [mobileOpen, setMobileOpen] = useState(false)
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null)

  const homeHref = `/dashboard/${role}`

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  const isGroupActive = (group: NavGroup) =>
    group.items.some((item) => isActive(item.href))

  return (
    <>
    <nav className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-7xl mx-auto px-4">
        {/* Desktop nav — xl so university/ITS (5+ groups) never overflow when tab is halved */}
        <div className="hidden xl:flex items-center h-14 gap-1">
          <Link
            href={homeHref}
            className={`relative flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md transition-all ${
              pathname === homeHref
                ? 'text-primary after:absolute after:bottom-[-13px] after:left-2 after:right-2 after:h-0.5 after:bg-primary after:rounded-t'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <Home className="h-4 w-4" />
            {t('home')}
          </Link>

          {config.groups.map((group) => {
            // Single-item group: render as direct link
            if (group.items.length === 1) {
              const item = group.items[0]
              const active = isActive(item.href)
              return (
                <Link
                  key={group.labelKey}
                  href={item.href}
                  className={`relative px-3 py-2 text-sm font-medium rounded-md transition-all ${
                    active
                      ? 'text-primary after:absolute after:bottom-[-13px] after:left-2 after:right-2 after:h-0.5 after:bg-primary after:rounded-t'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  {t(`${role}.${group.labelKey}`)}
                </Link>
              )
            }

            // Multi-item group: render as dropdown
            const groupActive = isGroupActive(group)
            return (
              <DropdownMenu key={group.labelKey}>
                <DropdownMenuTrigger asChild>
                  <button
                    className={`relative flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-all ${
                      groupActive
                        ? 'text-primary after:absolute after:bottom-[-13px] after:left-2 after:right-2 after:h-0.5 after:bg-primary after:rounded-t'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    {t(`${role}.${group.labelKey}`)}
                    <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-60">
                  {group.items.map((item) => {
                    const active = isActive(item.href)
                    return (
                      <DropdownMenuItem key={item.href} asChild>
                        <Link
                          href={item.href}
                          className={`relative pl-4 ${
                            active
                              ? 'bg-primary/5 font-medium text-primary before:absolute before:left-0 before:top-1 before:bottom-1 before:w-0.5 before:bg-primary before:rounded-r'
                              : ''
                          }`}
                        >
                          {t(`${role}.items.${item.labelKey}`)}
                        </Link>
                      </DropdownMenuItem>
                    )
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            )
          })}

          <div className="ml-auto flex items-center gap-1.5">
            {ROLE_TO_HELP_SEGMENT[role] && (
              <HelpButton segment={ROLE_TO_HELP_SEGMENT[role]!} />
            )}
            <LanguageSwitcher />
            <NotificationBell />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut({ callbackUrl: '/' })}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4 mr-1.5" />
              {tNav('signOut')}
            </Button>
          </div>
        </div>

        {/* Mobile nav bar */}
        <div className="flex xl:hidden items-center justify-between h-14">
          <Link
            href={homeHref}
            className="flex items-center gap-1.5 text-sm font-medium"
          >
            <Home className="h-4 w-4" />
            {t('home')}
          </Link>
          <div className="flex items-center gap-1">
            <NotificationBell />
            <button
              type="button"
              onClick={() => setMobileOpen(o => !o)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
              className="p-2 rounded-md hover:bg-muted"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
    </nav>

      {/* Mobile overlay — rendered outside <nav> to escape its backdrop-blur stacking context */}
      {mobileOpen && (
        <div className="xl:hidden fixed inset-0 top-14 z-[60] bg-background overflow-y-auto">
          <div className="container max-w-7xl mx-auto px-4 py-4 space-y-2">
            {config.groups.map((group) => {
              const isExpanded = expandedGroup === group.labelKey

              // Single-item group
              if (group.items.length === 1) {
                const item = group.items[0]
                return (
                  <Link
                    key={group.labelKey}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? 'bg-primary/10 text-primary'
                        : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    {t(`${role}.${group.labelKey}`)}
                  </Link>
                )
              }

              // Multi-item group: collapsible
              const groupActive = isGroupActive(group)
              return (
                <div key={group.labelKey}>
                  <button
                    onClick={() =>
                      setExpandedGroup(isExpanded ? null : group.labelKey)
                    }
                    className={`flex items-center justify-between w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      groupActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {groupActive && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                      {t(`${role}.${group.labelKey}`)}
                    </span>
                    <ChevronRight
                      className={`h-4 w-4 transition-transform ${
                        isExpanded ? 'rotate-90' : ''
                      }`}
                    />
                  </button>
                  {isExpanded && (
                    <div className="ml-4 mt-1 space-y-1 border-l pl-3">
                      {group.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className={`block px-3 py-2.5 rounded-lg text-sm transition-colors ${
                            isActive(item.href)
                              ? 'bg-primary/10 text-primary font-medium'
                              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                          }`}
                        >
                          {t(`${role}.items.${item.labelKey}`)}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}

            <div className="pt-4 border-t space-y-2">
              <div className="px-4 py-2">
                <LanguageSwitcher />
              </div>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground w-full rounded-lg hover:bg-muted transition-colors"
              >
                <LogOut className="h-4 w-4" />
                {tNav('signOut')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
