import { getAllPosts, BlogPostMeta } from '@/lib/blog'
import { Link } from '@/navigation'
import { getLocale, getTranslations } from 'next-intl/server'
import { CalendarDays, Clock, ArrowRight, Tag, Rss } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BRAND_IMAGES } from '@/lib/brand-images'

export default async function BlogPage() {
  const locale = await getLocale()
  const t = await getTranslations('blog')
  const posts = await getAllPosts(locale)

  const featuredPost = posts.find((p) => p.featured)
  const regularPosts = posts.filter((p) => p !== featuredPost)

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        {/* Hero */}
        <section className="container py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t('title')}
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              {t('subtitle')}
            </p>
            <a
              href="/api/blog/rss"
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <Rss className="h-4 w-4" />
              {t('rssSubscribe')}
            </a>
          </div>

          {/* Hero image */}
          <div className="max-w-4xl mx-auto mb-12">
            <img
              src={BRAND_IMAGES.forStudents.presenting}
              alt="InTransparency blog"
              className="w-full h-[220px] sm:h-[280px] object-cover rounded-2xl shadow-lg"
            />
          </div>

          {/* Featured Post */}
          {featuredPost && (
            <Link href={`/blog/${featuredPost.slug}`} className="block mb-16">
              <article className="group relative bg-card border-2 border-primary/20 rounded-2xl p-8 md:p-12 hover:border-primary/40 transition-all hover:shadow-xl">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full">
                    {t('featured')}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <CalendarDays className="h-3 w-3" />
                    {new Date(featuredPost.date).toLocaleDateString(locale, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {featuredPost.readingTime}
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-primary transition-colors">
                  {featuredPost.title}
                </h2>
                <p className="text-muted-foreground mb-4 max-w-2xl">
                  {featuredPost.description}
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex gap-2">
                    {featuredPost.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="text-primary text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                    {t('readMore')} <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </article>
            </Link>
          )}

          {/* Posts Grid */}
          {regularPosts.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularPosts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
                  <article className="bg-card border rounded-xl p-6 h-full hover:shadow-lg hover:border-primary/30 transition-all">
                    <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
                      <CalendarDays className="h-3 w-3" />
                      {new Date(post.date).toLocaleDateString(locale, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                      <span className="mx-1">·</span>
                      <Clock className="h-3 w-3" />
                      {post.readingTime}
                    </div>
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {post.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}

          {posts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">{t('noPosts')}</p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  )
}
