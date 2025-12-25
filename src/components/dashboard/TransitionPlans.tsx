'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import type { Database } from '@/lib/database.types'

type MilestonePeriod = Database['public']['Enums']['milestone_period']
type TransitionPlan = Database['public']['Tables']['transition_plans']['Row']

const PERIODS: { value: MilestonePeriod; label: string; description: string }[] = [
  { value: '6_months', label: '6 Months', description: 'Short-term actionable milestones' },
  { value: '1_year', label: '1 Year', description: 'Medium-term career goals' },
  { value: '2_years', label: '2 Years', description: 'Long-term career vision' },
]

export function TransitionPlans() {
  const { user } = useAuth()
  const [plans, setPlans] = useState<Record<MilestonePeriod, TransitionPlan | null>>({
    '6_months': null,
    '1_year': null,
    '2_years': null,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<Record<MilestonePeriod, boolean>>({
    '6_months': false,
    '1_year': false,
    '2_years': false,
  })
  const [milestones, setMilestones] = useState<Record<MilestonePeriod, string>>({
    '6_months': '',
    '1_year': '',
    '2_years': '',
  })

  const fetchPlans = useCallback(async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('transition_plans')
        .select('*')
        .eq('user_id', user.id)

      if (error) throw error

      const plansMap = { ...plans }
      const milestonesMap = { ...milestones }

      data.forEach((plan) => {
        plansMap[plan.period as MilestonePeriod] = plan
        milestonesMap[plan.period as MilestonePeriod] = plan.milestones.join('\n')
      })

      setPlans(plansMap)
      setMilestones(milestonesMap)
    } catch (error) {
      console.error('Error fetching transition plans:', error)
    } finally {
      setLoading(false)
    }
  }, [user, plans, milestones])

  useEffect(() => {
    if (user) {
      fetchPlans()
    }
  }, [user, fetchPlans])

  const handleSave = async (period: MilestonePeriod) => {
    if (!user) return

    setSaving(prev => ({ ...prev, [period]: true }))

    try {
      const milestoneList = milestones[period]
        .split('\n')
        .map(milestone => milestone.trim())
        .filter(milestone => milestone.length > 0)

      const data = {
        user_id: user.id,
        period,
        milestones: milestoneList,
      }

      const { error } = await supabase
        .from('transition_plans')
        .upsert(data, { onConflict: 'user_id,period' })

      if (error) throw error

      await fetchPlans() // Refresh data
    } catch (error) {
      console.error('Error updating transition plan:', error)
    } finally {
      setSaving(prev => ({ ...prev, [period]: false }))
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {PERIODS.map((_, index) => (
              <div key={index} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transition Plans</CardTitle>
        <CardDescription>
          Create actionable milestones for your career transition journey
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {PERIODS.map((period) => (
          <div key={period.value} className="space-y-3">
            <div>
              <Label htmlFor={`milestones-${period.value}`} className="text-base font-medium">
                {period.label} Milestones
              </Label>
              <p className="text-sm text-gray-600">{period.description}</p>
            </div>
            <Textarea
              id={`milestones-${period.value}`}
              placeholder="Enter one milestone per line..."
              value={milestones[period.value]}
              onChange={(e) => setMilestones(prev => ({
                ...prev,
                [period.value]: e.target.value
              }))}
              rows={4}
              className="resize-none"
            />
            <Button
              onClick={() => handleSave(period.value)}
              disabled={saving[period.value]}
              className="w-full"
            >
              {saving[period.value] ? 'Saving...' : `Save ${period.label} Plan`}
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
