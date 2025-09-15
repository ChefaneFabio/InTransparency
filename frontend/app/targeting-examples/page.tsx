'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { MapPin, GraduationCap, Users, Target, CheckCircle2, X, TrendingUp, Building2 } from 'lucide-react'

export default function TargetingExamples() {
  const examples = [
    {
      company: 'Bending Spoons',
      position: 'iOS Developer',
      location: 'Milano',
      type: 'Full-time',
      salary: '€40,000-50,000',
      requirements: {
        fieldsOfStudy: ['Computer Science', 'Computer Engineering', 'Software Engineering'],
        courses: ['Mobile Development', 'iOS Programming', 'User Interface Design'],
        projects: ['iOS App', 'Mobile Application', 'Swift Projects'],
        skills: ['Swift', 'iOS', 'UIKit', 'Xcode']
      },
      targeting: {
        totalReach: 450,
        perfectMatches: 67,
        avgMatchScore: 82,
        universities: [
          { name: 'Politecnico Milano', students: 158, percentage: 35 },
          { name: 'Bocconi University', students: 113, percentage: 25 },
          { name: 'Università Statale', students: 90, percentage: 20 },
          { name: 'Other Universities', students: 89, percentage: 20 }
        ],
        geographic: [
          { area: 'Milano City (0-20km)', students: 180, percentage: 40 },
          { area: 'Milano Metro (20-50km)', students: 135, percentage: 30 },
          { area: 'Lombardy (50-100km)', students: 90, percentage: 20 },
          { area: 'Willing to relocate', students: 45, percentage: 10 }
        ],
        excluded: [
          'Students without mobile development experience',
          'Students >100km without relocation interest', 
          'Non-technical degree programs',
          'Students graduating before 2023'
        ]
      }
    },
    {
      company: 'DataPay Startup',
      position: 'Data Analyst',
      location: 'Torino',
      type: 'Full-time',
      salary: '€32,000-38,000',
      requirements: {
        fieldsOfStudy: ['Economics', 'Engineering', 'Statistics', 'Data Science'],
        courses: ['Statistics', 'Data Analysis', 'Python Programming', 'SQL'],
        projects: ['Data Analysis Project', 'Financial Analysis', 'Database Projects'],
        skills: ['Python', 'SQL', 'Excel', 'Data Visualization']
      },
      targeting: {
        totalReach: 120,
        perfectMatches: 18,
        avgMatchScore: 78,
        universities: [
          { name: 'Politecnico Torino', students: 60, percentage: 50 },
          { name: 'Università di Torino', students: 36, percentage: 30 },
          { name: 'Other Regional Unis', students: 24, percentage: 20 }
        ],
        geographic: [
          { area: 'Torino City (0-20km)', students: 72, percentage: 60 },
          { area: 'Piemonte Region', students: 30, percentage: 25 },
          { area: 'Willing to relocate', students: 18, percentage: 15 }
        ],
        excluded: [
          'Students without data analysis experience',
          'Students outside Piemonte region',
          'Students requiring remote work',
          'Students only interested in large companies'
        ]
      }
    },
    {
      company: 'GitLab',
      position: 'Full-Stack Developer',
      location: 'Remote (EU)',
      type: 'Remote',
      salary: '€45,000-55,000',
      requirements: {
        fieldsOfStudy: ['Computer Science', 'Software Engineering', 'Web Development'],
        courses: ['Web Development', 'Database Systems', 'Software Architecture'],
        projects: ['Full-Stack Application', 'Web Development', 'API Development'],
        skills: ['JavaScript', 'React', 'Node.js', 'Database']
      },
      targeting: {
        totalReach: 2800,
        perfectMatches: 420,
        avgMatchScore: 75,
        universities: [
          { name: 'Italian Universities', students: 1400, percentage: 50 },
          { name: 'Other EU Universities', students: 1400, percentage: 50 }
        ],
        geographic: [
          { area: 'Italy', students: 1400, percentage: 50 },
          { area: 'Rest of EU', students: 1400, percentage: 50 }
        ],
        excluded: [
          'Students without full-stack experience',
          'Students not interested in remote work',
          'Students without English proficiency',
          'Students requiring visa sponsorship'
        ]
      }
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Academic + Geographic Precision Targeting</h1>
          <p className="text-gray-600">
            Real examples of how InTransparency's targeting reaches only qualified, geographically viable candidates
          </p>
        </div>

        {/* Key Benefits */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Precision Targeting</h3>
                <p className="text-sm text-gray-600">
                  Jobs only visible to students with relevant academic background + geographic feasibility
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Quality Applications</h3>
                <p className="text-sm text-gray-600">
                  85%+ application quality vs 15% on traditional job boards
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Faster Hiring</h3>
                <p className="text-sm text-gray-600">
                  2 weeks average time-to-hire vs 6 weeks traditional recruitment
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Examples */}
        <div className="space-y-8">
          {examples.map((example, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      {example.company} - {example.position}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-2">
                      <span className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {example.location}
                      </span>
                      <span>{example.type}</span>
                      <span>{example.salary}</span>
                    </CardDescription>
                  </div>
                  <Badge className="bg-green-100 text-green-800 text-lg px-3 py-1">
                    {example.targeting.totalReach} students
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Requirements & Targeting */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <GraduationCap className="h-4 w-4" />
                        Academic Requirements
                      </h4>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm font-medium text-gray-700">Fields of Study:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {example.requirements.fieldsOfStudy.map((field, j) => (
                              <Badge key={j} variant="outline" className="text-xs">{field}</Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-700">Required Courses:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {example.requirements.courses.map((course, j) => (
                              <Badge key={j} className="bg-blue-100 text-blue-800 text-xs">{course}</Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-700">Project Experience:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {example.requirements.projects.map((project, j) => (
                              <Badge key={j} className="bg-green-100 text-green-800 text-xs">{project}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Key Metrics */}
                    <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{example.targeting.perfectMatches}</div>
                        <div className="text-xs text-gray-600">Perfect Matches</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{example.targeting.avgMatchScore}%</div>
                        <div className="text-xs text-gray-600">Avg Match Score</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{example.targeting.universities.length}</div>
                        <div className="text-xs text-gray-600">Universities</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Geographic & University Distribution */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Geographic Distribution
                      </h4>
                      <div className="space-y-2">
                        {example.targeting.geographic.map((geo, j) => (
                          <div key={j} className="flex items-center justify-between">
                            <span className="text-sm">{geo.area}</span>
                            <div className="flex items-center gap-2">
                              <Progress value={geo.percentage} className="w-16 h-2" />
                              <span className="text-sm w-6">{geo.students}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <GraduationCap className="h-4 w-4" />
                        University Breakdown
                      </h4>
                      <div className="space-y-2">
                        {example.targeting.universities.map((uni, j) => (
                          <div key={j} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm font-medium">{uni.name}</span>
                            <Badge variant="secondary">{uni.students} students</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Exclusions */}
                <div className="mt-6 pt-4 border-t">
                  <h4 className="font-semibold mb-3 text-red-700">Who WON'T See This Job:</h4>
                  <div className="grid md:grid-cols-2 gap-2">
                    {example.targeting.excluded.map((exclusion, j) => (
                      <div key={j} className="flex items-start gap-2 text-sm text-gray-600">
                        <X className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                        {exclusion}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Comparison */}
        <Card className="mt-8 border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle>InTransparency vs Traditional Job Boards</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 text-red-700">Traditional Job Boards ❌</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <X className="h-4 w-4 text-red-500 mt-0.5" />
                    5,000+ applications per job (mostly unqualified)
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="h-4 w-4 text-red-500 mt-0.5" />
                    Students from across the country apply for local jobs
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="h-4 w-4 text-red-500 mt-0.5" />
                    Generic "3+ years experience" requirements
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="h-4 w-4 text-red-500 mt-0.5" />
                    No academic background verification
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="h-4 w-4 text-red-500 mt-0.5" />
                    6+ weeks average time-to-hire
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3 text-green-700">InTransparency Targeting ✓</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                    50-500 highly qualified applications per job
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                    Only geographically viable candidates
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                    Course-based requirements with verified grades
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                    University-verified academic achievements
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                    2 weeks average time-to-hire
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
