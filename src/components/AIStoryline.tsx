import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { FadeIn, Stagger, Press, TextReveal } from './ui/motion';
import { generateStorylines, getLastGenerationId } from '../lib/aiClient';
import * as api from './api';
import type { AIData, Storyline } from '../App';

interface AIStorylineProps {
  onBack: () => void;
  onSelect: (storyline: Storyline) => void;
  aiData: AIData;
}

const mockStorylines: Storyline[] = [
  {
    id: 'A',
    title: '전공 전환의 필연성',
    message: '정치외교에서 배운 분석력을\n경영학으로 확장하려는 이유',
    structure: '전공 경험 → 한계 인식 → 경영학 필요성 → 학업 계획',
    strength: '전공 전환 논리가 명확',
    materials: '정외과 캡스톤, 학회 활동',
  },
  {
    id: 'B',
    title: '실무 경험에서 출발',
    message: '인턴/활동에서 느낀\n경영학적 지식의 필요성',
    structure: '활동 경험 → 문제 인식 → 학문적 보완 필요 → 구체적 계획',
    strength: '실무 동기가 구체적',
    materials: '컨설팅 인턴, 창업 경험',
  },
  {
    id: 'C',
    title: '융합형 인재 비전',
    message: '정치외교와 경영의 시너지로\n글로벌 비즈니스 리더 지향',
    structure: '두 전공 연결 → 융합 가능성 → 차별화 포인트 → 미래 계획',
    strength: '차별화된 관점 제시',
    materials: '교환학생, 국제학회 활동',
  },
];

const GEN_STAGES = [
  '입력하신 경험을 분석하고 있어요',
  '합격 사례 패턴과 대조하고 있어요',
  '차별화 포인트를 추출하고 있어요',
  '3가지 스토리라인을 구성하고 있어요',
];

export function AIStoryline({ onBack, onSelect, aiData }: AIStorylineProps) {
  const [loading, setLoading] = useState(true);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (!loading) return;
    const t = setInterval(() => setStage((v) => (v + 1) % GEN_STAGES.length), 1600);
    return () => clearInterval(t);
  }, [loading]);
  const [storylines, setStorylines] = useState<Storyline[]>([]);
  const [generationId, setGenerationId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      // 실제 AI 생성 시도 → 실패 시 목업으로 폴백
      const result = await generateStorylines(aiData);
      if (cancelled) return;
      const genId = result && result.length > 0 ? getLastGenerationId() : null;
      setGenerationId(genId);
      setStorylines(result && result.length > 0 ? result : mockStorylines);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [aiData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md"
        >
          <motion.div
            className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-zinc-900 to-iris-800 rounded-2xl flex items-center justify-center shadow-lg"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <Sparkles className="w-12 h-12 text-white" />
          </motion.div>
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 mb-3">AI가 스토리라인을 생성하고 있어요</h2>

          {/* 단계 캡션 로테이션 */}
          <div className="h-7 overflow-hidden mb-8" aria-live="polite">
            <motion.p
              key={stage}
              initial={{ y: 18, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -18, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="text-iris-600 font-medium"
            >
              {GEN_STAGES[stage]}
            </motion.p>
          </div>

          {/* 시머 프리뷰 카드 — 완성될 결과의 실루엣 */}
          <div className="w-full max-w-md mx-auto space-y-3">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.15 }}
                className="rounded-xl border border-zinc-200/80 bg-white p-4 flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-lg skeleton-shimmer flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-2/3 rounded skeleton-shimmer" />
                  <div className="h-2.5 w-5/6 rounded skeleton-shimmer" />
                </div>
                <div className="text-[11px] font-semibold text-zinc-300 tnum">0{i + 1}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 pb-20 md:pb-0">
      <div className="bg-white/80 backdrop-blur-xl border-b border-zinc-200/80 sticky top-0 z-10">
        <div className="container-web py-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-zinc-900"><TextReveal text="스토리라인 제안" delay={0.05} /></h1>
              <p className="text-zinc-600 mt-1">마음에 드는 스토리를 선택하세요</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-web py-8">
        <div className="max-w-4xl mx-auto space-y-6 pb-24">
          <FadeIn>
            <Card className="p-6 bg-iris-50 border-iris-100">
              <div className="flex gap-3">
                <Sparkles className="w-6 h-6 text-iris-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-lg text-zinc-700">
                    <strong className="text-iris-700">{aiData.university} {aiData.major}</strong> 지원을 위한<br />
                    3가지 스토리라인을 만들었어요
                  </p>
                </div>
              </div>
            </Card>
          </FadeIn>

          <Stagger className="space-y-5">
            {storylines.map((storyline) => (
              <Stagger.Item
                key={storyline.id}
              >
                <Press lift>
                <Card className="overflow-hidden transition-shadow duration-300 hover:shadow-lg">
                  <div className="p-6">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-14 h-14 bg-zinc-900 rounded-2xl flex items-center justify-center text-white font-semibold text-xl flex-shrink-0 shadow-sm tnum">
                        {storyline.id}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold tracking-tight text-zinc-900 mb-3">
                          {storyline.title}
                        </h3>
                        <div className="p-4 bg-iris-50 rounded-xl mb-4">
                          <div className="text-sm font-semibold text-zinc-700 mb-1">핵심 메시지:</div>
                          <p className="text-zinc-800 whitespace-pre-line font-medium">
                            "{storyline.message}"
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200/80">
                        <div className="font-semibold text-zinc-700 mb-2">구성</div>
                        <div className="text-zinc-600">{storyline.structure}</div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-3">
                        <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200/80">
                          <div className="font-semibold text-zinc-900 mb-2">강점</div>
                          <div className="text-zinc-600">{storyline.strength}</div>
                        </div>
                        <div className="p-4 bg-iris-50 rounded-xl border border-iris-100">
                          <div className="font-semibold text-iris-700 mb-2">활용 소재</div>
                          <div className="text-zinc-600">{storyline.materials}</div>
                        </div>
                      </div>
                    </div>

                    <Button
                      className="w-full mt-6 bg-zinc-900 hover:bg-zinc-800 text-white shine"
                      size="lg"
                      onClick={() => {
                        // ③ 스토리라인 선택 = AI 산출물 채택 신호
                        if (generationId) {
                          api.submitAiFeedback({ generationId, accepted: true }).catch(() => {});
                        }
                        onSelect(storyline);
                      }}
                    >
                      이 스토리 선택하기
                    </Button>
                  </div>
                </Card>
                </Press>
              </Stagger.Item>
            ))}
          </Stagger>

          <FadeIn delay={0.4}>
            <Card className="p-4 bg-zinc-50 border-zinc-200/80">
              <p className="text-center text-zinc-600">
                스토리라인을 선택하면 해당 구조로 학계서 초안을 생성합니다
              </p>
            </Card>
          </FadeIn>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-zinc-200/80 p-4 z-10">
        <div className="container-web max-w-4xl flex gap-4">
          <Button
            variant="outline"
            onClick={onBack}
            size="lg"
            className="flex-1"
          >
            ← 경험 수정하기
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="flex-1"
          >
            직접 구성하기 →
          </Button>
        </div>
      </div>
    </div>
  );
}