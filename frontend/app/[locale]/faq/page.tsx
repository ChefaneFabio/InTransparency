'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronDown, ChevronUp, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Link } from '@/navigation'

interface FAQItem {
  question: string
  answer: string
  category: string
}

export default function FAQPage() {
  const t = useTranslations('faq')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [openItems, setOpenItems] = useState<number[]>([])

  const faqs: FAQItem[] = [
    // Students
    { category: 'students', question: t('sq1'), answer: t('sa1') },
    { category: 'students', question: t('sq2'), answer: t('sa2') },
    { category: 'students', question: t('sq3'), answer: t('sa3') },
    { category: 'students', question: t('sq4'), answer: t('sa4') },
    { category: 'students', question: t('sq5'), answer: t('sa5') },

    // Companies
    { category: 'companies', question: t('cq1'), answer: t('ca1') },
    { category: 'companies', question: t('cq2'), answer: t('ca2') },
    { category: 'companies', question: t('cq3'), answer: t('ca3') },
    { category: 'companies', question: t('cq4'), answer: t('ca4') },

    // Institutions
    { category: 'universities', question: t('iq1'), answer: t('ia1') },
    { category: 'universities', question: t('iq2'), answer: t('ia2') },
    { category: 'universities', question: t('iq3'), answer: t('ia3') },

    // Payments
    { category: 'payments', question: t('pq1'), answer: t('pa1') },
    { category: 'payments', question: t('pq2'), answer: t('pa2') },
    { category: 'payments', question: t('pq3'), answer: t('pa3') },

    // Privacy
    { category: 'privacy', question: t('prq1'), answer: t('pra1') },
    { category: 'privacy', question: t('prq2'), answer: t('pra2') },
    { category: 'privacy', question: t('prq3'), answer: t('pra3') },
  ]

  const categories = [
    { id: 'all', label: t('categoryAll') },
    { id: 'students', label: t('categoryStudents') },
    { id: 'companies', label: t('categoryCompanies') },
    { id: 'universities', label: t('categoryInstitutions') },
    { id: 'payments', label: t('categoryPayments') },
    { id: 'privacy', label: t('categoryPrivacy') },
  ]

  const toggleItem = (index: number) => {
    setOpenItems(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden bg-foreground text-white">
        <img src="/images/brand/team.jpg" alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-primary/60" />
        <div className="relative container max-w-4xl mx-auto px-4 pt-32 pb-16 lg:pt-36 lg:pb-20 text-center min-h-[420px] flex flex-col justify-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            {t('title')}
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>
      </section>

      <div className="bg-gradient-to-br from-slate-50 via-white to-slate-50 py-10">
      <div className="container max-w-4xl mx-auto px-4">
        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 py-6 text-lg"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {categories.map(category => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.label}
            </Button>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredFaqs.length === 0 ? (
            <Card className="p-8 text-center">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {t('noResults')}
              </h3>
              <p className="text-muted-foreground">
                {t('noResultsHint')}
              </p>
            </Card>
          ) : (
            filteredFaqs.map((faq, index) => (
              <Card key={index} className="overflow-hidden">
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className="capitalize">
                      {categories.find(c => c.id === faq.category)?.label}
                    </Badge>
                    <h3 className="font-semibold text-foreground">{faq.question}</h3>
                  </div>
                  {openItems.includes(index) ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  )}
                </button>
                {openItems.includes(index) && (
                  <CardContent className="pt-0 pb-6 px-6">
                    <div className="pl-4 border-l-2 border-primary/20">
                      <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))
          )}
        </div>

        {/* Contact Section */}
        <Card className="mt-12 p-8 bg-primary/5 border-primary/20">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {t('contactTitle')}
            </h2>
            <p className="text-muted-foreground mb-6">
              {t('contactDescription')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link href="/contact">
                  {t('contactUs')}
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <a href="mailto:info@in-transparency.com">
                  info@in-transparency.com
                </a>
              </Button>
            </div>
          </div>
        </Card>
      </div>
      </div>
      <Footer />
    </div>
  )
}
