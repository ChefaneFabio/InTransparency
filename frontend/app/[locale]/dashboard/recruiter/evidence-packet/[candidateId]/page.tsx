'use client'

import { useEffect, useState, use } from 'react'
import { useLocale } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Award,
  Briefcase,
  CheckCircle2,
  Download,
  Eye,
  ExternalLink,
  FileText,
  GraduationCap,
  Github,
  Linkedin,
  MapPin,
  Printer,
  Shield,
  ShieldCheck,
  User,
  Network,
} from 'lucide-react'

interface EvidencePacket {
  candidate: {
    id: string
    name: string
    email: string | null
    photo: string | null
    university: string | null
    degree: string | null
    graduationYear: string | null
    location: string | null
    bio: string | null
    gpa: string | null
    linkedinUrl: string | null
    githubUrl: string | null
  }
  matchExplanation: {
    id: string
    matchScore: number
    decisionLabel: string | null
    factors: any
    modelVersion: string
    createdAt: string
  } | null
  credentials: Array<{
    id: string
    type: string
    issuer: string
    issuerType: string
    issuedAt: string
    shareUrl: string | null
    viewCount: number
  }>
  skillGraph: Array<{
    skill: string
    level: number
    sources: number
    escoUri: string | null
    lastObservedAt: string
  }>
  stages: Array<{
    id: string
    role: string
    companyName: string
    startDate: string
    endDate: string | null
    supervisorRating: number | null
    supervisorWouldHire: boolean | null
    supervisorStrengths: string | null
    completedHours: number
  }>
  endorsements: Array<{
    id: string
    professorName: string
    professorTitle: string | null
    university: string
    courseName: string | null
    rating: number | null
    grade: string | null
    projectTitle: string
    projectId: string
    skills: string[]
    verifiedAt: string | null
  }>
  generatedAt: string
}

const LEVEL_LABELS_EN = ['—', 'Beginner', 'Intermediate', 'Advanced', 'Expert']
const LEVEL_LABELS_IT = ['—', 'Principiante', 'Intermedio', 'Avanzato', 'Esperto']

export default function EvidencePacketPage({
  params,
}: {
  params: Promise<{ candidateId: string; locale: string }>
}) {
  const { candidateId } = use(params)
  const locale = useLocale()
  const isIt = locale === 'it'
  const LEVEL_LABELS = isIt ? LEVEL_LABELS_IT : LEVEL_LABELS_EN
  const [data, setData] = useState<EvidencePacket | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/dashboard/recruiter/evidence-packet/${candidateId}`)
      .then(r => (r.ok ? r.json() : null))
      .then(setData)
      .finally(() => setLoading(false))
  }, [candidateId])

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4 space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="container max-w-3xl mx-auto py-8 px-4">
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <p className="text-muted-foreground">{isIt ? 'Dossier evidenze candidato non disponibile.' : 'Candidate evidence packet unavailable.'}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const expertSkills = data.skillGraph.filter(s => s.level >= 3)
  const multiSourceSkills = data.skillGraph.filter(s => s.sources >= 2)

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4 print:p-0 print:max-w-full">
      {/* Print-only header */}
      <div className="hidden print:block mb-6 border-b pb-4">
        <h1 className="text-2xl font-bold">{isIt ? 'Dossier evidenze' : 'Evidence Packet'} · {data.candidate.name}</h1>
        <p className="text-sm text-muted-foreground">
          {isIt ? 'Generato' : 'Generated'} {new Date(data.generatedAt).toLocaleString(locale)} — InTransparency
        </p>
      </div>

      {/* Header + actions */}
      <div className="mb-6 flex items-start justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-3xl font-bold mb-1">{isIt ? 'Dossier evidenze' : 'Evidence packet'}</h1>
          <p className="text-muted-foreground">
            {isIt
              ? 'Dossier di assunzione condivisibile internamente — motivazione del match, credenziali verificate, grafo competenze, esiti dei tirocini ed endorsement dei docenti in un unico luogo.'
              : 'Internally-shareable hiring dossier — match reasoning, verified credentials, skill graph, stage outcomes, and professor endorsements in one place.'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer className="h-4 w-4 mr-1" />
            {isIt ? 'Stampa / PDF' : 'Print / PDF'}
          </Button>
        </div>
      </div>

      {/* Candidate card */}
      <Card className="mb-6">
        <CardContent className="pt-5 pb-5">
          <div className="flex items-start gap-4">
            {data.candidate.photo ? (
              <img src={data.candidate.photo} alt="" className="w-20 h-20 rounded-full object-cover" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                <User className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-1">{data.candidate.name}</h2>
              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-2">
                {data.candidate.degree && (
                  <span className="flex items-center gap-1">
                    <GraduationCap className="h-4 w-4" />
                    {data.candidate.degree}
                  </span>
                )}
                {data.candidate.university && <span>{data.candidate.university}</span>}
                {data.candidate.graduationYear && <span>{isIt ? `Promo ${data.candidate.graduationYear}` : `Class of ${data.candidate.graduationYear}`}</span>}
                {data.candidate.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {data.candidate.location}
                  </span>
                )}
                {data.candidate.gpa && (
                  <Badge variant="outline" className="text-xs">
                    GPA {data.candidate.gpa}
                  </Badge>
                )}
              </div>
              {data.candidate.bio && <p className="text-sm mt-2">{data.candidate.bio}</p>}
              <div className="flex gap-2 mt-3 print:hidden">
                {data.candidate.linkedinUrl && (
                  <Button size="sm" variant="outline" asChild>
                    <a href={data.candidate.linkedinUrl} target="_blank" rel="noreferrer">
                      <Linkedin className="h-3 w-3 mr-1" />
                      LinkedIn
                    </a>
                  </Button>
                )}
                {data.candidate.githubUrl && (
                  <Button size="sm" variant="outline" asChild>
                    <a href={data.candidate.githubUrl} target="_blank" rel="noreferrer">
                      <Github className="h-3 w-3 mr-1" />
                      GitHub
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Match explanation */}
      {data.matchExplanation && (
        <Card className="mb-6 border-primary/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center justify-between">
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                {isIt ? 'Motivazione del match' : 'Match reasoning'}
              </span>
              <div className="flex items-center gap-3">
                <Badge>{data.matchExplanation.decisionLabel?.replace('_', ' ') ?? '—'}</Badge>
                <span className="text-2xl font-bold text-primary">
                  {Math.round(data.matchExplanation.matchScore)}
                </span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-3">
              {isIt ? 'Calcolato' : 'Computed'} {new Date(data.matchExplanation.createdAt).toLocaleDateString(locale)} {isIt ? 'dal modello' : 'by model'}{' '}
              {data.matchExplanation.modelVersion}
            </p>
            <div className="space-y-2">
              {(data.matchExplanation.factors as any[])?.map((f: any, idx: number) => (
                <div key={idx} className="flex items-start gap-3 text-sm">
                  <Badge variant="outline" className="mt-0.5 text-xs flex-shrink-0">
                    +{Math.round(f.contribution ?? f.weight ?? 0)}
                  </Badge>
                  <div>
                    <div className="font-medium">{f.name}</div>
                    {f.humanReason && <div className="text-xs text-muted-foreground">{f.humanReason}</div>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Skill graph summary */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Network className="h-5 w-5 text-primary" />
            {isIt ? `Grafo competenze verificate (${data.skillGraph.length} competenze)` : `Verified skill graph (${data.skillGraph.length} skills)`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-3 mb-4 text-sm">
            <div>
              <div className="text-2xl font-bold text-emerald-600">{expertSkills.length}</div>
              <div className="text-xs text-muted-foreground">{isIt ? 'Avanzato o Esperto' : 'Advanced or Expert'}</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{multiSourceSkills.length}</div>
              <div className="text-xs text-muted-foreground">{isIt ? 'Verificate da più fonti' : 'Multi-source verified'}</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{data.skillGraph.filter(s => s.escoUri).length}</div>
              <div className="text-xs text-muted-foreground">{isIt ? 'Mappate ESCO' : 'ESCO-mapped'}</div>
            </div>
          </div>
          {data.skillGraph.length === 0 ? (
            <p className="text-sm text-muted-foreground">{isIt ? 'Nessuna competenza verificata nel grafo.' : 'No verified skills in graph yet.'}</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {data.skillGraph.slice(0, 30).map(s => (
                <Badge
                  key={s.skill}
                  variant={s.level >= 3 ? 'default' : 'secondary'}
                  className="text-xs"
                  title={`${s.sources} source${s.sources !== 1 ? 's' : ''}${s.escoUri ? ' · ESCO' : ''}`}
                >
                  {s.skill} · {LEVEL_LABELS[s.level]}
                  {s.sources >= 2 && <span className="ml-1 opacity-70">×{s.sources}</span>}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Credentials */}
      {data.credentials.length > 0 && (
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              {isIt ? `Credenziali verificabili (${data.credentials.length})` : `Verifiable credentials (${data.credentials.length})`}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.credentials.map(c => (
              <div key={c.id} className="flex items-center gap-3 p-2 border rounded">
                <Award className="h-4 w-4 text-primary flex-shrink-0" />
                <div className="flex-1">
                  <div className="font-medium text-sm">{c.type.replace(/_/g, ' ')}</div>
                  <div className="text-xs text-muted-foreground">
                    {c.issuer} · {new Date(c.issuedAt).toLocaleDateString(locale)}
                  </div>
                </div>
                {c.shareUrl && (
                  <Button variant="outline" size="sm" asChild className="print:hidden">
                    <a href={c.shareUrl} target="_blank" rel="noreferrer">
                      <Eye className="h-3 w-3 mr-1" />
                      {isIt ? 'Verifica' : 'Verify'}
                    </a>
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Stages */}
      {data.stages.length > 0 && (
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              {isIt ? `Storico tirocini (${data.stages.length})` : `Stage / internship history (${data.stages.length})`}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.stages.map(s => (
              <div key={s.id} className="border-l-2 border-primary pl-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-semibold text-sm">{s.role}</h4>
                  <span className="text-sm text-muted-foreground">@ {s.companyName}</span>
                  {s.supervisorWouldHire && (
                    <Badge variant="default" className="text-xs">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      {isIt ? 'Il supervisore lo assumerebbe' : 'Supervisor would hire'}
                    </Badge>
                  )}
                  {s.supervisorRating && (
                    <Badge variant="secondary" className="text-xs">
                      {isIt ? `Valutazione ${s.supervisorRating}/5` : `Rated ${s.supervisorRating}/5`}
                    </Badge>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(s.startDate).toLocaleDateString(locale)}
                  {s.endDate && ` → ${new Date(s.endDate).toLocaleDateString(locale)}`} · {s.completedHours}h
                </div>
                {s.supervisorStrengths && (
                  <p className="text-sm text-muted-foreground mt-1 italic">&quot;{s.supervisorStrengths}&quot;</p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Endorsements */}
      {data.endorsements.length > 0 && (
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              {isIt ? `Endorsement docenti (${data.endorsements.length})` : `Professor endorsements (${data.endorsements.length})`}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.endorsements.map(e => (
              <div key={e.id} className="border-l-2 border-primary pl-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-semibold text-sm">
                    {e.professorName}
                    {e.professorTitle && <span className="text-muted-foreground font-normal"> — {e.professorTitle}</span>}
                  </h4>
                  {e.rating && <Badge variant="secondary" className="text-xs">{isIt ? `Valutazione ${e.rating}/5` : `Rated ${e.rating}/5`}</Badge>}
                  {e.grade && <Badge variant="outline" className="text-xs">{isIt ? `Voto ${e.grade}` : `Grade ${e.grade}`}</Badge>}
                </div>
                <div className="text-xs text-muted-foreground">
                  {e.university}
                  {e.courseName && ` · ${e.courseName}`} · {isIt ? 'Progetto' : 'Project'}: {e.projectTitle}
                </div>
                {e.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {e.skills.map(s => (
                      <Badge key={s} variant="secondary" className="text-xs">
                        {s}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="mt-8 text-xs text-muted-foreground text-center print:hidden">
        {isIt ? 'Generato' : 'Generated'} {new Date(data.generatedAt).toLocaleString(locale)} — {isIt
          ? 'Dossier evidenze InTransparency. Solo per decisioni di assunzione interne. Ogni affermazione qui sopra è verificabile in modo indipendente tramite credenziali crittografiche.'
          : 'InTransparency evidence packet. For internal hiring decisions only. Every claim above can be independently verified via cryptographic credentials.'}
      </div>
    </div>
  )
}
