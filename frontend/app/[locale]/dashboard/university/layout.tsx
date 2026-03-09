import { DashboardNav } from '@/components/dashboard/shared/DashboardNav'

export default function UniversityDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="segment-university">
      <DashboardNav role="university" />
      {children}
    </div>
  )
}
