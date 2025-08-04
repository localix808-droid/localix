# Supabase Database Setup

## Overview
Your project is now configured to connect to the Supabase database at:
`postgresql://postgres:localixbusiness#2010@db.pntkmsnsbfuifgigjsum.supabase.co:5432/postgres`

## Current Configuration

### Environment Variables
The following environment variables are set in `.env`:

```
NEXT_PUBLIC_SUPABASE_URL=https://pntkmsnsbfuifgigjsum.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### Files Updated
1. `lib/supabase.ts` - Updated with your Supabase URL
2. `lib/database.ts` - Created with helper functions for database operations
3. `app/test-db/page.tsx` - Created a test page to verify connection

## Next Steps

### 1. Get Your Supabase Anon Key
You need to get your Supabase anon key from your Supabase dashboard:

1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy the "anon public" key
4. Replace `your_supabase_anon_key_here` in the `.env` file with your actual anon key

### 2. Test the Connection
Visit `http://localhost:3000/test-db` to test the database connection.

### 3. Run the Database Schema
Execute the SQL commands in `database-schema.sql` in your Supabase SQL editor to create the necessary tables.

## Database Schema
The following tables will be created:
- `users` - User profiles
- `businesses` - Business information
- `social_accounts` - Social media accounts
- `scheduled_posts` - Scheduled social media posts
- `business_model_canvas` - Business model canvas data
- `customer_personas` - Customer persona information

## Available Helper Functions
The `lib/database.ts` file provides helper functions for common operations:

### User Operations
- `createUser(userData)` - Create a new user
- `getUserById(id)` - Get user by ID

### Business Operations
- `createBusiness(businessData)` - Create a new business
- `getBusinessesByUserId(userId)` - Get businesses for a user
- `getBusinessById(id)` - Get business by ID

### Social Account Operations
- `createSocialAccount(socialAccountData)` - Create a social account
- `getSocialAccountsByBusinessId(businessId)` - Get social accounts for a business

### Scheduled Post Operations
- `createScheduledPost(postData)` - Create a scheduled post
- `getScheduledPostsByBusinessId(businessId)` - Get scheduled posts for a business

### Business Model Canvas Operations
- `createBusinessModelCanvas(canvasData)` - Create a business model canvas
- `getBusinessModelCanvasByBusinessId(businessId)` - Get canvas for a business

### Customer Persona Operations
- `createCustomerPersona(personaData)` - Create a customer persona
- `getCustomerPersonasByBusinessId(businessId)` - Get personas for a business

## Security
- Row Level Security (RLS) is enabled on all tables
- Authentication is handled through Supabase Auth
- Environment variables are used for sensitive configuration

## Troubleshooting
If you encounter connection issues:
1. Verify your anon key is correct
2. Check that the database schema has been applied
3. Ensure your Supabase project is active
4. Check the test page at `/test-db` for detailed error messages 