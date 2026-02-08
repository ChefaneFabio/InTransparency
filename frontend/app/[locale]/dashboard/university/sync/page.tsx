'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  Database,
  Users,
  BookOpen,
  FileText,
  Loader2,
  AlertTriangle,
  Wifi,
  WifiOff
} from 'lucide-react'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SyncLog {
  id: string
  universityId: string
  universityName: string
  syncType: 'MANUAL' | 'SCHEDULED' | 'WEBHOOK'
  dataType: 'STUDENTS' | 'COURSES' | 'GRADES' | 'PROJECTS' | 'CERTIFICATES'
  status: 'SUCCESS' | 'PARTIAL' | 'FAILED'
  recordsProcessed: number
  recordsCreated: number
  recordsUpdated: number
  recordsFailed: number
  errorDetails: Record<string, unknown> | null
  startedAt: string
  completedAt: string | null
  triggeredBy: string | null
}

interface SyncConnection {
  id: string
  universityId: string
  syncEnabled: boolean | null
  lastSyncAt: string | null
  syncFrequency: string | null
  verificationStatus: string
  coursesCount: number | null
  gradesCount: number | null
  projectsCount: number | null
  certificatesCount: number | null
}

interface SyncStats {
  totalSyncs: number
  successfulSyncs: number
  failedSyncs: number
  lastSync: string | null
}

interface SyncData {
  logs: SyncLog[]
  connections: SyncConnection[]
  stats: SyncStats
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatDateShort(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('it-IT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function getSyncTypeBadge(syncType: SyncLog['syncType']) {
  switch (syncType) {
    case 'MANUAL':
      return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Manuale</Badge>
    case 'SCHEDULED':
      return <Badge className="bg-purple-100 text-purple-800 border-purple-200">Programmata</Badge>
    case 'WEBHOOK':
      return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Webhook</Badge>
    default:
      return <Badge variant="outline">{syncType}</Badge>
  }
}

function getDataTypeBadge(dataType: SyncLog['dataType']) {
  const map: Record<string, { label: string; className: string }> = {
    STUDENTS: { label: 'Studenti', className: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    COURSES: { label: 'Corsi', className: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
    GRADES: { label: 'Voti', className: 'bg-amber-50 text-amber-700 border-amber-200' },
    PROJECTS: { label: 'Progetti', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    CERTIFICATES: { label: 'Certificati', className: 'bg-rose-50 text-rose-700 border-rose-200' },
  }
  const entry = map[dataType] || { label: dataType, className: '' }
  return <Badge className={entry.className}>{entry.label}</Badge>
}

function getStatusBadge(status: SyncLog['status']) {
  switch (status) {
    case 'SUCCESS':
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          <CheckCircle className="h-3 w-3 mr-1" />Completata
        </Badge>
      )
    case 'PARTIAL':
      return (
        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
          <AlertTriangle className="h-3 w-3 mr-1" />Parziale
        </Badge>
      )
    case 'FAILED':
      return (
        <Badge className="bg-red-100 text-red-800 border-red-200">
          <XCircle className="h-3 w-3 mr-1" />Fallita
        </Badge>
      )
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

// ---------------------------------------------------------------------------
// Skeleton components
// ---------------------------------------------------------------------------

function StatsRowSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-lg" />
              <div>
                <Skeleton className="h-7 w-12 mb-1" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function ConnectionsSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="p-4 border rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, j) => (
              <Skeleton key={j} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function TableSkeleton() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            {Array.from({ length: 6 }).map((_, i) => (
              <th key={i} className="p-4">
                <Skeleton className="h-4 w-20" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y">
          {Array.from({ length: 5 }).map((_, i) => (
            <tr key={i}>
              <td className="p-4"><Skeleton className="h-4 w-28" /></td>
              <td className="p-4"><Skeleton className="h-5 w-20 rounded-full" /></td>
              <td className="p-4"><Skeleton className="h-5 w-16 rounded-full" /></td>
              <td className="p-4"><Skeleton className="h-5 w-20 rounded-full" /></td>
              <td className="p-4"><Skeleton className="h-4 w-32" /></td>
              <td className="p-4"><Skeleton className="h-4 w-16" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function UniversitySyncPage() {
  const [data, setData] = useState<SyncData | null>(null)
  const [loading, setLoading] = useState(true)
  const [syncingType, setSyncingType] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/dashboard/university/sync')
      if (!res.ok) {
        console.error('Failed to fetch sync data:', res.status)
        setData(null)
        return
      }
      const json = await res.json()
      setData(json)
    } catch (err) {
      console.error('Error fetching sync data:', err)
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleManualSync = async (dataType: 'STUDENTS' | 'COURSES' | 'PROJECTS') => {
    setSyncingType(dataType)
    setSuccessMessage(null)
    setErrorMessage(null)

    try {
      const res = await fetch('/api/dashboard/university/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dataType }),
      })
      const json = await res.json()

      if (!res.ok || !json.success) {
        setErrorMessage(json.message || 'Errore durante la sincronizzazione')
      } else {
        setSuccessMessage(json.message || 'Sincronizzazione completata con successo')
        // Refresh data to show new log and updated stats
        await fetchData()
      }
    } catch (err) {
      console.error('Sync error:', err)
      setErrorMessage('Errore di connessione durante la sincronizzazione')
    } finally {
      setSyncingType(null)
      // Clear messages after 5 seconds
      setTimeout(() => {
        setSuccessMessage(null)
        setErrorMessage(null)
      }, 5000)
    }
  }

  const stats = data?.stats
  const connections = data?.connections ?? []
  const logs = data?.logs ?? []

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sincronizzazione Dati</h1>
            <p className="text-gray-600">Gestisci la sincronizzazione con i sistemi universitari</p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setLoading(true)
              fetchData()
            }}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Aggiorna
          </Button>
        </div>

        {/* Stats Row */}
        {loading ? (
          <StatsRowSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Database className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats?.totalSyncs ?? 0}</p>
                    <p className="text-sm text-gray-600">Sincronizzazioni Totali</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats?.successfulSyncs ?? 0}</p>
                    <p className="text-sm text-gray-600">Riuscite</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <XCircle className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats?.failedSyncs ?? 0}</p>
                    <p className="text-sm text-gray-600">Fallite</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Clock className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-base">
                      {stats?.lastSync ? formatDateShort(stats.lastSync) : 'Mai'}
                    </p>
                    <p className="text-sm text-gray-600">Ultima Sincronizzazione</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Connection Status */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wifi className="h-5 w-5" />
              Stato Connessioni
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <ConnectionsSkeleton />
            ) : connections.length === 0 ? (
              <div className="text-center py-12">
                <WifiOff className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Nessuna connessione universitaria configurata
                </h3>
                <p className="text-gray-600">
                  Configura una connessione per iniziare a sincronizzare i dati
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {connections.map((conn) => (
                  <div key={conn.id} className="p-4 border rounded-lg hover:border-gray-300 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          conn.syncEnabled ? 'bg-green-500' : 'bg-gray-300'
                        }`} />
                        <div>
                          <p className="font-medium text-gray-900">
                            Connessione {conn.id.slice(0, 8)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {conn.syncEnabled ? 'Sincronizzazione attiva' : 'Sincronizzazione disattivata'}
                            {conn.syncFrequency && ` \u00B7 ${conn.syncFrequency}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {conn.verificationStatus === 'VERIFIED' ? (
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            <CheckCircle className="h-3 w-3 mr-1" />Verificata
                          </Badge>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                            <Clock className="h-3 w-3 mr-1" />In Attesa
                          </Badge>
                        )}
                      </div>
                    </div>

                    {conn.lastSyncAt && (
                      <p className="text-sm text-gray-500 mb-3">
                        Ultima sincronizzazione: {formatDateTime(conn.lastSyncAt)}
                      </p>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="bg-indigo-50 rounded-lg p-3 text-center">
                        <BookOpen className="h-4 w-4 text-indigo-600 mx-auto mb-1" />
                        <p className="text-lg font-semibold text-indigo-900">{conn.coursesCount ?? 0}</p>
                        <p className="text-xs text-indigo-600">Corsi</p>
                      </div>
                      <div className="bg-amber-50 rounded-lg p-3 text-center">
                        <FileText className="h-4 w-4 text-amber-600 mx-auto mb-1" />
                        <p className="text-lg font-semibold text-amber-900">{conn.gradesCount ?? 0}</p>
                        <p className="text-xs text-amber-600">Voti</p>
                      </div>
                      <div className="bg-emerald-50 rounded-lg p-3 text-center">
                        <Database className="h-4 w-4 text-emerald-600 mx-auto mb-1" />
                        <p className="text-lg font-semibold text-emerald-900">{conn.projectsCount ?? 0}</p>
                        <p className="text-xs text-emerald-600">Progetti</p>
                      </div>
                      <div className="bg-rose-50 rounded-lg p-3 text-center">
                        <CheckCircle className="h-4 w-4 text-rose-600 mx-auto mb-1" />
                        <p className="text-lg font-semibold text-rose-900">{conn.certificatesCount ?? 0}</p>
                        <p className="text-xs text-rose-600">Certificati</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Manual Sync */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Sincronizzazione Manuale
            </CardTitle>
          </CardHeader>
          <CardContent>
            {successMessage && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                <p className="text-sm text-green-800">{successMessage}</p>
              </div>
            )}
            {errorMessage && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-800">{errorMessage}</p>
              </div>
            )}

            <p className="text-sm text-gray-600 mb-4">
              Avvia una sincronizzazione manuale per aggiornare i dati dal sistema universitario.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col items-center gap-2 hover:border-blue-300 hover:bg-blue-50"
                disabled={syncingType !== null}
                onClick={() => handleManualSync('STUDENTS')}
              >
                {syncingType === 'STUDENTS' ? (
                  <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
                ) : (
                  <Users className="h-6 w-6 text-blue-600" />
                )}
                <span className="font-medium">Sincronizza Studenti</span>
                <span className="text-xs text-gray-500">Aggiorna dati studenti</span>
              </Button>

              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col items-center gap-2 hover:border-purple-300 hover:bg-purple-50"
                disabled={syncingType !== null}
                onClick={() => handleManualSync('COURSES')}
              >
                {syncingType === 'COURSES' ? (
                  <Loader2 className="h-6 w-6 text-purple-600 animate-spin" />
                ) : (
                  <BookOpen className="h-6 w-6 text-purple-600" />
                )}
                <span className="font-medium">Sincronizza Corsi</span>
                <span className="text-xs text-gray-500">Aggiorna catalogo corsi</span>
              </Button>

              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col items-center gap-2 hover:border-emerald-300 hover:bg-emerald-50"
                disabled={syncingType !== null}
                onClick={() => handleManualSync('PROJECTS')}
              >
                {syncingType === 'PROJECTS' ? (
                  <Loader2 className="h-6 w-6 text-emerald-600 animate-spin" />
                ) : (
                  <FileText className="h-6 w-6 text-emerald-600" />
                )}
                <span className="font-medium">Sincronizza Progetti</span>
                <span className="text-xs text-gray-500">Aggiorna progetti studenti</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Sync History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Cronologia Sincronizzazioni
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <TableSkeleton />
            ) : logs.length === 0 ? (
              <div className="text-center py-12">
                <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Nessuna sincronizzazione registrata
                </h3>
                <p className="text-gray-600">
                  Le sincronizzazioni appariranno qui dopo la prima esecuzione
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left p-4 font-medium text-gray-600">Data/Ora</th>
                      <th className="text-left p-4 font-medium text-gray-600">Tipo Sync</th>
                      <th className="text-left p-4 font-medium text-gray-600">Dati</th>
                      <th className="text-left p-4 font-medium text-gray-600">Stato</th>
                      <th className="text-left p-4 font-medium text-gray-600">Record</th>
                      <th className="text-left p-4 font-medium text-gray-600">Avviata da</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {logs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50">
                        <td className="p-4">
                          <span className="text-sm text-gray-900">
                            {formatDateTime(log.startedAt)}
                          </span>
                        </td>
                        <td className="p-4">
                          {getSyncTypeBadge(log.syncType)}
                        </td>
                        <td className="p-4">
                          {getDataTypeBadge(log.dataType)}
                        </td>
                        <td className="p-4">
                          {getStatusBadge(log.status)}
                        </td>
                        <td className="p-4">
                          <div className="text-sm">
                            <span className="text-gray-900 font-medium">{log.recordsProcessed}</span>
                            <span className="text-gray-500"> elaborati</span>
                          </div>
                          <div className="flex gap-2 mt-1 text-xs text-gray-500">
                            <span className="text-green-600">+{log.recordsCreated} nuovi</span>
                            <span className="text-blue-600">{log.recordsUpdated} aggiornati</span>
                            {log.recordsFailed > 0 && (
                              <span className="text-red-600">{log.recordsFailed} falliti</span>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-gray-600">
                            {log.triggeredBy || 'Sistema'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
