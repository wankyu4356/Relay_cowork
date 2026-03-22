-- Phase 2: Category filtering, revenue tracking, AI usage

-- 1. Add category to mentor_profiles
ALTER TABLE mentor_profiles ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'transfer';

-- 2. Revenue withdrawal requests
CREATE TABLE IF NOT EXISTS revenue_withdrawals (
  id TEXT PRIMARY KEY,
  mentor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount INT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'rejected')),
  bank_name TEXT,
  account_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);

-- 3. AI usage tracking
CREATE TABLE IF NOT EXISTS ai_usage_logs (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  feature TEXT NOT NULL CHECK (feature IN ('storyline', 'draft', 'recommendation', 'review')),
  credits_used INT DEFAULT 1,
  input_tokens INT,
  output_tokens INT,
  model TEXT DEFAULT 'claude-sonnet-4-5-20250514',
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Index for performance
CREATE INDEX IF NOT EXISTS idx_sessions_mentor_id ON sessions(mentor_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_mentor_id ON reviews(mentor_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_mentor_profiles_category ON mentor_profiles(category);
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_user_id ON ai_usage_logs(user_id);
