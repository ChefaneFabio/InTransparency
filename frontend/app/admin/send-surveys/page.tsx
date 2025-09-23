'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Mail,
  Send,
  Users,
  Building2,
  GraduationCap,
  School,
  CheckCircle,
  Plus,
  Upload,
  Download,
  Calendar,
  Target,
  BarChart3
} from 'lucide-react'

interface EmailTemplate {
  id: string
  name: string
  subject: string
  content: string
  targetType: 'student' | 'company' | 'university' | 'all'
}

interface EmailList {
  id: string
  name: string
  count: number
  type: 'student' | 'company' | 'university'
  lastUpdated: string
}

const emailTemplates: EmailTemplate[] = [
  {
    id: 'student-invitation',
    name: 'Student Survey Invitation',
    subject: 'Help Shape the Future of Academic-Career Connections - InTransparency Survey',
    targetType: 'student',
    content: `Dear Student,

We're building InTransparency, a revolutionary platform that bridges universities and industry through complete academic transparency.

Your insights are crucial to creating a platform that truly serves students like you. This 7-minute survey will help us understand:
• How you want to showcase your academic achievements
• What features matter most in connecting with employers
• Your thoughts on academic transparency

🎯 What's in it for you:
✓ Early access to the platform
✓ Influence on feature development
✓ Beta testing opportunities
✓ Direct impact on your career opportunities

Take the survey: {{SURVEY_LINK}}

Thank you for helping us build something amazing!

Best regards,
The InTransparency Team`
  },
  {
    id: 'company-invitation',
    name: 'Company Survey Invitation',
    subject: 'Revolutionize Graduate Hiring - Share Your Recruitment Challenges',
    targetType: 'company',
    content: `Dear {{COMPANY_NAME}} Team,

Are you tired of sifting through hundreds of unqualified graduate applications?

We're building InTransparency - a platform that pre-qualifies candidates through verified academic performance and real project portfolios.

Your expertise is vital. This 8-minute survey helps us understand:
• Your current recruitment pain points
• How you evaluate graduate candidates
• What academic transparency means to your hiring process

🎯 Benefits for participating:
✓ Early access to qualified candidate pipeline
✓ Custom feature development
✓ Pilot program opportunities
✓ Reduced hiring costs and time

Share your insights: {{SURVEY_LINK}}

Transform your graduate hiring process with us.

Best regards,
The InTransparency Team`
  },
  {
    id: 'university-invitation',
    name: 'University Survey Invitation',
    subject: 'Enhance Student Career Outcomes - University Partnership Survey',
    targetType: 'university',
    content: `Dear {{UNIVERSITY_NAME}} Career Services,

Student placement is at the heart of university success. We're building InTransparency to dramatically improve career outcomes for your graduates.

This platform creates direct, transparent connections between your students' academic achievements and industry opportunities.

Your insights matter. This 6-minute survey covers:
• Current placement challenges
• Industry partnership needs
• Academic data integration possibilities

🎯 Partnership benefits:
✓ Higher student placement rates
✓ Stronger industry relationships
✓ Real-time employer demand insights
✓ Enhanced institutional reputation

Participate in shaping the future: {{SURVEY_LINK}}

Let's revolutionize career services together.

Best regards,
The InTransparency Team`
  }
]

const emailLists: EmailList[] = [
  { id: 'politecnico-students', name: 'Politecnico Milano Students', count: 1247, type: 'student', lastUpdated: '2 days ago' },
  { id: 'bocconi-students', name: 'Bocconi University Students', count: 892, type: 'student', lastUpdated: '1 day ago' },
  { id: 'tech-companies', name: 'Technology Companies (Milan)', count: 156, type: 'company', lastUpdated: '3 days ago' },
  { id: 'finance-companies', name: 'Finance & Banking Companies', count: 89, type: 'company', lastUpdated: '1 week ago' },
  { id: 'italian-universities', name: 'Italian Universities Career Services', count: 45, type: 'university', lastUpdated: '2 weeks ago' }
]

export default function SendSurveysPage() {
  const [selectedTab, setSelectedTab] = useState('compose')
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [selectedLists, setSelectedLists] = useState<string[]>([])
  const [customEmails, setCustomEmails] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [emailsSent, setEmailsSent] = useState(0)

  const [emailData, setEmailData] = useState({
    subject: '',
    content: '',
    senderName: 'InTransparency Team',
    replyTo: 'hello@intransparency.com'
  })

  const handleTemplateSelect = (templateId: string) => {
    const template = emailTemplates.find(t => t.id === templateId)
    if (template) {
      setSelectedTemplate(templateId)
      setEmailData(prev => ({
        ...prev,
        subject: template.subject,
        content: template.content
      }))
    }
  }

  const handleListToggle = (listId: string) => {
    setSelectedLists(prev =>
      prev.includes(listId)
        ? prev.filter(id => id !== listId)
        : [...prev, listId]
    )
  }

  const getTotalRecipients = () => {
    const listRecipients = emailLists
      .filter(list => selectedLists.includes(list.id))
      .reduce((total, list) => total + list.count, 0)

    const customRecipients = customEmails
      .split('\n')
      .filter(email => email.trim().includes('@')).length

    return listRecipients + customRecipients
  }

  const handleSendEmails = async () => {
    setIsSending(true)
    setEmailsSent(0)

    const totalRecipients = getTotalRecipients()

    // Simulate email sending with progress
    for (let i = 0; i <= totalRecipients; i += Math.floor(totalRecipients / 10)) {
      await new Promise(resolve => setTimeout(resolve, 300))
      setEmailsSent(Math.min(i, totalRecipients))
    }

    setIsSending(false)
    alert(`Successfully sent ${totalRecipients} survey invitations!`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-blue-50/50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md border-b border-blue-100/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Survey Distribution
              </h1>
              <p className="text-gray-600 mt-2">Send survey invitations to target audiences</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Results
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Campaign
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="compose">Compose</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="lists">Email Lists</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Compose Tab */}
          <TabsContent value="compose" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Email Composition */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Email Content</CardTitle>
                    <CardDescription>Compose your survey invitation email</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="subject">Subject Line</Label>
                      <Input
                        id="subject"
                        placeholder="Enter email subject..."
                        value={emailData.subject}
                        onChange={(e) => setEmailData(prev => ({...prev, subject: e.target.value}))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="content">Email Content</Label>
                      <Textarea
                        id="content"
                        placeholder="Enter email content..."
                        value={emailData.content}
                        onChange={(e) => setEmailData(prev => ({...prev, content: e.target.value}))}
                        rows={12}
                        className="font-mono text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="sender">Sender Name</Label>
                        <Input
                          id="sender"
                          value={emailData.senderName}
                          onChange={(e) => setEmailData(prev => ({...prev, senderName: e.target.value}))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="reply">Reply-To Email</Label>
                        <Input
                          id="reply"
                          value={emailData.replyTo}
                          onChange={(e) => setEmailData(prev => ({...prev, replyTo: e.target.value}))}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recipients & Sending */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recipients</CardTitle>
                    <CardDescription>Select email lists and add custom emails</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Email Lists</Label>
                      <div className="space-y-2 mt-2">
                        {emailLists.map((list) => (
                          <div key={list.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={list.id}
                              checked={selectedLists.includes(list.id)}
                              onCheckedChange={() => handleListToggle(list.id)}
                            />
                            <Label htmlFor={list.id} className="text-sm">
                              {list.name} ({list.count})
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="custom">Custom Emails</Label>
                      <Textarea
                        id="custom"
                        placeholder="Enter emails, one per line..."
                        value={customEmails}
                        onChange={(e) => setCustomEmails(e.target.value)}
                        rows={4}
                      />
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{getTotalRecipients()}</div>
                        <div className="text-sm text-gray-600">Total Recipients</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Send Survey</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isSending ? (
                      <div className="text-center space-y-4">
                        <div className="text-lg font-semibold">Sending Emails...</div>
                        <div className="text-3xl font-bold text-blue-600">{emailsSent}</div>
                        <div className="text-sm text-gray-600">of {getTotalRecipients()} sent</div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(emailsSent / getTotalRecipients()) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ) : (
                      <Button
                        onClick={handleSendEmails}
                        disabled={getTotalRecipients() === 0 || !emailData.subject || !emailData.content}
                        className="w-full"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Send to {getTotalRecipients()} Recipients
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {emailTemplates.map((template) => {
                const Icon = template.targetType === 'student' ? GraduationCap :
                           template.targetType === 'company' ? Building2 : School

                return (
                  <Card key={template.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Icon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{template.name}</CardTitle>
                          <Badge variant="secondary">{template.targetType}</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <Label className="text-sm font-medium">Subject:</Label>
                          <p className="text-sm text-gray-600">{template.subject}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Preview:</Label>
                          <p className="text-sm text-gray-600 line-clamp-3">
                            {template.content.substring(0, 120)}...
                          </p>
                        </div>
                        <Button
                          onClick={() => handleTemplateSelect(template.id)}
                          variant="outline"
                          size="sm"
                          className="w-full"
                        >
                          Use Template
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          {/* Email Lists Tab */}
          <TabsContent value="lists" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Email Lists</h2>
              <div className="flex space-x-2">
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Import List
                </Button>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create List
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {emailLists.map((list) => {
                const Icon = list.type === 'student' ? GraduationCap :
                           list.type === 'company' ? Building2 : School

                return (
                  <Card key={list.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Icon className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{list.name}</CardTitle>
                            <Badge variant="secondary">{list.type}</Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Contacts:</span>
                          <span className="font-semibold">{list.count}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Updated:</span>
                          <span className="text-sm">{list.lastUpdated}</span>
                        </div>
                        <div className="flex space-x-2 mt-4">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Download className="h-3 w-3 mr-1" />
                            Export
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            Edit
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Emails Sent</CardTitle>
                  <Send className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,247</div>
                  <p className="text-xs text-gray-600">This month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
                  <Mail className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">68%</div>
                  <p className="text-xs text-gray-600">Above industry average</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Click Rate</CardTitle>
                  <Target className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24%</div>
                  <p className="text-xs text-gray-600">Strong engagement</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Survey Completions</CardTitle>
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">87%</div>
                  <p className="text-xs text-gray-600">Excellent completion rate</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Campaigns</CardTitle>
                <CardDescription>Email campaign performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'Student Survey - Politecnico Milano', sent: 1247, opened: 847, clicked: 298, completed: 261 },
                    { name: 'Company Survey - Tech Companies', sent: 156, opened: 108, clicked: 45, completed: 39 },
                    { name: 'University Survey - Career Services', sent: 45, opened: 38, clicked: 22, completed: 19 }
                  ].map((campaign, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-semibold">{campaign.name}</h3>
                        <p className="text-sm text-gray-600">
                          {campaign.sent} sent • {Math.round((campaign.opened/campaign.sent)*100)}% opened • {Math.round((campaign.clicked/campaign.sent)*100)}% clicked
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-600">{campaign.completed}</div>
                        <div className="text-sm text-gray-600">completed</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}