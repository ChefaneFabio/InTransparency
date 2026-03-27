'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Mic,
  Loader2,
  CheckCircle2,
  ArrowRight,
  Lightbulb,
  Star,
  TrendingUp,
  MessageSquare,
  RefreshCw,
} from 'lucide-react'

interface Question {
  question: string
  type: string
  tip: string
}

interface Evaluation {
  score: number
  strengths: string[]
  improvements: string[]
  modelAnswer: string
}

export default function InterviewPrepPage() {
  const t = useTranslations('interviewPrep')

  const [role, setRole] = useState('')
  const [company, setCompany] = useState('')
  const [questions, setQuestions] = useState<Question[]>([])
  const [generating, setGenerating] = useState(false)
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null)
  const [answer, setAnswer] = useState('')
  const [evaluating, setEvaluating] = useState(false)
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null)

  const generateQuestions = async () => {
    setGenerating(true)
    setQuestions([])
    setActiveQuestion(null)
    setEvaluation(null)
    try {
      const res = await fetch('/api/dashboard/student/interview-prep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate_questions', role, company }),
      })
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      setQuestions(data.questions || [])
    } catch {
      alert(t('error'))
    } finally {
      setGenerating(false)
    }
  }

  const evaluateAnswer = async () => {
    if (activeQuestion === null || !answer.trim()) return
    setEvaluating(true)
    setEvaluation(null)
    try {
      const res = await fetch('/api/dashboard/student/interview-prep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'evaluate_answer',
          question: questions[activeQuestion].question,
          answer,
        }),
      })
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      setEvaluation(data.evaluation)
    } catch {
      alert(t('error'))
    } finally {
      setEvaluating(false)
    }
  }

  const typeColors: Record<string, string> = {
    behavioral: 'bg-blue-100 text-blue-800',
    technical: 'bg-purple-100 text-purple-800',
    introductory: 'bg-green-100 text-green-800',
    situational: 'bg-amber-100 text-amber-800',
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('title')}</h1>
        <p className="text-gray-600">{t('subtitle')}</p>
      </div>

      {/* Setup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5 text-primary" />
            {t('setup.title')}
          </CardTitle>
          <CardDescription>{t('setup.subtitle')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('setup.role')}</label>
              <Input
                placeholder={t('setup.rolePlaceholder')}
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('setup.company')}</label>
              <Input
                placeholder={t('setup.companyPlaceholder')}
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>
          </div>
          <Button onClick={generateQuestions} disabled={generating} className="w-full" size="lg">
            {generating ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t('setup.generating')}</>
            ) : (
              <><MessageSquare className="mr-2 h-5 w-5" />{t('setup.generate')}</>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Questions */}
      {questions.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">{t('questions.title')}</h2>
          {questions.map((q, i) => (
            <Card
              key={i}
              className={`cursor-pointer transition-all ${activeQuestion === i ? 'border-primary shadow-md' : 'hover:shadow-md'}`}
              onClick={() => { setActiveQuestion(i); setEvaluation(null); setAnswer('') }}
            >
              <CardContent className="pt-4 pb-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={typeColors[q.type] || 'bg-gray-100 text-gray-800'}>
                        {q.type}
                      </Badge>
                    </div>
                    <p className="font-medium text-gray-900">{q.question}</p>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <Lightbulb className="h-3 w-3" /> {q.tip}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <Button variant="outline" onClick={generateQuestions} disabled={generating} className="w-full">
            <RefreshCw className="mr-2 h-4 w-4" />
            {t('questions.regenerate')}
          </Button>
        </div>
      )}

      {/* Practice Answer */}
      {activeQuestion !== null && (
        <Card className="border-primary/30">
          <CardHeader>
            <CardTitle>{t('practice.title')}</CardTitle>
            <CardDescription className="font-medium text-gray-900">
              &ldquo;{questions[activeQuestion].question}&rdquo;
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder={t('practice.placeholder')}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={6}
              className="resize-none"
            />
            <Button
              onClick={evaluateAnswer}
              disabled={evaluating || !answer.trim()}
              className="w-full"
            >
              {evaluating ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t('practice.evaluating')}</>
              ) : (
                <><Star className="mr-2 h-4 w-4" />{t('practice.evaluate')}</>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Evaluation */}
      {evaluation && (
        <Card className={evaluation.score >= 7 ? 'border-green-300' : evaluation.score >= 5 ? 'border-amber-300' : 'border-red-300'}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{t('feedback.title')}</CardTitle>
              <div className={`text-3xl font-bold ${
                evaluation.score >= 7 ? 'text-green-600' : evaluation.score >= 5 ? 'text-amber-600' : 'text-red-600'
              }`}>
                {evaluation.score}/10
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Strengths */}
            <div>
              <h4 className="font-medium text-green-700 flex items-center gap-1 mb-2">
                <CheckCircle2 className="h-4 w-4" /> {t('feedback.strengths')}
              </h4>
              <ul className="space-y-1">
                {evaluation.strengths.map((s, i) => (
                  <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                    <ArrowRight className="h-3 w-3 text-green-500 flex-shrink-0 mt-1" /> {s}
                  </li>
                ))}
              </ul>
            </div>

            {/* Improvements */}
            <div>
              <h4 className="font-medium text-amber-700 flex items-center gap-1 mb-2">
                <TrendingUp className="h-4 w-4" /> {t('feedback.improvements')}
              </h4>
              <ul className="space-y-1">
                {evaluation.improvements.map((s, i) => (
                  <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                    <ArrowRight className="h-3 w-3 text-amber-500 flex-shrink-0 mt-1" /> {s}
                  </li>
                ))}
              </ul>
            </div>

            {/* Model Answer */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <h4 className="font-medium text-primary mb-2 flex items-center gap-1">
                <Lightbulb className="h-4 w-4" /> {t('feedback.modelAnswer')}
              </h4>
              <p className="text-sm text-gray-700">{evaluation.modelAnswer}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
