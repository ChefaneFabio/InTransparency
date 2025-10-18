'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Building2, MapPin, Calendar, CheckCircle2, TrendingUp, Sparkles, AlertCircle, BookOpen, Code } from 'lucide-react'

interface JobOpportunity {
  id: string
  title: string
  company: string
  location: string
  type: string
  salaryRange: string
  matchScore: number
  postedDate: string
  academicRequirements: {
    courses: Array<{name: string; minGrade: number; yourGrade: number}>
    projects: Array<{type: string; match: boolean}>
  }
  whyMatched: string[]
  yourAdvantages: string[]
  missingRequirements?: string[]
}

export default function StudentOpportunities() {
  const [filter, setFilter] = useState('all')
  
  // Mock opportunities based on student's academic profile
  const opportunities: JobOpportunity[] = [
    {
      id: '1',
      title: 'ML Engineer - Healthcare',
      company: 'MedTech Solutions',
      location: 'Milan, Italy',
      type: 'Full-time',
      salaryRange: '€40,000 - €50,000',
      matchScore: 95,
      postedDate: '2 days ago',
      academicRequirements: {
        courses: [
          { name: 'Machine Learning', minGrade: 26, yourGrade: 30 },
          { name: 'Statistics', minGrade: 25, yourGrade: 29 },
          { name: 'Programming', minGrade: 24, yourGrade: 28 }
        ],
        projects: [
          { type: 'ML Healthcare Application', match: true },
          { type: 'Data Analysis Project', match: true }
        ]
      },
      whyMatched: [
        'Your ML course (30/30) exceeds requirement (26/30)',
        'Your healthcare prediction project directly matches their needs',
        'Top 5% performance in Statistics aligns with role requirements'
      ],
      yourAdvantages: [
        'Professor endorsement from ML course',
        'Published research paper in healthcare AI',
        'Internship experience at similar company'
      ]
    },
    {
      id: '2',
      title: 'Backend Developer',
      company: 'Tech Startup',
      location: 'Remote',
      type: 'Full-time',
      salaryRange: '€35,000 - €45,000',
      matchScore: 88,
      postedDate: '1 week ago',
      academicRequirements: {
        courses: [
          { name: 'Database Systems', minGrade: 25, yourGrade: 29 },
          { name: 'Software Engineering', minGrade: 24, yourGrade: 27 },
          { name: 'Algorithms', minGrade: 26, yourGrade: 28 }
        ],
        projects: [
          { type: 'Backend API Development', match: true },
          { type: 'Database Design Project', match: true }
        ]
      },
      whyMatched: [
        'Database Systems grade (29/30) shows strong SQL skills',
        'Your e-commerce API project demonstrates backend expertise',
        'Algorithms performance proves problem-solving ability'
      ],
      yourAdvantages: [
        'GitHub repository with 200+ stars',
        'Contributed to open-source projects'
      ]
    },
    {
      id: '3',
      title: 'Data Scientist',
      company: 'Financial Services',
      location: 'Rome, Italy',
      type: 'Internship',
      salaryRange: '€1,200/month',
      matchScore: 75,
      postedDate: '3 days ago',
      academicRequirements: {
        courses: [
          { name: 'Statistics', minGrade: 27, yourGrade: 29 },
          { name: 'Machine Learning', minGrade: 25, yourGrade: 30 },
          { name: 'Finance', minGrade: 24, yourGrade: 22 }
        ],
        projects: [
          { type: 'Financial Analysis', match: false },
          { type: 'Data Visualization', match: true }
        ]
      },
      whyMatched: [
        'Statistics and ML courses exceed requirements',
        'Strong mathematical background'
      ],
      missingRequirements: [
        'Consider adding a finance-related project',
        'Finance course grade slightly below preferred (22/30 vs 24/30)'
      ],
      yourAdvantages: [
        'Strong mathematical foundation',
        'Data visualization project demonstrates analytical skills'
      ]
    }
  ]

  const filteredOpportunities = opportunities.filter(opp => {
    if (filter === 'perfect') return opp.matchScore >= 90
    if (filter === 'good') return opp.matchScore >= 80 && opp.matchScore < 90
    if (filter === 'stretch') return opp.matchScore < 80
    return true
  })

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Opportunities</h1>
          <p className="text-gray-600">
            Jobs matched to your academic profile and skills
          </p>
        </div>

        {/* Profile Completion Alert */}
        <Alert className="mb-6">
          <TrendingUp className="h-4 w-4" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <span>
                Your profile is 85% complete. Complete it to unlock more opportunities.
              </span>
              <Button size="sm" variant="outline">Complete Profile</Button>
            </div>
          </AlertDescription>
        </Alert>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          <Button 
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
          >
            All Opportunities ({opportunities.length})
          </Button>
          <Button 
            variant={filter === 'perfect' ? 'default' : 'outline'}
            onClick={() => setFilter('perfect')}
          >
            Perfect Matches ({opportunities.filter(o => o.matchScore >= 90).length})
          </Button>
          <Button 
            variant={filter === 'good' ? 'default' : 'outline'}
            onClick={() => setFilter('good')}
          >
            Good Matches ({opportunities.filter(o => o.matchScore >= 80 && o.matchScore < 90).length})
          </Button>
          <Button 
            variant={filter === 'stretch' ? 'default' : 'outline'}
            onClick={() => setFilter('stretch')}
          >
            Stretch Goals ({opportunities.filter(o => o.matchScore < 80).length})
          </Button>
        </div>

        {/* Opportunities List */}
        <div className="space-y-6">
          {filteredOpportunities.map((opportunity) => (
            <Card key={opportunity.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">{opportunity.title}</h3>
                      <Badge 
                        className={
                          opportunity.matchScore >= 90 
                            ? 'bg-green-100 text-green-800'
                            : opportunity.matchScore >= 80
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-400 text-gray-900'
                        }
                      >
                        {opportunity.matchScore}% Match
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <Building2 className="h-4 w-4 mr-1" />
                        {opportunity.company}
                      </span>
                      <span className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {opportunity.location}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {opportunity.postedDate}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{opportunity.salaryRange}</div>
                    <div className="text-sm text-gray-600">{opportunity.type}</div>
                  </div>
                </div>

                {/* Match Analysis */}
                <div className="grid md:grid-cols-2 gap-6 mb-4">
                  {/* Why You Match */}
                  <div>
                    <h4 className="font-medium mb-3 flex items-center">
                      <Sparkles className="h-4 w-4 mr-2 text-green-600" />
                      Why you're perfect:
                    </h4>
                    <div className="space-y-2">
                      {opportunity.whyMatched.map((reason, i) => (
                        <div key={i} className="flex items-start text-sm text-green-700">
                          <CheckCircle2 className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                          {reason}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Your Advantages */}
                  <div>
                    <h4 className="font-medium mb-3 flex items-center">
                      <TrendingUp className="h-4 w-4 mr-2 text-blue-600" />
                      Your competitive advantages:
                    </h4>
                    <div className="space-y-2">
                      {opportunity.yourAdvantages.map((advantage, i) => (
                        <div key={i} className="flex items-start text-sm text-blue-700">
                          <CheckCircle2 className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                          {advantage}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Academic Requirements Match */}
                <div className="mb-4">
                  <h4 className="font-medium mb-3 flex items-center">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Academic Requirements:
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {opportunity.academicRequirements.courses.map((course, i) => (
                      <div key={i} className="text-sm">
                        <div className="flex justify-between">
                          <span className="font-medium">{course.name}</span>
                          <span className={
                            course.yourGrade >= course.minGrade 
                              ? 'text-green-600' 
                              : 'text-yellow-600'
                          }>
                            {course.yourGrade}/{course.minGrade}
                          </span>
                        </div>
                        <Progress 
                          value={(course.yourGrade / 30) * 100} 
                          className="h-2 mt-1"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Missing Requirements (if any) */}
                {opportunity.missingRequirements && (
                  <Alert className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <div>
                        <strong>To strengthen your application:</strong>
                        <ul className="mt-1 space-y-1">
                          {opportunity.missingRequirements.map((req, i) => (
                            <li key={i} className="text-sm">• {req}</li>
                          ))}
                        </ul>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                {/* Action Buttons */}
                <div className="flex justify-between items-center">
                  <Button variant="outline">Learn More</Button>
                  <div className="space-x-3">
                    <Button variant="outline">View Company</Button>
                    <Button>
                      Express Interest
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredOpportunities.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-600" />
              <h3 className="text-lg font-medium mb-2">No opportunities in this category</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your filters or complete your profile for more matches
              </p>
              <Button>Complete Profile</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}