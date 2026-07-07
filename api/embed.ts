/**
 * RELAY · 임베딩 백엔드 (선택적)
 *
 * VOYAGE_API_KEY 가 설정된 경우에만 동작 — Voyage AI voyage-3-lite(1024차원).
 * 키가 없으면 503을 반환하고 앱은 임베딩 없이(키워드 검색만) 동작한다.
 *
 * POST { texts: string[] }  →  { embeddings: number[][] }
 */
export const maxDuration = 30;

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'POST only' });
    return;
  }
  const key = process.env.VOYAGE_API_KEY;
  if (!key) {
    res.status(503).json({ error: '임베딩이 설정되지 않았습니다. VOYAGE_API_KEY를 등록하세요.' });
    return;
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
  const texts: string[] = Array.isArray(body.texts) ? body.texts.filter((t: unknown) => typeof t === 'string' && t) : [];
  if (texts.length === 0 || texts.length > 32) {
    res.status(400).json({ error: 'texts는 1~32개의 문자열 배열이어야 합니다.' });
    return;
  }

  try {
    const r = await fetch('https://api.voyageai.com/v1/embeddings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({ input: texts, model: 'voyage-3-lite', input_type: 'document' }),
    });
    if (!r.ok) {
      const detail = await r.text();
      res.status(502).json({ error: `임베딩 생성 실패 (${r.status})`, detail: detail.slice(0, 300) });
      return;
    }
    const json = await r.json();
    const embeddings = (json.data || [])
      .sort((a: any, b: any) => a.index - b.index)
      .map((d: any) => d.embedding);
    res.status(200).json({ embeddings });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || '임베딩 생성 중 오류' });
  }
}
