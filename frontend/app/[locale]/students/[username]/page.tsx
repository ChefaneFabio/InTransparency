import { redirect, notFound } from 'next/navigation'
import prisma from '@/lib/prisma'

interface PageProps {
  params: Promise<{
    username: string
    locale: string
  }>
}

export default async function StudentRedirectPage({ params }: PageProps) {
  const { username, locale } = await params

  // Try finding by username first, then by ID
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { username },
        { id: username },
      ],
    },
    select: { username: true },
  })

  if (!user?.username) {
    notFound()
  }

  redirect(`/${locale}/students/${user.username}/public`)
}
