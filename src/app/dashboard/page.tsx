'use client'

import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { UserProfile } from '@/components/dashboard/UserProfile'
import { FinancialConstraints } from '@/components/dashboard/FinancialConstraints'
import { CareerGoals } from '@/components/dashboard/CareerGoals'
import { TransitionPlans } from '@/components/dashboard/TransitionPlans'
import { EscapePlanGenerator } from '@/components/dashboard/EscapePlanGenerator'

export default function Dashboard() {
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">CareerPivot Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.email}</p>
            </div>
            <Button onClick={handleSignOut} variant="outline">
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <UserProfile />
            <FinancialConstraints />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <CareerGoals />
            <div className="lg:col-span-1"></div> {/* Empty space for layout */}
          </div>

          <TransitionPlans />

          {/* AI Escape Plan Generator */}
          <div className="mt-8">
            <EscapePlanGenerator />
          </div>
        </div>
      </main>
    </div>
  )
}
