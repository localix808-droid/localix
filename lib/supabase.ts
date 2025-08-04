import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pntkmsnsbfuifgigjsum.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Check if we're in development and provide helpful error
if (process.env.NODE_ENV === 'development') {
  if (!supabaseAnonKey || supabaseAnonKey === 'your_supabase_anon_key_here') {
    console.error(`
🚨 SUPABASE ANON KEY MISSING 🚨

To fix this error:

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project: pntkmsnsbfuifgigjsum
3. Go to Settings > API
4. Copy the "anon public" key
5. Update your .env file:

NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key_here

Current .env file:
NEXT_PUBLIC_SUPABASE_URL=https://pntkmsnsbfuifgigjsum.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=${supabaseAnonKey || 'NOT SET'}

For now, the app will use a placeholder client that will show connection errors.
    `)
  }
}

// Create client with fallback for development
const clientAnonKey = supabaseAnonKey && supabaseAnonKey !== 'your_supabase_anon_key_here' 
  ? supabaseAnonKey 
  : 'placeholder-key-for-development'

export const supabase = createClient(supabaseUrl, clientAnonKey)

// Database types
export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface Business {
  id: string
  user_id: string
  name: string
  description?: string
  industry: string
  website?: string
  logo_url?: string
  subscription_plan: 'starter' | 'pro' | 'agency'
  created_at: string
  updated_at: string
}

export interface SocialAccount {
  id: string
  business_id: string
  platform: 'facebook' | 'twitter' | 'instagram' | 'linkedin'
  account_name: string
  account_id?: string
  access_token?: string
  refresh_token?: string
  token_expires_at?: string
  is_active: boolean
  permissions: Record<string, any>
  metadata: Record<string, any>
  last_sync_at?: string
  created_at: string
  updated_at: string
}

export interface PlatformSettings {
  id: string
  business_id: string
  platform: 'facebook' | 'twitter' | 'instagram' | 'linkedin'
  auto_post: boolean
  auto_sync: boolean
  sync_frequency_minutes: number
  post_frequency_hours: number
  engagement_alerts: boolean
  created_at: string
  updated_at: string
}

export interface ScheduledPost {
  id: string
  business_id: string
  social_account_id: string
  content: string
  media_urls?: string[]
  scheduled_time: string
  status: 'draft' | 'scheduled' | 'published' | 'failed'
  published_at?: string
  created_at: string
}

export interface BusinessModelCanvas {
  id: string
  business_id: string
  key_partners: string[]
  key_activities: string[]
  key_resources: string[]
  value_propositions: string[]
  customer_relationships: string[]
  channels: string[]
  customer_segments: string[]
  cost_structure: string[]
  revenue_streams: string[]
  created_at: string
  updated_at: string
}

export interface CustomerPersona {
  id: string
  business_id: string
  name: string
  age_range: string
  gender: string
  occupation: string
  income_level: string
  interests: string[]
  pain_points: string[]
  goals: string[]
  preferred_channels: string[]
  created_at: string
  updated_at: string
} 