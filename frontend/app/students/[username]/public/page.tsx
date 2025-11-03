import { notFound } from 'next/navigation'
import { PublicPortfolio } from '@/components/portfolio/PublicPortfolio'

interface PageProps {
  params: {
    username: string
  }
}

async function fetchPublicPortfolio(username: string) {
  const apiUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  try {
    const response = await fetch(`${apiUrl}/api/students/${username}/public`, {
      cache: 'no-store' // Always fetch fresh data for public portfolios
    })

    if (!response.ok) {
      if (response.status === 404 || response.status === 403) {
        return null
      }
      throw new Error('Failed to fetch portfolio')
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching public portfolio:', error)
    return null
  }
}

export default async function PublicPortfolioPage({ params }: PageProps) {
  const { username } = params
  const userData = await fetchPublicPortfolio(username)

  if (!userData) {
    notFound()
  }

  return <PublicPortfolio user={userData} />
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps) {
  const { username } = params
  const userData = await fetchPublicPortfolio(username)

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
      url: `https://intransparency.com/students/${username}/public`,
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
