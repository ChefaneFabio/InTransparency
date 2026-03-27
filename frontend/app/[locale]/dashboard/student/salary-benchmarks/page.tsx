'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  TrendingUp,
  MapPin,
  Briefcase,
  Info,
} from 'lucide-react'

interface BenchmarkEntry {
  role: string
  roleIT: string
  juniorRAL: [number, number]
  midRAL: [number, number]
  seniorRAL: [number, number]
  sector: string
}

// Italian salary benchmarks (2025-2026 market data, approximate)
const BENCHMARKS: BenchmarkEntry[] = [
  { role: 'Software Developer', roleIT: 'Sviluppatore Software', juniorRAL: [22000, 28000], midRAL: [30000, 40000], seniorRAL: [42000, 55000], sector: 'tech' },
  { role: 'Frontend Developer', roleIT: 'Sviluppatore Frontend', juniorRAL: [21000, 27000], midRAL: [28000, 38000], seniorRAL: [38000, 50000], sector: 'tech' },
  { role: 'Backend Developer', roleIT: 'Sviluppatore Backend', juniorRAL: [23000, 29000], midRAL: [30000, 42000], seniorRAL: [42000, 58000], sector: 'tech' },
  { role: 'Data Analyst', roleIT: 'Data Analyst', juniorRAL: [22000, 27000], midRAL: [28000, 38000], seniorRAL: [38000, 50000], sector: 'tech' },
  { role: 'Data Scientist', roleIT: 'Data Scientist', juniorRAL: [25000, 32000], midRAL: [33000, 45000], seniorRAL: [45000, 65000], sector: 'tech' },
  { role: 'UX/UI Designer', roleIT: 'UX/UI Designer', juniorRAL: [21000, 26000], midRAL: [27000, 36000], seniorRAL: [36000, 48000], sector: 'design' },
  { role: 'Digital Marketing', roleIT: 'Marketing Digitale', juniorRAL: [20000, 25000], midRAL: [26000, 34000], seniorRAL: [35000, 48000], sector: 'marketing' },
  { role: 'Project Manager', roleIT: 'Project Manager', juniorRAL: [23000, 28000], midRAL: [30000, 40000], seniorRAL: [40000, 55000], sector: 'management' },
  { role: 'Business Analyst', roleIT: 'Business Analyst', juniorRAL: [22000, 28000], midRAL: [29000, 38000], seniorRAL: [38000, 52000], sector: 'business' },
  { role: 'Sales / Account Manager', roleIT: 'Sales / Account Manager', juniorRAL: [20000, 26000], midRAL: [27000, 38000], seniorRAL: [38000, 55000], sector: 'business' },
  { role: 'Mechanical Engineer', roleIT: 'Ingegnere Meccanico', juniorRAL: [24000, 29000], midRAL: [30000, 40000], seniorRAL: [40000, 55000], sector: 'engineering' },
  { role: 'Civil Engineer', roleIT: 'Ingegnere Civile', juniorRAL: [22000, 27000], midRAL: [28000, 36000], seniorRAL: [36000, 50000], sector: 'engineering' },
  { role: 'Electrical Engineer', roleIT: 'Ingegnere Elettrico', juniorRAL: [23000, 28000], midRAL: [29000, 38000], seniorRAL: [38000, 52000], sector: 'engineering' },
  { role: 'Accountant', roleIT: 'Commercialista / Contabile', juniorRAL: [20000, 25000], midRAL: [26000, 34000], seniorRAL: [35000, 48000], sector: 'finance' },
  { role: 'Financial Analyst', roleIT: 'Analista Finanziario', juniorRAL: [24000, 30000], midRAL: [31000, 42000], seniorRAL: [42000, 60000], sector: 'finance' },
  { role: 'HR Specialist', roleIT: 'Specialista HR', juniorRAL: [21000, 26000], midRAL: [27000, 35000], seniorRAL: [35000, 48000], sector: 'hr' },
  { role: 'Content Creator / Copywriter', roleIT: 'Copywriter / Content Creator', juniorRAL: [18000, 23000], midRAL: [24000, 32000], seniorRAL: [32000, 42000], sector: 'marketing' },
  { role: 'Graphic Designer', roleIT: 'Graphic Designer', juniorRAL: [18000, 24000], midRAL: [25000, 32000], seniorRAL: [32000, 42000], sector: 'design' },
  { role: 'DevOps Engineer', roleIT: 'DevOps Engineer', juniorRAL: [25000, 32000], midRAL: [33000, 45000], seniorRAL: [45000, 65000], sector: 'tech' },
  { role: 'Cybersecurity Analyst', roleIT: 'Analista Cybersecurity', juniorRAL: [24000, 30000], midRAL: [31000, 42000], seniorRAL: [42000, 60000], sector: 'tech' },
  // Engineering (expanded)
  { role: 'Chemical / Process Engineer', roleIT: 'Ingegnere Chimico / di Processo', juniorRAL: [24000, 29000], midRAL: [30000, 40000], seniorRAL: [40000, 55000], sector: 'engineering' },
  { role: 'Environmental Engineer', roleIT: 'Ingegnere Ambientale', juniorRAL: [22000, 27000], midRAL: [28000, 36000], seniorRAL: [36000, 48000], sector: 'engineering' },
  { role: 'Industrial / Manufacturing Engineer', roleIT: 'Ingegnere Industriale', juniorRAL: [23000, 28000], midRAL: [29000, 38000], seniorRAL: [38000, 52000], sector: 'engineering' },
  { role: 'Quality Engineer', roleIT: 'Ingegnere Qualità', juniorRAL: [22000, 27000], midRAL: [28000, 36000], seniorRAL: [36000, 48000], sector: 'engineering' },
  { role: 'Biomedical Engineer', roleIT: 'Ingegnere Biomedico', juniorRAL: [23000, 28000], midRAL: [29000, 38000], seniorRAL: [38000, 52000], sector: 'engineering' },
  { role: 'Energy Engineer', roleIT: 'Ingegnere Energetico', juniorRAL: [23000, 28000], midRAL: [29000, 39000], seniorRAL: [39000, 52000], sector: 'engineering' },
  // Consulting & Professional Services
  { role: 'Management Consultant', roleIT: 'Consulente di Management', juniorRAL: [27000, 35000], midRAL: [36000, 50000], seniorRAL: [50000, 75000], sector: 'consulting' },
  { role: 'Strategy Consultant', roleIT: 'Consulente Strategico', juniorRAL: [28000, 36000], midRAL: [37000, 55000], seniorRAL: [55000, 80000], sector: 'consulting' },
  { role: 'IT Consultant', roleIT: 'Consulente IT', juniorRAL: [24000, 30000], midRAL: [31000, 42000], seniorRAL: [42000, 60000], sector: 'consulting' },
  // Legal
  { role: 'Junior Lawyer (Praticante)', roleIT: 'Praticante Avvocato', juniorRAL: [15000, 22000], midRAL: [25000, 38000], seniorRAL: [40000, 70000], sector: 'legal' },
  { role: 'Legal Counsel (In-house)', roleIT: 'Legale d\'Impresa', juniorRAL: [25000, 32000], midRAL: [33000, 45000], seniorRAL: [45000, 65000], sector: 'legal' },
  { role: 'Compliance Officer', roleIT: 'Compliance Officer', juniorRAL: [24000, 30000], midRAL: [31000, 42000], seniorRAL: [42000, 58000], sector: 'legal' },
  // Supply Chain & Operations
  { role: 'Supply Chain Analyst', roleIT: 'Analista Supply Chain', juniorRAL: [22000, 27000], midRAL: [28000, 36000], seniorRAL: [36000, 50000], sector: 'operations' },
  { role: 'Procurement Specialist', roleIT: 'Buyer / Procurement', juniorRAL: [22000, 27000], midRAL: [28000, 36000], seniorRAL: [36000, 48000], sector: 'operations' },
  { role: 'Logistics Coordinator', roleIT: 'Coordinatore Logistica', juniorRAL: [20000, 25000], midRAL: [26000, 34000], seniorRAL: [34000, 45000], sector: 'operations' },
  // Pharma & Science
  { role: 'Pharmaceutical R&D', roleIT: 'R&D Farmaceutico', juniorRAL: [25000, 32000], midRAL: [33000, 45000], seniorRAL: [45000, 65000], sector: 'pharma' },
  { role: 'Regulatory Affairs', roleIT: 'Affari Regolatori', juniorRAL: [24000, 30000], midRAL: [31000, 42000], seniorRAL: [42000, 58000], sector: 'pharma' },
  { role: 'Lab Technician / Researcher', roleIT: 'Tecnico di Laboratorio', juniorRAL: [20000, 25000], midRAL: [26000, 34000], seniorRAL: [34000, 45000], sector: 'pharma' },
  // Architecture & Construction
  { role: 'Architect', roleIT: 'Architetto', juniorRAL: [20000, 26000], midRAL: [27000, 36000], seniorRAL: [36000, 50000], sector: 'architecture' },
  { role: 'BIM Specialist', roleIT: 'Specialista BIM', juniorRAL: [23000, 28000], midRAL: [29000, 38000], seniorRAL: [38000, 50000], sector: 'architecture' },
  // Audit & Finance (expanded)
  { role: 'Auditor (Big4)', roleIT: 'Revisore (Big4)', juniorRAL: [24000, 30000], midRAL: [32000, 45000], seniorRAL: [45000, 65000], sector: 'finance' },
  { role: 'Controller', roleIT: 'Controller di Gestione', juniorRAL: [24000, 30000], midRAL: [31000, 42000], seniorRAL: [42000, 58000], sector: 'finance' },
  { role: 'Risk Analyst', roleIT: 'Analista Rischi', juniorRAL: [25000, 32000], midRAL: [33000, 45000], seniorRAL: [45000, 62000], sector: 'finance' },
]

// City cost-of-living adjustments
const CITY_ADJUSTMENTS: Record<string, { label: string; factor: number; note: string }> = {
  milano: { label: 'Milano', factor: 1.15, note: '+10-15% vs national average' },
  roma: { label: 'Roma', factor: 1.08, note: '+5-10% vs national average' },
  torino: { label: 'Torino', factor: 1.05, note: '+3-5% vs national average' },
  bologna: { label: 'Bologna', factor: 1.07, note: '+5-7% vs national average' },
  firenze: { label: 'Firenze', factor: 1.03, note: '+2-3% vs national average' },
  napoli: { label: 'Napoli', factor: 0.92, note: '-5-8% vs national average' },
  padova: { label: 'Padova / Veneto', factor: 1.04, note: '+3-4% vs national average' },
  bari: { label: 'Bari / Puglia', factor: 0.90, note: '-8-10% vs national average' },
  remote: { label: 'Remote', factor: 1.0, note: 'National average — location independent' },
}

const SECTORS = [
  { value: '', label: 'All Sectors' },
  { value: 'tech', label: 'Technology' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'business', label: 'Business' },
  { value: 'finance', label: 'Finance & Audit' },
  { value: 'consulting', label: 'Consulting' },
  { value: 'legal', label: 'Legal' },
  { value: 'operations', label: 'Supply Chain & Operations' },
  { value: 'pharma', label: 'Pharma & Science' },
  { value: 'architecture', label: 'Architecture' },
  { value: 'design', label: 'Design' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'hr', label: 'HR' },
  { value: 'management', label: 'Management' },
]

export default function SalaryBenchmarksPage() {
  const t = useTranslations('salaryBenchmarks')

  const [selectedSector, setSelectedSector] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredBenchmarks = BENCHMARKS.filter((b) => {
    if (selectedSector && b.sector !== selectedSector) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      return b.role.toLowerCase().includes(q) || b.roleIT.toLowerCase().includes(q)
    }
    return true
  })

  const adjustedRAL = (range: [number, number]): [number, number] => {
    const city = CITY_ADJUSTMENTS[selectedCity]
    if (!city) return range
    return [Math.round(range[0] * city.factor / 100) * 100, Math.round(range[1] * city.factor / 100) * 100]
  }

  const formatRange = (range: [number, number]) =>
    `€${range[0].toLocaleString()} – €${range[1].toLocaleString()}`

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('title')}</h1>
        <p className="text-gray-600">{t('subtitle')}</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('filters.search')}</label>
              <input
                type="text"
                placeholder={t('filters.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('filters.sector')}</label>
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {SECTORS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('filters.city')}</label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">{t('filters.nationalAvg')}</option>
                {Object.entries(CITY_ADJUSTMENTS).map(([key, city]) => (
                  <option key={key} value={key}>{city.label}</option>
                ))}
              </select>
            </div>
          </div>
          {selectedCity && CITY_ADJUSTMENTS[selectedCity] && (
            <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4 text-primary" />
              {CITY_ADJUSTMENTS[selectedCity].label}: {CITY_ADJUSTMENTS[selectedCity].note}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      <div className="text-sm text-gray-500 mb-2">
        {filteredBenchmarks.length} {t('results.roles')}
      </div>

      <div className="space-y-4">
        {filteredBenchmarks.map((b) => {
          const junior = adjustedRAL(b.juniorRAL)
          const mid = adjustedRAL(b.midRAL)
          const senior = adjustedRAL(b.seniorRAL)

          return (
            <Card key={b.role} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-4 pb-4">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="md:w-1/4">
                    <h3 className="font-semibold text-gray-900">{b.role}</h3>
                    <p className="text-sm text-gray-500">{b.roleIT}</p>
                    <Badge variant="outline" className="text-xs mt-1">{b.sector}</Badge>
                  </div>
                  <div className="flex-1 grid grid-cols-3 gap-3">
                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                      <div className="text-xs text-blue-600 font-medium mb-1">{t('results.junior')}</div>
                      <div className="text-sm font-bold text-gray-900">{formatRange(junior)}</div>
                      <div className="text-xs text-gray-500">0-2 {t('results.years')}</div>
                    </div>
                    <div className="bg-primary/5 rounded-lg p-3 text-center border border-primary/20">
                      <div className="text-xs text-primary font-medium mb-1">{t('results.mid')}</div>
                      <div className="text-sm font-bold text-gray-900">{formatRange(mid)}</div>
                      <div className="text-xs text-gray-500">2-5 {t('results.years')}</div>
                    </div>
                    <div className="bg-amber-50 rounded-lg p-3 text-center">
                      <div className="text-xs text-amber-600 font-medium mb-1">{t('results.senior')}</div>
                      <div className="text-sm font-bold text-gray-900">{formatRange(senior)}</div>
                      <div className="text-xs text-gray-500">5+ {t('results.years')}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Disclaimer */}
      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="pt-4 pb-4">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-900">{t('disclaimer.title')}</p>
              <p className="text-xs text-amber-700 mt-1">{t('disclaimer.text')}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
