'use client'

import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip, Legend,
} from 'recharts'
import { useTranslations } from 'next-intl'
import type { SkillScore, SkillGap } from '@/lib/skill-path'

interface SkillRadarChartProps {
  currentSkills: SkillScore[]
  skillGaps: SkillGap[]
  maxItems?: number
}

export function SkillRadarChart({ currentSkills, skillGaps, maxItems = 8 }: SkillRadarChartProps) {
  const t = useTranslations('skillPath.radar')

  const radarSkills = new Map<string, { current: number; ideal: number }>()

  for (const skill of currentSkills.slice(0, maxItems)) {
    radarSkills.set(skill.name, { current: skill.level, ideal: Math.min(100, skill.level + 20) })
  }

  for (const gap of skillGaps.slice(0, maxItems)) {
    const existing = radarSkills.get(gap.skill)
    if (existing) {
      existing.ideal = gap.targetLevel
    } else {
      radarSkills.set(gap.skill, { current: gap.currentLevel, ideal: gap.targetLevel })
    }
  }

  const yourLabel = t('yourLevel')
  const idealLabel = t('idealCandidate')

  const data = Array.from(radarSkills.entries())
    .slice(0, maxItems)
    .map(([name, values]) => ({
      skill: name.length > 12 ? name.slice(0, 12) + '...' : name,
      fullName: name,
      [yourLabel]: values.current,
      [idealLabel]: values.ideal,
    }))

  if (data.length < 3) {
    return (
      <div className="flex items-center justify-center h-64 text-sm text-muted-foreground">
        {t('empty')}
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
        <PolarGrid strokeDasharray="3 3" />
        <PolarAngleAxis dataKey="skill" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
        <Radar name={yourLabel} dataKey={yourLabel} stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} strokeWidth={2} />
        <Radar name={idealLabel} dataKey={idealLabel} stroke="#a855f7" fill="#a855f7" fillOpacity={0.1} strokeWidth={2} strokeDasharray="5 5" />
        <Tooltip formatter={(value: number, name: string) => [`${value}%`, name]} labelFormatter={(label: string) => { const item = data.find(d => d.skill === label); return item?.fullName || label }} />
        <Legend />
      </RadarChart>
    </ResponsiveContainer>
  )
}
