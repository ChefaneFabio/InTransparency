import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { DashboardNav } from '@/components/dashboard/shared/DashboardNav'
import { InstitutionProvider } from '@/lib/institution-context'
import JourneyPanel from '@/components/journey/JourneyPanel'
import CommandPalette from '@/components/command-palette/CommandPalette'

export default async function UniversityDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let institutionType = 'university'

  try {
    const session = await getServerSession(authOptions)
    if (session?.user?.id) {
      const settings = await prisma.universitySettings.findUnique({
        where: { userId: session.user.id },
        select: { institutionType: true },
      })
      if (settings?.institutionType) {
        institutionType = settings.institutionType
      }
    }
  } catch {
    // Fall back to default
  }

  return (
    <div className="segment-university">
      <DashboardNav role="university" institutionType={institutionType} />
      <InstitutionProvider type={institutionType}>
        {children}
        <JourneyPanel segment="institution" />
        <CommandPalette role="institution" />
      </InstitutionProvider>
    </div>
  )
}
