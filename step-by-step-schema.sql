-- Step 1: Create users table first (no dependencies)
CREATE TABLE IF NOT EXISTS users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 2: Create businesses table (depends on users)
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

-- Step 3: Create social_accounts table (depends on businesses)
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

-- Step 4: Create scheduled_posts table (depends on businesses and social_accounts)
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

-- Step 5: Create business_model_canvas table (depends on businesses)
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

-- Step 6: Create customer_personas table (depends on businesses)
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

-- Step 7: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_businesses_user_id ON businesses(user_id);
CREATE INDEX IF NOT EXISTS idx_social_accounts_business_id ON social_accounts(business_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_posts_business_id ON scheduled_posts(business_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_posts_scheduled_time ON scheduled_posts(scheduled_time);
CREATE INDEX IF NOT EXISTS idx_business_model_canvas_business_id ON business_model_canvas(business_id);
CREATE INDEX IF NOT EXISTS idx_customer_personas_business_id ON customer_personas(business_id);

-- Step 8: Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_model_canvas ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_personas ENABLE ROW LEVEL SECURITY;

-- Step 9: Create simple RLS policies (allowing authenticated users to access their own data)
CREATE POLICY "Enable all for authenticated users" ON users FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all for authenticated users" ON businesses FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all for authenticated users" ON social_accounts FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all for authenticated users" ON scheduled_posts FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all for authenticated users" ON business_model_canvas FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all for authenticated users" ON customer_personas FOR ALL USING (auth.role() = 'authenticated');

-- Step 10: Create function to handle user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO users (id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 11: Create trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Step 12: Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 13: Create triggers for updated_at
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