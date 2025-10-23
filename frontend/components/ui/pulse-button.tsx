'use client'

import { motion } from 'framer-motion'
import { Button } from './button'
import { ReactNode } from 'react'

interface PulseButtonProps {
  children: ReactNode
  onClick?: () => void
  className?: string
  size?: 'default' | 'sm' | 'lg' | 'icon'
  variant?: 'default' | 'outline' | 'ghost' | 'link'
  asChild?: boolean
}

export function PulseButton({
  children,
  onClick,
  className = '',
  size = 'default',
  variant = 'default',
  asChild = false
}: PulseButtonProps) {
  return (
    <div className="relative inline-block">
      {/* Pulsing glow effect */}
      <motion.div
        className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-400 to-purple-400 opacity-75 blur-lg"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Button */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative"
      >
        <Button
          onClick={onClick}
          className={`relative z-10 ${className}`}
          size={size}
          variant={variant}
          asChild={asChild}
        >
          {children}
        </Button>
      </motion.div>
    </div>
  )
}
