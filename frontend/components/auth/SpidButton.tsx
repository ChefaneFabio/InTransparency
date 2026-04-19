'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChevronDown, ChevronUp, Info } from 'lucide-react'

/**
 * SPID / CIE login button for Italian users.
 *
 * Displays the official "Entra con SPID" UI mandated by AgID:
 *   - Single button that expands to show a list of accredited IdPs
 *   - User selects their IdP; auto-redirect is forbidden by AgID rules
 *
 * Gated on NEXT_PUBLIC_SPID_ENABLED — when false, shows a "coming soon"
 * chip so Italian users know we're pursuing it.
 */

const PROVIDERS = [
  'Aruba ID',
  'InfoCert ID',
  'Intesa ID',
  'Lepida ID',
  'Namirial ID',
  'Poste ID',
  'Sielte ID',
  'SpidItalia',
  'TIM ID',
  'TeamSystem ID',
]

export function SpidButton() {
  const enabled = process.env.NEXT_PUBLIC_SPID_ENABLED === 'true'
  const [open, setOpen] = useState(false)

  if (!enabled) {
    return (
      <Card className="border-dashed">
        <CardContent className="pt-4 pb-4 flex items-center gap-3">
          <div className="flex-1">
            <div className="font-semibold text-sm flex items-center gap-2">
              Entra con SPID / CIE
              <Badge variant="outline" className="text-xs">Coming soon</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Italian digital identity login. Currently in AgID accreditation — live for all IdPs by Q3 2026.
            </p>
          </div>
          <Info className="h-4 w-4 text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-2">
      <Button
        variant="outline"
        className="w-full justify-between"
        onClick={() => setOpen(!open)}
      >
        <span className="flex items-center gap-2">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-[#0066cc] text-white text-xs font-bold">
            SPID
          </span>
          Entra con SPID
        </span>
        {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </Button>
      {open && (
        <Card>
          <CardContent className="pt-3 pb-3 space-y-1">
            {PROVIDERS.map(p => (
              <button
                key={p}
                className="block w-full text-left text-sm px-3 py-2 rounded hover:bg-muted"
                onClick={() => {
                  window.location.href = `/api/auth/spid/initiate?idp=${encodeURIComponent(p)}`
                }}
              >
                {p}
              </button>
            ))}
            <div className="border-t mt-2 pt-2">
              <button
                className="block w-full text-left text-sm px-3 py-2 rounded hover:bg-muted"
                onClick={() => {
                  window.location.href = '/api/auth/spid/initiate?idp=CIE'
                }}
              >
                Entra con CIE — Carta d&apos;Identità Elettronica
              </button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
