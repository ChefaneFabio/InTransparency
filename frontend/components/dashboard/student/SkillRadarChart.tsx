'use client'

import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts'
import type { SkillScore, SkillGap } from '@/lib/skill-path'

interface SkillRadarChartProps {
  currentSkills: SkillScore[]
  skillGaps: SkillGap[]
  maxItems?: number
}

export function SkillRadarChart({ currentSkills, skillGaps, maxItems = 8 }: SkillRadarChartProps) {
  // Build radar data: top skills + top gap skills
  const radarSkills = new Map<string, { current: number; ideal: number }>()

  // Add top current skills
  for (const skill of currentSkills.slice(0, maxItems)) {
    radarSkills.set(skill.name, {
      current: skill.level,
      ideal: Math.min(100, skill.level + 20),
    })
  }

  // Overlay gaps (which represent ideal target levels)
  for (const gap of skillGaps.slice(0, maxItems)) {
    const existing = radarSkills.get(gap.skill)
    if (existing) {
      existing.ideal = gap.targetLevel
    } else {
      radarSkills.set(gap.skill, {
        current: gap.currentLevel,
        ideal: gap.targetLevel,
      })
    }
  }

  const data = Array.from(radarSkills.entries())
    .slice(0, maxItems)
    .map(([name, values]) => ({
      skill: name.length > 12 ? name.slice(0, 12) + '...' : name,
      fullName: name,
      'Your Level': values.current,
      'Ideal Candidate': values.ideal,
    }))

  if (data.length < 3) {
    return (
      <div className="flex items-center justify-center h-64 text-sm text-gray-500">
        Add more projects to see your skill radar chart
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
        <PolarGrid strokeDasharray="3 3" />
        <PolarAngleAxis
          dataKey="skill"
          tick={{ fontSize: 11, fill: '#6b7280' }}
        />
        <PolarRadiusAxis
          angle={30}
          domain={[0, 100]}
          tick={{ fontSize: 10 }}
        />
        <Radar
          name="Your Level"
          dataKey="Your Level"
          stroke="#3b82f6"
          fill="#3b82f6"
          fillOpacity={0.3}
          strokeWidth={2}
        />
        <Radar
          name="Ideal Candidate"
          dataKey="Ideal Candidate"
          stroke="#a855f7"
          fill="#a855f7"
          fillOpacity={0.1}
          strokeWidth={2}
          strokeDasharray="5 5"
        />
        <Tooltip
          formatter={(value: number, name: string) => [`${value}%`, name]}
          labelFormatter={(label: string) => {
            const item = data.find(d => d.skill === label)
            return item?.fullName || label
          }}
        />
        <Legend />
      </RadarChart>
    </ResponsiveContainer>
  )
}
