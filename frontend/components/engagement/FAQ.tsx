'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
}

interface FAQProps {
  items: FAQItem[]
}

export const FAQ = ({ items }: FAQProps) => {
  const [openIndices, setOpenIndices] = useState<Set<number>>(new Set())

  const toggle = (index: number) => {
    setOpenIndices((prev) => {
      const next = new Set(Array.from(prev))
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  return (
    <div className="mx-auto max-w-3xl divide-y divide-slate-100">
      {items.map((item, i) => {
        const isOpen = openIndices.has(i)
        return (
          <div key={i} className="py-1">
            <button
              onClick={() => toggle(i)}
              className="flex w-full items-center justify-between gap-4 rounded-lg px-2 py-4 text-left transition-colors hover:bg-slate-50"
            >
              <span className="text-base font-medium text-slate-900 sm:text-lg">
                {item.question}
              </span>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="shrink-0"
              >
                <ChevronDown className="h-5 w-5 text-slate-400" />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <p className="px-2 pb-4 text-sm leading-relaxed text-slate-500 sm:text-base">
                    {item.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
