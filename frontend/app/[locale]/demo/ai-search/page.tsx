'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
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
  Send,
  User,
  Bot,
  GraduationCap,
  MapPin,
  Star,
  Award,
  Briefcase,
  Calendar,
  Building2,
  Users,
  CheckCircle,
  ArrowRight,
  Lightbulb,
  Zap,
  DollarSign,
  Clock,
  Target,
  Shield,
  Map as MapIcon,
  List,
  SlidersHorizontal
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { GoogleMapComponent, MapMarker } from '@/components/maps/GoogleMapComponent'

type DemoType = 'student' | 'company' | 'university'

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  results?: any[]
}

const mockResults = {
  studentJobs: [
    { id: '1', title: 'Frontend Developer', company: 'TechStartup', location: 'Milan, IT', salary: '€35,000 - €45,000', type: 'Full-time', match: 94, field: 'tech', coordinates: { lat: 45.4642, lng: 9.1900 } },
    { id: '2', title: 'Full Stack Developer', company: 'TechCo', location: 'Turin, IT', salary: '€38,000 - €48,000', type: 'Full-time', match: 91, field: 'tech', coordinates: { lat: 45.0703, lng: 7.6869 } },
    { id: '3', title: 'Backend Engineer', company: 'DevShop', location: 'Florence, IT', salary: '€35,000 - €45,000', type: 'Full-time', match: 85, field: 'tech', coordinates: { lat: 43.7696, lng: 11.2558 } },
    { id: '4', title: 'Graphic Designer', company: 'CreativeStudio', location: 'Milan, IT', salary: '€28,000 - €36,000', type: 'Full-time', match: 92, field: 'design', coordinates: { lat: 45.4642, lng: 9.1900 } },
    { id: '5', title: 'UX Designer', company: 'DesignLab', location: 'Rome, IT', salary: '€32,000 - €42,000', type: 'Full-time', match: 90, field: 'design', coordinates: { lat: 41.9028, lng: 12.4964 } },
    { id: '6', title: 'Marketing Intern', company: 'BrandCo', location: 'Milan, IT', salary: '€25,000 - €32,000', type: 'Full-time', match: 88, field: 'marketing', coordinates: { lat: 45.4642, lng: 9.1900 } },
    { id: '7', title: 'Digital Marketing Specialist', company: 'MediaGroup', location: 'Rome, IT', salary: '€28,000 - €35,000', type: 'Full-time', match: 86, field: 'marketing', coordinates: { lat: 41.9028, lng: 12.4964 } },
    { id: '8', title: 'Business Analyst', company: 'ConsultingPro', location: 'Milan, IT', salary: '€33,000 - €43,000', type: 'Full-time', match: 89, field: 'business', coordinates: { lat: 45.4642, lng: 9.1900 } },
    { id: '9', title: 'Junior Financial Analyst', company: 'FinanceCo', location: 'Turin, IT', salary: '€30,000 - €38,000', type: 'Full-time', match: 84, field: 'business', coordinates: { lat: 45.0703, lng: 7.6869 } },
    { id: '10', title: 'Legal Assistant', company: 'Studio Legale Bianchi', location: 'Rome, IT', salary: '€26,000 - €34,000', type: 'Full-time', match: 87, field: 'law', coordinates: { lat: 41.9028, lng: 12.4964 } }
  ],
  internships: [
    { id: '101', title: 'Stage Curriculare - Software Development', company: 'Microsoft Italia', location: 'Milan, IT', salary: '€800/month', type: 'Internship', duration: '6 months', match: 96, field: 'tech', coordinates: { lat: 45.4642, lng: 9.1900 }, validForDegree: true },
    { id: '102', title: 'Tirocinio Data Science', company: 'IBM Rome', location: 'Rome, IT', salary: '€900/month', type: 'Internship', duration: '6 months', match: 93, field: 'tech', coordinates: { lat: 41.9028, lng: 12.4964 }, validForDegree: true },
    { id: '103', title: 'Stage in AI/Machine Learning', company: 'Accenture', location: 'Turin, IT', salary: '€850/month', type: 'Internship', duration: '6 months', match: 91, field: 'tech', coordinates: { lat: 45.0703, lng: 7.6869 }, validForDegree: true },
    { id: '104', title: 'Stage Curriculare - Cybersecurity', company: 'Leonardo SpA', location: 'Rome, IT', salary: '€1000/month', type: 'Internship', duration: '6 months', match: 94, field: 'tech', coordinates: { lat: 41.9028, lng: 12.4964 }, validForDegree: true },
    { id: '105', title: 'Stage in Graphic Design', company: 'Publicis Italia', location: 'Milan, IT', salary: '€700/month', type: 'Internship', duration: '6 months', match: 93, field: 'design', coordinates: { lat: 45.4642, lng: 9.1900 }, validForDegree: true },
    { id: '106', title: 'Tirocinio UX/UI Design', company: 'Frog Design', location: 'Milan, IT', salary: '€800/month', type: 'Internship', duration: '6 months', match: 90, field: 'design', coordinates: { lat: 45.4642, lng: 9.1900 }, validForDegree: true },
    { id: '107', title: 'Tirocinio Marketing Digitale', company: 'Mediaset', location: 'Milan, IT', salary: '€750/month', type: 'Internship', duration: '6 months', match: 89, field: 'marketing', coordinates: { lat: 45.4642, lng: 9.1900 }, validForDegree: true },
    { id: '108', title: 'Stage in Comunicazione', company: 'Edelman Italia', location: 'Rome, IT', salary: '€700/month', type: 'Internship', duration: '3-6 months', match: 87, field: 'marketing', coordinates: { lat: 41.9028, lng: 12.4964 }, validForDegree: true },
    { id: '109', title: 'Stage in Consulenza Aziendale', company: 'McKinsey Italy', location: 'Milan, IT', salary: '€1000/month', type: 'Internship', duration: '6 months', match: 95, field: 'business', coordinates: { lat: 45.4642, lng: 9.1900 }, validForDegree: true },
    { id: '110', title: 'Tirocinio Studio Legale', company: 'Bonelli Erede', location: 'Rome, IT', salary: '€800/month', type: 'Internship', duration: '6 months', match: 88, field: 'law', coordinates: { lat: 41.9028, lng: 12.4964 }, validForDegree: true }
  ],
  companyResults: [
    { id: '1', initials: 'M.R.', university: 'Politecnico di Milano', major: 'Cybersecurity', gpa: 30, skills: ['Network Security', 'Python', 'Cryptography'], softSkills: ['Problem-solving', 'Teamwork'], match: 96, field: 'tech', coordinates: { lat: 45.4642, lng: 9.1900 } },
    { id: '2', initials: 'S.B.', university: 'Sapienza Roma', major: 'Computer Science', gpa: 29, skills: ['Cybersecurity', 'Linux', 'Ethical Hacking'], softSkills: ['Leadership', 'Communication'], match: 92, field: 'tech', coordinates: { lat: 41.9028, lng: 12.4964 } },
    { id: '3', initials: 'L.V.', university: 'Politecnico di Torino', major: 'Software Engineering', gpa: 29, skills: ['Network Security', 'Java', 'Cloud'], softSkills: ['Analytical', 'Detail-oriented'], match: 89, field: 'tech', coordinates: { lat: 45.0703, lng: 7.6869 } },
    { id: '4', initials: 'A.C.', university: 'NABA Milano', major: 'Graphic Design', gpa: 29, skills: ['Photoshop', 'Illustrator', 'Figma', 'UI/UX'], softSkills: ['Creativity', 'Attention to detail'], match: 95, field: 'design', coordinates: { lat: 45.4642, lng: 9.1900 } },
    { id: '5', initials: 'F.D.', university: 'IED Roma', major: 'Visual Communication', gpa: 28, skills: ['InDesign', 'Figma', 'Branding', 'Typography'], softSkills: ['Teamwork', 'Creativity'], match: 91, field: 'design', coordinates: { lat: 41.9028, lng: 12.4964 } },
    { id: '6', initials: 'G.P.', university: 'Bocconi Milano', major: 'Marketing & Communications', gpa: 29, skills: ['Social Media', 'SEO', 'Content Strategy', 'Google Ads'], softSkills: ['Communication', 'Strategic thinking'], match: 93, field: 'marketing', coordinates: { lat: 45.4642, lng: 9.1900 } },
    { id: '7', initials: 'E.R.', university: 'LUISS Roma', major: 'Business & Economics', gpa: 28, skills: ['Excel', 'Financial Modeling', 'Data Analysis', 'SAP'], softSkills: ['Analytical', 'Leadership'], match: 90, field: 'business', coordinates: { lat: 41.9028, lng: 12.4964 } },
    { id: '8', initials: 'C.M.', university: 'Università di Bologna', major: 'Law (Giurisprudenza)', gpa: 29, skills: ['Legal Writing', 'Contract Review', 'Research', 'EU Law'], softSkills: ['Critical thinking', 'Communication'], match: 88, field: 'law', coordinates: { lat: 44.4949, lng: 11.3426 } }
  ],
  universityStudents: [
    { id: '1', name: 'Marco Rossi', major: 'Computer Science', gpa: 3.85, contacted: 2, hired: false, field: 'tech', coordinates: { lat: 45.4642, lng: 9.1900 } },
    { id: '2', name: 'Sofia Bianchi', major: 'Data Science', gpa: 3.92, contacted: 8, hired: true, company: 'TechCorp', field: 'tech', coordinates: { lat: 41.9028, lng: 12.4964 } },
    { id: '3', name: 'Luca Verdi', major: 'Graphic Design', gpa: 3.78, contacted: 5, hired: false, field: 'design', coordinates: { lat: 45.0703, lng: 7.6869 } },
    { id: '4', name: 'Giulia Moretti', major: 'Marketing', gpa: 3.80, contacted: 3, hired: true, company: 'MediaGroup', field: 'marketing', coordinates: { lat: 45.4642, lng: 9.1900 } },
    { id: '5', name: 'Alessandro Conti', major: 'Business Administration', gpa: 3.70, contacted: 4, hired: false, field: 'business', coordinates: { lat: 41.9028, lng: 12.4964 } }
  ],
  universityJobs: [
    { id: '1', title: 'ML Engineer', company: 'TechCorp Italy', location: 'Milan', salary: '€45,000 - €60,000', matchedStudents: 12, field: 'tech', coordinates: { lat: 45.4642, lng: 9.1900 } },
    { id: '2', title: 'Data Analyst', company: 'DataCo', location: 'Rome', salary: '€35,000 - €45,000', matchedStudents: 8, field: 'tech', coordinates: { lat: 41.9028, lng: 12.4964 } },
    { id: '3', title: 'Graphic Designer', company: 'CreativeStudio', location: 'Milan', salary: '€28,000 - €36,000', matchedStudents: 6, field: 'design', coordinates: { lat: 45.4642, lng: 9.1900 } },
    { id: '4', title: 'Marketing Coordinator', company: 'BrandCo', location: 'Rome', salary: '€30,000 - €38,000', matchedStudents: 10, field: 'marketing', coordinates: { lat: 41.9028, lng: 12.4964 } },
    { id: '5', title: 'Business Consultant', company: 'ConsultingPro', location: 'Milan', salary: '€40,000 - €55,000', matchedStudents: 9, field: 'business', coordinates: { lat: 45.4642, lng: 9.1900 } }
  ]
}

export default function AISearchDemoPage() {
  const t = useTranslations('aiSearchDemo')
  const [activeDemo, setActiveDemo] = useState<DemoType>('student')
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list')
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null)
  const [mapCenter, setMapCenter] = useState({ lat: 42.5, lng: 12.5 }) // Center of Italy
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''

  const demoConfigs = {
    student: {
      title: t('demoConfigs.student.title'),
      subtitle: t('demoConfigs.student.subtitle'),
      color: 'from-primary to-secondary',
      icon: GraduationCap,
      placeholder: t('demoConfigs.student.placeholder'),
      initialMessage: t('demoConfigs.student.initialMessage'),
      registrationLink: '/auth/register/student'
    },
    company: {
      title: t('demoConfigs.company.title'),
      subtitle: t('demoConfigs.company.subtitle'),
      color: 'from-primary to-secondary',
      icon: Building2,
      placeholder: t('demoConfigs.company.placeholder'),
      initialMessage: t('demoConfigs.company.initialMessage'),
      registrationLink: '/auth/register/recruiter'
    },
    university: {
      title: t('demoConfigs.university.title'),
      subtitle: t('demoConfigs.university.subtitle'),
      color: 'from-primary to-secondary',
      icon: Users,
      placeholder: t('demoConfigs.university.placeholder'),
      initialMessage: t('demoConfigs.university.initialMessage'),
      registrationLink: '/auth/register/university'
    }
  }

  const exampleQueries = {
    student: t.raw('exampleQueries.student') as string[],
    company: t.raw('exampleQueries.company') as string[],
    university: t.raw('exampleQueries.university') as string[]
  }

  const config = demoConfigs[activeDemo]

  useEffect(() => {
    // Reset messages when demo type changes
    setMessages([{
      id: '1',
      role: 'assistant',
      content: config.initialMessage,
      timestamp: new Date()
    }])
  }, [activeDemo])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Stopwords to ignore when scoring results
  const stopWords = new Set(['i', 'want', 'to', 'find', 'the', 'a', 'an', 'in', 'for', 'and', 'or', 'with', 'at', 'of', 'my',
    'me', 'looking', 'search', 'show', 'get', 'need', 'who', 'are', 'is', 'good', 'great', 'best', 'top',
    'people', 'person', 'students', 'jobs', 'job', 'work', 'find', 'some', 'that', 'this', 'those',
    'voglio', 'cerco', 'cerca', 'trovami', 'trova', 'mostrami', 'per', 'con', 'che', 'di', 'il', 'la', 'un', 'una',
    'dei', 'delle', 'del', 'dalla', 'dal', 'le', 'lo', 'gli', 'sono', 'da', 'su', 'come', 'mi', 'si'])

  // Synonyms map: query word → words to also match in results
  const synonyms: Record<string, string[]> = {
    'graphics': ['graphic', 'design', 'designer', 'visual', 'creative', 'photoshop', 'illustrator', 'figma', 'ui', 'ux'],
    'graphic': ['design', 'designer', 'visual', 'creative', 'photoshop', 'illustrator', 'figma'],
    'design': ['designer', 'graphic', 'creative', 'ui', 'ux', 'figma', 'visual'],
    'creative': ['design', 'graphic', 'designer', 'visual', 'branding'],
    'marketing': ['social media', 'seo', 'content', 'digital', 'comunicazione', 'communication', 'brand'],
    'comunicazione': ['marketing', 'communication', 'social media', 'content', 'digital'],
    'business': ['economics', 'finance', 'analyst', 'consulting', 'economia', 'financial', 'consulenza'],
    'economia': ['business', 'economics', 'finance', 'financial'],
    'finance': ['financial', 'business', 'economics', 'analyst', 'accounting'],
    'law': ['legal', 'giurisprudenza', 'diritto', 'legale', 'contract'],
    'legal': ['law', 'giurisprudenza', 'diritto', 'legale', 'contract'],
    'giurisprudenza': ['law', 'legal', 'diritto', 'legale'],
    'security': ['cybersecurity', 'network', 'hacking', 'penetration'],
    'cybersecurity': ['security', 'network', 'hacking', 'ethical'],
    'frontend': ['react', 'vue', 'javascript', 'typescript', 'ui'],
    'backend': ['node', 'python', 'java', 'server', 'api'],
    'fullstack': ['full stack', 'frontend', 'backend'],
    'data': ['data science', 'machine learning', 'ml', 'analytics', 'analysis'],
    'engineering': ['engineer', 'mechanical', 'civil', 'electrical', 'ingegneria'],
  }

  const parseQuery = (query: string) => {
    const lowerQuery = query.toLowerCase()

    // Detect job type
    const isInternship = lowerQuery.includes('stage') || lowerQuery.includes('tirocinio') ||
                        lowerQuery.includes('internship') || lowerQuery.includes('curriculare')
    const isRemote = lowerQuery.includes('remote') || lowerQuery.includes('da remoto')
    const isFullTime = lowerQuery.includes('full time') || lowerQuery.includes('full-time')

    // Detect location
    const locations = {
      milan: lowerQuery.includes('milan') || lowerQuery.includes('milano'),
      rome: lowerQuery.includes('rome') || lowerQuery.includes('roma'),
      turin: lowerQuery.includes('turin') || lowerQuery.includes('torino'),
      florence: lowerQuery.includes('florence') || lowerQuery.includes('firenze')
    }

    return { isInternship, isRemote, isFullTime, locations, originalQuery: query }
  }

  // Score how well a result matches query tokens
  const scoreResult = (result: any, query: string): number => {
    const lowerQuery = query.toLowerCase()
    const tokens = lowerQuery.split(/\s+/).filter(t => t.length > 1 && !stopWords.has(t))
    if (tokens.length === 0) return 0

    // Build searchable text from all result fields
    const searchFields: string[] = []
    if (result.title) searchFields.push(result.title.toLowerCase())
    if (result.company) searchFields.push(result.company.toLowerCase())
    if (result.location) searchFields.push(result.location.toLowerCase())
    if (result.major) searchFields.push(result.major.toLowerCase())
    if (result.university) searchFields.push(result.university.toLowerCase())
    if (result.name) searchFields.push(result.name.toLowerCase())
    if (result.field) searchFields.push(result.field.toLowerCase())
    if (result.skills) {
      result.skills.forEach((s: string) => searchFields.push(s.toLowerCase()))
    }
    if (result.softSkills) {
      result.softSkills.forEach((s: string) => searchFields.push(s.toLowerCase()))
    }
    const searchText = searchFields.join(' ')

    let score = 0
    for (const token of tokens) {
      // Direct match
      if (searchText.includes(token)) {
        score += 10
      }
      // Synonym match
      const syns = synonyms[token]
      if (syns) {
        for (const syn of syns) {
          if (searchText.includes(syn)) {
            score += 6
            break // count only one synonym match per token
          }
        }
      }
      // Partial match (token is start of a word in search text)
      if (token.length >= 3 && !searchText.includes(token)) {
        const words = searchText.split(/\s+/)
        for (const word of words) {
          if (word.startsWith(token) || token.startsWith(word)) {
            score += 3
            break
          }
        }
      }
    }

    return score
  }

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    const currentInput = input
    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      let results: any[] = []
      let responseContent = ''
      const parsed = parseQuery(currentInput)

      // Helper: filter by location
      const filterByLocation = (items: any[]) => {
        if (parsed.locations.milan) return items.filter((r: any) => (r.location || '').toLowerCase().includes('milan'))
        if (parsed.locations.rome) return items.filter((r: any) => (r.location || '').toLowerCase().includes('rom'))
        if (parsed.locations.turin) return items.filter((r: any) => (r.location || '').toLowerCase().includes('turi'))
        if (parsed.locations.florence) return items.filter((r: any) => (r.location || '').toLowerCase().includes('floren'))
        return items
      }

      // Helper: score, sort, and filter results by relevance
      const rankResults = (items: any[], query: string) => {
        const scored = items.map(item => ({ item, score: scoreResult(item, query) }))
        scored.sort((a, b) => b.score - a.score)
        const topScore = scored[0]?.score || 0
        // If best score > 0, only return items with meaningful scores
        if (topScore > 0) {
          return scored.filter(s => s.score > 0).map(s => s.item)
        }
        return [] // no matches
      }

      if (activeDemo === 'student') {
        const pool = parsed.isInternship ? mockResults.internships : mockResults.studentJobs
        let ranked = rankResults(pool, currentInput)
        ranked = filterByLocation(ranked.length > 0 ? ranked : pool)

        const hasRelevantResults = ranked.length > 0 && scoreResult(ranked[0], currentInput) > 0
        results = hasRelevantResults ? ranked : pool.slice(0, 4)

        const topResults = results.slice(0, 3)
        if (parsed.isInternship) {
          if (hasRelevantResults) {
            responseContent = `Perfect! I found **${results.length} stage curriculare** positions matching your search:\n\n`
          } else {
            responseContent = `Here are some **popular internship opportunities** to explore. Try being more specific about your field or location!\n\n`
          }
          topResults.forEach((r: any) => {
            responseContent += `🎓 ${r.title} at ${r.company} - ${r.location} - ${r.salary}\n   ✓ Valid for degree | ${r.duration}\n\n`
          })
          if (results.length > 3) {
            responseContent += `...and ${results.length - 3} more internships!\n\n`
          }
          if (hasRelevantResults) {
            responseContent += `✨ All positions are recognized as valid "stage curriculare" by universities!\n💡 Switch to Map View to see locations!`
          }
        } else {
          if (hasRelevantResults) {
            responseContent = `Perfect! I found **${results.length} jobs** matching your search:\n\n`
          } else {
            responseContent = `Here are some **popular job opportunities** to explore. Try specifying a field like "graphic design", "marketing", or "business"!\n\n`
          }
          topResults.forEach((r: any) => {
            responseContent += `💼 ${r.title} at ${r.company} - ${r.location} - ${r.salary}\n`
          })
          if (results.length > 3) {
            responseContent += `\n...and ${results.length - 3} more!\n`
          }
          responseContent += `\n✨ Switch to Map View to see locations!`
        }
      } else if (activeDemo === 'company') {
        let ranked = rankResults(mockResults.companyResults, currentInput)
        // Also filter by location for university city
        if (parsed.locations.milan) {
          ranked = ranked.filter((r: any) => r.university.includes('Milano') || r.university.includes('Milan'))
        } else if (parsed.locations.rome) {
          ranked = ranked.filter((r: any) => r.university.includes('Roma') || r.university.includes('Rome'))
        }

        const hasRelevantResults = ranked.length > 0
        results = hasRelevantResults ? ranked : mockResults.companyResults.slice(0, 4)

        const topResults = results.slice(0, 3)
        if (hasRelevantResults) {
          responseContent = `Great! I found **${results.length} verified candidates** matching your search:\n\n`
        } else {
          responseContent = `Here are some **top candidates** across various fields. Try searching for a specific skill like "Figma", "SEO", or "Python"!\n\n`
        }
        topResults.forEach((r: any) => {
          responseContent += `🎓 ${r.initials} - ${r.university}, ${r.major}, ${r.gpa}/30 GPA\n   Skills: ${r.skills.slice(0, 3).join(', ')}\n\n`
        })
        if (results.length > 3) {
          responseContent += `...and ${results.length - 3} more!\n\n`
        }
        responseContent += `💡 View on map to see geographic distribution!\n✨ Register to unlock contacts for €10 each!`
      } else {
        // University demo: search both students and jobs, return whichever scores better
        const isStudentQuery = currentInput.toLowerCase().includes('student') || currentInput.toLowerCase().includes('gpa') || currentInput.toLowerCase().includes('studenti')
        const isJobQuery = currentInput.toLowerCase().includes('hiring') || currentInput.toLowerCase().includes('companies') || currentInput.toLowerCase().includes('aziend') || currentInput.toLowerCase().includes('opportunit')

        if (isStudentQuery || (!isJobQuery && rankResults(mockResults.universityStudents, currentInput).length > 0)) {
          const ranked = rankResults(mockResults.universityStudents, currentInput)
          const hasRelevantResults = ranked.length > 0
          results = hasRelevantResults ? ranked : mockResults.universityStudents

          if (hasRelevantResults) {
            responseContent = `📊 Found **${results.length} students** matching your search:\n\n`
          } else {
            responseContent = `📊 Here are your **students overview**. Try searching by major like "design" or "marketing"!\n\n`
          }
          results.forEach((r: any) => {
            responseContent += `👤 ${r.name} - ${r.major}, ${r.gpa} GPA, ${r.contacted} contacts${r.hired ? `, hired at ${r.company}` : ''}\n`
          })
          responseContent += `\n✨ View locations on the map!`
        } else {
          const ranked = rankResults(mockResults.universityJobs, currentInput)
          const hasRelevantResults = ranked.length > 0
          results = hasRelevantResults ? ranked : mockResults.universityJobs

          if (hasRelevantResults) {
            responseContent = `💼 Found **${results.length} job opportunities** matching your search:\n\n`
          } else {
            responseContent = `💼 Here are **current job opportunities** for your students. Try specifying a field!\n\n`
          }
          results.forEach((r: any) => {
            responseContent += `🏢 ${r.title} at ${r.company} - ${r.location} - ${r.matchedStudents} students match\n`
          })
          responseContent += `\n✨ See geographic distribution on map!`
        }
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseContent,
        timestamp: new Date(),
        results: results
      }

      setMessages(prev => [...prev, assistantMessage])
      setIsTyping(false)
    }, 1500)
  }

  const getCurrentResults = () => {
    const lastMessage = messages[messages.length - 1]
    return lastMessage?.results || []
  }

  const handleExampleClick = (example: string) => {
    setInput(example)
  }

  const Icon = config.icon

  return (
    <div className="min-h-screen hero-bg">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8 pt-24">
        {/* Hero Banner */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border-2 border-primary/30 rounded-full px-6 py-2 mb-4 shadow-sm">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="font-bold text-foreground">{t('banner.badge')}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
            {t('banner.title')}{' '}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {t('banner.titleHighlight')}
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
            {t('banner.description')}
          </p>

          {/* Alternative Search Banner */}
          <div className="max-w-2xl mx-auto mt-6">
            <Card className="bg-white/80 backdrop-blur-sm border-2 border-primary/20 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <SlidersHorizontal className="h-6 w-6 text-primary" />
                    <div className="text-left">
                      <p className="font-semibold text-gray-900">{t('banner.alternativeTitle')}</p>
                      <p className="text-sm text-gray-600">{t('banner.alternativeDescription')}</p>
                    </div>
                  </div>
                  <Button variant="outline" className="border-primary/30 hover:bg-primary/10 hover:text-primary" asChild>
                    <Link href="/demo/advanced-search">
                      {t('banner.alternativeButton')}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
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

        {/* View Toggle */}
        {getCurrentResults().length > 0 && (
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center bg-white border-2 border-gray-200 rounded-lg p-1 shadow-sm">
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                  viewMode === 'list'
                    ? `bg-gradient-to-r ${config.color} text-white shadow-sm`
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <List className="h-4 w-4" />
                <span className="font-medium">{t('viewToggle.chatView')}</span>
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                  viewMode === 'map'
                    ? `bg-gradient-to-r ${config.color} text-white shadow-sm`
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <MapIcon className="h-4 w-4" />
                <span className="font-medium">{t('viewToggle.mapView')}</span>
              </button>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Chat Interface */}
          {viewMode === 'list' && (
            <div className="lg:col-span-2">
              <Card className="shadow-xl">
                <CardHeader className={`bg-gradient-to-r ${config.color} text-white`}>
                  <div className="flex items-center gap-3">
                    <Icon className="h-6 w-6" />
                    <div>
                      <CardTitle>{config.title}</CardTitle>
                      <p className="text-sm text-white/90">{config.subtitle}</p>
                    </div>
                  </div>
                </CardHeader>

              <CardContent className="h-[500px] flex flex-col p-0">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  <AnimatePresence>
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        {message.role === 'assistant' && (
                          <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r ${config.color} flex items-center justify-center`}>
                            <Bot className="h-5 w-5 text-white" />
                          </div>
                        )}

                        <div className={`flex flex-col max-w-[70%] ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                          <div className={`rounded-2xl px-4 py-3 ${
                            message.role === 'user'
                              ? `bg-gradient-to-r ${config.color} text-white`
                              : 'bg-gray-100 text-gray-900'
                          }`}>
                            <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                          </div>

                          {/* Show preview results */}
                          {message.results && message.results.length > 0 && (
                            <div className="mt-3 space-y-2 w-full">
                              {message.results.slice(0, 3).map((result: any) => (
                                <div key={result.id} className="bg-white border border-gray-200 rounded-lg p-3 text-sm">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      {result.title && (
                                        <div>
                                          <p className="font-semibold text-gray-900">{result.title}</p>
                                          {result.type === 'Internship' && result.validForDegree && (
                                            <Badge className="bg-purple-100 text-purple-800 text-xs mt-1">
                                              {t('results.validForDegree')}
                                            </Badge>
                                          )}
                                        </div>
                                      )}
                                      {result.name && <p className="font-semibold text-gray-900">{result.name}</p>}
                                      {result.initials && (
                                        <div className="flex items-center gap-2">
                                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold text-xs">
                                            {result.initials}
                                          </div>
                                          <span className="text-gray-600">{t('results.contactLocked')}</span>
                                        </div>
                                      )}
                                      <p className="text-gray-600 text-xs mt-1">
                                        {result.company && `${result.company} • `}
                                        {result.university && `${result.university} • `}
                                        {result.location}
                                        {result.major && ` • ${result.major}`}
                                        {result.duration && ` • ${result.duration}`}
                                      </p>
                                    </div>
                                    {result.match && (
                                      <Badge className="bg-green-100 text-green-800 text-xs">
                                        {t('results.match', { score: result.match })}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              ))}
                              <Button className={`w-full bg-gradient-to-r ${config.color}`} size="sm" asChild>
                                <Link href={config.registrationLink}>
                                  {t('ui.registerToSeeAll')}
                                  <ArrowRight className="h-3 w-3 ml-2" />
                                </Link>
                              </Button>
                            </div>
                          )}

                          <span className="text-xs text-gray-500 mt-1">
                            {message.timestamp.toLocaleTimeString()}
                          </span>
                        </div>

                        {message.role === 'user' && (
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
                            <User className="h-5 w-5 text-white" />
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {isTyping && (
                    <div className="flex gap-3">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r ${config.color} flex items-center justify-center`}>
                        <Bot className="h-5 w-5 text-white" />
                      </div>
                      <div className="bg-gray-100 rounded-2xl px-4 py-3">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="border-t border-gray-200 p-4">
                  <div className="flex gap-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                      placeholder={config.placeholder}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSend}
                      className={`bg-gradient-to-r ${config.color}`}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          )}

          {/* Map View */}
          {viewMode === 'map' && (
            <div className="lg:col-span-2">
              <Card className="shadow-xl">
                <CardHeader className={`bg-gradient-to-r ${config.color} text-white`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-6 w-6" />
                      <div>
                        <CardTitle>{t('ui.geographicView')}</CardTitle>
                        <p className="text-sm text-white/90">
                          {t('ui.resultsOnMap', { count: getCurrentResults().length })}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white/10 hover:bg-white/20 text-white border-white/30"
                      onClick={() => setViewMode('list')}
                    >
                      <List className="h-4 w-4 mr-2" />
                      {t('ui.backToChat')}
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="p-0">
                  <div className="h-[600px] relative">
                    {apiKey ? (
                      <GoogleMapComponent
                        apiKey={apiKey}
                        center={mapCenter}
                        zoom={7}
                        className="h-full w-full"
                      >
                        {getCurrentResults().map((result: any) => {
                          if (!result.coordinates) return null

                          const isStudent = activeDemo === 'student' || (activeDemo === 'university' && result.name)
                          const isCandidate = activeDemo === 'company'
                          const isJob = result.title && (activeDemo === 'student' || activeDemo === 'university')

                          let markerColor = '#3B82F6' // default blue
                          if (isStudent || isCandidate) markerColor = '#10B981' // green for students/candidates
                          if (isJob) markerColor = '#8B5CF6' // purple for jobs

                          return (
                            <MapMarker
                              key={result.id}
                              position={result.coordinates}
                              title={result.title || result.name || result.initials}
                              icon={
                                window.google?.maps?.SymbolPath
                                  ? {
                                      path: window.google.maps.SymbolPath.CIRCLE,
                                      scale: 12,
                                      fillColor: markerColor,
                                      fillOpacity: 0.9,
                                      strokeColor: '#ffffff',
                                      strokeWeight: 3,
                                    }
                                  : undefined
                              }
                              onClick={() => setSelectedMarker(result.id)}
                              zIndex={selectedMarker === result.id ? 1000 : 1}
                            />
                          )
                        })}
                      </GoogleMapComponent>
                    ) : (
                      <div className="h-full flex items-center justify-center bg-gray-100">
                        <div className="text-center">
                          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600">Google Maps API key not configured</p>
                        </div>
                      </div>
                    )}

                    {/* Selected Marker Info Overlay */}
                    {selectedMarker && (
                      <div className="absolute bottom-4 left-4 right-4 max-w-md">
                        <Card className="shadow-2xl">
                          <CardContent className="p-4">
                            {(() => {
                              const selected = getCurrentResults().find((r: any) => r.id === selectedMarker)
                              if (!selected) return null

                              if (selected.title) {
                                // Job or Internship result
                                const isInternship = selected.type === 'Internship'
                                return (
                                  <div>
                                    <div className="flex items-start justify-between mb-2">
                                      <div>
                                        <h3 className="font-bold text-lg">{selected.title}</h3>
                                        <p className="text-gray-600">{selected.company}</p>
                                        {isInternship && selected.validForDegree && (
                                          <Badge className="bg-purple-100 text-purple-800 mt-1 text-xs">
                                            {t('results.validForUniversityDegree')}
                                          </Badge>
                                        )}
                                      </div>
                                      <button
                                        onClick={() => setSelectedMarker(null)}
                                        className="text-gray-500 hover:text-gray-700"
                                      >
                                        ✕
                                      </button>
                                    </div>
                                    <div className="space-y-1 text-sm">
                                      <p className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4" />
                                        {selected.location}
                                      </p>
                                      <p className="flex items-center gap-2">
                                        <DollarSign className="h-4 w-4" />
                                        {selected.salary}
                                      </p>
                                      {selected.duration && (
                                        <p className="flex items-center gap-2">
                                          <Clock className="h-4 w-4" />
                                          {selected.duration}
                                        </p>
                                      )}
                                      {selected.type && (
                                        <Badge className="bg-blue-100 text-blue-800 mt-2">
                                          {selected.type}
                                        </Badge>
                                      )}
                                      {selected.match && (
                                        <Badge className="bg-green-100 text-green-800 mt-2">
                                          {t('results.match', { score: selected.match })}
                                        </Badge>
                                      )}
                                      {selected.matchedStudents && (
                                        <Badge className="bg-blue-100 text-blue-800 mt-2">
                                          {t('results.studentsMatch', { count: selected.matchedStudents })}
                                        </Badge>
                                      )}
                                    </div>
                                    <Button className={`w-full mt-3 bg-gradient-to-r ${config.color}`} size="sm" asChild>
                                      <Link href={config.registrationLink}>
                                        {isInternship ? t('results.applyForStage') : t('results.registerToApply')}
                                      </Link>
                                    </Button>
                                  </div>
                                )
                              } else if (selected.initials) {
                                // Candidate result
                                return (
                                  <div>
                                    <div className="flex items-start justify-between mb-2">
                                      <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold">
                                          {selected.initials}
                                        </div>
                                        <div>
                                          <p className="font-bold">{t('results.contactLocked')}</p>
                                          <p className="text-sm text-gray-600">{selected.university}</p>
                                        </div>
                                      </div>
                                      <button
                                        onClick={() => setSelectedMarker(null)}
                                        className="text-gray-500 hover:text-gray-700"
                                      >
                                        ✕
                                      </button>
                                    </div>
                                    <div className="space-y-2 text-sm">
                                      <p><strong>{t('mapInfo.major')}:</strong> {selected.major}</p>
                                      <p><strong>{t('mapInfo.gpa')}:</strong> {selected.gpa}/30</p>
                                      <p><strong>{t('mapInfo.skills')}:</strong> {selected.skills?.slice(0, 3).join(', ')}</p>
                                      <Badge className="bg-green-100 text-green-800 mt-2">
                                        {t('results.match', { score: selected.match })}
                                      </Badge>
                                    </div>
                                    <Button className={`w-full mt-3 bg-gradient-to-r ${config.color}`} size="sm" asChild>
                                      <Link href={config.registrationLink}>{t('results.unlockContact')}</Link>
                                    </Button>
                                  </div>
                                )
                              } else {
                                // Student result
                                return (
                                  <div>
                                    <div className="flex items-start justify-between mb-2">
                                      <div>
                                        <h3 className="font-bold text-lg">{selected.name}</h3>
                                        <p className="text-gray-600">{selected.major}</p>
                                      </div>
                                      <button
                                        onClick={() => setSelectedMarker(null)}
                                        className="text-gray-500 hover:text-gray-700"
                                      >
                                        ✕
                                      </button>
                                    </div>
                                    <div className="space-y-1 text-sm">
                                      <p><strong>{t('mapInfo.gpa')}:</strong> {selected.gpa}/4.0</p>
                                      <p><strong>{t('mapInfo.contacted')}:</strong> {selected.contacted} {t('mapInfo.times')}</p>
                                      {selected.hired && (
                                        <Badge className="bg-green-100 text-green-800 mt-2">
                                          {t('results.hiredAt', { company: selected.company })}
                                        </Badge>
                                      )}
                                    </div>
                                    <Button className={`w-full mt-3 bg-gradient-to-r ${config.color}`} size="sm" asChild>
                                      <Link href={config.registrationLink}>{t('results.viewFullProfile')}</Link>
                                    </Button>
                                  </div>
                                )
                              }
                            })()}
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Example Queries */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
                  {t('ui.exampleQueriesTitle')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {exampleQueries[activeDemo].map((example, index) => (
                  <button
                    key={index}
                    onClick={() => handleExampleClick(example)}
                    className="w-full text-left p-3 rounded-lg bg-gray-50 hover:bg-blue-50 hover:border-blue-200 border border-gray-200 transition-colors text-sm"
                  >
                    {example}
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* CTA Card */}
            <Card className={`bg-gradient-to-br ${config.color.replace('from-', 'from-').replace('to-', 'to-')}/10 border-2`}>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Zap className="h-5 w-5 mr-2" />
                  {t('ui.likeWhatYouSee')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>{t('features.accessFullResults')}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>{t('features.saveSearches')}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>
                      {activeDemo === 'student' && t('features.studentFeature')}
                      {activeDemo === 'company' && t('features.companyFeature')}
                      {activeDemo === 'university' && t('features.universityFeature')}
                    </span>
                  </div>
                </div>

                <Button className={`w-full bg-gradient-to-r ${config.color}`} size="lg" asChild>
                  <Link href={config.registrationLink}>
                    {t('ui.registerFree')}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>

                <p className="text-xs text-center text-gray-600">
                  {activeDemo === 'student' && t('pricing.studentTagline')}
                  {activeDemo === 'company' && t('pricing.companyTagline')}
                  {activeDemo === 'university' && t('pricing.universityTagline')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
