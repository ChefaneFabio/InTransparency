import { DashboardNav } from '@/components/dashboard/shared/DashboardNav'

export default function InstitutionDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="segment-university">
      <DashboardNav role="institution" />
      {children}
    </div>
  )
}
