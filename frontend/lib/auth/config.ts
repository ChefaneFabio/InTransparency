import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    // Google OAuth Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),

    // GitHub OAuth Provider
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    }),

    // Email/Password (Credentials) Provider
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        totpCode: { label: "MFA Code", type: "text" },
        turnstileToken: { label: "Turnstile token", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required")
        }

        // Per-email account lockout — defense against credential-stuffing
        // from distributed proxies that bypass per-IP rate limiting.
        const { checkAccountLock, recordFailedAttempt, clearFailedAttempts } =
          await import("@/lib/account-lockout")
        const lock = checkAccountLock(credentials.email)
        if (lock.locked) {
          throw new Error(`ACCOUNT_LOCKED:${lock.retryAfterSec}`)
        }

        // Bot protection — fail-open if TURNSTILE_SECRET_KEY isn't configured.
        // Runs before bcrypt to keep the timing channel small (token check is
        // cheap compared to password compare).
        const { verifyTurnstile } = await import("@/lib/turnstile")
        const turnstile = await verifyTurnstile(credentials.turnstileToken)
        if (!turnstile.ok) {
          throw new Error("BOT_CHALLENGE_FAILED")
        }

        // Find user by email (case-insensitive). Wrap DB access so Prisma's
        // raw connection-error messages (which leak the host) never bubble
        // up to the client via NextAuth's `result.error`.
        let user
        try {
          user = await prisma.user.findUnique({
            where: { email: credentials.email.toLowerCase() }
          })
        } catch (dbErr) {
          console.error('[auth.authorize] DB unreachable:', dbErr)
          // Generic, safe message — login page maps anything non-credentials
          // to a friendly "please try again" notice.
          throw new Error('SERVICE_UNAVAILABLE')
        }

        if (!user || !user.passwordHash) {
          recordFailedAttempt(credentials.email)
          throw new Error("Invalid credentials")
        }

        // Verify password
        const isValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        )

        if (!isValid) {
          recordFailedAttempt(credentials.email)
          throw new Error("Invalid credentials")
        }

        // Check if MFA is enabled
        if (user.totpEnabled && user.totpSecret) {
          const totpCode = credentials.totpCode
          if (!totpCode) {
            // No code provided — signal to frontend to show MFA input
            throw new Error(`MFA_REQUIRED:${user.id}`)
          }

          // Verify TOTP code (secret is AES-256-GCM encrypted at rest)
          const { verifyToken } = await import('@/lib/auth/totp')
          const { decryptSecret } = await import('@/lib/encryption')
          const isValidTotp = await verifyToken(totpCode, decryptSecret(user.totpSecret))

          if (!isValidTotp) {
            // Try backup codes
            const bcryptModule = await import('bcryptjs')
            let backupValid = false
            for (let i = 0; i < (user.backupCodes || []).length; i++) {
              const isMatch = await bcryptModule.default.compare(totpCode, user.backupCodes[i])
              if (isMatch) {
                const updatedCodes = [...user.backupCodes]
                updatedCodes.splice(i, 1)
                await prisma.user.update({
                  where: { id: user.id },
                  data: { backupCodes: updatedCodes },
                })
                backupValid = true
                break
              }
            }
            if (!backupValid) {
              recordFailedAttempt(credentials.email)
              throw new Error("Invalid MFA code")
            }
          }
        }

        // Successful authentication — clear lockout counter and stamp login.
        clearFailedAttempts(credentials.email)
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() }
        })

        return {
          id: user.id,
          email: user.email,
          name: user.firstName && user.lastName
            ? `${user.firstName} ${user.lastName}`
            : user.username || undefined,
          image: user.photo || undefined,
          role: user.role,
          firstName: user.firstName || undefined,
          lastName: user.lastName || undefined,
          company: user.company || undefined,
          jobTitle: user.jobTitle || undefined,
          university: user.university || undefined,
          degree: user.degree || undefined,
          photo: user.photo || undefined,
          username: user.username || undefined,
          subscriptionTier: user.subscriptionTier,
          profilePublic: user.profilePublic,
        }
      }
    })
  ],

  // Session configuration
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },

  // JWT configuration
  jwt: {
    secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // Pages configuration
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
    newUser: "/onboarding"
  },

  // Callbacks
  callbacks: {
    async signIn({ user, account, profile }) {
      // Allow OAuth sign in
      if (account?.provider === "google" || account?.provider === "github") {
        return true
      }

      // For credentials provider, check if email is verified
      if (account?.provider === "credentials") {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email as string }
        })

        // Allow sign in even if email not verified (can verify later)
        return true
      }

      return true
    },

    async jwt({ token, user, account, trigger, session }) {
      // Initial sign in
      if (user) {
        token.id = user.id
        token.role = user.role
        token.email = user.email

        // Fetch additional user data
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id }
        })

        if (dbUser) {
          token.username = dbUser.username || undefined
          token.subscriptionTier = dbUser.subscriptionTier
          token.profilePublic = dbUser.profilePublic
          token.firstName = dbUser.firstName || undefined
          token.lastName = dbUser.lastName || undefined
          token.company = dbUser.company || undefined
          token.jobTitle = dbUser.jobTitle || undefined
          token.university = dbUser.university || undefined
          token.degree = dbUser.degree || undefined
          token.photo = dbUser.photo || undefined
          token.emailVerified = dbUser.emailVerified
          token.isDemo = dbUser.isDemo
        }
      }

      // Handle session updates
      if (trigger === "update" && session) {
        token = { ...token, ...session }
      }

      return token
    },

    async session({ session, token }) {
      // Add custom fields to session
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.username = token.username as string | undefined
        session.user.subscriptionTier = token.subscriptionTier as string | undefined
        session.user.profilePublic = token.profilePublic as boolean | undefined
        session.user.firstName = token.firstName as string | undefined
        session.user.lastName = token.lastName as string | undefined
        session.user.company = token.company as string | undefined
        session.user.jobTitle = token.jobTitle as string | undefined
        session.user.university = token.university as string | undefined
        session.user.degree = token.degree as string | undefined
        session.user.photo = token.photo as string | undefined
        ;(session.user as { emailVerified?: boolean }).emailVerified =
          token.emailVerified as boolean | undefined
        ;(session.user as { isDemo?: boolean }).isDemo =
          token.isDemo as boolean | undefined
      }

      return session
    },

    async redirect({ url, baseUrl }) {
      // Redirect to onboarding for new users
      if (url.includes("/auth/signin") || url.includes("/auth/signup")) {
        return `${baseUrl}/dashboard`
      }

      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`

      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url

      return baseUrl
    }
  },

  // Events
  events: {
    async signIn({ user, account, isNewUser }) {
      console.log(`User signed in: ${user.email} via ${account?.provider}`)

      const { audit } = await import('@/lib/audit')
      await audit({
        actorId: user.id,
        actorEmail: user.email ?? null,
        actorRole: (user as { role?: string }).role ?? null,
        action: 'LOGIN',
        context: {
          provider: account?.provider ?? null,
          isNewUser: Boolean(isNewUser),
        },
      })

      if (isNewUser) {
        console.log(`New user created: ${user.email}`)
        // Could send welcome email here
      }
    },

    async signOut({ token }) {
      console.log(`User signed out: ${token?.email}`)
    }
  },

  // Enable debug in development
  debug: process.env.NODE_ENV === "development",
}
