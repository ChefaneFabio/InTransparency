/**
 * Institutional add-on marketplace — single source of truth for what can be
 * sold on top of the free Core workspace. Used by /pricing (public) and
 * /dashboard/university/add-ons (authenticated).
 */

import type { LucideIcon } from 'lucide-react'
import {
  Palette,
  Network,
  Key,
  Plug,
  Gauge,
  ShieldCheck,
  HeadphonesIcon,
  BadgeCheck,
  FileSpreadsheet,
  GraduationCap,
} from 'lucide-react'

export type AddonPricingModel =
  | { kind: 'annual'; euros: number; note?: string }
  | { kind: 'monthly'; euros: number; note?: string }
  | { kind: 'per-unit'; eurosPerUnit: number; unitLabel: string; note?: string }
  | { kind: 'one-time-plus-annual'; oneTimeEuros: number; annualEuros: number; note?: string }
  | { kind: 'custom'; note?: string }

export interface InstitutionAddon {
  key: string
  title: string
  oneLine: string
  description: string
  icon: LucideIcon
  /** ballpark pricing — shown on /pricing but always negotiable. */
  pricing: AddonPricingModel
  /** Audience targeting — shown as a chip. */
  target: string
  /** Implementation status — drives "Available" / "Coming soon" chips. */
  status: 'available' | 'beta' | 'roadmap'
  /** Color accent. */
  tint: 'blue' | 'violet' | 'emerald' | 'amber' | 'rose' | 'slate'
}

export const INSTITUTION_ADDONS: InstitutionAddon[] = [
  {
    key: 'premium-for-all',
    title: 'Student Premium — for everyone',
    oneLine: 'Sponsor Premium for every active student',
    description:
      "Unlock deep Skill Path, advanced analytics, unlimited AI analyses, custom portfolio URL, AI Interview Coach, Europass signed credentials — for every active student affiliated with your institution. Students see the tools unlocked with a small badge crediting you.",
    icon: GraduationCap,
    pricing: {
      kind: 'per-unit',
      eurosPerUnit: 2,
      unitLabel: 'student / year',
      note: '€2/student/yr · volume discounts from 2k+ · min €1,500/yr',
    },
    target: 'Institutions extending career tools to all students',
    status: 'available',
    tint: 'emerald',
  },
  {
    key: 'white-label',
    title: 'White-label workspace',
    oneLine: 'Your brand, your domain, your Terms of Service',
    description:
      "Host the full workspace on your own subdomain (e.g. placement.polimi.it), with your logo, colors, and Terms. Your recruiters see you, not us. Perfect for prestigious institutions that need to own the company relationship end-to-end.",
    icon: Palette,
    pricing: { kind: 'annual', euros: 24000, note: 'from €24k/yr — scales with enrollment' },
    target: 'Prestigious universities · PoliMi-tier',
    status: 'roadmap',
    tint: 'violet',
  },
  {
    key: 'multi-institution',
    title: 'Multi-institution rollup',
    oneLine: 'Network dashboard for consortia and groups',
    description:
      'Cross-institution analytics, shared employer CRM, consolidated reporting. Built for ITS networks (Lombardia, Piemonte), diocesan university groups, AFAM, regional consortia.',
    icon: Network,
    pricing: { kind: 'annual', euros: 12000, note: 'from €12k/yr for up to 5 institutions' },
    target: 'Consortia · 2+ institutions',
    status: 'roadmap',
    tint: 'blue',
  },
  {
    key: 'sso',
    title: 'SSO / SAML / SCIM',
    oneLine: 'Enterprise identity and user provisioning',
    description:
      'SAML 2.0 or OIDC authentication against your IdP (Azure AD, Google Workspace, Okta, Shibboleth). SCIM user provisioning so staff accounts follow your HR system.',
    icon: Key,
    pricing: { kind: 'annual', euros: 4000 },
    target: 'Institutions >1000 staff accounts',
    status: 'roadmap',
    tint: 'slate',
  },
  {
    key: 'ats-erp-bridge',
    title: 'ATS / ERP bridge',
    oneLine: 'Bidirectional sync with Esse3, U-GOV, Workday',
    description:
      "Two-way integration with your student records system. Placements sync automatically, graduation data flows in, mentors get auto-assigned from your org chart. We've worked with Esse3, U-GOV, CINECA, and Workday.",
    icon: Plug,
    pricing: {
      kind: 'one-time-plus-annual',
      oneTimeEuros: 8000,
      annualEuros: 3000,
      note: 'one-time setup + annual support',
    },
    target: 'Italian universities with legacy ERP',
    status: 'beta',
    tint: 'amber',
  },
  {
    key: 'priority-ai',
    title: 'Priority AI quota',
    oneLine: 'Bulk AI usage, dedicated queue',
    description:
      'Dedicated AI quota: bulk endorsement pass-through, faster fit-score recomputation, no shared queue. Ideal when your staff runs reminder engines and AI Assistant at high cadence.',
    icon: Gauge,
    pricing: { kind: 'monthly', euros: 1200, note: 'scales with concurrent users' },
    target: 'Institutions with heavy AI workload',
    status: 'available',
    tint: 'emerald',
  },
  {
    key: 'miur-anvur-pack',
    title: 'MIUR / ANVUR compliance pack',
    oneLine: 'Ministerial reports, automated',
    description:
      'Automated regulatory reporting in the formats MIUR and ANVUR actually require. Placement outcome reports, skills alignment with AVA 3.0, generation of CRUI-format exports. Annual audit-ready data room.',
    icon: ShieldCheck,
    pricing: { kind: 'annual', euros: 4500 },
    target: 'All Italian universities',
    status: 'roadmap',
    tint: 'rose',
  },
  {
    key: 'dedicated-csm',
    title: 'Dedicated CSM + SLA',
    oneLine: 'Named customer success manager + priority support',
    description:
      'Named CSM who knows your placement office. Quarterly business reviews, 24h response SLA, priority data-export guarantees, integration support. Onboarding for new staff included.',
    icon: HeadphonesIcon,
    pricing: { kind: 'annual', euros: 15000, note: 'from €15k/yr' },
    target: 'Strategic partners',
    status: 'available',
    tint: 'blue',
  },
  {
    key: 'bulk-credentials',
    title: 'Bulk verifiable credentials',
    oneLine: 'Issue diplomas and transcripts as signed VCs',
    description:
      'Issue diplomas, transcripts, micro-credentials as W3C Verifiable Credentials anchored to EBSI/EDCI. Recipients get a wallet-verifiable digital diploma. Bulk issuance at scale with cryptographic proof.',
    icon: BadgeCheck,
    pricing: {
      kind: 'per-unit',
      eurosPerUnit: 1.2,
      unitLabel: 'credential',
      note: '€1.20/credential, volume discounts from 5k+',
    },
    target: 'All institutions issuing credentials',
    status: 'beta',
    tint: 'emerald',
  },
  {
    key: 'custom-reporting',
    title: 'Custom reporting / data room',
    oneLine: 'Bespoke exports and board-level reports',
    description:
      'Custom report pipelines tailored to your board, your academic senate, your regional authority. Branded PDF/XLSX exports on a schedule, data room for external auditors, board-meeting packs.',
    icon: FileSpreadsheet,
    pricing: { kind: 'annual', euros: 3500 },
    target: 'Multi-stakeholder institutions',
    status: 'available',
    tint: 'amber',
  },
]

export function formatAddonPrice(p: AddonPricingModel, locale: string = 'en'): string {
  const euro = (n: number) =>
    new Intl.NumberFormat(locale === 'it' ? 'it-IT' : 'en-US', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(n)

  switch (p.kind) {
    case 'annual':
      return `${euro(p.euros)} / yr`
    case 'monthly':
      return `${euro(p.euros)} / mo`
    case 'per-unit':
      return `${new Intl.NumberFormat(locale === 'it' ? 'it-IT' : 'en-US', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2,
      }).format(p.eurosPerUnit)} / ${p.unitLabel}`
    case 'one-time-plus-annual':
      return `${euro(p.oneTimeEuros)} setup + ${euro(p.annualEuros)}/yr`
    case 'custom':
      return 'Custom'
  }
}
