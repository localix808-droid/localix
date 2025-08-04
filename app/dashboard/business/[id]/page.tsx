'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { supabase, Business, SocialAccount, ScheduledPost } from '@/lib/supabase'
import { 
  ArrowLeft,
  BarChart3,
  Calendar,
  Target,
  FileText,
  Settings,
  Plus,
  Users,
  TrendingUp,
  MessageSquare,
  Building2,
  Globe,
  Phone,
  Mail
} from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import AIPostGenerator from '@/components/AIPostGenerator'
import AIPersonaGenerator from '@/components/AIPersonaGenerator'
import AICanvasGenerator from '@/components/AICanvasGenerator'
import SocialMediaConnector from '@/components/SocialMediaConnector'

export default function BusinessDashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const businessId = params.id as string

  const [business, setBusiness] = useState<Business | null>(null)
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>([])
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([])
  const [activeTab, setActiveTab] = useState('overview')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user && businessId) {
      fetchBusinessData()
    }
  }, [user, businessId])

  const fetchBusinessData = async () => {
    try {
      // Fetch business details
      const { data: businessData, error: businessError } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', businessId)
        .eq('user_id', user?.id)
        .single()

      if (businessError) {
        throw businessError
      }

      setBusiness(businessData)

      // Fetch social accounts
      const { data: socialData, error: socialError } = await supabase
        .from('social_accounts')
        .select('*')
        .eq('business_id', businessId)

      if (!socialError) {
        setSocialAccounts(socialData || [])
      }

      // Fetch scheduled posts
      const { data: postsData, error: postsError } = await supabase
        .from('scheduled_posts')
        .select('*')
        .eq('business_id', businessId)
        .order('scheduled_time', { ascending: true })

      if (!postsError) {
        setScheduledPosts(postsData || [])
      }

    } catch (error) {
      console.error('Error fetching business data:', error)
      toast.error('Failed to load business data')
      router.push('/dashboard')
    } finally {
      setIsLoading(false)
    }
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Business not found</h2>
          <Link
            href="/dashboard"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'social', name: 'Social Media', icon: MessageSquare },
    { id: 'canvas', name: 'Business Model', icon: FileText },
    { id: 'personas', name: 'Customer Personas', icon: Target },
    { id: 'analytics', name: 'Analytics', icon: TrendingUp },
    { id: 'settings', name: 'Settings', icon: Settings },
  ]

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
                <h1 className="text-xl font-semibold text-gray-900">{business.name}</h1>
                <p className="text-sm text-gray-500">{business.industry}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                business.subscription_plan === 'starter' 
                  ? 'bg-green-100 text-green-800'
                  : business.subscription_plan === 'pro'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {business.subscription_plan.charAt(0).toUpperCase() + business.subscription_plan.slice(1)} Plan
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Business Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Business Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Business Name</h3>
                  <p className="text-gray-900">{business.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Industry</h3>
                  <p className="text-gray-900">{business.industry}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
                  <p className="text-gray-900">{business.description || 'No description available'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Website</h3>
                  <p className="text-gray-900">{business.website || 'No website available'}</p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <MessageSquare className="w-6 h-6 text-primary" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Social Accounts</p>
                    <p className="text-2xl font-bold text-gray-900">{socialAccounts.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Calendar className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Scheduled Posts</p>
                    <p className="text-2xl font-bold text-gray-900">{scheduledPosts.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Users className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Reach</p>
                    <p className="text-2xl font-bold text-gray-900">0</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Engagement Rate</p>
                    <p className="text-2xl font-bold text-gray-900">0%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {scheduledPosts.slice(0, 5).map((post) => (
                  <div key={post.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        Post scheduled for {new Date(post.scheduled_time).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-500 truncate">{post.content}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      post.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                      post.status === 'published' ? 'bg-green-100 text-green-800' :
                      post.status === 'failed' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {post.status}
                    </span>
                  </div>
                ))}
                {scheduledPosts.length === 0 && (
                  <p className="text-gray-500 text-center py-8">No recent activity</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'social' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Social Media Management</h2>
            </div>
            
            {/* Social Media Connector */}
            <SocialMediaConnector
              businessId={businessId}
              onAccountConnected={(account) => {
                setSocialAccounts(prev => [...prev, account])
                toast.success('Account connected successfully!')
              }}
              onAccountDisconnected={(accountId) => {
                setSocialAccounts(prev => prev.filter(acc => acc.id !== accountId))
                toast.success('Account disconnected successfully!')
              }}
            />

            {/* AI Post Generator */}
            <div className="mt-8">
              <AIPostGenerator
                businessName={business.name}
                industry={business.industry}
                description={business.description}
                onPostGenerated={(posts) => {
                  console.log('Generated posts:', posts)
                  // Here you could save the generated posts to the database
                }}
              />
            </div>
          </div>
        )}

        {activeTab === 'canvas' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Business Model Canvas</h2>
            </div>
            
            <AICanvasGenerator
              businessName={business.name}
              industry={business.industry}
              description={business.description}
              onCanvasGenerated={(canvas) => {
                console.log('Generated canvas:', canvas)
                // Here you could save the generated canvas to the database
              }}
            />
          </div>
        )}

        {activeTab === 'personas' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Customer Personas</h2>
            </div>
            
            <AIPersonaGenerator
              businessName={business.name}
              industry={business.industry}
              description={business.description}
              onPersonasGenerated={(personas) => {
                console.log('Generated personas:', personas)
                // Here you could save the generated personas to the database
              }}
            />
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-gray-900">Analytics & Insights</h2>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <p className="text-gray-500 text-center py-8">
                Advanced analytics and growth reports coming soon. This will provide detailed insights into your business performance.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-gray-900">Business Settings</h2>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-4">Business Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                      <input
                        type="text"
                        defaultValue={business.name}
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                      <input
                        type="text"
                        defaultValue={business.industry}
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                      <input
                        type="url"
                        defaultValue={business.website || ''}
                        className="input"
                        placeholder="https://example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        defaultValue={business.description || ''}
                        rows={3}
                        className="input"
                        placeholder="Describe your business..."
                      />
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 