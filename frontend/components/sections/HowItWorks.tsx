import { Upload, Brain, Users, Rocket } from 'lucide-react'

const steps = [
  {
    name: 'Upload Your Projects',
    description: 'Share your academic projects, code repositories, and documentation with our platform.',
    details: [
      'Upload project files and code',
      'Add descriptions and context',
      'Include live demos and repositories',
      'Collaborate with team members'
    ],
    icon: Upload,
    color: 'blue'
  },
  {
    name: 'AI-Powered Analysis',
    description: 'Our advanced AI analyzes your work to identify strengths, assess complexity, and generate insights.',
    details: [
      'Automated skill assessment',
      'Project complexity scoring',
      'Innovation and impact metrics',
      'Improvement recommendations'
    ],
    icon: Brain,
    color: 'purple'
  },
  {
    name: 'Smart Matching',
    description: 'Get connected with relevant opportunities, mentors, and collaborators based on your profile.',
    details: [
      'Job opportunity matching',
      'Find project collaborators',
      'Connect with industry mentors',
      'Build your professional network'
    ],
    icon: Users,
    color: 'green'
  },
  {
    name: 'Launch Your Career',
    description: 'Transform your analyzed projects into compelling stories and land your dream opportunities.',
    details: [
      'Professional story generation',
      'Interview preparation insights',
      'Direct recruiter connections',
      'Career progression tracking'
    ],
    icon: Rocket,
    color: 'orange'
  }
]

const colorMap = {
  blue: {
    bg: 'bg-blue-100',
    text: 'text-blue-600',
    border: 'border-blue-200'
  },
  purple: {
    bg: 'bg-purple-100',
    text: 'text-purple-600',
    border: 'border-purple-200'
  },
  green: {
    bg: 'bg-green-100',
    text: 'text-green-600',
    border: 'border-green-200'
  },
  orange: {
    bg: 'bg-orange-100',
    text: 'text-orange-600',
    border: 'border-orange-200'
  }
}

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            How InTransparency Works
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Transform your academic projects into career opportunities with our 
            AI-powered platform in just four simple steps.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Desktop Layout */}
          <div className="hidden lg:block">
            <div className="relative">
              {/* Connection Line */}
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 via-green-200 to-orange-200 transform -translate-y-1/2" />
              
              <div className="grid grid-cols-4 gap-8">
                {steps.map((step, index) => {
                  const colors = colorMap[step.color as keyof typeof colorMap]
                  
                  return (
                    <div key={step.name} className="relative">
                      {/* Step Number */}
                      <div className={`w-12 h-12 rounded-full ${colors.bg} ${colors.border} border-2 flex items-center justify-center mx-auto mb-6 relative z-10 bg-white`}>
                        <span className={`text-lg font-semibold ${colors.text}`}>
                          {index + 1}
                        </span>
                      </div>

                      {/* Icon */}
                      <div className={`w-16 h-16 rounded-full ${colors.bg} flex items-center justify-center mx-auto mb-6`}>
                        <step.icon className={`h-8 w-8 ${colors.text}`} />
                      </div>

                      {/* Content */}
                      <div className="text-center">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">
                          {step.name}
                        </h3>
                        <p className="text-gray-600 mb-6">
                          {step.description}
                        </p>
                        <ul className="space-y-2">
                          {step.details.map((detail, detailIndex) => (
                            <li key={detailIndex} className="text-sm text-gray-500 flex items-start">
                              <div className={`w-1.5 h-1.5 rounded-full ${colors.bg} mt-2 mr-2 flex-shrink-0`} />
                              {detail}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="lg:hidden space-y-12">
            {steps.map((step, index) => {
              const colors = colorMap[step.color as keyof typeof colorMap]
              
              return (
                <div key={step.name} className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    {/* Step Number */}
                    <div className={`w-12 h-12 rounded-full ${colors.bg} ${colors.border} border-2 flex items-center justify-center mb-4`}>
                      <span className={`text-lg font-semibold ${colors.text}`}>
                        {index + 1}
                      </span>
                    </div>
                    
                    {/* Icon */}
                    <div className={`w-16 h-16 rounded-full ${colors.bg} flex items-center justify-center`}>
                      <step.icon className={`h-8 w-8 ${colors.text}`} />
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      {step.name}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {step.description}
                    </p>
                    <ul className="space-y-2">
                      {step.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="text-sm text-gray-500 flex items-start">
                          <div className={`w-1.5 h-1.5 rounded-full ${colors.bg} mt-2 mr-3 flex-shrink-0`} />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to get started?
            </h3>
            <p className="text-gray-600 mb-6">
              Join thousands of students who have already transformed their projects into career opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Upload Your First Project
              </button>
              <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                See It In Action
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}