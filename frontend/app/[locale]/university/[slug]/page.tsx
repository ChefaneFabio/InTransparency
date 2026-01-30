'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  GraduationCap,
  MapPin,
  Users,
  Briefcase,
  Star,
  TrendingUp,
  CheckCircle,
  ExternalLink,
  Mail,
  Building,
  Code,
  Award,
  Eye,
  ChevronRight
} from 'lucide-react'

interface University {
  id: string
  name: string
  slug: string
  type: string
  domain: string
  city: string | null
  region: string | null
  logo: string | null
  website: string | null
  primaryColor: string | null
  studentCount: number
  verifiedStudentCount: number
  projectCount: number
  placementCount: number
}

interface FeaturedStudent {
  id: string
  firstName: string
  lastName: string
  photo: string | null
  tagline: string | null
  program: string | null
  topSkills: string[]
  projectCount: number
  avgScore: number
  featured: boolean
}

interface TopProject {
  id: string
  title: string
  discipline: string
  innovationScore: number | null
  imageUrl: string | null
  studentName: string
}

export default function UniversityShowcasePage() {
  const params = useParams()
  const slug = params.slug as string

  const [university, setUniversity] = useState<University | null>(null)
  const [featuredStudents, setFeaturedStudents] = useState<FeaturedStudent[]>([])
  const [topProjects, setTopProjects] = useState<TopProject[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchUniversityData()
  }, [slug])

  const fetchUniversityData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/university/showcase/${slug}`)

      if (!response.ok) {
        if (response.status === 404) {
          setError('University not found')
        } else {
          setError('Failed to load university')
        }
        return
      }

      const data = await response.json()
      setUniversity(data.university)
      setFeaturedStudents(data.featuredStudents || [])
      setTopProjects(data.topProjects || [])
      setStats(data.stats)
    } catch (err) {
      setError('Failed to load university data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <GraduationCap className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500">Loading university...</p>
        </div>
      </div>
    )
  }

  if (error || !university) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <GraduationCap className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h1 className="text-2xl font-bold mb-2">University Not Found</h1>
          <p className="text-gray-500 mb-4">{error || 'This university page does not exist.'}</p>
          <Link href="/universities">
            <Button>Browse Universities</Button>
          </Link>
        </div>
      </div>
    )
  }

  const primaryColor = university.primaryColor || '#3b82f6'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div
        className="bg-gradient-to-r from-blue-600 to-blue-800 text-white"
        style={{ background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 100%)` }}
      >
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex items-center gap-6">
            {university.logo ? (
              <Image
                src={university.logo}
                alt={university.name}
                width={100}
                height={100}
                className="rounded-xl bg-white p-2"
              />
            ) : (
              <div className="w-24 h-24 rounded-xl bg-white/20 flex items-center justify-center">
                <GraduationCap className="h-12 w-12" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="bg-white/20 text-white border-0">
                  {university.type === 'ITS' ? 'ITS Institute' : 'University'}
                </Badge>
                <Badge variant="secondary" className="bg-green-500/20 text-white border-0">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verified Partner
                </Badge>
              </div>
              <h1 className="text-3xl font-bold mb-2">{university.name}</h1>
              {university.city && (
                <p className="flex items-center gap-2 text-white/80">
                  <MapPin className="h-4 w-4" />
                  {university.city}{university.region ? `, ${university.region}` : ''}, Italy
                </p>
              )}
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold">{university.verifiedStudentCount}</div>
              <div className="text-white/80 text-sm">Verified Students</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold">{university.projectCount}</div>
              <div className="text-white/80 text-sm">Projects</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold">{stats?.avgScore || 0}</div>
              <div className="text-white/80 text-sm">Avg Score</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold">{stats?.placementRate || 0}%</div>
              <div className="text-white/80 text-sm">Placement Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Featured Students Section */}
        {featuredStudents.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Star className="h-6 w-6 text-yellow-500" />
                  Featured Students
                </h2>
                <p className="text-gray-600">Top talent from {university.name}</p>
              </div>
              <Link href={`/students?university=${university.slug}`}>
                <Button variant="outline">
                  View All Students
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {featuredStudents.map((student) => (
                <Link key={student.id} href={`/students/${student.id}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                    <CardContent className="p-6 text-center">
                      <Avatar className="h-20 w-20 mx-auto mb-4">
                        <AvatarImage src={student.photo || undefined} />
                        <AvatarFallback className="text-xl">
                          {student.firstName[0]}{student.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="font-semibold text-lg">
                        {student.firstName} {student.lastName}
                      </h3>
                      {student.tagline && (
                        <p className="text-gray-600 text-sm mb-2">{student.tagline}</p>
                      )}
                      {student.program && (
                        <Badge variant="secondary" className="mb-3">
                          {student.program}
                        </Badge>
                      )}
                      <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          {student.avgScore}/100
                        </span>
                        <span className="flex items-center gap-1">
                          <Code className="h-4 w-4" />
                          {student.projectCount} projects
                        </span>
                      </div>
                      {student.topSkills.length > 0 && (
                        <div className="flex flex-wrap gap-1 justify-center mt-3">
                          {student.topSkills.slice(0, 3).map((skill) => (
                            <Badge key={skill} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Top Projects Section */}
        {topProjects.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Award className="h-6 w-6 text-blue-500" />
                  Top Projects
                </h2>
                <p className="text-gray-600">Best work from our students</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {topProjects.map((project) => (
                <Link key={project.id} href={`/projects/${project.id}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                    {project.imageUrl && (
                      <div className="h-40 bg-gray-100 rounded-t-lg overflow-hidden">
                        <Image
                          src={project.imageUrl}
                          alt={project.title}
                          width={400}
                          height={160}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardContent className="p-4">
                      <Badge variant="secondary" className="mb-2">
                        {project.discipline}
                      </Badge>
                      <h3 className="font-semibold mb-1">{project.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">by {project.studentName}</p>
                      {project.innovationScore && (
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="font-medium">{project.innovationScore}/100</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Why Hire Section */}
        <section className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Why Hire from {university.name}?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Verified Credentials</h4>
                    <p className="text-sm text-gray-600">
                      Every student profile is verified by the institution.
                      No resume fraud, no exaggerated claims.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Quality Projects</h4>
                    <p className="text-sm text-gray-600">
                      AI-analyzed projects with complexity and innovation scores.
                      See real work, not just bullet points.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Award className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Industry-Ready Skills</h4>
                    <p className="text-sm text-gray-600">
                      Curriculum aligned with market demands.
                      Students trained in the skills employers need.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Contact Section */}
        <section>
          <Card className="bg-gradient-to-r from-gray-50 to-gray-100">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-2">Ready to Hire?</h2>
              <p className="text-gray-600 mb-6">
                Contact {university.name} career services or browse available talent
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href={`/students?university=${university.slug}`}>
                  <Button size="lg">
                    <Users className="h-4 w-4 mr-2" />
                    Browse Students
                  </Button>
                </Link>
                <Button variant="outline" size="lg" asChild>
                  <a href={`mailto:careers@${university.domain}`}>
                    <Mail className="h-4 w-4 mr-2" />
                    Contact Career Services
                  </a>
                </Button>
                {university.website && (
                  <Button variant="outline" size="lg" asChild>
                    <a href={university.website} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Visit Website
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>

      {/* Footer Attribution */}
      <div className="bg-white border-t py-6 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>
            Verified by <Link href="/" className="text-blue-600 hover:underline">InTransparency</Link> -
            The platform for verified academic talent
          </p>
        </div>
      </div>
    </div>
  )
}
