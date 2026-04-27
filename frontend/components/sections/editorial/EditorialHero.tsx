import { ReactNode } from 'react'

/**
 * Editorial hero — dark slate, eyebrow + display H1 + lede.
 *
 * Diversification per segment: pass `accent` to color the eyebrow (and the
 * highlight class returned for inline use in the title). Everything else
 * stays slate, so segment pages feel coherent with /pricing while having
 * a single moment of brand differentiation.
 */

export type Accent = 'slate' | 'blue' | 'emerald' | 'violet' | 'amber'

const ACCENT_TEXT: Record<Accent, string> = {
  slate:   'text-slate-300',
  blue:    'text-blue-300',
  emerald: 'text-emerald-300',
  violet:  'text-violet-300',
  amber:   'text-amber-300',
}

interface Props {
  eyebrow: string
  title: ReactNode
  lede?: string
  accent?: Accent
  /** Optional inline content slot below the lede — usually 1-2 CTAs. */
  cta?: ReactNode
  /** Optional trust strip — small uppercase chips beneath the hero. */
  trustItems?: string[]
}

export function EditorialHero({
  eyebrow,
  title,
  lede,
  accent = 'slate',
  cta,
  trustItems,
}: Props) {
  return (
    <section className="bg-slate-950 text-white">
      <div className="container max-w-5xl mx-auto px-6 pt-32 pb-16 lg:pt-40 lg:pb-20">
        <div className={`text-[11px] font-medium uppercase tracking-[0.18em] mb-6 ${ACCENT_TEXT[accent]}`}>
          {eyebrow}
        </div>
        <h1 className="text-[44px] sm:text-[56px] leading-[1.05] font-semibold tracking-tight max-w-3xl">
          {title}
        </h1>
        {lede && (
          <p className="mt-6 text-[19px] leading-relaxed text-slate-300 max-w-2xl">
            {lede}
          </p>
        )}
        {cta && <div className="mt-10">{cta}</div>}
      </div>

      {trustItems && trustItems.length > 0 && (
        <div className="border-t border-slate-800/60">
          <div className="container max-w-5xl mx-auto px-6 py-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-[12px] text-slate-400 uppercase tracking-[0.12em]">
            {trustItems.map((item, i) => (
              <span key={i} className="flex items-center gap-3">
                {i > 0 && <span className="text-slate-700">·</span>}
                <span>{item}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
