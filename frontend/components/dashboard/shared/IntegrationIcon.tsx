'use client'

import type { IconType } from 'react-icons'
import {
  SiLinkedin,
  SiGithub,
  SiSlack,
  SiSalesforce,
  SiHubspot,
  SiGreenhouse,
  SiZoom,
  SiGooglemeet,
  SiGoogledrive,
  SiGooglecalendar,
  SiDropbox,
  SiKaggle,
  SiOrcid,
  SiIndeed,
  SiGoogle,
  SiCloudflare,
} from 'react-icons/si'
import { FaMicrosoft } from 'react-icons/fa'
import { TbBrandTeams } from 'react-icons/tb'
import {
  Award,
  Badge,
  Bot,
  BookOpen,
  Briefcase,
  Building2,
  CheckSquare,
  Database,
  FileSignature,
  Flag,
  GraduationCap,
  KeyRound,
  Landmark,
  Network,
  Plane,
  Scale,
  ShieldCheck,
  Wallet,
  Workflow,
} from 'lucide-react'

type IconKey =
  // Real brands (simple-icons / fa / tb)
  | 'linkedin' | 'github' | 'slack'
  | 'salesforce' | 'hubspot' | 'greenhouse'
  | 'zoom' | 'google-meet' | 'google-drive' | 'google-calendar' | 'google'
  | 'outlook' | 'microsoft' | 'teams'
  | 'dropbox' | 'kaggle' | 'orcid' | 'indeed' | 'cloudflare'
  // Concepts (Lucide) — also used as fallbacks for missing brand icons
  | 'eu' | 'italy' | 'ministry' | 'sso' | 'credential' | 'badge'
  | 'wallet' | 'signature' | 'esco' | 'graduation' | 'erasmus'
  | 'ai-bot' | 'compliance' | 'database' | 'workflow' | 'sis'
  | 'docusign' | 'workday'

const BRAND: Partial<Record<IconKey, { Icon: IconType; color: string }>> = {
  linkedin:         { Icon: SiLinkedin,        color: '#0A66C2' },
  github:           { Icon: SiGithub,          color: '#181717' },
  slack:            { Icon: SiSlack,           color: '#4A154B' },
  salesforce:       { Icon: SiSalesforce,      color: '#00A1E0' },
  hubspot:          { Icon: SiHubspot,         color: '#FF7A59' },
  greenhouse:       { Icon: SiGreenhouse,      color: '#2FAC66' },
  zoom:             { Icon: SiZoom,            color: '#2D8CFF' },
  'google-meet':    { Icon: SiGooglemeet,      color: '#00897B' },
  'google-drive':   { Icon: SiGoogledrive,     color: '#4285F4' },
  'google-calendar':{ Icon: SiGooglecalendar,  color: '#4285F4' },
  google:           { Icon: SiGoogle,          color: '#4285F4' },
  microsoft:        { Icon: FaMicrosoft,       color: '#5E5E5E' },
  teams:            { Icon: TbBrandTeams,      color: '#6264A7' },
  dropbox:          { Icon: SiDropbox,         color: '#0061FF' },
  kaggle:           { Icon: SiKaggle,          color: '#20BEFF' },
  orcid:            { Icon: SiOrcid,           color: '#A6CE39' },
  indeed:           { Icon: SiIndeed,          color: '#003A9B' },
  cloudflare:       { Icon: SiCloudflare,      color: '#F38020' },
}

// Lucide-based conceptual icons with accent colors
// (framed in a colored bg circle in the card render)
const CONCEPT: Partial<
  Record<IconKey, { Icon: React.ComponentType<{ className?: string }>; color: string; bg: string }>
> = {
  eu:         { Icon: Flag,          color: 'text-blue-700',    bg: 'bg-blue-50' },
  italy:      { Icon: Flag,          color: 'text-emerald-700', bg: 'bg-emerald-50' },
  ministry:   { Icon: Landmark,      color: 'text-slate-700',   bg: 'bg-slate-100' },
  sso:        { Icon: KeyRound,      color: 'text-purple-700',  bg: 'bg-purple-50' },
  credential: { Icon: Award,         color: 'text-amber-700',   bg: 'bg-amber-50' },
  badge:      { Icon: Badge,         color: 'text-pink-700',    bg: 'bg-pink-50' },
  wallet:     { Icon: Wallet,        color: 'text-indigo-700',  bg: 'bg-indigo-50' },
  signature:  { Icon: FileSignature, color: 'text-yellow-700',  bg: 'bg-yellow-50' },
  esco:       { Icon: Network,       color: 'text-cyan-700',    bg: 'bg-cyan-50' },
  graduation: { Icon: GraduationCap, color: 'text-blue-700',    bg: 'bg-blue-50' },
  erasmus:    { Icon: Plane,         color: 'text-sky-700',     bg: 'bg-sky-50' },
  'ai-bot':   { Icon: Bot,           color: 'text-white',       bg: 'bg-gradient-to-br from-indigo-500 to-purple-600' },
  compliance: { Icon: Scale,         color: 'text-rose-700',    bg: 'bg-rose-50' },
  database:   { Icon: Database,      color: 'text-teal-700',    bg: 'bg-teal-50' },
  workflow:   { Icon: Workflow,      color: 'text-violet-700',  bg: 'bg-violet-50' },
  sis:        { Icon: BookOpen,      color: 'text-blue-700',    bg: 'bg-blue-50' },
  // DocuSign + Workday don't have react-icons entries in our installed
  // version — render as tinted Lucide fallbacks matching their brand tone.
  docusign:   { Icon: FileSignature, color: 'text-yellow-700',  bg: 'bg-yellow-50' },
  workday:    { Icon: Briefcase,     color: 'text-blue-700',    bg: 'bg-blue-50' },
}

interface Props {
  iconKey: string
  size?: number
  className?: string
}

export function IntegrationIcon({ iconKey, size = 28, className = '' }: Props) {
  const key = iconKey as IconKey

  // Brand logo (colored by simple-icons' branded color)
  const brand = BRAND[key]
  if (brand) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg bg-white border ${className}`}
        style={{ width: size + 12, height: size + 12 }}
      >
        <brand.Icon size={size} style={{ color: brand.color }} />
      </div>
    )
  }

  // Concept icon (Lucide) in a tinted background
  const concept = CONCEPT[key]
  if (concept) {
    const Icon = concept.Icon
    return (
      <div
        className={`flex items-center justify-center rounded-lg ${concept.bg} ${className}`}
        style={{ width: size + 12, height: size + 12 }}
      >
        <Icon className={`${concept.color}`} />
      </div>
    )
  }

  // Fallback: initial in a neutral chip
  return (
    <div
      className={`flex items-center justify-center rounded-lg bg-muted text-muted-foreground font-semibold text-sm ${className}`}
      style={{ width: size + 12, height: size + 12 }}
    >
      {iconKey.slice(0, 2).toUpperCase()}
    </div>
  )
}
