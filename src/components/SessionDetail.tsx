import { useState } from 'react';
import { FadeIn, Stagger, Press } from './ui/motion';
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
        return <Badge className="bg-emerald-600 text-white">확정됨</Badge>;
      case 'completed':
        return <Badge className="bg-iris-600 text-white">완료됨</Badge>;
      case 'cancelled':
        return <Badge className="bg-zinc-900 text-white">취소됨</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 pb-20">
      <div className="container-web py-8">
        {/* Header */}
        <FadeIn className="flex items-center gap-4 mb-8">
          <Press lift={false}>
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="hover:bg-zinc-100 rounded-xl"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Press>
          <div className="flex-1">
            <h1 className="text-4xl text-zinc-900 font-semibold tracking-tight mb-2">릴레이 세션 상세</h1>
            <p className="text-zinc-600">세션 정보를 확인하고 관리하세요</p>
          </div>
          {getStatusBadge()}
        </FadeIn>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Session Info */}
          <FadeIn className="lg:col-span-2 space-y-6" delay={0.05}>
            {/* Mentee Card */}
            <Card className="p-6 rounded-2xl border-zinc-200/80 shadow-sm">
              <div className="flex items-start gap-4 mb-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-zinc-900 to-iris-800 rounded-2xl flex items-center justify-center text-4xl shadow-md">
                    {session.menteeAvatar}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-2 border-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl text-zinc-900 font-semibold tracking-tight">{session.mentee}</h3>
                    <Badge className="bg-iris-50 text-iris-700 border-iris-200 tnum">
                      {session.previousSessions}회 세션
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-600 mb-3">
                    <Target className="w-4 h-4 text-iris-600" />
                    <span className="font-semibold">{session.university} {session.major}</span>
                  </div>
                  <div className="flex gap-2">
                    <Press lift={false}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl"
                        onClick={() => onNavigate('chat')}
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        채팅하기
                      </Button>
                    </Press>
                  </div>
                </div>
              </div>

              {/* Session Purpose */}
              <div className="p-4 bg-iris-50 rounded-xl mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-iris-600" />
                  <span className="font-semibold text-zinc-900">세션 목적</span>
                </div>
                <p className="text-zinc-600">{session.purpose}</p>
              </div>

              {/* Request Message */}
              <div className="p-4 bg-white border border-zinc-200/80 rounded-xl">
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare className="w-4 h-4 text-iris-600" />
                  <span className="font-semibold text-zinc-900">요청 메시지</span>
                </div>
                <p className="text-zinc-600 leading-relaxed">{session.requestMessage}</p>
              </div>
            </Card>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={(v: string) => setActiveTab(v as any)}>
              <TabsList className="grid grid-cols-3 h-12 bg-zinc-100 p-1 rounded-xl">
                <TabsTrigger value="details" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  세션 정보
                </TabsTrigger>
                <TabsTrigger value="materials" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <FileText className="w-4 h-4 mr-2" />
                  자료 ({session.materials.length})
                </TabsTrigger>
                <TabsTrigger value="notes" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <Edit3 className="w-4 h-4 mr-2" />
                  노트
                </TabsTrigger>
              </TabsList>

              {/* Details Tab */}
              <TabsContent value="details" className="mt-6">
                <Card className="p-6 rounded-2xl border-zinc-200/80 shadow-sm">
                  <Stagger className="grid md:grid-cols-2 gap-6" stagger={0.08}>
                    <Stagger.Item className="p-4 bg-zinc-50 border border-zinc-200/80 rounded-xl">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-iris-50 rounded-xl flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-iris-600" />
                        </div>
                        <div>
                          <div className="text-sm text-zinc-600">날짜</div>
                          <div className="text-lg font-semibold tracking-tight text-zinc-900 tnum">{session.date}</div>
                        </div>
                      </div>
                    </Stagger.Item>

                    <Stagger.Item className="p-4 bg-zinc-50 border border-zinc-200/80 rounded-xl">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-iris-50 rounded-xl flex items-center justify-center">
                          <Clock className="w-6 h-6 text-iris-600" />
                        </div>
                        <div>
                          <div className="text-sm text-zinc-600">시간</div>
                          <div className="text-lg font-semibold tracking-tight text-zinc-900 tnum">{session.time} ({session.duration}분)</div>
                        </div>
                      </div>
                    </Stagger.Item>

                    <Stagger.Item className="p-4 bg-zinc-50 border border-zinc-200/80 rounded-xl">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-iris-50 rounded-xl flex items-center justify-center">
                          <Video className="w-6 h-6 text-iris-600" />
                        </div>
                        <div>
                          <div className="text-sm text-zinc-600">방식</div>
                          <div className="text-lg font-semibold tracking-tight text-zinc-900">화상 회의</div>
                        </div>
                      </div>
                    </Stagger.Item>

                    <Stagger.Item className="p-4 bg-zinc-50 border border-zinc-200/80 rounded-xl">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-iris-50 rounded-xl flex items-center justify-center">
                          <Zap className="w-6 h-6 text-iris-600" />
                        </div>
                        <div>
                          <div className="text-sm text-zinc-600">진행 횟수</div>
                          <div className="text-lg font-semibold tracking-tight text-zinc-900 tnum">{session.previousSessions + 1}회차</div>
                        </div>
                      </div>
                    </Stagger.Item>
                  </Stagger>

                  {/* Meeting Link */}
                  {sessionStatus === 'confirmed' && (
                    <div className="mt-6 p-4 bg-gradient-to-r from-zinc-900 to-iris-800 rounded-xl text-white">
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
                          className="bg-white text-iris-700 hover:bg-zinc-100"
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
                <Card className="p-6 rounded-2xl border-zinc-200/80 shadow-sm">
                  <Stagger className="space-y-3" stagger={0.08}>
                    {session.materials.map((material, index) => (
                      <Stagger.Item key={index}>
                        <Press scale={0.99}>
                          <div className="flex items-center gap-4 p-4 bg-zinc-50 border border-zinc-200/80 rounded-xl hover:shadow-md transition-shadow cursor-pointer">
                            <div className="w-12 h-12 bg-iris-50 rounded-xl flex items-center justify-center">
                              <FileText className="w-6 h-6 text-iris-600" />
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-zinc-900">{material.name}</div>
                              <div className="text-sm text-zinc-600">업로드: {material.uploadedAt}</div>
                            </div>
                            <Button size="sm" variant="outline" className="rounded-xl" onClick={() => {
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
                        </Press>
                      </Stagger.Item>
                    ))}

                    {session.materials.length === 0 && (
                      <div className="text-center py-12 text-zinc-400">
                        <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>업로드된 자료가 없습니다</p>
                      </div>
                    )}
                  </Stagger>
                </Card>
              </TabsContent>

              {/* Notes Tab */}
              <TabsContent value="notes" className="mt-6">
                <Card className="p-6 rounded-2xl border-zinc-200/80 shadow-sm">
                  <textarea
                    placeholder="세션 노트를 작성하세요..."
                    value={sessionNotes}
                    onChange={(e) => setSessionNotes(e.target.value)}
                    className="w-full min-h-[300px] p-4 border border-zinc-200/80 rounded-xl focus:outline-none focus:border-iris-400 focus:ring-2 focus:ring-iris-400/20 resize-none"
                  />
                  <div className="mt-4 flex justify-end">
                    <Press lift={false}>
                      <Button className="bg-zinc-900 text-white hover:bg-zinc-800 rounded-xl" onClick={() => {
                        if (!sessionNotes.trim()) {
                          toast.error('노트 내용을 입력해주세요');
                          return;
                        }
                        toast.success('세션 노트가 저장되었습니다');
                      }}>
                        <Send className="w-4 h-4 mr-2" />
                        노트 저장
                      </Button>
                    </Press>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </FadeIn>

          {/* Right: Actions */}
          <FadeIn className="space-y-6" delay={0.1}>
            {/* Status Card */}
            <Card className="p-6 rounded-2xl border-zinc-200/80 shadow-sm">
              <h3 className="text-zinc-900 font-semibold tracking-tight mb-4">세션 관리</h3>

              {sessionStatus === 'pending' && (
                <div className="space-y-3">
                  <Press lift={false}>
                    <Button
                      className="w-full bg-zinc-900 text-white hover:bg-zinc-800 rounded-xl h-12"
                      onClick={handleConfirmSession}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      세션 확정하기
                    </Button>
                  </Press>
                  <Press lift={false}>
                    <Button
                      variant="outline"
                      className="w-full rounded-xl h-12"
                      onClick={handleCancelSession}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      세션 취소하기
                    </Button>
                  </Press>
                </div>
              )}

              {sessionStatus === 'confirmed' && (
                <div className="space-y-3">
                  <Press lift={false}>
                    <Button
                      className="w-full bg-zinc-900 text-white hover:bg-zinc-800 rounded-xl h-12 font-semibold"
                      onClick={handleStartSession}
                    >
                      <Video className="w-4 h-4 mr-2" />
                      세션 시작하기
                    </Button>
                  </Press>
                  <Press lift={false}>
                    <Button
                      className="w-full bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl h-12"
                      onClick={handleCompleteSession}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      세션 완료하기
                    </Button>
                  </Press>
                  <Press lift={false}>
                    <Button
                      variant="outline"
                      className="w-full text-red-600 hover:bg-red-50 border-red-200 rounded-xl h-12"
                      onClick={handleCancelSession}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      세션 취소
                    </Button>
                  </Press>
                </div>
              )}

              {sessionStatus === 'completed' && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-zinc-900 font-semibold tracking-tight mb-2">세션 완료!</h4>
                  <p className="text-sm text-zinc-600 mb-4">경험 전달이 완료되었습니다</p>
                  <Press lift={false}>
                    <Button
                      className="bg-zinc-900 text-white hover:bg-zinc-800 rounded-xl"
                      onClick={() => onNavigate('review-write')}
                    >
                      후기 작성하기
                    </Button>
                  </Press>
                </div>
              )}

              {sessionStatus === 'cancelled' && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <XCircle className="w-8 h-8 text-zinc-400" />
                  </div>
                  <h4 className="text-zinc-900 font-semibold tracking-tight mb-2">세션 취소됨</h4>
                  <p className="text-sm text-zinc-600">이 세션은 취소되었습니다</p>
                </div>
              )}
            </Card>

            {/* Tips Card */}
            <Card className="p-6 rounded-2xl border-zinc-200/80 shadow-sm bg-iris-50">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-iris-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-zinc-900 mb-2">릴레이 세션 팁</h4>
                  <ul className="space-y-2 text-sm text-zinc-600">
                    <li className="flex items-start gap-2">
                      <span className="text-iris-600">•</span>
                      <span>세션 시작 10분 전 접속을 권장합니다</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-iris-600">•</span>
                      <span>사전에 자료를 검토해주세요</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-iris-600">•</span>
                      <span>구체적인 피드백이 도움됩니다</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}