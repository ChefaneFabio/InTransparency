import { StructuredData } from '@/components/seo/StructuredData'
import { Hero } from '@/components/sections/Hero'
import { TrustMetrics } from '@/components/sections/TrustMetrics'
import { HowItWorks } from '@/components/sections/HowItWorks'
import { ComparisonTable } from '@/components/sections/ComparisonTable'
import { TestimonialsSection } from '@/components/sections/TestimonialsSection'
import { CTA } from '@/components/sections/CTA'
import { BookingSection } from '@/components/sections/BookingSection'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PWAInstallBanner } from '@/components/ui/pwa-install-banner'
import { FloatingTransparenty } from '@/components/mascot/FloatingTransparenty'

export const revalidate = 3600

export default function Home() {
  return (
    <div className="min-h-screen">
      <StructuredData />
      <Header />
      <main id="main-content">
        <Hero />
        <TrustMetrics />
        <HowItWorks />
        <ComparisonTable />
        <TestimonialsSection />
        <BookingSection />
        <CTA />
      </main>
      <Footer />
      <PWAInstallBanner />
      <FloatingTransparenty />
    </div>
  )
}