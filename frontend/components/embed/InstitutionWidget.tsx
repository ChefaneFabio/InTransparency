'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Briefcase, TrendingUp, Users, ExternalLink } from 'lucide-react'

interface MatchEvent {
  id: string
  studentDegree: string
  companyName: string
  timestamp: string
  matchScore: number
}

interface InstitutionWidgetProps {
  institutionId: string
  institutionName: string
  primaryColor?: string
  secondaryColor?: string
  logoUrl?: string
  showLogo?: boolean
  maxMatches?: number
  refreshInterval?: number // milliseconds
}

export default function InstitutionWidget({
  institutionId,
  institutionName,
  primaryColor = '#3b82f6',
  secondaryColor = '#10b981',
  logoUrl,
  showLogo = true,
  maxMatches = 5,
  refreshInterval = 30000 // 30 seconds
}: InstitutionWidgetProps) {
  const [matches, setMatches] = useState<MatchEvent[]>([])
  const [stats, setStats] = useState({
    todayMatches: 0,
    weekMatches: 0,
    activeStudents: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await fetch(`/api/embed/matches?institutionId=${institutionId}&limit=${maxMatches}`)
        const data = await response.json()

        if (data.success) {
          setMatches(data.matches)
          setStats(data.stats)
        }
      } catch (error) {
        console.error('Error fetching matches:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMatches()
    const interval = setInterval(fetchMatches, refreshInterval)

    return () => clearInterval(interval)
  }, [institutionId, maxMatches, refreshInterval])

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div
        className="px-6 py-4 text-white"
        style={{ background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)` }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {showLogo && logoUrl && (
              <img src={logoUrl} alt={institutionName} className="h-10 w-10 rounded-full bg-white p-1" />
            )}
            <div>
              <h3 className="text-lg font-bold">InTransparency Matches</h3>
              <p className="text-sm opacity-90">{institutionName}</p>
            </div>
          </div>
          <TrendingUp className="h-6 w-6" />
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold" style={{ color: primaryColor }}>{stats.todayMatches}</div>
            <div className="text-xs text-gray-600">Today</div>
          </div>
          <div>
            <div className="text-2xl font-bold" style={{ color: primaryColor }}>{stats.weekMatches}</div>
            <div className="text-xs text-gray-600">This Week</div>
          </div>
          <div>
            <div className="text-2xl font-bold" style={{ color: primaryColor }}>{stats.activeStudents}</div>
            <div className="text-xs text-gray-600">Active Students</div>
          </div>
        </div>
      </div>

      {/* Recent Matches */}
      <div className="px-6 py-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Users className="h-4 w-4" />
          Recent Matches
        </h4>

        <AnimatePresence mode="popLayout">
          {matches.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Briefcase className="h-12 w-12 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No matches yet today</p>
            </div>
          ) : (
            <div className="space-y-2">
              {matches.map((match, index) => (
                <motion.div
                  key={match.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {match.matchScore}%
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {match.studentDegree} Student
                    </div>
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <Briefcase className="h-3 w-3" />
                      {match.companyName}
                    </div>
                  </div>

                  <div className="text-xs text-gray-400">
                    {formatTimestamp(match.timestamp)}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer CTA */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <a
          href={`https://intransparency.com/institutions/${institutionId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 text-sm font-medium hover:underline transition-colors"
          style={{ color: primaryColor }}
        >
          View Full Dashboard
          <ExternalLink className="h-4 w-4" />
        </a>
        <p className="text-xs text-gray-500 text-center mt-2">
          Powered by <span className="font-semibold">InTransparency</span>
        </p>
      </div>
    </div>
  )
}

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`

  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`

  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays}d ago`
}
