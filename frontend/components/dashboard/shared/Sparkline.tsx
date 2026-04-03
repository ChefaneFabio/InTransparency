'use client'

import { LineChart, Line, ResponsiveContainer } from 'recharts'

interface SparklineProps {
  data: number[]
  color?: string
  height?: number
  width?: number
}

export function Sparkline({ data, color, height = 32, width = 80 }: SparklineProps) {
  if (data.length < 2) return null

  const trend = data[data.length - 1] - data[0]
  const lineColor = color || (trend >= 0 ? '#16a34a' : '#e11d48')

  const chartData = data.map((v, i) => ({ v, i }))

  return (
    <div style={{ width, height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <Line
            type="monotone"
            dataKey="v"
            stroke={lineColor}
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={true}
            animationDuration={1000}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
