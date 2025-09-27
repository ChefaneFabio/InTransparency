'use client'

import { Card, CardContent } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  description?: string
  trend?: string
  trendDirection?: 'up' | 'down' | 'neutral'
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'gray'
  onClick?: () => void
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  trendDirection = 'neutral',
  color = 'blue',
  onClick
}: StatsCardProps) {
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return {
          icon: 'text-blue-600 bg-blue-100',
          trend: trendDirection === 'up' ? 'text-green-600' : trendDirection === 'down' ? 'text-red-600' : 'text-gray-600'
        }
      case 'green':
        return {
          icon: 'text-green-600 bg-green-100',
          trend: trendDirection === 'up' ? 'text-green-600' : trendDirection === 'down' ? 'text-red-600' : 'text-gray-600'
        }
      case 'purple':
        return {
          icon: 'text-purple-600 bg-purple-100',
          trend: trendDirection === 'up' ? 'text-green-600' : trendDirection === 'down' ? 'text-red-600' : 'text-gray-600'
        }
      case 'orange':
        return {
          icon: 'text-orange-600 bg-orange-100',
          trend: trendDirection === 'up' ? 'text-green-600' : trendDirection === 'down' ? 'text-red-600' : 'text-gray-600'
        }
      case 'red':
        return {
          icon: 'text-red-600 bg-red-100',
          trend: trendDirection === 'up' ? 'text-green-600' : trendDirection === 'down' ? 'text-red-600' : 'text-gray-600'
        }
      default:
        return {
          icon: 'text-gray-600 bg-gray-100',
          trend: trendDirection === 'up' ? 'text-green-600' : trendDirection === 'down' ? 'text-red-600' : 'text-gray-600'
        }
    }
  }

  const colorClasses = getColorClasses(color)

  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      if (val >= 1000000) {
        return `${(val / 1000000).toFixed(1)}M`
      } else if (val >= 1000) {
        return `${(val / 1000).toFixed(1)}K`
      }
      return val.toLocaleString()
    }
    return val
  }

  return (
    <Card 
      className={`hover:shadow-md transition-shadow ${onClick ? 'cursor-pointer hover:shadow-lg' : ''}`}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${colorClasses.icon} mr-3`}>
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">{title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatValue(value)}
                </p>
              </div>
            </div>
            
            {(description || trend) && (
              <div className="mt-4 space-y-1">
                {description && (
                  <p className="text-sm text-gray-700">{description}</p>
                )}
                {trend && (
                  <p className={`text-sm font-medium ${colorClasses.trend}`}>
                    {trend}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}