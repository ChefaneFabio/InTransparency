'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Map,
  Filter,
  Search,
  GraduationCap,
  MapPin,
  Users,
  TrendingUp,
  Star,
  Building2,
  Calendar,
  Award,
  Target,
  Globe,
  BarChart3,
  Bell,
  Download,
  Eye,
  ChevronDown,
  ChevronRight,
  Zap,
  Brain
} from 'lucide-react'

export default function TalentDiscoveryPage() {
  const [selectedUniversities, setSelectedUniversities] = useState<string[]>([])
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [gradeFilter, setGradeFilter] = useState({ min: 3.0, max: 4.0 })
  const [graduationYear, setGraduationYear] = useState('2024')
  const [selectedLocations, setSelectedLocations] = useState<string[]>([])
  const [mapView, setMapView] = useState('usa')
  const [showHeatmap, setShowHeatmap] = useState(true)
  const [selectedState, setSelectedState] = useState<string | null>(null)

  // Top Universities with Rankings
  const topUniversities = [
    { name: 'MIT', ranking: 1, students: 342, avgGPA: 3.9, location: 'Boston, MA', lat: 42.3601, lng: -71.0942, color: '#FF6B6B' },
    { name: 'Stanford', ranking: 2, students: 298, avgGPA: 3.85, location: 'Stanford, CA', lat: 37.4275, lng: -122.1697, color: '#4ECDC4' },
    { name: 'Harvard', ranking: 3, students: 276, avgGPA: 3.88, location: 'Cambridge, MA', lat: 42.3770, lng: -71.1167, color: '#45B7D1' },
    { name: 'Caltech', ranking: 4, students: 156, avgGPA: 3.92, location: 'Pasadena, CA', lat: 34.1377, lng: -118.1253, color: '#96CEB4' },
    { name: 'CMU', ranking: 5, students: 234, avgGPA: 3.82, location: 'Pittsburgh, PA', lat: 40.4433, lng: -79.9436, color: '#FECA57' },
    { name: 'Berkeley', ranking: 6, students: 412, avgGPA: 3.78, location: 'Berkeley, CA', lat: 37.8715, lng: -122.2730, color: '#DDA0DD' },
    { name: 'Georgia Tech', ranking: 7, students: 389, avgGPA: 3.75, location: 'Atlanta, GA', lat: 33.7756, lng: -84.3963, color: '#98D8C8' },
    { name: 'UT Austin', ranking: 8, students: 367, avgGPA: 3.72, location: 'Austin, TX', lat: 30.2849, lng: -97.7341, color: '#FFB6C1' }
  ]

  // Talent Pool by State
  const stateData = [
    { state: 'California', students: 1245, topSkill: 'Machine Learning', avgGPA: 3.76 },
    { state: 'New York', students: 892, topSkill: 'Finance Tech', avgGPA: 3.72 },
    { state: 'Texas', students: 756, topSkill: 'Full Stack', avgGPA: 3.68 },
    { state: 'Massachusetts', students: 623, topSkill: 'AI Research', avgGPA: 3.84 },
    { state: 'Washington', students: 534, topSkill: 'Cloud Computing', avgGPA: 3.71 },
    { state: 'Illinois', students: 445, topSkill: 'Data Science', avgGPA: 3.69 }
  ]

  // Skills Distribution
  const skillsData = [
    { skill: 'Python', count: 2341, trend: '+15%' },
    { skill: 'Machine Learning', count: 1876, trend: '+22%' },
    { skill: 'React', count: 1654, trend: '+18%' },
    { skill: 'Java', count: 1432, trend: '+5%' },
    { skill: 'AWS', count: 1298, trend: '+28%' },
    { skill: 'Data Science', count: 1156, trend: '+19%' }
  ]

  // Diversity Metrics
  const diversityMetrics = {
    gender: { male: 58, female: 38, other: 4 },
    international: 32,
    firstGen: 24,
    veteran: 8
  }

  // Mock search results
  const [searchResults, setSearchResults] = useState([
    {
      id: 1,
      name: 'Sarah Chen',
      university: 'MIT',
      gpa: 3.92,
      major: 'Computer Science',
      graduation: '2024',
      location: 'Boston, MA',
      skills: ['Python', 'TensorFlow', 'React'],
      projects: 4,
      aiScore: 94
    },
    {
      id: 2,
      name: 'Alex Rivera',
      university: 'Stanford',
      gpa: 3.88,
      major: 'AI & Machine Learning',
      graduation: '2024',
      location: 'Palo Alto, CA',
      skills: ['PyTorch', 'Kubernetes', 'Go'],
      projects: 3,
      aiScore: 91
    },
    {
      id: 3,
      name: 'Marcus Johnson',
      university: 'Georgia Tech',
      gpa: 3.85,
      major: 'Software Engineering',
      graduation: '2024',
      location: 'Atlanta, GA',
      skills: ['Java', 'Spring Boot', 'AWS'],
      projects: 5,
      aiScore: 89
    }
  ])

  // Interactive map component (simplified visualization)
  const MapVisualization = () => (
    <div className="relative h-96 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg overflow-hidden">
      {/* Map Background */}
      <div className="absolute inset-0 flex items-center justify-center">
        <Globe className="h-32 w-32 text-blue-200" />
      </div>

      {/* University Markers */}
      {topUniversities.map((uni, index) => {
        const isSelected = selectedUniversities.includes(uni.name)
        return (
          <div
            key={uni.name}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
            style={{
              left: `${20 + (index % 4) * 20}%`,
              top: `${20 + Math.floor(index / 4) * 30}%`,
              animation: `pulse ${2 + index * 0.2}s infinite`
            }}
            onClick={() => {
              if (isSelected) {
                setSelectedUniversities(prev => prev.filter(u => u !== uni.name))
              } else {
                setSelectedUniversities(prev => [...prev, uni.name])
              }
            }}
          >
            {/* Ripple Effect */}
            {isSelected && (
              <div className="absolute inset-0 animate-ping">
                <div className="w-12 h-12 bg-blue-400 rounded-full opacity-25"></div>
              </div>
            )}

            {/* University Marker */}
            <div className={`relative z-10 ${isSelected ? 'scale-125' : ''} transition-transform`}>
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
                  isSelected ? 'ring-4 ring-blue-400 ring-opacity-50' : ''
                }`}
                style={{ backgroundColor: uni.color }}
              >
                <GraduationCap className="h-6 w-6 text-white" />
              </div>

              {/* Tooltip */}
              <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-xl p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none w-40">
                <h4 className="font-semibold text-gray-900">{uni.name}</h4>
                <p className="text-xs text-gray-600">Rank #{uni.ranking}</p>
                <p className="text-xs text-gray-600">{uni.students} students</p>
                <p className="text-xs text-gray-600">Avg GPA: {uni.avgGPA}</p>
              </div>
            </div>

            {/* University Label */}
            <div className="absolute top-14 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
              <span className="text-xs font-medium text-gray-700">{uni.name}</span>
            </div>
          </div>
        )
      })}

      {/* Heatmap Overlay */}
      {showHeatmap && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-red-400 rounded-full opacity-20 blur-xl"></div>
          <div className="absolute top-1/3 right-1/3 w-40 h-40 bg-yellow-400 rounded-full opacity-20 blur-xl"></div>
          <div className="absolute bottom-1/4 left-1/3 w-36 h-36 bg-green-400 rounded-full opacity-20 blur-xl"></div>
        </div>
      )}

      {/* Map Controls */}
      <div className="absolute top-4 right-4 space-y-2">
        <Button
          size="sm"
          variant={showHeatmap ? "default" : "outline"}
          onClick={() => setShowHeatmap(!showHeatmap)}
          className="bg-white/90 backdrop-blur-sm"
        >
          <Map className="h-4 w-4 mr-1" />
          Heatmap
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="bg-white/90 backdrop-blur-sm"
        >
          <Target className="h-4 w-4 mr-1" />
          Focus
        </Button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3">
        <h4 className="text-xs font-semibold text-gray-700 mb-2">Talent Density</h4>
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-400 rounded-full mr-1"></div>
            <span className="text-xs text-gray-600">High</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-400 rounded-full mr-1"></div>
            <span className="text-xs text-gray-600">Medium</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-400 rounded-full mr-1"></div>
            <span className="text-xs text-gray-600">Low</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.1); }
        }
      `}</style>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Talent Discovery</h1>
          <p className="text-gray-600 mt-2">
            Find and connect with top talent from leading universities
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Bell className="h-4 w-4 mr-2" />
            Set Alert
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Search className="h-4 w-4 mr-2" />
            Advanced Search
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Talent Pool</p>
                <p className="text-2xl font-bold text-gray-900">12,456</p>
                <p className="text-xs text-green-600">↑ 18% this month</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Universities</p>
                <p className="text-2xl font-bold text-gray-900">156</p>
                <p className="text-xs text-gray-900">Top tier</p>
              </div>
              <GraduationCap className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg GPA</p>
                <p className="text-2xl font-bold text-gray-900">3.76</p>
                <p className="text-xs text-blue-600">Top 20%</p>
              </div>
              <Award className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">AI Match Rate</p>
                <p className="text-2xl font-bold text-gray-900">87%</p>
                <p className="text-xs text-green-600">↑ 5% accuracy</p>
              </div>
              <Brain className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">New This Week</p>
                <p className="text-2xl font-bold text-gray-900">234</p>
                <p className="text-xs text-orange-600">Fresh talent</p>
              </div>
              <Zap className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Filters */}
        <div className="lg:col-span-1 space-y-6">
          {/* University Filter */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <GraduationCap className="h-5 w-5 mr-2" />
                University Filter
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Ranking Range</span>
                  <span className="text-gray-600">Top 1-50</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="100"
                  className="w-full"
                />

                <div className="space-y-2">
                  <label className="text-sm font-medium">Selected Universities</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedUniversities.length > 0 ? (
                      selectedUniversities.map(uni => (
                        <Badge key={uni} variant="secondary" className="cursor-pointer">
                          {uni} ×
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-gray-600">Click on map to select</p>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t">
                  <h4 className="text-sm font-medium mb-2">Quick Select</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm">Ivy League</Button>
                    <Button variant="outline" size="sm">Top 10</Button>
                    <Button variant="outline" size="sm">West Coast</Button>
                    <Button variant="outline" size="sm">East Coast</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Grade Filter */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Award className="h-5 w-5 mr-2" />
                Academic Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">GPA Range</label>
                  <div className="flex items-center space-x-2 mt-2">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="4"
                      value={gradeFilter.min}
                      onChange={(e) => setGradeFilter(prev => ({ ...prev, min: parseFloat(e.target.value) }))}
                      className="w-20 px-2 py-1 border rounded"
                    />
                    <span className="text-gray-900">to</span>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="4"
                      value={gradeFilter.max}
                      onChange={(e) => setGradeFilter(prev => ({ ...prev, max: parseFloat(e.target.value) }))}
                      className="w-20 px-2 py-1 border rounded"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Graduation Year</label>
                  <select
                    value={graduationYear}
                    onChange={(e) => setGraduationYear(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded-lg"
                  >
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                    <option value="2023">2023 (Alumni)</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">Honors & Awards</label>
                  <div className="space-y-2 mt-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm">Dean's List</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm">Cum Laude</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm">Research Published</span>
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills Filter */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Zap className="h-5 w-5 mr-2" />
                Skills & Technologies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-600" />
                  <input
                    type="text"
                    placeholder="Search skills..."
                    className="w-full pl-10 pr-3 py-2 border rounded-lg"
                  />
                </div>

                <div className="space-y-2">
                  {skillsData.slice(0, 5).map((skill) => (
                    <label key={skill.skill} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="mr-2"
                          checked={selectedSkills.includes(skill.skill)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedSkills(prev => [...prev, skill.skill])
                            } else {
                              setSelectedSkills(prev => prev.filter(s => s !== skill.skill))
                            }
                          }}
                        />
                        <span className="text-sm">{skill.skill}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {skill.count}
                      </Badge>
                    </label>
                  ))}
                </div>

                <Button variant="outline" size="sm" className="w-full">
                  Show All Skills
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Map and Results */}
        <div className="lg:col-span-2 space-y-6">
          {/* Interactive Map */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <Map className="h-5 w-5 mr-2" />
                  Geographic Talent Distribution
                </span>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">
                    {selectedUniversities.length} selected
                  </Badge>
                  <Button size="sm" variant="outline">
                    Reset Map
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MapVisualization />
            </CardContent>
          </Card>

          {/* State Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Talent by State</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {stateData.map((state) => (
                  <div
                    key={state.state}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                    onClick={() => setSelectedState(state.state)}
                  >
                    <div>
                      <h4 className="font-medium text-gray-900">{state.state}</h4>
                      <p className="text-sm text-gray-600">{state.students} students</p>
                      <Badge variant="outline" className="text-xs mt-1">
                        {state.topSkill}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">GPA {state.avgGPA}</p>
                      <ChevronRight className="h-4 w-4 text-gray-600 ml-auto" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Match Results */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <span className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Top Matches
                </span>
                <Button size="sm">
                  View All Results
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {searchResults.map((candidate) => (
                  <div
                    key={candidate.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-semibold">
                        {candidate.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{candidate.name}</h4>
                        <p className="text-sm text-gray-600">
                          {candidate.university} • {candidate.major} • GPA {candidate.gpa}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          {candidate.skills.map(skill => (
                            <Badge key={skill} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <p className="text-sm font-medium text-green-600">
                          AI Score: {candidate.aiScore}
                        </p>
                        <p className="text-xs text-gray-900">
                          {candidate.projects} projects
                        </p>
                      </div>
                      <Button size="sm">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Diversity Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Diversity & Inclusion Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{diversityMetrics.gender.female}%</p>
                  <p className="text-xs text-gray-600">Female</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{diversityMetrics.international}%</p>
                  <p className="text-xs text-gray-600">International</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">{diversityMetrics.firstGen}%</p>
                  <p className="text-xs text-gray-600">First Gen</p>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <p className="text-2xl font-bold text-orange-600">{diversityMetrics.veteran}%</p>
                  <p className="text-xs text-gray-600">Veterans</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}