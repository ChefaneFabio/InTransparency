'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
  Bell,
  BellRing,
  Settings,
  X,
  Check,
  MessageSquare,
  Briefcase,
  Eye,
  Users,
  Award,
  Info
} from 'lucide-react'
import { usePushNotifications, NotificationTypes, type PushNotification } from '@/lib/notifications/usePushNotifications'

export function NotificationCenter() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [notificationSettings, setNotificationSettings] = useState({
    [NotificationTypes.NEW_MESSAGE]: true,
    [NotificationTypes.JOB_MATCH]: true,
    [NotificationTypes.PROJECT_COMMENT]: true,
    [NotificationTypes.PROFILE_VIEW]: false,
    [NotificationTypes.APPLICATION_UPDATE]: true,
    [NotificationTypes.NETWORK_CONNECTION]: true,
    [NotificationTypes.ACHIEVEMENT]: true,
    [NotificationTypes.SYSTEM_UPDATE]: true
  })

  const {
    isSupported,
    permission,
    isSubscribed,
    notifications,
    requestPermission,
    subscribe,
    unsubscribe,
    markAsRead,
    clearAll
  } = usePushNotifications()

  // Load settings from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('intransparency-notification-settings')
    if (stored) {
      try {
        setNotificationSettings(JSON.parse(stored))
      } catch (error) {
        console.error('Failed to load notification settings:', error)
      }
    }
  }, [])

  // Save settings to localStorage
  const updateSettings = (newSettings: typeof notificationSettings) => {
    setNotificationSettings(newSettings)
    localStorage.setItem('intransparency-notification-settings', JSON.stringify(newSettings))
  }

  const handleSubscribe = async () => {
    const success = await subscribe()
    if (success) {
      // Optionally show success message
      console.log('Successfully subscribed to notifications')
    }
  }

  const handleUnsubscribe = async () => {
    const success = await unsubscribe()
    if (success) {
      console.log('Successfully unsubscribed from notifications')
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case NotificationTypes.NEW_MESSAGE:
        return <MessageSquare className="h-4 w-4 text-blue-600" />
      case NotificationTypes.JOB_MATCH:
        return <Briefcase className="h-4 w-4 text-green-600" />
      case NotificationTypes.PROJECT_COMMENT:
        return <MessageSquare className="h-4 w-4 text-purple-600" />
      case NotificationTypes.PROFILE_VIEW:
        return <Eye className="h-4 w-4 text-gray-600" />
      case NotificationTypes.APPLICATION_UPDATE:
        return <Briefcase className="h-4 w-4 text-orange-600" />
      case NotificationTypes.NETWORK_CONNECTION:
        return <Users className="h-4 w-4 text-teal-600" />
      case NotificationTypes.ACHIEVEMENT:
        return <Award className="h-4 w-4 text-yellow-600" />
      case NotificationTypes.SYSTEM_UPDATE:
        return <Info className="h-4 w-4 text-blue-600" />
      default:
        return <Bell className="h-4 w-4 text-gray-600" />
    }
  }

  const getSettingLabel = (type: string) => {
    const labels = {
      [NotificationTypes.NEW_MESSAGE]: 'New Messages',
      [NotificationTypes.JOB_MATCH]: 'Job Matches',
      [NotificationTypes.PROJECT_COMMENT]: 'Project Comments',
      [NotificationTypes.PROFILE_VIEW]: 'Profile Views',
      [NotificationTypes.APPLICATION_UPDATE]: 'Application Updates',
      [NotificationTypes.NETWORK_CONNECTION]: 'Network Connections',
      [NotificationTypes.ACHIEVEMENT]: 'Achievements',
      [NotificationTypes.SYSTEM_UPDATE]: 'System Updates'
    }
    return labels[type as keyof typeof labels] || type
  }

  const unreadCount = notifications.filter(n => !n.read).length

  const handleNotificationAction = (notification: PushNotification, action: string) => {
    markAsRead(notification.id)

    switch (action) {
      case 'reply':
        // Open message reply
        window.location.href = `/dashboard/messages?conversation=${notification.data?.conversationId}`
        break
      case 'view':
        // Navigate to relevant page
        if (notification.data?.type === NotificationTypes.JOB_MATCH) {
          window.location.href = `/jobs/${notification.data.jobId}`
        } else if (notification.data?.type === NotificationTypes.PROJECT_COMMENT) {
          window.location.href = `/projects/${notification.data.projectId}`
        }
        break
      case 'apply':
        window.location.href = `/jobs/${notification.data?.jobId}/apply`
        break
      default:
        markAsRead(notification.id)
    }
  }

  if (!isSupported) {
    return null
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      {!isExpanded ? (
        <Button
          onClick={() => setIsExpanded(true)}
          variant="outline"
          size="sm"
          className="h-10 w-10 rounded-full bg-white shadow-lg relative"
        >
          {unreadCount > 0 ? (
            <BellRing className="h-5 w-5 text-teal-600" />
          ) : (
            <Bell className="h-5 w-5 text-gray-600" />
          )}
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 bg-red-500 text-xs flex items-center justify-center">
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      ) : (
        <Card className="w-80 max-h-96 shadow-xl">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Notifications</CardTitle>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSettings(!showSettings)}
                >
                  <Settings className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Subscription Status */}
            {permission !== 'granted' || !isSubscribed ? (
              <div className="mt-2">
                {permission === 'default' && (
                  <Button
                    size="sm"
                    onClick={requestPermission}
                    className="w-full bg-teal-600 hover:bg-teal-700"
                  >
                    Enable Notifications
                  </Button>
                )}
                {permission === 'granted' && !isSubscribed && (
                  <Button
                    size="sm"
                    onClick={handleSubscribe}
                    className="w-full bg-teal-600 hover:bg-teal-700"
                  >
                    Subscribe to Push Notifications
                  </Button>
                )}
                {permission === 'denied' && (
                  <div className="text-xs text-gray-700 bg-gray-50 p-2 rounded">
                    Notifications are blocked. Please enable them in your browser settings.
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-between mt-2">
                <div className="text-xs text-green-600">✓ Notifications enabled</div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleUnsubscribe}
                  className="text-xs"
                >
                  Disable
                </Button>
              </div>
            )}
          </CardHeader>

          <CardContent className="p-0">
            {showSettings ? (
              <div className="p-4 border-t max-h-64 overflow-y-auto">
                <h4 className="font-medium mb-3">Notification Settings</h4>
                <div className="space-y-3">
                  {Object.entries(notificationSettings).map(([type, enabled]) => (
                    <div key={type} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getNotificationIcon(type)}
                        <span className="text-sm">{getSettingLabel(type)}</span>
                      </div>
                      <Switch
                        checked={enabled}
                        onCheckedChange={(checked) => {
                          updateSettings({
                            ...notificationSettings,
                            [type]: checked
                          })
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-gray-700 text-sm">
                    No notifications yet
                  </div>
                ) : (
                  <>
                    {unreadCount > 0 && (
                      <div className="p-2 border-b bg-gray-50">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            notifications.forEach(n => {
                              if (!n.read) markAsRead(n.id)
                            })
                          }}
                          className="text-xs"
                        >
                          Mark all as read
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearAll}
                          className="text-xs ml-2"
                        >
                          Clear all
                        </Button>
                      </div>
                    )}

                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 border-b hover:bg-gray-50 cursor-pointer ${
                          !notification.read ? 'bg-blue-50 border-l-2 border-l-blue-500' : ''
                        }`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="mt-1">
                            {getNotificationIcon(notification.data?.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="text-sm font-medium truncate">
                                {notification.title}
                              </h4>
                              <span className="text-xs text-gray-700">
                                {new Date(notification.timestamp).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 mb-2">
                              {notification.body}
                            </p>

                            {/* Action buttons */}
                            {notification.actions && notification.actions.length > 0 && (
                              <div className="flex space-x-2">
                                {notification.actions.map((action, index) => (
                                  <Button
                                    key={index}
                                    variant="outline"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleNotificationAction(notification, action.action)
                                    }}
                                    className="text-xs h-6 px-2"
                                  >
                                    {action.title}
                                  </Button>
                                ))}
                              </div>
                            )}
                          </div>

                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-1 flex-shrink-0" />
                          )}
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}