import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Tabs, TabsList, TabsTrigger } from '../../ui/tabs';
import { NextStepsCard } from '../shared/NextStepsCard';
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
        <Card className="p-8 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 text-white">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-3">AI 분석 완료!</h2>
              <p className="text-indigo-100 text-lg mb-4">
                입력하신 정보를 바탕으로 {recommendations.length}개의 대학을 추천합니다.
                각 대학의 상세 정보와 합격 전략을 확인해보세요.
              </p>
              <div className="flex gap-4 text-sm">
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
                  평균 매칭도: {Math.round(recommendations.reduce((sum, r) => sum + r.matchScore, 0) / recommendations.length)}%
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
                  최고 매칭: {recommendations[0].name}
                </div>
              </div>
            </div>
          </div>
        </Card>
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
                          {school.department} · {school.transferType}
                        </div>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                            경쟁률: {school.competitionRate}
                          </Badge>
                          <Badge className="bg-green-100 text-green-700 border-green-200">
                            합격률: {school.successRate}
                          </Badge>
                          <Badge className="bg-purple-100 text-purple-700 border-purple-200">
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
                              initial={{ strokeDasharray: '0 251.2' }}
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
                            릴레이 러너 찾기
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

      {/* Alternatives */}
      <Card className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Target className="w-6 h-6 text-indigo-600" />
          다른 추천 학과
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {alternatives.map((alt, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <Card className="p-5 bg-gradient-to-br from-gray-50 to-gray-100 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">{alt.name}</h4>
                    <p className="text-sm text-gray-600">
                      {Array.isArray(alt.institutions)
                        ? alt.institutions.join(', ')
                        : alt.institutions}
                    </p>
                  </div>
                  <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200">
                    {alt.matchScore}%
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
      <NextStepsCard steps={TRANSFER_CONFIG.nextSteps} onComplete={onComplete} />
    </motion.div>
  );
}
