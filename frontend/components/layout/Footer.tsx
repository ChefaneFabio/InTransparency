import Link from 'next/link'
import { Facebook, Twitter, Linkedin, Github, Instagram, Mail, MapPin, Phone } from 'lucide-react'

const navigation = {
  product: [
    { name: 'Features', href: '#features' },
    { name: 'How it Works', href: '#how-it-works' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'API', href: '/api-docs' },
    { name: 'Integrations', href: '/integrations' },
  ],
  company: [
    { name: 'About', href: '/about' },
    { name: 'Blog', href: '/blog' },
    { name: 'Careers', href: '/careers' },
    { name: 'Press', href: '/press' },
    { name: 'Partners', href: '/partners' },
  ],
  resources: [
    { name: 'Documentation', href: '/docs' },
    { name: 'Help Center', href: '/help' },
    { name: 'Community', href: '/community' },
    { name: 'Webinars', href: '/webinars' },
    { name: 'Status', href: '/status' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
    { name: 'GDPR', href: '/gdpr' },
    { name: 'Security', href: '/security' },
  ],
  support: [
    { name: 'Contact Us', href: '/contact' },
    { name: 'Support Center', href: '/support' },
    { name: 'Bug Reports', href: '/bugs' },
    { name: 'Feature Requests', href: '/feature-requests' },
    { name: 'System Status', href: '/status' },
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
    <footer className="bg-gray-900 text-white">
      <div className="container py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center mb-4">
              <span className="text-2xl font-bold text-white">InTransparency</span>
            </Link>
            <p className="text-gray-400 mb-6 max-w-sm">
              Transform your academic projects into career opportunities with 
              AI-powered analysis, intelligent matching, and professional storytelling.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                <a href="mailto:hello@intransparency.com" className="hover:text-white">
                  hello@intransparency.com
                </a>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                <a href="tel:+1-555-123-4567" className="hover:text-white">
                  +1 (555) 123-4567
                </a>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>

          {/* Navigation Columns */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Product
            </h3>
            <ul className="space-y-3">
              {navigation.product.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              {navigation.company.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Resources
            </h3>
            <ul className="space-y-3">
              {navigation.resources.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Legal
            </h3>
            <ul className="space-y-3">
              {navigation.legal.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-semibold text-white mb-2">
                Stay updated
              </h3>
              <p className="text-gray-400">
                Get the latest updates on new features and career opportunities.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 max-w-md w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-4 md:mb-0">
              <p className="text-gray-400 text-sm">
                © 2024 InTransparency. All rights reserved.
              </p>
              
              {/* Additional Links */}
              <div className="flex items-center space-x-6 text-sm">
                <Link href="/sitemap" className="text-gray-400 hover:text-white">
                  Sitemap
                </Link>
                <Link href="/accessibility" className="text-gray-400 hover:text-white">
                  Accessibility
                </Link>
                <Link href="/privacy-choices" className="text-gray-400 hover:text-white">
                  Privacy Choices
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
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Compliance & Security Badges */}
          <div className="mt-8 pt-8 border-t border-gray-800">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center space-x-6 mb-4 sm:mb-0">
                <div className="flex items-center space-x-2 text-xs text-gray-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>All systems operational</span>
                </div>
                <div className="text-xs text-gray-400">
                  SOC 2 Compliant
                </div>
                <div className="text-xs text-gray-400">
                  GDPR Ready
                </div>
              </div>
              
              <div className="flex items-center space-x-4 text-xs text-gray-400">
                <span>Made with ❤️ in San Francisco</span>
                <span>•</span>
                <span>Powered by AI</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}