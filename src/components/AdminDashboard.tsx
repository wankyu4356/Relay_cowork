import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { FadeIn, Stagger, Press, CountUp, TextReveal, ScrollReveal, ScrollStagger } from './ui/motion';
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
    <div className="min-h-screen bg-zinc-50">
      <div className="bg-white border-b border-zinc-200/80">
        <div className="container-web py-6">
          <FadeIn>
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
              <TextReveal text="릴레이 관리 센터" delay={0.05} />
            </h1>
            <p className="text-zinc-600 mt-2">릴레이 플랫폼 운영 현황을 모니터링하세요</p>
          </FadeIn>
        </div>
      </div>

      <div className="container-web py-8">
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-700" />
            <span className="ml-3 text-zinc-400">통계를 불러오는 중...</span>
          </div>
        )}
        <div className="space-y-6">
          {/* KPI Cards */}
          <Stagger className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Stagger.Item>
              <Press lift>
                <Card className="p-6 rounded-2xl shadow-sm h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-zinc-700" />
                    </div>
                    <div>
                      <div className="text-sm text-zinc-600">총 가입자</div>
                      <div className="text-2xl font-semibold tracking-tight text-zinc-900 tnum"><CountUp value={stats.totalUsers} /></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700 font-medium tnum">+12%</span>
                    <span className="text-zinc-400">지난 주 대비</span>
                  </div>
                </Card>
              </Press>
            </Stagger.Item>

            <Stagger.Item>
              <Press lift>
                <Card className="p-6 rounded-2xl shadow-sm h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-iris-50 rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-iris-600" />
                    </div>
                    <div>
                      <div className="text-sm text-zinc-600">활성 러너</div>
                      <div className="text-2xl font-semibold tracking-tight text-zinc-900 tnum"><CountUp value={stats.activeMentors} /></div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => onNavigate('admin-mentor-approval')}>
                    러너 승인 관리
                  </Button>
                </Card>
              </Press>
            </Stagger.Item>

            <Stagger.Item>
              <Press lift>
                <Card className="p-6 rounded-2xl shadow-sm h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <div className="text-sm text-zinc-600">총 세션</div>
                      <div className="text-2xl font-semibold tracking-tight text-zinc-900 tnum"><CountUp value={stats.totalSessions} suffix="건" /></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700 font-medium tnum">+18%</span>
                    <span className="text-zinc-400">지난 달 대비</span>
                  </div>
                </Card>
              </Press>
            </Stagger.Item>

            <Stagger.Item>
              <Press lift>
                <Card className="p-6 rounded-2xl shadow-sm h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-zinc-700" />
                    </div>
                    <div>
                      <div className="text-sm text-zinc-600">월 매출</div>
                      <div className="text-2xl font-semibold tracking-tight text-zinc-900 tnum">24,900,000원</div>
                    </div>
                  </div>
                  <div className="text-sm text-zinc-600 tnum">수수료: 5,200,000원</div>
                </Card>
              </Press>
            </Stagger.Item>
          </Stagger>

          {/* AI Stats */}
          <ScrollReveal>
            <Card className="p-6 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-iris-600 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold tracking-tight text-zinc-900 text-lg">AI 초안 서비스</h3>
                    <p className="text-sm text-zinc-600">러너 전환 퍼널 성과</p>
                  </div>
                </div>
              </div>
              <ScrollStagger className="grid md:grid-cols-4 gap-4">
                <ScrollStagger.Item className="bg-zinc-50 rounded-xl p-4">
                  <div className="text-sm text-zinc-600 mb-1">AI 이용</div>
                  <div className="text-2xl font-semibold tracking-tight text-iris-600 tnum">847건</div>
                </ScrollStagger.Item>
                <ScrollStagger.Item className="bg-zinc-50 rounded-xl p-4">
                  <div className="text-sm text-zinc-600 mb-1">러너 프로필 클릭</div>
                  <div className="text-2xl font-semibold tracking-tight text-zinc-900 tnum">312건</div>
                  <div className="text-xs text-zinc-400 tnum">전환율 36.8%</div>
                </ScrollStagger.Item>
                <ScrollStagger.Item className="bg-zinc-50 rounded-xl p-4">
                  <div className="text-sm text-zinc-600 mb-1">세션 예약</div>
                  <div className="text-2xl font-semibold tracking-tight text-zinc-900 tnum">195건</div>
                  <div className="text-xs text-zinc-400 tnum">전환율 62.5%</div>
                </ScrollStagger.Item>
                <ScrollStagger.Item className="bg-zinc-50 rounded-xl p-4">
                  <div className="text-sm text-zinc-600 mb-1">결제 완료</div>
                  <div className="text-2xl font-semibold tracking-tight text-zinc-900 tnum">158건</div>
                  <div className="text-xs text-emerald-700 font-medium tnum">전체 전환율 18.7%</div>
                </ScrollStagger.Item>
              </ScrollStagger>
            </Card>
          </ScrollReveal>

          {/* Growth Chart */}
          <ScrollReveal>
            <Card className="p-6 rounded-2xl shadow-sm">
              <h3 className="font-semibold tracking-tight text-zinc-900 text-lg mb-4">성장 지표</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e4e4e7' }} />
                  <Line type="monotone" dataKey="mentees" stroke="#6366f1" strokeWidth={2} name="멘티" />
                  <Line type="monotone" dataKey="mentors" stroke="#818cf8" strokeWidth={2} name="러너" />
                  <Line type="monotone" dataKey="sessions" stroke="#10B981" strokeWidth={2} name="세션" />
                  <Line type="monotone" dataKey="aiUsage" stroke="#a78bfa" strokeWidth={2} name="AI 이용" />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </ScrollReveal>

          {/* Quick Actions */}
          <ScrollStagger className="grid md:grid-cols-3 gap-6">
            <ScrollStagger.Item>
              <Press lift>
                <Card className="p-6 rounded-2xl shadow-sm cursor-pointer h-full" onClick={() => onNavigate('admin-mentor-approval')}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                      <AlertCircle className="w-5 h-5 text-amber-600" />
                    </div>
                    <Badge className="bg-amber-50 text-amber-700 border-0">승인 대기</Badge>
                  </div>
                  <h4 className="font-semibold tracking-tight text-zinc-900 mb-1">러너 승인 관리</h4>
                  <p className="text-sm text-zinc-600">신규 러너 신청 검토 및 승인</p>
                </Card>
              </Press>
            </ScrollStagger.Item>

            <ScrollStagger.Item>
              <Press lift>
                <Card className="p-6 rounded-2xl shadow-sm cursor-pointer h-full" onClick={() => onNavigate('admin-dispute-management')}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    </div>
                    <Badge className="bg-red-50 text-red-700 border-0 tnum">{stats.pendingDisputes}건</Badge>
                  </div>
                  <h4 className="font-semibold tracking-tight text-zinc-900 mb-1">분쟁 처리</h4>
                  <p className="text-sm text-zinc-600">신고 및 분쟁 사항 관리</p>
                </Card>
              </Press>
            </ScrollStagger.Item>

            <ScrollStagger.Item>
              <Press lift>
                <Card className="p-6 rounded-2xl shadow-sm cursor-pointer h-full" onClick={() => onNavigate('admin-ai-service-management')}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-zinc-100 rounded-lg flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-zinc-700" />
                    </div>
                  </div>
                  <h4 className="font-semibold tracking-tight text-zinc-900 mb-1">AI 서비스 관리</h4>
                  <p className="text-sm text-zinc-600">크레딧 가격 및 설정 관리</p>
                </Card>
              </Press>
            </ScrollStagger.Item>
          </ScrollStagger>
        </div>
      </div>
    </div>
  );
}