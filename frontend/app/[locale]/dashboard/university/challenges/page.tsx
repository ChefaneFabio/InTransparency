'use client'

import { useEffect, useState } from 'react'
import { Link } from '@/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ChallengeCard } from '@/components/challenges/ChallengeCard'
import { Search, Loader2, Trophy, CheckCircle, Clock, Users } from 'lucide-react'

interface UniversityApproval {
  id: string
  status: string
  courseName?: string
  courseCode?: string
}

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
  universityApprovals: UniversityApproval[]
  isApprovedByMyUniversity?: boolean
  _count?: {
    submissions: number
  }
}

interface Stats {
  total: number
  pendingApproval: number
  approved: number
  withSubmissions: number
}

export default function UniversityChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [stats, setStats] = useState<Stats>({
    total: 0,
    pendingApproval: 0,
    approved: 0,
    withSubmissions: 0
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [disciplineFilter, setDisciplineFilter] = useState('all')
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const response = await fetch('/api/dashboard/university/challenges')
        if (response.ok) {
          const data = await response.json()
          // Add isApprovedByMyUniversity flag
          const challengesWithApproval = data.challenges.map((c: Challenge) => ({
            ...c,
            isApprovedByMyUniversity: c.universityApprovals?.[0]?.status === 'APPROVED'
          }))
          setChallenges(challengesWithApproval)
          setStats(data.stats)
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
                         challenge.companyName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDiscipline = disciplineFilter === 'all' || challenge.discipline === disciplineFilter

    let matchesTab = true
    if (activeTab === 'pending') {
      matchesTab = !challenge.universityApprovals?.[0] || challenge.universityApprovals[0].status === 'PENDING'
    } else if (activeTab === 'approved') {
      matchesTab = challenge.universityApprovals?.[0]?.status === 'APPROVED'
    }

    return matchesSearch && matchesDiscipline && matchesTab
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600 mb-4" />
          <p className="text-gray-500">Loading challenges...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="pt-2">
        <h1 className="text-2xl font-semibold text-gray-900">Company Challenges</h1>
        <p className="text-gray-600 mt-1">
          Review and approve challenges for your students
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-gray-600">Available</p>
              </div>
              <Trophy className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stats.pendingApproval}</p>
                <p className="text-sm text-gray-600">Pending Review</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stats.approved}</p>
                <p className="text-sm text-gray-600">Approved</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stats.withSubmissions}</p>
                <p className="text-sm text-gray-600">With Students</p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs and Filters */}
      <Card>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
                <TabsTrigger value="pending">Pending ({stats.pendingApproval})</TabsTrigger>
                <TabsTrigger value="approved">Approved ({stats.approved})</TabsTrigger>
              </TabsList>

              <div className="flex gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search challenges..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={disciplineFilter} onValueChange={setDisciplineFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Discipline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="TECHNOLOGY">Technology</SelectItem>
                    <SelectItem value="BUSINESS">Business</SelectItem>
                    <SelectItem value="ENGINEERING">Engineering</SelectItem>
                    <SelectItem value="DESIGN">Design</SelectItem>
                    <SelectItem value="SCIENCE">Science</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <TabsContent value="all" className="mt-0">
              <ChallengesList challenges={filteredChallenges} />
            </TabsContent>
            <TabsContent value="pending" className="mt-0">
              <ChallengesList challenges={filteredChallenges} />
            </TabsContent>
            <TabsContent value="approved" className="mt-0">
              <ChallengesList challenges={filteredChallenges} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

function ChallengesList({ challenges }: { challenges: Challenge[] }) {
  if (challenges.length === 0) {
    return (
      <div className="text-center py-12">
        <Trophy className="h-12 w-12 mx-auto text-gray-300 mb-4" />
        <h3 className="font-medium text-gray-900 mb-2">No challenges found</h3>
        <p className="text-gray-600">
          Challenges from companies will appear here for your review
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4 mt-4">
      {challenges.map((challenge) => (
        <ChallengeCard
          key={challenge.id}
          challenge={challenge}
          variant="university"
        />
      ))}
    </div>
  )
}
