'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Search,
  Users,
  TrendingUp,
  Briefcase,
  GraduationCap,
  MoreHorizontal,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Department {
  id: string
  name: string
  code: string
  students: number
  placementRate: number
  avgSalary: number
  topCompanies: string[]
  trend: 'up' | 'down' | 'stable'
  trendValue: number
}

export default function UniversityDepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDepartments() {
      try {
        const res = await fetch('/api/dashboard/university/departments')
        if (!res.ok) throw new Error('Failed to fetch departments')
        const data = await res.json()
        setDepartments(data.departments)
      } catch (err) {
        console.error('Error fetching departments:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchDepartments()
  }, [])

  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dept.code.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalStudents = departments.reduce((sum, d) => sum + d.students, 0)
  const avgPlacementRate = departments.length > 0
    ? Math.round(departments.reduce((sum, d) => sum + d.placementRate, 0) / departments.length)
    : 0

  // Derive unique partner companies count from all departments
  const partnerCompaniesSet = new Set<string>()
  departments.forEach(d => d.topCompanies.forEach(c => partnerCompaniesSet.add(c)))
  const partnerCompaniesCount = partnerCompaniesSet.size

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-8">
        <div className="container mx-auto px-4">
          {/* Header skeleton */}
          <div className="mb-8">
            <Skeleton className="h-9 w-48 mb-2" />
            <Skeleton className="h-5 w-80" />
          </div>

          {/* Stats skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-lg" />
                    <div>
                      <Skeleton className="h-7 w-16 mb-1" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Search skeleton */}
          <Skeleton className="h-10 w-full max-w-md mb-6" />

          {/* Department cards skeleton */}
          <div className="grid gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Skeleton className="w-12 h-12 rounded-lg" />
                      <div>
                        <Skeleton className="h-6 w-48 mb-2" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <Skeleton className="h-10 w-20" />
                      <Skeleton className="h-10 w-16" />
                      <Skeleton className="h-6 w-32 hidden lg:block" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dipartimenti</h1>
          <p className="text-gray-600">Gestisci i dipartimenti e monitora le performance</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{departments.length}</p>
                  <p className="text-sm text-gray-600">Dipartimenti</p>
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
                  <p className="text-2xl font-bold">{totalStudents.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Studenti Totali</p>
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
                  <p className="text-2xl font-bold">{avgPlacementRate}%</p>
                  <p className="text-sm text-gray-600">Placement Medio</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Briefcase className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{partnerCompaniesCount}</p>
                  <p className="text-sm text-gray-600">Aziende Partner</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Cerca dipartimenti..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 max-w-md"
          />
        </div>

        {/* Departments List */}
        <div className="grid gap-4">
          {filteredDepartments.map((dept) => (
            <Card key={dept.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="font-bold text-blue-600">{dept.code}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{dept.name}</h3>
                      <p className="text-sm text-gray-600">{dept.students} studenti iscritti</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    {/* Placement Rate */}
                    <div className="text-center">
                      <div className="flex items-center gap-1">
                        <span className="text-2xl font-bold text-gray-900">{dept.placementRate}%</span>
                        {dept.trend === 'up' && (
                          <ArrowUpRight className="h-4 w-4 text-green-500" />
                        )}
                        {dept.trend === 'down' && (
                          <ArrowDownRight className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                      <p className="text-xs text-gray-600">Placement Rate</p>
                      <Progress value={dept.placementRate} className="h-1 w-20 mt-1" />
                    </div>

                    {/* Avg Salary */}
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">
                        &euro;{(dept.avgSalary / 1000).toFixed(0)}k
                      </p>
                      <p className="text-xs text-gray-600">Stipendio Medio</p>
                    </div>

                    {/* Top Companies */}
                    <div className="hidden lg:block">
                      <p className="text-xs text-gray-600 mb-1">Top Aziende</p>
                      <div className="flex gap-1">
                        {dept.topCompanies.slice(0, 2).map((company, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {company}
                          </Badge>
                        ))}
                        {dept.topCompanies.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{dept.topCompanies.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Vedi Analytics
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredDepartments.length === 0 && (
          <Card className="p-8 text-center">
            <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Nessun dipartimento trovato
            </h3>
            <p className="text-gray-600">
              Prova a modificare i criteri di ricerca
            </p>
          </Card>
        )}
      </div>
    </div>
  )
}
