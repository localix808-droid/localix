-- Simple Social Media Connections Schema
-- Run this in your Supabase SQL Editor for quick setup

-- =====================================================
-- SOCIAL ACCOUNTS TABLE (Main table)
-- =====================================================

-- Drop existing table if it exists
DROP TABLE IF EXISTS social_accounts CASCADE;

-- Create social accounts table
CREATE TABLE social_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  platform VARCHAR(20) NOT NULL CHECK (platform IN ('facebook', 'twitter', 'instagram', 'linkedin')),
  account_name VARCHAR(255) NOT NULL,
  account_id VARCHAR(255), -- Platform-specific account ID
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  permissions JSONB DEFAULT '{}', -- Platform-specific permissions
  metadata JSONB DEFAULT '{}', -- Additional platform-specific data
  last_sync_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_social_accounts_business_id ON social_accounts(business_id);
CREATE INDEX idx_social_accounts_platform ON social_accounts(platform);
CREATE INDEX idx_social_accounts_active ON social_accounts(is_active);

-- =====================================================
-- PLATFORM SETTINGS TABLE
-- =====================================================

-- Drop existing table if it exists
DROP TABLE IF EXISTS social_platform_settings CASCADE;

-- Create platform settings table
CREATE TABLE social_platform_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  platform VARCHAR(20) NOT NULL CHECK (platform IN ('facebook', 'twitter', 'instagram', 'linkedin')),
  auto_post BOOLEAN DEFAULT false,
  auto_sync BOOLEAN DEFAULT true,
  sync_frequency_minutes INTEGER DEFAULT 60,
  post_frequency_hours INTEGER DEFAULT 24,
  engagement_alerts BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(business_id, platform)
);

-- Create indexes for platform settings
CREATE INDEX idx_platform_settings_business_id ON social_platform_settings(business_id);
CREATE INDEX idx_platform_settings_platform ON social_platform_settings(platform);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on tables
ALTER TABLE social_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_platform_settings ENABLE ROW LEVEL SECURITY;

-- Social Accounts Policies
CREATE POLICY "Users can view own social accounts" ON social_accounts
  FOR SELECT USING (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own social accounts" ON social_accounts
  FOR INSERT WITH CHECK (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own social accounts" ON social_accounts
  FOR UPDATE USING (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own social accounts" ON social_accounts
  FOR DELETE USING (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid()
    )
  );

-- Platform Settings Policies
CREATE POLICY "Users can view own platform settings" ON social_platform_settings
  FOR SELECT USING (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own platform settings" ON social_platform_settings
  FOR INSERT WITH CHECK (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own platform settings" ON social_platform_settings
  FOR UPDATE USING (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid()
    )
  );

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_social_accounts_updated_at
  BEFORE UPDATE ON social_accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_platform_settings_updated_at
  BEFORE UPDATE ON social_platform_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create default platform settings
CREATE OR REPLACE FUNCTION create_default_platform_settings()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert default settings for the new social account
  INSERT INTO social_platform_settings (
    business_id,
    platform,
    auto_post,
    auto_sync,
    sync_frequency_minutes,
    post_frequency_hours,
    engagement_alerts
  ) VALUES (
    NEW.business_id,
    NEW.platform,
    false,
    true,
    60,
    24,
    true
  )
  ON CONFLICT (business_id, platform) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for default settings
CREATE TRIGGER create_default_platform_settings_trigger
  AFTER INSERT ON social_accounts
  FOR EACH ROW EXECUTE FUNCTION create_default_platform_settings();

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Function to get social accounts with business info
CREATE OR REPLACE FUNCTION get_social_accounts_with_business(user_id UUID)
RETURNS TABLE (
  id UUID,
  business_id UUID,
  business_name VARCHAR,
  platform VARCHAR,
  account_name VARCHAR,
  is_active BOOLEAN,
  last_sync_at TIMESTAMP,
  created_at TIMESTAMP
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sa.id,
    sa.business_id,
    b.name as business_name,
    sa.platform,
    sa.account_name,
    sa.is_active,
    sa.last_sync_at,
    sa.created_at
  FROM social_accounts sa
  JOIN businesses b ON sa.business_id = b.id
  WHERE b.user_id = get_social_accounts_with_business.user_id
  ORDER BY sa.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get platform statistics
CREATE OR REPLACE FUNCTION get_platform_stats(user_id UUID)
RETURNS TABLE (
  platform VARCHAR,
  total_accounts BIGINT,
  active_accounts BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sa.platform,
    COUNT(sa.id) as total_accounts,
    COUNT(CASE WHEN sa.is_active THEN 1 END) as active_accounts
  FROM social_accounts sa
  JOIN businesses b ON sa.business_id = b.id
  WHERE b.user_id = get_platform_stats.user_id
  GROUP BY sa.platform
  ORDER BY total_accounts DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check if tables were created successfully
SELECT 
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('social_accounts', 'social_platform_settings')
ORDER BY table_name;

-- Check RLS policies
SELECT 
  tablename,
  policyname,
  cmd
FROM pg_policies 
WHERE tablename IN ('social_accounts', 'social_platform_settings')
ORDER BY tablename, policyname; 