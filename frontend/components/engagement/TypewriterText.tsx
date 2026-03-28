'use client'

import { useState, useEffect } from 'react'

interface TypewriterTextProps {
  text: string
  speed?: number
  delay?: number
  className?: string
}

export function TypewriterText({
  text,
  speed = 50,
  delay = 0,
  className,
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [isDone, setIsDone] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)

  useEffect(() => {
    const delayTimer = setTimeout(() => {
      setHasStarted(true)
    }, delay)

    return () => clearTimeout(delayTimer)
  }, [delay])

  useEffect(() => {
    if (!hasStarted) return

    let charIndex = 0
    const interval = setInterval(() => {
      charIndex++
      if (charIndex <= text.length) {
        setDisplayedText(text.slice(0, charIndex))
      } else {
        clearInterval(interval)
        setIsDone(true)
      }
    }, speed)

    return () => clearInterval(interval)
  }, [hasStarted, text, speed])

  return (
    <span className={className}>
      {displayedText}
      {!isDone && hasStarted && (
        <span className="typewriter-cursor animate-blink">|</span>
      )}
      <style jsx>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .animate-blink {
          animation: blink 0.7s step-end infinite;
        }
      `}</style>
    </span>
  )
}
