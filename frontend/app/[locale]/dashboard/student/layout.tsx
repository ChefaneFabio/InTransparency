import { DashboardNav } from '@/components/dashboard/shared/DashboardNav'
import JourneyPanel from '@/components/journey/JourneyPanel'

export default function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <DashboardNav role="student" />
      {children}
      <JourneyPanel segment="student" />
    </>
  )
}
