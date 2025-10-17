'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, XCircle, AlertTriangle, Github, Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface GitHubVerificationButtonProps {
  projectId: string
  githubUrl?: string
  currentVerification?: any
}

export function GitHubVerificationButton({
  projectId,
  githubUrl,
  currentVerification
}: GitHubVerificationButtonProps) {
  const [verifying, setVerifying] = useState(false)
  const [verification, setVerification] = useState(currentVerification)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

  const handleVerify = async () => {
    if (!githubUrl) {
      setError('Please add a GitHub URL to your project first')
      return
    }

    setVerifying(true)
    setError(null)

    try {
      const response = await fetch('/api/github/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          projectId,
          githubUrl
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Verification failed')
      }

      setVerification(data.verification)
      setOpen(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setVerifying(false)
    }
  }

  return (
    <div>
      <Button
        onClick={handleVerify}
        disabled={verifying || !githubUrl}
        variant={verification?.isVerified ? 'outline' : 'default'}
        className="flex items-center gap-2"
      >
        {verifying ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Verifying...
          </>
        ) : verification?.isVerified ? (
          <>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            Verified
          </>
        ) : (
          <>
            <Github className="h-4 w-4" />
            Verify GitHub
          </>
        )}
      </Button>

      {error && (
        <p className="text-sm text-red-600 mt-2">{error}</p>
      )}

      {/* Verification Results Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {verification?.isVerified ? (
                <>
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                  GitHub Verification Successful
                </>
              ) : (
                <>
                  <AlertTriangle className="h-6 w-6 text-yellow-600" />
                  Verification Issues Detected
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              Analysis of your GitHub repository and commit history
            </DialogDescription>
          </DialogHeader>

          {verification && (
            <div className="space-y-4">
              {/* Overall Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Verification Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Status</div>
                      <Badge variant={verification.isVerified ? 'default' : 'secondary'}>
                        {verification.isVerified ? 'Verified' : 'Needs Review'}
                      </Badge>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">User Contribution</div>
                      <div className="text-2xl font-bold text-gray-900">
                        {verification.userCommitPercentage.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Commit Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Commit History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Total Commits</div>
                      <div className="text-xl font-semibold">{verification.totalCommits}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Your Commits</div>
                      <div className="text-xl font-semibold text-blue-600">{verification.userCommits}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">First Commit</div>
                      <div className="text-sm">
                        {verification.firstCommit ? new Date(verification.firstCommit).toLocaleDateString() : 'N/A'}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Last Commit</div>
                      <div className="text-sm">
                        {verification.lastCommit ? new Date(verification.lastCommit).toLocaleDateString() : 'N/A'}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Commit Frequency</div>
                      <div className="text-sm">{verification.commitFrequency} commits/day</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Repository Age</div>
                      <div className="text-sm">{verification.repoAge} days</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Suspicious Patterns */}
              {verification.suspiciousPatterns && verification.suspiciousPatterns.length > 0 && (
                <Card className="border-yellow-200 bg-yellow-50">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2 text-yellow-800">
                      <AlertTriangle className="h-5 w-5" />
                      Issues Detected
                    </CardTitle>
                    <CardDescription>
                      The following patterns may indicate this project needs manual review
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {verification.suspiciousPatterns.map((pattern: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                          <XCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                          <span>{pattern}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Repository Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Repository Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Languages</span>
                      <div className="flex gap-2">
                        {verification.languages.map((lang: string, idx: number) => (
                          <Badge key={idx} variant="outline">{lang}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Stars</span>
                      <span className="font-semibold">{verification.stars}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Forks</span>
                      <span className="font-semibold">{verification.forks}</span>
                    </div>
                    {verification.topics && verification.topics.length > 0 && (
                      <div>
                        <div className="text-sm text-gray-600 mb-2">Topics</div>
                        <div className="flex flex-wrap gap-2">
                          {verification.topics.map((topic: string, idx: number) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Close
                </Button>
                {verification.isVerified && (
                  <Button onClick={() => setOpen(false)} className="bg-green-600 hover:bg-green-700">
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Looks Good!
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
