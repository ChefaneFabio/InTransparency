'use client'

import { Transparenty } from '@/components/mascot/Transparenty'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/30 px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-8">
          <Transparenty size={160} mood="thinking" />
        </div>
        <h1 className="text-4xl font-display font-bold text-foreground mb-4">
          Something went wrong
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          An unexpected error occurred. Please try again or return to the homepage.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
          <a
            href="/en"
            className="inline-flex items-center justify-center px-6 py-3 border border-border text-foreground font-medium rounded-lg hover:bg-muted transition-colors"
          >
            Go Home
          </a>
        </div>
      </div>
    </div>
  )
}
