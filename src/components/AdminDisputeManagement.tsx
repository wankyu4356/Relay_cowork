import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  ArrowLeft,
  AlertTriangle,
  Shield,
  MessageSquare,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  X,
  Search,
  Flag,
  User,
  FileText,
  Ban,
  RefreshCw,
  ChevronRight,
  AlertCircle,
  Send
} from 'lucide-react';
import { toast } from 'sonner';
import * as api from './api';

interface AdminDisputeManagementProps {
  onBack: () => void;
}

type DisputeStatus = 'pending' | 'investigating' | 'resolved' | 'dismissed';
type DisputeType = 'report' | 'refund' | 'behavior' | 'fraud';
type DisputePriority = 'high' | 'medium' | 'low';

interface Dispute {
  id: string;
  type: DisputeType;
  priority: DisputePriority;
  status: DisputeStatus;
  title: string;
  description: string;
  reporter: {
    name: string;
    role: '멘티' | '러너';
    avatar: string;
  };
  reported: {
    name: string;
    role: '멘티' | '러너';
    avatar: string;
  };
  sessionId?: string;
  sessionDate?: string;
  amount?: number;
  submittedAt: string;
  updatedAt: string;
  adminNotes?: string;
  evidence: string[];
  timeline: {
    date: string;
    action: string;
    by: string;
  }[];
}

const mockDisputes: Dispute[] = [
  {
    id: 'D-001',
    type: 'refund',
    priority: 'high',
    status: 'pending',
    title: '세션 노쇼에 대한 환불 요청',
    description: '예약된 세션 시간에 러너가 접속하지 않아 세션이 진행되지 못했습니다. 결제한 80,000원의 전액 환불을 요청합니다. 세션 시작 시간 전후 30분간 대기했으나 러너의 접속이 없었고, 사전 연락도 받지 못했습니다.',
    reporter: { name: '박지훈', role: '멘티', avatar: '👨‍🎓' },
    reported: { name: '김서연', role: '러너', avatar: '👩‍🎓' },
    sessionId: 'S-20250205-001',
    sessionDate: '2026.02.05 14:00',
    amount: 80000,
    submittedAt: '2026.02.05 15:23',
    updatedAt: '2026.02.05 15:23',
    evidence: ['세션 대기 화면 캡처', '예약 확인 메시지'],
    timeline: [
      { date: '2026.02.05 15:23', action: '분쟁 접수', by: '시스템' },
    ],
  },
  {
    id: 'D-002',
    type: 'behavior',
    priority: 'high',
    status: 'investigating',
    title: '부적절한 언행 신고',
    description: '세션 중 러너가 반복적으로 비하 발언을 하고, 학업계획서 피드백 대신 개인적인 질문만 계속했습니다. 전문적이지 않은 태도로 세션 시간의 대부분을 낭비했습니다.',
    reporter: { name: '이수민', role: '멘티', avatar: '👩‍💼' },
    reported: { name: '최동현', role: '러너', avatar: '👨‍💼' },
    sessionId: 'S-20250203-005',
    sessionDate: '2026.02.03 16:00',
    amount: 60000,
    submittedAt: '2026.02.03 17:45',
    updatedAt: '2026.02.06 09:30',
    adminNotes: '세션 로그 확인 중. 러너 측 소명서 요청 완료.',
    evidence: ['세션 녹화 파일', '채팅 기록 캡처 3장'],
    timeline: [
      { date: '2026.02.03 17:45', action: '분쟁 접수', by: '시스템' },
      { date: '2026.02.04 10:00', action: '담당자 배정', by: '관리자' },
      { date: '2026.02.05 14:00', action: '러너 소명서 요청', by: '관리자' },
      { date: '2026.02.06 09:30', action: '세션 로그 분석 중', by: '관리자' },
    ],
  },
  {
    id: 'D-003',
    type: 'fraud',
    priority: 'high',
    status: 'pending',
    title: '허위 프로필 의심 신고',
    description: '러너 프로필에 연세대 경영학과 편입 합격이라고 되어 있으나, 세션 중 대화 내용에서 해당 학교에 대한 기본적인 지식이 전혀 없는 것으로 확인되었습니다. 학과 커리큘럼이나 교수님 이름도 모르는 상태였습니다.',
    reporter: { name: '정하은', role: '멘티', avatar: '👩‍🎓' },
    reported: { name: '한민수', role: '러너', avatar: '👨‍🎓' },
    sessionId: 'S-20250206-003',
    sessionDate: '2026.02.06 11:00',
    amount: 70000,
    submittedAt: '2026.02.06 12:30',
    updatedAt: '2026.02.06 12:30',
    evidence: ['세션 대화 녹음', '프로필 캡처'],
    timeline: [
      { date: '2026.02.06 12:30', action: '분쟁 접수', by: '시스템' },
    ],
  },
  {
    id: 'D-004',
    type: 'report',
    priority: 'medium',
    status: 'pending',
    title: '세션 품질 불만 신고',
    description: '60분 세션을 예약했으나 러너가 30분만에 세션을 종료했습니다. 첨삭 피드백도 매우 피상적이었으며, 준비되지 않은 상태로 세션에 참여한 것으로 보입니다.',
    reporter: { name: '강유진', role: '멘티', avatar: '👩‍💼' },
    reported: { name: '윤태영', role: '러너', avatar: '👨‍💼' },
    sessionId: 'S-20250204-007',
    sessionDate: '2026.02.04 10:00',
    amount: 80000,
    submittedAt: '2026.02.04 11:15',
    updatedAt: '2026.02.04 11:15',
    evidence: ['세션 시간 로그'],
    timeline: [
      { date: '2026.02.04 11:15', action: '분쟁 접수', by: '시스템' },
    ],
  },
  {
    id: 'D-005',
    type: 'refund',
    priority: 'low',
    status: 'resolved',
    title: '일정 변경 불가에 따른 환불 요청',
    description: '개인 사정으로 세션 일정을 변경하고 싶었으나 24시간 이내 변경 불가 정책으로 인해 변경이 되지 않았습니다. 부분 환불이라도 요청드립니다.',
    reporter: { name: '송민재', role: '멘티', avatar: '👨‍🎓' },
    reported: { name: '이지은', role: '러너', avatar: '👩‍🎓' },
    sessionId: 'S-20250201-002',
    sessionDate: '2026.02.01 15:00',
    amount: 60000,
    submittedAt: '2026.02.01 09:00',
    updatedAt: '2026.02.03 16:00',
    adminNotes: '정책상 24시간 이내 취소 시 50% 환불 적용. 30,000원 환불 처리 완료.',
    evidence: [],
    timeline: [
      { date: '2026.02.01 09:00', action: '분쟁 접수', by: '시스템' },
      { date: '2026.02.01 14:00', action: '담당자 배정', by: '관리자' },
      { date: '2026.02.02 10:00', action: '환불 정책 안내', by: '관리자' },
      { date: '2026.02.03 16:00', action: '50% 부분 환불 처리 (30,000원)', by: '관리자' },
    ],
  },
  {
    id: 'D-006',
    type: 'behavior',
    priority: 'low',
    status: 'dismissed',
    title: '멘티의 반복적 지각',
    description: '동일 멘티가 3회 연속 세션에 15분 이상 지각하여 세션 운영에 차질이 발생합니다. 멘티에게 경고 조치를 요청합니다.',
    reporter: { name: '박소영', role: '러너', avatar: '👩‍🎓' },
    reported: { name: '김태현', role: '멘티', avatar: '👨‍🎓' },
    submittedAt: '2026.01.28 18:00',
    updatedAt: '2026.02.01 11:00',
    adminNotes: '멘티에게 경고 메시지 발송. 반복 시 이용 제한 안내. 분쟁 종결 처리.',
    evidence: ['세션 입장 시간 로그'],
    timeline: [
      { date: '2026.01.28 18:00', action: '분쟁 접수', by: '시스템' },
      { date: '2026.01.29 09:00', action: '담당자 배정', by: '관리자' },
      { date: '2026.01.30 10:00', action: '멘티 경고 메시지 발송', by: '관리자' },
      { date: '2026.02.01 11:00', action: '분쟁 종결 (경고 조치)', by: '관리자' },
    ],
  },
];

const getStatusConfig = (status: DisputeStatus) => {
  switch (status) {
    case 'pending':
      return { label: '접수됨', color: 'bg-orange-100 text-orange-700 border-orange-200', icon: Clock };
    case 'investigating':
      return { label: '조사 중', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Eye };
    case 'resolved':
      return { label: '해결됨', color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle2 };
    case 'dismissed':
      return { label: '기각됨', color: 'bg-gray-100 text-gray-700 border-gray-200', icon: XCircle };
  }
};

const getTypeConfig = (type: DisputeType) => {
  switch (type) {
    case 'report':
      return { label: '신고', color: 'bg-yellow-100 text-yellow-700', icon: Flag };
    case 'refund':
      return { label: '환불', color: 'bg-blue-100 text-blue-700', icon: RefreshCw };
    case 'behavior':
      return { label: '부적절 행위', color: 'bg-red-100 text-red-700', icon: AlertTriangle };
    case 'fraud':
      return { label: '사기 의심', color: 'bg-purple-100 text-purple-700', icon: Shield };
  }
};

const getPriorityConfig = (priority: DisputePriority) => {
  switch (priority) {
    case 'high':
      return { label: '긴급', color: 'bg-red-500 text-white' };
    case 'medium':
      return { label: '보통', color: 'bg-yellow-500 text-white' };
    case 'low':
      return { label: '낮음', color: 'bg-gray-400 text-white' };
  }
};

export function AdminDisputeManagement({ onBack }: AdminDisputeManagementProps) {
  const [disputes, setDisputes] = useState<Dispute[]>(mockDisputes);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [adminResponse, setAdminResponse] = useState('');
  const [loading, setLoading] = useState(true);

  // Load disputes from API on mount with fallback to mock data
  useEffect(() => {
    setLoading(true);
    api.getDisputes().then(res => {
      if (res.disputes?.length > 0) {
        const mapped: Dispute[] = res.disputes.map((d: any) => ({
          id: d.id,
          type: d.type || 'report',
          priority: d.priority || 'medium',
          status: d.status || 'pending',
          title: d.title || d.reason || '',
          description: d.description || '',
          reporter: d.reporter || { name: '신고자', role: '멘티' as const, avatar: '👤' },
          reported: d.reported || { name: '피신고자', role: '러너' as const, avatar: '👤' },
          sessionId: d.sessionId,
          sessionDate: d.sessionDate,
          amount: d.amount,
          submittedAt: d.submittedAt || d.createdAt || '',
          updatedAt: d.updatedAt || d.createdAt || '',
          adminNotes: d.adminNotes || d.resolution,
          evidence: d.evidence || [],
          timeline: d.timeline || [],
        }));
        setDisputes(mapped);
      }
    }).catch(() => {
      // keep mock data as fallback
    }).finally(() => setLoading(false));
  }, []);

  const filteredDisputes = disputes.filter(d => {
    const matchesSearch =
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.reporter.name.includes(searchQuery) ||
      d.reported.name.includes(searchQuery) ||
      d.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'pending' && d.status === 'pending') ||
      (activeTab === 'investigating' && d.status === 'investigating') ||
      (activeTab === 'resolved' && (d.status === 'resolved' || d.status === 'dismissed'));
    return matchesSearch && matchesTab;
  });

  const stats = {
    total: disputes.length,
    pending: disputes.filter(d => d.status === 'pending').length,
    investigating: disputes.filter(d => d.status === 'investigating').length,
    resolved: disputes.filter(d => d.status === 'resolved' || d.status === 'dismissed').length,
  };

  const handleStatusChange = async (disputeId: string, newStatus: DisputeStatus, note?: string) => {
    const now = new Date().toLocaleString('ko-KR');
    const actionMap: Record<DisputeStatus, string> = {
      pending: '접수 상태로 변경',
      investigating: '조사 시작',
      resolved: '분쟁 해결 처리',
      dismissed: '분쟁 기각 처리',
    };

    // Find old status for rollback
    const oldDispute = disputes.find(d => d.id === disputeId);

    // Optimistic UI update
    setDisputes(prev =>
      prev.map(d => {
        if (d.id === disputeId) {
          return {
            ...d,
            status: newStatus,
            updatedAt: now,
            adminNotes: note || d.adminNotes,
            timeline: [
              ...d.timeline,
              { date: now, action: actionMap[newStatus], by: '관리자' },
            ],
          };
        }
        return d;
      })
    );

    if (selectedDispute?.id === disputeId) {
      setSelectedDispute(prev => prev ? { ...prev, status: newStatus } : null);
    }

    const statusLabels: Record<DisputeStatus, string> = {
      pending: '접수 상태',
      investigating: '조사 중',
      resolved: '해결됨',
      dismissed: '기각됨',
    };

    try {
      await api.updateDispute(disputeId, {
        status: newStatus,
        resolution: note,
      });
      toast.success(`분쟁 ${disputeId}이(가) "${statusLabels[newStatus]}"(으)로 변경되었습니다`);
    } catch {
      // Revert on failure
      if (oldDispute) {
        setDisputes(prev =>
          prev.map(d => d.id === disputeId ? oldDispute : d)
        );
        if (selectedDispute?.id === disputeId) {
          setSelectedDispute(oldDispute);
        }
      }
      toast.error('상태 변경 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const handleAddNote = (disputeId: string) => {
    if (!adminResponse.trim()) return;

    setDisputes(prev =>
      prev.map(d => {
        if (d.id === disputeId) {
          const now = new Date().toLocaleString('ko-KR');
          return {
            ...d,
            adminNotes: adminResponse,
            updatedAt: now,
            timeline: [
              ...d.timeline,
              { date: now, action: `관리자 메모: ${adminResponse}`, by: '관리자' },
            ],
          };
        }
        return d;
      })
    );
    setAdminResponse('');
    toast.success('관리자 메모가 추가되었습니다');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-10 shadow-sm">
        <div className="container-web py-6">
          <div className="flex items-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="ghost" size="icon" onClick={onBack}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </motion.div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                분쟁 처리 센터
              </h1>
              <p className="text-gray-600 mt-1">신고 및 분쟁 사항을 관리합니다</p>
            </div>
            {stats.pending > 0 && (
              <Badge className="bg-red-500 text-white border-0 px-3 py-1">
                {stats.pending}건 대기 중
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="container-web py-8">
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">전체</div>
                    <div className="text-xl font-bold">{stats.total}건</div>
                  </div>
                </div>
              </Card>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">대기 중</div>
                    <div className="text-xl font-bold text-orange-600">{stats.pending}건</div>
                  </div>
                </div>
              </Card>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Eye className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">조사 중</div>
                    <div className="text-xl font-bold text-blue-600">{stats.investigating}건</div>
                  </div>
                </div>
              </Card>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">처리 완료</div>
                    <div className="text-xl font-bold text-green-600">{stats.resolved}건</div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Search & Tabs */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="분쟁 ID, 제목, 신고자/피신고자 이름으로 검색..."
                className="pl-9"
              />
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">전체 ({stats.total})</TabsTrigger>
              <TabsTrigger value="pending">대기 중 ({stats.pending})</TabsTrigger>
              <TabsTrigger value="investigating">조사 중 ({stats.investigating})</TabsTrigger>
              <TabsTrigger value="resolved">처리 완료 ({stats.resolved})</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-4">
              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {filteredDisputes.length === 0 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <Card className="p-12 text-center">
                        <Shield className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-500 mb-1">해당하는 분쟁이 없습니다</h3>
                        <p className="text-sm text-gray-400">검색 조건을 변경해보세요</p>
                      </Card>
                    </motion.div>
                  ) : (
                    filteredDisputes.map((dispute, idx) => {
                      const statusCfg = getStatusConfig(dispute.status);
                      const typeCfg = getTypeConfig(dispute.type);
                      const priorityCfg = getPriorityConfig(dispute.priority);
                      const StatusIcon = statusCfg.icon;

                      return (
                        <motion.div
                          key={dispute.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ delay: idx * 0.03 }}
                        >
                          <Card
                            className={`p-5 cursor-pointer transition-all hover:shadow-md ${
                              dispute.priority === 'high' && dispute.status === 'pending'
                                ? 'border-red-200 bg-red-50/30'
                                : ''
                            }`}
                            onClick={() => setSelectedDispute(dispute)}
                          >
                            <div className="flex items-start gap-4">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap mb-2">
                                  <span className="text-sm text-gray-400 font-mono">{dispute.id}</span>
                                  <Badge className={`${priorityCfg.color} border-0 text-xs`}>
                                    {priorityCfg.label}
                                  </Badge>
                                  <Badge variant="outline" className={`${typeCfg.color} border-0 text-xs`}>
                                    {typeCfg.label}
                                  </Badge>
                                  <Badge variant="outline" className={`${statusCfg.color} text-xs`}>
                                    <StatusIcon className="w-3 h-3 mr-1" />
                                    {statusCfg.label}
                                  </Badge>
                                </div>

                                <h3 className="font-semibold text-gray-900 mb-2 truncate">{dispute.title}</h3>

                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                  <div className="flex items-center gap-1.5">
                                    <span>{dispute.reporter.avatar}</span>
                                    <span>{dispute.reporter.name}</span>
                                    <span className="text-gray-300">→</span>
                                    <span>{dispute.reported.avatar}</span>
                                    <span>{dispute.reported.name}</span>
                                  </div>
                                  <span className="text-gray-300">|</span>
                                  <span>{dispute.submittedAt}</span>
                                  {dispute.amount && (
                                    <>
                                      <span className="text-gray-300">|</span>
                                      <span className="font-medium text-gray-700">
                                        {dispute.amount.toLocaleString()}원
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                              <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                            </div>
                          </Card>
                        </motion.div>
                      );
                    })
                  )}
                </AnimatePresence>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedDispute && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center overflow-y-auto p-4 pt-8"
            onClick={() => setSelectedDispute(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl my-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-2xl z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      selectedDispute.priority === 'high' ? 'bg-red-100' : 'bg-orange-100'
                    }`}>
                      <AlertTriangle className={`w-5 h-5 ${
                        selectedDispute.priority === 'high' ? 'text-red-600' : 'text-orange-600'
                      }`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400 font-mono">{selectedDispute.id}</span>
                        <Badge className={`${getPriorityConfig(selectedDispute.priority).color} border-0 text-xs`}>
                          {getPriorityConfig(selectedDispute.priority).label}
                        </Badge>
                        <Badge variant="outline" className={`${getStatusConfig(selectedDispute.status).color} text-xs`}>
                          {getStatusConfig(selectedDispute.status).label}
                        </Badge>
                      </div>
                      <h2 className="font-semibold text-lg mt-1">{selectedDispute.title}</h2>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setSelectedDispute(null)}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                {/* Parties */}
                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="p-4 border-blue-200 bg-blue-50/50">
                    <div className="text-xs text-blue-600 font-medium mb-2 flex items-center gap-1">
                      <Flag className="w-3 h-3" /> 신고자
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center text-lg">
                        {selectedDispute.reporter.avatar}
                      </div>
                      <div>
                        <div className="font-semibold">{selectedDispute.reporter.name}</div>
                        <Badge variant="outline" className="text-xs">{selectedDispute.reporter.role}</Badge>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4 border-red-200 bg-red-50/50">
                    <div className="text-xs text-red-600 font-medium mb-2 flex items-center gap-1">
                      <User className="w-3 h-3" /> 피신고자
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-lg">
                        {selectedDispute.reported.avatar}
                      </div>
                      <div>
                        <div className="font-semibold">{selectedDispute.reported.name}</div>
                        <Badge variant="outline" className="text-xs">{selectedDispute.reported.role}</Badge>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Details */}
                <Card className="p-4">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-gray-600" />
                    상세 내용
                  </h4>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedDispute.description}</p>

                  {(selectedDispute.sessionId || selectedDispute.amount) && (
                    <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 md:grid-cols-3 gap-3">
                      {selectedDispute.sessionId && (
                        <div>
                          <div className="text-xs text-gray-500">세션 ID</div>
                          <div className="text-sm font-mono font-medium">{selectedDispute.sessionId}</div>
                        </div>
                      )}
                      {selectedDispute.sessionDate && (
                        <div>
                          <div className="text-xs text-gray-500">세션 일시</div>
                          <div className="text-sm font-medium">{selectedDispute.sessionDate}</div>
                        </div>
                      )}
                      {selectedDispute.amount && (
                        <div>
                          <div className="text-xs text-gray-500">관련 금액</div>
                          <div className="text-sm font-medium text-slate-600">
                            {selectedDispute.amount.toLocaleString()}원
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </Card>

                {/* Evidence */}
                {selectedDispute.evidence.length > 0 && (
                  <Card className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-600" />
                      증거 자료 ({selectedDispute.evidence.length}건)
                    </h4>
                    <div className="space-y-2">
                      {selectedDispute.evidence.map((ev, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <span className="text-sm flex-1">{ev}</span>
                          <Button variant="ghost" size="sm" className="text-slate-600">
                            <Eye className="w-4 h-4 mr-1" /> 확인
                          </Button>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Timeline */}
                <Card className="p-4">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-600" />
                    처리 타임라인
                  </h4>
                  <div className="space-y-0">
                    {selectedDispute.timeline.map((item, idx) => (
                      <div key={idx} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className={`w-3 h-3 rounded-full border-2 ${
                            idx === selectedDispute.timeline.length - 1
                              ? 'bg-slate-500 border-slate-500'
                              : 'bg-white border-gray-300'
                          }`} />
                          {idx < selectedDispute.timeline.length - 1 && (
                            <div className="w-0.5 h-full bg-gray-200 min-h-[32px]" />
                          )}
                        </div>
                        <div className="pb-4">
                          <div className="text-sm font-medium text-gray-900">{item.action}</div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {item.date} · {item.by}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Admin Notes */}
                {selectedDispute.adminNotes && (
                  <Card className="p-4 bg-amber-50/50 border-amber-200">
                    <h4 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      관리자 메모
                    </h4>
                    <p className="text-sm text-amber-900">{selectedDispute.adminNotes}</p>
                  </Card>
                )}

                {/* Admin Actions */}
                {(selectedDispute.status === 'pending' || selectedDispute.status === 'investigating') && (
                  <Card className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-gray-600" />
                      관리자 조치
                    </h4>

                    {/* Quick note */}
                    <div className="flex items-end gap-2 mb-4">
                      <div className="flex-1">
                        <label className="text-sm text-gray-600 mb-1 block">메모 추가</label>
                        <Input
                          value={adminResponse}
                          onChange={(e) => setAdminResponse(e.target.value)}
                          placeholder="조치 사항이나 메모를 입력하세요..."
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleAddNote(selectedDispute.id);
                          }}
                        />
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => handleAddNote(selectedDispute.id)}
                        disabled={!adminResponse.trim()}
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {selectedDispute.status === 'pending' && (
                        <Button
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={() => handleStatusChange(selectedDispute.id, 'investigating')}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          조사 시작
                        </Button>
                      )}
                      <Button
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => handleStatusChange(selectedDispute.id, 'resolved')}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        해결 처리
                      </Button>
                      <Button
                        variant="outline"
                        className="border-gray-300"
                        onClick={() => handleStatusChange(selectedDispute.id, 'dismissed')}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        기각
                      </Button>
                      {selectedDispute.type === 'fraud' && (
                        <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
                          <Ban className="w-4 h-4 mr-1" />
                          계정 정지
                        </Button>
                      )}
                      {selectedDispute.amount && (
                        <Button variant="outline" className="border-slate-300 text-slate-600 hover:bg-slate-50">
                          <RefreshCw className="w-4 h-4 mr-1" />
                          환불 처리
                        </Button>
                      )}
                    </div>
                  </Card>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
