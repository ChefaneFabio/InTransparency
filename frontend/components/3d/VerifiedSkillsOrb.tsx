'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { GraduationCap, CheckCircle2, Sparkles } from 'lucide-react'

/**
 * Hero backdrop that visualizes our three values at once:
 *   - Transparency → translucent glass disc you can see through
 *   - Value of skills → real verified-skill chips orbit the centre
 *   - Learning → slow continuous rotation of the orbit ring
 *
 * Pure CSS 3D + framer-motion. Zero runtime cost beyond ~3KB and one rAF loop.
 * Honors prefers-reduced-motion: the chips stop orbiting but stay positioned.
 */

const VERIFIED_SKILLS = [
  { label: 'Python',     grade: '30/30',    badge: 'Politecnico Milano',   angle: -60 },
  { label: 'React',      grade: '28/30',    badge: 'Bocconi',              angle: 0 },
  { label: 'ML Pipeline',grade: 'A',        badge: 'Bicocca · tesi',       angle: 60 },
  { label: 'TypeScript', grade: 'progetto', badge: 'ITS Angelo Rizzoli',   angle: 130 },
  { label: 'SQL',        grade: '29/30',    badge: 'Cattolica',            angle: 200 },
  { label: 'Italian B2', grade: 'CEFR',     badge: 'Verificato',           angle: 260 },
] as const

interface Props {
  /** Container className — control sizing/positioning from the parent. */
  className?: string
}

export default function VerifiedSkillsOrb({ className = '' }: Props) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <div
      className={`relative pointer-events-none select-none ${className}`}
      style={{ perspective: '1200px' }}
      aria-hidden="true"
    >
      {/* Soft mesh-gradient halo — gives depth without a hard edge */}
      <div
        className="absolute inset-0 rounded-full blur-3xl opacity-60"
        style={{
          background:
            'radial-gradient(circle at 30% 30%, rgba(139,92,246,0.18), transparent 55%), radial-gradient(circle at 70% 70%, rgba(56,189,248,0.18), transparent 55%)',
        }}
      />

      {/* Orbit ring — slowly rotating, carries the chips */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{ transformStyle: 'preserve-3d', transform: 'rotateX(58deg)' }}
        animate={prefersReducedMotion ? undefined : { rotateZ: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
      >
        <div className="relative w-[min(80vw,520px)] aspect-square">
          {/* The translucent disc — "platform of verified evidence" */}
          <div
            className="absolute inset-[18%] rounded-full border border-white/40 dark:border-white/10"
            style={{
              background:
                'linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.15) 100%)',
              backdropFilter: 'blur(8px)',
              boxShadow:
                '0 30px 60px -20px rgba(99,102,241,0.25), inset 0 1px 0 rgba(255,255,255,0.6)',
            }}
          />

          {/* Centre crest — the institution stamp */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-20 h-20 rounded-full bg-white dark:bg-slate-900 border border-violet-200 dark:border-violet-800 shadow-xl"
            style={{ transform: 'translate(-50%,-50%) rotateX(-58deg)' }}
          >
            <GraduationCap className="h-10 w-10 text-violet-600 dark:text-violet-400" />
          </div>

          {/* Skill chips orbiting the disc */}
          {VERIFIED_SKILLS.map((skill, i) => {
            const radius = 45 // % of container
            const x = 50 + radius * Math.cos((skill.angle * Math.PI) / 180)
            const y = 50 + radius * Math.sin((skill.angle * Math.PI) / 180)
            return (
              <motion.div
                key={skill.label}
                className="absolute"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: 'translate(-50%,-50%) rotateX(-58deg)',
                  transformStyle: 'preserve-3d',
                }}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.08, duration: 0.5 }}
              >
                <motion.div
                  animate={prefersReducedMotion ? undefined : { y: [0, -6, 0] }}
                  transition={{ duration: 4 + i * 0.4, repeat: Infinity, ease: 'easeInOut' }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 dark:bg-slate-800/95 border border-violet-200/70 dark:border-violet-700/40 shadow-lg whitespace-nowrap backdrop-blur-md"
                >
                  <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                  <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                    {skill.label}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 border-l border-slate-200 dark:border-slate-700 pl-1.5">
                    {skill.grade}
                  </span>
                </motion.div>
                <div className="text-[9px] text-violet-600/70 dark:text-violet-400/70 mt-1 text-center font-medium tracking-wide uppercase">
                  {skill.badge}
                </div>
              </motion.div>
            )
          })}

          {/* Sparkle dust — subtle "learning in progress" feel */}
          {!prefersReducedMotion && [...Array(8)].map((_, i) => (
            <motion.div
              key={`sparkle-${i}`}
              className="absolute"
              style={{
                left: `${20 + (i * 9) % 70}%`,
                top: `${15 + (i * 13) % 70}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 3 + (i % 3),
                repeat: Infinity,
                delay: i * 0.7,
                ease: 'easeInOut',
              }}
            >
              <Sparkles className="h-2 w-2 text-violet-400/60" />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
