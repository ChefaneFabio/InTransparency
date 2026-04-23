'use client'

import { useState } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Sparkles, Search, Target, Lightbulb, Shield } from 'lucide-react'
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
  const initialTab = (searchParams?.get('tab') as TabKey) || 'search'
  const [tab, setTab] = useState<TabKey>(
    VALID_TABS.includes(initialTab) ? initialTab : 'search'
  )

  const handleTabChange = (value: string) => {
    const next = value as TabKey
    setTab(next)
    const params = new URLSearchParams(searchParams?.toString() || '')
    params.set('tab', next)
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="space-y-6">
      <MetricHero gradient="dark">
        <div className="flex items-center gap-4">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="p-4 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 border border-white/10"
          >
            <Sparkles className="h-8 w-8 text-white" />
          </motion.div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">AI Talent Search</h1>
            <p className="text-white/60 mt-1 max-w-2xl">
              Find, match, and hire verified candidates — one workspace for natural-language search,
              job-based ranking, and hiring advice. Every query is logged for AI Act compliance.
            </p>
          </div>
        </div>
      </MetricHero>

      <Tabs value={tab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 max-w-2xl">
          <TabsTrigger value="search" className="gap-2">
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Search</span>
          </TabsTrigger>
          <TabsTrigger value="match" className="gap-2">
            <Target className="h-4 w-4" />
            <span className="hidden sm:inline">Match to Job</span>
          </TabsTrigger>
          <TabsTrigger value="advice" className="gap-2">
            <Lightbulb className="h-4 w-4" />
            <span className="hidden sm:inline">Hiring Advice</span>
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

      <p className="text-[11px] text-muted-foreground text-center flex items-center justify-center gap-1.5">
        <Shield className="h-3 w-3" />
        Every AI interaction is logged and subject to human review under AI Act art. 86.
      </p>
    </div>
  )
}
