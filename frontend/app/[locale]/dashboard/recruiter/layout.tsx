import { DashboardNav } from '@/components/dashboard/shared/DashboardNav'
import JourneyPanel from '@/components/journey/JourneyPanel'
import HelpButton from '@/components/help/HelpButton'

export default function RecruiterDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="segment-recruiter">
      <DashboardNav role="recruiter" />
      {children}
      <JourneyPanel segment="recruiter" />
      <HelpButton segment="recruiter" />
    </div>
  )
}
