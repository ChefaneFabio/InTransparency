'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/navigation'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Building2,
  Users,
  TrendingUp,
  Target,
  Settings,
  Eye,
  ChevronRight,
  LogOut
} from 'lucide-react'
import { signOut } from 'next-auth/react'
import { useLocale } from 'next-intl'

interface TechParkStats {
  memberCompanies: number
  talentPipeline: number
  recruiterActivity: number
  placements: number
}

interface TechParkBranding {
  logo: string
  parkName: string
}

export default function TechParkDashboard() {
  const t = useTranslations('techparkDashboard')
  const { data: session } = useSession()
  const locale = useLocale()
  const user = session?.user
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<TechParkStats>({
    memberCompanies: 0,
    talentPipeline: 0,
    recruiterActivity: 0,
    placements: 0
  })
  const [branding, setBranding] = useState<TechParkBranding>({ logo: '', parkName: '' })

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, settingsRes] = await Promise.all([
          fetch('/api/dashboard/techpark/stats'),
          fetch('/api/dashboard/techpark/settings'),
        ])
        if (statsRes.ok) {
          const data = await statsRes.json()
          setStats({
            memberCompanies: data.memberCompanyCount ?? 0,
            talentPipeline: data.totalStudents ?? 0,
            recruiterActivity: data.recruiterActivity ?? 0,
            placements: data.placements ?? 0,
          })
        }
        if (settingsRes.ok) {
          const data = await settingsRes.json()
          if (data.settings) {
            setBranding({
              logo: data.settings.logo || '',
              parkName: data.settings.parkName || '',
            })
          }
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchDashboardData()
    } else {
      setLoading(false)
    }
  }, [user])

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-8 pb-12">
        <div className="space-y-2 pt-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-5 w-48" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-4 w-28" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
        <div className="flex items-center gap-4">
          {branding.logo && (
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-primary/20 flex-shrink-0">
              <img
                src={branding.logo}
                alt={branding.parkName || 'Tech Park'}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              {t('welcomeBack')}{user?.firstName ? `, ${user.firstName}` : ''}
            </h1>
            <p className="text-muted-foreground mt-1">
              {t('dashboardSubtitle')}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button asChild>
            <Link href="/dashboard/techpark/talent">
              <Eye className="h-4 w-4 mr-2" />
              {t('viewTalent')}
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard/techpark/companies">
              <Building2 className="h-4 w-4 mr-2" />
              {t('manageCompanies')}
            </Link>
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stats.memberCompanies}</p>
                <p className="text-sm text-muted-foreground">{t('memberCompanies')}</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-lg">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stats.talentPipeline}</p>
                <p className="text-sm text-muted-foreground">{t('talentPipeline')}</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stats.recruiterActivity}</p>
                <p className="text-sm text-muted-foreground">{t('recruiterActivity')}</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stats.placements}</p>
                <p className="text-sm text-muted-foreground">{t('placements.title')}</p>
              </div>
              <div className="p-2 bg-orange-100 rounded-lg">
                <Target className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ecosystem Overview */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{t('ecosystemOverview')}</CardTitle>
                  <CardDescription>
                    {t('ecosystemOverviewDescription')}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">{t('companies.title')}</span>
                  </div>
                  <p className="text-2xl font-bold">{stats.memberCompanies}</p>
                  <p className="text-xs text-muted-foreground mt-1">{t('activeMemberCompanies')}</p>
                </div>
                <div className="p-4 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">{t('talent.title')}</span>
                  </div>
                  <p className="text-2xl font-bold">{stats.talentPipeline}</p>
                  <p className="text-xs text-muted-foreground mt-1">{t('studentsInPipeline')}</p>
                </div>
                <div className="p-4 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">{t('activity')}</span>
                  </div>
                  <p className="text-2xl font-bold">{stats.recruiterActivity}</p>
                  <p className="text-xs text-muted-foreground mt-1">{t('recruiterActionsThisMonth')}</p>
                </div>
                <div className="p-4 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-4 w-4 text-orange-600" />
                    <span className="text-sm font-medium">{t('placements.title')}</span>
                  </div>
                  <p className="text-2xl font-bold">{stats.placements}</p>
                  <p className="text-xs text-muted-foreground mt-1">{t('successfulMatches')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{t('quickActions')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link
                href="/dashboard/techpark/talent"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Eye className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{t('viewTalent')}</p>
                  <p className="text-xs text-muted-foreground">{t('browseTalentPipeline')}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground/60" />
              </Link>

              <Link
                href="/dashboard/techpark/companies"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Building2 className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{t('manageCompanies')}</p>
                  <p className="text-xs text-muted-foreground">{t('viewMemberCompanies')}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground/60" />
              </Link>

              <Link
                href="/dashboard/techpark/settings"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="p-2 bg-muted rounded-lg">
                  <Settings className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{t('settings.title')}</p>
                  <p className="text-xs text-muted-foreground">{t('updateYourProfile')}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground/60" />
              </Link>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{t('parkTip')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground/80 leading-relaxed">
                {t('parkTipText')}
              </p>
            </CardContent>
          </Card>

          {/* Sign out */}
          <button
            onClick={() => signOut({ callbackUrl: `/${locale}` })}
            className="flex items-center gap-2 p-3 rounded-lg hover:bg-red-50 transition-colors w-full text-left border"
          >
            <LogOut className="h-4 w-4 text-red-500" />
            <span className="text-sm font-medium text-red-600">{t('signOut')}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
