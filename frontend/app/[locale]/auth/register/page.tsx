import { redirect } from 'next/navigation'
import RegisterClient from './RegisterClient'

/**
 * /auth/register — role selector landing page.
 *
 * If the visitor arrives with `?role=...` (from a homepage segment CTA),
 * we redirect server-side to the role-specific signup page. This eliminates
 * the previous useEffect-based flash where the role-selector cards were
 * briefly visible before the client-side router pushed away.
 *
 * If no role param is present (visitor clicked the generic "Inizia Ora"
 * header CTA), render the client component with the 3 main cards
 * + a Tech Park link below.
 */

const ROLE_REDIRECT_MAP: Record<string, string> = {
  student:   '/auth/register/student',
  company:   '/auth/register/recruiter',
  recruiter: '/auth/register/recruiter',
  university:'/auth/register/academic-partner',
  institute: '/auth/register/academic-partner',
  professor: '/auth/register/academic-partner',
  techpark:  '/auth/register/techpark',
  'tech-park':'/auth/register/techpark',
}

export default async function RegisterPage({
  searchParams,
  params,
}: {
  searchParams: Promise<{ role?: string }>
  params: Promise<{ locale: string }>
}) {
  const { role } = await searchParams
  const { locale } = await params

  if (role) {
    const target = ROLE_REDIRECT_MAP[role.toLowerCase()]
    if (target) {
      // next-intl-aware: prepend locale so the redirect respects the current language
      redirect(`/${locale}${target}`)
    }
  }

  return <RegisterClient />
}
