import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import QRCode from 'qrcode'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://intransparency.eu'

/**
 * Generate QR code as SVG path string for embedding inline.
 */
async function generateQRSvgPaths(url: string): Promise<string> {
  try {
    const svgString = await QRCode.toString(url, {
      type: 'svg',
      margin: 0,
      width: 60,
      errorCorrectionLevel: 'M',
      color: { dark: '#374151', light: '#00000000' },
    })
    // Extract just the path/rect elements from the SVG
    const pathMatch = svgString.match(/<path[^>]*\/>/g)
    if (pathMatch) return pathMatch.join('\n')
    // Fallback: extract rect elements
    const rectMatch = svgString.match(/<rect[^>]*\/>/g)
    if (rectMatch) return rectMatch.slice(1).join('\n') // skip background rect
    return ''
  } catch {
    return ''
  }
}

/**
 * GET /api/badge/[projectId]
 * Returns an SVG badge image for a verified project.
 * No auth required — public endpoint.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: {
      id: true,
      title: true,
      grade: true,
      verificationStatus: true,
      verifiedAt: true,
      user: {
        select: { university: true },
      },
    },
  })

  if (!project || project.verificationStatus !== 'VERIFIED') {
    return new NextResponse('Not Found', { status: 404 })
  }

  // Increment view count on badge
  await prisma.portableBadge.updateMany({
    where: { projectId },
    data: { viewCount: { increment: 1 } },
  }).catch(() => { /* ignore if no badge record */ })

  const institution = project.user?.university || 'InTransparency'
  const title = project.title.length > 40
    ? project.title.substring(0, 37) + '...'
    : project.title
  const grade = project.grade || ''
  const date = project.verifiedAt
    ? new Date(project.verifiedAt).toLocaleDateString('en-GB', {
        month: 'short',
        year: 'numeric',
      })
    : ''

  const verifyUrl = `${APP_URL}/verify/${projectId}`
  const qrPaths = await generateQRSvgPaths(verifyUrl)

  // Escape XML entities
  const esc = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="440" height="120" viewBox="0 0 440 120">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#1e40af"/>
      <stop offset="100%" stop-color="#3b82f6"/>
    </linearGradient>
  </defs>
  <rect width="440" height="120" rx="8" fill="url(#bg)"/>
  <rect x="1" y="1" width="438" height="118" rx="7" fill="white" fill-opacity="0.95"/>

  <!-- Shield icon -->
  <g transform="translate(20, 20)">
    <path d="M20 4L4 10v10c0 11.1 6.8 21.4 16 26 9.2-4.6 16-14.9 16-26V10L20 4z" fill="#16a34a" opacity="0.9"/>
    <path d="M16 21l-4-4 1.4-1.4L16 18.2l6.6-6.6L24 13l-8 8z" fill="white"/>
  </g>

  <!-- Text content -->
  <text x="70" y="35" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#6b7280">
    Verified by ${esc(institution)}
  </text>
  <text x="70" y="58" font-family="system-ui, -apple-system, sans-serif" font-size="15" font-weight="600" fill="#111827">
    ${esc(title)}
  </text>
  <text x="70" y="80" font-family="system-ui, -apple-system, sans-serif" font-size="12" fill="#4b5563">
    ${grade ? `Grade: ${esc(grade)}` : ''}${grade && date ? ' \u00B7 ' : ''}${date ? `${esc(date)}` : ''}
  </text>

  <!-- InTransparency branding -->
  <rect x="70" y="92" width="6" height="6" rx="1" fill="#2563eb"/>
  <text x="80" y="98" font-family="system-ui, -apple-system, sans-serif" font-size="9" fill="#9ca3af">
    InTransparency
  </text>

  <!-- QR Code -->
  ${qrPaths ? `<g transform="translate(365, 15) scale(0.15)">
    ${qrPaths}
  </g>` : ''}
</svg>`

  return new NextResponse(svg, {
    status: 200,
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
