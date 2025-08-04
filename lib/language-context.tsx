'use client'

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'

type Language = 'en' | 'ar'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  isLoading: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations = {
  en: {
    // Dashboard
    'welcome.back': 'Welcome back',
    'business.owner': 'Business Owner',
    'dashboard.description': 'Manage your businesses and track their performance from one central dashboard.',
    'total.businesses': 'Total Businesses',
    'active.customers': 'Active Customers',
    'growth.rate': 'Growth Rate',
    'scheduled.posts': 'Scheduled Posts',
    'your.businesses': 'Your Businesses',
    'add.business': 'Add Business',
    'free.plan.limit': 'Free plan limit reached',
    'upgrade.plan': 'Upgrade Plan',
    'no.businesses': 'No businesses yet',
    'get.started': 'Get started by creating your first business.',
    'create.business': 'Create Business',
    'free.plan.limit.message': 'You\'ve reached the free plan limit of 1 business',
    'upgrade.to.create': 'Upgrade to Create More',
    'analytics': 'Analytics',
    'view.insights': 'View detailed business insights',
    'social.media': 'Social Media',
    'manage.posts': 'Manage your social media posts',
    'settings': 'Settings',
    'account.settings': 'Manage your account settings',
    'sign.out': 'Sign out',
    'signed.out': 'Signed out successfully',
    'failed.sign.out': 'Failed to sign out',
    'failed.load.businesses': 'Failed to load businesses',
    'created': 'Created',
    'no.description': 'No description available',
    'starter': 'Starter',
    'pro': 'Pro',
    'enterprise': 'Enterprise',
    // Settings
    'language': 'Language',
    'english': 'English',
    'arabic': 'Arabic',
    'save.settings': 'Save Settings',
    'settings.saved': 'Settings saved successfully',
    'failed.save.settings': 'Failed to save settings',
  },
  ar: {
    // Dashboard
    'welcome.back': 'مرحباً بعودتك',
    'business.owner': 'صاحب العمل',
    'dashboard.description': 'إدارة أعمالك وتتبع أدائها من لوحة تحكم مركزية واحدة.',
    'total.businesses': 'إجمالي الأعمال',
    'active.customers': 'العملاء النشطون',
    'growth.rate': 'معدل النمو',
    'scheduled.posts': 'المنشورات المجدولة',
    'your.businesses': 'أعمالك',
    'add.business': 'إضافة عمل',
    'free.plan.limit': 'تم الوصول إلى حد الخطة المجانية',
    'upgrade.plan': 'ترقية الخطة',
    'no.businesses': 'لا توجد أعمال بعد',
    'get.started': 'ابدأ بإنشاء عملك الأول.',
    'create.business': 'إنشاء عمل',
    'free.plan.limit.message': 'لقد وصلت إلى حد الخطة المجانية وهو عمل واحد',
    'upgrade.to.create': 'ترقية لإنشاء المزيد',
    'analytics': 'التحليلات',
    'view.insights': 'عرض رؤى الأعمال التفصيلية',
    'social.media': 'وسائل التواصل الاجتماعي',
    'manage.posts': 'إدارة منشورات وسائل التواصل الاجتماعي',
    'settings': 'الإعدادات',
    'account.settings': 'إدارة إعدادات حسابك',
    'sign.out': 'تسجيل الخروج',
    'signed.out': 'تم تسجيل الخروج بنجاح',
    'failed.sign.out': 'فشل في تسجيل الخروج',
    'failed.load.businesses': 'فشل في تحميل الأعمال',
    'created': 'تم الإنشاء',
    'no.description': 'لا يوجد وصف متاح',
    'starter': 'مبتدئ',
    'pro': 'احترافي',
    'enterprise': 'مؤسسة',
    // Settings
    'language': 'اللغة',
    'english': 'الإنجليزية',
    'arabic': 'العربية',
    'save.settings': 'حفظ الإعدادات',
    'settings.saved': 'تم حفظ الإعدادات بنجاح',
    'failed.save.settings': 'فشل في حفظ الإعدادات',
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [language, setLanguageState] = useState<Language>('en')
  const [isLoading, setIsLoading] = useState(true)

  // Load language preference from database
  useEffect(() => {
    const loadLanguagePreference = async () => {
      if (!user) {
        setIsLoading(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from('users')
          .select('language_preference')
          .eq('id', user.id)
          .single()

        if (error) {
          console.error('Error loading language preference:', error)
        } else if (data?.language_preference) {
          setLanguageState(data.language_preference as Language)
        }
      } catch (error) {
        console.error('Error loading language preference:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadLanguagePreference()
  }, [user])

  // Save language preference to database
  const setLanguage = async (lang: Language) => {
    setLanguageState(lang)
    
    if (!user) return

    try {
      const { error } = await supabase
        .from('users')
        .update({ language_preference: lang })
        .eq('id', user.id)

      if (error) {
        console.error('Error saving language preference:', error)
      }
    } catch (error) {
      console.error('Error saving language preference:', error)
    }
  }

  const t = (key: string): string => {
    return translations[language][key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isLoading }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
} 