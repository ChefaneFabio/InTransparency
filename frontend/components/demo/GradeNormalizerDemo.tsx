'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { ArrowRight } from 'lucide-react'
import { normalizeGrade, formatGradeForDisplay, getGradingSystemInfo, getSupportedCountries } from '@/lib/grade-normalization'

const COUNTRY_LABELS: Record<string, string> = {
  IT: 'Italy (18-30)',
  DE: 'Germany (1.0-5.0)',
  FR: 'France (0-20)',
  ES: 'Spain (0-10)',
  UK: 'UK (%)',
  NL: 'Netherlands (1-10)',
}

const COUNTRY_FLAGS: Record<string, string> = {
  IT: '🇮🇹',
  DE: '🇩🇪',
  FR: '🇫🇷',
  ES: '🇪🇸',
  UK: '🇬🇧',
  NL: '🇳🇱',
}

export default function GradeNormalizerDemo() {
  const [grade, setGrade] = useState('28')
  const [country, setCountry] = useState('IT')

  const normalized = normalizeGrade(grade, country)
  const countries = getSupportedCountries()
  const sourceInfo = getGradingSystemInfo(country)

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="text-lg">Grade Normalizer</CardTitle>
        <p className="text-sm text-gray-600">
          See how a grade from one European system translates across all others
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Country</Label>
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {countries.map((c) => (
                  <SelectItem key={c} value={c}>
                    {COUNTRY_FLAGS[c]} {COUNTRY_LABELS[c]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Grade</Label>
            <Input
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              placeholder={sourceInfo ? `e.g. ${sourceInfo.scaleMax}` : 'Enter grade'}
            />
          </div>
        </div>

        {/* Results */}
        {normalized !== null ? (
          <div className="space-y-4">
            <div className="text-center p-4 bg-primary/5 rounded-lg">
              <p className="text-sm text-gray-600">Normalized Score</p>
              <p className="text-4xl font-bold text-primary">{normalized}/100</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {countries
                .filter((c) => c !== country)
                .map((targetCountry) => {
                  const display = formatGradeForDisplay(normalized, targetCountry)
                  return (
                    <div key={targetCountry} className="p-3 bg-gray-50 rounded-lg text-center">
                      <p className="text-lg">{COUNTRY_FLAGS[targetCountry]}</p>
                      <p className="text-sm font-semibold">{display}</p>
                      <p className="text-xs text-gray-500">{targetCountry}</p>
                    </div>
                  )
                })}
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <Badge variant="outline" className="text-primary">
                {COUNTRY_FLAGS[country]} {grade}
              </Badge>
              <ArrowRight className="h-4 w-4" />
              <span>equivalent in all EU systems</span>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center py-4">
            Enter a valid grade above to see cross-country equivalents
          </p>
        )}
      </CardContent>
    </Card>
  )
}
