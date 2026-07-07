import { logger } from '../utils/logger';
import type { AIData, Storyline } from '../App';

/**
 * 프론트엔드 AI 클라이언트.
 *
 * /api/ai (Vercel Serverless Function)를 호출해 Claude가 생성한 텍스트를
 * 스트리밍으로 받습니다. API 키는 서버에만 있으므로 여기서는 절대 다루지
 * 않습니다. /api/ai 가 없거나(로컬 vite dev, 키 미설정) 실패하면 호출부가
 * 목업으로 폴백할 수 있도록 throw 합니다.
 */

type Mode = 'storylines' | 'draft' | 'proofread' | 'analyze' | 'advice' | 'extract';

// 직전 스트림 호출의 ai_generations id (원장 미연동이면 null)
let lastGenerationId: string | null = null;
export function getLastGenerationId(): string | null {
  return lastGenerationId;
}

async function streamAI(
  mode: Mode,
  payload: Record<string, unknown>,
  onToken?: (full: string, delta: string) => void,
): Promise<string> {
  // 로그인 상태면 토큰을 전달 — 서버가 AI 원장(user_id)·캐시에 사용
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  try {
    const { getSupabase } = await import('../components/api');
    const { data } = await getSupabase().auth.getSession();
    const token = data?.session?.access_token;
    if (token) headers['Authorization'] = `Bearer ${token}`;
  } catch { /* 게스트/미연동 — 익명 호출 */ }

  const res = await fetch('/api/ai', {
    method: 'POST',
    headers,
    body: JSON.stringify({ mode, ...payload }),
  });

  // ③ 피드백 연결용 — 서버가 원장 기록 시 생성 ID를 헤더로 알려준다
  lastGenerationId = res.headers.get('x-relay-generation-id');

  if (!res.ok || !res.body) {
    let msg = `AI 요청 실패 (${res.status})`;
    try {
      const data = await res.json();
      msg = data?.error || msg;
    } catch {
      /* non-JSON error */
    }
    throw new Error(msg);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let full = '';
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    const delta = decoder.decode(value, { stream: true });
    if (delta) {
      full += delta;
      onToken?.(full, delta);
    }
  }
  return full;
}

/** AI가 사용 가능한 환경인지 가볍게 확인 (404면 미배포/로컬). */
export async function isAIAvailable(): Promise<boolean> {
  try {
    const res = await fetch('/api/ai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
    // 400(mode 누락)이면 함수는 살아있는 것, 404/405면 미배포
    return res.status !== 404 && res.status !== 405;
  } catch {
    return false;
  }
}

function stripFence(text: string): string {
  return text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim();
}

/** 3개의 스토리라인 생성. 실패 시 null 반환(호출부에서 목업 사용). */
export async function generateStorylines(aiData: AIData): Promise<Storyline[] | null> {
  try {
    const text = await streamAI('storylines', { aiData });
    const parsed = JSON.parse(stripFence(text));
    if (!Array.isArray(parsed) || parsed.length === 0) return null;
    return parsed.slice(0, 3).map((s: any, i: number) => ({
      id: s.id || ['A', 'B', 'C'][i] || String(i + 1),
      title: String(s.title || ''),
      message: String(s.message || ''),
      structure: String(s.structure || ''),
      strength: String(s.strength || ''),
      materials: String(s.materials || ''),
    }));
  } catch (e) {
    logger.warn('generateStorylines fallback:', e);
    return null;
  }
}

export interface RelevantExperience {
  id: string;
  kind?: string;
  title: string;
  role?: string | null;
  action?: string | null;
  result?: string | null;
}

/**
 * 초안 생성에 주입할 관련 경험 선별 (M5 연동).
 * 1) 임베딩 시맨틱 검색 → 2) 최근 경험 폴백 → 3) 게스트/미연동이면 빈 배열.
 */
export async function fetchRelevantExperiences(query: string, k = 5): Promise<RelevantExperience[]> {
  // 1) 시맨틱 검색 (VOYAGE_API_KEY + 임베딩 존재 시)
  try {
    const { searchMyExperiences } = await import('./embedClient');
    const hits = await searchMyExperiences(query, k);
    if (hits && hits.length > 0) {
      return hits.map((h: any) => ({
        id: h.id, kind: h.kind, title: h.title, action: h.action, result: h.result,
      }));
    }
  } catch { /* fall through */ }

  // 2) 최근 경험 폴백 (경험 DB만 있으면 동작)
  try {
    const api = await import('../components/api');
    const { experiences } = await api.getExperiences();
    return (experiences as any[]).slice(0, k).map((e) => ({
      id: e.id, kind: e.kind, title: e.title, role: e.role, action: e.action, result: e.result,
    }));
  } catch {
    return [];
  }
}

/** 선택한 스토리라인으로 초안 생성(스트리밍). experiences는 경험 DB 선별분. */
export function generateDraftStream(
  storyline: Storyline,
  aiData: AIData,
  onToken: (full: string, delta: string) => void,
  experiences: RelevantExperience[] = [],
): Promise<string> {
  return streamAI('draft', { storyline, aiData, experiences }, onToken);
}

/** 현재 초안을 지시에 따라 AI 첨삭(스트리밍). */
export function proofreadStream(
  draft: string,
  instruction: string,
  aiData: AIData,
  onToken: (full: string, delta: string) => void,
): Promise<string> {
  return streamAI('proofread', { draft, instruction, aiData }, onToken);
}

export interface DraftAnalysis {
  structure: number;
  specificity: number;
  uniqueness: number;
  relevance: number;
  comment?: string;
}

/** 초안 정량 분석 (AI). 실패 시 null — 호출부에서 로컬 휴리스틱 폴백. */
export async function analyzeDraft(draft: string, aiData: AIData): Promise<DraftAnalysis | null> {
  try {
    const text = await streamAI('analyze', { draft, aiData });
    const parsed = JSON.parse(stripFence(text));
    const clamp = (n: unknown) => Math.max(0, Math.min(100, Math.round(Number(n) || 0)));
    return {
      structure: clamp(parsed.structure),
      specificity: clamp(parsed.specificity),
      uniqueness: clamp(parsed.uniqueness),
      relevance: clamp(parsed.relevance),
      comment: typeof parsed.comment === 'string' ? parsed.comment : undefined,
    };
  } catch (e) {
    logger.warn('analyzeDraft fallback:', e);
    return null;
  }
}

/** 지원 프로필 기반 합격 전략 총평 (스트리밍). 실패 시 throw — 호출부 폴백. */
export function adviceStream(
  aiData: AIData,
  context: string,
  onToken: (full: string, delta: string) => void,
): Promise<string> {
  return streamAI('advice', { aiData, context }, onToken);
}


export interface ExtractedExperience {
  kind: string;
  title: string;
  organization?: string | null;
  role?: string | null;
  period_start?: string | null;
  period_end?: string | null;
  situation?: string | null;
  task?: string | null;
  action?: string | null;
  result?: string | null;
  metrics?: Record<string, unknown>;
  skills?: string[];
  keywords?: string[];
}

/** 자유 서술 → STAR 경험 배열 추출 (AI). 실패 시 null. */
export async function extractExperiences(text: string, category: string): Promise<ExtractedExperience[] | null> {
  try {
    const out = await streamAI('extract', { text, category });
    const parsed = JSON.parse(stripFence(out));
    return Array.isArray(parsed) ? parsed : null;
  } catch (e) {
    logger.warn('extractExperiences fallback:', e);
    return null;
  }
}
