import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {
  ArrowLeft,
  Sparkles,
  ArrowRight,
  Award,
  BookOpen,
  TrendingUp,
  Users,
  Target,
  CheckCircle2,
  Info,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Calendar,
  DollarSign,
  Brain
} from 'lucide-react';

interface AIRecommendationProps {
  onBack: () => void;
  onComplete?: () => void;
}

interface UniversityRecommendation {
  id: string;
  name: string;
  major: string;
  matchScore: number;
  admissionType: string;
  competitionRate: string;
  tuition: string;
  strengths: string[];
  requirements: string[];
  recentTrends: string;
  successRate: string;
}

export function AIRecommendation({ onBack, onComplete }: AIRecommendationProps) {
  const [step, setStep] = useState<'input' | 'analyzing' | 'results'>('input');
  const [expandedSchool, setExpandedSchool] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    currentUniversity: '',
    currentMajor: '',
    gpa: '',
    targetField: '',
    experiences: '',
    strengths: '',
    goals: '',
  });

  const handleSubmit = () => {
    setStep('analyzing');
    setTimeout(() => {
      setStep('results');
    }, 3000);
  };

  const recommendations: UniversityRecommendation[] = [
    {
      id: '1',
      name: '연세대학교',
      major: '경영학과',
      matchScore: 94,
      admissionType: '일반편입',
      competitionRate: '15:1',
      tuition: '약 450만원/학기',
      strengths: [
        '현재 전공과 높은 연계성',
        '학점 경쟁력 우수',
        '봉사활동 경험이 플러스 요인',
        '목표와 전공 방향성 일치',
      ],
      requirements: [
        '학업계획서 (1,000자)',
        '자기소개서 (1,500자)',
        '영어 성적 (TOEIC 800+ 권장)',
        '전적대 성적증명서',
      ],
      recentTrends: '최근 3년간 합격자 평균 학점 3.8 이상, 전공 관련 활동 경험 보유자 선호',
      successRate: '87%',
    },
    {
      id: '2',
      name: '고려대학교',
      major: '경영학과',
      matchScore: 91,
      admissionType: '일반편입',
      competitionRate: '18:1',
      tuition: '약 430만원/학기',
      strengths: [
        '학점 우수',
        '리더십 경험 보유',
        '전공 적합성 높음',
        '영어 능력 우수',
      ],
      requirements: [
        '학업계획서 (800자)',
        '자기소개서 (1,200자)',
        '영어 성적 (TOEIC 850+ 권장)',
        '전적대 성적증명서',
      ],
      recentTrends: '글로벌 마인드와 리더십을 중시하는 경향, 인턴 경험 가산점',
      successRate: '82%',
    },
    {
      id: '3',
      name: '서강대학교',
      major: '경영학과',
      matchScore: 89,
      admissionType: '일반편입',
      competitionRate: '12:1',
      tuition: '약 420만원/학기',
      strengths: [
        '학점 경쟁력 우수',
        '소규모 정예 교육',
        '실무 경험 보유',
        '목표 명확성',
      ],
      requirements: [
        '학업계획서 (1,000자)',
        '자기소개서 (1,000자)',
        '영어 성적 (선택)',
        '전적대 성적증명서',
      ],
      recentTrends: '학업 열정과 전공 적합성을 가장 중시, 서류 평가 비중 높음',
      successRate: '85%',
    },
    {
      id: '4',
      name: '성균관대학교',
      major: '글로벌경영학과',
      matchScore: 86,
      admissionType: '일반편입',
      competitionRate: '14:1',
      tuition: '약 440만원/학기',
      strengths: [
        '글로벌 역량 보유',
        '학점 우수',
        '전공 다양성 확보',
        '실무 경험 풍부',
      ],
      requirements: [
        '학업계획서 (800자)',
        '영어 에세이 (500단어)',
        'TOEIC 900+ 또는 TOEFL 90+',
        '전적대 성적증명서',
      ],
      recentTrends: '글로벌 경쟁력을 갖춘 인재 선호, 영어 능력 중요',
      successRate: '79%',
    },
  ];

  const otherMajors = [
    { name: '경제학과', universities: ['연세대', '고려대', '서강대'], matchScore: 88 },
    { name: '경영정보학과', universities: ['연세대', '성균관대'], matchScore: 85 },
    { name: '글로벌리더학부', universities: '고려대', matchScore: 83 },
    { name: '국제경영학과', universities: ['한양대', '중앙대'], matchScore: 81 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container-web py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold gradient-text flex items-center gap-2">
                <Brain className="w-7 h-7 text-indigo-600" />
                AI 맞춤 편입 추천
              </h1>
              <p className="text-sm text-gray-600">나에게 맞는 대학과 전공을 AI가 분석합니다</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-web py-8">
        <div className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            {/* Step 1: Input Form */}
            {step === 'input' && (
              <motion.div
                key="input"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <Card className="p-8 card-modern">
                  <div className="flex items-start gap-4 mb-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border-2 border-indigo-200">
                    <Sparkles className="w-8 h-8 text-indigo-600 flex-shrink-0 mt-1" />
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-2">
                        AI가 당신의 편입 성공을 돕습니다
                      </h2>
                      <p className="text-gray-700">
                        입력하신 정보를 바탕으로 최적의 대학과 전공을 추천하고, 
                        합격 가능성과 준비 전략을 제시합니다.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* 정형 정보 */}
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-indigo-600" />
                        기본 정보
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            현재 대학
                          </label>
                          <input
                            type="text"
                            placeholder="예: 서울시립대학교"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors"
                            value={formData.currentUniversity}
                            onChange={(e) => setFormData({ ...formData, currentUniversity: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            현재 전공
                          </label>
                          <input
                            type="text"
                            placeholder="예: 경영학과"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors"
                            value={formData.currentMajor}
                            onChange={(e) => setFormData({ ...formData, currentMajor: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            평균 학점 (4.5 만점)
                          </label>
                          <input
                            type="text"
                            placeholder="예: 4.2"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors"
                            value={formData.gpa}
                            onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            희망 분야
                          </label>
                          <input
                            type="text"
                            placeholder="예: 경영, 마케팅"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors"
                            value={formData.targetField}
                            onChange={(e) => setFormData({ ...formData, targetField: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>

                    {/* 비정형 정보 */}
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Target className="w-5 h-5 text-purple-600" />
                        자유 기술
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            주요 경험 및 활동
                          </label>
                          <textarea
                            rows={4}
                            placeholder="동아리, 봉사활동, 인턴, 프로젝트 등 주요 경험을 자유롭게 작성해주세요"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors resize-none"
                            value={formData.experiences}
                            onChange={(e) => setFormData({ ...formData, experiences: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            나의 강점
                          </label>
                          <textarea
                            rows={3}
                            placeholder="학업, 리더십, 언어, 특기 등 자신의 강점을 작성해주세요"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors resize-none"
                            value={formData.strengths}
                            onChange={(e) => setFormData({ ...formData, strengths: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            편입 목표 및 동기
                          </label>
                          <textarea
                            rows={4}
                            placeholder="왜 편입을 준비하시나요? 어떤 목표를 가지고 계신가요?"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors resize-none"
                            value={formData.goals}
                            onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end">
                    <Button
                      size="lg"
                      className="btn-primary px-8 py-6 text-lg rounded-2xl"
                      onClick={handleSubmit}
                      disabled={!formData.currentUniversity || !formData.gpa}
                    >
                      <Sparkles className="w-5 h-5 mr-2" />
                      AI 분석 시작하기
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Step 2: Analyzing */}
            {step === 'analyzing' && (
              <motion.div
                key="analyzing"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center justify-center min-h-[600px]"
              >
                <Card className="p-12 text-center max-w-md">
                  <motion.div
                    animate={{
                      rotate: 360,
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                      scale: { duration: 1, repeat: Infinity },
                    }}
                    className="w-24 h-24 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl"
                  >
                    <Brain className="w-12 h-12 text-white" />
                  </motion.div>
                  <h2 className="text-2xl font-bold gradient-text mb-3">AI 분석 중...</h2>
                  <p className="text-gray-600 mb-6">
                    입력하신 정보를 바탕으로<br />
                    최적의 대학과 전공을 찾고 있습니다
                  </p>
                  <div className="space-y-2 text-sm text-gray-500">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      ✓ 학업 역량 분석 완료
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1 }}
                    >
                      ✓ 경험 및 활동 평가 완료
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.5 }}
                    >
                      ✓ 대학별 매칭도 계산 중...
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 2 }}
                    >
                      ✓ 합격 전략 수립 중...
                    </motion.div>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Step 3: Results */}
            {step === 'results' && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Success Banner */}
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  <Card className="p-8 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 text-white">
                    <div className="flex items-start gap-6">
                      <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-10 h-10 text-white" />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-3xl font-bold mb-3">AI 분석 완료!</h2>
                        <p className="text-indigo-100 text-lg mb-4">
                          입력하신 정보를 바탕으로 {recommendations.length}개의 최적 대학을 추천합니다.
                          각 대학의 상세 정보와 합격 전략을 확인해보세요.
                        </p>
                        <div className="flex gap-4 text-sm">
                          <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
                            📊 평균 매칭도: {Math.round(recommendations.reduce((sum, r) => sum + r.matchScore, 0) / recommendations.length)}%
                          </div>
                          <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
                            🎯 최고 매칭: {recommendations[0].name}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>

                {/* Recommendations */}
                <div className="space-y-4">
                  {recommendations.map((school, index) => {
                    const isExpanded = expandedSchool === school.id;

                    return (
                      <motion.div
                        key={school.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className={`overflow-hidden transition-all ${
                          isExpanded ? 'shadow-2xl ring-2 ring-indigo-500' : 'hover:shadow-lg'
                        }`}>
                          {/* Header */}
                          <div
                            className={`p-6 cursor-pointer ${
                              index === 0
                                ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border-b-2 border-amber-200'
                                : 'bg-white'
                            }`}
                            onClick={() => setExpandedSchool(isExpanded ? null : school.id)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-4 flex-1">
                                {/* Rank Badge */}
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg ${
                                  index === 0
                                    ? 'bg-gradient-to-br from-amber-400 to-yellow-500 text-white'
                                    : index === 1
                                    ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-white'
                                    : index === 2
                                    ? 'bg-gradient-to-br from-orange-300 to-amber-400 text-white'
                                    : 'bg-gradient-to-br from-indigo-400 to-purple-500 text-white'
                                }`}>
                                  {index + 1}
                                </div>

                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-2xl font-bold text-gray-900">
                                      {school.name}
                                    </h3>
                                    {index === 0 && (
                                      <Badge className="bg-gradient-to-r from-amber-500 to-yellow-600 text-white border-0">
                                        <Award className="w-3 h-3 mr-1" />
                                        최고 추천
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="text-lg text-gray-700 font-medium mb-3">
                                    {school.major} · {school.admissionType}
                                  </div>
                                  <div className="flex flex-wrap gap-2 mb-3">
                                    <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                                      경쟁률: {school.competitionRate}
                                    </Badge>
                                    <Badge className="bg-green-100 text-green-700 border-green-200">
                                      합격률: {school.successRate}
                                    </Badge>
                                    <Badge className="bg-purple-100 text-purple-700 border-purple-200">
                                      {school.tuition}
                                    </Badge>
                                  </div>
                                </div>

                                {/* Match Score */}
                                <div className="text-center flex-shrink-0">
                                  <div className="relative w-24 h-24">
                                    <svg className="w-full h-full transform -rotate-90">
                                      <circle
                                        cx="48"
                                        cy="48"
                                        r="40"
                                        stroke="#e5e7eb"
                                        strokeWidth="8"
                                        fill="none"
                                      />
                                      <motion.circle
                                        cx="48"
                                        cy="48"
                                        r="40"
                                        stroke="url(#gradient)"
                                        strokeWidth="8"
                                        fill="none"
                                        strokeLinecap="round"
                                        initial={{ strokeDasharray: "0 251.2" }}
                                        animate={{
                                          strokeDasharray: `${(school.matchScore / 100) * 251.2} 251.2`,
                                        }}
                                        transition={{ duration: 1, delay: index * 0.1 }}
                                      />
                                      <defs>
                                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                          <stop offset="0%" stopColor="#6366f1" />
                                          <stop offset="100%" stopColor="#a855f7" />
                                        </linearGradient>
                                      </defs>
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                      <div className="text-3xl font-bold gradient-text">
                                        {school.matchScore}
                                      </div>
                                      <div className="text-xs text-gray-600">매칭도</div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Expand Icon */}
                              <div className="ml-4">
                                {isExpanded ? (
                                  <ChevronUp className="w-6 h-6 text-gray-400" />
                                ) : (
                                  <ChevronDown className="w-6 h-6 text-gray-400" />
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Expanded Content */}
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                              >
                                <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-t border-gray-200 space-y-6">
                                  {/* Strengths */}
                                  <div>
                                    <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                                      당신의 강점 (추천 이유)
                                    </h4>
                                    <div className="grid md:grid-cols-2 gap-2">
                                      {school.strengths.map((strength, i) => (
                                        <div key={i} className="flex items-start gap-2 bg-white p-3 rounded-lg">
                                          <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                          <span className="text-sm text-gray-700">{strength}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Requirements */}
                                  <div>
                                    <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                      <BookOpen className="w-5 h-5 text-indigo-600" />
                                      지원 요건
                                    </h4>
                                    <div className="grid md:grid-cols-2 gap-2">
                                      {school.requirements.map((req, i) => (
                                        <div key={i} className="flex items-start gap-2 bg-white p-3 rounded-lg">
                                          <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 flex-shrink-0" />
                                          <span className="text-sm text-gray-700">{req}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Recent Trends */}
                                  <div>
                                    <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                      <TrendingUp className="w-5 h-5 text-purple-600" />
                                      최근 입시 트렌드
                                    </h4>
                                    <div className="bg-white p-4 rounded-lg">
                                      <p className="text-sm text-gray-700 flex items-start gap-2">
                                        <Info className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                                        {school.recentTrends}
                                      </p>
                                    </div>
                                  </div>

                                  {/* Actions */}
                                  <div className="flex gap-3">
                                    <Button className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 rounded-xl py-6">
                                      <Users className="w-5 h-5 mr-2" />
                                      경험 전달자 찾기
                                    </Button>
                                    <Button variant="outline" className="rounded-xl px-6">
                                      <ExternalLink className="w-5 h-5" />
                                    </Button>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Other Majors */}
                <Card className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Target className="w-6 h-6 text-indigo-600" />
                    다른 학과 후보
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {otherMajors.map((major, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                      >
                        <Card className="p-5 bg-gradient-to-br from-gray-50 to-gray-100 hover:shadow-md transition-shadow cursor-pointer">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-bold text-gray-900 mb-1">{major.name}</h4>
                              <p className="text-sm text-gray-600">
                                {Array.isArray(major.universities) 
                                  ? major.universities.join(', ')
                                  : major.universities}
                              </p>
                            </div>
                            <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200">
                              {major.matchScore}%
                            </Badge>
                          </div>
                          <Button variant="outline" size="sm" className="w-full">
                            자세히 보기
                          </Button>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </Card>

                {/* Next Steps */}
                <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-green-600" />
                    다음 단계
                  </h3>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-start gap-3 bg-white p-4 rounded-xl">
                      <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0">
                        1
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 mb-1">경험 전달자 매칭</div>
                        <div className="text-sm text-gray-600">
                          추천 대학에 합격한 선배들과 연결되어 실제 경험을 들어보세요
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 bg-white p-4 rounded-xl">
                      <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0">
                        2
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 mb-1">AI 학계서 작성</div>
                        <div className="text-sm text-gray-600">
                          AI의 도움을 받아 합격 가능성 높은 학업계획서를 작성하세요
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 bg-white p-4 rounded-xl">
                      <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0">
                        3
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 mb-1">전략적 준비</div>
                        <div className="text-sm text-gray-600">
                          추천받은 정보를 바탕으로 체계적인 편입 준비를 시작하세요
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button
                    size="lg"
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 rounded-xl py-6 text-lg"
                    onClick={onComplete}
                  >
                    <Award className="w-5 h-5 mr-2" />
                    경험 전달자 찾으러 가기
                  </Button>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}