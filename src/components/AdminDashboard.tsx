import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Users, DollarSign, Calendar, TrendingUp, Sparkles, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { Screen } from '../App';
import * as api from './api';

interface AdminDashboardProps {
  onNavigate: (screen: Screen) => void;
}

const chartData = [
  { date: '2/1', mentees: 120, mentors: 45, sessions: 78, aiUsage: 145 },
  { date: '2/5', mentees: 145, mentors: 52, sessions: 92, aiUsage: 167 },
  { date: '2/10', mentees: 178, mentors: 58, sessions: 115, aiUsage: 203 },
  { date: '2/15', mentees: 210, mentors: 64, sessions: 142, aiUsage: 245 },
];

// Fallback mock stats used when the API is unavailable
const mockStats = {
  totalUsers: 2150,
  totalMentors: 142,
  activeMentors: 142,
  totalSessions: 312,
  totalReviews: 0,
  pendingDisputes: 3,
};

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const [stats, setStats] = useState(mockStats);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getAdminStats()
      .then(res => setStats({
        totalUsers: res.totalUsers ?? mockStats.totalUsers,
        totalMentors: res.totalMentors ?? mockStats.totalMentors,
        activeMentors: res.activeMentors ?? mockStats.activeMentors,
        totalSessions: res.totalSessions ?? mockStats.totalSessions,
        totalReviews: res.totalReviews ?? mockStats.totalReviews,
        pendingDisputes: res.pendingDisputes ?? mockStats.pendingDisputes,
      }))
      .catch(() => {
        // Keep mock data as fallback
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="container-web py-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-600 to-slate-800 bg-clip-text text-transparent">
              릴레이 관리 센터
            </h1>
            <p className="text-gray-600 mt-2">릴레이 플랫폼 운영 현황을 모니터링하세요</p>
          </div>
        </div>
      </div>

      <div className="container-web py-8">
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600" />
            <span className="ml-3 text-gray-500">통계를 불러오는 중...</span>
          </div>
        )}
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="p-6 card-hover">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-slate-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">총 가입자</div>
                    <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-green-600 font-medium">+12%</span>
                  <span className="text-gray-500">지난 주 대비</span>
                </div>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="p-6 card-hover">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">활성 러너</div>
                    <div className="text-2xl font-bold">{stats.activeMentors.toLocaleString()}</div>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => onNavigate('admin-mentor-approval')}>
                  러너 승인 관리
                </Button>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="p-6 card-hover">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">총 세션</div>
                    <div className="text-2xl font-bold">{stats.totalSessions.toLocaleString()}건</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-green-600 font-medium">+18%</span>
                  <span className="text-gray-500">지난 달 대비</span>
                </div>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card className="p-6 card-hover">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">월 매출</div>
                    <div className="text-2xl font-bold">₩24.9M</div>
                  </div>
                </div>
                <div className="text-sm text-gray-600">수수료: ₩5.2M</div>
              </Card>
            </motion.div>
          </div>

          {/* AI Stats */}
          <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">✨ AI 초안 서비스</h3>
                  <p className="text-sm text-gray-600">러너 전환 퍼널 성과</p>
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">AI 이용</div>
                <div className="text-2xl font-bold text-purple-600">847건</div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">러너 프로필 클릭</div>
                <div className="text-2xl font-bold">312건</div>
                <div className="text-xs text-gray-500">전환율 36.8%</div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">세션 예약</div>
                <div className="text-2xl font-bold">195건</div>
                <div className="text-xs text-gray-500">전환율 62.5%</div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">결제 완료</div>
                <div className="text-2xl font-bold text-slate-600">158건</div>
                <div className="text-xs text-green-600 font-medium">전체 전환율 18.7%</div>
              </div>
            </div>
          </Card>

          {/* Growth Chart */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">성장 지표</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                <Line type="monotone" dataKey="mentees" stroke="#0EA5E9" strokeWidth={2} name="멘티" />
                <Line type="monotone" dataKey="mentors" stroke="#38BDF8" strokeWidth={2} name="러너" />
                <Line type="monotone" dataKey="sessions" stroke="#10B981" strokeWidth={2} name="세션" />
                <Line type="monotone" dataKey="aiUsage" stroke="#8B5CF6" strokeWidth={2} name="AI 이용" />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 card-hover cursor-pointer" onClick={() => onNavigate('admin-mentor-approval')}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                </div>
                <Badge className="bg-orange-500 text-white">승인 대기</Badge>
              </div>
              <h4 className="font-semibold mb-1">러너 승인 관리</h4>
              <p className="text-sm text-gray-600">신규 러너 신청 검토 및 승인</p>
            </Card>

            <Card className="p-6 card-hover cursor-pointer" onClick={() => onNavigate('admin-dispute-management')}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <Badge className="bg-red-500 text-white">{stats.pendingDisputes}건</Badge>
              </div>
              <h4 className="font-semibold mb-1">분쟁 처리</h4>
              <p className="text-sm text-gray-600">신고 및 분쟁 사항 관리</p>
            </Card>

            <Card className="p-6 card-hover cursor-pointer" onClick={() => onNavigate('admin-ai-service-management')}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-slate-600" />
                </div>
              </div>
              <h4 className="font-semibold mb-1">AI 서비스 관리</h4>
              <p className="text-sm text-gray-600">크레딧 가격 및 설정 관리</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}