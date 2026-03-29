'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, Loader2, Star, GraduationCap } from 'lucide-react'

interface EndorsedStudent {
  studentName: string
  university: string
  projects: Array<{
    title: string
    rating: number | null
    status: string
  }>
}

export default function ProfessorStudentsPage() {
  const t = useTranslations('professorDashboard')
  const { status: authStatus } = useSession()
  const router = useRouter()
  const [students, setStudents] = useState<EndorsedStudent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authStatus === 'loading') return
    if (authStatus === 'unauthenticated') {
      router.push('/auth/login')
      return
    }

    const fetchStudents = async () => {
      try {
        const res = await fetch('/api/professor/endorsements')
        if (res.ok) {
          const data = await res.json()
          // Group endorsements by student
          const studentMap: Record<string, EndorsedStudent> = {}
          for (const e of (data.endorsements || [])) {
            if (!studentMap[e.studentName]) {
              studentMap[e.studentName] = {
                studentName: e.studentName,
                university: e.studentUniversity || '',
                projects: [],
              }
            }
            studentMap[e.studentName].projects.push({
              title: e.projectTitle,
              rating: e.rating,
              status: e.status,
            })
          }
          setStudents(Array.from(Object.values(studentMap)))
        }
      } catch (err) {
        console.error('Failed to load students:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchStudents()
  }, [authStatus, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container max-w-6xl py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('students.title')}</h1>
        <p className="text-muted-foreground mt-1">{t('students.subtitle')}</p>
      </div>

      {students.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
            <p className="text-muted-foreground">{t('students.empty')}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {students.map((student) => (
            <Card key={student.studentName} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{student.studentName}</p>
                    {student.university && (
                      <p className="text-sm text-muted-foreground">{student.university}</p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  {student.projects.map((p, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-foreground/80 truncate mr-2">{p.title}</span>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {p.rating && (
                          <div className="flex items-center gap-0.5">
                            <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                            <span className="text-xs">{p.rating}</span>
                          </div>
                        )}
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            p.status === 'VERIFIED' ? 'text-primary' :
                            p.status === 'PENDING' ? 'text-amber-600' : 'text-muted-foreground'
                          }`}
                        >
                          {p.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
