'use client'

import { useEffect } from 'react'

export function GlowEffect() {
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('.glow-hover')
      if (!target) return
      const rect = (target as HTMLElement).getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100
      ;(target as HTMLElement).style.setProperty('--glow-x', `${x}%`)
      ;(target as HTMLElement).style.setProperty('--glow-y', `${y}%`)
    }

    document.addEventListener('mousemove', handleMouseMove)
    return () => document.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return null
}
