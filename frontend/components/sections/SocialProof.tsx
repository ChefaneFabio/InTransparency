import { Users, Briefcase, Building2, TrendingUp } from 'lucide-react'

export function SocialProof() {
  const stats = [
    {
      icon: Users,
      value: '15,247',
      label: 'Active Students',
      description: 'From 50+ universities'
    },
    {
      icon: Briefcase,
      value: '1,247',
      label: 'Students Hired',
      description: 'In the last 30 days'
    },
    {
      icon: Building2,
      value: '423',
      label: 'Companies',
      description: 'Actively recruiting'
    },
    {
      icon: TrendingUp,
      value: '87%',
      label: 'Success Rate',
      description: 'Get interviews within 30 days'
    }
  ]

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Real Results from Real Students
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join thousands of students who are getting hired faster by showcasing their work, not just their resumes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col items-center text-center">
                  <div className="rounded-full bg-blue-100 p-3 mb-4">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm font-semibold text-gray-900 mb-1">
                    {stat.label}
                  </div>
                  <div className="text-xs text-gray-600">
                    {stat.description}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Proof of Quality */}
        <div className="mt-16 bg-white rounded-2xl p-8 shadow-sm">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">2x Faster</div>
              <p className="text-sm text-gray-600">Students get hired 2x faster with verified portfolios</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">5.2</div>
              <p className="text-sm text-gray-600">Average interview requests per student per month</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">€48K</div>
              <p className="text-sm text-gray-600">Average starting salary of placed students</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
