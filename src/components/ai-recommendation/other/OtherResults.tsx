import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import {
  Sparkles,
  Award,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  BookOpen,
  TrendingUp,
  Info,
  Users,
  ExternalLink,
  Target,
  Star,
  Calendar,
  User,
  ClipboardCheck,
} from 'lucide-react';
import { NextStepsCard } from '../shared/NextStepsCard';
import { OTHER_CONFIG } from '../../../lib/recommendation-data/otherData';
import type { OtherRecommendation, OtherAlternative } from '../../../lib/recommendation-data/otherData';

interface OtherResultsProps {
  recommendations: OtherRecommendation[];
  alternatives: OtherAlternative[];
  onComplete?: () => void;
}

export function OtherResults({ recommendations, alternatives, onComplete }: OtherResultsProps) {
  const [expandedPath, setExpandedPath] = useState<string | null>(null);

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
                입력하신 정보를 바탕으로 {recommendations.length}개의 추천 경로를 제시합니다.
                각 경로의 상세 정보와 실행 전략을 확인해보세요.
              </p>
              <div className="flex gap-4 text-sm">
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
                  평균 매칭도: {Math.round(recommendations.reduce((sum, r) => sum + r.matchScore, 0) / recommendations.length)}%
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
                  최고 매칭: {recommendations[0].pathName}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Milestone Timeline */}
      <Card className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-indigo-600" />
          마일스톤 타임라인 - {recommendations[0].pathName}
        </h3>
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-indigo-200" />

          <div className="space-y-6">
            {recommendations[0].milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.15 }}
                className="relative flex items-start gap-4 pl-2"
              >
                {/* Dot */}
                <div
                  className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                    milestone.isKey
                      ? 'bg-gradient-to-br from-amber-400 to-yellow-500 shadow-lg'
                      : 'bg-indigo-100 border-2 border-indigo-300'
                  }`}
                >
                  {milestone.isKey ? (
                    <Star className="w-4 h-4 text-white" />
                  ) : (
                    <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full" />
                  )}
                </div>

                {/* Content */}
                <div className={`flex-1 p-4 rounded-xl ${milestone.isKey ? 'bg-amber-50 border border-amber-200' : 'bg-gray-50'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={milestone.isKey ? 'bg-amber-100 text-amber-700 border-amber-300' : 'bg-indigo-100 text-indigo-700 border-indigo-200'}>
                      {milestone.month}개월차
                    </Badge>
                    {milestone.isKey && (
                      <Badge className="bg-amber-500 text-white border-0 text-xs">핵심</Badge>
                    )}
                  </div>
                  <h4 className="font-bold text-gray-900 mb-1">{milestone.title}</h4>
                  <p className="text-sm text-gray-600">{milestone.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Card>

      {/* Success Cases */}
      <Card className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <User className="w-6 h-6 text-green-600" />
          성공 사례
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {recommendations.flatMap((rec) =>
            rec.successCases.map((sc, scIndex) => (
              <motion.div
                key={`${rec.id}-${scIndex}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: scIndex * 0.1 }}
              >
                <Card className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 h-full">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {sc.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{sc.name}</div>
                      <div className="text-xs text-gray-500">{sc.duration}</div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">배경: </span>
                      <span className="text-gray-600">{sc.background}</span>
                    </div>
                    <div>
                      <span className="font-medium text-green-700">결과: </span>
                      <span className="text-gray-600">{sc.outcome}</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </Card>

      {/* Resource Checklist */}
      <Card className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <ClipboardCheck className="w-6 h-6 text-purple-600" />
          리소스 체크리스트 - {recommendations[0].pathName}
        </h3>
        <div className="space-y-2">
          {(() => {
            const checklist = recommendations[0].resourceChecklist;
            const categories = [...new Set(checklist.map((item) => item.category))];
            return categories.map((category) => (
              <div key={category} className="mb-4">
                <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  {category}
                </div>
                <div className="space-y-2">
                  {checklist
                    .filter((item) => item.category === category)
                    .map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div
                          className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${
                            item.completed
                              ? 'bg-green-500 text-white'
                              : 'border-2 border-gray-300 bg-white'
                          }`}
                        >
                          {item.completed && (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          )}
                        </div>
                        <span className={`text-sm ${item.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                          {item.item}
                        </span>
                        <Badge className="ml-auto bg-gray-100 text-gray-500 border-gray-200 text-xs">
                          {item.category}
                        </Badge>
                      </div>
                    ))}
                </div>
              </div>
            ));
          })()}
        </div>
      </Card>

      {/* Recommendation Cards */}
      <div className="space-y-4">
        {recommendations.map((path, index) => {
          const isExpanded = expandedPath === path.id;

          return (
            <motion.div
              key={path.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={`overflow-hidden transition-all ${
                  isExpanded ? 'shadow-2xl ring-2 ring-indigo-500' : 'hover:shadow-lg'
                }`}
              >
                {/* Header */}
                <div
                  className={`p-6 cursor-pointer ${
                    index === 0
                      ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border-b-2 border-amber-200'
                      : 'bg-white'
                  }`}
                  onClick={() => setExpandedPath(isExpanded ? null : path.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      {/* Rank Badge */}
                      <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg ${
                          index === 0
                            ? 'bg-gradient-to-br from-amber-400 to-yellow-500 text-white'
                            : index === 1
                            ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-white'
                            : index === 2
                            ? 'bg-gradient-to-br from-orange-300 to-amber-400 text-white'
                            : 'bg-gradient-to-br from-indigo-400 to-purple-500 text-white'
                        }`}
                      >
                        {index + 1}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-2xl font-bold text-gray-900">{path.pathName}</h3>
                          {index === 0 && (
                            <Badge className="bg-gradient-to-r from-amber-500 to-yellow-600 text-white border-0">
                              <Award className="w-3 h-3 mr-1" />
                              최고 추천
                            </Badge>
                          )}
                        </div>
                        <div className="text-lg text-gray-700 font-medium mb-3">
                          {path.description} · {path.type}
                        </div>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                            경쟁률: {path.competitionRate}
                          </Badge>
                          <Badge className="bg-green-100 text-green-700 border-green-200">
                            성공률: {path.successRate}
                          </Badge>
                          <Badge className="bg-purple-100 text-purple-700 border-purple-200">
                            {path.cost}
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
                              stroke={`url(#gradient-${path.id})`}
                              strokeWidth="8"
                              fill="none"
                              strokeLinecap="round"
                              initial={{ strokeDasharray: '0 251.2' }}
                              animate={{
                                strokeDasharray: `${(path.matchScore / 100) * 251.2} 251.2`,
                              }}
                              transition={{ duration: 1, delay: index * 0.1 }}
                            />
                            <defs>
                              <linearGradient id={`gradient-${path.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#6366f1" />
                                <stop offset="100%" stopColor="#a855f7" />
                              </linearGradient>
                            </defs>
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <div className="text-3xl font-bold gradient-text">{path.matchScore}</div>
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
                            {path.strengths.map((strength, i) => (
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
                            필요 요건
                          </h4>
                          <div className="grid md:grid-cols-2 gap-2">
                            {path.requirements.map((req, i) => (
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
                            최근 트렌드
                          </h4>
                          <div className="bg-white p-4 rounded-lg">
                            <p className="text-sm text-gray-700 flex items-start gap-2">
                              <Info className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                              {path.recentTrends}
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

      {/* Alternatives */}
      <Card className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Target className="w-6 h-6 text-indigo-600" />
          다른 경로 후보
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
      <NextStepsCard steps={OTHER_CONFIG.nextSteps} onComplete={onComplete} />
    </motion.div>
  );
}
