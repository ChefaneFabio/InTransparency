'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Search,
  Filter,
  Download,
  TrendingUp,
  Users,
  Briefcase,
  DollarSign,
  Calendar,
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
  studentAvatar?: string
  department: string
  company: string
  position: string
  salary: number
  location: string
  startDate: string
  status: 'confirmed' | 'pending' | 'declined'
  type: 'full-time' | 'internship' | 'part-time'
}

const mockPlacements: Placement[] = [
  {
    id: '1',
    studentName: 'Marco Rossi',
    department: 'Ingegneria Informatica',
    company: 'Google',
    position: 'Software Engineer',
    salary: 45000,
    location: 'Milano',
    startDate: '2024-03-01',
    status: 'confirmed',
    type: 'full-time'
  },
  {
    id: '2',
    studentName: 'Sofia Bianchi',
    department: 'Ingegneria Gestionale',
    company: 'McKinsey',
    position: 'Business Analyst',
    salary: 42000,
    location: 'Milano',
    startDate: '2024-02-15',
    status: 'confirmed',
    type: 'full-time'
  },
  {
    id: '3',
    studentName: 'Alessandro Costa',
    department: 'Design',
    company: 'Apple',
    position: 'UX Designer',
    salary: 40000,
    location: 'Londra',
    startDate: '2024-04-01',
    status: 'pending',
    type: 'full-time'
  },
  {
    id: '4',
    studentName: 'Giulia Ferrari',
    department: 'Ingegneria Meccanica',
    company: 'Ferrari',
    position: 'Engineering Intern',
    salary: 1200,
    location: 'Maranello',
    startDate: '2024-06-01',
    status: 'confirmed',
    type: 'internship'
  },
  {
    id: '5',
    studentName: 'Luca Verdi',
    department: 'Architettura',
    company: 'Foster + Partners',
    position: 'Junior Architect',
    salary: 32000,
    location: 'Londra',
    startDate: '2024-03-15',
    status: 'declined',
    type: 'full-time'
  }
]

export default function UniversityPlacementsPage() {
  const [placements, setPlacements] = useState<Placement[]>(mockPlacements)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  const filteredPlacements = placements.filter(p => {
    const matchesSearch = p.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.position.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter
    const matchesType = typeFilter === 'all' || p.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const confirmedCount = placements.filter(p => p.status === 'confirmed').length
  const pendingCount = placements.filter(p => p.status === 'pending').length
  const avgSalary = Math.round(
    placements
      .filter(p => p.type === 'full-time' && p.status === 'confirmed')
      .reduce((sum, p) => sum + p.salary, 0) /
    placements.filter(p => p.type === 'full-time' && p.status === 'confirmed').length
  )

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
                  <p className="text-2xl font-bold">{confirmedCount}</p>
                  <p className="text-sm text-gray-600">Confermati</p>
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
                  <p className="text-2xl font-bold">{pendingCount}</p>
                  <p className="text-sm text-gray-600">In Attesa</p>
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
                  <p className="text-2xl font-bold">€{(avgSalary / 1000).toFixed(0)}k</p>
                  <p className="text-sm text-gray-600">Stipendio Medio</p>
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
                  <p className="text-2xl font-bold">94%</p>
                  <p className="text-sm text-gray-600">Tasso Placement</p>
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
                  {filteredPlacements.map((placement) => (
                    <tr key={placement.id} className="hover:bg-gray-50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={placement.studentAvatar} />
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
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {placement.location}
                        </p>
                      </td>
                      <td className="p-4">
                        <span className="font-semibold text-gray-900">
                          €{placement.salary.toLocaleString()}
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
                  ))}
                </tbody>
              </table>
            </div>

            {filteredPlacements.length === 0 && (
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
