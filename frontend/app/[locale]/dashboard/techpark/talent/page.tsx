'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft, Users, GraduationCap, Search, Star } from 'lucide-react'
import { GlassCard } from '@/components/dashboard/shared/GlassCard'
import { MetricHero } from '@/components/dashboard/shared/MetricHero'

interface Student {
  id: string
  name: string
  university: string
  field: string
  skills: string[]
  matchScore: number
}

const MOCK_STUDENTS: Student[] = [
  { id: '1', name: 'Marco Rossi', university: 'University of Trento', field: 'Computer Science', skills: ['Python', 'Machine Learning'], matchScore: 92 },
  { id: '2', name: 'Laura Bianchi', university: 'Free University of Bozen', field: 'Data Science', skills: ['R', 'SQL', 'Tableau'], matchScore: 88 },
  { id: '3', name: 'Stefan Gruber', university: 'University of Innsbruck', field: 'Software Engineering', skills: ['Java', 'Spring Boot'], matchScore: 85 },
  { id: '4', name: 'Anna Mair', university: 'University of Trento', field: 'Cybersecurity', skills: ['Network Security', 'Python'], matchScore: 81 },
  { id: '5', name: 'Luca Ferretti', university: 'Politecnico di Milano', field: 'AI & Robotics', skills: ['TensorFlow', 'C++', 'ROS'], matchScore: 79 },
  { id: '6', name: 'Elena Vitali', university: 'University of Padova', field: 'UX Design', skills: ['Figma', 'User Research'], matchScore: 76 },
]

export default function TechParkTalentPage() {
  const t = useTranslations('techparkDashboard')
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchTalent = async () => {
      try {
        const res = await fetch('/api/dashboard/techpark/talent')
        if (res.ok) {
          const data = await res.json()
          setStudents(data.students ?? [])
        } else {
          setStudents(MOCK_STUDENTS)
        }
      } catch {
        setStudents(MOCK_STUDENTS)
      } finally {
        setLoading(false)
      }
    }
    fetchTalent()
  }, [])

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.field.toLowerCase().includes(search.toLowerCase()) ||
    s.skills.some(sk => sk.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      <MetricHero gradient="primary">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/techpark">
              <ArrowLeft className="h-4 w-4 mr-1" /> {t('back')}
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">{t('talent.title')}</h1>
            <p className="text-sm text-muted-foreground">{t('talent.subtitle')}</p>
          </div>
        </div>
      </MetricHero>

      <div className="grid grid-cols-3 gap-4">
        <GlassCard delay={0.1}><div className="p-5 text-center">
          <p className="text-2xl font-bold">{students.length}</p>
          <p className="text-sm text-muted-foreground">{t('talent.totalStudents')}</p>
        </div></GlassCard>
        <GlassCard delay={0.15}><div className="p-5 text-center">
          <p className="text-2xl font-bold">{students.filter(s => s.matchScore >= 80).length}</p>
          <p className="text-sm text-muted-foreground">{t('talent.highMatch')}</p>
        </div></GlassCard>
        <GlassCard delay={0.2}><div className="p-5 text-center">
          <p className="text-2xl font-bold">{new Set(students.map(s => s.university)).size}</p>
          <p className="text-sm text-muted-foreground">{t('talent.universities')}</p>
        </div></GlassCard>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder={t('talent.searchPlaceholder')} value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}><CardContent className="pt-6"><Skeleton className="h-28 w-full" /></CardContent></Card>
          ))}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(student => (
            <Card key={student.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{student.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{student.field}</p>
                  </div>
                  <div className="flex items-center gap-1 text-sm font-medium">
                    <Star className="h-3.5 w-3.5 text-yellow-500" />
                    {student.matchScore}%
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                  <GraduationCap className="h-3 w-3" /> {student.university}
                </p>
                <div className="flex flex-wrap gap-1">
                  {student.skills.map(skill => (
                    <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>{t('talent.noResults')}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
