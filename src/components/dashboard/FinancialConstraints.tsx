'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { Database } from '@/lib/database.types'

type FinancialConstraints = Database['public']['Tables']['financial_constraints']['Row']

export function FinancialConstraints() {
  const { user } = useAuth()
  const [, setConstraints] = useState<FinancialConstraints | null>(null) // constraints data stored for future use
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [monthlyExpenses, setMonthlyExpenses] = useState('')
  const [debt, setDebt] = useState('')
  const [savings, setSavings] = useState('')

  const fetchConstraints = useCallback(async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('financial_constraints')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows returned

      if (data) {
        setConstraints(data)
        setMonthlyExpenses(data.monthly_expenses.toString())
        setDebt(data.debt.toString())
        setSavings(data.savings.toString())
      }
    } catch (error) {
      console.error('Error fetching financial constraints:', error)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (user) {
      fetchConstraints()
    }
  }, [user, fetchConstraints])

  const handleSave = async () => {
    if (!user) return

    setSaving(true)
    try {
      const data = {
        user_id: user.id,
        monthly_expenses: parseFloat(monthlyExpenses) || 0,
        debt: parseFloat(debt) || 0,
        savings: parseFloat(savings) || 0,
      }

      const { error } = await supabase
        .from('financial_constraints')
        .upsert(data, { onConflict: 'user_id' })

      if (error) throw error

      await fetchConstraints() // Refresh data
    } catch (error) {
      console.error('Error updating financial constraints:', error)
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
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Overview</CardTitle>
        <CardDescription>
          Track your monthly expenses, debt, and savings to understand transition constraints
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="monthlyExpenses">Monthly Expenses (USD)</Label>
          <Input
            id="monthlyExpenses"
            type="number"
            placeholder="e.g. 3500"
            value={monthlyExpenses}
            onChange={(e) => setMonthlyExpenses(e.target.value)}
            min="0"
            step="100"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="debt">Total Debt (USD)</Label>
          <Input
            id="debt"
            type="number"
            placeholder="e.g. 25000"
            value={debt}
            onChange={(e) => setDebt(e.target.value)}
            min="0"
            step="1000"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="savings">Emergency Savings (USD)</Label>
          <Input
            id="savings"
            type="number"
            placeholder="e.g. 15000"
            value={savings}
            onChange={(e) => setSavings(e.target.value)}
            min="0"
            step="1000"
          />
        </div>
        <Button onClick={handleSave} disabled={saving} className="w-full">
          {saving ? 'Saving...' : 'Save Financial Info'}
        </Button>
      </CardContent>
    </Card>
  )
}
