import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Tabs, TabsList, TabsTrigger } from '../../ui/tabs';
import { NextStepsCard } from '../shared/NextStepsCard';
import { FadeIn, CountUp, Press, Tilt, ScrollReveal } from '../../ui/motion';
import { TRANSFER_CONFIG } from '../../../lib/recommendation-data/transferData';
import type { TransferRecommendation, TransferAlternative } from '../../../lib/recommendation-data/transferData';
import {
  Sparkles,
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
} from 'lucide-react';

interface TransferResultsProps {
  recommendations: TransferRecommendation[];
  alternatives: TransferAlternative[];
  onComplete?: () => void;
}

export function TransferResults({ recommendations, alternatives, onComplete }: TransferResultsProps) {
  const [expandedSchool, setExpandedSchool] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'전체' | '일반편입' | '학사편입' | '기타전형'>('전체');

  const filteredRecommendations = filterType === '전체'
    ? recommendations
    : recommendations.filter((r) => r.transferType === filterType);

  return (
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
        <Tilt max={4}>
        <Card className="p-8 rounded-2xl bg-gradient-to-br from-zinc-900 to-iris-800 text-white border-0 shadow-lg">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-semibold tracking-tight mb-3">AI 분석 완료!</h2>
              <p className="text-zinc-300 text-lg mb-4">
                입력하신 정보를 바탕으로 {recommendations.length}개의 대학을 추천합니다.
                각 대학의 상세 정보와 합격 전략을 확인해보세요.
              </p>
              <div className="flex gap-4 text-sm">
                <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                  평균 매칭도: <CountUp value={Math.round(recommendations.reduce((sum, r) => sum + r.matchScore, 0) / recommendations.length)} suffix="%" />
                </div>
                <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                  최고 매칭: {recommendations[0].name}
                </div>
              </div>
            </div>
          </div>
        </Card>
        </Tilt>
      </motion.div>

      {/* Filter Tabs */}
      <Tabs
        value={filterType}
        onValueChange={(value) => setFilterType(value as '전체' | '일반편입' | '학사편입' | '기타전형')}
      >
        <TabsList>
          <TabsTrigger value="전체">전체</TabsTrigger>
          <TabsTrigger value="일반편입">일반편입</TabsTrigger>
          <TabsTrigger value="학사편입">학사편입</TabsTrigger>
          <TabsTrigger value="기타전형">기타전형</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Recommendations */}
      <div className="space-y-4">
        {filteredRecommendations.map((school, index) => {
          const isExpanded = expandedSchool === school.id;

          return (
            <motion.div
              key={school.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`overflow-hidden rounded-2xl transition-all ${
                isExpanded ? 'shadow-lg ring-1 ring-iris-500' : 'hover:shadow-md'
              }`}>
                {/* Header */}
                <div
                  className={`p-6 cursor-pointer ${
                    index === 0
                      ? 'bg-iris-50 border-b border-iris-100'
                      : 'bg-white'
                  }`}
                  onClick={() => setExpandedSchool(isExpanded ? null : school.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      {/* Rank Badge */}
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-semibold tnum tracking-tight ${
                        index === 0
                          ? 'bg-iris-600 text-white shadow-sm'
                          : 'bg-zinc-100 text-zinc-600'
                      }`}>
                        {index + 1}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-2xl text-zinc-900 font-semibold tracking-tight">
                            {school.name}
                          </h3>
                          {index === 0 && (
                            <Badge className="bg-iris-600 text-white border-0">
                              <Award className="w-3 h-3 mr-1" />
                              최고 추천
                            </Badge>
                          )}
                        </div>
                        <div className="text-lg text-zinc-600 font-medium mb-3">
                          {school.department} · {school.transferType}
                        </div>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge className="bg-zinc-100 text-zinc-600 border-zinc-200/80">
                            경쟁률: {school.competitionRate}
                          </Badge>
                          <Badge className="bg-zinc-100 text-zinc-600 border-zinc-200/80">
                            합격률: {school.successRate}
                          </Badge>
                          <Badge className="bg-zinc-100 text-zinc-600 border-zinc-200/80">
                            {school.tuitionPerSemester}
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
                              stroke="#e4e4e7"
                              strokeWidth="8"
                              fill="none"
                            />
                            <motion.circle
                              cx="48"
                              cy="48"
                              r="40"
                              stroke="#5b53e8"
                              strokeWidth="8"
                              fill="none"
                              strokeLinecap="round"
                              initial={{ strokeDasharray: '0 251.2' }}
                              animate={{
                                strokeDasharray: `${(school.matchScore / 100) * 251.2} 251.2`,
                              }}
                              transition={{ duration: 1, delay: index * 0.1 }}
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <div className="text-3xl font-semibold tracking-tight tnum text-zinc-900">
                              <CountUp value={school.matchScore} />
                            </div>
                            <div className="text-xs text-zinc-400">매칭도</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expand Icon */}
                    <div className="ml-4">
                      {isExpanded ? (
                        <ChevronUp className="w-6 h-6 text-zinc-400" />
                      ) : (
                        <ChevronDown className="w-6 h-6 text-zinc-400" />
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
                      <div className="p-6 bg-zinc-50 border-t border-zinc-200/80 space-y-6">
                        {/* Strengths */}
                        <div>
                          <h4 className="font-semibold tracking-tight text-zinc-900 mb-3 flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-iris-600" />
                            당신의 강점 (추천 이유)
                          </h4>
                          <div className="grid md:grid-cols-2 gap-2">
                            {school.strengths.map((strength, i) => (
                              <div key={i} className="flex items-start gap-2 bg-white border border-zinc-200/80 p-3 rounded-lg">
                                <CheckCircle2 className="w-4 h-4 text-iris-600 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-zinc-600">{strength}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Requirements */}
                        <div>
                          <h4 className="font-semibold tracking-tight text-zinc-900 mb-3 flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-iris-600" />
                            지원 요건
                          </h4>
                          <div className="grid md:grid-cols-2 gap-2">
                            {school.requirements.map((req, i) => (
                              <div key={i} className="flex items-start gap-2 bg-white border border-zinc-200/80 p-3 rounded-lg">
                                <div className="w-2 h-2 bg-iris-600 rounded-full mt-2 flex-shrink-0" />
                                <span className="text-sm text-zinc-600">{req}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Recent Trends */}
                        <div>
                          <h4 className="font-semibold tracking-tight text-zinc-900 mb-3 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-iris-600" />
                            최근 입시 트렌드
                          </h4>
                          <div className="bg-white border border-zinc-200/80 p-4 rounded-lg">
                            <p className="text-sm text-zinc-600 flex items-start gap-2">
                              <Info className="w-4 h-4 text-iris-600 mt-0.5 flex-shrink-0" />
                              {school.recentTrends}
                            </p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                          <Press className="flex-1">
                            <Button className="w-full bg-zinc-900 text-white hover:bg-zinc-800 rounded-xl py-6 shine">
                              <Users className="w-5 h-5 mr-2" />
                              릴레이 러너 찾기
                            </Button>
                          </Press>
                          <Button variant="outline" className="rounded-xl px-6 border-zinc-200/80">
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

      {/* Alternatives */}
      <ScrollReveal>
      <Card className="p-6 rounded-2xl">
        <h3 className="text-xl font-semibold tracking-tight text-zinc-900 mb-4 flex items-center gap-2">
          <Target className="w-6 h-6 text-iris-600" />
          다른 추천 학과
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {alternatives.map((alt, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ y: -3 }}
            >
              <Card className="p-5 rounded-2xl bg-white border-zinc-200/80 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold tracking-tight text-zinc-900 mb-1">{alt.name}</h4>
                    <p className="text-sm text-zinc-600">
                      {Array.isArray(alt.institutions)
                        ? alt.institutions.join(', ')
                        : alt.institutions}
                    </p>
                  </div>
                  <Badge className="bg-iris-50 text-iris-600 border-iris-100 tnum">
                    {alt.matchScore}%
                  </Badge>
                </div>
                <Button variant="outline" size="sm" className="w-full border-zinc-200/80">
                  자세히 보기
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </Card>
      </ScrollReveal>

      {/* Next Steps */}
      <NextStepsCard steps={TRANSFER_CONFIG.nextSteps} onComplete={onComplete} />
    </motion.div>
  );
}
