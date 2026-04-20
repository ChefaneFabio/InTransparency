import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import prisma from '@/lib/prisma'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { ShieldCheck, GraduationCap } from 'lucide-react'

/**
 * Embeddable iframe widget — a company drops this into their careers page
 * with a simple <iframe>. Renders verified candidates interested in the
 * company (i.e., who followed this company's profile).
 *
 * Design principles:
 *   1. Zero custom JS on the embedding page
 *   2. No user identification — shows public, opted-in data only
 *   3. Links open in new tab (target=_top) so clicks escape the iframe
 *   4. Works without authentication — identity is derived from the slug
 *
 * Usage:
 *   <iframe
 *     src="https://www.in-transparency.com/en/embed/candidates/{slug}"
 *     width="100%"
 *     height="640"
 *     style="border:0;"
 *     loading="lazy"
 *   ></iframe>
 */

interface PageProps {
  params: Promise<{ slug: string; locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  return {
    title: `Verified candidates — ${slug} | InTransparency embed`,
    robots: { index: false, follow: false },
  }
}

export default async function EmbedCandidatesPage({ params }: PageProps) {
  const { slug } = await params
  const t = await getTranslations('embedCandidates')

  const profile = await prisma.companyProfile.findUnique({
    where: { slug },
    select: { id: true, companyName: true, logoUrl: true, slug: true, published: true },
  })

  if (!profile || !profile.published) {
    return (
      <div className="p-6 bg-white">
        <p className="text-sm text-muted-foreground">
          {t('profileNotAvailable')}
        </p>
      </div>
    )
  }

  // Pull followers that opted in to be listed (default: profile.public students)
  const follows = await prisma.companyFollow.findMany({
    where: { companyProfileId: profile.id },
    orderBy: { followedAt: 'desc' },
    take: 12,
  })

  const userIds = follows.map(f => f.userId)
  const students = userIds.length
    ? await prisma.user.findMany({
        where: {
          id: { in: userIds },
          role: 'STUDENT',
          profilePublic: true,
        },
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
          photo: true,
          university: true,
          degree: true,
          skills: true,
        },
        take: 12,
      })
    : []

  // Enrich with verified skill count for each
  const skillDeltaCounts = await prisma.skillDelta.groupBy({
    by: ['studentId'],
    where: { studentId: { in: students.map(s => s.id) } },
    _count: { _all: true },
  })
  const countByStudent = new Map(skillDeltaCounts.map(c => [c.studentId, c._count._all]))

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-4 pb-3 border-b">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <span className="font-semibold text-sm">
              {t('verifiedBy')}
            </span>
          </div>
          <a
            href={`https://www.in-transparency.com/en/c/${profile.slug}`}
            target="_top"
            rel="noreferrer"
            className="text-xs text-muted-foreground hover:text-primary"
          >
            {t('poweredBy')}
          </a>
        </div>

        {students.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">
            {t('noCandidates')}
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-2">
            {students.map(s => {
              const name = [s.firstName, s.lastName].filter(Boolean).join(' ') || s.username || t('anonymous')
              const skillCount = countByStudent.get(s.id) ?? 0
              const profileHref = s.username
                ? `https://www.in-transparency.com/en/students/${s.username}/public`
                : `https://www.in-transparency.com/en/students/${s.id}/public`
              return (
                <Card key={s.id} className="hover:border-primary transition-colors">
                  <CardContent className="pt-3 pb-3">
                    <a href={profileHref} target="_top" rel="noreferrer" className="block">
                      <div className="flex items-start gap-3">
                        {s.photo ? (
                          <img
                            src={s.photo}
                            alt=""
                            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-muted flex-shrink-0 flex items-center justify-center text-xs font-semibold">
                            {name.slice(0, 1)}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1 mb-0.5">
                            <p className="font-medium text-sm text-foreground truncate">{name}</p>
                            {skillCount > 0 && (
                              <Badge variant="outline" className="text-[10px] px-1 h-4">
                                {skillCount} {t('verified')}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-[11px] text-muted-foreground mb-1">
                            <GraduationCap className="h-3 w-3" />
                            <span className="truncate">
                              {s.degree ? `${s.degree} · ` : ''}
                              {s.university ?? t('university')}
                            </span>
                          </div>
                          {s.skills && s.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {s.skills.slice(0, 3).map(sk => (
                                <span
                                  key={sk}
                                  className="text-[10px] text-muted-foreground bg-muted px-1.5 rounded"
                                >
                                  {sk}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </a>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        <p className="mt-4 text-[11px] text-muted-foreground text-center">
          {t('footerNote')}
        </p>
      </div>
    </div>
  )
}
