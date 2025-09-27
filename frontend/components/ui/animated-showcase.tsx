'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  ArrowRight,
  Sparkles,
  Target,
  Zap,
  TrendingUp,
  Users,
  Brain,
  Code,
  FileText,
  MessageSquare,
  Award,
  ChevronRight,
  Play,
  Pause
} from 'lucide-react'

interface ShowcaseItem {
  id: string
  title: string
  description: string
  icon: any
  color: string
  stats?: { label: string; value: string }[]
  features?: string[]
  animation: {
    type: 'typewriter' | 'counter' | 'progress' | 'slideshow' | 'pulse'
    data: any
  }
}

const showcaseItems: ShowcaseItem[] = [
  {
    id: 'ai-analysis',
    title: 'AI-Powered Code Analysis',
    description: 'Advanced algorithms analyze your code quality, complexity, and innovation level in real-time',
    icon: Brain,
    color: 'from-purple-500 to-purple-600',
    stats: [
      { label: 'Accuracy', value: '94%' },
      { label: 'Languages', value: '25+' },
      { label: 'Metrics', value: '50+' }
    ],
    animation: {
      type: 'progress',
      data: [
        { label: 'Code Quality', value: 92, color: 'bg-green-500' },
        { label: 'Innovation', value: 85, color: 'bg-blue-500' },
        { label: 'Complexity', value: 78, color: 'bg-purple-500' },
        { label: 'Best Practices', value: 96, color: 'bg-orange-500' }
      ]
    }
  },
  {
    id: 'story-generation',
    title: 'Professional Story Generation',
    description: 'Transform technical projects into compelling narratives that recruiters understand and appreciate',
    icon: FileText,
    color: 'from-blue-500 to-blue-600',
    stats: [
      { label: 'Stories Generated', value: '89K+' },
      { label: 'Engagement Boost', value: '+40%' },
      { label: 'ATS Score', value: '95%' }
    ],
    animation: {
      type: 'typewriter',
      data: {
        text: 'Developed an intelligent recommendation system using machine learning algorithms to analyze user behavior patterns, resulting in a 40% increase in user engagement and 25% improvement in conversion rates...',
        speed: 50
      }
    }
  },
  {
    id: 'smart-matching',
    title: 'Smart Candidate Matching',
    description: 'AI algorithms match students with relevant opportunities based on projects, skills, and preferences',
    icon: Target,
    color: 'from-green-500 to-green-600',
    stats: [
      { label: 'Successful Matches', value: '8.5K+' },
      { label: 'Success Rate', value: '78%' },
      { label: 'Avg. Response Time', value: '2 hrs' }
    ],
    animation: {
      type: 'slideshow',
      data: [
        { company: 'TechCorp', role: 'ML Engineer', match: 94, logo: '🚀' },
        { company: 'DataFlow', role: 'Full Stack Developer', match: 89, logo: '💻' },
        { company: 'AI Innovations', role: 'Data Scientist', match: 92, logo: '🔬' },
        { company: 'WebTech', role: 'Frontend Developer', match: 87, logo: '🎨' }
      ]
    }
  },
  {
    id: 'real-time-analytics',
    title: 'Real-Time Analytics',
    description: 'Track performance metrics, engagement rates, and career progress with detailed insights',
    icon: TrendingUp,
    color: 'from-orange-500 to-orange-600',
    stats: [
      { label: 'Data Points', value: '500M+' },
      { label: 'Real-time Updates', value: '24/7' },
      { label: 'Accuracy', value: '99.9%' }
    ],
    animation: {
      type: 'counter',
      data: [
        { label: 'Profile Views', target: 1247, suffix: '' },
        { label: 'Applications', target: 23, suffix: '' },
        { label: 'Match Score', target: 94, suffix: '%' },
        { label: 'Response Rate', target: 67, suffix: '%' }
      ]
    }
  }
]

interface AnimatedShowcaseProps {
  autoPlay?: boolean
  interval?: number
  showControls?: boolean
  className?: string
}

export function AnimatedShowcase({
  autoPlay = true,
  interval = 4000,
  showControls = true,
  className = ""
}: AnimatedShowcaseProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [animationKey, setAnimationKey] = useState(0)

  const activeItem = showcaseItems[activeIndex]

  useEffect(() => {
    if (!isPlaying) return

    const timer = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % showcaseItems.length)
      setAnimationKey(prev => prev + 1)
    }, interval)

    return () => clearInterval(timer)
  }, [isPlaying, interval])

  const handleItemSelect = (index: number) => {
    setActiveIndex(index)
    setAnimationKey(prev => prev + 1)
    setIsPlaying(false)
  }

  const renderAnimation = (item: ShowcaseItem) => {
    const { animation } = item

    switch (animation.type) {
      case 'progress':
        return (
          <div className="space-y-4">
            {(animation.data || []).map((metric: any, index: number) => (
              <ProgressBar key={`${animationKey}-${index}`} {...metric} />
            ))}
          </div>
        )

      case 'typewriter':
        return (
          <TypewriterText
            key={animationKey}
            text={animation.data.text}
            speed={animation.data.speed}
          />
        )

      case 'slideshow':
        return (
          <MatchSlideshow key={animationKey} matches={animation.data} />
        )

      case 'counter':
        return (
          <CounterGrid key={animationKey} counters={animation.data} />
        )

      default:
        return <div className="text-center text-gray-700">Animation placeholder</div>
    }
  }

  return (
    <section className={`py-16 ${className}`}>
      <div className="container max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Platform Features in{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Action
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            See how our AI-powered platform transforms the way students showcase their work and connect with opportunities
          </p>
        </div>

        {/* Controls */}
        {showControls && (
          <div className="flex justify-center items-center space-x-4 mb-8">
            <Button
              variant={isPlaying ? "default" : "outline"}
              size="sm"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
              {isPlaying ? 'Pause' : 'Play'}
            </Button>
            <span className="text-sm text-gray-700">Auto-advancing every {interval / 1000}s</span>
          </div>
        )}

        {/* Feature Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {showcaseItems.map((item, index) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => handleItemSelect(index)}
                className={`flex items-center px-4 py-2 rounded-lg transition-all duration-300 ${
                  activeIndex === index
                    ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                    : 'bg-white text-gray-600 hover:bg-gray-50 border'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                <span className="font-medium text-sm">{item.title}</span>
              </button>
            )
          })}
        </div>

        {/* Main Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Feature Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className={`w-16 h-16 bg-gradient-to-r ${activeItem.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                <activeItem.icon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{activeItem.title}</h3>
                <div className="flex items-center mt-1">
                  <Sparkles className="h-4 w-4 text-yellow-500 mr-1" />
                  <span className="text-sm text-gray-700">AI-Powered</span>
                </div>
              </div>
            </div>

            <p className="text-lg text-gray-600 leading-relaxed">
              {activeItem.description}
            </p>

            {/* Stats */}
            {activeItem.stats && (
              <div className="grid grid-cols-3 gap-4">
                {(activeItem.stats || []).map((stat, index) => (
                  <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-700">{stat.label}</div>
                  </div>
                ))}
              </div>
            )}

            <Button className="group" asChild>
              <Link href="/demo">
                Learn More
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>

          {/* Right: Animation */}
          <Card className="p-6 shadow-2xl border-0 bg-gradient-to-br from-white to-gray-50/50">
            <CardContent className="p-0">
              {renderAnimation(activeItem)}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

// Animation Components
function ProgressBar({ label, value, color }: { label: string; value: number; color: string }) {
  const [animatedValue, setAnimatedValue] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(value)
    }, 200)
    return () => clearTimeout(timer)
  }, [value])

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-medium text-gray-700">{label}</span>
        <span className="text-gray-600">{animatedValue}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className={`h-3 rounded-full transition-all duration-2000 ease-out ${color}`}
          style={{ width: `${animatedValue}%` }}
        />
      </div>
    </div>
  )
}

function TypewriterText({ text, speed }: { text: string; speed: number }) {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, speed)
      return () => clearTimeout(timer)
    }
  }, [currentIndex, text, speed])

  return (
    <div className="bg-gray-900 rounded-lg p-4 text-green-400 font-mono text-sm">
      <div className="flex items-center mb-2">
        <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
        <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
        <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
        <span className="text-gray-600 text-xs ml-2">story-generator.ai</span>
      </div>
      <div className="min-h-[100px]">
        {displayText}
        <span className="animate-pulse">|</span>
      </div>
    </div>
  )
}

function MatchSlideshow({ matches }: { matches: any[] }) {
  const [currentMatch, setCurrentMatch] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentMatch(prev => (prev + 1) % matches.length)
    }, 1500)
    return () => clearInterval(timer)
  }, [matches.length])

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h4 className="font-semibold text-gray-900 mb-2">Perfect Matches Found</h4>
        <Badge className="bg-green-100 text-green-800">Live Matching</Badge>
      </div>

      <div className="space-y-3">
        {(matches || []).map((match, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border transition-all duration-500 ${
              index === currentMatch
                ? 'bg-blue-50 border-blue-300 shadow-md scale-105'
                : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{match.logo}</div>
                <div>
                  <h5 className="font-semibold text-gray-900">{match.role}</h5>
                  <p className="text-sm text-gray-600">{match.company}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-600">{match.match}%</div>
                <div className="text-xs text-gray-700">match</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function CounterGrid({ counters }: { counters: any[] }) {
  const [animatedValues, setAnimatedValues] = useState<number[]>(new Array(counters.length).fill(0))

  useEffect(() => {
    counters.forEach((counter, index) => {
      const timer = setTimeout(() => {
        let current = 0
        const increment = counter.target / 50
        const counterTimer = setInterval(() => {
          current += increment
          if (current >= counter.target) {
            current = counter.target
            clearInterval(counterTimer)
          }
          setAnimatedValues(prev => {
            const newValues = [...prev]
            newValues[index] = Math.floor(current)
            return newValues
          })
        }, 30)
      }, index * 200)
      return () => clearTimeout(timer)
    })
  }, [counters])

  return (
    <div className="grid grid-cols-2 gap-4">
      {(counters || []).map((counter, index) => (
        <div key={index} className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {animatedValues[index]}{counter.suffix}
          </div>
          <div className="text-sm text-gray-600">{counter.label}</div>
        </div>
      ))}
    </div>
  )
}