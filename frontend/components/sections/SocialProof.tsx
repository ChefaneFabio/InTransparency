import { Users, Briefcase, Building2, TrendingUp } from 'lucide-react'

export function SocialProof() {
  const benefits = [
    {
      icon: Users,
      emoji: '🎓',
      label: 'Students Welcome',
      description: 'All features free - no paywalls ever'
    },
    {
      icon: Briefcase,
      emoji: '🚀',
      label: 'Early Access',
      description: 'Join before public launch in 2025'
    },
    {
      icon: Building2,
      emoji: '🤝',
      label: 'Build Together',
      description: 'Shape the platform with your feedback'
    },
    {
      icon: TrendingUp,
      emoji: '✨',
      label: 'Be First',
      description: 'Get ahead of the competition'
    }
  ]

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container">
        <div className="text-center mb-12">
          <div className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            Early Access
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Join Us From the Start
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Be among the first students to build verified portfolios. Complete platform access at no cost.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col items-center text-center">
                  <div className="text-5xl mb-4">
                    {benefit.emoji}
                  </div>
                  <div className="text-lg font-semibold text-gray-900 mb-2">
                    {benefit.label}
                  </div>
                  <div className="text-sm text-gray-600">
                    {benefit.description}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Early Access Value Proposition */}
        <div className="mt-16 bg-white rounded-2xl p-8 shadow-sm">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl mb-2">💼</div>
              <div className="text-lg font-bold text-blue-600 mb-2">Portfolio First</div>
              <p className="text-sm text-gray-600">Turn academic projects into career opportunities</p>
            </div>
            <div>
              <div className="text-3xl mb-2">🔒</div>
              <div className="text-lg font-bold text-blue-600 mb-2">Verified Work</div>
              <p className="text-sm text-gray-600">University-backed project authentication</p>
            </div>
            <div>
              <div className="text-3xl mb-2">🎯</div>
              <div className="text-lg font-bold text-blue-600 mb-2">Get Discovered</div>
              <p className="text-sm text-gray-600">Recruiters find you based on real skills</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
