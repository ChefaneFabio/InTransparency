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

              <div className="flex items-start gap-3">
                <XCircle className="text-red-500 flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="font-semibold text-gray-900">Premium Required</p>
                  <p className="text-sm text-gray-600">Key features behind paywalls for students</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-2 text-blue-600 font-semibold">
                <Shield size={20} />
                <span>InTransparency: 100% free for students</span>
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

        {/* Pricing Model Comparison */}
        <div className="mt-16">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-8">
            The Only Performance-Based Pricing Model
          </h3>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* LinkedIn */}
            <div className="bg-white rounded-xl shadow-md p-6 border-2 border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <Linkedin className="text-blue-600" size={24} />
                <h4 className="font-bold text-gray-900">LinkedIn Recruiter</h4>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">$8,000+</div>
              <p className="text-sm text-gray-600 mb-4">per recruiter per year</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <XCircle className="text-red-500 flex-shrink-0 mt-0.5" size={16} />
                  <span className="text-gray-700">Pay upfront before finding anyone</span>
                </div>
                <div className="flex items-start gap-2">
                  <XCircle className="text-red-500 flex-shrink-0 mt-0.5" size={16} />
                  <span className="text-gray-700">Annual contracts required</span>
                </div>
                <div className="flex items-start gap-2">
                  <XCircle className="text-red-500 flex-shrink-0 mt-0.5" size={16} />
                  <span className="text-gray-700">Expensive for small companies</span>
                </div>
              </div>
            </div>

            {/* Indeed */}
            <div className="bg-white rounded-xl shadow-md p-6 border-2 border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <Globe className="text-blue-700" size={24} />
                <h4 className="font-bold text-gray-900">Job Boards</h4>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">$500+</div>
              <p className="text-sm text-gray-600 mb-4">per job posting</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <XCircle className="text-red-500 flex-shrink-0 mt-0.5" size={16} />
                  <span className="text-gray-700">Pay per post, not per hire</span>
                </div>
                <div className="flex items-start gap-2">
                  <XCircle className="text-red-500 flex-shrink-0 mt-0.5" size={16} />
                  <span className="text-gray-700">Flooded with unqualified applicants</span>
                </div>
                <div className="flex items-start gap-2">
                  <XCircle className="text-red-500 flex-shrink-0 mt-0.5" size={16} />
                  <span className="text-gray-700">No skill verification</span>
                </div>
              </div>
            </div>

            {/* InTransparency */}
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl shadow-lg p-6 border-2 border-green-300">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="text-green-600" size={24} />
                <h4 className="font-bold text-gray-900">InTransparency</h4>
              </div>
              <div className="text-3xl font-bold text-green-600 mb-2">€10</div>
              <p className="text-sm text-gray-700 mb-4">per candidate contact</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={16} />
                  <span className="text-gray-700">Browse entire database FREE</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={16} />
                  <span className="text-gray-700">Pay only when you find someone</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={16} />
                  <span className="text-gray-700">No subscriptions, credits never expire</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              <strong>For students:</strong> 100% free forever. <strong>For universities:</strong> Core platform free. <strong>For companies:</strong> Pay only for results.
            </p>
          </div>
        </div>

        {/* Unique Features NOT on LinkedIn */}
        <div className="mt-16">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-8">
            5 Features LinkedIn Doesn't Have
          </h3>
          <div className="grid md:grid-cols-5 gap-6 max-w-6xl mx-auto">
            {[
              {
                title: 'University-Verified Data',
                description: 'API integration with Esse3 → real-time grades/courses',
                icon: '🎓'
              },
              {
                title: 'AI Project Analysis',
                description: 'GitHub/PDF/Behance/Portfolio multi-format analysis',
                icon: '🤖'
              },
              {
                title: 'Conversational AI',
                description: '"Find Bocconi finance with M&A thesis"',
                icon: '💬'
              },
              {
                title: 'Academic Filters',
                description: 'Specific course + grade + university filters',
                icon: '🎯'
              },
              {
                title: '100% Portfolio Coverage',
                description: '100% students upload projects vs 5% on LinkedIn',
                icon: '📁'
              }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white rounded-xl p-6 shadow-md border-2 border-blue-200 text-center">
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h4 className="font-bold text-gray-900 mb-2">{feature.title}</h4>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* When InTransparency Beats LinkedIn */}
        <div className="mt-16">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-4">
            When InTransparency is 10-100x Better Than LinkedIn
          </h3>
          <p className="text-center text-gray-600 mb-8 max-w-3xl mx-auto">
            For these specific hiring scenarios, InTransparency outperforms LinkedIn by orders of magnitude
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              {
                title: 'Junior Hires (0-2 years)',
                description: 'ANY sector - not just tech',
                color: 'from-blue-500 to-blue-600'
              },
              {
                title: 'Verified Skills Needed',
                description: 'See actual projects + grades, not claims',
                color: 'from-purple-500 to-purple-600'
              },
              {
                title: 'University/Course Filters',
                description: 'Polimi CS 28/30 vs generic "Python"',
                color: 'from-green-500 to-green-600'
              },
              {
                title: 'SMB Budget',
                description: '€10/contact vs €8,000/year LinkedIn',
                color: 'from-orange-500 to-orange-600'
              },
              {
                title: 'Volume Hiring',
                description: '10-50+ juniors/year',
                color: 'from-teal-500 to-teal-600'
              },
              {
                title: '2x Faster Hiring',
                description: 'Pre-verified projects skip screening',
                color: 'from-pink-500 to-pink-600'
              },
              {
                title: 'Italy/EU Talent',
                description: 'Deep university data coverage',
                color: 'from-indigo-500 to-indigo-600'
              },
              {
                title: 'See Real Projects',
                description: '100% have portfolios vs 5% LinkedIn',
                color: 'from-red-500 to-red-600'
              }
            ].map((useCase, idx) => (
              <div key={idx} className={`bg-gradient-to-br ${useCase.color} text-white rounded-xl p-6 shadow-lg`}>
                <div className="flex items-center mb-2">
                  <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                  <h4 className="font-bold">{useCase.title}</h4>
                </div>
                <p className="text-sm text-white">{useCase.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <div className="inline-block bg-green-100 border-2 border-green-300 rounded-xl p-6">
              <p className="text-lg font-semibold text-green-900">
                🏆 For these use cases: InTransparency is 10-100x better than LinkedIn
              </p>
            </div>
          </div>
        </div>

        {/* Disciplines Supported - ALL SECTORS */}
        <div className="mt-16 text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Not Just Tech - ALL Disciplines</h3>
          <p className="text-gray-600 font-medium mb-6 max-w-3xl mx-auto">
            Every sector with verifiable projects - from STEM to Creative to Humanities
          </p>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto text-left">
            <div className="bg-blue-50 rounded-lg p-6">
              <h4 className="font-bold text-blue-900 mb-3">🔬 STEM</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Computer Science</li>
                <li>• Engineering</li>
                <li>• Data Science</li>
                <li>• Cybersecurity</li>
              </ul>
            </div>
            <div className="bg-green-50 rounded-lg p-6">
              <h4 className="font-bold text-green-900 mb-3">💼 Business</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Finance</li>
                <li>• Economics</li>
                <li>• Management</li>
                <li>• Consulting</li>
              </ul>
            </div>
            <div className="bg-purple-50 rounded-lg p-6">
              <h4 className="font-bold text-purple-900 mb-3">🎨 Creative</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Design (Industrial/Graphic/Fashion)</li>
                <li>• Architecture</li>
                <li>• Marketing (Digital/Brand/Social)</li>
              </ul>
            </div>
            <div className="bg-orange-50 rounded-lg p-6">
              <h4 className="font-bold text-orange-900 mb-3">⚖️ Legal</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Corporate Law</li>
                <li>• International Law</li>
              </ul>
            </div>
            <div className="bg-pink-50 rounded-lg p-6">
              <h4 className="font-bold text-pink-900 mb-3">📝 Humanities</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Translation</li>
                <li>• Content Creation</li>
                <li>• Journalism</li>
              </ul>
            </div>
            <div className="bg-cyan-50 rounded-lg p-6">
              <h4 className="font-bold text-cyan-900 mb-3">📊 & More</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Healthcare</li>
                <li>• Social Sciences</li>
                <li>• Education</li>
              </ul>
            </div>
          </div>
          <p className="mt-6 text-lg font-semibold text-gray-900">
            🎯 ANY sector with verifiable projects = InTransparency works!
          </p>
        </div>
      </div>
    </section>
  )
}
