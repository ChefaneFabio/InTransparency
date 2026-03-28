'use client'

import { useEffect, useRef } from 'react'
import {
  useInView,
  useMotionValue,
  useTransform,
  animate,
  motion,
} from 'framer-motion'

interface AnimatedCounterProps {
  value: number
  suffix?: string
  duration?: number
  className?: string
}

export function AnimatedCounter({
  value,
  suffix = '',
  duration = 2000,
  className,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const motionValue = useMotionValue(0)
  const rounded = useTransform(motionValue, (latest) => {
    return Intl.NumberFormat('en-US').format(Math.round(latest))
  })
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  useEffect(() => {
    if (isInView) {
      animate(motionValue, value, {
        duration: duration / 1000,
        ease: 'easeOut',
      })
    }
  }, [isInView, motionValue, value, duration])

  return (
    <span ref={ref} className={className}>
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  )
}
