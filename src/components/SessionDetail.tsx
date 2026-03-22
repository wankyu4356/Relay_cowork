import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Video,
  MessageSquare,
  FileText,
  CheckCircle2,
  XCircle,
  Users,
  Target,
  Zap,
  AlertCircle,
  Edit3,
  Send
} from 'lucide-react';
import type { Screen } from '../App';
import { toast } from 'sonner';

interface SessionDetailProps {
  onBack: () => void;
  onNavigate: (screen: Screen) => void;
}

export function SessionDetail({ onBack, onNavigate }: SessionDetailProps) {
  const [sessionStatus, setSessionStatus] = useState<'pending' | 'confirmed' | 'completed' | 'cancelled'>('confirmed');
  const [activeTab, setActiveTab] = useState<'details' | 'materials' | 'notes'>('details');
  const [sessionNotes, setSessionNotes] = useState('');

  // Mock session data
  const session = {
    id: '1',
    mentee: '러너 B',
    menteeAvatar: '👨‍🎓',
    date: '2025.02.20',
    time: '14:00',
    duration: 60,
    purpose: '연세대 경영학과 편입 학계서 첨삭',
    university: '연세대',
    major: '경영학과',
    materials: [
      { name: '학업계획서_초안.pdf', uploadedAt: '2025.02.18' },
      { name: '자기소개서_v2.docx', uploadedAt: '2025.02.19' },
    ],
    previousSessions: 7,
    requestMessage: '안녕하세요! 연세대 경영학과 편입을 준비중입니다. 학업계획서 초안을 작성했는데, 구조와 내용 면에서 피드백이 필요합니다. 특히 저의 경험을 어떻게 스토리텔링할지 고민이에요. 도움 부탁드립니다!',
  };

  const handleStartSession = () => {
    toast.success('릴레이 세션을 시작합니다!');
    onNavigate('session-workspace');
  };

  const handleCancelSession = () => {
    setSessionStatus('cancelled');
    toast.error('릴레이 세션이 취소되었습니다');
  };

  const handleConfirmSession = () => {
    setSessionStatus('confirmed');
    toast.success('릴레이 세션이 확정되었습니다!');
  };

  const handleCompleteSession = () => {
    setSessionStatus('completed');
    toast.success('릴레이 세션이 완료되었습니다!');
    setTimeout(() => {
      onNavigate('review-write');
    }, 1000);
  };

  const getStatusBadge = () => {
    switch (sessionStatus) {
      case 'pending':
        return <Badge className="bg-amber-500 text-white">대기중</Badge>;
      case 'confirmed':
        return <Badge className="bg-green-500 text-white">확정됨</Badge>;
      case 'completed':
        return <Badge className="bg-blue-500 text-white">완료됨</Badge>;
      case 'cancelled':
        return <Badge className="bg-gray-500 text-white">취소됨</Badge>;
    }
  };

  return (
    <div className="min-h-screen gradient-mesh pb-20">
      <div className="container-web py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onBack}
            className="hover:bg-white/50 rounded-xl"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-4xl font-bold gradient-text mb-2">릴레이 세션 상세</h1>
            <p className="text-gray-600">세션 정보를 확인하고 관리하세요</p>
          </div>
          {getStatusBadge()}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Session Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Mentee Card */}
            <Card className="p-6 card-modern">
              <div className="flex items-start gap-4 mb-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-4xl shadow-xl">
                    {session.menteeAvatar}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-bold text-gray-900">{session.mentee}</h3>
                    <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200">
                      {session.previousSessions}회 세션
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 mb-3">
                    <Target className="w-4 h-4 text-indigo-500" />
                    <span className="font-semibold">{session.university} {session.major}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="btn-secondary rounded-xl"
                      onClick={() => onNavigate('chat')}
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      채팅하기
                    </Button>
                  </div>
                </div>
              </div>

              {/* Session Purpose */}
              <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-indigo-600" />
                  <span className="font-semibold text-gray-900">세션 목적</span>
                </div>
                <p className="text-gray-700">{session.purpose}</p>
              </div>

              {/* Request Message */}
              <div className="p-4 bg-white border border-gray-200 rounded-xl">
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare className="w-4 h-4 text-purple-600" />
                  <span className="font-semibold text-gray-900">요청 메시지</span>
                </div>
                <p className="text-gray-700 leading-relaxed">{session.requestMessage}</p>
              </div>
            </Card>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={(v: string) => setActiveTab(v as any)}>
              <TabsList className="grid grid-cols-3 h-12 bg-white/50 backdrop-blur-sm">
                <TabsTrigger value="details" className="data-[state=active]:bg-white">
                  <Calendar className="w-4 h-4 mr-2" />
                  세션 정보
                </TabsTrigger>
                <TabsTrigger value="materials" className="data-[state=active]:bg-white">
                  <FileText className="w-4 h-4 mr-2" />
                  자료 ({session.materials.length})
                </TabsTrigger>
                <TabsTrigger value="notes" className="data-[state=active]:bg-white">
                  <Edit3 className="w-4 h-4 mr-2" />
                  노트
                </TabsTrigger>
              </TabsList>

              {/* Details Tab */}
              <TabsContent value="details" className="mt-6">
                <Card className="p-6 card-modern">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">날짜</div>
                          <div className="text-lg font-bold text-gray-900">{session.date}</div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                          <Clock className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">시간</div>
                          <div className="text-lg font-bold text-gray-900">{session.time} ({session.duration}분)</div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                          <Video className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">방식</div>
                          <div className="text-lg font-bold text-gray-900">화상 회의</div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center">
                          <Zap className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">진행 횟수</div>
                          <div className="text-lg font-bold text-gray-900">{session.previousSessions + 1}회차</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Meeting Link */}
                  {sessionStatus === 'confirmed' && (
                    <div className="mt-6 p-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-white">
                      <div className="flex items-center gap-3 mb-3">
                        <Video className="w-5 h-5" />
                        <span className="font-semibold">화상 회의 링크</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <code className="flex-1 bg-white/20 px-4 py-2 rounded-lg text-sm">
                          https://meet.relay.com/session-{session.id}
                        </code>
                        <Button
                          size="sm"
                          className="bg-white text-indigo-600 hover:bg-indigo-50"
                          onClick={() => {
                            navigator.clipboard.writeText(`https://meet.relay.com/session-${session.id}`);
                            toast.success('링크가 복사되었습니다!');
                          }}
                        >
                          복사
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              </TabsContent>

              {/* Materials Tab */}
              <TabsContent value="materials" className="mt-6">
                <Card className="p-6 card-modern">
                  <div className="space-y-3">
                    {session.materials.map((material, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl hover:shadow-md transition-shadow cursor-pointer">
                          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                            <FileText className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900">{material.name}</div>
                            <div className="text-sm text-gray-600">업로드: {material.uploadedAt}</div>
                          </div>
                          <Button size="sm" className="btn-secondary rounded-xl" onClick={() => {
                            const blob = new Blob([''], { type: 'application/octet-stream' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = material.name;
                            a.click();
                            URL.revokeObjectURL(url);
                            toast.success(`${material.name} 다운로드를 시작합니다`);
                          }}>
                            다운로드
                          </Button>
                        </div>
                      </motion.div>
                    ))}

                    {session.materials.length === 0 && (
                      <div className="text-center py-12 text-gray-500">
                        <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>업로드된 자료가 없습니다</p>
                      </div>
                    )}
                  </div>
                </Card>
              </TabsContent>

              {/* Notes Tab */}
              <TabsContent value="notes" className="mt-6">
                <Card className="p-6 card-modern">
                  <textarea
                    placeholder="세션 노트를 작성하세요..."
                    value={sessionNotes}
                    onChange={(e) => setSessionNotes(e.target.value)}
                    className="w-full min-h-[300px] p-4 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 resize-none"
                  />
                  <div className="mt-4 flex justify-end">
                    <Button className="btn-primary rounded-xl" onClick={() => {
                      if (!sessionNotes.trim()) {
                        toast.error('노트 내용을 입력해주세요');
                        return;
                      }
                      toast.success('세션 노트가 저장되었습니다');
                    }}>
                      <Send className="w-4 h-4 mr-2" />
                      노트 저장
                    </Button>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right: Actions */}
          <div className="space-y-6">
            {/* Status Card */}
            <Card className="p-6 card-modern">
              <h3 className="font-bold text-gray-900 mb-4">세션 관리</h3>

              {sessionStatus === 'pending' && (
                <div className="space-y-3">
                  <Button
                    className="w-full btn-primary rounded-xl h-12"
                    onClick={handleConfirmSession}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    세션 확정하기
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full btn-secondary rounded-xl h-12"
                    onClick={handleCancelSession}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    세션 취소하기
                  </Button>
                </div>
              )}

              {sessionStatus === 'confirmed' && (
                <div className="space-y-3">
                  <Button
                    className="w-full btn-primary rounded-xl h-12 font-semibold"
                    onClick={handleStartSession}
                  >
                    <Video className="w-4 h-4 mr-2" />
                    세션 시작하기
                  </Button>
                  <Button
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 rounded-xl h-12"
                    onClick={handleCompleteSession}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    세션 완료하기
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full text-red-600 hover:bg-red-50 border-red-200 rounded-xl h-12"
                    onClick={handleCancelSession}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    세션 취소
                  </Button>
                </div>
              )}

              {sessionStatus === 'completed' && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">세션 완료!</h4>
                  <p className="text-sm text-gray-600 mb-4">경험 전달이 완료되었습니다</p>
                  <Button
                    className="btn-primary rounded-xl"
                    onClick={() => onNavigate('review-write')}
                  >
                    후기 작성하기
                  </Button>
                </div>
              )}

              {sessionStatus === 'cancelled' && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <XCircle className="w-8 h-8 text-gray-500" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">세션 취소됨</h4>
                  <p className="text-sm text-gray-600">이 세션은 취소되었습니다</p>
                </div>
              )}
            </Card>

            {/* Tips Card */}
            <Card className="p-6 card-modern bg-gradient-to-br from-indigo-50 to-purple-50">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-indigo-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">릴레이 세션 팁</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600">•</span>
                      <span>세션 시작 10분 전 접속을 권장합니다</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600">•</span>
                      <span>사전에 자료를 검토해주세요</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600">•</span>
                      <span>구체적인 피드백이 도움됩니다</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}