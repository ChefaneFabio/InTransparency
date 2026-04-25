'use client'

import { Link } from '@/navigation'
import { ArrowRight } from 'lucide-react'
import { ReactNode } from 'react'

/**
 * Refined hero CTA — monochromatic, hairline edges, micro-interactions.
 *
 * Design language: Linear / Vercel / Stripe.
 *   - Primary  → pure dark fill, white text, faint shimmer + arrow slide on hover
 *   - Secondary → ghost with hairline border, no fill, lifts to subtle tint
 *
 * The point is to ship a hero pair that reads as "premium" without leaning
 * on accent colour. Reserve gradients for one moment per page (the segment
 * orb / a Premium ribbon), not the CTA strip.
 */

type Variant = 'primary' | 'secondary'
type Size = 'md' | 'lg'

interface BaseProps {
  variant?: Variant
  size?: Size
  children: ReactNode
  /** Show an arrow that translates on hover. On by default for primary. */
  withArrow?: boolean
  /** Disable the hairline shimmer sweep on primary hover. */
  noShimmer?: boolean
  className?: string
}

interface AsLink extends BaseProps {
  href: string
  onClick?: never
  type?: never
  disabled?: never
}

interface AsButton extends BaseProps {
  href?: never
  onClick?: () => void
  type?: 'button' | 'submit'
  disabled?: boolean
}

type Props = AsLink | AsButton

const SIZE_CLASSES: Record<Size, string> = {
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3.5 text-[15px]',
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    'group relative overflow-hidden bg-slate-950 text-white border border-slate-950 ' +
    'hover:bg-slate-800 active:bg-slate-900 ' +
    'shadow-[0_1px_0_0_rgba(255,255,255,0.08)_inset,0_8px_24px_-12px_rgba(0,0,0,0.5)] ' +
    'dark:bg-white dark:text-slate-950 dark:border-white dark:hover:bg-slate-100 ' +
    'dark:shadow-[0_1px_0_0_rgba(255,255,255,0.4)_inset,0_8px_24px_-12px_rgba(0,0,0,0.6)]',
  secondary:
    'group bg-transparent text-slate-900 border border-slate-300 ' +
    'hover:bg-slate-100 hover:border-slate-400 active:bg-slate-200 ' +
    'dark:text-slate-100 dark:border-slate-700 dark:hover:bg-slate-800 dark:hover:border-slate-600',
}

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight ' +
  'transition-[background-color,border-color,color,box-shadow,transform] duration-200 ' +
  'disabled:opacity-50 disabled:cursor-not-allowed ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ' +
  'focus-visible:ring-slate-900 dark:focus-visible:ring-slate-100 dark:focus-visible:ring-offset-slate-950'

export default function HeroCTA(props: Props) {
  const {
    variant = 'primary',
    size = 'lg',
    children,
    withArrow,
    noShimmer = false,
    className = '',
  } = props

  // Default: arrow on primary, no arrow on secondary
  const showArrow = withArrow ?? variant === 'primary'
  const showShimmer = variant === 'primary' && !noShimmer

  const cls = `${BASE} ${SIZE_CLASSES[size]} ${VARIANT_CLASSES[variant]} ${className}`

  const inner = (
    <>
      {showShimmer && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/15 to-transparent translate-x-[-100%] group-hover:translate-x-[300%] transition-transform duration-700 ease-out"
        />
      )}
      <span className="relative">{children}</span>
      {showArrow && (
        <ArrowRight
          className="relative h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
          aria-hidden
        />
      )}
    </>
  )

  if ('href' in props && props.href) {
    return (
      <Link href={props.href as any} className={cls}>
        {inner}
      </Link>
    )
  }

  return (
    <button
      type={'type' in props ? props.type ?? 'button' : 'button'}
      onClick={'onClick' in props ? props.onClick : undefined}
      disabled={'disabled' in props ? props.disabled : false}
      className={cls}
    >
      {inner}
    </button>
  )
}
