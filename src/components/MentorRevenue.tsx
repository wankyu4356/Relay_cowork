import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Stagger, Press, CountUp, TextReveal, ScrollReveal } from './ui/motion';
import { ArrowLeft, DollarSign, TrendingUp, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';
import * as api from './api';

interface MentorRevenueProps {
  onBack: () => void;
}

const monthlyData = [
  { month: '9월', revenue: 320000 },
  { month: '10월', revenue: 450000 },
  { month: '11월', revenue: 580000 },
  { month: '12월', revenue: 720000 },
  { month: '1월', revenue: 880000 },
  { month: '2월', revenue: 640000 },
];

const recentTransactions = [
  { id: '1', date: '2025.02.15', mentee: '박지원', amount: 65000, status: 'completed' },
  { id: '2', date: '2025.02.12', mentee: '김민준', amount: 45000, status: 'completed' },
  { id: '3', date: '2025.02.10', mentee: '이서연', amount: 65000, status: 'pending' },
  { id: '4', date: '2025.02.08', mentee: '최준호', amount: 65000, status: 'completed' },
];

export function MentorRevenue({ onBack }: MentorRevenueProps) {
  const [revenueData, setRevenueData] = useState(monthlyData);
  const [transactions, setTransactions] = useState(recentTransactions);
  const [availableBalance, setAvailableBalance] = useState(640000);

  useEffect(() => {
    // Revenue API not yet available - ready for integration
    api.getProfile().then((res: { profile?: { revenue?: { available?: number } } }) => {
      if (res.profile?.revenue) {
        setAvailableBalance(res.profile.revenue.available || 640000);
      }
    }).catch(() => {}); // keep mock data on failure
  }, []);

  const handleWithdraw = () => {
    if (availableBalance < 10000) {
      toast.error('출금 가능 금액은 최소 10,000원 이상이어야 합니다');
      return;
    }
    if (confirm(`${availableBalance.toLocaleString()}원을 출금 신청하시겠습니까?`)) {
      toast.success('출금 신청이 완료되었습니다! 영업일 기준 3~5일 내 입금됩니다.');
    }
  };

  const handleDownload = () => {
    toast.success('거래 내역 다운로드가 시작됩니다');
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="bg-white border-b border-zinc-200/80">
        <div className="container-web py-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-semibold tracking-tight text-zinc-900"><TextReveal text="수익 & 정산" delay={0.05} /></h1>
              <p className="text-zinc-600 mt-1">릴레이 수익을 확인하고 출금하세요</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-web py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Summary Cards */}
          <Stagger className="grid md:grid-cols-3 gap-6">
            <Stagger.Item>
              <Card className="p-6 bg-gradient-to-br from-zinc-900 to-iris-800 text-white">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm opacity-90">총 수익</div>
                    <div className="text-3xl font-semibold tracking-tight"><CountUp value={3670000} />원</div>
                  </div>
                </div>
                <div className="text-sm opacity-75">전체 누적 수익</div>
              </Card>
            </Stagger.Item>

            <Stagger.Item>
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-iris-50 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-iris-600" />
                  </div>
                  <div>
                    <div className="text-sm text-zinc-600">출금 가능</div>
                    <div className="text-3xl font-semibold tracking-tight text-iris-600"><CountUp value={640000} />원</div>
                  </div>
                </div>
                <Button className="w-full shine" onClick={handleWithdraw}>출금 신청</Button>
              </Card>
            </Stagger.Item>

            <Stagger.Item>
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-zinc-600" />
                  </div>
                  <div>
                    <div className="text-sm text-zinc-600">정산 대기</div>
                    <div className="text-3xl font-semibold tracking-tight text-zinc-900"><CountUp value={210000} />원</div>
                  </div>
                </div>
                <div className="text-sm text-zinc-400">세션 완료 후 정산</div>
              </Card>
            </Stagger.Item>
          </Stagger>

          {/* Chart */}
          <ScrollReveal>
          <Card className="p-6">
            <h3 className="font-semibold text-lg text-zinc-900 mb-4">월별 수익 추이</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => `${value.toLocaleString()}원`}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e4e4e7' }}
                />
                <Bar dataKey="revenue" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4f46e5" />
                    <stop offset="100%" stopColor="#818cf8" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </Card>
          </ScrollReveal>

          {/* Transactions */}
          <ScrollReveal>
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg text-zinc-900">최근 거래 내역</h3>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                내역 다운로드
              </Button>
            </div>
            <Stagger className="space-y-3">
              {transactions.map((tx) => (
                <Stagger.Item key={tx.id}>
                  <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-lg hover:bg-iris-50 transition-colors">
                    <div className="flex-1">
                      <div className="font-semibold text-zinc-900">{tx.mentee}</div>
                      <div className="text-sm text-zinc-600 tnum">{tx.date}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-lg text-zinc-900 tnum">{tx.amount.toLocaleString()}원</div>
                      <Badge className={tx.status === 'completed' ? 'bg-iris-600 text-white' : 'bg-zinc-400 text-white'}>
                        {tx.status === 'completed' ? '정산완료' : '대기중'}
                      </Badge>
                    </div>
                  </div>
                </Stagger.Item>
              ))}
            </Stagger>
          </Card>
          </ScrollReveal>

          {/* Dynamic Pricing Tier Info */}
          <ScrollReveal>
          <Card className="p-6 bg-iris-50 border-iris-100">
            <h3 className="font-semibold text-zinc-900 mb-4">다이나믹 프라이싱 등급</h3>
            <p className="text-sm text-zinc-600 mb-4">실적이 쌓일수록 더 높은 가격을 설정할 수 있습니다</p>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center p-2 rounded-lg">
                <div>
                  <span>브론즈 (0-10건)</span>
                  <div className="text-xs text-zinc-400 tnum">15,000~30,000원</div>
                </div>
                <span className="font-semibold tnum">수수료 25%</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg">
                <div>
                  <span>실버 (11-30건)</span>
                  <div className="text-xs text-zinc-400 tnum">30,000~50,000원</div>
                </div>
                <span className="font-semibold tnum">수수료 22%</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-white border border-iris-200">
                <div>
                  <span className="text-iris-700 font-semibold">골드 (31-60건) - 현재 등급</span>
                  <div className="text-xs text-iris-600 tnum">50,000~80,000원</div>
                </div>
                <span className="font-semibold text-iris-700 tnum">수수료 18%</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg">
                <div>
                  <span>플래티넘 (61건+)</span>
                  <div className="text-xs text-zinc-400 tnum">80,000~120,000원</div>
                </div>
                <span className="font-semibold tnum">수수료 15%</span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-white rounded-lg border border-iris-100">
              <div className="text-sm font-semibold text-zinc-700 mb-2">다음 등급까지</div>
              <div className="flex items-center gap-2 mb-1">
                <div className="flex-1 bg-zinc-200 rounded-full h-2">
                  <motion.div className="bg-iris-600 h-2 rounded-full" initial={{ width: 0 }} animate={{ width: '70%' }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}></motion.div>
                </div>
                <span className="text-xs text-zinc-600 whitespace-nowrap">플래티넘</span>
              </div>
              <div className="text-xs text-zinc-400">세션 19건 더 / 리뷰 8건 더 필요</div>
            </div>
          </Card>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}