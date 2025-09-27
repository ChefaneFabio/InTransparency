'use client'

import React, { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { GoogleMapComponent, MapMarker } from '@/components/maps/GoogleMapComponent'
import { PlacesAutocomplete } from '@/components/maps/PlacesAutocomplete'
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
  TrendingUp
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
}

const sampleTalentData: TalentData[] = [
  {
    id: '1',
    name: 'Computer Science Student',
    university: 'Local University',
    degree: 'Computer Science',
    year: '2024',
    skills: ['React', 'TypeScript', 'Node.js'],
    location: { lat: 40.7128, lng: -74.0060, city: 'New York', country: 'USA' },
    rating: 4.8,
    projects: 12
  },
  {
    id: '2',
    name: 'Engineering Graduate',
    university: 'Tech Institute',
    degree: 'Software Engineering',
    year: '2023',
    skills: ['Python', 'Machine Learning', 'Docker'],
    location: { lat: 37.7749, lng: -122.4194, city: 'San Francisco', country: 'USA' },
    rating: 4.9,
    projects: 8
  }
]

export default function GeographicTalentSearchPage() {
  const [selectedLocation, setSelectedLocation] = useState<string>('')
  const [selectedSkill, setSelectedSkill] = useState<string>('')
  const [selectedDegree, setSelectedDegree] = useState<string>('all')
  const [searchResults, setSearchResults] = useState<TalentData[]>(sampleTalentData)
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.0060 })
  const [selectedTalent, setSelectedTalent] = useState<TalentData | null>(null)

  const handleLocationSelect = (place: google.maps.places.PlaceResult) => {
    if (place.geometry?.location) {
      const lat = place.geometry.location.lat()
      const lng = place.geometry.location.lng()
      setMapCenter({ lat, lng })
      setSelectedLocation(place.name || place.formatted_address || '')
    }
  }

  const handleSearch = () => {
    // Simple search logic - in a real app this would call an API
    console.log('Searching for talent with:', { selectedLocation, selectedSkill, selectedDegree })
  }


  const skillOptions = ['React', 'TypeScript', 'Python', 'Node.js', 'Machine Learning', 'Docker', 'Java', 'C++']
  const degreeOptions = [
    { value: 'all', label: 'All Degrees' },
    { value: 'computer-science', label: 'Computer Science' },
    { value: 'engineering', label: 'Engineering' },
    { value: 'data-science', label: 'Data Science' }
  ]

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
            <div className="max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Search className="h-5 w-5 mr-2" />
                    Search Filters
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Location Search */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location
                      </label>
                      <PlacesAutocomplete
                        onPlaceSelect={handleLocationSelect}
                        placeholder="Search cities, universities..."
                        className="w-full"
                      />
                    </div>

                    {/* Skills Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Skills
                      </label>
                      <select
                        value={selectedSkill}
                        onChange={(e) => setSelectedSkill(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">All Skills</option>
                        {skillOptions.map(skill => (
                          <option key={skill} value={skill}>{skill}</option>
                        ))}
                      </select>
                    </div>

                    {/* Degree Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Degree
                      </label>
                      <select
                        value={selectedDegree}
                        onChange={(e) => setSelectedDegree(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {degreeOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Search Button */}
                    <div className="flex items-end">
                      <Button
                        onClick={handleSearch}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                      >
                        <Search className="h-4 w-4 mr-2" />
                        Search
                      </Button>
                    </div>
                  </div>
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
                          className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => setSelectedTalent(talent)}
                        >
                          <h3 className="font-semibold text-gray-900">{talent.name}</h3>
                          <p className="text-sm text-gray-600 flex items-center mt-1">
                            <GraduationCap className="h-3 w-3 mr-1" />
                            {talent.university}
                          </p>
                          <p className="text-sm text-gray-600">{talent.degree} • {talent.year}</p>

                          <div className="flex flex-wrap gap-1 mt-2">
                            {talent.skills.slice(0, 2).map(skill => (
                              <Badge key={skill} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {talent.skills.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{talent.skills.length - 2} more
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center text-sm">
                              <Star className="h-3 w-3 text-yellow-500 mr-1" />
                              <span>{talent.rating}</span>
                            </div>
                            <div className="text-sm text-gray-500">
                              {talent.projects} projects
                            </div>
                          </div>

                          <p className="text-xs text-gray-500 mt-2 flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
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
              Global Talent Network
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">Universities</div>
                <div className="text-sm text-gray-600">Partner institutions</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">Students</div>
                <div className="text-sm text-gray-600">Active profiles</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-2">Countries</div>
                <div className="text-sm text-gray-600">Global reach</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-600 mb-2">Matches</div>
                <div className="text-sm text-gray-600">Successful connections</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}