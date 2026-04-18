/**
 * ESCO bulk seed script
 *
 * Run: npx tsx scripts/seed-esco.ts
 *     or: npm run seed:esco
 *
 * What it does:
 *   1. Iterates the ESCO_EXTENDED curated map (~130 skills)
 *   2. For each entry, upserts a SkillMapping row (if missing) or updates an
 *      existing row with escoUri / escoPreferred / escoVersion
 *   3. Also matches existing SkillMapping rows whose academicTerm or synonyms
 *      map to curated keys but don't yet have escoUri set, and backfills them
 *
 * Safe to re-run: idempotent (only updates rows lacking escoUri).
 *
 * For the full 13,890-skill ESCO v1.2.0 taxonomy, run this followed by a
 * separate ESCO CSV import (not implemented here — out of scope for v1).
 */

import prisma from '../lib/prisma'
import { ESCO_EXTENDED } from '../lib/esco-seed-data'
import { ESCO_VERSION } from '../lib/esco'

async function main() {
  console.log(`\n=== ESCO Seed (version ${ESCO_VERSION}) ===`)
  console.log(`Curated map size: ${Object.keys(ESCO_EXTENDED).length} skills\n`)

  let created = 0
  let updated = 0
  let alreadySet = 0

  for (const [term, entry] of Object.entries(ESCO_EXTENDED)) {
    const existing = await prisma.skillMapping.findFirst({
      where: {
        OR: [
          { academicTerm: { equals: term, mode: 'insensitive' } },
          { synonyms: { has: term } },
        ],
        locale: 'en',
      },
    })

    if (!existing) {
      await prisma.skillMapping.create({
        data: {
          academicTerm: term,
          locale: 'en',
          industryTerms: [entry.preferred],
          synonyms: [],
          demandScore: 0,
          verified: true,
          escoUri: entry.uri,
          escoPreferred: entry.preferred,
          escoVersion: ESCO_VERSION,
        },
      })
      created++
      process.stdout.write(`+ ${term} → ${entry.uri}\n`)
    } else if (!existing.escoUri) {
      await prisma.skillMapping.update({
        where: { id: existing.id },
        data: {
          escoUri: entry.uri,
          escoPreferred: entry.preferred,
          escoVersion: ESCO_VERSION,
          verified: true,
        },
      })
      updated++
      process.stdout.write(`~ ${term} (backfill ESCO)\n`)
    } else {
      alreadySet++
    }
  }

  console.log(`\n=== Done ===`)
  console.log(`Created:     ${created}`)
  console.log(`Backfilled:  ${updated}`)
  console.log(`Already set: ${alreadySet}`)
}

main()
  .catch((err) => {
    console.error('ESCO seed failed:', err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
