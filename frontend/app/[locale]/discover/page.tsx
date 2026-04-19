'use client'

import { useEffect, useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { BadgeCheck, MapPin, Heart, Search, Building2 } from 'lucide-react'
import { Link } from '@/navigation'

interface DirectoryProfile {
  id: string
  companyName: string
  slug: string
  logoUrl: string | null
  tagline: string | null
  industries: string[]
  sizeCategory: string | null
  headquarters: string | null
  verified: boolean
  followerCount: number
}

interface DirectoryResponse {
  profiles: DirectoryProfile[]
  filters: { industries: string[]; countries: string[] }
  total: number
}

export default function CompaniesDirectoryPage() {
  const [data, setData] = useState<DirectoryResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')
  const [industry, setIndustry] = useState('ALL')

  useEffect(() => {
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (industry !== 'ALL') params.set('industry', industry)
    const timer = setTimeout(() => {
      setLoading(true)
      fetch(`/api/companies/directory?${params}`)
        .then(r => (r.ok ? r.json() : null))
        .then(setData)
        .finally(() => setLoading(false))
    }, 250)
    return () => clearTimeout(timer)
  }, [q, industry])

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-6xl mx-auto px-4 pt-32 pb-16">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Building2 className="h-8 w-8 text-primary" />
            Discover companies
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Explore companies hiring entry-level talent across our institutional network. Every
            profile here is claimed by the employer and backed by verified hiring outcomes.
          </p>
        </div>

        <div className="grid md:grid-cols-[240px_1fr] gap-6">
          <aside className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase">
                Search
              </label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={q}
                  onChange={e => setQ(e.target.value)}
                  placeholder="Name or keyword"
                  className="pl-9"
                />
              </div>
            </div>

            {data?.filters?.industries && data.filters.industries.length > 0 && (
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase">
                  Industry
                </label>
                <div className="mt-2 space-y-1">
                  <button
                    className={`block w-full text-left text-sm px-2 py-1 rounded ${
                      industry === 'ALL' ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted'
                    }`}
                    onClick={() => setIndustry('ALL')}
                  >
                    All industries
                  </button>
                  {data.filters.industries.map(i => (
                    <button
                      key={i}
                      className={`block w-full text-left text-sm px-2 py-1 rounded ${
                        industry === i ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted'
                      }`}
                      onClick={() => setIndustry(i)}
                    >
                      {i}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </aside>

          <section>
            {loading ? (
              <div className="grid md:grid-cols-2 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-40 w-full" />
                ))}
              </div>
            ) : !data || data.profiles.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center py-12">
                  <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <h3 className="font-semibold mb-1">No companies match your filters</h3>
                  <p className="text-sm text-muted-foreground">
                    Try clearing filters or broadening your search.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                <p className="text-sm text-muted-foreground mb-4">
                  {data.total} {data.total === 1 ? 'company' : 'companies'}
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  {data.profiles.map(p => (
                    <Link key={p.id} href={`/c/${p.slug}` as any} className="block">
                      <Card className="hover:border-primary transition-colors h-full">
                        <CardContent className="pt-5 pb-5">
                          <div className="flex items-start gap-4">
                            {p.logoUrl ? (
                              <img
                                src={p.logoUrl}
                                alt=""
                                className="w-14 h-14 object-contain bg-white rounded border"
                              />
                            ) : (
                              <div className="w-14 h-14 bg-muted rounded border flex items-center justify-center">
                                <Building2 className="h-6 w-6 text-muted-foreground" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold truncate">{p.companyName}</h3>
                                {p.verified && (
                                  <BadgeCheck className="h-4 w-4 text-primary flex-shrink-0" />
                                )}
                              </div>
                              {p.tagline && (
                                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                  {p.tagline}
                                </p>
                              )}
                              <div className="flex flex-wrap gap-1 mb-2">
                                {p.industries.slice(0, 2).map(i => (
                                  <Badge key={i} variant="secondary" className="text-xs">
                                    {i}
                                  </Badge>
                                ))}
                              </div>
                              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                {p.headquarters && (
                                  <span className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {p.headquarters}
                                  </span>
                                )}
                                {p.sizeCategory && <span>{p.sizeCategory}</span>}
                                <span className="flex items-center gap-1">
                                  <Heart className="h-3 w-3" />
                                  {p.followerCount}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
