'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { useLanguage } from '@/lib/language-context'
import { supabase, Business } from '@/lib/supabase'
import { 
  Plus, 
  Building2, 
  Users, 
  TrendingUp, 
  Calendar,
  BarChart3,
  Settings,
  LogOut,
  User,
  Bell
} from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import RTLWrapper from '@/components/RTLWrapper'

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth()
  const { t, language, isLoading: languageLoading } = useLanguage()
  const router = useRouter()
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      fetchBusinesses()
    }
  }, [user])

  const fetchBusinesses = async () => {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      setBusinesses(data || [])
    } catch (error) {
      console.error('Error fetching businesses:', error)
      toast.error(t('failed.load.businesses'))
    } finally {
      setIsLoading(false)
    }
  }

  const canCreateBusiness = () => {
    // Free plan users can only create one business
    const hasStarterPlan = businesses.some(business => business.subscription_plan === 'starter')
    const hasOtherPlans = businesses.some(business => business.subscription_plan !== 'starter')
    
    if (hasStarterPlan && businesses.length >= 1) {
      return false
    }
    
    return true
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/')
      toast.success(t('signed.out'))
    } catch (error) {
      console.error('Sign out error:', error)
      toast.error(t('failed.sign.out'))
    }
  }

  if (loading || languageLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <RTLWrapper>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl font-bold text-primary font-sans">Localix</h1>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <LanguageSwitcher />
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <Bell className="w-5 h-5" />
                </button>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {user.email}
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="p-2 text-gray-400 hover:text-gray-600"
                  title={t('sign.out')}
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {t('welcome.back')}, {user.user_metadata?.full_name || t('business.owner')}!
            </h2>
            <p className="text-gray-600">
              {t('dashboard.description')}
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{t('total.businesses')}</p>
                  <p className="text-2xl font-bold text-gray-900">{businesses.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{t('active.customers')}</p>
                  <p className="text-2xl font-bold text-gray-900">0</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{t('growth.rate')}</p>
                  <p className="text-2xl font-bold text-gray-900">0%</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{t('scheduled.posts')}</p>
                  <p className="text-2xl font-bold text-gray-900">0</p>
                </div>
              </div>
            </div>
          </div>

          {/* Businesses Section */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">{t('your.businesses')}</h3>
                {canCreateBusiness() ? (
                  <Link
                    href="/dashboard/business/new"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {t('add.business')}
                  </Link>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">{t('free.plan.limit')}</span>
                    <Link
                      href="#pricing"
                      className="inline-flex items-center px-4 py-2 border border-primary text-sm font-medium rounded-md text-primary hover:bg-primary hover:text-white"
                    >
                      {t('upgrade.plan')}
                    </Link>
                  </div>
                )}
              </div>
            </div>
            <div className="p-6">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : businesses.length === 0 ? (
                <div className="text-center py-12">
                  <Building2 className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">{t('no.businesses')}</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {t('get.started')}
                  </p>
                  <div className="mt-6">
                    {canCreateBusiness() ? (
                      <Link
                        href="/dashboard/business/new"
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        {t('create.business')}
                      </Link>
                    ) : (
                      <div className="text-center">
                        <p className="text-sm text-gray-500 mb-4">{t('free.plan.limit.message')}</p>
                        <Link
                          href="#pricing"
                          className="inline-flex items-center px-4 py-2 border border-primary text-sm font-medium rounded-md text-primary hover:bg-primary hover:text-white"
                        >
                          {t('upgrade.to.create')}
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {businesses.map((business) => (
                    <Link
                      key={business.id}
                      href={`/dashboard/business/${business.id}`}
                      className="block group"
                    >
                      <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-medium text-gray-900 group-hover:text-primary">
                            {business.name}
                          </h4>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            business.subscription_plan === 'starter' 
                              ? 'bg-green-100 text-green-800'
                              : business.subscription_plan === 'pro'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {t(business.subscription_plan)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                          {business.description || t('no.description')}
                        </p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>{business.industry}</span>
                          <span>{t('created')} {new Date(business.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/dashboard/analytics"
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">{t('analytics')}</h3>
                  <p className="text-sm text-gray-600">{t('view.insights')}</p>
                </div>
              </div>
            </Link>
            <Link
              href="/dashboard/social"
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">{t('social.media')}</h3>
                  <p className="text-sm text-gray-600">{t('manage.posts')}</p>
                </div>
              </div>
            </Link>
            <Link
              href="/dashboard/settings"
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Settings className="w-6 h-6 text-gray-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">{t('settings')}</h3>
                  <p className="text-sm text-gray-600">{t('account.settings')}</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </RTLWrapper>
  )
} 