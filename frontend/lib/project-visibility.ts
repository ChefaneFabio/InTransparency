/**
 * Peer visibility for projects — controls what OTHER STUDENTS see when
 * browsing a peer's project. Recruiters, universities, admins and the owner
 * always see the full project.
 *
 * Default: PREMIUM_ONLY. Free peers see a "locked card" payload (title +
 * author + verification badge + skill count). Premium peers see everything.
 *
 * The owner can flip a project's visibility to PUBLIC on the project edit
 * page if they want classmates to see the full content for collaboration or
 * reputation reasons.
 */

import type { Project, User } from '@prisma/client'

export type Viewer = {
  id: string | null
  role: string | null
  subscriptionTier: string | null
} | null

export type ProjectVisibilityInput = Pick<Project, 'userId' | 'peerVisibility'>

export interface VisibilityDecision {
  fullView: boolean
  reason:
    | 'OWNER'
    | 'NON_STUDENT_VIEWER'
    | 'PREMIUM_PEER'
    | 'PROJECT_PUBLIC_TO_PEERS'
    | 'PEER_LOCKED'
    | 'ANONYMOUS'
}

const PREMIUM_TIERS = new Set(['STUDENT_PREMIUM', 'PREMIUM', 'STUDENT_PREMIUM_TRIAL'])

/**
 * Decide whether a viewer can see the full project.
 *
 * Order:
 *   1. Owner of the project → full view.
 *   2. Non-student logged-in viewer (RECRUITER / UNIVERSITY / PROFESSOR /
 *      TECHPARK / ADMIN) → full view. They have their own gates elsewhere.
 *   3. Project explicitly opted-in PUBLIC → full view for any student peer.
 *   4. Student viewer with a Premium subscription → full view.
 *   5. Otherwise (free student peer, anonymous public viewer) → LOCKED.
 */
export function decideProjectVisibility(
  viewer: Viewer,
  project: ProjectVisibilityInput
): VisibilityDecision {
  if (viewer?.id && viewer.id === project.userId) {
    return { fullView: true, reason: 'OWNER' }
  }

  if (!viewer || !viewer.id) {
    if (project.peerVisibility === 'PUBLIC') {
      return { fullView: true, reason: 'PROJECT_PUBLIC_TO_PEERS' }
    }
    return { fullView: false, reason: 'ANONYMOUS' }
  }

  if (viewer.role && viewer.role !== 'STUDENT') {
    return { fullView: true, reason: 'NON_STUDENT_VIEWER' }
  }

  if (project.peerVisibility === 'PUBLIC') {
    return { fullView: true, reason: 'PROJECT_PUBLIC_TO_PEERS' }
  }

  if (viewer.subscriptionTier && PREMIUM_TIERS.has(viewer.subscriptionTier)) {
    return { fullView: true, reason: 'PREMIUM_PEER' }
  }

  return { fullView: false, reason: 'PEER_LOCKED' }
}

/**
 * Strip a project to the title-only "locked" shape. Keep enough that a
 * gallery still feels alive: title, discipline, course label, verification
 * status, owner basics, skill/tech *count* (not the values themselves), and
 * a `locked: true` flag for the client to render the upsell card.
 */
export function lockProjectForPeer<
  T extends {
    id: string
    title: string
    discipline?: unknown
    courseName?: string | null
    courseCode?: string | null
    universityVerified?: boolean
    verificationStatus?: unknown
    skills?: string[]
    technologies?: string[]
    competencies?: string[]
    createdAt?: Date | string
    user?: Partial<Pick<User, 'id' | 'firstName' | 'lastName' | 'username' | 'photo' | 'university'>>
    _count?: { endorsements?: number }
    endorsements?: unknown[]
  }
>(project: T): T & { locked: true; lockedReason: 'PEER_PREMIUM_GATE' } {
  const skillsCount = (project.skills?.length ?? 0)
    + (project.technologies?.length ?? 0)
    + (project.competencies?.length ?? 0)
  const endorsementCount =
    project._count?.endorsements ?? (Array.isArray(project.endorsements) ? project.endorsements.length : 0)

  // Return a stripped object with the same id/title shape so existing UI
  // doesn't crash — the client checks `locked: true` to render the upsell.
  return {
    id: project.id,
    title: project.title,
    discipline: project.discipline,
    courseName: project.courseName ?? null,
    courseCode: project.courseCode ?? null,
    universityVerified: project.universityVerified ?? false,
    verificationStatus: project.verificationStatus,
    skillsCount,
    endorsementCount,
    createdAt: project.createdAt,
    user: project.user,
    locked: true,
    lockedReason: 'PEER_PREMIUM_GATE',
  } as unknown as T & { locked: true; lockedReason: 'PEER_PREMIUM_GATE' }
}

/**
 * Apply the gate to a project: returns the original project for full view,
 * or the locked variant for peer-gated view.
 */
export function shapeProjectForViewer<
  T extends ProjectVisibilityInput & {
    id: string
    title: string
  }
>(project: T, viewer: Viewer): T | (T & { locked: true; lockedReason: 'PEER_PREMIUM_GATE' }) {
  const decision = decideProjectVisibility(viewer, project)
  if (decision.fullView) return project
  return lockProjectForPeer(project as unknown as Parameters<typeof lockProjectForPeer>[0]) as T & {
    locked: true
    lockedReason: 'PEER_PREMIUM_GATE'
  }
}
