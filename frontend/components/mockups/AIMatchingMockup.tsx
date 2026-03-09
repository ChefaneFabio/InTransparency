'use client'

import { Badge } from '@/components/ui/badge'
import {
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from 'lucide-react'

export function AIMatchingMockup() {
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
          intransparency.it/dashboard/matches
        </div>
      </div>

      <div className="p-5">
        {/* AI header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div>
            <span className="text-sm font-semibold text-foreground">AI Match Engine</span>
            <p className="text-[10px] text-muted-foreground">Analyzing 12 verified skills</p>
          </div>
        </div>

        {/* Match scores */}
        <div className="space-y-2.5 mb-4">
          {[
            { role: 'Frontend Developer', company: 'TechCorp Milano', match: 96, skills: ['React', 'TypeScript'] },
            { role: 'Full Stack Engineer', company: 'StartupHub Roma', match: 91, skills: ['Node.js', 'React'] },
            { role: 'UI/UX Developer', company: 'DesignLab Torino', match: 85, skills: ['CSS', 'Figma'] },
          ].map((item) => (
            <div key={item.role} className="bg-muted/20 rounded-lg p-3 border border-border/50">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-xs font-semibold text-foreground">{item.role}</p>
                  <p className="text-[10px] text-muted-foreground">{item.company}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-primary">{item.match}%</div>
                </div>
              </div>
              {/* Match bar */}
              <div className="w-full bg-muted rounded-full h-1.5 mb-1.5">
                <div
                  className="bg-primary h-1.5 rounded-full transition-all"
                  style={{ width: `${item.match}%` }}
                />
              </div>
              <div className="flex gap-1">
                {item.skills.map(s => (
                  <Badge key={s} variant="secondary" className="text-[9px] px-1 py-0">{s}</Badge>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Stats footer */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-primary/5 rounded-lg p-2 text-center">
            <Target className="h-3 w-3 text-primary mx-auto mb-0.5" />
            <div className="text-xs font-bold text-foreground">47</div>
            <div className="text-[9px] text-muted-foreground">Matches</div>
          </div>
          <div className="bg-primary/5 rounded-lg p-2 text-center">
            <Zap className="h-3 w-3 text-primary mx-auto mb-0.5" />
            <div className="text-xs font-bold text-foreground">2.3s</div>
            <div className="text-[9px] text-muted-foreground">Analysis</div>
          </div>
          <div className="bg-primary/5 rounded-lg p-2 text-center">
            <TrendingUp className="h-3 w-3 text-primary mx-auto mb-0.5" />
            <div className="text-xs font-bold text-foreground">94%</div>
            <div className="text-[9px] text-muted-foreground">Accuracy</div>
          </div>
        </div>
      </div>
    </div>
  )
}
