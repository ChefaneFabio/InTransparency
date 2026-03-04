import { DashboardNav } from '@/components/dashboard/shared/DashboardNav'

export default function ProfessorDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <DashboardNav role="professor" />
      {children}
    </>
  )
}
