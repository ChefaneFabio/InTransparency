/**
 * Per-suite Prisma client — Neon's serverless pooler drops idle connections,
 * so tests that share a singleton across many `describe` blocks can fail
 * mid-run. Each test suite creates its own client and disconnects in afterAll.
 */

import { PrismaClient } from '@prisma/client'

export function freshDbClient(): PrismaClient {
  return new PrismaClient({ log: ['error'] })
}
