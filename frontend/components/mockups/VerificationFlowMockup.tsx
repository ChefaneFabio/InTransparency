'use client'

import { Badge } from '@/components/ui/badge'
import {
  Shield,
  CheckCircle,
  FileCheck,
  GraduationCap,
  Building2,
  ArrowRight,
} from 'lucide-react'

export function VerificationFlowMockup() {
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
          intransparency.it/verify/project-42
        </div>
      </div>

      <div className="p-5">
        {/* Verification steps */}
        <div className="flex items-center gap-2 mb-5">
          <Shield className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">Project Verification</span>
          <Badge className="bg-primary/10 text-primary text-[10px] ml-auto">3/3 Complete</Badge>
        </div>

        {/* Flow steps */}
        <div className="space-y-3">
          {[
            { step: 'Student Upload', icon: GraduationCap, status: 'done', detail: 'E-commerce Platform · React + Node.js' },
            { step: 'Institution Review', icon: Building2, status: 'done', detail: 'ITIS Galilei · Prof. Bianchi · 9/10' },
            { step: 'Blockchain Seal', icon: FileCheck, status: 'done', detail: 'Verified · Hash: 0x7f3a...c2d1' },
          ].map((item, i) => {
            const Icon = item.icon
            return (
              <div key={i}>
                <div className="flex items-center gap-3 bg-primary/5 rounded-lg p-3 border border-primary/10">
                  <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-foreground">{item.step}</span>
                      <CheckCircle className="h-3 w-3 text-primary" />
                    </div>
                    <p className="text-[10px] text-muted-foreground truncate">{item.detail}</p>
                  </div>
                </div>
                {i < 2 && (
                  <div className="flex justify-center py-1">
                    <ArrowRight className="h-3 w-3 text-muted-foreground/40 rotate-90" />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Result badge */}
        <div className="mt-4 bg-primary/10 rounded-lg p-3 flex items-center gap-2 border border-primary/20">
          <Shield className="h-5 w-5 text-primary" />
          <div>
            <p className="text-xs font-semibold text-foreground">Verified & Immutable</p>
            <p className="text-[10px] text-muted-foreground">Employers can trust this project is authentic</p>
          </div>
        </div>
      </div>
    </div>
  )
}
