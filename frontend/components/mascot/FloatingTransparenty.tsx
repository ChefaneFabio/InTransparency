'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Transparenty } from './Transparenty'
import { ChatbotWidget, ChatbotRole } from '@/components/chat/ChatbotWidget'
import { useSegment, Segment } from '@/lib/segment-context'

const moods = ['happy', 'waving', 'thinking', 'excited', 'happy'] as const

const segmentToChatRole: Record<Segment, ChatbotRole> = {
  students: 'student',
  institutions: 'institution',
  companies: 'company',
}

export function FloatingTransparenty() {
  const [mood, setMood] = useState<'happy' | 'thinking' | 'waving' | 'sad' | 'excited'>('happy')
  const [visible, setVisible] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const { segment } = useSegment()

  useEffect(() => {
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

  // When chat is open, render only the ChatbotWidget (it has its own close button)
  if (chatOpen) {
    return (
      <ChatbotWidget
        userRole={segmentToChatRole[segment]}
        isOpen={true}
        onClose={() => setChatOpen(false)}
      />
    )
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="fixed bottom-6 right-6 z-40"
        >
          <button
            onClick={() => setChatOpen(true)}
            className="cursor-pointer group relative"
            aria-label="Open chat assistant"
          >
            {/* Tooltip */}
            <span className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-foreground text-background text-xs px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
              Chat with Transparenty
            </span>

            {/* Pulse ring */}
            <span className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />

            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Transparenty size={56} mood={mood} />
            </motion.div>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
