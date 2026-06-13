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
3. **Environment Variables** 에 추가 (Production + Preview 모두):
   - `VITE_SUPABASE_URL` = `https://<project-ref>.supabase.co` (브라우저 노출)
   - `VITE_SUPABASE_ANON_KEY` = `<anon public key>` (브라우저 노출)
   - `ANTHROPIC_API_KEY` = `sk-ant-...` (**서버 전용 · VITE_ 접두사 없음** — AI 첨삭용)
4. **Deploy** → 발급된 도메인을 3단계의 Site URL / Redirect URLs에 반영

## 6. AI 첨삭 (실제 Claude 연동)

AI 스토리라인·초안·첨삭은 **Vercel Serverless Function `/api/ai`** 가 서버에서
Anthropic Claude(`claude-opus-4-8`)를 호출해 결과를 **스트리밍**합니다.
API 키는 서버에만 있고 브라우저 번들에는 절대 포함되지 않습니다.

- `ANTHROPIC_API_KEY` 를 Vercel 환경변수(서버 전용)에 등록하면 자동 활성화됩니다.
- 키가 없거나 함수가 없으면(예: 로컬 `npm run dev`) **목업으로 자동 폴백**하므로
  앱은 항상 동작합니다.
- 동작 위치: `AI 초안 작성` 화면의 초안 생성 + 편집 도구(문단 재생성/톤 변경/
  더 구체적으로/더 간결하게)와 `재생성` 버튼이 실제 AI 첨삭을 호출합니다.
- 비용/지연 조절: `api/ai.ts` 의 `effort`(low/medium/high)와 `max_tokens` 로 조정.

## 7. 로컬 개발

```bash
cp .env.example .env      # 값을 본인 키로 채우기
npm install
npm run dev               # http://localhost:3000 (프론트만 — /api 미동작, AI는 목업)

# AI 첨삭까지 로컬에서 테스트하려면 Vercel CLI 사용:
npx vercel dev            # /api/ai 서버리스 함수 포함 실행
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
- **AI 생성**: ✅ 구현됨 — `/api/ai` 서버리스 함수가 실제 Claude를 호출(위 6단계).
  키 미설정 시에는 목업으로 폴백. (사용량 로깅을 원하면 `ai_usage_logs` 테이블 활용)
- `src/supabase/functions/server/` 의 기존 Hono Edge Function은 더 이상 사용하지 않습니다
  (참고용으로 남겨둠 — 삭제해도 무방).
