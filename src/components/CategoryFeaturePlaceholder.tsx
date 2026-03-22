import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import {
  ArrowLeft,
  ClipboardList,
  BarChart3,
  FileText,
  Target,
  Briefcase,
  Mic,
  CalendarDays,
  BookMarked,
  Map,
  Lightbulb,
  Sparkles,
  Construction,
} from 'lucide-react';
import type { Screen } from '../App';
import type { Category } from './GlobalNav';
import { CATEGORY_CONTENT } from '../lib/categoryContent';

interface CategoryFeaturePlaceholderProps {
  screen: Screen;
  selectedCategory: Category;
  onBack: () => void;
}

const FEATURE_CONFIG: Record<string, {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  features: string[];
}> = {
  'admission-guide': {
    icon: ClipboardList,
    title: '편입 요강',
    description: '대학별 편입 요강과 일정을 한눈에 확인하세요',
    features: ['대학별 편입 일정 캘린더', '전형별 요강 비교', '제출 서류 체크리스트', '지원 마감일 알림'],
  },
  'grade-prediction': {
    icon: BarChart3,
    title: '합격 예측',
    description: '내 스펙을 기반으로 합격 가능성을 AI가 분석합니다',
    features: ['학점/영어 성적 기반 분석', '대학별 합격 가능성 점수', '부족 영역 진단', '맞춤 보완 전략 제안'],
  },
  'transcript-manager': {
    icon: FileText,
    title: '생기부 관리',
    description: '생활기록부와 활동 내역을 체계적으로 정리하세요',
    features: ['교과/비교과 활동 기록', '세부능력특기사항 관리', '활동 카테고리 분류', '자소서 소재 자동 추출'],
  },
  'admission-strategy': {
    icon: Target,
    title: '수시/정시 전략',
    description: '전형별 최적의 전략을 수립하세요',
    features: ['수시 6장 카드 전략', '정시 배치표 분석', '전형별 유불리 비교', '합격 시뮬레이션'],
  },
  'job-board': {
    icon: Briefcase,
    title: '포지션 보드',
    description: '관심 기업의 채용 공고를 모아보세요',
    features: ['기업별 채용 공고 모아보기', '직무 필터링', '지원 마감일 알림', '관심 공고 스크랩'],
  },
  'mock-interview': {
    icon: Mic,
    title: '면접 연습',
    description: 'AI와 함께 실전 면접을 연습하세요',
    features: ['AI 모의 면접', '직무별 예상 질문', '답변 피드백 리포트', '면접 영상 복기'],
  },
  'exam-calendar': {
    icon: CalendarDays,
    title: '시험 일정',
    description: '자격증 시험 일정과 D-Day를 관리하세요',
    features: ['자격증별 시험 일정', 'D-Day 카운트다운', '접수 기간 알림', '시험장 정보'],
  },
  'study-planner': {
    icon: BookMarked,
    title: '학습 플래너',
    description: '체계적인 학습 계획으로 합격에 다가가세요',
    features: ['과목별 학습 계획', '일일 학습 진도 체크', '취약 과목 분석', '학습 통계 리포트'],
  },
  'roadmap': {
    icon: Map,
    title: '로드맵',
    description: '목표까지의 단계별 가이드를 확인하세요',
    features: ['목표별 단계 가이드', '마일스톤 관리', '선배 경험 경로', '추천 액션 플랜'],
  },
  'community': {
    icon: Lightbulb,
    title: '경험 공유',
    description: '다양한 경험과 노하우를 공유하세요',
    features: ['합격/성공 후기', '준비 과정 공유', '질문 & 답변', '러너 인터뷰'],
  },
};

export function CategoryFeaturePlaceholder({ screen, selectedCategory, onBack }: CategoryFeaturePlaceholderProps) {
  const config = FEATURE_CONFIG[screen];
  const content = CATEGORY_CONTENT[selectedCategory];

  if (!config) return null;

  const Icon = config.icon;

  return (
    <div className={`min-h-screen bg-gradient-to-br ${content.theme.bgGradient} pb-20 md:pb-0`}>
      <div className="container-web py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-xl">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className={`text-2xl font-bold bg-gradient-to-r ${content.theme.headerGradient} bg-clip-text text-transparent`}>
              {config.title}
            </h1>
            <p className="text-sm text-gray-500">{content.label} 전용 기능</p>
          </div>
        </div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="relative overflow-hidden border-0 shadow-2xl rounded-3xl mb-8">
            <div className={`absolute inset-0 bg-gradient-to-br ${content.theme.cardGradient1}`}></div>
            <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

            <div className="relative p-12 text-center">
              <div className="relative inline-block mb-6">
                <div className={`absolute inset-0 bg-gradient-to-br ${content.theme.gradient} rounded-3xl blur-xl opacity-40 scale-110`}></div>
                <div className="relative w-24 h-24 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 flex items-center justify-center mx-auto">
                  <Icon className="w-12 h-12 text-white" />
                </div>
              </div>

              <h2 className="text-3xl font-bold text-white mb-3">{config.title}</h2>
              <p className="text-white/80 text-lg mb-6 max-w-md mx-auto">{config.description}</p>

              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/15 backdrop-blur-sm rounded-full border border-white/20 mb-8">
                <Construction className="w-5 h-5 text-yellow-300" />
                <span className="text-white font-medium">곧 출시 예정</span>
                <Sparkles className="w-4 h-4 text-yellow-300" />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Features Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4">예정된 기능</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {config.features.map((feature, index) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <Card className="p-5 border border-gray-200/50 rounded-2xl hover:shadow-md transition-all">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 bg-gradient-to-br ${content.theme.gradient} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <span className="text-white font-bold text-sm">{index + 1}</span>
                    </div>
                    <span className="text-gray-800 font-medium">{feature}</span>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <p className="text-gray-500 mb-4">출시 알림을 받으시겠어요?</p>
          <Button
            className={`bg-gradient-to-r ${content.theme.gradient} text-white font-bold rounded-xl px-8 py-3 shadow-lg`}
          >
            알림 신청하기
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
