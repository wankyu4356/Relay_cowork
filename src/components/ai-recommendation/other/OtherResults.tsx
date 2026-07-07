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
import { FadeIn, Stagger, Press, CountUp, Tilt, ScrollReveal, ScrollStagger } from '../../ui/motion';
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
      <FadeIn>
        <Tilt max={4}>
        <Card className="p-8 rounded-2xl bg-gradient-to-br from-zinc-900 to-iris-800 text-white border-0 shadow-lg">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-semibold tracking-tight mb-3">AI 분석 완료!</h2>
              <p className="text-zinc-300 text-lg mb-4">
                입력하신 정보를 바탕으로 {recommendations.length}개의 추천 경로를 제시합니다.
                각 경로의 상세 정보와 실행 전략을 확인해보세요.
              </p>
              <div className="flex gap-4 text-sm">
                <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                  평균 매칭도: <CountUp value={Math.round(recommendations.reduce((sum, r) => sum + r.matchScore, 0) / recommendations.length)} suffix="%" />
                </div>
                <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                  최고 매칭: {recommendations[0].pathName}
                </div>
              </div>
            </div>
          </div>
        </Card>
        </Tilt>
      </FadeIn>

      {/* Milestone Timeline */}
      <Card className="p-6 rounded-2xl">
        <h3 className="text-xl font-semibold tracking-tight text-zinc-900 mb-6 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-iris-600" />
          마일스톤 타임라인 - {recommendations[0].pathName}
        </h3>
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-zinc-200" />

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
                      ? 'bg-iris-600 shadow-sm'
                      : 'bg-iris-50 border border-iris-200'
                  }`}
                >
                  {milestone.isKey ? (
                    <Star className="w-4 h-4 text-white" />
                  ) : (
                    <div className="w-2.5 h-2.5 bg-iris-600 rounded-full" />
                  )}
                </div>

                {/* Content */}
                <div className={`flex-1 p-4 rounded-xl ${milestone.isKey ? 'bg-iris-50 border border-iris-100' : 'bg-zinc-50 border border-zinc-200/80'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={milestone.isKey ? 'bg-iris-100 text-iris-700 border-iris-200 tnum' : 'bg-zinc-100 text-zinc-600 border-zinc-200 tnum'}>
                      {milestone.month}개월차
                    </Badge>
                    {milestone.isKey && (
                      <Badge className="bg-iris-600 text-white border-0 text-xs">핵심</Badge>
                    )}
                  </div>
                  <h4 className="font-semibold tracking-tight text-zinc-900 mb-1">{milestone.title}</h4>
                  <p className="text-sm text-zinc-600">{milestone.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Card>

      {/* Success Cases */}
      <Card className="p-6 rounded-2xl">
        <h3 className="text-xl font-semibold tracking-tight text-zinc-900 mb-4 flex items-center gap-2">
          <User className="w-6 h-6 text-iris-600" />
          성공 사례
        </h3>
        <Stagger className="grid md:grid-cols-2 gap-4">
          {recommendations.flatMap((rec) =>
            rec.successCases.map((sc, scIndex) => (
              <Stagger.Item key={`${rec.id}-${scIndex}`}>
                <Card className="p-5 bg-white border border-zinc-200/80 rounded-2xl shadow-sm h-full">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-10 h-10 bg-iris-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {sc.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold tracking-tight text-zinc-900">{sc.name}</div>
                      <div className="text-xs text-zinc-400">{sc.duration}</div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium text-zinc-700">배경: </span>
                      <span className="text-zinc-600">{sc.background}</span>
                    </div>
                    <div>
                      <span className="font-medium text-iris-700">결과: </span>
                      <span className="text-zinc-600">{sc.outcome}</span>
                    </div>
                  </div>
                </Card>
              </Stagger.Item>
            ))
          )}
        </Stagger>
      </Card>

      {/* Resource Checklist */}
      <Card className="p-6 rounded-2xl">
        <h3 className="text-xl font-semibold tracking-tight text-zinc-900 mb-4 flex items-center gap-2">
          <ClipboardCheck className="w-6 h-6 text-iris-600" />
          리소스 체크리스트 - {recommendations[0].pathName}
        </h3>
        <div className="space-y-2">
          {(() => {
            const checklist = recommendations[0].resourceChecklist;
            const categories = [...new Set(checklist.map((item) => item.category))];
            return categories.map((category) => (
              <div key={category} className="mb-4">
                <div className="text-sm font-semibold text-zinc-400 uppercase tracking-wide mb-2">
                  {category}
                </div>
                <div className="space-y-2">
                  {checklist
                    .filter((item) => item.category === category)
                    .map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-zinc-50 rounded-lg hover:bg-zinc-100 transition-colors"
                      >
                        <div
                          className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${
                            item.completed
                              ? 'bg-iris-600 text-white'
                              : 'border-2 border-zinc-300 bg-white'
                          }`}
                        >
                          {item.completed && (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          )}
                        </div>
                        <span className={`text-sm ${item.completed ? 'text-zinc-400 line-through' : 'text-zinc-600'}`}>
                          {item.item}
                        </span>
                        <Badge className="ml-auto bg-zinc-100 text-zinc-500 border-zinc-200 text-xs">
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
                className={`overflow-hidden transition-all rounded-2xl ${
                  isExpanded ? 'shadow-lg ring-1 ring-iris-600' : 'hover:shadow-md'
                }`}
              >
                {/* Header */}
                <div
                  className={`p-6 cursor-pointer ${
                    index === 0
                      ? 'bg-iris-50 border-b border-iris-100'
                      : 'bg-white'
                  }`}
                  onClick={() => setExpandedPath(isExpanded ? null : path.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      {/* Rank Badge */}
                      <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-semibold tnum shadow-sm ${
                          index === 0
                            ? 'bg-iris-600 text-white'
                            : 'bg-zinc-900 text-white'
                        }`}
                      >
                        {index + 1}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-2xl font-semibold tracking-tight text-zinc-900">{path.pathName}</h3>
                          {index === 0 && (
                            <Badge className="bg-iris-600 text-white border-0">
                              <Award className="w-3 h-3 mr-1" />
                              최고 추천
                            </Badge>
                          )}
                        </div>
                        <div className="text-lg text-zinc-600 font-medium mb-3">
                          {path.description} · {path.type}
                        </div>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge className="bg-zinc-100 text-zinc-600 border-zinc-200">
                            경쟁률: {path.competitionRate}
                          </Badge>
                          <Badge className="bg-iris-50 text-iris-700 border-iris-100">
                            성공률: {path.successRate}
                          </Badge>
                          <Badge className="bg-zinc-100 text-zinc-600 border-zinc-200">
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
                              stroke="#e4e4e7"
                              strokeWidth="8"
                              fill="none"
                            />
                            <motion.circle
                              cx="48"
                              cy="48"
                              r="40"
                              stroke="#5b5bd6"
                              strokeWidth="8"
                              fill="none"
                              strokeLinecap="round"
                              initial={{ strokeDasharray: '0 251.2' }}
                              animate={{
                                strokeDasharray: `${(path.matchScore / 100) * 251.2} 251.2`,
                              }}
                              transition={{ duration: 1, delay: index * 0.1 }}
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <div className="text-3xl font-semibold tracking-tight text-zinc-900"><CountUp value={path.matchScore} /></div>
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
                          <Stagger className="grid md:grid-cols-2 gap-2">
                            {path.strengths.map((strength, i) => (
                              <Stagger.Item key={i} className="flex items-start gap-2 bg-white border border-zinc-200/80 p-3 rounded-lg">
                                <CheckCircle2 className="w-4 h-4 text-iris-600 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-zinc-600">{strength}</span>
                              </Stagger.Item>
                            ))}
                          </Stagger>
                        </div>

                        {/* Requirements */}
                        <div>
                          <h4 className="font-semibold tracking-tight text-zinc-900 mb-3 flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-iris-600" />
                            필요 요건
                          </h4>
                          <Stagger className="grid md:grid-cols-2 gap-2">
                            {path.requirements.map((req, i) => (
                              <Stagger.Item key={i} className="flex items-start gap-2 bg-white border border-zinc-200/80 p-3 rounded-lg">
                                <div className="w-2 h-2 bg-iris-600 rounded-full mt-2 flex-shrink-0" />
                                <span className="text-sm text-zinc-600">{req}</span>
                              </Stagger.Item>
                            ))}
                          </Stagger>
                        </div>

                        {/* Recent Trends */}
                        <div>
                          <h4 className="font-semibold tracking-tight text-zinc-900 mb-3 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-iris-600" />
                            최근 트렌드
                          </h4>
                          <div className="bg-white border border-zinc-200/80 p-4 rounded-lg">
                            <p className="text-sm text-zinc-600 flex items-start gap-2">
                              <Info className="w-4 h-4 text-iris-600 mt-0.5 flex-shrink-0" />
                              {path.recentTrends}
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
      <ScrollReveal>
      <Card className="p-6 rounded-2xl">
        <h3 className="text-xl font-semibold tracking-tight text-zinc-900 mb-4 flex items-center gap-2">
          <Target className="w-6 h-6 text-iris-600" />
          다른 경로 후보
        </h3>
        <ScrollStagger className="grid md:grid-cols-2 gap-4">
          {alternatives.map((alt, index) => (
            <ScrollStagger.Item key={index}>
              <Press>
                <Card className="p-5 bg-white border border-zinc-200/80 rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold tracking-tight text-zinc-900 mb-1">{alt.name}</h4>
                      <p className="text-sm text-zinc-600">
                        {Array.isArray(alt.institutions)
                          ? alt.institutions.join(', ')
                          : alt.institutions}
                      </p>
                    </div>
                    <Badge className="bg-iris-50 text-iris-700 border-iris-100 tnum">
                      {alt.matchScore}%
                    </Badge>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    자세히 보기
                  </Button>
                </Card>
              </Press>
            </ScrollStagger.Item>
          ))}
        </ScrollStagger>
      </Card>
      </ScrollReveal>

      {/* Next Steps */}
      <NextStepsCard steps={OTHER_CONFIG.nextSteps} onComplete={onComplete} />
    </motion.div>
  );
}
