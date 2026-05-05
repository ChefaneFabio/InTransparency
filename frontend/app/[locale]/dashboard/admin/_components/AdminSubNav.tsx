'use client'

import { Link, usePathname } from '@/navigation'
import { Activity, Users, MousePointer2, KeyRound, UploadCloud } from 'lucide-react'

const TABS = [
  { href: '/dashboard/admin', label: 'Activity', icon: Activity },
  { href: '/dashboard/admin/users', label: 'Users', icon: Users },
  { href: '/dashboard/admin/behavior', label: 'Behavior', icon: MousePointer2 },
  { href: '/dashboard/admin/access-grants', label: 'Access Grants', icon: KeyRound },
  { href: '/dashboard/admin/imports', label: 'Imports', icon: UploadCloud },
] as const

export function AdminSubNav() {
  const pathname = usePathname()
  return (
    <div className="flex gap-1 border-b">
      {TABS.map(tab => {
        // Exact match for /dashboard/admin (Activity), prefix match for the others
        const active =
          tab.href === '/dashboard/admin'
            ? pathname === tab.href
            : pathname === tab.href || pathname.startsWith(tab.href + '/')
        const Icon = tab.icon
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              active
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon className="h-4 w-4" />
            {tab.label}
          </Link>
        )
      })}
    </div>
  )
}
