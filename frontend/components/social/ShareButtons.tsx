'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Check, Copy, Linkedin, Mail, Twitter } from 'lucide-react'

interface ShareButtonsProps {
  url: string
  title: string
  description?: string
  className?: string
}

export function ShareButtons({ url, title, description, className = '' }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const shareOnLinkedIn = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    window.open(linkedInUrl, '_blank', 'width=600,height=600')
  }

  const shareOnTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
    window.open(twitterUrl, '_blank', 'width=600,height=600')
  }

  const shareViaEmail = () => {
    const subject = encodeURIComponent(title)
    const body = encodeURIComponent(`${description || title}\n\n${url}`)
    window.location.href = `mailto:?subject=${subject}&body=${body}`
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={shareOnLinkedIn}
        className="flex items-center gap-2"
      >
        <Linkedin className="h-4 w-4" />
        LinkedIn
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={shareOnTwitter}
        className="flex items-center gap-2"
      >
        <Twitter className="h-4 w-4" />
        Twitter
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={shareViaEmail}
        className="flex items-center gap-2"
      >
        <Mail className="h-4 w-4" />
        Email
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={copyLink}
        className="flex items-center gap-2"
      >
        {copied ? (
          <>
            <Check className="h-4 w-4" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="h-4 w-4" />
            Copy Link
          </>
        )}
      </Button>
    </div>
  )
}
