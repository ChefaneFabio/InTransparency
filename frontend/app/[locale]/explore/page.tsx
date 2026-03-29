'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Transparenty } from '@/components/mascot/Transparenty'
import {
  Search,
  ExternalLink,
  Filter,
  X,
  ChevronDown,
  ChevronRight
} from 'lucide-react'
import { Link } from '@/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { IMAGES } from '@/lib/images'
import TrustScoreBadge from '@/components/portfolio/TrustScoreBadge'

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

  const institutionGroups = {
    universities: [
      'Politecnico di Milano',
      'Politecnico di Torino',
      'Sapienza Università di Roma',
      'Università di Bologna',
      'Università di Padova',
      'Università degli Studi di Milano',
      'Università di Firenze',
      'Università di Napoli Federico II',
      'Università di Pisa',
      'Università di Genova',
      'Università di Trento',
      'Università degli Studi di Bergamo',
      'Università Cattolica del Sacro Cuore',
      'Università Bocconi',
      'LUISS Guido Carli',
      'Università Ca\' Foscari Venezia',
      'Università di Verona',
      'Università di Parma',
      'Università di Siena',
      'Università di Perugia',
      'Università della Calabria',
      'Università di Catania',
      'Università di Palermo',
      'Università di Cagliari',
      'Università di Bari Aldo Moro',
    ],
    its: [
      'ITS Academy Meccatronico Veneto',
      'ITS Angelo Rizzoli (Milano)',
      'ITS Lombardia Informatica',
      'ITS ICT Piemonte',
      'ITS Maker (Emilia-Romagna)',
      'ITS Energia e Ambiente (Colle Val d\'Elsa)',
      'ITS Moda Campania',
      'ITS TAM Biella (Tessile)',
      'ITS Agroalimentare Piemonte',
      'ITS Turismo e Benessere',
      'ITS Biotecnologie (Roma)',
      'ITS Logistica (Verona)',
      'ITS Aerospazio Puglia',
      'ITS Nuove Tecnologie della Vita (Bergamo)',
      'ITS Last (Puglia - Legno Arredo)',
    ],
    highSchools: [
      'Liceo Scientifico A. Volta (Milano)',
      'Liceo Classico G. Berchet (Milano)',
      'Liceo Scientifico G. Galilei (Roma)',
      'ITIS G. Marconi (Verona)',
      'ITIS A. Meucci (Firenze)',
      'Liceo Artistico di Brera (Milano)',
      'IIS Ettore Majorana (Torino)',
      'ITIS Enrico Fermi (Roma)',
      'Liceo Scientifico E. Fermi (Bologna)',
      'ITIS G. Cardano (Pavia)',
      'Liceo Linguistico C. Cattaneo (Torino)',
      'IIS Leonardo da Vinci (Firenze)',
    ],
  }
  const years = ['2024', '2025', '2026', '2027']

  const fieldsOfStudyKeys = [
    'Engineering',
    'Computer Science',
    'Data Science',
    'Business Administration',
    'Economics',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Medicine',
    'Law',
    'Psychology',
    'Architecture',
    'Design',
    'Arts',
    'Literature',
    'Philosophy',
    'Political Science'
  ]

  const locations = [
    'Milan, Italy',
    'Rome, Italy',
    'Bologna, Italy',
    'Turin, Italy',
    'Florence, Italy',
    'Naples, Italy',
    'Venice, Italy',
    'Padua, Italy',
    'Remote'
  ]

  const languages = [
    'Italian',
    'English',
    'Spanish',
    'French',
    'German',
    'Chinese',
    'Arabic',
    'Portuguese'
  ]

  const availabilityKeys = [
    'Available immediately',
    'Open to offers',
    'Not looking',
    'Available for projects only'
  ]

  // Skills organized by macro categories
  const skillCategories: Record<string, string[]> = {
    engineeringTech: [
      'Python', 'JavaScript', 'Java', 'C++', 'C#', 'SQL', 'R', 'MATLAB',
      'React', 'Node.js', 'Machine Learning', 'Data Analysis', 'AWS', 'Docker',
      'CAD', 'AutoCAD', 'SolidWorks', 'CATIA', 'Revit', 'Civil 3D',
      'Structural Analysis', 'FEM/FEA', 'CFD', 'ANSYS', 'Simulink',
      'PLC Programming', 'SCADA', 'Industrial Automation', 'Robotics',
      'Electrical Design', 'PCB Design', 'Embedded Systems', 'IoT',
      'BIM', 'GIS', 'Project Engineering', 'Quality Control',
    ],
    businessManagement: [
      'Business Strategy', 'Business Development', 'Market Analysis', 'Competitive Analysis',
      'Financial Modeling', 'Budgeting', 'Forecasting', 'Business Planning',
      'Operations Management', 'Supply Chain', 'Logistics', 'Procurement',
      'Project Management', 'Agile', 'Scrum', 'Lean Six Sigma',
      'Change Management', 'Risk Management', 'Stakeholder Management',
      'Consulting', 'Management Consulting', 'Strategy Consulting',
    ],
    financeAccounting: [
      'Financial Analysis', 'Financial Reporting', 'IFRS', 'GAAP',
      'Accounting', 'Auditing', 'Tax Planning', 'Corporate Finance',
      'Investment Analysis', 'Portfolio Management', 'Valuation', 'M&A',
      'Risk Analysis', 'Credit Analysis', 'Treasury', 'Controlling',
      'SAP', 'Bloomberg Terminal', 'Excel Advanced', 'Power BI',
    ],
    marketingComms: [
      'Digital Marketing', 'SEO', 'SEM', 'Social Media Marketing',
      'Content Marketing', 'Brand Management', 'Product Marketing',
      'Marketing Strategy', 'Market Research', 'Consumer Insights',
      'Public Relations', 'Corporate Communications', 'Event Management',
      'Copywriting', 'Content Creation', 'Video Production', 'Photography',
      'Google Analytics', 'HubSpot', 'Salesforce',
    ],
    designCreative: [
      'Graphic Design', 'UI/UX Design', 'Web Design', 'Brand Identity',
      'Adobe Photoshop', 'Adobe Illustrator', 'Adobe InDesign', 'Figma', 'Sketch',
      'Motion Graphics', 'Video Editing', 'Adobe Premiere', 'After Effects',
      '3D Modeling', 'Blender', 'Maya', 'Cinema 4D', 'Rendering',
      'Interior Design', 'Product Design', 'Fashion Design', 'Packaging Design',
    ],
    healthcareLifeSciences: [
      'Clinical Research', 'Clinical Trials', 'GCP', 'Regulatory Affairs',
      'Medical Writing', 'Pharmacovigilance', 'Drug Development',
      'Laboratory Techniques', 'PCR', 'HPLC', 'Mass Spectrometry',
      'Biotechnology', 'Molecular Biology', 'Cell Culture', 'Bioinformatics',
      'Healthcare Management', 'Patient Care', 'Medical Imaging',
      'Nursing', 'Physiotherapy', 'Nutrition', 'Public Health',
    ],
    lawLegal: [
      'Legal Research', 'Contract Law', 'Corporate Law', 'Commercial Law',
      'Intellectual Property', 'Patent Law', 'Trademark', 'Copyright',
      'Labor Law', 'Employment Law', 'GDPR', 'Privacy Law',
      'Litigation', 'Legal Writing', 'Due Diligence', 'Compliance',
    ],
    sciences: [
      'Research Methodology', 'Statistical Analysis', 'SPSS', 'Stata',
      'Laboratory Management', 'Scientific Writing', 'Peer Review',
      'Physics', 'Chemistry', 'Biology', 'Environmental Science',
      'Geology', 'Materials Science', 'Nanotechnology',
    ],
    educationTraining: [
      'Teaching', 'Curriculum Development', 'Instructional Design',
      'E-Learning', 'Training Delivery', 'Educational Technology',
      'Assessment Design', 'Student Mentoring', 'Academic Writing',
    ],
    languages: [
      'English', 'Italian', 'Spanish', 'French', 'German', 'Chinese', 'Arabic',
      'Translation', 'Interpretation', 'Localization', 'Technical Translation',
    ],
    softSkills: [
      'Leadership', 'Team Management', 'Communication', 'Presentation',
      'Negotiation', 'Problem Solving', 'Critical Thinking', 'Analytical Thinking',
      'Creativity', 'Innovation', 'Adaptability', 'Time Management',
      'Emotional Intelligence', 'Conflict Resolution', 'Cross-cultural Communication',
    ],
    hospitalityTourism: [
      'Hotel Management', 'Event Planning', 'Tourism Management',
      'Customer Service', 'Front Office', 'Food & Beverage',
    ],
    agricultureEnvironment: [
      'Agronomy', 'Sustainable Agriculture', 'Food Science',
      'Environmental Management', 'Sustainability', 'Renewable Energy',
      'Waste Management', 'Water Management', 'Climate Science',
    ],
  }

  const allSkills = Object.values(skillCategories).flat()
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})

  const toggleCategory = (key: string) => {
    setExpandedCategories(prev => ({ ...prev, [key]: !prev[key] }))
  }

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
  }, [searchQuery, selectedUniversity, selectedYear, selectedSkill, selectedField, selectedLocation, selectedLanguage, selectedAvailability, verificationFilter])

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

  const hasActiveFilters = searchQuery || selectedUniversity || selectedYear || selectedSkill || selectedField || selectedLocation || selectedLanguage || selectedAvailability || verificationFilter

  return (
    <div className="min-h-screen hero-bg">
      <Header />

      <main className="pb-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-foreground text-white">
          <img src="/images/brand/students.jpg" alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-primary/60" />
          <div className="relative container max-w-5xl mx-auto px-4 py-16 lg:py-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
                {t('hero.badge')}
              </div>
              <h1 className="text-5xl font-display font-bold mb-6 text-white">
                {t('hero.title')}
              </h1>
              <p className="text-xl text-blue-100 leading-relaxed max-w-3xl mx-auto mb-8">
                {t('hero.subtitle')}
              </p>

              {/* Search Bar */}
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground/60" />
                <Input
                  type="text"
                  placeholder={t('hero.searchPlaceholder')}
                  className="pl-12 py-6 text-lg bg-white text-foreground shadow-md border-2 hover:border-primary/30 transition-colors"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Quick Stats */}
              {students.length > 0 && (
                <div className="flex justify-center space-x-8 mt-12">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">{students.length}</div>
                    <div className="text-sm text-blue-200">{t('hero.stats.students')}</div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <aside className="lg:w-64 flex-shrink-0">
              <Card className="sticky top-4 bg-card hover:shadow-lg transition-shadow border-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Filter className="h-5 w-5" />
                      {t('filters.title')}
                    </CardTitle>
                    {hasActiveFilters && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="text-xs"
                      >
                        <X className="h-3 w-3 mr-1" />
                        {t('filters.clear')}
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Field of Study Filter */}
                  <div>
                    <h3 className="font-semibold text-sm mb-3 text-foreground">
                      {t('filters.fieldOfStudy')}
                    </h3>
                    <select
                      className="w-full p-2 border border-border rounded-md text-sm bg-card text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                      value={selectedField}
                      onChange={(e) => setSelectedField(e.target.value)}
                    >
                      <option value="">{t('filters.allFields')}</option>
                      {fieldsOfStudyKeys.map((field) => (
                        <option key={field} value={field}>{t(`options.fieldsOfStudy.${field}`)}</option>
                      ))}
                    </select>
                  </div>

                  {/* University Filter */}
                  <div>
                    <h3 className="font-semibold text-sm mb-3 text-foreground">
                      {t('filters.university')}
                    </h3>
                    <select
                      className="w-full p-2 border border-border rounded-md text-sm bg-card text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                      value={selectedUniversity}
                      onChange={(e) => setSelectedUniversity(e.target.value)}
                    >
                      <option value="">{t('filters.allUniversities')}</option>
                      <optgroup label={t('filters.institutionTypes.universities')}>
                        {institutionGroups.universities.map((uni) => (
                          <option key={uni} value={uni}>{uni}</option>
                        ))}
                      </optgroup>
                      <optgroup label={t('filters.institutionTypes.its')}>
                        {institutionGroups.its.map((uni) => (
                          <option key={uni} value={uni}>{uni}</option>
                        ))}
                      </optgroup>
                      <optgroup label={t('filters.institutionTypes.highSchools')}>
                        {institutionGroups.highSchools.map((uni) => (
                          <option key={uni} value={uni}>{uni}</option>
                        ))}
                      </optgroup>
                    </select>
                  </div>

                  {/* Location Filter */}
                  <div>
                    <h3 className="font-semibold text-sm mb-3 text-foreground">
                      {t('filters.location')}
                    </h3>
                    <select
                      className="w-full p-2 border border-border rounded-md text-sm bg-card text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                    >
                      <option value="">{t('filters.allLocations')}</option>
                      {locations.map((location) => (
                        <option key={location} value={location}>{location}</option>
                      ))}
                    </select>
                  </div>

                  {/* Graduation Year Filter */}
                  <div>
                    <h3 className="font-semibold text-sm mb-3 text-foreground">
                      {t('filters.graduationYear')}
                    </h3>
                    <select
                      className="w-full p-2 border border-border rounded-md text-sm bg-card text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                    >
                      <option value="">{t('filters.allYears')}</option>
                      {years.map((year) => (
                        <option key={year} value={year}>{t('filters.classOf', { year })}</option>
                      ))}
                    </select>
                  </div>

                  {/* Language Filter */}
                  <div>
                    <h3 className="font-semibold text-sm mb-3 text-foreground">
                      {t('filters.language')}
                    </h3>
                    <select
                      className="w-full p-2 border border-border rounded-md text-sm bg-card text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                    >
                      <option value="">{t('filters.allLanguages')}</option>
                      {languages.map((lang) => (
                        <option key={lang} value={lang}>{lang}</option>
                      ))}
                    </select>
                  </div>

                  {/* Availability Filter */}
                  <div>
                    <h3 className="font-semibold text-sm mb-3 text-foreground">
                      {t('filters.availability')}
                    </h3>
                    <select
                      className="w-full p-2 border border-border rounded-md text-sm bg-card text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                      value={selectedAvailability}
                      onChange={(e) => setSelectedAvailability(e.target.value)}
                    >
                      <option value="">{t('filters.allAvailability')}</option>
                      {availabilityKeys.map((option) => (
                        <option key={option} value={option}>{t(`options.availability.${option}`)}</option>
                      ))}
                    </select>
                  </div>

                  {/* Verification Status */}
                  <div>
                    <h3 className="font-semibold text-sm mb-3 text-foreground">
                      {t('filters.verification')}
                    </h3>
                    <div className="space-y-2">
                      <Button
                        variant={verificationFilter === '100' ? 'default' : 'outline'}
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => setVerificationFilter(verificationFilter === '100' ? '' : '100')}
                      >
                        {t('filters.fullyVerified')}
                      </Button>
                      <Button
                        variant={verificationFilter === '90+' ? 'default' : 'outline'}
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => setVerificationFilter(verificationFilter === '90+' ? '' : '90+')}
                      >
                        {t('filters.highlyVerified')}
                      </Button>
                    </div>
                  </div>

                  {/* Skills Filter */}
                  <div>
                    <h3 className="font-semibold text-sm mb-3 text-foreground">
                      {t('filters.skills', { count: allSkills.length })}
                    </h3>

                    {/* Skills Search */}
                    <Input
                      type="text"
                      placeholder={t('filters.searchSkills')}
                      className="mb-3 text-sm bg-card text-foreground border-border"
                      value={skillSearchQuery}
                      onChange={(e) => setSkillSearchQuery(e.target.value)}
                    />

                    {/* Categorized Skills List */}
                    <div className="max-h-96 overflow-y-auto pr-2 space-y-1">
                      {skillSearchQuery ? (
                        // Flat filtered view when searching
                        <>
                          {allSkills
                            .filter(skill =>
                              skill.toLowerCase().includes(skillSearchQuery.toLowerCase())
                            )
                            .map((skill) => (
                              <Badge
                                key={skill}
                                variant={selectedSkill === skill ? 'default' : 'outline'}
                                className="cursor-pointer hover:bg-primary hover:text-white transition-colors mr-1 mb-1.5 inline-flex text-xs"
                                onClick={() => setSelectedSkill(selectedSkill === skill ? '' : skill)}
                              >
                                {skill}
                              </Badge>
                            ))}
                          {allSkills.filter(skill =>
                            skill.toLowerCase().includes(skillSearchQuery.toLowerCase())
                          ).length === 0 && (
                            <p className="text-sm text-muted-foreground text-center py-4">
                              {t('filters.noSkillsFound', { query: skillSearchQuery })}
                            </p>
                          )}
                        </>
                      ) : (
                        // Categorized accordion view
                        <div className="space-y-1">
                          {Object.entries(skillCategories).map(([categoryKey, skills]) => (
                            <div key={categoryKey} className="border border-border rounded-md overflow-hidden">
                              <button
                                type="button"
                                className="w-full flex items-center justify-between px-2.5 py-2 text-xs font-semibold text-foreground hover:bg-muted/50 transition-colors"
                                onClick={() => toggleCategory(categoryKey)}
                              >
                                <span>{t(`filters.skillCategories.${categoryKey}`)}</span>
                                <span className="flex items-center gap-1 text-muted-foreground">
                                  <span className="text-[10px]">{skills.length}</span>
                                  {expandedCategories[categoryKey]
                                    ? <ChevronDown className="h-3.5 w-3.5" />
                                    : <ChevronRight className="h-3.5 w-3.5" />
                                  }
                                </span>
                              </button>
                              {expandedCategories[categoryKey] && (
                                <div className="px-2.5 pb-2 pt-1 border-t border-border bg-muted/20">
                                  {skills.map((skill) => (
                                    <Badge
                                      key={skill}
                                      variant={selectedSkill === skill ? 'default' : 'outline'}
                                      className="cursor-pointer hover:bg-primary hover:text-white transition-colors mr-1 mb-1.5 inline-flex text-xs"
                                      onClick={() => setSelectedSkill(selectedSkill === skill ? '' : skill)}
                                    >
                                      {skill}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </aside>

            {/* Results */}
            <div className="flex-1">
              {/* Results Header */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-foreground">
                  {loading ? t('results.loading') : t('results.studentsFound', { count: students.length })}
                </h2>
                {hasActiveFilters && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {t('results.filtered')}
                  </p>
                )}
              </div>

              {/* Students Grid */}
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-4 text-muted-foreground">{t('results.loadingPortfolios')}</p>
                </div>
              ) : students.length === 0 ? (
                <div className="space-y-6">
                  {/* Primary: if filters active, offer to clear */}
                  {hasActiveFilters ? (
                    <Card className="p-12 text-center bg-card hover:shadow-lg transition-shadow">
                      <Search className="h-16 w-16 text-muted-foreground/60 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-foreground mb-2">{t('empty.title')}</h3>
                      <p className="text-muted-foreground mb-6">{t('empty.description')}</p>
                      <Button onClick={clearFilters}>{t('empty.clearFilters')}</Button>
                    </Card>
                  ) : (
                    /* No filters, database is just empty — redirect to demo */
                    <Card className="p-12 text-center bg-primary/5 border-2 border-primary/20">
                      <div className="mx-auto mb-4 flex justify-center">
                        <Transparenty size={140} mood="thinking" />
                      </div>
                      <h3 className="text-2xl font-bold text-foreground mb-3">{t('empty.pilotTitle')}</h3>
                      <p className="text-muted-foreground mb-2 max-w-lg mx-auto">{t('empty.pilotDescription')}</p>
                      <p className="text-sm text-primary font-medium mb-8">{t('empty.pilotCta')}</p>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button size="lg" asChild>
                          <Link href="/demo/ai-search">
                            <Search className="mr-2 h-5 w-5" />
                            {t('empty.tryDemo')}
                          </Link>
                        </Button>
                        <Button size="lg" variant="outline" asChild>
                          <Link href="/contact?subject=founding-partner">
                            {t('empty.foundingPartner')}
                          </Link>
                        </Button>
                      </div>
                    </Card>
                  )}
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {students.map((student, index) => (
                    <motion.div
                      key={student.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card className="bg-card hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/30 h-full">
                        <CardHeader>
                          <div className="flex items-start gap-4">
                            <Avatar className="w-16 h-16 border-2 border-white shadow-md">
                              <AvatarImage src={student.photo} alt={`${student.firstName} ${student.lastName}`} />
                              <AvatarFallback className="text-lg bg-primary text-white">
                                {student.firstName[0]}{student.lastName[0]}
                              </AvatarFallback>
                            </Avatar>

                            <div className="flex-1">
                              <CardTitle className="text-lg mb-1">
                                {student.firstName} {student.lastName}
                              </CardTitle>
                              <div className="space-y-1 text-sm text-muted-foreground">
                                <div>{student.university}</div>
                                <div>{student.degree}</div>
                                <div>{t('card.classOf', { year: student.graduationYear })}</div>
                              </div>
                              <div className="mt-1.5">
                                <TrustScoreBadge userId={student.id} compact />
                              </div>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          {/* Stats */}
                          <div className="grid grid-cols-3 gap-2 text-center py-2 bg-muted rounded-lg">
                            <div>
                              <div className="text-xl font-bold text-primary">{student.projectsCount}</div>
                              <div className="text-xs text-muted-foreground">{t('card.stats.projects')}</div>
                            </div>
                            <div>
                              <div className="text-xl font-bold text-primary">{student.verificationScore}%</div>
                              <div className="text-xs text-muted-foreground">{t('card.stats.verified')}</div>
                            </div>
                            <div>
                              <div className="text-xl font-bold text-primary">{student.skillsCount}</div>
                              <div className="text-xs text-muted-foreground">{t('card.stats.skills')}</div>
                            </div>
                          </div>

                          {/* Top Skills */}
                          <div>
                            <p className="text-xs font-medium text-foreground/80 mb-2">{t('card.topSkills')}</p>
                            <div className="flex flex-wrap gap-2">
                              {student.topSkills.slice(0, 3).map((skill) => (
                                <Badge key={skill} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* View Portfolio Button */}
                          <Button className="w-full" asChild>
                            <Link href={`/students/${student.username}/public`}>
                              {t('card.viewPortfolio')}
                              <ExternalLink className="h-4 w-4 ml-2" />
                            </Link>
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <section className="bg-primary text-primary-foreground py-16 mt-12">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">
              {t('cta.title')}
            </h2>
            <p className="text-xl text-white/90 mb-8">
              {t('cta.subtitle')}
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/auth/register?role=student">
                {t('cta.createPortfolio')}
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
