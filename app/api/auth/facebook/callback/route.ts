import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Facebook OAuth Configuration
const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID || '2338272063236406'
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET || '0979fb532f980809d0b1cbd52988815f'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')
  
  if (error) {
    console.error('Facebook OAuth error:', error)
    return NextResponse.redirect(new URL('/dashboard/social?error=oauth_denied', request.url))
  }
  
  if (!code) {
    return NextResponse.redirect(new URL('/dashboard/social?error=no_code', request.url))
  }
  
  try {
    // Decode state parameter
    const stateData = JSON.parse(Buffer.from(state || '', 'base64').toString())
    const { business_id, redirect_uri } = stateData
    
    // Exchange code for access token
    const tokenResponse = await fetch('https://graph.facebook.com/v18.0/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: FACEBOOK_APP_ID,
        client_secret: FACEBOOK_APP_SECRET,
        code,
        redirect_uri: process.env.NODE_ENV === 'development' 
          ? 'http://localhost:3000/api/auth/facebook/callback'
          : 'https://yourdomain.com/api/auth/facebook/callback',
      }),
    })
    
    const tokenData = await tokenResponse.json()
    
    if (tokenData.error) {
      throw new Error(tokenData.error.message)
    }
    
    // Get user's Facebook profile
    const profileResponse = await fetch(`https://graph.facebook.com/v18.0/me?access_token=${tokenData.access_token}&fields=id,name,email`)
    const profileData = await profileResponse.json()
    
    // Get user's Facebook pages
    const pagesResponse = await fetch(`https://graph.facebook.com/v18.0/me/accounts?access_token=${tokenData.access_token}`)
    const pagesData = await pagesResponse.json()
    
    // Save the connection to database
    if (business_id) {
      const socialAccount = {
        business_id,
        platform: 'facebook' as const,
        account_name: profileData.name || 'Facebook Account',
        account_id: profileData.id,
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token || null,
        token_expires_at: tokenData.expires_in ? new Date(Date.now() + tokenData.expires_in * 1000).toISOString() : null,
        is_active: true,
        permissions: {
          pages: pagesData.data || [],
          scope: tokenData.scope || ''
        },
        metadata: {
          profile: profileData,
          pages: pagesData.data || []
        }
      }
      
      const { error: insertError } = await supabase
        .from('social_accounts')
        .insert([socialAccount])
      
      if (insertError) {
        console.error('Database insert error:', insertError)
        throw new Error('Failed to save account to database')
      }
    }
    
    // Redirect back to the social media page
    const successUrl = new URL(redirect_uri || '/dashboard/social', request.url)
    successUrl.searchParams.set('success', 'facebook_connected')
    successUrl.searchParams.set('business_id', business_id || '')
    
    return NextResponse.redirect(successUrl)
    
  } catch (error) {
    console.error('Facebook OAuth callback error:', error)
    return NextResponse.redirect(new URL('/dashboard/social?error=oauth_failed', request.url))
  }
} 