import { getServerSession } from "next-auth/next"
import { authOptions } from "./config"
import { redirect } from "next/navigation"

/**
 * Get the current session on the server
 * Use in Server Components and API Routes
 */
export async function getSession() {
  return await getServerSession(authOptions)
}

/**
 * Get the current user from session
 * Returns null if not authenticated
 */
export async function getCurrentUser() {
  const session = await getSession()
  return session?.user || null
}

/**
 * Require authentication - redirect to sign in if not authenticated
 * Use in Server Components that require auth
 */
export async function requireAuth() {
  const session = await getSession()

  if (!session || !session.user) {
    redirect("/auth/signin")
  }

  return session.user
}

/**
 * Require specific role - redirect if user doesn't have required role
 */
export async function requireRole(allowedRoles: string[]) {
  const user = await requireAuth()

  if (!allowedRoles.includes(user.role)) {
    redirect("/unauthorized")
  }

  return user
}

/**
 * Check if user has specific role
 */
export async function hasRole(allowedRoles: string[]) {
  const session = await getSession()

  if (!session || !session.user) {
    return false
  }

  return allowedRoles.includes(session.user.role)
}

/**
 * Require student role
 */
export async function requireStudent() {
  return await requireRole(["STUDENT"])
}

/**
 * Require recruiter role
 */
export async function requireRecruiter() {
  return await requireRole(["RECRUITER"])
}

/**
 * Require university role
 */
export async function requireUniversity() {
  return await requireRole(["UNIVERSITY"])
}

/**
 * Require admin role
 */
export async function requireAdmin() {
  return await requireRole(["ADMIN"])
}

/**
 * Check if current user owns a resource
 */
export async function isResourceOwner(resourceUserId: string) {
  const user = await getCurrentUser()

  if (!user) {
    return false
  }

  return user.id === resourceUserId
}

/**
 * Require resource ownership or admin role
 */
export async function requireOwnershipOrAdmin(resourceUserId: string) {
  const user = await requireAuth()

  const isOwner = user.id === resourceUserId
  const isAdmin = user.role === "ADMIN"

  if (!isOwner && !isAdmin) {
    redirect("/unauthorized")
  }

  return user
}
