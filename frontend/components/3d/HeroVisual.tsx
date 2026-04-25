'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import { GraduationCap, CheckCircle2, ShieldCheck } from 'lucide-react'

/**
 * Single point of swap-in for a photoreal hero scene.
 *
 * Three escape hatches, in order of fidelity:
 *   1. `imageSrc` — a pre-rendered Blender/AI-gen still (.webp/.png). Best
 *      cost/impact ratio. Drop the asset under /public/hero/ and pass the
 *      path. ~80KB for a 1200x900 webp at quality 80.
 *   2. `splineScene` — a Spline scene URL (see https://spline.design). We
 *      lazy-load @splinetool/react-spline only when this prop is set so it
 *      doesn't bloat the bundle by default. (Requires `npm i
 *      @splinetool/react-spline @splinetool/runtime` first.)
 *   3. neither → animated CSS-only fallback that's still much richer than
 *      the floating-chips orb (depth-stacked translucent panels + a
 *      "metallic credential medal" composition).
 */

interface Props {
  /** Pre-rendered photo-real scene. Highest priority if set. */
  imageSrc?: string
  /** Optional dimensions for the image (defaults to 720x720). */
  imageWidth?: number
  imageHeight?: number
  /** Spline scene URL (alternative to imageSrc). */
  splineScene?: string
  className?: string
}

export default function HeroVisual({
  imageSrc,
  imageWidth = 720,
  imageHeight = 720,
  splineScene,
  className = '',
}: Props) {
  const prefersReducedMotion = useReducedMotion()

  // 1️⃣ Pre-rendered image — the recommended path.
  if (imageSrc) {
    return (
      <div className={`relative ${className}`}>
        {/* Soft underglow that blends the image with the page bg */}
        <div
          className="absolute inset-0 -m-8 rounded-full blur-3xl opacity-50"
          style={{
            background:
              'radial-gradient(circle at 50% 60%, rgba(139,92,246,0.25), transparent 60%)',
          }}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative"
        >
          <Image
            src={imageSrc}
            alt=""
            width={imageWidth}
            height={imageHeight}
            priority
            className="w-full h-auto"
          />
        </motion.div>
      </div>
    )
  }

  // 2️⃣ Spline — left as a stub. Uncomment after installing the package.
  if (splineScene) {
    // Dynamic import would live here once @splinetool/react-spline is added:
    //   const Spline = dynamic(() => import('@splinetool/react-spline'), { ssr: false })
    //   return <Spline scene={splineScene} className={className} />
    return (
      <div className={`relative ${className} flex items-center justify-center text-muted-foreground text-sm`}>
        Spline scene support requires <code className="mx-1">@splinetool/react-spline</code>.
      </div>
    )
  }

  // 3️⃣ CSS-only fallback — a "verified credential medal" composition.
  return (
    <div className={`relative aspect-square ${className}`} style={{ perspective: '1400px' }}>
      {/* Studio backdrop — chrome-feeling radial gradient */}
      <div
        className="absolute inset-0 rounded-3xl overflow-hidden"
        style={{
          background:
            'radial-gradient(ellipse at 30% 30%, rgba(168,85,247,0.18), transparent 55%), radial-gradient(ellipse at 70% 70%, rgba(56,189,248,0.18), transparent 55%), linear-gradient(160deg, #0f172a 0%, #1e293b 60%, #0f172a 100%)',
        }}
      >
        {/* Reflective floor */}
        <div
          className="absolute bottom-0 inset-x-0 h-1/3"
          style={{
            background:
              'linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.04) 50%, rgba(0,0,0,0.4) 100%)',
          }}
        />
      </div>

      {/* Layered translucent panels — give the cinematic "stacked planes" feel */}
      <motion.div
        className="absolute"
        style={{
          left: '8%',
          top: '12%',
          width: '42%',
          height: '52%',
          transformStyle: 'preserve-3d',
          transform: 'rotateY(-18deg) rotateX(6deg)',
        }}
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        <div
          className="w-full h-full rounded-2xl border border-white/15 shadow-2xl backdrop-blur-md"
          style={{
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 100%)',
            boxShadow:
              '0 30px 60px -20px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.2)',
          }}
        >
          <div className="p-5 space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span className="text-[10px] uppercase tracking-widest text-white/70 font-semibold">
                Verified Credential
              </span>
            </div>
            <div className="text-white/90 text-sm font-semibold">Marco R.</div>
            <div className="text-[10px] text-white/60">Politecnico di Milano</div>
            <div className="flex flex-wrap gap-1 pt-2">
              {['Python · 30/30', 'ML', 'AWS'].map(s => (
                <span
                  key={s}
                  className="text-[9px] px-2 py-0.5 rounded-full bg-white/10 border border-white/15 text-white/80"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* The medal — anchors the composition like Nickel's coin */}
      <motion.div
        className="absolute"
        style={{
          left: '50%',
          top: '50%',
          width: '46%',
          aspectRatio: '1',
          transformStyle: 'preserve-3d',
          transform: 'translate(-50%,-50%) rotateY(-10deg) rotateX(8deg)',
        }}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.4, type: 'spring', stiffness: 80, damping: 16 }}
      >
        <motion.div
          animate={prefersReducedMotion ? undefined : { rotateZ: [0, 4, 0, -4, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="w-full h-full rounded-full relative"
          style={{
            background:
              'radial-gradient(circle at 30% 30%, #f1f5f9 0%, #94a3b8 35%, #475569 70%, #1e293b 100%)',
            boxShadow:
              '0 40px 80px -20px rgba(0,0,0,0.7), inset 0 4px 12px rgba(255,255,255,0.4), inset 0 -8px 24px rgba(0,0,0,0.4)',
          }}
        >
          {/* Inner ring */}
          <div
            className="absolute inset-[12%] rounded-full"
            style={{
              background:
                'radial-gradient(circle at 30% 30%, #e2e8f0 0%, #64748b 50%, #334155 100%)',
              boxShadow: 'inset 0 2px 6px rgba(255,255,255,0.5), inset 0 -4px 12px rgba(0,0,0,0.35)',
            }}
          />
          {/* Cap icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <GraduationCap className="h-[40%] w-[40%] text-slate-700 drop-shadow-lg" />
          </div>
          {/* Highlight */}
          <div
            className="absolute top-[5%] left-[15%] w-[35%] h-[30%] rounded-full opacity-40 blur-xl"
            style={{ background: 'rgba(255,255,255,0.6)' }}
          />
        </motion.div>
      </motion.div>

      {/* Floating verification badges */}
      {[
        { label: 'Signed', x: '78%', y: '22%', delay: 0.7 },
        { label: 'GPA 28', x: '72%', y: '70%', delay: 0.9 },
      ].map(b => (
        <motion.div
          key={b.label}
          className="absolute"
          style={{ left: b.x, top: b.y, transform: 'translate(-50%,-50%)' }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: b.delay }}
        >
          <motion.div
            animate={prefersReducedMotion ? undefined : { y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 border border-emerald-200 shadow-xl"
          >
            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
            <span className="text-[10px] font-semibold text-slate-800">{b.label}</span>
          </motion.div>
        </motion.div>
      ))}

      {/* Caption — only visible when there's no real asset */}
      <div className="absolute bottom-3 right-3 text-[9px] text-white/40 uppercase tracking-widest">
        Concept · placeholder for hero render
      </div>
    </div>
  )
}
