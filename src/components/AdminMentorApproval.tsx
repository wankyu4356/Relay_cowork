import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Eye,
  FileText,
  GraduationCap,
  Award,
  X,
  Download,
  AlertCircle,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';
import * as api from './api';

interface AdminMentorApprovalProps {
  onBack: () => void;
}

interface MentorApplication {
  id: string;
  name: string;
  email: string;
  university: string;
  major: string;
  studentId: string;
  admissionYear: string;
  previousUniversity: string;
  studentIdFile: {
    name: string;
    url: string;
  };
  admissionFile: {
    name: string;
    url: string;
  };
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
}

const mockApplications: MentorApplication[] = [
  {
    id: '1',
    name: '김서연',
    email: 'seoyeon.kim@example.com',
    university: '연세대학교',
    major: '경영학과',
    studentId: '2022123456',
    admissionYear: '2022',
    previousUniversity: '서울대학교',
    studentIdFile: {
      name: '학생증_김서연.jpg',
      url: '#',
    },
    admissionFile: {
      name: '합격증_연세대_김서연.pdf',
      url: '#',
    },
    submittedAt: '2025.02.10 14:30',
    status: 'pending',
  },
  {
    id: '2',
    name: '이준호',
    email: 'junho.lee@example.com',
    university: '고려대학교',
    major: '경제학과',
    studentId: '2023789012',
    admissionYear: '2023',
    previousUniversity: '성균관대학교',
    studentIdFile: {
      name: '재학증명서_이준호.pdf',
      url: '#',
    },
    admissionFile: {
      name: '입학허가서_고려대_이준호.jpg',
      url: '#',
    },
    submittedAt: '2025.02.09 10:15',
    status: 'pending',
  },
  {
    id: '3',
    name: '박지민',
    email: 'jimin.park@example.com',
    university: '서강대학교',
    major: '컴퓨터공학과',
    studentId: '2021345678',
    admissionYear: '2021',
    previousUniversity: '한양대학교',
    studentIdFile: {
      name: '학생증_박지민.jpg',
      url: '#',
    },
    admissionFile: {
      name: '합격증_서강대_박지민.jpg',
      url: '#',
    },
    submittedAt: '2025.02.08 16:45',
    status: 'pending',
  },
];

export function AdminMentorApproval({ onBack }: AdminMentorApprovalProps) {
  const [tab, setTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [applications, setApplications] = useState<MentorApplication[]>(mockApplications);
  const [selectedApp, setSelectedApp] = useState<MentorApplication | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load pending mentors from API on mount with fallback to mock data
  useEffect(() => {
    setLoading(true);
    api.getPendingMentors().then(res => {
      if (res.mentors?.length > 0) {
        const mapped: MentorApplication[] = res.mentors.map((m: any) => ({
          id: m.id,
          name: m.name || '이름 없음',
          email: m.email || '',
          university: m.university || '',
          major: m.major || '',
          studentId: m.studentId || '',
          admissionYear: m.admissionYear || m.year || '',
          previousUniversity: m.previousUniversity || '',
          studentIdFile: m.studentIdFile || { name: '파일 없음', url: '#' },
          admissionFile: m.admissionFile || { name: '파일 없음', url: '#' },
          submittedAt: m.submittedAt || m.createdAt || '',
          status: m.status || 'pending',
        }));
        setApplications(mapped);
      }
    }).catch(() => {
      // keep mock data as fallback
    }).finally(() => setLoading(false));
  }, []);

  const handleDownload = (fileName: string) => {
    toast.success(`'${fileName}' 다운로드를 시작합니다`);
    // Simulate file download by creating a blob
    const blob = new Blob([`[Simulated file content for: ${fileName}]`], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const pendingApps = applications.filter(a => a.status === 'pending');
  const approvedApps = applications.filter(a => a.status === 'approved');
  const rejectedApps = applications.filter(a => a.status === 'rejected');

  const handleApprove = async (app: MentorApplication) => {
    // Optimistic UI update
    setApplications(prev => prev.map(a =>
      a.id === app.id ? { ...a, status: 'approved' as const } : a
    ));
    setSelectedApp(null);

    try {
      await api.verifyMentor(app.id, true);
      toast.success(`${app.name} 러너를 승인했습니다`);
    } catch {
      // Revert on failure
      setApplications(prev => prev.map(a =>
        a.id === app.id ? { ...a, status: 'pending' as const } : a
      ));
      toast.error('승인 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const handleReject = async (app: MentorApplication, reason: string) => {
    // Optimistic UI update
    setApplications(prev => prev.map(a =>
      a.id === app.id ? { ...a, status: 'rejected' as const, rejectionReason: reason } : a
    ));
    setSelectedApp(null);
    setShowRejectModal(false);
    setRejectionReason('');

    try {
      await api.verifyMentor(app.id, false);
      toast.error(`${app.name} 러너를 반려했습니다`);
    } catch {
      // Revert on failure
      setApplications(prev => prev.map(a =>
        a.id === app.id ? { ...a, status: 'pending' as const, rejectionReason: undefined } : a
      ));
      toast.error('반려 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const ApplicationCard = ({ app, index }: { app: MentorApplication; index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="p-6 card-hover cursor-pointer" onClick={() => setSelectedApp(app)}>
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center text-3xl flex-shrink-0 shadow-lg">
            👤
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-bold mb-1">{app.name}</h3>
                <p className="text-gray-600 text-sm">{app.email}</p>
              </div>
              <Badge variant="outline" className="text-orange-600 border-orange-300 bg-orange-50">
                <Clock className="w-3 h-3 mr-1" />
                대기중
              </Badge>
            </div>

            <div className="grid md:grid-cols-2 gap-3 mb-4">
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="text-xs text-gray-600 mb-1">현재</div>
                <div className="font-semibold">{app.university} {app.major}</div>
                <div className="text-sm text-gray-600">{app.studentId}</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="text-xs text-gray-600 mb-1">편입</div>
                <div className="font-semibold">{app.admissionYear}년 입학</div>
                <div className="text-sm text-gray-600">{app.previousUniversity}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <Badge className="bg-green-500 text-white border-0">
                <FileText className="w-3 h-3 mr-1" />
                학생증
              </Badge>
              <Badge className="bg-purple-500 text-white border-0">
                <Award className="w-3 h-3 mr-1" />
                합격증
              </Badge>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <span className="text-sm text-gray-600">제출일: {app.submittedAt}</span>
              <Button 
                size="sm"
                variant="outline"
                className="text-slate-600 hover:bg-slate-50"
              >
                <Eye className="w-4 h-4 mr-1" />
                검토하기
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );

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
              <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-600 to-slate-800 bg-clip-text text-transparent">
                러너 승인 관리
              </h1>
              <p className="text-gray-600 mt-1">신규 러너 신청을 검토하고 승인하세요</p>
            </div>
            {pendingApps.length > 0 && (
              <Badge className="bg-orange-500 text-white border-0 px-4 py-2">
                {pendingApps.length}건 대기중
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="container-web py-8 pb-24">
        <div className="max-w-5xl mx-auto">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600" />
              <span className="ml-3 text-gray-500">러너 신청 목록을 불러오는 중...</span>
            </div>
          )}
          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Card className="p-4 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-1">{pendingApps.length}</div>
              <div className="text-sm text-gray-600">승인 대기</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">{approvedApps.length}</div>
              <div className="text-sm text-gray-600">승인 완료</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-3xl font-bold text-red-600 mb-1">{rejectedApps.length}</div>
              <div className="text-sm text-gray-600">반려</div>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs value={tab} onValueChange={(v: string) => setTab(v as any)} className="w-full">
            <TabsList className="w-full grid grid-cols-3 h-12 bg-gray-100/80 backdrop-blur-sm p-1 mb-6">
              <TabsTrigger value="pending" className="data-[state=active]:bg-white data-[state=active]:shadow-md">
                대기 ({pendingApps.length})
              </TabsTrigger>
              <TabsTrigger value="approved" className="data-[state=active]:bg-white data-[state=active]:shadow-md">
                승인 ({approvedApps.length})
              </TabsTrigger>
              <TabsTrigger value="rejected" className="data-[state=active]:bg-white data-[state=active]:shadow-md">
                반려 ({rejectedApps.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="mt-0">
              <div className="space-y-4">
                {pendingApps.length === 0 ? (
                  <Card className="p-12 text-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">승인 대기중인 신청이 없습니다</h3>
                    <p className="text-gray-600">새로운 러너 신청이 들어오면 여기에 표시됩니다</p>
                  </Card>
                ) : (
                  pendingApps.map((app, index) => <ApplicationCard key={app.id} app={app} index={index} />)
                )}
              </div>
            </TabsContent>

            <TabsContent value="approved" className="mt-0">
              <div className="space-y-4">
                {approvedApps.length === 0 ? (
                  <Card className="p-12 text-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">승인된 러너가 없습니다</h3>
                  </Card>
                ) : (
                  approvedApps.map((app, index) => (
                    <Card key={app.id} className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-bold text-lg mb-1">{app.name}</h3>
                          <p className="text-gray-600">{app.university} {app.major}</p>
                        </div>
                        <Badge className="bg-green-500 text-white border-0">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          승인완료
                        </Badge>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="rejected" className="mt-0">
              <div className="space-y-4">
                {rejectedApps.length === 0 ? (
                  <Card className="p-12 text-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <XCircle className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">반려된 신청이 없습니다</h3>
                  </Card>
                ) : (
                  rejectedApps.map((app, index) => (
                    <Card key={app.id} className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-lg mb-1">{app.name}</h3>
                          <p className="text-gray-600">{app.university} {app.major}</p>
                        </div>
                        <Badge className="bg-red-500 text-white border-0">
                          <XCircle className="w-3 h-3 mr-1" />
                          반려
                        </Badge>
                      </div>
                      {app.rejectionReason && (
                        <div className="bg-red-50 rounded-xl p-3">
                          <div className="text-sm font-semibold text-red-900 mb-1">반려 사유</div>
                          <div className="text-sm text-red-700">{app.rejectionReason}</div>
                        </div>
                      )}
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedApp && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setSelectedApp(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-3xl bg-white rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-slate-50 to-gray-50">
                <div>
                  <h2 className="text-2xl font-bold mb-1">{selectedApp.name}</h2>
                  <p className="text-gray-600">{selectedApp.email}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSelectedApp(null)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Student Info */}
                <div>
                  <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-slate-600" />
                    학생 정보
                  </h3>
                  <Card className="p-4 bg-gray-50">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-600 mb-1">대학교</div>
                        <div className="font-semibold">{selectedApp.university}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">학과</div>
                        <div className="font-semibold">{selectedApp.major}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">학번</div>
                        <div className="font-semibold">{selectedApp.studentId}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">제출일</div>
                        <div className="font-semibold">{selectedApp.submittedAt}</div>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Admission Info */}
                <div>
                  <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <Award className="w-5 h-5 text-purple-600" />
                    편입 정보
                  </h3>
                  <Card className="p-4 bg-gray-50">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-600 mb-1">편입 연도</div>
                        <div className="font-semibold">{selectedApp.admissionYear}년</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">전적대학교</div>
                        <div className="font-semibold">{selectedApp.previousUniversity}</div>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Files */}
                <div>
                  <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-green-600" />
                    제출 서류
                  </h3>
                  <div className="space-y-3">
                    <Card className="p-4 bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                            <GraduationCap className="w-6 h-6 text-slate-600" />
                          </div>
                          <div>
                            <div className="font-semibold">학생증/재학증명서</div>
                            <div className="text-sm text-gray-600">{selectedApp.studentIdFile.name}</div>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => handleDownload(selectedApp.studentIdFile.name)}>
                          <Download className="w-4 h-4 mr-1" />
                          다운로드
                        </Button>
                      </div>
                    </Card>

                    <Card className="p-4 bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                            <Award className="w-6 h-6 text-purple-600" />
                          </div>
                          <div>
                            <div className="font-semibold">합격증/입학허가서</div>
                            <div className="text-sm text-gray-600">{selectedApp.admissionFile.name}</div>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => handleDownload(selectedApp.admissionFile.name)}>
                          <Download className="w-4 h-4 mr-1" />
                          다운로드
                        </Button>
                      </div>
                    </Card>
                  </div>
                </div>

                <Card className="p-4 bg-yellow-50/50 border-yellow-200">
                  <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-yellow-700">
                      <div className="font-semibold mb-1">검토 시 확인사항</div>
                      <div>• 학생증/재학증명서가 유효한지 확인</div>
                      <div>• 합격증/입학허가서가 진본인지 확인</div>
                      <div>• 제출한 정보와 서류가 일치하는지 확인</div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Modal Actions */}
              <div className="p-6 border-t border-gray-200 bg-gray-50 flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 text-red-600 hover:bg-red-50"
                  onClick={() => {
                    setShowRejectModal(true);
                  }}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  반려하기
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                  onClick={() => handleApprove(selectedApp)}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  승인하기
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Reject Modal */}
      <AnimatePresence>
        {showRejectModal && selectedApp && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setShowRejectModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl z-50 p-6"
            >
              <h2 className="text-xl font-bold mb-4">반려 사유 입력</h2>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="반려 사유를 입력해주세요..."
                className="w-full h-32 p-3 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-slate-500"
              />
              <div className="flex gap-3 mt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectionReason('');
                  }}
                >
                  취소
                </Button>
                <Button
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => handleReject(selectedApp, rejectionReason)}
                  disabled={!rejectionReason.trim()}
                >
                  반려하기
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
