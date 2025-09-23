'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/AuthContext'
import { Loader2 } from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        // Redirect to login if not authenticated
        router.push('/auth/login')
        return
      }

      // Redirect based on user role
      if (user?.role) {
        const role = user.role as 'student' | 'recruiter' | 'university' | 'admin'
        switch (role) {
          case 'student':
            router.push('/dashboard/student')
            break
          case 'recruiter':
            router.push('/dashboard/recruiter')
            break
          case 'university':
            router.push('/dashboard/university')
            break
          case 'admin':
            router.push('/dashboard/admin')
            break
          default:
            // Default to student dashboard for unknown roles
            router.push('/dashboard/student')
            break
        }
      } else {
        // If no role is set, default to student
        router.push('/dashboard/student')
      }
    }
  }, [user, isAuthenticated, isLoading, router])

  // Show loading spinner while determining where to redirect
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600 mb-4" />
        <p className="text-gray-600">Redirecting to your dashboard...</p>
      </div>
    </div>
  )
}