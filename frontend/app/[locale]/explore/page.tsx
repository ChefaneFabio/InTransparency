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
import {
  Search,
  GraduationCap,
  MapPin,
  Calendar,
  Award,
  ExternalLink,
  Filter,
  X,
  Users,
  BookOpen,
  Globe,
  Briefcase,
  Shield
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { IMAGES } from '@/lib/images'

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

  const universities = ['Politecnico di Milano', 'Università di Bologna', 'Sapienza Università di Roma', 'Politecnico di Torino', 'Università di Padova']
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
    'Available',
    'Open to offers',
    'Not looking'
  ]

  // Comprehensive skills covering all disciplines
  const popularSkills = [
    // === ENGINEERING & TECHNOLOGY ===
    // Programming
    'Python', 'JavaScript', 'Java', 'C++', 'C#', 'SQL', 'R', 'MATLAB',
    // Software Development
    'React', 'Node.js', 'Machine Learning', 'Data Analysis', 'AWS', 'Docker',
    // Engineering
    'CAD', 'AutoCAD', 'SolidWorks', 'CATIA', 'Revit', 'Civil 3D',
    'Structural Analysis', 'FEM/FEA', 'CFD', 'ANSYS', 'Simulink',
    'PLC Programming', 'SCADA', 'Industrial Automation', 'Robotics',
    'Electrical Design', 'PCB Design', 'Embedded Systems', 'IoT',
    'BIM', 'GIS', 'Project Engineering', 'Quality Control',

    // === BUSINESS & MANAGEMENT ===
    'Business Strategy', 'Business Development', 'Market Analysis', 'Competitive Analysis',
    'Financial Modeling', 'Budgeting', 'Forecasting', 'Business Planning',
    'Operations Management', 'Supply Chain', 'Logistics', 'Procurement',
    'Project Management', 'Agile', 'Scrum', 'Lean Six Sigma',
    'Change Management', 'Risk Management', 'Stakeholder Management',
    'Consulting', 'Management Consulting', 'Strategy Consulting',

    // === FINANCE & ACCOUNTING ===
    'Financial Analysis', 'Financial Reporting', 'IFRS', 'GAAP',
    'Accounting', 'Auditing', 'Tax Planning', 'Corporate Finance',
    'Investment Analysis', 'Portfolio Management', 'Valuation', 'M&A',
    'Risk Analysis', 'Credit Analysis', 'Treasury', 'Controlling',
    'SAP', 'Bloomberg Terminal', 'Excel Advanced', 'Power BI',

    // === MARKETING & COMMUNICATIONS ===
    'Digital Marketing', 'SEO', 'SEM', 'Social Media Marketing',
    'Content Marketing', 'Brand Management', 'Product Marketing',
    'Marketing Strategy', 'Market Research', 'Consumer Insights',
    'Public Relations', 'Corporate Communications', 'Event Management',
    'Copywriting', 'Content Creation', 'Video Production', 'Photography',
    'Google Analytics', 'HubSpot', 'Salesforce',

    // === DESIGN & CREATIVE ===
    'Graphic Design', 'UI/UX Design', 'Web Design', 'Brand Identity',
    'Adobe Photoshop', 'Adobe Illustrator', 'Adobe InDesign', 'Figma', 'Sketch',
    'Motion Graphics', 'Video Editing', 'Adobe Premiere', 'After Effects',
    '3D Modeling', 'Blender', 'Maya', 'Cinema 4D', 'Rendering',
    'Interior Design', 'Product Design', 'Fashion Design', 'Packaging Design',

    // === HEALTHCARE & LIFE SCIENCES ===
    'Clinical Research', 'Clinical Trials', 'GCP', 'Regulatory Affairs',
    'Medical Writing', 'Pharmacovigilance', 'Drug Development',
    'Laboratory Techniques', 'PCR', 'HPLC', 'Mass Spectrometry',
    'Biotechnology', 'Molecular Biology', 'Cell Culture', 'Bioinformatics',
    'Healthcare Management', 'Patient Care', 'Medical Imaging',
    'Nursing', 'Physiotherapy', 'Nutrition', 'Public Health',

    // === LAW & LEGAL ===
    'Legal Research', 'Contract Law', 'Corporate Law', 'Commercial Law',
    'Intellectual Property', 'Patent Law', 'Trademark', 'Copyright',
    'Labor Law', 'Employment Law', 'GDPR', 'Privacy Law',
    'Litigation', 'Legal Writing', 'Due Diligence', 'Compliance',

    // === SCIENCES ===
    'Research Methodology', 'Statistical Analysis', 'SPSS', 'Stata',
    'Laboratory Management', 'Scientific Writing', 'Peer Review',
    'Physics', 'Chemistry', 'Biology', 'Environmental Science',
    'Geology', 'Materials Science', 'Nanotechnology',

    // === EDUCATION & TRAINING ===
    'Teaching', 'Curriculum Development', 'Instructional Design',
    'E-Learning', 'Training Delivery', 'Educational Technology',
    'Assessment Design', 'Student Mentoring', 'Academic Writing',

    // === LANGUAGES ===
    'English', 'Italian', 'Spanish', 'French', 'German', 'Chinese', 'Arabic',
    'Translation', 'Interpretation', 'Localization', 'Technical Translation',

    // === SOFT SKILLS ===
    'Leadership', 'Team Management', 'Communication', 'Presentation',
    'Negotiation', 'Problem Solving', 'Critical Thinking', 'Analytical Thinking',
    'Creativity', 'Innovation', 'Adaptability', 'Time Management',
    'Emotional Intelligence', 'Conflict Resolution', 'Cross-cultural Communication',

    // === HOSPITALITY & TOURISM ===
    'Hotel Management', 'Event Planning', 'Tourism Management',
    'Customer Service', 'Front Office', 'Food & Beverage',

    // === AGRICULTURE & ENVIRONMENT ===
    'Agronomy', 'Sustainable Agriculture', 'Food Science',
    'Environmental Management', 'Sustainability', 'Renewable Energy',
    'Waste Management', 'Water Management', 'Climate Science'
  ]

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (searchQuery) params.set('search', searchQuery)
        if (selectedUniversity) params.set('university', selectedUniversity)
        if (selectedYear) params.set('year', selectedYear)
        if (selectedSkill) params.set('skill', selectedSkill)

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

      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="hero-bg py-20 relative overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 opacity-5">
            <Image
              src={IMAGES.students.student2}
              alt="Background pattern"
              fill
              className="object-cover"
            />
          </div>
          <div className="container max-w-5xl relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <Users className="h-4 w-4" />
                {t('hero.badge')}
              </div>
              <h1 className="text-5xl font-display font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {t('hero.title')}
              </h1>
              <p className="text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto mb-8">
                {t('hero.subtitle')}
              </p>

              {/* Search Bar */}
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder={t('hero.searchPlaceholder')}
                  className="pl-12 py-6 text-lg bg-white text-gray-900 shadow-md border-2 hover:border-primary/30 transition-colors"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Quick Stats */}
              {students.length > 0 && (
                <div className="flex justify-center space-x-8 mt-12">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">{students.length}</div>
                    <div className="text-sm text-gray-700">{t('hero.stats.students')}</div>
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
              <Card className="sticky top-4 bg-white hover:shadow-lg transition-shadow border-2">
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
                    <h3 className="font-semibold text-sm mb-3 flex items-center gap-2 text-gray-900">
                      <BookOpen className="h-4 w-4" />
                      {t('filters.fieldOfStudy')}
                    </h3>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-md text-sm bg-white text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
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
                    <h3 className="font-semibold text-sm mb-3 flex items-center gap-2 text-gray-900">
                      <GraduationCap className="h-4 w-4" />
                      {t('filters.university')}
                    </h3>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-md text-sm bg-white text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                      value={selectedUniversity}
                      onChange={(e) => setSelectedUniversity(e.target.value)}
                    >
                      <option value="">{t('filters.allUniversities')}</option>
                      {universities.map((uni) => (
                        <option key={uni} value={uni}>{uni}</option>
                      ))}
                    </select>
                  </div>

                  {/* Location Filter */}
                  <div>
                    <h3 className="font-semibold text-sm mb-3 flex items-center gap-2 text-gray-900">
                      <MapPin className="h-4 w-4" />
                      {t('filters.location')}
                    </h3>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-md text-sm bg-white text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
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
                    <h3 className="font-semibold text-sm mb-3 flex items-center gap-2 text-gray-900">
                      <Calendar className="h-4 w-4" />
                      {t('filters.graduationYear')}
                    </h3>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-md text-sm bg-white text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
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
                    <h3 className="font-semibold text-sm mb-3 flex items-center gap-2 text-gray-900">
                      <Globe className="h-4 w-4" />
                      {t('filters.language')}
                    </h3>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-md text-sm bg-white text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
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
                    <h3 className="font-semibold text-sm mb-3 flex items-center gap-2 text-gray-900">
                      <Briefcase className="h-4 w-4" />
                      {t('filters.availability')}
                    </h3>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-md text-sm bg-white text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
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
                    <h3 className="font-semibold text-sm mb-3 flex items-center gap-2 text-gray-900">
                      <Shield className="h-4 w-4" />
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
                    <h3 className="font-semibold text-sm mb-3 flex items-center gap-2 text-gray-900">
                      <Award className="h-4 w-4" />
                      {t('filters.skills', { count: popularSkills.length })}
                    </h3>

                    {/* Skills Search */}
                    <Input
                      type="text"
                      placeholder={t('filters.searchSkills')}
                      className="mb-3 text-sm bg-white text-gray-900 border-gray-300"
                      value={skillSearchQuery}
                      onChange={(e) => setSkillSearchQuery(e.target.value)}
                    />

                    {/* Skills List */}
                    <div className="max-h-96 overflow-y-auto pr-2 space-y-1">
                      {popularSkills
                        .filter(skill =>
                          skill.toLowerCase().includes(skillSearchQuery.toLowerCase())
                        )
                        .map((skill) => (
                          <Badge
                            key={skill}
                            variant={selectedSkill === skill ? 'default' : 'outline'}
                            className="cursor-pointer hover:bg-primary hover:text-white transition-colors mr-2 mb-2 inline-flex"
                            onClick={() => setSelectedSkill(selectedSkill === skill ? '' : skill)}
                          >
                            {skill}
                          </Badge>
                        ))}
                      {popularSkills.filter(skill =>
                        skill.toLowerCase().includes(skillSearchQuery.toLowerCase())
                      ).length === 0 && (
                        <p className="text-sm text-gray-500 text-center py-4">
                          {t('filters.noSkillsFound', { query: skillSearchQuery })}
                        </p>
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
                <h2 className="text-2xl font-bold text-gray-900">
                  {loading ? t('results.loading') : t('results.studentsFound', { count: students.length })}
                </h2>
                {hasActiveFilters && (
                  <p className="text-sm text-gray-600 mt-1">
                    {t('results.filtered')}
                  </p>
                )}
              </div>

              {/* Students Grid */}
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-4 text-gray-600">{t('results.loadingPortfolios')}</p>
                </div>
              ) : students.length === 0 ? (
                <Card className="p-12 text-center bg-white hover:shadow-lg transition-shadow">
                  <GraduationCap className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('empty.title')}</h3>
                  <p className="text-gray-600 mb-6">{t('empty.description')}</p>
                  <Button onClick={clearFilters}>{t('empty.clearFilters')}</Button>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {students.map((student, index) => (
                    <motion.div
                      key={student.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card className="bg-white hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/30 h-full">
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
                              <div className="space-y-1 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <GraduationCap className="h-3 w-3" />
                                  {student.university}
                                </div>
                                <div>{student.degree}</div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {t('card.classOf', { year: student.graduationYear })}
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          {/* Stats */}
                          <div className="grid grid-cols-3 gap-2 text-center py-2 bg-gray-50 rounded-lg">
                            <div>
                              <div className="text-xl font-bold text-primary">{student.projectsCount}</div>
                              <div className="text-xs text-gray-600">{t('card.stats.projects')}</div>
                            </div>
                            <div>
                              <div className="text-xl font-bold text-green-600">{student.verificationScore}%</div>
                              <div className="text-xs text-gray-600">{t('card.stats.verified')}</div>
                            </div>
                            <div>
                              <div className="text-xl font-bold text-blue-600">{student.skillsCount}</div>
                              <div className="text-xs text-gray-600">{t('card.stats.skills')}</div>
                            </div>
                          </div>

                          {/* Top Skills */}
                          <div>
                            <p className="text-xs font-medium text-gray-700 mb-2">{t('card.topSkills')}</p>
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
        <section className="bg-gradient-to-r from-primary to-secondary text-white py-16 mt-12">
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
