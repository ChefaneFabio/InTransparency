'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Calendar,
  Users,
  Building2,
  QrCode,
  Clock,
  MapPin,
  TrendingUp,
  Plus,
  Settings,
  Download,
  FileText,
  Video,
  CheckCircle,
  AlertCircle,
  BarChart3,
  UserCheck,
  Briefcase
} from 'lucide-react'
import Link from 'next/link'

export default function CareerDayManagementPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'current' | 'create'>('overview')

  // Mock data for demo
  const upcomingEvent = {
    id: '1',
    name: 'Career Day UNIBG 2025',
    date: '2025-11-28',
    endDate: '2025-11-29',
    location: 'Fiera di Bergamo, Via Lunga',
    status: 'active',
    stats: {
      registeredStudents: 342,
      participatingCompanies: 28,
      bookedInterviews: 156,
      prepEventAttendees: 89,
      cvReviewBooked: 45
    },
    timeline: {
      registration: { start: '2024-10-28', status: 'open' },
      cvReview: { start: '2025-11-03', end: '2025-11-14', status: 'upcoming' },
      interviewBooking: { start: '2025-11-15', status: 'upcoming' },
      event: { start: '2025-11-28', end: '2025-11-29', status: 'upcoming' }
    }
  }

  const pastEvents = [
    {
      id: '2',
      name: 'Career Day UNIBG 2024',
      date: '2024-11-30',
      studentsParticipated: 298,
      companies: 24,
      interviewsCompleted: 134,
      placementRate: '42%'
    }
  ]

  const eventsRemaining = {
    included: 1,
    used: 0,
    additional: 0 // on-demand events purchased
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Career Day Management</h1>
              <p className="text-blue-100 text-lg">
                Organize career events with digital interview booking and CV QR codes
              </p>
            </div>
            <div className="text-right">
              <Badge className="bg-white/20 text-white text-lg px-4 py-2">
                Premium Embed Active
              </Badge>
              <p className="text-sm text-blue-100 mt-2">
                {eventsRemaining.included - eventsRemaining.used} event{eventsRemaining.included - eventsRemaining.used !== 1 ? 's' : ''} included this year
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'overview'
                ? 'bg-white shadow-lg text-blue-600'
                : 'text-gray-600 hover:bg-white hover:shadow'
            }`}
          >
            <BarChart3 className="h-5 w-5 inline mr-2" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('current')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'current'
                ? 'bg-white shadow-lg text-blue-600'
                : 'text-gray-600 hover:bg-white hover:shadow'
            }`}
          >
            <Calendar className="h-5 w-5 inline mr-2" />
            Current Event
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'create'
                ? 'bg-white shadow-lg text-blue-600'
                : 'text-gray-600 hover:bg-white hover:shadow'
            }`}
          >
            <Plus className="h-5 w-5 inline mr-2" />
            Create New Event
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Events Included</p>
                      <p className="text-3xl font-bold text-blue-600">{eventsRemaining.included}</p>
                    </div>
                    <Calendar className="h-12 w-12 text-blue-600 opacity-20" />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Per year subscription</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Events Used</p>
                      <p className="text-3xl font-bold text-purple-600">{eventsRemaining.used}</p>
                    </div>
                    <CheckCircle className="h-12 w-12 text-purple-600 opacity-20" />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">This year</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">On-Demand Events</p>
                      <p className="text-3xl font-bold text-green-600">{eventsRemaining.additional}</p>
                    </div>
                    <Plus className="h-12 w-12 text-green-600 opacity-20" />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">€1,000 each</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Active Students</p>
                      <p className="text-3xl font-bold text-orange-600">342</p>
                    </div>
                    <Users className="h-12 w-12 text-orange-600 opacity-20" />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Registered for next event</p>
                </CardContent>
              </Card>
            </div>

            {/* Upcoming Event */}
            {upcomingEvent && (
              <Card className="border-2 border-blue-200 bg-blue-50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl text-blue-900">
                        {upcomingEvent.name}
                      </CardTitle>
                      <p className="text-blue-700 mt-1 flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {upcomingEvent.location}
                      </p>
                    </div>
                    <Badge className="bg-green-500 text-white text-lg px-4 py-2">
                      Active Registration
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                    <div className="text-center">
                      <Users className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                      <p className="text-2xl font-bold text-blue-900">{upcomingEvent.stats.registeredStudents}</p>
                      <p className="text-sm text-blue-700">Students Registered</p>
                    </div>
                    <div className="text-center">
                      <Building2 className="h-8 w-8 mx-auto text-purple-600 mb-2" />
                      <p className="text-2xl font-bold text-purple-900">{upcomingEvent.stats.participatingCompanies}</p>
                      <p className="text-sm text-purple-700">Companies</p>
                    </div>
                    <div className="text-center">
                      <Clock className="h-8 w-8 mx-auto text-green-600 mb-2" />
                      <p className="text-2xl font-bold text-green-900">{upcomingEvent.stats.bookedInterviews}</p>
                      <p className="text-sm text-green-700">Interviews Booked</p>
                    </div>
                    <div className="text-center">
                      <Video className="h-8 w-8 mx-auto text-orange-600 mb-2" />
                      <p className="text-2xl font-bold text-orange-900">{upcomingEvent.stats.prepEventAttendees}</p>
                      <p className="text-sm text-orange-700">Prep Events</p>
                    </div>
                    <div className="text-center">
                      <FileText className="h-8 w-8 mx-auto text-red-600 mb-2" />
                      <p className="text-2xl font-bold text-red-900">{upcomingEvent.stats.cvReviewBooked}</p>
                      <p className="text-sm text-red-700">CV Reviews</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={() => setActiveTab('current')}>
                      <Settings className="h-4 w-4 mr-2" />
                      Manage Event
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Export QR Codes
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      View Analytics
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Past Events */}
            <Card>
              <CardHeader>
                <CardTitle>Past Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pastEvents.map((event) => (
                    <div key={event.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{event.name}</h3>
                          <p className="text-sm text-gray-600">{new Date(event.date).toLocaleDateString('it-IT', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                        <div className="text-right">
                          <div className="grid grid-cols-4 gap-4">
                            <div>
                              <p className="text-sm text-gray-600">Students</p>
                              <p className="font-bold">{event.studentsParticipated}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Companies</p>
                              <p className="font-bold">{event.companies}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Interviews</p>
                              <p className="font-bold">{event.interviewsCompleted}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Placements</p>
                              <p className="font-bold text-green-600">{event.placementRate}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Purchase Additional Event */}
            <Card className="border-2 border-purple-200 bg-purple-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-purple-900 mb-2">Need Another Career Day Event?</h3>
                    <p className="text-purple-700">
                      Purchase additional on-demand events at €1,000 each. Get all Premium features for each event.
                    </p>
                  </div>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Buy Additional Event
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Current Event Tab */}
        {activeTab === 'current' && upcomingEvent && (
          <div className="space-y-6">
            {/* Event Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Event Timeline & Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${upcomingEvent.timeline.registration.status === 'open' ? 'bg-green-100' : 'bg-gray-100'}`}>
                      <CheckCircle className={`h-6 w-6 ${upcomingEvent.timeline.registration.status === 'open' ? 'text-green-600' : 'text-gray-400'}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">Student Registration</h4>
                      <p className="text-sm text-gray-600">Started: {upcomingEvent.timeline.registration.start}</p>
                      <Badge className="bg-green-100 text-green-800 mt-2">Open</Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{upcomingEvent.stats.registeredStudents}</p>
                      <p className="text-sm text-gray-600">Students Registered</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${upcomingEvent.timeline.cvReview.status === 'upcoming' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                      <FileText className={`h-6 w-6 ${upcomingEvent.timeline.cvReview.status === 'upcoming' ? 'text-blue-600' : 'text-gray-400'}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">CV Review Sessions (Pronto CV)</h4>
                      <p className="text-sm text-gray-600">{upcomingEvent.timeline.cvReview.start} - {upcomingEvent.timeline.cvReview.end}</p>
                      <Badge className="bg-blue-100 text-blue-800 mt-2">Opens Nov 3</Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{upcomingEvent.stats.cvReviewBooked}</p>
                      <p className="text-sm text-gray-600">Booked</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${upcomingEvent.timeline.interviewBooking.status === 'upcoming' ? 'bg-orange-100' : 'bg-gray-100'}`}>
                      <Clock className={`h-6 w-6 ${upcomingEvent.timeline.interviewBooking.status === 'upcoming' ? 'text-orange-600' : 'text-gray-400'}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">Interview Booking Opens</h4>
                      <p className="text-sm text-gray-600">Starts: {upcomingEvent.timeline.interviewBooking.start}</p>
                      <Badge className="bg-orange-100 text-orange-800 mt-2">Opens Nov 15</Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{upcomingEvent.stats.bookedInterviews}</p>
                      <p className="text-sm text-gray-600">Pre-Booked</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${upcomingEvent.timeline.event.status === 'upcoming' ? 'bg-purple-100' : 'bg-gray-100'}`}>
                      <Calendar className={`h-6 w-6 ${upcomingEvent.timeline.event.status === 'upcoming' ? 'text-purple-600' : 'text-gray-400'}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">Career Day Event</h4>
                      <p className="text-sm text-gray-600">{upcomingEvent.timeline.event.start} - {upcomingEvent.timeline.event.end}</p>
                      <p className="text-sm text-gray-600 mt-1">📍 {upcomingEvent.location}</p>
                      <Badge className="bg-purple-100 text-purple-800 mt-2">9:30 - 16:00</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="pt-6 text-center">
                  <QrCode className="h-16 w-16 mx-auto text-blue-600 mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Student QR Codes</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Download all student CV QR codes for printing badges
                  </p>
                  <Button className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Export Codes
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="pt-6 text-center">
                  <Building2 className="h-16 w-16 mx-auto text-purple-600 mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Company Management</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Manage participating companies and stand assignments
                  </p>
                  <Button className="w-full" variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Manage Companies
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="pt-6 text-center">
                  <UserCheck className="h-16 w-16 mx-auto text-green-600 mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Interview Schedule</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    View and manage all booked interview slots
                  </p>
                  <Button className="w-full" variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    View Schedule
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Company List */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Participating Companies ({upcomingEvent.stats.participatingCompanies})</CardTitle>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Invite Company
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {['BMW Italia', 'Microsoft Italia', 'Deloitte Digital', 'Accenture', 'Leonardo SpA', 'Reply'].map((company, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <Building2 className="h-8 w-8 text-gray-400" />
                        <div>
                          <p className="font-semibold">{company}</p>
                          <p className="text-sm text-gray-600">Stand #{idx + 1}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Booked Interviews</p>
                          <p className="font-bold">{Math.floor(Math.random() * 15) + 5}</p>
                        </div>
                        <Button size="sm" variant="outline">
                          Manage
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Create New Event Tab */}
        {activeTab === 'create' && (
          <Card>
            <CardHeader>
              <CardTitle>Create New Career Day Event</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {eventsRemaining.used >= eventsRemaining.included && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="h-6 w-6 text-orange-600" />
                      <div>
                        <p className="font-semibold text-orange-900">
                          All included events used ({eventsRemaining.included}/{eventsRemaining.included})
                        </p>
                        <p className="text-sm text-orange-700">
                          This will be an on-demand event. You will be charged €1,000 upon creation.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Event Name</label>
                  <Input placeholder="e.g., Career Day UNIBG 2026" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                    <Input type="date" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                    <Input type="date" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <Input placeholder="e.g., Fiera di Bergamo, Via Lunga" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Event Hours</label>
                  <div className="grid grid-cols-2 gap-4">
                    <Input type="time" defaultValue="09:30" />
                    <Input type="time" defaultValue="16:00" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Interviews Per Student</label>
                  <Input type="number" defaultValue="8" />
                  <p className="text-sm text-gray-500 mt-1">Students can book up to this many company interviews</p>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-4">Preparatory Events Timeline</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Registration Opens</label>
                      <Input type="date" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">CV Review Booking Opens</label>
                        <Input type="date" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">CV Review Period Ends</label>
                        <Input type="date" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Interview Booking Opens</label>
                      <Input type="date" />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    {eventsRemaining.used >= eventsRemaining.included
                      ? 'Create Event (€1,000)'
                      : 'Create Event (Included)'}
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={() => setActiveTab('overview')}>
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
