'use client'

import React, { useState, useMemo } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { GoogleMapComponent, MapMarker } from '@/components/maps/GoogleMapComponent'
import { PlacesAutocomplete } from '@/components/maps/PlacesAutocomplete'
import { allCandidates, Candidate } from '@/lib/mock-candidates'
import {
  MapPin,
  Search,
  Users,
  GraduationCap,
  Building,
  Star,
  Filter,
  Globe,
  Award,
  TrendingUp,
  X
} from 'lucide-react'

// Force dynamic rendering to prevent SSR issues with Google Maps
export const dynamic = 'force-dynamic'

interface TalentData {
  id: string
  name: string
  university: string
  degree: string
  year: string
  skills: string[]
  location: {
    lat: number
    lng: number
    city: string
    country: string
  }
  rating: number
  projects: number
  gpa: number
  major: string
}

// Convert Candidate to TalentData
function candidateToTalentData(candidate: Candidate): TalentData {
  const primaryEducation = candidate.education[0]
  return {
    id: candidate.id,
    name: `${candidate.firstName} ${candidate.lastName}`,
    university: primaryEducation.university,
    degree: primaryEducation.degree,
    year: primaryEducation.graduationYear.toString(),
    skills: [
      ...candidate.skills.programming.slice(0, 3),
      ...candidate.skills.frameworks.slice(0, 2)
    ],
    location: {
      lat: candidate.location.coordinates.lat,
      lng: candidate.location.coordinates.lng,
      city: candidate.location.city,
      country: candidate.location.country
    },
    rating: candidate.aiProfileScore / 20, // Convert 0-100 to 0-5
    projects: candidate.projects.length,
    gpa: primaryEducation.gpa,
    major: primaryEducation.major
  }
}

// Extract all unique skills from candidates
function extractAllSkills(candidates: Candidate[]): string[] {
  const skillsSet = new Set<string>()
  candidates.forEach(candidate => {
    candidate.skills.programming.forEach(skill => skillsSet.add(skill))
    candidate.skills.frameworks.forEach(skill => skillsSet.add(skill))
    candidate.skills.databases.forEach(skill => skillsSet.add(skill))
    candidate.skills.tools.forEach(skill => skillsSet.add(skill))
  })
  return Array.from(skillsSet).sort()
}

// Extract all unique degrees
function extractAllDegrees(candidates: Candidate[]): string[] {
  const degreesSet = new Set<string>()
  candidates.forEach(candidate => {
    candidate.education.forEach(edu => degreesSet.add(edu.degree))
  })
  return Array.from(degreesSet).sort()
}

// Extract all unique majors
function extractAllMajors(candidates: Candidate[]): string[] {
  const majorsSet = new Set<string>()
  candidates.forEach(candidate => {
    candidate.education.forEach(edu => majorsSet.add(edu.major))
  })
  return Array.from(majorsSet).sort()
}

export default function GeographicTalentSearchPage() {
  const [selectedLocation, setSelectedLocation] = useState<string>('')
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [selectedDegree, setSelectedDegree] = useState<string>('all')
  const [selectedMajor, setSelectedMajor] = useState<string>('all')
  const [minGPA, setMinGPA] = useState<string>('')
  const [searchRadius, setSearchRadius] = useState<number>(500) // km
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.0060 })
  const [selectedTalent, setSelectedTalent] = useState<TalentData | null>(null)

  // Extract options from real candidate data
  const allSkills = useMemo(() => extractAllSkills(allCandidates), [])
  const allDegrees = useMemo(() => extractAllDegrees(allCandidates), [])
  const allMajors = useMemo(() => extractAllMajors(allCandidates), [])

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371 // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  // Filter candidates based on search criteria
  const searchResults = useMemo(() => {
    let filtered = allCandidates.map(candidateToTalentData)

    // Filter by location radius
    if (selectedLocation) {
      filtered = filtered.filter(talent => {
        const distance = calculateDistance(
          mapCenter.lat,
          mapCenter.lng,
          talent.location.lat,
          talent.location.lng
        )
        return distance <= searchRadius
      })
    }

    // Filter by skills
    if (selectedSkills.length > 0) {
      filtered = filtered.filter(talent =>
        selectedSkills.some(skill =>
          talent.skills.some(s => s.toLowerCase().includes(skill.toLowerCase()))
        )
      )
    }

    // Filter by degree
    if (selectedDegree !== 'all') {
      filtered = filtered.filter(talent =>
        talent.degree.toLowerCase() === selectedDegree.toLowerCase()
      )
    }

    // Filter by major
    if (selectedMajor !== 'all') {
      filtered = filtered.filter(talent =>
        talent.major.toLowerCase().includes(selectedMajor.toLowerCase())
      )
    }

    // Filter by minimum GPA
    if (minGPA) {
      const gpaThreshold = parseFloat(minGPA)
      filtered = filtered.filter(talent => talent.gpa >= gpaThreshold)
    }

    return filtered
  }, [selectedLocation, selectedSkills, selectedDegree, selectedMajor, minGPA, searchRadius, mapCenter])

  const handleLocationSelect = (place: google.maps.places.PlaceResult) => {
    if (place.geometry?.location) {
      const lat = place.geometry.location.lat()
      const lng = place.geometry.location.lng()
      setMapCenter({ lat, lng })
      setSelectedLocation(place.name || place.formatted_address || '')
    }
  }

  const handleAddSkill = (skill: string) => {
    if (skill && !selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill])
    }
  }

  const handleRemoveSkill = (skill: string) => {
    setSelectedSkills(selectedSkills.filter(s => s !== skill))
  }

  const handleClearFilters = () => {
    setSelectedLocation('')
    setSelectedSkills([])
    setSelectedDegree('all')
    setSelectedMajor('all')
    setMinGPA('')
    setSearchRadius(500)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Geographic Talent Search
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discover talented students and graduates from universities worldwide.
                Use our interactive map to find the right talent in any location.
              </p>
            </div>

            {/* Search Controls */}
            <div className="max-w-6xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Filter className="h-5 w-5 mr-2" />
                      Advanced Search Filters
                    </span>
                    {(selectedLocation || selectedSkills.length > 0 || selectedDegree !== 'all' || selectedMajor !== 'all' || minGPA) && (
                      <Button
                        onClick={handleClearFilters}
                        variant="outline"
                        size="sm"
                        className="text-gray-600 hover:text-gray-900"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Clear Filters
                      </Button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Location Search */}
                    <div>
                      <label className="block text-sm font-medium text-gray-800 mb-2">
                        Location
                      </label>
                      <PlacesAutocomplete
                        onPlaceSelect={handleLocationSelect}
                        placeholder="Search cities, countries..."
                        className="w-full"
                      />
                      {selectedLocation && (
                        <p className="text-xs text-gray-700 mt-1">📍 {selectedLocation}</p>
                      )}
                    </div>

                    {/* Search Radius */}
                    {selectedLocation && (
                      <div>
                        <label className="block text-sm font-medium text-gray-800 mb-2">
                          Search Radius (km)
                        </label>
                        <Input
                          type="number"
                          value={searchRadius}
                          onChange={(e) => setSearchRadius(parseInt(e.target.value) || 500)}
                          min="10"
                          max="20000"
                          className="w-full"
                        />
                      </div>
                    )}

                    {/* Degree Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-800 mb-2">
                        Degree Level
                      </label>
                      <select
                        value={selectedDegree}
                        onChange={(e) => setSelectedDegree(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="all">All Degrees</option>
                        {allDegrees.map(degree => (
                          <option key={degree} value={degree}>{degree}</option>
                        ))}
                      </select>
                    </div>

                    {/* Major Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-800 mb-2">
                        Major / Field of Study
                      </label>
                      <select
                        value={selectedMajor}
                        onChange={(e) => setSelectedMajor(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="all">All Majors</option>
                        {allMajors.map(major => (
                          <option key={major} value={major}>{major}</option>
                        ))}
                      </select>
                    </div>

                    {/* Min GPA Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-800 mb-2">
                        Minimum GPA
                      </label>
                      <Input
                        type="number"
                        value={minGPA}
                        onChange={(e) => setMinGPA(e.target.value)}
                        placeholder="e.g., 3.5"
                        step="0.1"
                        min="0"
                        max="4"
                        className="w-full"
                      />
                    </div>

                    {/* Skills Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-800 mb-2">
                        Add Skills
                      </label>
                      <select
                        onChange={(e) => {
                          handleAddSkill(e.target.value)
                          e.target.value = ''
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select skill...</option>
                        {allSkills.filter(s => !selectedSkills.includes(s)).map(skill => (
                          <option key={skill} value={skill}>{skill}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Selected Skills Display */}
                  {selectedSkills.length > 0 && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-800 mb-2">
                        Selected Skills:
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {selectedSkills.map(skill => (
                          <Badge
                            key={skill}
                            className="bg-blue-100 text-blue-800 border-blue-300 px-3 py-1 flex items-center gap-2"
                          >
                            {skill}
                            <X
                              className="h-3 w-3 cursor-pointer hover:text-blue-900"
                              onClick={() => handleRemoveSkill(skill)}
                            />
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Map */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center">
                        <MapPin className="h-5 w-5 mr-2" />
                        Talent Map
                      </span>
                      <Badge variant="secondary">
                        {searchResults.length} candidates found
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="h-96 w-full">
                      <GoogleMapComponent
                        apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}
                        center={mapCenter}
                        zoom={4}
                        className="w-full h-full rounded-b-lg"
                      >
                        {searchResults.map(talent => (
                          <MapMarker
                            key={talent.id}
                            position={{ lat: talent.location.lat, lng: talent.location.lng }}
                            title={talent.name}
                            onClick={() => setSelectedTalent(talent)}
                          />
                        ))}
                      </GoogleMapComponent>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Results Sidebar */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="h-5 w-5 mr-2" />
                      Search Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {searchResults.map(talent => (
                        <div
                          key={talent.id}
                          className="p-4 border border-gray-300 rounded-lg hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer bg-white"
                          onClick={() => setSelectedTalent(talent)}
                        >
                          <h3 className="font-semibold text-gray-900 text-base">{talent.name}</h3>
                          <p className="text-sm text-gray-800 flex items-center mt-1">
                            <GraduationCap className="h-4 w-4 mr-1 text-blue-600" />
                            {talent.university}
                          </p>
                          <p className="text-sm text-gray-800">{talent.degree} in {talent.major} • {talent.year}</p>
                          <p className="text-sm text-gray-700 font-medium mt-1">GPA: {talent.gpa.toFixed(2)}</p>

                          <div className="flex flex-wrap gap-1 mt-3">
                            {talent.skills.slice(0, 3).map(skill => (
                              <Badge key={skill} variant="secondary" className="text-xs bg-blue-100 text-blue-800 border-blue-200">
                                {skill}
                              </Badge>
                            ))}
                            {talent.skills.length > 3 && (
                              <Badge variant="outline" className="text-xs border-gray-400 text-gray-700">
                                +{talent.skills.length - 3} more
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center text-sm text-gray-800">
                              <Star className="h-4 w-4 text-yellow-500 mr-1" />
                              <span className="font-medium">{talent.rating.toFixed(1)}</span>
                            </div>
                            <div className="text-sm text-gray-700 font-medium">
                              {talent.projects} projects
                            </div>
                          </div>

                          <p className="text-sm text-gray-700 mt-2 flex items-center">
                            <MapPin className="h-4 w-4 mr-1 text-gray-600" />
                            {talent.location.city}, {talent.location.country}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-8 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
              Search Results Statistics
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {new Set(searchResults.map(t => t.university)).size}
                </div>
                <div className="text-sm text-gray-700 font-medium">Universities</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {searchResults.length}
                </div>
                <div className="text-sm text-gray-700 font-medium">Candidates Found</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {new Set(searchResults.map(t => t.location.country)).size}
                </div>
                <div className="text-sm text-gray-700 font-medium">Countries</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  {(searchResults.reduce((sum, t) => sum + t.rating, 0) / searchResults.length || 0).toFixed(1)}
                </div>
                <div className="text-sm text-gray-700 font-medium">Avg AI Score</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}