import { DashboardNav } from '@/components/dashboard/shared/DashboardNav'

export default function ProfessorDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="segment-professor">
      <DashboardNav role="professor" />
      {children}
    </div>
  )
}
