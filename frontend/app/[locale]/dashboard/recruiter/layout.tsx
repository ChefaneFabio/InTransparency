import { DashboardNav } from '@/components/dashboard/shared/DashboardNav'

export default function RecruiterDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <DashboardNav role="recruiter" />
      {children}
    </>
  )
}
