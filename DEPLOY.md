# RELAY 실제 배포 가이드 (Vercel + Supabase 직접 연동)

이 앱은 **Vercel(프론트엔드) + Supabase(Auth · Postgres, RLS)** 로 동작합니다.
별도의 Edge Function 서버 없이 프론트엔드가 supabase-js로 DB에 직접 접근하며,
RLS를 우회해야 하는 로직(가입 프로비저닝, 크레딧 가감, 알림, 리뷰 집계, 관리자 조회)은
`supabase/migrations/003_direct_client_setup.sql` 의 트리거 · RPC · 정책으로 처리됩니다.

소요 시간: 약 15분.

---

## 1. Supabase 프로젝트 생성

1. https://supabase.com → **New project** 생성 (리전은 `Northeast Asia (Seoul)` 권장)
2. 데이터베이스 비밀번호를 안전하게 저장
3. 프로젝트가 준비되면 **Project Settings → API** 에서 두 값을 복사
   - **Project URL**: `https://<project-ref>.supabase.co`
   - **anon public** key (이 키는 공개되어도 안전 — RLS가 보호)

## 2. 데이터베이스 스키마 적용

**SQL Editor** 에서 아래 3개 파일을 **순서대로** 복사·실행합니다.

1. `supabase/migrations/001_initial_schema.sql` — 테이블 + RLS
2. `supabase/migrations/002_add_category_and_revenue.sql` — 카테고리/수익/AI 로그
3. `supabase/migrations/003_direct_client_setup.sql` — 트리거 · 크레딧 RPC · 관리자 정책

> Supabase CLI를 쓴다면: `supabase link --project-ref <ref>` 후 `supabase db push`.

## 3. 인증(Auth) 설정

**Authentication → Providers → Email**
- **Confirm email**: 데모/초기에는 **꺼두면**(off) 가입 즉시 로그인됩니다.
  실서비스로 전환 시 켜고, 메일 템플릿/SMTP를 설정하세요.

**Authentication → URL Configuration**
- **Site URL**: 배포 후 Vercel 도메인 (예: `https://relay.vercel.app`)
- **Redirect URLs**: 같은 도메인과 `http://localhost:3000` (로컬 개발용) 추가

## 4. 관리자 계정 지정 (선택)

관리자 화면(분쟁 관리 · 멘토 승인 · 통계)을 쓰려면, 먼저 일반 가입한 뒤
SQL Editor에서 해당 계정의 role을 admin으로 변경합니다.

```sql
update public.profiles set role = 'admin' where email = 'you@example.com';
```

## 5. Vercel 배포

1. https://vercel.com → **Add New → Project** → 이 GitHub 저장소 import
2. 프레임워크 프리셋은 자동 감지(Vite). 빌드 설정은 `vercel.json` 에 이미 있음
   - Build Command: `npm run build` · Output: `build`
3. **Environment Variables** 에 2개 추가 (Production + Preview 모두):
   - `VITE_SUPABASE_URL` = `https://<project-ref>.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `<anon public key>`
4. **Deploy** → 발급된 도메인을 3단계의 Site URL / Redirect URLs에 반영

## 6. 로컬 개발

```bash
cp .env.example .env      # 값을 본인 프로젝트 키로 채우기
npm install
npm run dev               # http://localhost:3000
```

---

## 동작 방식 메모

- **가입**: `supabase.auth.signUp` → `auth.users` INSERT 트리거(`handle_new_user`)가
  `profiles` + `credits`(기본 5크레딧) 자동 생성.
- **크레딧**: `use_credit` / `add_credits` RPC가 원자적으로 잔액을 갱신하고
  `credit_transactions` 에 기록.
- **리뷰**: INSERT 트리거가 멘토 `rating`/`review_count` 재계산 + 멘토에게 알림.
- **세션 예약 / 분쟁 / 멘토 인증**: 트리거가 상대방·관리자에게 알림 생성
  (RLS 때문에 클라이언트가 남의 알림을 직접 못 만들므로 SECURITY DEFINER 트리거 사용).
- **관리자**: `is_admin()` 기반 RLS 정책으로 disputes/sessions/reviews 전체 조회 및
  분쟁·멘토 인증 수정 권한 부여.

## 한계 / 다음 단계

- **결제**: 크레딧 구매는 현재 가상(`add_credits`). 실결제는 Toss/Stripe 등 PG 연동 필요.
- **AI 생성**: 스토리라인/초안은 클라이언트 목업입니다. 실제 LLM을 쓰려면
  Anthropic API 호출을 **서버(예: Supabase Edge Function 또는 Vercel Serverless)** 에 두고
  키를 노출하지 않도록 하세요. (`ai_usage_logs` 테이블이 사용량 기록용으로 준비돼 있음)
- `src/supabase/functions/server/` 의 기존 Hono Edge Function은 더 이상 사용하지 않습니다
  (참고용으로 남겨둠 — 삭제해도 무방).
