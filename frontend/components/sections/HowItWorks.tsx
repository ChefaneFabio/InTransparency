'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Users,
  Building2,
  GraduationCap,
  ArrowRight,
  CheckCircle,
  Upload,
  Brain,
  Sparkles,
  Zap,
  TrendingUp,
  Target,
  Clock
} from 'lucide-react'
import { IMAGES } from '@/lib/images'

export function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const steps = [
    {
      id: 1,
      title: 'Create Your Profile',
      description: 'Two ways: University partner = automatic profile. Independent = upload projects + select courses for instant profile',
      image: IMAGES.students.student1,
      color: 'from-primary to-secondary',
      details: [
        'University Integrated: Profile created automatically from university data',
        'Independent: Upload projects (code, docs, presentations) + select courses',
        'AI identifies courses and creates complete profile',
        'Both paths: Full platform access in < 5 minutes'
      ],
      stats: { students: '125,000+', time: '< 5 min' },
      visual: {
        type: 'upload',
        files: ['main.py', 'README.md', 'requirements.txt', 'docs/'],
        progress: 85
      }
    },
    {
      id: 2,
      title: 'AI Analysis & Scoring',
      description: 'Our advanced AI analyzes code quality, innovation level, complexity, and extracts relevant skills',
      image: IMAGES.features.aiAnalysis,
      color: 'from-primary to-secondary',
      details: [
        'Code quality assessment using industry standards',
        'Innovation scoring based on uniqueness and creativity',
        'Automatic skill extraction and categorization',
        'Technology stack analysis and recommendations'
      ],
      stats: { accuracy: '94%', skills: '500+' },
      visual: {
        type: 'analysis',
        scores: { innovation: 85, quality: 92, complexity: 'Advanced' },
        skills: ['Python', 'Machine Learning', 'Web Development', 'APIs']
      }
    },
    {
      id: 3,
      title: 'Story Generation',
      description: 'Transform technical projects into compelling professional narratives that recruiters understand',
      image: IMAGES.companies.team,
      color: 'from-primary to-secondary',
      details: [
        'AI-powered professional storytelling',
        'Industry-specific terminology and keywords',
        'Achievement and impact highlighting',
        'ATS-optimized content generation'
      ],
      stats: { stories: '89,000+', engagement: '+40%' },
      visual: {
        type: 'story',
        content: 'Developed an intelligent recommendation system that increased user engagement by 40%. Leveraged machine learning algorithms to analyze customer behavior patterns...'
      }
    },
    {
      id: 4,
      title: 'Smart Matching',
      description: 'Connect students with relevant opportunities and enable recruiters to find the perfect candidates',
      image: IMAGES.success.handshake,
      color: 'from-primary to-secondary',
      details: [
        'AI-powered skill and project matching',
        'Real-time opportunity notifications',
        'Preference-based filtering and recommendations',
        'Direct communication channels'
      ],
      stats: { matches: '8,500+', success: '78%' },
      visual: {
        type: 'matching',
        matches: [
          { company: 'TechCorp', role: 'ML Engineer', match: 94 },
          { company: 'DataFlow', role: 'Full Stack Dev', match: 89 }
        ]
      }
    }
  ]

  const benefits = [
    {
      icon: Users,
      title: 'For Students',
      description: 'Showcase your work professionally and get discovered by top companies',
      features: ['AI-enhanced portfolios', 'Direct recruiter connections', 'Career insights', 'Skill verification']
    },
    {
      icon: Building2,
      title: 'For Companies',
      description: 'Find and hire the best talent based on real projects and verified skills',
      features: ['Pre-screened candidates', 'Project-based assessment', 'Direct messaging', 'Hiring analytics']
    },
    {
      icon: GraduationCap,
      title: 'For Institutes (Universities & ITS)',
      description: 'Turn your Career Center into a strategic intelligence hub. Stop guessing. Start knowing.',
      features: [
        'See which companies search your students (Deloitte viewed 31 Economics students → time for outreach?)',
        'Data-driven career advice (Excel searched 89x → tell students to learn it)',
        'Fix at-risk profiles before graduation (87 seniors with zero views = early intervention)',
        'Give departments curriculum feedback (Add Docker → hired 60% faster)',
        'Prove your impact (Dashboard: 156 contacts → 23 hires → 47 days avg)'
      ]
    }
  ]

  // Auto-advance steps
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setActiveStep(prev => (prev + 1) % steps.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [isAutoPlaying]) // Removed steps.length dependency to prevent infinite loop

  const currentStep = steps[activeStep]

  return (
    <section id="how-it-works" className="relative py-24 overflow-hidden hero-bg">
      <div className="container max-w-7xl mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-display font-bold text-foreground mb-6">
            How InTransparency{' '}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Works
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Our AI-powered platform transforms academic projects into professional opportunities through four simple steps
          </p>

          <div className="flex justify-center items-center space-x-4">
            <Button
              variant={isAutoPlaying ? "default" : "outline"}
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              size="sm"
            >
              {isAutoPlaying ? 'Pause' : 'Play'} Demo
            </Button>
            <span className="text-sm text-gray-700">Auto-advancing every 4 seconds</span>
          </div>
        </div>

        {/* Step Navigation */}
        <div className="flex justify-center mb-12 overflow-x-auto">
          <div className="flex space-x-2 p-2">
            {steps.map((step, index) => {
              return (
                <button
                  key={step.id}
                  onClick={() => {
                    setActiveStep(index)
                    setIsAutoPlaying(false)
                  }}
                  className={`flex items-center px-4 py-3 rounded-lg transition-all duration-500 whitespace-nowrap ${
                    activeStep === index
                      ? `bg-gradient-to-r ${step.color} text-white shadow-lg transform scale-105`
                      : 'bg-white text-gray-600 hover:bg-gray-50 shadow border'
                  }`}
                >
                  <div className="relative w-5 h-5 mr-2 rounded-full overflow-hidden">
                    <Image
                      src={step.image}
                      alt={step.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="font-medium">{step.title}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Current Step Display */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Left: Step Details */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src={currentStep.image}
                  alt={currentStep.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-700 mb-1">Step {currentStep.id}</div>
                <h3 className="text-3xl font-bold text-gray-900">{currentStep.title}</h3>
              </div>
            </div>

            <p className="text-lg text-gray-600 leading-relaxed">
              {currentStep.description}
            </p>

            <div className="space-y-3">
              {currentStep.details.map((detail, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{detail}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center space-x-6 pt-4">
              {Object.entries(currentStep.stats).map(([key, value]) => (
                <div key={key} className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{value}</div>
                  <div className="text-sm text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Visual Demo */}
          <div className="relative">
            <Card className="p-6 shadow-2xl border-0 bg-gradient-to-br from-white to-gray-50/50 overflow-hidden">
              <CardContent className="p-0">
                {currentStep.visual.type === 'upload' && (
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center bg-blue-50/50">
                      <Upload className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                      <h5 className="font-semibold text-gray-900 mb-4">Project Upload</h5>
                      <div className="space-y-2">
                        {currentStep.visual.files?.map((file, index) => (
                          <div key={index} className="bg-white rounded p-3 text-sm text-gray-600 flex items-center">
                            📄 <span className="ml-2">{file}</span>
                            <CheckCircle className="h-4 w-4 text-green-500 ml-auto" />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Upload Progress</span>
                        <span className="text-sm text-blue-600">{currentStep.visual.progress}%</span>
                      </div>
                      <div className="w-full bg-blue-100 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${currentStep.visual.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep.visual.type === 'analysis' && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="relative w-32 h-32 mx-auto mb-4">
                        <div className="absolute inset-0 rounded-full border-8 border-purple-100"></div>
                        <div className="absolute inset-0 rounded-full border-8 border-purple-500 border-t-transparent animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Brain className="h-8 w-8 text-purple-600" />
                        </div>
                      </div>
                      <h5 className="font-semibold text-gray-900">AI Analysis in Progress...</h5>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">{currentStep.visual.scores?.innovation}</div>
                        <div className="text-sm text-gray-600">Innovation Score</div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">{currentStep.visual.scores?.quality}</div>
                        <div className="text-sm text-gray-600">Code Quality</div>
                      </div>
                    </div>

                    <div>
                      <h6 className="font-medium text-gray-900 mb-3">Skills Detected:</h6>
                      <div className="flex flex-wrap gap-2">
                        {currentStep.visual.skills?.map((skill, index) => (
                          <Badge key={index} className="bg-purple-100 text-purple-800">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {currentStep.visual.type === 'story' && (
                  <div className="space-y-4">
                    <div className="flex items-center mb-4">
                      <Sparkles className="h-6 w-6 text-yellow-500 mr-2" />
                      <h5 className="font-semibold text-gray-900">Professional Story Generated</h5>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-200">
                      <p className="text-gray-700 leading-relaxed text-sm">
                        {currentStep.visual.content}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="bg-green-50 rounded-lg p-3">
                        <Zap className="h-5 w-5 text-green-500 mx-auto mb-1" />
                        <div className="text-xs text-gray-600">ATS Optimized</div>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-3">
                        <TrendingUp className="h-5 w-5 text-blue-500 mx-auto mb-1" />
                        <div className="text-xs text-gray-600">Industry Keywords</div>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep.visual.type === 'matching' && (
                  <div className="space-y-4">
                    <div className="flex items-center mb-4">
                      <Target className="h-6 w-6 text-green-500 mr-2" />
                      <h5 className="font-semibold text-gray-900">Perfect Matches Found</h5>
                    </div>
                    <div className="space-y-3">
                      {currentStep.visual.matches?.map((match, index) => (
                        <div key={index} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                          <div className="flex items-center justify-between">
                            <div>
                              <h6 className="font-semibold text-gray-900">{match.role}</h6>
                              <p className="text-sm text-gray-600">{match.company}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-green-600">{match.match}%</div>
                              <div className="text-xs text-gray-700">match</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="bg-orange-50 rounded-lg p-3 text-center">
                      <Clock className="h-5 w-5 text-orange-500 mx-auto mb-1" />
                      <div className="text-sm text-orange-700">Real-time notifications for new opportunities</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Animated Elements */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full animate-bounce"></div>
            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-r from-secondary to-primary rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="mb-16">
          <h3 className="text-3xl font-display font-bold text-center text-foreground mb-12">
            Benefits for Everyone
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <Card key={index} className="p-6 text-center border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50">
                  <CardContent className="p-0">
                    <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h4>
                    <p className="text-gray-600 mb-4">{benefit.description}</p>
                    <div className="space-y-2">
                      {(benefit.features || []).map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center">
          <h3 className="text-3xl font-display font-bold text-foreground mb-6">
            Ready to Get Started?
          </h3>
          <p className="text-xl text-foreground/80 max-w-2xl mx-auto mb-8">
            Join thousands of students and hundreds of companies already using InTransparency
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105" asChild>
              <a href="/auth/register/role-selection">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="/pricing">
                View Pricing
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}