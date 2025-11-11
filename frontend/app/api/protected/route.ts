import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth/config"

/**
 * Example protected API route using NextAuth
 *
 * This demonstrates how to protect API routes and access user session data.
 *
 * Usage:
 * - GET /api/protected - Returns current user info if authenticated
 * - Requires valid NextAuth session
 */
export async function GET(req: NextRequest) {
  try {
    // Get the current session
    const session = await getServerSession(authOptions)

    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized - Please sign in" },
        { status: 401 }
      )
    }

    // Return user data
    return NextResponse.json({
      message: "You are authenticated!",
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role,
        subscriptionTier: session.user.subscriptionTier,
      },
    })
  } catch (error) {
    console.error("Protected route error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * Example POST endpoint that requires specific role
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Role-based access control example
    if (session.user.role !== "ADMIN" && session.user.role !== "RECRUITER") {
      return NextResponse.json(
        { error: "Forbidden - Insufficient permissions" },
        { status: 403 }
      )
    }

    // Process request for authorized users
    const body = await req.json()

    return NextResponse.json({
      message: "Action performed successfully",
      performedBy: session.user.email,
      role: session.user.role,
      data: body,
    })
  } catch (error) {
    console.error("Protected POST error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
