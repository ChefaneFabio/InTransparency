'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Slider } from '@/components/ui/slider'
import { CheckCircle2, TrendingUp, Award, DollarSign } from 'lucide-react'
import { motion } from 'framer-motion'

export default function PricingSurveyPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    email: '',
    university: '',
    graduationYear: '',
    tooExpensive: 0,
    expensive: 0,
    bargain: 0,
    tooCheap: 0,
    willingToPay: '',
    comparedToCompetitors: '',
    paymentPreference: '',
    mostValuable: [] as string[],
    concerns: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const totalSteps = 6

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      const surveyData = {
        ...formData,
        timestamp: new Date().toISOString()
      }

      console.log('PRICING_SURVEY:', surveyData)

      // Store in localStorage
      const surveys = JSON.parse(localStorage.getItem('pricing_surveys') || '[]')
      surveys.push(surveyData)
      localStorage.setItem('pricing_surveys', JSON.stringify(surveys))

      // In production, would call API
      // await fetch('/api/validation/pricing-survey', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(surveyData)
      // })

      setSubmitted(true)
    } catch (error) {
      console.error('Survey error:', error)
      alert('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleMostValuable = (feature: string) => {
    if (formData.mostValuable.includes(feature)) {
      setFormData({
        ...formData,
        mostValuable: formData.mostValuable.filter(f => f !== feature)
      })
    } else {
      setFormData({
        ...formData,
        mostValuable: [...formData.mostValuable, feature]
      })
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Header />

        <main className="pt-24 pb-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-2 border-green-200 shadow-2xl">
                <CardContent className="p-12 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="mx-auto mb-6 rounded-full bg-green-100 p-6 w-24 h-24 flex items-center justify-center"
                  >
                    <CheckCircle2 className="h-12 w-12 text-green-600" />
                  </motion.div>

                  <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    Thank You!
                  </h1>

                  <p className="text-xl text-gray-700 mb-8">
                    Your feedback helps us create fair, student-friendly pricing.
                  </p>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                    <h3 className="font-bold text-lg text-gray-900 mb-3">What's next?</h3>
                    <ul className="text-left space-y-3">
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">
                          We'll analyze pricing data from all respondents
                        </span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">
                          You'll get early access when we launch (email: {formData.email})
                        </span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">
                          <span className="font-semibold">Bonus:</span> 20% early bird discount
                        </span>
                      </li>
                    </ul>
                  </div>

                  <Button size="lg" onClick={() => window.location.href = '/'}>
                    Back to Home
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />

      <main className="pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-8">
              <Badge className="mb-4 bg-gradient-to-r from-green-600 to-blue-600 text-white text-sm px-6 py-2 border-0">
                <TrendingUp className="inline h-4 w-4 mr-2" />
                Pricing Research
              </Badge>

              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Help Us Set Fair Pricing
              </h1>

              <p className="text-xl text-gray-700 mb-4">
                We're building a soft skills certification for students. Your input will help us price it fairly.
              </p>

              <p className="text-sm text-gray-600">
                Takes 3-4 minutes  •  All responses anonymous
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Step {step} of {totalSteps}</span>
                <span>{Math.round((step / totalSteps) * 100)}% complete</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-green-600 to-blue-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${(step / totalSteps) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            <Card className="border-2 border-gray-200 shadow-xl">
              <CardContent className="p-8">
                {/* Step 1: Basic Info */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">About You</h2>

                    <div className="space-y-6">
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="your.email@university.edu"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          We'll send you early access when we launch
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="university">University *</Label>
                        <Input
                          id="university"
                          required
                          value={formData.university}
                          onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                          placeholder="e.g., Politecnico di Milano"
                        />
                      </div>

                      <div>
                        <Label htmlFor="graduationYear">Expected Graduation Year *</Label>
                        <Input
                          id="graduationYear"
                          type="number"
                          min="2024"
                          max="2030"
                          required
                          value={formData.graduationYear}
                          onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                          placeholder="2026"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Too Expensive */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="mb-6">
                      <Badge className="bg-red-100 text-red-800">Van Westendorp Question 1/4</Badge>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      At what price would it be <span className="text-red-600">too expensive</span> to consider?
                    </h2>

                    <p className="text-gray-700 mb-8">
                      At this price, you'd think "that's way too much, I wouldn't even consider it."
                    </p>

                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <Label>Price: €{formData.tooExpensive}</Label>
                          <span className="text-3xl font-bold text-red-600">€{formData.tooExpensive}</span>
                        </div>
                        <Slider
                          value={[formData.tooExpensive]}
                          onValueChange={(value) => setFormData({ ...formData, tooExpensive: value[0] })}
                          min={0}
                          max={300}
                          step={5}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-2">
                          <span>€0</span>
                          <span>€150</span>
                          <span>€300</span>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600">
                          <strong>Context:</strong> A soft skills certification with Big Five personality test,
                          DISC behavioral assessment, and competency evaluation. Recognized by 500+ companies.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Expensive */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="mb-6">
                      <Badge className="bg-orange-100 text-orange-800">Van Westendorp Question 2/4</Badge>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      At what price would it be <span className="text-orange-600">expensive</span> but still worth considering?
                    </h2>

                    <p className="text-gray-700 mb-8">
                      At this price, you'd think "it's pricey, but I might still buy it if I need it."
                    </p>

                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <Label>Price: €{formData.expensive}</Label>
                          <span className="text-3xl font-bold text-orange-600">€{formData.expensive}</span>
                        </div>
                        <Slider
                          value={[formData.expensive]}
                          onValueChange={(value) => setFormData({ ...formData, expensive: value[0] })}
                          min={0}
                          max={300}
                          step={5}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-2">
                          <span>€0</span>
                          <span>€150</span>
                          <span>€300</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Bargain */}
                {step === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="mb-6">
                      <Badge className="bg-green-100 text-green-800">Van Westendorp Question 3/4</Badge>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      At what price would it be a <span className="text-green-600">bargain</span>?
                    </h2>

                    <p className="text-gray-700 mb-8">
                      At this price, you'd think "wow, that's a great deal! I should definitely get this."
                    </p>

                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <Label>Price: €{formData.bargain}</Label>
                          <span className="text-3xl font-bold text-green-600">€{formData.bargain}</span>
                        </div>
                        <Slider
                          value={[formData.bargain]}
                          onValueChange={(value) => setFormData({ ...formData, bargain: value[0] })}
                          min={0}
                          max={300}
                          step={5}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-2">
                          <span>€0</span>
                          <span>€150</span>
                          <span>€300</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 5: Too Cheap */}
                {step === 5 && (
                  <motion.div
                    key="step5"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="mb-6">
                      <Badge className="bg-gray-100 text-gray-800">Van Westendorp Question 4/4</Badge>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      At what price would it be <span className="text-gray-600">too cheap</span> that you'd question the quality?
                    </h2>

                    <p className="text-gray-700 mb-8">
                      At this price, you'd think "that's suspiciously cheap, is this even real or any good?"
                    </p>

                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <Label>Price: €{formData.tooCheap}</Label>
                          <span className="text-3xl font-bold text-gray-600">€{formData.tooCheap}</span>
                        </div>
                        <Slider
                          value={[formData.tooCheap]}
                          onValueChange={(value) => setFormData({ ...formData, tooCheap: value[0] })}
                          min={0}
                          max={300}
                          step={5}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-2">
                          <span>€0</span>
                          <span>€150</span>
                          <span>€300</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 6: Additional Questions */}
                {step === 6 && (
                  <motion.div
                    key="step6"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Final Questions</h2>

                    <div className="space-y-6">
                      <div>
                        <Label className="text-base font-medium mb-3 block">
                          Would you be willing to pay for a soft skills certification?
                        </Label>
                        <RadioGroup
                          value={formData.willingToPay}
                          onValueChange={(value) => setFormData({ ...formData, willingToPay: value })}
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes-definitely" id="yes-definitely" />
                            <Label htmlFor="yes-definitely" className="font-normal cursor-pointer">
                              Yes, definitely
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes-maybe" id="yes-maybe" />
                            <Label htmlFor="yes-maybe" className="font-normal cursor-pointer">
                              Yes, but only if it's the right price
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="unsure" id="unsure" />
                            <Label htmlFor="unsure" className="font-normal cursor-pointer">
                              Not sure yet
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="no" />
                            <Label htmlFor="no" className="font-normal cursor-pointer">
                              Probably not
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div>
                        <Label className="text-base font-medium mb-3 block">
                          What would be most valuable to you? (Select all that apply)
                        </Label>
                        <div className="space-y-2">
                          {[
                            'Validated by psychologists',
                            'Recognized by companies',
                            'Percentile rankings vs peers',
                            'Shareable certificate',
                            'Integrated into profile',
                            'Helps recruiters find me',
                            'Personal growth insights'
                          ].map((feature) => (
                            <div
                              key={feature}
                              onClick={() => toggleMostValuable(feature)}
                              className={`p-3 border rounded-lg cursor-pointer transition-all ${
                                formData.mostValuable.includes(feature)
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className="flex items-center">
                                <div className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center ${
                                  formData.mostValuable.includes(feature)
                                    ? 'border-blue-500 bg-blue-500'
                                    : 'border-gray-300'
                                }`}>
                                  {formData.mostValuable.includes(feature) && (
                                    <CheckCircle2 className="h-4 w-4 text-white" />
                                  )}
                                </div>
                                <span className="text-sm">{feature}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label className="text-base font-medium mb-3 block">
                          Preferred payment model?
                        </Label>
                        <RadioGroup
                          value={formData.paymentPreference}
                          onValueChange={(value) => setFormData({ ...formData, paymentPreference: value })}
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="one-time" id="one-time" />
                            <Label htmlFor="one-time" className="font-normal cursor-pointer">
                              One-time fee (e.g., €99)
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="subscription" id="subscription" />
                            <Label htmlFor="subscription" className="font-normal cursor-pointer">
                              Monthly subscription (e.g., €9/month)
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no-preference" id="no-preference" />
                            <Label htmlFor="no-preference" className="font-normal cursor-pointer">
                              No preference
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                  {step > 1 && (
                    <Button
                      variant="outline"
                      onClick={() => setStep(step - 1)}
                    >
                      ← Previous
                    </Button>
                  )}

                  {step < totalSteps ? (
                    <Button
                      onClick={() => setStep(step + 1)}
                      disabled={
                        (step === 1 && (!formData.email || !formData.university || !formData.graduationYear)) ||
                        (step === 2 && formData.tooExpensive === 0) ||
                        (step === 3 && formData.expensive === 0) ||
                        (step === 4 && formData.bargain === 0) ||
                        (step === 5 && formData.tooCheap === 0)
                      }
                      className="ml-auto"
                    >
                      Next →
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      disabled={isSubmitting || !formData.willingToPay || !formData.paymentPreference}
                      className="ml-auto bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Survey'}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
