'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { Database } from '@/lib/database.types'

type CareerGoals = Database['public']['Tables']['career_goals']['Row']

export function CareerGoals() {
  const { user } = useAuth()
  const [, setGoals] = useState<CareerGoals | null>(null) // goals data stored for future use
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [targetIndustries, setTargetIndustries] = useState('')
  const [desiredSalary, setDesiredSalary] = useState('')

  const fetchGoals = useCallback(async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('career_goals')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows returned

      if (data) {
        setGoals(data)
        setTargetIndustries(data.target_industries.join(', '))
        setDesiredSalary(data.desired_salary?.toString() || '')
      }
    } catch (error) {
      console.error('Error fetching career goals:', error)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (user) {
      fetchGoals()
    }
  }, [user, fetchGoals])

  const handleSave = async () => {
    if (!user) return

    setSaving(true)
    try {
      const industries = targetIndustries
        .split(',')
        .map(industry => industry.trim())
        .filter(industry => industry.length > 0)

      const data = {
        user_id: user.id,
        target_industries: industries,
        desired_salary: desiredSalary ? parseFloat(desiredSalary) : null,
      }

      const { error } = await supabase
        .from('career_goals')
        .upsert(data, { onConflict: 'user_id' })

      if (error) throw error

      await fetchGoals() // Refresh data
    } catch (error) {
      console.error('Error updating career goals:', error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Career Goals</CardTitle>
        <CardDescription>
          Define your target industries and desired salary for your career transition
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="targetIndustries">Target Industries</Label>
          <Input
            id="targetIndustries"
            type="text"
            placeholder="e.g. Technology, Healthcare, Finance (comma-separated)"
            value={targetIndustries}
            onChange={(e) => setTargetIndustries(e.target.value)}
          />
          <p className="text-sm text-gray-500">
            Enter industries separated by commas
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="desiredSalary">Desired Annual Salary (USD)</Label>
          <Input
            id="desiredSalary"
            type="number"
            placeholder="e.g. 150000"
            value={desiredSalary}
            onChange={(e) => setDesiredSalary(e.target.value)}
            min="0"
            step="1000"
          />
        </div>
        <Button onClick={handleSave} disabled={saving} className="w-full">
          {saving ? 'Saving...' : 'Save Career Goals'}
        </Button>
      </CardContent>
    </Card>
  )
}
