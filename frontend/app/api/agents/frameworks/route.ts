import { NextRequest } from 'next/server'
import { agentJson } from '../_lib/response'
import { publicReadLimiter, enforceRateLimit } from '@/lib/rate-limit'
import { DIGCOMP, ENTRECOMP, GREENCOMP } from '@/lib/eu-frameworks'

/**
 * GET /api/agents/frameworks
 *
 * Returns the three EU competence frameworks (DigComp 2.2, EntreComp, GreenComp)
 * we surface alongside ESCO. Agents consuming this can help a student/university
 * map learning outcomes to the frameworks ministries increasingly mandate.
 */
export async function GET(req: NextRequest) {
  const limited = enforceRateLimit(publicReadLimiter, req)
  if (limited) return limited

  return agentJson(
    {
      '@type': 'CompetenceFrameworkCatalog',
      description:
        'EU competence frameworks mapped to InTransparency skills. Published by the Joint Research Centre (JRC) of the European Commission.',
      frameworks: [
        { name: 'DigComp', version: '2.2', focus: 'Digital competence', count: DIGCOMP.length, source: 'https://joint-research-centre.ec.europa.eu/digcomp_en' },
        { name: 'EntreComp', version: '1.0', focus: 'Entrepreneurship competence', count: ENTRECOMP.length, source: 'https://joint-research-centre.ec.europa.eu/entrecomp_en' },
        { name: 'GreenComp', version: '1.0', focus: 'Sustainability competence', count: GREENCOMP.length, source: 'https://joint-research-centre.ec.europa.eu/greencomp_en' },
      ],
      competences: [...DIGCOMP, ...ENTRECOMP, ...GREENCOMP],
    },
    86400
  )
}
