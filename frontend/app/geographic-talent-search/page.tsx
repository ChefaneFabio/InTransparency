'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import {
  MapPin,
  Search,
  Filter,
  Users,
  GraduationCap,
  Building,
  Star,
  Eye,
  MessageSquare,
  Bookmark,
  Layers,
  Target,
  Zap,
  Globe,
  Calendar,
  Award,
  TrendingUp,
  BarChart3,
  Settings,
  Download,
  RefreshCw,
  Maximize,
  Minimize,
  Plus,
  Minus
} from 'lucide-react'

export default function GeographicTalentSearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilters, setSelectedFilters] = useState({
    category: 'all', // all, students, graduates, researchers, faculty
    degree: 'all', // all, bachelor, master, phd
    year: 'all', // all, 2024, 2025, 2026, 2027
    skills: [] as string[],
    universities: [] as string[],
    experience: 'all' // all, 0-1, 1-3, 3-5, 5+
  })
  const [mapView, setMapView] = useState<'satellite' | 'street' | 'terrain'>('satellite')
  const [heatmapEnabled, setHeatmapEnabled] = useState(true)
  const [selectedLocation, setSelectedLocation] = useState<any>(null)
  const [mapZoom, setMapZoom] = useState(6)

  const universityLocations = [
    {
      id: 1,
      name: 'MIT',
      location: 'Cambridge, MA',
      coordinates: { lat: 42.3601, lng: -71.0942 },
      country: 'USA',
      students: 11520,
      graduates: 2847,
      researchers: 456,
      faculty: 1234,
      topSkills: ['AI', 'Machine Learning', 'Computer Science', 'Engineering'],
      ranking: 1,
      recentGraduates: 892,
      activeResearchers: 234,
      talentDensity: 'very-high'
    },
    {
      id: 2,
      name: 'Stanford University',
      location: 'Stanford, CA',
      coordinates: { lat: 37.4275, lng: -122.1697 },
      country: 'USA',
      students: 17249,
      graduates: 3456,
      researchers: 678,
      faculty: 1789,
      topSkills: ['AI', 'Entrepreneurship', 'Computer Science', 'Business'],
      ranking: 2,
      recentGraduates: 1234,
      activeResearchers: 345,
      talentDensity: 'very-high'
    },
    {
      id: 3,
      name: 'Harvard University',
      location: 'Cambridge, MA',
      coordinates: { lat: 42.3770, lng: -71.1167 },
      country: 'USA',
      students: 23731,
      graduates: 4567,
      researchers: 789,
      faculty: 2345,
      topSkills: ['Business', 'Medicine', 'Law', 'Research'],
      ranking: 3,
      recentGraduates: 1567,
      activeResearchers: 456,
      talentDensity: 'very-high'
    },
    {
      id: 4,
      name: 'University of Oxford',
      location: 'Oxford, UK',
      coordinates: { lat: 51.7548, lng: -1.2544 },
      country: 'UK',
      students: 24515,
      graduates: 5678,
      researchers: 890,
      faculty: 2567,
      topSkills: ['Research', 'Literature', 'Philosophy', 'Science'],
      ranking: 4,
      recentGraduates: 1890,
      activeResearchers: 567,
      talentDensity: 'high'
    },
    {
      id: 5,
      name: 'University of Cambridge',
      location: 'Cambridge, UK',
      coordinates: { lat: 52.2043, lng: 0.1218 },
      country: 'UK',
      students: 23247,
      graduates: 5234,
      researchers: 823,
      faculty: 2456,
      topSkills: ['Mathematics', 'Science', 'Engineering', 'Research'],
      ranking: 5,
      recentGraduates: 1678,
      activeResearchers: 478,
      talentDensity: 'high'
    },
    {
      id: 6,
      name: 'ETH Zurich',
      location: 'Zurich, Switzerland',
      coordinates: { lat: 47.3769, lng: 8.5417 },
      country: 'Switzerland',
      students: 22200,
      graduates: 3890,
      researchers: 645,
      faculty: 1890,
      topSkills: ['Engineering', 'Computer Science', 'Mathematics', 'Physics'],
      ranking: 6,
      recentGraduates: 1234,
      activeResearchers: 389,
      talentDensity: 'high'
    },
    {
      id: 7,
      name: 'University of Toronto',
      location: 'Toronto, Canada',
      coordinates: { lat: 43.6629, lng: -79.3957 },
      country: 'Canada',
      students: 97000,
      graduates: 12000,
      researchers: 1200,
      faculty: 3500,
      topSkills: ['Computer Science', 'AI', 'Medicine', 'Business'],
      ranking: 18,
      recentGraduates: 3456,
      activeResearchers: 678,
      talentDensity: 'very-high'
    },
    {
      id: 8,
      name: 'University of Melbourne',
      location: 'Melbourne, Australia',
      coordinates: { lat: -37.7982, lng: 144.9605 },
      country: 'Australia',
      students: 51000,
      graduates: 8500,
      researchers: 950,
      faculty: 2800,
      topSkills: ['Medicine', 'Engineering', 'Business', 'Research'],
      ranking: 33,
      recentGraduates: 2890,
      activeResearchers: 523,
      talentDensity: 'high'
    }
  ]

  const talentCategories = [
    { id: 'all', label: 'All Talent', count: 247536, icon: Users },
    { id: 'students', label: 'Current Students', count: 189234, icon: GraduationCap },
    { id: 'graduates', label: 'Recent Graduates', count: 34567, icon: Award },
    { id: 'researchers', label: 'Researchers', count: 12890, icon: Building },
    { id: 'faculty', label: 'Faculty', count: 10845, icon: Star }
  ]

  const skillsFilter = [
    'Computer Science', 'AI & Machine Learning', 'Data Science', 'Software Engineering',
    'Business', 'Medicine', 'Engineering', 'Research', 'Mathematics', 'Physics',
    'Biology', 'Chemistry', 'Economics', 'Psychology', 'Design', 'Marketing'
  ]

  const topUniversities = [
    'MIT', 'Stanford', 'Harvard', 'Cambridge', 'Oxford', 'ETH Zurich', 'Caltech',
    'Imperial College London', 'UCL', 'University of Chicago', 'NUS', 'Peking University'
  ]

  const mapRegions = [
    { name: 'North America', students: 89234, graduates: 15678, color: '#3B82F6' },
    { name: 'Europe', students: 76543, graduates: 12345, color: '#10B981' },
    { name: 'Asia Pacific', students: 65432, graduates: 9876, color: '#F59E0B' },
    { name: 'Rest of World', students: 15867, graduates: 2468, color: '#8B5CF6' }
  ]

  const getTalentDensityColor = (density: string) => {
    switch (density) {
      case 'very-high': return 'bg-red-500'
      case 'high': return 'bg-orange-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const getTalentCount = (university: any) => {
    switch (selectedFilters.category) {
      case 'students': return university.students
      case 'graduates': return university.graduates
      case 'researchers': return university.researchers
      case 'faculty': return university.faculty
      default: return university.students + university.graduates + university.researchers + university.faculty
    }
  }

  const handleLocationClick = (location: any) => {
    setSelectedLocation(location)
  }

  const filteredUniversities = universityLocations.filter(uni => {
    const matchesSearch = searchQuery === '' ||
      uni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      uni.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      uni.topSkills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesSkills = selectedFilters.skills.length === 0 ||
      selectedFilters.skills.some(skill => uni.topSkills.includes(skill))

    const matchesUniversities = selectedFilters.universities.length === 0 ||
      selectedFilters.universities.includes(uni.name)

    return matchesSearch && matchesSkills && matchesUniversities
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <Header />
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900">Geographic Talent Search</h1>
            <p className="text-xl text-gray-600 mt-4 max-w-3xl mx-auto">
              Discover talent across universities worldwide with interactive geographic mapping and advanced filtering
            </p>
          </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search universities, locations, or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Talent Category Filters */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Talent Category</h3>
              <div className="flex flex-wrap gap-2">
                {talentCategories.map((category) => {
                  const Icon = category.icon
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedFilters(prev => ({ ...prev, category: category.id }))}
                      className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedFilters.category === category.id
                          ? 'bg-blue-100 text-blue-700 border border-blue-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {category.label}
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {category.count.toLocaleString()}
                      </Badge>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Advanced Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
                <select
                  multiple
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  value={selectedFilters.skills}
                  onChange={(e) => {
                    const values = Array.from(e.target.selectedOptions, option => option.value)
                    setSelectedFilters(prev => ({ ...prev, skills: values }))
                  }}
                >
                  {skillsFilter.map(skill => (
                    <option key={skill} value={skill}>{skill}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Universities</label>
                <select
                  multiple
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  value={selectedFilters.universities}
                  onChange={(e) => {
                    const values = Array.from(e.target.selectedOptions, option => option.value)
                    setSelectedFilters(prev => ({ ...prev, universities: values }))
                  }}
                >
                  {topUniversities.map(uni => (
                    <option key={uni} value={uni}>{uni}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Graduation Year</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  value={selectedFilters.year}
                  onChange={(e) => setSelectedFilters(prev => ({ ...prev, year: e.target.value }))}
                >
                  <option value="all">All Years</option>
                  <option value="2024">2024</option>
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                  <option value="2027">2027</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  value={selectedFilters.experience}
                  onChange={(e) => setSelectedFilters(prev => ({ ...prev, experience: e.target.value }))}
                >
                  <option value="all">All Experience</option>
                  <option value="0-1">0-1 years</option>
                  <option value="1-3">1-3 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value="5+">5+ years</option>
                </select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Regional Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {mapRegions.map((region, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-900">{region.name}</h3>
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: region.color }}
                />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Students</span>
                  <span className="text-sm font-medium">{region.students.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Graduates</span>
                  <span className="text-sm font-medium">{region.graduates.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Interactive Map */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Globe className="h-5 w-5 mr-2" />
              Global Talent Map
            </CardTitle>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={heatmapEnabled}
                  onCheckedChange={setHeatmapEnabled}
                />
                <span className="text-sm text-gray-600">Heatmap</span>
              </div>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Map Settings
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Map Container */}
          <div className="relative bg-gradient-to-br from-blue-100 to-green-100 rounded-lg overflow-hidden" style={{ height: '500px' }}>
            {/* Map Controls */}
            <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2">
              <Button size="sm" variant="outline" className="w-8 h-8 p-0">
                <Plus className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" className="w-8 h-8 p-0">
                <Minus className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" className="w-8 h-8 p-0">
                <Layers className="h-4 w-4" />
              </Button>
            </div>

            {/* Map View Toggle */}
            <div className="absolute top-4 left-4 z-10 flex space-x-1 bg-white rounded-lg p-1 shadow-sm">
              <button
                onClick={() => setMapView('satellite')}
                className={`px-3 py-1 text-xs rounded ${
                  mapView === 'satellite' ? 'bg-blue-100 text-blue-700' : 'text-gray-600'
                }`}
              >
                Satellite
              </button>
              <button
                onClick={() => setMapView('street')}
                className={`px-3 py-1 text-xs rounded ${
                  mapView === 'street' ? 'bg-blue-100 text-blue-700' : 'text-gray-600'
                }`}
              >
                Street
              </button>
              <button
                onClick={() => setMapView('terrain')}
                className={`px-3 py-1 text-xs rounded ${
                  mapView === 'terrain' ? 'bg-blue-100 text-blue-700' : 'text-gray-600'
                }`}
              >
                Terrain
              </button>
            </div>

            {/* University Markers */}
            {filteredUniversities.map((university, index) => {
              const talentCount = getTalentCount(university)
              const markerSize = Math.min(Math.max(talentCount / 1000, 8), 24)

              return (
                <div
                  key={university.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                  style={{
                    left: `${20 + (index % 6) * 13}%`,
                    top: `${20 + Math.floor(index / 6) * 25}%`,
                  }}
                  onClick={() => handleLocationClick(university)}
                >
                  {/* University Marker */}
                  <div
                    className={`rounded-full flex items-center justify-center text-white font-semibold shadow-lg hover:scale-110 transition-transform ${getTalentDensityColor(university.talentDensity)}`}
                    style={{
                      width: `${markerSize + 8}px`,
                      height: `${markerSize + 8}px`,
                      animation: heatmapEnabled ? `pulse ${2 + index * 0.3}s infinite` : 'none'
                    }}
                  >
                    <GraduationCap className="h-4 w-4" />
                  </div>

                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap z-20 shadow-xl">
                    <div className="font-semibold">{university.name}</div>
                    <div>{university.location}</div>
                    <div>{talentCount.toLocaleString()} {selectedFilters.category}</div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-800"></div>
                  </div>

                  {/* Ripple Effect for High Density */}
                  {university.talentDensity === 'very-high' && heatmapEnabled && (
                    <div
                      className="absolute rounded-full bg-red-300 opacity-30 animate-ping"
                      style={{
                        width: `${markerSize + 16}px`,
                        height: `${markerSize + 16}px`,
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)'
                      }}
                    />
                  )}
                </div>
              )
            })}

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-white rounded-lg p-4 shadow-sm">
              <h4 className="font-medium text-gray-900 mb-2">Talent Density</h4>
              <div className="space-y-1 text-xs">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  <span>Very High (10k+)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                  <span>High (5k-10k)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                  <span>Medium (1k-5k)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span>Low (&lt; 1k)</span>
                </div>
              </div>
            </div>

            {/* Results Counter */}
            <div className="absolute bottom-4 right-4 bg-white rounded-lg px-3 py-2 shadow-sm">
              <span className="text-sm font-medium text-gray-900">
                {filteredUniversities.length} universities found
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Location Details */}
      {selectedLocation && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                {selectedLocation.name}
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedLocation(null)}
              >
                ✕
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Location</p>
                  <p className="text-gray-900">{selectedLocation.location}, {selectedLocation.country}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Global Ranking</p>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    <span className="font-semibold text-gray-900">#{selectedLocation.ranking}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Talent Numbers</p>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Students:</span>
                      <span className="font-medium">{selectedLocation.students.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Graduates:</span>
                      <span className="font-medium">{selectedLocation.graduates.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Researchers:</span>
                      <span className="font-medium">{selectedLocation.researchers.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Faculty:</span>
                      <span className="font-medium">{selectedLocation.faculty.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Top Skills</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedLocation.topSkills.map((skill: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex space-x-2">
                  <Button size="sm">
                    <Eye className="h-3 w-3 mr-1" />
                    View Profiles
                  </Button>
                  <Button size="sm" variant="outline">
                    <MessageSquare className="h-3 w-3 mr-1" />
                    Contact
                  </Button>
                  <Button size="sm" variant="outline">
                    <Bookmark className="h-3 w-3 mr-1" />
                    Save
                  </Button>
                </div>
                <div>
                  <Button size="sm" variant="outline" className="w-full">
                    <Target className="h-3 w-3 mr-1" />
                    Search This Location
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* University List View */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              University Directory
            </span>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export List
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUniversities.map((university) => (
              <div key={university.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${getTalentDensityColor(university.talentDensity)}`} />
                    <h3 className="font-semibold text-gray-900">{university.name}</h3>
                    <Badge variant="secondary" className="text-xs">
                      Rank #{university.ranking}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button size="sm">
                      <MessageSquare className="h-3 w-3 mr-1" />
                      Connect
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Location</p>
                    <p className="font-medium">{university.location}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Students</p>
                    <p className="font-medium">{university.students.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Graduates</p>
                    <p className="font-medium">{university.graduates.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Researchers</p>
                    <p className="font-medium">{university.researchers.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Faculty</p>
                    <p className="font-medium">{university.faculty.toLocaleString()}</p>
                  </div>
                </div>

                <div className="mt-3">
                  <p className="text-sm text-gray-600 mb-2">Top Skills</p>
                  <div className="flex flex-wrap gap-1">
                    {university.topSkills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}