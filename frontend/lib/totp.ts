/**
 * TOTP (RFC 6238) for 2FA. Uses Node's crypto module — no external deps.
 *
 * Google Authenticator / 1Password / Authy compatible.
 *   - Secret: 160-bit, base32-encoded
 *   - Period: 30s
 *   - Algorithm: HMAC-SHA1
 *   - Digits: 6
 *
 * Backup codes: 8 × 8-char alphanumeric, bcrypt-hashed, single-use.
 */

import crypto from 'crypto'

const PERIOD_SEC = 30
const DIGITS = 6
const WINDOW = 1 // accept the code one period before/after for clock drift

// RFC 4648 base32 alphabet
const B32 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'

export function generateTotpSecret(): string {
  // 160 random bits (20 bytes) → 32 base32 chars
  const buf = crypto.randomBytes(20)
  let out = ''
  let bits = 0
  let value = 0
  // ES5 target — iterate via index
  for (let i = 0; i < buf.length; i++) {
    value = (value << 8) | buf[i]
    bits += 8
    while (bits >= 5) {
      out += B32[(value >>> (bits - 5)) & 0x1f]
      bits -= 5
    }
  }
  return out
}

function base32Decode(secret: string): Buffer {
  const cleaned = secret.toUpperCase().replace(/=+$/g, '').replace(/\s/g, '')
  const bytes: number[] = []
  let bits = 0
  let value = 0
  for (let i = 0; i < cleaned.length; i++) {
    const idx = B32.indexOf(cleaned[i])
    if (idx < 0) throw new Error('Invalid base32 char')
    value = (value << 5) | idx
    bits += 5
    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 0xff)
      bits -= 8
    }
  }
  return Buffer.from(bytes)
}

function computeHotp(secret: Buffer, counter: number): string {
  const buf = Buffer.alloc(8)
  buf.writeBigUInt64BE(BigInt(counter))
  const hmac = crypto.createHmac('sha1', secret).update(buf).digest()
  const offset = hmac[hmac.length - 1] & 0xf
  const code =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff)
  const otp = code % 10 ** DIGITS
  return otp.toString().padStart(DIGITS, '0')
}

/**
 * Generate the current TOTP for a given base32 secret.
 * Exposed mostly for tests; clients use verifyTotp.
 */
export function generateTotp(base32Secret: string, now: number = Date.now()): string {
  const counter = Math.floor(now / 1000 / PERIOD_SEC)
  return computeHotp(base32Decode(base32Secret), counter)
}

/**
 * Verify a user-provided 6-digit TOTP code, allowing ±1 period for clock drift.
 */
export function verifyTotp(base32Secret: string, code: string, now: number = Date.now()): boolean {
  if (!/^\d{6}$/.test(code)) return false
  const secret = base32Decode(base32Secret)
  const currentCounter = Math.floor(now / 1000 / PERIOD_SEC)
  for (let w = -WINDOW; w <= WINDOW; w++) {
    const candidate = computeHotp(secret, currentCounter + w)
    // constant-time compare
    if (
      candidate.length === code.length &&
      crypto.timingSafeEqual(Buffer.from(candidate), Buffer.from(code))
    ) {
      return true
    }
  }
  return false
}

/**
 * Build the otpauth:// URL consumed by QR codes in authenticator apps.
 */
export function buildOtpauthUrl(params: {
  issuer: string
  accountName: string
  secret: string
}): string {
  const label = encodeURIComponent(`${params.issuer}:${params.accountName}`)
  const q = new URLSearchParams({
    secret: params.secret,
    issuer: params.issuer,
    algorithm: 'SHA1',
    digits: String(DIGITS),
    period: String(PERIOD_SEC),
  })
  return `otpauth://totp/${label}?${q.toString()}`
}

/**
 * Generate 8 one-use backup codes. Each code is 8 chars base32-style;
 * return clear codes (to show the user once) + bcrypt hashes (to store).
 */
export function generateBackupCodes(): { clear: string[]; hashes: Promise<string[]> } {
  const bcrypt = require('bcryptjs')
  const clear: string[] = []
  for (let i = 0; i < 8; i++) {
    const bytes = crypto.randomBytes(5)
    let code = ''
    for (let j = 0; j < bytes.length; j++) code += B32[bytes[j] & 0x1f]
    clear.push(code.slice(0, 8))
  }
  const hashes = Promise.all(clear.map((c: string) => bcrypt.hash(c, 10)))
  return { clear, hashes }
}
