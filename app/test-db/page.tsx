'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function TestDB() {
  const [status, setStatus] = useState<string>('Testing connection...')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function testConnection() {
      try {
        // Test basic connection
        const { data, error } = await supabase
          .from('users')
          .select('count')
          .limit(1)

        if (error) {
          if (error.message.includes('JWT')) {
            setError(`Authentication error: ${error.message}. Please check your anon key.`)
          } else if (error.message.includes('relation') || error.message.includes('does not exist')) {
            setError(`Table not found: ${error.message}. Please run the database schema first.`)
          } else {
            setError(`Connection error: ${error.message}`)
          }
          setStatus('Connection failed')
        } else {
          setStatus('Database connection successful!')
        }
      } catch (err) {
        setError(`Unexpected error: ${err}`)
        setStatus('Connection failed')
      }
    }

    testConnection()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">Database Connection Test</h1>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600">Status:</p>
            <p className={`font-medium ${status.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>
              {status}
            </p>
          </div>

          {error && (
            <div>
              <p className="text-sm text-gray-600">Error:</p>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="mt-6 p-4 bg-gray-50 rounded">
            <p className="text-sm text-gray-600">Connection Details:</p>
            <p className="text-xs text-gray-500 mt-1">
              URL: {process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not set'}
            </p>
            <p className="text-xs text-gray-500">
              Anon Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 
                (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === 'your_supabase_anon_key_here' ? 
                  'Placeholder (needs real key)' : 'Set') : 'Not set'}
            </p>
            
            {(!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
              process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === 'your_supabase_anon_key_here') && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-sm text-yellow-800 font-medium">Setup Required:</p>
                <ol className="text-xs text-yellow-700 mt-1 list-decimal list-inside space-y-1">
                  <li>Go to your Supabase dashboard</li>
                  <li>Navigate to Settings → API</li>
                  <li>Copy the "anon public" key</li>
                  <li>Update the .env file with the real key</li>
                </ol>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 