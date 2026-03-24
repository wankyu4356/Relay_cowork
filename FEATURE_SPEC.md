# Relay Cowork - 구조화된 기능 정의서

> 분석 기준일: 2026-03-24 | 총 컴포넌트: 118개 .tsx | 스크린: 35개

---

## 1. 플랫폼 개요

**릴레이(Relay)** - 카테고리 기반 멘토링 + AI 문서 작성 플랫폼

- **사용자 유형**: 멘티(Mentee), 러너/멘토(Mentor), 관리자(Admin)
- **카테고리**: 편입, 입시, 취업, 자격증, 기타
- **기술 스택**: React + TypeScript + Tailwind CSS + Supabase (Auth/DB/Edge Functions) + Hono.js

---

## 2. 사용자 역할별 기능

### 2-1. 멘티 (Mentee)

| 기능 | 스크린 | 컴포넌트 | 상태 |
|------|--------|---------|------|
| 회원가입/로그인 | `auth` | AuthScreen | ✅ 완료 |
| 역할 선택 | `onboarding` | Onboarding | ✅ 완료 |
| 멘티 온보딩 (3단계) | `mentee-onboarding` | MenteeOnboarding | ✅ 완료 |
| 메인 홈 대시보드 | `unified-home` | UnifiedHome | ✅ 완료 |
| AI 경험 입력 (다단계 폼) | `ai-experience` | AIExperienceInput | ✅ 완료 |
| AI 스토리라인 선택 | `ai-storyline` | AIStoryline | ✅ UI완료 (AI 미연동) |
| AI 초안 에디터 | `ai-draft` | AIDraftEditor | ✅ UI완료 (AI 미연동) |
| AI 초안 관리 | `ai-management` | AIManagement | ✅ 완료 |
| AI 맞춤 추천 | `ai-recommendation` | AIRecommendation | ✅ UI완료 (목데이터) |
| 러너 검색/필터 | `mentor-search` | MentorSearch | ✅ 완료 |
| 러너 프로필 | `mentor-profile` | MentorProfile | ✅ 완료 |
| 릴레이 네트워크 시각화 | `mentor-network` | MentorNetwork | ✅ 완료 |
| 세션 예약 | `session-booking` | SessionBooking | ✅ 완료 |
| 세션 목록 | `session-list` | SessionList | ✅ 완료 |
| 세션 상세 | `session-detail` | SessionDetail | ✅ 완료 |
| 세션 워크스페이스 | `session-workspace` | SessionWorkspace | ⚠️ UI만 (WebRTC 미구현) |
| 리뷰 작성 | `review-write` | ReviewWrite | ✅ 완료 |
| 성과 리포트 | `outcome-report` | OutcomeReport | ✅ 완료 |
| 크레딧 구매 | `credit-purchase` | CreditPurchase | ⚠️ UI만 (PG 미연동) |
| 메시지 센터 | `message-center` | MessageCenter | ✅ 완료 (실시간 미구현) |
| 알림 센터 | `notifications` | NotificationCenter | ✅ 완료 |
| 설정 | `settings` | Settings | ✅ 완료 |

### 2-2. 러너/멘토 (Mentor)

| 기능 | 스크린 | 컴포넌트 | 상태 |
|------|--------|---------|------|
| 멘토 인증 | `mentor-verification` | MentorVerification | ✅ 완료 |
| 멘토 대시보드 | `mentor-dashboard` | MentorDashboard | ✅ 완료 |
| 멘티 목록 | `mentor-mentee-list` | MentorMenteeList | ✅ 완료 |
| 리뷰 관리 | `mentor-reviews` | MentorReviews | ✅ 완료 |
| EA 위자드 (자소서 가이드) | `mentor-ea-wizard` | MentorEAWizard | ✅ 완료 |
| 스케줄 관리 | `mentor-schedule` | MentorSchedule | ✅ 완료 |
| 수익 관리 | `mentor-revenue` | MentorRevenue | ⚠️ UI만 (출금 미구현) |
| 성과 통계 | `mentor-stats` | MentorStats | ✅ 완료 |

### 2-3. 관리자 (Admin)

| 기능 | 스크린 | 컴포넌트 | 상태 |
|------|--------|---------|------|
| 관리자 대시보드 | `admin-dashboard` | AdminDashboard | ✅ 완료 |
| 멘토 승인/거절 | `admin-mentor-approval` | AdminMentorApproval | ✅ 완료 |
| 분쟁 관리 | `admin-dispute-management` | AdminDisputeManagement | ✅ 완료 |
| AI 서비스 관리 | `admin-ai-service-management` | AdminAIServiceManagement | ✅ 완료 |

---

## 3. 카테고리 시스템

### 3-1. 5대 카테고리 정의

| 카테고리 | key | 테마 컬러 | AI 문서 타입 | 러너 호칭 | 평균 성공률 |
|---------|-----|----------|------------|----------|-----------|
| 편입 | `transfer` | Indigo/Purple | AI 학업계획서 | 합격 러너 | 87% |
| 입시 | `admission` | Blue/Sky | AI 자소서 | 입시 선배 | 84% |
| 취업 | `career` | Slate/Zinc | AI 자소서/이력서 | 현직자 러너 | 81% |
| 자격증 | `certification` | Amber/Orange | AI 포트폴리오 | 합격자 러너 | 78% |
| 기타 | `other` | Rose/Pink | AI 문서 | 경험자 러너 | 76% |

### 3-2. 카테고리가 영향을 미치는 요소

- **홈 화면**: 인사말, 배경 그라데이션, CTA 카드, Quick Stats
- **AI 폼 필드**: field1/field2 레이블 (대학/전공 vs 회사/직무 등)
- **러너 목록**: 카테고리별 12명 목데이터 + 필터 옵션
- **사이드바**: 카테고리 전용 메뉴 2개씩
- **추천 엔진**: 카테고리별 추천 데이터 + 폼 + 결과

### 3-3. 카테고리별 전용 화면 (Placeholder)

| 카테고리 | 전용 메뉴 1 | 전용 메뉴 2 |
|---------|------------|------------|
| 편입 | 편입 요강 (`admission-guide`) | 합격 예측 (`grade-prediction`) |
| 입시 | 생기부 관리 (`transcript-manager`) | 수시/정시 전략 (`admission-strategy`) |
| 취업 | 포지션 보드 (`job-board`) | 면접 연습 (`mock-interview`) |
| 자격증 | 시험 일정 (`exam-calendar`) | 학습 플래너 (`study-planner`) |
| 기타 | 로드맵 (`roadmap`) | 경험 공유 (`community`) |

> 모두 `CategoryFeaturePlaceholder` 컴포넌트로 "준비 중" 표시

---

## 4. 핵심 기능 상세

### 4-1. AI 문서 작성 파이프라인

**흐름**: `ai-experience` → `ai-storyline` → `ai-draft` → `ai-management`

**Step 1 - 경험 입력** (`AIExperienceInput`)
- 3단계 폼: 기본정보 → 동기/활동/키워드 → AI 설정(톤/분량)
- 크레딧 1개 차감
- 출력: `AIData { university, major, motivation, activities[], keywords[], tone, wordCount }`

**Step 2 - 스토리라인 선택** (`AIStoryline`)
- AI가 3개 스토리라인 생성 (현재 목데이터)
- 각 스토리라인: title, message, structure, strength, materials
- 재생성 / 선택 진행

**Step 3 - 초안 편집** (`AIDraftEditor`)
- AI 초안 타이핑 애니메이션
- 분석 점수: 구조, 구체성, 독창성, 관련성
- 다운로드/재생성/저장/멘토 연결

**Step 4 - 초안 관리** (`AIManagement`)
- 저장된 초안 목록 (대학/전공, 날짜, 글자수, 상태)
- 편집/삭제/멘토 공유/PDF 내보내기

### 4-2. AI 맞춤 추천 엔진

**흐름**: `ai-recommendation` → 카테고리별 Form → AnalyzingAnimation → Results

**카테고리별 서브컴포넌트**:
- `TransferRecommendation` / `TransferForm` / `TransferResults`
- `AdmissionRecommendation` / `AdmissionForm` / `AdmissionResults`
- `CareerRecommendation` / `CareerForm` / `CareerResults`
- `CertificationRecommendation` / `CertificationForm` / `CertificationResults`
- `OtherRecommendation` / `OtherForm` / `OtherResults`

**공통 출력**: 4개 추천 (매칭률 80~94%) + 대안 + 다음 단계 3개

### 4-3. 러너(멘토) 시스템

**검색 & 필터** (`MentorSearch`):
- 대학/회사별, 배지별, 가격대별, 정렬(평점/가격/성공률)
- 카테고리별 12명 목데이터 (`categoryMentors.ts`)

**프로필** (`MentorProfile`):
- 탭: About / Reviews / Timeline
- 빠른 통계: 평점, 세션수, 리뷰수, 성공률
- 릴레이 네트워크 거리 표시
- 예약 버튼 → `session-booking`

**네트워크** (`MentorNetwork`):
- 릴레이 체인 시각화 (멘토→멘티→멘토 연결 그래프)

### 4-4. 세션 관리

**예약** (`SessionBooking`):
- 달력 날짜 선택 + 시간 슬롯
- 30분 (65% 가격) / 60분 선택
- 요청 메모, 문서 공유 체크, 결제 수단

**워크스페이스** (`SessionWorkspace`):
- 영상/음성 컨트롤 UI (WebRTC 미구현)
- 화면 공유, 문서 패널, 채팅 패널, 타이머

**목록/상세** (`SessionList`, `SessionDetail`):
- 탭: 예정/완료/취소
- 취소, 일정 변경, 메시지, 리뷰 작성 액션

### 4-5. 크레딧 & 결제 시스템

**크레딧 패키지** (`CreditPurchase`):

| 패키지 | 가격 | 할인율 | 비고 |
|--------|------|--------|------|
| 1 크레딧 | 15,000₩ | - | 첫 구매용 |
| 3 크레딧 | 39,000₩ | 13% | - |
| 5 크레딧 | 59,000₩ | 21% | 인기 |
| 10 크레딧 | 99,000₩ | 34% | 최고 가성비 |

- 1 크레딧 = AI 문서 생성 1회
- 신규 가입 시 5 크레딧 지급
- PG 결제 연동 미구현 (잔액 직접 업데이트)

**멘토 가격 티어** (`pricing.ts`):

| 티어 | 조건 | 가격 범위 | 플랫폼 수수료 |
|------|------|----------|-------------|
| 🥉 Bronze | 0+ 세션 | 15,000~30,000₩ | 25% |
| 🥈 Silver | 11+ 세션, 8+ 리뷰, 4.5+ 평점 | 30,000~50,000₩ | 22% |
| 🥇 Gold | 31+ 세션, 21+ 리뷰, 4.7+ 평점 | 50,000~80,000₩ | 18% |
| 💎 Platinum | 61+ 세션, 35+ 리뷰, 4.8+ 평점 | 80,000~120,000₩ | 15% |

### 4-6. 메시징 시스템

**MessageCenter**:
- 대화 목록 (마지막 메시지, 읽지 않은 수)
- 메시지 스레드 (읽음 확인 UI)
- 이모지 피커 (24종), 파일 첨부 UI
- 대화 삭제/차단 메뉴

### 4-7. 관리자 기능

- **대시보드**: KPI (총 사용자/활성 멘토/총 세션/월 매출), AI 사용량 차트
- **멘토 승인**: 보류/승인/거절 탭, 서류 확인, 사유 입력
- **분쟁 관리**: 유형(환불/행동/사기), 우선순위, 타임라인, 상태 워크플로
- **AI 서비스 관리**: 모델 설정, 크레딧 정책, 사용량 분석

---

## 5. 네비게이션 구조

### 5-1. 사이드바 (GlobalNav - 데스크톱)

```
📂 카테고리 드롭다운 (편입/입시/취업/자격증/기타)
─────────────────────
🏠 홈 (unified-home / mentor-dashboard)
🤖 AI 초안 (ai-management) ← 멘티 전용
👥 릴레이 러너 / 내 러너 (mentor-search / mentor-mentee-list)
📅 릴레이 세션 / 릴레이 관리 (session-list)
💬 릴레이 톡 (message-center)
─────────────────────
📋 [카테고리 전용 메뉴 1]
📊 [카테고리 전용 메뉴 2]
─────────────────────
🔄 경험 넘기기/받기 (역할 전환)
🔔 알림 | ⚙️ 설정
```

### 5-2. 하단 탭바 (BottomNav - 모바일)

```
🏠 홈 | 🤖 AI | 👥 러너 | 📅 세션 | 👤 내 정보
```

---

## 6. 데이터 모델 (주요 타입)

### UserProfile
```ts
{ id, email, name, role: 'mentee'|'mentor'|'admin',
  onboardingCompleted, avatar, profile: Record<string, unknown> }
```

### Mentor
```ts
{ id, name: '러너 #XXXX', university, major, year, rating,
  reviews, sessions, successRate, responseTime, price,
  badge: 'platinum'|'gold'|'silver'|'bronze', verified, avatar }
```

### Session
```ts
{ id, mentorId, mentorName, mentorAvatar, date, time,
  duration, price, status: 'upcoming'|'ongoing'|'completed'|'cancelled' }
```

### AIData
```ts
{ university, major, motivation, activities: [{name, role, period, achievement}],
  keywords: string[], tone: 'sincere'|'academic'|'balanced', wordCount }
```

### Storyline
```ts
{ id, title, message, structure, strength, materials }
```

---

## 7. 백엔드 API 엔드포인트

### 인증
| Method | Endpoint | 설명 |
|--------|----------|------|
| - | `supabase.auth.signUp` | 회원가입 |
| - | `supabase.auth.signIn` | 로그인 |
| - | `supabase.auth.signOut` | 로그아웃 |

### 프로필 & 크레딧
| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/profile` | 프로필 조회 |
| PUT | `/profile` | 프로필 수정 |
| GET | `/credits` | 크레딧 잔액 |
| POST | `/credits/use` | 크레딧 차감 |
| POST | `/credits/add` | 크레딧 충전 |

### AI 초안
| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/drafts` | 초안 목록 |
| POST | `/drafts` | 초안 생성 |
| PUT | `/drafts/:id` | 초안 수정 |
| DELETE | `/drafts/:id` | 초안 삭제 |

### 세션
| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/sessions` | 세션 목록 |
| POST | `/sessions` | 세션 예약 |
| PUT | `/sessions/:id` | 세션 수정 |
| DELETE | `/sessions/:id` | 세션 취소 |

### 멘토
| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/mentors` | 멘토 목록 |
| POST | `/mentors/register` | 멘토 등록 |
| GET | `/mentors/:id/schedule` | 스케줄 조회 |
| PUT | `/mentors/schedule` | 스케줄 수정 |
| GET | `/mentors/revenue` | 수익 조회 |
| POST | `/mentors/revenue/withdraw` | 출금 요청 |
| PUT | `/mentors/:id/verify` | 멘토 승인/거절 |

### 메시징 & 알림
| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/messages` | 메시지 전송 |
| GET | `/conversations` | 대화 목록 |
| GET | `/messages/:conversationId` | 메시지 조회 |
| GET | `/notifications` | 알림 목록 |
| PUT | `/notifications/:id/read` | 읽음 처리 |

### 관리자
| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/admin/stats` | 플랫폼 통계 |
| GET | `/admin/mentors/pending` | 미승인 멘토 |
| GET | `/admin/disputes` | 분쟁 목록 |
| PUT | `/admin/disputes/:id` | 분쟁 처리 |

---

## 8. 주요 사용자 흐름 (User Flow)

### 멘티 핵심 흐름
```
가입 → 역할선택(멘티) → 온보딩(학교/목표/학점) → 홈
  ├→ AI 문서: 경험입력 → 스토리라인 → 초안편집 → 초안관리
  ├→ AI 추천: 카테고리별 폼 → 분석 → 추천결과
  ├→ 러너: 검색/필터 → 프로필 → 세션예약 → 워크스페이스 → 리뷰
  └→ 기타: 메시지, 알림, 설정, 크레딧 구매
```

### 멘토 핵심 흐름
```
가입 → 역할선택(러너) → 인증(서류/이메일/전화) → 멘토 대시보드
  ├→ 멘티관리: 멘티목록 → EA위자드
  ├→ 스케줄: 가능시간 설정
  ├→ 수익: 수익조회 → 출금요청
  └→ 통계: 성과분석, 리뷰확인
```

### 관리자 핵심 흐름
```
로그인 → 관리자 대시보드
  ├→ 멘토승인: 보류목록 → 서류확인 → 승인/거절
  ├→ 분쟁관리: 분쟁목록 → 조사 → 해결/기각
  └→ AI관리: 서비스 설정, 사용량 모니터링
```

---

## 9. 설정 파일 & 데이터 소스

| 파일 | 역할 |
|------|------|
| `src/lib/categoryContent.ts` | 카테고리별 UI 텍스트/테마/사이드바/카드/Quick Stats |
| `src/lib/categoryMentors.ts` | 카테고리별 멘토 목데이터 (12명×5) |
| `src/lib/categoryRecommendations.ts` | 카테고리별 추천 설정/결과 |
| `src/lib/categoryStats.ts` | 카테고리별 성공률/기관/월별 트렌드 |
| `src/lib/pricing.ts` | 멘토 티어/가격/수수료 계산 |
| `src/lib/runnerUtils.ts` | 러너 아바타/색상/이니셜 생성 |
| `src/lib/recommendation-data/*.ts` | 카테고리별 추천 상세 데이터 |
| `src/components/api.tsx` | API 클라이언트 (Supabase + Edge Function) |
| `src/supabase/functions/server/index.tsx` | 백엔드 서버 (Hono, 35+ 엔드포인트) |

---

## 10. 미구현/Placeholder 항목

| 항목 | 현재 상태 | 필요 작업 |
|------|----------|----------|
| AI 실제 생성 | 템플릿 텍스트 반환 | LLM API 연동 (Claude/GPT) |
| 영상 통화 | UI만 존재 | WebRTC/Daily.co 등 연동 |
| PG 결제 | 잔액 직접 업데이트 | Toss Payments/카카오페이 연동 |
| 멘토 출금 | 요청만 저장 | 정산 시스템 구축 |
| 실시간 메시징 | REST 기반 | Supabase Realtime 구독 |
| 읽음 확인 | UI만 표시 | 백엔드 추적 로직 |
| 파일 업로드 | UI만 존재 | Supabase Storage 연동 |
| 카테고리 전용 10개 화면 | Placeholder | 각 기능 실제 구현 |
| 환경변수 | 하드코딩 (`info.tsx`) | `.env` 파일 분리 |

---

## 11. 커스텀 훅

| 훅 | 반환값 | 역할 |
|----|--------|------|
| `useDataService` | `fetchWithFallback<T>()` | API 호출 → 실패 시 목데이터 폴백 |
| `useSessions` | `{ sessions, loading, error, refetch, cancelSession }` | 세션 CRUD |
| `useDrafts` | `{ drafts, loading, deleteDraft, refetch }` | AI 초안 관리 |
| `useMentors` | `{ mentors, loading, error, isFromApi, refetch }` | 멘토 목록 |
| `useNotifications` | `{ notifications, loading, unreadCount, markAsRead, refetch }` | 알림 관리 |

---

## 12. UI 컴포넌트 라이브러리 (shadcn/ui)

**폼**: button, input, textarea, label, form, select, checkbox, radio-group, toggle
**레이아웃**: card, sidebar, tabs, accordion, collapsible, separator, scroll-area
**다이얼로그**: dialog, alert-dialog, drawer, dropdown-menu, popover, hover-card, sheet
**표시**: badge, avatar, progress, pagination, breadcrumb, table, carousel
**고급**: chart, calendar, command, slider, resizable, navigation-menu, menubar, sonner(토스트)
