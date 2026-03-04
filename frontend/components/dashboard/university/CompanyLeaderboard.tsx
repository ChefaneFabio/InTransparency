'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Building2 } from 'lucide-react'

interface CompanyLeaderboardProps {
  companies: Array<{
    company: string
    views: number
    contacts: number
    hires: number
  }>
}

export default function CompanyLeaderboard({ companies }: CompanyLeaderboardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-purple-500" />
          Top Recruiting Companies
        </CardTitle>
      </CardHeader>
      <CardContent>
        {companies.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">No recruiter activity yet</p>
        ) : (
          <div className="space-y-3">
            {companies.map((c, i) => (
              <div key={c.company} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-gray-300 w-8 text-center">#{i + 1}</span>
                  <div>
                    <p className="font-medium text-sm">{c.company}</p>
                    <p className="text-xs text-gray-500">{c.views} profile views</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {c.contacts > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {c.contacts} contacts
                    </Badge>
                  )}
                  {c.hires > 0 && (
                    <Badge className="bg-green-100 text-green-700 text-xs">
                      {c.hires} hires
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
