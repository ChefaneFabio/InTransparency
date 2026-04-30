'use client'

import { useState } from 'react'
import { useLocale } from 'next-intl'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Network, TrendingUp, Sparkles } from 'lucide-react'
import { MetricHero } from '@/components/dashboard/shared/MetricHero'
import SkillGraphPanel from '@/components/dashboard/student/skills/SkillGraphPanel'
import SkillPathPanel from '@/components/dashboard/student/skills/SkillPathPanel'

type TabKey = 'graph' | 'path'
const VALID: TabKey[] = ['graph', 'path']

export default function SkillsPage() {
  const locale = useLocale()
  const isIt = locale === 'it'
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const initial = (searchParams?.get('tab') as TabKey) || 'graph'
  const [tab, setTab] = useState<TabKey>(VALID.includes(initial) ? initial : 'graph')

  const handleTabChange = (value: string) => {
    const next = value as TabKey
    setTab(next)
    const params = new URLSearchParams(searchParams?.toString() || '')
    params.set('tab', next)
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      <MetricHero gradient="student">
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 border border-white/10 flex items-center justify-center"
          >
            <Sparkles className="h-6 w-6 text-primary" />
          </motion.div>
          <div>
            <h1 className="text-2xl font-bold">{isIt ? 'Competenze' : 'Skills'}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {isIt ? 'Il tuo skill graph verificato + un percorso di crescita raccomandato dall\'AI, in un unico spazio.' : 'Your verified skill graph + AI-recommended growth path, in one workspace.'}
            </p>
          </div>
        </div>
      </MetricHero>

      <Tabs value={tab} onValueChange={handleTabChange} className="space-y-5">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="graph" className="gap-2">
            <Network className="h-4 w-4" />
            {isIt ? 'Skill Graph' : 'Skill Graph'}
          </TabsTrigger>
          <TabsTrigger value="path" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            {isIt ? 'Percorso di crescita' : 'Growth Path'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="graph" className="mt-0">
          <SkillGraphPanel embedded />
        </TabsContent>
        <TabsContent value="path" className="mt-0">
          <SkillPathPanel embedded />
        </TabsContent>
      </Tabs>
    </div>
  )
}
