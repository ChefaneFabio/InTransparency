'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { COURSE_CATEGORIES, CourseCategory } from '@/lib/types/course-data'
import { GraduationCap, Award, Filter, X } from 'lucide-react'

interface CourseFilter {
  category?: CourseCategory
  minGrade?: number  // 0-100 normalized
  institutionType?: 'its' | 'university' | 'both'
}

interface CourseFiltersProps {
  filters: CourseFilter
  onChange: (filters: CourseFilter) => void
  onApply: () => void
  resultCount?: number
}

export function CourseFilters({ filters, onChange, onApply, resultCount }: CourseFiltersProps) {
  const [localFilters, setLocalFilters] = useState(filters)

  const updateFilter = (update: Partial<CourseFilter>) => {
    const newFilters = { ...localFilters, ...update }
    setLocalFilters(newFilters)
    onChange(newFilters)
  }

  const clearFilters = () => {
    const emptyFilters: CourseFilter = { institutionType: 'both' }
    setLocalFilters(emptyFilters)
    onChange(emptyFilters)
  }

  const hasActiveFilters = localFilters.category || localFilters.minGrade || localFilters.institutionType !== 'both'

  // Convert normalized grade (0-100) to display grade
  const displayGrade = (normalized?: number) => {
    if (!normalized) return 'Any'
    if (localFilters.institutionType === 'its') {
      // ITS: 6-10 scale
      const itsGrade = 6 + (normalized / 100) * 4
      return `${Math.round(itsGrade)}/10`
    } else {
      // University: 18-30 scale
      const uniGrade = 18 + (normalized / 100) * 12
      return `${Math.round(uniGrade)}/30`
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Course-Level Filters
              <Badge variant="outline" className="ml-2 bg-gradient-to-r from-primary/10 to-secondary/10">
                DEMO DATA
              </Badge>
            </CardTitle>
            <CardDescription>
              Filter by verified courses and grades from institutions
            </CardDescription>
          </div>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Institution Type */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            Institution Type
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['its', 'university', 'both'] as const).map(type => (
              <Button
                key={type}
                variant={localFilters.institutionType === type ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateFilter({ institutionType: type })}
                className="text-xs"
              >
                {type === 'its' && '🔧 ITS'}
                {type === 'university' && '🎓 University'}
                {type === 'both' && '🌐 Both'}
              </Button>
            ))}
          </div>
          {localFilters.institutionType === 'its' && (
            <p className="text-xs text-muted-foreground">
              ✨ ITS graduates have 87% placement rate and strong hands-on skills
            </p>
          )}
        </div>

        {/* Course Category */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Course Category</label>
          <Select
            value={localFilters.category || 'none'}
            onValueChange={(value) => updateFilter({ category: value === 'none' ? undefined : value as CourseCategory })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Any course</SelectItem>
              <SelectItem value="divider" disabled>─── Tech/IT ───</SelectItem>
              <SelectItem value={COURSE_CATEGORIES.PROGRAMMING}>💻 Programming</SelectItem>
              <SelectItem value={COURSE_CATEGORIES.WEB_DEV}>🌐 Web Development</SelectItem>
              <SelectItem value={COURSE_CATEGORIES.AI_ML}>🤖 AI & Machine Learning</SelectItem>
              <SelectItem value={COURSE_CATEGORIES.CYBERSECURITY}>🔒 Cybersecurity</SelectItem>
              <SelectItem value={COURSE_CATEGORIES.DATABASES}>🗄️ Databases</SelectItem>
              <SelectItem value="divider2" disabled>─── Engineering ───</SelectItem>
              <SelectItem value={COURSE_CATEGORIES.AUTOMATION}>⚙️ Automation & Control</SelectItem>
              <SelectItem value={COURSE_CATEGORIES.PLC}>🔌 PLC Programming</SelectItem>
              <SelectItem value={COURSE_CATEGORIES.CAD}>📐 CAD/CAM Design</SelectItem>
              <SelectItem value={COURSE_CATEGORIES.ROBOTICS}>🤖 Robotics</SelectItem>
              <SelectItem value={COURSE_CATEGORIES.ELECTRONICS}>🔋 Electronics</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Minimum Grade */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium flex items-center gap-2">
              <Award className="h-4 w-4" />
              Minimum Grade
            </label>
            <Badge variant="secondary">
              {displayGrade(localFilters.minGrade)}
            </Badge>
          </div>
          <Slider
            value={[localFilters.minGrade || 0]}
            onValueChange={(value) => updateFilter({ minGrade: value[0] })}
            max={100}
            step={10}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Pass (60%)</span>
            <span>Good (80%)</span>
            <span>Excellent (100%)</span>
          </div>
          <p className="text-xs text-muted-foreground">
            {localFilters.minGrade && localFilters.minGrade >= 80 && (
              '🌟 High grade = top 20-30% performers'
            )}
            {localFilters.minGrade && localFilters.minGrade >= 60 && localFilters.minGrade < 80 && (
              '👍 Good grade = solid performers'
            )}
            {(!localFilters.minGrade || localFilters.minGrade < 60) && (
              '📊 All grades included'
            )}
          </p>
        </div>

        {/* Apply button with result count */}
        <Button onClick={onApply} className="w-full" size="lg">
          {resultCount !== undefined ? (
            <>
              Show {resultCount} Candidate{resultCount !== 1 ? 's' : ''}
            </>
          ) : (
            'Apply Filters'
          )}
        </Button>

        {/* Info banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-xs text-blue-800">
            <strong>💡 Demo Mode:</strong> Using mock data. When ITS partnerships are active,
            you'll see real course grades verified by institutions.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
