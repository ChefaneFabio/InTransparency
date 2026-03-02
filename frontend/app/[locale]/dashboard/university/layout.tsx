import { DashboardNav } from '@/components/dashboard/shared/DashboardNav'

export default function UniversityDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <DashboardNav role="university" />
      {children}
    </>
  )
}
