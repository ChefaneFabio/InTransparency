'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  WifiOff,
  RefreshCw,
  Smartphone,
  BookOpen,
  Users,
  MapPin,
  CheckCircle,
  Clock
} from 'lucide-react'

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(false)
  const [lastSync, setLastSync] = useState<Date | null>(null)

  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine)
      if (navigator.onLine && !lastSync) {
        setLastSync(new Date())
      }
    }

    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)

    updateOnlineStatus()

    return () => {
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
    }
  }, [lastSync])

  const handleRefresh = () => {
    window.location.reload()
  }

  const offlineFeatures = [
    {
      icon: BookOpen,
      title: 'Browse Cached Projects',
      description: 'View recently viewed projects and portfolios'
    },
    {
      icon: Users,
      title: 'Review Contacts',
      description: 'Access your saved connections and messages'
    },
    {
      icon: MapPin,
      title: 'Explore Talent Map',
      description: 'Navigate previously loaded university locations'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-sky-50 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        {/* Status Indicator */}
        <div className="flex items-center justify-center space-x-2">
          {isOnline ? (
            <>
              <CheckCircle className="h-5 w-5 text-emerald-500" />
              <Badge variant="default" className="bg-emerald-500">
                Back Online
              </Badge>
            </>
          ) : (
            <>
              <WifiOff className="h-5 w-5 text-slate-500" />
              <Badge variant="secondary">
                Offline Mode
              </Badge>
            </>
          )}
        </div>

        {/* Main Content */}
        <div className="space-y-4">
          <div className="w-24 h-24 mx-auto bg-teal-100 rounded-full flex items-center justify-center">
            <Smartphone className="h-12 w-12 text-teal-600" />
          </div>

          <h1 className="text-4xl font-bold text-slate-800">
            {isOnline ? 'Connection Restored!' : 'You\'re Offline'}
          </h1>

          <p className="text-xl text-slate-600 max-w-md mx-auto">
            {isOnline
              ? 'Your internet connection has been restored. Click refresh to sync your latest data.'
              : 'No worries! InTransparency works offline too. You can still access cached content and continue your work.'
            }
          </p>
        </div>

        {/* Action Button */}
        <div className="flex justify-center">
          {isOnline ? (
            <Button
              onClick={handleRefresh}
              size="lg"
              className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh & Sync
            </Button>
          ) : (
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="lg"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          )}
        </div>

        {/* Last Sync Info */}
        {lastSync && (
          <div className="flex items-center justify-center space-x-2 text-sm text-slate-500">
            <Clock className="h-4 w-4" />
            <span>Last synced: {lastSync.toLocaleTimeString()}</span>
          </div>
        )}

        {/* Offline Features */}
        {!isOnline && (
          <Card className="text-left">
            <CardHeader>
              <CardTitle className="text-center">Available Offline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {offlineFeatures.map((feature, index) => (
                  <div key={index} className="text-center space-y-2">
                    <div className="w-12 h-12 mx-auto bg-slate-100 rounded-lg flex items-center justify-center">
                      <feature.icon className="h-6 w-6 text-slate-600" />
                    </div>
                    <h3 className="font-medium text-slate-800">{feature.title}</h3>
                    <p className="text-sm text-slate-600">{feature.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <Button variant="ghost" asChild>
            <a href="/dashboard">Go to Dashboard</a>
          </Button>
          <Button variant="ghost" asChild>
            <a href="/geographic-talent-search">Talent Map</a>
          </Button>
          <Button variant="ghost" asChild>
            <a href="/">Home</a>
          </Button>
        </div>

        {/* PWA Info */}
        <div className="text-center space-y-2">
          <p className="text-sm text-slate-500">
            💡 <strong>Tip:</strong> Add InTransparency to your home screen for the best app experience
          </p>
        </div>
      </div>
    </div>
  )
}