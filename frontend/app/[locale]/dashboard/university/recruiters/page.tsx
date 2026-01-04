'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Search,
  Filter,
  Building2,
  Users,
  Mail,
  Phone,
  MapPin,
  Star,
  CheckCircle,
  Clock,
  ExternalLink,
  MoreHorizontal,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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

const mockRecruiters: Recruiter[] = [
  {
    id: '1',
    companyName: 'Google',
    contactName: 'Maria Verdi',
    contactEmail: 'maria.verdi@google.com',
    contactPhone: '+39 02 1234567',
    location: 'Milano',
    industry: 'Technology',
    studentsHired: 12,
    studentsContacted: 45,
    avgSalaryOffered: 48000,
    isPartner: true,
    lastActivity: '2 ore fa',
    status: 'active'
  },
  {
    id: '2',
    companyName: 'McKinsey & Company',
    contactName: 'Paolo Bianchi',
    contactEmail: 'paolo.bianchi@mckinsey.com',
    location: 'Milano',
    industry: 'Consulting',
    studentsHired: 8,
    studentsContacted: 32,
    avgSalaryOffered: 45000,
    isPartner: true,
    lastActivity: '1 giorno fa',
    status: 'active'
  },
  {
    id: '3',
    companyName: 'Ferrari',
    contactName: 'Laura Rossi',
    contactEmail: 'l.rossi@ferrari.com',
    contactPhone: '+39 0536 949111',
    location: 'Maranello',
    industry: 'Automotive',
    studentsHired: 5,
    studentsContacted: 18,
    avgSalaryOffered: 38000,
    isPartner: false,
    lastActivity: '3 giorni fa',
    status: 'active'
  },
  {
    id: '4',
    companyName: 'Accenture',
    contactName: 'Marco Ferrari',
    contactEmail: 'm.ferrari@accenture.com',
    location: 'Milano',
    industry: 'Consulting',
    studentsHired: 15,
    studentsContacted: 67,
    avgSalaryOffered: 35000,
    isPartner: true,
    lastActivity: '5 ore fa',
    status: 'active'
  },
  {
    id: '5',
    companyName: 'Startup XYZ',
    contactName: 'Giovanni Neri',
    contactEmail: 'g.neri@startupxyz.com',
    location: 'Roma',
    industry: 'Technology',
    studentsHired: 2,
    studentsContacted: 8,
    avgSalaryOffered: 32000,
    isPartner: false,
    lastActivity: '1 settimana fa',
    status: 'inactive'
  }
]

export default function UniversityRecruitersPage() {
  const [recruiters, setRecruiters] = useState<Recruiter[]>(mockRecruiters)
  const [searchQuery, setSearchQuery] = useState('')
  const [industryFilter, setIndustryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedRecruiter, setSelectedRecruiter] = useState<Recruiter | null>(null)

  const filteredRecruiters = recruiters.filter(r => {
    const matchesSearch = r.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         r.contactName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesIndustry = industryFilter === 'all' || r.industry === industryFilter
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter
    return matchesSearch && matchesIndustry && matchesStatus
  })

  const totalHired = recruiters.reduce((sum, r) => sum + r.studentsHired, 0)
  const partnersCount = recruiters.filter(r => r.isPartner).length
  const activeCount = recruiters.filter(r => r.status === 'active').length

  const industries = [...new Set(recruiters.map(r => r.industry))]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Recruiter</h1>
            <p className="text-gray-600">Gestisci le relazioni con le aziende</p>
          </div>
          <Button>
            <Building2 className="h-4 w-4 mr-2" />
            Invita Azienda
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{recruiters.length}</p>
                  <p className="text-sm text-gray-600">Aziende Totali</p>
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
                  <p className="text-2xl font-bold">{partnersCount}</p>
                  <p className="text-sm text-gray-600">Partner Ufficiali</p>
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
                  <p className="text-2xl font-bold">{totalHired}</p>
                  <p className="text-sm text-gray-600">Studenti Assunti</p>
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
                  <p className="text-2xl font-bold">{activeCount}</p>
                  <p className="text-sm text-gray-600">Attivi Questo Mese</p>
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
                        <h3 className="font-semibold text-gray-900">{recruiter.companyName}</h3>
                        {recruiter.isPartner && (
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{recruiter.industry}</p>
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
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>{recruiter.contactName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{recruiter.location}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">{recruiter.studentsHired}</p>
                    <p className="text-xs text-gray-600">Assunti</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">{recruiter.studentsContacted}</p>
                    <p className="text-xs text-gray-600">Contattati</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">€{(recruiter.avgSalaryOffered / 1000).toFixed(0)}k</p>
                    <p className="text-xs text-gray-600">RAL Media</p>
                  </div>
                </div>

                <p className="text-xs text-gray-500 mt-4">
                  Ultima attività: {recruiter.lastActivity}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredRecruiters.length === 0 && (
          <Card className="p-8 text-center">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Nessun recruiter trovato
            </h3>
            <p className="text-gray-600">
              Prova a modificare i filtri di ricerca
            </p>
          </Card>
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
                  <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{selectedRecruiter.studentsHired}</p>
                      <p className="text-sm text-gray-600">Assunti</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{selectedRecruiter.studentsContacted}</p>
                      <p className="text-sm text-gray-600">Contattati</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">€{selectedRecruiter.avgSalaryOffered.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">RAL Media</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Contatto</h4>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="h-4 w-4" />
                      <span>{selectedRecruiter.contactName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="h-4 w-4" />
                      <a href={`mailto:${selectedRecruiter.contactEmail}`} className="text-blue-600 hover:underline">
                        {selectedRecruiter.contactEmail}
                      </a>
                    </div>
                    {selectedRecruiter.contactPhone && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="h-4 w-4" />
                        <span>{selectedRecruiter.contactPhone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-gray-600">
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
