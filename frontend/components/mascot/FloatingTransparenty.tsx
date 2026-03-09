'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Transparenty } from './Transparenty'

const moods = ['happy', 'waving', 'thinking', 'excited', 'happy'] as const

export function FloatingTransparenty() {
  const [mood, setMood] = useState<'happy' | 'thinking' | 'waving' | 'sad' | 'excited'>('happy')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Show after scrolling past the hero
    const handleScroll = () => {
      setVisible(window.scrollY > 400)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    let index = 0
    const interval = setInterval(() => {
      index = (index + 1) % moods.length
      setMood(moods[index])
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="fixed bottom-6 right-6 z-40 hidden md:block"
        >
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Transparenty size={56} mood={mood} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
