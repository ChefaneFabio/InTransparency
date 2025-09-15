'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, GraduationCap, Users, Target, CheckCircle2, X } from 'lucide-react'

// Academic + Geographic Targeting Algorithm

interface JobTargeting {
  academicRequirements: {
    fieldOfStudy: string[]
    specificCourses: string[]
    projectExperience: string[]
    skillsRequired: string[]
  }
  geographicTargeting: {
    primaryLocation: string
    maxDistance: number
    relocationSupport: boolean
    remoteOptions: 'none' | 'hybrid' | 'full-remote'
  }
  visibility: {
    estimatedReach: number
    targetUniversities: string[]
    exclusionReasons: string[]
  }
}

export const JobTargetingExamples = () => {
  const examples: JobTargeting[] = [
    {
      academicRequirements: {
        fieldOfStudy: ['Computer Science', 'Computer Engineering', 'Software Engineering'],
        specificCourses: ['Mobile Development', 'iOS Development', 'User Interface Design'],
        projectExperience: ['iOS App', 'Mobile Application', 'Swift Projects'],
        skillsRequired: ['Swift', 'iOS', 'UIKit', 'Xcode']
      },
      geographicTargeting: {
        primaryLocation: 'Milano',
        maxDistance: 50,
        relocationSupport: true,
        remoteOptions: 'hybrid'
      },
      visibility: {
        estimatedReach: 450,
        targetUniversities: ['Politecnico Milano', 'Bocconi', 'Università Statale'],
        exclusionReasons: [
          'Students without mobile development experience',
          'Students >100km without relocation interest',
          'Non-technical degree programs'
        ]
      }
    },
    {
      academicRequirements: {
        fieldOfStudy: ['Economics', 'Engineering', 'Statistics', 'Data Science'],
        specificCourses: ['Statistics', 'Data Analysis', 'Python Programming'],
        projectExperience: ['Data Analysis Project', 'Financial Analysis', 'SQL Projects'],
        skillsRequired: ['Python', 'SQL', 'Data Analysis', 'Excel']
      },
      geographicTargeting: {
        primaryLocation: 'Torino',
        maxDistance: 30,
        relocationSupport: false,
        remoteOptions: 'none'
      },
      visibility: {
        estimatedReach: 120,
        targetUniversities: ['Politecnico Torino', 'Università di Torino'],
        exclusionReasons: [
          'Students without data analysis experience',
          'Students outside Piemonte region',
          'Students requiring remote work'
        ]
      }
    }
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Academic + Geographic Targeting Examples</h2>
      
      {examples.map((example, i) => (
        <Card key={i} className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              {i === 0 ? 'Bending Spoons - iOS Developer (Milano)' : 'DataPay Startup - Data Analyst (Torino)'}
            </CardTitle>
            <CardDescription>
              Precision targeting reaches only qualified, geographically viable candidates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Academic Requirements */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  Academic Requirements
                </h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium">Field of Study:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {example.academicRequirements.fieldOfStudy.map((field, j) => (
                        <Badge key={j} variant="outline">{field}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Required Courses:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {example.academicRequirements.specificCourses.map((course, j) => (
                        <Badge key={j} className="bg-blue-100 text-blue-800">{course}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Project Experience:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {example.academicRequirements.projectExperience.map((project, j) => (
                        <Badge key={j} className="bg-green-100 text-green-800">{project}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Geographic Targeting */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Geographic Targeting
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Primary Location:</span>
                    <Badge>{example.geographicTargeting.primaryLocation}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Max Distance:</span>
                    <span className="text-sm font-medium">{example.geographicTargeting.maxDistance}km</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Relocation Support:</span>
                    {example.geographicTargeting.relocationSupport ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <X className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Remote Options:</span>
                    <Badge variant={example.geographicTargeting.remoteOptions === 'none' ? 'secondary' : 'default'}>
                      {example.geographicTargeting.remoteOptions}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Visibility Analysis */}
            <div className="mt-6 pt-4 border-t">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Targeting Results
              </h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{example.visibility.estimatedReach}</div>
                  <div className="text-sm text-gray-600">Qualified Students</div>
                </div>
                <div>
                  <span className="text-sm font-medium">Target Universities:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {example.visibility.targetUniversities.map((uni, j) => (
                      <Badge key={j} variant="outline" className="text-xs">{uni}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium text-red-700">Excluded:</span>
                  <ul className="text-xs text-gray-600 mt-1">
                    {example.visibility.exclusionReasons.map((reason, j) => (
                      <li key={j} className="flex items-start gap-1">
                        <X className="h-3 w-3 text-red-500 mt-0.5 flex-shrink-0" />
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default JobTargetingExamples