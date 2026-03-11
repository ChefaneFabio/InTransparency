import { DashboardNav } from '@/components/dashboard/shared/DashboardNav'

export default function TechParkDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="segment-university">
      <DashboardNav role="techpark" />
      {children}
    </div>
  )
}
