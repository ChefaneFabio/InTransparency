/**
 * Unit tests for ESCO resolution — verifies the curated map + seed data are
 * well-formed, which is a data-quality guarantee our competitors can't offer.
 */

import { getCuratedEscoMap, ESCO_VERSION } from '@/lib/esco'
import { ESCO_EXTENDED } from '@/lib/esco-seed-data'

describe('ESCO curated map', () => {
  it('exposes at least the core programming + transversal skills', () => {
    const map = getCuratedEscoMap()
    // Core programming
    expect(map['python']).toBeDefined()
    expect(map['java']).toBeDefined()
    expect(map['sql']).toBeDefined()
    // Transversal (ESCO T pillar)
    expect(map['teamwork']).toBeDefined()
    expect(map['communication']).toBeDefined()
    expect(map['problem solving']).toBeDefined()
  })

  it('all curated entries have valid ESCO URI prefix', () => {
    const map = getCuratedEscoMap()
    for (const [, entry] of Object.entries(map)) {
      expect(entry.uri).toMatch(/^http:\/\/data\.europa\.eu\/esco\//)
      expect(entry.preferred).toBeTruthy()
    }
  })

  it('ESCO_VERSION is pinned (auditable)', () => {
    expect(ESCO_VERSION).toMatch(/^\d+\.\d+\.\d+$/)
  })
})

describe('ESCO extended seed map', () => {
  it('has ≥ 90 entries (covers common skill vocabulary)', () => {
    expect(Object.keys(ESCO_EXTENDED).length).toBeGreaterThanOrEqual(90)
  })

  it('covers engineering, data, design, and business buckets', () => {
    // Engineering
    expect(ESCO_EXTENDED['matlab']).toBeDefined()
    expect(ESCO_EXTENDED['solidworks']).toBeDefined()
    // Data / AI
    expect(ESCO_EXTENDED['machine learning']).toBeDefined()
    expect(ESCO_EXTENDED['pytorch']).toBeDefined()
    // Design
    expect(ESCO_EXTENDED['figma']).toBeDefined()
    // Business
    expect(ESCO_EXTENDED['sap']).toBeDefined()
  })

  it('all entries have non-empty preferred label', () => {
    for (const [term, entry] of Object.entries(ESCO_EXTENDED)) {
      expect(entry.preferred.length).toBeGreaterThan(0)
      expect(term.length).toBeGreaterThan(0)
    }
  })
})
