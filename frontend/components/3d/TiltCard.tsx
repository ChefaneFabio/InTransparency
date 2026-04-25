'use client'

import { useRef, useState, ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

/**
 * Mouse-tracked 3D tilt wrapper. Drop around any card to add depth on hover.
 *
 * Used to reinforce our values:
 *   - Transparency → a faint glare follows the cursor, revealing the
 *     translucent surface beneath instead of hiding behind a solid block.
 *   - Skills/Learning → cards "lift forward" when you engage with them,
 *     so attention itself feels like progress.
 *
 * Honors prefers-reduced-motion (becomes a plain div).
 * Uses framer-motion only — zero new deps.
 */

interface Props {
  children: ReactNode
  /** Max rotation in degrees. Subtle = 6, dramatic = 14. Default 8. */
  intensity?: number
  /** Disable the cursor-following glare. */
  noGlare?: boolean
  className?: string
}

export default function TiltCard({
  children,
  intensity = 8,
  noGlare = false,
  className = '',
}: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 })

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width  // 0..1
    const py = (e.clientY - rect.top) / rect.height  // 0..1
    setTilt({
      x: (py - 0.5) * -intensity * 2,
      y: (px - 0.5) * intensity * 2,
    })
    setGlare({ x: px * 100, y: py * 100, opacity: 0.35 })
  }

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 })
    setGlare(g => ({ ...g, opacity: 0 }))
  }

  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
      animate={{ rotateX: tilt.x, rotateY: tilt.y }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div style={{ transform: 'translateZ(0)' }}>{children}</div>
      {!noGlare && (
        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-200"
          style={{
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,${glare.opacity}), transparent 60%)`,
            mixBlendMode: 'overlay',
          }}
        />
      )}
    </motion.div>
  )
}
