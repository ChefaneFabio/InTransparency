'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Copy, Check, Loader2, Link2, Shield } from 'lucide-react'

interface ShareCandidateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  candidateId: string
  candidateName: string
}

export default function ShareCandidateDialog({
  open,
  onOpenChange,
  candidateId,
  candidateName,
}: ShareCandidateDialogProps) {
  const [recipientEmail, setRecipientEmail] = useState('')
  const [note, setNote] = useState('')
  const [ttlDays, setTtlDays] = useState('7')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [link, setLink] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const createLink = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/dashboard/recruiter/share-candidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateId,
          ttlDays: Number(ttlDays),
          note: note.trim() || undefined,
          recipientEmail: recipientEmail.trim() || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create link')
      const fullUrl =
        typeof window !== 'undefined'
          ? `${window.location.origin}${data.share.url}`
          : data.share.url
      setLink(fullUrl)
    } catch (e: any) {
      setError(e.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const copy = async () => {
    if (!link) return
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* ignore */
    }
  }

  const reset = () => {
    setRecipientEmail('')
    setNote('')
    setTtlDays('7')
    setLink(null)
    setError(null)
    setCopied(false)
  }

  const handleOpenChange = (next: boolean) => {
    if (!next) reset()
    onOpenChange(next)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5" />
            Share {candidateName}
          </DialogTitle>
          <DialogDescription>
            Generate a signed link your hiring manager can open without an account.
            They'll see the verified evidence pack — projects, skills, trust score.
          </DialogDescription>
        </DialogHeader>

        {!link ? (
          <>
            <div className="space-y-4">
              <div>
                <Label htmlFor="share-recipient" className="text-xs uppercase tracking-wide text-muted-foreground">
                  Recipient email (optional)
                </Label>
                <Input
                  id="share-recipient"
                  type="email"
                  placeholder="hiring-manager@acme.com"
                  value={recipientEmail}
                  onChange={e => setRecipientEmail(e.target.value)}
                  className="mt-1"
                />
                <p className="text-[11px] text-muted-foreground mt-1">
                  Stored for your reference. The link itself is the gate.
                </p>
              </div>

              <div>
                <Label htmlFor="share-note" className="text-xs uppercase tracking-wide text-muted-foreground">
                  Note (optional)
                </Label>
                <Textarea
                  id="share-note"
                  rows={3}
                  placeholder="Hi Luca, thought you'd want to see Marco's robotics portfolio before we talk Thursday."
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  className="mt-1 resize-none"
                  maxLength={2000}
                />
              </div>

              <div>
                <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                  Expires
                </Label>
                <Select value={ttlDays} onValueChange={setTtlDays}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">24 hours</SelectItem>
                    <SelectItem value="7">7 days</SelectItem>
                    <SelectItem value="14">14 days</SelectItem>
                    <SelectItem value="30">30 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <p className="text-[11px] text-muted-foreground flex items-start gap-1.5 border-t pt-3">
                <Shield className="h-3 w-3 mt-0.5 shrink-0" />
                Every view of this link is logged for AI Act compliance. You can revoke at any time.
              </p>
            </div>

            {error && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded p-2">
                {error}
              </p>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={loading}>
                Cancel
              </Button>
              <Button onClick={createLink} disabled={loading}>
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Link2 className="h-4 w-4 mr-1.5" />
                    Create link
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <div className="space-y-3">
              <div className="rounded-lg border bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900 p-3 flex items-start gap-2">
                <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium">Link created</p>
                  <p className="text-xs text-muted-foreground">
                    Share the URL below. The recipient doesn't need an account.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Input value={link} readOnly className="font-mono text-xs" />
                <Button size="icon" variant="outline" onClick={copy}>
                  {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => handleOpenChange(false)}>
                Done
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
