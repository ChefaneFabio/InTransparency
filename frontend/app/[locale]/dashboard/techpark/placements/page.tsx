'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft, Search, CheckCircle, Clock, Target } from 'lucide-react'
import { GlassCard } from '@/components/dashboard/shared/GlassCard'
import { MetricHero } from '@/components/dashboard/shared/MetricHero'

interface Placement {
  id: string
  studentName: string
  companyName: string
  role: string
  startDate: string
  status: 'confirmed' | 'pending' | 'in-progress'
}

const MOCK_PLACEMENTS: Placement[] = [
  { id: '1', studentName: 'Marco Rossi', companyName: 'Alpine Software', role: 'Frontend Developer', startDate: '2026-03-01', status: 'confirmed' },
  { id: '2', studentName: 'Laura Bianchi', companyName: 'Dolomiti Data', role: 'Data Analyst', startDate: '2026-03-15', status: 'confirmed' },
  { id: '3', studentName: 'Stefan Gruber', companyName: 'TechAlps IoT', role: 'Backend Engineer', startDate: '2026-04-01', status: 'in-progress' },
  { id: '4', studentName: 'Anna Mair', companyName: 'Mountain Robotics', role: 'Security Engineer', startDate: '2026-04-15', status: 'pending' },
  { id: '5', studentName: 'Luca Ferretti', companyName: 'TechAlps IoT', role: 'Robotics Engineer', startDate: '2026-02-15', status: 'confirmed' },
  { id: '6', studentName: 'Elena Vitali', companyName: 'Alpine Software', role: 'UX Designer', startDate: '2026-03-10', status: 'in-progress' },
]

const statusConfig = {
  confirmed: { label: 'Confirmed', variant: 'default' as const, icon: CheckCircle },
  'in-progress': { label: 'In Progress', variant: 'secondary' as const, icon: Clock },
  pending: { label: 'Pending', variant: 'outline' as const, icon: Clock },
}

export default function TechParkPlacementsPage() {
  const t = useTranslations('techparkDashboard')
  const [placements, setPlacements] = useState<Placement[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchPlacements = async () => {
      try {
        const res = await fetch('/api/dashboard/techpark/placements')
        if (res.ok) {
          const data = await res.json()
          setPlacements(data.placements ?? [])
        } else {
          setPlacements(MOCK_PLACEMENTS)
        }
      } catch {
        setPlacements(MOCK_PLACEMENTS)
      } finally {
        setLoading(false)
      }
    }
    fetchPlacements()
  }, [])

  const filtered = placements.filter(p =>
    p.studentName.toLowerCase().includes(search.toLowerCase()) ||
    p.companyName.toLowerCase().includes(search.toLowerCase()) ||
    p.role.toLowerCase().includes(search.toLowerCase())
  )

  const confirmed = placements.filter(p => p.status === 'confirmed').length
  const inProgress = placements.filter(p => p.status === 'in-progress').length
  const pending = placements.filter(p => p.status === 'pending').length

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
            <h1 className="text-2xl font-semibold">{t('placements.title')}</h1>
            <p className="text-sm text-muted-foreground">{t('placements.subtitle')}</p>
          </div>
        </div>
      </MetricHero>

      <div className="grid grid-cols-3 gap-4">
        <GlassCard delay={0.1}><div className="p-5 text-center">
          <p className="text-2xl font-bold text-green-600">{confirmed}</p>
          <p className="text-sm text-muted-foreground">{t('placements.confirmed')}</p>
        </div></GlassCard>
        <GlassCard delay={0.15}><div className="p-5 text-center">
          <p className="text-2xl font-bold text-blue-600">{inProgress}</p>
          <p className="text-sm text-muted-foreground">{t('placements.inProgress')}</p>
        </div></GlassCard>
        <GlassCard delay={0.2}><div className="p-5 text-center">
          <p className="text-2xl font-bold text-yellow-600">{pending}</p>
          <p className="text-sm text-muted-foreground">{t('placements.pending')}</p>
        </div></GlassCard>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder={t('placements.searchPlaceholder')} value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}><CardContent className="py-4"><Skeleton className="h-16 w-full" /></CardContent></Card>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(placement => {
            const config = statusConfig[placement.status]
            return (
              <Card key={placement.id} className="hover:shadow-md transition-shadow">
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{placement.studentName}</h3>
                        <Badge variant={config.variant}>{t(`placements.status.${placement.status}`)}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {placement.role} {t('placements.at')} {placement.companyName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t('placements.startDate')}: {new Date(placement.startDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>{t('placements.noResults')}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
