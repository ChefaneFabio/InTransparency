'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { allCandidates, type Candidate } from '@/lib/mock-candidates'
import {
  MapPin,
  Search,
  Filter,
  Users,
  GraduationCap,
  Building,
  Star,
  Eye,
  MessageSquare,
  Bookmark,
  Layers,
  Target,
  Zap,
  Globe,
  Calendar,
  Award,
  TrendingUp,
  BarChart3,
  Settings,
  Download,
  RefreshCw,
  Maximize,
  Minimize,
  Plus,
  Minus,
  Navigation,
  Compass,
  MapIcon,
  Satellite,
  Route,
  Code,
  BookOpen,
  Briefcase
} from 'lucide-react'

export default function RecruiterGeographicSearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilters, setSelectedFilters] = useState({
    // Basic Filters
    category: 'all', // all, students, graduates, researchers, faculty
    skills: [] as string[],
    universities: [] as string[],
    countries: [] as string[],

    // Experience & Career
    minExperience: 0,
    maxExperience: 20,
    seniority: [] as string[], // intern, junior, mid, senior, lead, principal
    industries: [] as string[],
    companySize: [] as string[], // startup, small, medium, large, enterprise

    // Education
    degrees: [] as string[], // bachelors, masters, phd, bootcamp
    majors: [] as string[],
    minGPA: 0,
    graduationYears: [] as number[],
    certifications: [] as string[],

    // Technical Skills
    programmingLanguages: [] as string[],
    frameworks: [] as string[],
    databases: [] as string[],
    cloudPlatforms: [] as string[],
    tools: [] as string[],
    skillLevel: 'any', // any, beginner, intermediate, advanced, expert

    // Projects & Portfolio
    minProjects: 0,
    githubRequired: false,
    minGithubStars: 0,
    portfolioRequired: false,
    openSource: false,

    // Work Preferences
    availability: 'all', // all, immediate, 2weeks, 1month, 3months
    workType: [] as string[], // remote, hybrid, onsite
    willingToRelocate: 'any', // any, yes, no
    timeZone: [] as string[],

    // Legal & Visa
    visaStatus: [] as string[], // citizen, permanent_resident, work_visa, needs_sponsorship
    requiresSponsorship: 'any',
    securityClearance: [] as string[],

    // Compensation
    minSalary: 0,
    maxSalary: 500000,
    currency: 'USD',
    equityAccepted: 'any',

    // Languages
    spokenLanguages: [] as string[],
    languageProficiency: 'any', // any, basic, professional, native

    // Diversity & Inclusion
    diversityFilters: {
      underrepresented: false,
      firstGeneration: false,
      veteran: false,
      disabilities: false
    },

    // Distance & Location
    maxDistance: 0, // 0 = no limit, or in km
    specificCities: [] as string[]
  })
  const [mapView, setMapView] = useState<'satellite' | 'street' | 'terrain' | 'density'>('density')
  const [heatmapEnabled, setHeatmapEnabled] = useState(true)
  const [selectedLocation, setSelectedLocation] = useState<any>(null)
  const [mapZoom, setMapZoom] = useState(6)
  const [showTalentDetails, setShowTalentDetails] = useState(false)
  const [showCandidates, setShowCandidates] = useState(true)
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)

  const globalTalentHubs = [
    {
      id: 1,
      city: 'San Francisco Bay Area',
      country: 'USA',
      coordinates: { lat: 37.7749, lng: -122.4194 },
      totalTalent: 89234,
      students: 34567,
      graduates: 28943,
      experienced: 25724,
      topUniversities: ['Stanford', 'UC Berkeley', 'UCSF'],
      topSkills: ['AI/ML', 'Software Engineering', 'Data Science', 'Product Management'],
      averageSalary: '$145,000',
      visaFriendly: true,
      timeZone: 'PST',
      languagesPrimary: ['English'],
      talentDensity: 'very-high',
      recruitmentDifficulty: 'high',
      costOfLiving: 'very-high'
    },
    {
      id: 2,
      city: 'Boston',
      country: 'USA',
      coordinates: { lat: 42.3601, lng: -71.0589 },
      totalTalent: 76543,
      students: 28934,
      graduates: 23456,
      experienced: 24153,
      topUniversities: ['MIT', 'Harvard', 'Boston University'],
      topSkills: ['Biotech', 'AI/ML', 'Software Engineering', 'Research'],
      averageSalary: '$125,000',
      visaFriendly: true,
      timeZone: 'EST',
      languagesPrimary: ['English'],
      talentDensity: 'very-high',
      recruitmentDifficulty: 'high',
      costOfLiving: 'high'
    },
    {
      id: 3,
      city: 'London',
      country: 'UK',
      coordinates: { lat: 51.5074, lng: -0.1278 },
      totalTalent: 134567,
      students: 45678,
      graduates: 38924,
      experienced: 49965,
      topUniversities: ['Oxford', 'Cambridge', 'Imperial College', 'UCL'],
      topSkills: ['FinTech', 'AI/ML', 'Software Engineering', 'Business'],
      averageSalary: '£85,000',
      visaFriendly: false,
      timeZone: 'GMT',
      languagesPrimary: ['English'],
      talentDensity: 'very-high',
      recruitmentDifficulty: 'medium',
      costOfLiving: 'very-high'
    },
    {
      id: 4,
      city: 'Berlin',
      country: 'Germany',
      coordinates: { lat: 52.5200, lng: 13.4050 },
      totalTalent: 67834,
      students: 23456,
      graduates: 21938,
      experienced: 22440,
      topUniversities: ['TU Berlin', 'Humboldt University', 'Free University Berlin'],
      topSkills: ['Software Engineering', 'AI/ML', 'Automotive Tech', 'Green Tech'],
      averageSalary: '€75,000',
      visaFriendly: true,
      timeZone: 'CET',
      languagesPrimary: ['German', 'English'],
      talentDensity: 'high',
      recruitmentDifficulty: 'medium',
      costOfLiving: 'medium'
    },
    {
      id: 5,
      city: 'Zurich',
      country: 'Switzerland',
      coordinates: { lat: 47.3769, lng: 8.5417 },
      totalTalent: 34567,
      students: 12890,
      graduates: 10234,
      experienced: 11443,
      topUniversities: ['ETH Zurich', 'University of Zurich'],
      topSkills: ['FinTech', 'AI/ML', 'Software Engineering', 'Blockchain'],
      averageSalary: 'CHF 120,000',
      visaFriendly: false,
      timeZone: 'CET',
      languagesPrimary: ['German', 'English', 'French'],
      talentDensity: 'high',
      recruitmentDifficulty: 'high',
      costOfLiving: 'very-high'
    },
    {
      id: 6,
      city: 'Toronto',
      country: 'Canada',
      coordinates: { lat: 43.6532, lng: -79.3832 },
      totalTalent: 89234,
      students: 32145,
      graduates: 27834,
      experienced: 29255,
      topUniversities: ['University of Toronto', 'York University', 'Ryerson'],
      topSkills: ['AI/ML', 'FinTech', 'Software Engineering', 'Biotech'],
      averageSalary: 'CAD 95,000',
      visaFriendly: true,
      timeZone: 'EST',
      languagesPrimary: ['English', 'French'],
      talentDensity: 'high',
      recruitmentDifficulty: 'medium',
      costOfLiving: 'high'
    },
    {
      id: 7,
      city: 'Singapore',
      country: 'Singapore',
      coordinates: { lat: 1.3521, lng: 103.8198 },
      totalTalent: 45678,
      students: 16789,
      graduates: 14234,
      experienced: 14655,
      topUniversities: ['NUS', 'NTU', 'Singapore Management University'],
      topSkills: ['FinTech', 'AI/ML', 'Software Engineering', 'Blockchain'],
      averageSalary: 'SGD 85,000',
      visaFriendly: true,
      timeZone: 'SGT',
      languagesPrimary: ['English', 'Mandarin', 'Malay'],
      talentDensity: 'very-high',
      recruitmentDifficulty: 'medium',
      costOfLiving: 'high'
    },
    {
      id: 8,
      city: 'Sydney',
      country: 'Australia',
      coordinates: { lat: -33.8688, lng: 151.2093 },
      totalTalent: 56789,
      students: 19876,
      graduates: 17234,
      experienced: 19679,
      topUniversities: ['University of Sydney', 'UNSW', 'University of Technology Sydney'],
      topSkills: ['Software Engineering', 'AI/ML', 'Mining Tech', 'FinTech'],
      averageSalary: 'AUD 95,000',
      visaFriendly: true,
      timeZone: 'AEST',
      languagesPrimary: ['English'],
      talentDensity: 'high',
      recruitmentDifficulty: 'medium',
      costOfLiving: 'high'
    }
  ]

  const skillsFilter = [
    'Software Engineering', 'AI & Machine Learning', 'Data Science', 'Product Management',
    'FinTech', 'Biotech', 'Blockchain', 'DevOps', 'Cybersecurity', 'UX/UI Design',
    'Full Stack Development', 'Mobile Development', 'Cloud Computing', 'Research'
  ]

  const countries = [
    'USA', 'UK', 'Germany', 'Canada', 'Australia', 'Singapore', 'Switzerland',
    'Netherlands', 'France', 'Sweden', 'Norway', 'Denmark', 'Japan', 'South Korea'
  ]

  // Comprehensive Filter Options
  const seniorityLevels = [
    'Intern', 'Entry Level', 'Junior (1-2 years)', 'Mid Level (3-5 years)',
    'Senior (5-8 years)', 'Lead (8-12 years)', 'Principal/Staff (12+ years)', 'Executive'
  ]

  const industries = [
    'FinTech', 'Healthcare/Biotech', 'E-Commerce', 'SaaS', 'Enterprise Software',
    'Gaming', 'EdTech', 'Automotive', 'Aerospace', 'Robotics', 'IoT', 'Blockchain/Crypto',
    'Cybersecurity', 'AI/ML Research', 'Consulting', 'Government/Defense', 'Non-Profit'
  ]

  const companySizes = [
    'Startup (1-10)', 'Small (11-50)', 'Medium (51-250)',
    'Large (251-1000)', 'Enterprise (1000+)', 'Fortune 500'
  ]

  const degrees = [
    'High School', 'Associate', 'Bachelors', 'Masters', 'MBA', 'PhD',
    'Bootcamp Graduate', 'Self-Taught', 'Online Certification'
  ]

  const majors = [
    'Computer Science', 'Software Engineering', 'Data Science', 'Information Systems',
    'Computer Engineering', 'Electrical Engineering', 'Mathematics', 'Statistics',
    'Physics', 'Artificial Intelligence', 'Machine Learning', 'Cybersecurity',
    'Business Administration', 'Economics', 'Design', 'Other Engineering'
  ]

  const certifications = [
    'AWS Certified', 'Azure Certified', 'GCP Certified', 'PMP', 'Scrum Master',
    'Security+', 'CISSP', 'OSCP', 'CKA (Kubernetes)', 'Terraform Associate',
    'Google Analytics', 'Salesforce Admin', 'Six Sigma', 'ITIL'
  ]

  const programmingLanguages = [
    'JavaScript/TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust',
    'Swift', 'Kotlin', 'PHP', 'Ruby', 'Scala', 'R', 'MATLAB', 'SQL'
  ]

  const frameworks = [
    'React', 'Angular', 'Vue.js', 'Next.js', 'Node.js', 'Django', 'Flask',
    'Spring Boot', 'ASP.NET', 'Ruby on Rails', 'Laravel', 'Express.js',
    'FastAPI', 'Svelte', 'Flutter', 'React Native', 'TensorFlow', 'PyTorch'
  ]

  const databases = [
    'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch', 'Cassandra',
    'DynamoDB', 'Oracle', 'SQL Server', 'Neo4j', 'CouchDB', 'Firebase'
  ]

  const cloudPlatforms = [
    'AWS', 'Microsoft Azure', 'Google Cloud (GCP)', 'DigitalOcean', 'Heroku',
    'Vercel', 'Netlify', 'IBM Cloud', 'Oracle Cloud', 'Alibaba Cloud'
  ]

  const tools = [
    'Docker', 'Kubernetes', 'Git', 'Jenkins', 'CircleCI', 'GitHub Actions',
    'Terraform', 'Ansible', 'Grafana', 'Prometheus', 'Datadog', 'New Relic',
    'Jira', 'Confluence', 'Figma', 'Adobe XD', 'Postman', 'VS Code'
  ]

  const workTypes = ['Remote Only', 'Hybrid', 'On-Site', 'Flexible']

  const timeZones = [
    'PST/PDT (UTC-8/-7)', 'MST/MDT (UTC-7/-6)', 'CST/CDT (UTC-6/-5)', 'EST/EDT (UTC-5/-4)',
    'GMT/BST (UTC+0/+1)', 'CET/CEST (UTC+1/+2)', 'IST (UTC+5:30)', 'CST China (UTC+8)',
    'JST (UTC+9)', 'AEST/AEDT (UTC+10/+11)'
  ]

  const visaStatuses = [
    'US Citizen', 'US Permanent Resident (Green Card)', 'Canadian Citizen',
    'EU Citizen', 'UK Citizen', 'H1-B Visa', 'TN Visa', 'OPT/CPT',
    'Requires H1-B Sponsorship', 'Requires Work Permit'
  ]

  const securityClearances = [
    'None Required', 'Public Trust', 'Confidential', 'Secret', 'Top Secret', 'TS/SCI'
  ]

  const spokenLanguages = [
    'English', 'Spanish', 'Mandarin', 'French', 'German', 'Arabic', 'Hindi',
    'Portuguese', 'Russian', 'Japanese', 'Korean', 'Italian', 'Dutch'
  ]

  const currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'CHF', 'SGD', 'JPY']

  const cities = [
    'San Francisco Bay Area', 'New York City', 'Seattle', 'Austin', 'Boston',
    'Los Angeles', 'Chicago', 'Denver', 'Atlanta', 'London', 'Berlin',
    'Amsterdam', 'Paris', 'Toronto', 'Vancouver', 'Singapore', 'Tokyo',
    'Sydney', 'Melbourne', 'Tel Aviv', 'Bangalore', 'Dublin', 'Stockholm'
  ]

  const getTalentDensityColor = (density: string) => {
    switch (density) {
      case 'very-high': return 'bg-red-500'
      case 'high': return 'bg-orange-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const getRecruitmentDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-400 text-gray-900'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCostOfLivingColor = (cost: string) => {
    switch (cost) {
      case 'very-high': return 'text-red-600'
      case 'high': return 'text-orange-600'
      case 'medium': return 'text-yellow-600'
      case 'low': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  const handleLocationClick = (location: any) => {
    setSelectedLocation(location)
    setShowTalentDetails(true)
  }

  const filteredLocations = globalTalentHubs.filter(location => {
    const matchesSearch = searchQuery === '' ||
      location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.topSkills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
      location.topUniversities.some(uni => uni.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesSkills = selectedFilters.skills.length === 0 ||
      selectedFilters.skills.some(skill => location.topSkills.includes(skill))

    const matchesCountries = selectedFilters.countries.length === 0 ||
      selectedFilters.countries.includes(location.country)

    return matchesSearch && matchesSkills && matchesCountries
  })

  // Dynamic candidate filtering based on comprehensive criteria
  const filteredCandidates = allCandidates.filter(candidate => {
    // Search query matching
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesName = `${candidate.firstName} ${candidate.lastName}`.toLowerCase().includes(query)
      const matchesUniversity = candidate.education.some(edu => edu.university.toLowerCase().includes(query))
      const matchesMajor = candidate.education.some(edu => edu.major.toLowerCase().includes(query))
      const matchesSkill = [
        ...candidate.skills.programming,
        ...candidate.skills.frameworks,
        ...candidate.skills.databases,
        ...candidate.skills.tools
      ].some(skill => skill.toLowerCase().includes(query))
      const matchesProject = candidate.projects.some(p =>
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.technologies.some(t => t.toLowerCase().includes(query))
      )
      const matchesCourse = candidate.education.some(edu =>
        edu.courses.some(course =>
          course.name.toLowerCase().includes(query) ||
          course.code.toLowerCase().includes(query)
        )
      )

      if (!(matchesName || matchesUniversity || matchesMajor || matchesSkill || matchesProject || matchesCourse)) {
        return false
      }
    }

    // University filter
    if (selectedFilters.universities.length > 0) {
      const hasUniversity = candidate.education.some(edu =>
        selectedFilters.universities.includes(edu.university)
      )
      if (!hasUniversity) return false
    }

    // Major filter
    if (selectedFilters.majors.length > 0) {
      const hasMajor = candidate.education.some(edu =>
        selectedFilters.majors.includes(edu.major)
      )
      if (!hasMajor) return false
    }

    // Degree filter
    if (selectedFilters.degrees.length > 0) {
      const hasDegree = candidate.education.some(edu =>
        selectedFilters.degrees.includes(edu.degree)
      )
      if (!hasDegree) return false
    }

    // GPA filter
    if (selectedFilters.minGPA > 0) {
      const hasMinGPA = candidate.education.some(edu => edu.gpa >= selectedFilters.minGPA)
      if (!hasMinGPA) return false
    }

    // Graduation year filter
    if (selectedFilters.graduationYears.length > 0) {
      const hasGradYear = candidate.education.some(edu =>
        selectedFilters.graduationYears.includes(edu.graduationYear)
      )
      if (!hasGradYear) return false
    }

    // Experience filter
    if (selectedFilters.minExperience > 0 || selectedFilters.maxExperience < 20) {
      const yearsOfExperience = candidate.experience.length * 1.5 // Rough approximation
      if (yearsOfExperience < selectedFilters.minExperience || yearsOfExperience > selectedFilters.maxExperience) {
        return false
      }
    }

    // Skills filter - Programming Languages
    if (selectedFilters.programmingLanguages.length > 0) {
      const hasLanguage = selectedFilters.programmingLanguages.some(lang =>
        candidate.skills.programming.some(skill => skill.includes(lang))
      )
      if (!hasLanguage) return false
    }

    // Skills filter - Frameworks
    if (selectedFilters.frameworks.length > 0) {
      const hasFramework = selectedFilters.frameworks.some(fw =>
        candidate.skills.frameworks.some(skill => skill.includes(fw))
      )
      if (!hasFramework) return false
    }

    // Skills filter - Databases
    if (selectedFilters.databases.length > 0) {
      const hasDatabase = selectedFilters.databases.some(db =>
        candidate.skills.databases.some(skill => skill.includes(db))
      )
      if (!hasDatabase) return false
    }

    // Skills filter - Cloud Platforms
    if (selectedFilters.cloudPlatforms.length > 0) {
      const hasCloud = selectedFilters.cloudPlatforms.some(cloud =>
        candidate.skills.tools.some(tool => tool.includes(cloud))
      )
      if (!hasCloud) return false
    }

    // Projects filter
    if (selectedFilters.minProjects > 0) {
      if (candidate.projects.length < selectedFilters.minProjects) return false
    }

    // GitHub filter
    if (selectedFilters.githubRequired && !candidate.githubUrl) {
      return false
    }

    if (selectedFilters.minGithubStars > 0) {
      const totalStars = candidate.projects.reduce((sum, p) => sum + (p.stars || 0), 0)
      if (totalStars < selectedFilters.minGithubStars) return false
    }

    // Portfolio filter
    if (selectedFilters.portfolioRequired && !candidate.portfolioUrl) {
      return false
    }

    // Location filter - Countries
    if (selectedFilters.countries.length > 0) {
      if (!selectedFilters.countries.includes(candidate.location.country)) {
        return false
      }
    }

    // Location filter - Cities
    if (selectedFilters.specificCities.length > 0) {
      if (!selectedFilters.specificCities.includes(candidate.location.city)) {
        return false
      }
    }

    // Work type filter
    if (selectedFilters.workType.length > 0) {
      const hasWorkType = selectedFilters.workType.some(type =>
        candidate.lookingFor.workTypes.includes(type)
      )
      if (!hasWorkType) return false
    }

    // Relocation filter
    if (selectedFilters.willingToRelocate !== 'any') {
      const willing = selectedFilters.willingToRelocate === 'yes'
      if (candidate.lookingFor.willingToRelocate !== willing) return false
    }

    // Visa status filter
    if (selectedFilters.visaStatus.length > 0) {
      const matchesVisa = selectedFilters.visaStatus.some(status =>
        candidate.visaStatus.includes(status)
      )
      if (!matchesVisa) return false
    }

    // Sponsorship filter
    if (selectedFilters.requiresSponsorship !== 'any') {
      const needsSponsorship = selectedFilters.requiresSponsorship === 'yes'
      if (candidate.requiresSponsorship !== needsSponsorship) return false
    }

    // Salary filter
    if (selectedFilters.minSalary > 0 || selectedFilters.maxSalary < 500000) {
      const candidateSalary = candidate.lookingFor.salaryExpectation
      if (candidateSalary.currency === selectedFilters.currency) {
        if (candidateSalary.min > selectedFilters.maxSalary || candidateSalary.max < selectedFilters.minSalary) {
          return false
        }
      }
    }

    // Languages filter
    if (selectedFilters.spokenLanguages.length > 0) {
      const hasLanguage = selectedFilters.spokenLanguages.some(lang =>
        candidate.skills.languages.some(candidateLang => candidateLang.includes(lang))
      )
      if (!hasLanguage) return false
    }

    return true
  })

  const candidateCount = filteredCandidates.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Geographic Talent Search</h1>
        <p className="text-gray-600 mt-2">
          Discover and recruit talent globally with advanced geographic intelligence and market insights
        </p>
      </div>

      {/* Search and Advanced Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 space-y-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-600" />
              <input
                type="text"
                placeholder="Search cities, countries, skills, or universities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Advanced Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
                <select
                  multiple
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm max-h-24"
                  value={selectedFilters.skills}
                  onChange={(e) => {
                    const values = Array.from(e.target.selectedOptions, option => option.value)
                    setSelectedFilters(prev => ({ ...prev, skills: values }))
                  }}
                >
                  {skillsFilter.map(skill => (
                    <option key={skill} value={skill}>{skill}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Countries</label>
                <select
                  multiple
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm max-h-24"
                  value={selectedFilters.countries}
                  onChange={(e) => {
                    const values = Array.from(e.target.selectedOptions, option => option.value)
                    setSelectedFilters(prev => ({ ...prev, countries: values }))
                  }}
                >
                  {countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Visa Status</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  value={selectedFilters.visaStatus.length > 0 ? selectedFilters.visaStatus[0] : 'all'}
                  onChange={(e) => setSelectedFilters(prev => ({ ...prev, visaStatus: e.target.value === 'all' ? [] : [e.target.value] }))}
                >
                  <option value="all">All Visa Statuses</option>
                  <option value="citizen">Citizens Only</option>
                  <option value="work-authorized">Work Authorized</option>
                  <option value="needs-visa">Needs Visa Sponsorship</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  value={selectedFilters.availability}
                  onChange={(e) => setSelectedFilters(prev => ({ ...prev, availability: e.target.value }))}
                >
                  <option value="all">All Availability</option>
                  <option value="immediate">Available Now</option>
                  <option value="1-month">Available in 1 Month</option>
                  <option value="3-months">Available in 3 Months</option>
                  <option value="graduating">Graduating Soon</option>
                </select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Global Talent Map */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Globe className="h-5 w-5 mr-2" />
              Global Talent Distribution
            </CardTitle>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={heatmapEnabled}
                  onCheckedChange={setHeatmapEnabled}
                />
                <span className="text-sm text-gray-600">Heatmap</span>
              </div>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Map Settings
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Map Container */}
          <div className="relative bg-gradient-to-br from-slate-100 via-blue-50 to-green-50 rounded-lg overflow-hidden" style={{ height: '600px' }}>
            {/* Map Controls */}
            <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2">
              <Button size="sm" variant="outline" className="w-8 h-8 p-0" title="Zoom In">
                <Plus className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" className="w-8 h-8 p-0" title="Zoom Out">
                <Minus className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" className="w-8 h-8 p-0" title="Layers">
                <Layers className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" className="w-8 h-8 p-0" title="Fullscreen">
                <Maximize className="h-4 w-4" />
              </Button>
            </div>

            {/* Map View Toggle */}
            <div className="absolute top-4 left-4 z-10 flex space-x-1 bg-white rounded-lg p-1 shadow-sm">
              <button
                onClick={() => setMapView('density')}
                className={`px-3 py-1 text-xs rounded flex items-center ${
                  mapView === 'density' ? 'bg-blue-100 text-blue-700' : 'text-gray-600'
                }`}
              >
                <BarChart3 className="h-3 w-3 mr-1" />
                Density
              </button>
              <button
                onClick={() => setMapView('satellite')}
                className={`px-3 py-1 text-xs rounded flex items-center ${
                  mapView === 'satellite' ? 'bg-blue-100 text-blue-700' : 'text-gray-600'
                }`}
              >
                <Satellite className="h-3 w-3 mr-1" />
                Satellite
              </button>
              <button
                onClick={() => setMapView('street')}
                className={`px-3 py-1 text-xs rounded flex items-center ${
                  mapView === 'street' ? 'bg-blue-100 text-blue-700' : 'text-gray-600'
                }`}
              >
                <MapIcon className="h-3 w-3 mr-1" />
                Street
              </button>
            </div>

            {/* Global Talent Hub Markers */}
            {filteredLocations.map((location, index) => {
              const markerSize = Math.min(Math.max(location.totalTalent / 5000, 12), 32)

              return (
                <div
                  key={location.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                  style={{
                    left: `${15 + (index % 4) * 20}%`,
                    top: `${20 + Math.floor(index / 4) * 30}%`,
                  }}
                  onClick={() => handleLocationClick(location)}
                >
                  {/* Main Marker */}
                  <div
                    className={`rounded-full flex items-center justify-center text-white font-semibold shadow-lg hover:scale-110 transition-all duration-200 ${getTalentDensityColor(location.talentDensity)}`}
                    style={{
                      width: `${markerSize}px`,
                      height: `${markerSize}px`,
                      animation: heatmapEnabled ? `pulse ${2 + index * 0.4}s infinite` : 'none'
                    }}
                  >
                    <Building className="h-4 w-4" />
                  </div>

                  {/* Talent Count Badge */}
                  <div className="absolute -top-2 -right-2 bg-white text-xs font-bold text-gray-800 rounded-full px-1.5 py-0.5 shadow-sm border">
                    {location.totalTalent > 1000 ? `${Math.round(location.totalTalent / 1000)}k` : location.totalTalent}
                  </div>

                  {/* Detailed Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs rounded-lg py-3 px-4 whitespace-nowrap z-20 max-w-xs shadow-xl">
                    <div className="font-semibold text-sm mb-1">{location.city}</div>
                    <div className="text-gray-600 mb-2">{location.country}</div>

                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>Total Talent:</span>
                        <span className="font-medium">{location.totalTalent.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Avg Salary:</span>
                        <span className="font-medium">{location.averageSalary}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Top Skills:</span>
                        <span className="font-medium">{location.topSkills.slice(0, 2).join(', ')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Visa Friendly:</span>
                        <span className={`font-medium ${location.visaFriendly ? 'text-green-300' : 'text-red-300'}`}>
                          {location.visaFriendly ? 'Yes' : 'No'}
                        </span>
                      </div>
                    </div>

                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-black"></div>
                  </div>

                  {/* Ripple Effects for Very High Density */}
                  {location.talentDensity === 'very-high' && heatmapEnabled && (
                    <>
                      <div
                        className="absolute rounded-full bg-red-300 opacity-20 animate-ping"
                        style={{
                          width: `${markerSize + 20}px`,
                          height: `${markerSize + 20}px`,
                          left: '50%',
                          top: '50%',
                          transform: 'translate(-50%, -50%)',
                          animationDuration: '2s'
                        }}
                      />
                      <div
                        className="absolute rounded-full bg-red-400 opacity-15 animate-ping"
                        style={{
                          width: `${markerSize + 40}px`,
                          height: `${markerSize + 40}px`,
                          left: '50%',
                          top: '50%',
                          transform: 'translate(-50%, -50%)',
                          animationDuration: '3s',
                          animationDelay: '0.5s'
                        }}
                      />
                    </>
                  )}
                </div>
              )
            })}

            {/* Map Legend */}
            <div className="absolute bottom-4 left-4 bg-white rounded-lg p-4 shadow-lg max-w-sm">
              <h4 className="font-medium text-gray-900 mb-3">Talent Hub Legend</h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                    <span>Very High Density</span>
                  </div>
                  <span className="text-gray-700">50k+</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                    <span>High Density</span>
                  </div>
                  <span className="text-gray-700">20k-50k</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                    <span>Medium Density</span>
                  </div>
                  <span className="text-gray-700">5k-20k</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span>Low Density</span>
                  </div>
                  <span className="text-gray-700">&lt; 5k</span>
                </div>
              </div>
            </div>

            {/* Search Results Counter */}
            <div className="absolute bottom-4 right-4 bg-white rounded-lg px-4 py-2 shadow-lg">
              <span className="text-sm font-medium text-gray-900">
                {filteredLocations.length} talent hubs found
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Location View */}
      {selectedLocation && showTalentDetails && (
        <Card className="border-l-4 border-blue-500">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                {selectedLocation.city}, {selectedLocation.country}
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTalentDetails(false)}
              >
                ✕
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Talent Statistics */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Talent Overview</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Talent Pool</span>
                    <span className="font-semibold">{selectedLocation.totalTalent.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Students</span>
                    <span className="font-semibold">{selectedLocation.students.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Recent Graduates</span>
                    <span className="font-semibold">{selectedLocation.graduates.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Experienced</span>
                    <span className="font-semibold">{selectedLocation.experienced.toLocaleString()}</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Avg Salary</span>
                    <span className="font-semibold text-green-600">{selectedLocation.averageSalary}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Time Zone</span>
                    <span className="font-semibold">{selectedLocation.timeZone}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Visa Friendly</span>
                    <Badge className={selectedLocation.visaFriendly ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {selectedLocation.visaFriendly ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Skills & Universities */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Top Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedLocation.topSkills.map((skill: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-sm">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Top Universities</h3>
                  <div className="space-y-2">
                    {selectedLocation.topUniversities.map((uni: string, index: number) => (
                      <div key={index} className="flex items-center">
                        <GraduationCap className="h-4 w-4 text-blue-600 mr-2" />
                        <span className="text-sm">{uni}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedLocation.languagesPrimary.map((lang: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Market Intelligence */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Market Intelligence</h3>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-600 text-sm">Talent Density</span>
                      <Badge className={getTalentDensityColor(selectedLocation.talentDensity).replace('bg-', 'bg-opacity-20 text-') + ' border-0'}>
                        {selectedLocation.talentDensity.replace('-', ' ')}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-600 text-sm">Recruitment Difficulty</span>
                      <Badge className={getRecruitmentDifficultyBadge(selectedLocation.recruitmentDifficulty)}>
                        {selectedLocation.recruitmentDifficulty}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-600 text-sm">Cost of Living</span>
                      <span className={`text-sm font-medium ${getCostOfLivingColor(selectedLocation.costOfLiving)}`}>
                        {selectedLocation.costOfLiving.replace('-', ' ')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t space-y-2">
                  <Button className="w-full">
                    <Users className="h-4 w-4 mr-2" />
                    Browse Talent
                  </Button>
                  <Button variant="outline" className="w-full">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Contact Local Recruiters
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Bookmark className="h-4 w-4 mr-2" />
                    Save Location
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Talent Hub Directory */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Global Talent Hub Directory
            </span>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Directory
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLocations.map((location) => (
              <div key={location.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${getTalentDensityColor(location.talentDensity)}`} />
                    <h3 className="text-lg font-semibold text-gray-900">{location.city}</h3>
                    <Badge variant="secondary">{location.country}</Badge>
                    {location.visaFriendly && (
                      <Badge className="bg-green-100 text-green-800">Visa Friendly</Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handleLocationClick(location)}>
                      <Eye className="h-3 w-3 mr-1" />
                      View Details
                    </Button>
                    <Button size="sm">
                      <Users className="h-3 w-3 mr-1" />
                      Browse Talent
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4 text-sm">
                  <div>
                    <p className="text-gray-600">Total Talent</p>
                    <p className="font-semibold">{location.totalTalent.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Avg Salary</p>
                    <p className="font-semibold text-green-600">{location.averageSalary}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Recruitment</p>
                    <Badge className={getRecruitmentDifficultyBadge(location.recruitmentDifficulty)}>
                      {location.recruitmentDifficulty}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-gray-600">Time Zone</p>
                    <p className="font-semibold">{location.timeZone}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Cost of Living</p>
                    <p className={`font-semibold ${getCostOfLivingColor(location.costOfLiving)}`}>
                      {location.costOfLiving.replace('-', ' ')}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Top Skills</p>
                    <div className="flex flex-wrap gap-1">
                      {location.topSkills.map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Top Universities</p>
                    <div className="flex flex-wrap gap-1">
                      {location.topUniversities.map((uni, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {uni}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}