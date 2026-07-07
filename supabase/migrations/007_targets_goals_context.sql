-- ============================================================
-- M4: 지원처 마스터(targets) + 목표(user_goals) + outcomes 연결
--     + LLM-Ready 컨텍스트 직렬화 함수
-- ============================================================

create table if not exists targets (
  id         uuid primary key default gen_random_uuid(),
  category   text not null,
  type       text not null check (type in ('university','company','certification','program')),
  name       text not null,
  detail     jsonb not null default '{}',
  embedding  vector(1024),
  created_at timestamptz not null default now(),
  unique (type, name)
);

create table if not exists user_goals (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references profiles(id) on delete cascade,
  target_id  uuid not null references targets(id),
  sub_target text,
  priority   int not null default 1,
  due_date   date,
  status     text not null default 'active' check (status in ('active','achieved','failed','paused')),
  created_at timestamptz not null default now()
);
create index if not exists idx_user_goals_user on user_goals (user_id, status);

-- outcomes 라벨 루프 연결
alter table outcomes add column if not exists goal_id     uuid references user_goals(id) on delete set null;
alter table outcomes add column if not exists document_id uuid;
alter table outcomes add column if not exists session_ids text[] not null default '{}';
alter table outcomes add column if not exists verified    boolean not null default false;

do $$
begin
  if exists (select 1 from information_schema.tables where table_name = 'documents') then
    alter table outcomes
      add constraint fk_outcomes_document foreign key (document_id) references documents(id) on delete set null;
  end if;
exception when duplicate_object then null;
end $$;

-- documents.goal_id FK (005 이후)
do $$
begin
  if exists (select 1 from information_schema.tables where table_name = 'documents') then
    alter table documents
      add constraint fk_documents_goal foreign key (goal_id) references user_goals(id) on delete set null;
  end if;
exception when duplicate_object then null;
end $$;

-- sessions에 목표 라벨
alter table sessions add column if not exists goal_id uuid references user_goals(id) on delete set null;

-- RLS
alter table targets enable row level security;
alter table user_goals enable row level security;

create policy targets_select on targets for select to authenticated using (true);
-- targets 쓰기는 RPC(ensure_target)로만

create policy goals_all on user_goals for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- find-or-create 지원처 (정크 방지: security definer RPC로만 생성)
create or replace function ensure_target(p_category text, p_type text, p_name text)
returns uuid
language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  if auth.uid() is null then raise exception '인증 필요'; end if;
  if length(trim(p_name)) < 2 then raise exception '지원처 이름이 너무 짧습니다'; end if;

  select id into v_id from targets where type = p_type and name = trim(p_name);
  if v_id is null then
    insert into targets (category, type, name) values (p_category, p_type, trim(p_name))
    on conflict (type, name) do update set category = excluded.category
    returning id into v_id;
  end if;
  return v_id;
end $$;
grant execute on function ensure_target(text, text, text) to authenticated;

-- ============================================================
-- LLM-Ready 컨텍스트 직렬화 — 프롬프트에 그대로 붙이는 텍스트
-- (실명/이메일 등 PII는 구조적으로 배제, 익명 번호만)
-- ============================================================
create or replace function get_user_ai_context(p_user uuid)
returns text
language sql stable security definer set search_path = public as $$
  select concat_ws(E'\n',
    '## 지원자 프로필 (익명)',
    concat('멘티 #', right(replace(p_user::text, '-', ''), 4)),
    coalesce((
      select E'\n## 활성 목표\n' || string_agg(
        format('- %s%s (유형: %s, 우선순위 %s)',
          t.name, coalesce(' ' || g.sub_target, ''), t.type, g.priority),
        E'\n' order by g.priority)
      from user_goals g join targets t on t.id = g.target_id
      where g.user_id = p_user and g.status = 'active'
    ), ''),
    coalesce((
      select E'\n## 보유 경험 (STAR)\n' || string_agg(
        format(E'- [%s] %s%s (%s ~ %s)\n  상황: %s | 과제: %s\n  행동: %s\n  결과: %s %s',
          e.kind, e.title,
          coalesce(' · ' || e.role, ''),
          coalesce(e.period_start::text, '?'), coalesce(e.period_end::text, '현재'),
          coalesce(e.situation, '-'), coalesce(e.task, '-'),
          coalesce(e.action, '-'), coalesce(e.result, '-'),
          case when e.metrics <> '{}'::jsonb then e.metrics::text else '' end),
        E'\n' order by e.period_end desc nulls first)
      from user_experiences e where e.user_id = p_user
    ), '')
  );
$$;
grant execute on function get_user_ai_context(uuid) to authenticated;
