'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { useLanguage } from '@/lib/language-context'
import { supabase } from '@/lib/supabase'
import { 
  ArrowLeft,
  User,
  Globe,
  Save,
  Bell,
  Shield,
  CreditCard
} from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import RTLWrapper from '@/components/RTLWrapper'

export default function SettingsPage() {
  const { user, loading, signOut } = useAuth()
  const { t, language, setLanguage, isLoading } = useLanguage()
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin')
    }
  }, [user, loading, router])

  const handleLanguageChange = async (newLanguage: 'en' | 'ar') => {
    setIsSaving(true)
    try {
      await setLanguage(newLanguage)
      toast.success(t('settings.saved'))
    } catch (error) {
      console.error('Error saving language:', error)
      toast.error(t('failed.save.settings'))
    } finally {
      setIsSaving(false)
    }
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

  if (loading || !user) {
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
                <Link
                  href="/dashboard"
                  className="p-2 text-gray-400 hover:text-gray-600 mr-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-2xl font-bold text-primary font-sans">Localix</h1>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {user.email}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {t('settings')}
            </h2>
            <p className="text-gray-600">
              {t('account.settings')}
            </p>
          </div>

          {/* Settings Sections */}
          <div className="space-y-6">
            {/* Language Settings */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center">
                  <Globe className="w-5 h-5 text-primary mr-3" />
                  <h3 className="text-lg font-medium text-gray-900">
                    {t('language')}
                  </h3>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {t('language')}
                      </p>
                      <p className="text-sm text-gray-500">
                        Choose your preferred language for the application
                      </p>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleLanguageChange('en')}
                        disabled={isSaving || isLoading}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                          language === 'en'
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {t('english')}
                      </button>
                      <button
                        onClick={() => handleLanguageChange('ar')}
                        disabled={isSaving || isLoading}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                          language === 'ar'
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {t('arabic')}
                      </button>
                    </div>
                  </div>
                  {isSaving && (
                    <div className="flex items-center text-sm text-gray-500">
                      <Save className="w-4 h-4 mr-2 animate-spin" />
                      {t('save.settings')}...
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Account Settings */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center">
                  <User className="w-5 h-5 text-primary mr-3" />
                  <h3 className="text-lg font-medium text-gray-900">
                    Account
                  </h3>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Email
                      </p>
                      <p className="text-sm text-gray-500">
                        {user.email}
                      </p>
                    </div>
                    <span className="text-sm text-gray-500">
                      Connected
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Full Name
                      </p>
                      <p className="text-sm text-gray-500">
                        {user.user_metadata?.full_name || 'Not set'}
                      </p>
                    </div>
                    <button className="text-sm text-primary hover:text-primary/80">
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center">
                  <Bell className="w-5 h-5 text-primary mr-3" />
                  <h3 className="text-lg font-medium text-gray-900">
                    Notifications
                  </h3>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Email Notifications
                      </p>
                      <p className="text-sm text-gray-500">
                        Receive email updates about your businesses
                      </p>
                    </div>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white transition"></span>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Push Notifications
                      </p>
                      <p className="text-sm text-gray-500">
                        Receive push notifications in your browser
                      </p>
                    </div>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-5"></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Settings */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center">
                  <Shield className="w-5 h-5 text-primary mr-3" />
                  <h3 className="text-lg font-medium text-gray-900">
                    Security
                  </h3>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Change Password
                      </p>
                      <p className="text-sm text-gray-500">
                        Update your account password
                      </p>
                    </div>
                    <button className="text-sm text-primary hover:text-primary/80">
                      Change
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Two-Factor Authentication
                      </p>
                      <p className="text-sm text-gray-500">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <button className="text-sm text-primary hover:text-primary/80">
                      Enable
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Billing Settings */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center">
                  <CreditCard className="w-5 h-5 text-primary mr-3" />
                  <h3 className="text-lg font-medium text-gray-900">
                    Billing
                  </h3>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Current Plan
                      </p>
                      <p className="text-sm text-gray-500">
                        Free Plan
                      </p>
                    </div>
                    <button className="text-sm text-primary hover:text-primary/80">
                      Upgrade
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Payment Method
                      </p>
                      <p className="text-sm text-gray-500">
                        No payment method added
                      </p>
                    </div>
                    <button className="text-sm text-primary hover:text-primary/80">
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-lg shadow-sm border border-red-200">
              <div className="px-6 py-4 border-b border-red-200 bg-red-50">
                <h3 className="text-lg font-medium text-red-900">
                  Danger Zone
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Sign Out
                      </p>
                      <p className="text-sm text-gray-500">
                        Sign out of your account
                      </p>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="px-4 py-2 text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 rounded-md transition-colors"
                    >
                      {t('sign.out')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RTLWrapper>
  )
} 