'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  GraduationCap,
  MapPin,
  Calendar,
  Star,
  Brain,
  Target,
  Clock,
  Award,
  Globe,
  Filter,
  Download,
  RefreshCw,
  Eye,
  MessageSquare,
  Building2,
  Zap
} from 'lucide-react'

export default function TalentAnalyticsPage() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('3months')
  const [selectedMetric, setSelectedMetric] = useState('all')

  // Mock Data - In real app, this would come from API
  const talentPoolStats = {
    total: 15847,
    growth: 18.5,
    newThisMonth: 1234,
    activeSearching: 8945,
    topUniversities: 156,
    avgAIScore: 82.4
  }

  const universityTrends = [
    { name: 'MIT', students: 342, growth: 12.5, avgGPA: 3.91, topSkill: 'Machine Learning' },
    { name: 'Stanford', students: 298, growth: 15.2, avgGPA: 3.87, topSkill: 'AI Research' },
    { name: 'Berkeley', students: 276, growth: -2.3, avgGPA: 3.84, topSkill: 'Data Science' },
    { name: 'CMU', students: 234, growth: 8.7, avgGPA: 3.89, topSkill: 'Computer Vision' },
    { name: 'Harvard', students: 198, growth: 22.1, avgGPA: 3.92, topSkill: 'Software Engineering' },
    { name: 'Georgia Tech', students: 187, growth: 16.8, avgGPA: 3.78, topSkill: 'Cloud Computing' }
  ]

  const skillDemandTrends = [
    { skill: 'Machine Learning', demand: 94, growth: 28.5, avgSalary: 142000, candidates: 2341 },
    { skill: 'React', demand: 89, growth: 18.2, avgSalary: 118000, candidates: 1876 },
    { skill: 'Python', demand: 87, growth: 15.6, avgSalary: 125000, candidates: 3214 },
    { skill: 'AWS', demand: 85, growth: 32.4, avgSalary: 135000, candidates: 1654 },
    { skill: 'Node.js', demand: 78, growth: 22.1, avgSalary: 115000, candidates: 1432 },
    { skill: 'TypeScript', demand: 76, growth: 45.8, avgSalary: 122000, candidates: 1298 }
  ]

  const locationInsights = [
    {
      location: 'San Francisco Bay Area',
      talent: 2341,
      avgSalary: 165000,
      costOfLiving: 'High',
      competition: 92,
      topUniversities: ['Stanford', 'Berkeley', 'SJSU']
    },
    {
      location: 'New York Metro',
      talent: 1876,
      avgSalary: 145000,
      costOfLiving: 'High',
      competition: 88,
      topUniversities: ['Columbia', 'NYU', 'Cornell Tech']
    },
    {
      location: 'Boston Area',
      talent: 1654,
      avgSalary: 135000,
      costOfLiving: 'Medium-High',
      competition: 84,
      topUniversities: ['MIT', 'Harvard', 'Northeastern']
    },
    {
      location: 'Seattle',
      talent: 1432,
      avgSalary: 142000,
      costOfLiving: 'Medium-High',
      competition: 81,
      topUniversities: ['UW', 'UW Bothell', 'Seattle U']
    },
    {
      location: 'Austin',
      talent: 1298,
      avgSalary: 118000,
      costOfLiving: 'Medium',
      competition: 73,
      topUniversities: ['UT Austin', 'Rice', 'A&M']
    },
    {
      location: 'Atlanta',
      talent: 1156,
      avgSalary: 108000,
      costOfLiving: 'Medium',
      competition: 69,
      topUniversities: ['Georgia Tech', 'Emory', 'GSU']
    }
  ]

  const diversityMetrics = {
    gender: { male: 62, female: 35, nonBinary: 3 },
    ethnicity: {
      asian: 42,
      white: 38,
      hispanic: 12,
      black: 8,
      other: 5
    },
    international: 28,
    firstGeneration: 23,
    veteranStatus: 6
  }

  const hiringTrends = [
    { month: 'Jan', hires: 145, applications: 2340, responseRate: 67 },
    { month: 'Feb', hires: 167, applications: 2890, responseRate: 72 },
    { month: 'Mar', hires: 198, applications: 3120, responseRate: 69 },
    { month: 'Apr', hires: 234, applications: 3670, responseRate: 74 },
    { month: 'May', hires: 256, applications: 4120, responseRate: 78 },
    { month: 'Jun', hires: 289, applications: 4590, responseRate: 76 }
  ]

  const competitorInsights = [
    { company: 'Google', avgOffers: 67, successRate: 73, avgSalary: 175000 },
    { company: 'Meta', avgOffers: 52, successRate: 69, avgSalary: 168000 },
    { company: 'Amazon', avgOffers: 89, successRate: 58, avgSalary: 155000 },
    { company: 'Microsoft', avgOffers: 71, successRate: 71, avgSalary: 162000 },
    { company: 'Apple', avgOffers: 43, successRate: 76, avgSalary: 170000 }
  ]

  const aiInsights = [
    {
      type: 'trending_skill',
      title: 'TypeScript is trending up 46%',
      description: 'Strong growth in demand for TypeScript developers with React experience',
      impact: 'high',
      action: 'Expand TypeScript search criteria'
    },
    {
      type: 'university_hotspot',
      title: 'Harvard talent pool growing rapidly',
      description: 'Harvard CS graduates showing 22% growth with strong ML backgrounds',
      impact: 'medium',
      action: 'Increase Harvard recruiting efforts'
    },
    {
      type: 'salary_trend',
      title: 'ML engineer salaries increasing',
      description: 'Average salaries for ML engineers up 18% in past 6 months',
      impact: 'high',
      action: 'Review salary bands for ML roles'
    },
    {
      type: 'geographic_shift',
      title: 'Austin talent market heating up',
      description: 'Austin seeing 16% growth in qualified candidates with lower competition',
      impact: 'medium',
      action: 'Expand Austin recruitment strategy'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Talent Pool Analytics</h1>
          <p className="text-gray-600 mt-2">
            Deep insights into talent trends, university performance, and market dynamics
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="1month">Last Month</option>
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
          </select>
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Talent Pool</p>
                <p className="text-2xl font-bold text-gray-900">
                  {talentPoolStats.total.toLocaleString()}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600">+{talentPoolStats.growth}%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">New This Month</p>
                <p className="text-2xl font-bold text-gray-900">
                  {talentPoolStats.newThisMonth.toLocaleString()}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-green-500" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-gray-600">+234 this week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Actively Searching</p>
                <p className="text-2xl font-bold text-gray-900">
                  {talentPoolStats.activeSearching.toLocaleString()}
                </p>
              </div>
              <Target className="h-8 w-8 text-orange-500" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-gray-600">
                {Math.round((talentPoolStats.activeSearching / talentPoolStats.total) * 100)}% of total
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Universities</p>
                <p className="text-2xl font-bold text-gray-900">
                  {talentPoolStats.topUniversities}
                </p>
              </div>
              <GraduationCap className="h-8 w-8 text-purple-500" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-gray-600">Top 50 represented</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg AI Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {talentPoolStats.avgAIScore}
                </p>
              </div>
              <Brain className="h-8 w-8 text-indigo-500" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600">+2.3 pts</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Response Rate</p>
                <p className="text-2xl font-bold text-gray-900">74%</p>
              </div>
              <MessageSquare className="h-8 w-8 text-yellow-500" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600">+5% vs industry</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* University Performance */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <GraduationCap className="h-5 w-5 mr-2" />
              University Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {universityTrends.map((uni, index) => (
                <div key={uni.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold text-gray-900">{uni.name}</h4>
                      <Badge variant="outline" className="text-xs">#{index + 1}</Badge>
                    </div>
                    <p className="text-sm text-gray-600">{uni.students} students</p>
                    <p className="text-xs text-gray-500">GPA {uni.avgGPA} • {uni.topSkill}</p>
                  </div>
                  <div className="text-right">
                    <div className={`flex items-center text-sm ${uni.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {uni.growth > 0 ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      )}
                      {Math.abs(uni.growth)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Skill Demand Trends */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="h-5 w-5 mr-2" />
              Skill Demand & Market Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {skillDemandTrends.map((skill) => (
                <div key={skill.skill} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{skill.skill}</h4>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="text-gray-600">{skill.candidates} candidates</span>
                        <span className="font-medium text-green-600">${skill.avgSalary.toLocaleString()}</span>
                        <div className={`flex items-center ${skill.growth > 20 ? 'text-green-600' : 'text-blue-600'}`}>
                          <TrendingUp className="h-3 w-3 mr-1" />
                          +{skill.growth}%
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${skill.demand}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Demand Score</span>
                      <span>{skill.demand}/100</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Location Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            Geographic Talent Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {locationInsights.map((location) => (
              <div key={location.location} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">{location.location}</h4>
                  <Badge className={`${
                    location.costOfLiving === 'High' ? 'bg-red-100 text-red-800' :
                    location.costOfLiving === 'Medium-High' ? 'bg-orange-100 text-orange-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {location.costOfLiving} CoL
                  </Badge>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Available Talent:</span>
                    <span className="font-medium">{location.talent.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg Salary:</span>
                    <span className="font-medium">${location.avgSalary.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Competition:</span>
                    <span className="font-medium">{location.competition}/100</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t">
                  <p className="text-xs text-gray-500 mb-1">Top Universities:</p>
                  <div className="flex flex-wrap gap-1">
                    {location.topUniversities.map(uni => (
                      <Badge key={uni} variant="outline" className="text-xs">
                        {uni}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Insights & Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="h-5 w-5 mr-2" />
            AI-Powered Insights & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aiInsights.map((insight, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                  <Badge className={`${
                    insight.impact === 'high' ? 'bg-red-100 text-red-800' :
                    insight.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {insight.impact} impact
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-600">{insight.action}</span>
                  <Button size="sm" variant="outline">
                    Act on This
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Diversity & Inclusion Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Diversity Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Gender Distribution</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Male</span>
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${diversityMetrics.gender.male}%` }}></div>
                      </div>
                      <span className="text-sm font-medium w-8">{diversityMetrics.gender.male}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Female</span>
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                        <div className="bg-pink-600 h-2 rounded-full" style={{ width: `${diversityMetrics.gender.female}%` }}></div>
                      </div>
                      <span className="text-sm font-medium w-8">{diversityMetrics.gender.female}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Non-Binary</span>
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${diversityMetrics.gender.nonBinary * 10}%` }}></div>
                      </div>
                      <span className="text-sm font-medium w-8">{diversityMetrics.gender.nonBinary}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Additional Metrics</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{diversityMetrics.international}%</p>
                    <p className="text-xs text-gray-600">International</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{diversityMetrics.firstGeneration}%</p>
                    <p className="text-xs text-gray-600">First Generation</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Competitor Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="h-5 w-5 mr-2" />
              Competitive Intelligence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {competitorInsights.map((competitor) => (
                <div key={competitor.company} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-gray-900">{competitor.company}</h4>
                    <p className="text-sm text-gray-600">
                      {competitor.avgOffers} avg offers/month • {competitor.successRate}% success
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      ${competitor.avgSalary.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">avg salary</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-gray-600">
                <strong>Your Position:</strong> 15% above market average in response rates,
                8% below in average offer compensation
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}