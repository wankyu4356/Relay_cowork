-- ============================================================
-- Phase 3: "Direct Supabase client" 전환 지원
-- Edge Function 없이 supabase-js 클라이언트가 RLS 테이블에 직접
-- 접근하는 구조로 가기 위한 트리거 / RPC / 관리자 정책.
-- 001, 002 이후에 실행하세요.
-- ============================================================

-- ============================================================
-- 0. 관리자 판별 헬퍼 (RLS 재귀 방지 위해 SECURITY DEFINER)
-- ============================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- ============================================================
-- 1. 신규 가입 시 profiles + credits 자동 생성
--    (기존 Edge Function의 signup 동기화를 대체)
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role, onboarding_completed)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'name', '사용자'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'mentee'),
    COALESCE((NEW.raw_user_meta_data->>'onboarding_completed')::boolean, FALSE)
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.credits (user_id, balance)
  VALUES (NEW.id, 5)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 2. 크레딧 사용/충전 RPC (원자적 처리 + 트랜잭션 기록)
--    클라이언트는 supabase.rpc('use_credit', { p_amount }) 호출
-- ============================================================
CREATE OR REPLACE FUNCTION public.use_credit(p_amount INT DEFAULT 1)
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid UUID := auth.uid();
  v_balance INT;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION '인증 필요'; END IF;

  SELECT balance INTO v_balance FROM public.credits WHERE user_id = v_uid FOR UPDATE;
  IF v_balance IS NULL THEN
    INSERT INTO public.credits (user_id, balance) VALUES (v_uid, 5)
    ON CONFLICT (user_id) DO NOTHING;
    v_balance := 5;
  END IF;

  IF v_balance < p_amount THEN
    RAISE EXCEPTION '크레딧이 부족합니다.';
  END IF;

  v_balance := v_balance - p_amount;
  UPDATE public.credits SET balance = v_balance WHERE user_id = v_uid;

  INSERT INTO public.credit_transactions (id, user_id, type, amount, balance_after)
  VALUES (
    to_char(now(), 'YYYYMMDDHH24MISSMS') || substr(md5(random()::text), 1, 6),
    v_uid, 'use', p_amount, v_balance
  );

  RETURN v_balance;
END;
$$;

CREATE OR REPLACE FUNCTION public.add_credits(p_amount INT DEFAULT 1)
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid UUID := auth.uid();
  v_balance INT;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION '인증 필요'; END IF;

  INSERT INTO public.credits (user_id, balance) VALUES (v_uid, 5)
  ON CONFLICT (user_id) DO NOTHING;

  UPDATE public.credits SET balance = balance + p_amount
  WHERE user_id = v_uid
  RETURNING balance INTO v_balance;

  INSERT INTO public.credit_transactions (id, user_id, type, amount, balance_after)
  VALUES (
    to_char(now(), 'YYYYMMDDHH24MISSMS') || substr(md5(random()::text), 1, 6),
    v_uid, 'add', p_amount, v_balance
  );

  RETURN v_balance;
END;
$$;

-- ============================================================
-- 3. 리뷰 등록 시 멘토 평점/리뷰수 자동 집계 + 알림
-- ============================================================
CREATE OR REPLACE FUNCTION public.on_review_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count INT;
  v_avg NUMERIC;
BEGIN
  SELECT COUNT(*), AVG(rating) INTO v_count, v_avg
  FROM public.reviews WHERE mentor_id = NEW.mentor_id;

  UPDATE public.mentor_profiles
  SET review_count = v_count,
      rating = ROUND(COALESCE(v_avg, 0), 2)
  WHERE id = NEW.mentor_id;

  INSERT INTO public.notifications (id, user_id, title, message, type)
  VALUES (
    to_char(now(), 'YYYYMMDDHH24MISSMS') || substr(md5(random()::text), 1, 6),
    NEW.mentor_id, '새 리뷰', '새 리뷰가 등록되었습니다', 'review'
  );

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_review_insert ON public.reviews;
CREATE TRIGGER trg_review_insert
  AFTER INSERT ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.on_review_insert();

-- ============================================================
-- 4. 세션 예약 시 멘토에게 알림
-- ============================================================
CREATE OR REPLACE FUNCTION public.on_session_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.notifications (id, user_id, title, message, type)
  VALUES (
    to_char(now(), 'YYYYMMDDHH24MISSMS') || substr(md5(random()::text), 1, 6),
    NEW.mentor_id, '새 세션 예약',
    '새 세션 예약: ' || COALESCE(NEW.topic, '(주제 없음)'), 'session'
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_session_insert ON public.sessions;
CREATE TRIGGER trg_session_insert
  AFTER INSERT ON public.sessions
  FOR EACH ROW EXECUTE FUNCTION public.on_session_insert();

-- ============================================================
-- 5. 멘토 인증 상태 변경 시 멘토에게 알림
-- ============================================================
CREATE OR REPLACE FUNCTION public.on_mentor_verified()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.verified IS DISTINCT FROM OLD.verified THEN
    INSERT INTO public.notifications (id, user_id, title, message, type)
    VALUES (
      to_char(now(), 'YYYYMMDDHH24MISSMS') || substr(md5(random()::text), 1, 6),
      NEW.id, '러너 인증 결과',
      CASE WHEN NEW.verified THEN '러너 인증이 완료되었습니다' ELSE '러너 인증이 거부되었습니다' END,
      'verification'
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_mentor_verified ON public.mentor_profiles;
CREATE TRIGGER trg_mentor_verified
  AFTER UPDATE ON public.mentor_profiles
  FOR EACH ROW EXECUTE FUNCTION public.on_mentor_verified();

-- ============================================================
-- 6. 분쟁 접수 시 모든 관리자에게 알림
-- ============================================================
CREATE OR REPLACE FUNCTION public.on_dispute_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.notifications (id, user_id, title, message, type)
  SELECT
    to_char(now(), 'YYYYMMDDHH24MISSMSUS') || substr(md5(random()::text || p.id::text), 1, 6),
    p.id, '새 분쟁 신고', '새로운 분쟁이 접수되었습니다: ' || NEW.reason, 'dispute'
  FROM public.profiles p WHERE p.role = 'admin';
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_dispute_insert ON public.disputes;
CREATE TRIGGER trg_dispute_insert
  AFTER INSERT ON public.disputes
  FOR EACH ROW EXECUTE FUNCTION public.on_dispute_insert();

-- ============================================================
-- 7. 관리자 RLS 정책 (Edge Function의 service_role 대체)
--    관리자(role='admin')가 운영에 필요한 테이블을 조회/수정
-- ============================================================
-- disputes: 관리자 전체 조회 + 수정
DROP POLICY IF EXISTS disputes_admin_select ON public.disputes;
CREATE POLICY disputes_admin_select ON public.disputes FOR SELECT TO authenticated USING (public.is_admin());
DROP POLICY IF EXISTS disputes_admin_update ON public.disputes;
CREATE POLICY disputes_admin_update ON public.disputes FOR UPDATE TO authenticated USING (public.is_admin());

-- mentor_profiles: 관리자 인증 처리(verified 업데이트)
DROP POLICY IF EXISTS mentor_profiles_admin_update ON public.mentor_profiles;
CREATE POLICY mentor_profiles_admin_update ON public.mentor_profiles FOR UPDATE TO authenticated USING (public.is_admin());

-- 관리자 통계용 전체 조회
DROP POLICY IF EXISTS sessions_admin_select ON public.sessions;
CREATE POLICY sessions_admin_select ON public.sessions FOR SELECT TO authenticated USING (public.is_admin());
DROP POLICY IF EXISTS reviews_admin_select ON public.reviews;
CREATE POLICY reviews_admin_select ON public.reviews FOR SELECT TO authenticated USING (public.is_admin());
DROP POLICY IF EXISTS credit_tx_admin_select ON public.credit_transactions;
CREATE POLICY credit_tx_admin_select ON public.credit_transactions FOR SELECT TO authenticated USING (public.is_admin());

-- ============================================================
-- 8. 002에서 만든 테이블에 RLS 적용
-- ============================================================
ALTER TABLE public.revenue_withdrawals ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS withdrawals_select ON public.revenue_withdrawals;
CREATE POLICY withdrawals_select ON public.revenue_withdrawals FOR SELECT TO authenticated
  USING (auth.uid() = mentor_id OR public.is_admin());
DROP POLICY IF EXISTS withdrawals_insert ON public.revenue_withdrawals;
CREATE POLICY withdrawals_insert ON public.revenue_withdrawals FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = mentor_id);

ALTER TABLE public.ai_usage_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ai_usage_select ON public.ai_usage_logs;
CREATE POLICY ai_usage_select ON public.ai_usage_logs FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.is_admin());
DROP POLICY IF EXISTS ai_usage_insert ON public.ai_usage_logs;
CREATE POLICY ai_usage_insert ON public.ai_usage_logs FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- 9. RPC 실행 권한
-- ============================================================
GRANT EXECUTE ON FUNCTION public.use_credit(INT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.add_credits(INT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
