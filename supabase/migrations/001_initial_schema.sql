-- RELAY 멘토링 플랫폼 - 관계형 DB 스키마
-- KV 스토어에서 정규화된 테이블로 마이그레이션

-- ============================
-- 사용자 프로필 (Supabase Auth 보완)
-- ============================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'mentee' CHECK (role IN ('mentee', 'mentor', 'admin')),
  avatar TEXT,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================
-- 멘토 프로필
-- ============================
CREATE TABLE IF NOT EXISTS mentor_profiles (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  university TEXT NOT NULL,
  major TEXT NOT NULL,
  year TEXT,
  rating NUMERIC(3,2) DEFAULT 0,
  review_count INT DEFAULT 0,
  session_count INT DEFAULT 0,
  success_rate NUMERIC(5,2) DEFAULT 0,
  response_time TEXT DEFAULT '2시간',
  price INT DEFAULT 30000,
  badge TEXT DEFAULT 'bronze' CHECK (badge IN ('gold', 'silver', 'bronze')),
  verified BOOLEAN DEFAULT FALSE,
  expertise TEXT[] DEFAULT '{}',
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================
-- 크레딧
-- ============================
CREATE TABLE IF NOT EXISTS credits (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  balance INT NOT NULL DEFAULT 5
);

-- ============================
-- 크레딧 트랜잭션
-- ============================
CREATE TABLE IF NOT EXISTS credit_transactions (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('use', 'add')),
  amount INT NOT NULL,
  balance_after INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================
-- AI 초안
-- ============================
CREATE TABLE IF NOT EXISTS drafts (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  university TEXT,
  major TEXT,
  content TEXT,
  storyline JSONB,
  ai_data JSONB,
  word_count INT DEFAULT 0,
  version INT DEFAULT 1,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================
-- 세션
-- ============================
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  mentor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  mentor_name TEXT,
  mentor_avatar TEXT,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  duration INT DEFAULT 60,
  price INT DEFAULT 0,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
  topic TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================
-- 리뷰
-- ============================
CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  mentor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  session_id TEXT REFERENCES sessions(id) ON DELETE SET NULL,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  content TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================
-- 알림
-- ============================
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT,
  message TEXT,
  type TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================
-- 대화
-- ============================
CREATE TABLE IF NOT EXISTS conversations (
  id TEXT PRIMARY KEY,
  last_message TEXT,
  last_message_at TIMESTAMPTZ,
  participants UUID[] NOT NULL
);

-- ============================
-- 대화 참여자 (조회용)
-- ============================
CREATE TABLE IF NOT EXISTS conversation_members (
  conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  PRIMARY KEY (conversation_id, user_id)
);

-- ============================
-- 메시지
-- ============================
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================
-- 분쟁
-- ============================
CREATE TABLE IF NOT EXISTS disputes (
  id TEXT PRIMARY KEY,
  reporter_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  target_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  session_id TEXT REFERENCES sessions(id) ON DELETE SET NULL,
  reason TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'resolved', 'dismissed')),
  resolution TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================
-- 결과 보고
-- ============================
CREATE TABLE IF NOT EXISTS outcomes (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  mentor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  result TEXT NOT NULL,
  detail TEXT,
  purpose TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================
-- 멘토 일정
-- ============================
CREATE TABLE IF NOT EXISTS mentor_schedules (
  id TEXT PRIMARY KEY,
  mentor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  available BOOLEAN DEFAULT TRUE
);

-- ============================
-- 인덱스
-- ============================
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_mentor_id ON sessions(mentor_id);
CREATE INDEX IF NOT EXISTS idx_reviews_mentor_id ON reviews(mentor_id);
CREATE INDEX IF NOT EXISTS idx_drafts_user_id ON drafts(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_id ON credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_mentor_schedules_mentor_id ON mentor_schedules(mentor_id);
CREATE INDEX IF NOT EXISTS idx_disputes_reporter_id ON disputes(reporter_id);
CREATE INDEX IF NOT EXISTS idx_conversation_members_user_id ON conversation_members(user_id);

-- ============================
-- RLS (Row Level Security)
-- ============================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE outcomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentor_schedules ENABLE ROW LEVEL SECURITY;

-- profiles: 인증된 사용자 조회, 본인만 수정
CREATE POLICY profiles_select ON profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY profiles_insert ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY profiles_update ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- mentor_profiles: 인증된 사용자 조회, 본인만 수정
CREATE POLICY mentor_profiles_select ON mentor_profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY mentor_profiles_insert ON mentor_profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY mentor_profiles_update ON mentor_profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- credits: 본인만 조회/수정
CREATE POLICY credits_select ON credits FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY credits_insert ON credits FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY credits_update ON credits FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- credit_transactions: 본인만 조회
CREATE POLICY credit_tx_select ON credit_transactions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY credit_tx_insert ON credit_transactions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- drafts: 본인만 CRUD
CREATE POLICY drafts_select ON drafts FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY drafts_insert ON drafts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY drafts_update ON drafts FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY drafts_delete ON drafts FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- sessions: 참여자만 조회, 본인이 생성
CREATE POLICY sessions_select ON sessions FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR auth.uid() = mentor_id);
CREATE POLICY sessions_insert ON sessions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY sessions_update ON sessions FOR UPDATE TO authenticated
  USING (auth.uid() = user_id OR auth.uid() = mentor_id);

-- reviews: 모두 조회 가능, 본인만 작성
CREATE POLICY reviews_select ON reviews FOR SELECT TO authenticated USING (true);
CREATE POLICY reviews_insert ON reviews FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- notifications: 본인만 조회/수정
CREATE POLICY notif_select ON notifications FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY notif_insert ON notifications FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY notif_update ON notifications FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- messages: 참여자만 조회
CREATE POLICY messages_select ON messages FOR SELECT TO authenticated
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);
CREATE POLICY messages_insert ON messages FOR INSERT TO authenticated WITH CHECK (auth.uid() = sender_id);

-- conversations: 참여자만 조회
CREATE POLICY conv_select ON conversations FOR SELECT TO authenticated
  USING (auth.uid() = ANY(participants));
CREATE POLICY conv_insert ON conversations FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = ANY(participants));
CREATE POLICY conv_update ON conversations FOR UPDATE TO authenticated
  USING (auth.uid() = ANY(participants));

-- conversation_members: 참여자만 조회
CREATE POLICY conv_members_select ON conversation_members FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY conv_members_insert ON conversation_members FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- disputes: 본인 신고만 조회 (관리자는 service_role로 전체 조회)
CREATE POLICY disputes_select ON disputes FOR SELECT TO authenticated
  USING (auth.uid() = reporter_id);
CREATE POLICY disputes_insert ON disputes FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = reporter_id);

-- outcomes: 본인만 CRUD
CREATE POLICY outcomes_select ON outcomes FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY outcomes_insert ON outcomes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- mentor_schedules: 모두 조회, 본인만 수정
CREATE POLICY schedules_select ON mentor_schedules FOR SELECT TO authenticated USING (true);
CREATE POLICY schedules_insert ON mentor_schedules FOR INSERT TO authenticated WITH CHECK (auth.uid() = mentor_id);
CREATE POLICY schedules_update ON mentor_schedules FOR UPDATE TO authenticated USING (auth.uid() = mentor_id);
CREATE POLICY schedules_delete ON mentor_schedules FOR DELETE TO authenticated USING (auth.uid() = mentor_id);

-- ============================
-- 서비스 역할 정책 (Edge Function에서 사용)
-- ============================
-- service_role은 RLS를 우회하므로 별도 정책 불필요
-- Edge Function은 SUPABASE_SERVICE_ROLE_KEY를 사용하여 모든 테이블에 접근
