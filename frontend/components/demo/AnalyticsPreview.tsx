'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp } from 'lucide-react'

const funnelData = [
  { stage: 'Profiles Viewed', count: 1240, fill: '#3b82f6' },
  { stage: 'Contacted', count: 340, fill: '#8b5cf6' },
  { stage: 'Interviewed', count: 128, fill: '#f59e0b' },
  { stage: 'Hired', count: 47, fill: '#10b981' },
]

const topCompanies = [
  { company: 'Accenture', views: 89, contacts: 12, hires: 3 },
  { company: 'Deloitte', views: 76, contacts: 9, hires: 2 },
  { company: 'Reply', views: 64, contacts: 8, hires: 2 },
  { company: 'NTT Data', views: 52, contacts: 6, hires: 1 },
  { company: 'Brembo', views: 41, contacts: 5, hires: 1 },
]

export default function AnalyticsPreview() {
  return (
    <div className="space-y-4">
      {/* Placement Funnel */}
      <Card className="border-2 border-emerald-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Placement Funnel — Your University
          </CardTitle>
          <p className="text-sm text-gray-600">
            Real-time data: how recruiters engage with your students
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                <YAxis type="category" dataKey="stage" width={120} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Company Leaderboard */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">
            Top Recruiting Companies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {topCompanies.map((c, i) => (
              <div key={c.company} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-gray-400 w-5">#{i + 1}</span>
                  <span className="text-sm font-medium">{c.company}</span>
                </div>
                <div className="flex gap-4 text-xs text-gray-500">
                  <span>{c.views} views</span>
                  <span>{c.contacts} contacts</span>
                  <span className="font-medium text-primary">{c.hires} hires</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
