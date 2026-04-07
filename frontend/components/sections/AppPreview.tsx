'use client'

/**
 * CSS-only app preview mockups for the landing page.
 * Professional, minimal, no images needed — pure HTML/CSS.
 */

interface AppPreviewProps {
  segment: 'students' | 'companies' | 'institutions'
}

export function AppPreview({ segment }: AppPreviewProps) {
  if (segment === 'students') return <StudentPreview />
  if (segment === 'companies') return <RecruiterPreview />
  return <UniversityPreview />
}

function StudentPreview() {
  return (
    <div className="bg-background rounded-xl border shadow-sm overflow-hidden text-left">
      {/* Top bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b bg-muted/30">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 text-center">
          <span className="text-[10px] text-muted-foreground">intransparency.com/dashboard/student</span>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Header */}
        <div className="bg-primary/5 rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="h-3 w-32 bg-foreground/80 rounded mb-2" />
            <div className="h-2 w-48 bg-muted-foreground/30 rounded" />
          </div>
          <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-primary font-bold text-lg">78%</span>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Views', value: '142', color: 'bg-blue-50 dark:bg-blue-950/30' },
            { label: 'Matches', value: '8', color: 'bg-green-50 dark:bg-green-950/30' },
            { label: 'Messages', value: '3', color: 'bg-purple-50 dark:bg-purple-950/30' },
          ].map(s => (
            <div key={s.label} className={`${s.color} rounded-xl p-3 text-center`}>
              <div className="text-lg font-bold text-foreground">{s.value}</div>
              <div className="text-[10px] text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Job recommendations */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-muted-foreground">Job Recommendations</div>
          {[
            { title: 'Junior Marketing Analyst', company: 'Deloitte', match: '92%' },
            { title: 'UX Research Intern', company: 'Bending Spoons', match: '85%' },
            { title: 'Business Development', company: 'Reply', match: '78%' },
          ].map(j => (
            <div key={j.title} className="flex items-center gap-3 p-2.5 rounded-lg bg-white/50 dark:bg-slate-800/50 border border-border/50">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-[10px] font-bold text-primary">{j.match}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-foreground truncate">{j.title}</div>
                <div className="text-[10px] text-muted-foreground">{j.company}</div>
              </div>
              <div className="flex gap-0.5">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="w-1 h-3 rounded-full bg-green-400/60" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function RecruiterPreview() {
  return (
    <div className="bg-background rounded-xl border shadow-sm overflow-hidden text-left">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b bg-muted/30">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 text-center">
          <span className="text-[10px] text-muted-foreground">intransparency.com/dashboard/recruiter</span>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Search */}
        <div className="bg-primary/5 rounded-xl p-4">
          <div className="h-3 w-40 bg-foreground/80 rounded mb-3" />
          <div className="flex gap-2">
            <div className="flex-1 h-8 bg-background border rounded-lg" />
            <div className="h-8 w-20 bg-primary rounded-lg" />
          </div>
        </div>

        {/* Candidate cards */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-muted-foreground">AI Recommendations</div>
          {[
            { name: 'Marco R.', uni: 'Politecnico di Milano', score: '94%', skills: ['Python', 'ML', 'SQL'], verified: true },
            { name: 'Sara L.', uni: 'Bocconi', score: '87%', skills: ['Finance', 'Excel', 'R'], verified: true },
            { name: 'Luca M.', uni: 'Univ. di Padova', score: '82%', skills: ['Java', 'Spring', 'AWS'], verified: false },
          ].map(c => (
            <div key={c.name} className="flex items-center gap-3 p-2.5 rounded-lg bg-white/50 dark:bg-slate-800/50 border border-border/50">
              <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-primary">{c.name.split(' ')[0][0]}{c.name.split(' ')[1][0]}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-medium text-foreground">{c.name}</span>
                  {c.verified && <div className="w-3 h-3 rounded-full bg-green-500 flex items-center justify-center"><svg viewBox="0 0 12 12" className="w-2 h-2 text-white"><path fill="currentColor" d="M9.7 3.3L5 8 2.3 5.3l.7-.7L5 6.6l4-4 .7.7z"/></svg></div>}
                </div>
                <div className="text-[10px] text-muted-foreground">{c.uni}</div>
                <div className="flex gap-1 mt-1">
                  {c.skills.map(s => (
                    <span key={s} className="text-[8px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">{s}</span>
                  ))}
                </div>
              </div>
              <span className="text-sm font-bold text-primary">{c.score}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function UniversityPreview() {
  return (
    <div className="bg-background rounded-xl border shadow-sm overflow-hidden text-left">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b bg-muted/30">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 text-center">
          <span className="text-[10px] text-muted-foreground">intransparency.com/dashboard/university</span>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'Students', value: '1,247' },
            { label: 'Verified', value: '892' },
            { label: 'Placements', value: '156' },
            { label: 'Companies', value: '43' },
          ].map(s => (
            <div key={s.label} className="bg-primary/5 rounded-lg p-2 text-center">
              <div className="text-sm font-bold text-foreground">{s.value}</div>
              <div className="text-[9px] text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Placement funnel */}
        <div>
          <div className="text-xs font-semibold text-muted-foreground mb-2">Placement Pipeline</div>
          <div className="space-y-1.5">
            {[
              { stage: 'Registered', count: 1247, pct: 100 },
              { stage: 'Projects uploaded', count: 892, pct: 72 },
              { stage: 'Viewed by recruiters', count: 634, pct: 51 },
              { stage: 'Contacted', count: 287, pct: 23 },
              { stage: 'Placed', count: 156, pct: 13 },
            ].map(f => (
              <div key={f.stage} className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground w-28 text-right">{f.stage}</span>
                <div className="flex-1 h-4 bg-muted/50 rounded-full overflow-hidden">
                  <div className="h-full bg-primary/40 rounded-full" style={{ width: `${f.pct}%` }} />
                </div>
                <span className="text-[10px] font-medium text-foreground w-10">{f.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Skill gap */}
        <div className="flex gap-3">
          <div className="flex-1 bg-red-50 dark:bg-red-950/20 rounded-lg p-2">
            <div className="text-[9px] font-semibold text-red-700 dark:text-red-400 mb-1">Skills Gap</div>
            <div className="text-[9px] text-red-600 dark:text-red-400">Docker, Cloud, CI/CD</div>
          </div>
          <div className="flex-1 bg-green-50 dark:bg-green-950/20 rounded-lg p-2">
            <div className="text-[9px] font-semibold text-green-700 dark:text-green-400 mb-1">Top Skills</div>
            <div className="text-[9px] text-green-600 dark:text-green-400">Python, SQL, Excel</div>
          </div>
        </div>
      </div>
    </div>
  )
}
