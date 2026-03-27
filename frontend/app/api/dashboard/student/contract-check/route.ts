import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import { z } from 'zod'

const contractCheckSchema = z.object({
  contractType: z.enum([
    'stage',
    'tirocinio',
    'apprendistato',
    'tempo_determinato',
    'tempo_indeterminato',
    'partita_iva',
    'cococo',
    'somministrazione',
    'collaborazione_occasionale',
  ]),
  ccnl: z.string().optional(),
  livello: z.string().optional(),
  ralOffered: z.number().optional(), // gross annual in EUR
  monthlyNet: z.number().optional(), // net monthly offered
  hoursPerWeek: z.number().optional(),
  durationMonths: z.number().optional(),
  hasFixedSchedule: z.boolean().optional(),
  worksOnSite: z.boolean().optional(),
  providesOwnTools: z.boolean().optional(),
  hasExclusivity: z.boolean().optional(),
  sector: z.string().optional(),
  role: z.string().optional(),
})

// Italian CCNL minimum pay reference data (approximate, livello-based)
const CCNL_MINIMUMS: Record<string, Record<string, number>> = {
  commercio: {
    '1': 28000, '2': 25000, '3': 23000, '4': 21500, '5': 20000, '6': 18500, '7': 17500,
  },
  metalmeccanico: {
    'D1': 28500, 'D2': 26000, 'C1': 24000, 'C2': 22500, 'C3': 21000, 'B1': 20000, 'B2': 19000, 'B3': 18000,
  },
  terziario: {
    '1': 27000, '2': 24500, '3': 22500, '4': 21000, '5': 19500, '6': 18000, '7': 17000,
  },
  informatica: {
    '1': 30000, '2': 27000, '3': 24500, '4': 22000, '5': 20000, '6': 18500, '7': 17500,
  },
  studi_professionali: {
    '1': 26000, '2': 23500, '3S': 22000, '3': 20500, '4S': 19000, '4': 18000, '5': 17000,
  },
}

// Contract type metadata
const CONTRACT_TYPES: Record<string, {
  nameIT: string
  nameEN: string
  maxDurationMonths: number | null
  hasMinPay: boolean
  hasTFR: boolean
  hasSickLeave: boolean
  hasVacation: boolean
  hasUnemployment: boolean
  hasContributions: boolean
  typicalForJuniors: boolean
  riskLevel: 'low' | 'medium' | 'high'
}> = {
  tempo_indeterminato: {
    nameIT: 'Contratto a Tempo Indeterminato',
    nameEN: 'Permanent Contract',
    maxDurationMonths: null,
    hasMinPay: true, hasTFR: true, hasSickLeave: true, hasVacation: true,
    hasUnemployment: true, hasContributions: true,
    typicalForJuniors: false, riskLevel: 'low',
  },
  tempo_determinato: {
    nameIT: 'Contratto a Tempo Determinato',
    nameEN: 'Fixed-Term Contract',
    maxDurationMonths: 24,
    hasMinPay: true, hasTFR: true, hasSickLeave: true, hasVacation: true,
    hasUnemployment: true, hasContributions: true,
    typicalForJuniors: true, riskLevel: 'low',
  },
  apprendistato: {
    nameIT: 'Contratto di Apprendistato',
    nameEN: 'Apprenticeship Contract',
    maxDurationMonths: 36,
    hasMinPay: true, hasTFR: true, hasSickLeave: true, hasVacation: true,
    hasUnemployment: true, hasContributions: true,
    typicalForJuniors: true, riskLevel: 'low',
  },
  stage: {
    nameIT: 'Stage Extracurriculare',
    nameEN: 'Extracurricular Internship',
    maxDurationMonths: 6,
    hasMinPay: false, hasTFR: false, hasSickLeave: false, hasVacation: false,
    hasUnemployment: false, hasContributions: false,
    typicalForJuniors: true, riskLevel: 'medium',
  },
  tirocinio: {
    nameIT: 'Tirocinio Curriculare',
    nameEN: 'Curricular Internship',
    maxDurationMonths: 12,
    hasMinPay: false, hasTFR: false, hasSickLeave: false, hasVacation: false,
    hasUnemployment: false, hasContributions: false,
    typicalForJuniors: true, riskLevel: 'medium',
  },
  partita_iva: {
    nameIT: 'Partita IVA (Lavoro Autonomo)',
    nameEN: 'Freelance / Self-Employment',
    maxDurationMonths: null,
    hasMinPay: false, hasTFR: false, hasSickLeave: false, hasVacation: false,
    hasUnemployment: false, hasContributions: false,
    typicalForJuniors: false, riskLevel: 'high',
  },
  cococo: {
    nameIT: 'Collaborazione Coordinata e Continuativa',
    nameEN: 'Coordinated Collaboration (Co.Co.Co)',
    maxDurationMonths: null,
    hasMinPay: false, hasTFR: false, hasSickLeave: false, hasVacation: false,
    hasUnemployment: false, hasContributions: true,
    typicalForJuniors: false, riskLevel: 'high',
  },
  somministrazione: {
    nameIT: 'Contratto di Somministrazione',
    nameEN: 'Agency Work Contract',
    maxDurationMonths: 24,
    hasMinPay: true, hasTFR: true, hasSickLeave: true, hasVacation: true,
    hasUnemployment: true, hasContributions: true,
    typicalForJuniors: true, riskLevel: 'medium',
  },
  collaborazione_occasionale: {
    nameIT: 'Collaborazione Occasionale',
    nameEN: 'Occasional Collaboration',
    maxDurationMonths: null,
    hasMinPay: false, hasTFR: false, hasSickLeave: false, hasVacation: false,
    hasUnemployment: false, hasContributions: false,
    typicalForJuniors: false, riskLevel: 'high',
  },
}

/**
 * POST /api/dashboard/student/contract-check
 *
 * Analyzes a contract offer and returns a transparency report
 * with fairness assessment, rights summary, and red flags.
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const input = contractCheckSchema.parse(body)
    const contractMeta = CONTRACT_TYPES[input.contractType]

    if (!contractMeta) {
      return NextResponse.json({ error: 'Unknown contract type' }, { status: 400 })
    }

    // --- Red flags ---
    const redFlags: Array<{ severity: 'critical' | 'warning'; message: string; detail: string }> = []

    // Fake P.IVA detection
    if (input.contractType === 'partita_iva' || input.contractType === 'cococo') {
      if (input.hasFixedSchedule) {
        redFlags.push({
          severity: 'critical',
          message: 'Possible disguised employment',
          detail: 'If you have a fixed schedule set by the company, this may be illegal subordinate employment disguised as freelance. Under Italian law (Art. 2 D.Lgs. 81/2015), you may be entitled to a regular employment contract.',
        })
      }
      if (input.worksOnSite && !input.providesOwnTools) {
        redFlags.push({
          severity: 'critical',
          message: 'Working on-site with company tools suggests employment',
          detail: 'True freelancers typically use their own tools and choose where to work. If the company requires you on-site with their equipment, this looks like subordinate employment.',
        })
      }
      if (input.hasExclusivity) {
        redFlags.push({
          severity: 'critical',
          message: 'Exclusivity clause in freelance contract',
          detail: 'Freelancers should be free to work with multiple clients. An exclusivity clause is a strong indicator of disguised employment. You may have grounds to request a proper employment contract.',
        })
      }
    }

    // Underpaid stage
    if ((input.contractType === 'stage' || input.contractType === 'tirocinio') && input.monthlyNet !== undefined) {
      if (input.monthlyNet < 300) {
        redFlags.push({
          severity: 'warning',
          message: 'Very low internship compensation',
          detail: 'While some regions in Italy set minimum internship allowances (typically €300–€800/month), this offer is below most regional minimums. Check your region\'s specific requirements.',
        })
      }
      if (input.monthlyNet === 0) {
        redFlags.push({
          severity: 'critical',
          message: 'Unpaid internship (extracurricular)',
          detail: 'Extracurricular internships (stage) must be paid in most Italian regions. Only curricular internships (tirocinio) as part of a degree can legally be unpaid. Verify which type this really is.',
        })
      }
    }

    // Duration violations
    if (contractMeta.maxDurationMonths && input.durationMonths) {
      if (input.durationMonths > contractMeta.maxDurationMonths) {
        redFlags.push({
          severity: 'critical',
          message: `Duration exceeds legal maximum (${contractMeta.maxDurationMonths} months)`,
          detail: `This contract type has a legal maximum of ${contractMeta.maxDurationMonths} months. A longer duration is either illegal or should be converted to a different contract type.`,
        })
      }
    }

    // Excessive hours
    if (input.hoursPerWeek && input.hoursPerWeek > 40) {
      redFlags.push({
        severity: 'warning',
        message: 'Hours exceed standard full-time (40h/week)',
        detail: 'Italian law sets the standard work week at 40 hours. Overtime must be compensated and cannot exceed 250 hours/year. Make sure overtime terms are clearly stated in your contract.',
      })
    }

    // Underpaid vs CCNL minimums
    let payFairness: { status: 'fair' | 'low' | 'below_minimum' | 'unknown'; detail: string; ccnlMinimum?: number } = {
      status: 'unknown',
      detail: 'Unable to assess — provide CCNL and livello for a comparison.',
    }

    if (input.ccnl && input.livello && input.ralOffered && contractMeta.hasMinPay) {
      const ccnlKey = input.ccnl.toLowerCase().replace(/\s+/g, '_')
      const ccnlData = CCNL_MINIMUMS[ccnlKey]
      if (ccnlData) {
        const minimum = ccnlData[input.livello]
        if (minimum) {
          if (input.ralOffered < minimum * 0.85) {
            payFairness = {
              status: 'below_minimum',
              detail: `The offered RAL (€${input.ralOffered.toLocaleString()}) is significantly below the CCNL minimum for this level (€${minimum.toLocaleString()}/year). This may be illegal.`,
              ccnlMinimum: minimum,
            }
            redFlags.push({
              severity: 'critical',
              message: 'Pay below CCNL minimum',
              detail: payFairness.detail,
            })
          } else if (input.ralOffered < minimum) {
            payFairness = {
              status: 'low',
              detail: `The offered RAL (€${input.ralOffered.toLocaleString()}) is slightly below the CCNL reference for this level (€${minimum.toLocaleString()}/year). Apprendistato may legally pay up to 2 levels lower, but verify.`,
              ccnlMinimum: minimum,
            }
            redFlags.push({
              severity: 'warning',
              message: 'Pay near or below CCNL minimum',
              detail: payFairness.detail,
            })
          } else {
            payFairness = {
              status: 'fair',
              detail: `The offered RAL (€${input.ralOffered.toLocaleString()}) meets or exceeds the CCNL minimum for this level (€${minimum.toLocaleString()}/year).`,
              ccnlMinimum: minimum,
            }
          }
        }
      }
    }

    // Apprendistato without training plan
    if (input.contractType === 'apprendistato') {
      redFlags.push({
        severity: 'warning',
        message: 'Verify a formal training plan exists',
        detail: 'Apprendistato legally requires a documented individual training plan (PFI). Without it, the contract can be converted to tempo indeterminato by a labor judge. Ask to see the training plan before signing.',
      })
    }

    // --- Rights summary ---
    const rights = {
      minimumPay: contractMeta.hasMinPay,
      tfr: contractMeta.hasTFR,
      sickLeave: contractMeta.hasSickLeave,
      paidVacation: contractMeta.hasVacation,
      unemploymentBenefits: contractMeta.hasUnemployment,
      pensionContributions: contractMeta.hasContributions,
      noticePeriod: contractMeta.hasMinPay, // employees with CCNL get notice periods
      overtimeProtection: contractMeta.hasMinPay,
      maternityPaternity: contractMeta.hasMinPay,
    }

    // --- Overall assessment ---
    const criticalFlags = redFlags.filter(f => f.severity === 'critical').length
    const warningFlags = redFlags.filter(f => f.severity === 'warning').length

    let overallRisk: 'low' | 'medium' | 'high'
    let overallMessage: string

    if (criticalFlags > 0) {
      overallRisk = 'high'
      overallMessage = 'This contract has serious issues that need attention before signing. Consider consulting a labor union (sindacato) or a labor lawyer.'
    } else if (warningFlags > 1 || contractMeta.riskLevel === 'high') {
      overallRisk = 'medium'
      overallMessage = 'Some aspects of this contract deserve careful review. Make sure you understand all terms before signing.'
    } else {
      overallRisk = 'low'
      overallMessage = 'This contract type offers good protections. Review the specific terms, but the structure looks standard.'
    }

    // --- Tips ---
    const tips: string[] = []
    tips.push('Always ask for a copy of the contract before your start date — never sign on day one without reading.')
    if (contractMeta.hasMinPay) {
      tips.push('Check your CCNL (national collective agreement) to verify the correct livello and minimum pay for your role.')
    }
    if (input.contractType === 'apprendistato') {
      tips.push('Apprendistato gives the company tax breaks. In exchange, you must receive real training. If there\'s no training, it\'s not a real apprendistato.')
    }
    if (input.contractType === 'stage' || input.contractType === 'tirocinio') {
      tips.push('An internship should be a learning experience, not cheap labor. If you\'re doing the same work as employees, you may deserve a real contract.')
    }
    if (input.contractType === 'partita_iva') {
      tips.push('As a freelancer, you must pay your own taxes, INPS contributions, and have no employment protections. Factor this into the rate — your effective income is roughly 50-60% of what you invoice.')
    }
    tips.push('Join a labor union (sindacato like CGIL, CISL, UIL) — they offer free contract review and legal advice for workers.')

    return NextResponse.json({
      contractType: {
        key: input.contractType,
        nameIT: contractMeta.nameIT,
        nameEN: contractMeta.nameEN,
        riskLevel: contractMeta.riskLevel,
        maxDuration: contractMeta.maxDurationMonths,
        typicalForJuniors: contractMeta.typicalForJuniors,
      },
      assessment: {
        overallRisk,
        overallMessage,
        criticalFlags,
        warningFlags,
      },
      redFlags,
      payFairness,
      rights,
      tips,
    })
  } catch (error) {
    console.error('Error checking contract:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to check contract' },
      { status: 500 }
    )
  }
}
