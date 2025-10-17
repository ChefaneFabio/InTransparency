'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download, CheckCircle2, Loader2, ExternalLink } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface ATSExportButtonProps {
  candidateId: string
  candidateName?: string
}

export function ATSExportButton({ candidateId, candidateName }: ATSExportButtonProps) {
  const [exporting, setExporting] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

  const handleExport = async (ats: 'greenhouse' | 'lever') => {
    setExporting(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch(`/api/integrations/${ats}/candidates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          candidateId
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Export failed')
      }

      setResult({
        ...data,
        ats: ats.charAt(0).toUpperCase() + ats.slice(1)
      })
      setOpen(true)
    } catch (err: any) {
      setError(err.message)
      setOpen(true)
    } finally {
      setExporting(false)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" disabled={exporting}>
            {exporting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Export to ATS
              </>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleExport('greenhouse')}>
            Export to Greenhouse
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleExport('lever')}>
            Export to Lever
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {result ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  Export Successful
                </>
              ) : (
                'Export Failed'
              )}
            </DialogTitle>
            <DialogDescription>
              {result
                ? `${candidateName || 'Candidate'} has been exported to ${result.ats}`
                : 'There was an error exporting the candidate'
              }
            </DialogDescription>
          </DialogHeader>

          {result && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-gray-700 mb-3">
                  The candidate has been successfully added to your {result.ats} account.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(result.greenhouseUrl || result.leverUrl, '_blank')}
                  className="w-full"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View in {result.ats}
                </Button>
              </div>
              <Button onClick={() => setOpen(false)} className="w-full">
                Done
              </Button>
            </div>
          )}

          {error && (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-700">{error}</p>
                {error.includes('not configured') && (
                  <div className="mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.location.href = '/dashboard/recruiter/settings'}
                      className="w-full"
                    >
                      Go to Settings
                    </Button>
                  </div>
                )}
              </div>
              <Button onClick={() => setOpen(false)} variant="outline" className="w-full">
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
