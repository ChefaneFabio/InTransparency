import { Brain, Target, FileText, BarChart3, MessageSquare, Shield } from 'lucide-react'

const features = [
  {
    name: 'AI-Powered Analysis',
    description: 'Advanced AI analyzes your projects to identify strengths, complexity levels, and improvement opportunities.',
    icon: Brain,
    benefits: ['Smart project scoring', 'Skill assessment', 'Innovation metrics']
  },
  {
    name: 'Intelligent Matching',
    description: 'Connect with the right opportunities and people based on your skills, interests, and career goals.',
    icon: Target,
    benefits: ['Relevant job matches', 'Collaboration opportunities', 'Mentor connections']
  },
  {
    name: 'Professional Stories',
    description: 'Transform your projects into compelling narratives that showcase your abilities to recruiters.',
    icon: FileText,
    benefits: ['Automated storytelling', 'Multiple formats', 'Impact-focused']
  },
  {
    name: 'Advanced Analytics',
    description: 'Track your progress, engagement, and career growth with comprehensive analytics and insights.',
    icon: BarChart3,
    benefits: ['Performance metrics', 'Engagement tracking', 'Growth insights']
  },
  {
    name: 'Seamless Communication',
    description: 'Built-in messaging, video calls, and collaboration tools to connect with your network.',
    icon: MessageSquare,
    benefits: ['Direct messaging', 'Video interviews', 'Real-time notifications']
  },
  {
    name: 'Enterprise Security',
    description: 'Bank-level security with data encryption, privacy controls, and GDPR compliance.',
    icon: Shield,
    benefits: ['Data encryption', 'Privacy controls', 'Compliance ready']
  }
]

export function Features() {
  return (
    <section id="features" className="py-24 bg-muted">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything you need to showcase your work
          </h2>
          <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
            InTransparency provides a comprehensive platform with AI-powered tools,
            intelligent matching, and professional networking capabilities.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {(features || []).map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.name}
                className="bg-card rounded-xl shadow-sm border border-border p-8 hover:shadow-md transition-shadow duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-6">
                  <Icon className="h-7 w-7 text-primary" />
                </div>

                <h3 className="text-xl font-semibold text-foreground mb-4">
                  {feature.name}
                </h3>

                <p className="text-muted-foreground mb-6">
                  {feature.description}
                </p>

                <ul className="space-y-2">
                  {feature.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mr-3 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        <div className="mt-16 text-center">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">AI-Powered</div>
              <div className="text-sm text-muted-foreground">Project Analysis</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">Real-Time</div>
              <div className="text-sm text-muted-foreground">University Integration</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">Global</div>
              <div className="text-sm text-muted-foreground">Talent Mapping</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">Verified</div>
              <div className="text-sm text-muted-foreground">Academic Records</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
