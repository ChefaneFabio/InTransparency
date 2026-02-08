'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Calendar,
  Users,
  QrCode,
  Clock,
  FileText,
  Video,
  Building2,
} from 'lucide-react'

export default function CareerDayManagementPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Career Day Management</h1>
              <p className="text-blue-100 text-lg">
                Organize career events with digital interview booking and CV QR codes
              </p>
            </div>
            <Badge className="bg-white/20 text-white text-lg px-4 py-2">
              Coming Soon
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Coming Soon Card */}
        <Card className="mb-8 border-2 border-blue-200 bg-blue-50">
          <CardContent className="py-12 text-center">
            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-6">
              <Calendar className="h-10 w-10 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Career Day Management is Coming Soon</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-6">
              We are building a comprehensive career day management tool that will help your institution
              organize events, manage company participation, and streamline the interview booking process.
            </p>
            <p className="text-sm text-gray-500">
              Enterprise institutions will be the first to get access. Stay tuned!
            </p>
          </CardContent>
        </Card>

        {/* Feature Preview */}
        <h3 className="text-xl font-bold text-gray-900 mb-6">What to Expect</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6 text-center">
              <QrCode className="h-12 w-12 mx-auto text-blue-600 mb-4" />
              <h4 className="font-semibold text-lg mb-2">Student QR Codes</h4>
              <p className="text-sm text-gray-600">
                Generate QR codes for student CVs to print on event badges, enabling instant recruiter access to profiles.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <Clock className="h-12 w-12 mx-auto text-purple-600 mb-4" />
              <h4 className="font-semibold text-lg mb-2">Interview Booking</h4>
              <p className="text-sm text-gray-600">
                Students can book interview slots with companies before the event, ensuring organized and productive meetings.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <FileText className="h-12 w-12 mx-auto text-green-600 mb-4" />
              <h4 className="font-semibold text-lg mb-2">CV Review Sessions</h4>
              <p className="text-sm text-gray-600">
                Organize pre-event CV review sessions where career advisors help students polish their profiles.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <Building2 className="h-12 w-12 mx-auto text-orange-600 mb-4" />
              <h4 className="font-semibold text-lg mb-2">Company Management</h4>
              <p className="text-sm text-gray-600">
                Invite companies, assign stands, and manage participation all from one dashboard.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <Video className="h-12 w-12 mx-auto text-red-600 mb-4" />
              <h4 className="font-semibold text-lg mb-2">Prep Events</h4>
              <p className="text-sm text-gray-600">
                Schedule preparatory workshops and webinars to help students prepare for career day interactions.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <Users className="h-12 w-12 mx-auto text-indigo-600 mb-4" />
              <h4 className="font-semibold text-lg mb-2">Post-Event Analytics</h4>
              <p className="text-sm text-gray-600">
                Track attendance, interviews completed, and placement outcomes to measure event ROI.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
