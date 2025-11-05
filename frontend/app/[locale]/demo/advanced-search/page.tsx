'use client'

import { useState } from 'react'
import { Link } from '@/navigation'
import { useTranslations } from 'next-intl'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Sparkles,
  Search,
  SlidersHorizontal,
  MapPin,
  GraduationCap,
  Building2,
  Users,
  Briefcase,
  DollarSign,
  Clock,
  Star,
  TrendingUp,
  Filter,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { motion } from 'framer-motion'

type DemoType = 'student' | 'company' | 'university'

// Mock data
const mockJobs = [
  // Italy
  { id: '1', title: 'Frontend Developer', company: 'TechStartup', location: 'Milan, IT', salary: '€35,000 - €45,000', type: 'Full-time', match: 94, posted: '2 days ago', applicants: 45 },
  { id: '2', title: 'Junior Software Engineer', company: 'InnovateCo', location: 'Remote', salary: '€30,000 - €40,000', type: 'Full-time', match: 89, posted: '1 week ago', applicants: 120 },
  { id: '101', title: 'Stage Curriculare - Software Development', company: 'Microsoft Italia', location: 'Milan, IT', salary: '€800/month', type: 'Internship', duration: '6 months', match: 96, posted: '3 days ago', applicants: 89, validForDegree: true },
  { id: '102', title: 'Tirocinio Data Science', company: 'IBM Rome', location: 'Rome, IT', salary: '€900/month', type: 'Internship', duration: '6 months', match: 93, posted: '5 days ago', applicants: 67, validForDegree: true },
  { id: '3', title: 'React Developer', company: 'StartupHub', location: 'Rome, IT', salary: '€32,000 - €42,000', type: 'Full-time', match: 87, posted: '1 week ago', applicants: 78 },

  // Germany
  { id: '201', title: 'Software Engineer', company: 'SAP Berlin', location: 'Berlin, DE', salary: '€50,000 - €65,000', type: 'Full-time', match: 92, posted: '4 days ago', applicants: 156 },
  { id: '202', title: 'Data Analyst', company: 'BMW Munich', location: 'Munich, DE', salary: '€48,000 - €60,000', type: 'Full-time', match: 88, posted: '1 week ago', applicants: 89 },

  // France
  { id: '301', title: 'Full Stack Developer', company: 'BlaBlaCar', location: 'Paris, FR', salary: '€42,000 - €55,000', type: 'Full-time', match: 91, posted: '5 days ago', applicants: 203 },
  { id: '302', title: 'Machine Learning Engineer', company: 'Criteo', location: 'Paris, FR', salary: '€50,000 - €70,000', type: 'Full-time', match: 95, posted: '3 days ago', applicants: 178 },

  // Netherlands
  { id: '401', title: 'Backend Developer', company: 'Booking.com', location: 'Amsterdam, NL', salary: '€55,000 - €70,000', type: 'Full-time', match: 93, posted: '2 days ago', applicants: 234 },

  // Spain
  { id: '501', title: 'UX Designer', company: 'Glovo', location: 'Barcelona, ES', salary: '€35,000 - €45,000', type: 'Full-time', match: 86, posted: '1 week ago', applicants: 67 },

  // UK
  { id: '601', title: 'DevOps Engineer', company: 'Revolut', location: 'London, UK', salary: '£50,000 - £65,000', type: 'Full-time', match: 90, posted: '6 days ago', applicants: 312 },
]

const mockCandidates = [
  { id: '1', initials: 'M.R.', university: 'Politecnico di Milano', major: 'Cybersecurity', gpa: 30, field: 'STEM', skills: ['Network Security', 'Python', 'Cryptography'], softSkills: ['Problem-solving', 'Teamwork'], courses: ['Cybersecurity', 'Algorithms & Data Structures', 'Computer Networks'], projects: ['Machine Learning Model', 'Capstone Project'], match: 96, available: true },
  { id: '2', initials: 'S.B.', university: 'Sapienza Roma', major: 'Computer Science', gpa: 29, field: 'STEM', skills: ['Cybersecurity', 'Linux', 'Ethical Hacking'], softSkills: ['Leadership', 'Communication'], courses: ['Operating Systems', 'Database Systems', 'Software Engineering'], projects: ['Web Application', 'Thesis'], match: 92, available: true },
  { id: '3', initials: 'L.V.', university: 'Politecnico di Torino', major: 'Software Engineering', gpa: 29, field: 'STEM', skills: ['Network Security', 'Java', 'Cloud'], softSkills: ['Analytical', 'Detail-oriented'], courses: ['Software Engineering', 'Mobile App Development', 'Web Development'], projects: ['Mobile App', 'API/Backend Service'], match: 89, available: true },
  { id: '4', initials: 'G.M.', university: 'Bocconi Milano', major: 'Business Administration', gpa: 28, field: 'Business', skills: ['Financial Analysis', 'Market Research', 'Excel', 'PowerPoint'], softSkills: ['Strategic Thinking', 'Negotiation'], courses: ['Business Strategy', 'Financial Accounting', 'Marketing Management'], projects: ['Business Plan', 'Market Research'], match: 94, available: true },
  { id: '5', initials: 'A.F.', university: 'Sapienza Roma', major: 'Law', gpa: 29, field: 'Legal', skills: ['Contract Law', 'Corporate Law', 'Legal Research', 'Compliance'], softSkills: ['Attention to Detail', 'Critical Thinking'], courses: ['Contract Law', 'Constitutional Law', 'International Relations'], projects: ['Legal Research', 'Thesis'], match: 91, available: true },
  { id: '6', initials: 'E.C.', university: 'Università di Bologna', major: 'Economics & Finance', gpa: 28, field: 'Business', skills: ['Financial Modeling', 'Data Analysis', 'Bloomberg Terminal', 'Risk Management'], softSkills: ['Analytical', 'Decision-making'], courses: ['Corporate Finance', 'Statistics', 'Financial Accounting'], projects: ['Financial Model', 'Data Analysis'], match: 93, available: true },
  { id: '7', initials: 'F.P.', university: 'Politecnico di Milano', major: 'Mechanical Engineering', gpa: 27, field: 'Engineering', skills: ['CAD', 'SolidWorks', 'Simulation', 'Manufacturing'], softSkills: ['Problem-solving', 'Innovation'], courses: ['CAD/CAM', 'Thermodynamics', 'Fluid Mechanics'], projects: ['Engineering Design', 'Capstone Project'], match: 88, available: true },
  { id: '8', initials: 'C.R.', university: 'Università di Firenze', major: 'Marketing & Communications', gpa: 28, field: 'Business', skills: ['Digital Marketing', 'SEO', 'Social Media', 'Content Strategy'], softSkills: ['Creativity', 'Communication'], courses: ['Marketing Management', 'Business Strategy', 'Entrepreneurship'], projects: ['Market Research', 'Social Impact'], match: 90, available: true },
  { id: '9', initials: 'D.S.', university: 'Università di Padova', major: 'Psychology', gpa: 29, field: 'Humanities', skills: ['Clinical Assessment', 'Research Methods', 'SPSS', 'Counseling'], softSkills: ['Empathy', 'Active Listening'], courses: ['Research Methods', 'Statistics', 'Public Policy'], projects: ['Scientific Research', 'Thesis'], match: 87, available: true },
  { id: '10', initials: 'M.T.', university: 'Politecnico di Torino', major: 'Civil Engineering', gpa: 27, field: 'Engineering', skills: ['AutoCAD', 'Project Management', 'Structural Analysis', 'BIM'], softSkills: ['Teamwork', 'Leadership'], courses: ['Structural Engineering', 'Project Management', 'CAD/CAM'], projects: ['Engineering Design', 'Group Project'], match: 86, available: true },
  { id: '11', initials: 'L.B.', university: 'IULM Milano', major: 'Graphic Design', gpa: 28, field: 'Creative', skills: ['Adobe Creative Suite', 'UI/UX', 'Branding', 'Typography'], softSkills: ['Creativity', 'Attention to Detail'], courses: ['Web Development', 'Marketing Management'], projects: ['UI/UX Design', 'Web Application'], match: 92, available: true },
  { id: '12', initials: 'P.G.', university: 'Università di Bologna', major: 'International Relations', gpa: 29, field: 'Humanities', skills: ['Geopolitical Analysis', 'Policy Research', 'Multilingual', 'Diplomacy'], softSkills: ['Cross-cultural Communication', 'Negotiation'], courses: ['International Relations', 'Public Policy', 'Research Methods'], projects: ['Scientific Research', 'Thesis'], match: 85, available: true },
]

const universities = [
  'Politecnico di Milano',
  'Sapienza Roma',
  'Università di Bologna',
  'Politecnico di Torino',
  'Università degli Studi di Padova',
  'Università degli Studi di Firenze',
  'Bocconi Milano',
  'IULM Milano',
  'Università Cattolica',
  'Università di Pisa'
]

const cities = [
  // Italy
  'Milan', 'Rome', 'Turin', 'Florence', 'Bologna', 'Naples',
  // Europe
  'Berlin', 'Munich', 'Paris', 'Lyon', 'Amsterdam', 'Rotterdam',
  'Barcelona', 'Madrid', 'London', 'Manchester', 'Vienna', 'Brussels',
  'Dublin', 'Lisbon', 'Prague', 'Copenhagen', 'Stockholm', 'Remote'
]

const fields = [
  'STEM',
  'Business',
  'Engineering',
  'Legal',
  'Humanities',
  'Creative',
  'Medical',
  'Social Sciences'
]

const majors = [
  // STEM
  'Computer Science',
  'Software Engineering',
  'Data Science',
  'Cybersecurity',
  'Artificial Intelligence',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',

  // Business
  'Business Administration',
  'Economics & Finance',
  'Marketing & Communications',
  'Management',
  'Accounting',
  'International Business',

  // Engineering
  'Mechanical Engineering',
  'Civil Engineering',
  'Electrical Engineering',
  'Chemical Engineering',
  'Industrial Engineering',
  'Aerospace Engineering',

  // Legal & Humanities
  'Law',
  'Political Science',
  'International Relations',
  'Philosophy',
  'History',
  'Literature',

  // Creative & Social
  'Graphic Design',
  'Architecture',
  'Psychology',
  'Sociology',
  'Education',
  'Communication Studies'
]

const courses = [
  // STEM Courses
  'Algorithms & Data Structures',
  'Machine Learning',
  'Database Systems',
  'Software Engineering',
  'Computer Networks',
  'Operating Systems',
  'Artificial Intelligence',
  'Web Development',
  'Mobile App Development',
  'Cybersecurity',

  // Business Courses
  'Financial Accounting',
  'Corporate Finance',
  'Marketing Management',
  'Business Strategy',
  'Organizational Behavior',
  'Operations Management',
  'International Business',
  'Entrepreneurship',

  // Engineering Courses
  'Structural Engineering',
  'Thermodynamics',
  'Fluid Mechanics',
  'Control Systems',
  'CAD/CAM',
  'Project Management',

  // Legal & Humanities
  'Contract Law',
  'Constitutional Law',
  'International Relations',
  'Research Methods',
  'Statistics',
  'Public Policy'
]

const projectTypes = [
  'Web Application',
  'Mobile App',
  'Machine Learning Model',
  'Data Analysis',
  'Desktop Software',
  'Blockchain/DeFi',
  'IoT System',
  'Game Development',
  'API/Backend Service',
  'UI/UX Design',
  'Business Plan',
  'Market Research',
  'Financial Model',
  'Legal Research',
  'Engineering Design',
  'Scientific Research',
  'Social Impact',
  'Capstone Project',
  'Thesis',
  'Group Project'
]

const skillsByField = {
  'STEM': ['JavaScript', 'Python', 'Java', 'C++', 'React', 'Node.js', 'SQL', 'Machine Learning', 'Data Analysis', 'R'],
  'Business': ['Financial Analysis', 'Market Research', 'Excel', 'PowerPoint', 'Financial Modeling', 'Business Strategy', 'SAP', 'CRM', 'Project Management', 'Budgeting'],
  'Engineering': ['CAD', 'SolidWorks', 'AutoCAD', 'MATLAB', 'Simulation', 'Manufacturing', 'BIM', 'Structural Analysis', '3D Modeling', 'Technical Drawing'],
  'Legal': ['Contract Law', 'Corporate Law', 'Legal Research', 'Compliance', 'Litigation', 'IP Law', 'Tax Law', 'Labor Law', 'Legal Writing', 'Case Analysis'],
  'Creative': ['Adobe Creative Suite', 'UI/UX', 'Branding', 'Typography', 'Figma', 'Illustration', 'Video Editing', '3D Design', 'Photography', 'Motion Graphics'],
  'Humanities': ['Research Methods', 'Academic Writing', 'Critical Thinking', 'Policy Analysis', 'Geopolitical Analysis', 'Multilingual', 'Archival Research', 'Public Speaking', 'Teaching', 'Content Creation'],
  'Medical': ['Clinical Assessment', 'Patient Care', 'Medical Research', 'Diagnostics', 'Pharmacology', 'Surgery', 'EMR Systems', 'Anatomy', 'Pathology', 'Medical Ethics'],
  'Social Sciences': ['SPSS', 'Qualitative Research', 'Survey Design', 'Statistical Analysis', 'Counseling', 'Social Work', 'Community Outreach', 'Grant Writing', 'Program Evaluation', 'Ethnography']
}

// Flatten all skills for display
const allSkills = Object.values(skillsByField).flat()

export default function AdvancedSearchPage() {
  const t = useTranslations('advancedSearchDemo')
  const [activeDemo, setActiveDemo] = useState<DemoType>('student')
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(true)
  const [universitySearchType, setUniversitySearchType] = useState<'students' | 'companies'>('students')

  // Student filters
  const [jobType, setJobType] = useState<string[]>([])
  const [selectedCities, setSelectedCities] = useState<string[]>([])
  const [salaryRange, setSalaryRange] = useState<[number, number]>([0, 100000])

  // Company filters
  const [selectedUniversities, setSelectedUniversities] = useState<string[]>([])
  const [selectedFields, setSelectedFields] = useState<string[]>([])
  const [selectedMajors, setSelectedMajors] = useState<string[]>([])
  const [gpaMin, setGpaMin] = useState(24)
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [selectedCourses, setSelectedCourses] = useState<string[]>([])
  const [selectedProjectTypes, setSelectedProjectTypes] = useState<string[]>([])

  const demoConfig = {
    student: {
      title: t('demoTitles.student.title'),
      subtitle: t('demoTitles.student.subtitle'),
      color: 'from-teal-600 to-blue-600',
      icon: GraduationCap,
      results: mockJobs,
      totalCount: t('demoTitles.student.totalCount')
    },
    company: {
      title: t('demoTitles.company.title'),
      subtitle: t('demoTitles.company.subtitle'),
      color: 'from-blue-600 to-purple-600',
      icon: Building2,
      results: mockCandidates,
      totalCount: t('demoTitles.company.totalCount')
    },
    university: {
      title: universitySearchType === 'students' ? t('demoTitles.university.titleStudents') : t('demoTitles.university.titleJobs'),
      subtitle: universitySearchType === 'students'
        ? t('demoTitles.university.subtitleStudents')
        : t('demoTitles.university.subtitleJobs'),
      color: 'from-indigo-600 to-purple-600',
      icon: Users,
      results: universitySearchType === 'students' ? mockCandidates : mockJobs,
      totalCount: universitySearchType === 'students' ? t('demoTitles.university.totalCountStudents') : t('demoTitles.university.totalCountJobs')
    }
  }

  const config = demoConfig[activeDemo]
  const Icon = config.icon

  const toggleFilter = (arr: string[], value: string, setter: (val: string[]) => void) => {
    if (arr.includes(value)) {
      setter(arr.filter(v => v !== value))
    } else {
      setter([...arr, value])
    }
  }

  const clearAllFilters = () => {
    setJobType([])
    setSelectedCities([])
    setSalaryRange([0, 100000])
    setSelectedUniversities([])
    setSelectedFields([])
    setSelectedMajors([])
    setGpaMin(24)
    setSelectedSkills([])
    setSelectedCourses([])
    setSelectedProjectTypes([])
    setSearchQuery('')
  }

  const activeFiltersCount = jobType.length + selectedCities.length +
    selectedUniversities.length + selectedFields.length + selectedMajors.length +
    selectedSkills.length + selectedCourses.length + selectedProjectTypes.length

  return (
    <div className="min-h-screen hero-bg">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8 pt-24">
        {/* Hero Banner */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border-2 border-primary/30 rounded-full px-6 py-2 mb-4 shadow-sm">
            <SlidersHorizontal className="h-5 w-5 text-primary" />
            <span className="font-bold text-foreground">{t('heroBanner')}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
            {config.totalCount}{' '}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {t('verifiedResults')}
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {/* Demo Selector */}
        <Tabs value={activeDemo} onValueChange={(v) => setActiveDemo(v as DemoType)} className="mb-6">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3">
            <TabsTrigger value="student" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              {t('tabs.student')}
            </TabsTrigger>
            <TabsTrigger value="company" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              {t('tabs.company')}
            </TabsTrigger>
            <TabsTrigger value="university" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              {t('tabs.university')}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* University Search Type Toggle */}
        {activeDemo === 'university' && (
          <div className="mb-6 flex justify-center gap-4">
            <Button
              variant={universitySearchType === 'students' ? 'default' : 'outline'}
              onClick={() => setUniversitySearchType('students')}
              className={universitySearchType === 'students' ? 'bg-gradient-to-r from-primary to-secondary' : ''}
            >
              <Users className="h-4 w-4 mr-2" />
              {t('universityToggle.searchStudents')}
            </Button>
            <Button
              variant={universitySearchType === 'companies' ? 'default' : 'outline'}
              onClick={() => setUniversitySearchType('companies')}
              className={universitySearchType === 'companies' ? 'bg-gradient-to-r from-primary to-secondary' : ''}
            >
              <Briefcase className="h-4 w-4 mr-2" />
              {t('universityToggle.searchCompanies')}
            </Button>
          </div>
        )}

        {/* Search Bar */}
        <Card className="mb-6 shadow-lg">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    activeDemo === 'student'
                      ? t('searchPlaceholders.student')
                      : activeDemo === 'company'
                      ? t('searchPlaceholders.company')
                      : universitySearchType === 'students'
                      ? t('searchPlaceholders.universityStudents')
                      : t('searchPlaceholders.universityJobs')
                  }
                  className="pl-10 h-12 text-base"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="h-12 px-6"
              >
                <SlidersHorizontal className="h-5 w-5 mr-2" />
                {t('filters.title')}
                {activeFiltersCount > 0 && (
                  <Badge className="ml-2 bg-gradient-to-r from-primary to-secondary text-white">{activeFiltersCount}</Badge>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1 space-y-4"
            >
              <Card className="shadow-lg">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{t('filters.title')}</CardTitle>
                    {activeFiltersCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearAllFilters}
                        className="text-primary hover:text-primary/80"
                      >
                        {t('filters.clearAll')}
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Student Filters */}
                  {activeDemo === 'student' && (
                    <>
                      {/* Job Type */}
                      <div>
                        <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                          <Briefcase className="h-4 w-4" />
                          {t('filters.jobType.title')}
                        </h3>
                        <div className="space-y-2">
                          {[
                            { key: 'fullTime', label: t('filters.jobType.fullTime') },
                            { key: 'internship', label: t('filters.jobType.internship') },
                            { key: 'partTime', label: t('filters.jobType.partTime') },
                            { key: 'remote', label: t('filters.jobType.remote') }
                          ].map((type) => (
                            <label key={type.key} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={jobType.includes(type.label)}
                                onChange={() => toggleFilter(jobType, type.label, setJobType)}
                                className="rounded border-gray-300"
                              />
                              <span className="text-sm">{type.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Location */}
                      <div>
                        <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {t('filters.location.title')}
                        </h3>
                        <div className="space-y-2">
                          {cities.map((city) => (
                            <label key={city} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={selectedCities.includes(city)}
                                onChange={() => toggleFilter(selectedCities, city, setSelectedCities)}
                                className="rounded border-gray-300"
                              />
                              <span className="text-sm">{city}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Salary Range */}
                      <div>
                        <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          {t('filters.salaryRange.title')}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          €{salaryRange[0].toLocaleString()} - €{salaryRange[1].toLocaleString()}
                        </p>
                        <input
                          type="range"
                          min="0"
                          max="100000"
                          step="5000"
                          value={salaryRange[1]}
                          onChange={(e) => setSalaryRange([0, parseInt(e.target.value)])}
                          className="w-full"
                        />
                      </div>
                    </>
                  )}

                  {/* Company Filters */}
                  {activeDemo === 'company' && (
                    <>
                      {/* Field/Discipline */}
                      <div>
                        <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                          <Briefcase className="h-4 w-4" />
                          {t('filters.field.title')}
                        </h3>
                        <div className="space-y-2">
                          {fields.map((field) => (
                            <label key={field} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={selectedFields.includes(field)}
                                onChange={() => toggleFilter(selectedFields, field, setSelectedFields)}
                                className="rounded border-gray-300"
                              />
                              <span className="text-sm">{field}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* University */}
                      <div>
                        <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                          <GraduationCap className="h-4 w-4" />
                          {t('filters.university.title')}
                        </h3>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {universities.map((uni) => (
                            <label key={uni} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={selectedUniversities.includes(uni)}
                                onChange={() => toggleFilter(selectedUniversities, uni, setSelectedUniversities)}
                                className="rounded border-gray-300"
                              />
                              <span className="text-sm">{uni}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Major */}
                      <div>
                        <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                          <Star className="h-4 w-4" />
                          {t('filters.major.title')}
                        </h3>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {majors.map((major) => (
                            <label key={major} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={selectedMajors.includes(major)}
                                onChange={() => toggleFilter(selectedMajors, major, setSelectedMajors)}
                                className="rounded border-gray-300"
                              />
                              <span className="text-sm text-gray-700">{major}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* GPA */}
                      <div>
                        <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                          <TrendingUp className="h-4 w-4" />
                          {t('filters.gpa.title')}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">{gpaMin}/30</p>
                        <input
                          type="range"
                          min="18"
                          max="30"
                          value={gpaMin}
                          onChange={(e) => setGpaMin(parseInt(e.target.value))}
                          className="w-full"
                        />
                      </div>

                      {/* Skills */}
                      <div>
                        <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                          <Filter className="h-4 w-4" />
                          {t('filters.skills.title')}
                        </h3>
                        <p className="text-xs text-gray-500 mb-2">{t('filters.skills.subtitle')}</p>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {allSkills.slice(0, 20).map((skill) => (
                            <label key={skill} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={selectedSkills.includes(skill)}
                                onChange={() => toggleFilter(selectedSkills, skill, setSelectedSkills)}
                                className="rounded border-gray-300"
                              />
                              <span className="text-sm text-gray-700">{skill}</span>
                            </label>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">{allSkills.length}+ {t('filters.skills.available')}</p>
                      </div>

                      {/* Courses */}
                      <div>
                        <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                          <GraduationCap className="h-4 w-4" />
                          {t('filters.courses.title')}
                        </h3>
                        <p className="text-xs text-gray-500 mb-2">{t('filters.courses.subtitle')}</p>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {courses.map((course) => (
                            <label key={course} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={selectedCourses.includes(course)}
                                onChange={() => toggleFilter(selectedCourses, course, setSelectedCourses)}
                                className="rounded border-gray-300"
                              />
                              <span className="text-sm text-gray-700">{course}</span>
                            </label>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">{courses.length} {t('filters.courses.available')}</p>
                      </div>

                      {/* Project Types */}
                      <div>
                        <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                          <Briefcase className="h-4 w-4" />
                          {t('filters.projectTypes.title')}
                        </h3>
                        <p className="text-xs text-gray-500 mb-2">{t('filters.projectTypes.subtitle')}</p>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {projectTypes.map((projectType) => (
                            <label key={projectType} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={selectedProjectTypes.includes(projectType)}
                                onChange={() => toggleFilter(selectedProjectTypes, projectType, setSelectedProjectTypes)}
                                className="rounded border-gray-300"
                              />
                              <span className="text-sm text-gray-700">{projectType}</span>
                            </label>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">{projectTypes.length} {t('filters.projectTypes.available')}</p>
                      </div>
                    </>
                  )}

                  {/* University Filters */}
                  {activeDemo === 'university' && (
                    <>
                      {universitySearchType === 'students' ? (
                        <>
                          {/* Same filters as company search */}
                          {/* Field/Discipline */}
                          <div>
                            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                              <Briefcase className="h-4 w-4" />
                              {t('filters.field.title')}
                            </h3>
                            <div className="space-y-2">
                              {fields.map((field) => (
                                <label key={field} className="flex items-center gap-2 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={selectedFields.includes(field)}
                                    onChange={() => toggleFilter(selectedFields, field, setSelectedFields)}
                                    className="rounded border-gray-300"
                                  />
                                  <span className="text-sm">{field}</span>
                                </label>
                              ))}
                            </div>
                          </div>

                          {/* Major */}
                          <div>
                            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                              <Star className="h-4 w-4" />
                              {t('filters.major.title')}
                            </h3>
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                              {majors.map((major) => (
                                <label key={major} className="flex items-center gap-2 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={selectedMajors.includes(major)}
                                    onChange={() => toggleFilter(selectedMajors, major, setSelectedMajors)}
                                    className="rounded border-gray-300"
                                  />
                                  <span className="text-sm text-gray-700">{major}</span>
                                </label>
                              ))}
                            </div>
                          </div>

                          {/* GPA */}
                          <div>
                            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                              <TrendingUp className="h-4 w-4" />
                              {t('filters.gpa.title')}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">{gpaMin}/30</p>
                            <input
                              type="range"
                              min="18"
                              max="30"
                              value={gpaMin}
                              onChange={(e) => setGpaMin(parseInt(e.target.value))}
                              className="w-full"
                            />
                          </div>

                          {/* Skills */}
                          <div>
                            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                              <Filter className="h-4 w-4" />
                              {t('filters.skills.title')}
                            </h3>
                            <p className="text-xs text-gray-500 mb-2">{t('filters.skills.subtitle')}</p>
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                              {allSkills.slice(0, 20).map((skill) => (
                                <label key={skill} className="flex items-center gap-2 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={selectedSkills.includes(skill)}
                                    onChange={() => toggleFilter(selectedSkills, skill, setSelectedSkills)}
                                    className="rounded border-gray-300"
                                  />
                                  <span className="text-sm text-gray-700">{skill}</span>
                                </label>
                              ))}
                            </div>
                            <p className="text-xs text-gray-500 mt-2">{allSkills.length}+ {t('filters.skills.available')}</p>
                          </div>

                          {/* Courses */}
                          <div>
                            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                              <GraduationCap className="h-4 w-4" />
                              {t('filters.courses.title')}
                            </h3>
                            <p className="text-xs text-gray-500 mb-2">{t('filters.courses.subtitle')}</p>
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                              {courses.map((course) => (
                                <label key={course} className="flex items-center gap-2 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={selectedCourses.includes(course)}
                                    onChange={() => toggleFilter(selectedCourses, course, setSelectedCourses)}
                                    className="rounded border-gray-300"
                                  />
                                  <span className="text-sm text-gray-700">{course}</span>
                                </label>
                              ))}
                            </div>
                            <p className="text-xs text-gray-500 mt-2">{courses.length} {t('filters.courses.available')}</p>
                          </div>

                          {/* Project Types */}
                          <div>
                            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                              <Briefcase className="h-4 w-4" />
                              {t('filters.projectTypes.title')}
                            </h3>
                            <p className="text-xs text-gray-500 mb-2">{t('filters.projectTypes.subtitle')}</p>
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                              {projectTypes.map((projectType) => (
                                <label key={projectType} className="flex items-center gap-2 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={selectedProjectTypes.includes(projectType)}
                                    onChange={() => toggleFilter(selectedProjectTypes, projectType, setSelectedProjectTypes)}
                                    className="rounded border-gray-300"
                                  />
                                  <span className="text-sm text-gray-700">{projectType}</span>
                                </label>
                              ))}
                            </div>
                            <p className="text-xs text-gray-500 mt-2">{projectTypes.length} {t('filters.projectTypes.available')}</p>
                          </div>
                        </>
                      ) : (
                        <>
                          {/* Job Type */}
                          <div>
                            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                              <Briefcase className="h-4 w-4" />
                              {t('filters.jobType.title')}
                            </h3>
                            <div className="space-y-2">
                              {[
                                { key: 'fullTime', label: t('filters.jobType.fullTime') },
                                { key: 'internship', label: t('filters.jobType.internship') },
                                { key: 'partTime', label: t('filters.jobType.partTime') },
                                { key: 'remote', label: t('filters.jobType.remote') }
                              ].map((type) => (
                                <label key={type.key} className="flex items-center gap-2 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={jobType.includes(type.label)}
                                    onChange={() => toggleFilter(jobType, type.label, setJobType)}
                                    className="rounded border-gray-300"
                                  />
                                  <span className="text-sm">{type.label}</span>
                                </label>
                              ))}
                            </div>
                          </div>

                          {/* Location */}
                          <div>
                            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              {t('filters.location.titleEurope')}
                            </h3>
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                              {cities.map((city) => (
                                <label key={city} className="flex items-center gap-2 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={selectedCities.includes(city)}
                                    onChange={() => toggleFilter(selectedCities, city, setSelectedCities)}
                                    className="rounded border-gray-300"
                                  />
                                  <span className="text-sm">{city}</span>
                                </label>
                              ))}
                            </div>
                          </div>

                          {/* Salary Range */}
                          <div>
                            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                              <DollarSign className="h-4 w-4" />
                              {t('filters.salaryRange.title')}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">
                              €{salaryRange[0].toLocaleString()} - €{salaryRange[1].toLocaleString()}
                            </p>
                            <input
                              type="range"
                              min="0"
                              max="100000"
                              step="5000"
                              value={salaryRange[1]}
                              onChange={(e) => setSalaryRange([0, parseInt(e.target.value)])}
                              className="w-full"
                            />
                          </div>
                        </>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Results */}
          <div className={showFilters ? 'lg:col-span-3' : 'lg:col-span-4'}>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-gray-600">
                <span className="font-bold text-gray-900">{config.results.length}</span> {t('results.found')}
                {activeFiltersCount > 0 && ` ${t('results.withFilters', { count: activeFiltersCount })}`}
                {activeDemo === 'company' && <span className="text-primary ml-2">• {t('results.allDisciplines')}</span>}
              </p>
              <Button variant="outline" size="sm">
                <Clock className="h-4 w-4 mr-2" />
                {t('results.sortBy')}
              </Button>
            </div>

            <div className="space-y-4">
              {config.results.map((result: any) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      {/* Job Result */}
                      {result.title && (
                        <div className="flex justify-between">
                          <div className="flex-1">
                            <div className="flex items-start gap-3">
                              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${config.color} flex items-center justify-center text-white font-bold`}>
                                {result.company[0]}
                              </div>
                              <div className="flex-1">
                                <h3 className="text-xl font-bold text-gray-900 mb-1">{result.title}</h3>
                                <p className="text-gray-600 mb-2">{result.company}</p>
                                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-3">
                                  <span className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    {result.location}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <DollarSign className="h-4 w-4" />
                                    {result.salary}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    {result.posted}
                                  </span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  <Badge className="bg-blue-100 text-blue-800">{result.type}</Badge>
                                  {result.validForDegree && (
                                    <Badge className="bg-purple-100 text-purple-800">✓ {t('jobCard.validForDegree')}</Badge>
                                  )}
                                  {result.duration && (
                                    <Badge className="bg-gray-100 text-gray-800">{result.duration}</Badge>
                                  )}
                                  <Badge className="bg-gray-100 text-gray-700">{result.applicants} {t('jobCard.applicants')}</Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="ml-4 flex flex-col items-end justify-between">
                            <Badge className="bg-green-100 text-green-800 text-base px-3 py-1">
                              {result.match}% {t('jobCard.match')}
                            </Badge>
                            <Button className={`bg-gradient-to-r ${config.color}`}>
                              {t('jobCard.applyNow')}
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Candidate Result */}
                      {result.initials && (
                        <div className="flex justify-between">
                          <div className="flex items-start gap-4">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-teal-400 to-blue-500 flex items-center justify-center text-white font-bold text-xl">
                              {result.initials}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-lg font-bold text-gray-900">{t('candidateCard.contactLocked')}</h3>
                                <Badge className="bg-green-100 text-green-800 text-xs">{t('candidateCard.available')}</Badge>
                              </div>
                              <p className="text-gray-600 mb-2">{result.university}</p>
                              <p className="text-sm text-gray-700 mb-3">
                                <strong>{t('candidateCard.major')}:</strong> {result.major} • <strong>{t('candidateCard.gpa')}:</strong> {result.gpa}/30
                              </p>
                              <div className="mb-2">
                                <p className="text-sm font-semibold text-gray-700 mb-1">{t('candidateCard.technicalSkills')}:</p>
                                <div className="flex flex-wrap gap-1">
                                  {result.skills.map((skill: string) => (
                                    <Badge key={skill} className="bg-blue-100 text-blue-800 text-xs">
                                      {skill}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <div className="mb-2">
                                <p className="text-sm font-semibold text-gray-700 mb-1">{t('candidateCard.softSkills')}:</p>
                                <div className="flex flex-wrap gap-1">
                                  {result.softSkills.map((skill: string) => (
                                    <Badge key={skill} className="bg-purple-100 text-purple-800 text-xs">
                                      {skill}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              {result.courses && (
                                <div className="mb-2">
                                  <p className="text-sm font-semibold text-gray-700 mb-1">{t('candidateCard.relevantCourses')}:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {result.courses.map((course: string) => (
                                      <Badge key={course} className="bg-green-100 text-green-800 text-xs">
                                        {course}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {result.projects && (
                                <div>
                                  <p className="text-sm font-semibold text-gray-700 mb-1">{t('candidateCard.projectExperience')}:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {result.projects.map((project: string) => (
                                      <Badge key={project} className="bg-orange-100 text-orange-800 text-xs">
                                        {project}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="ml-4 flex flex-col items-end justify-between">
                            <Badge className="bg-green-100 text-green-800 text-base px-3 py-1 mb-2">
                              {result.match}% {t('candidateCard.match')}
                            </Badge>
                            <Button className={`bg-gradient-to-r ${config.color}`}>
                              {t('candidateCard.unlock')}
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Load More */}
            <div className="mt-8 text-center">
              <p className="text-gray-600 mb-4">
                {t('loadMore.showing', { current: config.results.length, total: config.totalCount })}
              </p>
              <Button variant="outline" size="lg" className="px-8">
                {t('loadMore.button')}
              </Button>
              <p className="text-sm text-gray-500 mt-4">
                {t('loadMore.registerPrompt')}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
