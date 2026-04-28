'use client'

import { useTranslations } from 'next-intl'
import { Label } from '@/components/ui/label'

/**
 * Shared country picker for registration + profile forms.
 *
 * Replaces the previous pattern of hardcoding mixed-language native country
 * names ("Italia", "Deutschland", "France", ...) inside each form. With this
 * component, country names render in the active locale: an IT user sees
 * "Germania"; an EN user sees "Germany". Order matches the EU expansion
 * sequence in our memory (IT first, then DACH/Iberia/Benelux/Nordics).
 *
 * To add a country: extend `COUNTRY_CODES` here AND add the locale labels
 * under `auth.countries.{CODE}` in messages/{en,it}.json.
 */

export const COUNTRY_CODES = [
  'IT', 'DE', 'FR', 'ES', 'NL', 'PT', 'PL', 'RO', 'SE',
  'AT', 'BE', 'GR', 'IE', 'DK', 'FI',
] as const

export type CountryCode = typeof COUNTRY_CODES[number]

interface CountrySelectProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  required?: boolean
  /** HTML id for the underlying <select>. Defaults to "country". */
  id?: string
  /** Skip rendering the label — useful when caller controls it externally. */
  hideLabel?: boolean
  /** Append an "Altro / Other" option at the bottom. Off by default since
   *  most flows want a strict country list. */
  includeOther?: boolean
}

export function CountrySelect({
  value,
  onChange,
  disabled,
  required,
  id = 'country',
  hideLabel,
  includeOther,
}: CountrySelectProps) {
  const t = useTranslations('auth.countries')

  return (
    <div>
      {!hideLabel && (
        <Label htmlFor={id}>
          {t('label')}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </Label>
      )}
      <select
        id={id}
        className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
        required={required}
      >
        {COUNTRY_CODES.map(code => (
          <option key={code} value={code}>
            {t(code)}
          </option>
        ))}
        {includeOther && (
          <option value="OTHER">{t('other')}</option>
        )}
      </select>
    </div>
  )
}
