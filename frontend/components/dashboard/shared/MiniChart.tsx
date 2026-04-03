'use client'

import { AreaChart, Area, BarChart, Bar, ResponsiveContainer } from 'recharts'

interface MiniAreaProps {
  data: number[]
  color?: string
  height?: number
}

export function MiniArea({ data, color, height = 40 }: MiniAreaProps) {
  if (data.length < 2) return null
  const trend = data[data.length - 1] - data[0]
  const fill = color || (trend >= 0 ? '#16a34a' : '#e11d48')
  const chartData = data.map((v, i) => ({ v, i }))

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={`grad-${fill.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={fill} stopOpacity={0.3} />
              <stop offset="100%" stopColor={fill} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="v"
            stroke={fill}
            strokeWidth={1.5}
            fill={`url(#grad-${fill.replace('#', '')})`}
            dot={false}
            isAnimationActive={true}
            animationDuration={1200}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

interface MiniBarProps {
  data: number[]
  color?: string
  height?: number
}

export function MiniBar({ data, color = 'hsl(var(--primary))', height = 40 }: MiniBarProps) {
  if (data.length < 1) return null
  const chartData = data.map((v, i) => ({ v, i }))

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <BarChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <Bar dataKey="v" fill={color} radius={[2, 2, 0, 0]} isAnimationActive={true} animationDuration={800} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
