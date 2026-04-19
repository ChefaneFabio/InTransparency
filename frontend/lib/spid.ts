/**
 * SPID / CIE scaffolding — Italian digital identity integration.
 *
 * Status: STUB. Production SPID requires:
 *   1. Registration with AgID (Agenzia per l'Italia Digitale) as a Service Provider
 *   2. SAML 2.0 metadata signed with a qualified certificate
 *   3. Onboarding with 9+ Identity Providers (Poste, InfoCert, Aruba, TIM, etc.)
 *   4. Annual audit by accredited assessor
 *
 * This file defines the integration points so UI flows can be built now
 * and the real SAML exchange wired when AgID registration completes.
 *
 * References:
 *   - https://docs.italia.it/italia/spid/spid-regole-tecniche/
 *   - https://www.spid.gov.it/en/service-providers/
 */

export type IdentityProvider =
  | 'ARUBA'
  | 'INFOCERT'
  | 'INTESA'
  | 'LEPIDA'
  | 'NAMIRIAL'
  | 'POSTE'
  | 'SIELTE'
  | 'SPIDITALIA'
  | 'TIM'
  | 'TEAMSYSTEM'
  | 'CIE' // Carta d'Identità Elettronica (separate from SPID, same interface)

export interface SpidAttributes {
  fiscalNumber: string // Codice fiscale
  name: string
  familyName: string
  email?: string
  placeOfBirth?: string
  countyOfBirth?: string
  dateOfBirth?: string
  gender?: 'M' | 'F'
  address?: string
  digitalAddress?: string // PEC
  mobilePhone?: string
}

export interface SpidAuthRequest {
  /** Service Provider identifier registered with AgID */
  issuer: string
  /** Desired assurance level (SPID levels 1/2/3; 2 is standard for employment platforms) */
  authnContextClassRef: 'https://www.spid.gov.it/SpidL1' | 'https://www.spid.gov.it/SpidL2' | 'https://www.spid.gov.it/SpidL3'
  /** Which IdP the user chose */
  idp: IdentityProvider
  /** CSRF protection + post-auth routing */
  relayState: string
}

/**
 * Returns whether SPID is live in this environment.
 * Controlled by SPID_ENABLED env var — defaults to false.
 */
export function isSpidEnabled(): boolean {
  return process.env.SPID_ENABLED === 'true'
}

/**
 * STUB — returns metadata xml that will eventually be published at
 * /api/auth/spid/metadata for AgID registration. For now, returns a
 * placeholder so the route exists.
 */
export function buildServiceProviderMetadata(): string {
  return `<?xml version="1.0"?>
<!-- SPID Service Provider metadata — placeholder.
     Populate with real SAML 2.0 metadata after AgID registration. -->
<md:EntityDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata"
                     entityID="${process.env.SPID_ENTITY_ID ?? 'https://in-transparency.com/api/auth/spid/metadata'}">
  <md:SPSSODescriptor />
</md:EntityDescriptor>`
}

/**
 * STUB — when SPID is live, this will construct a signed AuthnRequest and
 * return the redirect URL to the selected IdP.
 */
export function buildAuthRequestUrl(req: SpidAuthRequest): string {
  if (!isSpidEnabled()) {
    throw new Error('SPID is not enabled in this environment')
  }
  // Real impl: sign an AuthnRequest, encode Base64, append to IdP SSO URL
  throw new Error('SPID not yet configured — register with AgID first')
}

/**
 * List of IdPs in display order. Used by the "choose your provider" UI
 * mandated by AgID (no auto-redirect allowed).
 */
export const SPID_PROVIDERS: Array<{ id: IdentityProvider; name: string; logo?: string }> = [
  { id: 'ARUBA', name: 'Aruba ID' },
  { id: 'INFOCERT', name: 'InfoCert ID' },
  { id: 'INTESA', name: 'Intesa ID' },
  { id: 'LEPIDA', name: 'Lepida ID' },
  { id: 'NAMIRIAL', name: 'Namirial ID' },
  { id: 'POSTE', name: 'Poste ID' },
  { id: 'SIELTE', name: 'Sielte ID' },
  { id: 'SPIDITALIA', name: 'SpidItalia' },
  { id: 'TIM', name: 'TIM ID' },
  { id: 'TEAMSYSTEM', name: 'TeamSystem ID' },
  { id: 'CIE', name: "CIE — Carta d'Identità Elettronica" },
]
