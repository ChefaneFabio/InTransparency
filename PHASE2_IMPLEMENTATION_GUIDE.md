# Phase 2 Features - Implementation Guide
## Course-Level Filtering + AI Match Explanations + Market Intelligence

**Status:** Foundation built with mock data
**Ready for:** Demo to ITS institutions
**Production:** Replace mock data with real institutional API when partnerships confirmed

---

## ✅ COMPLETATO (Files Created)

### 1. Data Schema
**File:** `/lib/types/course-data.ts`
- Defines exact data structure needed from ITS/Universities
- Grade normalization (ITS 1-10 ↔ University 18-30 ↔ 0-100%)
- Course categories (standardized across institutions)
- Market intelligence types

### 2. Mock Data Service
**File:** `/lib/data/mock-course-data.ts`
- 4 mock students with complete course records
- `searchStudentsByCourse()` - filters by course/grade
- `getTalentPoolStats()` - market analytics
- `generateMatchExplanation()` - AI reasoning for matches

### 3. Course Filter UI Component
**File:** `/components/search/CourseFilters.tsx`
- Institution type selector (ITS/University/Both)
- Course category dropdown (20+ categories)
- Minimum grade slider (auto-converts ITS ↔ University scales)
- "DEMO DATA" badge (remove when real data available)

---

## 🔨 TODO: Integrate into Existing Pages

### Integration 1: Advanced Search Page

**File to modify:** `/app/demo/advanced-search/page.tsx`

```typescript
// Add import
import { CourseFilters } from '@/components/search/CourseFilters'
import { searchStudentsByCourse } from '@/lib/data/mock-course-data'

// Add state
const [courseFilters, setCourseFilters] = useState({})

// Add to UI (sidebar)
<div className="space-y-6">
  {/* Existing filters... */}

  <CourseFilters
    filters={courseFilters}
    onChange={setCourseFilters}
    onApply={() => {
      const results = searchStudentsByCourse(courseFilters)
      setSearchResults(results)
    }}
    resultCount={searchResults.length}
  />
</div>
```

### Integration 2: AI Match Explanations

**Where to add:** Candidate cards in search results

```typescript
import { generateMatchExplanation } from '@/lib/data/mock-course-data'

// For each candidate in results
const explanation = generateMatchExplanation(candidate, {
  role: "Mechatronics Technician",
  requiredSkills: ["PLC", "Automation"]
})

// Display in candidate card
<Card>
  <CardHeader>
    <div className="flex items-center justify-between">
      <h3>{candidate.name}</h3>
      <Badge>Match: {explanation.matchScore}%</Badge>
    </div>
  </CardHeader>
  <CardContent>
    {/* Why this match section */}
    <div className="space-y-2 mb-4">
      <h4 className="text-sm font-semibold">Why this match:</h4>
      {explanation.strengths.map((s, i) => (
        <div key={i} className="text-sm flex items-start gap-2">
          <span>{s.icon}</span>
          <span>{s.text}</span>
        </div>
      ))}
      {explanation.concerns.length > 0 && (
        <>
          <h4 className="text-sm font-semibold mt-3">Considerations:</h4>
          {explanation.concerns.map((c, i) => (
            <div key={i} className="text-sm flex items-start gap-2 text-orange-700">
              <span>{c.icon}</span>
              <span>{c.text}</span>
            </div>
          ))}
        </>
      )}
    </div>

    {/* Existing buttons... */}
  </CardContent>
</Card>
```

### Integration 3: Market Intelligence Dashboard

**New page:** `/app/dashboard/recruiter/market-intelligence/page.tsx`

```typescript
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getMarketIntelligence } from '@/lib/data/mock-course-data'
import { BarChart, TrendingUp, Users, AlertCircle } from 'lucide-react'

export default function MarketIntelligencePage() {
  const [intelligence, setIntelligence] = useState(null)

  useEffect(() => {
    // Get intelligence based on user's recent searches
    const data = getMarketIntelligence(
      "Mechatronics Technician",
      {
        courseCategory: COURSE_CATEGORIES.AUTOMATION,
        minGrade: 70,
        location: "Brescia"
      }
    )
    setIntelligence(data)
  }, [])

  if (!intelligence) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Market Intelligence</h1>
        <p className="text-muted-foreground">
          Understand talent pool size, competition, and salary benchmarks
        </p>
      </div>

      {/* Talent Pool Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Candidates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{intelligence.talentPool.totalCandidates}</div>
            <p className="text-xs text-muted-foreground">in Italy</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Matching Your Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{intelligence.talentPool.matchingFilters}</div>
            <p className="text-xs text-green-600">
              {intelligence.talentPool.matchRate.toFixed(1)}% match rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Avg Salary Range</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              €{intelligence.salaryRange.min/1000}K - €{intelligence.salaryRange.max/1000}K
            </div>
            <p className="text-xs text-muted-foreground">
              Avg: €{intelligence.salaryRange.average/1000}K
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Competition</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{intelligence.competingCompanies}</div>
            <p className="text-xs text-muted-foreground">
              companies hiring similar roles
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Recommendations to Improve Results
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {intelligence.recommendations.map((rec, i) => (
            <div key={i} className="border-l-4 border-blue-500 pl-4 py-2">
              <h4 className="font-semibold text-sm">{rec.title}</h4>
              <p className="text-sm text-muted-foreground mt-1">{rec.description}</p>
              <Badge variant="secondary" className="mt-2">{rec.impact}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Geographic Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Geographic Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(intelligence.talentPool.byLocation).map(([city, count]) => (
              <div key={city} className="flex items-center justify-between">
                <span className="text-sm">{city}</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{
                        width: `${(count / intelligence.talentPool.matchingFilters) * 100}%`
                      }}
                    />
                  </div>
                  <span className="text-sm font-semibold w-8">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Grade Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Grade Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {intelligence.talentPool.gradeDistribution.excellent}
              </div>
              <div className="text-xs text-muted-foreground">Excellent (90%+)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {intelligence.talentPool.gradeDistribution.veryGood}
              </div>
              <div className="text-xs text-muted-foreground">Very Good (80-89%)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {intelligence.talentPool.gradeDistribution.good}
              </div>
              <div className="text-xs text-muted-foreground">Good (70-79%)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {intelligence.talentPool.gradeDistribution.fair}
              </div>
              <div className="text-xs text-muted-foreground">Fair (60-69%)</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Demo notice */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <p className="text-sm text-blue-800">
            <strong>💡 Demo Mode:</strong> Using mock market data. In production,
            this will pull real salary benchmarks from market APIs and live competition data.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
```

---

## 🎯 HOW TO DEMO TO ITS INSTITUTIONS

### Demo Script:

**"Guardate cosa possiamo fare CON I VOSTRI DATI"**

1. **Show Course-Level Filtering:**
   - "Un'azienda cerca tecnico con 'Automazione Industriale ≥9/10'"
   - Show filter UI → apply → results appear
   - "Solo candidati che HANNO DAVVERO fatto quel corso con quel voto"

2. **Show AI Match Explanations:**
   - Click on candidate
   - "L'AI spiega PERCHÉ questo candidato matcha"
   - "Vedi: 'PLC Programming 10/10 con lode' - verificato da VOI"

3. **Show Market Intelligence:**
   - "Aziende vedono quanti candidati disponibili"
   - "Se pochi → sanno di offrire salario competitivo"
   - "Analytics: quante aziende cercano i VOSTRI diplomati"

4. **The Ask:**
   - "Per far funzionare questo, serve i vostri dati corso-voto"
   - "CSV export da Esse3, o API integration"
   - "Con consenso GDPR studenti"
   - "In cambio: piattaforma GRATIS + analytics placement"

---

## 🔄 MOCK → REAL DATA TRANSITION

When ITS partnership confirmed, replace data source:

```typescript
// BEFORE (mock)
import { searchStudentsByCourse } from '@/lib/data/mock-course-data'

// AFTER (real API)
import { searchStudentsByCourse } from '@/lib/api/institutional-data'

// Function signature STAYS THE SAME
// UI code doesn't change
// Only data source changes
```

### Real Data Integration Points:

1. **Esse3 API Integration** (most ITS use this)
   - GET `/api/institutional/students/{id}/courses`
   - Returns course records with grades
   - Requires OAuth consent from student

2. **CSV Upload** (for institutions without API)
   - Admin uploads CSV: `student_id, course_code, course_name, grade, semester`
   - System normalizes and imports

3. **Moodle Integration** (some ITS use Moodle)
   - Moodle plugin exports grade data
   - Sync via webhook

---

## 📊 METRICS TO TRACK (When Live)

### For ITS to see value:
- **Students contacted:** "47 vostri studenti contattati da aziende questo mese"
- **Avg time to hire:** "23 giorni medi vs 47 giorni AlmaLaurea"
- **Companies searching:** "12 aziende hanno cercato 'Automazione' (vostro corso top)"

### For companies to see value:
- **Match accuracy:** "92% candidates had exact course you requested"
- **Time saved:** "3 min search vs 3 hours traditional recruiting"
- **False positives:** "30-40% fewer mismatches vs Indeed"

---

## 🚀 NEXT STEPS (Priority Order)

1. ✅ **Integrate CourseFilters into /demo/advanced-search** (1 hour)
2. ✅ **Add AI match explanations to candidate cards** (2 hours)
3. ✅ **Create Market Intelligence dashboard page** (3-4 hours)
4. ✅ **Add link in recruiter nav** (10 min)
5. ⏭️ **Test full flow end-to-end** (1 hour)
6. ⏭️ **Record demo video for ITS outreach** (30 min)

**Total implementation time:** 1-2 days

---

## 💡 WHEN TO SHOW THIS TO ITS

**Best timing:**
1. Send initial email (see VALIDATION_SPRINT_PLAN.md)
2. If they respond interested → schedule call
3. **On the call:** "Posso mostrarvi in 5 minuti cosa possiamo fare?"
4. Share screen → show these features live
5. **The hook:** "Questo funziona MEGLIO con i vostri dati reali. Possiamo fare pilota?"

**Success metric:**
If they say "Wow, questo è interessante" → 80% chance they give data access
If they say "Interessante ma..." → Follow up with value prop (free, analytics, placement boost)

---

*Files created and ready to integrate. Total 7-10 giorni dev time for full Phase 2 completion.*
