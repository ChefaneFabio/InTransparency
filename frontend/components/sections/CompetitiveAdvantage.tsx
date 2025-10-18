'use client'

import { Shield, Globe, GraduationCap, CheckCircle, XCircle, Linkedin, Github, FileText } from 'lucide-react'

export function CompetitiveAdvantage() {
  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Why InTransparency Wins
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            The only platform that verifies your actual work through courses, grades, and projects—not just what you claim to know
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* VS LinkedIn */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-200 hover:border-blue-500 transition-all">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Linkedin className="text-blue-600" size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">LinkedIn</h3>
              </div>
              <div className="text-4xl">🤝</div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <XCircle className="text-red-500 flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="font-semibold text-gray-900">Self-Reported Skills</p>
                  <p className="text-sm text-gray-600">Anyone can claim "Expert in Python"</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <XCircle className="text-red-500 flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="font-semibold text-gray-900">No Proof of Work</p>
                  <p className="text-sm text-gray-600">Endorsements from friends, not professors</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <XCircle className="text-red-500 flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="font-semibold text-gray-900">No Grade Verification</p>
                  <p className="text-sm text-gray-600">Can't prove academic performance</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-2 text-blue-600 font-semibold">
                <Shield size={20} />
                <span>InTransparency verifies grades & projects</span>
              </div>
            </div>
          </div>

          {/* VS GitHub */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-200 hover:border-blue-500 transition-all">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gray-800 rounded-lg">
                  <Github className="text-white" size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">GitHub</h3>
              </div>
              <div className="text-4xl">💻</div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <XCircle className="text-red-500 flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="font-semibold text-gray-900">Tech-Only</p>
                  <p className="text-sm text-gray-600">No way to showcase business, design, healthcare work</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <XCircle className="text-red-500 flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="font-semibold text-gray-900">Code-Only Portfolios</p>
                  <p className="text-sm text-gray-600">Can't upload case studies, designs, or research papers</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <XCircle className="text-red-500 flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="font-semibold text-gray-900">95% of Students Excluded</p>
                  <p className="text-sm text-gray-600">Only useful for software developers</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-2 text-blue-600 font-semibold">
                <Globe size={20} />
                <span>InTransparency supports 15 disciplines</span>
              </div>
            </div>
          </div>

          {/* VS Traditional Resumes */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-200 hover:border-blue-500 transition-all">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <FileText className="text-green-600" size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Resumes</h3>
              </div>
              <div className="text-4xl">📄</div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <XCircle className="text-red-500 flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="font-semibold text-gray-900">Just Bullet Points</p>
                  <p className="text-sm text-gray-600">"Built a web app" tells nothing about quality</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <XCircle className="text-red-500 flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="font-semibold text-gray-900">No Proof</p>
                  <p className="text-sm text-gray-600">Recruiters can't see your actual work</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <XCircle className="text-red-500 flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="font-semibold text-gray-900">One-Size-Fits-All</p>
                  <p className="text-sm text-gray-600">Same format for all jobs, no customization</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-2 text-blue-600 font-semibold">
                <GraduationCap size={20} />
                <span>InTransparency shows projects + grades</span>
              </div>
            </div>
          </div>
        </div>

        {/* The InTransparency Way */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl shadow-2xl p-12 text-white">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              The InTransparency Advantage
            </h3>
            <p className="text-xl text-white max-w-3xl mx-auto">
              The only platform with triple-layer verification that proves what you actually built and learned
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Layer 1 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-4">
                <FileText className="text-white" size={32} />
              </div>
              <h4 className="text-xl font-bold mb-2">1. Real Projects</h4>
              <p className="text-white">
                Upload actual work: code, case studies, designs, research papers—not just descriptions
              </p>
            </div>

            {/* Layer 2 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-4">
                <GraduationCap className="text-white" size={32} />
              </div>
              <h4 className="text-xl font-bold mb-2">2. Verified Grades</h4>
              <p className="text-white">
                Link projects to courses, professors, and grades—show where you learned it
              </p>
            </div>

            {/* Layer 3 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-4">
                <Shield className="text-white" size={32} />
              </div>
              <h4 className="text-xl font-bold mb-2">3. University Verified</h4>
              <p className="text-white">
                Professors and universities confirm your work is real—highest credibility possible
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <div className="inline-flex flex-col sm:flex-row items-center gap-6 bg-white/10 backdrop-blur-sm rounded-2xl px-8 py-6">
              <div className="flex items-center gap-4">
                <CheckCircle className="text-green-300" size={32} />
                <div className="text-left">
                  <p className="font-semibold text-lg">More credible than LinkedIn</p>
                  <p className="text-white text-sm">Verified grades vs self-reported skills</p>
                </div>
              </div>
              <div className="hidden sm:block w-px h-12 bg-white/30"></div>
              <div className="flex items-center gap-4">
                <CheckCircle className="text-green-300" size={32} />
                <div className="text-left">
                  <p className="font-semibold text-lg">More accessible than GitHub</p>
                  <p className="text-white text-sm">All disciplines vs tech-only</p>
                </div>
              </div>
              <div className="hidden sm:block w-px h-12 bg-white/30"></div>
              <div className="flex items-center gap-4">
                <CheckCircle className="text-green-300" size={32} />
                <div className="text-left">
                  <p className="font-semibold text-lg">More complete than resumes</p>
                  <p className="text-white text-sm">Projects + grades + courses</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Disciplines Supported */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 font-medium mb-4">Supporting students across all disciplines:</p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              'Technology', 'Business', 'Design', 'Healthcare', 'Engineering',
              'Skilled Trades', 'Architecture', 'Film & Media', 'Writing',
              'Social Sciences', 'Arts', 'Law', 'Education', 'Science'
            ].map(discipline => (
              <span
                key={discipline}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
              >
                {discipline}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
