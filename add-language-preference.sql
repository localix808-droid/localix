-- Add language preference to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS language_preference TEXT DEFAULT 'en' CHECK (language_preference IN ('en', 'ar'));

-- Update existing users to have default language
UPDATE users SET language_preference = 'en' WHERE language_preference IS NULL;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_users_language_preference ON users(language_preference); 