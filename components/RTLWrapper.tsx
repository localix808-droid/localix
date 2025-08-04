'use client'

import { useLanguage } from '@/lib/language-context'
import { ReactNode } from 'react'

interface RTLWrapperProps {
  children: ReactNode
}

export default function RTLWrapper({ children }: RTLWrapperProps) {
  const { language } = useLanguage()
  
  return (
    <div dir={language === 'ar' ? 'rtl' : 'ltr'} className={language === 'ar' ? 'rtl' : 'ltr'}>
      {children}
    </div>
  )
} 