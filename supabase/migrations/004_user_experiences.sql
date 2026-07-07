-- ============================================================
-- M1: 경험 DB (user_experiences) — AI-friendly 원자화된 경험 저장
-- 경험 1건 = STAR 구조의 자기완결 레코드 + pgvector 임베딩
-- ============================================================

create extension if not exists vector;

create table if not exists user_experiences (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references profiles(id) on delete cascade,
  category        text not null check (category in ('transfer','admission','career','certification','other')),
  kind            text not null default 'activity'
                  check (kind in ('education','activity','internship','project','award','certificate','work','etc')),

  -- STAR 구조: LLM이 가장 잘 소화하는 서사 단위
  title           text not null,
  organization    text,
  role            text,
  period_start    date,
  period_end      date,                       -- null = 진행 중
  situation       text,
  task            text,
  action          text,
  result          text,
  metrics         jsonb not null default '{}',

  skills          text[] not null default '{}',
  keywords        text[] not null default '{}',
  -- voyage-3-lite 기준 1024차원 (임베딩은 M5에서 배치 생성)
  embedding       vector(1024),
  source          text not null default 'manual' check (source in ('manual','ai_extracted','imported')),
  visibility      text not null default 'private' check (visibility in ('private','runner_shared')),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists idx_user_experiences_user_cat on user_experiences (user_id, category);
create index if not exists idx_user_experiences_embedding
  on user_experiences using hnsw (embedding vector_cosine_ops);

-- 증빙 (파일/링크)
create table if not exists experience_evidence (
  id             uuid primary key default gen_random_uuid(),
  experience_id  uuid not null references user_experiences(id) on delete cascade,
  kind           text not null default 'link' check (kind in ('link','file','image')),
  url            text not null,
  label          text,
  created_at     timestamptz not null default now()
);

-- RLS: 본인만 CRUD
alter table user_experiences enable row level security;
alter table experience_evidence enable row level security;

create policy ux_select on user_experiences for select to authenticated using (auth.uid() = user_id);
create policy ux_insert on user_experiences for insert to authenticated with check (auth.uid() = user_id);
create policy ux_update on user_experiences for update to authenticated using (auth.uid() = user_id);
create policy ux_delete on user_experiences for delete to authenticated using (auth.uid() = user_id);

create policy uxe_all on experience_evidence for all to authenticated
  using (exists (select 1 from user_experiences e where e.id = experience_id and e.user_id = auth.uid()))
  with check (exists (select 1 from user_experiences e where e.id = experience_id and e.user_id = auth.uid()));
