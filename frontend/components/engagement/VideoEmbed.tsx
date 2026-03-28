'use client'

import { useState } from 'react'
import { Play } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface VideoEmbedProps {
  thumbnailSrc: string
  title: string
  description?: string
  onClick?: () => void
  iframeSrc?: string
}

export default function VideoEmbed({
  thumbnailSrc,
  title,
  description,
  onClick,
  iframeSrc,
}: VideoEmbedProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  const handleClick = () => {
    if (onClick) {
      onClick()
      return
    }
    if (iframeSrc) {
      setIsPlaying(true)
    }
  }

  return (
    <motion.div
      className="relative w-full overflow-hidden rounded-2xl shadow-lg cursor-pointer group"
      style={{ aspectRatio: '16 / 9' }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      onClick={handleClick}
    >
      <AnimatePresence mode="wait">
        {isPlaying && iframeSrc ? (
          <motion.iframe
            key="video"
            src={iframeSrc}
            title={title}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          />
        ) : (
          <motion.div
            key="thumbnail"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Thumbnail image */}
            <img
              src={thumbnailSrc}
              alt={title}
              className="w-full h-full object-cover"
            />

            {/* Dark gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {/* Play button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-white/90 shadow-xl backdrop-blur-sm"
                animate={{
                  boxShadow: [
                    '0 0 0 0 rgba(255,255,255,0.4)',
                    '0 0 0 20px rgba(255,255,255,0)',
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeOut',
                }}
              >
                <Play className="h-7 w-7 sm:h-8 sm:w-8 text-slate-900 ml-1" fill="currentColor" />
              </motion.div>
            </div>

            {/* Title and description overlay */}
            {(title || description) && (
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                {title && (
                  <h3 className="text-white font-semibold text-base sm:text-lg">
                    {title}
                  </h3>
                )}
                {description && (
                  <p className="text-white/80 text-sm mt-1 line-clamp-2">
                    {description}
                  </p>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
