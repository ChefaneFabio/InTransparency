'use client'

import { motion } from 'framer-motion'
import { Badge } from './badge'

interface ShimmerBadgeProps {
  children: React.ReactNode
  className?: string
}

export function ShimmerBadge({ children, className }: ShimmerBadgeProps) {
  return (
    <div className="relative inline-block">
      <Badge className={className}>
        {children}
      </Badge>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
        initial={{ x: '-100%' }}
        animate={{ x: '200%' }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 3,
          ease: "easeInOut"
        }}
        style={{
          maskImage: 'linear-gradient(to right, transparent, black, transparent)',
        }}
      />
    </div>
  )
}
