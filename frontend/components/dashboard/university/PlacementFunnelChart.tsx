'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { TrendingUp } from 'lucide-react'

interface PlacementFunnelChartProps {
  funnel: {
    viewed: number
    contacted: number
    interviewed: number
    hired: number
  }
  timeToHire: {
    averageDays: number
    dataPoints: number
  }
}

const COLORS = ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981']

export default function PlacementFunnelChart({ funnel, timeToHire }: PlacementFunnelChartProps) {
  const data = [
    { stage: 'Viewed', count: funnel.viewed },
    { stage: 'Contacted', count: funnel.contacted },
    { stage: 'Interviewed', count: funnel.interviewed },
    { stage: 'Hired', count: funnel.hired },
  ]

  const conversionRate = funnel.viewed > 0
    ? ((funnel.hired / funnel.viewed) * 100).toFixed(1)
    : '0'

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-500" />
          Placement Funnel
        </CardTitle>
        <div className="flex gap-6 text-sm text-gray-600">
          <span>Conversion: <strong className="text-green-600">{conversionRate}%</strong></span>
          {timeToHire.dataPoints > 0 && (
            <span>Avg. time to hire: <strong>{timeToHire.averageDays} days</strong></span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="stage" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
