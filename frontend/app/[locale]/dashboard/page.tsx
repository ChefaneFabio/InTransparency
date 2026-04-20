'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { Loader2 } from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const t = useTranslations('dashboardRouter')

  useEffect(() => {
    if (status === 'loading') return

    if (status === 'unauthenticated') {
      router.push('/auth/login')
      return
    }

    // Redirect based on user role
    if (session?.user?.role) {
      const role = session.user.role.toLowerCase()
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
        case 'professor':
          router.push('/dashboard/professor')
          break
        case 'admin':
          router.push('/dashboard/admin')
          break
        default:
          router.push('/dashboard/student')
          break
      }
    } else {
      router.push('/dashboard/student')
    }
  }, [session, status, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary mb-4" />
        <p className="text-muted-foreground">{t('redirecting')}</p>
      </div>
    </div>
  )
}
