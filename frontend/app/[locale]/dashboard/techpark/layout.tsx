import { DashboardNav } from '@/components/dashboard/shared/DashboardNav'
import { EmailVerifyBanner } from '@/components/auth/EmailVerifyBanner'

export default function TechParkDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="segment-university">
      <EmailVerifyBanner />
      <DashboardNav role="techpark" />
      {children}
    </div>
  )
}
