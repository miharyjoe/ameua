import { auth } from "@/auth"
import { UserRole, UserRoleType } from "@/schema"

/**
 * Check if a user has a specific role
 */
export function hasRole(userRole: UserRoleType, requiredRole: UserRoleType): boolean {
  if (requiredRole === UserRole.ADMIN) {
    return userRole === UserRole.ADMIN
  }
  return true // User role can access user-level content
}

/**
 * Check if a user is an admin
 */
export function isAdmin(userRole: UserRoleType): boolean {
  return userRole === UserRole.ADMIN
}

/**
 * Get current user session with role checking
 */
export async function getCurrentUser() {
  const session = await auth()
  return session?.user || null
}

/**
 * Check if current user is admin
 */
export async function isCurrentUserAdmin(): Promise<boolean> {
  const user = await getCurrentUser()
  return user ? isAdmin(user.role) : false
}

/**
 * Require admin role - throws error if not admin
 */
export async function requireAdmin() {
  const user = await getCurrentUser()
  if (!user || !isAdmin(user.role)) {
    throw new Error("Admin access required")
  }
  return user
}

/**
 * Require authentication - throws error if not authenticated
 */
export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error("Authentication required")
  }
  return user
} 