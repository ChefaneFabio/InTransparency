'use client'

import { useState, useEffect } from 'react'

const COLORS = [
  '#3b82f6', // blue
  '#10b981', // emerald
  '#8b5cf6', // violet
  '#f59e0b', // amber
  '#f43f5e', // rose
]

interface Particle {
  id: number
  x: number
  y: number
  color: string
  size: number
  rotation: number
  delay: number
  duration: number
  drift: number
}

interface ConfettiEffectProps {
  trigger: boolean
}

export function ConfettiEffect({ trigger }: ConfettiEffectProps) {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    if (!trigger) return

    const newParticles: Particle[] = []
    for (let i = 0; i < 50; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: -10 - Math.random() * 20,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: 6 + Math.random() * 6,
        rotation: Math.random() * 360,
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 1,
        drift: -30 + Math.random() * 60,
      })
    }
    setParticles(newParticles)

    const cleanup = setTimeout(() => {
      setParticles([])
    }, 3000)

    return () => clearTimeout(cleanup)
  }, [trigger])

  if (particles.length === 0) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="confetti-particle absolute"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size * 0.6}px`,
            backgroundColor: p.color,
            borderRadius: '2px',
            transform: `rotate(${p.rotation}deg)`,
            animationName: 'confetti-fall',
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            animationTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            animationFillMode: 'forwards',
            // @ts-expect-error CSS custom property for drift
            '--drift': `${p.drift}px`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) translateX(var(--drift)) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
