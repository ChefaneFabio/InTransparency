'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, GraduationCap, ShieldCheck } from 'lucide-react'

interface Props {
  /** Top skills to surface (max 6 will render). */
  skills: string[]
  /** Issuing institution — appears as the badge under each skill. */
  university?: string | null
  /** GPA / grade. Optional — displayed as a small evidence chip. */
  gpa?: number | string | null
  /** How many projects are verified by the institution. */
  verifiedProjects: number
  /** Total project count, for the "X of Y verified" line. */
  totalProjects: number
}

/**
 * The brand promise made visible: at-a-glance verified skills with the
 * institution that issued them, displayed as floating chips that lift
 * forward on hover. Used on the recruiter candidate-detail hero so the
 * "this is verified, not LinkedIn" message lands in one glance.
 */
export default function VerifiedSkillsRibbon({
  skills,
  university,
  gpa,
  verifiedProjects,
  totalProjects,
}: Props) {
  const top = skills.slice(0, 6)
  if (top.length === 0) return null

  return (
    <div className="mt-5">
      <div className="flex items-center gap-2 mb-2.5">
        <ShieldCheck className="h-4 w-4 text-emerald-600" />
        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
          Verified by institution
        </span>
        <span className="text-[11px] text-muted-foreground">
          · {verifiedProjects}/{totalProjects} project{totalProjects === 1 ? '' : 's'} signed
          {gpa !== null && gpa !== undefined && gpa !== '' ? ` · GPA ${gpa}` : ''}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {top.map((skill, i) => (
          <motion.div
            key={skill}
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.05 + i * 0.05, type: 'spring', stiffness: 320, damping: 24 }}
            whileHover={{ y: -3, scale: 1.03 }}
            className="group relative"
          >
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800/50 shadow-sm hover:shadow-md hover:border-emerald-400 dark:hover:border-emerald-700 transition-all">
              <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
              <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                {skill}
              </span>
              {university && (
                <span className="hidden sm:inline-flex items-center gap-0.5 text-[9px] text-slate-500 dark:text-slate-400 border-l border-slate-200 dark:border-slate-700 pl-1.5 ml-0.5">
                  <GraduationCap className="h-2.5 w-2.5" />
                  {university.slice(0, 22)}{university.length > 22 ? '…' : ''}
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
