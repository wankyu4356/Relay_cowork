import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { 
  Sparkles, 
  Search, 
  Calendar, 
  MessageSquare,
  Star,
  TrendingUp,
  Users,
  Award,
  Bell,
  Settings as SettingsIcon,
  Home,
  FileText,
  Network
} from 'lucide-react';
import type { Screen, Mentor } from '../App';
import { useMentors } from '../hooks/useMentors';

interface MenteeHomeProps {
  onNavigate: (screen: Screen) => void;
  onMentorSelect: (mentor: Mentor) => void;
  credits: number;
}

export function MenteeHome({ onNavigate, onMentorSelect, credits }: MenteeHomeProps) {
  const { mentors: mockMentors } = useMentors();
  const getBadgeStyle = (badge: string) => {
    switch (badge) {
      case 'gold': return 'badge-gold';
      case 'silver': return 'badge-silver';
      case 'bronze': return 'badge-bronze';
      default: return '';
    }
  };

  const getBadgeIcon = (badge: string) => {
    switch (badge) {
      case 'gold': return '🥇';
      case 'silver': return '🥈';
      case 'bronze': return '🥉';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container-web py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                안녕하세요 👋
              </h1>
              <p className="text-gray-600 mt-1">편입 준비 어떻게 진행되고 있나요?</p>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => onNavigate('notifications')}>
                <Bell className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => onNavigate('settings')}>
                <SettingsIcon className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="어떤 학교 편입을 준비하시나요?"
              className="pl-12 pr-4 py-6 text-lg bg-gray-50 border-gray-200 focus:bg-white focus:border-sky-400"
              onClick={() => onNavigate('mentor-search')}
            />
          </div>
        </div>
      </div>

      <div className="container-web py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* AI CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            className="cursor-pointer"
            onClick={() => onNavigate('ai-experience')}
          >
            <Card className="relative overflow-hidden border-0 shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-sky-500 to-blue-600"></div>
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
              </div>
              <div className="relative p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <Sparkles className="w-8 h-8 text-white" />
                      <Badge className="bg-white/20 text-white border-0 backdrop-blur">
                        무료 {credits}회 체험
                      </Badge>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-3">
                      ✨ AI로 학업계획서 초안 만들기
                    </h2>
                    <p className="text-white/90 text-lg mb-6">
                      경험을 입력하면, 지원 학과에 맞는<br />
                      스토리라인과 초안을 생성해 드려요
                    </p>
                    <Button 
                      size="lg"
                      className="bg-white text-sky-600 hover:bg-gray-50 font-semibold shadow-lg"
                    >
                      지금 시작하기 →
                    </Button>
                  </div>
                  <div className="text-8xl opacity-20 animate-float">✨</div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-4 gap-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="p-6 text-center card-hover cursor-pointer" onClick={() => onNavigate('session-list')}>
                <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-7 h-7 text-purple-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">0</div>
                <div className="text-sm text-gray-600">진행중 세션</div>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="p-6 text-center card-hover cursor-pointer" onClick={() => onNavigate('ai-management')}>
                <div className="w-14 h-14 bg-gradient-to-br from-sky-100 to-sky-200 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="w-7 h-7 text-sky-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{credits}</div>
                <div className="text-sm text-gray-600">AI 크레딧</div>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card className="p-6 text-center card-hover">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Users className="w-7 h-7 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">142</div>
                <div className="text-sm text-gray-600">활성 러너</div>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card className="p-6 text-center card-hover">
                <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-7 h-7 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">87%</div>
                <div className="text-sm text-gray-600">평균 합격률</div>
              </Card>
            </motion.div>
          </div>

          {/* Recommended Mentors */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">⭐ 추천 러너</h2>
              <Button 
                variant="ghost"
                onClick={() => onNavigate('mentor-search')}
                className="text-sky-600 hover:text-sky-700 hover:bg-sky-50"
              >
                전체보기 →
              </Button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockMentors.map((mentor, index) => (
                <motion.div
                  key={mentor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card 
                    className="p-6 cursor-pointer card-hover"
                    onClick={() => onMentorSelect(mentor)}
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-sky-400 to-blue-500 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">
                        {mentor.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg">{mentor.name}</h3>
                          <Badge className={`${getBadgeStyle(mentor.badge)} text-xs px-2 py-0 border-0`}>
                            {getBadgeIcon(mentor.badge)}
                          </Badge>
                          {mentor.verified && (
                            <span className="text-blue-500" title="합격증 인증">✅</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          {mentor.university} {mentor.major}
                        </p>
                        <p className="text-xs text-gray-500">{mentor.year}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-sm mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{mentor.rating}</span>
                        <span className="text-gray-500">({mentor.reviews})</span>
                      </div>
                      <span className="text-gray-300">•</span>
                      <span className="text-gray-600">합격률 {mentor.successRate}%</span>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div>
                        <div className="text-lg font-bold text-sky-600">
                          ₩{(mentor.price / 1000).toFixed(0)}k
                        </div>
                        <div className="text-xs text-gray-500">60분 세션</div>
                      </div>
                      <Button size="sm" className="bg-sky-500 hover:bg-sky-600 text-white">
                        상세보기
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Success Banner */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 p-8">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">🎉 이번 달 합격 소식</h3>
                  <p className="text-gray-700 mb-4">
                    릴레이를 통해 87명이 편입에 성공했어요
                  </p>
                  <Button variant="outline" className="border-amber-300 hover:bg-amber-100">
                    합격 후기 보기
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}