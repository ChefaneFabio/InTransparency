'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface HireabilityGaugeProps {
  score: number // 0-100
  size?: number
}

export function HireabilityGauge({ score, size = 160 }: HireabilityGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 100)
    return () => clearTimeout(timer)
  }, [score])

  const radius = (size - 20) / 2
  const circumference = Math.PI * radius // Half circle
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference

  const getColor = (s: number) => {
    if (s >= 75) return '#22c55e' // green-500
    if (s >= 50) return '#eab308' // yellow-500
    if (s >= 25) return '#f97316' // orange-500
    return '#ef4444' // red-500
  }

  const getLabel = (s: number) => {
    if (s >= 75) return 'Excellent'
    if (s >= 50) return 'Good'
    if (s >= 25) return 'Developing'
    return 'Getting Started'
  }

  const color = getColor(animatedScore)
  const center = size / 2
  const strokeWidth = 12

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size / 2 + 20} viewBox={`0 0 ${size} ${size / 2 + 20}`}>
        {/* Background arc */}
        <path
          d={`M ${strokeWidth} ${center} A ${radius} ${radius} 0 0 1 ${size - strokeWidth} ${center}`}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Animated arc */}
        <motion.path
          d={`M ${strokeWidth} ${center} A ${radius} ${radius} 0 0 1 ${size - strokeWidth} ${center}`}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
        {/* Score text */}
        <text
          x={center}
          y={center - 10}
          textAnchor="middle"
          className="fill-gray-900 text-3xl font-bold"
          style={{ fontSize: size * 0.2 }}
        >
          {animatedScore}
        </text>
        <text
          x={center}
          y={center + 12}
          textAnchor="middle"
          className="fill-gray-500 text-xs"
          style={{ fontSize: size * 0.075 }}
        >
          / 100
        </text>
      </svg>
      <p className="text-sm font-medium mt-1" style={{ color }}>
        {getLabel(animatedScore)}
      </p>
      <p className="text-xs text-gray-500">Hireability Score</p>
    </div>
  )
}
