'use client'

import { motion } from 'framer-motion'

interface TransparentyProps {
  size?: number
  mood?: 'happy' | 'thinking' | 'waving' | 'sad' | 'excited'
  animate?: boolean
  className?: string
}

export function Transparenty({ size = 120, mood = 'happy', animate = true, className = '' }: TransparentyProps) {
  // Eye positions based on mood
  const eyes = {
    happy: { leftY: 0, rightY: 0, squint: false, sparkle: true },
    thinking: { leftY: -1, rightY: 1, squint: false, sparkle: false },
    waving: { leftY: 0, rightY: 0, squint: false, sparkle: true },
    sad: { leftY: 2, rightY: 2, squint: false, sparkle: false },
    excited: { leftY: -1, rightY: -1, squint: false, sparkle: true },
  }

  const currentEyes = eyes[mood]

  // Mouth shapes
  const mouths = {
    happy: 'M 38,58 Q 50,68 62,58',
    thinking: 'M 44,60 Q 50,62 56,60',
    waving: 'M 36,56 Q 50,70 64,56',
    sad: 'M 40,64 Q 50,58 60,64',
    excited: 'M 36,55 Q 50,72 64,55',
  }

  // Blush visibility
  const showBlush = mood === 'happy' || mood === 'waving' || mood === 'excited'

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      initial={animate ? { scale: 0.9, opacity: 0 } : undefined}
      animate={animate ? { scale: 1, opacity: 1 } : undefined}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
    >
      {/* Lens body — soft teal circle with glass effect */}
      <motion.circle
        cx="50"
        cy="44"
        r="32"
        fill="hsl(180, 60%, 88%)"
        stroke="hsl(180, 70%, 35%)"
        strokeWidth="3"
        animate={animate ? { scale: [1, 1.02, 1] } : undefined}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Inner glass shine */}
      <ellipse
        cx="42"
        cy="34"
        rx="12"
        ry="8"
        fill="white"
        opacity="0.35"
      />

      {/* Tiny top highlight */}
      <circle cx="40" cy="28" r="4" fill="white" opacity="0.5" />

      {/* Handle — rounded bottom */}
      <motion.rect
        x="44"
        y="72"
        width="12"
        height="18"
        rx="6"
        fill="hsl(180, 50%, 42%)"
        animate={mood === 'waving' ? { rotate: [0, 8, -8, 0] } : undefined}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '50px 72px' }}
      />

      {/* Handle grip lines */}
      <line x1="48" y1="78" x2="48" y2="85" stroke="hsl(180, 40%, 55%)" strokeWidth="1" strokeLinecap="round" />
      <line x1="52" y1="78" x2="52" y2="85" stroke="hsl(180, 40%, 55%)" strokeWidth="1" strokeLinecap="round" />

      {/* Left eye */}
      <motion.g
        animate={animate ? { y: [0, currentEyes.leftY, 0] } : undefined}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ellipse cx="40" cy="42" rx="4" ry="4.5" fill="hsl(215, 25%, 18%)" />
        <circle cx="41.5" cy="40.5" r="1.5" fill="white" />
        {currentEyes.sparkle && (
          <circle cx="38.5" cy="41" r="0.8" fill="white" opacity="0.7" />
        )}
      </motion.g>

      {/* Right eye */}
      <motion.g
        animate={animate ? { y: [0, currentEyes.rightY, 0] } : undefined}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
      >
        <ellipse cx="60" cy="42" rx="4" ry="4.5" fill="hsl(215, 25%, 18%)" />
        <circle cx="61.5" cy="40.5" r="1.5" fill="white" />
        {currentEyes.sparkle && (
          <circle cx="58.5" cy="41" r="0.8" fill="white" opacity="0.7" />
        )}
      </motion.g>

      {/* Blink animation — eyelids */}
      {animate && (
        <>
          <motion.rect
            x="35" y="37" width="10" height="10" rx="5"
            fill="hsl(180, 60%, 88%)"
            animate={{ scaleY: [0, 0, 1, 0, 0] }}
            transition={{ duration: 4, repeat: Infinity, times: [0, 0.48, 0.5, 0.52, 1] }}
            style={{ transformOrigin: '40px 42px' }}
          />
          <motion.rect
            x="55" y="37" width="10" height="10" rx="5"
            fill="hsl(180, 60%, 88%)"
            animate={{ scaleY: [0, 0, 1, 0, 0] }}
            transition={{ duration: 4, repeat: Infinity, times: [0, 0.48, 0.5, 0.52, 1] }}
            style={{ transformOrigin: '60px 42px' }}
          />
        </>
      )}

      {/* Mouth */}
      <motion.path
        d={mouths[mood]}
        stroke="hsl(215, 25%, 18%)"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        animate={mood === 'excited' ? { d: [mouths.excited, mouths.happy, mouths.excited] } : undefined}
        transition={{ duration: 1, repeat: Infinity }}
      />

      {/* Blush cheeks */}
      {showBlush && (
        <>
          <circle cx="32" cy="50" r="5" fill="hsl(10, 80%, 80%)" opacity="0.4" />
          <circle cx="68" cy="50" r="5" fill="hsl(10, 80%, 80%)" opacity="0.4" />
        </>
      )}

      {/* Waving arm (only for waving mood) */}
      {mood === 'waving' && (
        <motion.g
          animate={{ rotate: [0, 20, -10, 20, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '76px 50px' }}
        >
          <path
            d="M 74,48 Q 82,40 86,34"
            stroke="hsl(180, 50%, 42%)"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
          {/* Little hand */}
          <circle cx="86" cy="33" r="3.5" fill="hsl(180, 60%, 88%)" stroke="hsl(180, 70%, 35%)" strokeWidth="1.5" />
        </motion.g>
      )}
    </motion.svg>
  )
}

// Small inline version for text/badges
export function TransparentyInline({ size = 24, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block ${className}`}
    >
      <circle cx="50" cy="44" r="32" fill="hsl(180, 60%, 88%)" stroke="hsl(180, 70%, 35%)" strokeWidth="3" />
      <ellipse cx="42" cy="34" rx="12" ry="8" fill="white" opacity="0.35" />
      <circle cx="40" cy="28" r="4" fill="white" opacity="0.5" />
      <rect x="44" y="72" width="12" height="18" rx="6" fill="hsl(180, 50%, 42%)" />
      <ellipse cx="40" cy="42" rx="4" ry="4.5" fill="hsl(215, 25%, 18%)" />
      <circle cx="41.5" cy="40.5" r="1.5" fill="white" />
      <ellipse cx="60" cy="42" rx="4" ry="4.5" fill="hsl(215, 25%, 18%)" />
      <circle cx="61.5" cy="40.5" r="1.5" fill="white" />
      <path d="M 38,58 Q 50,68 62,58" stroke="hsl(215, 25%, 18%)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <circle cx="32" cy="50" r="5" fill="hsl(10, 80%, 80%)" opacity="0.4" />
      <circle cx="68" cy="50" r="5" fill="hsl(10, 80%, 80%)" opacity="0.4" />
    </svg>
  )
}
