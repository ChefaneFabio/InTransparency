'use client'

import { motion } from 'framer-motion'
import { Eye, MessageSquare, Send, Shield, Upload, UserPlus, Briefcase, Building2 } from 'lucide-react'
import { ReactNode } from 'react'

export type ActivityType = 'view' | 'message' | 'application' | 'verification' | 'import' | 'contact' | 'job' | 'hire'

interface ActivityItem {
  id: string
  type: ActivityType
  text: string
  time: string
  avatar?: string
}

interface ActivityFeedProps {
  items: ActivityItem[]
  title: string
  emptyText?: string
  maxHeight?: number
  className?: string
}

const typeConfig: Record<ActivityType, { icon: ReactNode; bg: string; text: string }> = {
  view: { icon: <Eye className="h-3 w-3" />, bg: 'bg-blue-100 text-blue-600', text: 'text-blue-600' },
  message: { icon: <MessageSquare className="h-3 w-3" />, bg: 'bg-purple-100 text-purple-600', text: 'text-purple-600' },
  application: { icon: <Send className="h-3 w-3" />, bg: 'bg-green-100 text-green-600', text: 'text-green-600' },
  verification: { icon: <Shield className="h-3 w-3" />, bg: 'bg-emerald-100 text-emerald-600', text: 'text-emerald-600' },
  import: { icon: <Upload className="h-3 w-3" />, bg: 'bg-amber-100 text-amber-600', text: 'text-amber-600' },
  contact: { icon: <UserPlus className="h-3 w-3" />, bg: 'bg-rose-100 text-rose-600', text: 'text-rose-600' },
  job: { icon: <Briefcase className="h-3 w-3" />, bg: 'bg-indigo-100 text-indigo-600', text: 'text-indigo-600' },
  hire: { icon: <Building2 className="h-3 w-3" />, bg: 'bg-teal-100 text-teal-600', text: 'text-teal-600' },
}

export function ActivityFeed({ items, title, emptyText = 'No recent activity', maxHeight = 380, className = '' }: ActivityFeedProps) {
  return (
    <div className={className}>
      <h3 className="text-sm font-semibold text-foreground mb-3">{title}</h3>
      <div className="space-y-1 overflow-y-auto pr-1" style={{ maxHeight }}>
        {items.length > 0 ? (
          items.map((item, idx) => {
            const config = typeConfig[item.type] || typeConfig.view
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05, duration: 0.3 }}
                className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className={`p-1.5 rounded-md flex-shrink-0 mt-0.5 ${config.bg}`}>
                  {config.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-foreground leading-relaxed">{item.text}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{item.time}</p>
                </div>
              </motion.div>
            )
          })
        ) : (
          <p className="text-xs text-muted-foreground text-center py-6">{emptyText}</p>
        )}
      </div>
    </div>
  )
}
