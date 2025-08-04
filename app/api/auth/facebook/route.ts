import { NextRequest, NextResponse } from 'next/server'

// Facebook OAuth Configuration
const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID || '2338272063236406'
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET || '0979fb532f980809d0b1cbd52988815f'
const REDIRECT_URI = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3000/api/auth/facebook/callback'
  : 'https://yourdomain.com/api/auth/facebook/callback'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const business_id = searchParams.get('business_id')
  const redirect_uri = searchParams.get('redirect_uri')
  
  // Generate state parameter for security
  const state = Buffer.from(JSON.stringify({ business_id, redirect_uri })).toString('base64')
  
  // Facebook OAuth URL
  const facebookAuthUrl = `https://www.facebook.com/v18.0/dialog/oauth?` +
    `client_id=${FACEBOOK_APP_ID}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&state=${encodeURIComponent(state)}` +
    `&scope=pages_manage_posts,pages_read_engagement,pages_show_list`
  
  // Redirect to Facebook OAuth
  return NextResponse.redirect(facebookAuthUrl)
}

export async function POST(request: NextRequest) {
  // Handle OAuth callback
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  
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
        redirect_uri: REDIRECT_URI,
      }),
    })
    
    const tokenData = await tokenResponse.json()
    
    if (tokenData.error) {
      throw new Error(tokenData.error.message)
    }
    
    // Get user's Facebook pages
    const pagesResponse = await fetch(`https://graph.facebook.com/v18.0/me/accounts?access_token=${tokenData.access_token}`)
    const pagesData = await pagesResponse.json()
    
    // For now, we'll redirect back with success
    // In a real implementation, you'd save the tokens to your database
    return NextResponse.redirect(new URL(`${redirect_uri}?success=facebook_connected&business_id=${business_id}`, request.url))
    
  } catch (error) {
    console.error('Facebook OAuth error:', error)
    return NextResponse.redirect(new URL('/dashboard/social?error=oauth_failed', request.url))
  }
} 