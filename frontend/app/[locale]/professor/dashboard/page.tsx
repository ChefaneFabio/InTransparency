'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  GraduationCap,
  CheckCircle,
  Clock,
  AlertCircle,
  User,
  Award,
  ExternalLink,
  History,
} from 'lucide-react'

interface Endorsement {
  id: string
  verificationToken: string
  studentName: string
  studentPhoto: string | null
  studentDegree: string | null
  studentUniversity: string | null
  projectId: string
  projectTitle: string
  projectDescription: string | null
  courseName: string | null
  semester: string | null
  createdAt: string
  daysWaiting: number
}

interface HistoryItem {
  id: string
  status: string
  studentName: string
  projectTitle: string
  rating: number | null
  grade: string | null
  skills: string[]
  verifiedAt: string | null
}

interface DashboardData {
  professor: { name: string; email: string; university: string }
  stats: { pending: number; verified: number; declined: number; total: number }
  pending: Endorsement[]
  history: HistoryItem[]
}

export default function ProfessorDashboardPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <ProfessorDashboard />
    </Suspense>
  )
}

function ProfessorDashboard() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) {
      setError('missing-token')
      setLoading(false)
      return
    }
    fetch(`/api/professor/dashboard?token=${encodeURIComponent(token)}`)
      .then(async r => {
        if (!r.ok) {
          const body = await r.json().catch(() => ({}))
          throw new Error(body.error || 'Failed')
        }
        return r.json()
      })
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [token])

  if (loading) return <PageSkeleton />

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container max-w-3xl mx-auto px-4 pt-32 pb-16">
          <Card>
            <CardContent className="pt-6 flex gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Access link required</h3>
                <p className="text-sm text-muted-foreground">
                  Professor dashboards open via the endorsement-request link from your email. If
                  your link expired, ask the student to send a fresh one.
                </p>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-4xl mx-auto px-4 pt-32 pb-16">
        <div className="mb-6">
          <Badge variant="outline" className="mb-2">
            <GraduationCap className="h-3 w-3 mr-1" />
            Professor portal
          </Badge>
          <h1 className="text-3xl font-bold mb-1">Welcome, {data.professor.name}</h1>
          <p className="text-muted-foreground">
            {data.professor.university} · {data.professor.email}
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-amber-600">{data.stats.pending}</div>
              <div className="text-xs text-muted-foreground">Awaiting your response</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-emerald-600">{data.stats.verified}</div>
              <div className="text-xs text-muted-foreground">Endorsed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-muted-foreground">{data.stats.declined}</div>
              <div className="text-xs text-muted-foreground">Declined</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold">{data.stats.total}</div>
              <div className="text-xs text-muted-foreground">Total requests</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="pending">
          <TabsList>
            <TabsTrigger value="pending">
              <Clock className="h-3 w-3 mr-1" />
              Pending ({data.stats.pending})
            </TabsTrigger>
            <TabsTrigger value="history">
              <History className="h-3 w-3 mr-1" />
              History ({data.history.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-4 space-y-3">
            {data.pending.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center py-12">
                  <CheckCircle className="h-10 w-10 mx-auto text-emerald-500 mb-3" />
                  <h3 className="font-semibold mb-1">All caught up</h3>
                  <p className="text-sm text-muted-foreground">
                    No pending endorsements. Students will notify you when they request one.
                  </p>
                </CardContent>
              </Card>
            ) : (
              data.pending.map(e => (
                <Card key={e.id}>
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-start gap-4">
                      {e.studentPhoto ? (
                        <img src={e.studentPhoto} alt="" className="w-12 h-12 rounded-full object-cover" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                          <User className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{e.studentName}</h3>
                          {e.daysWaiting > 5 && (
                            <Badge variant="destructive" className="text-xs">
                              {e.daysWaiting}d waiting
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground mb-2">
                          {e.studentDegree && <>{e.studentDegree} · </>}
                          {e.studentUniversity}
                        </div>
                        <div className="mb-2">
                          <div className="font-medium text-sm">{e.projectTitle}</div>
                          {e.projectDescription && (
                            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                              {e.projectDescription}
                            </p>
                          )}
                          {(e.courseName || e.semester) && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {e.courseName}
                              {e.courseName && e.semester && ' · '}
                              {e.semester}
                            </div>
                          )}
                        </div>
                      </div>
                      <Button size="sm" asChild>
                        <a href={`/endorsements/verify/${e.verificationToken}`}>
                          Review
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="history" className="mt-4 space-y-3">
            {data.history.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center py-8">
                  <History className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">No history yet.</p>
                </CardContent>
              </Card>
            ) : (
              data.history.map(h => (
                <Card key={h.id}>
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-start gap-3">
                      <Award
                        className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                          h.status === 'VERIFIED' ? 'text-emerald-600' : 'text-muted-foreground'
                        }`}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-sm">{h.studentName}</h3>
                          <Badge
                            variant={h.status === 'VERIFIED' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {h.status}
                          </Badge>
                          {h.rating && <Badge variant="outline" className="text-xs">{h.rating}/5</Badge>}
                          {h.grade && <Badge variant="outline" className="text-xs">Grade {h.grade}</Badge>}
                        </div>
                        <div className="text-sm text-muted-foreground">{h.projectTitle}</div>
                        {h.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {h.skills.slice(0, 8).map(s => (
                              <Badge key={s} variant="secondary" className="text-xs">
                                {s}
                              </Badge>
                            ))}
                          </div>
                        )}
                        {h.verifiedAt && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {new Date(h.verifiedAt).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  )
}

function PageSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-4xl mx-auto px-4 pt-32 pb-16 space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-96 w-full" />
      </main>
      <Footer />
    </div>
  )
}
