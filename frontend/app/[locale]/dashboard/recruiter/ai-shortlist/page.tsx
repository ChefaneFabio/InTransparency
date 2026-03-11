'use client'

import { useState, useEffect, useCallback, KeyboardEvent } from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Link } from '@/navigation'
import {
  Sparkles,
  Search,
  GraduationCap,
  MapPin,
  ShieldCheck,
  X,
  Clock,
  Star,
  Users,
  FileCheck,
  ChevronDown,
  ChevronUp,
  Save,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

type MatchedCandidate = {
  id: string
  firstName: string | null
  lastName: string | null
  university: string | null
  degree: string | null
  graduationYear: string | null
  location: string | null
  photo: string | null
  matchScore: number
  matchReasons: string[]
  matchedSkills: string[]
  verifiedProjectCount: number
  totalProjectCount: number
}

type SavedShortlist = {
  id: string
  title: string
  description: string
  skills: string[]
  location: string | null
  minGrade: number | null
  results: MatchedCandidate[] | null
  createdAt: string
}

export default function AiShortlistPage() {
  const t = useTranslations('dashboard.recruiter.aiShortlist')

  // Form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [skillInput, setSkillInput] = useState('')
  const [skills, setSkills] = useState<string[]>([])
  const [location, setLocation] = useState('')
  const [minGrade, setMinGrade] = useState('')

  // Results state
  const [candidates, setCandidates] = useState<MatchedCandidate[]>([])
  const [totalMatches, setTotalMatches] = useState(0)
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  // Save state
  const [isSaving, setIsSaving] = useState(false)
  const [savedId, setSavedId] = useState<string | null>(null)

  // History state
  const [shortlists, setShortlists] = useState<SavedShortlist[]>([])
  const [isLoadingHistory, setIsLoadingHistory] = useState(true)
  const [expandedHistory, setExpandedHistory] = useState<string | null>(null)

  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch('/api/recruiter/ai-shortlist')
      if (res.ok) {
        const data = await res.json()
        setShortlists(data.shortlists || [])
      }
    } catch {
      // silently fail
    } finally {
      setIsLoadingHistory(false)
    }
  }, [])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  const handleAddSkill = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault()
      const newSkill = skillInput.trim()
      if (!skills.includes(newSkill)) {
        setSkills((prev) => [...prev, newSkill])
      }
      setSkillInput('')
    }
  }

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills((prev) => prev.filter((s) => s !== skillToRemove))
  }

  const handleSearch = async () => {
    if (!title.trim() || !description.trim() || skills.length === 0) return

    setIsSearching(true)
    setHasSearched(false)
    setCandidates([])
    setSavedId(null)

    try {
      const res = await fetch('/api/recruiter/ai-shortlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          skills,
          location: location.trim() || undefined,
          minGrade: minGrade ? parseFloat(minGrade) : undefined,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        setCandidates(data.candidates || [])
        setTotalMatches(data.total || 0)
      }
    } catch {
      // silently fail
    } finally {
      setIsSearching(false)
      setHasSearched(true)
    }
  }

  const handleSave = async () => {
    if (!title.trim() || !description.trim() || skills.length === 0) return

    setIsSaving(true)
    try {
      const res = await fetch('/api/recruiter/ai-shortlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          skills,
          location: location.trim() || undefined,
          minGrade: minGrade ? parseFloat(minGrade) : undefined,
          save: true,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        setSavedId(data.savedId)
        setCandidates(data.candidates || [])
        setTotalMatches(data.total || 0)
        setHasSearched(true)
        fetchHistory()
      }
    } catch {
      // silently fail
    } finally {
      setIsSaving(false)
    }
  }

  const loadShortlist = (shortlist: SavedShortlist) => {
    setTitle(shortlist.title)
    setDescription(shortlist.description)
    setSkills(shortlist.skills || [])
    setLocation(shortlist.location || '')
    setMinGrade(shortlist.minGrade ? String(shortlist.minGrade) : '')
    if (shortlist.results) {
      setCandidates(shortlist.results)
      setTotalMatches(shortlist.results.length)
      setHasSearched(true)
    }
    setSavedId(shortlist.id)
  }

  const getReasonLabel = (reason: string): string => {
    try {
      return t(`results.${reason}`)
    } catch {
      return reason
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600 bg-green-50 border-green-200'
    if (score >= 40) return 'text-amber-600 bg-amber-50 border-amber-200'
    return 'text-gray-600 bg-gray-50 border-gray-200'
  }

  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-primary rounded-xl">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
              <p className="text-gray-600">{t('subtitle')}</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search Form */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-primary" />
                  {t('form.roleTitle')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Title */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    {t('form.roleTitle')}
                  </label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={t('form.roleTitlePlaceholder')}
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    {t('form.description')}
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={t('form.descriptionPlaceholder')}
                    className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>

                {/* Skills */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    {t('form.skills')}
                  </label>
                  <Input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={handleAddSkill}
                    placeholder={t('form.skillsPlaceholder')}
                  />
                  {skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {skills.map((skill) => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="flex items-center gap-1 px-3 py-1"
                        >
                          {skill}
                          <button
                            onClick={() => handleRemoveSkill(skill)}
                            className="ml-1 hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Location & Min Grade */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      {t('form.location')}
                    </label>
                    <Input
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder={t('form.locationPlaceholder')}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      {t('form.minGrade')}
                    </label>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={minGrade}
                      onChange={(e) => setMinGrade(e.target.value)}
                      placeholder="0-100"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <Button
                    onClick={handleSearch}
                    disabled={
                      isSearching ||
                      !title.trim() ||
                      !description.trim() ||
                      skills.length === 0
                    }
                    className="flex-1"
                  >
                    {isSearching ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        {t('form.searching')}
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        {t('form.findMatches')}
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleSave}
                    disabled={
                      isSaving ||
                      !title.trim() ||
                      !description.trim() ||
                      skills.length === 0
                    }
                  >
                    {isSaving ? (
                      <>
                        <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2" />
                        {t('saving')}
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        {t('save')}
                      </>
                    )}
                  </Button>
                </div>

                {savedId && (
                  <p className="text-sm text-green-600 flex items-center gap-1">
                    <ShieldCheck className="h-4 w-4" />
                    {t('saved')}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Results */}
            {isSearching && (
              <Card>
                <CardContent className="p-6 space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex gap-4">
                      <Skeleton className="h-14 w-14 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-3 w-1/2" />
                        <Skeleton className="h-3 w-2/3" />
                      </div>
                      <Skeleton className="h-10 w-20" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {hasSearched && !isSearching && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      {t('results.title')}
                    </span>
                    {totalMatches > 0 && (
                      <Badge variant="secondary">
                        {candidates.length} / {totalMatches} shown
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {candidates.length === 0 ? (
                    <div className="text-center py-12">
                      <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-lg font-medium text-gray-600">
                        {t('results.noResults')}
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        {t('results.noResultsDescription')}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <AnimatePresence>
                        {candidates.map((candidate, idx) => (
                          <motion.div
                            key={candidate.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                                  {candidate.firstName?.charAt(0) || '?'}
                                  {candidate.lastName?.charAt(0) || ''}
                                </div>
                                <div>
                                  <h3 className="font-semibold text-gray-900">
                                    {candidate.firstName} {candidate.lastName}
                                  </h3>
                                  {candidate.university && (
                                    <p className="text-sm text-gray-600 flex items-center gap-1">
                                      <GraduationCap className="h-3.5 w-3.5" />
                                      {candidate.university}
                                      {candidate.degree &&
                                        ` - ${candidate.degree}`}
                                    </p>
                                  )}
                                </div>
                              </div>

                              {/* Match Score */}
                              <div
                                className={`px-3 py-1.5 rounded-lg border font-bold text-lg ${getScoreColor(candidate.matchScore)}`}
                              >
                                {candidate.matchScore}%
                              </div>
                            </div>

                            {/* Details row */}
                            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-3">
                              {candidate.graduationYear && (
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3.5 w-3.5" />
                                  Class of {candidate.graduationYear}
                                </span>
                              )}
                              {candidate.location && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3.5 w-3.5" />
                                  {candidate.location}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <FileCheck className="h-3.5 w-3.5" />
                                {t('results.verifiedProjects')}:{' '}
                                {candidate.verifiedProjectCount}/
                                {candidate.totalProjectCount}
                              </span>
                            </div>

                            {/* Matched Skills */}
                            <div className="flex flex-wrap gap-1.5 mb-3">
                              {candidate.matchedSkills.map((skill) => (
                                <Badge
                                  key={skill}
                                  className="bg-primary/10 text-primary border-primary/20 text-xs"
                                >
                                  {skill}
                                </Badge>
                              ))}
                            </div>

                            {/* Match Reasons */}
                            <div className="flex flex-wrap gap-2 mb-4">
                              {candidate.matchReasons.map((reason) => (
                                <span
                                  key={reason}
                                  className="text-xs text-gray-500 flex items-center gap-1"
                                >
                                  <Star className="h-3 w-3 text-amber-400" />
                                  {getReasonLabel(reason)}
                                </span>
                              ))}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                              <Link
                                href={
                                  `/dashboard/recruiter/candidates/${candidate.id}` as never
                                }
                                className="flex-1"
                              >
                                <Button variant="outline" className="w-full">
                                  {t('results.viewProfile')}
                                </Button>
                              </Link>
                              <Link
                                href={
                                  `/dashboard/recruiter/candidates/${candidate.id}` as never
                                }
                                className="flex-1"
                              >
                                <Button className="w-full">
                                  {t('results.contact')}
                                </Button>
                              </Link>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar: History */}
          <div>
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="h-5 w-5 text-primary" />
                  {t('history.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingHistory ? (
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="space-y-2">
                        <Skeleton className="h-4 w-2/3" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    ))}
                  </div>
                ) : shortlists.length === 0 ? (
                  <div className="text-center py-8">
                    <Sparkles className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm font-medium text-gray-600">
                      {t('history.empty')}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {t('history.emptyDescription')}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {shortlists.map((shortlist) => (
                      <div
                        key={shortlist.id}
                        className="border border-gray-200 rounded-lg overflow-hidden"
                      >
                        <button
                          onClick={() =>
                            setExpandedHistory(
                              expandedHistory === shortlist.id
                                ? null
                                : shortlist.id
                            )
                          }
                          className="w-full text-left p-3 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm text-gray-900 truncate">
                                {shortlist.title}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {new Date(
                                  shortlist.createdAt
                                ).toLocaleDateString()}
                                {shortlist.results &&
                                  ` - ${t('history.candidates', { count: (shortlist.results as MatchedCandidate[]).length })}`}
                              </p>
                            </div>
                            {expandedHistory === shortlist.id ? (
                              <ChevronUp className="h-4 w-4 text-gray-400" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-gray-400" />
                            )}
                          </div>
                        </button>

                        {expandedHistory === shortlist.id && (
                          <div className="px-3 pb-3 border-t border-gray-100">
                            <div className="flex flex-wrap gap-1 mt-2 mb-2">
                              {(shortlist.skills as string[]).map((skill) => (
                                <Badge
                                  key={skill}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full text-xs"
                              onClick={() => loadShortlist(shortlist)}
                            >
                              {t('history.viewResults')}
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
