'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (user) {
    return null // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="text-2xl font-bold text-gray-900">CareerPivot</div>
            <div className="hidden md:flex space-x-8">
              <a href="#about" className="text-gray-600 hover:text-gray-900 transition-colors">About</a>
              <a href="#functions" className="text-gray-600 hover:text-gray-900 transition-colors">Functions</a>
              <a href="#advantages" className="text-gray-600 hover:text-gray-900 transition-colors">Advantages</a>
              <a href="#specifications" className="text-gray-600 hover:text-gray-900 transition-colors">Specifications</a>
            </div>
            <div className="flex space-x-4">
              <Link href="/auth/login" className="text-gray-600 hover:text-gray-900 transition-colors">
                Sign In
              </Link>
              <Link href="/auth/signup" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-6xl md:text-8xl font-bold text-gray-900 mb-8 leading-tight">
              Feeling trapped?<br/>
              Your potential unheard?<br/>
              Feeling stuck?
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
              CareerPivot is a personal AI career strategist that learns your professional journey
              and provides personalized transition roadmaps with actionable steps.
            </p>
            <Link href="/auth/signup" className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors inline-block">
              Start Your Career Journey
            </Link>
          </div>

          {/* Hero Images */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <div className="text-center">
              <div className="w-64 h-64 mx-auto bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-4xl">💼</span>
              </div>
            </div>
            <div className="text-center">
              <div className="w-64 h-64 mx-auto bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-4xl">📈</span>
              </div>
            </div>
            <div className="text-center">
              <div className="w-64 h-64 mx-auto bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-4xl">🎯</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">About CareerPivot</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              CareerPivot is a personal AI career strategist that learns thousands of career transition
              stories from successful professionals. It provides personalized support that is proven by
              real experience in helping people navigate career changes.
            </p>
          </div>

          {/* Team Section */}
          <div className="text-center mb-16">
            <h3 className="text-2xl font-semibold text-gray-900 mb-8">Our Mission</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              To help mid-career professionals break free from golden handcuffs and pursue fulfilling careers
              with confidence and clarity.
            </p>
          </div>
        </div>
      </section>

      {/* Functions Section */}
      <section id="functions" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">How CareerPivot Helps</h2>
          </div>

          {/* Function Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Analyze */}
            <div className="text-center">
              <div className="w-20 h-20 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-3xl">🔍</span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Analyze</h3>
              <p className="text-gray-600 mb-6">
                CareerPivot actively analyzes your skills, experience, financial situation,
                and career goals to understand your current position and aspirations.
              </p>
              <div className="space-y-3 text-left">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm italic text-gray-700">"I thought I was stuck, but CareerPivot showed me skills I didn't realize I had."</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm italic text-gray-700">"It mapped my transferable skills across different industries."</p>
                </div>
              </div>
            </div>

            {/* Plan */}
            <div className="text-center">
              <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-3xl">📋</span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Plan</h3>
              <p className="text-gray-600 mb-6">
                By understanding your complete professional profile, CareerPivot creates
                realistic transition roadmaps with specific milestones and timelines.
              </p>
              <div className="space-y-3 text-left">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm italic text-gray-700">"Finally had a clear 6-month plan instead of vague career advice."</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm italic text-gray-700">"Accounted for my mortgage and family obligations."</p>
                </div>
              </div>
            </div>

            {/* Support */}
            <div className="text-center">
              <div className="w-20 h-20 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-3xl">🤝</span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Support</h3>
              <p className="text-gray-600 mb-6">
                Based on comprehensive analysis, CareerPivot provides personalized career
                guidance, skill development recommendations, and ongoing motivation.
              </p>
              <div className="space-y-3 text-left">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm italic text-gray-700">"Not alone anymore - CareerPivot believed in me when I doubted myself."</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm italic text-gray-700">"Weekly check-ins kept me accountable and motivated."</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section id="advantages" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Why CareerPivot?</h2>
          </div>

          {/* Advantages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-blue-600 rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl text-white">🎯</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Personalization</h3>
              <p className="text-gray-600">
                CareerPivot learns from your interactions and adapts its guidance to your
                individual needs, preferences, and career goals.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-green-600 rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl text-white">⏰</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">24/7 Availability</h3>
              <p className="text-gray-600">
                Career support is available whenever you need it - morning, night, or anytime
                in between. No waiting for appointments or office hours.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-purple-600 rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl text-white">🔒</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Confidentiality</h3>
              <p className="text-gray-600">
                All your career discussions and personal information are encrypted and
                completely private. Your career journey stays confidential.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-orange-600 rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl text-white">🎓</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Expert Knowledge</h3>
              <p className="text-gray-600">
                Unlike generic career advice, CareerPivot is trained on thousands of real
                career transition success stories and professional guidance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Target Audience Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">CareerPivot is for Everyone</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-4xl">😔</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Feeling Stuck in Your Role</h3>
              <p className="text-gray-600">
                You're competent and successful, but something feels missing. You want more purpose,
                better work-life balance, or different challenges.
              </p>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-4xl">💰</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Worried About Finances</h3>
              <p className="text-gray-600">
                You're in the "golden handcuffs" - good salary and benefits, but afraid to make
                changes due to financial uncertainty and family obligations.
              </p>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-4xl">🔄</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Considering a Career Switch</h3>
              <p className="text-gray-600">
                You're intrigued by a new field but don't know where to start. You need guidance
                on skill gaps, networking, and transition strategies.
              </p>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-4xl">📈</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Ready for Leadership</h3>
              <p className="text-gray-600">
                You're ready to move into management or senior roles but need help positioning
                yourself and developing the necessary leadership skills.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Specifications Section */}
      <section id="specifications" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">How It Works</h2>
          </div>

          {/* Process Steps */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-blue-600 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl text-white font-bold">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Sign Up</h3>
              <p className="text-gray-600">Create your account and complete our diagnostic quiz</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-blue-600 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl text-white font-bold">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Get Analyzed</h3>
              <p className="text-gray-600">AI analyzes your skills, finances, and career goals</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-blue-600 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl text-white font-bold">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Receive Plan</h3>
              <p className="text-gray-600">Get your personalized 6-month, 1-year, 2-year roadmap</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-blue-600 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl text-white font-bold">4</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Take Action</h3>
              <p className="text-gray-600">Execute your plan with ongoing AI support and guidance</p>
            </div>
          </div>

          {/* Feature Specifications */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">CareerPivot Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">🎯 Career Analysis</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• Skills assessment and gap analysis</li>
                  <li>• Industry fit evaluation</li>
                  <li>• Salary expectation setting</li>
                  <li>• Career path recommendations</li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">💰 Financial Planning</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• Emergency fund calculations</li>
                  <li>• Budget optimization</li>
                  <li>• Salary bridge analysis</li>
                  <li>• Transition cost planning</li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">📚 Learning & Development</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• Certification recommendations</li>
                  <li>• Skill development roadmaps</li>
                  <li>• Course and training suggestions</li>
                  <li>• Progress tracking</li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">🤝 Ongoing Support</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• Personalized action plans</li>
                  <li>• Weekly progress check-ins</li>
                  <li>• Motivation and accountability</li>
                  <li>• Career coaching insights</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of professionals who have successfully navigated their career transitions with CareerPivot.
          </p>
          <Link href="/auth/signup" className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-block">
            Start Your Journey Today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="text-2xl font-bold mb-4">CareerPivot</div>
            <p className="text-gray-400 mb-8">
              Your AI-powered career transition companion
            </p>
            <div className="flex justify-center space-x-6">
              <Link href="/auth/login" className="text-gray-400 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link href="/auth/signup" className="text-gray-400 hover:text-white transition-colors">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
