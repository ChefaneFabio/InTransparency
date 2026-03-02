'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Shield,
  Copy,
  ExternalLink,
  Code,
  CheckCircle,
  Eye,
  Share2,
} from 'lucide-react'

interface Props {
  projectId: string
  projectTitle: string
}

export default function BadgeExportPanel({ projectId, projectTitle }: Props) {
  const [copied, setCopied] = useState<string | null>(null)
  const [issuing, setIssuing] = useState(false)
  const [issued, setIssued] = useState(false)
  const [stats, setStats] = useState<{ viewCount: number; exportCount: number } | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`/api/badge/${projectId}/stats`)
        if (res.ok) {
          const data = await res.json()
          setStats({ viewCount: data.viewCount, exportCount: data.exportCount })
          if (data.issued) setIssued(true)
        }
      } catch {
        // Silently fail
      }
    }
    fetchStats()
  }, [projectId])

  const appUrl = typeof window !== 'undefined'
    ? window.location.origin
    : 'https://intransparency.eu'

  const verifyUrl = `${appUrl}/verify/${projectId}`
  const badgeUrl = `${appUrl}/api/badge/${projectId}`
  const embedCode = `<a href="${verifyUrl}" target="_blank"><img src="${badgeUrl}" alt="Verified: ${projectTitle}" width="400" height="120" /></a>`
  const linkedInUrl = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(projectTitle)}&organizationName=InTransparency&certUrl=${encodeURIComponent(verifyUrl)}`

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(label)
      setTimeout(() => setCopied(null), 2000)
      // Increment export count
      fetch(`/api/badge/${projectId}/stats`, { method: 'POST' }).catch(() => {})
      if (stats) setStats({ ...stats, exportCount: stats.exportCount + 1 })
    } catch {
      // Fallback
    }
  }

  const issueBadge = async () => {
    setIssuing(true)
    try {
      const res = await fetch(`/api/badge/${projectId}/issue`, {
        method: 'POST',
      })
      if (res.ok) {
        setIssued(true)
      }
    } catch {
      // Silently fail
    } finally {
      setIssuing(false)
    }
  }

  return (
    <Card className="border-blue-200">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-600" />
          Verification Badge
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Badge Preview */}
        <div className="rounded-lg overflow-hidden border">
          <img
            src={`/api/badge/${projectId}`}
            alt={`Verified: ${projectTitle}`}
            width={400}
            height={120}
            className="w-full"
          />
        </div>

        {/* Issue Badge (if not yet issued) */}
        {!issued && (
          <Button
            variant="default"
            className="w-full"
            onClick={issueBadge}
            disabled={issuing}
          >
            {issuing ? 'Issuing...' : 'Issue Portable Badge'}
          </Button>
        )}

        {issued && (
          <Badge className="bg-green-100 text-green-700 w-full justify-center py-1">
            <CheckCircle className="mr-1 h-3 w-3" />
            Badge issued
          </Badge>
        )}

        {/* Badge Analytics */}
        {stats && (stats.viewCount > 0 || stats.exportCount > 0) && (
          <div className="flex items-center gap-4 py-2 px-3 bg-gray-50 rounded-lg text-sm">
            <div className="flex items-center gap-1.5 text-gray-600">
              <Eye className="h-3.5 w-3.5" />
              <span className="font-medium">{stats.viewCount}</span> views
            </div>
            <div className="flex items-center gap-1.5 text-gray-600">
              <Share2 className="h-3.5 w-3.5" />
              <span className="font-medium">{stats.exportCount}</span> exports
            </div>
          </div>
        )}

        {/* Export Options */}
        <div className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={() => copyToClipboard(verifyUrl, 'link')}
          >
            {copied === 'link' ? (
              <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
            ) : (
              <Copy className="mr-2 h-4 w-4" />
            )}
            {copied === 'link' ? 'Copied!' : 'Copy verification link'}
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={() => copyToClipboard(embedCode, 'embed')}
          >
            {copied === 'embed' ? (
              <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
            ) : (
              <Code className="mr-2 h-4 w-4" />
            )}
            {copied === 'embed' ? 'Copied!' : 'Copy embed code (HTML)'}
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            asChild
          >
            <a href={linkedInUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              Add to LinkedIn Profile
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
