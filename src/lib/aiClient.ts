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

type Mode = 'storylines' | 'draft' | 'proofread';

async function streamAI(
  mode: Mode,
  payload: Record<string, unknown>,
  onToken?: (full: string, delta: string) => void,
): Promise<string> {
  const res = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mode, ...payload }),
  });

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

/** 선택한 스토리라인으로 초안 생성(스트리밍). */
export function generateDraftStream(
  storyline: Storyline,
  aiData: AIData,
  onToken: (full: string, delta: string) => void,
): Promise<string> {
  return streamAI('draft', { storyline, aiData }, onToken);
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
