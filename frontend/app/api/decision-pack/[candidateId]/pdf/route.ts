import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { generateDecisionPack } from '@/lib/decision-pack'
import React from 'react'
import { renderToBuffer, Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#1f2937',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    color: '#1e40af',
  },
  subtitle: {
    fontSize: 11,
    color: '#6b7280',
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 3,
  },
  badgeGreen: {
    backgroundColor: '#dcfce7',
    color: '#166534',
  },
  badgeBlue: {
    backgroundColor: '#dbeafe',
    color: '#1e40af',
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: '#374151',
    borderBottomWidth: 2,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 4,
    marginTop: 20,
    marginBottom: 8,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  metricLabel: {
    fontSize: 10,
    color: '#6b7280',
  },
  metricValue: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f9fafb',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tableHeaderCell: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#6b7280',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tableCell: {
    fontSize: 9,
  },
  projectCard: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 6,
    padding: 10,
    marginBottom: 6,
  },
  projectTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
  },
  skillTag: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 2,
    fontSize: 8,
    marginRight: 3,
    marginTop: 2,
  },
  skillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  footer: {
    marginTop: 30,
    paddingTop: 10,
    borderTopWidth: 2,
    borderTopColor: '#e5e7eb',
    textAlign: 'center',
    fontSize: 9,
    color: '#9ca3af',
  },
  scores: {
    fontSize: 8,
    color: '#6b7280',
    marginTop: 3,
  },
})

function DecisionPackPDF({ pack }: { pack: any }) {
  const fullName = [pack.candidate.firstName, pack.candidate.lastName]
    .filter(Boolean)
    .join(' ')

  return React.createElement(Document, null,
    React.createElement(Page, { size: 'A4', style: styles.page },
      // Header
      React.createElement(View, { style: styles.header },
        React.createElement(View, null,
          React.createElement(Text, { style: styles.title }, fullName),
          React.createElement(Text, { style: styles.subtitle },
            [pack.candidate.university, pack.candidate.degree].filter(Boolean).join(' · ')
          ),
        ),
        React.createElement(View, { style: { alignItems: 'flex-end' as any } },
          pack.prediction
            ? React.createElement(Text, { style: { ...styles.badge, ...styles.badgeGreen } },
              `${Math.round(pack.prediction.probability * 100)}% Placement`)
            : null,
          pack.matchScore !== null
            ? React.createElement(Text, { style: { ...styles.badge, ...styles.badgeBlue } },
              `${pack.matchScore}% Job Match`)
            : null,
          pack.trustScore.universityVerified
            ? React.createElement(Text, { style: { ...styles.badge, ...styles.badgeGreen } },
              'University Verified')
            : null,
        ),
      ),

      // Trust Score
      React.createElement(Text, { style: styles.sectionTitle }, 'Trust Score'),
      React.createElement(View, { style: styles.metricRow },
        React.createElement(Text, { style: styles.metricLabel }, 'Verified Projects'),
        React.createElement(Text, { style: styles.metricValue },
          `${pack.trustScore.verifiedProjects}/${pack.trustScore.totalProjects}`),
      ),
      React.createElement(View, { style: styles.metricRow },
        React.createElement(Text, { style: styles.metricLabel }, 'Professor Endorsements'),
        React.createElement(Text, { style: styles.metricValue },
          String(pack.trustScore.endorsementCount)),
      ),

      // Skills Evidence Map
      React.createElement(Text, { style: styles.sectionTitle }, 'Skills Evidence Map'),
      React.createElement(View, { style: styles.tableHeader },
        React.createElement(Text, { style: { ...styles.tableHeaderCell, width: '25%' } }, 'Skill'),
        React.createElement(Text, { style: { ...styles.tableHeaderCell, width: '30%' } }, 'Industry Terms'),
        React.createElement(Text, { style: { ...styles.tableHeaderCell, width: '30%' } }, 'Evidence'),
        React.createElement(Text, { style: { ...styles.tableHeaderCell, width: '15%' } }, 'Level'),
      ),
      ...pack.skills.slice(0, 15).map((s: any, i: number) =>
        React.createElement(View, { key: `skill-${i}`, style: styles.tableRow },
          React.createElement(Text, { style: { ...styles.tableCell, width: '25%', fontFamily: 'Helvetica-Bold' } }, s.name),
          React.createElement(Text, { style: { ...styles.tableCell, width: '30%' } }, s.industryTerms.slice(0, 3).join(', ')),
          React.createElement(Text, { style: { ...styles.tableCell, width: '30%' } }, s.evidenceSources.slice(0, 2).join(', ')),
          React.createElement(Text, { style: { ...styles.tableCell, width: '15%' } }, s.verifiedLevel),
        )
      ),

      // Grade Provenance
      ...(pack.grades.length > 0 ? [
        React.createElement(Text, { key: 'grades-title', style: styles.sectionTitle }, 'Grade Provenance'),
        React.createElement(View, { key: 'grades-header', style: styles.tableHeader },
          React.createElement(Text, { style: { ...styles.tableHeaderCell, width: '25%' } }, 'Project'),
          React.createElement(Text, { style: { ...styles.tableHeaderCell, width: '20%' } }, 'Original'),
          React.createElement(Text, { style: { ...styles.tableHeaderCell, width: '15%' } }, 'Normalized'),
          React.createElement(Text, { style: { ...styles.tableHeaderCell, width: '13%' } }, 'IT'),
          React.createElement(Text, { style: { ...styles.tableHeaderCell, width: '13%' } }, 'DE'),
          React.createElement(Text, { style: { ...styles.tableHeaderCell, width: '14%' } }, 'UK'),
        ),
        ...pack.grades.map((g: any, i: number) =>
          React.createElement(View, { key: `grade-${i}`, style: styles.tableRow },
            React.createElement(Text, { style: { ...styles.tableCell, width: '25%' } }, g.projectTitle),
            React.createElement(Text, { style: { ...styles.tableCell, width: '20%' } }, `${g.originalGrade} (${g.country})`),
            React.createElement(Text, { style: { ...styles.tableCell, width: '15%', fontFamily: 'Helvetica-Bold' } },
              g.normalizedGrade !== null ? `${g.normalizedGrade}/100` : '-'),
            React.createElement(Text, { style: { ...styles.tableCell, width: '13%' } }, g.displayInCountry.IT || '-'),
            React.createElement(Text, { style: { ...styles.tableCell, width: '13%' } }, g.displayInCountry.DE || '-'),
            React.createElement(Text, { style: { ...styles.tableCell, width: '14%' } }, g.displayInCountry.UK || '-'),
          )
        ),
      ] : []),

      // Projects
      React.createElement(Text, { style: styles.sectionTitle }, `Projects (${pack.projects.length})`),
      ...pack.projects.slice(0, 10).map((p: any, i: number) =>
        React.createElement(View, { key: `proj-${i}`, style: styles.projectCard },
          React.createElement(View, { style: { flexDirection: 'row', alignItems: 'center', gap: 6 } },
            React.createElement(Text, { style: styles.projectTitle }, p.title),
            p.verificationStatus === 'VERIFIED'
              ? React.createElement(Text, { style: { ...styles.badge, ...styles.badgeGreen } }, 'Verified')
              : null,
            p.grade
              ? React.createElement(Text, { style: { ...styles.badge, ...styles.badgeBlue } }, `Grade: ${p.grade}`)
              : null,
          ),
          React.createElement(View, { style: styles.skillRow },
            ...p.skills.slice(0, 8).map((s: string, j: number) =>
              React.createElement(Text, { key: `ps-${j}`, style: styles.skillTag }, s)
            ),
          ),
          p.innovationScore !== null
            ? React.createElement(Text, { style: styles.scores },
              `Innovation: ${p.innovationScore} | Complexity: ${p.complexityScore || '-'} | Relevance: ${p.marketRelevance || '-'}`)
            : null,
        )
      ),

      // Footer
      React.createElement(Text, { style: styles.footer },
        `Generated by InTransparency Decision Pack · ${new Date().toLocaleDateString('en-GB')} · intransparency.eu`
      ),
    )
  )
}

/**
 * GET /api/decision-pack/[candidateId]/pdf
 * Returns a real PDF document generated with @react-pdf/renderer.
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

    const pdfBuffer = await renderToBuffer(
      React.createElement(DecisionPackPDF, { pack }) as any
    )

    return new NextResponse(Buffer.from(pdfBuffer) as any, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="decision-pack-${fullName.replace(/\s+/g, '-').toLowerCase()}.pdf"`,
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
