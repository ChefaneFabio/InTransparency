import { ReactNode } from 'react'
import type { Accent } from './EditorialHero'

const ACCENT_EYEBROW: Record<Accent, string> = {
  slate:   'text-slate-500',
  blue:    'text-blue-700 dark:text-blue-400',
  emerald: 'text-emerald-700 dark:text-emerald-400',
  violet:  'text-violet-700 dark:text-violet-400',
  amber:   'text-amber-700 dark:text-amber-400',
}

interface Props {
  /** HTML id for anchor links. Optional. */
  id?: string
  /** Background tone — alternate between transparent and slate-50/60 for
   *  subtle stripe rhythm down the page. */
  tone?: 'default' | 'muted'
  /** Accent applied to the eyebrow. Pass the page's segment accent. */
  accent?: Accent
  eyebrow?: string
  title: string
  lede?: string
  /** Section content below the header block. */
  children: ReactNode
  /** Bottom note — small muted text below children, typical for ROI lines. */
  endNote?: string
  /** Container width — segments default to max-w-5xl, narrow long-form
   *  sections (e.g. About) to max-w-3xl. */
  width?: 'narrow' | 'wide'
}

export function EditorialSection({
  id,
  tone = 'default',
  accent = 'slate',
  eyebrow,
  title,
  lede,
  children,
  endNote,
  width = 'wide',
}: Props) {
  const widthClass = width === 'wide' ? 'max-w-5xl' : 'max-w-3xl'
  const toneClass =
    tone === 'muted'
      ? 'bg-slate-50/60 dark:bg-slate-900/40'
      : ''

  return (
    <section
      id={id}
      className={`scroll-mt-24 border-b border-slate-200 dark:border-slate-800 ${toneClass}`}
    >
      <div className={`container ${widthClass} mx-auto px-6 py-20 lg:py-24`}>
        <div className="max-w-3xl mb-12">
          {eyebrow && (
            <div className={`text-[11px] font-medium uppercase tracking-[0.16em] mb-4 ${ACCENT_EYEBROW[accent]}`}>
              {eyebrow}
            </div>
          )}
          <h2 className="text-[34px] leading-[1.15] font-semibold tracking-tight text-slate-900 dark:text-white">
            {title}
          </h2>
          {lede && (
            <p className="mt-4 text-[17px] leading-relaxed text-slate-600 dark:text-slate-400">
              {lede}
            </p>
          )}
        </div>

        {children}

        {endNote && (
          <p className="mt-12 text-sm text-slate-500 max-w-3xl">{endNote}</p>
        )}
      </div>
    </section>
  )
}
