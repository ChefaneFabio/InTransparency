'use client'

import { useEffect, useState } from 'react'
import { Link } from '@/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ChallengeCard } from '@/components/challenges/ChallengeCard'
import { Search, Loader2, Trophy, FileText, CheckCircle } from 'lucide-react'

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
  hasApplied?: boolean
  mySubmission?: {
    id: string
    status: string
  } | null
  spotsRemaining?: number
  _count?: {
    submissions: number
  }
}

export default function StudentChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [disciplineFilter, setDisciplineFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const response = await fetch('/api/student/challenges')
        if (response.ok) {
          const data = await response.json()
          setChallenges(data.challenges)
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
                         challenge.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         challenge.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDiscipline = disciplineFilter === 'all' || challenge.discipline === disciplineFilter
    const matchesType = typeFilter === 'all' || challenge.challengeType === typeFilter

    return matchesSearch && matchesDiscipline && matchesType
  })

  const appliedChallenges = challenges.filter(c => c.hasApplied)
  const availableChallenges = filteredChallenges.filter(c => !c.hasApplied)

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
      <div className="flex items-center justify-between pt-2">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Company Challenges</h1>
          <p className="text-gray-600 mt-1">
            Work on real-world projects from leading companies
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/dashboard/student/challenges/submissions">
            <FileText className="h-4 w-4 mr-2" />
            My Submissions
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{challenges.length}</p>
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
                <p className="text-2xl font-bold">{appliedChallenges.length}</p>
                <p className="text-sm text-gray-600">Applied</p>
              </div>
              <FileText className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">
                  {appliedChallenges.filter(c => c.mySubmission?.status === 'APPROVED').length}
                </p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search challenges..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={disciplineFilter} onValueChange={setDisciplineFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Discipline" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Disciplines</SelectItem>
                <SelectItem value="TECHNOLOGY">Technology</SelectItem>
                <SelectItem value="BUSINESS">Business</SelectItem>
                <SelectItem value="ENGINEERING">Engineering</SelectItem>
                <SelectItem value="DESIGN">Design</SelectItem>
                <SelectItem value="HEALTHCARE">Healthcare</SelectItem>
                <SelectItem value="SCIENCE">Science</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="CAPSTONE">Capstone</SelectItem>
                <SelectItem value="INTERNSHIP">Internship</SelectItem>
                <SelectItem value="COURSE_PROJECT">Course Project</SelectItem>
                <SelectItem value="THESIS">Thesis</SelectItem>
                <SelectItem value="HACKATHON">Hackathon</SelectItem>
                <SelectItem value="RESEARCH">Research</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* My Applications */}
      {appliedChallenges.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">My Applications</h2>
          {appliedChallenges.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              variant="student"
            />
          ))}
        </div>
      )}

      {/* Available Challenges */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">
          {appliedChallenges.length > 0 ? 'More Challenges' : 'Available Challenges'}
        </h2>
        {availableChallenges.length > 0 ? (
          <div className="space-y-4">
            {availableChallenges.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                variant="student"
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <Trophy className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <h3 className="font-medium text-gray-900 mb-2">
                  {searchTerm || disciplineFilter !== 'all' || typeFilter !== 'all'
                    ? 'No challenges match your filters'
                    : 'No challenges available'}
                </h3>
                <p className="text-gray-600">
                  {searchTerm || disciplineFilter !== 'all' || typeFilter !== 'all'
                    ? 'Try adjusting your filters'
                    : 'Check back later for new opportunities'}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
