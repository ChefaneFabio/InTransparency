'use client'

import { Shield, Globe, GraduationCap, CheckCircle, XCircle, Linkedin, Github, FileText } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function CompetitiveAdvantage() {
  const t = useTranslations('competitiveAdvantage')

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('header.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('header.subtitle')}
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
                <h3 className="text-xl font-bold text-gray-900">{t('linkedin.title')}</h3>
              </div>
              <div className="text-4xl">🤝</div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <XCircle className="text-red-500 flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="font-semibold text-gray-900">{t('linkedin.issues.selfReported.title')}</p>
                  <p className="text-sm text-gray-600">{t('linkedin.issues.selfReported.description')}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <XCircle className="text-red-500 flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="font-semibold text-gray-900">{t('linkedin.issues.noProof.title')}</p>
                  <p className="text-sm text-gray-600">{t('linkedin.issues.noProof.description')}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <XCircle className="text-red-500 flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="font-semibold text-gray-900">{t('linkedin.issues.noGrades.title')}</p>
                  <p className="text-sm text-gray-600">{t('linkedin.issues.noGrades.description')}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <XCircle className="text-red-500 flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="font-semibold text-gray-900">{t('linkedin.issues.premiumRequired.title')}</p>
                  <p className="text-sm text-gray-600">{t('linkedin.issues.premiumRequired.description')}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-2 text-blue-600 font-semibold">
                <Shield size={20} />
                <span>{t('linkedin.advantage')}</span>
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
                <h3 className="text-xl font-bold text-gray-900">{t('github.title')}</h3>
              </div>
              <div className="text-4xl">💻</div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <XCircle className="text-red-500 flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="font-semibold text-gray-900">{t('github.issues.techOnly.title')}</p>
                  <p className="text-sm text-gray-600">{t('github.issues.techOnly.description')}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <XCircle className="text-red-500 flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="font-semibold text-gray-900">{t('github.issues.codeOnly.title')}</p>
                  <p className="text-sm text-gray-600">{t('github.issues.codeOnly.description')}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <XCircle className="text-red-500 flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="font-semibold text-gray-900">{t('github.issues.excluded.title')}</p>
                  <p className="text-sm text-gray-600">{t('github.issues.excluded.description')}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-2 text-blue-600 font-semibold">
                <Globe size={20} />
                <span>{t('github.advantage')}</span>
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
                <h3 className="text-xl font-bold text-gray-900">{t('resumes.title')}</h3>
              </div>
              <div className="text-4xl">📄</div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <XCircle className="text-red-500 flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="font-semibold text-gray-900">{t('resumes.issues.bulletPoints.title')}</p>
                  <p className="text-sm text-gray-600">{t('resumes.issues.bulletPoints.description')}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <XCircle className="text-red-500 flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="font-semibold text-gray-900">{t('resumes.issues.noProof.title')}</p>
                  <p className="text-sm text-gray-600">{t('resumes.issues.noProof.description')}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <XCircle className="text-red-500 flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="font-semibold text-gray-900">{t('resumes.issues.oneSize.title')}</p>
                  <p className="text-sm text-gray-600">{t('resumes.issues.oneSize.description')}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-2 text-blue-600 font-semibold">
                <GraduationCap size={20} />
                <span>{t('resumes.advantage')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* The InTransparency Way */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl shadow-2xl p-12 text-white">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              {t('advantage.title')}
            </h3>
            <p className="text-xl text-white max-w-3xl mx-auto">
              {t('advantage.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Layer 1 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-4">
                <FileText className="text-white" size={32} />
              </div>
              <h4 className="text-xl font-bold mb-2">{t('advantage.layers.projects.title')}</h4>
              <p className="text-white">
                {t('advantage.layers.projects.description')}
              </p>
            </div>

            {/* Layer 2 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-4">
                <GraduationCap className="text-white" size={32} />
              </div>
              <h4 className="text-xl font-bold mb-2">{t('advantage.layers.grades.title')}</h4>
              <p className="text-white">
                {t('advantage.layers.grades.description')}
              </p>
            </div>

            {/* Layer 3 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-4">
                <Shield className="text-white" size={32} />
              </div>
              <h4 className="text-xl font-bold mb-2">{t('advantage.layers.university.title')}</h4>
              <p className="text-white">
                {t('advantage.layers.university.description')}
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <div className="inline-flex flex-col sm:flex-row items-center gap-6 bg-white/10 backdrop-blur-sm rounded-2xl px-8 py-6">
              <div className="flex items-center gap-4">
                <CheckCircle className="text-green-300" size={32} />
                <div className="text-left">
                  <p className="font-semibold text-lg">{t('advantage.comparisons.vsLinkedIn.title')}</p>
                  <p className="text-white text-sm">{t('advantage.comparisons.vsLinkedIn.description')}</p>
                </div>
              </div>
              <div className="hidden sm:block w-px h-12 bg-white/30"></div>
              <div className="flex items-center gap-4">
                <CheckCircle className="text-green-300" size={32} />
                <div className="text-left">
                  <p className="font-semibold text-lg">{t('advantage.comparisons.vsGitHub.title')}</p>
                  <p className="text-white text-sm">{t('advantage.comparisons.vsGitHub.description')}</p>
                </div>
              </div>
              <div className="hidden sm:block w-px h-12 bg-white/30"></div>
              <div className="flex items-center gap-4">
                <CheckCircle className="text-green-300" size={32} />
                <div className="text-left">
                  <p className="font-semibold text-lg">{t('advantage.comparisons.vsResumes.title')}</p>
                  <p className="text-white text-sm">{t('advantage.comparisons.vsResumes.description')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Model Comparison */}
        <div className="mt-16">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-8">
            {t('pricing.title')}
          </h3>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* LinkedIn */}
            <div className="bg-white rounded-xl shadow-md p-6 border-2 border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <Linkedin className="text-blue-600" size={24} />
                <h4 className="font-bold text-gray-900">{t('pricing.linkedinRecruiter.title')}</h4>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{t('pricing.linkedinRecruiter.price')}</div>
              <p className="text-sm text-gray-600 mb-4">{t('pricing.linkedinRecruiter.period')}</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <XCircle className="text-red-500 flex-shrink-0 mt-0.5" size={16} />
                  <span className="text-gray-700">{t('pricing.linkedinRecruiter.issues.upfront')}</span>
                </div>
                <div className="flex items-start gap-2">
                  <XCircle className="text-red-500 flex-shrink-0 mt-0.5" size={16} />
                  <span className="text-gray-700">{t('pricing.linkedinRecruiter.issues.contracts')}</span>
                </div>
                <div className="flex items-start gap-2">
                  <XCircle className="text-red-500 flex-shrink-0 mt-0.5" size={16} />
                  <span className="text-gray-700">{t('pricing.linkedinRecruiter.issues.expensive')}</span>
                </div>
              </div>
            </div>

            {/* Indeed */}
            <div className="bg-white rounded-xl shadow-md p-6 border-2 border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <Globe className="text-blue-700" size={24} />
                <h4 className="font-bold text-gray-900">{t('pricing.jobBoards.title')}</h4>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{t('pricing.jobBoards.price')}</div>
              <p className="text-sm text-gray-600 mb-4">{t('pricing.jobBoards.period')}</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <XCircle className="text-red-500 flex-shrink-0 mt-0.5" size={16} />
                  <span className="text-gray-700">{t('pricing.jobBoards.issues.perPost')}</span>
                </div>
                <div className="flex items-start gap-2">
                  <XCircle className="text-red-500 flex-shrink-0 mt-0.5" size={16} />
                  <span className="text-gray-700">{t('pricing.jobBoards.issues.unqualified')}</span>
                </div>
                <div className="flex items-start gap-2">
                  <XCircle className="text-red-500 flex-shrink-0 mt-0.5" size={16} />
                  <span className="text-gray-700">{t('pricing.jobBoards.issues.noVerification')}</span>
                </div>
              </div>
            </div>

            {/* InTransparency */}
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl shadow-lg p-6 border-2 border-green-300">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="text-green-600" size={24} />
                <h4 className="font-bold text-gray-900">{t('pricing.inTransparency.title')}</h4>
              </div>
              <div className="text-3xl font-bold text-green-600 mb-2">{t('pricing.inTransparency.price')}</div>
              <p className="text-sm text-gray-700 mb-4">{t('pricing.inTransparency.period')}</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={16} />
                  <span className="text-gray-700">{t('pricing.inTransparency.benefits.browseFree')}</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={16} />
                  <span className="text-gray-700">{t('pricing.inTransparency.benefits.payWhenFound')}</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={16} />
                  <span className="text-gray-700">{t('pricing.inTransparency.benefits.noSubscription')}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              {t('pricing.summary')}
            </p>
          </div>
        </div>

        {/* Unique Features NOT on LinkedIn */}
        <div className="mt-16">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-8">
            {t('uniqueFeatures.title')}
          </h3>
          <div className="grid md:grid-cols-5 gap-6 max-w-6xl mx-auto">
            {[
              { key: 'universityVerified', icon: '🎓' },
              { key: 'aiAnalysis', icon: '🤖' },
              { key: 'conversationalAI', icon: '💬' },
              { key: 'academicFilters', icon: '🎯' },
              { key: 'portfolioCoverage', icon: '📁' }
            ].map((feature) => (
              <div key={feature.key} className="bg-white rounded-xl p-6 shadow-md border-2 border-blue-200 text-center">
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h4 className="font-bold text-gray-900 mb-2">{t(`uniqueFeatures.features.${feature.key}.title`)}</h4>
                <p className="text-sm text-gray-600">{t(`uniqueFeatures.features.${feature.key}.description`)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* When InTransparency Beats LinkedIn */}
        <div className="mt-16">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-4">
            {t('useCases.title')}
          </h3>
          <p className="text-center text-gray-600 mb-8 max-w-3xl mx-auto">
            {t('useCases.subtitle')}
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { key: 'juniorHires', color: 'from-blue-500 to-blue-600' },
              { key: 'verifiedSkills', color: 'from-purple-500 to-purple-600' },
              { key: 'universityFilters', color: 'from-green-500 to-green-600' },
              { key: 'smbBudget', color: 'from-orange-500 to-orange-600' },
              { key: 'volumeHiring', color: 'from-teal-500 to-teal-600' },
              { key: 'fasterHiring', color: 'from-pink-500 to-pink-600' },
              { key: 'italyEU', color: 'from-indigo-500 to-indigo-600' },
              { key: 'realProjects', color: 'from-red-500 to-red-600' }
            ].map((useCase) => (
              <div key={useCase.key} className={`bg-gradient-to-br ${useCase.color} text-white rounded-xl p-6 shadow-lg`}>
                <div className="flex items-center mb-2">
                  <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                  <h4 className="font-bold">{t(`useCases.cases.${useCase.key}.title`)}</h4>
                </div>
                <p className="text-sm text-white">{t(`useCases.cases.${useCase.key}.description`)}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <div className="inline-block bg-green-100 border-2 border-green-300 rounded-xl p-6">
              <p className="text-lg font-semibold text-green-900">
                🏆 {t('useCases.conclusion')}
              </p>
            </div>
          </div>
        </div>

        {/* Disciplines Supported - ALL SECTORS */}
        <div className="mt-16 text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">{t('disciplines.title')}</h3>
          <p className="text-gray-600 font-medium mb-6 max-w-3xl mx-auto">
            {t('disciplines.subtitle')}
          </p>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto text-left">
            {['stem', 'business', 'creative', 'legal', 'humanities', 'other'].map((category) => (
              <div key={category} className={`bg-${category === 'stem' ? 'blue' : category === 'business' ? 'green' : category === 'creative' ? 'purple' : category === 'legal' ? 'orange' : category === 'humanities' ? 'pink' : 'cyan'}-50 rounded-lg p-6`}>
                <h4 className="font-bold mb-3">
                  {category === 'stem' && '🔬 '}
                  {category === 'business' && '💼 '}
                  {category === 'creative' && '🎨 '}
                  {category === 'legal' && '⚖️ '}
                  {category === 'humanities' && '📝 '}
                  {category === 'other' && '📊 '}
                  {t(`disciplines.categories.${category}.title`)}
                </h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  {t.raw(`disciplines.categories.${category}.items`).map((item: string) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-6 text-lg font-semibold text-gray-900">
            🎯 {t('disciplines.conclusion')}
          </p>
        </div>
      </div>
    </section>
  )
}
