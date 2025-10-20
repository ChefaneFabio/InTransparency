import { CheckCircle2, Star, Award, Zap } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function SuccessMetrics() {
  const metrics = [
    {
      icon: CheckCircle2,
      title: 'Portfolio > Resume',
      description: 'Show what you\'ve built, not just what you claim you can do',
      stat: '🚀',
      statLabel: 'Early Access: Build your portfolio first, get discovered faster'
    },
    {
      icon: Zap,
      title: 'Get Discovered',
      description: 'Recruiters find you based on your verified projects, not keywords',
      stat: '✨',
      statLabel: 'Be among the first to showcase real academic work'
    },
    {
      icon: Star,
      title: 'Stand Out',
      description: 'AI analyzes your projects and highlights your unique skills',
      stat: '🎯',
      statLabel: 'Turn your university projects into career opportunities'
    },
    {
      icon: Award,
      title: 'Verified Skills',
      description: 'University-backed projects prove your abilities are real',
      stat: '🔒',
      statLabel: 'Authentic portfolios that build recruiter trust'
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Students Choose InTransparency
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your projects tell a better story than any resume. Here's the proof.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {metrics.map((metric, index) => {
            const Icon = metric.icon
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-blue-100 p-3 flex-shrink-0">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {metric.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {metric.description}
                    </p>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="text-3xl font-bold text-blue-600 mb-1">
                        {metric.stat}
                      </div>
                      <div className="text-sm text-gray-600">
                        {metric.statLabel}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Link href="/auth/register/student">
              Create Your Free Portfolio Now
            </Link>
          </Button>
          <p className="mt-4 text-sm text-gray-600">
            No credit card required • 2 minutes to set up • Free forever
          </p>
        </div>
      </div>
    </section>
  )
}
