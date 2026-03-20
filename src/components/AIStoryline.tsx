import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ArrowLeft, Sparkles } from 'lucide-react';
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

export function AIStoryline({ onBack, onSelect, aiData }: AIStorylineProps) {
  const [loading, setLoading] = useState(true);
  const [storylines, setStorylines] = useState<Storyline[]>([]);

  useEffect(() => {
    setTimeout(() => {
      setStorylines(mockStorylines);
      setLoading(false);
    }, 2500);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md"
        >
          <motion.div
            className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-sky-400 to-blue-500 rounded-3xl flex items-center justify-center shadow-2xl"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <Sparkles className="w-12 h-12 text-white" />
          </motion.div>
          <h2 className="text-3xl font-bold mb-4">✨ AI가 스토리라인을 생성하고 있어요</h2>
          <p className="text-gray-600 text-lg mb-8">
            입력하신 경험을 분석해<br />
            3가지 스토리라인을 만들고 있습니다
          </p>
          <div className="flex gap-3 justify-center">
            <motion.div
              className="w-3 h-3 bg-sky-500 rounded-full"
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
            />
            <motion.div
              className="w-3 h-3 bg-blue-500 rounded-full"
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
            />
            <motion.div
              className="w-3 h-3 bg-sky-500 rounded-full"
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
            />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 pb-20 md:pb-0">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container-web py-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">✨ 스토리라인 제안</h1>
              <p className="text-gray-600 mt-1">마음에 드는 스토리를 선택하세요</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-web py-8">
        <div className="max-w-4xl mx-auto space-y-6 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-6 bg-gradient-to-br from-sky-50 to-blue-50 border-sky-200">
              <div className="flex gap-3">
                <Sparkles className="w-6 h-6 text-sky-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-lg">
                    <strong className="text-sky-700">{aiData.university} {aiData.major}</strong> 지원을 위한<br />
                    3가지 스토리라인을 만들었어요
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          <div className="space-y-5">
            {storylines.map((storyline, index) => (
              <motion.div
                key={storyline.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 card-hover">
                  <div className="p-6">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-14 h-14 bg-gradient-to-br from-sky-400 to-blue-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-lg">
                        {storyline.id}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-3">
                          📋 {storyline.title}
                        </h3>
                        <div className="p-4 bg-sky-50 rounded-lg mb-4">
                          <div className="text-sm font-semibold text-gray-700 mb-1">핵심 메시지:</div>
                          <p className="text-gray-800 whitespace-pre-line font-medium">
                            "{storyline.message}"
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="font-semibold text-gray-700 mb-2">구성</div>
                        <div className="text-gray-600">{storyline.structure}</div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-3">
                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                          <div className="font-semibold text-green-700 mb-2">강점</div>
                          <div className="text-gray-700">{storyline.strength}</div>
                        </div>
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="font-semibold text-blue-700 mb-2">활용 소재</div>
                          <div className="text-gray-700">{storyline.materials}</div>
                        </div>
                      </div>
                    </div>

                    <Button 
                      className="w-full mt-6 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white"
                      size="lg"
                      onClick={() => onSelect(storyline)}
                    >
                      이 스토리 선택하기
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-4 bg-purple-50 border-purple-200">
              <p className="text-center text-gray-700">
                💡 스토리라인을 선택하면 해당 구조로 학계서 초안을 생성합니다
              </p>
            </Card>
          </motion.div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-10">
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