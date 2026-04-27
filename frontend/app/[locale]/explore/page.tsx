'use client'

import { useState, useEffect, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import {
  Search,
  ExternalLink,
  Filter,
  X,
  ChevronDown,
  ChevronRight,
  Check,
  GraduationCap,
  MapPin,
  ShieldCheck,
} from 'lucide-react'
import { Link } from '@/navigation'
import { motion } from 'framer-motion'
import TrustScoreBadge from '@/components/portfolio/TrustScoreBadge'
import {
  INSTITUTION_GROUPS,
  GRADUATION_YEARS,
  FIELDS_OF_STUDY,
  LOCATIONS,
  LANGUAGES,
  AVAILABILITY_OPTIONS,
  SKILL_CATEGORIES,
  ALL_SKILLS,
} from '@/lib/explore/data'
import { SAMPLE_PROFILES, type SampleStudent } from '@/lib/explore/sample-profiles'

interface Student {
  id: string
  username: string
  firstName: string
  lastName: string
  photo?: string
  university: string
  degree: string
  graduationYear: number
  projectsCount: number
  verificationScore: number
  skillsCount: number
  topSkills: string[]
  fieldOfStudy?: string
  location?: string
  languages?: string[]
  availability?: string
  topProject?: string
  endorsement?: boolean
  _sample?: boolean
}

export default function ExplorePage() {
  const t = useTranslations('explore')
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUniversity, setSelectedUniversity] = useState<string>('')
  const [selectedYear, setSelectedYear] = useState<string>('')
  const [selectedSkill, setSelectedSkill] = useState<string>('')
  const [skillSearchQuery, setSkillSearchQuery] = useState('')
  const [selectedField, setSelectedField] = useState<string>('')
  const [selectedLocation, setSelectedLocation] = useState<string>('')
  const [selectedLanguage, setSelectedLanguage] = useState<string>('')
  const [selectedAvailability, setSelectedAvailability] = useState<string>('')
  const [verificationFilter, setVerificationFilter] = useState<string>('')
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})

  const toggleCategory = (key: string) =>
    setExpandedCategories(prev => ({ ...prev, [key]: !prev[key] }))

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (searchQuery) params.set('search', searchQuery)
        if (selectedUniversity) params.set('university', selectedUniversity)
        if (selectedYear) params.set('year', selectedYear)
        if (selectedSkill) params.set('skill', selectedSkill)
        if (selectedAvailability) params.set('availability', selectedAvailability)

        const response = await fetch(`/api/explore/students?${params.toString()}`)
        if (response.ok) {
          const data = await response.json()
          setStudents(data.students || [])
        } else {
          setStudents([])
        }
      } catch (error) {
        console.error('Error fetching students:', error)
        setStudents([])
      } finally {
        setLoading(false)
      }
    }
    fetchStudents()
  }, [
    searchQuery,
    selectedUniversity,
    selectedYear,
    selectedSkill,
    selectedField,
    selectedLocation,
    selectedLanguage,
    selectedAvailability,
    verificationFilter,
  ])

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedUniversity('')
    setSelectedYear('')
    setSelectedSkill('')
    setSkillSearchQuery('')
    setSelectedField('')
    setSelectedLocation('')
    setSelectedLanguage('')
    setSelectedAvailability('')
    setVerificationFilter('')
  }

  const hasActiveFilters =
    !!searchQuery ||
    !!selectedUniversity ||
    !!selectedYear ||
    !!selectedSkill ||
    !!selectedField ||
    !!selectedLocation ||
    !!selectedLanguage ||
    !!selectedAvailability ||
    !!verificationFilter

  const showSamples = !loading && students.length === 0 && !hasActiveFilters
  const visibleStudents: (Student | SampleStudent)[] = showSamples ? SAMPLE_PROFILES : students

  const filteredSkills = useMemo(
    () =>
      skillSearchQuery
        ? ALL_SKILLS.filter(s => s.toLowerCase().includes(skillSearchQuery.toLowerCase()))
        : null,
    [skillSearchQuery]
  )

  const totalUniversitiesCount =
    INSTITUTION_GROUPS.universities.length +
    INSTITUTION_GROUPS.its.length +
    INSTITUTION_GROUPS.highSchools.length

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pb-16">
        {/* Hero — clean card-based, no overlay/mascot */}
        <section className="border-b border-border bg-muted/20">
          <div className="container max-w-5xl mx-auto px-6 pt-32 pb-12 lg:pt-36">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl"
            >
              <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-primary mb-4">
                {t('hero.badge')}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.1] text-foreground mb-5">
                {t('hero.title')}
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mb-8 leading-relaxed">
                {t('hero.subtitle')}
              </p>

              {/* Search input — large, centered, focused */}
              <div className="relative max-w-2xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/60" />
                <Input
                  type="text"
                  placeholder={t('hero.searchPlaceholder')}
                  className="pl-12 h-12 text-base border-2 focus-visible:border-primary"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Inline stats — facts about the pool, not vanity metrics */}
              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-muted-foreground uppercase tracking-[0.12em]">
                <span>
                  <span className="text-foreground font-semibold tabular-nums">
                    {students.length || (showSamples ? SAMPLE_PROFILES.length : 0)}
                  </span>{' '}
                  {t('hero.stats.students')}
                </span>
                <span className="text-muted-foreground/40">·</span>
                <span>
                  <span className="text-foreground font-semibold tabular-nums">
                    {totalUniversitiesCount}
                  </span>{' '}
                  {t('hero.stats.universities')}
                </span>
                <span className="text-muted-foreground/40">·</span>
                <span>
                  <span className="text-foreground font-semibold tabular-nums">
                    {ALL_SKILLS.length}
                  </span>{' '}
                  {t('hero.stats.skills')}
                </span>
              </div>
            </motion.div>
          </div>
        </section>

        <div className="container max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters sidebar — grouped into 3 cards */}
            <aside className="lg:w-72 flex-shrink-0 space-y-4">
              {/* Filter header with reset */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Filter className="h-4 w-4" />
                  {t('filters.title')}
                </div>
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="h-7 text-xs">
                    <X className="h-3 w-3 mr-1" />
                    {t('filters.clear')}
                  </Button>
                )}
              </div>

              {/* Group 1 — Who */}
              <Card className="bg-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xs uppercase tracking-wider flex items-center gap-2 text-muted-foreground font-semibold">
                    <GraduationCap className="h-3.5 w-3.5" />
                    {t('filters.groups.who')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FilterSelect
                    label={t('filters.fieldOfStudy')}
                    value={selectedField}
                    onChange={setSelectedField}
                    placeholder={t('filters.allFields')}
                  >
                    {FIELDS_OF_STUDY.map(field => (
                      <option key={field} value={field}>
                        {t(`options.fieldsOfStudy.${field}`)}
                      </option>
                    ))}
                  </FilterSelect>

                  <FilterSelect
                    label={t('filters.graduationYear')}
                    value={selectedYear}
                    onChange={setSelectedYear}
                    placeholder={t('filters.allYears')}
                  >
                    {GRADUATION_YEARS.map(year => (
                      <option key={year} value={year}>
                        {t('filters.classOf', { year })}
                      </option>
                    ))}
                  </FilterSelect>

                  <FilterSelect
                    label={t('filters.availability')}
                    value={selectedAvailability}
                    onChange={setSelectedAvailability}
                    placeholder={t('filters.allAvailability')}
                  >
                    {AVAILABILITY_OPTIONS.map(option => (
                      <option key={option} value={option}>
                        {t(`options.availability.${option}`)}
                      </option>
                    ))}
                  </FilterSelect>
                </CardContent>
              </Card>

              {/* Group 2 — From where */}
              <Card className="bg-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xs uppercase tracking-wider flex items-center gap-2 text-muted-foreground font-semibold">
                    <MapPin className="h-3.5 w-3.5" />
                    {t('filters.groups.where')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FilterSelect
                    label={t('filters.university')}
                    value={selectedUniversity}
                    onChange={setSelectedUniversity}
                    placeholder={t('filters.allUniversities')}
                  >
                    <optgroup label={t('filters.institutionTypes.universities')}>
                      {INSTITUTION_GROUPS.universities.map(uni => (
                        <option key={uni} value={uni}>{uni}</option>
                      ))}
                    </optgroup>
                    <optgroup label={t('filters.institutionTypes.its')}>
                      {INSTITUTION_GROUPS.its.map(uni => (
                        <option key={uni} value={uni}>{uni}</option>
                      ))}
                    </optgroup>
                    <optgroup label={t('filters.institutionTypes.highSchools')}>
                      {INSTITUTION_GROUPS.highSchools.map(uni => (
                        <option key={uni} value={uni}>{uni}</option>
                      ))}
                    </optgroup>
                  </FilterSelect>

                  <FilterSelect
                    label={t('filters.location')}
                    value={selectedLocation}
                    onChange={setSelectedLocation}
                    placeholder={t('filters.allLocations')}
                  >
                    {LOCATIONS.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </FilterSelect>

                  <FilterSelect
                    label={t('filters.language')}
                    value={selectedLanguage}
                    onChange={setSelectedLanguage}
                    placeholder={t('filters.allLanguages')}
                  >
                    {LANGUAGES.map(lang => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </FilterSelect>
                </CardContent>
              </Card>

              {/* Group 3 — How verified */}
              <Card className="bg-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xs uppercase tracking-wider flex items-center gap-2 text-muted-foreground font-semibold">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    {t('filters.groups.verification')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Verification score buttons */}
                  <div className="space-y-2">
                    <Button
                      variant={verificationFilter === '100' ? 'default' : 'outline'}
                      size="sm"
                      className="w-full justify-start text-xs"
                      onClick={() => setVerificationFilter(verificationFilter === '100' ? '' : '100')}
                    >
                      {t('filters.fullyVerified')}
                    </Button>
                    <Button
                      variant={verificationFilter === '90+' ? 'default' : 'outline'}
                      size="sm"
                      className="w-full justify-start text-xs"
                      onClick={() => setVerificationFilter(verificationFilter === '90+' ? '' : '90+')}
                    >
                      {t('filters.highlyVerified')}
                    </Button>
                  </div>

                  {/* Skills picker — popover */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={selectedSkill ? 'default' : 'outline'}
                        size="sm"
                        className="w-full justify-between text-xs"
                      >
                        <span className="truncate">
                          {selectedSkill
                            ? t('filters.skillsTriggerActive', { skill: selectedSkill })
                            : t('filters.skillsTrigger')}
                        </span>
                        <ChevronDown className="h-3.5 w-3.5 ml-2 flex-shrink-0" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      align="start"
                      className="w-[320px] p-0 max-h-[480px] overflow-hidden flex flex-col"
                    >
                      <div className="p-3 border-b border-border">
                        <div className="text-xs font-semibold text-foreground mb-2">
                          {t('filters.skillsPopoverTitle')}
                        </div>
                        <Input
                          type="text"
                          placeholder={t('filters.searchSkills')}
                          className="h-8 text-xs"
                          value={skillSearchQuery}
                          onChange={e => setSkillSearchQuery(e.target.value)}
                        />
                      </div>
                      <div className="overflow-y-auto p-3 space-y-1">
                        {filteredSkills ? (
                          <div className="flex flex-wrap gap-1.5">
                            {filteredSkills.length > 0 ? (
                              filteredSkills.map(skill => (
                                <Badge
                                  key={skill}
                                  variant={selectedSkill === skill ? 'default' : 'outline'}
                                  className="cursor-pointer text-xs"
                                  onClick={() =>
                                    setSelectedSkill(selectedSkill === skill ? '' : skill)
                                  }
                                >
                                  {skill}
                                </Badge>
                              ))
                            ) : (
                              <p className="text-xs text-muted-foreground py-3 px-1 w-full text-center">
                                {t('filters.noSkillsFound', { query: skillSearchQuery })}
                              </p>
                            )}
                          </div>
                        ) : (
                          Object.entries(SKILL_CATEGORIES).map(([categoryKey, skills]) => (
                            <div
                              key={categoryKey}
                              className="border border-border rounded-md overflow-hidden"
                            >
                              <button
                                type="button"
                                className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-semibold text-foreground hover:bg-muted/50 transition-colors"
                                onClick={() => toggleCategory(categoryKey)}
                              >
                                <span>{t(`filters.skillCategories.${categoryKey}`)}</span>
                                <span className="flex items-center gap-1 text-muted-foreground">
                                  <span className="text-[10px]">{skills.length}</span>
                                  {expandedCategories[categoryKey] ? (
                                    <ChevronDown className="h-3 w-3" />
                                  ) : (
                                    <ChevronRight className="h-3 w-3" />
                                  )}
                                </span>
                              </button>
                              {expandedCategories[categoryKey] && (
                                <div className="px-2.5 pb-2 pt-1 border-t border-border bg-muted/20 flex flex-wrap gap-1">
                                  {skills.map(skill => (
                                    <Badge
                                      key={skill}
                                      variant={selectedSkill === skill ? 'default' : 'outline'}
                                      className="cursor-pointer text-xs"
                                      onClick={() =>
                                        setSelectedSkill(selectedSkill === skill ? '' : skill)
                                      }
                                    >
                                      {skill}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                </CardContent>
              </Card>
            </aside>

            {/* Results column */}
            <div className="flex-1">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-foreground tracking-tight">
                  {loading
                    ? t('results.loading')
                    : showSamples
                      ? t('results.studentsFound', { count: SAMPLE_PROFILES.length })
                      : t('results.studentsFound', { count: students.length })}
                </h2>
                {hasActiveFilters && (
                  <p className="text-sm text-muted-foreground mt-1">{t('results.filtered')}</p>
                )}
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
                  <p className="mt-4 text-muted-foreground">{t('results.loadingPortfolios')}</p>
                </div>
              ) : students.length === 0 && hasActiveFilters ? (
                <Card className="p-12 text-center">
                  <Search className="h-16 w-16 text-muted-foreground/60 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {t('empty.title')}
                  </h3>
                  <p className="text-muted-foreground mb-6">{t('empty.description')}</p>
                  <Button onClick={clearFilters}>{t('empty.clearFilters')}</Button>
                </Card>
              ) : (
                <>
                  {showSamples && (
                    <div className="mb-6 border border-primary/30 bg-primary/5 rounded-md px-4 py-3 text-sm text-foreground">
                      <span className="font-medium">{t('sample.banner')}</span>
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-6">
                    {visibleStudents.map((student, index) => (
                      <motion.div
                        key={student.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.06 }}
                      >
                        <StudentCard student={student} t={t} />
                      </motion.div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* CTA — slim, consistent with the rest of the brand */}
        <section className="bg-primary text-primary-foreground py-12 mt-12">
          <div className="container max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-3 tracking-tight">{t('cta.title')}</h2>
            <p className="text-lg text-white/90 mb-7 max-w-xl mx-auto">{t('cta.subtitle')}</p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/auth/register?role=student">{t('cta.createPortfolio')}</Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

/** Inline filter select — 11px label + native select, used across the 3 groups. */
function FilterSelect({
  label,
  value,
  onChange,
  placeholder,
  children,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5">
        {label}
      </label>
      <select
        className="w-full p-2 border border-border rounded-md text-sm bg-card text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
        value={value}
        onChange={e => onChange(e.target.value)}
      >
        <option value="">{placeholder}</option>
        {children}
      </select>
    </div>
  )
}

/** Student card with the new evidence row + top-project preview. */
function StudentCard({
  student,
  t,
}: {
  student: Student | SampleStudent
  t: (key: string, params?: Record<string, any>) => string
}) {
  const isSample = '_sample' in student && student._sample
  const topProject = (student as SampleStudent).topProject
  const endorsement = (student as SampleStudent).endorsement

  return (
    <Card
      className={`bg-card hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/30 h-full ${
        isSample ? 'border-dashed' : ''
      }`}
    >
      <CardHeader>
        <div className="flex items-start gap-4">
          <Avatar className="w-16 h-16 border-2 border-white shadow-md">
            {!isSample && (
              <AvatarImage src={student.photo} alt={`${student.firstName} ${student.lastName}`} />
            )}
            <AvatarFallback className="text-lg bg-primary text-white">
              {student.firstName[0]}
              {student.lastName[0]}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <CardTitle className="text-lg">
                {student.firstName} {student.lastName}
              </CardTitle>
              {isSample && (
                <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
                  {t('card.sampleBadge')}
                </Badge>
              )}
            </div>
            <div className="space-y-0.5 text-sm text-muted-foreground">
              <div>{student.university}</div>
              <div>{student.degree}</div>
              <div>{t('card.classOf', { year: student.graduationYear })}</div>
            </div>
            {!isSample && (
              <div className="mt-1.5">
                <TrustScoreBadge userId={student.id} compact />
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-2 text-center py-2 bg-muted rounded-lg">
          <Stat value={student.projectsCount} label={t('card.stats.projects')} />
          <Stat value={`${student.verificationScore}%`} label={t('card.stats.verified')} />
          <Stat value={student.skillsCount} label={t('card.stats.skills')} />
        </div>

        {/* Evidence row — what's verified */}
        <div className="border-l-2 border-primary/40 pl-3 py-1 space-y-1 text-xs text-muted-foreground">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-foreground/80 mb-1">
            {t('card.evidence.title')}
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="h-3 w-3 text-emerald-600 flex-shrink-0" />
            <span>{t('card.evidence.skillsExtracted', { n: student.projectsCount })}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="h-3 w-3 text-emerald-600 flex-shrink-0" />
            <span>{t('card.evidence.gradesNormalized')}</span>
          </div>
          {endorsement !== undefined && (
            <div className="flex items-center gap-1.5">
              {endorsement ? (
                <Check className="h-3 w-3 text-emerald-600 flex-shrink-0" />
              ) : (
                <span className="h-3 w-3 inline-block rounded-full border border-muted-foreground/40 flex-shrink-0" />
              )}
              <span>
                {endorsement ? t('card.evidence.endorsementYes') : t('card.evidence.endorsementNo')}
              </span>
            </div>
          )}
        </div>

        {/* Top project (sample profiles only — real students show via portfolio link) */}
        {topProject && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-foreground/80 mb-1.5">
              {t('card.topProject')}
            </p>
            <p className="text-sm text-foreground italic leading-snug">
              &ldquo;{topProject}&rdquo;
            </p>
          </div>
        )}

        {/* Top skills */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-foreground/80 mb-1.5">
            {t('card.topSkills')}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {student.topSkills.slice(0, 3).map(skill => (
              <Badge key={skill} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        {/* CTA — disabled on sample cards */}
        {isSample ? (
          <Button className="w-full" variant="outline" disabled>
            {t('card.viewPortfolio')}
          </Button>
        ) : (
          <Button className="w-full" asChild>
            <Link href={`/students/${student.username}/public`}>
              {t('card.viewPortfolio')}
              <ExternalLink className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

function Stat({ value, label }: { value: number | string; label: string }) {
  return (
    <div>
      <div className="text-xl font-bold text-primary tabular-nums">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  )
}
