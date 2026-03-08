'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  User,
  Award,
  Globe,
  LinkIcon,
  FolderPlus,
  Layers,
  Star,
  ShieldCheck,
  ThumbsUp,
  MessageCircle,
  BadgeCheck,
  Briefcase,
  Rocket,
  Trophy,
  Lock,
} from 'lucide-react'

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  category: 'profile' | 'projects' | 'engagement' | 'career'
  unlocked: boolean
  progress: number
}

interface AchievementsSummary {
  totalUnlocked: number
  totalAchievements: number
  overallProgress: number
  profileCompleteness: number
}

const iconMap: Record<string, typeof User> = {
  user: User,
  award: Award,
  globe: Globe,
  link: LinkIcon,
  'folder-plus': FolderPlus,
  layers: Layers,
  star: Star,
  'shield-check': ShieldCheck,
  'thumbs-up': ThumbsUp,
  'message-circle': MessageCircle,
  'badge-check': BadgeCheck,
  briefcase: Briefcase,
  rocket: Rocket,
}

const categoryColors: Record<string, string> = {
  profile: 'bg-primary/10 text-primary',
  projects: 'bg-primary/10 text-primary',
  engagement: 'bg-primary/10 text-primary',
  career: 'bg-secondary/10 text-secondary',
}

const categoryLabels: Record<string, string> = {
  profile: 'Profile',
  projects: 'Projects',
  engagement: 'Engagement',
  career: 'Career',
}

export function AchievementsPanel() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [summary, setSummary] = useState<AchievementsSummary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const res = await fetch('/api/student/achievements')
        if (res.ok) {
          const data = await res.json()
          setAchievements(data.achievements)
          setSummary(data.summary)
        }
      } catch (error) {
        console.error('Failed to fetch achievements:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchAchievements()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
        </CardContent>
      </Card>
    )
  }

  if (!summary) return null

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-secondary" />
              Achievements
            </CardTitle>
            <CardDescription>
              {summary.totalUnlocked} of {summary.totalAchievements} unlocked
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{summary.overallProgress}%</div>
            <div className="text-xs text-muted-foreground">complete</div>
          </div>
        </div>
        <Progress value={summary.overallProgress} className="h-2 mt-2" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {achievements.map((achievement) => {
            const Icon = iconMap[achievement.icon] || Award
            return (
              <div
                key={achievement.id}
                className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
                  achievement.unlocked
                    ? 'bg-primary/5 border-primary/20'
                    : 'bg-muted/50 border-border opacity-70'
                }`}
              >
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    achievement.unlocked
                      ? 'bg-primary text-white'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {achievement.unlocked ? (
                    <Icon className="h-5 w-5" />
                  ) : (
                    <Lock className="h-4 w-4" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-medium text-sm truncate">{achievement.title}</span>
                    <Badge className={`${categoryColors[achievement.category]} text-[10px] px-1.5 py-0`}>
                      {categoryLabels[achievement.category]}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{achievement.description}</p>
                  {!achievement.unlocked && achievement.progress > 0 && (
                    <Progress value={achievement.progress} className="h-1 mt-2" />
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
