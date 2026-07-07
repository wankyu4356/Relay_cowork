import { logger } from '../utils/logger';
import { getSupabase } from '../components/api';

/**
 * 임베딩 클라이언트 (M5) — /api/embed 가 살아있을 때만 동작.
 * 실패는 모두 조용히 무시된다 (임베딩은 향상 기능이지 필수 아님).
 */

export async function embedTexts(texts: string[]): Promise<number[][] | null> {
  try {
    const res = await fetch('/api/embed', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ texts }),
    });
    if (!res.ok) return null;
    const json = await res.json();
    return Array.isArray(json.embeddings) ? json.embeddings : null;
  } catch {
    return null;
  }
}

/** 경험 레코드에 임베딩을 채운다 (best-effort). */
export async function embedExperiences(rows: Array<{ id: string; title: string; action?: string | null; result?: string | null }>) {
  if (rows.length === 0) return;
  const texts = rows.map((r) => [r.title, r.action, r.result].filter(Boolean).join('\n'));
  const vecs = await embedTexts(texts);
  if (!vecs) return;
  const sb = getSupabase();
  await Promise.all(rows.map((r, i) =>
    vecs[i] ? sb.from('user_experiences').update({ embedding: vecs[i] as unknown as string }).eq('id', r.id) : null,
  )).catch((e) => logger.log('임베딩 저장 스킵:', e));
}

/** 질의문과 의미상 가까운 내 경험 top-k. 임베딩 미설정 시 null. */
export async function searchMyExperiences(query: string, k = 5) {
  const vecs = await embedTexts([query]);
  if (!vecs?.[0]) return null;
  const { data, error } = await getSupabase().rpc('match_user_experiences', {
    query_embedding: vecs[0] as unknown as string,
    match_count: k,
  });
  if (error) return null;
  return data as Array<{ id: string; title: string; kind: string; similarity: number }>;
}
