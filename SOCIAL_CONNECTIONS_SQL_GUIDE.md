# Social Media Connections SQL Schema Guide

This guide provides comprehensive documentation for the SQL schema used to manage social media connections in your Localix application.

## 📋 **Schema Overview**

### **Two Schema Options**

1. **`social-media-connections.sql`** - Complete schema with all features
2. **`social-connections-simple.sql`** - Simplified schema for quick setup

## 🗄️ **Database Tables**

### **1. Social Accounts Table (`social_accounts`)**
**Purpose**: Stores connected social media accounts for each business

```sql
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
```

**Key Features**:
- ✅ **Business Association**: Links accounts to specific businesses
- ✅ **Platform Support**: Facebook, Twitter, Instagram, LinkedIn
- ✅ **Token Management**: Secure storage of OAuth tokens
- ✅ **Status Tracking**: Active/inactive account status
- ✅ **Metadata Storage**: Platform-specific data as JSON
- ✅ **Audit Trail**: Created/updated timestamps

### **2. Platform Settings Table (`social_platform_settings`)**
**Purpose**: Stores platform-specific settings for each business

```sql
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
```

**Key Features**:
- ✅ **Auto-posting**: Enable/disable automatic posting
- ✅ **Sync Settings**: Configure sync frequency
- ✅ **Alert Management**: Engagement alert preferences
- ✅ **Business Isolation**: Settings per business per platform

### **3. Connection Logs Table (`social_connection_logs`) - Full Schema Only**
**Purpose**: Audit trail for all connection events

```sql
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
```

### **4. Connection Tokens Table (`social_connection_tokens`) - Full Schema Only**
**Purpose**: Secure storage for OAuth tokens

```sql
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
```

### **5. Platform Metrics Table (`social_platform_metrics`) - Full Schema Only**
**Purpose**: Analytics and metrics data

```sql
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
```

## 🔒 **Security Features**

### **Row Level Security (RLS)**
All tables have RLS enabled with user-specific policies:

```sql
-- Example policy for social accounts
CREATE POLICY "Users can view own social accounts" ON social_accounts
  FOR SELECT USING (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid()
    )
  );
```

**Security Features**:
- ✅ **User Isolation**: Users can only access their own data
- ✅ **Business Isolation**: Data is separated by business
- ✅ **Platform Isolation**: Settings are platform-specific
- ✅ **Audit Trail**: All changes are logged (full schema)

## 🔧 **Functions and Triggers**

### **Automatic Timestamps**
```sql
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### **Default Settings Creation**
```sql
-- Function to create default platform settings
CREATE OR REPLACE FUNCTION create_default_platform_settings()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO social_platform_settings (
    business_id, platform, auto_post, auto_sync, 
    sync_frequency_minutes, post_frequency_hours, engagement_alerts
  ) VALUES (
    NEW.business_id, NEW.platform, false, true, 60, 24, true
  ) ON CONFLICT (business_id, platform) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### **Helper Functions**

#### **Get Social Accounts with Business Info**
```sql
CREATE OR REPLACE FUNCTION get_social_accounts_with_business(user_id UUID)
RETURNS TABLE (
  id UUID, business_id UUID, business_name VARCHAR,
  platform VARCHAR, account_name VARCHAR, is_active BOOLEAN,
  last_sync_at TIMESTAMP, created_at TIMESTAMP
) AS $$
-- Returns all social accounts for a user with business information
```

#### **Get Platform Statistics**
```sql
CREATE OR REPLACE FUNCTION get_platform_stats(user_id UUID)
RETURNS TABLE (
  platform VARCHAR, total_accounts BIGINT, active_accounts BIGINT
) AS $$
-- Returns platform statistics for a user
```

## 📊 **Performance Optimizations**

### **Indexes**
```sql
-- Social accounts indexes
CREATE INDEX idx_social_accounts_business_id ON social_accounts(business_id);
CREATE INDEX idx_social_accounts_platform ON social_accounts(platform);
CREATE INDEX idx_social_accounts_active ON social_accounts(is_active);

-- Platform settings indexes
CREATE INDEX idx_platform_settings_business_id ON social_platform_settings(business_id);
CREATE INDEX idx_platform_settings_platform ON social_platform_settings(platform);
```

### **Constraints**
```sql
-- Platform validation
CHECK (platform IN ('facebook', 'twitter', 'instagram', 'linkedin'))

-- Unique constraints
UNIQUE(business_id, platform) -- One setting per platform per business
```

## 🚀 **Setup Instructions**

### **Quick Setup (Recommended)**
1. **Copy the simple schema**:
   ```sql
   -- Copy content from social-connections-simple.sql
   ```

2. **Run in Supabase SQL Editor**:
   - Go to your Supabase dashboard
   - Navigate to SQL Editor
   - Paste and execute the SQL

3. **Verify setup**:
   ```sql
   -- Check if tables were created
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name IN ('social_accounts', 'social_platform_settings');
   ```

### **Full Setup (Advanced)**
1. **Copy the complete schema**:
   ```sql
   -- Copy content from social-media-connections.sql
   ```

2. **Run in Supabase SQL Editor**

3. **Verify all tables**:
   ```sql
   -- Check all tables
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name LIKE 'social_%';
   ```

## 📝 **Usage Examples**

### **Insert a Social Account**
```sql
INSERT INTO social_accounts (
  business_id, platform, account_name, 
  access_token, refresh_token, is_active
) VALUES (
  'business-uuid-here', 'facebook', '@mybusiness',
  'access-token-here', 'refresh-token-here', true
);
```

### **Get All Accounts for a User**
```sql
SELECT * FROM get_social_accounts_with_business('user-uuid-here');
```

### **Get Platform Statistics**
```sql
SELECT * FROM get_platform_stats('user-uuid-here');
```

### **Update Platform Settings**
```sql
UPDATE social_platform_settings 
SET auto_post = true, sync_frequency_minutes = 30
WHERE business_id = 'business-uuid-here' 
AND platform = 'facebook';
```

## 🔍 **Verification Queries**

### **Check Table Creation**
```sql
SELECT 
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'social_%'
ORDER BY table_name;
```

### **Check RLS Policies**
```sql
SELECT 
  tablename,
  policyname,
  cmd
FROM pg_policies 
WHERE tablename LIKE 'social_%'
ORDER BY tablename, policyname;
```

### **Check Functions**
```sql
SELECT 
  routine_name,
  routine_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name LIKE '%social%'
ORDER BY routine_name;
```

## 🛠️ **Integration with Application**

### **TypeScript Types**
```typescript
interface SocialAccount {
  id: string
  business_id: string
  platform: 'facebook' | 'twitter' | 'instagram' | 'linkedin'
  account_name: string
  account_id?: string
  access_token?: string
  refresh_token?: string
  token_expires_at?: string
  is_active: boolean
  permissions: Record<string, any>
  metadata: Record<string, any>
  last_sync_at?: string
  created_at: string
  updated_at: string
}

interface PlatformSettings {
  id: string
  business_id: string
  platform: 'facebook' | 'twitter' | 'instagram' | 'linkedin'
  auto_post: boolean
  auto_sync: boolean
  sync_frequency_minutes: number
  post_frequency_hours: number
  engagement_alerts: boolean
  created_at: string
  updated_at: string
}
```

### **Supabase Client Usage**
```typescript
// Get social accounts for a business
const { data: accounts } = await supabase
  .from('social_accounts')
  .select('*')
  .eq('business_id', businessId)
  .eq('is_active', true);

// Insert new social account
const { data, error } = await supabase
  .from('social_accounts')
  .insert([{
    business_id: businessId,
    platform: 'facebook',
    account_name: '@mybusiness',
    access_token: 'token-here',
    is_active: true
  }]);
```

## 🔄 **Migration and Updates**

### **Adding New Platforms**
```sql
-- Update platform check constraints
ALTER TABLE social_accounts 
DROP CONSTRAINT social_accounts_platform_check;

ALTER TABLE social_accounts 
ADD CONSTRAINT social_accounts_platform_check 
CHECK (platform IN ('facebook', 'twitter', 'instagram', 'linkedin', 'youtube', 'tiktok'));
```

### **Adding New Fields**
```sql
-- Add new field to existing table
ALTER TABLE social_accounts 
ADD COLUMN new_field VARCHAR(255);
```

## 📈 **Monitoring and Maintenance**

### **Check for Expired Tokens**
```sql
SELECT 
  id, platform, account_name, token_expires_at
FROM social_accounts 
WHERE token_expires_at < NOW() 
AND is_active = true;
```

### **Clean Up Inactive Accounts**
```sql
-- Archive inactive accounts (optional)
UPDATE social_accounts 
SET is_active = false 
WHERE last_sync_at < NOW() - INTERVAL '30 days';
```

## 🎯 **Best Practices**

### **Security**
- ✅ Always use RLS policies
- ✅ Validate platform values
- ✅ Encrypt sensitive tokens
- ✅ Regular token rotation

### **Performance**
- ✅ Use appropriate indexes
- ✅ Monitor query performance
- ✅ Archive old data
- ✅ Regular maintenance

### **Data Integrity**
- ✅ Use foreign key constraints
- ✅ Validate data types
- ✅ Implement audit trails
- ✅ Regular backups

---

**Your social media connections database is now ready!** 🚀

Choose the appropriate schema based on your needs and follow the setup instructions to get started. 