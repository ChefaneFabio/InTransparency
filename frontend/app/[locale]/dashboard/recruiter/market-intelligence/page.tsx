'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getMarketIntelligence, getTalentPoolStats } from '@/lib/data/mock-course-data'
import { COURSE_CATEGORIES, CourseCategory, MarketIntelligence } from '@/lib/types/course-data'
import {
  BarChart3,
  TrendingUp,
  Users,
  AlertCircle,
  DollarSign,
  MapPin,
  Building2,
  GraduationCap,
  TrendingDown,
  Sparkles,
  ExternalLink
} from 'lucide-react'
import Link from 'next/link'

export default function MarketIntelligencePage() {
  const [intelligence, setIntelligence] = useState<MarketIntelligence | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<CourseCategory>(COURSE_CATEGORIES.AUTOMATION)

  useEffect(() => {
    // Get intelligence for selected category
    const data = getMarketIntelligence(
      `${selectedCategory} Specialist`,
      {
        courseCategory: selectedCategory,
        minGrade: 70,
        institutionType: 'both'
      }
    )
    setIntelligence(data)
  }, [selectedCategory])

  if (!intelligence) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 p-6">
      <div className="container mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="h-8 w-8 text-primary" />
              Market Intelligence
            </h1>
            <p className="text-gray-600 mt-2">
              Understand talent pool size, competition, and salary benchmarks
            </p>
          </div>
          <Button asChild>
            <Link href="/dashboard/recruiter/course-search">
              <Sparkles className="h-4 w-4 mr-2" />
              Course Search
            </Link>
          </Button>
        </div>

        {/* Category Selector */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Select Skill Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Object.entries(COURSE_CATEGORIES).slice(0, 12).map(([key, value]) => (
                <Button
                  key={key}
                  variant={selectedCategory === value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(value)}
                >
                  {value}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600" />
                Total Candidates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {intelligence.talentPool.totalCandidates}
              </div>
              <p className="text-xs text-gray-600 mt-1">in Italy (mock data)</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 bg-green-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-green-600" />
                Matching Your Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {intelligence.talentPool.matchingFilters}
              </div>
              <p className="text-xs text-green-700 mt-1 font-semibold">
                {intelligence.talentPool.matchRate.toFixed(1)}% match rate
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200 bg-purple-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-purple-600" />
                Avg Salary Range
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                €{(intelligence.salaryRange.min / 1000).toFixed(0)}K - €{(intelligence.salaryRange.max / 1000).toFixed(0)}K
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Avg: €{(intelligence.salaryRange.average / 1000).toFixed(0)}K/year
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-orange-200 bg-orange-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Building2 className="h-4 w-4 text-orange-600" />
                Competition
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">
                {intelligence.competingCompanies}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                companies hiring similar roles
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recommendations */}
        <Card className="border-2 border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              AI Recommendations to Improve Results
            </CardTitle>
            <CardDescription>
              Based on current talent pool and your search criteria
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {intelligence.recommendations.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <TrendingUp className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p>Your search is well-optimized! No recommendations at this time.</p>
              </div>
            ) : (
              intelligence.recommendations.map((rec, i) => (
                <div
                  key={i}
                  className={`border-l-4 pl-4 py-3 rounded-r ${
                    rec.type === 'expand_location'
                      ? 'border-blue-500 bg-blue-50'
                      : rec.type === 'lower_grade_threshold'
                      ? 'border-yellow-500 bg-yellow-50'
                      : rec.type === 'add_related_skills'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-500 bg-gray-50'
                  }`}
                >
                  <h4 className="font-semibold text-sm mb-1">{rec.title}</h4>
                  <p className="text-sm text-gray-700 mb-2">{rec.description}</p>
                  <Badge variant="secondary" className="bg-white">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {rec.impact}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Geographic Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Geographic Distribution
              </CardTitle>
              <CardDescription>
                Where matching candidates are located
              </CardDescription>
            </CardHeader>
            <CardContent>
              {Object.keys(intelligence.talentPool.byLocation).length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <MapPin className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <p>No location data available for current filters</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {Object.entries(intelligence.talentPool.byLocation)
                    .sort(([, a], [, b]) => b - a)
                    .map(([city, count]) => {
                      const percentage = (count / intelligence.talentPool.matchingFilters) * 100
                      return (
                        <div key={city} className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">{city}</span>
                            <span className="text-gray-600">
                              {count} ({percentage.toFixed(0)}%)
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Institution Type Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Institution Type Breakdown
              </CardTitle>
              <CardDescription>
                ITS vs University candidates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">🔧</div>
                    <div>
                      <div className="font-semibold">ITS Students</div>
                      <div className="text-xs text-gray-600">Vocational/Technical</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">
                      {intelligence.talentPool.byInstitutionType.its}
                    </div>
                    <div className="text-xs text-gray-600">
                      {((intelligence.talentPool.byInstitutionType.its / intelligence.talentPool.matchingFilters) * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">🎓</div>
                    <div>
                      <div className="font-semibold">University Students</div>
                      <div className="text-xs text-gray-600">Academic</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-purple-600">
                      {intelligence.talentPool.byInstitutionType.university}
                    </div>
                    <div className="text-xs text-gray-600">
                      {((intelligence.talentPool.byInstitutionType.university / intelligence.talentPool.matchingFilters) * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-800">
                  <strong>💡 Tip:</strong> ITS graduates have 87% placement rate and strong hands-on skills for technical roles.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Grade Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Grade Distribution (Normalized)</CardTitle>
            <CardDescription>
              Quality of candidates matching your filters
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg border-2 border-green-200">
                <div className="text-3xl font-bold text-green-600 mb-1">
                  {intelligence.talentPool.gradeDistribution.excellent}
                </div>
                <div className="text-sm font-medium text-gray-900 mb-1">Excellent</div>
                <div className="text-xs text-gray-600">90-100% (A+/A)</div>
                <div className="mt-2 text-xs text-green-700 font-semibold">
                  {intelligence.talentPool.matchingFilters > 0
                    ? ((intelligence.talentPool.gradeDistribution.excellent / intelligence.talentPool.matchingFilters) * 100).toFixed(0)
                    : 0}% of pool
                </div>
              </div>

              <div className="text-center p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {intelligence.talentPool.gradeDistribution.veryGood}
                </div>
                <div className="text-sm font-medium text-gray-900 mb-1">Very Good</div>
                <div className="text-xs text-gray-600">80-89% (A-/B+)</div>
                <div className="mt-2 text-xs text-blue-700 font-semibold">
                  {intelligence.talentPool.matchingFilters > 0
                    ? ((intelligence.talentPool.gradeDistribution.veryGood / intelligence.talentPool.matchingFilters) * 100).toFixed(0)
                    : 0}% of pool
                </div>
              </div>

              <div className="text-center p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200">
                <div className="text-3xl font-bold text-yellow-600 mb-1">
                  {intelligence.talentPool.gradeDistribution.good}
                </div>
                <div className="text-sm font-medium text-gray-900 mb-1">Good</div>
                <div className="text-xs text-gray-600">70-79% (B/B-)</div>
                <div className="mt-2 text-xs text-yellow-700 font-semibold">
                  {intelligence.talentPool.matchingFilters > 0
                    ? ((intelligence.talentPool.gradeDistribution.good / intelligence.talentPool.matchingFilters) * 100).toFixed(0)
                    : 0}% of pool
                </div>
              </div>

              <div className="text-center p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                <div className="text-3xl font-bold text-gray-600 mb-1">
                  {intelligence.talentPool.gradeDistribution.fair}
                </div>
                <div className="text-sm font-medium text-gray-900 mb-1">Fair</div>
                <div className="text-xs text-gray-600">60-69% (C)</div>
                <div className="mt-2 text-xs text-gray-700 font-semibold">
                  {intelligence.talentPool.matchingFilters > 0
                    ? ((intelligence.talentPool.gradeDistribution.fair / intelligence.talentPool.matchingFilters) * 100).toFixed(0)
                    : 0}% of pool
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Hiring Activity */}
        <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-blue-600" />
              Recent Market Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <span className="text-sm font-medium">Recent hires (last 30 days)</span>
              <Badge className="bg-blue-600">{intelligence.recentHires} candidates</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <span className="text-sm font-medium">Active job postings in category</span>
              <Badge className="bg-purple-600">{Math.floor(intelligence.competingCompanies * 1.5)} positions</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <span className="text-sm font-medium">Avg time to hire</span>
              <Badge variant="outline">18-23 days</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Demo Notice */}
        <Card className="bg-blue-50 border-blue-200 border-2">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm text-blue-900 font-semibold mb-1">
                  💡 Demo Mode - Mock Market Data
                </p>
                <p className="text-sm text-blue-800">
                  In production, this dashboard will pull:
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Real salary benchmarks from market APIs</li>
                    <li>Live competition data from job boards</li>
                    <li>Actual hiring trends from institutional partnerships</li>
                    <li>Geographic salary variations</li>
                  </ul>
                </p>
                <Button variant="outline" size="sm" className="mt-3" asChild>
                  <Link href="/dashboard/recruiter/course-search">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Start Searching with Course Filters
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
