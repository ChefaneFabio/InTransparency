'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import {
  Search,
  Filter,
  X,
  MapPin,
  Building2,
  GraduationCap,
  Briefcase,
  Code,
  TrendingUp,
  Clock
} from 'lucide-react'

interface SearchFilters {
  query: string
  location: string[]
  universities: string[]
  companies: string[]
  skills: string[]
  industries: string[]
  experienceLevel: string[]
  jobTypes: string[]
  salaryRange: [number, number]
}

interface SearchSuggestion {
  type: 'skill' | 'university' | 'company' | 'location' | 'industry'
  value: string
  count: number
}

interface SearchResult {
  id: string
  type: 'student' | 'job' | 'project' | 'university'
  title: string
  subtitle: string
  description: string
  tags: string[]
  relevanceScore: number
  location?: string
  company?: string
  university?: string
  imageUrl?: string
}

export function AdvancedSearch() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    location: [],
    universities: [],
    companies: [],
    skills: [],
    industries: [],
    experienceLevel: [],
    jobTypes: [],
    salaryRange: [0, 200000]
  })
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Mock data for suggestions
  const mockSuggestions: SearchSuggestion[] = [
    { type: 'skill', value: 'React', count: 1234 },
    { type: 'skill', value: 'Python', count: 987 },
    { type: 'skill', value: 'Machine Learning', count: 756 },
    { type: 'skill', value: 'JavaScript', count: 1567 },
    { type: 'university', value: 'MIT', count: 234 },
    { type: 'university', value: 'Stanford University', count: 189 },
    { type: 'university', value: 'Harvard University', count: 145 },
    { type: 'company', value: 'Google', count: 89 },
    { type: 'company', value: 'Microsoft', count: 67 },
    { type: 'company', value: 'Apple', count: 54 },
    { type: 'location', value: 'San Francisco', count: 456 },
    { type: 'location', value: 'New York', count: 423 },
    { type: 'location', value: 'Remote', count: 789 },
    { type: 'industry', value: 'Software Development', count: 1234 },
    { type: 'industry', value: 'Data Science', count: 567 },
    { type: 'industry', value: 'AI/Machine Learning', count: 345 }
  ]

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('intransparency-recent-searches')
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  const handleSearch = async (searchQuery?: string) => {
    const query = searchQuery || filters.query
    if (!query.trim()) return

    setIsSearching(true)

    try {
      // Add to recent searches
      const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 10)
      setRecentSearches(updated)
      localStorage.setItem('intransparency-recent-searches', JSON.stringify(updated))

      // Perform search (mock implementation)
      await new Promise(resolve => setTimeout(resolve, 800)) // Simulate API call

      // Mock results
      const mockResults: SearchResult[] = [
        {
          id: '1',
          type: 'student',
          title: 'Sarah Chen',
          subtitle: 'Computer Science, Stanford University',
          description: 'Full-stack developer with expertise in React, Node.js, and machine learning. Built an e-commerce platform with 10k+ users.',
          tags: ['React', 'Node.js', 'Python', 'TensorFlow'],
          relevanceScore: 95,
          location: 'San Francisco, CA',
          university: 'Stanford University',
          imageUrl: '/avatars/sarah-chen.jpg'
        },
        {
          id: '2',
          type: 'job',
          title: 'Frontend Developer Intern',
          subtitle: 'Google Inc.',
          description: 'Build user interfaces for Google\'s next-generation products using React and TypeScript.',
          tags: ['React', 'TypeScript', 'JavaScript', 'CSS'],
          relevanceScore: 89,
          location: 'Mountain View, CA',
          company: 'Google'
        },
        {
          id: '3',
          type: 'project',
          title: 'AI-Powered Code Assistant',
          subtitle: 'Marcus Johnson, MIT',
          description: 'VS Code extension that uses machine learning to provide intelligent code completions and bug detection.',
          tags: ['Python', 'TensorFlow', 'VS Code API', 'NLP'],
          relevanceScore: 87,
          university: 'MIT'
        }
      ]

      setResults(mockResults)
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setIsSearching(false)
    }
  }

  const getSuggestions = (query: string): SearchSuggestion[] => {
    if (!query) return []

    return mockSuggestions
      .filter(s => s.value.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 8)
  }

  const addFilter = (type: keyof SearchFilters, value: string) => {
    setFilters(prev => {
      const currentValues = prev[type] as string[]
      if (currentValues.includes(value)) return prev

      return {
        ...prev,
        [type]: [...currentValues, value]
      }
    })
  }

  const removeFilter = (type: keyof SearchFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [type]: (prev[type] as string[]).filter(v => v !== value)
    }))
  }

  const getIconForType = (type: string) => {
    switch (type) {
      case 'skill': return <Code className="h-4 w-4" />
      case 'university': return <GraduationCap className="h-4 w-4" />
      case 'company': return <Building2 className="h-4 w-4" />
      case 'location': return <MapPin className="h-4 w-4" />
      case 'industry': return <Briefcase className="h-4 w-4" />
      default: return <Search className="h-4 w-4" />
    }
  }

  const currentSuggestions = getSuggestions(filters.query)

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 h-5 w-5" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search students, jobs, projects, universities..."
            value={filters.query}
            onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            onFocus={() => setIsExpanded(true)}
            className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent text-lg"
          />
          <Button
            onClick={() => handleSearch()}
            disabled={isSearching}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 px-4 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700"
          >
            {isSearching ? 'Searching...' : 'Search'}
          </Button>
        </div>

        {/* Search Suggestions */}
        {isExpanded && filters.query && (
          <Card className="absolute top-full left-0 right-0 mt-2 z-50 shadow-xl">
            <CardContent className="p-0">
              {currentSuggestions.length > 0 ? (
                <div className="max-h-64 overflow-y-auto">
                  {currentSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        addFilter(suggestion.type === 'skill' ? 'skills' :
                                 suggestion.type === 'university' ? 'universities' :
                                 suggestion.type === 'company' ? 'companies' :
                                 suggestion.type === 'location' ? 'location' : 'industries',
                                 suggestion.value)
                        setFilters(prev => ({ ...prev, query: '' }))
                      }}
                      className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                    >
                      <div className="flex items-center space-x-3">
                        {getIconForType(suggestion.type)}
                        <div>
                          <div className="font-medium">{suggestion.value}</div>
                          <div className="text-sm text-gray-700 capitalize">{suggestion.type}</div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-700">{suggestion.count}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-gray-700">
                  No suggestions found
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recent Searches */}
      {isExpanded && !filters.query && recentSearches.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Recent Searches</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2">
              {recentSearches.slice(0, 5).map((search, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setFilters(prev => ({ ...prev, query: search }))
                    handleSearch(search)
                  }}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <Clock className="h-3 w-3 mr-1" />
                  {search}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Filters */}
      {Object.entries(filters).some(([key, value]) =>
        key !== 'query' && key !== 'salaryRange' && Array.isArray(value) && value.length > 0
      ) && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Filters</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2">
              {Object.entries(filters).map(([key, values]) => {
                if (key === 'query' || key === 'salaryRange' || !Array.isArray(values) || values.length === 0) return null

                return values.map((value, index) => (
                  <Badge
                    key={`${key}-${index}`}
                    variant="secondary"
                    className="bg-teal-50 text-teal-700 hover:bg-teal-100"
                  >
                    {value}
                    <X
                      className="h-3 w-3 ml-1 cursor-pointer hover:text-red-600"
                      onClick={() => removeFilter(key as keyof SearchFilters, value)}
                    />
                  </Badge>
                ))
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Results */}
      {results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Search Results ({results.length})</h3>
            <div className="text-sm text-gray-700">
              Sorted by relevance
            </div>
          </div>

          {results.map((result) => (
            <Card key={result.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-100 to-blue-100 rounded-lg flex items-center justify-center">
                    {result.type === 'student' && <GraduationCap className="h-6 w-6 text-teal-600" />}
                    {result.type === 'job' && <Briefcase className="h-6 w-6 text-blue-600" />}
                    {result.type === 'project' && <Code className="h-6 w-6 text-purple-600" />}
                    {result.type === 'university' && <Building2 className="h-6 w-6 text-green-600" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{result.title}</h4>
                        <p className="text-sm text-gray-600">{result.subtitle}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-green-100 text-green-800">
                          {result.relevanceScore}% match
                        </Badge>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-3 line-clamp-2">{result.description}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {result.tags.slice(0, 4).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {result.tags.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{result.tags.length - 4} more
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-700">
                        {result.location && (
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3" />
                            <span>{result.location}</span>
                          </div>
                        )}
                        {(result.company || result.university) && (
                          <div className="flex items-center space-x-1">
                            <Building2 className="h-3 w-3" />
                            <span>{result.company || result.university}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Click outside to close */}
      {isExpanded && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </div>
  )
}