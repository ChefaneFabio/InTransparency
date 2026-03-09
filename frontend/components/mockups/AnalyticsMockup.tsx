'use client'

import { Badge } from '@/components/ui/badge'
import {
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  ArrowUpRight,
} from 'lucide-react'

export function AnalyticsMockup() {
  return (
    <div className="bg-card rounded-xl border border-border shadow-2xl overflow-hidden">
      {/* Browser chrome */}
      <div className="bg-muted/80 px-4 py-2.5 flex items-center gap-2 border-b border-border">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 bg-background/60 rounded-md px-3 py-1 text-xs text-muted-foreground ml-2">
          intransparency.it/dashboard/analytics
        </div>
      </div>

      <div className="p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">Analytics Overview</span>
          </div>
          <Badge variant="outline" className="text-[9px]">Last 7 days</Badge>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { label: 'Views', value: '1.2K', change: '+18%', icon: Eye },
            { label: 'Contacts', value: '23', change: '+42%', icon: Users },
            { label: 'Growth', value: '89%', change: '+5%', icon: TrendingUp },
          ].map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="bg-muted/30 rounded-lg p-2.5 border border-border/50">
                <Icon className="h-3 w-3 text-primary mb-1" />
                <div className="text-sm font-bold text-foreground">{stat.value}</div>
                <div className="flex items-center gap-0.5">
                  <span className="text-[9px] text-muted-foreground">{stat.label}</span>
                  <span className="text-[9px] text-primary font-medium flex items-center">
                    <ArrowUpRight className="h-2 w-2" />
                    {stat.change}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Mini chart */}
        <div className="bg-muted/20 rounded-lg p-3 mb-3 border border-border/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-foreground">Profile Views</span>
            <span className="text-[10px] text-primary font-medium flex items-center gap-0.5">
              <ArrowUpRight className="h-2.5 w-2.5" />
              +18% vs last week
            </span>
          </div>
          <div className="flex items-end gap-1 h-16">
            {[4, 6, 3, 8, 5, 9, 7, 11, 8, 14, 10, 16, 12, 15].map((h, i) => (
              <div
                key={i}
                className="flex-1 bg-primary/25 rounded-t hover:bg-primary/50 transition-colors"
                style={{ height: `${(h / 16) * 100}%` }}
              />
            ))}
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[8px] text-muted-foreground">Mon</span>
            <span className="text-[8px] text-muted-foreground">Sun</span>
          </div>
        </div>

        {/* Top skills viewed */}
        <div>
          <span className="text-xs font-semibold text-foreground">Most Searched Skills</span>
          <div className="mt-2 space-y-1.5">
            {[
              { skill: 'React', pct: 92 },
              { skill: 'TypeScript', pct: 78 },
              { skill: 'Node.js', pct: 65 },
            ].map((item) => (
              <div key={item.skill} className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground w-16">{item.skill}</span>
                <div className="flex-1 bg-muted rounded-full h-1.5">
                  <div className="bg-primary/40 h-1.5 rounded-full" style={{ width: `${item.pct}%` }} />
                </div>
                <span className="text-[10px] font-medium text-foreground w-7 text-right">{item.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
