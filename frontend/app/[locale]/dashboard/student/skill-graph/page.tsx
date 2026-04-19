'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Network, CheckCircle2, Award, FileText, BookOpen, Globe, Download } from 'lucide-react'

interface SkillSource {
  source: 'STAGE' | 'PROJECT' | 'COURSE' | 'THESIS' | 'ENDORSEMENT' | 'SELF_ASSESSMENT' | 'EXCHANGE'
  sourceId: string
  sourceName: string | null
  level: number
  occurredAt: string
}

interface SkillRow {
  skillTerm: string
  escoUri: string | null
  currentLevel: number
  sourceCount: number
  sources: SkillSource[]
  firstObservedAt: string
  lastObservedAt: string
}

interface GraphData {
  skills: SkillRow[]
  summary: {
    totalSkills: number
    byLevel: { beginner: number; intermediate: number; advanced: number; expert: number }
    multiSource: number
  }
}

const LEVEL_LABELS = ['—', 'Beginner', 'Intermediate', 'Advanced', 'Expert']
const LEVEL_COLORS = ['', 'bg-slate-300', 'bg-blue-400', 'bg-emerald-500', 'bg-violet-600']

const SOURCE_ICON: Record<string, any> = {
  STAGE: Network,
  PROJECT: FileText,
  COURSE: BookOpen,
  THESIS: FileText,
  ENDORSEMENT: Award,
  SELF_ASSESSMENT: CheckCircle2,
  EXCHANGE: Globe,
}

const SOURCE_LABEL: Record<string, string> = {
  STAGE: 'Stage',
  PROJECT: 'Project',
  COURSE: 'Course',
  THESIS: 'Thesis',
  ENDORSEMENT: 'Professor endorsement',
  SELF_ASSESSMENT: 'Self-assessment',
  EXCHANGE: 'Exchange / Erasmus',
}

export default function StudentSkillGraph() {
  const [data, setData] = useState<GraphData | null>(null)
  const [loading, setLoading] = useState(true)
  const [expandedSkill, setExpandedSkill] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/student/skill-graph')
      .then(r => (r.ok ? r.json() : null))
      .then(setData)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="container max-w-5xl mx-auto py-8 px-4">
        <Skeleton className="h-32 w-full mb-6" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  if (!data || data.skills.length === 0) {
    return (
      <div className="container max-w-5xl mx-auto py-8 px-4">
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <Network className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold mb-2">Your verified skill graph is empty</h1>
            <p className="text-muted-foreground max-w-md mx-auto mb-4">
              Every time a stage supervisor rates you, a professor endorses a project, or a host
              university completes an exchange, a verified proficiency entry gets added here.
              Complete your first stage or ask a professor for an endorsement to see it populate.
            </p>
            <Button asChild>
              <a href="/dashboard/student/projects">Go to your projects</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { summary, skills } = data
  const totalPct = Math.max(1, summary.totalSkills)

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-1">Your verified skill graph</h1>
        <p className="text-muted-foreground">
          Skills proven by evidence — supervisor evaluations, professor endorsements, exchange
          programs. Not self-declared claims.
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold">{summary.totalSkills}</div>
            <div className="text-sm text-muted-foreground">Verified skills</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-emerald-600">
              {summary.byLevel.advanced + summary.byLevel.expert}
            </div>
            <div className="text-sm text-muted-foreground">Advanced / Expert</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-violet-600">{summary.byLevel.expert}</div>
            <div className="text-sm text-muted-foreground">Expert-level</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold">{summary.multiSource}</div>
            <div className="text-sm text-muted-foreground">Multi-source (stronger)</div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Proficiency distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {(['expert', 'advanced', 'intermediate', 'beginner'] as const).map((lvl, idx) => {
              const count = summary.byLevel[lvl]
              const pct = Math.round((count / totalPct) * 100)
              const levelIdx = 4 - idx
              return (
                <div key={lvl} className="flex items-center gap-3 text-sm">
                  <div className="w-28 capitalize">{lvl}</div>
                  <div className="flex-1 bg-muted rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full ${LEVEL_COLORS[levelIdx]}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="w-16 text-right text-muted-foreground">{count}</div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">All verified skills</h2>
        <Button variant="outline" size="sm" asChild>
          <a href="/api/student/europass?download=1">
            <Download className="h-4 w-4 mr-2" />
            Export to Europass
          </a>
        </Button>
      </div>

      <div className="space-y-3">
        {skills.map(skill => {
          const isOpen = expandedSkill === skill.skillTerm
          return (
            <Card key={skill.skillTerm} className="overflow-hidden">
              <button
                className="w-full text-left p-4 hover:bg-muted/30 transition-colors"
                onClick={() => setExpandedSkill(isOpen ? null : skill.skillTerm)}
              >
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{skill.skillTerm}</h3>
                      {skill.escoUri && (
                        <Badge variant="outline" className="text-xs" title={skill.escoUri}>
                          ESCO
                        </Badge>
                      )}
                      {skill.sourceCount >= 2 && (
                        <Badge variant="secondary" className="text-xs">
                          {skill.sourceCount} sources
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden max-w-xs">
                        <div
                          className={`h-full ${LEVEL_COLORS[skill.currentLevel]}`}
                          style={{ width: `${(skill.currentLevel / 4) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {LEVEL_LABELS[skill.currentLevel]}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {isOpen ? '−' : '+'}
                  </span>
                </div>
              </button>
              {isOpen && (
                <div className="px-4 pb-4 pt-2 bg-muted/20 border-t">
                  <p className="text-xs font-semibold text-muted-foreground mb-2">
                    Evidence timeline
                  </p>
                  <div className="space-y-2">
                    {skill.sources.map((s, idx) => {
                      const Icon = SOURCE_ICON[s.source] ?? FileText
                      return (
                        <div key={idx} className="flex items-center gap-3 text-sm">
                          <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <div className="flex-1">
                            <div className="font-medium">
                              {s.sourceName ?? SOURCE_LABEL[s.source]}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {SOURCE_LABEL[s.source]} · {LEVEL_LABELS[s.level]} ·{' '}
                              {new Date(s.occurredAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
