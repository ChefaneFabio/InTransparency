import { notFound } from 'next/navigation'
import { PublicPortfolio } from '@/components/portfolio/PublicPortfolio'
import prisma from '@/lib/prisma'

interface PageProps {
  params: Promise<{
    username: string
    locale: string
  }>
}

async function getPublicPortfolio(username: string) {
  try {
    // Try username first, then fall back to ID
    const user = await prisma.user.findFirst({
      where: { OR: [{ username }, { id: username }] },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        photo: true,
        bio: true,
        university: true,
        degree: true,
        graduationYear: true,
        profilePublic: true,
        projects: {
          where: { isPublic: true },
          select: {
            id: true,
            title: true,
            description: true,
            courseCode: true,
            courseName: true,
            category: true,
            skills: true,
            technologies: true,
            videos: true,
            githubUrl: true,
            liveUrl: true,
            grade: true,
            createdAt: true,
            universityVerified: true,
            professor: true,
            endorsements: {
              select: {
                id: true,
                professorName: true,
                professorTitle: true,
                endorsementText: true,
                createdAt: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!user || !user.profilePublic) {
      return null
    }

    const projectsCount = user.projects.length
    const verifiedProjectsCount = user.projects.filter(
      (p) => p.universityVerified || (p.endorsements && p.endorsements.length > 0)
    ).length
    const verificationScore = projectsCount > 0
      ? Math.round((verifiedProjectsCount / projectsCount) * 100)
      : 0

    const allSkills = new Set<string>()
    user.projects.forEach(project => {
      if (project.skills && Array.isArray(project.skills)) {
        project.skills.forEach(skill => allSkills.add(skill as string))
      }
      if (project.technologies && Array.isArray(project.technologies)) {
        project.technologies.forEach(tech => allSkills.add(tech as string))
      }
    })

    return {
      id: user.id,
      username: user.username ?? '',
      firstName: user.firstName ?? '',
      lastName: user.lastName ?? '',
      photo: user.photo ?? undefined,
      bio: user.bio ?? undefined,
      university: user.university ?? '',
      degree: user.degree ?? '',
      graduationYear: parseInt(String(user.graduationYear || '0'), 10),
      projects: user.projects,
      stats: {
        projectsCount,
        verifiedProjectsCount,
        verificationScore,
        skillsCount: allSkills.size
      }
    }
  } catch (error) {
    console.error('Error fetching public portfolio:', error)
    return null
  }
}

export default async function PublicPortfolioPage(props: PageProps) {
  const { username } = await props.params
  const userData = await getPublicPortfolio(username)

  if (!userData) {
    return notFound()
  }

  // Serialize to plain JSON to cross RSC → client boundary cleanly
  const serialized = JSON.parse(JSON.stringify(userData))

  return <PublicPortfolio user={serialized} />
}

export async function generateMetadata(props: PageProps) {
  const { username } = await props.params
  const userData = await getPublicPortfolio(username)

  if (!userData) {
    return {
      title: 'Portfolio Not Found | InTransparency',
      description: 'This portfolio is not available'
    }
  }

  const title = `${userData.firstName} ${userData.lastName} - ${userData.degree} @ ${userData.university}`
  const description = `Verified portfolio of ${userData.firstName} ${userData.lastName}. ${userData.stats.projectsCount} verified projects with ${userData.stats.verificationScore}% verification score. ${userData.bio || ''}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'profile',
      url: `https://in-transparency.com/students/${username}/public`,
      images: userData.photo ? [userData.photo] : []
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: userData.photo ? [userData.photo] : []
    }
  }
}
