import { useState } from 'react';
import { motion } from 'motion/react';
import { FadeIn, Stagger, Press, CountUp } from './ui/motion';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  ArrowLeft,
  Clock,
  Calendar,
  Video,
  Star,
  MessageSquare,
  FileText,
  MoreVertical,
  X,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import type { Session } from '../App';
import { useSessions } from '../hooks/useSessions';

interface SessionListProps {
  onBack: () => void;
  onSessionSelect: (session: Session) => void;
  onReviewWrite: (session: Session) => void;
  onNavigate?: (screen: string) => void;
}

export function SessionList({ onBack, onSessionSelect, onReviewWrite, onNavigate }: SessionListProps) {
  const { sessions, loading: sessionsLoading, cancelSession } = useSessions();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedSession, setSelectedSession] = useState<string | null>(null);

  const upcomingSessions = sessions.filter(s => s.status === 'upcoming');
  const completedSessions = sessions.filter(s => s.status === 'completed');

  const handleCancelSession = async (sessionId: string) => {
    if (confirm('세션을 취소하시겠습니까? 취소 수수료가 발생할 수 있습니다.')) {
      try {
        await cancelSession(sessionId);
        toast.success('세션이 취소되었습니다');
      } catch {
        toast.error('세션 취소에 실패했습니다. 다시 시도해주세요.');
      } finally {
        setSelectedSession(null);
      }
    }
  };

  const handleReschedule = (sessionId: string) => {
    toast.success('일정 변경 페이지로 이동합니다');
    setSelectedSession(null);
  };

  const handleSendMessage = (session: Session) => {
    if (onNavigate) {
      onNavigate('message-center');
    } else {
      toast.success(`${session.mentorName}에게 메시지를 보냅니다`);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <Badge className="bg-iris-600 text-white border-0">📅 예정</Badge>;
      case 'ongoing':
        return <Badge className="bg-emerald-600 text-white border-0">🔴 진행중</Badge>;
      case 'completed':
        return <Badge className="bg-zinc-900 text-white border-0">✓ 완료</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500 text-white border-0">✕ 취소</Badge>;
      default:
        return null;
    }
  };

  const getDaysUntil = (dateStr: string) => {
    const sessionDate = new Date(dateStr.replace(/\./g, '-'));
    const today = new Date();
    const diffTime = sessionDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return '오늘';
    if (diffDays === 1) return '내일';
    if (diffDays < 0) return `${Math.abs(diffDays)}일 전`;
    return `${diffDays}일 후`;
  };

  const SessionCard = ({ session, index }: { session: Session; index: number }) => (
    <Stagger.Item>
      <Press lift={false} scale={0.99}>
        <Card className="p-6 relative rounded-2xl border-zinc-200/80 shadow-sm hover:shadow-md transition-shadow">
        {/* Menu Button */}
        {session.status === 'upcoming' && (
          <button
            className="absolute top-4 right-4 w-8 h-8 rounded-lg hover:bg-zinc-100 flex items-center justify-center transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedSession(selectedSession === session.id ? null : session.id);
            }}
          >
            <MoreVertical className="w-4 h-4 text-zinc-400" />
          </button>
        )}

        {/* Dropdown Menu */}
        {selectedSession === session.id && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-14 right-4 bg-white rounded-xl shadow-lg border border-zinc-200/80 py-2 z-10 min-w-[160px]"
          >
            <button
              onClick={() => handleReschedule(session.id)}
              className="w-full px-4 py-2 text-left hover:bg-zinc-50 flex items-center gap-2 text-sm text-zinc-600"
            >
              <Calendar className="w-4 h-4" />
              일정 변경
            </button>
            <button
              onClick={() => handleSendMessage(session)}
              className="w-full px-4 py-2 text-left hover:bg-zinc-50 flex items-center gap-2 text-sm text-zinc-600"
            >
              <MessageSquare className="w-4 h-4" />
              메시지 보내기
            </button>
            <div className="border-t border-zinc-100 my-1"></div>
            <button
              onClick={() => handleCancelSession(session.id)}
              className="w-full px-4 py-2 text-left hover:bg-red-50 flex items-center gap-2 text-sm text-red-600"
            >
              <X className="w-4 h-4" />
              세션 취소
            </button>
          </motion.div>
        )}

        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-zinc-900 to-iris-800 flex items-center justify-center text-3xl flex-shrink-0 shadow-md">
            {session.mentorAvatar}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg text-zinc-900 font-semibold tracking-tight mb-1">{session.mentorName}</h3>
                <div className="flex items-center gap-2 text-sm text-zinc-600 flex-wrap">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span className="tnum">{session.date}</span>
                  </div>
                  <span className="text-zinc-400">•</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span className="tnum">{session.time}</span>
                  </div>
                  <span className="text-zinc-400">•</span>
                  <span className="tnum">{session.duration}분</span>
                </div>
              </div>
              {getStatusBadge(session.status)}
            </div>

            {/* Days Until Badge */}
            {session.status === 'upcoming' && (
              <div className="mb-3">
                <Badge variant="outline" className="text-iris-600 border-iris-200 bg-iris-50">
                  {getDaysUntil(session.date)}
                </Badge>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2 pt-3 border-t border-zinc-200/80">
              {session.status === 'upcoming' && (
                <>
                  <Button
                    size="sm"
                    onClick={() => onSessionSelect(session)}
                    className="bg-zinc-900 text-white hover:bg-zinc-800"
                  >
                    <Video className="w-4 h-4 mr-1" />
                    세션 입장
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleSendMessage(session)}
                  >
                    <MessageSquare className="w-4 h-4 mr-1" />
                    메시지
                  </Button>
                </>
              )}

              {session.status === 'completed' && (
                <>
                  <Button
                    size="sm"
                    onClick={() => onReviewWrite(session)}
                    className="bg-zinc-900 text-white hover:bg-zinc-800"
                  >
                    <Star className="w-4 h-4 mr-1" />
                    리뷰 작성
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onSessionSelect(session)}
                  >
                    <FileText className="w-4 h-4 mr-1" />
                    기록 보기
                  </Button>
                </>
              )}
            </div>

            {/* Price Info */}
            <div className="mt-3 pt-3 border-t border-zinc-200/80 flex items-center justify-between">
              <span className="text-sm text-zinc-600">결제 금액</span>
              <span className="font-semibold text-iris-600 tnum">{session.price.toLocaleString()}원</span>
            </div>
          </div>
        </div>
        </Card>
      </Press>
    </Stagger.Item>
  );

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-zinc-200/80 sticky top-0 z-10 shadow-sm">
        <div className="container-web py-6">
          <div className="flex items-center gap-4">
            <Press lift={false}>
              <Button variant="ghost" size="icon" onClick={onBack}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Press>
            <div>
              <h1 className="text-2xl text-zinc-900 font-semibold tracking-tight">
                릴레이 세션
              </h1>
              <p className="text-zinc-600 mt-1">릴레이 세션을 관리하세요</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-web py-8 pb-24">
        <div className="max-w-4xl mx-auto">
          {/* Loading State */}
          {sessionsLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-iris-600" />
              <span className="ml-3 text-zinc-600">세션을 불러오는 중...</span>
            </div>
          )}

          {/* Stats Cards */}
          <Stagger className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8" stagger={0.08}>
            <Stagger.Item>
              <Card className="p-4 text-center rounded-2xl border-zinc-200/80 shadow-sm">
                <div className="text-3xl font-semibold tracking-tight text-iris-600 mb-1">
                  <CountUp value={upcomingSessions.length} />
                </div>
                <div className="text-sm text-zinc-600">예정된 세션</div>
              </Card>
            </Stagger.Item>
            <Stagger.Item>
              <Card className="p-4 text-center rounded-2xl border-zinc-200/80 shadow-sm">
                <div className="text-3xl font-semibold tracking-tight text-zinc-900 mb-1">
                  <CountUp value={completedSessions.length} />
                </div>
                <div className="text-sm text-zinc-600">완료한 세션</div>
              </Card>
            </Stagger.Item>
            <Stagger.Item className="col-span-2 md:col-span-1">
              <Card className="p-4 text-center rounded-2xl border-zinc-200/80 shadow-sm">
                <div className="text-3xl font-semibold tracking-tight text-zinc-900 mb-1 tnum">
                  {completedSessions.reduce((sum, s) => sum + s.price, 0).toLocaleString()}원
                </div>
                <div className="text-sm text-zinc-600">총 투자 금액</div>
              </Card>
            </Stagger.Item>
          </Stagger>

          {/* Upcoming Session Alert */}
          {upcomingSessions.length > 0 && getDaysUntil(upcomingSessions[0].date) === '오늘' && (
            <FadeIn className="mb-6">
              <Card className="p-4 bg-gradient-to-r from-zinc-900 to-iris-800 border-0 rounded-2xl shadow-md">
                <div className="flex items-center gap-3 text-white">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-semibold mb-1">오늘 세션이 있어요!</div>
                    <div className="text-sm text-white/90">
                      {upcomingSessions[0].mentorName}와 {upcomingSessions[0].time}에 릴레이 시작됩니다
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="bg-white text-iris-700 hover:bg-zinc-100"
                    onClick={() => onSessionSelect(upcomingSessions[0])}
                  >
                    입장
                  </Button>
                </div>
              </Card>
            </FadeIn>
          )}

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full grid grid-cols-2 h-12 bg-zinc-100 p-1 mb-6 rounded-xl">
              <TabsTrigger value="upcoming" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                예정 ({upcomingSessions.length})
              </TabsTrigger>
              <TabsTrigger value="completed" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                완료 ({completedSessions.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="mt-0">
              {upcomingSessions.length === 0 ? (
                <FadeIn>
                  <Card className="p-12 text-center rounded-2xl border-zinc-200/80 shadow-sm">
                    <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-10 h-10 text-zinc-400" />
                    </div>
                    <h3 className="text-xl text-zinc-900 font-semibold tracking-tight mb-2">예정된 세션이 없습니다</h3>
                    <p className="text-zinc-600 mb-6">
                      러너를 찾아 첫 릴레이 세션을 예약해보세요
                    </p>
                    <Button
                      onClick={onBack}
                      className="bg-zinc-900 text-white hover:bg-zinc-800"
                    >
                      러너 찾기
                    </Button>
                  </Card>
                </FadeIn>
              ) : (
                <Stagger className="space-y-4">
                  {upcomingSessions.map((session, index) => (
                    <SessionCard key={session.id} session={session} index={index} />
                  ))}
                </Stagger>
              )}
            </TabsContent>

            <TabsContent value="completed" className="mt-0">
              {completedSessions.length === 0 ? (
                <FadeIn>
                  <Card className="p-12 text-center rounded-2xl border-zinc-200/80 shadow-sm">
                    <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-10 h-10 text-zinc-400" />
                    </div>
                    <h3 className="text-xl text-zinc-900 font-semibold tracking-tight mb-2">완료된 세션이 없습니다</h3>
                    <p className="text-zinc-600">
                      세션을 완료하면 여기에 기록이 남습니다
                    </p>
                  </Card>
                </FadeIn>
              ) : (
                <Stagger className="space-y-4">
                  {completedSessions.map((session, index) => (
                    <SessionCard key={session.id} session={session} index={index} />
                  ))}
                </Stagger>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}