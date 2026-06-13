import { useState } from 'react';
import { motion } from 'motion/react';
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  TrendingUp,
  BarChart3,
  Star,
  AlertCircle,
  Layers,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { NextStepsCard } from '../shared/NextStepsCard';
import { FadeIn, Stagger, Press, CountUp } from '../../ui/motion';
import type { AdmissionRecommendation, AdmissionAlternative } from '../../../lib/recommendation-data/admissionData';
import { admissionNextSteps } from '../../../lib/recommendation-data/admissionData';

interface AdmissionResultsProps {
  recommendations: AdmissionRecommendation[];
  alternatives: AdmissionAlternative[];
  onComplete?: () => void;
}

const groupOrder: Array<AdmissionRecommendation['group']> = ['수시', '가군', '나군', '다군'];

const groupColors: Record<string, string> = {
  수시: 'bg-iris-50 text-iris-700 border-iris-200',
  가군: 'bg-iris-100 text-iris-700 border-iris-200',
  나군: 'bg-zinc-100 text-zinc-700 border-zinc-200',
  다군: 'bg-zinc-50 text-zinc-600 border-zinc-200',
};

export function AdmissionResults({ recommendations, alternatives, onComplete }: AdmissionResultsProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const groupedRecommendations = groupOrder
    .map((group) => ({
      group,
      items: recommendations.filter((r) => r.group === group),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <FadeIn
      key="results"
      className="container-web py-8 space-y-8"
    >
      {/* Success Banner */}
      <Card className="p-6 bg-gradient-to-r from-zinc-900 to-iris-800 text-white border-0 rounded-2xl shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">분석 완료!</h2>
            <p className="text-white/80">
              {recommendations.length}개의 추천 대학과 {alternatives.length}개의 대안 전공을 찾았습니다
            </p>
          </div>
        </div>
      </Card>

      {/* 배치표 (Placement Table) */}
      <Card className="p-6 rounded-2xl">
        <h3 className="text-xl font-semibold tracking-tight text-zinc-900 mb-4 flex items-center gap-2">
          <Layers className="w-6 h-6 text-iris-600" />
          배치표
        </h3>
        <Stagger className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {groupOrder.map((group) => {
            const items = recommendations.filter((r) => r.group === group);
            return (
              <Stagger.Item key={group} className={`rounded-xl border p-3 ${items.length > 0 ? 'border-iris-200 bg-iris-50/50' : 'border-zinc-200/80 bg-zinc-50'}`}>
                <Badge className={`mb-2 ${groupColors[group]}`}>{group}</Badge>
                {items.length > 0 ? (
                  items.map((item) => (
                    <div key={item.id} className="text-sm mb-1">
                      <div className="font-semibold text-zinc-900">{item.name}</div>
                      <div className="text-zinc-400 text-xs">{item.department}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-zinc-400">해당 없음</div>
                )}
              </Stagger.Item>
            );
          })}
        </Stagger>
      </Card>

      {/* Grouped Recommendations */}
      {groupedRecommendations.map(({ group, items }) => (
        <div key={group} className="space-y-4">
          <h3 className="text-lg font-semibold tracking-tight text-zinc-900 flex items-center gap-2">
            <Badge className={`text-base px-3 py-1 ${groupColors[group]}`}>{group}</Badge>
            추천 대학
          </h3>

          {items.map((rec, index) => (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Card className="overflow-hidden rounded-2xl">
                {/* Card Header */}
                <div
                  className="p-6 cursor-pointer hover:bg-zinc-50 transition-colors"
                  onClick={() => toggleExpand(rec.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center text-white font-semibold text-lg tnum">
                        {rec.matchScore}
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold tracking-tight text-zinc-900">{rec.name}</h4>
                        <p className="text-zinc-600">{rec.department}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {rec.admissionType}
                          </Badge>
                          <Badge className={`text-xs ${groupColors[rec.group]}`}>{rec.group}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-sm text-zinc-400">경쟁률</div>
                        <div className="font-semibold text-iris-600 tnum">{rec.competitionRate}</div>
                      </div>
                      {expandedId === rec.id ? (
                        <ChevronUp className="w-5 h-5 text-zinc-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-zinc-400" />
                      )}
                    </div>
                  </div>

                  {/* Match Score Bar */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-zinc-400">매칭 점수</span>
                      <span className="font-semibold text-iris-600 tnum">{rec.matchScore}%</span>
                    </div>
                    <div className="w-full bg-zinc-100 rounded-full h-2">
                      <div
                        className="bg-iris-600 h-2 rounded-full transition-all"
                        style={{ width: `${rec.matchScore}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                {expandedId === rec.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-zinc-200/80"
                  >
                    <div className="p-6 space-y-6">
                      {/* Stats Grid */}
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-3 bg-iris-50 rounded-xl">
                          <div className="text-sm text-zinc-400">합격선</div>
                          <div className="text-lg font-semibold text-iris-600 tnum">{rec.cutoffScore}</div>
                        </div>
                        <div className="text-center p-3 bg-zinc-50 rounded-xl">
                          <div className="text-sm text-zinc-400">경쟁률</div>
                          <div className="text-lg font-semibold text-zinc-900 tnum">{rec.competitionRate}</div>
                        </div>
                        <div className="text-center p-3 bg-zinc-50 rounded-xl">
                          <div className="text-sm text-zinc-400">합격률</div>
                          <div className="text-lg font-semibold text-zinc-900 tnum">{rec.successRate}</div>
                        </div>
                      </div>

                      {/* 합격선 추이 Line Chart */}
                      <Card className="p-4 rounded-2xl">
                        <h5 className="text-sm font-semibold text-zinc-700 mb-3 flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-iris-600" />
                          합격선 추이
                        </h5>
                        <ResponsiveContainer width="100%" height={200}>
                          <LineChart data={rec.historicalCutoffs}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                            <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Legend />
                            <Line
                              type="monotone"
                              dataKey="score"
                              stroke="#6366f1"
                              strokeWidth={2}
                              dot={{ fill: '#6366f1', r: 4 }}
                              name="합격선"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </Card>

                      {/* 경쟁률 트렌드 Bar Chart */}
                      <Card className="p-4 rounded-2xl">
                        <h5 className="text-sm font-semibold text-zinc-700 mb-3 flex items-center gap-2">
                          <BarChart3 className="w-4 h-4 text-iris-600" />
                          경쟁률 트렌드
                        </h5>
                        <ResponsiveContainer width="100%" height={200}>
                          <BarChart data={rec.competitionTrend}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                            <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Legend />
                            <Bar
                              dataKey="rate"
                              fill="#6366f1"
                              radius={[4, 4, 0, 0]}
                              name="경쟁률"
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </Card>

                      {/* Strengths */}
                      <div>
                        <h5 className="text-sm font-semibold text-zinc-700 mb-2 flex items-center gap-2">
                          <Star className="w-4 h-4 text-iris-600" />
                          강점
                        </h5>
                        <div className="space-y-1">
                          {rec.strengths.map((strength, i) => (
                            <div key={i} className="flex items-start gap-2 text-sm text-zinc-600">
                              <CheckCircle className="w-4 h-4 text-iris-600 mt-0.5 flex-shrink-0" />
                              {strength}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Requirements */}
                      <div>
                        <h5 className="text-sm font-semibold text-zinc-700 mb-2 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-zinc-400" />
                          준비 사항
                        </h5>
                        <div className="space-y-1">
                          {rec.requirements.map((req, i) => (
                            <div key={i} className="flex items-start gap-2 text-sm text-zinc-600">
                              <div className="w-4 h-4 rounded-full bg-zinc-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                              </div>
                              {req}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Recent Trends */}
                      <div className="bg-iris-50 rounded-xl p-4">
                        <h5 className="text-sm font-semibold text-iris-700 mb-1">최근 동향</h5>
                        <p className="text-sm text-iris-600">{rec.recentTrends}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      ))}

      {/* Alternatives */}
      <Card className="p-6 rounded-2xl">
        <h3 className="text-xl font-semibold tracking-tight text-zinc-900 mb-4 flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-iris-600" />
          대안 전공 추천
        </h3>
        <Stagger className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {alternatives.map((alt) => (
            <Stagger.Item key={alt.name}>
              <Press className="block bg-zinc-50 border border-zinc-200/80 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-zinc-900">{alt.name}</h4>
                  <Badge variant="outline" className="text-iris-600 border-iris-200 tnum">
                    {alt.matchScore}%
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-1">
                  {(Array.isArray(alt.institutions) ? alt.institutions : [alt.institutions]).map(
                    (inst) => (
                      <Badge key={inst} variant="secondary" className="text-xs">
                        {inst}
                      </Badge>
                    )
                  )}
                </div>
              </Press>
            </Stagger.Item>
          ))}
        </Stagger>
      </Card>

      {/* Next Steps */}
      <NextStepsCard
        steps={admissionNextSteps}
        ctaText="합격생 러너 찾으러 가기"
        onComplete={onComplete}
      />
    </FadeIn>
  );
}
