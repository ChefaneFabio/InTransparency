'use client'

import { useEffect, useState, use } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { BadgeCheck, Heart, MapPin, Globe, Briefcase, Users, Calendar } from 'lucide-react'

interface CompanyProfile {
  id: string
  companyName: string
  slug: string
  logoUrl: string | null
  coverUrl: string | null
  tagline: string | null
  description: string | null
  foundedYear: number | null
  headquarters: string | null
  industries: string[]
  sizeCategory: string | null
  websiteUrl: string | null
  linkedinUrl: string | null
  mission: string | null
  vision: string | null
  values: Array<{ title: string; description?: string }> | null
  cultureTags: string[]
  countries: string[]
  officeLocations: Array<{ city: string; country: string; headcount?: number }> | null
  heroVideoUrl: string | null
  gallery: Array<{ url: string; caption?: string; type: 'image' | 'video' }> | null
  faqs: Array<{ question: string; answer: string }> | null
  verified: boolean
  followerCount: number
}

export default function CompanyDiscoveryPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>
}) {
  const { slug } = use(params)
  const [profile, setProfile] = useState<CompanyProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [following, setFollowing] = useState(false)
  const [followerCount, setFollowerCount] = useState(0)

  useEffect(() => {
    fetch(`/api/companies/profile?slug=${slug}`)
      .then(r => (r.ok ? r.json() : null))
      .then(data => {
        if (data?.profile) {
          setProfile(data.profile)
          setFollowerCount(data.profile.followerCount ?? 0)
        }
      })
      .finally(() => setLoading(false))
  }, [slug])

  const toggleFollow = async () => {
    const method = following ? 'DELETE' : 'POST'
    const res = await fetch(`/api/companies/${slug}/follow`, { method })
    if (res.ok) {
      const data = await res.json()
      setFollowing(data.following)
      setFollowerCount(data.followerCount)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container max-w-5xl mx-auto px-4 pt-32 pb-16">
          <Skeleton className="h-64 w-full mb-6" />
          <Skeleton className="h-96 w-full" />
        </main>
        <Footer />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container max-w-3xl mx-auto px-4 pt-32 pb-16">
          <Card>
            <CardContent className="pt-6 text-center">
              <h1 className="text-2xl font-bold mb-2">Company not found</h1>
              <p className="text-muted-foreground">
                This profile is either unpublished or doesn&apos;t exist.
              </p>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {profile.coverUrl && (
          <div className="h-64 bg-cover bg-center" style={{ backgroundImage: `url(${profile.coverUrl})` }} />
        )}
        <div className="container max-w-5xl mx-auto px-4 -mt-20 relative">
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row md:items-end gap-6">
                {profile.logoUrl && (
                  <img
                    src={profile.logoUrl}
                    alt={profile.companyName}
                    className="w-32 h-32 object-contain bg-white rounded-lg border shadow-sm"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-3xl font-bold">{profile.companyName}</h1>
                    {profile.verified && <BadgeCheck className="h-6 w-6 text-primary" />}
                  </div>
                  {profile.tagline && (
                    <p className="text-lg text-muted-foreground mb-3">{profile.tagline}</p>
                  )}
                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                    {profile.headquarters && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {profile.headquarters}
                      </div>
                    )}
                    {profile.sizeCategory && (
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {profile.sizeCategory} employees
                      </div>
                    )}
                    {profile.foundedYear && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Founded {profile.foundedYear}
                      </div>
                    )}
                    {profile.websiteUrl && (
                      <a
                        href={profile.websiteUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-primary hover:underline"
                      >
                        <Globe className="h-4 w-4" />
                        Website
                      </a>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <Button onClick={toggleFollow} variant={following ? 'outline' : 'default'}>
                    <Heart className={`h-4 w-4 mr-2 ${following ? 'fill-current' : ''}`} />
                    {following ? 'Following' : 'Follow'}
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    {followerCount} follower{followerCount !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              {profile.industries.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {profile.industries.map(i => (
                    <Badge key={i} variant="secondary">
                      <Briefcase className="h-3 w-3 mr-1" />
                      {i}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {profile.description && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line text-muted-foreground">{profile.description}</p>
              </CardContent>
            </Card>
          )}

          {(profile.mission || profile.vision) && (
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {profile.mission && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Mission</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground whitespace-pre-line">{profile.mission}</p>
                  </CardContent>
                </Card>
              )}
              {profile.vision && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Vision</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground whitespace-pre-line">{profile.vision}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {profile.values && profile.values.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Values</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                {profile.values.map((v, idx) => (
                  <div key={idx}>
                    <h3 className="font-semibold mb-1">{v.title}</h3>
                    {v.description && (
                      <p className="text-sm text-muted-foreground">{v.description}</p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {profile.officeLocations && profile.officeLocations.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Offices</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {profile.officeLocations.map((o, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      {o.city}, {o.country}
                    </div>
                    {o.headcount && (
                      <span className="text-muted-foreground">{o.headcount} people</span>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {profile.faqs && profile.faqs.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Frequently asked</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile.faqs.map((f, idx) => (
                  <div key={idx} className="border-b last:border-0 pb-4 last:pb-0">
                    <h3 className="font-semibold mb-1">{f.question}</h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">{f.answer}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {profile.heroVideoUrl && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>See the company</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video">
                  <iframe
                    src={profile.heroVideoUrl}
                    className="w-full h-full rounded"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
