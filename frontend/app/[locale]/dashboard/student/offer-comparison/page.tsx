'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Offer {
  id: string
  company: string
  role: string
  ral: string
  contractType: string
  location: string
  remote: string
  benefits: string
}

const EMPTY_OFFER: Offer = { id: '', company: '', role: '', ral: '', contractType: '', location: '', remote: '', benefits: '' }

export default function OfferComparisonPage() {
  const t = useTranslations('offerComparison')
  const [offers, setOffers] = useState<Offer[]>([
    { ...EMPTY_OFFER, id: '1' },
    { ...EMPTY_OFFER, id: '2' },
  ])

  const updateOffer = (id: string, field: keyof Offer, value: string) => {
    setOffers(prev => prev.map(o => o.id === id ? { ...o, [field]: value } : o))
  }

  const addOffer = () => {
    if (offers.length >= 4) return
    setOffers(prev => [...prev, { ...EMPTY_OFFER, id: String(Date.now()) }])
  }

  const removeOffer = (id: string) => {
    if (offers.length <= 2) return
    setOffers(prev => prev.filter(o => o.id !== id))
  }

  const fields: Array<{ key: keyof Offer; label: string; placeholder: string }> = [
    { key: 'company', label: t('fields.company'), placeholder: t('placeholders.company') },
    { key: 'role', label: t('fields.role'), placeholder: t('placeholders.role') },
    { key: 'ral', label: t('fields.ral'), placeholder: t('placeholders.ral') },
    { key: 'contractType', label: t('fields.contractType'), placeholder: t('placeholders.contractType') },
    { key: 'location', label: t('fields.location'), placeholder: t('placeholders.location') },
    { key: 'remote', label: t('fields.remote'), placeholder: t('placeholders.remote') },
    { key: 'benefits', label: t('fields.benefits'), placeholder: t('placeholders.benefits') },
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground mt-1">{t('subtitle')}</p>
      </div>

      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <p className="text-sm text-foreground/80">{t('hint')}</p>
        </CardContent>
      </Card>

      {/* Comparison Grid */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left p-3 text-sm font-medium text-muted-foreground w-40"></th>
              {offers.map((offer, i) => (
                <th key={offer.id} className="p-3 text-center min-w-[200px]">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{t('offerLabel', { n: i + 1 })}</Badge>
                    {offers.length > 2 && (
                      <Button variant="ghost" size="sm" onClick={() => removeOffer(offer.id)} className="text-xs text-muted-foreground">
                        {t('remove')}
                      </Button>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {fields.map((field) => (
              <tr key={field.key} className="border-t">
                <td className="p-3 text-sm font-medium text-foreground">{field.label}</td>
                {offers.map((offer) => (
                  <td key={offer.id} className="p-3">
                    <Input
                      value={offer[field.key]}
                      onChange={(e) => updateOffer(offer.id, field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className="text-sm"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {offers.length < 4 && (
        <Button variant="outline" onClick={addOffer}>{t('addOffer')}</Button>
      )}

      {/* Coming soon features */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('comingSoon.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold flex-shrink-0">1</span>
              <span>{t('comingSoon.aiAnalysis')}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold flex-shrink-0">2</span>
              <span>{t('comingSoon.ccnlCheck')}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold flex-shrink-0">3</span>
              <span>{t('comingSoon.salaryPercentile')}</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
