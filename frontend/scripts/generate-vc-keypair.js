#!/usr/bin/env node
/**
 * Generate an Ed25519 keypair for Verifiable Credential signing.
 *
 * Usage:
 *   node scripts/generate-vc-keypair.js
 *
 * Output: PEM-encoded private and public keys + a suggested key ID.
 * Store the private key in VC_SIGNING_PRIVATE_KEY (secret) and the public key
 * in VC_SIGNING_PUBLIC_KEY (public, served at /api/credentials/public-key).
 *
 * Rotate by generating a new key, deploying it, and retaining the old public
 * key for verification of previously-issued credentials.
 */

const crypto = require('crypto')

const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519')

const privatePem = privateKey.export({ type: 'pkcs8', format: 'pem' })
const publicPem = publicKey.export({ type: 'spki', format: 'pem' })

const date = new Date().toISOString().slice(0, 10)
const keyId = `intransparency:signing-key:${date}`

console.log('\n=== ED25519 KEYPAIR FOR VC SIGNING ===\n')
console.log('Key ID (copy to VC_SIGNING_KEY_ID):')
console.log('  ' + keyId)
console.log('\nPrivate key (copy to VC_SIGNING_PRIVATE_KEY — KEEP SECRET):')
console.log(privatePem)
console.log('Public key (copy to VC_SIGNING_PUBLIC_KEY — safe to publish):')
console.log(publicPem)
console.log('=== END ===\n')
console.log('Reminder: quote the PEM when setting in .env:')
console.log('  VC_SIGNING_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n"')
