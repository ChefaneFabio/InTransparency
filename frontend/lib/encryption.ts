/**
 * AES-256-GCM symmetric encryption for sensitive DB-resident secrets
 * (currently: totpSecret).
 *
 * Key: MFA_ENCRYPTION_KEY env var, 32 raw bytes, base64-encoded.
 * Generate one with:  openssl rand -base64 32
 *
 * Storage format: `v1:<iv-base64>:<ciphertext+tag-base64>`
 *   - The `v1:` prefix lets us detect plaintext (legacy, pre-2026-05-04)
 *     vs encrypted values without a separate column. New writes always
 *     emit v1; reads accept both and decrypt only when v1.
 *   - 12-byte random IV per write.
 *   - GCM auth tag is appended to the ciphertext, then base64.
 *
 * Threat model:
 *   - Protects against DB exfiltration / backup leaks.
 *   - Does NOT protect against app-server compromise (the key lives in
 *     the runtime env). For that, use AWS KMS as the key custodian.
 *   - Does NOT protect against attackers with read access to env vars.
 */

import crypto from 'crypto'

const FORMAT_VERSION = 'v1'
const IV_BYTES = 12 // GCM standard
const KEY_BYTES = 32

let cachedKey: Buffer | null = null

function getKey(): Buffer {
  if (cachedKey) return cachedKey
  const raw = process.env.MFA_ENCRYPTION_KEY
  if (!raw) {
    throw new Error(
      'MFA_ENCRYPTION_KEY env var is not set. Generate one with `openssl rand -base64 32` and add to .env / Vercel.'
    )
  }
  const buf = Buffer.from(raw, 'base64')
  if (buf.length !== KEY_BYTES) {
    throw new Error(
      `MFA_ENCRYPTION_KEY must decode to exactly ${KEY_BYTES} bytes (got ${buf.length}). Use \`openssl rand -base64 32\`.`
    )
  }
  cachedKey = buf
  return cachedKey
}

/**
 * Encrypt a plaintext string. Returns `v1:<iv>:<ct+tag>`.
 */
export function encryptSecret(plaintext: string): string {
  const key = getKey()
  const iv = crypto.randomBytes(IV_BYTES)
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv)
  const ciphertext = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  const combined = Buffer.concat([ciphertext, tag])
  return `${FORMAT_VERSION}:${iv.toString('base64')}:${combined.toString('base64')}`
}

/**
 * Decrypt a stored secret. If the input has no `v1:` prefix, it's assumed
 * to be legacy plaintext and returned as-is — this lets the app keep
 * working through the migration window before the backfill script runs.
 */
export function decryptSecret(stored: string): string {
  if (!stored.startsWith(`${FORMAT_VERSION}:`)) {
    // Legacy plaintext — return as-is.
    // Once backfill-totp-encryption.ts has run against prod and we're
    // confident no plaintext remains, this branch can be removed.
    return stored
  }
  const parts = stored.split(':')
  if (parts.length !== 3) {
    throw new Error('encryption: malformed v1 ciphertext')
  }
  const iv = Buffer.from(parts[1], 'base64')
  const combined = Buffer.from(parts[2], 'base64')
  if (iv.length !== IV_BYTES) {
    throw new Error(`encryption: bad IV length (${iv.length})`)
  }
  if (combined.length < 16) {
    throw new Error('encryption: combined ciphertext shorter than auth tag')
  }
  const ciphertext = combined.subarray(0, combined.length - 16)
  const tag = combined.subarray(combined.length - 16)
  const decipher = crypto.createDecipheriv('aes-256-gcm', getKey(), iv)
  decipher.setAuthTag(tag)
  const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()])
  return plaintext.toString('utf8')
}

export function isEncrypted(stored: string): boolean {
  return stored.startsWith(`${FORMAT_VERSION}:`)
}
