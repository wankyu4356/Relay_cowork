-- ============================================================
-- M5: 시맨틱 검색 — 임베딩 기반 매칭 RPC
-- 임베딩 생성은 /api/embed (Voyage AI, voyage-3-lite · 1024차원)
-- ============================================================

alter table reviews add column if not exists embedding vector(1024);
create index if not exists idx_reviews_embedding
  on reviews using hnsw (embedding vector_cosine_ops);

-- 내 경험 중 질의와 의미상 가까운 top-k (RLS 하에서 본인 것만)
create or replace function match_user_experiences(
  query_embedding vector(1024),
  match_count int default 5
)
returns table (
  id uuid, title text, kind text, action text, result text, similarity float
)
language sql stable security invoker as $$
  select e.id, e.title, e.kind, e.action, e.result,
         1 - (e.embedding <=> query_embedding) as similarity
  from user_experiences e
  where e.user_id = auth.uid() and e.embedding is not null
  order by e.embedding <=> query_embedding
  limit match_count;
$$;
grant execute on function match_user_experiences(vector, int) to authenticated;

-- 지원처(요강/인재상)와 의미상 가까운 러너 검색 기반:
-- targets.embedding은 운영자가 요강 텍스트 임베딩으로 채운다 (service role)
create or replace function match_targets(
  query_embedding vector(1024),
  match_count int default 5
)
returns table (id uuid, name text, type text, category text, similarity float)
language sql stable security invoker as $$
  select t.id, t.name, t.type, t.category,
         1 - (t.embedding <=> query_embedding) as similarity
  from targets t
  where t.embedding is not null
  order by t.embedding <=> query_embedding
  limit match_count;
$$;
grant execute on function match_targets(vector, int) to authenticated;
