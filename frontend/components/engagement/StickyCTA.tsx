'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { Link } from '@/navigation'

interface StickyCTAProps {
  text: string
  href: string
  show: boolean
}

export function StickyCTA({ text, href, show }: StickyCTAProps) {
  const [dismissed, setDismissed] = useState(false)

  const visible = show && !dismissed

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          role="complementary"
          aria-label="Call to action"
          className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-white/80 backdrop-blur-md dark:bg-gray-900/80"
        >
          <div className="mx-auto flex h-14 max-w-7xl items-center justify-center gap-4 px-4">
            <Link
              href={href}
              className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              {text}
            </Link>
            <button
              onClick={() => setDismissed(true)}
              className="rounded-full p-1 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-gray-300"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
