'use client'

import { Badge } from '@/components/ui/badge'
import {
  Bell,
  Briefcase,
  CheckCircle,
  MessageSquare,
  Star,
  Shield,
} from 'lucide-react'

export function MobileAppMockup() {
  return (
    <div className="mx-auto" style={{ maxWidth: '220px' }}>
      {/* Phone frame */}
      <div className="bg-card rounded-[2rem] border-2 border-border shadow-2xl overflow-hidden">
        {/* Notch */}
        <div className="bg-foreground/5 px-6 pt-2 pb-1 flex justify-center">
          <div className="w-20 h-4 rounded-full bg-muted" />
        </div>

        {/* Status bar */}
        <div className="px-4 py-1.5 flex items-center justify-between">
          <span className="text-[9px] font-medium text-muted-foreground">9:41</span>
          <div className="flex gap-1">
            <div className="w-3 h-2 rounded-sm bg-muted-foreground/30" />
            <div className="w-3 h-2 rounded-sm bg-muted-foreground/30" />
            <div className="w-5 h-2.5 rounded-sm bg-primary/40" />
          </div>
        </div>

        {/* App content */}
        <div className="px-3.5 pb-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[11px] font-bold text-foreground">Ciao, Marco!</p>
              <p className="text-[9px] text-muted-foreground">3 new updates</p>
            </div>
            <div className="relative">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-primary rounded-full" />
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 gap-1.5 mb-3">
            <div className="bg-primary/5 rounded-lg p-2 text-center">
              <div className="text-xs font-bold text-foreground">4.8</div>
              <div className="flex justify-center">
                <Star className="h-2.5 w-2.5 fill-primary text-primary" />
              </div>
            </div>
            <div className="bg-primary/5 rounded-lg p-2 text-center">
              <div className="text-xs font-bold text-foreground">12</div>
              <div className="text-[8px] text-muted-foreground">Projects</div>
            </div>
          </div>

          {/* Notifications */}
          <div className="space-y-1.5">
            <div className="bg-primary/5 rounded-lg p-2 flex items-center gap-2 border border-primary/10">
              <Briefcase className="h-3 w-3 text-primary flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-[9px] font-semibold text-foreground truncate">TechCorp wants to connect</p>
                <p className="text-[8px] text-muted-foreground">96% match · 2m ago</p>
              </div>
            </div>
            <div className="bg-muted/30 rounded-lg p-2 flex items-center gap-2 border border-border/50">
              <Shield className="h-3 w-3 text-primary flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-[9px] font-medium text-foreground truncate">Project verified!</p>
                <p className="text-[8px] text-muted-foreground">E-commerce App · 1h ago</p>
              </div>
            </div>
            <div className="bg-muted/30 rounded-lg p-2 flex items-center gap-2 border border-border/50">
              <MessageSquare className="h-3 w-3 text-muted-foreground flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-[9px] font-medium text-foreground truncate">New message from recruiter</p>
                <p className="text-[8px] text-muted-foreground">StartupHub · 3h ago</p>
              </div>
            </div>
          </div>

          {/* Bottom nav */}
          <div className="mt-3 flex items-center justify-around bg-muted/30 rounded-xl p-1.5 border border-border/50">
            {[
              { icon: CheckCircle, active: true },
              { icon: Briefcase, active: false },
              { icon: MessageSquare, active: false },
              { icon: Star, active: false },
            ].map((item, i) => {
              const Icon = item.icon
              return (
                <div
                  key={i}
                  className={`p-1.5 rounded-lg ${item.active ? 'bg-primary/10' : ''}`}
                >
                  <Icon className={`h-3.5 w-3.5 ${item.active ? 'text-primary' : 'text-muted-foreground'}`} />
                </div>
              )
            })}
          </div>
        </div>

        {/* Home indicator */}
        <div className="flex justify-center pb-1.5">
          <div className="w-16 h-1 rounded-full bg-muted-foreground/20" />
        </div>
      </div>
    </div>
  )
}
