import { DashboardNav } from '@/components/dashboard/shared/DashboardNav'
import JourneyPanel from '@/components/journey/JourneyPanel'
import CommandPalette from '@/components/command-palette/CommandPalette'

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
      <CommandPalette role="recruiter" />
    </div>
  )
}
