import "next-auth"
import "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
      role: string
      username?: string
      subscriptionTier?: string
      profilePublic?: boolean
      firstName?: string
      lastName?: string
      company?: string
      jobTitle?: string
      university?: string
      degree?: string
      photo?: string
    }
  }

  interface User {
    id: string
    email: string
    name?: string | null
    image?: string | null
    role: string
    username?: string
    subscriptionTier?: string
    profilePublic?: boolean
    firstName?: string
    lastName?: string
    company?: string
    jobTitle?: string
    university?: string
    degree?: string
    photo?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    email: string
    role: string
    username?: string
    subscriptionTier?: string
    profilePublic?: boolean
    firstName?: string
    lastName?: string
    company?: string
    jobTitle?: string
    university?: string
    degree?: string
    photo?: string
  }
}
