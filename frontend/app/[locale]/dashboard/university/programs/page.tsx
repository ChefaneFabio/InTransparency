'use client'

import { useState } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BookOpen, Route, Brain, Globe, GraduationCap } from 'lucide-react'
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
      <MetricHero gradient="dark">
        <div className="flex items-center gap-4">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="p-4 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 border border-white/10"
          >
            <GraduationCap className="h-8 w-8 text-white" />
          </motion.div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Programs</h1>
            <p className="text-white/60 mt-1 max-w-2xl">
              Program-level insights: curriculum alignment, career destinations, skills intelligence, and exchanges.
            </p>
          </div>
        </div>
      </MetricHero>

      <Tabs value={tab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 max-w-3xl">
          <TabsTrigger value="curriculum" className="gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Curriculum</span>
          </TabsTrigger>
          <TabsTrigger value="careers" className="gap-2">
            <Route className="h-4 w-4" />
            <span className="hidden sm:inline">Career Paths</span>
          </TabsTrigger>
          <TabsTrigger value="skills" className="gap-2">
            <Brain className="h-4 w-4" />
            <span className="hidden sm:inline">Skills Intelligence</span>
          </TabsTrigger>
          <TabsTrigger value="exchanges" className="gap-2">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">Exchanges</span>
          </TabsTrigger>
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
