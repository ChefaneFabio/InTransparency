import { NextRequest } from 'next/server'
import { verifyByShareToken } from '@/lib/verifiable-credentials'
import { agentJson, agentError } from '../../_lib/response'
import { credentialVerifyLimiter, enforceRateLimit } from '@/lib/rate-limit'

interface RouteContext {
  params: Promise<{ token: string }>
}

/**
 * GET /api/agents/verify-credential/[token]
 *
 * Cryptographically verify a W3C Verifiable Credential by its share token.
 * Returns signature validity + credential payload. Idempotent, cacheable.
 */
export async function GET(req: NextRequest, ctx: RouteContext) {
  const limited = enforceRateLimit(credentialVerifyLimiter, req)
  if (limited) return limited

  const { token } = await ctx.params
  const result = await verifyByShareToken(token)
  if (!result) return agentError('Credential not found', 404)

  return agentJson(
    {
      '@type': 'CredentialVerification',
      signatureValid: result.valid,
      status: result.status,
      credentialType: result.type,
      issuer: { name: result.issuerName },
      subject: { name: result.subjectName },
      issuedAt: result.issuedAt,
      expiresAt: result.expiresAt,
      payload: result.payload,
      verificationMethod: {
        algorithm: 'Ed25519Signature2020',
        publicKeyEndpoint: '/api/credentials/public-key',
        offlineVerificationSupported: true,
      },
    },
    60
  )
}
