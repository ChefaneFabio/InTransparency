import React from 'react'
import { Document, Page, View, Text, StyleSheet, Link } from '@react-pdf/renderer'

export interface CvProject {
  title: string
  description: string
  skills: string[]
  technologies: string[]
  verificationStatus: string
  endorsementCount: number
  grade?: string | null
  courseName?: string | null
}

export interface CvSkill {
  name: string
  level: number
  projectCount: number
}

export interface CvExchange {
  homeUniversityName: string
  hostUniversityName: string
  homeCountry: string
  hostCountry: string
  programType: string
  status: string
}

export interface CvBigFive {
  openness: number
  conscientiousness: number
  extraversion: number
  agreeableness: number
  neuroticism: number
  personality: string | null
  strengths: string[]
  careerFit: string[]
}

export interface CvDISC {
  dominance: number
  influence: number
  steadiness: number
  compliance: number
  primaryStyle: string
  idealTeamRole: string | null
}

export interface CvCompetency {
  communication: number
  teamwork: number
  leadership: number
  problemSolving: number
  adaptability: number
  emotionalIntelligence: number
  timeManagement: number
  conflictResolution: number
  overallScore: number
  topStrengths: string[]
}

export interface CvData {
  firstName: string | null
  lastName: string | null
  email: string
  university: string | null
  degree: string | null
  graduationYear: string | null
  gpa: number | null
  gpaPublic: boolean
  bio: string | null
  tagline: string | null
  linkedinUrl: string | null
  githubUrl: string | null
  portfolioUrl: string | null
  location: string | null
  skills: CvSkill[]
  projects: CvProject[]
  exchanges: CvExchange[]
  bigFive: CvBigFive | null
  disc: CvDISC | null
  competency: CvCompetency | null
}

export type CvStyle = 'classic' | 'modern'

const colors = {
  classic: {
    primary: '#1e3a5f',
    accent: '#2563eb',
    sectionBorder: '#1e3a5f',
    skillBar: '#2563eb',
    skillBg: '#e2e8f0',
    badgeVerified: '#166534',
    badgeVerifiedBg: '#dcfce7',
    badgeEndorsed: '#1e40af',
    badgeEndorsedBg: '#dbeafe',
    text: '#1f2937',
    muted: '#6b7280',
    lightBg: '#f8fafc',
  },
  modern: {
    primary: '#0f172a',
    accent: '#7c3aed',
    sectionBorder: '#7c3aed',
    skillBar: '#7c3aed',
    skillBg: '#ede9fe',
    badgeVerified: '#166534',
    badgeVerifiedBg: '#dcfce7',
    badgeEndorsed: '#5b21b6',
    badgeEndorsedBg: '#ede9fe',
    text: '#0f172a',
    muted: '#64748b',
    lightBg: '#faf5ff',
  },
}

const createStyles = (style: CvStyle) => {
  const c = colors[style]
  return StyleSheet.create({
    page: {
      padding: 40,
      fontFamily: 'Helvetica',
      fontSize: 10,
      color: c.text,
    },
    // Header
    header: {
      marginBottom: 16,
      borderBottomWidth: 2,
      borderBottomColor: c.sectionBorder,
      paddingBottom: 12,
    },
    name: {
      fontSize: style === 'modern' ? 26 : 22,
      fontFamily: 'Helvetica-Bold',
      color: c.primary,
      letterSpacing: style === 'modern' ? 1 : 0,
    },
    tagline: {
      fontSize: 11,
      color: c.muted,
      marginTop: 3,
      fontFamily: style === 'modern' ? 'Helvetica-Oblique' : 'Helvetica',
    },
    contactRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 6,
      gap: 8,
    },
    contactItem: {
      fontSize: 9,
      color: c.muted,
    },
    contactLink: {
      fontSize: 9,
      color: c.accent,
      textDecoration: 'none',
    },
    // Sections
    sectionTitle: {
      fontSize: 13,
      fontFamily: 'Helvetica-Bold',
      color: c.primary,
      borderBottomWidth: style === 'modern' ? 1 : 2,
      borderBottomColor: c.sectionBorder,
      paddingBottom: 3,
      marginTop: 16,
      marginBottom: 8,
      textTransform: style === 'modern' ? 'uppercase' as any : 'none' as any,
      letterSpacing: style === 'modern' ? 1 : 0,
    },
    // Education
    eduRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 2,
    },
    eduDegree: {
      fontSize: 11,
      fontFamily: 'Helvetica-Bold',
    },
    eduUni: {
      fontSize: 10,
      color: c.muted,
    },
    eduDetail: {
      fontSize: 9,
      color: c.muted,
    },
    // Summary
    summary: {
      fontSize: 10,
      lineHeight: 1.5,
      color: c.text,
    },
    // Skills
    skillsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
    },
    skillItem: {
      width: '48%',
      marginBottom: 4,
    },
    skillName: {
      fontSize: 9,
      fontFamily: 'Helvetica-Bold',
      marginBottom: 2,
    },
    skillBarOuter: {
      height: 4,
      backgroundColor: c.skillBg,
      borderRadius: 2,
    },
    skillBarInner: {
      height: 4,
      backgroundColor: c.skillBar,
      borderRadius: 2,
    },
    skillProjects: {
      fontSize: 7,
      color: c.muted,
      marginTop: 1,
    },
    // Projects
    projectCard: {
      borderWidth: 1,
      borderColor: '#e5e7eb',
      borderRadius: style === 'modern' ? 4 : 0,
      padding: 8,
      marginBottom: 6,
      backgroundColor: style === 'modern' ? c.lightBg : 'white',
    },
    projectHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginBottom: 3,
    },
    projectTitle: {
      fontSize: 11,
      fontFamily: 'Helvetica-Bold',
    },
    projectDesc: {
      fontSize: 9,
      color: c.muted,
      lineHeight: 1.4,
      marginBottom: 4,
    },
    badge: {
      paddingHorizontal: 4,
      paddingVertical: 1,
      borderRadius: 2,
      fontSize: 7,
      fontFamily: 'Helvetica-Bold',
    },
    badgeVerified: {
      backgroundColor: c.badgeVerifiedBg,
      color: c.badgeVerified,
    },
    badgeEndorsed: {
      backgroundColor: c.badgeEndorsedBg,
      color: c.badgeEndorsed,
    },
    techRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 3,
      marginTop: 3,
    },
    techTag: {
      backgroundColor: '#f3f4f6',
      paddingHorizontal: 4,
      paddingVertical: 1,
      borderRadius: 2,
      fontSize: 8,
    },
    // Exchange
    exchangeRow: {
      fontSize: 10,
      marginBottom: 3,
    },
    exchangeLabel: {
      fontFamily: 'Helvetica-Bold',
      fontSize: 10,
    },
    // Personality & Assessments
    assessmentGrid: {
      flexDirection: 'row',
      gap: 12,
    },
    assessmentColumn: {
      flex: 1,
    },
    assessmentLabel: {
      fontSize: 9,
      fontFamily: 'Helvetica-Bold',
      marginBottom: 2,
    },
    assessmentValue: {
      fontSize: 9,
      color: c.muted,
    },
    personalityType: {
      fontSize: 12,
      fontFamily: 'Helvetica-Bold',
      color: c.accent,
      marginBottom: 4,
    },
    traitRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 3,
    },
    traitLabel: {
      fontSize: 8,
      width: 90,
    },
    traitBarOuter: {
      flex: 1,
      height: 4,
      backgroundColor: c.skillBg,
      borderRadius: 2,
    },
    traitBarInner: {
      height: 4,
      backgroundColor: c.accent,
      borderRadius: 2,
    },
    traitScore: {
      fontSize: 7,
      color: c.muted,
      width: 25,
      textAlign: 'right' as any,
    },
    careerFitRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 4,
      marginTop: 4,
    },
    careerFitTag: {
      backgroundColor: c.lightBg,
      borderWidth: 1,
      borderColor: c.accent,
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 3,
      fontSize: 8,
      color: c.accent,
    },
    // Footer
    footer: {
      position: 'absolute',
      bottom: 25,
      left: 40,
      right: 40,
      textAlign: 'center',
      fontSize: 8,
      color: '#9ca3af',
      borderTopWidth: 1,
      borderTopColor: '#e5e7eb',
      paddingTop: 6,
    },
  })
}

export function CvDocument({ data, style = 'classic' }: { data: CvData; style?: CvStyle }) {
  const s = createStyles(style)
  const fullName = [data.firstName, data.lastName].filter(Boolean).join(' ') || 'Student'

  return React.createElement(Document, null,
    React.createElement(Page, { size: 'A4', style: s.page },

      // ── Header ──
      React.createElement(View, { style: s.header },
        React.createElement(Text, { style: s.name }, fullName),
        data.tagline
          ? React.createElement(Text, { style: s.tagline }, data.tagline)
          : null,
        React.createElement(View, { style: s.contactRow },
          ...[
            data.email ? React.createElement(Text, { key: 'email', style: s.contactItem }, data.email) : null,
            data.location ? React.createElement(Text, { key: 'loc', style: s.contactItem }, data.location) : null,
            data.linkedinUrl
              ? React.createElement(Link, { key: 'li', src: data.linkedinUrl, style: s.contactLink }, 'LinkedIn')
              : null,
            data.githubUrl
              ? React.createElement(Link, { key: 'gh', src: data.githubUrl, style: s.contactLink }, 'GitHub')
              : null,
            data.portfolioUrl
              ? React.createElement(Link, { key: 'pf', src: data.portfolioUrl, style: s.contactLink }, 'Portfolio')
              : null,
          ].filter(Boolean),
        ),
      ),

      // ── Summary ──
      ...(data.bio ? [
        React.createElement(Text, { key: 'sum-title', style: s.sectionTitle }, 'Summary'),
        React.createElement(Text, { key: 'sum-text', style: s.summary }, data.bio),
      ] : []),

      // ── Education ──
      React.createElement(Text, { style: s.sectionTitle }, 'Education'),
      React.createElement(View, null,
        React.createElement(View, { style: s.eduRow },
          React.createElement(Text, { style: s.eduDegree }, data.degree || 'Degree not specified'),
          data.graduationYear
            ? React.createElement(Text, { style: s.eduDetail }, `Class of ${data.graduationYear}`)
            : null,
        ),
        React.createElement(Text, { style: s.eduUni }, data.university || 'University not specified'),
        data.gpaPublic && data.gpa
          ? React.createElement(Text, { style: s.eduDetail }, `GPA: ${data.gpa}`)
          : null,
      ),

      // ── Exchange ──
      ...(data.exchanges.length > 0 ? [
        React.createElement(Text, { key: 'ex-title', style: s.sectionTitle }, 'Exchange Program'),
        ...data.exchanges.map((ex, i) =>
          React.createElement(View, { key: `ex-${i}`, style: { marginBottom: 4 } },
            React.createElement(Text, { style: s.exchangeRow },
              React.createElement(Text, { style: s.exchangeLabel }, `${ex.programType}: `),
              `${ex.homeUniversityName} (${ex.homeCountry}) → ${ex.hostUniversityName} (${ex.hostCountry})`
            ),
          )
        ),
      ] : []),

      // ── Skills ──
      ...(data.skills.length > 0 ? [
        React.createElement(Text, { key: 'sk-title', style: s.sectionTitle }, 'Skills'),
        React.createElement(View, { key: 'sk-list', style: s.skillsContainer },
          ...data.skills.slice(0, 12).map((sk, i) =>
            React.createElement(View, { key: `sk-${i}`, style: s.skillItem },
              React.createElement(Text, { style: s.skillName }, sk.name),
              React.createElement(View, { style: s.skillBarOuter },
                React.createElement(View, { style: { ...s.skillBarInner, width: `${sk.level}%` } }),
              ),
              React.createElement(Text, { style: s.skillProjects },
                `${sk.projectCount} project${sk.projectCount !== 1 ? 's' : ''}`
              ),
            )
          ),
        ),
      ] : []),

      // ── Personality & Soft Skills ──
      ...((data.bigFive || data.disc || data.competency) ? [
        React.createElement(Text, { key: 'ps-title', style: s.sectionTitle }, 'Personality & Soft Skills'),

        // Big Five
        ...(data.bigFive ? [
          data.bigFive.personality
            ? React.createElement(Text, { key: 'bf-type', style: s.personalityType },
              `Personality: ${data.bigFive.personality}`)
            : null,
          React.createElement(View, { key: 'bf-traits' },
            ...([
              ['Openness', data.bigFive.openness],
              ['Conscientiousness', data.bigFive.conscientiousness],
              ['Extraversion', data.bigFive.extraversion],
              ['Agreeableness', data.bigFive.agreeableness],
              ['Emotional Stability', Math.max(0, 100 - data.bigFive.neuroticism)],
            ] as Array<[string, number]>).map(([label, score], i) =>
              React.createElement(View, { key: `bf-${i}`, style: s.traitRow },
                React.createElement(Text, { style: s.traitLabel }, label),
                React.createElement(View, { style: s.traitBarOuter },
                  React.createElement(View, { style: { ...s.traitBarInner, width: `${Math.round(score)}%` } }),
                ),
                React.createElement(Text, { style: s.traitScore }, `${Math.round(score)}%`),
              )
            ),
          ),
          ...(data.bigFive.careerFit.length > 0 ? [
            React.createElement(View, { key: 'bf-career', style: s.careerFitRow },
              React.createElement(Text, { style: { fontSize: 8, fontFamily: 'Helvetica-Bold', marginRight: 4 } }, 'Career fit:'),
              ...data.bigFive.careerFit.slice(0, 4).map((c, i) =>
                React.createElement(Text, { key: `cf-${i}`, style: s.careerFitTag }, c)
              ),
            ),
          ] : []),
        ].filter(Boolean) : []),

        // DISC + Competency side by side
        ...((data.disc || data.competency) ? [
          React.createElement(View, { key: 'disc-comp', style: { ...s.assessmentGrid, marginTop: 8 } },
            // DISC column
            ...(data.disc ? [
              React.createElement(View, { key: 'disc-col', style: s.assessmentColumn },
                React.createElement(Text, { style: s.assessmentLabel }, `DISC Profile: ${data.disc.primaryStyle}`),
                ...([
                  ['Dominance', data.disc.dominance],
                  ['Influence', data.disc.influence],
                  ['Steadiness', data.disc.steadiness],
                  ['Compliance', data.disc.compliance],
                ] as Array<[string, number]>).map(([label, score], i) =>
                  React.createElement(View, { key: `d-${i}`, style: s.traitRow },
                    React.createElement(Text, { style: { ...s.traitLabel, width: 65 } }, label),
                    React.createElement(View, { style: s.traitBarOuter },
                      React.createElement(View, { style: { ...s.traitBarInner, width: `${Math.round(score)}%` } }),
                    ),
                    React.createElement(Text, { style: s.traitScore }, `${Math.round(score)}%`),
                  )
                ),
                data.disc.idealTeamRole
                  ? React.createElement(Text, { style: { ...s.assessmentValue, marginTop: 3 } },
                    `Team role: ${data.disc.idealTeamRole}`)
                  : null,
              ),
            ] : []),
            // Competency column
            ...(data.competency ? [
              React.createElement(View, { key: 'comp-col', style: s.assessmentColumn },
                React.createElement(Text, { style: s.assessmentLabel },
                  `Soft Skills (${Math.round(data.competency.overallScore)}%)`),
                ...([
                  ['Communication', data.competency.communication],
                  ['Teamwork', data.competency.teamwork],
                  ['Leadership', data.competency.leadership],
                  ['Problem Solving', data.competency.problemSolving],
                  ['Adaptability', data.competency.adaptability],
                  ['EQ', data.competency.emotionalIntelligence],
                  ['Time Mgmt', data.competency.timeManagement],
                  ['Conflict Res.', data.competency.conflictResolution],
                ] as Array<[string, number]>).map(([label, score], i) =>
                  React.createElement(View, { key: `c-${i}`, style: s.traitRow },
                    React.createElement(Text, { style: { ...s.traitLabel, width: 65 } }, label),
                    React.createElement(View, { style: s.traitBarOuter },
                      React.createElement(View, { style: { ...s.traitBarInner, width: `${Math.round(score)}%` } }),
                    ),
                    React.createElement(Text, { style: s.traitScore }, `${Math.round(score)}%`),
                  )
                ),
              ),
            ] : []),
          ),
        ] : []),
      ] : []),

      // ── Projects ──
      ...(data.projects.length > 0 ? [
        React.createElement(Text, { key: 'pr-title', style: s.sectionTitle }, `Projects (${data.projects.length})`),
        ...data.projects.slice(0, 8).map((p, i) =>
          React.createElement(View, { key: `pr-${i}`, style: s.projectCard, wrap: false },
            React.createElement(View, { style: s.projectHeader },
              React.createElement(Text, { style: s.projectTitle }, p.title),
              p.verificationStatus === 'VERIFIED'
                ? React.createElement(Text, { style: { ...s.badge, ...s.badgeVerified } }, 'Verified')
                : null,
              p.endorsementCount > 0
                ? React.createElement(Text, { style: { ...s.badge, ...s.badgeEndorsed } },
                  `${p.endorsementCount} endorsement${p.endorsementCount !== 1 ? 's' : ''}`)
                : null,
              p.grade
                ? React.createElement(Text, { style: { ...s.badge, ...s.badgeEndorsed } }, `Grade: ${p.grade}`)
                : null,
            ),
            p.description
              ? React.createElement(Text, { style: s.projectDesc },
                p.description.length > 200 ? p.description.slice(0, 200) + '...' : p.description)
              : null,
            React.createElement(View, { style: s.techRow },
              ...p.skills.concat(p.technologies).slice(0, 8).map((t, j) =>
                React.createElement(Text, { key: `t-${j}`, style: s.techTag }, t)
              ),
            ),
          )
        ),
      ] : []),

      // ── Footer ──
      React.createElement(Text, { style: s.footer },
        `Generated by InTransparency \u2014 institution-verified data \u00B7 ${new Date().toLocaleDateString('en-GB')} \u00B7 intransparency.eu`
      ),
    )
  )
}
