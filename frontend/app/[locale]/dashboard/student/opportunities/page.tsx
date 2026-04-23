'use client'

import { useState } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Briefcase, Target, Sparkles } from 'lucide-react'
import { MetricHero } from '@/components/dashboard/shared/MetricHero'
import JobsPanel from '@/components/dashboard/student/opportunities/JobsPanel'
import RolesPanel from '@/components/dashboard/student/opportunities/RolesPanel'
import MatchesPanel from '@/components/dashboard/student/opportunities/MatchesPanel'

type TabKey = 'all' | 'recommended' | 'matches'

const VALID_TABS: TabKey[] = ['all', 'recommended', 'matches']

export default function OpportunitiesPage() {
  const t = useTranslations('studentOpportunities')
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const initial = (searchParams?.get('tab') as TabKey) || 'all'
  const [tab, setTab] = useState<TabKey>(VALID_TABS.includes(initial) ? initial : 'all')

  const handleTabChange = (value: string) => {
    const next = value as TabKey
    setTab(next)
    const params = new URLSearchParams(searchParams?.toString() || '')
    params.set('tab', next)
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      <MetricHero gradient="blue">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/30 to-blue-500/10 border border-white/10 flex items-center justify-center">
            <Briefcase className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{t('title')}</h1>
            <p className="text-sm text-white/60 mt-0.5 max-w-2xl">{t('subtitle')}</p>
          </div>
        </div>
      </MetricHero>

      <Tabs value={tab} onValueChange={handleTabChange} className="space-y-5">
        <TabsList className="grid w-full grid-cols-3 max-w-xl">
          <TabsTrigger value="all" className="gap-2">
            <Briefcase className="h-4 w-4" />
            <span className="hidden sm:inline">{t('tabAll')}</span>
          </TabsTrigger>
          <TabsTrigger value="recommended" className="gap-2">
            <Target className="h-4 w-4" />
            <span className="hidden sm:inline">{t('tabRecommended')}</span>
          </TabsTrigger>
          <TabsTrigger value="matches" className="gap-2">
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">{t('tabMatches')}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          <JobsPanel embedded />
        </TabsContent>
        <TabsContent value="recommended" className="mt-0">
          <RolesPanel embedded />
        </TabsContent>
        <TabsContent value="matches" className="mt-0">
          <MatchesPanel embedded />
        </TabsContent>
      </Tabs>
    </div>
  )
}
