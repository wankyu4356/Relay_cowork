-- ============================================================
-- M2: 문서 + 불변 버전 트리 (출처 라벨 포함)
-- "AI 초안 → 러너 첨삭 → 합격" 인과 체인을 데이터로 만든다
-- ============================================================

create table if not exists documents (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null references profiles(id) on delete cascade,
  goal_id            uuid,                      -- M4에서 user_goals FK 연결
  doc_type           text not null default 'study_plan'
                     check (doc_type in ('study_plan','cover_letter','portfolio','resume','etc')),
  title              text not null,
  university         text,                      -- 조회 편의 (legacy drafts 호환)
  major              text,
  storyline          jsonb,
  ai_data            jsonb,
  current_version_id uuid,
  status             text not null default 'draft'
                     check (status in ('draft','in_review','final','submitted')),
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create table if not exists document_versions (
  id                  uuid primary key default gen_random_uuid(),
  document_id         uuid not null references documents(id) on delete cascade,
  parent_version_id   uuid references document_versions(id),
  content             text not null,
  word_count          int generated always as (char_length(content)) stored,
  source              text not null default 'user_edit'
                      check (source in ('ai_draft','ai_proofread','user_edit','mentor_edit')),
  editor_id           uuid references profiles(id),
  generation_id       uuid,                     -- M3 ai_generations 연결
  analysis            jsonb,
  used_experience_ids uuid[] not null default '{}',
  embedding           vector(1024),
  created_at          timestamptz not null default now()
);

alter table documents
  add constraint fk_documents_current_version
  foreign key (current_version_id) references document_versions(id) deferrable initially deferred;

create index if not exists idx_documents_user on documents (user_id, updated_at desc);
create index if not exists idx_docver_document on document_versions (document_id, created_at desc);
create index if not exists idx_docver_embedding
  on document_versions using hnsw (embedding vector_cosine_ops);

-- RLS
alter table documents enable row level security;
alter table document_versions enable row level security;

create policy doc_all on documents for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 버전: 문서 소유자 전체 권한 + (세션으로 연결된) 러너의 mentor_edit 삽입 허용
create policy dv_owner on document_versions for all to authenticated
  using (exists (select 1 from documents d where d.id = document_id and d.user_id = auth.uid()))
  with check (exists (select 1 from documents d where d.id = document_id and d.user_id = auth.uid()));

create policy dv_mentor_insert on document_versions for insert to authenticated
  with check (
    source = 'mentor_edit'
    and editor_id = auth.uid()
    and exists (
      select 1
      from documents d
      join sessions s on s.user_id = d.user_id and s.mentor_id = auth.uid()
      where d.id = document_id
    )
  );

create policy dv_mentor_select on document_versions for select to authenticated
  using (
    exists (
      select 1
      from documents d
      join sessions s on s.user_id = d.user_id and s.mentor_id = auth.uid()
      where d.id = document_id
    )
  );

-- legacy drafts → documents 이관 (1회성, 존재할 때만)
do $$
begin
  if exists (select 1 from information_schema.tables where table_name = 'drafts') then
    insert into documents (id, user_id, doc_type, title, university, major, storyline, ai_data, status, created_at, updated_at)
    select gen_random_uuid(), d.user_id, 'study_plan',
           coalesce(nullif(concat_ws(' ', d.university, d.major), ''), '무제 초안'),
           d.university, d.major, d.storyline, d.ai_data, 'draft', d.created_at, d.updated_at
    from drafts d
    on conflict do nothing;

    -- 각 이관 문서에 초기 버전 생성
    insert into document_versions (document_id, content, source, created_at)
    select doc.id, coalesce(d.content, ''), 'ai_draft', d.created_at
    from drafts d
    join documents doc
      on doc.user_id = d.user_id
     and doc.created_at = d.created_at
     and coalesce(doc.university, '') = coalesce(d.university, '')
    where not exists (select 1 from document_versions v where v.document_id = doc.id);

    update documents doc
    set current_version_id = v.id
    from document_versions v
    where v.document_id = doc.id and doc.current_version_id is null;
  end if;
end $$;
