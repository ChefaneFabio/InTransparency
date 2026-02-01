'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function SignInRedirect() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const callbackUrl = searchParams.get('callbackUrl')
    const redirectUrl = callbackUrl
      ? `/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`
      : '/auth/login'
    router.replace(redirectUrl)
  }, [router, searchParams])

  return null
}
