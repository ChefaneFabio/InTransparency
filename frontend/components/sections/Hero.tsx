import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles, Users, Trophy } from 'lucide-react'
import { RealStats } from './RealStats'

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-sky-50 via-white to-emerald-50 py-20 sm:py-32">
      <div className="container">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8 flex justify-center">
            <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
              AI-powered academic matching platform{' '}
              <Link href="#features" className="font-semibold text-blue-600">
                <span className="absolute inset-0" aria-hidden="true" />
                Learn more <ArrowRight className="inline h-4 w-4" />
              </Link>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Transform your{' '}
            <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
              studies into your job
            </span>
          </h1>
          
          <p className="mt-6 text-lg leading-8 text-gray-600 max-w-3xl mx-auto">
            InTransparency connects students and professionals through AI-powered project analysis, 
            intelligent matching, and compelling storytelling. Showcase your work, find collaborators, 
            and unlock opportunities.
          </p>
          
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button asChild size="lg" className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700">
              <Link href="/auth/register">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            
            <Button variant="outline" size="lg" asChild>
              <Link href="/demo">
                Watch Demo
              </Link>
            </Button>
          </div>
          
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-teal-100 p-3">
                <Sparkles className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">AI Analysis</h3>
              <p className="text-sm text-gray-600">
                Smart project evaluation and skill assessment
              </p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-blue-100 p-3">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Smart Matching</h3>
              <p className="text-sm text-gray-600">
                Connect with relevant opportunities and people
              </p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-emerald-100 p-3">
                <Trophy className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Professional Stories</h3>
              <p className="text-sm text-gray-600">
                Transform projects into compelling narratives
              </p>
            </div>
          </div>

          {/* Real Statistics */}
          <div className="mt-20 pt-8 border-t border-gray-200">
            <h3 className="text-center text-sm font-medium text-gray-500 mb-6">
              Connect with top institutions and companies globally
            </h3>
            <RealStats />
          </div>
        </div>
      </div>
    </section>
  )
}