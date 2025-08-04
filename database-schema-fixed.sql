-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create businesses table
CREATE TABLE IF NOT EXISTS businesses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    industry TEXT NOT NULL,
    website TEXT,
    logo_url TEXT,
    subscription_plan TEXT DEFAULT 'starter' CHECK (subscription_plan IN ('starter', 'pro', 'agency')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create social_accounts table
CREATE TABLE IF NOT EXISTS social_accounts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
    platform TEXT NOT NULL CHECK (platform IN ('facebook', 'twitter', 'instagram', 'linkedin')),
    account_name TEXT NOT NULL,
    access_token TEXT,
    refresh_token TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create scheduled_posts table
CREATE TABLE IF NOT EXISTS scheduled_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
    social_account_id UUID REFERENCES social_accounts(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    media_urls TEXT[],
    scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'failed')),
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create business_model_canvas table
CREATE TABLE IF NOT EXISTS business_model_canvas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
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

-- Create customer_personas table
CREATE TABLE IF NOT EXISTS customer_personas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_businesses_user_id ON businesses(user_id);
CREATE INDEX IF NOT EXISTS idx_social_accounts_business_id ON social_accounts(business_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_posts_business_id ON scheduled_posts(business_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_posts_scheduled_time ON scheduled_posts(scheduled_time);
CREATE INDEX IF NOT EXISTS idx_business_model_canvas_business_id ON business_model_canvas(business_id);
CREATE INDEX IF NOT EXISTS idx_customer_personas_business_id ON customer_personas(business_id);

-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_model_canvas ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_personas ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;

DROP POLICY IF EXISTS "Users can view own businesses" ON businesses;
DROP POLICY IF EXISTS "Users can insert own businesses" ON businesses;
DROP POLICY IF EXISTS "Users can update own businesses" ON businesses;
DROP POLICY IF EXISTS "Users can delete own businesses" ON businesses;

DROP POLICY IF EXISTS "Users can view social accounts for own businesses" ON social_accounts;
DROP POLICY IF EXISTS "Users can insert social accounts for own businesses" ON social_accounts;
DROP POLICY IF EXISTS "Users can update social accounts for own businesses" ON social_accounts;
DROP POLICY IF EXISTS "Users can delete social accounts for own businesses" ON social_accounts;

DROP POLICY IF EXISTS "Users can view posts for own businesses" ON scheduled_posts;
DROP POLICY IF EXISTS "Users can insert posts for own businesses" ON scheduled_posts;
DROP POLICY IF EXISTS "Users can update posts for own businesses" ON scheduled_posts;
DROP POLICY IF EXISTS "Users can delete posts for own businesses" ON scheduled_posts;

DROP POLICY IF EXISTS "Users can view canvas for own businesses" ON business_model_canvas;
DROP POLICY IF EXISTS "Users can insert canvas for own businesses" ON business_model_canvas;
DROP POLICY IF EXISTS "Users can update canvas for own businesses" ON business_model_canvas;
DROP POLICY IF EXISTS "Users can delete canvas for own businesses" ON business_model_canvas;

DROP POLICY IF EXISTS "Users can view personas for own businesses" ON customer_personas;
DROP POLICY IF EXISTS "Users can insert personas for own businesses" ON customer_personas;
DROP POLICY IF EXISTS "Users can update personas for own businesses" ON customer_personas;
DROP POLICY IF EXISTS "Users can delete personas for own businesses" ON customer_personas;

-- Create RLS policies for users table
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for businesses table
CREATE POLICY "Users can view own businesses" ON businesses
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own businesses" ON businesses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own businesses" ON businesses
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own businesses" ON businesses
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for social_accounts table
CREATE POLICY "Users can view social accounts for own businesses" ON social_accounts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM businesses 
            WHERE businesses.id = social_accounts.business_id 
            AND businesses.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert social accounts for own businesses" ON social_accounts
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM businesses 
            WHERE businesses.id = social_accounts.business_id 
            AND businesses.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update social accounts for own businesses" ON social_accounts
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM businesses 
            WHERE businesses.id = social_accounts.business_id 
            AND businesses.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete social accounts for own businesses" ON social_accounts
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM businesses 
            WHERE businesses.id = social_accounts.business_id 
            AND businesses.user_id = auth.uid()
        )
    );

-- Create RLS policies for scheduled_posts table
CREATE POLICY "Users can view posts for own businesses" ON scheduled_posts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM businesses 
            WHERE businesses.id = scheduled_posts.business_id 
            AND businesses.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert posts for own businesses" ON scheduled_posts
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM businesses 
            WHERE businesses.id = scheduled_posts.business_id 
            AND businesses.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update posts for own businesses" ON scheduled_posts
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM businesses 
            WHERE businesses.id = scheduled_posts.business_id 
            AND businesses.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete posts for own businesses" ON scheduled_posts
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM businesses 
            WHERE businesses.id = scheduled_posts.business_id 
            AND businesses.user_id = auth.uid()
        )
    );

-- Create RLS policies for business_model_canvas table
CREATE POLICY "Users can view canvas for own businesses" ON business_model_canvas
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM businesses 
            WHERE businesses.id = business_model_canvas.business_id 
            AND businesses.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert canvas for own businesses" ON business_model_canvas
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM businesses 
            WHERE businesses.id = business_model_canvas.business_id 
            AND businesses.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update canvas for own businesses" ON business_model_canvas
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM businesses 
            WHERE businesses.id = business_model_canvas.business_id 
            AND businesses.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete canvas for own businesses" ON business_model_canvas
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM businesses 
            WHERE businesses.id = business_model_canvas.business_id 
            AND businesses.user_id = auth.uid()
        )
    );

-- Create RLS policies for customer_personas table
CREATE POLICY "Users can view personas for own businesses" ON customer_personas
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM businesses 
            WHERE businesses.id = customer_personas.business_id 
            AND businesses.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert personas for own businesses" ON customer_personas
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM businesses 
            WHERE businesses.id = customer_personas.business_id 
            AND businesses.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update personas for own businesses" ON customer_personas
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM businesses 
            WHERE businesses.id = customer_personas.business_id 
            AND businesses.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete personas for own businesses" ON customer_personas
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM businesses 
            WHERE businesses.id = customer_personas.business_id 
            AND businesses.user_id = auth.uid()
        )
    );

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO users (id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_businesses_updated_at ON businesses;
CREATE TRIGGER update_businesses_updated_at BEFORE UPDATE ON businesses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_business_model_canvas_updated_at ON business_model_canvas;
CREATE TRIGGER update_business_model_canvas_updated_at BEFORE UPDATE ON business_model_canvas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_customer_personas_updated_at ON customer_personas;
CREATE TRIGGER update_customer_personas_updated_at BEFORE UPDATE ON customer_personas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 