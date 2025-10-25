import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Twitter, Linkedin, Github, Instagram, Mail, MapPin, Phone, Shield } from 'lucide-react'

const navigation = {
  product: [
    { name: 'Features', href: '/features' },
    { name: 'How it Works', href: '/how-it-works' },
    { name: 'Pricing', href: '/pricing' },
  ],
  company: [
    { name: 'About', href: '/about' },
    { name: 'Contact & Support', href: '/contact' },
  ],
  legal: [
    { name: 'Privacy & GDPR', href: '/privacy' },
    { name: 'Terms of Service', href: '/legal' },
    { name: 'Cookie Policy', href: '/legal#cookies' },
  ]
}

const social = [
  {
    name: 'Facebook',
    href: 'https://facebook.com/intransparency',
    icon: Facebook,
  },
  {
    name: 'Instagram',
    href: 'https://instagram.com/intransparency',
    icon: Instagram,
  },
  {
    name: 'Twitter',
    href: 'https://twitter.com/intransparency',
    icon: Twitter,
  },
  {
    name: 'GitHub',
    href: 'https://github.com/intransparency',
    icon: Github,
  },
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com/company/intransparency',
    icon: Linkedin,
  },
]

export function Footer() {
  return (
    <footer className="relative overflow-hidden hero-bg text-foreground/80 border-t border-border">
      <div className="container py-12 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center mb-6">
              <Image
                src="/logo.png"
                alt="InTransparency Logo"
                width={220}
                height={70}
                className="h-16 w-auto"
              />
            </Link>
            <p className="text-slate-600 mb-6 max-w-sm">
              Transform your academic projects into career opportunities with 
              AI-powered analysis, intelligent matching, and professional storytelling.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2 text-sm text-slate-600">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                <a href="mailto:hello@intransparency.com" className="hover:text-primary transition-colors">
                  hello@intransparency.com
                </a>
              </div>
            </div>
          </div>

          {/* Navigation Columns */}
          <div>
            <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-4">
              Product
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
              Company
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
              Legal & Privacy
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
                Stay updated
              </h3>
              <p className="text-slate-600">
                Get the latest updates on new features and career opportunities.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 max-w-md w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button className="px-6 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:opacity-90 transition-all whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-4 md:mb-0">
              <p className="text-gray-600 text-sm">
                © 2024 InTransparency. All rights reserved.
              </p>
              
              {/* Additional Links */}
              <div className="flex items-center space-x-6 text-sm">
                <Link href="/privacy" className="text-gray-600 hover:text-primary font-semibold">
                  Privacy & GDPR
                </Link>
                <Link href="/legal" className="text-gray-600 hover:text-primary">
                  Terms
                </Link>
                <Link href="/support" className="text-gray-600 hover:text-primary">
                  Support
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
                  <span>All systems operational</span>
                </div>
                <Link href="/privacy" className="text-xs text-gray-600 hover:text-green-600 font-semibold flex items-center gap-1">
                  <Shield className="h-3 w-3 text-green-600" />
                  GDPR Compliant
                </Link>
                <div className="text-xs text-gray-600">
                  SOC 2 Type II
                </div>
                <div className="text-xs text-gray-600">
                  ISO 27001
                </div>
              </div>

              <div className="flex items-center space-x-4 text-xs text-gray-600">
                <span>Powered by AI</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}