'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  ArrowRight,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from '@/navigation'

type Stakeholder = 'student' | 'university' | 'company'

export default function PrivacyPage() {
  const t = useTranslations('privacy')
  const [selectedStakeholder, setSelectedStakeholder] = useState<Stakeholder>('student')

  const dataAccessLevels = {
    student: {
      title: 'Student Data Control',
      description: 'You own your data. You decide what to share and when.',
      controls: [
        { action: 'View all your data', available: true },
        { action: 'Download your data (JSON/PDF)', available: true },
        { action: 'Delete your account anytime', available: true },
        { action: 'Control profile visibility', available: true },
        { action: 'Choose what companies see', available: true },
        { action: 'Revoke university verification', available: true },
      ],
      dataShared: [
        { with: 'University', data: 'Academic records, courses, grades, projects', purpose: 'Verification only', consent: 'Required' },
        { with: 'Companies (Before Unlock)', data: 'Initials only (M.R.), university, courses, grades, skills', purpose: 'Searchable profile', consent: 'Automatic when profile is public' },
        { with: 'Companies (After Unlock)', data: 'Full name, email, phone, LinkedIn', purpose: 'Contact for opportunities', consent: 'Automatic when company pays to unlock' },
      ]
    },
    university: {
      title: 'University Data Access',
      description: 'Limited access for verification purposes only.',
      controls: [
        { action: 'Verify student enrollment', available: true },
        { action: 'Verify academic records', available: true },
        { action: 'See career outcomes (aggregated)', available: true },
        { action: 'Export student names/emails', available: false },
        { action: 'Share data with third parties', available: false },
        { action: 'Access student without consent', available: false },
      ],
      dataShared: [
        { with: 'Platform', data: 'Student enrollment status, course catalogs, grade verification', purpose: 'Platform operation', consent: 'University agreement' },
        { with: 'Students', data: 'Verification status, university branding', purpose: 'Profile credibility', consent: 'Automatic' },
        { with: 'Companies', data: 'Aggregated statistics only (no individual data)', purpose: 'Market insights', consent: 'N/A (anonymized)' },
      ]
    },
    company: {
      title: 'Company Data Access',
      description: 'Search freely, pay to unlock full contact details.',
      controls: [
        { action: 'Browse all profiles (initials only)', available: true },
        { action: 'Use advanced filters', available: true },
        { action: 'See grades and courses', available: true },
        { action: 'See full names before payment', available: false },
        { action: 'Export student data in bulk', available: false },
        { action: 'Contact students directly without unlock', available: false },
      ],
      dataShared: [
        { with: 'Platform', data: 'Company profile, job postings, search behavior', purpose: 'Platform operation', consent: 'Company agreement' },
        { with: 'Students (Before Unlock)', data: 'Company name, job details', purpose: 'Profile views notification', consent: 'Automatic' },
        { with: 'Students (After Unlock)', data: 'Company name, recruiter name, contact details', purpose: 'Direct communication', consent: 'Student accepted when making profile public' },
      ]
    }
  }

  const gdprRights = [
    {
      title: 'Right to Access',
      description: 'Request a copy of all your personal data we hold, in machine-readable format.',
      action: 'Export My Data'
    },
    {
      title: 'Right to Erasure',
      description: 'Delete your account and all associated data permanently within 30 days.',
      action: 'Delete Account'
    },
    {
      title: 'Right to Rectification',
      description: 'Correct or update any inaccurate personal information at any time.',
      action: 'Edit Profile'
    },
    {
      title: 'Right to Restrict Processing',
      description: 'Limit how we process your data while maintaining your account.',
      action: 'Privacy Settings'
    },
    {
      title: 'Right to Data Portability',
      description: 'Transfer your data to another service in a structured format.',
      action: 'Download & Transfer'
    },
    {
      title: 'Right to Object',
      description: 'Object to processing of your data for marketing or other purposes.',
      action: 'Manage Preferences'
    }
  ]

  const currentStakeholder = dataAccessLevels[selectedStakeholder]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />

      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.div
              className="inline-block mb-6"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Badge className="bg-primary text-white border-0 px-6 py-2">
                {t('hero.badge')}
              </Badge>
            </motion.div>

            <h1 className="text-5xl font-bold mb-6 text-primary">
              {t('hero.title')}
            </h1>

            <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
              {t('hero.subtitle')}
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Badge variant="outline" className="text-sm px-4 py-2">
                EU GDPR Compliant
              </Badge>
              <Badge variant="outline" className="text-sm px-4 py-2">
                End-to-End Encryption
              </Badge>
              <Badge variant="outline" className="text-sm px-4 py-2">
                Data Portability
              </Badge>
            </div>
          </motion.div>

          {/* Stakeholder Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-16"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {t('dataAccess.title')}
              </h2>
              <p className="text-gray-600">
                {t('dataAccess.subtitle')}
              </p>
            </div>

            <div className="flex justify-center mb-12">
              <div className="inline-flex bg-white rounded-full p-1.5 shadow-lg border border-gray-200">
                {(['student', 'university', 'company'] as Stakeholder[]).map((stakeholder) => {
                  return (
                    <button
                      key={stakeholder}
                      onClick={() => setSelectedStakeholder(stakeholder)}
                      className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                        selectedStakeholder === stakeholder
                          ? 'bg-primary text-white shadow-md'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      {stakeholder.charAt(0).toUpperCase() + stakeholder.slice(1)}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Dynamic Content */}
            <motion.div
              key={selectedStakeholder}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm border-2 border-gray-200 mb-8">
                <CardHeader>
                  <div>
                    <CardTitle className="text-2xl">{currentStakeholder.title}</CardTitle>
                    <p className="text-gray-600 mt-1">{currentStakeholder.description}</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* What You Can Do */}
                    <div>
                      <h3 className="font-bold text-lg mb-4">
                        Access & Controls
                      </h3>
                      <ul className="space-y-3">
                        {currentStakeholder.controls.map((control, idx) => (
                          <motion.li
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: idx * 0.05 }}
                            className="flex items-start gap-2"
                          >
                            <span className={`font-bold mt-0.5 ${control.available ? 'text-primary' : 'text-red-600'}`}>
                              {control.available ? '+' : '-'}
                            </span>
                            <span className={control.available ? 'text-gray-700' : 'text-gray-500 line-through'}>
                              {control.action}
                            </span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>

                    {/* Data Sharing */}
                    <div>
                      <h3 className="font-bold text-lg mb-4">
                        Data Sharing
                      </h3>
                      <div className="space-y-4">
                        {currentStakeholder.dataShared.map((share, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: idx * 0.05 }}
                            className="bg-gray-50 rounded-lg p-4"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <ArrowRight className="h-4 w-4 text-primary" />
                              <span className="font-semibold text-sm">Shared with: {share.with}</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">
                              <strong>Data:</strong> {share.data}
                            </p>
                            <p className="text-sm text-gray-600 mb-1">
                              <strong>Purpose:</strong> {share.purpose}
                            </p>
                            <p className="text-sm text-gray-600">
                              <strong>Consent:</strong> <span className="text-primary">{share.consent}</span>
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Data Flow Visualization */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              {t('dataFlow.title')}
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  num: '01',
                  title: '1. Student Creates Profile',
                  items: [
                    { text: 'Student enters academic info voluntarily', positive: true },
                    { text: 'University verifies authenticity', positive: true },
                    { text: 'Data encrypted at rest and in transit', positive: true },
                  ]
                },
                {
                  num: '02',
                  title: '2. Companies Browse',
                  items: [
                    { text: 'See initials only (e.g., "M.R.")', positive: false },
                    { text: 'See university, courses, grades', positive: true },
                    { text: 'Cannot see email, phone, full name', positive: false },
                  ]
                },
                {
                  num: '03',
                  title: '3. Contact Unlock',
                  items: [
                    { text: '5 free contacts/month per company, then €89/mo subscription', positive: true },
                    { text: 'Student gets notified immediately', positive: true },
                    { text: 'Student can block future contact', positive: true },
                  ]
                }
              ].map((card, cardIdx) => (
                <motion.div key={cardIdx}>
                  <Card className="h-full hover:shadow-lg transition-all">
                    <CardHeader>
                      <div className="text-5xl font-bold text-primary/15 mb-3">{card.num}</div>
                      <CardTitle className="text-lg">{card.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-gray-600">
                        {card.items.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className={`font-bold mt-0.5 ${item.positive ? 'text-primary' : 'text-orange-600'}`}>
                              {item.positive ? '+' : '-'}
                            </span>
                            <span>{item.text}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* GDPR Rights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
              {t('gdprRights.title')}
            </h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              {t('gdprRights.subtitle')}
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gdprRights.map((right, idx) => {
                const stepNum = String(idx + 1).padStart(2, '0')
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-all bg-white/90 backdrop-blur-sm">
                      <CardHeader>
                        <div className="text-5xl font-bold text-primary/15 mb-3">{stepNum}</div>
                        <CardTitle className="text-lg">{right.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-4">{right.description}</p>
                        <Button variant="outline" size="sm" className="w-full">
                          {right.action}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* Security Measures */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <Card className="bg-primary text-white border-0">
              <CardContent className="p-12">
                <h2 className="text-3xl font-bold mb-4 text-center">
                  {t('security.title')}
                </h2>
                <p className="text-center text-white mb-8 max-w-2xl mx-auto">
                  {t('security.subtitle')}
                </p>

                <div className="grid md:grid-cols-4 gap-6">
                  {[
                    { title: 'AES-256 Encryption', desc: 'Military-grade encryption at rest' },
                    { title: 'TLS 1.3', desc: 'Secure data transmission' },
                    { title: 'EU Servers Only', desc: 'Data never leaves EU' },
                    { title: '2FA Available', desc: 'Two-factor authentication' },
                  ].map((measure, idx) => {
                    const stepNum = String(idx + 1).padStart(2, '0')
                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                        className="text-center"
                      >
                        <div className="text-5xl font-bold text-white/20 mb-3">{stepNum}</div>
                        <h3 className="font-bold mb-1">{measure.title}</h3>
                        <p className="text-sm text-white/90">{measure.desc}</p>
                      </motion.div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact DPO */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="border-2 border-primary/20 bg-primary/5">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {t('contact.title')}
                </h3>
                <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
                  {t('contact.subtitle')}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button className="bg-primary hover:bg-primary/90" asChild>
                    <Link href="mailto:info@in-transparency.com">
                      info@in-transparency.com
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/contact">
                      Contact Form
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  Response time: Within 30 days as required by GDPR
                </p>
              </CardContent>
            </Card>
          </motion.div>

        </div>
      </main>

      <Footer />
    </div>
  )
}
