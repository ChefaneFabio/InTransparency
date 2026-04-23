'use client'

import { useState } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { UserCog, FileText } from 'lucide-react'
import ProfileEditPanel from '@/components/dashboard/student/profile-tabs/ProfileEditPanel'
import CVPanel from '@/components/dashboard/student/profile-tabs/CVPanel'

type TabKey = 'edit' | 'cv'
const VALID: TabKey[] = ['edit', 'cv']

export default function ProfilePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const initial = (searchParams?.get('tab') as TabKey) || 'edit'
  const [tab, setTab] = useState<TabKey>(VALID.includes(initial) ? initial : 'edit')

  const handleTabChange = (value: string) => {
    const next = value as TabKey
    setTab(next)
    const params = new URLSearchParams(searchParams?.toString() || '')
    params.set('tab', next)
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-5">
      <Tabs value={tab} onValueChange={handleTabChange} className="space-y-5">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="edit" className="gap-2">
            <UserCog className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="cv" className="gap-2">
            <FileText className="h-4 w-4" />
            CV / Europass
          </TabsTrigger>
        </TabsList>

        <TabsContent value="edit" className="mt-0">
          <ProfileEditPanel embedded />
        </TabsContent>
        <TabsContent value="cv" className="mt-0">
          <CVPanel embedded />
        </TabsContent>
      </Tabs>
    </div>
  )
}
