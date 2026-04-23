'use client'

import { useState } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Settings as SettingsIcon, FileText, Plug } from 'lucide-react'
import { MetricHero } from '@/components/dashboard/shared/MetricHero'
import RecruiterSettingsPanel from '@/components/dashboard/recruiter/settings-tabs/GeneralPanel'
import DocumentsPanel from '@/components/dashboard/recruiter/settings-tabs/DocumentsPanel'
import { IntegrationsPage } from '@/components/dashboard/shared/IntegrationsPage'

type TabKey = 'general' | 'documents' | 'integrations'
const VALID: TabKey[] = ['general', 'documents', 'integrations']

export default function RecruiterSettingsPage() {
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
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-6">
      <MetricHero gradient="primary">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-muted-foreground">
          Company profile, documents, and integrations.
        </p>
      </MetricHero>

      <Tabs value={tab} onValueChange={handleTabChange} className="space-y-5">
        <TabsList className="grid w-full grid-cols-3 max-w-xl">
          <TabsTrigger value="general" className="gap-2">
            <SettingsIcon className="h-4 w-4" />
            <span className="hidden sm:inline">General</span>
          </TabsTrigger>
          <TabsTrigger value="documents" className="gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Documents</span>
          </TabsTrigger>
          <TabsTrigger value="integrations" className="gap-2">
            <Plug className="h-4 w-4" />
            <span className="hidden sm:inline">Integrations</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-0">
          <RecruiterSettingsPanel embedded />
        </TabsContent>
        <TabsContent value="documents" className="mt-0">
          <DocumentsPanel embedded />
        </TabsContent>
        <TabsContent value="integrations" className="mt-0">
          <IntegrationsPage role="recruiter" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
