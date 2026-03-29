'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Plus, Search } from 'lucide-react'

const PRESET_COLORS = [
  { name: 'red', bg: 'bg-red-100 text-red-700', dot: 'bg-red-500' },
  { name: 'blue', bg: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' },
  { name: 'green', bg: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
  { name: 'amber', bg: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
  { name: 'purple', bg: 'bg-purple-100 text-purple-700', dot: 'bg-purple-500' },
]

interface Tag {
  id: string
  name: string
  colorIndex: number
  candidateCount: number
}

interface TagApplication {
  id: string
  tagId: string
  tagName: string
  tagColorIndex: number
  candidateName: string
  timestamp: string
}

export default function RecruiterTagsPage() {
  const t = useTranslations('recruiterTags')

  const [tags, setTags] = useState<Tag[]>([])
  const [tagApplications, setTagApplications] = useState<TagApplication[]>([])
  const [newTagName, setNewTagName] = useState('')
  const [selectedColor, setSelectedColor] = useState(0)
  const [search, setSearch] = useState('')

  const handleCreateTag = () => {
    if (!newTagName.trim()) return
    const newTag: Tag = {
      id: Date.now().toString(),
      name: newTagName.trim(),
      colorIndex: selectedColor,
      candidateCount: 0,
    }
    setTags((prev) => [...prev, newTag])
    setNewTagName('')
    setSelectedColor(0)
  }

  const handleDeleteTag = (id: string) => {
    setTags((prev) => prev.filter((tag) => tag.id !== id))
    setTagApplications((prev) => prev.filter((app) => app.tagId !== id))
  }

  const filteredTags = tags.filter((tag) =>
    tag.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground">{t('subtitle')}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('yourTags')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('tagNamePlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-xs"
            />
          </div>

          <div className="rounded-lg border p-4 space-y-3">
            <p className="text-sm font-medium">{t('createTag')}</p>
            <div className="flex items-end gap-3">
              <div className="flex-1 space-y-1">
                <label className="text-xs text-muted-foreground">{t('tagName')}</label>
                <Input
                  placeholder={t('tagNamePlaceholder')}
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleCreateTag()
                  }}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">{t('color')}</label>
                <div className="flex gap-2">
                  {PRESET_COLORS.map((color, i) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(i)}
                      className={`h-6 w-6 rounded-full ${color.dot} ${
                        selectedColor === i ? 'ring-2 ring-offset-2 ring-primary' : ''
                      }`}
                      aria-label={color.name}
                    />
                  ))}
                </div>
              </div>
              <Button onClick={handleCreateTag} disabled={!newTagName.trim()} size="sm">
                <Plus className="mr-1 h-4 w-4" />
                {t('create')}
              </Button>
            </div>
          </div>

          {filteredTags.length === 0 ? (
            <div className="py-8 text-center">
              <p className="font-medium">{t('noTags')}</p>
              <p className="mt-1 text-sm text-muted-foreground">{t('noTagsDesc')}</p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {filteredTags.map((tag) => (
                <div
                  key={tag.id}
                  className="flex items-center gap-2 rounded-lg border px-3 py-2"
                >
                  <Badge className={PRESET_COLORS[tag.colorIndex].bg} variant="secondary">
                    {tag.name}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {tag.candidateCount} {t('candidates')}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs text-destructive hover:text-destructive"
                    onClick={() => handleDeleteTag(tag.id)}
                  >
                    {t('delete')}
                  </Button>
                </div>
              ))}
            </div>
          )}

          <p className="text-xs text-muted-foreground italic">{t('localNote')}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('recentlyTagged')}</CardTitle>
        </CardHeader>
        <CardContent>
          {tagApplications.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">{t('noRecent')}</p>
          ) : (
            <div className="space-y-3">
              {tagApplications.map((app) => (
                <div key={app.id} className="flex items-center gap-3 text-sm">
                  <Badge
                    className={PRESET_COLORS[app.tagColorIndex].bg}
                    variant="secondary"
                  >
                    {app.tagName}
                  </Badge>
                  <span>{app.candidateName}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(app.timestamp).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {t('customFields.title')}
            <Badge variant="outline">Coming Soon</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {[0, 1, 2, 3].map((i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-muted-foreground shrink-0" />
                {t(`customFields.items.${i}`)}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
