'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { QUIZ_QUESTIONS, QUIZ_CATEGORIES, type QuizQuestion } from '@/lib/quiz-questions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/contexts/AuthContext'

interface QuizAnswers {
  [key: string]: any
}

export function DiagnosticQuiz() {
  const { user } = useAuth()
  const router = useRouter()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<QuizAnswers>({})
  const [loading, setLoading] = useState(false)
  const [completed, setCompleted] = useState(false)

  const currentQuestion = QUIZ_QUESTIONS[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / QUIZ_QUESTIONS.length) * 100

  useEffect(() => {
    // Check if user has already completed the quiz
    if (user) {
      checkExistingAssessment()
    }
  }, [user])

  useEffect(() => {
    // Redirect to dashboard after showing completion message
    if (completed) {
      const timer = setTimeout(() => {
        router.push('/dashboard')
      }, 2000) // 2 second delay to show completion message

      return () => clearTimeout(timer)
    }
  }, [completed, router])

  const checkExistingAssessment = async () => {
    if (!user) return

    const { data } = await supabase
      .from('user_assessments')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (data) {
      setCompleted(true)
    }
  }

  const handleAnswer = (questionId: string, answer: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const handleNext = () => {
    if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    } else {
      handleSubmit()
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const handleSubmit = async () => {
    if (!user) return

    setLoading(true)

    try {
      // Process answers into assessment format
      const assessmentData = {
        user_id: user.id,
        career_satisfaction: answers.career_satisfaction || null,
        burnout_level: answers.burnout_level || null,
        risk_tolerance: mapRiskTolerance(answers.risk_tolerance) || null,
        financial_readiness: mapFinancialReadiness(answers.financial_readiness) || null,
        timeline_preference: mapTimelinePreference(answers.timeline_preference) || null,
        family_situation: {
          dependents: mapDependents(answers.dependents),
          location_flexibility: answers.location_flexibility
        },
        skills_gaps: answers.skills_gaps || [],
        industry_interests: answers.industry_interests || [],
        motivation_factors: answers.motivation_factors || []
      }

      const { error } = await supabase
        .from('user_assessments')
        .upsert(assessmentData)

      if (error) throw error

      setCompleted(true)
    } catch (error) {
      console.error('Error saving assessment:', error)
    } finally {
      setLoading(false)
    }
  }

  const mapRiskTolerance = (answer: string) => {
    if (answer?.includes('Conservative')) return 'conservative'
    if (answer?.includes('Moderate')) return 'moderate'
    if (answer?.includes('Aggressive')) return 'aggressive'
    return null
  }

  const mapFinancialReadiness = (answer: string) => {
    if (answer?.includes('Poor')) return 'poor'
    if (answer?.includes('Fair')) return 'fair'
    if (answer?.includes('Good')) return 'good'
    if (answer?.includes('Excellent')) return 'excellent'
    return null
  }

  const mapTimelinePreference = (answer: string) => {
    if (answer?.includes('Immediate')) return 'immediate'
    if (answer?.includes('6 months')) return '6_months'
    if (answer?.includes('1 year')) return '1_year'
    if (answer?.includes('2+ years')) return '2_years'
    return null
  }

  const mapDependents = (answer: string) => {
    if (answer?.includes('None')) return 0
    if (answer?.includes('1 dependent')) return 1
    if (answer?.includes('2 dependents')) return 2
    if (answer?.includes('3+ dependents')) return 3
    return 0
  }

  const renderQuestion = (question: QuizQuestion) => {
    switch (question.type) {
      case 'scale':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>{question.labels?.[question.min || 1]}</span>
              <span>{question.labels?.[question.max || 10]}</span>
            </div>
            <Slider
              value={[answers[question.id] || 5]}
              onValueChange={(value) => handleAnswer(question.id, value[0])}
              min={question.min || 1}
              max={question.max || 10}
              step={1}
              className="w-full"
            />
            <div className="text-center font-medium">
              {answers[question.id] || 5} / {question.max || 10}
            </div>
          </div>
        )

      case 'multiple_choice':
        return (
          <RadioGroup
            value={answers[question.id] || ''}
            onValueChange={(value) => handleAnswer(question.id, value)}
            className="space-y-3"
          >
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${question.id}-${index}`} />
                <Label htmlFor={`${question.id}-${index}`} className="text-sm">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )

      case 'checkbox':
        return (
          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox
                  id={`${question.id}-${index}`}
                  checked={(answers[question.id] || []).includes(option)}
                  onCheckedChange={(checked) => {
                    const currentAnswers = answers[question.id] || []
                    if (checked) {
                      handleAnswer(question.id, [...currentAnswers, option])
                    } else {
                      handleAnswer(question.id, currentAnswers.filter((a: string) => a !== option))
                    }
                  }}
                />
                <Label htmlFor={`${question.id}-${index}`} className="text-sm">
                  {option}
                </Label>
              </div>
            ))}
          </div>
        )

      case 'text':
        return (
          <Textarea
            placeholder="Type your answer here..."
            value={answers[question.id] || ''}
            onChange={(e) => handleAnswer(question.id, e.target.value)}
            className="min-h-[100px]"
          />
        )

      default:
        return null
    }
  }

  if (completed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-green-600">Assessment Complete!</CardTitle>
            <CardDescription>
              Your diagnostic assessment has been saved. Redirecting to dashboard...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Career Diagnostic Assessment</h1>
          <p className="text-gray-600">
            Help us create a personalized career transition plan by answering a few questions.
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <Badge variant="outline">
                {QUIZ_CATEGORIES[currentQuestion.category as keyof typeof QUIZ_CATEGORIES]}
              </Badge>
              <span className="text-sm text-gray-500">
                Question {currentQuestionIndex + 1} of {QUIZ_QUESTIONS.length}
              </span>
            </div>
            <Progress value={progress} className="w-full" />
          </CardHeader>

          <CardContent className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">{currentQuestion.question}</h2>
              {renderQuestion(currentQuestion)}
            </div>

            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </Button>

              <Button
                onClick={handleNext}
                disabled={
                  currentQuestion.type === 'multiple_choice' && !answers[currentQuestion.id] ||
                  currentQuestion.type === 'scale' && answers[currentQuestion.id] === undefined
                }
              >
                {currentQuestionIndex === QUIZ_QUESTIONS.length - 1 ? 'Complete Assessment' : 'Next'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Your responses help us create a more personalized career transition plan.
            You can update your answers later in your profile settings.
          </p>
        </div>
      </div>
    </div>
  )
}
