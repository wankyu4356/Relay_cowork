import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { adviceStream } from '../../../lib/aiClient';
import type { AIData } from '../../../App';

/**
 * AI 합격 전략 총평 — 추천 결과 상단에 실시간 스트리밍으로 표시.
 * 모델이 연결돼 있으면(ANTHROPIC_API_KEY) 실제 총평이 흐르고,
 * 없으면 아무것도 렌더링하지 않는다 (규칙 기반 추천만 노출).
 */
export function AIAdviceCard({ context }: { context: string }) {
  const [text, setText] = useState('');
  const [state, setState] = useState<'loading' | 'done' | 'hidden'>('loading');
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    (async () => {
      try {
        await adviceStream({} as AIData, context, (full) => setText(full));
        setState('done');
      } catch {
        setState('hidden');
      }
    })();
  }, [context]);

  if (state === 'hidden') return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="border-sheen relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900 to-iris-900 p-6 text-white shadow-lg"
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-iris-200" />
        </div>
        <span className="text-[13px] font-semibold tracking-wide text-iris-200 uppercase">
          AI 합격 전략 총평
        </span>
        {state === 'loading' && (
          <span className="ml-auto flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-iris-300"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </span>
        )}
      </div>
      <p className="text-[14.5px] leading-relaxed text-white/85 whitespace-pre-line min-h-[1.5em]">
        {text || '지원 프로필을 분석하고 있습니다...'}
        {state === 'loading' && text && (
          <motion.span
            className="inline-block w-[2px] h-[1.1em] bg-iris-300 ml-0.5 align-text-bottom"
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.7, repeat: Infinity }}
          />
        )}
      </p>
    </motion.div>
  );
}
