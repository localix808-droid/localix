-- Clean up all existing policies
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

-- Clean up triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP TRIGGER IF EXISTS update_businesses_updated_at ON businesses;
DROP TRIGGER IF EXISTS update_business_model_canvas_updated_at ON business_model_canvas;
DROP TRIGGER IF EXISTS update_customer_personas_updated_at ON customer_personas; 