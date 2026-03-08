// Market data service — aggregates salary benchmarks from multiple sources:
// 1. Platform-wide placement data (cross-university)
// 2. Job posting salary ranges from recruiters
// 3. Alumni salary reports
// 4. Eurostat open data for EU salary benchmarks by sector (NACE Rev.2)

const EUROSTAT_BASE = 'https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data'

// Eurostat NACE Rev.2 sector codes mapped to our industry names
const NACE_SECTORS: Record<string, string> = {
  'J': 'Technology',
  'K': 'Financial Services',
  'Q': 'Healthcare',
  'M': 'Consulting',
  'C': 'Manufacturing',
  'G': 'Retail & Commerce',
  'H': 'Transport & Logistics',
  'N': 'Administrative Services',
  'P': 'Education',
  'R': 'Arts & Entertainment',
}

export interface MarketSalaryBenchmark {
  sector: string
  naceCode: string
  avgAnnualSalary: number
  currency: string
  country: string
  year: number
}

export interface PlatformBenchmark {
  avgSalary: number
  medianSalary: number
  p25Salary: number
  p75Salary: number
  totalDataPoints: number
  byIndustry: Array<{ industry: string; avgSalary: number; count: number }>
  byRole: Array<{ role: string; avgSalary: number; count: number }>
}

export interface MarketContext {
  platformBenchmark: PlatformBenchmark
  eurostatBenchmarks: MarketSalaryBenchmark[]
  lastUpdated: string
}

// Cache for Eurostat data (refreshed every 24h)
let eurostatCache: { data: MarketSalaryBenchmark[]; fetchedAt: number } | null = null
const CACHE_TTL = 24 * 60 * 60 * 1000 // 24 hours

/**
 * Fetch EU salary benchmarks from Eurostat open data API.
 * Dataset: earn_ses18_46 (Structure of earnings survey - annual earnings)
 * Falls back to curated Italian market data if API is unavailable.
 */
export async function fetchEurostatBenchmarks(): Promise<MarketSalaryBenchmark[]> {
  if (eurostatCache && Date.now() - eurostatCache.fetchedAt < CACHE_TTL) {
    return eurostatCache.data
  }

  try {
    // Eurostat API: Mean annual earnings by NACE sector, Italy
    const url = `${EUROSTAT_BASE}/earn_ses18_46?format=JSON&lang=en&geo=IT&indic_se=MEAN_E_EUR&age=TOTAL&sex=T&worktime=FT`

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)

    const res = await fetch(url, { signal: controller.signal })
    clearTimeout(timeout)

    if (res.ok) {
      const json = await res.json()
      const benchmarks = parseEurostatResponse(json)
      if (benchmarks.length > 0) {
        eurostatCache = { data: benchmarks, fetchedAt: Date.now() }
        return benchmarks
      }
    }
  } catch (err) {
    console.warn('Eurostat API unavailable, using fallback data:', err)
  }

  // Fallback: curated Italian salary benchmarks (ISTAT/Eurostat 2023 data)
  const fallback = getItalianMarketFallback()
  eurostatCache = { data: fallback, fetchedAt: Date.now() }
  return fallback
}

function parseEurostatResponse(json: any): MarketSalaryBenchmark[] {
  const benchmarks: MarketSalaryBenchmark[] = []

  try {
    const naceIndex = json.dimension?.nace_r2?.category?.index || {}
    const values = json.value || {}
    const timeIndex = json.dimension?.time?.category?.index || {}

    // Get the most recent year
    const years = Object.keys(timeIndex).sort()
    const latestYear = years[years.length - 1]
    const yearIdx = timeIndex[latestYear]

    for (const [naceCode, naceIdx] of Object.entries(naceIndex)) {
      const sectorName = NACE_SECTORS[naceCode]
      if (!sectorName) continue

      // Eurostat uses flat index: nace * timeLength + timeIdx
      const flatIdx = (naceIdx as number) * years.length + yearIdx
      const value = values[String(flatIdx)]

      if (value && typeof value === 'number') {
        benchmarks.push({
          sector: sectorName,
          naceCode,
          avgAnnualSalary: Math.round(value),
          currency: 'EUR',
          country: 'IT',
          year: parseInt(latestYear),
        })
      }
    }
  } catch (err) {
    console.warn('Error parsing Eurostat response:', err)
  }

  return benchmarks
}

/**
 * Curated Italian salary benchmarks from ISTAT/Eurostat published data.
 * Updated periodically — serves as fallback when live API is unavailable.
 */
function getItalianMarketFallback(): MarketSalaryBenchmark[] {
  // Source: ISTAT Struttura delle retribuzioni 2022-2023, Eurostat earn_ses18_46
  return [
    { sector: 'Technology', naceCode: 'J', avgAnnualSalary: 38500, currency: 'EUR', country: 'IT', year: 2023 },
    { sector: 'Financial Services', naceCode: 'K', avgAnnualSalary: 44200, currency: 'EUR', country: 'IT', year: 2023 },
    { sector: 'Healthcare', naceCode: 'Q', avgAnnualSalary: 32800, currency: 'EUR', country: 'IT', year: 2023 },
    { sector: 'Consulting', naceCode: 'M', avgAnnualSalary: 36700, currency: 'EUR', country: 'IT', year: 2023 },
    { sector: 'Manufacturing', naceCode: 'C', avgAnnualSalary: 33500, currency: 'EUR', country: 'IT', year: 2023 },
    { sector: 'Retail & Commerce', naceCode: 'G', avgAnnualSalary: 26800, currency: 'EUR', country: 'IT', year: 2023 },
    { sector: 'Transport & Logistics', naceCode: 'H', avgAnnualSalary: 30200, currency: 'EUR', country: 'IT', year: 2023 },
    { sector: 'Education', naceCode: 'P', avgAnnualSalary: 29500, currency: 'EUR', country: 'IT', year: 2023 },
    { sector: 'Arts & Entertainment', naceCode: 'R', avgAnnualSalary: 24500, currency: 'EUR', country: 'IT', year: 2023 },
  ]
}

/**
 * Normalize salary to yearly EUR amount for comparison.
 */
export function normalizeToYearlySalary(
  amount: number,
  period: string = 'yearly',
  currency: string = 'EUR'
): number {
  let yearly = amount
  if (period === 'monthly') yearly = amount * 12
  else if (period === 'hourly') yearly = amount * 2080 // 40h * 52 weeks

  // Simple EUR conversion for common currencies (approximate)
  if (currency === 'USD') yearly = yearly * 0.92
  else if (currency === 'GBP') yearly = yearly * 1.16
  else if (currency === 'CHF') yearly = yearly * 1.04

  return Math.round(yearly)
}
