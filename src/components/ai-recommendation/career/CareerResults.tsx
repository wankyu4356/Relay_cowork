import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../../ui/card';
import { Badge } from '../../ui/badge';
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import {
  CheckCircle,
  Trophy,
  ChevronDown,
  ChevronUp,
  Briefcase,
  TrendingUp,
  MessageSquare,
  Gift,
  Star,
} from 'lucide-react';
import { NextStepsCard } from '../shared/NextStepsCard';
import { FadeIn, Stagger, Press, CountUp } from '../../ui/motion';
import {
  careerNextSteps,
  type CareerRecommendation,
  type CareerAlternative,
} from '../../../lib/recommendation-data/careerData';

interface CareerResultsProps {
  recommendations: CareerRecommendation[];
  alternatives: CareerAlternative[];
  onComplete?: () => void;
}

const radarLabels: Record<string, string> = {
  technicalFit: '기술매칭',
  cultureFit: '문화적합',
  growthPotential: '성장가능성',
  salaryFit: '연봉적합',
  workLifeBalance: '워라밸',
  careerPath: '커리어패스',
};

function MatchScoreCircle({ score }: { score: number }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <svg width="88" height="88" viewBox="0 0 88 88">
      <circle
        cx="44"
        cy="44"
        r={radius}
        fill="none"
        stroke="#e4e4e7"
        strokeWidth="6"
      />
      <circle
        cx="44"
        cy="44"
        r={radius}
        fill="none"
        stroke="#4f46e5"
        strokeWidth="6"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 44 44)"
      />
      <text
        x="44"
        y="44"
        textAnchor="middle"
        dominantBaseline="central"
        className="text-lg font-semibold fill-zinc-900 tnum"
      >
        {score}%
      </text>
    </svg>
  );
}

export function CareerResults({
  recommendations,
  alternatives,
  onComplete,
}: CareerResultsProps) {
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const topRec = recommendations[0];

  const toggleExpand = (id: string) => {
    setExpandedCards((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Radar chart data
  const radarData = Object.entries(topRec.jobFitScores).map(([key, value]) => ({
    subject: radarLabels[key] || key,
    score: value,
    fullMark: 100,
  }));

  // Salary bar chart data
  const salaryData = recommendations.map((rec) => {
    const numbers = rec.salaryRange.match(/[\d,]+/g) || [];
    const min = Number(numbers[0]?.replace(/,/g, '') || 0);
    const max = Number(numbers[1]?.replace(/,/g, '') || 0);
    return {
      name: rec.companyName,
      min,
      max,
      range: max - min,
    };
  });

  const rankColors = [
    'bg-zinc-900',
    'bg-zinc-700',
    'bg-zinc-500',
    'bg-zinc-400',
  ];

  return (
    <motion.div
      key="results"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container-web py-8 space-y-6"
    >
      {/* Success Banner */}
      <FadeIn y={-20}>
        <Card className="p-6 rounded-2xl bg-white border border-zinc-200/80">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-iris-600 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-zinc-900">
                AI 분석이 완료되었습니다!
              </h2>
              <p className="text-sm text-zinc-600">
                회원님의 역량과 경험을 바탕으로 {recommendations.length}개 기업을
                추천합니다
              </p>
            </div>
          </div>
        </Card>
      </FadeIn>

      {/* Radar Chart - Job Fit */}
      <FadeIn delay={0.1}>
        <Card className="p-6 rounded-2xl">
          <h3 className="text-lg font-semibold tracking-tight text-zinc-900 mb-2 flex items-center gap-2">
            <Star className="w-5 h-5 text-iris-600" />
            직무 적합도 분석 - {topRec.companyName}
          </h3>
          <p className="text-sm text-zinc-400 mb-4">
            1순위 추천 기업의 6가지 적합도 지표
          </p>
          <div className="w-full h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Radar
                  name="적합도"
                  dataKey="score"
                  stroke="#4f46e5"
                  fill="#4f46e5"
                  fillOpacity={0.25}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </FadeIn>

      {/* Salary Comparison Bar Chart */}
      <FadeIn delay={0.2}>
        <Card className="p-6 rounded-2xl">
          <h3 className="text-lg font-semibold tracking-tight text-zinc-900 mb-2 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-iris-600" />
            연봉 비교
          </h3>
          <p className="text-sm text-zinc-400 mb-4">
            추천 기업별 연봉 범위 비교 (만원)
          </p>
          <div className="w-full h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salaryData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  width={70}
                />
                <Tooltip
                  formatter={(value: number, name: string) => [
                    `${value.toLocaleString()}만원`,
                    name === 'min' ? '최소' : '범위',
                  ]}
                />
                <Bar dataKey="min" stackId="salary" fill="#c7d2fe" name="최소" />
                <Bar dataKey="range" stackId="salary" fill="#4f46e5" name="범위" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </FadeIn>

      {/* Company Recommendation Cards */}
      {recommendations.map((rec, index) => (
        <FadeIn key={rec.id} delay={0.3 + index * 0.1}>
          <Card className="p-6 rounded-2xl">
            <div className="flex items-start gap-4 mb-4">
              <div
                className={`w-10 h-10 ${rankColors[index] || 'bg-zinc-300'} rounded-lg flex items-center justify-center text-white font-semibold flex-shrink-0 tnum`}
              >
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-semibold tracking-tight text-zinc-900">
                    {rec.companyName}
                  </h3>
                  <Badge variant="outline" className="text-xs">
                    {rec.type}
                  </Badge>
                </div>
                <p className="text-sm text-zinc-600">{rec.position}</p>
              </div>
              <MatchScoreCircle score={rec.matchScore} />
            </div>

            {/* Info Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary" className="text-xs">
                <Trophy className="w-3 h-3 mr-1" />
                경쟁률 {rec.competitionRate}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                <Briefcase className="w-3 h-3 mr-1" />
                {rec.salaryRange}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                <TrendingUp className="w-3 h-3 mr-1" />
                합격 {rec.successRate}
              </Badge>
            </div>

            {/* Expandable Section */}
            <button
              onClick={() => toggleExpand(rec.id)}
              className="w-full flex items-center justify-center gap-1 text-sm text-iris-600 hover:text-iris-700 transition-colors py-2"
            >
              {expandedCards.has(rec.id) ? (
                <>
                  접기 <ChevronUp className="w-4 h-4" />
                </>
              ) : (
                <>
                  상세 정보 보기 <ChevronDown className="w-4 h-4" />
                </>
              )}
            </button>

            <AnimatePresence>
              {expandedCards.has(rec.id) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 space-y-4 border-t border-zinc-200/80">
                    {/* Strengths */}
                    <div>
                      <h4 className="font-semibold tracking-tight text-zinc-900 mb-2 flex items-center gap-1">
                        <Star className="w-4 h-4 text-iris-600" />
                        강점
                      </h4>
                      <ul className="space-y-1">
                        {rec.strengths.map((s, i) => (
                          <li
                            key={i}
                            className="text-sm text-zinc-600 flex items-start gap-2"
                          >
                            <span className="text-iris-600 mt-0.5">-</span>
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Requirements */}
                    <div>
                      <h4 className="font-semibold tracking-tight text-zinc-900 mb-2 flex items-center gap-1">
                        <Briefcase className="w-4 h-4 text-zinc-400" />
                        자격 요건
                      </h4>
                      <ul className="space-y-1">
                        {rec.requirements.map((r, i) => (
                          <li
                            key={i}
                            className="text-sm text-zinc-600 flex items-start gap-2"
                          >
                            <span className="text-zinc-400 mt-0.5">-</span>
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Recent Trends */}
                    <div>
                      <h4 className="font-semibold tracking-tight text-zinc-900 mb-2 flex items-center gap-1">
                        <TrendingUp className="w-4 h-4 text-zinc-400" />
                        최근 동향
                      </h4>
                      <p className="text-sm text-zinc-600">{rec.recentTrends}</p>
                    </div>

                    {/* Interview Tips */}
                    <div>
                      <h4 className="font-semibold tracking-tight text-zinc-900 mb-2 flex items-center gap-1">
                        <MessageSquare className="w-4 h-4 text-iris-600" />
                        면접 팁
                      </h4>
                      <ul className="space-y-1">
                        {rec.interviewTips.map((tip, i) => (
                          <li
                            key={i}
                            className="text-sm text-zinc-600 flex items-start gap-2"
                          >
                            <span className="text-iris-600 mt-0.5 tnum">
                              {i + 1}.
                            </span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Benefits */}
                    <div>
                      <h4 className="font-semibold tracking-tight text-zinc-900 mb-2 flex items-center gap-1">
                        <Gift className="w-4 h-4 text-zinc-400" />
                        복리후생
                      </h4>
                      <ul className="space-y-1">
                        {rec.benefits.map((b, i) => (
                          <li
                            key={i}
                            className="text-sm text-zinc-600 flex items-start gap-2"
                          >
                            <span className="text-zinc-400 mt-0.5">-</span>
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </FadeIn>
      ))}

      {/* Alternatives */}
      <FadeIn delay={0.7}>
        <Card className="p-6 rounded-2xl">
          <h3 className="text-lg font-semibold tracking-tight text-zinc-900 mb-4">
            다른 추천 직무
          </h3>
          <Stagger className="space-y-3">
            {alternatives.map((alt, index) => (
              <Stagger.Item key={index}>
                <Press lift={false}>
                  <div className="flex items-center justify-between p-3 bg-zinc-50 border border-zinc-200/80 rounded-xl">
                    <div>
                      <div className="font-semibold tracking-tight text-zinc-900">{alt.name}</div>
                      <div className="text-xs text-zinc-400">
                        {Array.isArray(alt.institutions)
                          ? alt.institutions.join(', ')
                          : alt.institutions}
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs tnum">
                      {alt.matchScore}% 적합
                    </Badge>
                  </div>
                </Press>
              </Stagger.Item>
            ))}
          </Stagger>
        </Card>
      </FadeIn>

      {/* Next Steps */}
      <FadeIn delay={0.8}>
        <NextStepsCard steps={careerNextSteps} onComplete={onComplete} />
      </FadeIn>
    </motion.div>
  );
}
