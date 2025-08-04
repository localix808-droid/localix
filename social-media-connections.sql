-- Social Media Connections Database Schema
-- Run this in your Supabase SQL Editor

-- =====================================================
-- SOCIAL ACCOUNTS TABLE
-- =====================================================

-- Drop existing table if it exists
DROP TABLE IF EXISTS social_accounts CASCADE;

-- Create social accounts table
CREATE TABLE social_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  platform VARCHAR(20) NOT NULL CHECK (platform IN ('facebook', 'twitter', 'instagram', 'linkedin', 'youtube', 'tiktok')),
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
CREATE INDEX idx_social_accounts_platform_business ON social_accounts(platform, business_id);

-- =====================================================
-- CONNECTION LOGS TABLE
-- =====================================================

-- Drop existing table if it exists
DROP TABLE IF EXISTS social_connection_logs CASCADE;

-- Create connection logs table
CREATE TABLE social_connection_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  social_account_id UUID REFERENCES social_accounts(id) ON DELETE CASCADE,
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  action VARCHAR(50) NOT NULL CHECK (action IN ('connect', 'disconnect', 'refresh', 'sync', 'error')),
  status VARCHAR(20) NOT NULL CHECK (status IN ('success', 'failed', 'pending')),
  platform VARCHAR(20) NOT NULL,
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for connection logs
CREATE INDEX idx_connection_logs_account_id ON social_connection_logs(social_account_id);
CREATE INDEX idx_connection_logs_business_id ON social_connection_logs(business_id);
CREATE INDEX idx_connection_logs_action ON social_connection_logs(action);
CREATE INDEX idx_connection_logs_created_at ON social_connection_logs(created_at);

-- =====================================================
-- PLATFORM SETTINGS TABLE
-- =====================================================

-- Drop existing table if it exists
DROP TABLE IF EXISTS social_platform_settings CASCADE;

-- Create platform settings table
CREATE TABLE social_platform_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  platform VARCHAR(20) NOT NULL CHECK (platform IN ('facebook', 'twitter', 'instagram', 'linkedin', 'youtube', 'tiktok')),
  auto_post BOOLEAN DEFAULT false,
  auto_sync BOOLEAN DEFAULT true,
  sync_frequency_minutes INTEGER DEFAULT 60,
  post_frequency_hours INTEGER DEFAULT 24,
  content_filters JSONB DEFAULT '{}',
  hashtag_strategy JSONB DEFAULT '{}',
  engagement_alerts BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(business_id, platform)
);

-- Create indexes for platform settings
CREATE INDEX idx_platform_settings_business_id ON social_platform_settings(business_id);
CREATE INDEX idx_platform_settings_platform ON social_platform_settings(platform);

-- =====================================================
-- CONNECTION TOKENS TABLE (for secure token storage)
-- =====================================================

-- Drop existing table if it exists
DROP TABLE IF EXISTS social_connection_tokens CASCADE;

-- Create connection tokens table
CREATE TABLE social_connection_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  social_account_id UUID NOT NULL REFERENCES social_accounts(id) ON DELETE CASCADE,
  token_type VARCHAR(20) NOT NULL CHECK (token_type IN ('access', 'refresh', 'app')),
  token_value TEXT NOT NULL,
  expires_at TIMESTAMP,
  is_valid BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for tokens
CREATE INDEX idx_connection_tokens_account_id ON social_connection_tokens(social_account_id);
CREATE INDEX idx_connection_tokens_type ON social_connection_tokens(token_type);
CREATE INDEX idx_connection_tokens_valid ON social_connection_tokens(is_valid);

-- =====================================================
-- PLATFORM METRICS TABLE
-- =====================================================

-- Drop existing table if it exists
DROP TABLE IF EXISTS social_platform_metrics CASCADE;

-- Create platform metrics table
CREATE TABLE social_platform_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  social_account_id UUID NOT NULL REFERENCES social_accounts(id) ON DELETE CASCADE,
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  platform VARCHAR(20) NOT NULL,
  metric_date DATE NOT NULL,
  followers_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  posts_count INTEGER DEFAULT 0,
  engagement_rate DECIMAL(5,2) DEFAULT 0.00,
  reach_count INTEGER DEFAULT 0,
  impressions_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(social_account_id, metric_date)
);

-- Create indexes for metrics
CREATE INDEX idx_platform_metrics_account_id ON social_platform_metrics(social_account_id);
CREATE INDEX idx_platform_metrics_business_id ON social_platform_metrics(business_id);
CREATE INDEX idx_platform_metrics_date ON social_platform_metrics(metric_date);
CREATE INDEX idx_platform_metrics_platform ON social_platform_metrics(platform);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE social_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_connection_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_platform_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_connection_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_platform_metrics ENABLE ROW LEVEL SECURITY;

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

-- Connection Logs Policies
CREATE POLICY "Users can view own connection logs" ON social_connection_logs
  FOR SELECT USING (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own connection logs" ON social_connection_logs
  FOR INSERT WITH CHECK (
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

-- Connection Tokens Policies
CREATE POLICY "Users can view own connection tokens" ON social_connection_tokens
  FOR SELECT USING (
    social_account_id IN (
      SELECT id FROM social_accounts WHERE business_id IN (
        SELECT id FROM businesses WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can insert own connection tokens" ON social_connection_tokens
  FOR INSERT WITH CHECK (
    social_account_id IN (
      SELECT id FROM social_accounts WHERE business_id IN (
        SELECT id FROM businesses WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can update own connection tokens" ON social_connection_tokens
  FOR UPDATE USING (
    social_account_id IN (
      SELECT id FROM social_accounts WHERE business_id IN (
        SELECT id FROM businesses WHERE user_id = auth.uid()
      )
    )
  );

-- Platform Metrics Policies
CREATE POLICY "Users can view own platform metrics" ON social_platform_metrics
  FOR SELECT USING (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own platform metrics" ON social_platform_metrics
  FOR INSERT WITH CHECK (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own platform metrics" ON social_platform_metrics
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

CREATE TRIGGER update_connection_tokens_updated_at
  BEFORE UPDATE ON social_connection_tokens
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_platform_metrics_updated_at
  BEFORE UPDATE ON social_platform_metrics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to log connection events
CREATE OR REPLACE FUNCTION log_social_connection_event()
RETURNS TRIGGER AS $$
BEGIN
  -- Log the event
  INSERT INTO social_connection_logs (
    social_account_id,
    business_id,
    action,
    status,
    platform,
    metadata
  ) VALUES (
    NEW.id,
    NEW.business_id,
    CASE 
      WHEN TG_OP = 'INSERT' THEN 'connect'
      WHEN TG_OP = 'UPDATE' AND OLD.is_active = false AND NEW.is_active = true THEN 'connect'
      WHEN TG_OP = 'UPDATE' AND OLD.is_active = true AND NEW.is_active = false THEN 'disconnect'
      ELSE 'update'
    END,
    'success',
    NEW.platform,
    jsonb_build_object(
      'account_name', NEW.account_name,
      'operation', TG_OP
    )
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for connection logging
CREATE TRIGGER log_social_connection_changes
  AFTER INSERT OR UPDATE ON social_accounts
  FOR EACH ROW EXECUTE FUNCTION log_social_connection_event();

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
  active_accounts BIGINT,
  total_followers BIGINT,
  avg_engagement_rate DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sa.platform,
    COUNT(sa.id) as total_accounts,
    COUNT(CASE WHEN sa.is_active THEN 1 END) as active_accounts,
    COALESCE(SUM(pm.followers_count), 0) as total_followers,
    COALESCE(AVG(pm.engagement_rate), 0.00) as avg_engagement_rate
  FROM social_accounts sa
  JOIN businesses b ON sa.business_id = b.id
  LEFT JOIN social_platform_metrics pm ON sa.id = pm.social_account_id
  WHERE b.user_id = get_platform_stats.user_id
  GROUP BY sa.platform
  ORDER BY total_accounts DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- SAMPLE DATA (Optional - for testing)
-- =====================================================

-- Insert sample platform settings (uncomment if needed)
/*
INSERT INTO social_platform_settings (business_id, platform, auto_post, auto_sync) 
SELECT 
  b.id,
  'facebook',
  false,
  true
FROM businesses b
WHERE b.id IN (SELECT id FROM businesses LIMIT 1);

INSERT INTO social_platform_settings (business_id, platform, auto_post, auto_sync) 
SELECT 
  b.id,
  'twitter',
  true,
  true
FROM businesses b
WHERE b.id IN (SELECT id FROM businesses LIMIT 1);
*/

-- =====================================================
-- COMMENTS AND DOCUMENTATION
-- =====================================================

COMMENT ON TABLE social_accounts IS 'Stores connected social media accounts for each business';
COMMENT ON TABLE social_connection_logs IS 'Audit trail for social media connection events';
COMMENT ON TABLE social_platform_settings IS 'Platform-specific settings for each business';
COMMENT ON TABLE social_connection_tokens IS 'Secure storage for OAuth tokens';
COMMENT ON TABLE social_platform_metrics IS 'Metrics and analytics data for social accounts';

COMMENT ON COLUMN social_accounts.permissions IS 'Platform-specific permissions as JSON object';
COMMENT ON COLUMN social_accounts.metadata IS 'Additional platform-specific data as JSON object';
COMMENT ON COLUMN social_platform_settings.content_filters IS 'Content filtering rules as JSON object';
COMMENT ON COLUMN social_platform_settings.hashtag_strategy IS 'Hashtag strategy configuration as JSON object';

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check if tables were created successfully
SELECT 
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'social_%'
ORDER BY table_name;

-- Check RLS policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename LIKE 'social_%'
ORDER BY tablename, policyname; 