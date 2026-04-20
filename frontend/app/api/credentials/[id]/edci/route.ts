import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { buildEdciCredential, inferAchievements } from '@/lib/edci'
import { credentialVerifyLimiter, enforceRateLimit } from '@/lib/rate-limit'

interface RouteContext {
  params: Promise<{ id: string }>
}

/**
 * GET /api/credentials/[id]/edci
 *
 * Returns a credential in EU-Commission EDCI (European Digital Credentials
 * for Learning) format. This is the shape consumed by the EU Digital Wallet
 * and the Europass recognition tooling.
 *
 * Read-only, public (the credential subject's name is already public via
 * the share-token flow). Cryptographic proof carries over from Ed25519.
 */
export async function GET(req: NextRequest, ctx: RouteContext) {
  const limited = enforceRateLimit(credentialVerifyLimiter, req)
  if (limited) return limited

  const { id } = await ctx.params

  const vc = await prisma.verifiableCredential.findUnique({ where: { id } })
  if (!vc) return NextResponse.json({ error: 'Credential not found' }, { status: 404 })
  if (vc.status !== 'ISSUED') {
    return NextResponse.json(
      { error: `Credential status is ${vc.status}; EDCI export only available for ISSUED credentials` },
      { status: 400 }
    )
  }

  // Parse subject name from the already-stored payload
  const payload = vc.payload as any
  const fullName = payload?.credentialSubject?.name ?? vc.subjectName
  const [givenName, ...rest] = (fullName ?? '').split(' ')
  const familyName = rest.join(' ') || undefined

  const edci = buildEdciCredential({
    internalId: vc.id,
    issuerName: vc.issuerName,
    issuerType: vc.issuerType as any,
    issuerCountry: 'IT', // Most issuers are Italian institutions at time of writing
    subjectId: vc.subjectId,
    subjectGivenName: givenName || undefined,
    subjectFamilyName: familyName,
    achievements: inferAchievements({ credentialType: vc.credentialType, payload: vc.payload as any }),
    issuedAt: vc.issuedAt,
    expiresAt: vc.expiresAt,
    proofCreated: vc.proofCreated,
    proofValue: vc.proofValue,
    verificationMethod: vc.verificationMethod,
  })

  return NextResponse.json(edci, {
    status: 200,
    headers: {
      'Content-Type': 'application/ld+json; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600',
      'Access-Control-Allow-Origin': '*',
    },
  })
}
