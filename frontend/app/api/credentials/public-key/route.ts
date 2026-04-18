import { NextResponse } from 'next/server'
import { exportPublicKeyPem } from '@/lib/verifiable-credentials'

/**
 * GET /api/credentials/public-key
 *
 * Publishes our VC signing public key (SPKI PEM) so external verifiers — EU
 * Digital Wallet clients, employer systems, Europass readers — can validate
 * our Verifiable Credentials cryptographically without contacting our service.
 */
export async function GET() {
  const pem = exportPublicKeyPem()
  return new NextResponse(
    JSON.stringify(
      {
        keyId: process.env.VC_SIGNING_KEY_ID ?? 'intransparency:signing-key:dev',
        algorithm: 'Ed25519',
        format: 'spki-pem',
        publicKey: pem,
        supportedProofTypes: ['Ed25519Signature2020'],
      },
      null,
      2
    ),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    }
  )
}
