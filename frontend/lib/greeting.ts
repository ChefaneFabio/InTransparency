/**
 * Time-aware greeting that works in IT and EN.
 *
 * Italian: morning → Buongiorno, afternoon → Buon pomeriggio, evening → Buonasera.
 * English: morning → Good morning, afternoon → Good afternoon, evening → Good evening.
 *
 * Per direct user feedback: never use "Bentornato/Bentornata" — too gendered
 * and feels forced. The time-of-day greeting is gender-neutral and warmer.
 */

export type Locale = 'en' | 'it'

export function getTimeGreeting(locale: Locale = 'en'): string {
  const hour = new Date().getHours()

  if (locale === 'it') {
    if (hour < 12) return 'Buongiorno'
    if (hour < 18) return 'Buon pomeriggio'
    return 'Buonasera'
  }

  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}
