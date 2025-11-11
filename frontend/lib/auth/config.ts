import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

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
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required")
        }

        // Find user by email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user || !user.passwordHash) {
          throw new Error("Invalid credentials")
        }

        // Verify password
        const isValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        )

        if (!isValid) {
          throw new Error("Invalid credentials")
        }

        // Update last login
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
