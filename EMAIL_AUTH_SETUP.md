# Email Authentication Setup Guide

This guide will help you configure email authentication for your Localix application.

## 1. Configure Email Templates in Supabase

### Step 1: Access Supabase Dashboard
1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project: `pntkmsnsbfuifgigjsum`

### Step 2: Configure Email Templates
1. Go to **Authentication** → **Email Templates**
2. Configure the following templates:

#### Sign Up Template
- **Subject**: `Confirm your signup - Localix`
- **Content**:
```html
<h2>Welcome to Localix!</h2>
<p>Click the link below to confirm your signup:</p>
<a href="{{ .ConfirmationURL }}">Confirm your signup</a>
<p>If you didn't sign up for Localix, you can safely ignore this email.</p>
```

#### Magic Link Template
- **Subject**: `Your login link - Localix`
- **Content**:
```html
<h2>Login to Localix</h2>
<p>Click the link below to log in:</p>
<a href="{{ .ConfirmationURL }}">Log in to Localix</a>
<p>This link will expire in 24 hours.</p>
```

### Step 3: Configure Email Settings
1. Go to **Authentication** → **Settings**
2. Set **Site URL** to: `http://localhost:3000` (for development)
3. Set **Redirect URLs** to include:
   - `http://localhost:3000/auth/signin`
   - `http://localhost:3000/dashboard`

## 2. Run Database Triggers

### Step 1: Open SQL Editor
1. In your Supabase dashboard, go to **SQL Editor**
2. Create a new query

### Step 2: Run the Triggers
Copy and paste the contents of `database-triggers.sql` into the SQL editor and run it.

This will:
- Create automatic user profile creation when users sign up
- Set up Row Level Security policies
- Enable proper user management

## 3. Test the Signup Flow

### Step 1: Test User Registration
1. Go to your application: `http://localhost:3000`
2. Click "Get Started" or go to `/auth/signup`
3. Fill out the signup form with a real email address
4. Submit the form

### Step 2: Check Email Verification
1. Check your email for the verification link
2. Click the verification link
3. You should be redirected to the signin page

### Step 3: Verify User Creation
1. Go to Supabase Dashboard → **Table Editor**
2. Check the `users` table
3. You should see the new user record

## 4. Environment Variables

Make sure your `.env` file has the correct values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://pntkmsnsbfuifgigjsum.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key_here
```

## 5. Features Implemented

✅ **Email Verification**: Users must verify their email before signing in
✅ **User Profile Creation**: Automatic user profile creation in the database
✅ **Error Handling**: Proper error messages for duplicate emails, weak passwords, etc.
✅ **Resend Email**: Users can resend verification emails
✅ **Security**: Row Level Security policies protect user data
✅ **UI/UX**: Clean, user-friendly signup flow with proper feedback

## 6. Troubleshooting

### Email Not Received
- Check spam folder
- Verify email template configuration
- Check Supabase logs for email delivery issues

### User Not Created in Database
- Verify the database triggers are running
- Check the `users` table structure matches the trigger
- Look for errors in Supabase logs

### Authentication Errors
- Verify your Supabase URL and Anon Key
- Check that email templates are configured
- Ensure redirect URLs are properly set

## 7. Next Steps

After setting up email authentication:

1. **Test the complete flow** from signup to dashboard
2. **Configure production settings** when deploying
3. **Set up additional security** like password requirements
4. **Add social authentication** (Google, GitHub, etc.) if needed

## 8. Production Deployment

When deploying to production:

1. Update **Site URL** in Supabase to your production domain
2. Update **Redirect URLs** to include your production domain
3. Configure custom email domain (optional)
4. Set up monitoring for email delivery
5. Configure backup email providers

---

**Need Help?** Check the Supabase documentation or contact support if you encounter issues. 