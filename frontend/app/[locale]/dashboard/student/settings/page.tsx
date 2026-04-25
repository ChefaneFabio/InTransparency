'use client'

import { useState } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Settings as SettingsIcon, Shield } from 'lucide-react'
import { MetricHero } from '@/components/dashboard/shared/MetricHero'
import StudentSettingsPanel from '@/components/dashboard/student/settings-tabs/GeneralPanel'
import PrivacyPanel from '@/components/dashboard/student/settings-tabs/PrivacyPanel'

type TabKey = 'general' | 'privacy'
const VALID: TabKey[] = ['general', 'privacy']

export default function StudentSettingsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const initial = (searchParams?.get('tab') as TabKey) || 'general'
  const [tab, setTab] = useState<TabKey>(VALID.includes(initial) ? initial : 'general')

  const handleTabChange = (value: string) => {
    const next = value as TabKey
    setTab(next)
    const params = new URLSearchParams(searchParams?.toString() || '')
    params.set('tab', next)
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-6">
      <MetricHero gradient="student">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Your account, preferences, and privacy controls.
        </p>
      </MetricHero>

      <Tabs value={tab} onValueChange={handleTabChange} className="space-y-5">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="general" className="gap-2">
            <SettingsIcon className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="privacy" className="gap-2">
            <Shield className="h-4 w-4" />
            Privacy
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-0">
          <StudentSettingsPanel embedded />
        </TabsContent>
        <TabsContent value="privacy" className="mt-0">
          <PrivacyPanel embedded />
        </TabsContent>
      </Tabs>
    </div>
  )
}
