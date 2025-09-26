import { Brain, Users, Trophy, BarChart3, MessageSquare, Shield } from 'lucide-react'

const features = [
  {
    name: 'AI-Powered Analysis',
    description: 'Advanced AI analyzes your projects to identify strengths, complexity levels, and improvement opportunities.',
    icon: Brain,
    benefits: ['Smart project scoring', 'Skill assessment', 'Innovation metrics', 'Quality feedback']
  },
  {
    name: 'Intelligent Matching',
    description: 'Connect with the right opportunities and people based on your skills, interests, and career goals.',
    icon: Users,
    benefits: ['Relevant job matches', 'Collaboration opportunities', 'Mentor connections', 'Peer networking']
  },
  {
    name: 'Professional Stories',
    description: 'Transform your projects into compelling narratives that showcase your abilities to recruiters.',
    icon: Trophy,
    benefits: ['Automated storytelling', 'Multiple formats', 'Industry-specific', 'Impact-focused']
  },
  {
    name: 'Advanced Analytics',
    description: 'Track your progress, engagement, and career growth with comprehensive analytics and insights.',
    icon: BarChart3,
    benefits: ['Performance metrics', 'Engagement tracking', 'Growth insights', 'Trend analysis']
  },
  {
    name: 'Seamless Communication',
    description: 'Built-in messaging, video calls, and collaboration tools to connect with your network.',
    icon: MessageSquare,
    benefits: ['Direct messaging', 'Video interviews', 'File sharing', 'Real-time notifications']
  },
  {
    name: 'Enterprise Security',
    description: 'Bank-level security with data encryption, privacy controls, and GDPR compliance.',
    icon: Shield,
    benefits: ['Data encryption', 'Privacy controls', 'Secure authentication', 'Compliance ready']
  }
]

export function Features() {
  return (
    <section id="features" className="py-24 bg-slate-50">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to showcase your work
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            InTransparency provides a comprehensive platform with AI-powered tools, 
            intelligent matching, and professional networking capabilities.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.name}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 mb-6">
                <feature.icon className="h-6 w-6 text-blue-600" />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {feature.name}
              </h3>
              
              <p className="text-gray-600 mb-6">
                {feature.description}
              </p>

              <ul className="space-y-2">
                {feature.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-3 flex-shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">AI-Powered</div>
              <div className="text-sm text-gray-600">Project Analysis</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">Real-Time</div>
              <div className="text-sm text-gray-600">University Integration</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">Global</div>
              <div className="text-sm text-gray-600">Talent Mapping</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">Verified</div>
              <div className="text-sm text-gray-600">Academic Records</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}