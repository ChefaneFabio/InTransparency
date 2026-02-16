'use client'

import { type LucideIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from '@/navigation'
import { Button } from '@/components/ui/button'

interface EmptyStateAction {
  label: string
  href?: string
  onClick?: () => void
  variant?: 'default' | 'outline'
}

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: EmptyStateAction
  className?: string
}

export function EmptyState({ icon: Icon, title, description, action, className = '' }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`py-12 text-center ${className}`}
    >
      <div className="mx-auto w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
        <Icon className="h-7 w-7 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mx-auto">{description}</p>
      {action && (
        <div className="mt-4">
          {action.href ? (
            <Button variant={action.variant || 'default'} asChild>
              <Link href={action.href}>{action.label}</Link>
            </Button>
          ) : action.onClick ? (
            <Button variant={action.variant || 'outline'} onClick={action.onClick}>
              {action.label}
            </Button>
          ) : null}
        </div>
      )}
    </motion.div>
  )
}
