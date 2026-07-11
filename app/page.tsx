import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { getAuthenticatedUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { profile } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export default async function Home() {
  const authenticatedUser = await getAuthenticatedUser()
  
  if (authenticatedUser) {
    // Check if user has a profile
    const userProfile = await db.query.profile.findFirst({
      where: eq(profile.userId, authenticatedUser.id),
    })
    
    if (userProfile) {
      redirect('/dashboard')
    } else {
      redirect('/onboarding')
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-teal-700">Monsoon Preparedness</h1>
        <div className="flex gap-4">
          <Link href="/sign-in">
            <Button variant="outline">Sign In</Button>
          </Link>
          <Link href="/sign-up">
            <Button className="bg-teal-600 hover:bg-teal-700">Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-5xl mx-auto px-6 py-20 text-center">
        <h2 className="text-5xl font-bold text-teal-900 mb-6">
          Be Prepared. Stay Safe. Act with Confidence.
        </h2>
        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
          An AI-native platform that transforms generic monsoon weather data into specific, personal answers. Get personalized preparedness plans, real-time alerts, and guidance for your family and home.
        </p>

        <Link href="/sign-up">
          <Button className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-6 text-lg rounded-lg">
            Start Your Preparedness Plan
          </Button>
        </Link>

        {/* Feature highlight boxes */}
        <div className="grid grid-cols-3 gap-6 mt-20">
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <div className="text-3xl mb-4">📋</div>
            <h3 className="font-semibold text-gray-900 mb-2">Personalized Plans</h3>
            <p className="text-gray-600 text-sm">AI-generated recommendations based on your location, family, and home.</p>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <div className="text-3xl mb-4">⚠️</div>
            <h3 className="font-semibold text-gray-900 mb-2">Real-Time Alerts</h3>
            <p className="text-gray-600 text-sm">Stay informed with weather updates and safety recommendations.</p>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <div className="text-3xl mb-4">🤝</div>
            <h3 className="font-semibold text-gray-900 mb-2">Community Support</h3>
            <p className="text-gray-600 text-sm">Connect with neighbors and access local resources and shelter info.</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 mt-20">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-600">
          <p>Monsoon Preparedness Platform © 2026. For monsoon-affected communities.</p>
        </div>
      </footer>
    </main>
  )
}
