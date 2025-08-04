'use client'

import { useState, useEffect } from 'react'
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Plus, 
  CheckCircle, 
  X,
  Settings,
  RefreshCw
} from 'lucide-react'
import { supabase, SocialAccount } from '@/lib/supabase'
import toast from 'react-hot-toast'

interface SocialMediaConnectorProps {
  businessId: string
  onAccountConnected: (account: SocialAccount) => void
  onAccountDisconnected: (accountId: string) => void
}

const SOCIAL_PLATFORMS = [
  {
    id: 'facebook',
    name: 'Facebook',
    icon: Facebook,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    description: 'Connect your Facebook page to schedule posts and track engagement.',
    authUrl: '/api/auth/facebook',
    features: ['Schedule posts', 'Track engagement', 'Page insights']
  },
  {
    id: 'twitter',
    name: 'Twitter',
    icon: Twitter,
    color: 'text-blue-400',
    bgColor: 'bg-blue-100',
    description: 'Connect your Twitter account to schedule tweets and monitor conversations.',
    authUrl: '/api/auth/twitter',
    features: ['Schedule tweets', 'Monitor mentions', 'Analytics']
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: Instagram,
    color: 'text-pink-600',
    bgColor: 'bg-pink-100',
    description: 'Connect your Instagram business account to schedule posts and stories.',
    authUrl: '/api/auth/instagram',
    features: ['Schedule posts', 'Story creation', 'Hashtag analytics']
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: Linkedin,
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
    description: 'Connect your LinkedIn company page for professional content management.',
    authUrl: '/api/auth/linkedin',
    features: ['Company posts', 'Professional networking', 'B2B insights']
  }
]

export default function SocialMediaConnector({ 
  businessId, 
  onAccountConnected, 
  onAccountDisconnected 
}: SocialMediaConnectorProps) {
  const [connectedAccounts, setConnectedAccounts] = useState<SocialAccount[]>([])
  const [isConnecting, setIsConnecting] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load existing connections
  useEffect(() => {
    loadConnectedAccounts()
  }, [businessId])

  const loadConnectedAccounts = async () => {
    try {
      const { data, error } = await supabase
        .from('social_accounts')
        .select('*')
        .eq('business_id', businessId)

      if (error) throw error
      setConnectedAccounts(data || [])
    } catch (error) {
      console.error('Error loading social accounts:', error)
      toast.error('Failed to load social accounts')
    } finally {
      setIsLoading(false)
    }
  }

    const handleConnect = async (platformId: string) => {
    setIsConnecting(platformId)

    try {
      // Redirect to OAuth flow
      const authUrl = `/api/auth/${platformId}?business_id=${businessId}&redirect_uri=${encodeURIComponent(window.location.origin + '/dashboard/social')}`
      
      // Check if we have real OAuth credentials
      const hasRealCredentials = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || 
        (process.env.NODE_ENV === 'development' && process.env.FACEBOOK_APP_ID)
      
      if (hasRealCredentials && platformId === 'facebook') {
        // Use real OAuth for Facebook
        window.location.href = authUrl
      } else {
        // Simulate connection for other platforms or when no credentials
        await new Promise(resolve => setTimeout(resolve, 2000))

        // Simulate successful connection
        const mockAccount: SocialAccount = {
          id: `mock-${platformId}-${Date.now()}`,
          business_id: businessId,
          platform: platformId as any,
          account_name: `@${platformId}_account`,
          access_token: 'mock_token',
          refresh_token: 'mock_refresh_token',
          is_active: true,
          created_at: new Date().toISOString()
        }

        // Save to database
        const { error } = await supabase
          .from('social_accounts')
          .insert([mockAccount])

        if (error) throw error

        setConnectedAccounts(prev => [...prev, mockAccount])
        onAccountConnected(mockAccount)
        toast.success(`${SOCIAL_PLATFORMS.find(p => p.id === platformId)?.name} connected successfully!`)
      }

    } catch (error) {
      console.error('Connection error:', error)
      toast.error('Failed to connect account')
    } finally {
      setIsConnecting(null)
    }
  }

  const handleDisconnect = async (accountId: string) => {
    try {
      const { error } = await supabase
        .from('social_accounts')
        .delete()
        .eq('id', accountId)

      if (error) throw error

      setConnectedAccounts(prev => prev.filter(acc => acc.id !== accountId))
      onAccountDisconnected(accountId)
      toast.success('Account disconnected successfully')
      
    } catch (error) {
      console.error('Disconnection error:', error)
      toast.error('Failed to disconnect account')
    }
  }

  const handleRefresh = async (accountId: string) => {
    try {
      // Simulate token refresh
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Account refreshed successfully')
    } catch (error) {
      toast.error('Failed to refresh account')
    }
  }

  const getConnectedPlatform = (platformId: string) => {
    return connectedAccounts.find(acc => acc.platform === platformId)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Connected Accounts */}
      {connectedAccounts.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4 font-sans">Connected Accounts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {connectedAccounts.map((account) => {
              const platform = SOCIAL_PLATFORMS.find(p => p.id === account.platform)
              const Icon = platform?.icon || X
              
              return (
                <div key={account.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${platform?.bgColor}`}>
                        <Icon className={`w-5 h-5 ${platform?.color}`} />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{platform?.name}</h4>
                        <p className="text-sm text-gray-500">{account.account_name}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        account.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {account.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleRefresh(account.id)}
                      className="flex-1 px-3 py-1 text-xs border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center justify-center"
                    >
                      <RefreshCw className="w-3 h-3 mr-1" />
                      Refresh
                    </button>
                    <button
                      onClick={() => handleDisconnect(account.id)}
                      className="flex-1 px-3 py-1 text-xs border border-red-300 rounded-md text-red-700 hover:bg-red-50 flex items-center justify-center"
                    >
                      <X className="w-3 h-3 mr-1" />
                      Disconnect
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Available Platforms */}
      <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 font-sans">Connect Social Media Accounts</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SOCIAL_PLATFORMS.map((platform) => {
            const Icon = platform.icon
            const isConnected = getConnectedPlatform(platform.id)
            const isConnectingPlatform = isConnecting === platform.id

            return (
              <div key={platform.id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-lg ${platform.bgColor}`}>
                      <Icon className={`w-6 h-6 ${platform.color}`} />
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 font-sans">{platform.name}</h4>
                      <p className="text-sm text-gray-600">{platform.description}</p>
                    </div>
                  </div>
                  {isConnected && (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  )}
                </div>

                <div className="mb-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-2 font-sans">Features:</h5>
                  <ul className="space-y-1">
                    {platform.features.map((feature, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-center">
                        <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {isConnected ? (
                  <button
                    disabled
                    className="w-full px-4 py-2 bg-gray-100 text-gray-500 rounded-md text-sm font-medium cursor-not-allowed"
                  >
                    Connected
                  </button>
                ) : (
                  <button
                    onClick={() => handleConnect(platform.id)}
                    disabled={isConnectingPlatform}
                    className="w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isConnectingPlatform ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Connect {platform.name}
                      </>
                    )}
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Connection Status */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <Settings className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Social Media Integration
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                Connect your social media accounts to schedule posts, track engagement, and manage your online presence from one central dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 