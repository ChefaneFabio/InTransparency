'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FileText, Shield } from 'lucide-react'
import { motion } from 'framer-motion'

export default function LegalPage() {
  const t = useTranslations('legal')
  const [activeTab, setActiveTab] = useState('privacy')

  return (
    <div className="min-h-screen bg-muted">
      <Header />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 bg-primary text-white">
          <div className="container max-w-4xl mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
            <FileText className="h-16 w-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t('hero.title')}
            </h1>
            <p className="text-xl text-white">
              {t('hero.subtitle')}
            </p>
            </motion.div>
          </div>
        </section>

        {/* Legal Content */}
        <section className="py-16">
          <div className="container max-w-4xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="privacy" className="text-lg">
                  <Shield className="h-4 w-4 mr-2" />
                  {t('tabs.privacy')}
                </TabsTrigger>
                <TabsTrigger value="terms" className="text-lg">
                  <FileText className="h-4 w-4 mr-2" />
                  {t('tabs.terms')}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="privacy">
                <Card>
                  <CardContent className="p-8 prose prose-blue max-w-none">
                    <h2 className="text-2xl font-bold text-foreground mb-4">{t('privacy.title')}</h2>
                    <p className="text-sm text-muted-foreground mb-6">{t('privacy.lastUpdated')} October 2025</p>

                    <section className="mb-8">
                      <h3 className="text-xl font-semibold text-foreground mb-3">{t('privacy.sections.collection.title')}</h3>
                      <p className="text-foreground/80 mb-4">
                        {t('privacy.sections.collection.intro')}
                      </p>
                      <ul className="list-disc pl-6 text-foreground/80 space-y-2">
                        <li>{t('privacy.sections.collection.items.0')}</li>
                        <li>{t('privacy.sections.collection.items.1')}</li>
                        <li>{t('privacy.sections.collection.items.2')}</li>
                        <li>{t('privacy.sections.collection.items.3')}</li>
                        <li>{t('privacy.sections.collection.items.4')}</li>
                      </ul>
                    </section>

                    <section className="mb-8">
                      <h3 className="text-xl font-semibold text-foreground mb-3">{t('privacy.sections.usage.title')}</h3>
                      <p className="text-foreground/80 mb-4">
                        {t('privacy.sections.usage.intro')}
                      </p>
                      <ul className="list-disc pl-6 text-foreground/80 space-y-2">
                        <li>{t('privacy.sections.usage.items.0')}</li>
                        <li>{t('privacy.sections.usage.items.1')}</li>
                        <li>{t('privacy.sections.usage.items.2')}</li>
                        <li>{t('privacy.sections.usage.items.3')}</li>
                        <li>{t('privacy.sections.usage.items.4')}</li>
                        <li>{t('privacy.sections.usage.items.5')}</li>
                      </ul>
                    </section>

                    <section className="mb-8">
                      <h3 className="text-xl font-semibold text-foreground mb-3">{t('privacy.sections.sharing.title')}</h3>
                      <p className="text-foreground/80 mb-4">
                        {t('privacy.sections.sharing.intro')}
                      </p>
                      <ul className="list-disc pl-6 text-foreground/80 space-y-2">
                        <li>{t('privacy.sections.sharing.items.0')}</li>
                        <li>{t('privacy.sections.sharing.items.1')}</li>
                        <li>{t('privacy.sections.sharing.items.2')}</li>
                        <li>{t('privacy.sections.sharing.items.3')}</li>
                      </ul>
                    </section>

                    <section className="mb-8">
                      <h3 className="text-xl font-semibold text-foreground mb-3">{t('privacy.sections.rights.title')}</h3>
                      <p className="text-foreground/80 mb-4">
                        {t('privacy.sections.rights.intro')}
                      </p>
                      <ul className="list-disc pl-6 text-foreground/80 space-y-2">
                        <li>{t('privacy.sections.rights.items.0')}</li>
                        <li>{t('privacy.sections.rights.items.1')}</li>
                        <li>{t('privacy.sections.rights.items.2')}</li>
                        <li>{t('privacy.sections.rights.items.3')}</li>
                        <li>{t('privacy.sections.rights.items.4')}</li>
                      </ul>
                    </section>

                    <section className="mb-8">
                      <h3 className="text-xl font-semibold text-foreground mb-3">{t('privacy.sections.security.title')}</h3>
                      <p className="text-foreground/80">
                        {t('privacy.sections.security.intro')}
                      </p>
                    </section>

                    <section className="mb-8">
                      <h3 className="text-xl font-semibold text-foreground mb-3">{t('privacy.sections.contact.title')}</h3>
                      <p className="text-foreground/80">
                        {t('privacy.sections.contact.intro')}{' '}
                        <a href="mailto:institutions@intransparency.it" className="text-primary hover:underline">
                          institutions@intransparency.it
                        </a>
                      </p>
                    </section>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="terms">
                <Card>
                  <CardContent className="p-8 prose prose-blue max-w-none">
                    <h2 className="text-2xl font-bold text-foreground mb-4">{t('terms.title')}</h2>
                    <p className="text-sm text-muted-foreground mb-6">{t('terms.lastUpdated')} October 2025</p>

                    <section className="mb-8">
                      <h3 className="text-xl font-semibold text-foreground mb-3">{t('terms.sections.acceptance.title')}</h3>
                      <p className="text-foreground/80">
                        {t('terms.sections.acceptance.intro')}
                      </p>
                    </section>

                    <section className="mb-8">
                      <h3 className="text-xl font-semibold text-foreground mb-3">{t('terms.sections.accounts.title')}</h3>
                      <p className="text-foreground/80 mb-4">
                        {t('terms.sections.accounts.intro')}
                      </p>
                      <ul className="list-disc pl-6 text-foreground/80 space-y-2">
                        <li>{t('terms.sections.accounts.items.0')}</li>
                        <li>{t('terms.sections.accounts.items.1')}</li>
                        <li>{t('terms.sections.accounts.items.2')}</li>
                        <li>{t('terms.sections.accounts.items.3')}</li>
                      </ul>
                    </section>

                    <section className="mb-8">
                      <h3 className="text-xl font-semibold text-foreground mb-3">{t('terms.sections.content.title')}</h3>
                      <p className="text-foreground/80 mb-4">
                        {t('terms.sections.content.intro')}
                      </p>
                      <ul className="list-disc pl-6 text-foreground/80 space-y-2">
                        <li>{t('terms.sections.content.items.0')}</li>
                        <li>{t('terms.sections.content.items.1')}</li>
                        <li>{t('terms.sections.content.items.2')}</li>
                        <li>{t('terms.sections.content.items.3')}</li>
                        <li>{t('terms.sections.content.items.4')}</li>
                      </ul>
                    </section>

                    <section className="mb-8">
                      <h3 className="text-xl font-semibold text-foreground mb-3">{t('terms.sections.prohibited.title')}</h3>
                      <p className="text-foreground/80">
                        {t('terms.sections.prohibited.intro')}
                      </p>
                    </section>

                    <section className="mb-8">
                      <h3 className="text-xl font-semibold text-foreground mb-3">{t('terms.sections.termination.title')}</h3>
                      <p className="text-foreground/80">
                        {t('terms.sections.termination.intro')}
                      </p>
                    </section>

                    <section className="mb-8">
                      <h3 className="text-xl font-semibold text-foreground mb-3">{t('terms.sections.liability.title')}</h3>
                      <p className="text-foreground/80">
                        {t('terms.sections.liability.intro')}
                      </p>
                    </section>

                    <section className="mb-8">
                      <h3 className="text-xl font-semibold text-foreground mb-3">{t('terms.sections.contact.title')}</h3>
                      <p className="text-foreground/80">
                        {t('terms.sections.contact.intro')}{' '}
                        <a href="mailto:institutions@intransparency.it" className="text-primary hover:underline">
                          institutions@intransparency.it
                        </a>
                      </p>
                    </section>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
