'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authApi } from '@/lib/api'
import type { User, AuthResponse } from '@/shared/types'

interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<AuthResponse>
  register: (userData: any) => Promise<AuthResponse>
  logout: () => void
  refreshToken: () => Promise<void>
  updateUser: (userData: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Initialize auth state from localStorage
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem('token')
        const storedUser = localStorage.getItem('user')

        if (storedToken && storedUser) {
          setToken(storedToken)
          setUser(JSON.parse(storedUser))
          
          // Verify token is still valid
          try {
            const response = await authApi.me()
            setUser(response.data.user)
          } catch (error) {
            // Token is invalid, clear auth state
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            setToken(null)
            setUser(null)
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      setIsLoading(true)
      const response = await authApi.login(email, password)
      const { token: newToken, user: newUser } = response.data

      setToken(newToken)
      setUser(newUser)
      
      localStorage.setItem('token', newToken)
      localStorage.setItem('user', JSON.stringify(newUser))

      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: any): Promise<AuthResponse> => {
    try {
      setIsLoading(true)
      const response = await authApi.register(userData)
      const { token: newToken, user: newUser } = response.data

      setToken(newToken)
      setUser(newUser)
      
      localStorage.setItem('token', newToken)
      localStorage.setItem('user', JSON.stringify(newUser))

      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    
    // Call logout endpoint to invalidate token server-side
    authApi.logout().catch(() => {
      // Ignore errors during logout
    })

    router.push('/')
  }

  const refreshToken = async () => {
    try {
      // TODO: Implement refresh token endpoint
      // For now, just log out the user when token expires
      logout()
    } catch (error) {
      // Refresh failed, log out user
      logout()
    }
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))
    }
  }

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
    login,
    register,
    logout,
    refreshToken,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Higher-order component for protected routes
export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  requiredRole?: string[]
) {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, user, isLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        router.push('/auth/login')
        return
      }

      if (!isLoading && requiredRole && user) {
        if (!requiredRole.includes(user.role)) {
          router.push('/dashboard')
          return
        }
      }
    }, [isAuthenticated, user, isLoading, router])

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      )
    }

    if (!isAuthenticated) {
      return null
    }

    if (requiredRole && user && !requiredRole.includes(user.role)) {
      return null
    }

    return <WrappedComponent {...props} />
  }
}

// Hook for checking specific permissions
export function usePermissions() {
  const { user } = useAuth()

  const hasRole = (roles: string | string[]) => {
    if (!user) return false
    const roleArray = Array.isArray(roles) ? roles : [roles]
    return roleArray.includes(user.role)
  }

  const isStudent = () => hasRole('student')
  const isRecruiter = () => hasRole('recruiter')
  const isProfessor = () => hasRole('professor')
  const isUniversity = () => hasRole('university')
  const isAdmin = () => hasRole('admin')

  const canViewProject = (project: any) => {
    if (!user) return false
    if (project.isPublic) return true
    if (project.userId === user.id) return true
    if (isAdmin()) return true
    return false
  }

  const canEditProject = (project: any) => {
    if (!user) return false
    if (project.userId === user.id) return true
    if (isAdmin()) return true
    return false
  }

  const canDeleteProject = (project: any) => {
    if (!user) return false
    if (project.userId === user.id) return true
    if (isAdmin()) return true
    return false
  }

  return {
    hasRole,
    isStudent,
    isRecruiter,
    isProfessor,
    isUniversity,
    isAdmin,
    canViewProject,
    canEditProject,
    canDeleteProject,
  }
}