'use client'

import { useState, useEffect, useCallback } from 'react'
import { useLocale } from 'next-intl'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Building2, MapPin, Clock, Users, Calendar, Search, Wifi, WifiOff } from 'lucide-react'

interface PCTOOpportunity {
  id: string
  companyName: string
  title: string
  description: string
  activityType: string
  location: string | null
  isRemote: boolean
  hoursOffered: number
  maxStudents: number
  requiredSkills: string[]
  startDate: string | null
  endDate: string | null
  applicationDeadline: string | null
  status: string
}

export default function PCTOMarketplacePage() {
  const locale = useLocale()
  const isIt = locale === 'it'
  const [opportunities, setOpportunities] = useState<PCTOOpportunity[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Filters
  const [activityType, setActivityType] = useState('')
  const [isRemote, setIsRemote] = useState('')
  const [locationSearch, setLocationSearch] = useState('')

  // Interest dialog
  const [selectedOpp, setSelectedOpp] = useState<PCTOOpportunity | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const fetchOpportunities = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('page', String(page))
      if (activityType) params.set('activityType', activityType)
      if (isRemote) params.set('isRemote', isRemote)
      if (locationSearch) params.set('location', locationSearch)

      const res = await fetch(`/api/dashboard/university/pcto/marketplace?${params.toString()}`)
      const data = await res.json()
      setOpportunities(data.opportunities || [])
      setTotal(data.total || 0)
      setTotalPages(data.totalPages || 1)
    } catch (err) {
      console.error('Failed to fetch PCTO opportunities:', err)
    } finally {
      setLoading(false)
    }
  }, [page, activityType, isRemote, locationSearch])

  useEffect(() => {
    fetchOpportunities()
  }, [fetchOpportunities])

  const handleExpressInterest = async (opp: PCTOOpportunity) => {
    setSubmitting(true)
    try {
      const res = await fetch('/api/dashboard/university/pcto/marketplace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          opportunityId: opp.id,
          studentIds: ['placeholder'],
          message: isIt ? `Interesse per: ${opp.title}` : `Interest in: ${opp.title}`,
        }),
      })
      if (res.ok) {
        setSelectedOpp(null)
        alert(isIt ? 'Interesse inviato con successo!' : 'Interest sent successfully!')
      }
    } catch (err) {
      console.error('Failed to express interest:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const activityTypeLabels: Record<string, string> = {
    stage: isIt ? 'Stage' : 'Internship',
    project: isIt ? 'Progetto' : 'Project',
    workshop: 'Workshop',
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString(locale)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{isIt ? 'Marketplace PCTO' : 'PCTO Marketplace'}</h1>
        <p className="text-muted-foreground mt-1">
          {isIt ? 'Esplora le opportunità PCTO offerte dalle aziende partner' : 'Explore PCTO opportunities offered by partner companies'}
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={isIt ? 'Cerca per località...' : 'Search by location...'}
                value={locationSearch}
                onChange={(e) => { setLocationSearch(e.target.value); setPage(1) }}
              />
            </div>
            <Select value={activityType} onValueChange={(v) => { setActivityType(v === 'all' ? '' : v); setPage(1) }}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={isIt ? 'Tipo attività' : 'Activity type'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{isIt ? 'Tutti i tipi' : 'All types'}</SelectItem>
                <SelectItem value="stage">{isIt ? 'Stage' : 'Internship'}</SelectItem>
                <SelectItem value="project">{isIt ? 'Progetto' : 'Project'}</SelectItem>
                <SelectItem value="workshop">Workshop</SelectItem>
              </SelectContent>
            </Select>
            <Select value={isRemote} onValueChange={(v) => { setIsRemote(v === 'all' ? '' : v); setPage(1) }}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={isIt ? 'Modalità' : 'Mode'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{isIt ? 'Tutte le modalità' : 'All modes'}</SelectItem>
                <SelectItem value="true">{isIt ? 'Da remoto' : 'Remote'}</SelectItem>
                <SelectItem value="false">{isIt ? 'In sede' : 'On-site'}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">{total} {isIt ? 'opportunità trovate' : 'opportunities found'}</p>

      {/* Opportunity Cards */}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-xl" />
          ))}
        </div>
      ) : opportunities.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">{isIt ? 'Nessuna opportunità PCTO disponibile al momento.' : 'No PCTO opportunities available at the moment.'}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {opportunities.map((opp) => (
            <Card key={opp.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{opp.title}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <Building2 className="h-3.5 w-3.5" />
                      {opp.companyName}
                    </CardDescription>
                  </div>
                  <Badge variant={opp.activityType === 'stage' ? 'default' : opp.activityType === 'project' ? 'secondary' : 'outline'}>
                    {activityTypeLabels[opp.activityType] || opp.activityType}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between gap-4">
                <p className="text-sm text-muted-foreground line-clamp-3">{opp.description}</p>

                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" /> {opp.hoursOffered} {isIt ? 'ore' : 'hours'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" /> {isIt ? 'Max' : 'Max'} {opp.maxStudents} {isIt ? 'studenti' : 'students'}
                    </span>
                    {opp.isRemote ? (
                      <span className="flex items-center gap-1">
                        <Wifi className="h-3.5 w-3.5" /> {isIt ? 'Da remoto' : 'Remote'}
                      </span>
                    ) : opp.location ? (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" /> {opp.location}
                      </span>
                    ) : null}
                    {opp.applicationDeadline && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" /> {isIt ? 'Scadenza:' : 'Deadline:'} {formatDate(opp.applicationDeadline)}
                      </span>
                    )}
                  </div>

                  {opp.requiredSkills.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {opp.requiredSkills.map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <Button
                  onClick={() => handleExpressInterest(opp)}
                  disabled={submitting}
                  className="w-full"
                >
                  {isIt ? 'Proponi Studenti' : 'Propose Students'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
            {isIt ? 'Precedente' : 'Previous'}
          </Button>
          <span className="flex items-center text-sm text-muted-foreground">
            {isIt ? `Pagina ${page} di ${totalPages}` : `Page ${page} of ${totalPages}`}
          </span>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
            {isIt ? 'Successiva' : 'Next'}
          </Button>
        </div>
      )}
    </div>
  )
}
