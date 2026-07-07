import Anthropic from '@anthropic-ai/sdk';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { createHash } from 'node:crypto';

/**
 * RELAY · AI 첨삭 백엔드 (Vercel Serverless Function)
 *
 * 브라우저는 절대 Anthropic API 키를 보지 않습니다 — 이 함수가 서버에서
 * 키(ANTHROPIC_API_KEY, VITE_ 접두사 없음)를 들고 Claude를 호출하고,
 * 생성 텍스트를 클라이언트로 스트리밍합니다.
 *
 * 모드:
 *   - storylines : 입력 경험 → 3개 스토리라인(JSON 배열) 생성
 *   - draft      : 선택한 스토리라인 → 전체 초안 작성
 *   - proofread  : 현재 초안 + 지시 → 개선된 초안(실제 AI 첨삭)
 *   - analyze    : 현재 초안 → 정량 분석 점수(JSON: 구조/구체성/차별화/적합도)
 *   - advice     : 지원 프로필 → 합격 전략 총평 텍스트
 *   - extract    : 자유 서술 경험 → STAR 구조화(JSON 배열, 경험 DB 저장용)
 */

export const maxDuration = 60;

// M3: AI 원장 — SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY 가 있으면
// 모든 생성 호출을 ai_generations 에 기록하고, 동일 입력은 캐시로 응답한다.
// 두 env 가 없으면 원장/캐시 없이 순수 생성만 동작 (완전 선택적).
const CACHE_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7일
const CACHEABLE = new Set(['storylines', 'draft', 'advice', 'extract']); // proofread/analyze는 편집 반복이라 제외

function getServiceDb(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

async function resolveUserId(db: SupabaseClient | null, req: any): Promise<string | null> {
  if (!db) return null;
  const auth: string = req.headers?.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!token) return null;
  try {
    const { data } = await db.auth.getUser(token);
    return data?.user?.id ?? null;
  } catch {
    return null;
  }
}

function hashInput(mode: string, body: any): string {
  const { mode: _m, ...rest } = body || {};
  return createHash('sha256').update(mode + '\u0000' + JSON.stringify(rest)).digest('hex');
}

const MODEL = 'claude-opus-4-8';

interface AIData {
  university?: string;
  major?: string;
  motivation?: string;
  activities?: Array<{ name?: string; role?: string; period?: string; achievement?: string }>;
  keywords?: string[];
  tone?: string;
  wordCount?: number;
}

const TONE_LABEL: Record<string, string> = {
  sincere: '진정성 있고 담백한',
  academic: '학술적이고 논리적인',
  balanced: '균형 잡힌',
};

function describeProfile(d: AIData): string {
  const acts = (d.activities || [])
    .filter((a) => a && (a.name || a.achievement))
    .map((a, i) => `  ${i + 1}. ${a.name || ''} (${a.role || ''}, ${a.period || ''}) — ${a.achievement || ''}`)
    .join('\n');
  return [
    `지원처: ${d.university || '(미입력)'} ${d.major || ''}`.trim(),
    `지원 동기: ${d.motivation || '(미입력)'}`,
    acts ? `주요 활동/경험:\n${acts}` : '주요 활동/경험: (미입력)',
    d.keywords?.length ? `핵심 키워드: ${d.keywords.join(', ')}` : '',
    `희망 톤: ${TONE_LABEL[d.tone || 'balanced'] || '균형 잡힌'}`,
    d.wordCount ? `목표 분량: 약 ${d.wordCount}자` : '',
  ].filter(Boolean).join('\n');
}

const BASE_SYSTEM =
  '당신은 한국의 편입·입시·취업·자격증·대학원 지원 서류를 첨삭하는 RELAY 플랫폼의 전문 합격 컨설턴트입니다. ' +
  '지원자의 실제 경험에 근거해 구체적이고 설득력 있는 한국어 지원 서류(학업계획서/자기소개서/포트폴리오)를 작성·개선합니다. ' +
  '과장이나 거짓 없이, 입력된 사실만 바탕으로 작성하세요.';

function buildRequest(mode: string, payload: any): { system: string; user: string; effort: 'low' | 'medium' | 'high' } {
  const aiData: AIData = payload?.aiData || {};
  const profile = describeProfile(aiData);

  if (mode === 'storylines') {
    return {
      effort: 'medium',
      system:
        BASE_SYSTEM +
        '\n\n출력은 반드시 JSON 배열만 반환합니다. 마크다운 코드펜스나 설명 문장을 붙이지 마세요.',
      user:
        `다음 지원자 프로필을 분석해, 서로 뚜렷이 구별되는 3가지 합격 전략 스토리라인을 제안하세요.\n\n${profile}\n\n` +
        '각 항목은 아래 형식의 객체로, 정확히 3개를 담은 JSON 배열로만 응답하세요:\n' +
        '[{"id":"A","title":"한 줄 제목","message":"핵심 메시지 1~2문장","structure":"도입→전개→마무리 형태의 구성 흐름","strength":"이 전략의 강점","materials":"활용할 소재"}, {"id":"B",...}, {"id":"C",...}]',
    };
  }

  if (mode === 'draft') {
    const s = payload?.storyline || {};
    // M5 연동: 클라이언트가 경험 DB에서 선별한 관련 경험 top-k
    const exps: Array<{ kind?: string; title?: string; role?: string; action?: string; result?: string }> =
      Array.isArray(payload?.experiences) ? payload.experiences.slice(0, 6) : [];
    const expBlock = exps.length
      ? `\n[경험 DB에서 선별된 관련 경험 — 반드시 본문에 구체적으로 녹여낼 것]\n` +
        exps.map((e, i) =>
          `${i + 1}. [${e.kind || 'activity'}] ${e.title || ''}${e.role ? ` (${e.role})` : ''}` +
          `${e.action ? `\n   행동: ${e.action}` : ''}${e.result ? `\n   결과: ${e.result}` : ''}`
        ).join('\n') + '\n'
      : '';
    return {
      effort: 'medium',
      system: BASE_SYSTEM + '\n\n초안 본문 텍스트만 출력합니다. 머리말·설명·코드펜스를 붙이지 마세요.',
      user:
        `아래 지원자 프로필과 선택된 스토리라인을 바탕으로 완성도 높은 지원 서류 초안을 작성하세요.\n\n` +
        `[프로필]\n${profile}\n${expBlock}\n` +
        `[선택한 스토리라인]\n제목: ${s.title || ''}\n핵심 메시지: ${s.message || ''}\n구성: ${s.structure || ''}\n강점: ${s.strength || ''}\n소재: ${s.materials || ''}\n\n` +
        `요구사항:\n- "1. 지원 동기 / 2. 학업(활동) 배경 / 3. 학업(입사) 계획 / 4. 향후 계획" 구조의 단락으로 구성\n` +
        `- 입력된 경험을 구체적으로 녹여내고, 추상적 미사여구는 지양\n- 약 ${aiData.wordCount || 1500}자 분량, ${TONE_LABEL[aiData.tone || 'balanced']} 어조`,
    };
  }

  if (mode === 'analyze') {
    const draft: string = payload?.draft || '';
    return {
      effort: 'low',
      system:
        BASE_SYSTEM +
        '\n\n출력은 반드시 JSON 객체만 반환합니다. 마크다운 코드펜스나 설명 문장을 붙이지 마세요.',
      user:
        `다음 지원 서류 초안을 평가 기준별로 0~100 점수로 정량 평가하고, 한 줄 총평을 작성하세요.\n\n` +
        `[프로필]\n${profile}\n\n[초안]\n${draft}\n\n` +
        '정확히 이 형식의 JSON 객체로만 응답하세요:\n' +
        '{"structure": 85, "specificity": 72, "uniqueness": 80, "relevance": 90, "comment": "한 줄 총평"}',
    };
  }

  if (mode === 'advice') {
    return {
      effort: 'medium',
      system: BASE_SYSTEM + '\n\n총평 본문 텍스트만 출력합니다. 머리말·코드펜스를 붙이지 마세요.',
      user:
        `다음 지원자 프로필을 바탕으로 합격 가능성을 높이는 종합 전략 총평을 작성하세요.\n\n${profile}\n\n` +
        (payload?.context ? `[추가 컨텍스트]\n${payload.context}\n\n` : '') +
        '요구사항:\n- 3~5문장, 구체적이고 실행 가능한 조언 중심\n- 지원자의 강점 1가지와 보완점 1가지를 반드시 포함',
    };
  }

  if (mode === 'extract') {
    const raw: string = payload?.text || '';
    const category: string = payload?.category || 'other';
    return {
      effort: 'low',
      system:
        BASE_SYSTEM +
        '\n\n출력은 반드시 JSON 배열만 반환합니다. 마크다운 코드펜스나 설명 문장을 붙이지 마세요.',
      user:
        `다음 자유 서술에서 지원 서류에 활용 가능한 "경험"들을 추출해 STAR 구조로 정리하세요. 카테고리: ${category}\n\n` +
        `[서술]\n${raw}\n\n` +
        '각 경험을 아래 형식 객체로 담은 JSON 배열로만 응답하세요 (없는 필드는 null):\n' +
        '[{"kind":"activity|internship|project|award|certificate|work|education|etc","title":"","organization":null,"role":null,' +
        '"period_start":"YYYY-MM-DD|null","period_end":"YYYY-MM-DD|null","situation":"","task":"","action":"","result":"",' +
        '"metrics":{},"skills":[],"keywords":[]}]',
    };
  }

  // proofread — 핵심 AI 첨삭
  const instruction: string = payload?.instruction || '전반적으로 더 설득력 있고 구체적으로 다듬어 주세요.';
  const draft: string = payload?.draft || '';
  return {
    effort: 'high',
    system:
      BASE_SYSTEM +
      '\n\n당신은 첨삭 결과로 "개선된 전체 초안 본문"만 출력합니다. 변경 설명·코멘트·코드펜스를 붙이지 말고, 완성된 글 전체를 그대로 반환하세요.',
    user:
      `다음은 지원자의 현재 초안입니다. 요청에 따라 첨삭하여 개선된 전체 본문을 작성하세요.\n\n` +
      `[프로필]\n${profile}\n\n[첨삭 요청]\n${instruction}\n\n[현재 초안]\n${draft}`,
  };
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'POST only' });
    return;
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    res.status(503).json({ error: 'AI가 설정되지 않았습니다. ANTHROPIC_API_KEY를 등록하세요.' });
    return;
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
  const mode = body.mode;
  if (!['storylines', 'draft', 'proofread', 'analyze', 'advice', 'extract'].includes(mode)) {
    res.status(400).json({ error: 'mode는 storylines | draft | proofread | analyze | advice | extract 중 하나여야 합니다.' });
    return;
  }

  const { system, user, effort } = buildRequest(mode, body);

  const db = getServiceDb();
  const userId = await resolveUserId(db, req);
  const inputHash = hashInput(mode, body);
  const startedAt = Date.now();

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');

  // 캐시 조회: 같은 유저 + 같은 입력이 7일 내 성공했으면 재사용
  if (db && userId && CACHEABLE.has(mode)) {
    try {
      const { data: hit } = await db
        .from('ai_generations')
        .select('output_text, created_at')
        .eq('user_id', userId)
        .eq('input_hash', inputHash)
        .eq('status', 'ok')
        .not('output_text', 'is', null)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (hit?.output_text && Date.now() - new Date(hit.created_at).getTime() < CACHE_TTL_MS) {
        res.setHeader('x-relay-cache', 'hit');
        res.write(hit.output_text);
        res.end();
        return;
      }
    } catch { /* 캐시 실패는 무시하고 생성 진행 */ }
  }

  let fullText = '';
  try {
    const client = new Anthropic();
    const stream = client.messages.stream({
      model: MODEL,
      max_tokens: 16000,
      thinking: { type: 'adaptive' },
      output_config: { effort },
      system,
      messages: [{ role: 'user', content: user }],
    });

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        fullText += event.delta.text;
        res.write(event.delta.text);
      }
    }

    // 원장 기록 (best-effort)
    if (db) {
      try {
        const final = await stream.finalMessage();
        await db.from('ai_generations').insert({
          user_id: userId,
          mode,
          model: MODEL,
          input_refs: { hasAiData: !!body.aiData, keys: Object.keys(body).filter(k => k !== 'mode') },
          input_hash: inputHash,
          output_text: fullText,
          prompt_tokens: final.usage?.input_tokens ?? null,
          output_tokens: final.usage?.output_tokens ?? null,
          latency_ms: Date.now() - startedAt,
          status: final.stop_reason === 'refusal' ? 'refusal' : 'ok',
        });
      } catch { /* 기록 실패는 응답에 영향 없음 */ }
    }
    res.end();
  } catch (err: any) {
    const message = err?.message || 'AI 생성 중 오류가 발생했습니다.';
    if (db) {
      try {
        await db.from('ai_generations').insert({
          user_id: userId, mode, model: MODEL,
          input_refs: {}, input_hash: inputHash,
          latency_ms: Date.now() - startedAt,
          status: 'error', error: message.slice(0, 500),
        });
      } catch { /* ignore */ }
    }
    if (!res.headersSent) {
      res.status(500).json({ error: message });
    } else {
      res.end();
    }
  }
}
