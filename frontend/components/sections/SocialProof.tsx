import { GraduationCap, Rocket, Users, Sparkles } from 'lucide-react'

export function SocialProof() {
  const benefits = [
    {
      Icon: GraduationCap,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      label: 'Students Welcome',
      description: 'All features free - no paywalls ever',
    },
    {
      Icon: Rocket,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      label: 'Early Access',
      description: 'Join before public launch in 2025',
    },
    {
      Icon: Users,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      label: 'Build Together',
      description: 'Shape the platform with your feedback',
    },
    {
      Icon: Sparkles,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      label: 'Be First',
      description: 'Get ahead of the competition',
    },
  ]

  return (
    <section className="py-16 bg-gradient-to-br from-primary/5 to-primary/10">
      <div className="container">
        <div className="text-center mb-12">
          <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
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
            const Icon = benefit.Icon
            return (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col items-center text-center">
                  <div className={`w-14 h-14 rounded-2xl ${benefit.bg} ${benefit.color} flex items-center justify-center mb-4`}>
                    <Icon className="h-7 w-7" />
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
      </div>
    </section>
  )
}
