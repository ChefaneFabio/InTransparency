/**
 * Re-encrypt every plaintext TOTP secret in the DB.
 *
 * Run once after deploying lib/encryption.ts + the modified TOTP routes.
 * Safe to run multiple times — already-encrypted rows (prefix `v1:`) are
 * skipped.
 *
 * Requires MFA_ENCRYPTION_KEY to be set in the environment.
 *
 * Usage:
 *   MFA_ENCRYPTION_KEY=<base64> npx tsx scripts/backfill-totp-encryption.ts --dry
 *   MFA_ENCRYPTION_KEY=<base64> npx tsx scripts/backfill-totp-encryption.ts
 */

import prisma from '../lib/prisma'
import { encryptSecret, isEncrypted } from '../lib/encryption'

async function main() {
  const dryRun = process.argv.includes('--dry')

  const users = await prisma.user.findMany({
    where: { totpSecret: { not: null } },
    select: { id: true, email: true, totpSecret: true, totpEnabled: true },
  })

  console.log(`[totp-encrypt] found ${users.length} users with a totpSecret`)

  let alreadyEncrypted = 0
  let toEncrypt: typeof users = []
  for (const u of users) {
    if (!u.totpSecret) continue
    if (isEncrypted(u.totpSecret)) {
      alreadyEncrypted++
    } else {
      toEncrypt.push(u)
    }
  }

  console.log(`  already encrypted: ${alreadyEncrypted}`)
  console.log(`  to encrypt:        ${toEncrypt.length}`)

  if (dryRun) {
    console.log('[totp-encrypt] --dry: no writes')
    return
  }
  if (toEncrypt.length === 0) {
    console.log('[totp-encrypt] nothing to do')
    return
  }

  let written = 0
  for (const u of toEncrypt) {
    if (!u.totpSecret) continue
    try {
      const ct = encryptSecret(u.totpSecret)
      await prisma.user.update({
        where: { id: u.id },
        data: { totpSecret: ct },
      })
      written++
      if (written % 25 === 0) {
        console.log(`  encrypted ${written}/${toEncrypt.length}`)
      }
    } catch (err) {
      console.error(`  FAILED for ${u.email}:`, err)
    }
  }
  console.log(`[totp-encrypt] done — encrypted ${written}/${toEncrypt.length}`)
}

main()
  .catch(err => {
    console.error('[totp-encrypt] fatal:', err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
