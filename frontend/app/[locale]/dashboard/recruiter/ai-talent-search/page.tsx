'use client'

import { useState } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useLocale } from 'next-intl'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MetricHero } from '@/components/dashboard/shared/MetricHero'
import SearchPanel from '@/components/dashboard/recruiter/ai-search/SearchPanel'
import MatchPanel from '@/components/dashboard/recruiter/ai-search/MatchPanel'
import AdvicePanel from '@/components/dashboard/recruiter/ai-search/AdvicePanel'

type TabKey = 'search' | 'match' | 'advice'

const VALID_TABS: TabKey[] = ['search', 'match', 'advice']

export default function AITalentSearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const locale = useLocale()
  const initialTab = (searchParams?.get('tab') as TabKey) || 'search'
  const [tab, setTab] = useState<TabKey>(
    VALID_TABS.includes(initialTab) ? initialTab : 'search'
  )

  const isIt = locale === 'it'

  const handleTabChange = (value: string) => {
    const next = value as TabKey
    setTab(next)
    const params = new URLSearchParams(searchParams?.toString() || '')
    params.set('tab', next)
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="space-y-6">
      <MetricHero gradient="companyDark">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            {isIt ? 'Ricerca talenti AI' : 'AI Talent Search'}
          </h1>
          <p className="text-white/65 mt-2 max-w-2xl">
            {isIt
              ? 'Trova, abbina e assumi candidati verificati — una workspace unica per ricerca in linguaggio naturale, ranking per offerta e consigli di assunzione. Ogni query è loggata per conformità AI Act.'
              : 'Find, match, and hire verified candidates — one workspace for natural-language search, job-based ranking, and hiring advice. Every query is logged for AI Act compliance.'}
          </p>
        </div>
      </MetricHero>

      <Tabs value={tab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 max-w-2xl">
          <TabsTrigger value="search">
            {isIt ? 'Cerca' : 'Search'}
          </TabsTrigger>
          <TabsTrigger value="match">
            {isIt ? 'Match per offerta' : 'Match to Job'}
          </TabsTrigger>
          <TabsTrigger value="advice">
            {isIt ? 'Consigli' : 'Hiring Advice'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="mt-0">
          <SearchPanel embedded />
        </TabsContent>
        <TabsContent value="match" className="mt-0">
          <MatchPanel embedded />
        </TabsContent>
        <TabsContent value="advice" className="mt-0">
          <AdvicePanel embedded />
        </TabsContent>
      </Tabs>

      <p className="text-[11px] text-muted-foreground text-center">
        {isIt
          ? 'Ogni interazione AI è loggata e soggetta a revisione umana ai sensi dell\'AI Act art. 86.'
          : 'Every AI interaction is logged and subject to human review under AI Act art. 86.'}
      </p>
    </div>
  )
}
