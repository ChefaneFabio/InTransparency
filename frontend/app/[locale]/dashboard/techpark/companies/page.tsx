'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft, Building2, Users, Search, Briefcase } from 'lucide-react'
import { GlassCard } from '@/components/dashboard/shared/GlassCard'

interface Company {
  id: string
  name: string
  industry: string
  employeeCount: number
  studentsHired: number
  status: string
}

const MOCK_COMPANIES: Company[] = [
  { id: '1', name: 'Alpine Software', industry: 'Software Development', employeeCount: 85, studentsHired: 12, status: 'Active' },
  { id: '2', name: 'Dolomiti Data', industry: 'Data Analytics', employeeCount: 42, studentsHired: 7, status: 'Active' },
  { id: '3', name: 'TechAlps IoT', industry: 'IoT / Hardware', employeeCount: 120, studentsHired: 18, status: 'Active' },
  { id: '4', name: 'Green Energy Systems', industry: 'Clean Energy', employeeCount: 65, studentsHired: 5, status: 'Active' },
  { id: '5', name: 'BioTech Innovations', industry: 'Biotechnology', employeeCount: 30, studentsHired: 3, status: 'Pending' },
  { id: '6', name: 'Mountain Robotics', industry: 'Robotics', employeeCount: 55, studentsHired: 9, status: 'Active' },
]

export default function TechParkCompaniesPage() {
  const t = useTranslations('techparkDashboard')
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await fetch('/api/dashboard/techpark/companies')
        if (res.ok) {
          const data = await res.json()
          setCompanies(data.companies ?? [])
        } else {
          setCompanies(MOCK_COMPANIES)
        }
      } catch {
        setCompanies(MOCK_COMPANIES)
      } finally {
        setLoading(false)
      }
    }
    fetchCompanies()
  }, [])

  const filtered = companies.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.industry.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      <div className="flex items-center gap-4 pt-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/techpark">
            <ArrowLeft className="h-4 w-4 mr-1" /> {t('back')}
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold">{t('companies.title')}</h1>
          <p className="text-sm text-muted-foreground">{t('companies.subtitle')}</p>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t('companies.searchPlaceholder')}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}><CardContent className="pt-6"><Skeleton className="h-24 w-full" /></CardContent></Card>
          ))}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(company => (
            <Card key={company.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base">{company.name}</CardTitle>
                  <Badge variant={company.status === 'Active' ? 'default' : 'secondary'}>{company.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{company.industry}</p>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 text-sm">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Users className="h-3.5 w-3.5" />
                    <span>{company.employeeCount} {t('companies.employees')}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Briefcase className="h-3.5 w-3.5" />
                    <span>{company.studentsHired} {t('companies.hired')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              <Building2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>{t('companies.noResults')}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
