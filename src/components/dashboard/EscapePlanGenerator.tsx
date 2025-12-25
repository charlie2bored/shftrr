'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { generateEscapePlan } from '@/lib/actions/escape-plan'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import type { EscapePlanOutput } from '@/lib/escape-plan.types'

const formSchema = z.object({
  // Employment Status
  employmentStatus: z.enum(['employed', 'unemployed', 'self-employed', 'student']),

  // Current Employment (conditional)
  currentJobTitle: z.string().optional(),
  currentSalary: z.number().min(0).optional(),
  yearsExperience: z.number().min(0).optional(),

  // Education
  degrees: z.string().optional(),
  highestEducation: z.string().optional(),

  // Career Goals
  desiredField: z.string().optional(),
  desiredJobTitle: z.string().optional(),
  desiredSalary: z.number().min(0).optional(),

  // Financial Information
  monthlyExpenses: z.number().min(0, 'Expenses must be positive'),
  debt: z.number().min(0),
  savings: z.number().min(0).optional(),
  monthlyIncome: z.number().min(0).optional(),

  // Skills & Experience
  technicalSkills: z.string().optional(),
  softSkills: z.string().optional(),
  certifications: z.string().optional(),

  // Additional Context
  dailyVents: z.string().optional(),
  careerInterests: z.string().optional(),
})

type FormData = z.infer<typeof formSchema>

export function EscapePlanGenerator() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<EscapePlanOutput | null>(null)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    setError(null)

    try {
      const escapePlanInput = {
        userProfile: {
          employmentStatus: data.employmentStatus,
          currentJobTitle: data.currentJobTitle || undefined,
          currentSalary: data.currentSalary || undefined,
          yearsExperience: data.yearsExperience || undefined,
          education: {
            degrees: data.degrees ? data.degrees.split(',').map(d => d.trim()).filter(d => d) : [],
            certifications: data.certifications ? data.certifications.split(',').map(c => c.trim()).filter(c => c) : [],
            highestEducation: data.highestEducation || undefined,
          },
          dailyVents: data.dailyVents ? data.dailyVents.split('\n').filter(v => v.trim()) : [],
        },
        financialData: {
          monthlyExpenses: data.monthlyExpenses,
          debt: data.debt,
          savings: data.savings || null,
          monthlyIncome: data.monthlyIncome || 0, // Default to 0 for unemployed users
        },
        skills: {
          technicalSkills: data.technicalSkills ? data.technicalSkills.split(',').map(s => s.trim()).filter(s => s) : [],
          softSkills: data.softSkills ? data.softSkills.split(',').map(s => s.trim()).filter(s => s) : [],
          certifications: data.certifications ? data.certifications.split(',').map(c => c.trim()).filter(c => c) : [],
        },
        careerGoals: data.desiredField || data.desiredJobTitle || data.desiredSalary || data.careerInterests ? {
          desiredField: data.desiredField || undefined,
          desiredJobTitle: data.desiredJobTitle || undefined,
          desiredSalary: data.desiredSalary || undefined,
          careerInterests: data.careerInterests ? data.careerInterests.split(',').map(i => i.trim()).filter(i => i) : [],
        } : undefined,
      }

      const plan = await generateEscapePlan(escapePlanInput)

      setResult(plan)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const getBurnoutColor = (level: string) => {
    switch (level) {
      case 'Low': return 'bg-green-100 text-green-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'
      case 'High': return 'bg-orange-100 text-orange-800'
      case 'Critical': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getFinancialColor = (status: string) => {
    switch (status) {
      case 'Critical': return 'bg-red-100 text-red-800'
      case 'Limited': return 'bg-orange-100 text-orange-800'
      case 'Moderate': return 'bg-yellow-100 text-yellow-800'
      case 'Strong': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI-Powered Escape Plan Generator</CardTitle>
          <CardDescription>
            Fill out your information to get a personalized career transition plan powered by AI
          </CardDescription>
        </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Employment Status */}
            <div className="space-y-2">
              <Label htmlFor="employmentStatus">Employment Status</Label>
              <select
                id="employmentStatus"
                {...register('employmentStatus')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="employed">Employed</option>
                <option value="unemployed">Unemployed</option>
                <option value="self-employed">Self-employed</option>
                <option value="student">Student</option>
              </select>
            </div>

            {/* Job Information (conditional for employed users) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currentJobTitle">Current Job Title (optional)</Label>
                <Input
                  id="currentJobTitle"
                  {...register('currentJobTitle')}
                  placeholder="e.g. Senior Software Engineer or leave blank if unemployed"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currentSalary">Current Annual Salary (USD) (optional)</Label>
                <Input
                  id="currentSalary"
                  type="number"
                  {...register('currentSalary', { valueAsNumber: true })}
                  placeholder="120000 or leave blank if unemployed"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="yearsExperience">Years of Experience (optional)</Label>
              <Input
                id="yearsExperience"
                type="number"
                {...register('yearsExperience', { valueAsNumber: true })}
                placeholder="8"
              />
            </div>

            {/* Education */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="highestEducation">Highest Level of Education</Label>
                <select
                  id="highestEducation"
                  {...register('highestEducation')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select education level</option>
                  <option value="high-school">High School</option>
                  <option value="associate">Associate Degree</option>
                  <option value="bachelor">Bachelor's Degree</option>
                  <option value="master">Master's Degree</option>
                  <option value="phd">PhD</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="degrees">Degrees/Diplomas (comma-separated, optional)</Label>
                <Input
                  id="degrees"
                  {...register('degrees')}
                  placeholder="e.g. Bachelor's in Computer Science, MBA"
                />
              </div>
            </div>

            {/* Career Goals */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Career Goals</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="desiredField">Desired Career Field</Label>
                  <Input
                    id="desiredField"
                    {...register('desiredField')}
                    placeholder="e.g. Technology, Healthcare, Finance"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="desiredJobTitle">Desired Job Title</Label>
                  <Input
                    id="desiredJobTitle"
                    {...register('desiredJobTitle')}
                    placeholder="e.g. Software Architect, Product Manager"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="desiredSalary">Desired Annual Salary (USD)</Label>
                <Input
                  id="desiredSalary"
                  type="number"
                  {...register('desiredSalary', { valueAsNumber: true })}
                  placeholder="150000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="careerInterests">Career Interests (comma-separated, optional)</Label>
                <Input
                  id="careerInterests"
                  {...register('careerInterests')}
                  placeholder="e.g. AI/ML, Product Management, Entrepreneurship"
                />
              </div>
            </div>

            {/* Financial Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="monthlyIncome">Monthly Income (USD)</Label>
                <Input
                  id="monthlyIncome"
                  type="number"
                  {...register('monthlyIncome', { valueAsNumber: true })}
                  placeholder="10000"
                />
                {errors.monthlyIncome && (
                  <p className="text-sm text-red-600">{errors.monthlyIncome.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthlyExpenses">Monthly Expenses (USD)</Label>
                <Input
                  id="monthlyExpenses"
                  type="number"
                  {...register('monthlyExpenses', { valueAsNumber: true })}
                  placeholder="5000"
                />
                {errors.monthlyExpenses && (
                  <p className="text-sm text-red-600">{errors.monthlyExpenses.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="debt">Total Debt (USD)</Label>
                <Input
                  id="debt"
                  type="number"
                  {...register('debt', { valueAsNumber: true })}
                  placeholder="50000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="savings">Emergency Savings (USD)</Label>
                <Input
                  id="savings"
                  type="number"
                  {...register('savings', { valueAsNumber: true })}
                  placeholder="25000"
                />
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="technicalSkills">Technical Skills (comma-separated)</Label>
                <Input
                  id="technicalSkills"
                  {...register('technicalSkills')}
                  placeholder="React, TypeScript, Node.js, AWS"
                />
                {errors.technicalSkills && (
                  <p className="text-sm text-red-600">{errors.technicalSkills.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="softSkills">Soft Skills (comma-separated)</Label>
                <Input
                  id="softSkills"
                  {...register('softSkills')}
                  placeholder="Leadership, Communication, Problem Solving"
                />
                {errors.softSkills && (
                  <p className="text-sm text-red-600">{errors.softSkills.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="certifications">Certifications (comma-separated, optional)</Label>
                <Input
                  id="certifications"
                  {...register('certifications')}
                  placeholder="AWS Certified Solutions Architect, PMP"
                />
              </div>
            </div>

            {/* Daily Vents */}
            <div className="space-y-2">
              <Label htmlFor="dailyVents">Daily Vents/Complaints (one per line, optional)</Label>
              <Textarea
                id="dailyVents"
                {...register('dailyVents')}
                placeholder="Meetings are a waste of time&#10;No work-life balance&#10;Toxic management culture"
                rows={4}
              />
              <p className="text-sm text-gray-600">
                Share what&apos;s bothering you most about your current job. This helps assess burnout risk.
              </p>
            </div>

            {error && (
              <Alert>
                <AlertDescription className="text-red-600">{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Generating Escape Plan...' : 'Generate AI Escape Plan'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Motivational Header */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-gray-900 mb-4">
                🎉 Your Career Transformation Journey Begins!
              </CardTitle>
              <CardDescription className="text-lg text-gray-700 mb-4">
                {result.motivation.inspiration}
              </CardDescription>
              <div className="bg-white p-4 rounded-lg shadow-sm mx-auto max-w-2xl">
                <p className="text-lg font-semibold text-blue-600">
                  💪 {result.motivation.accountability}
                </p>
              </div>
            </CardHeader>
          </Card>

          {/* Daily Motivation Prompts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🌅 Daily Motivation Boosters
              </CardTitle>
              <CardDescription>
                Quick reflection questions to keep you motivated throughout your journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {result.dailyMotivationPrompts.map((prompt, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-2xl">💭</span>
                    <p className="text-gray-700">{prompt}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Celebration Points */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🎊 Celebration Milestones
              </CardTitle>
              <CardDescription>
                Reward yourself for reaching these important checkpoints!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {result.celebrationPoints.map((point, index) => (
                  <div key={index} className="border-l-4 border-yellow-400 pl-4 py-3">
                    <h4 className="font-semibold text-gray-900">{point.trigger}</h4>
                    <p className="text-gray-700 mt-1">{point.message}</p>
                    <p className="text-sm text-yellow-600 mt-1">🎁 {point.reward}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your AI-Generated Escape Plan</CardTitle>
              <CardDescription>Generated on {new Date(result.generatedAt).toLocaleDateString()}</CardDescription>
            </CardHeader>
          </Card>

          {/* Burnout Risk */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Burnout Risk Assessment
                <Badge className={getBurnoutColor(result.burnoutRisk.level)}>
                  {result.burnoutRisk.level} ({result.burnoutRisk.score}/100)
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <h4 className="font-medium">Key Factors:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {result.burnoutRisk.factors.map((factor, index) => (
                    <li key={index} className="text-sm">{factor}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Financial Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Financial Runway
                  <Badge className={getFinancialColor(result.financialRunway.status)}>
                    {result.financialRunway.status}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-lg font-semibold">{result.financialRunway.months} months</p>
                  <p className="text-sm text-gray-600">{result.financialRunway.recommendation}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Emergency Fund Recommendation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-lg font-semibold text-green-600">${result.emergencyFund.recommendedAmount.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Recommended emergency fund</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Timeframe: {result.emergencyFund.timeframe}</p>
                    <p className="text-xs text-gray-500">{result.emergencyFund.calculation}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Tips to Build:</h4>
                    <ul className="text-sm space-y-1">
                      {result.emergencyFund.tips.map((tip, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Budget Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Budget Optimization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(result.budgetRecommendation.recommendedExpenses).map(([category, amount]) => (
                    <div key={category} className="text-center p-3 bg-gray-50 rounded">
                      <p className="text-sm font-medium text-gray-600">{category}</p>
                      <p className="text-lg font-semibold">${amount.toFixed(0)}</p>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-600">{result.budgetRecommendation.rationale}</p>
                  {result.budgetRecommendation.debtReduction && (
                    <p className="text-sm text-orange-600 mt-2">{result.budgetRecommendation.debtReduction}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Career Paths */}
          <Card>
            <CardHeader>
              <CardTitle>Career Path Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-green-700">Primary Path: {result.careerPaths.primary.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{result.careerPaths.primary.description}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                    <div><span className="font-medium">Salary:</span> {result.careerPaths.primary.salaryRange}</div>
                    <div><span className="font-medium">Time:</span> {result.careerPaths.primary.timeToEntry}</div>
                    <div><span className="font-medium">Growth:</span> {result.careerPaths.primary.growthPotential}</div>
                    <div><span className="font-medium">Fit:</span> {result.careerPaths.primary.fitScore}/100</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Alternative Career Paths:</h4>
                  <div className="space-y-3">
                    {result.careerPaths.alternatives.map((path, index) => (
                      <div key={index} className="border rounded p-3">
                        <h5 className="font-medium">{path.title}</h5>
                        <p className="text-sm text-gray-600 mb-2">{path.description}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                          <div><span className="font-medium">Salary:</span> {path.salaryRange}</div>
                          <div><span className="font-medium">Time:</span> {path.timeToEntry}</div>
                          <div><span className="font-medium">Growth:</span> {path.growthPotential}</div>
                          <div><span className="font-medium">Fit:</span> {path.fitScore}/100</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills and Certifications */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Skills Needed for Transition</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.skillsNeeded.map((skill, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-500 mr-2 mt-1">•</span>
                      <span className="text-sm">{skill}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recommended Certifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {result.certifications.map((cert, index) => (
                    <div key={index} className="border rounded p-3">
                      <h5 className="font-medium">{cert.name}</h5>
                      <p className="text-sm text-gray-600">{cert.provider}</p>
                      <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                        <div><span className="font-medium">Cost:</span> {cert.cost}</div>
                        <div><span className="font-medium">Duration:</span> {cert.duration}</div>
                        <div><span className="font-medium">Relevance:</span> {cert.relevance}/100</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Field Selector (for undecided users) */}
          {result.fieldSelector && (
            <Card>
              <CardHeader>
                <CardTitle>Career Field Recommendations</CardTitle>
                <CardDescription>Since you haven't specified a desired field, here are our recommendations:</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Recommended Fields:</h4>
                    <div className="flex flex-wrap gap-2">
                      {result.fieldSelector.recommendedFields.map((field, index) => (
                        <Badge key={index} variant="outline">{field}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Reasoning:</h4>
                    <p className="text-sm text-gray-600">{result.fieldSelector.reasoning}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Next Steps:</h4>
                    <ul className="text-sm space-y-1">
                      {result.fieldSelector.nextSteps.map((step, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-blue-500 mr-2">{index + 1}.</span>
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Interactive Roadmap */}
          <div className="space-y-8">
            {Object.entries(result.roadmap).map(([phaseKey, phase]) => (
              <Card key={phaseKey} className="border-l-4 border-blue-500">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
                  <CardTitle className="text-2xl">{phase.title}</CardTitle>
                  <CardDescription className="text-lg font-medium">{phase.duration}</CardDescription>
                  {phase.introduction && (
                    <div className="mt-4 p-4 bg-white rounded-lg border">
                      <p className="text-gray-700 italic">{phase.introduction}</p>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Goals */}
                  <div>
                    <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      🎯 Goals
                    </h4>
                    <ul className="space-y-2">
                      {phase.goals.map((goal, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-green-500 mt-1">✓</span>
                          <span className="text-gray-700">{goal}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Actions with Specific Steps */}
                  <div>
                    <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      🚀 Action Plan
                    </h4>
                    <div className="space-y-4">
                      {phase.actions.map((action, index) => (
                        <div key={index} className="border rounded-lg p-4 bg-gray-50">
                          <h5 className="font-medium text-gray-900 mb-2">{action.description}</h5>
                          <p className="text-sm text-gray-600 mb-3">⏱️ {action.timeEstimate}</p>
                          <ul className="space-y-1 mb-3">
                            {action.specificSteps.map((step, stepIndex) => (
                              <li key={stepIndex} className="flex items-start gap-2 text-sm">
                                <span className="text-blue-500 mt-1">{stepIndex + 1}.</span>
                                <span className="text-gray-700">{step}</span>
                              </li>
                            ))}
                          </ul>
                          {action.tools && action.tools.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {action.tools.map((tool, toolIndex) => (
                                <span key={toolIndex} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                  🛠️ {tool}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Milestones with Celebrations */}
                  <div>
                    <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      🏆 Milestones & Celebrations
                    </h4>
                    <div className="space-y-3">
                      {phase.milestones.map((milestone, index) => (
                        <div key={index} className="border-l-4 border-yellow-400 pl-4 py-3 bg-yellow-50 rounded-r-lg">
                          <h5 className="font-medium text-gray-900">{milestone.description}</h5>
                          <p className="text-sm text-yellow-700 mt-1">{milestone.celebration}</p>
                          <p className="text-xs text-gray-600 mt-1">📊 {milestone.measurable}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Courage Boosts */}
                  {phase.courageBoosts && phase.courageBoosts.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        🛡️ Courage Boosts
                      </h4>
                      <div className="space-y-3">
                        {phase.courageBoosts.map((boost, index) => (
                          <div key={index} className="border-l-4 border-green-400 pl-4 py-3 bg-green-50 rounded-r-lg">
                            <h5 className="font-medium text-gray-900">Fear: {boost.fear}</h5>
                            <p className="text-sm text-green-700 mt-1 italic">"{boost.affirmation}"</p>
                            <p className="text-sm text-gray-600 mt-2">
                              <strong>Action:</strong> {boost.action}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Interactive Elements */}
                  {phase.interactiveElements && phase.interactiveElements.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        📱 Interactive Tools
                      </h4>
                      <div className="space-y-2">
                        {phase.interactiveElements.map((element, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                            <span className="text-2xl">
                              {element.type === 'progress_bar' ? '📊' :
                               element.type === 'checklist' ? '✅' :
                               element.type === 'reflection_question' ? '💭' :
                               element.type === 'motivation_prompt' ? '🎯' : '📱'}
                            </span>
                            <div>
                              <h5 className="font-medium text-gray-900">{element.title}</h5>
                              <p className="text-sm text-gray-600">{element.content}</p>
                              {element.frequency && (
                                <p className="text-xs text-blue-600">🔄 {element.frequency}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Weekly Check-ins */}
                  {phase.weeklyCheckIns && phase.weeklyCheckIns.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        📅 Weekly Check-ins
                      </h4>
                      <div className="space-y-2">
                        {phase.weeklyCheckIns.map((question, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                            <span className="text-blue-500 font-bold">{index + 1}.</span>
                            <p className="text-gray-700">{question}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Risks and Contingencies */}
                  {(phase.risks && phase.risks.length > 0) || (phase.contingencies && phase.contingencies.length > 0) ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {phase.risks && phase.risks.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-lg mb-3 flex items-center gap-2 text-red-600">
                            ⚠️ Risks
                          </h4>
                          <ul className="space-y-1">
                            {phase.risks.map((risk, index) => (
                              <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                                <span className="text-red-500 mt-1">•</span>
                                <span>{risk}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {phase.contingencies && phase.contingencies.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-lg mb-3 flex items-center gap-2 text-green-600">
                            🛟 Contingencies
                          </h4>
                          <ul className="space-y-1">
                            {phase.contingencies.map((contingency, index) => (
                              <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                                <span className="text-green-500 mt-1">•</span>
                                <span>{contingency}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
