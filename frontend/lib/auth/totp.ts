/**
 * TOTP helper — wraps otplib v13 API
 */
import { TOTP, NobleCryptoPlugin, ScureBase32Plugin, generateSecret, generateURI, verify } from 'otplib'

const totp = new TOTP({
  crypto: new NobleCryptoPlugin(),
  base32: new ScureBase32Plugin(),
})

export { generateSecret }

/** Generate a 6-digit TOTP code (async) */
export const generateToken = (secret: string) => totp.generate({ secret })

/** Verify a TOTP token. Returns true/false. */
export const verifyToken = async (token: string, secret: string): Promise<boolean> => {
  const result = await verify({ token, secret })
  return result.valid
}

/** Build an otpauth:// URI for QR codes */
export const keyuri = (account: string, issuer: string, secret: string): string =>
  generateURI({
    strategy: 'totp',
    label: `${issuer}:${account}`,
    issuer,
    secret,
  })
