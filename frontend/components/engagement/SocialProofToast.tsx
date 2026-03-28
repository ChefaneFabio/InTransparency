'use client'

import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'

const MESSAGES = [
  { name: 'Marco', initials: 'MA', color: 'bg-blue-500', text: 'Marco from Politecnico di Milano just created a portfolio' },
  { name: 'Accenture', initials: 'AC', color: 'bg-violet-500', text: 'Accenture is searching for Data Science graduates' },
  { name: 'Sofia', initials: 'SO', color: 'bg-emerald-500', text: 'Sofia from UniBo received a job match -- 94% fit' },
  { name: 'Luca', initials: 'LU', color: 'bg-amber-500', text: 'Luca from Sapienza completed a skill verification' },
  { name: 'Deloitte', initials: 'DE', color: 'bg-rose-500', text: 'Deloitte posted 3 new graduate positions' },
  { name: 'Giulia', initials: 'GI', color: 'bg-blue-500', text: 'Giulia from Bocconi shared her verified portfolio' },
  { name: 'Amazon', initials: 'AM', color: 'bg-violet-500', text: 'Amazon is reviewing profiles from Politecnico di Torino' },
  { name: 'Alessandro', initials: 'AL', color: 'bg-emerald-500', text: 'Alessandro from UniPd earned a new skill badge' },
  { name: 'McKinsey', initials: 'MK', color: 'bg-amber-500', text: 'McKinsey matched with 12 candidates today' },
  { name: 'Chiara', initials: 'CH', color: 'bg-rose-500', text: 'Chiara from UniNa received 3 interview invitations' },
]

export function SocialProofToast() {
  const [currentMessage, setCurrentMessage] = useState<typeof MESSAGES[0] | null>(null)
  const [visible, setVisible] = useState(false)
  const [recentlyDismissed, setRecentlyDismissed] = useState(false)

  const showRandomMessage = useCallback(() => {
    if (recentlyDismissed) return
    const index = Math.floor(Math.random() * MESSAGES.length)
    setCurrentMessage(MESSAGES[index])
    setVisible(true)
  }, [recentlyDismissed])

  // Auto-dismiss after 4 seconds
  useEffect(() => {
    if (!visible) return
    const timer = setTimeout(() => {
      setVisible(false)
    }, 4000)
    return () => clearTimeout(timer)
  }, [visible])

  // Show toast on random interval (15-30s)
  useEffect(() => {
    const scheduleNext = () => {
      const delay = 15000 + Math.random() * 15000
      return setTimeout(() => {
        showRandomMessage()
        timerRef = scheduleNext()
      }, delay)
    }

    let timerRef = scheduleNext()
    return () => clearTimeout(timerRef)
  }, [showRandomMessage])

  const dismiss = () => {
    setVisible(false)
    setRecentlyDismissed(true)
    setTimeout(() => setRecentlyDismissed(false), 60000)
  }

  return (
    <AnimatePresence>
      {visible && currentMessage && (
        <motion.div
          initial={{ opacity: 0, y: 20, x: 0 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="fixed bottom-6 left-6 z-40 flex max-w-[calc(100vw-48px)] sm:max-w-sm items-start gap-3 rounded-lg border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-700 dark:bg-gray-800"
        >
          <div
            className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${currentMessage.color}`}
          >
            {currentMessage.initials}
          </div>
          <p className="flex-1 text-sm text-gray-700 dark:text-gray-300">
            {currentMessage.text}
          </p>
          <button
            onClick={dismiss}
            className="flex-shrink-0 rounded p-0.5 text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-200"
            aria-label="Dismiss notification"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
