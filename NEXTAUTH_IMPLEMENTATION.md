# NextAuth Implementation Guide

## Overview

This document describes the comprehensive NextAuth.js authentication system implemented for InTransparency. The implementation replaces the previous mock header-based authentication with a secure, production-ready JWT-based system.

## ✅ What Was Implemented

### 1. Core Authentication Infrastructure

- **NextAuth.js v4** with JWT session strategy
- **Prisma Adapter** for session persistence
- **3 OAuth Providers**: Google, GitHub, and Credentials (email/password)
- **Role-Based Access Control (RBAC)** for 4 user roles
- **Session Management** with 30-day tokens

### 2. Database Schema Updates

Added three new Prisma models required by NextAuth:

```prisma
model Account {
  // OAuth provider accounts (Google, GitHub)
  id, userId, provider, providerAccountId
  access_token, refresh_token, expires_at
}

model Session {
  // Session tokens
  id, sessionToken, userId, expires
}

model VerificationToken {
  // Email verification tokens
  identifier, token, expires
}
```

Updated User model to add relations to `accounts` and `sessions`.

### 3. Authentication Pages

#### Sign In Page
- **Location**: `/app/[locale]/auth/signin/page.tsx`
- **Features**:
  - OAuth buttons (Google, GitHub)
  - Email/password credentials form
  - Forgot password link
  - Sign up redirect
  - Callback URL support
  - Internationalization support

#### Sign Up Page
- **Location**: `/app/[locale]/auth/signup/page.tsx`
- **Features**:
  - OAuth registration (Google, GitHub)
  - Credentials registration form
  - Role selection (Student, Recruiter, University)
  - Password confirmation
  - Auto sign-in after registration
  - Validation (password length, email format)

#### Unauthorized Page
- **Location**: `/app/[locale]/unauthorized/page.tsx`
- **Features**:
  - Friendly error message
  - Explanation of access denial
  - Navigation options
  - Contact support link

### 4. API Routes

#### NextAuth Route
- **Location**: `/app/api/auth/[...nextauth]/route.ts`
- **Purpose**: Handles all NextAuth operations (signin, signout, session, etc.)

#### Registration Route
- **Location**: `/app/api/auth/register/route.ts`
- **Features**:
  - User creation with password hashing (bcrypt, 12 rounds)
  - Email uniqueness validation
  - Input validation with Zod schema
  - Auto-generated username
  - Role assignment

#### Protected Route Example
- **Location**: `/app/api/protected/route.ts`
- **Purpose**: Demonstrates how to protect API routes
- **Features**:
  - GET: Returns authenticated user info
  - POST: Requires ADMIN or RECRUITER role

### 5. Authentication Utilities

#### Server-Side (`lib/auth/server.ts`)
```typescript
// Get current session
getSession()

// Get current user or null
getCurrentUser()

// Require authentication (redirect if not authenticated)
requireAuth()

// Require specific role(s)
requireRole(['ADMIN', 'RECRUITER'])

// Convenience functions
requireStudent()
requireRecruiter()
requireUniversity()
requireAdmin()

// Resource ownership checks
isResourceOwner(resourceUserId)
requireOwnershipOrAdmin(resourceUserId)
```

#### Client-Side (`lib/auth/client.ts`)
```typescript
// React hooks for client components
useAuth() // Get session and loading state
useRequireAuth() // Auto-redirect if not authenticated
useRequireRole(['STUDENT']) // Auto-redirect if wrong role
useHasRole(['ADMIN']) // Boolean check
useIsResourceOwner(userId) // Check ownership

// Convenience hooks
useRequireStudent()
useRequireRecruiter()
useRequireUniversity()
useRequireAdmin()
```

### 6. Middleware Protection

**File**: `frontend/middleware.ts`

**Features**:
- Automatic route protection based on path patterns
- Role-based route access control
- Locale-aware (works with next-intl)
- Preserves callback URL for post-login redirect

**Protected Routes**:
```typescript
['/dashboard', '/profile', '/projects/new', '/projects/edit', '/messages', '/settings', '/subscription']
```

**Role-Specific Routes**:
```typescript
{
  student: ['/projects/new', '/projects/edit'],
  recruiter: ['/search', '/candidates'],
  university: ['/admin', '/students/manage'],
  admin: ['/admin']
}
```

### 7. Session Provider

**File**: `app/providers.tsx`

Wrapped the entire app with NextAuth's `SessionProvider` to enable:
- Client-side session access via `useSession()`
- Automatic session refresh
- Session state management

### 8. Internationalization

Added comprehensive Italian translations for:
- Sign in form
- Sign up form
- Unauthorized page
- Error messages
- OAuth buttons
- Form validation

**File**: `frontend/messages/it.json`

## 🔐 Security Features

1. **Password Hashing**: bcrypt with 12 rounds
2. **JWT Secrets**: Environment-based secret configuration
3. **Session Expiry**: 30-day tokens with 24-hour refresh
4. **CSRF Protection**: Built into NextAuth
5. **OAuth Security**: Proper redirect URI validation
6. **Input Validation**: Zod schemas for all user inputs
7. **Role Verification**: Middleware-level role checks

## 📋 Environment Variables Required

Add to `.env` or `.env.local`:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-min-32-characters-change-in-production

# OAuth Providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Database (Required for Prisma)
DATABASE_URL=postgresql://user:password@localhost:5432/intransparency

# JWT (Fallback, used by legacy code)
JWT_SECRET=your-secret-key
```

## 🚀 Setup Instructions

### 1. Database Migration

Push the new Prisma schema to your database:

```bash
npx prisma db push
```

Or create a migration:

```bash
npx prisma migrate dev --name add-nextauth-models
```

### 2. Generate Prisma Client

```bash
npx prisma generate
```

### 3. Configure Environment Variables

1. Copy `.env.example` to `.env.local`
2. Generate a secure NextAuth secret:
   ```bash
   openssl rand -base64 32
   ```
3. Add your OAuth provider credentials (optional)

### 4. Set Up OAuth Providers (Optional)

#### Google OAuth:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

#### GitHub OAuth:
1. Go to GitHub Settings > Developer Settings > OAuth Apps
2. Create new OAuth App
3. Set callback URL: `http://localhost:3000/api/auth/callback/github`
4. Copy Client ID and Client Secret

### 5. Test the Implementation

Start the development server:

```bash
npm run dev
```

Navigate to:
- Sign In: http://localhost:3000/it/auth/signin
- Sign Up: http://localhost:3000/it/auth/signup

## 📝 Usage Examples

### Protect a Server Component

```typescript
import { requireAuth } from "@/lib/auth"

export default async function DashboardPage() {
  const user = await requireAuth()

  return <div>Welcome, {user.email}!</div>
}
```

### Protect a Client Component

```typescript
"use client"

import { useRequireAuth } from "@/lib/auth"

export default function ProfilePage() {
  const { user, isLoading } = useRequireAuth()

  if (isLoading) return <div>Loading...</div>

  return <div>Hello, {user?.email}</div>
}
```

### Protect an API Route

```typescript
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth/config"

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Your protected logic here
  return NextResponse.json({ data: "secret stuff" })
}
```

### Role-Based Protection

```typescript
import { requireRole } from "@/lib/auth"

export default async function RecruiterDashboard() {
  const user = await requireRole(["RECRUITER", "ADMIN"])

  return <div>Recruiter Dashboard</div>
}
```

### Check Authentication on Client

```typescript
"use client"

import { useAuth } from "@/lib/auth"
import { signIn, signOut } from "next-auth/react"

export default function Header() {
  const { user, isAuthenticated } = useAuth()

  return (
    <div>
      {isAuthenticated ? (
        <>
          <span>Welcome, {user?.email}</span>
          <button onClick={() => signOut()}>Sign Out</button>
        </>
      ) : (
        <button onClick={() => signIn()}>Sign In</button>
      )}
    </div>
  )
}
```

## 🔄 Migration from Old Auth System

### Before (Mock Header Auth)
```typescript
// Old way - INSECURE
const userId = req.headers.get('x-user-id')
```

### After (NextAuth)
```typescript
// New way - SECURE
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth/config"

const session = await getServerSession(authOptions)
const userId = session?.user?.id
```

### API Routes to Update

Search for these patterns and replace with NextAuth:
```bash
# Find all routes using old auth
grep -r "x-user-id" frontend/app/api/
grep -r "verifyAuth" frontend/app/api/
grep -r "requireAuth" frontend/app/api/ | grep -v "next-auth"
```

## 📊 Session Structure

The NextAuth session object contains:

```typescript
{
  user: {
    id: string              // User ID from database
    email: string           // User email
    name: string            // Full name
    image: string           // Profile photo URL
    role: string            // STUDENT | RECRUITER | UNIVERSITY | ADMIN
    username: string        // Username
    subscriptionTier: string // Subscription level
    profilePublic: boolean  // Public profile flag
  },
  expires: string          // ISO date string
}
```

## 🐛 Troubleshooting

### "Environment variable not found: DATABASE_URL"
**Solution**: Add `DATABASE_URL` to your `.env.local` file

### "Invalid session token"
**Solution**: Clear browser cookies and sign in again

### "Prisma Client did not initialize"
**Solution**: Run `npx prisma generate`

### OAuth redirect not working
**Solution**:
1. Check that `NEXTAUTH_URL` matches your app URL
2. Verify OAuth redirect URIs in provider settings
3. Ensure OAuth credentials are correct

### Session not persisting
**Solution**:
1. Check that SessionProvider is wrapping your app
2. Verify `NEXTAUTH_SECRET` is set
3. Clear cookies and try again

## 🔒 Security Best Practices

1. **Always use HTTPS in production**
2. **Never commit OAuth secrets** to version control
3. **Rotate JWT secrets** regularly in production
4. **Use strong passwords** (enforced by 8+ character requirement)
5. **Enable email verification** (TODO: implement in config)
6. **Add rate limiting** to auth routes (TODO: implement)
7. **Monitor failed login attempts** (TODO: add logging)

## 📚 Additional Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Prisma Adapter](https://authjs.dev/reference/adapter/prisma)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [OAuth 2.0 Security](https://oauth.net/2/)

## 🎯 Next Steps

1. **Database Setup**: Configure and migrate your database
2. **OAuth Setup**: Configure Google and GitHub OAuth (optional)
3. **Test Auth Flow**: Test sign up, sign in, and sign out
4. **Update API Routes**: Replace mock auth with NextAuth
5. **Email Verification**: Implement email verification flow
6. **Password Reset**: Add forgot password functionality
7. **Rate Limiting**: Add Upstash Redis rate limiting
8. **Session Monitoring**: Add session analytics

## 📞 Support

If you encounter issues:
1. Check this documentation first
2. Review NextAuth.js docs
3. Check Prisma schema is up to date
4. Verify all environment variables are set
5. Clear browser cache and cookies

---

**Implementation Date**: 2025-11-10
**Version**: NextAuth.js v4
**Status**: ✅ Ready for testing (requires database setup)
