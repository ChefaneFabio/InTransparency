'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ChallengeCard } from '@/components/challenges/ChallengeCard'
import { Plus, Search, Loader2, Trophy, FileText, GraduationCap } from 'lucide-react'
import { GlassCard } from '@/components/dashboard/shared/GlassCard'
import { EmptyState } from '@/components/dashboard/shared/EmptyState'

interface Challenge {
  id: string
  title: string
  description: string
  companyName: string
  companyLogo?: string
  companyIndustry?: string
  discipline: string
  challengeType: string
  requiredSkills: string[]
  teamSizeMin: number
  teamSizeMax: number
  estimatedDuration?: string
  applicationDeadline?: string
  mentorshipOffered: boolean
  compensation?: string
  status: string
  slug: string
  maxSubmissions: number
  _count?: {
    submissions: number
    universityApprovals: number
  }
}

export default function RecruiterChallengesPage() {
  const t = useTranslations('dashboard.recruiter.challenges')
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    totalSubmissions: 0,
    totalApprovals: 0
  })

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const response = await fetch('/api/challenges')
        if (response.ok) {
          const data = await response.json()
          setChallenges(data.challenges)

          // Calculate stats
          const active = data.challenges.filter((c: Challenge) =>
            ['ACTIVE', 'IN_PROGRESS', 'APPROVED'].includes(c.status)
          ).length
          const totalSubmissions = data.challenges.reduce(
            (sum: number, c: Challenge) => sum + (c._count?.submissions || 0), 0
          )
          const totalApprovals = data.challenges.reduce(
            (sum: number, c: Challenge) => sum + (c._count?.universityApprovals || 0), 0
          )

          setStats({
            total: data.challenges.length,
            active,
            totalSubmissions,
            totalApprovals
          })
        }
      } catch (error) {
        console.error('Failed to fetch challenges:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchChallenges()
  }, [])

  const filteredChallenges = challenges.filter(challenge => {
    const matchesSearch = challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         challenge.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || challenge.status === statusFilter

    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary mb-4" />
          <p className="text-muted-foreground">{t('loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">{t('title')}</h1>
          <p className="text-muted-foreground mt-1">
            {t('subtitle')}
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/recruiter/challenges">
            <Plus className="h-4 w-4 mr-2" />
            {t('createChallenge')}
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">{t('totalChallenges')}</p>
              </div>
              <Trophy className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stats.active}</p>
                <p className="text-sm text-muted-foreground">{t('active')}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <div className="h-3 w-3 rounded-full bg-primary/50" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stats.totalSubmissions}</p>
                <p className="text-sm text-muted-foreground">{t('totalSubmissions')}</p>
              </div>
              <FileText className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stats.totalApprovals}</p>
                <p className="text-sm text-muted-foreground">{t('universityApprovals')}</p>
              </div>
              <GraduationCap className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground/60" />
              <Input
                placeholder={t('searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="PENDING_REVIEW">Pending Review</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="CLOSED">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Challenges List */}
      {filteredChallenges.length > 0 ? (
        <div className="space-y-4">
          {filteredChallenges.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              variant="recruiter"
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent>
            <EmptyState
              icon={Trophy}
              title={t('emptyTitle')}
              description={t('emptyDescription')}
              action={{
                label: t('createChallenge'),
                href: '/dashboard/recruiter/challenges/new',
              }}
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
