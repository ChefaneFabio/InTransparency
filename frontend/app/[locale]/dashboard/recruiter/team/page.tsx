'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { UserPlus, Users, Shield, Trash2, Building2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { GlassCard } from '@/components/dashboard/shared/GlassCard'
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/ui/animated-card'

interface OrgMember {
  id: string
  firstName: string | null
  lastName: string | null
  email: string
  photo: string | null
  orgRole: string
  jobTitle: string | null
  lastLoginAt: string | null
}

interface OrgData {
  id: string
  name: string
  type: string
  members: OrgMember[]
  subdivisions: Array<{ id: string; name: string; city: string | null; _count: { members: number } }>
}

const roleColors: Record<string, string> = {
  OWNER: 'bg-amber-100 text-amber-700',
  ADMIN: 'bg-blue-100 text-blue-700',
  MANAGER: 'bg-green-100 text-green-700',
  MEMBER: 'bg-slate-100 text-slate-700',
}

export default function TeamPage() {
  const t = useTranslations('recruiterTeam')
  const [org, setOrg] = useState<OrgData | null>(null)
  const [userRole, setUserRole] = useState('MEMBER')
  const [loading, setLoading] = useState(true)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('MEMBER')
  const [inviting, setInviting] = useState(false)
  const [creating, setCreating] = useState(false)
  const [orgName, setOrgName] = useState('')

  useEffect(() => {
    const fetchOrg = async () => {
      try {
        const res = await fetch('/api/organization')
        if (res.ok) {
          const data = await res.json()
          setOrg(data.organization)
          setUserRole(data.userRole || 'MEMBER')
        }
      } catch (err) {
        console.error('Failed to load organization:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchOrg()
  }, [])

  const handleCreateOrg = async () => {
    if (!orgName.trim()) return
    setCreating(true)
    try {
      const res = await fetch('/api/organization', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: orgName }),
      })
      if (res.ok) {
        const data = await res.json()
        setOrg({ ...data.organization, members: [], subdivisions: [] })
        setUserRole('OWNER')
      }
    } catch (err) {
      console.error('Failed to create organization:', err)
    } finally {
      setCreating(false)
    }
  }

  const handleInvite = async () => {
    if (!inviteEmail.trim()) return
    setInviting(true)
    try {
      const res = await fetch('/api/organization/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
      })
      if (res.ok) {
        const data = await res.json()
        if (org) {
          setOrg({ ...org, members: [...org.members, data.member] })
        }
        setInviteEmail('')
      } else {
        const err = await res.json()
        alert(err.error || 'Failed to invite')
      }
    } catch (err) {
      console.error('Failed to invite:', err)
    } finally {
      setInviting(false)
    }
  }

  const handleRemove = async (userId: string) => {
    if (!confirm('Remove this team member?')) return
    try {
      const res = await fetch('/api/organization/members', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      })
      if (res.ok && org) {
        setOrg({ ...org, members: org.members.filter(m => m.id !== userId) })
      }
    } catch (err) {
      console.error('Failed to remove member:', err)
    }
  }

  const canManage = userRole === 'OWNER' || userRole === 'ADMIN'

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 pb-12">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    )
  }

  // No organization yet — show create flow
  if (!org) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-6">
        <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl mx-auto flex items-center justify-center">
          <Building2 className="h-9 w-9 text-primary/60" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('title')}</h1>
          <p className="text-muted-foreground mt-2">{t('subtitle')}</p>
        </div>
        <div className="flex gap-2 max-w-sm mx-auto">
          <Input
            placeholder={t('members.orgNamePlaceholder') || 'Organization name'}
            value={orgName}
            onChange={e => setOrgName(e.target.value)}
          />
          <Button onClick={handleCreateOrg} disabled={creating || !orgName.trim()}>
            {creating ? '...' : t('members.createOrg') || 'Create'}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <AnimatedSection>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{org.name}</h1>
          <p className="text-muted-foreground">{t('subtitle')} · {org.members.length} {t('members.title').toLowerCase()}</p>
        </div>
      </AnimatedSection>

      {/* Invite new member */}
      {canManage && (
        <GlassCard delay={0.1} gradient="primary">
          <div className="p-5">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <UserPlus className="h-4 w-4" /> {t('members.invite')}
            </h3>
            <div className="flex gap-2">
              <Input
                placeholder="email@company.com"
                value={inviteEmail}
                onChange={e => setInviteEmail(e.target.value)}
                className="flex-1"
              />
              <Select value={inviteRole} onValueChange={setInviteRole}>
                <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="MANAGER">Manager</SelectItem>
                  <SelectItem value="MEMBER">Member</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleInvite} disabled={inviting || !inviteEmail.trim()}>
                {inviting ? '...' : t('members.invite')}
              </Button>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Members list */}
      <GlassCard delay={0.2} hover={false}>
        <div className="p-5">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Users className="h-4 w-4" /> {t('members.title')}
          </h3>
          <StaggerContainer className="space-y-2">
            {org.members.map(member => (
              <StaggerItem key={member.id}>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-white/40 dark:border-slate-700/40">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={member.photo || undefined} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-white text-sm font-semibold">
                      {(member.firstName || '?')[0]}{(member.lastName || '?')[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground">
                      {[member.firstName, member.lastName].filter(Boolean).join(' ') || member.email}
                    </p>
                    <p className="text-xs text-muted-foreground">{member.email}</p>
                  </div>
                  <Badge className={`text-xs ${roleColors[member.orgRole] || roleColors.MEMBER}`}>
                    {member.orgRole}
                  </Badge>
                  {canManage && member.orgRole !== 'OWNER' && (
                    <Button size="sm" variant="ghost" onClick={() => handleRemove(member.id)}>
                      <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                    </Button>
                  )}
                </div>
              </StaggerItem>
            ))}
            {org.members.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-6">{t('members.noMembers') || 'No team members yet'}</p>
            )}
          </StaggerContainer>
        </div>
      </GlassCard>

      {/* Subdivisions (TechPark only) */}
      {org.type === 'TECHPARK' && org.subdivisions && org.subdivisions.length > 0 && (
        <GlassCard delay={0.3} hover={false}>
          <div className="p-5">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <Shield className="h-4 w-4" /> Subdivisions
            </h3>
            <div className="space-y-2">
              {org.subdivisions.map(sub => (
                <div key={sub.id} className="flex items-center justify-between p-3 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-white/40">
                  <div>
                    <p className="font-medium text-sm">{sub.name}</p>
                    {sub.city && <p className="text-xs text-muted-foreground">{sub.city}</p>}
                  </div>
                  <Badge variant="secondary" className="text-xs">{sub._count.members} members</Badge>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  )
}
