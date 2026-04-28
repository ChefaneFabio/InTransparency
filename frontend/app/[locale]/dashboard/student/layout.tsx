import { DashboardNav } from '@/components/dashboard/shared/DashboardNav'
import { EmailVerifyBanner } from '@/components/auth/EmailVerifyBanner'
import JourneyPanel from '@/components/journey/JourneyPanel'
import CommandPalette from '@/components/command-palette/CommandPalette'

export default function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <EmailVerifyBanner />
      <DashboardNav role="student" />
      {children}
      <JourneyPanel segment="student" />
      <CommandPalette role="student" />
    </>
  )
}
