'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { RefreshCw, Database, CheckCircle, XCircle, Clock, Users, BookOpen, FolderOpen, Loader2, Link2, Shield } from 'lucide-react'
import { GlassCard } from '@/components/dashboard/shared/GlassCard'
import { MetricHero } from '@/components/dashboard/shared/MetricHero'

interface SyncLog {
  id: string
  syncType: string
  dataType: string
  status: string
  recordsProcessed: number
  recordsCreated: number
  recordsUpdated: number
  recordsFailed: number
  startedAt: string
  completedAt: string | null
  errorMessage: string | null
}

interface Connection {
  id: string
  universityId: string
  syncEnabled: boolean
  lastSyncAt: string | null
  syncFrequency: string
  verificationStatus: string
  coursesCount: number
  gradesCount: number
  projectsCount: number
  certificatesCount: number
}

interface Stats {
  totalSyncs: number
  successfulSyncs: number
  failedSyncs: number
  lastSync: string | null
}

export default function SyncPage() {
  const t = useTranslations('universitySync')
  const [logs, setLogs] = useState<SyncLog[]>([])
  const [connections, setConnections] = useState<Connection[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [syncing, setSyncing] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/dashboard/university/sync')
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setLogs(data.logs)
      setConnections(data.connections)
      setStats(data.stats)
    } catch {
      setError(t('error'))
    } finally {
      setLoading(false)
    }
  }, [t])

  useEffect(() => { fetchData() }, [fetchData])

  const triggerSync = async (dataType: string) => {
    setSyncing(dataType)
    try {
      const res = await fetch('/api/dashboard/university/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dataType }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      await fetchData()
    } catch {
      setError(t('syncFailed'))
    } finally {
      setSyncing(null)
    }
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleString()
  }

  const syncTypes = [
    { key: 'STUDENTS', label: t('types.students'), icon: Users },
    { key: 'COURSES', label: t('types.courses'), icon: BookOpen },
    { key: 'PROJECTS', label: t('types.projects'), icon: FolderOpen },
  ]

  const statCards = [
    { label: t('stats.totalSyncs'), value: stats?.totalSyncs ?? 0, icon: Database },
    { label: t('stats.successful'), value: stats?.successfulSyncs ?? 0, icon: CheckCircle },
    { label: t('stats.failed'), value: stats?.failedSyncs ?? 0, icon: XCircle },
    { label: t('stats.lastSync'), value: stats?.lastSync ? new Date(stats.lastSync).toLocaleDateString() : '—', icon: Clock },
  ]

  return (
    <div className="min-h-screen space-y-6">
      <MetricHero gradient="primary">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
          <p className="text-muted-foreground">{t('subtitle')}</p>
        </div>
      </MetricHero>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, i) => (
          <GlassCard key={card.label} delay={0.1 + i * 0.05}>
            <div className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{card.label}</span>
                <card.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold">{card.value}</div>
              )}
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Connections */}
      <GlassCard delay={0.15}>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Link2 className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-semibold text-lg">{t('connections.title')}</h3>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2].map(i => (
                <div key={i} className="p-4 rounded-xl border space-y-2">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </div>
          ) : connections.length > 0 ? (
            <div className="space-y-3">
              {connections.map(conn => (
                <div key={conn.id} className="p-4 rounded-xl border space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{conn.universityId}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={conn.verificationStatus === 'VERIFIED' ? 'default' : 'secondary'}>
                        {conn.verificationStatus === 'VERIFIED' ? t('connections.verified') : t('connections.pending')}
                      </Badge>
                      <Badge variant={conn.syncEnabled ? 'default' : 'outline'}>
                        {conn.syncEnabled ? t('connections.enabled') : t('connections.disabled')}
                      </Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">{t('connections.frequency')}</p>
                      <p className="font-medium">{conn.syncFrequency}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">{t('connections.lastSync')}</p>
                      <p className="font-medium">{formatDate(conn.lastSyncAt)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">{t('connections.courses')}</p>
                      <p className="font-medium">{conn.coursesCount}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">{t('connections.projects')}</p>
                      <p className="font-medium">{conn.projectsCount}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">{t('connections.certificates')}</p>
                      <p className="font-medium">{conn.certificatesCount}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center rounded-xl border border-dashed">
              <Link2 className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
              <p className="font-medium">{t('connections.empty')}</p>
              <p className="text-sm text-muted-foreground mt-1">{t('connections.emptyHint')}</p>
            </div>
          )}
        </div>
      </GlassCard>

      {/* Manual Sync */}
      <GlassCard delay={0.2}>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-semibold text-lg">{t('manualSync.title')}</h3>
          </div>
          <p className="text-sm text-muted-foreground">{t('manualSync.description')}</p>
          <div className="grid gap-3 md:grid-cols-3">
            {syncTypes.map(type => (
              <Button
                key={type.key}
                variant="outline"
                className="h-auto p-4 flex-col gap-2"
                disabled={syncing !== null}
                onClick={() => triggerSync(type.key)}
              >
                {syncing === type.key ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <type.icon className="h-6 w-6" />
                )}
                <span>{syncing === type.key ? t('manualSync.syncing') : type.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Sync History */}
      <GlassCard delay={0.25}>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-semibold text-lg">{t('history.title')}</h3>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="flex items-center justify-between">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          ) : logs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-muted-foreground">
                    <th className="text-left py-3 px-2 font-medium">{t('history.date')}</th>
                    <th className="text-left py-3 px-2 font-medium">{t('history.type')}</th>
                    <th className="text-left py-3 px-2 font-medium">{t('history.dataType')}</th>
                    <th className="text-left py-3 px-2 font-medium">{t('history.status')}</th>
                    <th className="text-right py-3 px-2 font-medium">{t('history.records')}</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.slice(0, 20).map(log => (
                    <tr key={log.id} className="border-b last:border-0">
                      <td className="py-3 px-2">{formatDate(log.startedAt)}</td>
                      <td className="py-3 px-2">
                        <Badge variant="outline">{log.syncType}</Badge>
                      </td>
                      <td className="py-3 px-2">{log.dataType}</td>
                      <td className="py-3 px-2">
                        <Badge variant={log.status === 'SUCCESS' ? 'default' : 'destructive'}>
                          {log.status === 'SUCCESS' ? t('status.success') : t('status.failed')}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 text-right tabular-nums">{log.recordsProcessed}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center">
              <Clock className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
              <p className="text-sm text-muted-foreground">{t('history.empty')}</p>
            </div>
          )}
        </div>
      </GlassCard>

      {error && (
        <Card><CardContent className="pt-6">
          <p className="text-sm text-destructive text-center">{error}</p>
          <div className="flex justify-center mt-2">
            <Button variant="outline" size="sm" onClick={fetchData}>{t('retry')}</Button>
          </div>
        </CardContent></Card>
      )}
    </div>
  )
}
