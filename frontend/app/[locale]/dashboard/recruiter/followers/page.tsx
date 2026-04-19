'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { Heart, User, MapPin, GraduationCap, MessageSquare, Sparkles, Eye, Search, AlertCircle } from 'lucide-react'
import { Link } from '@/navigation'

interface Follower {
  id: string
  userId: string
  name: string
  email: string | null
  photo: string | null
  university: string | null
  degree: string | null
  graduationYear: string | null
  location: string | null
  topSkills: string[]
  role: string | undefined
  followedAt: string
  daysSinceFollow: number
}

interface ApiResponse {
  followers: Follower[]
  total: number
  newThisWeek: number
  profile: {
    id: string
    companyName: string
    slug: string
    followerCount: number
    published: boolean
  } | null
}

export default function RecruiterFollowersPage() {
  const [data, setData] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/dashboard/recruiter/followers')
      .then(r => (r.ok ? r.json() : null))
      .then(setData)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="container max-w-5xl mx-auto py-8 px-4 space-y-3">
        <Skeleton className="h-24 w-full" />
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full" />
        ))}
      </div>
    )
  }

  if (!data) return null

  if (!data.profile) {
    return (
      <div className="container max-w-3xl mx-auto py-8 px-4">
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-5 pb-5 flex gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0" />
            <div>
              <h3 className="font-semibold mb-1">Set up your company profile first</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Students can only follow a company profile once you&apos;ve claimed and published it.
              </p>
              <Button size="sm" asChild>
                <Link href="/dashboard/recruiter/company-profile">Create company profile</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!data.profile.published) {
    return (
      <div className="container max-w-3xl mx-auto py-8 px-4">
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-5 pb-5 flex gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0" />
            <div>
              <h3 className="font-semibold mb-1">Your profile isn&apos;t published yet</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Publish your company profile so students can discover and follow you.
              </p>
              <Button size="sm" asChild>
                <Link href="/dashboard/recruiter/company-profile">Edit and publish</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const filtered = search
    ? data.followers.filter(f => {
        const q = search.toLowerCase()
        return (
          f.name.toLowerCase().includes(q) ||
          f.university?.toLowerCase().includes(q) ||
          f.degree?.toLowerCase().includes(q) ||
          f.topSkills.some(s => s.toLowerCase().includes(q))
        )
      })
    : data.followers

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-1 flex items-center gap-2">
          <Heart className="h-7 w-7 text-rose-500 fill-current" />
          Students following {data.profile.companyName}
        </h1>
        <p className="text-muted-foreground">
          Students who tapped <strong>Follow</strong> on your public profile. High-intent leads —
          these people already chose you before you chose them.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold">{data.total}</div>
            <div className="text-sm text-muted-foreground">Total followers</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-emerald-600">{data.newThisWeek}</div>
            <div className="text-sm text-muted-foreground">New this week</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <Button asChild variant="outline" size="sm" className="w-full">
              <a href={`/c/${data.profile.slug}`} target="_blank" rel="noreferrer">
                <Eye className="h-4 w-4 mr-1" />
                View public profile
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mb-4 relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Filter by name, university, degree, skill…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <Sparkles className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <h3 className="font-semibold mb-1">
              {data.followers.length === 0 ? 'No followers yet' : 'No matches for that filter'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {data.followers.length === 0
                ? 'Once students discover your profile at /discover, they can follow you and appear here.'
                : 'Try a different search term.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map(f => (
            <Card key={f.id}>
              <CardContent className="pt-4 pb-4">
                <div className="flex items-start gap-4">
                  {f.photo ? (
                    <img src={f.photo} alt="" className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      <User className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{f.name}</h3>
                      {f.daysSinceFollow < 7 && (
                        <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-300">
                          New
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-2">
                      {f.degree && (
                        <span className="flex items-center gap-1">
                          <GraduationCap className="h-3 w-3" />
                          {f.degree}
                        </span>
                      )}
                      {f.university && <span>{f.university}</span>}
                      {f.graduationYear && <span>Class of {f.graduationYear}</span>}
                      {f.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {f.location}
                        </span>
                      )}
                      <span>Followed {f.daysSinceFollow === 0 ? 'today' : `${f.daysSinceFollow}d ago`}</span>
                    </div>
                    {f.topSkills.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {f.topSkills.map(s => (
                          <Badge key={s} variant="secondary" className="text-xs">
                            {s}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/dashboard/recruiter/candidates?student=${f.userId}` as any}>
                        <Eye className="h-3 w-3 mr-1" />
                        View profile
                      </Link>
                    </Button>
                    {f.email && (
                      <Button size="sm" variant="outline" asChild>
                        <a href={`mailto:${f.email}`}>
                          <MessageSquare className="h-3 w-3 mr-1" />
                          Contact
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
