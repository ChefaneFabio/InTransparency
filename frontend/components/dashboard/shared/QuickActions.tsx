'use client'

import Link from 'next/link'
import { LucideIcon } from 'lucide-react'

interface QuickAction {
  title: string
  description: string
  href: string
  icon: LucideIcon
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'gray'
  external?: boolean
}

interface QuickActionsProps {
  actions: QuickAction[]
  columns?: 2 | 3 | 4
}

export function QuickActions({ actions, columns = 2 }: QuickActionsProps) {
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700'
      case 'green':
        return 'bg-green-50 hover:bg-green-100 border-green-200 text-green-700'
      case 'purple':
        return 'bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-700'
      case 'orange':
        return 'bg-orange-50 hover:bg-orange-100 border-orange-200 text-orange-700'
      case 'red':
        return 'bg-red-50 hover:bg-red-100 border-red-200 text-red-700'
      default:
        return 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700'
    }
  }

  const getGridClass = (cols: number) => {
    switch (cols) {
      case 2:
        return 'grid-cols-1 sm:grid-cols-2'
      case 3:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      case 4:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
      default:
        return 'grid-cols-1 sm:grid-cols-2'
    }
  }

  const ActionCard = ({ action }: { action: QuickAction }) => {
    const content = (
      <div className={`p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer group ${getColorClasses(action.color)}`}>
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <action.icon className="h-6 w-6 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm group-hover:text-opacity-80 transition-colors">
              {action.title}
            </h3>
            <p className="text-xs opacity-80 mt-1 line-clamp-2">
              {action.description}
            </p>
          </div>
        </div>
      </div>
    )

    if (action.external) {
      return (
        <a
          href={action.href}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          {content}
        </a>
      )
    }

    return (
      <Link href={action.href} className="block">
        {content}
      </Link>
    )
  }

  return (
    <div className={`grid gap-4 ${getGridClass(columns)}`}>
      {actions.map((action, index) => (
        <ActionCard key={index} action={action} />
      ))}
    </div>
  )
}