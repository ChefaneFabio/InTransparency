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
  | { kind: 'annual'; euros: number }
  | { kind: 'monthly'; euros: number }
  | { kind: 'per-unit'; eurosPerUnit: number; unitLabel: string }
  | { kind: 'custom' }

export interface InstitutionAddon {
  /** Stable lookup key — matches the JSON key under `dashboard.addons.{key}`
   *  in messages/{en,it}.json. Title, one-line, description, target,
   *  and note are all resolved through that translation namespace. */
  key: string
  icon: LucideIcon
  /** ballpark pricing — shown on /pricing but always negotiable. */
  pricing: AddonPricingModel
  /** Implementation status — drives "Available" / "Coming soon" chips. */
  status: 'available' | 'beta' | 'roadmap'
  /** Color accent. */
  tint: 'blue' | 'violet' | 'emerald' | 'amber' | 'rose' | 'slate'
}

// Strings (title, oneLine, description, target, note) live in
// messages/{en,it}.json under `dashboard.addons.{key}` — see
// components/pricing/InstitutionAddonGrid.tsx for the lookup.
//
// The "Premium-for-all" sponsorship add-on (€1/student/yr) was retired
// 2026-04-26. Per the spec lock-in: universities and ITS do NOT pay for
// their students. Students subscribe individually at €5/mo or €45/yr.
// The Institution.sponsorsPremium schema column is kept for potential
// free-pilot use but is no longer offered as a paid add-on.
export const INSTITUTION_ADDONS: InstitutionAddon[] = [
  {
    key: 'white-label',
    icon: Palette,
    pricing: { kind: 'annual', euros: 14000 },
    status: 'roadmap',
    tint: 'violet',
  },
  {
    key: 'multi-institution',
    icon: Network,
    pricing: { kind: 'annual', euros: 7000 },
    status: 'roadmap',
    tint: 'blue',
  },
  {
    key: 'sso',
    icon: Key,
    pricing: { kind: 'annual', euros: 2500 },
    status: 'roadmap',
    tint: 'slate',
  },
  {
    key: 'ats-erp-bridge',
    icon: Plug,
    pricing: { kind: 'annual', euros: 1500 },
    status: 'beta',
    tint: 'amber',
  },
  {
    key: 'priority-ai',
    icon: Gauge,
    pricing: { kind: 'monthly', euros: 690 },
    status: 'available',
    tint: 'emerald',
  },
  {
    key: 'miur-anvur-pack',
    icon: ShieldCheck,
    pricing: { kind: 'annual', euros: 2900 },
    status: 'roadmap',
    tint: 'rose',
  },
  {
    key: 'dedicated-csm',
    icon: HeadphonesIcon,
    pricing: { kind: 'annual', euros: 9000 },
    status: 'available',
    tint: 'blue',
  },
  {
    key: 'bulk-credentials',
    icon: BadgeCheck,
    pricing: { kind: 'per-unit', eurosPerUnit: 0.6, unitLabel: 'credential' },
    status: 'beta',
    tint: 'emerald',
  },
  {
    key: 'custom-reporting',
    icon: FileSpreadsheet,
    pricing: { kind: 'annual', euros: 1900 },
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

  const isIt = locale === 'it'
  const yearSuffix = isIt ? '/anno' : '/yr'
  const monthSuffix = isIt ? '/mese' : '/mo'

  switch (p.kind) {
    case 'annual':
      return `${euro(p.euros)} ${yearSuffix}`
    case 'monthly':
      return `${euro(p.euros)} ${monthSuffix}`
    case 'per-unit':
      return `${new Intl.NumberFormat(isIt ? 'it-IT' : 'en-US', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2,
      }).format(p.eurosPerUnit)} / ${p.unitLabel}`
    case 'custom':
      return isIt ? 'Su misura' : 'Custom'
  }
}
