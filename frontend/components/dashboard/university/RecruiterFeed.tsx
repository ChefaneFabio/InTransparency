'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Activity, Eye, MessageSquare, UserCheck, Briefcase } from 'lucide-react'

interface FeedItem {
  type: string
  studentName: string
  company: string
  action: string
  timestamp: string
}

interface RecruiterFeedProps {
  feed: FeedItem[]
}

const ACTION_CONFIG: Record<string, { icon: typeof Eye; color: string; bg: string }> = {
  view: { icon: Eye, color: 'text-primary', bg: 'bg-primary/10' },
  contacted: { icon: MessageSquare, color: 'text-primary', bg: 'bg-primary/10' },
  interviewed: { icon: UserCheck, color: 'text-amber-600', bg: 'bg-amber-100' },
  hired: { icon: Briefcase, color: 'text-primary', bg: 'bg-primary/10' },
}

function formatRelativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString()
}

export default function RecruiterFeed({ feed }: RecruiterFeedProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-orange-500" />
          Recruiter Activity Feed
        </CardTitle>
      </CardHeader>
      <CardContent>
        {feed.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">No activity yet</p>
        ) : (
          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {feed.map((item, i) => {
              const config = ACTION_CONFIG[item.type] || ACTION_CONFIG.view
              const Icon = config.icon
              return (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className={`p-2 rounded-full ${config.bg}`}>
                    <Icon className={`h-4 w-4 ${config.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className="font-medium">{item.company}</span>
                      {' '}{item.action}{' '}
                      <span className="font-medium">{item.studentName}</span>
                    </p>
                    <p className="text-xs text-gray-500">{formatRelativeTime(item.timestamp)}</p>
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-xs shrink-0 ${
                      item.type === 'hired' ? 'border-primary/20 text-primary' :
                      item.type === 'interviewed' ? 'border-amber-200 text-amber-600' :
                      item.type === 'contacted' ? 'border-primary/20 text-primary' :
                      'border-primary/20 text-primary'
                    }`}
                  >
                    {item.type}
                  </Badge>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
