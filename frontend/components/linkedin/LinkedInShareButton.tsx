'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Check, ExternalLink } from 'lucide-react'

interface LinkedInShareButtonProps {
  /** The URL to share */
  url: string
  /** The title/text for the LinkedIn post */
  title?: string
  /** Optional summary text */
  summary?: string
  /** Button variant */
  variant?: 'default' | 'outline' | 'ghost'
  /** Button size */
  size?: 'default' | 'sm' | 'lg'
  /** Additional class names */
  className?: string
}

export function LinkedInShareButton({
  url,
  title,
  summary,
  variant = 'outline',
  size = 'default',
  className = '',
}: LinkedInShareButtonProps) {
  const [shared, setShared] = useState(false)

  const handleShare = () => {
    const shareUrl = new URL('https://www.linkedin.com/sharing/share-offsite/')
    shareUrl.searchParams.set('url', url)

    window.open(shareUrl.toString(), '_blank', 'width=600,height=600')

    setShared(true)
    setTimeout(() => setShared(false), 3000)
  }

  return (
    <Button
      onClick={handleShare}
      variant={variant}
      size={size}
      className={`gap-2 ${className}`}
    >
      {shared ? (
        <>
          <Check className="h-4 w-4" />
          Shared!
        </>
      ) : (
        <>
          <LinkedInIcon className="h-4 w-4" />
          Share on LinkedIn
          <ExternalLink className="h-3 w-3 opacity-60" />
        </>
      )}
    </Button>
  )
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}
