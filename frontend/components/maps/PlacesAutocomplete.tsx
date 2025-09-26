'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Search, MapPin, X } from 'lucide-react'

interface PlacesAutocompleteProps {
  map?: google.maps.Map
  onPlaceSelect?: (place: google.maps.places.PlaceResult) => void
  placeholder?: string
  defaultValue?: string
  className?: string
  searchTypes?: string[]
  searchBounds?: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral
  countryRestriction?: string | string[]
}

export function PlacesAutocomplete({
  map,
  onPlaceSelect,
  placeholder = 'Search for universities or locations...',
  defaultValue = '',
  className = '',
  searchTypes = ['university', 'establishment', 'geocode'],
  searchBounds,
  countryRestriction
}: PlacesAutocompleteProps) {
  const [value, setValue] = useState(defaultValue)
  const [isSearching, setIsSearching] = useState(false)
  const [suggestions, setSuggestions] = useState<google.maps.places.AutocompletePrediction[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null)
  const placesService = useRef<google.maps.places.PlacesService | null>(null)
  const [showSuggestions, setShowSuggestions] = useState(false)

  useEffect(() => {
    if (window.google && !autocompleteService.current) {
      // DEPRECATION NOTICE: google.maps.places.AutocompleteService deprecated March 1, 2025
      // Migration to google.maps.places.AutocompleteSuggestion planned but API not yet stable
      // See: https://developers.google.com/maps/documentation/javascript/places-migration-overview
      // Current implementation continues to work with bug fixes for major regressions
      autocompleteService.current = new google.maps.places.AutocompleteService()
    }
    if (map && !placesService.current) {
      // DEPRECATION NOTICE: google.maps.places.PlacesService deprecated March 1, 2025
      // Migration to google.maps.places.Place planned but API not yet stable
      // See: https://developers.google.com/maps/documentation/javascript/places-migration-overview
      // Current implementation continues to work with bug fixes for major regressions
      placesService.current = new google.maps.places.PlacesService(map)
    }
  }, [map])

  const searchPlaces = useCallback((searchTerm: string) => {
    if (!autocompleteService.current || searchTerm.length < 2) {
      setSuggestions([])
      return
    }

    const request: google.maps.places.AutocompletionRequest = {
      input: searchTerm,
      types: searchTypes,
    }

    if (searchBounds) {
      request.bounds = searchBounds
    }

    if (countryRestriction) {
      const countries = Array.isArray(countryRestriction) ? countryRestriction : [countryRestriction]
      request.componentRestrictions = { country: countries }
    }

    setIsSearching(true)
    // LEGACY API USAGE: getPlacePredictions deprecated March 1, 2025
    // This API continues to receive bug fixes but will migrate when replacement is stable
    autocompleteService.current.getPlacePredictions(request, (predictions, status) => {
      setIsSearching(false)
      if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
        setSuggestions(predictions)
        setShowSuggestions(true)
      } else {
        setSuggestions([])
      }
    })
  }, [searchTypes, searchBounds, countryRestriction])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setValue(newValue)
    if (newValue.trim()) {
      searchPlaces(newValue)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

  const handleSelectPlace = (placeId: string) => {
    if (!placesService.current) return

    const request = {
      placeId: placeId,
      fields: [
        'name',
        'formatted_address',
        'geometry',
        'place_id',
        'types',
        'address_components',
        'website',
        'formatted_phone_number',
        'rating',
        'user_ratings_total'
      ]
    }

    // LEGACY API USAGE: getDetails deprecated March 1, 2025
    // This API continues to receive bug fixes but will migrate when replacement is stable
    placesService.current.getDetails(request, (place, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && place) {
        setValue(place.name || '')
        setSuggestions([])
        setShowSuggestions(false)

        // Pan map to location
        if (map && place.geometry?.location) {
          map.panTo(place.geometry.location)
          if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport)
          } else {
            map.setZoom(15)
          }
        }

        // Callback with place details
        if (onPlaceSelect) {
          onPlaceSelect(place)
        }
      }
    })
  }

  const clearSearch = () => {
    setValue('')
    setSuggestions([])
    setShowSuggestions(false)
  }

  const highlightMatch = (text: string, query: string) => {
    const parts = text.split(new RegExp(`(${query})`, 'gi'))
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <strong key={i} className="text-blue-600">{part}</strong>
      ) : (
        <span key={i}>{part}</span>
      )
    )
  }

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          {isSearching ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          ) : (
            <Search className="h-4 w-4 text-gray-400" />
          )}
        </div>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {value && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.place_id}
              onClick={() => handleSelectPlace(suggestion.place_id)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-0"
            >
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">
                    {highlightMatch(suggestion.structured_formatting.main_text, value)}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {suggestion.structured_formatting.secondary_text}
                  </div>
                  {suggestion.types && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {suggestion.types.slice(0, 3).map((type) => (
                        <span
                          key={type}
                          className="inline-block px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded"
                        >
                          {type.replace(/_/g, ' ')}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Click outside handler */}
      {showSuggestions && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowSuggestions(false)}
        />
      )}
    </div>
  )
}

// Standalone search box that can be used outside the map
export function UniversitySearchBox({
  onSelectUniversity,
  className = ''
}: {
  onSelectUniversity?: (place: google.maps.places.PlaceResult) => void
  className?: string
}) {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (window.google && window.google.maps) {
      setIsLoaded(true)
    } else {
      const checkGoogle = setInterval(() => {
        if (window.google && window.google.maps) {
          setIsLoaded(true)
          clearInterval(checkGoogle)
        }
      }, 100)

      return () => clearInterval(checkGoogle)
    }
  }, [])

  if (!isLoaded) {
    return (
      <div className={`flex items-center justify-center p-4 ${className}`}>
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <PlacesAutocomplete
      placeholder="Search for universities worldwide..."
      searchTypes={['university', 'school']}
      onPlaceSelect={onSelectUniversity}
      className={className}
    />
  )
}