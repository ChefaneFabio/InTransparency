'use client'

import { useState, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Link } from '@/navigation'
import { Search, Loader2, Plus, X } from 'lucide-react'

interface Student {
  id: string; name: string; initials: string; university: string | null
  degree: string | null; graduationYear: string | null; gpa: number | null
  bio: string | null; projectCount: number
}

export default function AdvancedSearchPage() {
  const t = useTranslations('advancedSearch')
  const [results, setResults] = useState<Student[]>([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [totalResults, setTotalResults] = useState(0)
  const [showMore, setShowMore] = useState(false)
  const [query, setQuery] = useState('')
  const [university, setUniversity] = useState('')
  const [skills, setSkills] = useState<string[]>([])
  const [skillInput, setSkillInput] = useState('')
  const [minGPA, setMinGPA] = useState('')
  const [maxGPA, setMaxGPA] = useState('')
  const [graduationYear, setGraduationYear] = useState('')
  const [location, setLocation] = useState('')
  const [major, setMajor] = useState('')
  const [experience, setExperience] = useState('')

  const addSkill = () => {
    const s = skillInput.trim()
    if (s && !skills.includes(s)) { setSkills(p => [...p, s]); setSkillInput('') }
  }

  const clearFilters = () => {
    setQuery(''); setUniversity(''); setSkills([]); setSkillInput('')
    setMinGPA(''); setMaxGPA(''); setGraduationYear('')
    setLocation(''); setMajor(''); setExperience('')
  }

  const runSearch = useCallback(async () => {
    setLoading(true); setHasSearched(true)
    try {
      const p = new URLSearchParams()
      if (query) p.set('query', query)
      if (university) p.set('university', university)
      if (skills.length > 0) p.set('skills', skills.join(','))
      if (minGPA) p.set('gpaMin', minGPA)
      if (maxGPA) p.set('gpaMax', maxGPA)
      if (graduationYear) p.set('graduationYear', graduationYear)
      if (location) p.set('location', location)
      if (major) p.set('major', major)
      if (experience) p.set('experienceLevel', experience)
      p.set('page', '1'); p.set('limit', '20')
      const res = await fetch(`/api/dashboard/recruiter/search/students?${p.toString()}`)
      if (!res.ok) throw new Error()
      const data = await res.json()
      setResults(data.students || []); setTotalResults(data.total || 0)
    } catch { setResults([]); setTotalResults(0) }
    finally { setLoading(false) }
  }, [query, university, skills, minGPA, maxGPA, graduationYear, location, major, experience])

  const majors = ['Computer Science', 'Software Engineering', 'Data Science', 'Artificial Intelligence',
    'Electrical Engineering', 'Mathematics', 'Physics', 'Information Systems', 'Cybersecurity', 'Statistics']
  const levels = ['entry', 'junior', 'mid', 'senior']

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">{t('title')}</h1>
        <p className="text-muted-foreground">{t('subtitle')}</p>
      </div>

      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={query} onChange={e => setQuery(e.target.value)}
              placeholder={t('searchPlaceholder')} className="pl-10"
              onKeyDown={e => e.key === 'Enter' && runSearch()} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">{t('university')}</label>
              <Input value={university} onChange={e => setUniversity(e.target.value)} placeholder={t('allUniversities')} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">{t('skills')}</label>
              <div className="flex gap-2">
                <Input value={skillInput} onChange={e => setSkillInput(e.target.value)} placeholder={t('addSkill')}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill() } }} className="flex-1" />
                <Button variant="outline" size="icon" onClick={addSkill} type="button"><Plus className="h-4 w-4" /></Button>
              </div>
              {skills.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {skills.map(s => (
                    <Badge key={s} variant="secondary" className="gap-1">{s}
                      <button onClick={() => setSkills(p => p.filter(x => x !== s))} type="button"><X className="h-3 w-3" /></button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button type="button" onClick={() => setShowMore(!showMore)} className="text-sm font-medium text-primary hover:underline">
            {showMore ? t('lessFilters') : t('moreFilters')}
          </button>

          {showMore && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t">
              <div className="space-y-1">
                <label className="text-sm font-medium">{t('gpa')}</label>
                <div className="flex items-center gap-2">
                  <Input type="number" step="0.1" min="0" max="4" value={minGPA} onChange={e => setMinGPA(e.target.value)} placeholder={t('min')} className="flex-1" />
                  <span className="text-muted-foreground">-</span>
                  <Input type="number" step="0.1" min="0" max="4" value={maxGPA} onChange={e => setMaxGPA(e.target.value)} placeholder={t('max')} className="flex-1" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">{t('graduationYear')}</label>
                <Select value={graduationYear} onValueChange={setGraduationYear}>
                  <SelectTrigger><SelectValue placeholder={t('allYears')} /></SelectTrigger>
                  <SelectContent>{['2024', '2025', '2026', '2027'].map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">{t('location')}</label>
                <Input value={location} onChange={e => setLocation(e.target.value)} placeholder={t('location')} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">{t('major')}</label>
                <Select value={major} onValueChange={setMajor}>
                  <SelectTrigger><SelectValue placeholder={t('allMajors')} /></SelectTrigger>
                  <SelectContent>{majors.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">{t('experience')}</label>
                <Select value={experience} onValueChange={setExperience}>
                  <SelectTrigger><SelectValue placeholder={t('allLevels')} /></SelectTrigger>
                  <SelectContent>{levels.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <button type="button" onClick={clearFilters} className="text-sm text-muted-foreground hover:underline">{t('clearFilters')}</button>
            <Button onClick={runSearch} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Search className="h-4 w-4 mr-2" />}
              {loading ? t('searching') : t('search')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}><CardContent className="p-4 flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2"><Skeleton className="h-4 w-40" /><Skeleton className="h-3 w-60" /></div>
            </CardContent></Card>
          ))}
        </div>
      )}

      {!loading && hasSearched && <p className="text-sm text-muted-foreground">{t('results', { count: totalResults })}</p>}

      {!loading && results.length > 0 && (
        <div className="space-y-3">
          {results.map(s => (
            <Card key={s.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">{s.initials}</div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/dashboard/recruiter/candidates/${s.id}`} className="font-medium text-foreground hover:underline">{s.name}</Link>
                    <p className="text-sm text-muted-foreground truncate">{s.university || ''}{s.degree ? ` - ${s.degree}` : ''}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {s.gpa !== null && <Badge variant="outline">GPA {s.gpa}</Badge>}
                    <Badge variant="secondary">{s.projectCount} projects</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && hasSearched && results.length === 0 && (
        <Card><CardContent className="p-8 text-center">
          <Search className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-muted-foreground">{t('noResults')}</p>
        </CardContent></Card>
      )}
    </div>
  )
}
