'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Search, Loader2 } from 'lucide-react'
import { Link } from '@/navigation'
import { useTranslations } from 'next-intl'

export default function TeamCollaborationPage() {
  const t = useTranslations('recruiterTeam')
  const [searchQuery, setSearchQuery] = useState('')

  const comingSoonItems: string[] = [
    t('comingSoon.items.0'),
    t('comingSoon.items.1'),
    t('comingSoon.items.2'),
    t('comingSoon.items.3'),
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground">{t('subtitle')}</p>
      </div>

      {/* Section 1: Team Members */}
      <Card>
        <CardHeader>
          <CardTitle>{t('members.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback>Y</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{t('members.you')}</p>
                <Badge variant="secondary">{t('members.admin')}</Badge>
              </div>
            </div>
            <div className="text-right">
              <Button variant="outline" disabled>
                {t('members.invite')}
              </Button>
              <p className="text-xs text-muted-foreground mt-1">
                {t('members.inviteDesc')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Recent Evaluations */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t('evaluations.title')}</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-lg font-medium text-muted-foreground">
              {t('evaluations.empty')}
            </p>
            <p className="text-sm text-muted-foreground mt-1 max-w-md">
              {t('evaluations.emptyDesc')}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Shared Decision Packs */}
      <Card>
        <CardHeader>
          <CardTitle>{t('sharedPacks.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-lg font-medium text-muted-foreground">
              {t('sharedPacks.empty')}
            </p>
            <p className="text-sm text-muted-foreground mt-1 max-w-md">
              {t('sharedPacks.emptyDesc')}
            </p>
            <Link href="/dashboard/recruiter/decision-pack">
              <Button variant="outline" className="mt-4">
                {t('sharedPacks.viewPacks')}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Section 4: Coming Soon */}
      <Card>
        <CardHeader>
          <CardTitle>{t('comingSoon.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {comingSoonItems.map((item, index) => (
              <li key={index} className="text-sm text-muted-foreground">
                {item}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
