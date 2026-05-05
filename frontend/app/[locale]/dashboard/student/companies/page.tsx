'use client'

import { useEffect, useMemo, useState } from 'react'
import { useLocale } from 'next-intl'
import { Link } from '@/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Building2, Search, Users, ShieldCheck } from 'lucide-react'

interface CompanyProfile {
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
  profiles: CompanyProfile[]
  filters: { industries: string[]; countries: string[] }
  total: number
}

export default function StudentCompaniesPage() {
  const locale = useLocale()
  const isIt = locale === 'it'
  const [data, setData] = useState<DirectoryResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [q, setQ] = useState('')
  const [industry, setIndustry] = useState<string>('ALL')
  const [country, setCountry] = useState<string>('ALL')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    const params = new URLSearchParams()
    if (q.trim()) params.set('q', q.trim())
    if (industry !== 'ALL') params.set('industry', industry)
    if (country !== 'ALL') params.set('country', country)

    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/companies/directory?${params.toString()}`)
        if (!res.ok) throw new Error(`status ${res.status}`)
        const json = (await res.json()) as DirectoryResponse
        if (!cancelled) setData(json)
      } catch (err) {
        if (!cancelled) setError(isIt ? 'Errore nel caricamento delle aziende.' : 'Failed to load companies.')
        console.error('[student/companies] fetch failed', err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }, 250)

    return () => {
      cancelled = true
      clearTimeout(t)
    }
  }, [q, industry, country, isIt])

  const profiles = data?.profiles ?? []
  const industries = useMemo(() => data?.filters.industries ?? [], [data])
  const countries = useMemo(() => data?.filters.countries ?? [], [data])

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/student">
            <ArrowLeft className="h-4 w-4 mr-1" /> {isIt ? 'Indietro' : 'Back'}
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold">{isIt ? 'Aziende' : 'Companies'}</h1>
          <p className="text-sm text-muted-foreground">
            {isIt
              ? 'Esplora le aziende presenti su InTransparency. Segui quelle che ti interessano per ricevere aggiornamenti.'
              : 'Explore companies on InTransparency. Follow the ones you care about to get updates.'}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={isIt ? 'Cerca per nome, tagline…' : 'Search by name, tagline…'}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={industry} onValueChange={setIndustry}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder={isIt ? 'Settore' : 'Industry'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">{isIt ? 'Tutti i settori' : 'All industries'}</SelectItem>
            {industries.map((i) => (
              <SelectItem key={i} value={i}>
                {i}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={country} onValueChange={setCountry}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder={isIt ? 'Paese' : 'Country'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">{isIt ? 'Tutti i paesi' : 'All countries'}</SelectItem>
            {countries.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6 text-sm text-red-700">{error}</CardContent>
        </Card>
      )}

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : profiles.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <Building2 className="mx-auto mb-3 h-8 w-8 opacity-50" />
            <p>{isIt ? 'Nessuna azienda corrisponde ai filtri.' : 'No companies match these filters.'}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {profiles.map((p) => (
            <Link
              key={p.id}
              href={`/companies/${p.slug}`}
              className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg"
            >
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    {p.logoUrl ? (
                      <Image
                        src={p.logoUrl}
                        alt=""
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-md object-contain bg-muted"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted text-muted-foreground">
                        <Building2 className="h-5 w-5" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <h3 className="truncate font-medium">{p.companyName}</h3>
                        {p.verified && (
                          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" aria-label={isIt ? 'Verificata' : 'Verified'} />
                        )}
                      </div>
                      {p.headquarters && (
                        <p className="text-xs text-muted-foreground truncate">{p.headquarters}</p>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 space-y-3">
                  {p.tagline && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{p.tagline}</p>
                  )}
                  {p.industries.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {p.industries.slice(0, 3).map((i) => (
                        <Badge key={i} variant="secondary" className="text-[11px] font-normal">
                          {i}
                        </Badge>
                      ))}
                    </div>
                  )}
                  {p.followerCount > 0 && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Users className="h-3.5 w-3.5" />
                      <span>
                        {p.followerCount} {isIt ? 'follower' : 'followers'}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
