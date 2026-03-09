import { DashboardNav } from '@/components/dashboard/shared/DashboardNav'

export default function RecruiterDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="segment-recruiter">
      <DashboardNav role="recruiter" />
      {children}
    </div>
  )
}
