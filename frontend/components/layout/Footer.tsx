'use client'

import { useState } from 'react'
import { Link } from '@/navigation'
import Image from 'next/image'
import { Facebook, Twitter, Linkedin, Github, Instagram, Mail, MapPin, Phone, Shield } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useToast } from '@/components/ui/use-toast'

// Social links - to be added when official profiles are created
const social: { name: string; href: string; icon: typeof Facebook }[] = []

export function Footer() {
  const t = useTranslations()
  const tNav = useTranslations('nav')
  const tFooter = useTranslations('footer')
  const { toast } = useToast()
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [isSubscribing, setIsSubscribing] = useState(false)

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
      // TODO: Replace with actual newsletter API endpoint
      await new Promise(resolve => setTimeout(resolve, 1000))

      toast({
        title: 'Successfully subscribed!',
        description: 'Thank you for subscribing to our newsletter.',
      })
      setNewsletterEmail('')
    } catch (error) {
      toast({
        title: 'Subscription failed',
        description: 'Please try again later.',
        variant: 'destructive'
      })
    } finally {
      setIsSubscribing(false)
    }
  }

  // Navigation structure using translations
  const navigation = {
    product: [
      { name: tNav('features'), href: '/features' },
      { name: tNav('howItWorks'), href: '/how-it-works' },
      { name: tNav('explorePortfolios'), href: '/explore' },
      { name: tNav('successStories'), href: '/success-stories' },
      { name: tNav('pricing'), href: '/pricing' },
    ],
    company: [
      { name: tNav('about'), href: '/about' },
      { name: tNav('contact'), href: '/contact' },
    ],
    legal: [
      { name: tFooter('privacy'), href: '/privacy' },
      { name: tFooter('terms'), href: '/legal' },
      { name: tFooter('cookies'), href: '/legal#cookies' },
    ]
  }
  return (
    <footer className="relative overflow-hidden hero-bg text-foreground/80 border-t border-border">
      <div className="container py-12 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center mb-6">
              <Image
                src="/logo.jpeg"
                alt="InTransparency Logo"
                width={340}
                height={438}
                className="h-16 w-auto"
              />
            </Link>
            <p className="text-slate-600 mb-6 max-w-sm">
              {tFooter('tagline')}
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2 text-sm text-slate-600">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                <a href="mailto:in.transparency.job@gmail.com" className="hover:text-primary transition-colors">
                  in.transparency.job@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Navigation Columns */}
          <div>
            <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-4">
              {tFooter('product')}
            </h3>
            <ul className="space-y-3">
              {navigation.product.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-slate-600 hover:text-primary transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-4">
              {tFooter('company')}
            </h3>
            <ul className="space-y-3">
              {navigation.company.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-slate-600 hover:text-primary transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-600" />
              {tFooter('legal')}
            </h3>
            <ul className="space-y-3">
              {navigation.legal.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`${item.name.includes('GDPR') ? 'text-slate-800 font-semibold' : 'text-slate-600'} hover:text-primary transition-colors`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="border-t border-slate-200 pt-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                {tFooter('newsletter.title')}
              </h3>
              <p className="text-slate-600">
                {tFooter('newsletter.description')}
              </p>
            </div>

            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md w-full md:w-auto">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder={tFooter('newsletter.placeholder')}
                className="flex-1 px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                disabled={isSubscribing}
                required
              />
              <button
                type="submit"
                disabled={isSubscribing}
                className="px-6 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:opacity-90 transition-all whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubscribing ? 'Subscribing...' : tFooter('newsletter.subscribe')}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-4 md:mb-0">
              <p className="text-gray-600 text-sm">
                {tFooter('copyright')}
              </p>

              {/* Additional Links */}
              <div className="flex items-center space-x-6 text-sm">
                <Link href="/privacy" className="text-gray-600 hover:text-primary font-semibold">
                  {tFooter('privacy')}
                </Link>
                <Link href="/legal" className="text-gray-600 hover:text-primary">
                  {tFooter('terms')}
                </Link>
                <Link href="/support" className="text-gray-600 hover:text-primary">
                  {tFooter('support')}
                </Link>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Compliance & Security Badges */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center space-x-6 mb-4 sm:mb-0">
                <div className="flex items-center space-x-2 text-xs text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>{tFooter('compliance.operational')}</span>
                </div>
                <Link href="/privacy" className="text-xs text-gray-600 hover:text-green-600 font-semibold flex items-center gap-1">
                  <Shield className="h-3 w-3 text-green-600" />
                  {tFooter('compliance.gdpr')}
                </Link>
              </div>

              <div className="flex items-center space-x-4 text-xs text-gray-600">
                <span>{tFooter('compliance.poweredBy')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}