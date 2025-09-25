'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth/AuthContext'

export interface PushNotification {
  id: string
  title: string
  body: string
  icon?: string
  badge?: string
  data?: any
  actions?: Array<{
    action: string
    title: string
    icon?: string
  }>
  timestamp: number
  read: boolean
}

interface UsePushNotificationsReturn {
  isSupported: boolean
  permission: NotificationPermission
  isSubscribed: boolean
  notifications: PushNotification[]
  requestPermission: () => Promise<boolean>
  subscribe: () => Promise<boolean>
  unsubscribe: () => Promise<boolean>
  markAsRead: (id: string) => void
  clearAll: () => void
}

export function usePushNotifications(): UsePushNotificationsReturn {
  const { user, isAuthenticated } = useAuth()
  const [isSupported, setIsSupported] = useState(false)
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [notifications, setNotifications] = useState<PushNotification[]>([])

  // Check for notification support
  useEffect(() => {
    setIsSupported('Notification' in window && 'serviceWorker' in navigator)
    if ('Notification' in window) {
      setPermission(Notification.permission)
    }
  }, [])

  // Load existing notifications
  useEffect(() => {
    const stored = localStorage.getItem('intransparency-notifications')
    if (stored) {
      try {
        setNotifications(JSON.parse(stored))
      } catch (error) {
        console.error('Failed to load stored notifications:', error)
      }
    }
  }, [])

  // Check subscription status
  useEffect(() => {
    if (isSupported && isAuthenticated) {
      checkSubscriptionStatus()
    }
  }, [isSupported, isAuthenticated])

  const checkSubscriptionStatus = async () => {
    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()
      setIsSubscribed(!!subscription)
    } catch (error) {
      console.error('Failed to check subscription status:', error)
      setIsSubscribed(false)
    }
  }

  const requestPermission = async (): Promise<boolean> => {
    if (!isSupported) return false

    try {
      const result = await Notification.requestPermission()
      setPermission(result)
      return result === 'granted'
    } catch (error) {
      console.error('Failed to request notification permission:', error)
      return false
    }
  }

  const subscribe = async (): Promise<boolean> => {
    if (!isSupported || !isAuthenticated) return false

    try {
      // Request permission if not granted
      if (permission !== 'granted') {
        const granted = await requestPermission()
        if (!granted) return false
      }

      const registration = await navigator.serviceWorker.ready

      // Generate VAPID key (in production, this should come from your server)
      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_KEY ||
        'BMxEZjyM9Nj3V5aPSzlHtBVKa9KJhL4P8Qr2sT3uV4wX5yZ6a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2q3r4s5t6u'

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
      })

      // Send subscription to server
      const response = await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.id}`
        },
        body: JSON.stringify({
          subscription,
          userId: user?.id
        })
      })

      if (response.ok) {
        setIsSubscribed(true)
        return true
      } else {
        throw new Error('Failed to subscribe on server')
      }
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error)
      return false
    }
  }

  const unsubscribe = async (): Promise<boolean> => {
    if (!isSupported || !isAuthenticated) return false

    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()

      if (subscription) {
        // Unsubscribe from browser
        await subscription.unsubscribe()

        // Notify server
        await fetch('/api/notifications/unsubscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user?.id}`
          },
          body: JSON.stringify({
            userId: user?.id
          })
        })
      }

      setIsSubscribed(false)
      return true
    } catch (error) {
      console.error('Failed to unsubscribe from push notifications:', error)
      return false
    }
  }

  const addNotification = (notification: Omit<PushNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: PushNotification = {
      ...notification,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      read: false
    }

    setNotifications(prev => {
      const updated = [newNotification, ...prev].slice(0, 50) // Keep last 50 notifications
      localStorage.setItem('intransparency-notifications', JSON.stringify(updated))
      return updated
    })
  }

  const markAsRead = (id: string) => {
    setNotifications(prev => {
      const updated = prev.map(n => n.id === id ? { ...n, read: true } : n)
      localStorage.setItem('intransparency-notifications', JSON.stringify(updated))
      return updated
    })
  }

  const clearAll = () => {
    setNotifications([])
    localStorage.removeItem('intransparency-notifications')
  }

  // Listen for push events
  useEffect(() => {
    if (!isSupported || !isAuthenticated) return

    const handlePushEvent = (event: MessageEvent) => {
      if (event.data && event.data.type === 'PUSH_NOTIFICATION') {
        addNotification(event.data.notification)
      }
    }

    navigator.serviceWorker?.addEventListener('message', handlePushEvent)

    return () => {
      navigator.serviceWorker?.removeEventListener('message', handlePushEvent)
    }
  }, [isSupported, isAuthenticated])

  return {
    isSupported,
    permission,
    isSubscribed,
    notifications,
    requestPermission,
    subscribe,
    unsubscribe,
    markAsRead,
    clearAll
  }
}

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String: string): ArrayBuffer {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray.buffer
}

// Notification types for the platform
export const NotificationTypes = {
  NEW_MESSAGE: 'new_message',
  JOB_MATCH: 'job_match',
  PROJECT_COMMENT: 'project_comment',
  PROFILE_VIEW: 'profile_view',
  APPLICATION_UPDATE: 'application_update',
  NETWORK_CONNECTION: 'network_connection',
  ACHIEVEMENT: 'achievement',
  SYSTEM_UPDATE: 'system_update'
} as const

export type NotificationType = typeof NotificationTypes[keyof typeof NotificationTypes]

// Notification templates
export const createNotificationTemplate = (
  type: NotificationType,
  data: any
): Omit<PushNotification, 'id' | 'timestamp' | 'read'> => {
  const templates = {
    [NotificationTypes.NEW_MESSAGE]: {
      title: `New message from ${data.senderName}`,
      body: data.preview || 'You have a new message',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      data: { type, messageId: data.messageId, conversationId: data.conversationId },
      actions: [
        { action: 'reply', title: 'Reply' },
        { action: 'view', title: 'View' }
      ]
    },
    [NotificationTypes.JOB_MATCH]: {
      title: 'New job match found!',
      body: `${data.jobTitle} at ${data.companyName} matches your profile`,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      data: { type, jobId: data.jobId },
      actions: [
        { action: 'view', title: 'View Job' },
        { action: 'apply', title: 'Apply Now' }
      ]
    },
    [NotificationTypes.PROJECT_COMMENT]: {
      title: 'New comment on your project',
      body: `${data.commenterName} commented on "${data.projectTitle}"`,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      data: { type, projectId: data.projectId, commentId: data.commentId },
      actions: [
        { action: 'view', title: 'View Comment' },
        { action: 'reply', title: 'Reply' }
      ]
    },
    [NotificationTypes.PROFILE_VIEW]: {
      title: 'Profile view',
      body: `${data.viewerName} viewed your profile`,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      data: { type, viewerId: data.viewerId },
      actions: [
        { action: 'view_profile', title: 'View Their Profile' }
      ]
    },
    [NotificationTypes.APPLICATION_UPDATE]: {
      title: 'Application update',
      body: `Your application for ${data.jobTitle} has been ${data.status}`,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      data: { type, applicationId: data.applicationId },
      actions: [
        { action: 'view', title: 'View Application' }
      ]
    },
    [NotificationTypes.NETWORK_CONNECTION]: {
      title: 'New connection',
      body: `${data.connectionName} wants to connect with you`,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      data: { type, connectionId: data.connectionId },
      actions: [
        { action: 'accept', title: 'Accept' },
        { action: 'view', title: 'View Profile' }
      ]
    },
    [NotificationTypes.ACHIEVEMENT]: {
      title: 'Achievement unlocked!',
      body: data.achievementDescription,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      data: { type, achievementId: data.achievementId },
      actions: [
        { action: 'view', title: 'View Achievement' }
      ]
    },
    [NotificationTypes.SYSTEM_UPDATE]: {
      title: 'InTransparency Update',
      body: data.message,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      data: { type },
      actions: data.actions || []
    }
  }

  return templates[type] || {
    title: 'Notification',
    body: 'You have a new notification',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    data: { type },
    actions: []
  }
}