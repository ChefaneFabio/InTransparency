import { Hero } from '@/components/sections/Hero'
import { CompanyLogos } from '@/components/sections/CompanyLogos'
import { HowItWorks } from '@/components/sections/HowItWorks'
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
        <CompanyLogos />
        <HowItWorks />
        <CTA />
      </main>
      <Footer />
      <PWAInstallBanner />
    </div>
  )
}