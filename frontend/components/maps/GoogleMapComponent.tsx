'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Wrapper, Status } from '@googlemaps/react-wrapper'

interface MapProps {
  center: google.maps.LatLngLiteral
  zoom: number
  mapTypeId?: google.maps.MapTypeId
  onMapLoad?: (map: google.maps.Map) => void
  onCenterChanged?: (center: google.maps.LatLngLiteral) => void
  onZoomChanged?: (zoom: number) => void
  onMapClick?: (event: google.maps.MapMouseEvent) => void
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

function GoogleMapInner({
  center,
  zoom,
  mapTypeId = google.maps.MapTypeId.SATELLITE,
  onMapLoad,
  onCenterChanged,
  onZoomChanged,
  onMapClick,
  children,
  className,
  style
}: MapProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map>()

  useEffect(() => {
    if (ref.current && !map) {
      const newMap = new window.google.maps.Map(ref.current, {
        center,
        zoom,
        mapTypeId,
        mapTypeControl: true,
        mapTypeControlOptions: {
          style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
          position: google.maps.ControlPosition.TOP_CENTER,
        },
        zoomControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        gestureHandling: 'greedy',
        restriction: {
          latLngBounds: {
            north: 85,
            south: -85,
            west: -180,
            east: 180,
          },
        },
      })

      setMap(newMap)
      onMapLoad?.(newMap)

      // Add event listeners
      if (onCenterChanged) {
        newMap.addListener('center_changed', () => {
          const center = newMap.getCenter()
          if (center) {
            onCenterChanged({
              lat: center.lat(),
              lng: center.lng(),
            })
          }
        })
      }

      if (onZoomChanged) {
        newMap.addListener('zoom_changed', () => {
          onZoomChanged(newMap.getZoom() || 0)
        })
      }

      if (onMapClick) {
        newMap.addListener('click', onMapClick)
      }
    }
  }, [ref, map, center, zoom, mapTypeId, onMapLoad, onCenterChanged, onZoomChanged, onMapClick])

  useEffect(() => {
    if (map) {
      map.setCenter(center)
    }
  }, [map, center])

  useEffect(() => {
    if (map) {
      map.setZoom(zoom)
    }
  }, [map, zoom])

  useEffect(() => {
    if (map) {
      map.setMapTypeId(mapTypeId)
    }
  }, [map, mapTypeId])

  return (
    <>
      <div ref={ref} className={className} style={style} />
      {React.Children.map(children, (child, i) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { map, key: i })
        }
        return null
      })}
    </>
  )
}

const render = (status: Status): React.ReactElement => {
  if (status === Status.LOADING) return <div className="flex items-center justify-center h-full">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
  if (status === Status.FAILURE) return <div className="flex items-center justify-center h-full text-red-600">
    Error loading Google Maps
  </div>
  return <></>
}

interface GoogleMapComponentProps extends MapProps {
  apiKey: string
}

export function GoogleMapComponent({ apiKey, ...mapProps }: GoogleMapComponentProps) {
  return (
    <Wrapper apiKey={apiKey} render={render} libraries={['marker', 'geometry', 'places']}>
      <GoogleMapInner {...mapProps} />
    </Wrapper>
  )
}

// Marker component
interface MarkerProps {
  position: google.maps.LatLngLiteral
  map?: google.maps.Map
  title?: string
  icon?: string | google.maps.Icon | google.maps.Symbol
  onClick?: () => void
  zIndex?: number
}

export function MapMarker({ position, map, title, icon, onClick, zIndex }: MarkerProps) {
  const [marker, setMarker] = useState<google.maps.marker.AdvancedMarkerElement | google.maps.Marker>()

  useEffect(() => {
    if (!marker && map) {
      // Try to use AdvancedMarkerElement first, fallback to regular Marker
      if (window.google?.maps?.marker?.AdvancedMarkerElement) {
        const newMarker = new google.maps.marker.AdvancedMarkerElement({
          position,
          map,
          title,
          zIndex,
        })

        // Handle custom icons for AdvancedMarkerElement
        if (icon && typeof icon === 'object' && 'path' in icon && icon.scale) {
          // For custom symbols, create a custom element
          const markerElement = document.createElement('div')
          markerElement.style.width = `${icon.scale * 2}px`
          markerElement.style.height = `${icon.scale * 2}px`
          markerElement.style.borderRadius = '50%'
          markerElement.style.backgroundColor = icon.fillColor || '#4285f4'
          markerElement.style.border = `${icon.strokeWeight || 2}px solid ${icon.strokeColor || '#ffffff'}`
          markerElement.style.opacity = `${icon.fillOpacity || 1}`
          newMarker.content = markerElement
        }

        if (onClick) {
          newMarker.addListener('click', onClick)
        }

        setMarker(newMarker)
      } else {
        // Fallback to regular Marker for compatibility
        const newMarker = new google.maps.Marker({
          position,
          map,
          title,
          icon,
          zIndex,
        })

        if (onClick) {
          newMarker.addListener('click', onClick)
        }

        setMarker(newMarker)
      }
    }

    return () => {
      if (marker) {
        if ('setMap' in marker) {
          marker.setMap(null)
        } else {
          marker.map = null
        }
      }
    }
  }, [marker, position, map, title, icon, onClick, zIndex])

  useEffect(() => {
    if (marker) {
      if ('setPosition' in marker) {
        marker.setPosition(position)
      } else {
        marker.position = position
      }
    }
  }, [marker, position])

  useEffect(() => {
    if (marker && title) {
      if ('setTitle' in marker) {
        marker.setTitle(title)
      } else {
        marker.title = title
      }
    }
  }, [marker, title])

  return null
}

// Circle component for radius visualization
interface CircleProps {
  center: google.maps.LatLngLiteral
  radius: number // in meters
  map?: google.maps.Map
  fillColor?: string
  strokeColor?: string
  fillOpacity?: number
  strokeOpacity?: number
  strokeWeight?: number
}

export function MapCircle({
  center,
  radius,
  map,
  fillColor = '#3B82F6',
  strokeColor = '#1D4ED8',
  fillOpacity = 0.1,
  strokeOpacity = 0.6,
  strokeWeight = 2
}: CircleProps) {
  const [circle, setCircle] = useState<google.maps.Circle>()

  useEffect(() => {
    if (map && !circle) {
      const newCircle = new google.maps.Circle({
        center,
        radius,
        map,
        fillColor,
        fillOpacity,
        strokeColor,
        strokeOpacity,
        strokeWeight,
      })

      setCircle(newCircle)
    }

    return () => {
      if (circle) {
        circle.setMap(null)
      }
    }
  }, [map, circle, center, radius, fillColor, fillOpacity, strokeColor, strokeOpacity, strokeWeight])

  useEffect(() => {
    if (circle) {
      circle.setCenter(center)
      circle.setRadius(radius)
    }
  }, [circle, center, radius])

  return null
}

// Polyline component for measurement lines
interface PolylineProps {
  path: google.maps.LatLngLiteral[]
  map?: google.maps.Map
  strokeColor?: string
  strokeOpacity?: number
  strokeWeight?: number
}

export function MapPolyline({
  path,
  map,
  strokeColor = '#3B82F6',
  strokeOpacity = 0.8,
  strokeWeight = 3
}: PolylineProps) {
  const [polyline, setPolyline] = useState<google.maps.Polyline>()

  useEffect(() => {
    if (map && !polyline) {
      const newPolyline = new google.maps.Polyline({
        path,
        geodesic: true,
        strokeColor,
        strokeOpacity,
        strokeWeight,
        map,
      })

      setPolyline(newPolyline)
    }

    return () => {
      if (polyline) {
        polyline.setMap(null)
      }
    }
  }, [map, polyline, path, strokeColor, strokeOpacity, strokeWeight])

  useEffect(() => {
    if (polyline) {
      polyline.setPath(path)
    }
  }, [polyline, path])

  return null
}