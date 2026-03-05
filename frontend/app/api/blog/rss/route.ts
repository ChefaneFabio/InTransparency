import { NextRequest, NextResponse } from 'next/server'
import { getAllPosts, generateRssFeed } from '@/lib/blog'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const locale = searchParams.get('locale') || 'en'

  const posts = await getAllPosts(locale)
  const rssFeed = generateRssFeed(posts, locale)

  return new NextResponse(rssFeed, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
