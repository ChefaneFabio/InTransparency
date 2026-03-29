'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Loader2, Search } from 'lucide-react'

interface JobListing {
  id: string
  title: string
  location: string
  type: string
  postedAt: string
}

export default function CareerPageBuilder() {
  const t = useTranslations('recruiterCareerPage')
  const [description, setDescription] = useState('')
  const [brandColor, setBrandColor] = useState('#3B82F6')
  const [listings, setListings] = useState<JobListing[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  const embedCode = `<iframe src="https://${t('preview.url')}" width="100%" height="600" frameborder="0"></iframe>`

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch('/api/dashboard/recruiter/jobs')
        if (res.ok) {
          const data = await res.json()
          setListings(data.jobs || [])
        }
      } catch {
        // Gracefully handle missing API
      } finally {
        setLoading(false)
      }
    }
    fetchListings()
  }, [])

  const handleCopyEmbed = async () => {
    try {
      await navigator.clipboard.writeText(embedCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard not available
    }
  }

  return (
    <div className="max-w-5xl mx-auto pb-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">{t('title')}</h1>
        <p className="text-sm text-gray-500 mt-1">{t('subtitle')}</p>
      </div>

      {/* Section 1: Preview URL & Embed Code */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">{t('preview.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-gray-500 mb-1.5">URL</p>
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border">
              <code className="text-sm text-gray-700 flex-1 truncate">
                https://{t('preview.url')}
              </code>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1.5">
              {t('preview.embedCode')}
            </p>
            <div className="flex items-start gap-2">
              <code className="flex-1 text-xs text-gray-600 p-3 bg-gray-50 rounded-lg border break-all">
                {embedCode}
              </code>
              <Button variant="outline" size="sm" onClick={handleCopyEmbed}>
                {copied ? t('preview.copied') : t('preview.copy')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Customize */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">{t('customize.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">
              {t('customize.description')}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('customize.descriptionPlaceholder')}
              className="w-full px-3 py-2 text-sm border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">
                {t('customize.color')}
              </label>
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-md border flex-shrink-0"
                  style={{ backgroundColor: brandColor }}
                />
                <Input
                  value={brandColor}
                  onChange={(e) => setBrandColor(e.target.value)}
                  placeholder={t('customize.colorPlaceholder')}
                  className="font-mono text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">
                {t('customize.logo')}
              </label>
              <div className="flex items-center justify-center h-10 border-2 border-dashed rounded-md text-xs text-gray-400">
                {t('customize.logoPlaceholder')}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Active Listings */}
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">{t('listings.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm font-medium text-gray-600">
                {t('listings.empty')}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {t('listings.emptyDesc')}
              </p>
              <Link href="/dashboard/recruiter/post-job">
                <Button variant="outline" size="sm" className="mt-3">
                  {t('listings.postJob')}
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {listings.map((job) => (
                <div
                  key={job.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {job.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {job.location} &middot; {job.type}
                    </p>
                  </div>
                  <Badge variant="secondary">Active</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Section 4: Coming Soon */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-base text-gray-500">
            {t('comingSoon.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-500">
                <span className="text-gray-300 mt-0.5">&#x2022;</span>
                {t(`comingSoon.items.${i}`)}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
