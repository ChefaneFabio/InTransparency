'use client'

import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from '@/navigation'

const STORAGE_KEY = 'cookieConsent'

export function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      const consent = localStorage.getItem(STORAGE_KEY)
      if (consent !== 'true') {
        setVisible(true)
      }
    } catch {
      // localStorage unavailable
      setVisible(true)
    }
  }, [])

  const accept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'true')
    } catch {
      // localStorage unavailable
    }
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-700 bg-gray-900 text-white"
        >
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 py-3 sm:flex-row sm:gap-4">
            <p className="flex-1 text-center text-sm text-gray-300 sm:text-left">
              We use cookies to improve your experience. By continuing, you agree to our cookie policy.
            </p>
            <div className="flex items-center gap-2">
              <Link
                href="/legal"
                className="rounded-lg border border-gray-600 px-4 py-1.5 text-sm font-medium text-gray-300 transition-colors hover:border-gray-400 hover:text-white"
              >
                Learn More
              </Link>
              <button
                onClick={accept}
                className="rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
              >
                Accept
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
