import { Hero } from '@/components/sections/Hero'
import { TrustIndicators } from '@/components/sections/TrustIndicators'
import { HowItWorks } from '@/components/sections/HowItWorks'
import { TestimonialsSection } from '@/components/sections/TestimonialsSection'
import { CTA } from '@/components/sections/CTA'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PWAInstallBanner } from '@/components/ui/pwa-install-banner'

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <TrustIndicators />
        <HowItWorks />
        <TestimonialsSection />
        <CTA />
      </main>
      <Footer />
      <PWAInstallBanner />
    </div>
  )
}