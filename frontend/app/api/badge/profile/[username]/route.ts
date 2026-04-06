import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://in-transparency.vercel.app'

/**
 * GET /api/badge/profile/[username]
 * Returns an SVG verification badge for a student's profile.
 * Public endpoint — no auth required. Embeddable on LinkedIn, CVs, emails.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { username },
        { id: username },
      ],
      profilePublic: true,
    },
    select: {
      firstName: true,
      lastName: true,
      university: true,
      _count: {
        select: {
          projects: true,
        },
      },
      projects: {
        where: { verificationStatus: 'VERIFIED' },
        select: { id: true },
      },
    },
  })

  if (!user) {
    return new NextResponse('Not Found', { status: 404 })
  }

  const name = [user.firstName, user.lastName].filter(Boolean).join(' ')
  const institution = user.university || 'InTransparency'
  const projectCount = user._count.projects
  const verifiedCount = user.projects.length
  const profileUrl = `${APP_URL}/students/${username}/public`

  const hasVerified = verifiedCount > 0
  const badgeColor = hasVerified ? '#16a34a' : '#6366f1' // green if verified, primary otherwise
  const statusText = hasVerified ? 'Verified' : 'Portfolio'
  const institutionShort = institution.length > 30 ? institution.substring(0, 27) + '...' : institution

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="60" viewBox="0 0 320 60">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#f8fafc"/>
      <stop offset="100%" style="stop-color:#f1f5f9"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="320" height="60" rx="8" fill="url(#bg)" stroke="#e2e8f0" stroke-width="1"/>

  <!-- Status indicator -->
  <rect x="0" y="0" width="4" height="60" rx="2" fill="${badgeColor}"/>

  <!-- Shield icon -->
  <g transform="translate(16, 14)">
    <path d="M16 2L4 8v8c0 7.2 5.4 14 12 16 6.6-2 12-8.8 12-16V8L16 2z" fill="${badgeColor}" opacity="0.15"/>
    <path d="M16 4L6 9v7c0 6.2 4.7 12 10 13.8 5.3-1.8 10-7.6 10-13.8V9L16 4z" fill="none" stroke="${badgeColor}" stroke-width="1.5"/>
    ${hasVerified ? '<path d="M12 17l3 3 6-6" fill="none" stroke="' + badgeColor + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' : '<circle cx="16" cy="16" r="3" fill="' + badgeColor + '"/>'}
  </g>

  <!-- Text -->
  <text x="52" y="22" font-family="system-ui,-apple-system,sans-serif" font-size="13" font-weight="600" fill="#1e293b">${escapeXml(name)}</text>
  <text x="52" y="38" font-family="system-ui,-apple-system,sans-serif" font-size="10" fill="#64748b">${escapeXml(institutionShort)}</text>
  <text x="52" y="50" font-family="system-ui,-apple-system,sans-serif" font-size="9" fill="#94a3b8">${projectCount} projects${verifiedCount > 0 ? ' · ' + verifiedCount + ' verified' : ''}</text>

  <!-- Status badge -->
  <rect x="${320 - 12 - statusText.length * 6.5}" y="12" width="${statusText.length * 6.5 + 16}" height="20" rx="10" fill="${badgeColor}" opacity="0.1"/>
  <text x="${320 - 4 - statusText.length * 3.25}" y="26" font-family="system-ui,-apple-system,sans-serif" font-size="10" font-weight="600" fill="${badgeColor}" text-anchor="middle">${statusText}</text>

  <!-- InTransparency branding -->
  <text x="308" y="52" font-family="system-ui,-apple-system,sans-serif" font-size="7" fill="#cbd5e1" text-anchor="end">InTransparency</text>
</svg>`

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
