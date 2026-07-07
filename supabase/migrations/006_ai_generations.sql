-- ============================================================
-- M3: AI 산출물 원장 (재현성 · 비용 · 캐시 · 암묵적 RLHF 신호)
-- /api/ai 서버리스 함수가 service role로 기록한다
-- ============================================================

create table if not exists ai_generations (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid references profiles(id) on delete set null,  -- 익명 호출은 null
  mode           text not null,
  model          text not null,
  input_refs     jsonb not null default '{}',
  input_hash     text not null,
  output_text    text,
  prompt_tokens  int,
  output_tokens  int,
  latency_ms     int,
  status         text not null default 'ok' check (status in ('ok','error','refusal')),
  error          text,
  created_at     timestamptz not null default now()
);

create index if not exists idx_ai_gen_user on ai_generations (user_id, mode, created_at desc);
create index if not exists idx_ai_gen_hash on ai_generations (user_id, input_hash, created_at desc);

create table if not exists ai_feedback (
  generation_id uuid primary key references ai_generations(id) on delete cascade,
  user_id       uuid not null references profiles(id) on delete cascade,
  rating        int check (rating between 1 and 5),
  accepted      boolean,
  edited_ratio  numeric,
  created_at    timestamptz not null default now()
);

-- RLS: 본인 생성 기록 조회, 피드백은 본인 것만 작성
alter table ai_generations enable row level security;
alter table ai_feedback enable row level security;

create policy aig_select on ai_generations for select to authenticated
  using (auth.uid() = user_id);
-- insert/update는 service role 전용 (RLS 우회)

create policy aif_upsert on ai_feedback for all to authenticated
  using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id
    and exists (select 1 from ai_generations g where g.id = generation_id and g.user_id = auth.uid())
  );

-- document_versions.generation_id FK (005 이후)
do $$
begin
  if exists (select 1 from information_schema.tables where table_name = 'document_versions') then
    alter table document_versions
      add constraint fk_docver_generation
      foreign key (generation_id) references ai_generations(id) on delete set null;
  end if;
exception when duplicate_object then null;
end $$;
