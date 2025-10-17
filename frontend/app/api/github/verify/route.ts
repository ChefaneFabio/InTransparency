import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

interface GitHubCommit {
  sha: string
  commit: {
    author: {
      name: string
      email: string
      date: string
    }
    message: string
  }
  author: {
    login: string
  } | null
}

interface GitHubRepo {
  name: string
  description: string
  language: string
  created_at: string
  updated_at: string
  pushed_at: string
  size: number
  stargazers_count: number
  forks_count: number
  topics: string[]
}

// POST /api/github/verify - Verify GitHub repository and analyze commit history
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { projectId, githubUrl } = body

    if (!projectId || !githubUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Extract repo info from GitHub URL
    const repoMatch = githubUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/)
    if (!repoMatch) {
      return NextResponse.json({ error: 'Invalid GitHub URL' }, { status: 400 })
    }

    const [, owner, repo] = repoMatch
    const cleanRepo = repo.replace(/\.git$/, '')

    // Fetch repository data from GitHub API
    const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${cleanRepo}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'InTransparency-Verification'
      }
    })

    if (!repoResponse.ok) {
      if (repoResponse.status === 404) {
        return NextResponse.json({ error: 'Repository not found or is private' }, { status: 404 })
      }
      throw new Error(`GitHub API error: ${repoResponse.status}`)
    }

    const repoData: GitHubRepo = await repoResponse.json()

    // Fetch commit history
    const commitsResponse = await fetch(
      `https://api.github.com/repos/${owner}/${cleanRepo}/commits?per_page=100`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'InTransparency-Verification'
        }
      }
    )

    if (!commitsResponse.ok) {
      throw new Error(`Failed to fetch commits: ${commitsResponse.status}`)
    }

    const commits: GitHubCommit[] = await commitsResponse.json()

    // Get user's GitHub username from profile
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Analyze commit history
    const analysis = analyzeCommitHistory(commits, user.email)

    // Detect suspicious patterns
    const verification = {
      isVerified: analysis.suspiciousPatterns.length === 0 && analysis.userCommitCount > 0,
      totalCommits: commits.length,
      userCommits: analysis.userCommitCount,
      userCommitPercentage: (analysis.userCommitCount / commits.length) * 100,
      firstCommit: analysis.firstCommit,
      lastCommit: analysis.lastCommit,
      commitFrequency: analysis.commitFrequency,
      suspiciousPatterns: analysis.suspiciousPatterns,
      languages: [repoData.language].filter(Boolean),
      repoAge: Math.floor((Date.now() - new Date(repoData.created_at).getTime()) / (1000 * 60 * 60 * 24)),
      lastUpdated: repoData.pushed_at,
      stars: repoData.stargazers_count,
      forks: repoData.forks_count,
      topics: repoData.topics || []
    }

    // Get existing project data to preserve aiInsights
    const existingProject = await prisma.project.findUnique({
      where: { id: projectId },
      select: { aiInsights: true }
    })

    // Update project with verification data
    await prisma.project.update({
      where: { id: projectId },
      data: {
        githubUrl,
        // Merge verification data with existing aiInsights
        aiInsights: {
          ...(existingProject?.aiInsights as object || {}),
          githubVerification: {
            ...verification,
            verifiedAt: new Date().toISOString()
          }
        }
      }
    })

    // Track analytics
    await prisma.analytics.create({
      data: {
        userId,
        eventType: 'CUSTOM',
        eventName: 'github_verification_completed',
        properties: {
          projectId,
          verified: verification.isVerified,
          userCommitPercentage: verification.userCommitPercentage,
          totalCommits: verification.totalCommits
        }
      }
    })

    return NextResponse.json({
      success: true,
      verification
    })
  } catch (error) {
    console.error('GitHub verification error:', error)
    return NextResponse.json(
      { error: 'Failed to verify GitHub repository' },
      { status: 500 }
    )
  }
}

function analyzeCommitHistory(commits: GitHubCommit[], userEmail: string) {
  const userCommits = commits.filter(c =>
    c.commit.author.email.toLowerCase() === userEmail.toLowerCase() ||
    c.author?.login === userEmail.split('@')[0]
  )

  const suspiciousPatterns: string[] = []

  // Check for suspicious patterns
  if (commits.length > 0) {
    // All commits in one day
    const firstCommitDate = new Date(commits[commits.length - 1].commit.author.date)
    const lastCommitDate = new Date(commits[0].commit.author.date)
    const daysDiff = (lastCommitDate.getTime() - firstCommitDate.getTime()) / (1000 * 60 * 60 * 24)

    if (commits.length > 50 && daysDiff < 1) {
      suspiciousPatterns.push('All commits made in less than 24 hours (possible bulk import)')
    }

    // Very low user contribution
    const userPercentage = (userCommits.length / commits.length) * 100
    if (userPercentage < 10 && commits.length > 20) {
      suspiciousPatterns.push(`User contributed only ${userPercentage.toFixed(1)}% of commits`)
    }

    // No commits from user
    if (userCommits.length === 0) {
      suspiciousPatterns.push('No commits found from user email')
    }

    // Check for commit message patterns (copy-paste, generic messages)
    const genericMessages = commits.filter(c =>
      /^(update|fix|init|initial commit|.{1,5})$/i.test(c.commit.message.trim())
    )
    if (genericMessages.length > commits.length * 0.8) {
      suspiciousPatterns.push('Majority of commits have generic messages')
    }
  }

  // Calculate commit frequency
  const commitDates = commits.map(c => new Date(c.commit.author.date))
  const dateRange = Math.max(...commitDates.map(d => d.getTime())) - Math.min(...commitDates.map(d => d.getTime()))
  const dayRange = dateRange / (1000 * 60 * 60 * 24)
  const commitFrequency = dayRange > 0 ? commits.length / dayRange : commits.length

  return {
    userCommitCount: userCommits.length,
    firstCommit: commits.length > 0 ? commits[commits.length - 1].commit.author.date : null,
    lastCommit: commits.length > 0 ? commits[0].commit.author.date : null,
    commitFrequency: commitFrequency.toFixed(2),
    suspiciousPatterns
  }
}
