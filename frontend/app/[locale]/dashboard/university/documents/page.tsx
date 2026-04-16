'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import {
  Search, FileText, Upload, Trash2, Download, Shield, FolderOpen,
  GraduationCap, Building2, Briefcase, Scale, Lock, File,
  Loader2, AlertCircle, HardDrive, Eye
} from 'lucide-react'
import { GlassCard } from '@/components/dashboard/shared/GlassCard'
import { MetricHero } from '@/components/dashboard/shared/MetricHero'

interface Document {
  id: string
  fileName: string
  fileUrl: string
  fileSize: number
  mimeType: string
  category: string
  description: string | null
  tags: string[]
  confidential: boolean
  uploadedBy: string
  createdAt: string
  updatedAt: string
}

interface Stats {
  total: number
  totalSize: number
  confidential: number
  categories: Record<string, number>
}

const CATEGORIES = [
  'ACCREDITATION',
  'STUDENT_REPORT',
  'ACADEMIC',
  'PARTNERSHIP',
  'FINANCIAL',
  'COMPLIANCE',
  'INTERNAL',
  'OTHER',
] as const

const categoryIcons: Record<string, typeof FileText> = {
  ACCREDITATION: Shield,
  STUDENT_REPORT: GraduationCap,
  ACADEMIC: FileText,
  PARTNERSHIP: Building2,
  FINANCIAL: Briefcase,
  COMPLIANCE: Scale,
  INTERNAL: Lock,
  OTHER: File,
}

const mimeIcons: Record<string, string> = {
  'application/pdf': 'PDF',
  'application/msword': 'DOC',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
  'application/vnd.ms-excel': 'XLS',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'XLSX',
}

const formatBytes = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function DocumentsPage() {
  const t = useTranslations('universityDocuments')
  const [documents, setDocuments] = useState<Document[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')

  // Upload state
  const [uploadOpen, setUploadOpen] = useState(false)
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploadCategory, setUploadCategory] = useState('OTHER')
  const [uploadDescription, setUploadDescription] = useState('')
  const [uploadTags, setUploadTags] = useState('')
  const [uploadConfidential, setUploadConfidential] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  // Delete state
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchDocuments = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.set('search', searchTerm)
      if (categoryFilter) params.set('category', categoryFilter)

      const res = await fetch(`/api/dashboard/university/documents?${params.toString()}`)
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setDocuments(data.documents)
      setStats(data.stats)
    } catch {
      setError(t('error'))
    } finally {
      setLoading(false)
    }
  }, [searchTerm, categoryFilter, t])

  useEffect(() => { fetchDocuments() }, [fetchDocuments])

  const handleUpload = async () => {
    if (!uploadFile) return
    setUploading(true)
    setUploadError(null)

    try {
      const formData = new FormData()
      formData.append('file', uploadFile)
      formData.append('category', uploadCategory)
      formData.append('description', uploadDescription)
      formData.append('tags', uploadTags)
      formData.append('confidential', String(uploadConfidential))

      const res = await fetch('/api/dashboard/university/documents', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()

      if (!res.ok) {
        setUploadError(data.error || t('uploadFailed'))
        return
      }

      // Reset and refresh
      setUploadFile(null)
      setUploadCategory('OTHER')
      setUploadDescription('')
      setUploadTags('')
      setUploadConfidential(false)
      setUploadOpen(false)
      await fetchDocuments()
    } catch {
      setUploadError(t('uploadFailed'))
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm(t('deleteConfirm'))) return
    setDeleting(id)
    try {
      const res = await fetch(`/api/dashboard/university/documents?id=${id}`, { method: 'DELETE' })
      if (res.ok) await fetchDocuments()
    } catch {
      // silent
    } finally {
      setDeleting(null)
    }
  }

  const statCards = [
    { label: t('stats.total'), value: stats?.total ?? 0, icon: FolderOpen },
    { label: t('stats.totalSize'), value: stats ? formatBytes(stats.totalSize) : '0 B', icon: HardDrive },
    { label: t('stats.confidential'), value: stats?.confidential ?? 0, icon: Lock },
    { label: t('stats.categories'), value: stats ? Object.keys(stats.categories).length : 0, icon: FileText },
  ]

  return (
    <div className="min-h-screen space-y-6">
      <MetricHero gradient="primary">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
            <p className="text-muted-foreground">{t('subtitle')}</p>
          </div>
          <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
            <DialogTrigger asChild>
              <Button><Upload className="h-4 w-4 mr-2" />{t('upload')}</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>{t('uploadTitle')}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                {/* File input */}
                <div className="space-y-2">
                  <Label>{t('uploadForm.file')}</Label>
                  <div
                    onClick={() => document.getElementById('doc-upload')?.click()}
                    className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
                  >
                    <input
                      id="doc-upload"
                      type="file"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.ppt,.pptx,.txt"
                      className="hidden"
                      onChange={e => {
                        const f = e.target.files?.[0]
                        if (f) { setUploadFile(f); setUploadError(null) }
                      }}
                    />
                    {uploadFile ? (
                      <div className="flex items-center justify-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        <span className="font-medium">{uploadFile.name}</span>
                        <Badge variant="outline">{formatBytes(uploadFile.size)}</Badge>
                      </div>
                    ) : (
                      <>
                        <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">{t('uploadForm.dropzone')}</p>
                      </>
                    )}
                  </div>
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label>{t('uploadForm.category')}</Label>
                  <Select value={uploadCategory} onValueChange={setUploadCategory}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(cat => (
                        <SelectItem key={cat} value={cat}>{t(`categories.${cat}`)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label>{t('uploadForm.description')}</Label>
                  <Textarea
                    value={uploadDescription}
                    onChange={e => setUploadDescription(e.target.value)}
                    placeholder={t('uploadForm.descriptionPlaceholder')}
                    rows={2}
                  />
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label>{t('uploadForm.tags')}</Label>
                  <Input
                    value={uploadTags}
                    onChange={e => setUploadTags(e.target.value)}
                    placeholder={t('uploadForm.tagsPlaceholder')}
                  />
                </div>

                {/* Confidential */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label>{t('uploadForm.confidential')}</Label>
                    <p className="text-xs text-muted-foreground">{t('uploadForm.confidentialHint')}</p>
                  </div>
                  <Switch checked={uploadConfidential} onCheckedChange={setUploadConfidential} />
                </div>

                {uploadError && (
                  <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    {uploadError}
                  </div>
                )}

                <Button onClick={handleUpload} disabled={!uploadFile || uploading} className="w-full">
                  {uploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
                  {uploading ? t('uploadForm.uploading') : t('uploadForm.submit')}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
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
              {loading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{card.value}</div>}
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Filters */}
      <GlassCard delay={0.1}>
        <div className="p-5">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('filters.searchPlaceholder')}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[220px]">
                <SelectValue placeholder={t('filters.category')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('filters.allCategories')}</SelectItem>
                {CATEGORIES.map(cat => (
                  <SelectItem key={cat} value={cat}>{t(`categories.${cat}`)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </GlassCard>

      {/* Error */}
      {error && (
        <Card><CardContent className="pt-6">
          <p className="text-sm text-destructive text-center">{error}</p>
          <div className="flex justify-center mt-2">
            <Button variant="outline" size="sm" onClick={fetchDocuments}>{t('retry')}</Button>
          </div>
        </CardContent></Card>
      )}

      {/* Loading */}
      {loading && (
        <div className="grid gap-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i}><CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            </CardContent></Card>
          ))}
        </div>
      )}

      {/* Document List */}
      {!loading && !error && (
        <div className="grid gap-3">
          {documents.map(doc => {
            const CatIcon = categoryIcons[doc.category] || File
            const ext = mimeIcons[doc.mimeType] || doc.fileName.split('.').pop()?.toUpperCase() || 'FILE'

            return (
              <Card key={doc.id} className="hover:shadow-sm transition-shadow">
                <CardContent className="pt-5 pb-5">
                  <div className="flex items-center gap-4">
                    {/* File type icon */}
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex flex-col items-center justify-center flex-shrink-0">
                      <CatIcon className="h-5 w-5 text-primary" />
                      <span className="text-[10px] font-bold text-primary/70 mt-0.5">{ext}</span>
                    </div>

                    {/* File info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-medium truncate">{doc.fileName}</h3>
                        {doc.confidential && (
                          <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                            <Lock className="h-3 w-3 mr-0.5" />{t('confidential')}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground mt-0.5 flex-wrap">
                        <Badge variant="outline" className="text-xs">{t(`categories.${doc.category}`)}</Badge>
                        <span>{formatBytes(doc.fileSize)}</span>
                        <span>{doc.uploadedBy}</span>
                        <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                      </div>
                      {doc.description && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{doc.description}</p>
                      )}
                      {doc.tags.length > 0 && (
                        <div className="flex gap-1 mt-1 flex-wrap">
                          {doc.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="text-[10px]">{tag}</Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                      </a>
                      <a href={doc.fileUrl} download={doc.fileName}>
                        <Button variant="ghost" size="sm"><Download className="h-4 w-4" /></Button>
                      </a>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(doc.id)}
                        disabled={deleting === doc.id}
                      >
                        {deleting === doc.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4 text-destructive" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}

          {documents.length === 0 && (
            <GlassCard delay={0.1}>
              <div className="p-12 text-center">
                <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
                <h3 className="font-semibold text-lg">{t('noDocuments')}</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">{t('noDocumentsHint')}</p>
                <Button className="mt-4" onClick={() => setUploadOpen(true)}>
                  <Upload className="h-4 w-4 mr-2" />{t('upload')}
                </Button>
              </div>
            </GlassCard>
          )}
        </div>
      )}
    </div>
  )
}
