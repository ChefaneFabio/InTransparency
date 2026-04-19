'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { BadgeCheck, Save, ExternalLink, Plus, X, AlertCircle } from 'lucide-react'
import { Link } from '@/navigation'

interface ProfileValue {
  title: string
  description?: string
}
interface ProfileFaq {
  question: string
  answer: string
}
interface ProfileOffice {
  city: string
  country: string
  headcount?: number
}

interface CompanyProfileState {
  companyName: string
  slug: string
  logoUrl: string
  coverUrl: string
  tagline: string
  description: string
  foundedYear: number | null
  headquarters: string
  industries: string[]
  sizeCategory: string
  websiteUrl: string
  linkedinUrl: string
  mission: string
  vision: string
  values: ProfileValue[]
  cultureTags: string[]
  countries: string[]
  officeLocations: ProfileOffice[]
  heroVideoUrl: string
  faqs: ProfileFaq[]
  published: boolean
  verified: boolean
}

const EMPTY: CompanyProfileState = {
  companyName: '',
  slug: '',
  logoUrl: '',
  coverUrl: '',
  tagline: '',
  description: '',
  foundedYear: null,
  headquarters: '',
  industries: [],
  sizeCategory: '',
  websiteUrl: '',
  linkedinUrl: '',
  mission: '',
  vision: '',
  values: [],
  cultureTags: [],
  countries: [],
  officeLocations: [],
  heroVideoUrl: '',
  faqs: [],
  published: false,
  verified: false,
}

const SIZE_CATEGORIES = ['1-10', '11-50', '51-200', '201-1000', '1000+']

export default function CompanyProfileEditor() {
  const [profile, setProfile] = useState<CompanyProfileState>(EMPTY)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [industryInput, setIndustryInput] = useState('')
  const [cultureInput, setCultureInput] = useState('')
  const [countryInput, setCountryInput] = useState('')

  useEffect(() => {
    // Load the recruiter's session company
    fetch('/api/user/profile')
      .then(r => r.json())
      .then(data => {
        const company = data?.user?.company
        if (!company) {
          setLoading(false)
          return
        }
        return fetch(`/api/companies/profile?slug=${slugify(company)}`)
          .then(r => (r.ok ? r.json() : null))
          .then(resp => {
            if (resp?.profile) {
              const p = resp.profile
              setProfile({
                companyName: p.companyName ?? company,
                slug: p.slug ?? slugify(company),
                logoUrl: p.logoUrl ?? '',
                coverUrl: p.coverUrl ?? '',
                tagline: p.tagline ?? '',
                description: p.description ?? '',
                foundedYear: p.foundedYear ?? null,
                headquarters: p.headquarters ?? '',
                industries: p.industries ?? [],
                sizeCategory: p.sizeCategory ?? '',
                websiteUrl: p.websiteUrl ?? '',
                linkedinUrl: p.linkedinUrl ?? '',
                mission: p.mission ?? '',
                vision: p.vision ?? '',
                values: p.values ?? [],
                cultureTags: p.cultureTags ?? [],
                countries: p.countries ?? [],
                officeLocations: p.officeLocations ?? [],
                heroVideoUrl: p.heroVideoUrl ?? '',
                faqs: p.faqs ?? [],
                published: p.published ?? false,
                verified: p.verified ?? false,
              })
            } else {
              setProfile({ ...EMPTY, companyName: company, slug: slugify(company) })
            }
          })
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const save = async () => {
    setSaving(true)
    setMessage(null)
    try {
      const res = await fetch('/api/companies/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      })
      if (res.ok) {
        setMessage({ type: 'success', text: 'Profile saved.' })
      } else {
        const err = await res.json()
        setMessage({ type: 'error', text: err.error || 'Failed to save.' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error.' })
    } finally {
      setSaving(false)
    }
  }

  const addTag = (list: string[], input: string, setList: (l: string[]) => void, setInput: (s: string) => void) => {
    const trimmed = input.trim()
    if (trimmed && !list.includes(trimmed)) {
      setList([...list, trimmed])
    }
    setInput('')
  }

  const removeTag = (list: string[], idx: number, setList: (l: string[]) => void) => {
    setList(list.filter((_, i) => i !== idx))
  }

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  if (!profile.companyName) {
    return (
      <div className="container max-w-2xl mx-auto py-8 px-4">
        <Card>
          <CardContent className="pt-6 flex gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0" />
            <div>
              <h3 className="font-semibold mb-1">Set your company first</h3>
              <p className="text-sm text-muted-foreground">
                Your recruiter profile doesn&apos;t have a company assigned yet.
                <Link href="/dashboard/recruiter/settings" className="text-primary underline ml-1">
                  Update your settings
                </Link>{' '}
                to continue.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-1 flex items-center gap-2">
            {profile.companyName}
            {profile.verified && <BadgeCheck className="h-6 w-6 text-primary" />}
          </h1>
          <p className="text-muted-foreground">
            Edit your public company profile — what candidates see at{' '}
            <Link href={`/c/${profile.slug}` as any} className="text-primary hover:underline inline-flex items-center gap-1">
              /c/{profile.slug}
              <ExternalLink className="h-3 w-3" />
            </Link>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={profile.published}
              onChange={e => setProfile({ ...profile, published: e.target.checked })}
            />
            Published
          </label>
          <Button onClick={save} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving…' : 'Save'}
          </Button>
        </div>
      </div>

      {message && (
        <Card
          className={`mb-4 ${
            message.type === 'success' ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50'
          }`}
        >
          <CardContent className="pt-4 pb-4 text-sm">{message.text}</CardContent>
        </Card>
      )}

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Basics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Tagline">
                <Input value={profile.tagline} onChange={e => setProfile({ ...profile, tagline: e.target.value })} />
              </Field>
              <Field label="Founded year">
                <Input
                  type="number"
                  value={profile.foundedYear ?? ''}
                  onChange={e =>
                    setProfile({ ...profile, foundedYear: e.target.value ? parseInt(e.target.value) : null })
                  }
                />
              </Field>
              <Field label="Headquarters">
                <Input value={profile.headquarters} onChange={e => setProfile({ ...profile, headquarters: e.target.value })} />
              </Field>
              <Field label="Size">
                <select
                  value={profile.sizeCategory}
                  onChange={e => setProfile({ ...profile, sizeCategory: e.target.value })}
                  className="w-full px-3 py-2 border rounded bg-background"
                >
                  <option value="">—</option>
                  {SIZE_CATEGORIES.map(s => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Website URL">
                <Input value={profile.websiteUrl} onChange={e => setProfile({ ...profile, websiteUrl: e.target.value })} />
              </Field>
              <Field label="LinkedIn URL">
                <Input value={profile.linkedinUrl} onChange={e => setProfile({ ...profile, linkedinUrl: e.target.value })} />
              </Field>
              <Field label="Logo URL">
                <Input value={profile.logoUrl} onChange={e => setProfile({ ...profile, logoUrl: e.target.value })} />
              </Field>
              <Field label="Cover image URL">
                <Input value={profile.coverUrl} onChange={e => setProfile({ ...profile, coverUrl: e.target.value })} />
              </Field>
            </div>
            <Field label="About">
              <Textarea
                rows={4}
                value={profile.description}
                onChange={e => setProfile({ ...profile, description: e.target.value })}
              />
            </Field>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Industries & culture tags</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <TagField
              label="Industries"
              list={profile.industries}
              input={industryInput}
              setInput={setIndustryInput}
              setList={l => setProfile({ ...profile, industries: l })}
              onAdd={() =>
                addTag(profile.industries, industryInput, l => setProfile({ ...profile, industries: l }), setIndustryInput)
              }
            />
            <TagField
              label="Culture tags"
              list={profile.cultureTags}
              input={cultureInput}
              setInput={setCultureInput}
              setList={l => setProfile({ ...profile, cultureTags: l })}
              onAdd={() =>
                addTag(profile.cultureTags, cultureInput, l => setProfile({ ...profile, cultureTags: l }), setCultureInput)
              }
            />
            <TagField
              label="Countries (ISO 3166-1 alpha-2)"
              list={profile.countries}
              input={countryInput}
              setInput={setCountryInput}
              setList={l => setProfile({ ...profile, countries: l })}
              onAdd={() =>
                addTag(profile.countries, countryInput.toUpperCase(), l => setProfile({ ...profile, countries: l }), setCountryInput)
              }
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Mission & vision</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field label="Mission">
              <Textarea rows={3} value={profile.mission} onChange={e => setProfile({ ...profile, mission: e.target.value })} />
            </Field>
            <Field label="Vision">
              <Textarea rows={3} value={profile.vision} onChange={e => setProfile({ ...profile, vision: e.target.value })} />
            </Field>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Values</CardTitle>
          </CardHeader>
          <CardContent>
            {profile.values.map((v, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <Input
                  className="w-1/3"
                  value={v.title}
                  placeholder="Title"
                  onChange={e => {
                    const next = [...profile.values]
                    next[idx] = { ...v, title: e.target.value }
                    setProfile({ ...profile, values: next })
                  }}
                />
                <Input
                  value={v.description ?? ''}
                  placeholder="Short description"
                  onChange={e => {
                    const next = [...profile.values]
                    next[idx] = { ...v, description: e.target.value }
                    setProfile({ ...profile, values: next })
                  }}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setProfile({ ...profile, values: profile.values.filter((_, i) => i !== idx) })}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setProfile({ ...profile, values: [...profile.values, { title: '', description: '' }] })}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add value
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Office locations</CardTitle>
          </CardHeader>
          <CardContent>
            {profile.officeLocations.map((o, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <Input
                  placeholder="City"
                  value={o.city}
                  onChange={e => {
                    const next = [...profile.officeLocations]
                    next[idx] = { ...o, city: e.target.value }
                    setProfile({ ...profile, officeLocations: next })
                  }}
                />
                <Input
                  placeholder="Country"
                  value={o.country}
                  onChange={e => {
                    const next = [...profile.officeLocations]
                    next[idx] = { ...o, country: e.target.value }
                    setProfile({ ...profile, officeLocations: next })
                  }}
                />
                <Input
                  type="number"
                  placeholder="Headcount"
                  value={o.headcount ?? ''}
                  onChange={e => {
                    const next = [...profile.officeLocations]
                    next[idx] = { ...o, headcount: e.target.value ? parseInt(e.target.value) : undefined }
                    setProfile({ ...profile, officeLocations: next })
                  }}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setProfile({
                      ...profile,
                      officeLocations: profile.officeLocations.filter((_, i) => i !== idx),
                    })
                  }
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setProfile({
                  ...profile,
                  officeLocations: [...profile.officeLocations, { city: '', country: '' }],
                })
              }
            >
              <Plus className="h-4 w-4 mr-1" />
              Add office
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">FAQ</CardTitle>
          </CardHeader>
          <CardContent>
            {profile.faqs.map((f, idx) => (
              <div key={idx} className="space-y-2 mb-3 p-3 border rounded">
                <Input
                  placeholder="Question"
                  value={f.question}
                  onChange={e => {
                    const next = [...profile.faqs]
                    next[idx] = { ...f, question: e.target.value }
                    setProfile({ ...profile, faqs: next })
                  }}
                />
                <Textarea
                  placeholder="Answer"
                  rows={2}
                  value={f.answer}
                  onChange={e => {
                    const next = [...profile.faqs]
                    next[idx] = { ...f, answer: e.target.value }
                    setProfile({ ...profile, faqs: next })
                  }}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setProfile({ ...profile, faqs: profile.faqs.filter((_, i) => i !== idx) })}
                >
                  <X className="h-4 w-4 mr-1" />
                  Remove
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setProfile({ ...profile, faqs: [...profile.faqs, { question: '', answer: '' }] })}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add FAQ
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Hero video</CardTitle>
          </CardHeader>
          <CardContent>
            <Field label="Video embed URL (YouTube/Vimeo embed format)">
              <Input
                value={profile.heroVideoUrl}
                onChange={e => setProfile({ ...profile, heroVideoUrl: e.target.value })}
                placeholder="https://www.youtube.com/embed/…"
              />
            </Field>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={save} disabled={saving} size="lg">
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving…' : 'Save changes'}
          </Button>
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">{label}</label>
      {children}
    </div>
  )
}

function TagField({
  label,
  list,
  input,
  setInput,
  setList,
  onAdd,
}: {
  label: string
  list: string[]
  input: string
  setInput: (s: string) => void
  setList: (l: string[]) => void
  onAdd: () => void
}) {
  return (
    <div>
      <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">{label}</label>
      <div className="flex flex-wrap gap-2 mb-2">
        {list.map((item, idx) => (
          <Badge key={idx} variant="secondary" className="gap-1">
            {item}
            <button onClick={() => setList(list.filter((_, i) => i !== idx))}>
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), onAdd())}
          placeholder={`Add ${label.toLowerCase()}`}
        />
        <Button variant="outline" onClick={onAdd}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 80)
}
