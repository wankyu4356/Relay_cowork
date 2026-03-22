import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import {
  Award,
  ChevronDown,
  ChevronUp,
  Star,
  CalendarClock,
  TrendingUp,
  BookOpen,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { NextStepsCard } from '../shared/NextStepsCard';
import { CERTIFICATION_CONFIG } from '../../../lib/recommendation-data/certificationData';
import type {
  CertificationRecommendation,
  CertificationAlternative,
} from '../../../lib/recommendation-data/certificationData';

interface CertificationResultsProps {
  recommendations: CertificationRecommendation[];
  alternatives: CertificationAlternative[];
  onComplete?: () => void;
  examDate?: string;
}

function DdayBanner({ examDate }: { examDate: string }) {
  const daysLeft = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const exam = new Date(examDate);
    exam.setHours(0, 0, 0, 0);
    const diff = exam.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }, [examDate]);

  const colorClass =
    daysLeft > 60
      ? 'from-green-50 to-emerald-50 border-green-300'
      : daysLeft > 30
        ? 'from-yellow-50 to-amber-50 border-yellow-300'
        : 'from-red-50 to-rose-50 border-red-300';

  const textColor =
    daysLeft > 60
      ? 'text-green-700'
      : daysLeft > 30
        ? 'text-yellow-700'
        : 'text-red-700';

  const badgeColor =
    daysLeft > 60
      ? 'bg-green-500'
      : daysLeft > 30
        ? 'bg-yellow-500'
        : 'bg-red-500';

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card
        className={`p-6 bg-gradient-to-r ${colorClass} border-2 text-center`}
      >
        <div className="flex items-center justify-center gap-3 mb-2">
          <CalendarClock className={`w-6 h-6 ${textColor}`} />
          <span className="text-sm font-medium text-gray-600">
            시험 예정일: {examDate}
          </span>
        </div>
        <div className="flex items-center justify-center gap-2">
          <span
            className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${badgeColor} text-white text-xs font-bold`}
          >
            D
          </span>
          <span className={`text-5xl font-extrabold ${textColor}`}>
            {daysLeft > 0 ? `-${daysLeft}` : daysLeft === 0 ? '-Day' : `+${Math.abs(daysLeft)}`}
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          {daysLeft > 60
            ? '충분한 시간이 있습니다. 계획적으로 준비하세요!'
            : daysLeft > 30
              ? '시간이 빠르게 지나갑니다. 집중력을 높이세요!'
              : daysLeft > 0
                ? '시험이 얼마 남지 않았습니다. 마무리 학습에 집중하세요!'
                : '시험일이 지났습니다.'}
        </p>
      </Card>
    </motion.div>
  );
}

function DifficultyGauge({ difficulty }: { difficulty: number }) {
  const angle = (difficulty / 10) * 180;
  const radius = 60;
  const cx = 80;
  const cy = 75;

  // Background arc (full semicircle)
  const bgArcEnd = {
    x: cx + radius * Math.cos(Math.PI),
    y: cy - radius * Math.sin(Math.PI),
  };

  const bgD = `M ${cx + radius} ${cy} A ${radius} ${radius} 0 1 1 ${bgArcEnd.x} ${cy}`;

  // Value arc
  const endAngleRad = (angle * Math.PI) / 180;
  const endX = cx + radius * Math.cos(Math.PI - endAngleRad);
  const endY = cy - radius * Math.sin(Math.PI - endAngleRad);
  const largeArc = angle > 180 ? 1 : 0;

  const valueD = `M ${cx + radius} ${cy} A ${radius} ${radius} 0 ${largeArc} 1 ${endX} ${endY}`;

  const strokeColor =
    difficulty <= 3
      ? '#22c55e'
      : difficulty <= 5
        ? '#eab308'
        : difficulty <= 7
          ? '#f97316'
          : '#ef4444';

  return (
    <div className="flex flex-col items-center">
      <svg width="160" height="90" viewBox="0 0 160 90">
        {/* Background arc */}
        <path
          d={bgD}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="12"
          strokeLinecap="round"
        />
        {/* Value arc with animation */}
        <motion.path
          d={valueD}
          fill="none"
          stroke={strokeColor}
          strokeWidth="12"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
        {/* Center text */}
        <text
          x={cx}
          y={cy - 5}
          textAnchor="middle"
          className="text-2xl font-bold"
          fill={strokeColor}
        >
          {difficulty}
        </text>
        <text
          x={cx}
          y={cy + 12}
          textAnchor="middle"
          className="text-xs"
          fill="#9ca3af"
        >
          / 10
        </text>
      </svg>
      <span className="text-xs text-gray-500 -mt-1">난이도</span>
    </div>
  );
}

function StudyRoadmapTimeline({
  roadmap,
}: {
  roadmap: CertificationRecommendation['studyRoadmap'];
}) {
  return (
    <div className="relative pl-8">
      {/* Vertical line */}
      <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-indigo-200" />
      {roadmap.map((item, index) => (
        <motion.div
          key={item.week}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.15, duration: 0.4 }}
          className="relative mb-4 last:mb-0"
        >
          {/* Node */}
          <div
            className={`absolute -left-5 w-6 h-6 rounded-full flex items-center justify-center ${
              item.milestone
                ? 'bg-indigo-600 text-white'
                : 'bg-white border-2 border-indigo-300'
            }`}
          >
            {item.milestone ? (
              <Star className="w-3 h-3" />
            ) : (
              <span className="text-[10px] font-bold text-indigo-600">
                {item.week}
              </span>
            )}
          </div>
          {/* Content */}
          <div
            className={`ml-4 p-3 rounded-xl ${
              item.milestone ? 'bg-indigo-50 border border-indigo-200' : 'bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-900 text-sm">
                {item.week}주차: {item.topic}
              </span>
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {item.hours}시간
              </span>
            </div>
            {item.milestone && (
              <div className="mt-1 text-xs font-medium text-indigo-600 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                {item.milestone}
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function WeeklyScheduleTable({
  schedule,
}: {
  schedule: CertificationRecommendation['weeklySchedule'];
}) {
  const totalHours = schedule.reduce((sum, s) => sum + s.hours, 0);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b-2 border-indigo-200">
            <th className="py-2 px-3 text-left text-gray-600 font-semibold">요일</th>
            <th className="py-2 px-3 text-left text-gray-600 font-semibold">과목</th>
            <th className="py-2 px-3 text-right text-gray-600 font-semibold">시간</th>
          </tr>
        </thead>
        <tbody>
          {schedule.map((row) => (
            <tr key={row.day} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-2 px-3 font-medium text-indigo-600">{row.day}</td>
              <td className="py-2 px-3 text-gray-800">{row.subject}</td>
              <td className="py-2 px-3 text-right text-gray-600">{row.hours}h</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-indigo-200">
            <td className="py-2 px-3 font-bold text-gray-900" colSpan={2}>
              주간 총 학습 시간
            </td>
            <td className="py-2 px-3 text-right font-bold text-indigo-600">
              {totalHours}h
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

function RecommendationCard({
  rec,
  index,
}: {
  rec: CertificationRecommendation;
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15, duration: 0.5 }}
    >
      <Card className="p-6 card-modern hover:shadow-lg transition-shadow">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">
              {index + 1}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">{rec.name}</h3>
              <p className="text-sm text-gray-500">{rec.field}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-extrabold text-indigo-600">
              {rec.matchScore}%
            </div>
            <div className="text-xs text-gray-500">적합도</div>
          </div>
        </div>

        {/* Key metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <div className="text-xs text-gray-500 mb-1">합격률</div>
            <div className="font-bold text-gray-900">{rec.passRate}</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <div className="text-xs text-gray-500 mb-1">학습 기간</div>
            <div className="font-bold text-gray-900">{rec.studyPeriod}</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <div className="text-xs text-gray-500 mb-1">비용</div>
            <div className="font-bold text-gray-900 text-xs">{rec.cost}</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 flex items-center justify-center">
            <DifficultyGauge difficulty={rec.difficulty} />
          </div>
        </div>

        {/* Strengths */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
            <TrendingUp className="w-4 h-4 text-green-500" />
            추천 이유
          </h4>
          <div className="flex flex-wrap gap-2">
            {rec.strengths.map((s, i) => (
              <span
                key={i}
                className="inline-block bg-green-50 text-green-700 text-xs px-3 py-1 rounded-full"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Expand/Collapse */}
        <Button
          variant="ghost"
          className="w-full text-indigo-600 hover:text-indigo-800"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <>
              접기 <ChevronUp className="w-4 h-4 ml-1" />
            </>
          ) : (
            <>
              상세 정보 보기 <ChevronDown className="w-4 h-4 ml-1" />
            </>
          )}
        </Button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-4 space-y-6 border-t border-gray-100">
                {/* Requirements */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                    <BookOpen className="w-4 h-4 text-indigo-500" />
                    응시 요건
                  </h4>
                  <ul className="space-y-1">
                    {rec.requirements.map((r, i) => (
                      <li
                        key={i}
                        className="text-sm text-gray-600 flex items-start gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recent trends */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <h4 className="text-sm font-semibold text-amber-800 mb-1">
                    최근 동향
                  </h4>
                  <p className="text-sm text-amber-700">{rec.recentTrends}</p>
                </div>

                {/* Study Roadmap */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1">
                    <Star className="w-4 h-4 text-indigo-500" />
                    학습 로드맵
                  </h4>
                  <StudyRoadmapTimeline roadmap={rec.studyRoadmap} />
                </div>

                {/* Weekly Schedule */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1">
                    <CalendarClock className="w-4 h-4 text-indigo-500" />
                    주간 학습 계획표
                  </h4>
                  <WeeklyScheduleTable schedule={rec.weeklySchedule} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}

export function CertificationResults({
  recommendations,
  alternatives,
  onComplete,
  examDate,
}: CertificationResultsProps) {
  return (
    <div className="space-y-6">
      {/* Success banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 text-center">
          <Award className="w-10 h-10 text-indigo-600 mx-auto mb-2" />
          <h2 className="text-xl font-bold text-gray-900">
            {recommendations.length}개의 맞춤 자격증을 찾았습니다!
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            AI가 분석한 최적의 자격증과 학습 전략을 확인하세요
          </p>
        </Card>
      </motion.div>

      {/* D-day countdown */}
      {examDate && <DdayBanner examDate={examDate} />}

      {/* Recommendation cards */}
      {recommendations.map((rec, index) => (
        <RecommendationCard key={rec.id} rec={rec} index={index} />
      ))}

      {/* Alternatives */}
      {alternatives.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              이런 자격증도 고려해보세요
            </h3>
            <div className="grid md:grid-cols-2 gap-3">
              {alternatives.map((alt) => (
                <div
                  key={alt.name}
                  className="flex items-center justify-between bg-gray-50 rounded-xl p-4"
                >
                  <div>
                    <div className="font-semibold text-gray-900">{alt.name}</div>
                    <div className="text-xs text-gray-500">
                      {Array.isArray(alt.institutions)
                        ? alt.institutions.join(', ')
                        : alt.institutions}
                    </div>
                  </div>
                  <div className="text-sm font-bold text-indigo-600">
                    {alt.matchScore}%
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Next steps */}
      <NextStepsCard
        steps={CERTIFICATION_CONFIG.nextSteps}
        ctaText="릴레이 러너 찾으러 가기"
        onComplete={onComplete}
      />
    </div>
  );
}
