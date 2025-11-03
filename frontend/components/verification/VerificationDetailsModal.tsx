'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Shield,
  ShieldCheck,
  Award,
  CheckCircle2,
  Download,
  ExternalLink,
  Calendar,
  User,
  GraduationCap,
  FileText,
  Hash,
  Clock
} from 'lucide-react'

interface VerificationDetails {
  projectId: string
  projectTitle: string
  studentName: string
  verificationType: 'university' | 'professor' | 'ai'

  // Academic Information
  institution: string
  courseName?: string
  courseCode?: string
  semester?: string
  academicYear?: string
  grade?: string
  professor?: string

  // Verification Metadata
  verificationMethod: 'esse3' | 'moodle' | 'manual' | 'ai_analysis'
  verifiedDate: string
  verificationId: string

  // Skills Verified
  skills: Array<{
    name: string
    proficiencyLevel?: string
    evidence?: string
  }>

  // Professor Endorsement (if applicable)
  endorsement?: {
    professorName: string
    professorEmail: string
    professorTitle?: string
    department?: string
    endorsementText?: string
    rating?: number
  }
}

interface VerificationDetailsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  details: VerificationDetails
}

export function VerificationDetailsModal({
  open,
  onOpenChange,
  details
}: VerificationDetailsModalProps) {
  const getVerificationIcon = (type: string) => {
    switch (type) {
      case 'university':
        return ShieldCheck
      case 'professor':
        return Award
      case 'ai':
        return CheckCircle2
      default:
        return Shield
    }
  }

  const getVerificationColor = (type: string) => {
    switch (type) {
      case 'university':
        return 'text-green-600'
      case 'professor':
        return 'text-blue-600'
      case 'ai':
        return 'text-purple-600'
      default:
        return 'text-gray-600'
    }
  }

  const getVerificationLabel = (type: string) => {
    switch (type) {
      case 'university':
        return 'University Verified'
      case 'professor':
        return 'Professor Endorsed'
      case 'ai':
        return 'AI Validated'
      default:
        return 'Unverified'
    }
  }

  const getMethodLabel = (method: string) => {
    switch (method) {
      case 'esse3':
        return 'Esse3 Integration'
      case 'moodle':
        return 'Moodle Integration'
      case 'manual':
        return 'Manual Verification'
      case 'ai_analysis':
        return 'AI Analysis'
      default:
        return 'Unknown'
    }
  }

  const VerificationIcon = getVerificationIcon(details.verificationType)
  const iconColor = getVerificationColor(details.verificationType)

  const downloadCertificate = () => {
    // TODO: Generate and download PDF certificate
    console.log('Download certificate:', details.verificationId)
  }

  const viewPublicVerification = () => {
    // Open public verification page in new tab
    window.open(`/verify/${details.verificationId}`, '_blank')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center ${iconColor}`}>
              <VerificationIcon className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-2xl">Verification Details</DialogTitle>
              <DialogDescription>
                Complete verification audit trail for {details.projectTitle}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Verification Status */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <Badge
                  variant="outline"
                  className={`${
                    details.verificationType === 'university'
                      ? 'bg-green-100 text-green-700 border-green-300'
                      : details.verificationType === 'professor'
                      ? 'bg-blue-100 text-blue-700 border-blue-300'
                      : 'bg-purple-100 text-purple-700 border-purple-300'
                  } text-base px-4 py-2`}
                >
                  <VerificationIcon className="h-4 w-4 mr-2" />
                  {getVerificationLabel(details.verificationType)}
                </Badge>
                <div className="text-right text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(details.verifiedDate).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Project</p>
                  <p className="font-semibold">{details.projectTitle}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Student</p>
                  <p className="font-semibold">{details.studentName}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Academic Record */}
          <div>
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Academic Record
            </h3>
            <Card>
              <CardContent className="pt-6 space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-1">Institution</p>
                    <p className="font-medium">{details.institution}</p>
                  </div>
                  {details.courseName && (
                    <div>
                      <p className="text-muted-foreground mb-1">Course</p>
                      <p className="font-medium">{details.courseName}</p>
                    </div>
                  )}
                  {details.courseCode && (
                    <div>
                      <p className="text-muted-foreground mb-1">Course Code</p>
                      <p className="font-medium font-mono">{details.courseCode}</p>
                    </div>
                  )}
                  {details.semester && (
                    <div>
                      <p className="text-muted-foreground mb-1">Semester</p>
                      <p className="font-medium">{details.semester}</p>
                    </div>
                  )}
                  {details.academicYear && (
                    <div>
                      <p className="text-muted-foreground mb-1">Academic Year</p>
                      <p className="font-medium">{details.academicYear}</p>
                    </div>
                  )}
                  {details.grade && (
                    <div>
                      <p className="text-muted-foreground mb-1">Final Grade</p>
                      <p className="font-semibold text-lg text-green-600">{details.grade}</p>
                    </div>
                  )}
                  {details.professor && (
                    <div>
                      <p className="text-muted-foreground mb-1">Professor</p>
                      <p className="font-medium">{details.professor}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Verification Source */}
          <div>
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Verification Source
            </h3>
            <Card>
              <CardContent className="pt-6 space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-1">Method</p>
                    <p className="font-medium">{getMethodLabel(details.verificationMethod)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Verified Date</p>
                    <p className="font-medium flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(details.verifiedDate).toLocaleString()}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-muted-foreground mb-1">Verification ID</p>
                    <p className="font-mono text-xs bg-gray-100 p-2 rounded flex items-center gap-2">
                      <Hash className="h-3 w-3" />
                      {details.verificationId}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Skills Verified */}
          <div>
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              Skills Verified
            </h3>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {details.skills.map((skill, index) => (
                    <div key={index} className="pb-3 border-b last:border-b-0">
                      <div className="flex items-start justify-between mb-1">
                        <p className="font-medium">{skill.name}</p>
                        {skill.proficiencyLevel && (
                          <Badge variant="outline" className="text-xs">
                            {skill.proficiencyLevel}
                          </Badge>
                        )}
                      </div>
                      {skill.evidence && (
                        <p className="text-sm text-muted-foreground">{skill.evidence}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Professor Endorsement (if applicable) */}
          {details.endorsement && (
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Award className="h-5 w-5" />
                Professor Endorsement
              </h3>
              <Card>
                <CardContent className="pt-6 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{details.endorsement.professorName}</p>
                      {details.endorsement.professorTitle && (
                        <p className="text-sm text-muted-foreground">{details.endorsement.professorTitle}</p>
                      )}
                      {details.endorsement.department && (
                        <p className="text-sm text-muted-foreground">{details.endorsement.department}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">{details.endorsement.professorEmail}</p>
                    </div>
                    {details.endorsement.rating && (
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">{details.endorsement.rating}/5</p>
                        <p className="text-xs text-muted-foreground">Rating</p>
                      </div>
                    )}
                  </div>

                  {details.endorsement.endorsementText && (
                    <>
                      <Separator />
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm italic">"{details.endorsement.endorsementText}"</p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={downloadCertificate}
              className="flex-1"
              variant="outline"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Certificate
            </Button>
            <Button
              onClick={viewPublicVerification}
              className="flex-1"
              variant="outline"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Public Verification Page
            </Button>
          </div>

          {/* Trust Notice */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex gap-3">
              <ShieldCheck className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-green-800">
                <p className="font-semibold mb-1">This verification is authentic and cannot be faked</p>
                <p className="text-xs">
                  All information has been authenticated through {details.institution}'s official academic records system.
                  The verification ID can be independently verified at any time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
