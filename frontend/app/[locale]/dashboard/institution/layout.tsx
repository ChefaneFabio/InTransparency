import { DashboardNav } from '@/components/dashboard/shared/DashboardNav'

export default function InstitutionDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <DashboardNav role="institution" />
      {children}
    </>
  )
}
