'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function UniversityRegisterRedirect() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to main register page with university role pre-selected
    router.replace('/auth/register?role=university')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  )
}
