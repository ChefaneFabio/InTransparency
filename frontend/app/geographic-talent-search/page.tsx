'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { GoogleMapComponent, MapMarker, MapCircle, MapPolyline } from '@/components/maps/GoogleMapComponent'
import { PlacesAutocomplete } from '@/components/maps/PlacesAutocomplete'
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
  Minus,
  X
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
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.0060 }) // Default to NYC
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [mapFilters, setMapFilters] = useState({
    showUniversities: true,
    showTalentClusters: true,
    showHeatmap: true,
    minTalentSize: 1000,
    showConnections: false,
    showPaths: false,
    showStatistics: true,
    clusterRadius: 50
  })
  const [animationSpeed, setAnimationSpeed] = useState(1)
  const [showMeasurement, setShowMeasurement] = useState(false)
  const [measurementPoints, setMeasurementPoints] = useState<Array<{lat: number, lng: number}>>([])
  const [searchRadius, setSearchRadius] = useState(0)
  const [googleMap, setGoogleMap] = useState<google.maps.Map | null>(null)
  const [mapClickListener, setMapClickListener] = useState(false)

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
    // Center map on selected location
    setMapCenter({ lat: location.coordinates.lat, lng: location.coordinates.lng })
    setMapZoom(Math.max(mapZoom, 8))
  }

  const handleZoomIn = () => {
    if (googleMap) {
      const currentZoom = googleMap.getZoom() || 1
      googleMap.setZoom(Math.min(currentZoom + 1, 18))
    } else {
      setMapZoom(Math.min(mapZoom + 1, 18))
    }
  }

  const handleZoomOut = () => {
    if (googleMap) {
      const currentZoom = googleMap.getZoom() || 1
      googleMap.setZoom(Math.max(currentZoom - 1, 2))
    } else {
      setMapZoom(Math.max(mapZoom - 1, 2))
    }
  }

  const handleRegionFocus = (region: string) => {
    setIsLoading(true)
    setSelectedRegion(region)

    // Regional coordinates
    const regionCoords = {
      'North America': { lat: 45.0, lng: -100.0, zoom: 4 },
      'Europe': { lat: 54.5, lng: 15.2, zoom: 4 },
      'Asia Pacific': { lat: 35.0, lng: 103.0, zoom: 3 },
      'Rest of World': { lat: 0.0, lng: 0.0, zoom: 2 }
    }

    const coords = regionCoords[region as keyof typeof regionCoords]
    if (coords) {
      const newCenter = { lat: coords.lat, lng: coords.lng }
      setMapCenter(newCenter)
      setMapZoom(coords.zoom)

      if (googleMap) {
        googleMap.panTo(newCenter)
        googleMap.setZoom(coords.zoom)
      }
    }

    setTimeout(() => setIsLoading(false), 800)
  }

  const resetMapView = () => {
    const defaultCenter = { lat: 40.7128, lng: -74.0060 }
    const defaultZoom = 6

    setMapCenter(defaultCenter)
    setMapZoom(defaultZoom)
    setSelectedRegion(null)
    setSelectedLocation(null)
    clearMeasurement()

    if (googleMap) {
      googleMap.panTo(defaultCenter)
      googleMap.setZoom(defaultZoom)
    }
  }

  const applyMapFilters = (newFilters: any) => {
    setMapFilters(prev => ({ ...prev, ...newFilters }))
  }

  const startMeasurement = () => {
    setShowMeasurement(true)
    setMeasurementPoints([])
  }

  const addMeasurementPoint = (lat: number, lng: number) => {
    if (showMeasurement) {
      setMeasurementPoints(prev => [...prev, { lat, lng }])
    }
  }

  const clearMeasurement = () => {
    setShowMeasurement(false)
    setMeasurementPoints([])
  }

  const calculateDistance = (point1: {lat: number, lng: number}, point2: {lat: number, lng: number}) => {
    const R = 6371 // Earth's radius in km
    const dLat = (point2.lat - point1.lat) * Math.PI / 180
    const dLng = (point2.lng - point1.lng) * Math.PI / 180
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  const getTotalDistance = () => {
    if (measurementPoints.length < 2) return 0
    let total = 0
    for (let i = 1; i < measurementPoints.length; i++) {
      total += calculateDistance(measurementPoints[i-1], measurementPoints[i])
    }
    return total
  }

  const searchNearby = (centerLat: number, centerLng: number, radius: number) => {
    return universityLocations.filter(uni => {
      const distance = calculateDistance(
        { lat: centerLat, lng: centerLng },
        { lat: uni.coordinates.lat, lng: uni.coordinates.lng }
      )
      return distance <= radius
    })
  }

  const handleMapLoad = (map: google.maps.Map) => {
    setGoogleMap(map)
  }

  const handleMapCenterChanged = (center: google.maps.LatLngLiteral) => {
    setMapCenter(center)
  }

  const handleMapZoomChanged = (zoom: number) => {
    setMapZoom(zoom)
  }

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (showMeasurement && event.latLng) {
      const lat = event.latLng.lat()
      const lng = event.latLng.lng()
      addMeasurementPoint(lat, lng)
    }
  }

  const getMapTypeId = () => {
    switch (mapView) {
      case 'satellite': return google.maps.MapTypeId.SATELLITE
      case 'street': return google.maps.MapTypeId.ROADMAP
      case 'terrain': return google.maps.MapTypeId.TERRAIN
      default: return google.maps.MapTypeId.SATELLITE
    }
  }

  const createUniversityIcon = (university: any) => {
    const size = Math.min(Math.max(getTalentCount(university) / 1000, 12), 40)
    const color = university.talentDensity === 'very-high' ? '#EF4444' :
                  university.talentDensity === 'high' ? '#F97316' :
                  university.talentDensity === 'medium' ? '#EAB308' : '#10B981'

    return {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: color,
      fillOpacity: 0.8,
      strokeColor: '#ffffff',
      strokeWeight: 2,
      scale: size / 2,
    }
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
      <Card className="bg-white shadow-sm border border-gray-200">
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Enhanced Search Bar with Places Autocomplete */}
            <PlacesAutocomplete
              map={googleMap || undefined}
              placeholder="Search universities, cities, or locations..."
              searchTypes={['university', 'school', 'geocode']}
              onPlaceSelect={(place) => {
                if (place.geometry?.location) {
                  const lat = place.geometry.location.lat()
                  const lng = place.geometry.location.lng()
                  setMapCenter({ lat, lng })
                  setMapZoom(12)

                  // If university, add as selected location
                  if (place.types?.includes('university') || place.types?.includes('school')) {
                    setSelectedLocation({
                      id: Date.now(),
                      name: place.name || 'Unknown',
                      location: place.formatted_address || '',
                      coordinates: { lat, lng },
                      country: '',
                      students: 0,
                      graduates: 0,
                      researchers: 0,
                      faculty: 0,
                      topSkills: [],
                      ranking: 0,
                      recentGraduates: 0,
                      activeResearchers: 0,
                      talentDensity: 'medium'
                    })
                  }
                }
              }}
              className="w-full"
            />

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
          <Card
            key={index}
            className={`bg-white shadow-sm border border-gray-200 cursor-pointer transition-all hover:shadow-lg hover:border-gray-300 ${
              selectedRegion === region.name ? 'ring-2 ring-blue-400 bg-blue-50 border-blue-200' : ''
            }`}
            onClick={() => handleRegionFocus(region.name)}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-900">{region.name}</h3>
                <div className="flex items-center space-x-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: region.color }}
                  />
                  {selectedRegion === region.name && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  )}
                </div>
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
              <Button
                size="sm"
                variant="outline"
                className="w-full mt-3 text-xs"
                onClick={(e) => {
                  e.stopPropagation()
                  handleRegionFocus(region.name)
                }}
              >
                <MapPin className="h-3 w-3 mr-1" />
                Focus Region
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Interactive Map */}
      <Card className="bg-white shadow-sm border border-gray-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Globe className="h-5 w-5 mr-2" />
              Global Talent Map
            </CardTitle>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={mapFilters.showHeatmap}
                    onCheckedChange={(checked) => applyMapFilters({ showHeatmap: checked })}
                  />
                  <span className="text-sm text-gray-600">Heatmap</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={mapFilters.showUniversities}
                    onCheckedChange={(checked) => applyMapFilters({ showUniversities: checked })}
                  />
                  <span className="text-sm text-gray-600">Universities</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={mapFilters.showTalentClusters}
                    onCheckedChange={(checked) => applyMapFilters({ showTalentClusters: checked })}
                  />
                  <span className="text-sm text-gray-600">Clusters</span>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                Zoom: {mapZoom}x
              </div>
              <Button variant="outline" size="sm" onClick={resetMapView}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset View
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Real Google Maps Container */}
          <div className="relative rounded-lg overflow-hidden border-2 border-gray-200" style={{ height: '600px' }}>
            {/* Places Autocomplete Search Box */}
            <div className="absolute top-4 left-4 z-10 w-80">
              <PlacesAutocomplete
                map={googleMap || undefined}
                placeholder="Search universities, cities, or locations..."
                searchTypes={['university', 'establishment', 'geocode']}
                onPlaceSelect={(place) => {
                  if (place.geometry?.location) {
                    const lat = place.geometry.location.lat()
                    const lng = place.geometry.location.lng()
                    setMapCenter({ lat, lng })
                    if (place.types?.includes('university')) {
                      // If it's a university, add to selected location
                      setSelectedLocation({
                        id: 999,
                        name: place.name || 'Unknown',
                        location: place.formatted_address || '',
                        coordinates: { lat, lng },
                        country: '',
                        students: 0,
                        graduates: 0,
                        researchers: 0,
                        faculty: 0,
                        topSkills: [],
                        ranking: 0,
                        recentGraduates: 0,
                        activeResearchers: 0,
                        talentDensity: 'medium'
                      })
                    }
                  }
                }}
                className="shadow-lg"
              />
            </div>

            <GoogleMapComponent
              apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'demo-key'}
              center={mapCenter}
              zoom={mapZoom}
              mapTypeId={getMapTypeId()}
              onMapLoad={handleMapLoad}
              onCenterChanged={handleMapCenterChanged}
              onZoomChanged={handleMapZoomChanged}
              onMapClick={handleMapClick}
              className="w-full h-full"
            >
              {/* University Markers */}
              {mapFilters.showUniversities ? filteredUniversities
                .filter(uni => {
                  const talentFilter = getTalentCount(uni) >= mapFilters.minTalentSize
                  if (searchRadius === 0) return talentFilter
                  const distance = calculateDistance(mapCenter, uni.coordinates)
                  return talentFilter && distance <= searchRadius
                })
                .map((university) => (
                  <MapMarker
                    key={university.id}
                    position={university.coordinates}
                    icon={createUniversityIcon(university)}
                    title={`${university.name} - ${getTalentCount(university).toLocaleString()} ${selectedFilters.category}`}
                    onClick={() => handleLocationClick(university)}
                    zIndex={university.talentDensity === 'very-high' ? 100 : 50}
                  />
                )) : null}

              {/* Search Radius Circle */}
              {searchRadius > 0 && (
                <MapCircle
                  center={mapCenter}
                  radius={searchRadius * 1000} // Convert km to meters
                  fillColor="#3B82F6"
                  strokeColor="#1D4ED8"
                  fillOpacity={0.1}
                  strokeOpacity={0.6}
                  strokeWeight={2}
                />
              )}

              {/* Measurement Lines */}
              {measurementPoints.length > 1 && (
                <MapPolyline
                  path={measurementPoints}
                  strokeColor="#3B82F6"
                  strokeOpacity={0.8}
                  strokeWeight={3}
                />
              )}

              {/* Measurement Point Markers */}
              {measurementPoints.map((point, index) => (
                <MapMarker
                  key={`measurement-${index}`}
                  position={point}
                  icon={{
                    path: google.maps.SymbolPath.CIRCLE,
                    fillColor: '#3B82F6',
                    fillOpacity: 1,
                    strokeColor: '#ffffff',
                    strokeWeight: 2,
                    scale: 6,
                  }}
                  title={`Measurement Point ${index + 1}`}
                  zIndex={200}
                />
              ))}
            </GoogleMapComponent>

            {/* Loading Overlay */}
            {isLoading && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-30">
                <div className="text-center">
                  <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Updating map view...</p>
                </div>
              </div>
            )}

            {/* Advanced Map Tools */}
            <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2">
              {/* Zoom Controls */}
              <div className="bg-white/95 rounded-lg shadow-lg p-1 space-y-1">
                <Button
                  size="sm"
                  variant="outline"
                  className="w-8 h-8 p-0 hover:bg-blue-50"
                  onClick={handleZoomIn}
                  disabled={mapZoom >= 18}
                  title="Zoom In"
                >
                  <Plus className="h-3 w-3" />
                </Button>
                <div className="text-xs text-center text-gray-600 px-1">{mapZoom}x</div>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-8 h-8 p-0 hover:bg-blue-50"
                  onClick={handleZoomOut}
                  disabled={mapZoom <= 2}
                  title="Zoom Out"
                >
                  <Minus className="h-3 w-3" />
                </Button>
              </div>

              {/* Measurement Tools */}
              <div className="bg-white/95 rounded-lg shadow-lg p-1 space-y-1">
                <Button
                  size="sm"
                  variant={showMeasurement ? "default" : "outline"}
                  className="w-8 h-8 p-0 hover:bg-blue-50"
                  onClick={showMeasurement ? clearMeasurement : startMeasurement}
                  title={showMeasurement ? "Clear Measurement" : "Measure Distance"}
                >
                  <Target className="h-3 w-3" />
                </Button>
                {measurementPoints.length > 1 && (
                  <div className="text-xs text-center text-gray-600 px-1 whitespace-nowrap">
                    {getTotalDistance().toFixed(1)}km
                  </div>
                )}
              </div>

              {/* Search Radius Tool */}
              <div className="bg-white/95 rounded-lg shadow-lg p-1 space-y-1">
                <Button
                  size="sm"
                  variant={searchRadius > 0 ? "default" : "outline"}
                  className="w-8 h-8 p-0 hover:bg-blue-50"
                  onClick={() => setSearchRadius(searchRadius > 0 ? 0 : 100)}
                  title="Radius Search"
                >
                  <Search className="h-3 w-3" />
                </Button>
                {searchRadius > 0 && (
                  <div className="text-xs text-center text-gray-600 px-1">
                    {searchRadius}km
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="bg-white/95 rounded-lg shadow-lg p-1 space-y-1">
                <Button
                  size="sm"
                  variant="outline"
                  className="w-8 h-8 p-0 hover:bg-blue-50"
                  onClick={() => setSelectedLocation(null)}
                  title="Clear Selection"
                >
                  <X className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-8 h-8 p-0 hover:bg-blue-50"
                  onClick={resetMapView}
                  title="Reset View"
                >
                  <RefreshCw className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Map Scale Indicator */}
            <div className="absolute bottom-4 left-4 bg-white/90 rounded-lg px-2 py-1 text-xs text-gray-600">
              Scale: {mapZoom <= 4 ? 'Continental' : mapZoom <= 8 ? 'Regional' : 'City'}
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

            {/* Search Radius Visualization */}
            {searchRadius > 0 && (
              <div
                className="absolute rounded-full border-2 border-blue-400 border-dashed bg-blue-100 opacity-30"
                style={{
                  width: `${searchRadius * 2}px`,
                  height: `${searchRadius * 2}px`,
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  animation: 'pulse 2s infinite'
                }}
              />
            )}

            {/* Measurement Lines */}
            {measurementPoints.length > 1 && (
              <svg className="absolute inset-0 pointer-events-none">
                {measurementPoints.slice(1).map((point, index) => {
                  const prevPoint = measurementPoints[index]
                  return (
                    <line
                      key={index}
                      x1={`${20 + (index % 6) * 13}%`}
                      y1={`${20 + Math.floor(index / 6) * 25}%`}
                      x2={`${20 + ((index + 1) % 6) * 13}%`}
                      y2={`${20 + Math.floor((index + 1) / 6) * 25}%`}
                      stroke="#3B82F6"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                      className="animate-pulse"
                    />
                  )
                })}
              </svg>
            )}

            {/* Measurement Points */}
            {measurementPoints.map((point, index) => (
              <div
                key={index}
                className="absolute w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-lg"
                style={{
                  left: `${20 + (index % 6) * 13}%`,
                  top: `${20 + Math.floor(index / 6) * 25}%`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: 20
                }}
              >
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs bg-blue-500 text-white rounded px-1">
                  {index + 1}
                </div>
              </div>
            ))}

            {/* University Markers */}
            {mapFilters.showUniversities && filteredUniversities
              .filter(uni => {
                const talentFilter = getTalentCount(uni) >= mapFilters.minTalentSize
                if (searchRadius === 0) return talentFilter

                const distance = calculateDistance(mapCenter, uni.coordinates)
                return talentFilter && distance <= searchRadius
              })
              .map((university, index) => {
              const talentCount = getTalentCount(university)
              const markerSize = Math.min(Math.max(talentCount / (1000 / Math.max(mapZoom / 6, 1)), 8), Math.min(32, mapZoom * 4))

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
                  {university.talentDensity === 'very-high' && mapFilters.showHeatmap && (
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

      {/* Advanced Map Filters */}
      <Card className="bg-white shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Map Filters & Controls
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Talent Size
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                value={mapFilters.minTalentSize}
                onChange={(e) => applyMapFilters({ minTalentSize: parseInt(e.target.value) })}
              >
                <option value={500}>500+ people</option>
                <option value={1000}>1,000+ people</option>
                <option value={5000}>5,000+ people</option>
                <option value={10000}>10,000+ people</option>
                <option value={20000}>20,000+ people</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Map Center
              </label>
              <div className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                {mapCenter.lat.toFixed(2)}°N, {Math.abs(mapCenter.lng).toFixed(2)}°{mapCenter.lng < 0 ? 'W' : 'E'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quick Regions
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                value={selectedRegion || ''}
                onChange={(e) => e.target.value ? handleRegionFocus(e.target.value) : resetMapView()}
              >
                <option value="">Global View</option>
                <option value="North America">North America</option>
                <option value="Europe">Europe</option>
                <option value="Asia Pacific">Asia Pacific</option>
                <option value="Rest of World">Rest of World</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                View Type
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                value={mapView}
                onChange={(e) => setMapView(e.target.value as 'satellite' | 'street' | 'terrain')}
              >
                <option value="satellite">Satellite</option>
                <option value="street">Street Map</option>
                <option value="terrain">Terrain</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Radius
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                value={searchRadius}
                onChange={(e) => setSearchRadius(parseInt(e.target.value))}
              >
                <option value={0}>No Radius</option>
                <option value={50}>50 km</option>
                <option value={100}>100 km</option>
                <option value={200}>200 km</option>
                <option value={500}>500 km</option>
                <option value={1000}>1000 km</option>
              </select>
              {searchRadius > 0 && (
                <div className="text-xs text-gray-600 mt-1">
                  Showing universities within {searchRadius}km of map center
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Map Tools
              </label>
              <div className="space-y-2">
                <Button
                  size="sm"
                  variant={showMeasurement ? "default" : "outline"}
                  className="w-full"
                  onClick={showMeasurement ? clearMeasurement : startMeasurement}
                >
                  <Target className="h-3 w-3 mr-1" />
                  {showMeasurement ? 'Stop Measuring' : 'Measure Distance'}
                </Button>
                {measurementPoints.length > 1 && (
                  <div className="text-xs text-gray-600 bg-blue-50 px-2 py-1 rounded">
                    Total: {getTotalDistance().toFixed(1)} km
                  </div>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full"
                  onClick={resetMapView}
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Reset View
                </Button>
              </div>
            </div>
          </div>

          {/* Filter Status */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4 flex-wrap">
                <span className="text-gray-600">
                  Showing: {filteredUniversities
                    .filter(uni => {
                      const talentFilter = getTalentCount(uni) >= mapFilters.minTalentSize
                      if (searchRadius === 0) return talentFilter
                      const distance = calculateDistance(mapCenter, uni.coordinates)
                      return talentFilter && distance <= searchRadius
                    }).length} universities
                </span>
                <span className="text-gray-600">
                  Zoom: {mapZoom}x ({mapZoom <= 4 ? 'Continental' : mapZoom <= 8 ? 'Regional' : 'City'} view)
                </span>
                {searchRadius > 0 && (
                  <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded text-xs">
                    Radius: {searchRadius}km
                  </span>
                )}
                {showMeasurement && (
                  <span className="text-green-600 bg-green-50 px-2 py-1 rounded text-xs">
                    Measuring: {measurementPoints.length} points
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2 flex-wrap">
                {mapFilters.showUniversities && <Badge variant="secondary">Universities</Badge>}
                {mapFilters.showTalentClusters && <Badge variant="secondary">Clusters</Badge>}
                {mapFilters.showHeatmap && <Badge variant="secondary">Heatmap</Badge>}
                {searchRadius > 0 && <Badge variant="outline" className="text-blue-600">Radius Search</Badge>}
                {showMeasurement && <Badge variant="outline" className="text-green-600">Measurement Mode</Badge>}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Location Details */}
      {selectedLocation && (
        <Card className="bg-white shadow-sm border border-gray-200">
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
      <Card className="bg-white shadow-sm border border-gray-200">
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
              <div key={university.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md hover:bg-white transition-all">
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