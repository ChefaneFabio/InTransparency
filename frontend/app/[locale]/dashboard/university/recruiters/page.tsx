'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Search,
  Building2,
  Users,
  Mail,
  Phone,
  MapPin,
  Star,
  TrendingUp,
  Briefcase
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface Recruiter {
  id: string
  companyName: string
  companyLogo?: string
  contactName: string
  contactEmail: string
  contactPhone?: string
  location: string
  industry: string
  studentsHired: number
  studentsContacted: number
  avgSalaryOffered: number
  isPartner: boolean
  lastActivity: string
  status: 'active' | 'inactive'
}

interface RecruitersStats {
  total: number
  partners: number
  totalHired: number
  activeThisMonth: number
}

function formatRelativeTime(isoDate: string): string {
  const now = new Date()
  const date = new Date(isoDate)
  const diffMs = now.getTime() - date.getTime()
  const diffSeconds = Math.floor(diffMs / 1000)
  const diffMinutes = Math.floor(diffSeconds / 60)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)
  const diffWeeks = Math.floor(diffDays / 7)
  const diffMonths = Math.floor(diffDays / 30)

  if (diffMinutes < 1) return 'adesso'
  if (diffMinutes < 60) return `${diffMinutes} minut${diffMinutes === 1 ? 'o' : 'i'} fa`
  if (diffHours < 24) return `${diffHours} or${diffHours === 1 ? 'a' : 'e'} fa`
  if (diffDays < 7) return `${diffDays} giorn${diffDays === 1 ? 'o' : 'i'} fa`
  if (diffWeeks < 5) return `${diffWeeks} settiman${diffWeeks === 1 ? 'a' : 'e'} fa`
  return `${diffMonths} mes${diffMonths === 1 ? 'e' : 'i'} fa`
}

function StatsLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-7 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function GridLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
              <Skeleton className="h-5 w-14 rounded-full" />
            </div>
            <div className="space-y-2 mb-4">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-4 w-28" />
            </div>
            <div className="flex items-center justify-between pt-4 border-t">
              <Skeleton className="h-10 w-16" />
              <Skeleton className="h-10 w-16" />
              <Skeleton className="h-10 w-16" />
            </div>
            <Skeleton className="h-3 w-40 mt-4" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function UniversityRecruitersPage() {
  const [recruiters, setRecruiters] = useState<Recruiter[]>([])
  const [stats, setStats] = useState<RecruitersStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [industryFilter, setIndustryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedRecruiter, setSelectedRecruiter] = useState<Recruiter | null>(null)

  useEffect(() => {
    async function fetchRecruiters() {
      try {
        const res = await fetch('/api/dashboard/university/recruiters')
        if (!res.ok) throw new Error('Failed to fetch recruiters')
        const data = await res.json()
        setRecruiters(data.recruiters)
        setStats(data.stats)
      } catch (error) {
        console.error('Error fetching recruiters:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchRecruiters()
  }, [])

  const filteredRecruiters = recruiters.filter(r => {
    const matchesSearch = r.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         r.contactName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesIndustry = industryFilter === 'all' || r.industry === industryFilter
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter
    return matchesSearch && matchesIndustry && matchesStatus
  })

  const industries = Array.from(new Set(recruiters.map(r => r.industry)))

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/50 via-white to-slate-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Recruiter</h1>
            <p className="text-muted-foreground">Gestisci le relazioni con le aziende</p>
          </div>
          <Button>
            <Building2 className="h-4 w-4 mr-2" />
            Invita Azienda
          </Button>
        </div>

        {/* Stats */}
        {loading || !stats ? (
          <StatsLoadingSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.total}</p>
                    <p className="text-sm text-muted-foreground">Aziende Totali</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Star className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.partners}</p>
                    <p className="text-sm text-muted-foreground">Partner Ufficiali</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Users className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.totalHired}</p>
                    <p className="text-sm text-muted-foreground">Studenti Assunti</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.activeThisMonth}</p>
                    <p className="text-sm text-muted-foreground">Attivi Questo Mese</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
            <Input
              placeholder="Cerca azienda o contatto..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={industryFilter} onValueChange={setIndustryFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Settore" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tutti i settori</SelectItem>
              {industries.map(industry => (
                <SelectItem key={industry} value={industry}>{industry}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Stato" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tutti</SelectItem>
              <SelectItem value="active">Attivi</SelectItem>
              <SelectItem value="inactive">Inattivi</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Recruiters Grid */}
        {loading ? (
          <GridLoadingSkeleton />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRecruiters.map((recruiter) => (
                <Card
                  key={recruiter.id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedRecruiter(recruiter)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={recruiter.companyLogo} />
                          <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                            {recruiter.companyName.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-foreground">{recruiter.companyName}</h3>
                            {recruiter.isPartner && (
                              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{recruiter.industry}</p>
                        </div>
                      </div>
                      <Badge
                        variant={recruiter.status === 'active' ? 'default' : 'secondary'}
                        className={recruiter.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                      >
                        {recruiter.status === 'active' ? 'Attivo' : 'Inattivo'}
                      </Badge>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{recruiter.contactName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{recruiter.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="text-center">
                        <p className="text-lg font-bold text-foreground">{recruiter.studentsHired}</p>
                        <p className="text-xs text-muted-foreground">Assunti</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-foreground">{recruiter.studentsContacted}</p>
                        <p className="text-xs text-muted-foreground">Contattati</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-foreground">{"€"}{(recruiter.avgSalaryOffered / 1000).toFixed(0)}k</p>
                        <p className="text-xs text-muted-foreground">RAL Media</p>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground mt-4">
                      Ultima attività: {formatRelativeTime(recruiter.lastActivity)}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredRecruiters.length === 0 && (
              <Card className="p-8 text-center">
                <Building2 className="h-12 w-12 text-muted-foreground/60 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Nessun recruiter trovato
                </h3>
                <p className="text-muted-foreground">
                  Prova a modificare i filtri di ricerca
                </p>
              </Card>
            )}
          </>
        )}

        {/* Recruiter Detail Dialog */}
        <Dialog open={!!selectedRecruiter} onOpenChange={() => setSelectedRecruiter(null)}>
          <DialogContent className="max-w-lg">
            {selectedRecruiter && (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={selectedRecruiter.companyLogo} />
                      <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold text-xl">
                        {selectedRecruiter.companyName.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <DialogTitle className="flex items-center gap-2">
                        {selectedRecruiter.companyName}
                        {selectedRecruiter.isPartner && (
                          <Badge className="bg-yellow-100 text-yellow-800">Partner</Badge>
                        )}
                      </DialogTitle>
                      <DialogDescription>{selectedRecruiter.industry}</DialogDescription>
                    </div>
                  </div>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-foreground">{selectedRecruiter.studentsHired}</p>
                      <p className="text-sm text-muted-foreground">Assunti</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-foreground">{selectedRecruiter.studentsContacted}</p>
                      <p className="text-sm text-muted-foreground">Contattati</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-foreground">{"€"}{selectedRecruiter.avgSalaryOffered.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">RAL Media</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium text-foreground">Contatto</h4>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{selectedRecruiter.contactName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <a href={`mailto:${selectedRecruiter.contactEmail}`} className="text-primary hover:underline">
                        {selectedRecruiter.contactEmail}
                      </a>
                    </div>
                    {selectedRecruiter.contactPhone && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span>{selectedRecruiter.contactPhone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{selectedRecruiter.location}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1">
                    <Mail className="h-4 w-4 mr-2" />
                    Contatta
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Briefcase className="h-4 w-4 mr-2" />
                    Vedi Posizioni
                  </Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
