'use client'

import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Building, GraduationCap, TrendingUp } from 'lucide-react'

export default function AdminDashboard() {
  const { data: session } = useSession()
  const t = useTranslations('adminDashboard')

  return (
    <div className="min-h-screen space-y-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('title')}</h1>
        <p className="text-muted-foreground mt-1">
          {t('subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-primary" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-foreground">1,234</div>
                <div className="text-sm text-muted-foreground">{t('stats.totalUsers')}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <GraduationCap className="h-8 w-8 text-primary" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-foreground">89</div>
                <div className="text-sm text-muted-foreground">{t('stats.universities')}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Building className="h-8 w-8 text-primary" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-foreground">456</div>
                <div className="text-sm text-muted-foreground">{t('stats.companies')}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-foreground">12,345</div>
                <div className="text-sm text-muted-foreground">{t('stats.connectionsMade')}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('overview.title')}</CardTitle>
          <CardDescription>
            {t('overview.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">{t('overview.comingSoon')}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
