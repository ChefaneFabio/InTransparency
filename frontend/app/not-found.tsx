'use client'

import { Transparenty } from '@/components/mascot/Transparenty'
import { Button } from '@/components/ui/button'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <Transparenty size={160} mood="sad" />
        <h1 className="text-6xl font-display font-bold text-foreground mt-6 mb-2">404</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Transparenty looked everywhere but couldn&apos;t find this page.
        </p>
        <div className="flex justify-center gap-3">
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
          <Button asChild>
            <a href="/">
              <Home className="h-4 w-4 mr-2" />
              Home
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}
