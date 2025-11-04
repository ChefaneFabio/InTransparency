'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Shield,
  Lock,
  Eye,
  EyeOff,
  Key,
  Database,
  Users,
  Building2,
  GraduationCap,
  CheckCircle,
  AlertCircle,
  Download,
  Trash2,
  FileText,
  Mail,
  ArrowRight,
  Info
} from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

type Stakeholder = 'student' | 'university' | 'company'

export default function PrivacyPage() {
  const [selectedStakeholder, setSelectedStakeholder] = useState<Stakeholder>('student')

  const dataAccessLevels = {
    student: {
      icon: GraduationCap,
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
      icon: Building2,
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
      icon: Users,
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
      icon: Eye,
      title: 'Right to Access',
      description: 'Request a copy of all your personal data we hold, in machine-readable format.',
      action: 'Export My Data'
    },
    {
      icon: Trash2,
      title: 'Right to Erasure',
      description: 'Delete your account and all associated data permanently within 30 days.',
      action: 'Delete Account'
    },
    {
      icon: Lock,
      title: 'Right to Rectification',
      description: 'Correct or update any inaccurate personal information at any time.',
      action: 'Edit Profile'
    },
    {
      icon: EyeOff,
      title: 'Right to Restrict Processing',
      description: 'Limit how we process your data while maintaining your account.',
      action: 'Privacy Settings'
    },
    {
      icon: Download,
      title: 'Right to Data Portability',
      description: 'Transfer your data to another service in a structured format.',
      action: 'Download & Transfer'
    },
    {
      icon: AlertCircle,
      title: 'Right to Object',
      description: 'Object to processing of your data for marketing or other purposes.',
      action: 'Manage Preferences'
    }
  ]

  const currentStakeholder = dataAccessLevels[selectedStakeholder]
  const Icon = currentStakeholder.icon

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
              <Badge className="bg-gradient-to-r from-blue-600 to-green-600 text-white border-0 px-6 py-2">
                <Shield className="inline h-4 w-4 mr-2" />
                GDPR Compliant
              </Badge>
            </motion.div>

            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
              Your Data. Your Control.
            </h1>

            <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
              Complete transparency about what data we collect, how we use it, and who has access.
              GDPR-compliant, secure, and designed with your privacy first.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Badge variant="outline" className="text-sm px-4 py-2">
                <CheckCircle className="inline h-4 w-4 mr-2 text-green-600" />
                EU GDPR Compliant
              </Badge>
              <Badge variant="outline" className="text-sm px-4 py-2">
                <CheckCircle className="inline h-4 w-4 mr-2 text-green-600" />
                End-to-End Encryption
              </Badge>
              <Badge variant="outline" className="text-sm px-4 py-2">
                <CheckCircle className="inline h-4 w-4 mr-2 text-green-600" />
                ISO 27001 Certified
              </Badge>
              <Badge variant="outline" className="text-sm px-4 py-2">
                <CheckCircle className="inline h-4 w-4 mr-2 text-green-600" />
                SOC 2 Type II
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
                Data Access by Role
              </h2>
              <p className="text-gray-600">
                See exactly what each party can and cannot access
              </p>
            </div>

            <div className="flex justify-center mb-12">
              <div className="inline-flex bg-white rounded-full p-1.5 shadow-lg border border-gray-200">
                {(['student', 'university', 'company'] as Stakeholder[]).map((stakeholder) => {
                  const StakeholderIcon = dataAccessLevels[stakeholder].icon
                  return (
                    <button
                      key={stakeholder}
                      onClick={() => setSelectedStakeholder(stakeholder)}
                      className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                        selectedStakeholder === stakeholder
                          ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-md'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <StakeholderIcon className="h-4 w-4" />
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
                  <div className="flex items-center gap-4">
                    <motion.div
                      className="p-4 rounded-full bg-blue-100"
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Icon className="h-8 w-8 text-blue-600" />
                    </motion.div>
                    <div>
                      <CardTitle className="text-2xl">{currentStakeholder.title}</CardTitle>
                      <p className="text-gray-600 mt-1">{currentStakeholder.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* What You Can Do */}
                    <div>
                      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
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
                            {control.available ? (
                              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                            ) : (
                              <EyeOff className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                            )}
                            <span className={control.available ? 'text-gray-700' : 'text-gray-500 line-through'}>
                              {control.action}
                            </span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>

                    {/* Data Sharing */}
                    <div>
                      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <Database className="h-5 w-5 text-blue-600" />
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
                              <ArrowRight className="h-4 w-4 text-blue-600" />
                              <span className="font-semibold text-sm">Shared with: {share.with}</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">
                              <strong>Data:</strong> {share.data}
                            </p>
                            <p className="text-sm text-gray-600 mb-1">
                              <strong>Purpose:</strong> {share.purpose}
                            </p>
                            <p className="text-sm text-gray-600">
                              <strong>Consent:</strong> <span className="text-green-600">{share.consent}</span>
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
              How Your Data Flows
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              <motion.div whileHover={{ y: -5 }}>
                <Card className="h-full hover:shadow-xl transition-all">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-3 rounded-full bg-purple-100">
                        <GraduationCap className="h-6 w-6 text-purple-600" />
                      </div>
                      <CardTitle className="text-lg">1. Student Creates Profile</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Student enters academic info voluntarily</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>University verifies authenticity</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Data encrypted at rest and in transit</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div whileHover={{ y: -5 }}>
                <Card className="h-full hover:shadow-xl transition-all">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-3 rounded-full bg-blue-100">
                        <Eye className="h-6 w-6 text-blue-600" />
                      </div>
                      <CardTitle className="text-lg">2. Companies Browse</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start gap-2">
                        <EyeOff className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                        <span>See initials only (e.g., "M.R.")</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Eye className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>See university, courses, grades</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <EyeOff className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                        <span>Cannot see email, phone, full name</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div whileHover={{ y: -5 }}>
                <Card className="h-full hover:shadow-xl transition-all">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-3 rounded-full bg-green-100">
                        <Key className="h-6 w-6 text-green-600" />
                      </div>
                      <CardTitle className="text-lg">3. Contact Unlock</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Company pays €10 to unlock contact</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Student gets notified immediately</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Student can block future contact</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
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
              Your GDPR Rights
            </h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              Under the General Data Protection Regulation (GDPR), you have these fundamental rights
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gdprRights.map((right, idx) => {
                const RightIcon = right.icon
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                  >
                    <Card className="h-full hover:shadow-xl transition-all bg-white/90 backdrop-blur-sm">
                      <CardHeader>
                        <motion.div
                          className="p-3 rounded-full bg-blue-100 w-12 h-12 flex items-center justify-center mb-3"
                          whileHover={{ rotate: 360, scale: 1.1 }}
                          transition={{ duration: 0.6 }}
                        >
                          <RightIcon className="h-6 w-6 text-blue-600" />
                        </motion.div>
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
            <Card className="bg-gradient-to-r from-blue-600 to-green-600 text-white border-0">
              <CardContent className="p-12">
                <h2 className="text-3xl font-bold mb-4 text-center">
                  How We Protect Your Data
                </h2>
                <p className="text-center text-white mb-8 max-w-2xl mx-auto">
                  Bank-level security and encryption to keep your information safe
                </p>

                <div className="grid md:grid-cols-4 gap-6">
                  {[
                    { icon: Lock, title: 'AES-256 Encryption', desc: 'Military-grade encryption at rest' },
                    { icon: Shield, title: 'TLS 1.3', desc: 'Secure data transmission' },
                    { icon: Database, title: 'EU Servers Only', desc: 'Data never leaves EU' },
                    { icon: Key, title: '2FA Available', desc: 'Two-factor authentication' },
                  ].map((measure, idx) => {
                    const MeasureIcon = measure.icon
                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                        className="text-center"
                      >
                        <motion.div
                          className="bg-white/20 backdrop-blur-sm rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-3"
                          whileHover={{ scale: 1.1, rotate: 360 }}
                          transition={{ duration: 0.6 }}
                        >
                          <MeasureIcon className="h-8 w-8 text-white" />
                        </motion.div>
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
            <Card className="border-2 border-blue-200 bg-blue-50/50">
              <CardContent className="p-8 text-center">
                <Mail className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Questions About Your Data?
                </h3>
                <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
                  Contact our Data Protection Officer (DPO) for any privacy concerns or to exercise your GDPR rights.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button className="bg-blue-600 hover:bg-blue-700" asChild>
                    <Link href="mailto:privacy@intransparency.eu">
                      <Mail className="h-4 w-4 mr-2" />
                      privacy@intransparency.eu
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
