import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowLeft, DollarSign, TrendingUp, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';

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
  { id: '1', date: '2025.02.15', mentee: '박지원', amount: 80000, status: 'completed' },
  { id: '2', date: '2025.02.12', mentee: '김민준', amount: 50000, status: 'completed' },
  { id: '3', date: '2025.02.10', mentee: '이서연', amount: 80000, status: 'pending' },
  { id: '4', date: '2025.02.08', mentee: '최준호', amount: 80000, status: 'completed' },
];

export function MentorRevenue({ onBack }: MentorRevenueProps) {
  const [availableBalance] = useState(640000);

  const handleWithdraw = () => {
    if (availableBalance < 10000) {
      toast.error('출금 가능 금액은 최소 ₩10,000 이상이어야 합니다');
      return;
    }
    if (confirm(`₩${availableBalance.toLocaleString()}을 출금 신청하시겠습니까?`)) {
      toast.success('출금 신청이 완료되었습니다! 영업일 기준 3~5일 내 입금됩니다.');
    }
  };

  const handleDownload = () => {
    toast.success('거래 내역 다운로드가 시작됩니다');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50">
      <div className="bg-white border-b border-gray-200">
        <div className="container-web py-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">수익 & 정산</h1>
              <p className="text-gray-600 mt-1">멘토링 수익을 확인하고 출금하세요</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-web py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Summary Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="p-6 bg-gradient-to-br from-sky-500 to-blue-600 text-white">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm opacity-90">총 수익</div>
                    <div className="text-3xl font-bold">₩3.67M</div>
                  </div>
                </div>
                <div className="text-sm opacity-75">전체 누적 수익</div>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="p-6 border-2 border-sky-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">출금 가능</div>
                    <div className="text-3xl font-bold text-sky-600">₩640k</div>
                  </div>
                </div>
                <Button className="w-full bg-sky-500 hover:bg-sky-600 text-white" onClick={handleWithdraw}>출금 신청</Button>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">정산 대기</div>
                    <div className="text-3xl font-bold">₩210k</div>
                  </div>
                </div>
                <div className="text-sm text-gray-500">세션 완료 후 정산</div>
              </Card>
            </motion.div>
          </div>

          {/* Chart */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">월별 수익 추이</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => `₩${value.toLocaleString()}`}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                />
                <Bar dataKey="revenue" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0EA5E9" />
                    <stop offset="100%" stopColor="#38BDF8" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Transactions */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">최근 거래 내역</h3>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                내역 다운로드
              </Button>
            </div>
            <div className="space-y-3">
              {recentTransactions.map((tx, index) => (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-sky-50 transition-colors">
                    <div className="flex-1">
                      <div className="font-semibold">{tx.mentee}</div>
                      <div className="text-sm text-gray-600">{tx.date}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-lg">₩{tx.amount.toLocaleString()}</div>
                      <Badge className={tx.status === 'completed' ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'}>
                        {tx.status === 'completed' ? '정산완료' : '대기중'}
                      </Badge>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>

          {/* Fee Info */}
          <Card className="p-6 bg-sky-50 border-sky-200">
            <h3 className="font-semibold mb-3">💰 수수료 안내</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>🥉 Bronze (0-10건)</span>
                <span className="font-semibold">25%</span>
              </div>
              <div className="flex justify-between">
                <span>🥈 Silver (11-30건)</span>
                <span className="font-semibold">22%</span>
              </div>
              <div className="flex justify-between text-sky-600">
                <span>🥇 Gold (31건+) - 현재 등급</span>
                <span className="font-semibold">18%</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}