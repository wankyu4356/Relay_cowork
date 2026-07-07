# RELAY · AI-Friendly 데이터베이스 설계 제안

> 상태: **제안(Proposal)** — 적용 시 `supabase/migrations/004_*.sql`로 구현.
> 전제: Supabase(Postgres + RLS + pgvector), 프론트 직접 접근 + AI 서버리스(`/api/ai`).

---

## 0. 서비스 재정의 (데이터 관점)

RELAY의 코어 루프는 다음 한 문장으로 요약됩니다.

> **멘티의 "경험"이 → AI에 의해 "문서"로 조립되고 → 러너의 첨삭과 세션을 거쳐 → "합격 결과"로 라벨링된다.**

즉 데이터베이스의 1급 시민(First-class citizen)은 회원도, 결제도 아닌
**① 경험(Experience) ② 문서(Document) ③ 결과(Outcome)** 세 가지이며,
AI-friendly 설계란 이 셋을 **LLM이 바로 소비/생산/학습할 수 있는 형태**로 저장하는 것입니다.

현재 스키마(001~003)의 한계:

| 현재 | 문제 |
|---|---|
| `drafts.ai_data JSONB` 통짜 저장 | 경험이 문서 안에 갇힘 — 재사용·검색·추천 불가 |
| `drafts.content` 단일 필드 | 버전·첨삭 이력 없음 → "무엇이 글을 좋게 만들었나" 학습 불가 |
| `outcomes`가 문서와 미연결 | 합격 라벨이 데이터로 축적되지 않음 |
| AI 호출 기록 없음 (`ai_usage_logs` 골격만) | 재현·평가·비용관리·캐싱 불가 |

---

## 1. AI-Friendly 설계 원칙 6가지

1. **경험의 원자화 (Atomic Experiences)** — 경험 1건 = 자기완결 레코드(STAR 구조).
   LLM 프롬프트에 레코드 단위로 바로 주입 가능해야 하며, 여러 문서·여러 지원처에 재조합된다.
2. **모든 텍스트에 임베딩 동거 (pgvector)** — 경험·문서버전·타겟(학교/기업)·리뷰에
   `embedding vector` 컬럼. 시맨틱 검색(비슷한 합격 사례), 러너-멘티 매칭, RAG의 기반.
3. **AI 산출물 원장 (Generation Ledger)** — 모든 AI 호출을 입력 스냅샷·모델·토큰·산출물과
   함께 기록. 재현성, 비용 대시보드, 프롬프트 A/B, 응답 캐시가 전부 여기서 나온다.
4. **버전 트리 + 출처 라벨** — 문서는 불변 버전의 연결 리스트.
   각 버전에 `source(ai_draft|ai_proofread|user_edit|mentor_edit)`를 남겨
   "AI 초안 → 러너 첨삭 → 합격" 인과 체인을 데이터로 만든다. (플랫폼의 해자)
5. **이벤트 스트림 (Behavioral Signals)** — 조회·클릭·선택·이탈을 append-only 로그로.
   추천 개인화와 "3회 세션 시 합격률 92%" 같은 인사이트의 원천.
6. **컨텍스트 직렬화 함수 (LLM-Ready View)** — `get_user_ai_context(uid)` 한 번 호출로
   유저의 프로필+경험+목표를 **프롬프트에 붙일 수 있는 텍스트**로 반환.
   앱/서버 어디서든 동일한 컨텍스트 조립 → 프롬프트 일관성 + 캐시 적중.

---

## 2. 엔티티 관계 (전체 그림)

```
profiles ─┬─ user_experiences ──── experience_evidence
          │        │ (M:N via document_sources)
          ├─ user_goals ── targets (학교/기업/자격증 마스터)
          │        │
          ├─ documents ── document_versions (버전 트리, source 라벨)
          │        │              │
          │        │        ai_generations (원장) ── ai_feedback
          │        │
          ├─ relay_sessions ── session_notes / reviews
          │        │
          ├─ outcomes  ←─ 문서·목표·세션과 연결 (라벨 루프의 종착점)
          │
          └─ user_events (append-only 행동 로그)

runner_profiles(=mentor_profiles 확장) ── runner_expertise → targets
credits / credit_transactions / conversations / messages / disputes (기존 유지)
```

---

## 3. 신규 테이블 상세

### 3.1 `user_experiences` — 경험 DB의 심장

```sql
create extension if not exists vector;

create table user_experiences (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references profiles(id) on delete cascade,
  category        text not null check (category in ('transfer','admission','career','certification','other')),
  kind            text not null check (kind in ('education','activity','internship','project','award','certificate','work','etc')),

  -- STAR 구조: LLM이 가장 잘 소화하는 서사 단위
  title           text not null,                 -- "글로벌 경영전략 학회 CFA 스터디"
  organization    text,                          -- 소속/기관
  role            text,                          -- 맡은 역할
  period_start    date,
  period_end      date,                          -- null = 진행 중
  situation       text,                          -- S: 배경/맥락
  task            text,                          -- T: 과제/문제
  action          text,                          -- A: 행동 (핵심)
  result          text,                          -- R: 결과 (정성)
  metrics         jsonb default '{}',            -- 정량 성과 {"수상":"대상","참여자":120,"성장률":"+34%"}

  skills          text[] default '{}',           -- 정규화된 스킬 태그
  keywords        text[] default '{}',
  embedding       vector(1536),                  -- title+action+result 임베딩
  source          text not null default 'manual' check (source in ('manual','ai_extracted','imported')),
  visibility      text not null default 'private' check (visibility in ('private','runner_shared')),
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);
create index on user_experiences using hnsw (embedding vector_cosine_ops);
create index on user_experiences (user_id, category);
```

**왜 AI-friendly인가**
- 초안 생성 시 "이 지원처에 가장 관련 있는 경험 top-k"를 임베딩 검색으로 선별 → 프롬프트 토큰 절약 + 품질 상승.
- `AIExperienceInput`의 자유 서술을 `/api/ai`의 신규 `extract` 모드가 STAR로 구조화해 저장(`source='ai_extracted'`) — 입력 UX는 자유텍스트, 저장은 구조화.
- 한 번 입력한 경험이 편입 학업계획서에도, 취업 자소서에도 재조립됨 (현재 앱의 가장 큰 데이터 낭비 해소).

### 3.2 `targets` + `user_goals` — 지원처 마스터와 목표

```sql
create table targets (
  id          uuid primary key default gen_random_uuid(),
  category    text not null,
  type        text not null check (type in ('university','company','certification','program')),
  name        text not null,                      -- "연세대학교"
  detail      jsonb default '{}',                 -- {전형: [...], 모집요강: ..., 직무: ...}
  embedding   vector(1536),                       -- 인재상/요강 임베딩
  unique (type, name)
);

create table user_goals (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references profiles(id) on delete cascade,
  target_id   uuid not null references targets(id),
  sub_target  text,                               -- 학과/직무/전형
  priority    int default 1,
  due_date    date,
  status      text default 'active' check (status in ('active','achieved','failed','paused')),
  created_at  timestamptz default now()
);
```

**왜**: 지원처가 문자열이 아닌 엔티티가 되면 — 같은 목표를 가진 익명 통계("연세대 경영 지원자 87% 합격"), 러너 매칭(`runner_expertise → targets`), 요강 RAG가 조인 한 번으로 가능.

### 3.3 `documents` + `document_versions` — 버전 트리

```sql
create table documents (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references profiles(id) on delete cascade,
  goal_id       uuid references user_goals(id) on delete set null,
  doc_type      text not null check (doc_type in ('study_plan','cover_letter','portfolio','resume','etc')),
  title         text not null,
  current_version_id uuid,                        -- FK는 뒤에서 alter로
  status        text default 'draft' check (status in ('draft','in_review','final','submitted')),
  created_at    timestamptz default now()
);

create table document_versions (
  id            uuid primary key default gen_random_uuid(),
  document_id   uuid not null references documents(id) on delete cascade,
  parent_version_id uuid references document_versions(id),
  content       text not null,
  word_count    int generated always as (char_length(content)) stored,
  source        text not null check (source in ('ai_draft','ai_proofread','user_edit','mentor_edit')),
  editor_id     uuid references profiles(id),     -- mentor_edit일 때 러너
  generation_id uuid,                             -- ai_* 버전이면 원장 연결
  analysis      jsonb,                            -- {"structure":85,...,"comment":"...", "analyzed_by":"ai"}
  used_experience_ids uuid[] default '{}',        -- 이 버전에 쓰인 경험들 (계보!)
  embedding     vector(1536),
  created_at    timestamptz default now()
);
```

**왜**: `used_experience_ids` + `source` 체인으로 **"어떤 경험을 어떻게 서술했더니 합격했는가"**가 질의 가능한 데이터가 됨. 러너 첨삭 diff(parent와 비교)는 그 자체가 고품질 학습 데이터.

### 3.4 `ai_generations` + `ai_feedback` — AI 원장

```sql
create table ai_generations (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references profiles(id) on delete cascade,
  mode          text not null,                    -- storylines|draft|proofread|analyze|advice|extract
  model         text not null,                    -- 'claude-opus-4-8'
  input_refs    jsonb not null default '{}',      -- {goal_id, doc_version_id, experience_ids[], instruction}
  input_hash    text not null,                    -- 동일 입력 캐시 키
  output_text   text,
  output_json   jsonb,
  prompt_tokens int, output_tokens int, latency_ms int,
  status        text default 'ok' check (status in ('ok','error','refusal')),
  error         text,
  created_at    timestamptz default now()
);
create index on ai_generations (user_id, mode, created_at desc);
create index on ai_generations (input_hash);

create table ai_feedback (
  generation_id uuid primary key references ai_generations(id) on delete cascade,
  rating        int check (rating between 1 and 5),
  accepted      boolean,                          -- 유저가 결과를 채택했는가 (선택=강한 신호)
  edited_ratio  numeric,                          -- 채택 후 수정 비율 (작을수록 좋은 생성)
  created_at    timestamptz default now()
);
```

**왜**: `input_hash`로 동일 요청 캐시(비용↓ 지연↓), `accepted/edited_ratio`는 사람이 라벨링하지 않아도 쌓이는 **암묵적 RLHF 신호**. `/api/ai`가 생성 후 이 테이블에 한 줄 쓰도록 확장하면 끝.

### 3.5 `outcomes` 확장 — 라벨 루프의 종착점

```sql
alter table outcomes
  add column goal_id     uuid references user_goals(id),
  add column document_id uuid references documents(id),
  add column session_ids text[] default '{}',
  add column verified    boolean default false;   -- 합격증 인증 여부
```

**왜**: 합격/불합격이 목표·문서·세션에 연결되는 순간, "AI 초안+러너 첨삭 2회+세션 3회 → 합격률 92%"가 마케팅 카피가 아니라 **실측 쿼리**가 된다. `verified=true` 데이터만 골라 추천 모델·프롬프트 few-shot의 근거로 사용.

### 3.6 `user_events` — 행동 신호 (append-only)

```sql
create table user_events (
  id          bigint generated always as identity primary key,
  user_id     uuid not null,
  event_type  text not null,        -- view_runner | select_storyline | book_session | abandon_draft ...
  entity_type text, entity_id text,
  props       jsonb default '{}',
  created_at  timestamptz default now()
);
create index on user_events using brin (created_at);
create index on user_events (user_id, event_type);
```

### 3.7 `get_user_ai_context(uid)` — LLM-Ready 직렬화 (핵심 장치)

```sql
create or replace function get_user_ai_context(p_user uuid)
returns text language sql stable security definer as $$
  select concat_ws(E'\n',
    '## 지원자 프로필',
    (select concat('이름(익명): 멘티 #', right(id::text, 4), ' / 카테고리 목표: ',
       string_agg(t.name || coalesce(' ' || g.sub_target, ''), ', '))
       from user_goals g join targets t on t.id = g.target_id
       where g.user_id = p_user and g.status = 'active'),
    E'\n## 보유 경험 (STAR)',
    (select string_agg(format(E'- [%s] %s (%s, %s~%s)\n  상황: %s\n  행동: %s\n  결과: %s %s',
        e.kind, e.title, coalesce(e.role,''), e.period_start, coalesce(e.period_end::text,'현재'),
        coalesce(e.situation,''), coalesce(e.action,''), coalesce(e.result,''), e.metrics::text
      ), E'\n' order by e.period_end desc nulls first)
      from user_experiences e where e.user_id = p_user)
  );
$$;
```

프론트의 `describeProfile()`(현재 `/api/ai`에 하드코딩)이 이 함수 호출로 대체되어
**컨텍스트 조립 로직이 DB 한 곳**에 모인다. 프롬프트 캐시 관점에서도 안정 프리픽스가 됨.

---

## 4. 기존 테이블 정비

| 테이블 | 조치 |
|---|---|
| `mentor_profiles` → `runner_profiles` 뷰 별칭 | `expertise text[]` → `runner_expertise(runner_id, target_id, sub_target, verified)` 조인 테이블로 승격 (임베딩 매칭 대상) |
| `drafts` | 신규 `documents/document_versions`로 이관 후 폐기 (마이그레이션 스크립트 포함) |
| `sessions` | `goal_id` 컬럼 추가 — 세션이 어떤 목표를 위한 것인지 라벨 |
| `reviews` | `embedding` 추가 — "나와 비슷한 상황의 후기" 시맨틱 검색 |
| `ai_usage_logs` | `ai_generations`로 흡수·폐기 |
| PII | `profiles.email` 등은 그대로 RLS 보호, **임베딩·컨텍스트 함수에는 실명/이메일 절대 미포함** (익명 번호만) — AI 파이프라인에 PII가 새지 않는 구조적 보장 |

## 5. RLS 요약

- `user_experiences / user_goals / documents / document_versions / ai_generations / ai_feedback / user_events`: **본인만 CRUD** (`auth.uid() = user_id`).
- `document_versions`의 `mentor_edit`: 해당 문서가 공유된 세션의 러너에게만 insert 허용 (`exists` 서브쿼리 정책).
- `targets`: 전체 읽기 / 쓰기는 service role.
- 집계·학습용 접근은 service role 전용 뷰(`v_labeled_documents` 등)로 분리 — 익명화된 컬럼만 노출.

## 6. 적용 로드맵

| 단계 | 내용 | 앱 변경 |
|---|---|---|
| **M1** | `user_experiences` + `extract` AI 모드 | AIExperienceInput 저장 연결 (입력 UX 동일) |
| **M2** | `documents/document_versions` + drafts 이관 | AIDraftEditor 저장/버전 목록 |
| **M3** | `ai_generations` 기록 (+input_hash 캐시) | `/api/ai`에 5줄 추가 |
| **M4** | `targets/user_goals` + outcomes 연결 | 온보딩·결과보고 연결 |
| **M5** | pgvector 임베딩 배치 + 시맨틱 추천 | 러너 매칭·경험 선별 고도화 |

각 단계는 독립 배포 가능하며 M1~M3만으로도 "경험 재사용 + AI 원장"이라는 핵심 가치가 나옵니다.
