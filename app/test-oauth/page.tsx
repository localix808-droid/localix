'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'

export default function TestOAuthPage() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const testFacebookOAuth = async () => {
    setIsLoading(true)
    try {
      // Test the Facebook OAuth endpoint
      const response = await fetch('/api/auth/facebook?business_id=test&redirect_uri=http://localhost:3000/dashboard/social')
      
      if (response.ok) {
        // If we get here, the OAuth URL was generated successfully
        alert('Facebook OAuth is configured correctly! Check the network tab to see the redirect URL.')
      } else {
        alert('Facebook OAuth configuration error. Check the console for details.')
      }
    } catch (error) {
      console.error('OAuth test error:', error)
      alert('OAuth test failed. Check the console for details.')
    } finally {
      setIsLoading(false)
    }
  }

  const showConfig = () => {
    const config = {
      facebookAppId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || 'Not set',
      nodeEnv: process.env.NODE_ENV,
      hasUser: !!user,
      userId: user?.id || 'Not authenticated'
    }
    
    alert(`OAuth Configuration:\n${JSON.stringify(config, null, 2)}`)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 font-sans">Authentication Required</h2>
          <p className="text-gray-600">Please sign in to test OAuth configuration.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 font-sans">OAuth Configuration Test</h1>
          
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Facebook OAuth Test</h3>
              <p className="text-sm text-gray-500 mb-4">
                Test the Facebook OAuth configuration and see if it redirects properly.
              </p>
              <button
                onClick={testFacebookOAuth}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? 'Testing...' : 'Test Facebook OAuth'}
              </button>
            </div>

            <div className="p-4 border rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Configuration Info</h3>
              <p className="text-sm text-gray-500 mb-4">
                View the current OAuth configuration settings.
              </p>
              <button
                onClick={showConfig}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Show Configuration
              </button>
            </div>

            <div className="p-4 border rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Manual OAuth Test</h3>
              <p className="text-sm text-gray-500 mb-4">
                Click the link below to manually test the Facebook OAuth flow:
              </p>
              <a
                href="/api/auth/facebook?business_id=test&redirect_uri=http://localhost:3000/dashboard/social"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 inline-block"
              >
                Test Facebook OAuth Redirect
              </a>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-sm font-medium text-blue-800 mb-2">What This Tests</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Facebook App ID and Secret are configured</li>
              <li>• OAuth redirect URL is properly formatted</li>
              <li>• API routes are working correctly</li>
              <li>• Environment variables are loaded</li>
            </ul>
          </div>

          <div className="mt-6 flex space-x-4">
            <a
              href="/dashboard/social"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Go to Social Media
            </a>
            <a
              href="/test-social-connections"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Test Database
            </a>
          </div>
        </div>
      </div>
    </div>
  )
} 