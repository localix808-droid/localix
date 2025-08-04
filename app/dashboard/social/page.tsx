'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { supabase, Business, SocialAccount } from '@/lib/supabase'
import { 
  ArrowLeft,
  Plus,
  MessageSquare,
  BarChart3,
  Calendar,
  Settings,
  RefreshCw,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import SocialMediaConnector from '@/components/SocialMediaConnector'

export default function SocialMediaPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>([])
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      fetchData()
    }
  }, [user])

  const fetchData = async () => {
    try {
      // Fetch user's businesses
      const { data: businessesData, error: businessesError } = await supabase
        .from('businesses')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      if (businessesError) throw businessesError
      setBusinesses(businessesData || [])

      // Fetch all social accounts
      const { data: socialData, error: socialError } = await supabase
        .from('social_accounts')
        .select('*')
        .in('business_id', businessesData?.map(b => b.id) || [])

      if (!socialError) {
        setSocialAccounts(socialData || [])
      }

      // Set first business as selected if available
      if (businessesData && businessesData.length > 0) {
        setSelectedBusiness(businessesData[0])
      }

    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to load data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAccountConnected = (account: SocialAccount) => {
    setSocialAccounts(prev => [...prev, account])
    toast.success('Account connected successfully!')
  }

  const handleAccountDisconnected = (accountId: string) => {
    setSocialAccounts(prev => prev.filter(acc => acc.id !== accountId))
    toast.success('Account disconnected successfully!')
  }

  const getSocialAccountsForBusiness = (businessId: string) => {
    return socialAccounts.filter(acc => acc.business_id === businessId)
  }

  const getPlatformStats = () => {
    const stats = {
      total: socialAccounts.length,
      active: socialAccounts.filter(acc => acc.is_active).length,
      facebook: socialAccounts.filter(acc => acc.platform === 'facebook').length,
      twitter: socialAccounts.filter(acc => acc.platform === 'twitter').length,
      instagram: socialAccounts.filter(acc => acc.platform === 'instagram').length,
      linkedin: socialAccounts.filter(acc => acc.platform === 'linkedin').length,
    }
    return stats
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  const stats = getPlatformStats()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Social Media Management</h1>
                <p className="text-sm text-gray-500">Manage your social media accounts and posts</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard/social/schedule"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Posts
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <MessageSquare className="w-6 h-6 text-primary" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Accounts</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Accounts</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <BarChart3 className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Platforms</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {[stats.facebook, stats.twitter, stats.instagram, stats.linkedin].filter(Boolean).length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Calendar className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Scheduled Posts</p>
                    <p className="text-2xl font-bold text-gray-900">0</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Selector */}
            {businesses.length > 1 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Select Business</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {businesses.map((business) => (
                    <button
                      key={business.id}
                      onClick={() => setSelectedBusiness(business)}
                      className={`p-4 border rounded-lg text-left transition-colors ${
                        selectedBusiness?.id === business.id
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <h4 className="font-medium text-gray-900">{business.name}</h4>
                      <p className="text-sm text-gray-500">{business.industry}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {getSocialAccountsForBusiness(business.id).length} connected accounts
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Connected Accounts Overview */}
            {socialAccounts.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">All Connected Accounts</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {socialAccounts.map((account) => {
                    const business = businesses.find(b => b.id === account.business_id)
                    const platformColors = {
                      facebook: 'text-blue-600 bg-blue-100',
                      twitter: 'text-blue-400 bg-blue-100',
                      instagram: 'text-pink-600 bg-pink-100',
                      linkedin: 'text-blue-700 bg-blue-100'
                    }
                    
                    return (
                      <div key={account.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${platformColors[account.platform] || 'bg-gray-100'}`}>
                              <MessageSquare className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 capitalize">{account.platform}</h4>
                              <p className="text-sm text-gray-500">{account.account_name}</p>
                              {business && (
                                <p className="text-xs text-gray-400">{business.name}</p>
                              )}
                            </div>
                          </div>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            account.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {account.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          <button className="flex-1 px-3 py-1 text-xs border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center justify-center">
                            <RefreshCw className="w-3 h-3 mr-1" />
                            Refresh
                          </button>
                          <button className="flex-1 px-3 py-1 text-xs border border-red-300 rounded-md text-red-700 hover:bg-red-50 flex items-center justify-center">
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

            {/* Platform Distribution */}
            {socialAccounts.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Platform Distribution</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{stats.facebook}</div>
                    <div className="text-sm text-blue-600">Facebook</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-400">{stats.twitter}</div>
                    <div className="text-sm text-blue-400">Twitter</div>
                  </div>
                  <div className="text-center p-4 bg-pink-50 rounded-lg">
                    <div className="text-2xl font-bold text-pink-600">{stats.instagram}</div>
                    <div className="text-sm text-pink-600">Instagram</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-700">{stats.linkedin}</div>
                    <div className="text-sm text-blue-700">LinkedIn</div>
                  </div>
                </div>
              </div>
            )}

            {/* Connection Interface */}
            {selectedBusiness ? (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      Connect Accounts for {selectedBusiness.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Manage social media connections for this business
                    </p>
                  </div>
                </div>
                <SocialMediaConnector
                  businessId={selectedBusiness.id}
                  onAccountConnected={handleAccountConnected}
                  onAccountDisconnected={handleAccountDisconnected}
                />
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No business selected</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Please select a business to manage social media connections.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
} 