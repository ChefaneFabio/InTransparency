import { getPostBySlug, getPostSlugs } from '@/lib/blog'
import { Link } from '@/navigation'
import { getTranslations } from 'next-intl/server'
import { CalendarDays, Clock, ArrowLeft, User } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string; locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params
  const post = await getPostBySlug(slug, locale)
  if (!post) return {}

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
    },
  }
}

export async function generateStaticParams() {
  const locales = ['en', 'it']
  const params: Array<{ slug: string; locale: string }> = []

  for (let i = 0; i < locales.length; i++) {
    const locale = locales[i]
    const slugs = getPostSlugs(locale)
    for (let j = 0; j < slugs.length; j++) {
      params.push({ slug: slugs[j], locale })
    }
  }

  return params
}

export default async function BlogPostPage({ params }: Props) {
  const { slug, locale } = await params
  const post = await getPostBySlug(slug, locale)
  const t = await getTranslations('blog')

  if (!post) {
    notFound()
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        <article className="container max-w-3xl py-16 md:py-24">
          {/* Back Link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('backToBlog')}
          </Link>

          {/* Post Header */}
          <header className="mb-10">
            <div className="flex flex-wrap items-center gap-3 mb-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <CalendarDays className="h-4 w-4" />
                {new Date(post.date).toLocaleDateString(locale, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {post.readingTime}
              </span>
              <span className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {post.author}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4">
              {post.title}
            </h1>

            <p className="text-lg text-muted-foreground">
              {post.description}
            </p>

            <div className="flex flex-wrap gap-2 mt-6">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </header>

          {/* Blog Content */}
          <div
            className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-display prose-headings:font-bold prose-a:text-primary prose-img:rounded-xl"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />

          {/* Footer */}
          <div className="mt-16 pt-8 border-t">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
            >
              <ArrowLeft className="h-4 w-4" />
              {t('backToBlog')}
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </>
  )
}
