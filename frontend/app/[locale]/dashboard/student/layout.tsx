import { DashboardNav } from '@/components/dashboard/shared/DashboardNav'

export default function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <DashboardNav role="student" />
      {children}
    </>
  )
}
