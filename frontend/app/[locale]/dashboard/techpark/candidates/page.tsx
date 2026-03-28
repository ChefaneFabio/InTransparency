'use client'

import { useEffect, useState } from 'react'
import { Link } from '@/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft, Search, Filter, MapPin, GraduationCap, Users } from 'lucide-react'

interface Candidate {
  id: string
  name: string
  location: string
  university: string
  degree: string
  skills: string[]
  available: boolean
}

const MOCK_CANDIDATES: Candidate[] = [
  { id: '1', name: 'Giovanni Trentini', location: 'Trento', university: 'UniTN', degree: 'MSc Computer Science', skills: ['React', 'Node.js', 'TypeScript'], available: true },
  { id: '2', name: 'Maria Hofer', location: 'Bolzano', university: 'UniBZ', degree: 'BSc Information Systems', skills: ['Python', 'Django', 'PostgreSQL'], available: true },
  { id: '3', name: 'Thomas Berger', location: 'Innsbruck', university: 'UIBK', degree: 'MSc Data Science', skills: ['Python', 'TensorFlow', 'Spark'], available: false },
  { id: '4', name: 'Sara Colombo', location: 'Trento', university: 'UniTN', degree: 'BSc Software Engineering', skills: ['Java', 'Kotlin', 'Android'], available: true },
  { id: '5', name: 'Felix Pichler', location: 'Bolzano', university: 'UniBZ', degree: 'MSc Computational Design', skills: ['Unity', 'C#', 'Blender'], available: true },
  { id: '6', name: 'Chiara De Luca', location: 'Rovereto', university: 'UniTN', degree: 'MSc Cognitive Science', skills: ['UX Research', 'Python', 'R'], available: false },
]

export default function TechParkCandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showAvailableOnly, setShowAvailableOnly] = useState(false)

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const res = await fetch('/api/dashboard/techpark/candidates')
        if (res.ok) {
          const data = await res.json()
          setCandidates(data.candidates ?? [])
        } else {
          setCandidates(MOCK_CANDIDATES)
        }
      } catch {
        setCandidates(MOCK_CANDIDATES)
      } finally {
        setLoading(false)
      }
    }
    fetchCandidates()
  }, [])

  const filtered = candidates.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.skills.some(s => s.toLowerCase().includes(search.toLowerCase())) ||
      c.degree.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = !showAvailableOnly || c.available
    return matchesSearch && matchesFilter
  })

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      <div className="flex items-center gap-4 pt-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/techpark">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold">Candidate Browser</h1>
          <p className="text-sm text-muted-foreground">Search and filter candidates for your member companies</p>
        </div>
      </div>

      <div className="flex gap-3 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by name, skill, or degree..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Button
          variant={showAvailableOnly ? 'default' : 'outline'}
          size="sm"
          onClick={() => setShowAvailableOnly(!showAvailableOnly)}
        >
          <Filter className="h-4 w-4 mr-1" /> Available only
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}><CardContent className="py-4"><Skeleton className="h-16 w-full" /></CardContent></Card>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(candidate => (
            <Card key={candidate.id} className="hover:shadow-md transition-shadow">
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{candidate.name}</h3>
                      <Badge variant={candidate.available ? 'default' : 'secondary'}>
                        {candidate.available ? 'Available' : 'Unavailable'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><GraduationCap className="h-3.5 w-3.5" /> {candidate.degree}</span>
                      <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {candidate.location}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {candidate.skills.map(skill => (
                        <Badge key={skill} variant="outline" className="text-xs">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No candidates match your search</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
