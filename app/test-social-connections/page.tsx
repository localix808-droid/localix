'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { SocialAccount, PlatformSettings } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react'

export default function TestSocialConnectionsPage() {
  const { user } = useAuth()
  const [testResults, setTestResults] = useState<{
    tablesExist: boolean
    policiesExist: boolean
    functionsExist: boolean
    canInsert: boolean
    canQuery: boolean
    error?: string
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user) {
      runTests()
    }
  }, [user])

  const runTests = async () => {
    try {
      setIsLoading(true)
      const results = {
        tablesExist: false,
        policiesExist: false,
        functionsExist: false,
        canInsert: false,
        canQuery: false,
        error: undefined
      }

      // Test 1: Check if tables exist
      try {
        const { data: tables } = await supabase
          .from('social_accounts')
          .select('id')
          .limit(1)
        
        results.tablesExist = true
      } catch (error) {
        results.error = `Tables don't exist: ${error}`
        setTestResults(results)
        setIsLoading(false)
        return
      }

      // Test 2: Check if policies exist (try to query)
      try {
        const { data: accounts } = await supabase
          .from('social_accounts')
          .select('*')
        
        results.policiesExist = true
        results.canQuery = true
      } catch (error) {
        results.error = `Policies/RLS issue: ${error}`
      }

      // Test 3: Check if functions exist
      try {
        const { data: stats } = await supabase.rpc('get_platform_stats', {
          user_id: user?.id || ''
        })
        results.functionsExist = true
      } catch (error) {
        console.log('Functions not available:', error)
      }

      // Test 4: Try to insert a test record
      try {
        const { data: businesses } = await supabase
          .from('businesses')
          .select('id')
          .eq('user_id', user?.id)
          .limit(1)

        if (businesses && businesses.length > 0) {
          const testAccount = {
            business_id: businesses[0].id,
            platform: 'facebook' as const,
            account_name: 'test-account',
            is_active: true
          }

          const { error: insertError } = await supabase
            .from('social_accounts')
            .insert([testAccount])

          if (!insertError) {
            results.canInsert = true
            
            // Clean up test record
            await supabase
              .from('social_accounts')
              .delete()
              .eq('account_name', 'test-account')
          }
        }
      } catch (error) {
        console.log('Insert test failed:', error)
      }

      setTestResults(results)
    } catch (error) {
      setTestResults({
        tablesExist: false,
        policiesExist: false,
        functionsExist: false,
        canInsert: false,
        canQuery: false,
        error: `Test failed: ${error}`
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
          <p className="text-gray-600">Please sign in to test social connections.</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Running database tests...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Social Connections Database Test</h1>
          
          {testResults?.error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <XCircle className="h-5 w-5 text-red-400 mr-2" />
                <h3 className="text-sm font-medium text-red-800">Error</h3>
              </div>
              <p className="mt-1 text-sm text-red-700">{testResults.error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Database Tables</h3>
                <p className="text-sm text-gray-500">Check if social_accounts and social_platform_settings tables exist</p>
              </div>
              <div className="flex items-center">
                {testResults?.tablesExist ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Row Level Security</h3>
                <p className="text-sm text-gray-500">Check if RLS policies are working correctly</p>
              </div>
              <div className="flex items-center">
                {testResults?.policiesExist ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Helper Functions</h3>
                <p className="text-sm text-gray-500">Check if database functions are available</p>
              </div>
              <div className="flex items-center">
                {testResults?.functionsExist ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                )}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Insert Permissions</h3>
                <p className="text-sm text-gray-500">Check if you can insert new social accounts</p>
              </div>
              <div className="flex items-center">
                {testResults?.canInsert ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Query Permissions</h3>
                <p className="text-sm text-gray-500">Check if you can query social accounts</p>
              </div>
              <div className="flex items-center">
                {testResults?.canQuery ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Next Steps</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• If any tests failed, run the SQL schema in Supabase SQL Editor</li>
              <li>• Make sure you have at least one business created</li>
              <li>• Check that your user is authenticated</li>
              <li>• Try the social media connection features in your app</li>
            </ul>
          </div>

          <div className="mt-6 flex space-x-4">
            <button
              onClick={runTests}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
            >
              Run Tests Again
            </button>
            <a
              href="/dashboard/social"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Go to Social Media
            </a>
          </div>
        </div>
      </div>
    </div>
  )
} 