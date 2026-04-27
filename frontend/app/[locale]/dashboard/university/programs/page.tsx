'use client'

import { useState } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MetricHero } from '@/components/dashboard/shared/MetricHero'
import CurriculumPanel from '@/components/dashboard/university/programs/CurriculumPanel'
import CareerPathsPanel from '@/components/dashboard/university/programs/CareerPathsPanel'
import SkillsIntelligencePanel from '@/components/dashboard/university/programs/SkillsIntelligencePanel'
import ExchangesPanel from '@/components/dashboard/university/programs/ExchangesPanel'

type TabKey = 'curriculum' | 'careers' | 'skills' | 'exchanges'
const VALID: TabKey[] = ['curriculum', 'careers', 'skills', 'exchanges']

export default function ProgramsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const initial = (searchParams?.get('tab') as TabKey) || 'curriculum'
  const [tab, setTab] = useState<TabKey>(VALID.includes(initial) ? initial : 'curriculum')

  const handleTabChange = (value: string) => {
    const next = value as TabKey
    setTab(next)
    const params = new URLSearchParams(searchParams?.toString() || '')
    params.set('tab', next)
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="space-y-6">
      <MetricHero gradient="institutionDark">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Programs</h1>
          <p className="text-white/65 mt-2 max-w-2xl">
            Program-level insights: curriculum alignment, career destinations, skills intelligence, and exchanges.
          </p>
        </div>
      </MetricHero>

      <Tabs value={tab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 max-w-3xl">
          <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
          <TabsTrigger value="careers">Career Paths</TabsTrigger>
          <TabsTrigger value="skills">Skills Intelligence</TabsTrigger>
          <TabsTrigger value="exchanges">Exchanges</TabsTrigger>
        </TabsList>

        <TabsContent value="curriculum" className="mt-0">
          <CurriculumPanel embedded />
        </TabsContent>
        <TabsContent value="careers" className="mt-0">
          <CareerPathsPanel embedded />
        </TabsContent>
        <TabsContent value="skills" className="mt-0">
          <SkillsIntelligencePanel embedded />
        </TabsContent>
        <TabsContent value="exchanges" className="mt-0">
          <ExchangesPanel embedded />
        </TabsContent>
      </Tabs>
    </div>
  )
}
