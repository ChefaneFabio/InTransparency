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
import { dashboardNavConfig, type DashboardRole, type NavGroup } from '@/lib/dashboard-nav-config'
import NotificationBell from '@/components/notifications/NotificationBell'

interface DashboardNavProps {
  role: DashboardRole
}

export function DashboardNav({ role }: DashboardNavProps) {
  const pathname = usePathname()
  const t = useTranslations('dashboardNav')
  const tNav = useTranslations('nav')
  const config = dashboardNavConfig[role]
  const [mobileOpen, setMobileOpen] = useState(false)
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null)

  const homeHref = `/dashboard/${role}`

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  const isGroupActive = (group: NavGroup) =>
    group.items.some((item) => isActive(item.href))

  return (
    <nav className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-7xl mx-auto px-4">
        {/* Desktop nav */}
        <div className="hidden lg:flex items-center h-14 gap-1">
          <Link
            href={homeHref}
            className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              pathname === homeHref
                ? 'bg-primary/10 text-primary'
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
              return (
                <Link
                  key={group.labelKey}
                  href={item.href}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive(item.href)
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  {t(`${role}.${group.labelKey}`)}
                </Link>
              )
            }

            // Multi-item group: render as dropdown
            return (
              <DropdownMenu key={group.labelKey}>
                <DropdownMenuTrigger asChild>
                  <button
                    className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isGroupActive(group)
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    {t(`${role}.${group.labelKey}`)}
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  {group.items.map((item) => (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link
                        href={item.href}
                        className={
                          isActive(item.href) ? 'bg-accent font-medium' : ''
                        }
                      >
                        {t(`${role}.items.${item.labelKey}`)}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )
          })}

          <div className="ml-auto flex items-center gap-2">
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
        <div className="flex lg:hidden items-center justify-between h-14">
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
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-md hover:bg-muted"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 top-14 z-50 bg-background overflow-y-auto">
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
              return (
                <div key={group.labelKey}>
                  <button
                    onClick={() =>
                      setExpandedGroup(isExpanded ? null : group.labelKey)
                    }
                    className={`flex items-center justify-between w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isGroupActive(group)
                        ? 'bg-primary/10 text-primary'
                        : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    {t(`${role}.${group.labelKey}`)}
                    <ChevronRight
                      className={`h-4 w-4 transition-transform ${
                        isExpanded ? 'rotate-90' : ''
                      }`}
                    />
                  </button>
                  {isExpanded && (
                    <div className="ml-4 mt-1 space-y-1">
                      {group.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className={`block px-4 py-2.5 rounded-lg text-sm transition-colors ${
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

            <div className="pt-4 border-t">
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
    </nav>
  )
}
