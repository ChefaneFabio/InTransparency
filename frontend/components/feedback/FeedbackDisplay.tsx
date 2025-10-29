'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Lightbulb, MessageSquare, Building2, Calendar, CheckCircle } from 'lucide-react'
import { CompanyFeedback } from '@/app/api/feedback/company-to-student/route'

interface FeedbackDisplayProps {
  feedback: CompanyFeedback[]
}

export function FeedbackDisplay({ feedback }: FeedbackDisplayProps) {
  if (feedback.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Feedback Yet</h3>
          <p className="text-gray-600">
            Companies will provide institutional feedback after interviews. This helps you grow professionally.
          </p>
        </CardContent>
      </Card>
    )
  }

  const getRatingBadge = (rating: string) => {
    const colors = {
      'not-assessed': 'bg-gray-100 text-gray-700',
      'needs-improvement': 'bg-yellow-100 text-yellow-700',
      'developing': 'bg-blue-100 text-blue-700',
      'good': 'bg-green-100 text-green-700',
      'proficient': 'bg-green-100 text-green-700',
      'excellent': 'bg-emerald-100 text-emerald-700',
      'advanced': 'bg-emerald-100 text-emerald-700'
    }
    return colors[rating as keyof typeof colors] || colors['not-assessed']
  }

  const formatRating = (rating: string) => {
    return rating.split('-').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }

  return (
    <div className="space-y-6">
      {feedback.map((item) => (
        <Card key={item.id} className="border-2 border-primary/20">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Building2 className="h-6 w-6 text-primary" />
                  <CardTitle className="text-xl">{item.companyName}</CardTitle>
                </div>
                <p className="text-gray-600">{item.positionTitle}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  {new Date(item.feedbackDate).toLocaleDateString()}
                </div>
                <Badge className="mt-2 bg-primary/10 text-primary">
                  Institutional Feedback
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {/* Skills Demonstrated */}
            {item.skillsDemonstrated && item.skillsDemonstrated.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-green-900">Skills Demonstrated</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  {item.skillsDemonstrated.map((skill, index) => (
                    <div key={index} className="bg-white border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-900">{skill.skill}</span>
                        <Badge className={getRatingBadge(skill.rating)}>
                          {formatRating(skill.rating)}
                        </Badge>
                      </div>
                      {skill.notes && (
                        <p className="text-sm text-gray-600">{skill.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Interview Performance */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Interview Performance</h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(item.interviewPerformance).map(([category, rating]) => (
                  <div key={category} className="text-center bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600 mb-1 capitalize">
                      {category.replace(/([A-Z])/g, ' $1')}
                    </p>
                    <Badge className={getRatingBadge(rating)}>
                      {formatRating(rating)}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Constructive Feedback */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Constructive Feedback</h3>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-gray-700 whitespace-pre-line">{item.constructiveFeedback}</p>
              </div>
            </div>

            {/* Areas for Growth */}
            {item.areasForGrowth && item.areasForGrowth.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="h-5 w-5 text-secondary" />
                  <h3 className="text-lg font-semibold">Areas for Growth</h3>
                </div>

                <ul className="space-y-2">
                  {item.areasForGrowth.map((area, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{area}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommendations */}
            {item.recommendationsForStudent && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Recommendations for You</h3>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-gray-700 whitespace-pre-line">{item.recommendationsForStudent}</p>
                </div>
              </div>
            )}

            {/* Recruiter Info */}
            <div className="border-t pt-4 mt-4">
              <p className="text-sm text-gray-600">
                Feedback provided by <strong>{item.recruiterName}</strong>
                {item.sharedWithCareerCenter && (
                  <span className="ml-2 text-primary">• Shared with your career center</span>
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
