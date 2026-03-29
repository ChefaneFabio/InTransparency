import { Transparenty } from '@/components/mascot/Transparenty'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/30 px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-8">
          <Transparenty size={160} mood="sad" />
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Page Not Found
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/en"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors"
          >
            Go Home
          </a>
          <a
            href="/en/explore"
            className="inline-flex items-center justify-center px-6 py-3 border border-border text-foreground font-medium rounded-lg hover:bg-muted transition-colors"
          >
            Explore
          </a>
        </div>
      </div>
    </div>
  )
}
