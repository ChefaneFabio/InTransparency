import { DashboardNav } from '@/components/dashboard/shared/DashboardNav'
import { EmailVerifyBanner } from '@/components/auth/EmailVerifyBanner'

export default function ProfessorDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="segment-professor">
      <EmailVerifyBanner />
      <DashboardNav role="professor" />
      {children}
    </div>
  )
}
