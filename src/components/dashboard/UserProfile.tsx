'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { Database } from '@/lib/database.types'

type User = Database['public']['Tables']['users']['Row']

export function UserProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [currentJobTitle, setCurrentJobTitle] = useState('')
  const [currentSalary, setCurrentSalary] = useState('')

  const fetchProfile = useCallback(async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) throw error

      setProfile(data)
      setCurrentJobTitle(data.current_job_title || '')
      setCurrentSalary(data.current_salary?.toString() || '')
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (user) {
      fetchProfile()
    }
  }, [user, fetchProfile])

  const handleSave = async () => {
    if (!user) return

    setSaving(true)
    try {
      const { error } = await supabase
        .from('users')
        .update({
          current_job_title: currentJobTitle || null,
          current_salary: currentSalary ? parseFloat(currentSalary) : null,
        })
        .eq('id', user.id)

      if (error) throw error

      await fetchProfile() // Refresh data
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
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
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>
          Update your current job title and salary information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={profile?.email || ''}
            disabled
            className="bg-gray-50"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            type="text"
            value={profile?.full_name || ''}
            disabled
            className="bg-gray-50"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="jobTitle">Current Job Title</Label>
          <Input
            id="jobTitle"
            type="text"
            placeholder="e.g. Senior Software Engineer"
            value={currentJobTitle}
            onChange={(e) => setCurrentJobTitle(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="salary">Current Annual Salary (USD)</Label>
          <Input
            id="salary"
            type="number"
            placeholder="e.g. 120000"
            value={currentSalary}
            onChange={(e) => setCurrentSalary(e.target.value)}
            min="0"
            step="1000"
          />
        </div>
        <Button onClick={handleSave} disabled={saving} className="w-full">
          {saving ? 'Saving...' : 'Save Profile'}
        </Button>
      </CardContent>
    </Card>
  )
}
