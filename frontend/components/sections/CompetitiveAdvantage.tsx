'use client'

import { CheckCircle, XCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function CompetitiveAdvantage() {
  const t = useTranslations('competitiveAdvantage')

  return (
    <section className="py-24 bg-gradient-to-br from-muted/50 via-white to-primary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {t('header.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('header.subtitle')}
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* VS LinkedIn */}
          <div className="bg-card rounded-2xl shadow-lg p-8 border-2 border-border hover:border-primary transition-all">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-bold text-foreground">{t('linkedin.title')}</h3>
              </div>
              <div className="text-4xl">🤝</div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <XCircle className="text-red-500 flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="font-semibold text-foreground">{t('linkedin.issues.selfReported.title')}</p>
                  <p className="text-sm text-muted-foreground">{t('linkedin.issues.selfReported.description')}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <XCircle className="text-red-500 flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="font-semibold text-foreground">{t('linkedin.issues.noProof.title')}</p>
                  <p className="text-sm text-muted-foreground">{t('linkedin.issues.noProof.description')}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <XCircle className="text-red-500 flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="font-semibold text-foreground">{t('linkedin.issues.noGrades.title')}</p>
                  <p className="text-sm text-muted-foreground">{t('linkedin.issues.noGrades.description')}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <XCircle className="text-red-500 flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="font-semibold text-foreground">{t('linkedin.issues.premiumRequired.title')}</p>
                  <p className="text-sm text-muted-foreground">{t('linkedin.issues.premiumRequired.description')}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-primary font-semibold">
                {t('linkedin.advantage')}
              </p>
            </div>
          </div>

          {/* VS GitHub */}
          <div className="bg-card rounded-2xl shadow-lg p-8 border-2 border-border hover:border-primary transition-all">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-bold text-foreground">{t('github.title')}</h3>
              </div>
              <div className="text-4xl">💻</div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <XCircle className="text-red-500 flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="font-semibold text-foreground">{t('github.issues.techOnly.title')}</p>
                  <p className="text-sm text-muted-foreground">{t('github.issues.techOnly.description')}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <XCircle className="text-red-500 flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="font-semibold text-foreground">{t('github.issues.codeOnly.title')}</p>
                  <p className="text-sm text-muted-foreground">{t('github.issues.codeOnly.description')}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <XCircle className="text-red-500 flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="font-semibold text-foreground">{t('github.issues.excluded.title')}</p>
                  <p className="text-sm text-muted-foreground">{t('github.issues.excluded.description')}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-primary font-semibold">
                {t('github.advantage')}
              </p>
            </div>
          </div>

          {/* VS Traditional Resumes */}
          <div className="bg-card rounded-2xl shadow-lg p-8 border-2 border-border hover:border-primary transition-all">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-bold text-foreground">{t('resumes.title')}</h3>
              </div>
              <div className="text-4xl">📄</div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <XCircle className="text-red-500 flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="font-semibold text-foreground">{t('resumes.issues.bulletPoints.title')}</p>
                  <p className="text-sm text-muted-foreground">{t('resumes.issues.bulletPoints.description')}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <XCircle className="text-red-500 flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="font-semibold text-foreground">{t('resumes.issues.noProof.title')}</p>
                  <p className="text-sm text-muted-foreground">{t('resumes.issues.noProof.description')}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <XCircle className="text-red-500 flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="font-semibold text-foreground">{t('resumes.issues.oneSize.title')}</p>
                  <p className="text-sm text-muted-foreground">{t('resumes.issues.oneSize.description')}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-primary font-semibold">
                {t('resumes.advantage')}
              </p>
            </div>
          </div>
        </div>

        {/* The InTransparency Way */}
        <div className="bg-primary rounded-3xl shadow-lg p-12 text-white">
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
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-4 text-white font-bold text-2xl">
                1
              </div>
              <h4 className="text-xl font-bold mb-2">{t('advantage.layers.projects.title')}</h4>
              <p className="text-white">
                {t('advantage.layers.projects.description')}
              </p>
            </div>

            {/* Layer 2 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-4 text-white font-bold text-2xl">
                2
              </div>
              <h4 className="text-xl font-bold mb-2">{t('advantage.layers.grades.title')}</h4>
              <p className="text-white">
                {t('advantage.layers.grades.description')}
              </p>
            </div>

            {/* Layer 3 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-4 text-white font-bold text-2xl">
                3
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
          <h3 className="text-3xl font-bold text-foreground text-center mb-8">
            {t('pricing.title')}
          </h3>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* LinkedIn */}
            <div className="bg-card rounded-xl shadow-md p-6 border-2 border-border">
              <div className="flex items-center gap-2 mb-4">
                <h4 className="font-bold text-foreground">{t('pricing.linkedinRecruiter.title')}</h4>
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">{t('pricing.linkedinRecruiter.price')}</div>
              <p className="text-sm text-muted-foreground mb-4">{t('pricing.linkedinRecruiter.period')}</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <XCircle className="text-red-500 flex-shrink-0 mt-0.5" size={16} />
                  <span className="text-foreground/80">{t('pricing.linkedinRecruiter.issues.upfront')}</span>
                </div>
                <div className="flex items-start gap-2">
                  <XCircle className="text-red-500 flex-shrink-0 mt-0.5" size={16} />
                  <span className="text-foreground/80">{t('pricing.linkedinRecruiter.issues.contracts')}</span>
                </div>
                <div className="flex items-start gap-2">
                  <XCircle className="text-red-500 flex-shrink-0 mt-0.5" size={16} />
                  <span className="text-foreground/80">{t('pricing.linkedinRecruiter.issues.expensive')}</span>
                </div>
              </div>
            </div>

            {/* Indeed */}
            <div className="bg-card rounded-xl shadow-md p-6 border-2 border-border">
              <div className="flex items-center gap-2 mb-4">
                <h4 className="font-bold text-foreground">{t('pricing.jobBoards.title')}</h4>
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">{t('pricing.jobBoards.price')}</div>
              <p className="text-sm text-muted-foreground mb-4">{t('pricing.jobBoards.period')}</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <XCircle className="text-red-500 flex-shrink-0 mt-0.5" size={16} />
                  <span className="text-foreground/80">{t('pricing.jobBoards.issues.perPost')}</span>
                </div>
                <div className="flex items-start gap-2">
                  <XCircle className="text-red-500 flex-shrink-0 mt-0.5" size={16} />
                  <span className="text-foreground/80">{t('pricing.jobBoards.issues.unqualified')}</span>
                </div>
                <div className="flex items-start gap-2">
                  <XCircle className="text-red-500 flex-shrink-0 mt-0.5" size={16} />
                  <span className="text-foreground/80">{t('pricing.jobBoards.issues.noVerification')}</span>
                </div>
              </div>
            </div>

            {/* InTransparency */}
            <div className="bg-primary/5 rounded-xl shadow-lg p-6 border-2 border-primary/30">
              <div className="flex items-center gap-2 mb-4">
                <h4 className="font-bold text-foreground">{t('pricing.inTransparency.title')}</h4>
              </div>
              <div className="text-3xl font-bold text-primary mb-2">{t('pricing.inTransparency.price')}</div>
              <p className="text-sm text-foreground/80 mb-4">{t('pricing.inTransparency.period')}</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle className="text-primary flex-shrink-0 mt-0.5" size={16} />
                  <span className="text-foreground/80">{t('pricing.inTransparency.benefits.browseFree')}</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="text-primary flex-shrink-0 mt-0.5" size={16} />
                  <span className="text-foreground/80">{t('pricing.inTransparency.benefits.payWhenFound')}</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="text-primary flex-shrink-0 mt-0.5" size={16} />
                  <span className="text-foreground/80">{t('pricing.inTransparency.benefits.noSubscription')}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
              {t('pricing.summary')}
            </p>
          </div>
        </div>

        {/* Unique Features NOT on LinkedIn */}
        <div className="mt-16">
          <h3 className="text-3xl font-bold text-foreground text-center mb-8">
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
              <div key={feature.key} className="bg-card rounded-xl p-6 shadow-md border-2 border-primary/20 text-center">
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h4 className="font-bold text-foreground mb-2">{t(`uniqueFeatures.features.${feature.key}.title`)}</h4>
                <p className="text-sm text-muted-foreground">{t(`uniqueFeatures.features.${feature.key}.description`)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* When InTransparency Beats LinkedIn */}
        <div className="mt-16">
          <h3 className="text-3xl font-bold text-foreground text-center mb-4">
            {t('useCases.title')}
          </h3>
          <p className="text-center text-muted-foreground mb-8 max-w-3xl mx-auto">
            {t('useCases.subtitle')}
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { key: 'juniorHires', color: 'bg-primary' },
              { key: 'verifiedSkills', color: 'bg-primary/80' },
              { key: 'universityFilters', color: 'bg-primary/60' },
              { key: 'smbBudget', color: 'from-orange-500 to-orange-600' },
              { key: 'volumeHiring', color: 'bg-primary/70' },
              { key: 'fasterHiring', color: 'from-pink-500 to-pink-600' },
              { key: 'italyEU', color: 'bg-primary/70' },
              { key: 'realProjects', color: 'from-red-500 to-red-600' }
            ].map((useCase) => (
              <div key={useCase.key} className="bg-primary text-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center mb-2">
                  <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                  <h4 className="font-bold">{t(`useCases.cases.${useCase.key}.title`)}</h4>
                </div>
                <p className="text-sm text-white">{t(`useCases.cases.${useCase.key}.description`)}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <div className="inline-block bg-primary/10 border-2 border-primary/30 rounded-xl p-6">
              <p className="text-lg font-semibold text-primary">
                🏆 {t('useCases.conclusion')}
              </p>
            </div>
          </div>
        </div>

        {/* Disciplines Supported - ALL SECTORS */}
        <div className="mt-16 text-center">
          <h3 className="text-3xl font-bold text-foreground mb-4">{t('disciplines.title')}</h3>
          <p className="text-muted-foreground font-medium mb-6 max-w-3xl mx-auto">
            {t('disciplines.subtitle')}
          </p>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto text-left">
            {['stem', 'business', 'creative', 'legal', 'humanities', 'other'].map((category) => (
              <div key={category} className="bg-primary/5 rounded-lg p-6">
                <h4 className="font-bold mb-3">
                  {category === 'stem' && '🔬 '}
                  {category === 'business' && '💼 '}
                  {category === 'creative' && '🎨 '}
                  {category === 'legal' && '⚖️ '}
                  {category === 'humanities' && '📝 '}
                  {category === 'other' && '📊 '}
                  {t(`disciplines.categories.${category}.title`)}
                </h4>
                <ul className="space-y-1 text-sm text-foreground/80">
                  {t.raw(`disciplines.categories.${category}.items`).map((item: string) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-6 text-lg font-semibold text-foreground">
            🎯 {t('disciplines.conclusion')}
          </p>
        </div>
      </div>
    </section>
  )
}
