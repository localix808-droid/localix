-- Create users table (basic version)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create businesses table (basic version)
CREATE TABLE IF NOT EXISTS businesses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    industry TEXT NOT NULL,
    website TEXT,
    logo_url TEXT,
    subscription_plan TEXT DEFAULT 'starter',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create social_accounts table (basic version)
CREATE TABLE IF NOT EXISTS social_accounts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    business_id UUID NOT NULL,
    platform TEXT NOT NULL,
    account_name TEXT NOT NULL,
    access_token TEXT,
    refresh_token TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create scheduled_posts table (basic version)
CREATE TABLE IF NOT EXISTS scheduled_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    business_id UUID NOT NULL,
    social_account_id UUID NOT NULL,
    content TEXT NOT NULL,
    media_urls TEXT[],
    scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT DEFAULT 'draft',
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create business_model_canvas table (basic version)
CREATE TABLE IF NOT EXISTS business_model_canvas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    business_id UUID NOT NULL,
    key_partners TEXT[],
    key_activities TEXT[],
    key_resources TEXT[],
    value_propositions TEXT[],
    customer_relationships TEXT[],
    channels TEXT[],
    customer_segments TEXT[],
    cost_structure TEXT[],
    revenue_streams TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create customer_personas table (basic version)
CREATE TABLE IF NOT EXISTS customer_personas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    business_id UUID NOT NULL,
    name TEXT NOT NULL,
    age_range TEXT,
    gender TEXT,
    occupation TEXT,
    income_level TEXT,
    interests TEXT[],
    pain_points TEXT[],
    goals TEXT[],
    preferred_channels TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
); 