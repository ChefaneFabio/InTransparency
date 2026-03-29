'use client'

import { useState } from 'react'
import { Link } from '@/navigation'
import { Logo } from '@/components/layout/Logo'
import { useTranslations } from 'next-intl'
import { useToast } from '@/components/ui/use-toast'
import { trackEvent } from '@/lib/analytics'
import { useSegment } from '@/lib/segment-context'

export function Footer() {
  const t = useTranslations()
  const tNav = useTranslations('nav')
  const tFooter = useTranslations('footer')
  const { toast } = useToast()
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [isSubscribing, setIsSubscribing] = useState(false)
  const { segment } = useSegment()

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      toast({
        title: tFooter('newsletter.invalidTitle'),
        description: tFooter('newsletter.invalidDescription'),
        variant: 'destructive'
      })
      return
    }

    setIsSubscribing(true)

    try {
      await trackEvent({
        eventType: 'WAITLIST_SIGNUP',
        eventName: 'newsletter_signup',
        properties: {
          email: newsletterEmail,
          source: 'footer',
        },
      })

      toast({
        title: tFooter('newsletter.successTitle'),
        description: tFooter('newsletter.successDescription'),
      })
      setNewsletterEmail('')
    } catch (error) {
      toast({
        title: tFooter('newsletter.errorTitle'),
        description: tFooter('newsletter.errorDescription'),
        variant: 'destructive'
      })
    } finally {
      setIsSubscribing(false)
    }
  }

  const navigation = {
    product: [
      { name: tFooter('productLinks.forStudents'), href: '/for-students' },
      { name: tFooter('productLinks.forCompanies'), href: '/for-companies' },
      { name: tFooter('productLinks.forUniversities'), href: '/for-universities' },
      { name: tFooter('productLinks.pricing'), href: '/pricing' },
      { name: tFooter('productLinks.explore'), href: '/explore' },
      { name: tFooter('productLinks.aiDemo'), href: '/demo/ai-search' },
    ],
    resources: [
      { name: tFooter('resourceLinks.howItWorks'), href: '/#how-it-works' },
      { name: tFooter('resourceLinks.faq'), href: '/faq' },
      { name: tFooter('resourceLinks.blog'), href: '/blog' },
      { name: tFooter('resourceLinks.contact'), href: '/contact' },
    ],
    company: [
      { name: tFooter('companyLinks.about'), href: '/about' },
      { name: tFooter('companyLinks.certification'), href: '/certification' },
      { name: tFooter('companyLinks.careers'), href: '/contact?subject=careers' },
    ],
    developers: [
      { name: tFooter('developerLinks.apiOverview'), href: '/developers' },
      { name: tFooter('developerLinks.documentation'), href: '/developers#endpoints' },
      { name: tFooter('developerLinks.apiAccess'), href: '/contact?subject=api-access' },
    ],
    legal: [
      { name: tFooter('privacy'), href: '/privacy' },
      { name: tFooter('terms'), href: '/legal' },
      { name: tFooter('cookies'), href: '/legal#cookies' },
    ]
  }

  return (
    <footer className="border-t border-border bg-foreground text-white relative z-30">
      <div className="container max-w-7xl mx-auto px-4 py-12">
        {/* Top: Logo + columns */}
        <div className="grid grid-cols-2 md:grid-cols-7 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2">
            <Logo size="md" />
            <p className="text-sm text-white/60 mt-3 max-w-xs">
              {tFooter('tagline')}
            </p>
            <div className="flex items-center gap-3 mt-4 text-xs text-white/40">
              <span>{tFooter('compliance.gdpr')}</span>
              <span>·</span>
              <span>{tFooter('compliance.pilotBergamo')}</span>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-white/90 mb-3 text-sm">{tFooter('product')}</h4>
            <ul className="space-y-2">
              {navigation.product.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-white/50 hover:text-white transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-white/90 mb-3 text-sm">{tFooter('resources')}</h4>
            <ul className="space-y-2">
              {navigation.resources.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-white/50 hover:text-white transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-white/90 mb-3 text-sm">{tFooter('company')}</h4>
            <ul className="space-y-2">
              {navigation.company.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-white/50 hover:text-white transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Developers */}
          <div>
            <h4 className="font-semibold text-white/90 mb-3 text-sm">{tFooter('developers')}</h4>
            <ul className="space-y-2">
              {navigation.developers.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-white/50 hover:text-white transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-white/90 mb-3 text-sm">{tFooter('legal')}</h4>
            <ul className="space-y-2">
              {navigation.legal.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-white/50 hover:text-white transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-white/10 pt-6 mb-6">
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row sm:items-center gap-3">
            <span className="text-sm font-medium text-white/80 shrink-0">
              {tFooter('newsletter.title')}
            </span>
            <input
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder={tFooter('newsletter.placeholder')}
              className="flex-1 max-w-xs px-3 py-1.5 bg-white/10 border border-white/20 rounded-md text-sm text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-primary"
              disabled={isSubscribing}
              required
            />
            <button
              type="submit"
              disabled={isSubscribing}
              className="px-4 py-1.5 bg-primary text-white rounded-md text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isSubscribing ? '...' : tFooter('newsletter.subscribe')}
            </button>
          </form>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-white/40">
          <span>{tFooter('copyright')}</span>
          <div className="flex items-center gap-4">
            <a href="mailto:students@intransparency.it" className="hover:text-white transition-colors">
              students@intransparency.it
            </a>
            <a href="mailto:info@intransparency.it" className="hover:text-white transition-colors">
              info@intransparency.it
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
