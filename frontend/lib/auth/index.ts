// Export auth configuration
export { authOptions } from "./config"

// Export server-side utilities
export {
  getSession,
  getCurrentUser,
  requireAuth,
  requireRole,
  hasRole,
  requireStudent,
  requireRecruiter,
  requireUniversity,
  requireAdmin,
  isResourceOwner,
  requireOwnershipOrAdmin,
} from "./server"

// Re-export client hooks (must be used with "use client" directive)
export {
  useAuth,
  useRequireAuth,
  useRequireRole,
  useHasRole,
  useRequireStudent,
  useRequireRecruiter,
  useRequireUniversity,
  useRequireAdmin,
  useIsResourceOwner,
} from "./client"

// Export legacy JWT verify (for backward compatibility during migration)
export { verifyAuth, requireAuth as requireAuthLegacy } from "./jwt-verify"
