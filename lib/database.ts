import { supabase } from './supabase'
import type { User, Business, SocialAccount, ScheduledPost, BusinessModelCanvas, CustomerPersona } from './supabase'

// User operations
export async function createUser(userData: Partial<User>) {
  const { data, error } = await supabase
    .from('users')
    .insert([userData])
    .select()
    .single()
  
  return { data, error }
}

export async function getUserById(id: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single()
  
  return { data, error }
}

// Business operations
export async function createBusiness(businessData: Partial<Business>) {
  const { data, error } = await supabase
    .from('businesses')
    .insert([businessData])
    .select()
    .single()
  
  return { data, error }
}

export async function getBusinessesByUserId(userId: string) {
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('user_id', userId)
  
  return { data, error }
}

export async function getBusinessById(id: string) {
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('id', id)
    .single()
  
  return { data, error }
}

// Social Account operations
export async function createSocialAccount(socialAccountData: Partial<SocialAccount>) {
  const { data, error } = await supabase
    .from('social_accounts')
    .insert([socialAccountData])
    .select()
    .single()
  
  return { data, error }
}

export async function getSocialAccountsByBusinessId(businessId: string) {
  const { data, error } = await supabase
    .from('social_accounts')
    .select('*')
    .eq('business_id', businessId)
  
  return { data, error }
}

// Scheduled Post operations
export async function createScheduledPost(postData: Partial<ScheduledPost>) {
  const { data, error } = await supabase
    .from('scheduled_posts')
    .insert([postData])
    .select()
    .single()
  
  return { data, error }
}

export async function getScheduledPostsByBusinessId(businessId: string) {
  const { data, error } = await supabase
    .from('scheduled_posts')
    .select('*')
    .eq('business_id', businessId)
    .order('scheduled_time', { ascending: true })
  
  return { data, error }
}

// Business Model Canvas operations
export async function createBusinessModelCanvas(canvasData: Partial<BusinessModelCanvas>) {
  const { data, error } = await supabase
    .from('business_model_canvas')
    .insert([canvasData])
    .select()
    .single()
  
  return { data, error }
}

export async function getBusinessModelCanvasByBusinessId(businessId: string) {
  const { data, error } = await supabase
    .from('business_model_canvas')
    .select('*')
    .eq('business_id', businessId)
    .single()
  
  return { data, error }
}

// Customer Persona operations
export async function createCustomerPersona(personaData: Partial<CustomerPersona>) {
  const { data, error } = await supabase
    .from('customer_personas')
    .insert([personaData])
    .select()
    .single()
  
  return { data, error }
}

export async function getCustomerPersonasByBusinessId(businessId: string) {
  const { data, error } = await supabase
    .from('customer_personas')
    .select('*')
    .eq('business_id', businessId)
  
  return { data, error }
}

// Utility function to test database connection
export async function testDatabaseConnection() {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1)
    
    return { success: !error, error: error?.message }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
  }
} 