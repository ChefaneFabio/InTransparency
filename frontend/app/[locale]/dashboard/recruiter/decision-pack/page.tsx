'use client'

import { useEffect, useState } from 'react'
import { Link } from '@/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  FileText,
  Clock,
  Users,
  ChevronRight,
  Loader2,
  Plus,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DecisionPackSummary {
  id: string
  candidateId: string
  candidateName: string
  candidatePhoto: string | null
  candidateUniversity: string | null
  matchScore: number | null
  generatedAt: string
  expiresAt: string
}

export default function DecisionPackListPage() {
  const [packs, setPacks] = useState<DecisionPackSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPacks()
  }, [])

  const fetchPacks = async () => {
    try {
      const res = await fetch('/api/dashboard/recruiter/decision-packs')
      if (res.ok) {
        const data = await res.json()
        setPacks(data.packs || [])
      }
    } catch (err) {
      console.error('Failed to fetch decision packs:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-32 bg-gray-200 rounded" />
          <div className="h-32 bg-gray-200 rounded" />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto pb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Decision Packs</h1>
          <p className="text-sm text-gray-500 mt-1">
            Generated hiring dossiers for candidates you&apos;re evaluating
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/recruiter/candidates">
            <Plus className="h-4 w-4 mr-1" />
            New Pack
          </Link>
        </Button>
      </div>

      {packs.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-10 w-10 mx-auto text-gray-300 mb-3" />
            <p className="font-medium text-gray-700">No decision packs yet</p>
            <p className="text-sm text-gray-500 mt-1">
              Generate a decision pack from any candidate&apos;s profile page.
            </p>
            <Button className="mt-4" asChild>
              <Link href="/dashboard/recruiter/candidates">
                Browse candidates
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {packs.map((pack) => {
            const isExpired = new Date(pack.expiresAt) < new Date()
            const initials = pack.candidateName
              .split(' ')
              .map((n) => n[0])
              .join('')

            return (
              <Link
                key={pack.id}
                href={`/dashboard/recruiter/decision-pack/${pack.candidateId}`}
                className="block"
              >
                <Card className={`hover:shadow-sm transition-shadow ${isExpired ? 'opacity-60' : ''}`}>
                  <CardContent className="p-4 flex items-center gap-3">
                    {pack.candidatePhoto ? (
                      <img
                        src={pack.candidatePhoto}
                        alt=""
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium text-sm flex-shrink-0">
                        {initials}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm">{pack.candidateName}</p>
                      <p className="text-xs text-gray-500 truncate">
                        {pack.candidateUniversity || 'University not specified'}
                      </p>
                    </div>
                    {pack.matchScore !== null && (
                      <Badge
                        variant="secondary"
                        className={`text-xs ${
                          pack.matchScore >= 80
                            ? 'bg-primary/10 text-green-700'
                            : pack.matchScore >= 60
                              ? 'bg-primary/10 text-blue-700'
                              : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {pack.matchScore}% match
                      </Badge>
                    )}
                    <div className="flex items-center gap-2 text-xs text-gray-400 flex-shrink-0">
                      <Clock className="h-3 w-3" />
                      {new Date(pack.generatedAt).toLocaleDateString()}
                      {isExpired && (
                        <Badge variant="outline" className="text-xs text-red-500 border-red-200">
                          Expired
                        </Badge>
                      )}
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
