'use client'

import { useState, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Link } from '@/navigation'
import { Upload, FileText, ArrowLeft, CheckCircle, XCircle, AlertTriangle, Loader2, Download } from 'lucide-react'
import { GlassCard } from '@/components/dashboard/shared/GlassCard'
import { MetricHero } from '@/components/dashboard/shared/MetricHero'

interface ImportResult {
  success: number
  failed: number
  skipped: number
  total: number
  errors: Array<{ row: number; email?: string; errors: string[] }>
  message: string
}

export default function ImportStudentsPage() {
  const t = useTranslations('studentImport')
  const [file, setFile] = useState<File | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ImportResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string[][]>([])

  const parsePreview = useCallback((text: string) => {
    const lines = text.trim().split('\n').slice(0, 6)
    return lines.map(line => line.split(',').map(cell => cell.trim().replace(/['"]/g, '')))
  }, [])

  const handleFileSelect = useCallback(async (selectedFile: File) => {
    if (!selectedFile.name.endsWith('.csv') && selectedFile.type !== 'text/csv') {
      setError(t('errors.invalidFormat'))
      return
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError(t('errors.fileTooLarge'))
      return
    }
    setFile(selectedFile)
    setError(null)
    setResult(null)

    const text = await selectedFile.text()
    setPreview(parsePreview(text))
  }, [t, parsePreview])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) handleFileSelect(droppedFile)
  }, [handleFileSelect])

  const handleUpload = async () => {
    if (!file) return
    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/dashboard/university/students/import', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || t('errors.uploadFailed'))
        return
      }

      setResult(data)
    } catch {
      setError(t('errors.uploadFailed'))
    } finally {
      setLoading(false)
    }
  }

  const resetAll = () => {
    setFile(null)
    setPreview([])
    setResult(null)
    setError(null)
  }

  return (
    <div className="min-h-screen space-y-6">
      <MetricHero gradient="primary">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t('importTitle')}</h1>
            <p className="text-muted-foreground">{t('importSubtitle')}</p>
          </div>
          <Link href="../students"><Button variant="outline"><ArrowLeft className="h-4 w-4 mr-2" />{t('back')}</Button></Link>
        </div>
      </MetricHero>

      {result ? (
        <GlassCard delay={0.1}>
          <div className="p-6 space-y-6">
            <div className="text-center space-y-2">
              <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold">{t('resultTitle')}</h3>
              <p className="text-muted-foreground">{result.message}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20">
                <p className="text-3xl font-bold text-emerald-600">{result.success}</p>
                <p className="text-sm text-muted-foreground">{t('resultSuccess')}</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20">
                <p className="text-3xl font-bold text-amber-600">{result.skipped}</p>
                <p className="text-sm text-muted-foreground">{t('resultSkipped')}</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-red-50 dark:bg-red-900/20">
                <p className="text-3xl font-bold text-red-600">{result.failed}</p>
                <p className="text-sm text-muted-foreground">{t('resultFailed')}</p>
              </div>
            </div>

            {result.errors.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">{t('errorDetails')}</h4>
                <div className="max-h-48 overflow-y-auto space-y-1 rounded-lg border p-3">
                  {result.errors.slice(0, 20).map((err, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
                      <span>
                        {t('errorRow', { row: err.row })}
                        {err.email && <span className="text-muted-foreground"> ({err.email})</span>}
                        : {err.errors.join(', ')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <Button onClick={resetAll}><Upload className="h-4 w-4 mr-2" />{t('importAnother')}</Button>
              <Link href="../students"><Button variant="outline">{t('back')}</Button></Link>
            </div>
          </div>
        </GlassCard>
      ) : (
        <>
          {/* CSV Format Guide */}
          <GlassCard delay={0.1}>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-semibold">{t('formatTitle')}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{t('formatDescription')}</p>
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="px-4 py-2 text-left font-medium">email</th>
                      <th className="px-4 py-2 text-left font-medium">first_name</th>
                      <th className="px-4 py-2 text-left font-medium">last_name</th>
                      <th className="px-4 py-2 text-left font-medium">course</th>
                      <th className="px-4 py-2 text-left font-medium">year</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="px-4 py-2 text-muted-foreground">mario.rossi@email.com</td>
                      <td className="px-4 py-2 text-muted-foreground">Mario</td>
                      <td className="px-4 py-2 text-muted-foreground">Rossi</td>
                      <td className="px-4 py-2 text-muted-foreground">Computer Science</td>
                      <td className="px-4 py-2 text-muted-foreground">2025</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-muted-foreground">{t('formatNote')}</p>
            </div>
          </GlassCard>

          {/* Upload Zone */}
          <GlassCard delay={0.15}>
            <div className="p-6 space-y-4">
              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => document.getElementById('csv-input')?.click()}
                className={`
                  border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors
                  ${dragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'}
                `}
              >
                <input
                  id="csv-input"
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={e => {
                    const f = e.target.files?.[0]
                    if (f) handleFileSelect(f)
                  }}
                />
                <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
                <p className="font-medium">{t('dropzone')}</p>
                <p className="text-sm text-muted-foreground mt-1">{t('dropzoneHint')}</p>
              </div>

              {file && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                    <Badge variant="outline">
                      {preview.length > 1 ? t('rowsDetected', { count: preview.length - 1 }) : t('noRows')}
                    </Badge>
                  </div>

                  {preview.length > 1 && (
                    <div className="overflow-x-auto rounded-lg border">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-muted/50">
                            {preview[0].map((header, i) => (
                              <th key={i} className="px-4 py-2 text-left font-medium">{header}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {preview.slice(1, 4).map((row, i) => (
                            <tr key={i} className="border-t">
                              {row.map((cell, j) => (
                                <td key={j} className="px-4 py-2 text-muted-foreground">{cell}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {preview.length > 4 && (
                        <p className="text-xs text-muted-foreground text-center py-2">
                          {t('moreRows', { count: preview.length - 4 })}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button onClick={handleUpload} disabled={loading}>
                      {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
                      {loading ? t('uploading') : t('importButton', { count: Math.max(preview.length - 1, 0) })}
                    </Button>
                    <Button variant="outline" onClick={resetAll}>{t('clearFile')}</Button>
                  </div>
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
                  <XCircle className="h-4 w-4 flex-shrink-0" />
                  {error}
                </div>
              )}
            </div>
          </GlassCard>

          {/* Download Template */}
          <GlassCard delay={0.2}>
            <div className="p-6 flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{t('templateTitle')}</h3>
                <p className="text-sm text-muted-foreground">{t('templateDescription')}</p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  const csv = 'email,first_name,last_name,course,year\n'
                  const blob = new Blob([csv], { type: 'text/csv' })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = 'students_template.csv'
                  a.click()
                  URL.revokeObjectURL(url)
                }}
              >
                <Download className="h-4 w-4 mr-2" />{t('downloadTemplate')}
              </Button>
            </div>
          </GlassCard>
        </>
      )}
    </div>
  )
}
