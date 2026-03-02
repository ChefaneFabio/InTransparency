'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Link } from '@/navigation'
import {
  Star,
  Building2,
  ArrowLeft,
  CheckCircle,
  ThumbsUp,
  ThumbsDown,
  Users,
} from 'lucide-react'

interface ReviewItem {
  id: string
  overallRating: number
  workLifeBalance: number | null
  mentorship: number | null
  learningOpportunity: number | null
  compensation: number | null
  cultureFit: number | null
  title: string | null
  reviewText: string
  pros: string | null
  cons: string | null
  jobTitle: string | null
  isAnonymous: boolean
  isVerified: boolean
  reviewer: {
    firstName?: string | null
    lastName?: string | null
    photo?: string | null
    university?: string | null
  }
  createdAt: string
}

interface CompanyData {
  company: string
  reviewCount: number
  averageRating: number
  categoryAverages: Record<string, number>
  reviews: ReviewItem[]
}

const categoryLabels: Record<string, string> = {
  workLifeBalance: 'Work-Life Balance',
  mentorship: 'Mentorship',
  learningOpportunity: 'Learning Opportunity',
  compensation: 'Compensation',
  cultureFit: 'Culture Fit',
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`h-4 w-4 ${s <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
        />
      ))}
    </div>
  )
}

export default function CompanyReviewPage() {
  const params = useParams()
  const companyName = decodeURIComponent(params.name as string)
  const [data, setData] = useState<CompanyData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`/api/reviews?company=${encodeURIComponent(companyName)}`)
        if (res.ok) {
          setData(await res.json())
        }
      } catch (error) {
        console.error('Failed to fetch reviews:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchReviews()
  }, [companyName])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Building2 className="h-10 w-10 mx-auto text-blue-300 animate-pulse mb-4" />
          <p className="text-gray-500">Loading company reviews...</p>
        </div>
      </div>
    )
  }

  if (!data || data.reviewCount === 0) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center">
        <Building2 className="h-12 w-12 mx-auto text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{companyName}</h1>
        <p className="text-gray-600 mb-6">No reviews yet for this company.</p>
        <Link href="/explore" className="text-blue-600 hover:underline flex items-center justify-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Back to Explore
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back link */}
      <Link href="/explore" className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Explore
      </Link>

      {/* Company Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building2 className="h-8 w-8 text-blue-600" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{data.company}</h1>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="text-xl font-bold">{data.averageRating.toFixed(1)}</span>
                </div>
                <span className="text-gray-500">
                  {data.reviewCount} review{data.reviewCount !== 1 ? 's' : ''} from students
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Ratings Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Ratings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(categoryLabels).map(([key, label]) => {
              const avg = data.categoryAverages[key]
              if (!avg) return null
              return (
                <div key={key} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{label}</span>
                    <span className="font-medium">{avg.toFixed(1)}</span>
                  </div>
                  <Progress value={avg * 20} className="h-2" />
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Reviews */}
        <div className="lg:col-span-2 space-y-4">
          {data.reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white text-xs">
                        {review.isAnonymous
                          ? '?'
                          : `${review.reviewer.firstName?.[0] || ''}${review.reviewer.lastName?.[0] || ''}`}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">
                          {review.isAnonymous
                            ? 'Anonymous Student'
                            : `${review.reviewer.firstName || ''} ${review.reviewer.lastName || ''}`}
                        </span>
                        {review.isVerified && (
                          <Badge className="bg-green-100 text-green-700 text-xs">
                            <CheckCircle className="mr-0.5 h-2.5 w-2.5" /> Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        {review.jobTitle && `${review.jobTitle} · `}
                        {review.reviewer.university || ''}
                      </p>
                    </div>
                  </div>
                  <Stars rating={review.overallRating} />
                </div>

                {/* Title & Text */}
                {review.title && (
                  <h3 className="font-semibold text-gray-900 mb-1">{review.title}</h3>
                )}
                <p className="text-sm text-gray-700 leading-relaxed">{review.reviewText}</p>

                {/* Pros / Cons */}
                {(review.pros || review.cons) && (
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    {review.pros && (
                      <div className="text-sm">
                        <div className="flex items-center gap-1 text-green-700 font-medium mb-1">
                          <ThumbsUp className="h-3.5 w-3.5" /> Pros
                        </div>
                        <p className="text-gray-600 text-xs">{review.pros}</p>
                      </div>
                    )}
                    {review.cons && (
                      <div className="text-sm">
                        <div className="flex items-center gap-1 text-red-600 font-medium mb-1">
                          <ThumbsDown className="h-3.5 w-3.5" /> Cons
                        </div>
                        <p className="text-gray-600 text-xs">{review.cons}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Date */}
                <p className="text-xs text-gray-400 mt-3">
                  {new Date(review.createdAt).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
