import { motion } from 'motion/react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {
  ArrowLeft,
  TrendingUp,
  Award,
  Users,
  Target,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Star,
  Sparkles,
  BookOpen,
  Trophy
} from 'lucide-react';

interface MentorStatsProps {
  onBack: () => void;
}

interface MenteeSuccess {
  id: string;
  name: string;
  avatar: string;
  university: string;
  major: string;
  status: 'success' | 'in-progress' | 'failed';
  sessions: number;
  period: string;
  result: string;
  rating: number;
}

const menteeData: MenteeSuccess[] = [
  {
    id: '1',
    name: '러너 E',
    avatar: '👨‍🎓',
    university: '연세대',
    major: '경영학과',
    status: 'success',
    sessions: 8,
    period: '2024.09 - 2024.12',
    result: '최초합격',
    rating: 5.0,
  },
  {
    id: '2',
    name: '러너 F',
    avatar: '👩‍💼',
    university: '고려대',
    major: '경제학과',
    status: 'success',
    sessions: 12,
    period: '2024.08 - 2024.12',
    result: '최초합격',
    rating: 5.0,
  },
  {
    id: '3',
    name: '러너 G',
    avatar: '👨‍💼',
    university: '서강대',
    major: '경영학과',
    status: 'success',
    sessions: 6,
    period: '2024.10 - 2024.12',
    result: '예비 3번 합격',
    rating: 4.8,
  },
  {
    id: '4',
    name: '러너 H',
    avatar: '👩‍🎓',
    university: '성균관대',
    major: '글로벌경영',
    status: 'in-progress',
    sessions: 5,
    period: '2025.01 - 진행중',
    result: '준비중',
    rating: 5.0,
  },
  {
    id: '5',
    name: '러너 I',
    avatar: '👨‍🎓',
    university: '한양대',
    major: '경영학과',
    status: 'success',
    sessions: 10,
    period: '2024.07 - 2024.12',
    result: '최초합격',
    rating: 4.9,
  },
  {
    id: '6',
    name: '러너 J',
    avatar: '👩‍💼',
    university: '중앙대',
    major: '경영학과',
    status: 'success',
    sessions: 7,
    period: '2024.09 - 2024.12',
    result: '예비 1번 합격',
    rating: 5.0,
  },
  {
    id: '7',
    name: '러너 K',
    avatar: '👨‍💼',
    university: '경희대',
    major: '경영학과',
    status: 'failed',
    sessions: 4,
    period: '2024.10 - 2024.12',
    result: '불합격',
    rating: 4.5,
  },
  {
    id: '8',
    name: '러너 L',
    avatar: '👩‍🎓',
    university: '연세대',
    major: '경영학과',
    status: 'success',
    sessions: 9,
    period: '2024.08 - 2024.12',
    result: '최초합격',
    rating: 5.0,
  },
];

export function MentorStats({ onBack }: MentorStatsProps) {
  const successCount = menteeData.filter(m => m.status === 'success').length;
  const totalCompleted = menteeData.filter(m => m.status !== 'in-progress').length;
  const successRate = totalCompleted > 0 ? Math.round((successCount / totalCompleted) * 100) : 0;
  const avgSessions = Math.round(menteeData.reduce((sum, m) => sum + m.sessions, 0) / menteeData.length);
  const avgRating = (menteeData.reduce((sum, m) => sum + m.rating, 0) / menteeData.length).toFixed(1);

  const universities = [...new Set(menteeData.filter(m => m.status === 'success').map(m => m.university))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container-web py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold gradient-text">멘토링 성과 분석</h1>
              <p className="text-sm text-gray-600">전체 멘티들의 합격 현황과 통계</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-web py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Overview Stats */}
          <div className="grid md:grid-cols-4 gap-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="p-6 text-center bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <Trophy className="w-7 h-7 text-white" />
                </div>
                <div className="text-4xl font-bold text-green-700 mb-1">{successRate}%</div>
                <div className="text-sm text-gray-700 font-medium">평균 합격률</div>
                <div className="text-xs text-gray-600 mt-1">{successCount}/{totalCompleted}명 합격</div>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="p-6 text-center card-modern">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <Users className="w-7 h-7 text-indigo-600" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-1">{menteeData.length}</div>
                <div className="text-sm text-gray-600">총 멘티 수</div>
                <div className="text-xs text-gray-500 mt-1">누적 멘토링</div>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="p-6 text-center card-modern">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-sky-100 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <Calendar className="w-7 h-7 text-blue-600" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-1">{avgSessions}</div>
                <div className="text-sm text-gray-600">평균 세션 수</div>
                <div className="text-xs text-gray-500 mt-1">멘티당</div>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card className="p-6 text-center card-modern">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <Star className="w-7 h-7 text-amber-600" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-1">{avgRating}</div>
                <div className="text-sm text-gray-600">평균 평점</div>
                <div className="text-xs text-gray-500 mt-1">5점 만점</div>
              </Card>
            </motion.div>
          </div>

          {/* Success Universities */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="p-6 bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">합격 대학 현황</h3>
                  <p className="text-indigo-100 mb-4">
                    멘티들이 합격한 {universities.length}개 대학
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {universities.map((uni, i) => (
                      <Badge key={i} className="bg-white/20 backdrop-blur-sm text-white border-0 px-4 py-2">
                        {uni}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Success Timeline */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">멘티별 성과 현황</h2>
                <p className="text-sm text-gray-600">전체 멘토링 결과 한눈에 보기</p>
              </div>
            </div>

            <div className="space-y-3">
              {menteeData.map((mentee, index) => {
                const statusConfig = {
                  success: {
                    color: 'from-green-400 to-emerald-500',
                    bgColor: 'from-green-50 to-emerald-50',
                    borderColor: 'border-green-200',
                    icon: CheckCircle2,
                    badge: 'bg-green-500 text-white',
                    text: '합격',
                  },
                  'in-progress': {
                    color: 'from-blue-400 to-cyan-500',
                    bgColor: 'from-blue-50 to-cyan-50',
                    borderColor: 'border-blue-200',
                    icon: Clock,
                    badge: 'bg-blue-500 text-white',
                    text: '진행중',
                  },
                  failed: {
                    color: 'from-gray-400 to-gray-500',
                    bgColor: 'from-gray-50 to-gray-100',
                    borderColor: 'border-gray-200',
                    icon: XCircle,
                    badge: 'bg-gray-500 text-white',
                    text: '불합격',
                  },
                };

                const config = statusConfig[mentee.status];
                const StatusIcon = config.icon;

                return (
                  <motion.div
                    key={mentee.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                  >
                    <Card className={`p-5 bg-gradient-to-r ${config.bgColor} ${config.borderColor} border-2 hover:shadow-lg transition-shadow`}>
                      <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <div className={`w-16 h-16 bg-gradient-to-br ${config.color} rounded-2xl flex items-center justify-center text-2xl shadow-lg flex-shrink-0`}>
                          {mentee.avatar}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-gray-900">{mentee.name}</h3>
                            <Badge className={config.badge}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {config.text}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-700 font-medium mb-1">
                            {mentee.university} · {mentee.major}
                          </div>
                          <div className="flex items-center gap-4 text-xs text-gray-600">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {mentee.period}
                            </div>
                            <div className="flex items-center gap-1">
                              <BookOpen className="w-3 h-3" />
                              {mentee.sessions}회 세션
                            </div>
                            {mentee.status !== 'in-progress' && (
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-amber-500" />
                                {mentee.rating}점
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Result */}
                        <div className="text-right flex-shrink-0">
                          <div className={`text-lg font-bold ${
                            mentee.status === 'success' ? 'text-green-700' :
                            mentee.status === 'in-progress' ? 'text-blue-700' :
                            'text-gray-700'
                          }`}>
                            {mentee.result}
                          </div>
                          {mentee.status === 'success' && (
                            <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                              <Trophy className="w-3 h-3" />
                              성공
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </Card>

          {/* Insights */}
          <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-3 text-lg">💡 인사이트</h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <p>
                      <strong>높은 합격률:</strong> 전체 멘티의 {successRate}%가 목표 대학에 합격했습니다.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Target className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                    <p>
                      <strong>평균 세션:</strong> 합격생들은 평균 {avgSessions}회의 세션을 진행했습니다.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Star className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <p>
                      <strong>만족도:</strong> 멘티들의 평균 평점은 {avgRating}점으로 매우 높은 만족도를 보입니다.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Award className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                    <p>
                      <strong>주요 합격대학:</strong> {universities.slice(0, 3).join(', ')} 등 상위권 대학 합격률이 높습니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
