import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { generateDecisionPack } from '@/lib/decision-pack'

/**
 * GET /api/decision-pack/[candidateId]/pdf
 * Returns a simplified JSON representation that can be rendered as PDF client-side.
 * In production, use @react-pdf/renderer for server-side PDF generation.
 * RECRUITER auth required.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ candidateId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const user = session?.user as { id?: string; role?: string } | undefined
    if (!user?.id || user.role !== 'RECRUITER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { candidateId } = await params
    const url = new URL(request.url)
    const jobId = url.searchParams.get('jobId') || undefined

    const pack = await generateDecisionPack(user.id, candidateId, jobId)

    const fullName = [pack.candidate.firstName, pack.candidate.lastName]
      .filter(Boolean)
      .join(' ')

    // Generate a simple HTML-based printable PDF
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Decision Pack - ${fullName}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; color: #1f2937; }
    h1 { color: #1e40af; font-size: 24px; margin-bottom: 4px; }
    h2 { color: #374151; font-size: 18px; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; margin-top: 32px; }
    .header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 24px; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; }
    .badge-green { background: #dcfce7; color: #166534; }
    .badge-blue { background: #dbeafe; color: #1e40af; }
    .badge-gray { background: #f3f4f6; color: #374151; }
    table { width: 100%; border-collapse: collapse; margin: 12px 0; }
    th, td { text-align: left; padding: 8px 12px; border-bottom: 1px solid #e5e7eb; font-size: 14px; }
    th { background: #f9fafb; font-weight: 600; color: #6b7280; }
    .metric { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f3f4f6; }
    .metric-label { color: #6b7280; font-size: 14px; }
    .metric-value { font-weight: 600; font-size: 14px; }
    .section { margin-bottom: 24px; }
    .footer { margin-top: 40px; padding-top: 16px; border-top: 2px solid #e5e7eb; color: #9ca3af; font-size: 12px; text-align: center; }
    .project-card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; margin: 8px 0; }
    .skill-tag { display: inline-block; padding: 2px 6px; margin: 2px; border-radius: 3px; background: #f3f4f6; font-size: 12px; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1>${fullName}</h1>
      <p style="color: #6b7280; margin: 0;">${pack.candidate.university || ''} ${pack.candidate.degree ? '· ' + pack.candidate.degree : ''}</p>
    </div>
    <div style="text-align: right;">
      ${pack.prediction ? `<span class="badge badge-green">${Math.round(pack.prediction.probability * 100)}% Placement</span><br>` : ''}
      ${pack.matchScore !== null ? `<span class="badge badge-blue">${pack.matchScore}% Job Match</span><br>` : ''}
      ${pack.trustScore.universityVerified ? '<span class="badge badge-green">University Verified</span>' : ''}
    </div>
  </div>

  <h2>Trust Score</h2>
  <div class="section">
    <div class="metric"><span class="metric-label">Verified Projects</span><span class="metric-value">${pack.trustScore.verifiedProjects}/${pack.trustScore.totalProjects}</span></div>
    <div class="metric"><span class="metric-label">Professor Endorsements</span><span class="metric-value">${pack.trustScore.endorsementCount}</span></div>
  </div>

  <h2>Skills Evidence Map</h2>
  <table>
    <thead><tr><th>Skill</th><th>Industry Terms</th><th>Evidence</th><th>Level</th></tr></thead>
    <tbody>
    ${pack.skills.slice(0, 15).map((s) => `
      <tr>
        <td><strong>${s.name}</strong></td>
        <td>${s.industryTerms.slice(0, 3).join(', ')}</td>
        <td>${s.evidenceSources.slice(0, 2).join(', ')}</td>
        <td>${s.verifiedLevel}</td>
      </tr>`).join('')}
    </tbody>
  </table>

  ${pack.grades.length > 0 ? `
  <h2>Grade Provenance</h2>
  <table>
    <thead><tr><th>Project</th><th>Original</th><th>Normalized</th><th>IT</th><th>DE</th><th>UK</th></tr></thead>
    <tbody>
    ${pack.grades.map((g) => `
      <tr>
        <td>${g.projectTitle}</td>
        <td>${g.originalGrade} (${g.country})</td>
        <td><strong>${g.normalizedGrade !== null ? g.normalizedGrade + '/100' : '-'}</strong></td>
        <td>${g.displayInCountry.IT || '-'}</td>
        <td>${g.displayInCountry.DE || '-'}</td>
        <td>${g.displayInCountry.UK || '-'}</td>
      </tr>`).join('')}
    </tbody>
  </table>` : ''}

  <h2>Projects (${pack.projects.length})</h2>
  ${pack.projects.map((p) => `
  <div class="project-card">
    <strong>${p.title}</strong>
    <span class="badge badge-gray">${p.discipline.replace(/_/g, ' ')}</span>
    ${p.verificationStatus === 'VERIFIED' ? '<span class="badge badge-green">Verified</span>' : ''}
    ${p.grade ? `<span class="badge badge-blue">Grade: ${p.grade}</span>` : ''}
    <div style="margin-top: 6px;">
      ${p.skills.slice(0, 8).map((s) => `<span class="skill-tag">${s}</span>`).join('')}
    </div>
    ${p.innovationScore !== null ? `<div style="margin-top: 4px; font-size: 12px; color: #6b7280;">Innovation: ${p.innovationScore} | Complexity: ${p.complexityScore || '-'} | Relevance: ${p.marketRelevance || '-'}</div>` : ''}
  </div>`).join('')}

  <div class="footer">
    <p>Generated by InTransparency Decision Pack &middot; ${new Date().toLocaleDateString('en-GB')} &middot; intransparency.eu</p>
  </div>
</body>
</html>`

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `inline; filename="decision-pack-${fullName.replace(/\s+/g, '-').toLowerCase()}.html"`,
      },
    })
  } catch (error) {
    console.error('Decision pack PDF error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
