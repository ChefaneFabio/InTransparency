'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'

interface HireabilityGaugeProps {
  score: number
  size?: number
}

export function HireabilityGauge({ score, size = 160 }: HireabilityGaugeProps) {
  const t = useTranslations('skillPath.hireability')
  const [animatedScore, setAnimatedScore] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 100)
    return () => clearTimeout(timer)
  }, [score])

  const radius = (size - 20) / 2
  const circumference = Math.PI * radius
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference

  const getColor = (s: number) => {
    if (s >= 75) return '#22c55e'
    if (s >= 50) return '#eab308'
    if (s >= 25) return '#f97316'
    return '#ef4444'
  }

  const getLabel = (s: number) => {
    if (s >= 75) return t('excellent')
    if (s >= 50) return t('good')
    if (s >= 25) return t('developing')
    return t('gettingStarted')
  }

  const color = getColor(animatedScore)
  const center = size / 2
  const strokeWidth = 12

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size / 2 + 20} viewBox={`0 0 ${size} ${size / 2 + 20}`}>
        <path d={`M ${strokeWidth} ${center} A ${radius} ${radius} 0 0 1 ${size - strokeWidth} ${center}`} fill="none" stroke="currentColor" className="text-muted/30" strokeWidth={strokeWidth} strokeLinecap="round" />
        <motion.path d={`M ${strokeWidth} ${center} A ${radius} ${radius} 0 0 1 ${size - strokeWidth} ${center}`} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeDasharray={circumference} initial={{ strokeDashoffset: circumference }} animate={{ strokeDashoffset }} transition={{ duration: 1.2, ease: 'easeOut' }} />
        <text x={center} y={center - 10} textAnchor="middle" className="fill-foreground font-bold" style={{ fontSize: size * 0.2 }}>{animatedScore}</text>
        <text x={center} y={center + 12} textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: size * 0.075 }}>/ 100</text>
      </svg>
      <p className="text-sm font-medium mt-1" style={{ color }}>{getLabel(animatedScore)}</p>
      <p className="text-xs text-muted-foreground">{t('title')}</p>
    </div>
  )
}
