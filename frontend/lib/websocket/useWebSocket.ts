'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useAuth } from '@/lib/auth/AuthContext'

interface WebSocketMessage {
  id?: string
  type: string
  data: any
  timestamp?: number
  userId?: string
}

interface UseWebSocketOptions {
  onMessage?: (message: WebSocketMessage) => void
  onConnect?: () => void
  onDisconnect?: () => void
  onError?: (error: Event) => void
  autoReconnect?: boolean
  reconnectInterval?: number
  maxReconnectAttempts?: number
}

export function useWebSocket(url: string, options: UseWebSocketOptions = {}) {
  const {
    onMessage,
    onConnect,
    onDisconnect,
    onError,
    autoReconnect = true,
    reconnectInterval = 3000,
    maxReconnectAttempts = 5
  } = options

  const { user, isAuthenticated } = useAuth()
  const ws = useRef<WebSocket | null>(null)
  const reconnectAttempts = useRef(0)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>()

  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null)

  const connect = useCallback(() => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      return
    }

    setIsConnecting(true)

    try {
      const wsUrl = isAuthenticated && user
        ? `${url}?userId=${user.id}`
        : url

      ws.current = new WebSocket(wsUrl)

      ws.current.onopen = () => {
        console.log('[WS] Connected to WebSocket')
        setIsConnected(true)
        setIsConnecting(false)
        reconnectAttempts.current = 0
        onConnect?.()
      }

      ws.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data)
          setLastMessage(message)
          onMessage?.(message)
        } catch (error) {
          console.error('[WS] Failed to parse message:', error)
        }
      }

      ws.current.onclose = (event) => {
        console.log('[WS] Connection closed:', event.code, event.reason)
        setIsConnected(false)
        setIsConnecting(false)
        onDisconnect?.()

        // Auto-reconnect logic
        if (autoReconnect && reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current += 1
          console.log(`[WS] Attempting to reconnect (${reconnectAttempts.current}/${maxReconnectAttempts})...`)

          reconnectTimeoutRef.current = setTimeout(() => {
            connect()
          }, reconnectInterval)
        }
      }

      ws.current.onerror = (error) => {
        console.error('[WS] WebSocket error:', error)
        setIsConnecting(false)
        onError?.(error)
      }
    } catch (error) {
      console.error('[WS] Failed to create WebSocket connection:', error)
      setIsConnecting(false)
    }
  }, [url, isAuthenticated, user, onConnect, onMessage, onDisconnect, onError, autoReconnect, maxReconnectAttempts, reconnectInterval])

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }

    if (ws.current) {
      ws.current.close(1000, 'Manual disconnect')
      ws.current = null
    }

    setIsConnected(false)
    setIsConnecting(false)
    reconnectAttempts.current = 0
  }, [])

  const sendMessage = useCallback((message: Omit<WebSocketMessage, 'timestamp' | 'userId'>) => {
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
      console.warn('[WS] Cannot send message: WebSocket not connected')
      return false
    }

    try {
      const fullMessage: WebSocketMessage = {
        ...message,
        timestamp: Date.now(),
        userId: user?.id
      }

      ws.current.send(JSON.stringify(fullMessage))
      return true
    } catch (error) {
      console.error('[WS] Failed to send message:', error)
      return false
    }
  }, [user?.id])

  // Connect when component mounts and user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      connect()
    } else {
      disconnect()
    }

    return () => {
      disconnect()
    }
  }, [isAuthenticated, connect, disconnect])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect()
    }
  }, [disconnect])

  return {
    isConnected,
    isConnecting,
    lastMessage,
    sendMessage,
    connect,
    disconnect,
    reconnectAttempts: reconnectAttempts.current
  }
}