'use client'

import { useState } from 'react'
import { Link } from '@/navigation'
import { Facebook, Linkedin, Shield } from 'lucide-react'
import { Logo } from '@/components/layout/Logo'
import { useTranslations } from 'next-intl'
import { useToast } from '@/components/ui/use-toast'
import { trackEvent } from '@/lib/analytics'
import { useSegment } from '@/lib/segment-context'

// Social links - to be added when official profiles are created
const social: { name: string; href: string; icon: typeof Facebook }[] = []

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
        title: 'Invalid email',
        description: 'Please enter a valid email address',
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

  // Navigation structure — product links adapt to segment
  const productBySegment = {
    students: [
      { name: tNav('highSchoolStudents'), href: '/students/high-school' },
      { name: tNav('itsStudents'), href: '/students/its' },
      { name: tNav('universityStudents'), href: '/students/university' },
      { name: tNav('explorePortfolios'), href: '/explore' },
      { name: tNav('aiJobSearch'), href: '/demo/ai-search' },
    ],
    institutions: [
      { name: tNav('howItWorks'), href: '/for-academic-partners' },
      { name: tNav('forHighSchools'), href: '/per-scuole-superiori' },
      { name: tNav('forITS'), href: '/for-its-institutes' },
      { name: tNav('forUniversities'), href: '/per-universita' },
      { name: tNav('pricing'), href: '/pricing' },
    ],
    companies: [
      { name: tNav('howItWorks'), href: '/for-companies' },
      { name: tNav('searchTalent'), href: '/explore' },
      { name: tNav('aiJobSearch'), href: '/demo/ai-search' },
      { name: tNav('pricing'), href: '/pricing' },
    ],
  }
  const navigation = {
    product: productBySegment[segment],
    company: [
      { name: tNav('about'), href: '/about' },
      { name: tNav('mission'), href: '/mission' },
      { name: tFooter('blog'), href: '/blog' },
      { name: tNav('contact'), href: '/contact' },
    ],
    legal: [
      { name: tFooter('privacy'), href: '/privacy' },
      { name: tFooter('terms'), href: '/legal' },
      { name: tFooter('cookies'), href: '/legal#cookies' },
    ]
  }
  return (
    <footer className="border-t border-border bg-muted/30 relative z-30">
      <div className="container py-8">
        {/* Top row: brand + nav links inline */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-6">
          <div className="flex items-center gap-4">
            <Logo size="md" />
            <p className="text-sm text-muted-foreground max-w-xs hidden sm:block">
              {tFooter('tagline')}
            </p>
          </div>

          <div className="flex flex-wrap gap-x-8 gap-y-4 text-sm">
            <div>
              <h4 className="font-medium text-foreground mb-2">{tFooter('product')}</h4>
              <ul className="space-y-1">
                {navigation.product.map((item) => (
                  <li key={item.name}>
                    <Link href={item.href} className="relative z-10 inline-block text-muted-foreground hover:text-primary transition-colors cursor-pointer underline-offset-2 hover:underline">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-2">{tFooter('company')}</h4>
              <ul className="space-y-1">
                {navigation.company.map((item) => (
                  <li key={item.name}>
                    <Link href={item.href} className="relative z-10 inline-block text-muted-foreground hover:text-primary transition-colors cursor-pointer underline-offset-2 hover:underline">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-2">{tFooter('legal')}</h4>
              <ul className="space-y-1">
                {navigation.legal.map((item) => (
                  <li key={item.name}>
                    <Link href={item.href} className="relative z-10 inline-block text-muted-foreground hover:text-primary transition-colors cursor-pointer underline-offset-2 hover:underline">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Newsletter — compact inline */}
        <div className="border-t border-border pt-5 mb-5">
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row sm:items-center gap-3">
            <span className="text-sm font-medium text-foreground shrink-0">
              {tFooter('newsletter.title')}
            </span>
            <input
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder={tFooter('newsletter.placeholder')}
              className="flex-1 max-w-xs px-3 py-1.5 bg-background border border-border rounded-md text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              disabled={isSubscribing}
              required
            />
            <button
              type="submit"
              disabled={isSubscribing}
              className="px-4 py-1.5 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isSubscribing ? '...' : tFooter('newsletter.subscribe')}
            </button>
          </form>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>{tFooter('copyright')}</span>
            <span className="flex items-center gap-1">
              <Shield className="h-3 w-3 text-primary" />
              {tFooter('compliance.gdpr')}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a href="mailto:students@intransparency.it" className="hover:text-primary transition-colors">
              students@intransparency.it
            </a>
            {social.map((item) => (
              <a
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                <span className="sr-only">{item.name}</span>
                <item.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}