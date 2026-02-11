import { Hero } from '@/components/sections/Hero'
import { HowItWorks } from '@/components/sections/HowItWorks'
import { TestimonialsSection } from '@/components/sections/TestimonialsSection'
import { CTA } from '@/components/sections/CTA'
import { BookingSection } from '@/components/sections/BookingSection'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PWAInstallBanner } from '@/components/ui/pwa-install-banner'

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <TestimonialsSection />
        <BookingSection />
        <CTA />
      </main>
      <Footer />
      <PWAInstallBanner />
    </div>
  )
}