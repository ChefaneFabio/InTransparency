"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

/**
 * Hook to get current session
 */
export function useAuth() {
  const { data: session, status } = useSession()

  return {
    user: session?.user || null,
    session,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
    isUnauthenticated: status === "unauthenticated",
  }
}

/**
 * Hook to require authentication - redirects if not authenticated
 */
export function useRequireAuth() {
  const router = useRouter()
  const { user, isLoading, isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/signin")
    }
  }, [isLoading, isAuthenticated, router])

  return { user, isLoading }
}

/**
 * Hook to require specific role
 */
export function useRequireRole(allowedRoles: string[]) {
  const router = useRouter()
  const { user, isLoading, isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/auth/signin")
      } else if (user && !allowedRoles.includes(user.role)) {
        router.push("/unauthorized")
      }
    }
  }, [isLoading, isAuthenticated, user, allowedRoles, router])

  return { user, isLoading }
}

/**
 * Hook to check if user has specific role
 */
export function useHasRole(allowedRoles: string[]) {
  const { user } = useAuth()

  if (!user) {
    return false
  }

  return allowedRoles.includes(user.role)
}

/**
 * Hook to require student role
 */
export function useRequireStudent() {
  return useRequireRole(["STUDENT"])
}

/**
 * Hook to require recruiter role
 */
export function useRequireRecruiter() {
  return useRequireRole(["RECRUITER"])
}

/**
 * Hook to require university role
 */
export function useRequireUniversity() {
  return useRequireRole(["UNIVERSITY"])
}

/**
 * Hook to require admin role
 */
export function useRequireAdmin() {
  return useRequireRole(["ADMIN"])
}

/**
 * Check if current user owns a resource
 */
export function useIsResourceOwner(resourceUserId: string) {
  const { user } = useAuth()

  if (!user) {
    return false
  }

  return user.id === resourceUserId
}
