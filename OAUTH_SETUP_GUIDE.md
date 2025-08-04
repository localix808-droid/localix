# OAuth Setup Guide for Social Media Connections

This guide will help you set up real OAuth connections to Facebook, Twitter, Instagram, and LinkedIn.

## 🔧 **Step 1: Facebook OAuth Setup**

### **1. Create Facebook App**
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click "Create App"
3. Choose "Business" as the app type
4. Fill in your app details
5. Note down your **App ID** and **App Secret**

### **2. Configure Facebook App**
1. In your Facebook app dashboard, go to "Settings" > "Basic"
2. Add your domain to "App Domains"
3. Go to "Facebook Login" > "Settings"
4. Add these Valid OAuth Redirect URIs:
   - `http://localhost:3000/api/auth/facebook/callback` (development)
   - `https://yourdomain.com/api/auth/facebook/callback` (production)

### **3. Add Environment Variables**
Add these to your `.env` file:

```env
# Facebook OAuth
FACEBOOK_APP_ID=your_facebook_app_id_here
FACEBOOK_APP_SECRET=your_facebook_app_secret_here
```

## 🔧 **Step 2: Twitter OAuth Setup**

### **1. Create Twitter App**
1. Go to [Twitter Developer Portal](https://developer.twitter.com/)
2. Create a new app
3. Note down your **API Key** and **API Secret**

### **2. Configure Twitter App**
1. Set up OAuth 2.0
2. Add callback URLs:
   - `http://localhost:3000/api/auth/twitter/callback`
   - `https://yourdomain.com/api/auth/twitter/callback`

### **3. Add Environment Variables**
```env
# Twitter OAuth
TWITTER_CLIENT_ID=your_twitter_client_id_here
TWITTER_CLIENT_SECRET=your_twitter_client_secret_here
```

## 🔧 **Step 3: Instagram OAuth Setup**

### **1. Create Instagram App**
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app or use your existing Facebook app
3. Add Instagram Basic Display product
4. Note down your **Instagram App ID**

### **2. Configure Instagram App**
1. Add Instagram Basic Display
2. Set up OAuth redirect URIs:
   - `http://localhost:3000/api/auth/instagram/callback`
   - `https://yourdomain.com/api/auth/instagram/callback`

### **3. Add Environment Variables**
```env
# Instagram OAuth (uses Facebook app)
INSTAGRAM_APP_ID=your_instagram_app_id_here
INSTAGRAM_APP_SECRET=your_instagram_app_secret_here
```

## 🔧 **Step 4: LinkedIn OAuth Setup**

### **1. Create LinkedIn App**
1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/)
2. Create a new app
3. Note down your **Client ID** and **Client Secret**

### **2. Configure LinkedIn App**
1. Add OAuth 2.0 redirect URLs:
   - `http://localhost:3000/api/auth/linkedin/callback`
   - `https://yourdomain.com/api/auth/linkedin/callback`

### **3. Add Environment Variables**
```env
# LinkedIn OAuth
LINKEDIN_CLIENT_ID=your_linkedin_client_id_here
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret_here
```

## 🚀 **Step 5: Update Your App**

### **1. Add All Environment Variables**
Update your `.env` file with all the OAuth credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://pntkmsnsbfuifgigjsum.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Facebook OAuth
FACEBOOK_APP_ID=your_facebook_app_id_here
FACEBOOK_APP_SECRET=your_facebook_app_secret_here

# Twitter OAuth
TWITTER_CLIENT_ID=your_twitter_client_id_here
TWITTER_CLIENT_SECRET=your_twitter_client_secret_here

# Instagram OAuth
INSTAGRAM_APP_ID=your_instagram_app_id_here
INSTAGRAM_APP_SECRET=your_instagram_app_secret_here

# LinkedIn OAuth
LINKEDIN_CLIENT_ID=your_linkedin_client_id_here
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret_here
```

### **2. Restart Your Development Server**
```bash
npm run dev
```

## 🧪 **Step 6: Test the OAuth Flow**

### **1. Development Mode (Simulated)**
- In development, the app will simulate OAuth connections
- You'll see mock accounts being created
- No real OAuth redirects will happen

### **2. Production Mode (Real OAuth)**
- In production, clicking "Connect Facebook" will redirect to Facebook
- Users will see the Facebook login page
- After authorization, they'll be redirected back to your app

## 🔍 **Testing Steps**

### **1. Test Database Setup**
Visit: `http://localhost:3000/test-social-connections`

### **2. Test Social Media Page**
Visit: `http://localhost:3000/dashboard/social`

### **3. Test Business Dashboard**
Visit: `http://localhost:3000/dashboard/business/[your-business-id]`

## 🛠️ **Current Implementation Status**

### **✅ What's Working:**
- Database schema for social accounts
- Row Level Security (RLS) policies
- Social media connection interface
- Mock OAuth flow in development
- Real OAuth API routes (ready for production)

### **🔄 What's Simulated:**
- OAuth redirects in development mode
- Token exchange (uses mock tokens)
- Social media API calls

### **🚀 What's Ready for Production:**
- Real OAuth redirects to Facebook
- Token exchange with Facebook Graph API
- Database storage of real tokens
- User profile and pages retrieval

## 📝 **Production Checklist**

Before going live:

1. **✅ Set up all OAuth apps** (Facebook, Twitter, Instagram, LinkedIn)
2. **✅ Add all environment variables** with real credentials
3. **✅ Update callback URLs** to your production domain
4. **✅ Test OAuth flows** in production environment
5. **✅ Set up proper error handling** for OAuth failures
6. **✅ Implement token refresh** logic
7. **✅ Add rate limiting** for API calls
8. **✅ Set up monitoring** for OAuth errors

## 🔒 **Security Considerations**

### **OAuth Security:**
- ✅ State parameter for CSRF protection
- ✅ Secure token storage in database
- ✅ Environment variables for secrets
- ✅ HTTPS redirects in production

### **Data Protection:**
- ✅ Row Level Security (RLS) enabled
- ✅ User isolation in database
- ✅ Business-specific account separation
- ✅ Token encryption (recommended)

## 🎯 **Next Steps**

1. **Set up your Facebook app** and get the credentials
2. **Add the environment variables** to your `.env` file
3. **Test the current implementation** in development
4. **Deploy to production** when ready
5. **Test real OAuth flows** in production

---

**Your OAuth setup is now ready!** 🚀

The app will simulate connections in development and use real OAuth in production once you add the credentials. 