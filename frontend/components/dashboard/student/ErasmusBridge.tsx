'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Globe, ArrowRight, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { normalizeGrade, formatGradeForDisplay } from '@/lib/grade-normalization'

interface ErasmusBridgeProps {
  homeUniversity?: string
  homeCountry?: string
  onCreated?: () => void
}

const COUNTRIES = [
  { code: 'IT', name: 'Italy', flag: '🇮🇹' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸' },
  { code: 'UK', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
]

const PROGRAM_TYPES = [
  { value: 'ERASMUS', label: 'Erasmus+' },
  { value: 'BILATERAL', label: 'Bilateral Agreement' },
  { value: 'FREE_MOVER', label: 'Free Mover' },
]

export default function ErasmusBridge({ homeUniversity, homeCountry, onCreated }: ErasmusBridgeProps) {
  const [hostUniversityName, setHostUniversityName] = useState('')
  const [hostCountry, setHostCountry] = useState('')
  const [programType, setProgramType] = useState('ERASMUS')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Grade preview
  const [previewGrade, setPreviewGrade] = useState('28')
  const previewNormalized = homeCountry ? normalizeGrade(previewGrade, homeCountry) : null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!hostUniversityName || !hostCountry || !startDate) {
      setError('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const res = await fetch('/api/dashboard/student/exchange', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hostUniversityName, hostCountry, programType, startDate, endDate: endDate || null }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to create enrollment')
      }

      setSuccess(true)
      if (onCreated) onCreated()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          Exchange enrollment created successfully! Your home and host universities can now verify it.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Card className="border-2 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-blue-600" />
          Register Exchange Program
        </CardTitle>
        <CardDescription>
          Link your profile to both home and host university for cross-border visibility
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Home University (read-only) */}
          <div className="p-4 bg-gray-50 rounded-lg space-y-2">
            <Label className="text-xs text-gray-500 uppercase tracking-wide">Home University</Label>
            <p className="font-medium">{homeUniversity || 'Not set'}</p>
            {homeCountry && (
              <Badge variant="outline">{COUNTRIES.find((c) => c.code === homeCountry)?.flag} {homeCountry}</Badge>
            )}
          </div>

          <div className="flex items-center justify-center">
            <ArrowRight className="h-5 w-5 text-gray-400" />
          </div>

          {/* Host University */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="hostUniversity">Host University *</Label>
              <Input
                id="hostUniversity"
                placeholder="e.g. Technische Universität München"
                value={hostUniversityName}
                onChange={(e) => setHostUniversityName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Host Country *</Label>
              <Select value={hostCountry} onValueChange={setHostCountry}>
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.flag} {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Program Type</Label>
              <Select value={programType} onValueChange={setProgramType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROGRAM_TYPES.map((p) => (
                    <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
            </div>
          </div>

          {/* Grade Preview */}
          {homeCountry && hostCountry && homeCountry !== hostCountry && (
            <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200 space-y-3">
              <Label className="text-sm font-medium text-indigo-800">Grade Preview</Label>
              <p className="text-xs text-indigo-600">
                See how your grades will appear to recruiters in {COUNTRIES.find((c) => c.code === hostCountry)?.name}
              </p>
              <div className="flex items-center gap-3">
                <Input
                  value={previewGrade}
                  onChange={(e) => setPreviewGrade(e.target.value)}
                  className="w-24 bg-white"
                  placeholder="Grade"
                />
                <span className="text-sm text-gray-500">
                  {COUNTRIES.find((c) => c.code === homeCountry)?.flag} {homeCountry}
                </span>
                <ArrowRight className="h-4 w-4 text-gray-400" />
                {previewNormalized !== null && (
                  <Badge className="bg-indigo-100 text-indigo-700">
                    {COUNTRIES.find((c) => c.code === hostCountry)?.flag}{' '}
                    {formatGradeForDisplay(previewNormalized, hostCountry)}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Creating...</>
            ) : (
              <><Globe className="h-4 w-4 mr-2" /> Register Exchange</>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
