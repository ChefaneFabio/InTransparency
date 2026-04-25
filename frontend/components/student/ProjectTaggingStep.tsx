'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Loader2, Plus, X, Star } from 'lucide-react'

/**
 * Step 3 of the self-discovery flow. Replaces the old "go to projects, tag
 * them there, come back" dead-end with an in-place tagging UI.
 *
 * For each existing project the student has uploaded, asks three things:
 *   - role you actually played (free-form, e.g. "Tech lead", "Researcher")
 *   - skills used (pre-populated from project.skills, with add/remove)
 *   - pride rating (1-5 stars — "How proud are you of this work?")
 *
 * State lifts to the parent via `value` + `onChange` so the parent's existing
 * save flow (`PUT /api/student/self-discovery` with step=3, projectTags=...)
 * works unchanged.
 */

interface ProjectTag {
  role: string
  skills: string[]
  pride: number
}

export type ProjectTagsMap = Record<string, ProjectTag>

interface ProjectSummary {
  id: string
  title: string
  description: string
  skills: string[]
  technologies: string[]
  imageUrl: string | null
  courseName: string | null
}

interface Props {
  value: ProjectTagsMap
  onChange: (next: ProjectTagsMap) => void
}

export default function ProjectTaggingStep({ value, onChange }: Props) {
  const { data: session } = useSession()
  const [projects, setProjects] = useState<ProjectSummary[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [skillInputByProject, setSkillInputByProject] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!session?.user?.id) return
    fetch(`/api/projects?userId=${session.user.id}&limit=50`)
      .then(r => (r.ok ? r.json() : Promise.reject(new Error('Failed to load projects'))))
      .then(data => {
        const list: ProjectSummary[] = (data.projects || []).map((p: any) => ({
          id: p.id,
          title: p.title,
          description: p.description,
          skills: p.skills || [],
          technologies: p.technologies || [],
          imageUrl: p.imageUrl || null,
          courseName: p.courseName || null,
        }))
        setProjects(list)
        // Seed projectTags entries for any project not yet tagged so the
        // skills array reflects what the project already declared (the
        // student can prune what wasn't actually theirs).
        const seeded = { ...value }
        for (const p of list) {
          if (!seeded[p.id]) {
            seeded[p.id] = {
              role: '',
              skills: Array.from(new Set([...p.skills, ...p.technologies])).slice(0, 8),
              pride: 0,
            }
          }
        }
        onChange(seeded)
      })
      .catch((e: Error) => setError(e.message))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.id])

  const updateTag = useCallback(
    (projectId: string, partial: Partial<ProjectTag>) => {
      const current = value[projectId] || { role: '', skills: [], pride: 0 }
      onChange({ ...value, [projectId]: { ...current, ...partial } })
    },
    [value, onChange]
  )

  const addSkill = (projectId: string) => {
    const draft = (skillInputByProject[projectId] || '').trim()
    if (!draft) return
    const current = value[projectId] || { role: '', skills: [], pride: 0 }
    if (current.skills.some(s => s.toLowerCase() === draft.toLowerCase())) {
      setSkillInputByProject(s => ({ ...s, [projectId]: '' }))
      return
    }
    updateTag(projectId, { skills: [...current.skills, draft] })
    setSkillInputByProject(s => ({ ...s, [projectId]: '' }))
  }

  const removeSkill = (projectId: string, skill: string) => {
    const current = value[projectId] || { role: '', skills: [], pride: 0 }
    updateTag(projectId, { skills: current.skills.filter(s => s !== skill) })
  }

  // ── Loading ──
  if (projects === null && !error) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-sm text-rose-700 dark:text-rose-400 py-8 text-center">
        {error}
      </div>
    )
  }

  // ── Empty state — no projects yet ──
  if (projects && projects.length === 0) {
    return (
      <div className="py-10 text-center space-y-3 border border-dashed rounded-xl">
        <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
          You haven't added any projects yet. This step works best once you have one — it'll
          help you reflect on what you actually built and how proud you are of it.
        </p>
        <Button asChild size="sm" variant="outline">
          <a href="/dashboard/student/projects/new">Add your first project</a>
        </Button>
        <p className="text-xs text-muted-foreground">
          Or skip this step for now and come back later.
        </p>
      </div>
    )
  }

  // ── Per-project tagging cards ──
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        For each project, write the role you actually played, prune the skills to what was
        truly yours, and rate how proud you are of the work. Saved as you go.
      </p>

      {projects!.map(project => {
        const tag = value[project.id] || { role: '', skills: [], pride: 0 }
        const skillDraft = skillInputByProject[project.id] || ''
        return (
          <div
            key={project.id}
            className="rounded-xl border bg-card p-4 sm:p-5 space-y-4"
          >
            <div className="flex items-start gap-3">
              {project.imageUrl && (
                <img
                  src={project.imageUrl}
                  alt=""
                  className="h-14 w-14 rounded-lg object-cover bg-muted shrink-0"
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-foreground truncate">{project.title}</h3>
                {project.courseName && (
                  <p className="text-xs text-muted-foreground truncate">{project.courseName}</p>
                )}
                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{project.description}</p>
              </div>
            </div>

            {/* Role you played */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">The role you actually played</label>
              <Input
                value={tag.role}
                onChange={e => updateTag(project.id, { role: e.target.value })}
                placeholder="e.g. Tech lead · Backend · Data analyst · Visual designer"
                className="text-sm"
              />
            </div>

            {/* Skills used (chips) */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground">Skills you actually used</label>
              <div className="flex flex-wrap gap-1.5">
                {tag.skills.map(skill => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-muted text-xs text-foreground border border-border/60"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(project.id, skill)}
                      className="text-muted-foreground hover:text-foreground"
                      aria-label={`Remove ${skill}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                <div className="inline-flex items-center gap-1">
                  <Input
                    value={skillDraft}
                    onChange={e => setSkillInputByProject(s => ({ ...s, [project.id]: e.target.value }))}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addSkill(project.id)
                      }
                    }}
                    placeholder="Add a skill"
                    className="h-7 w-32 text-xs"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => addSkill(project.id)}
                    disabled={!skillDraft.trim()}
                    className="h-7 px-2"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Pre-filled from the project — keep only what was truly yours.
              </p>
            </div>

            {/* Pride rating */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">How proud are you of this work?</label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(n => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => updateTag(project.id, { pride: tag.pride === n ? 0 : n })}
                    aria-label={`${n} of 5`}
                    className="p-0.5 transition-colors"
                  >
                    <Star
                      className={`h-5 w-5 ${
                        n <= tag.pride
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-muted-foreground/30 hover:text-muted-foreground'
                      }`}
                    />
                  </button>
                ))}
                {tag.pride > 0 && (
                  <button
                    type="button"
                    onClick={() => updateTag(project.id, { pride: 0 })}
                    className="ml-2 text-[11px] text-muted-foreground hover:text-foreground"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
