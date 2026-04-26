import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { PRESS_ITEMS } from '@/lib/config/press'

/**
 * "As featured in" / "Parla di Noi" — quiet typographic press strip.
 *
 * Greyscale by default, hover→color. Renders <Image> when a logo file is
 * configured and present; otherwise renders an italicised serif wordmark
 * so the section never displays broken images. Position on the homepage
 * is right after TrustMetrics, before HowItWorks — the natural social
 * proof slot.
 */
export async function PressSection() {
  const t = await getTranslations('pressSection')

  if (PRESS_ITEMS.length === 0) return null

  return (
    <section className="border-y border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
      <div className="container max-w-5xl mx-auto px-6 py-14">
        <div className="text-center">
          <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
            {t('eyebrow', { defaultValue: 'As featured in' })}
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {PRESS_ITEMS.map(item => {
            const content = item.logo ? (
              <Image
                src={item.logo}
                alt={item.name}
                width={160}
                height={32}
                className="h-7 w-auto opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
              />
            ) : (
              <span
                className={`text-[18px] tracking-tight text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors ${
                  item.style === 'sans' ? 'font-medium' : 'font-serif italic'
                }`}
              >
                {item.name}
              </span>
            )

            return item.href ? (
              <a
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center"
                aria-label={t('linkAria', { defaultValue: 'Read the {name} article', name: item.name })}
              >
                {content}
              </a>
            ) : (
              <span key={item.name} className="inline-flex items-center">
                {content}
              </span>
            )
          })}
        </div>
      </div>
    </section>
  )
}
