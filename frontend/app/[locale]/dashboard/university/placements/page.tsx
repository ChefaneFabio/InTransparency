'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Search,
  Download,
  TrendingUp,
  Briefcase,
  DollarSign,
  Building2,
  MapPin,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Placement {
  id: string
  studentName: string
  studentId: string
  department: string
  company: string
  position: string
  salary: number
  salaryCurrency: string
  salaryPeriod: string
  location: string
  startDate: string
  endDate: string | null
  status: 'confirmed' | 'pending' | 'declined'
  type: 'full-time' | 'internship' | 'part-time'
}

interface PlacementStats {
  confirmed: number
  pending: number
  avgSalary: number
  placementRate: number
}

const currencySymbols: Record<string, string> = {
  EUR: '\u20AC',
  USD: '$',
  GBP: '\u00A3',
  CHF: 'CHF ',
}

function getCurrencySymbol(code: string): string {
  return currencySymbols[code] || code + ' '
}

export default function UniversityPlacementsPage() {
  const [placements, setPlacements] = useState<Placement[]>([])
  const [stats, setStats] = useState<PlacementStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  const fetchPlacements = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.set('search', searchQuery)
      if (statusFilter && statusFilter !== 'all') params.set('status', statusFilter)
      if (typeFilter && typeFilter !== 'all') params.set('type', typeFilter)

      const qs = params.toString()
      const url = `/api/dashboard/university/placements${qs ? `?${qs}` : ''}`
      const res = await fetch(url)

      if (!res.ok) {
        console.error('Failed to fetch placements:', res.status)
        setPlacements([])
        setStats(null)
        return
      }

      const data = await res.json()
      setPlacements(data.placements ?? [])
      setStats(data.stats ?? null)
    } catch (err) {
      console.error('Error fetching placements:', err)
      setPlacements([])
      setStats(null)
    } finally {
      setLoading(false)
    }
  }, [searchQuery, statusFilter, typeFilter])

  useEffect(() => {
    fetchPlacements()
  }, [fetchPlacements])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Confermato</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />In Attesa</Badge>
      case 'declined':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Rifiutato</Badge>
      default:
        return null
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'full-time':
        return <Badge variant="outline">Full-time</Badge>
      case 'internship':
        return <Badge variant="outline" className="border-purple-300 text-purple-700">Stage</Badge>
      case 'part-time':
        return <Badge variant="outline" className="border-blue-300 text-blue-700">Part-time</Badge>
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Placement</h1>
            <p className="text-gray-600">Monitora i placement degli studenti</p>
          </div>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Esporta Report
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  {loading ? (
                    <>
                      <Skeleton className="h-7 w-12 mb-1" />
                      <Skeleton className="h-4 w-20" />
                    </>
                  ) : (
                    <>
                      <p className="text-2xl font-bold">{stats?.confirmed ?? 0}</p>
                      <p className="text-sm text-gray-600">Confermati</p>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  {loading ? (
                    <>
                      <Skeleton className="h-7 w-12 mb-1" />
                      <Skeleton className="h-4 w-20" />
                    </>
                  ) : (
                    <>
                      <p className="text-2xl font-bold">{stats?.pending ?? 0}</p>
                      <p className="text-sm text-gray-600">In Attesa</p>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  {loading ? (
                    <>
                      <Skeleton className="h-7 w-16 mb-1" />
                      <Skeleton className="h-4 w-24" />
                    </>
                  ) : (
                    <>
                      <p className="text-2xl font-bold">
                        {'\u20AC'}{((stats?.avgSalary ?? 0) / 1000).toFixed(0)}k
                      </p>
                      <p className="text-sm text-gray-600">Stipendio Medio</p>
                    </>
                  )}
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
                  {loading ? (
                    <>
                      <Skeleton className="h-7 w-14 mb-1" />
                      <Skeleton className="h-4 w-24" />
                    </>
                  ) : (
                    <>
                      <p className="text-2xl font-bold">{stats?.placementRate ?? 0}%</p>
                      <p className="text-sm text-gray-600">Tasso Placement</p>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Cerca studente, azienda o posizione..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Stato" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tutti gli stati</SelectItem>
              <SelectItem value="confirmed">Confermati</SelectItem>
              <SelectItem value="pending">In Attesa</SelectItem>
              <SelectItem value="declined">Rifiutati</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tutti i tipi</SelectItem>
              <SelectItem value="full-time">Full-time</SelectItem>
              <SelectItem value="internship">Stage</SelectItem>
              <SelectItem value="part-time">Part-time</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Placements List */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-medium text-gray-600">Studente</th>
                    <th className="text-left p-4 font-medium text-gray-600">Azienda</th>
                    <th className="text-left p-4 font-medium text-gray-600">Posizione</th>
                    <th className="text-left p-4 font-medium text-gray-600">Stipendio</th>
                    <th className="text-left p-4 font-medium text-gray-600">Inizio</th>
                    <th className="text-left p-4 font-medium text-gray-600">Tipo</th>
                    <th className="text-left p-4 font-medium text-gray-600">Stato</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i}>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div>
                              <Skeleton className="h-4 w-28 mb-1" />
                              <Skeleton className="h-3 w-36" />
                            </div>
                          </div>
                        </td>
                        <td className="p-4"><Skeleton className="h-4 w-24" /></td>
                        <td className="p-4">
                          <Skeleton className="h-4 w-32 mb-1" />
                          <Skeleton className="h-3 w-20" />
                        </td>
                        <td className="p-4"><Skeleton className="h-4 w-20" /></td>
                        <td className="p-4"><Skeleton className="h-4 w-24" /></td>
                        <td className="p-4"><Skeleton className="h-5 w-16 rounded-full" /></td>
                        <td className="p-4"><Skeleton className="h-5 w-20 rounded-full" /></td>
                      </tr>
                    ))
                  ) : (
                    placements.map((placement) => (
                      <tr key={placement.id} className="hover:bg-gray-50">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback>
                                {placement.studentName.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-gray-900">{placement.studentName}</p>
                              <p className="text-sm text-gray-600">{placement.department}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-gray-400" />
                            <span className="font-medium">{placement.company}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="text-gray-900">{placement.position}</p>
                          {placement.location && (
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {placement.location}
                            </p>
                          )}
                        </td>
                        <td className="p-4">
                          <span className="font-semibold text-gray-900">
                            {getCurrencySymbol(placement.salaryCurrency)}{placement.salary.toLocaleString()}
                            {placement.type === 'internship' && '/mese'}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-gray-600">
                            {new Date(placement.startDate).toLocaleDateString('it-IT', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                        </td>
                        <td className="p-4">{getTypeBadge(placement.type)}</td>
                        <td className="p-4">{getStatusBadge(placement.status)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {!loading && placements.length === 0 && (
              <div className="text-center py-12">
                <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Nessun placement trovato
                </h3>
                <p className="text-gray-600">
                  Prova a modificare i filtri di ricerca
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
