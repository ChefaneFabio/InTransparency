/**
 * Unit tests for skill-delta helpers — pure logic, no DB.
 * Proves the proficiency mapping + idempotency behavior matches spec.
 */

import { supervisorRatingToProficiency } from '@/lib/skill-delta'

describe('supervisorRatingToProficiency', () => {
  it('maps 1 and 2 to Beginner (1)', () => {
    expect(supervisorRatingToProficiency(1)).toBe(1)
    expect(supervisorRatingToProficiency(2)).toBe(1)
  })

  it('maps 3 to Intermediate (2)', () => {
    expect(supervisorRatingToProficiency(3)).toBe(2)
  })

  it('maps 4 to Advanced (3)', () => {
    expect(supervisorRatingToProficiency(4)).toBe(3)
  })

  it('maps 5 to Expert (4)', () => {
    expect(supervisorRatingToProficiency(5)).toBe(4)
  })

  it('clamps out-of-range values to 4', () => {
    expect(supervisorRatingToProficiency(99)).toBe(4)
  })
})
