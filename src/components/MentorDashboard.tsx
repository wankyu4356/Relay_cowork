import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { RelayChainVisualization } from './RelayChainVisualization';
import { 
  Calendar, 
  DollarSign, 
  Users, 
  Star,
  TrendingUp,
  Clock,
  MessageSquare,
  Settings,
  Bell,
  Plus,
  Award,
  ArrowLeftRight,
  Network
} from 'lucide-react';
import type { Screen } from '../App';

interface MentorDashboardProps {
  onNavigate: (screen: Screen) => void;
  onRoleChange?: (role: 'mentee' | 'mentor') => void;
}

const upcomingSessions = [
  {
    id: '1',
    mentee: '러너 B',
    date: '2025.02.20',
    time: '14:00',
    duration: 60,
    status: 'confirmed',
  },
  {
    id: '2',
    mentee: '러너 C',
    date: '2025.02.21',
    time: '10:00',
    duration: 30,
    status: 'confirmed',
  },
  {
    id: '3',
    mentee: '러너 D',
    date: '2025.02.22',
    time: '16:00',
    duration: 60,
    status: 'pending',
  },
];

export function MentorDashboard({ onNavigate, onRoleChange }: MentorDashboardProps) {
  const stats = {
    totalRevenue: 450000,
    monthlySessions: 12,
    rating: 4.9,
    totalMentees: 35,
  };

  const handleSwitchToMentee = () => {
    onRoleChange?.('mentee');
    onNavigate('unified-home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-web py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                멘토 대시보드
              </h1>
              <p className="text-gray-600 mt-2">환영합니다, 러너 #2847 멘토님 👋</p>
            </div>
            <div className="flex gap-2">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="outline"
                  onClick={handleSwitchToMentee}
                  className="hover:bg-sky-50 hover:border-sky-300"
                >
                  <ArrowLeftRight className="w-4 h-4 mr-2" />
                  멘티로 전환
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" size="icon" onClick={() => onNavigate('notifications')}>
                  <Bell className="w-5 h-5" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" size="icon" onClick={() => onNavigate('settings')}>
                  <Settings className="w-5 h-5" />
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-web py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Quick Stats */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="p-6 card-hover cursor-pointer" onClick={() => onNavigate('mentor-revenue')}>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center">
                    <DollarSign className="w-7 h-7 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">이번 달 수익</div>
                    <div className="text-2xl font-bold">₩640k</div>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="p-6 card-hover cursor-pointer" onClick={() => onNavigate('session-list')}>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-sky-100 rounded-2xl flex items-center justify-center">
                    <Calendar className="w-7 h-7 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">이번 주 세션</div>
                    <div className="text-2xl font-bold">5건</div>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="p-6 card-hover cursor-pointer" onClick={() => onNavigate('mentor-mentee-list')}>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-violet-100 rounded-2xl flex items-center justify-center">
                    <Users className="w-7 h-7 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">총 멘티</div>
                    <div className="text-2xl font-bold">35명</div>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card className="p-6 card-hover cursor-pointer" onClick={() => onNavigate('mentor-reviews')}>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-yellow-100 to-amber-100 rounded-2xl flex items-center justify-center">
                    <Star className="w-7 h-7 text-yellow-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">평균 평점</div>
                    <div className="text-2xl font-bold">4.9</div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* EA Status Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6 bg-gradient-to-br from-sky-500 to-blue-600 text-white">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <Award className="w-8 h-8" />
                    <Badge className="bg-white/20 text-white border-0">🥇 GOLD 멘토</Badge>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Experience Asset (EA) 등록 완료</h3>
                  <p className="text-white/90 mb-4">
                    합격 경험이 등록되었습니다. 더 많은 정보를 공유하면 매칭률이 올라가요!
                  </p>
                  <Button 
                    className="bg-white text-sky-600 hover:bg-gray-100"
                    onClick={() => onNavigate('mentor-ea-wizard')}
                  >
                    EA 수정하기
                  </Button>
                </div>
                <div className="text-8xl opacity-20">✨</div>
              </div>
            </Card>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Upcoming Sessions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Calendar className="w-6 h-6 text-sky-600" />
                    다가오는 세션
                  </h2>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onNavigate('mentor-schedule')}
                  >
                    일정 관리
                  </Button>
                </div>

                <div className="space-y-3">
                  {upcomingSessions.map((session, index) => (
                    <motion.div
                      key={session.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                    >
                      <Card 
                        className="p-4 bg-gradient-to-r from-sky-50 to-blue-50 border-sky-200 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => onNavigate('session-detail')}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-sky-400 to-blue-500 rounded-xl flex items-center justify-center text-white text-xl">
                              👤
                            </div>
                            <div>
                              <div className="font-semibold">{session.mentee}</div>
                              <div className="text-sm text-gray-600">
                                {session.date} · {session.time} · {session.duration}분
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge className={session.status === 'confirmed' ? 'bg-green-500 text-white' : 'bg-amber-500 text-white'}>
                              {session.status === 'confirmed' ? '확정' : '대기'}
                            </Badge>
                            <Button
                              size="sm"
                              className="btn-primary"
                              onClick={(e) => {
                                e.stopPropagation();
                                onNavigate('session-detail');
                              }}
                            >
                              세션 시작
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}

                  {upcomingSessions.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>예정된 세션이 없습니다</p>
                    </div>
                  )}
                </div>

                <Button 
                  className="w-full mt-4 bg-sky-500 hover:bg-sky-600 text-white"
                  onClick={() => onNavigate('mentor-schedule')}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  가능 시간 추가하기
                </Button>
              </Card>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <h2 className="text-xl font-bold mb-4">빠른 액션</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <Card 
                className="p-6 card-hover cursor-pointer"
                onClick={() => onNavigate('mentor-schedule')}
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold">일정 관리</h3>
                </div>
                <p className="text-sm text-gray-600">
                  멘토링 가능한 시간을 설정하세요
                </p>
              </Card>

              <Card 
                className="p-6 card-hover cursor-pointer"
                onClick={() => onNavigate('mentor-revenue')}
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold">수익 관리</h3>
                </div>
                <p className="text-sm text-gray-600">
                  수익 현황을 확인하고 출금하세요
                </p>
              </Card>

              <Card 
                className="p-6 card-hover cursor-pointer"
                onClick={() => onNavigate('mentor-ea-wizard')}
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Award className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold">EA 관리</h3>
                </div>
                <p className="text-sm text-gray-600">
                  합격 경험 자산을 수정하세요
                </p>
              </Card>
            </div>
          </motion.div>

          {/* Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-sky-600" />
                이번 달 성과
              </h2>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-sky-600 mb-1">12건</div>
                  <div className="text-sm text-gray-600">완료한 세션</div>
                </div>
                <div 
                  className="text-center cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => onNavigate('mentor-stats')}
                >
                  <div className="text-3xl font-bold text-green-600 mb-1">87%</div>
                  <div className="text-sm text-gray-600">멘티 합격률</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-1">2.5시간</div>
                  <div className="text-sm text-gray-600">평균 응답시간</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-600 mb-1">4.9</div>
                  <div className="text-sm text-gray-600">평균 평점</div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Relay Network Visualization */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Network className="w-7 h-7 text-indigo-600" />
                나의 릴레이 네트워크
              </h2>
            </div>
            <RelayChainVisualization 
              currentUserName="러너 #2847"
              onNodeClick={(node) => console.log('Node clicked:', node)}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}