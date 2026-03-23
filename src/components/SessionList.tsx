import { useState } from 'react';
import { motion } from 'motion/react';
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
      toast.success(`${session.mentorName} 러너에게 메시지를 보냅니다`);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <Badge className="bg-blue-500 text-white border-0">📅 예정</Badge>;
      case 'ongoing':
        return <Badge className="bg-green-500 text-white border-0">🔴 진행중</Badge>;
      case 'completed':
        return <Badge className="bg-gray-500 text-white border-0">✓ 완료</Badge>;
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="p-6 card-hover relative">
        {/* Menu Button */}
        {session.status === 'upcoming' && (
          <button 
            className="absolute top-4 right-4 w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedSession(selectedSession === session.id ? null : session.id);
            }}
          >
            <MoreVertical className="w-4 h-4 text-gray-500" />
          </button>
        )}

        {/* Dropdown Menu */}
        {selectedSession === session.id && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-14 right-4 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-10 min-w-[160px]"
          >
            <button
              onClick={() => handleReschedule(session.id)}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-sm"
            >
              <Calendar className="w-4 h-4" />
              일정 변경
            </button>
            <button
              onClick={() => handleSendMessage(session)}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-sm"
            >
              <MessageSquare className="w-4 h-4" />
              메시지 보내기
            </button>
            <div className="border-t border-gray-100 my-1"></div>
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
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-400 to-blue-500 flex items-center justify-center text-3xl flex-shrink-0 shadow-lg">
            {session.mentorAvatar}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-bold mb-1">{session.mentorName} 러너</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600 flex-wrap">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{session.date}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{session.time}</span>
                  </div>
                  <span>•</span>
                  <span>{session.duration}분</span>
                </div>
              </div>
              {getStatusBadge(session.status)}
            </div>

            {/* Days Until Badge */}
            {session.status === 'upcoming' && (
              <div className="mb-3">
                <Badge variant="outline" className="text-indigo-600 border-indigo-300 bg-indigo-50">
                  {getDaysUntil(session.date)}
                </Badge>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
              {session.status === 'upcoming' && (
                <>
                  <Button 
                    size="sm"
                    onClick={() => onSessionSelect(session)}
                    className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white"
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
                    className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white"
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
            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-sm text-gray-600">결제 금액</span>
              <span className="font-bold text-indigo-600">{session.price.toLocaleString()}원</span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-10 shadow-sm">
        <div className="container-web py-6">
          <div className="flex items-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="ghost" size="icon" onClick={onBack}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                릴레이 세션
              </h1>
              <p className="text-gray-600 mt-1">릴레이 세션을 관리하세요</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-web py-8 pb-24">
        <div className="max-w-4xl mx-auto">
          {/* Loading State */}
          {sessionsLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
              <span className="ml-3 text-gray-600">세션을 불러오는 중...</span>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="p-4 text-center">
                <div className="text-3xl font-bold text-indigo-600 mb-1">
                  {upcomingSessions.length}
                </div>
                <div className="text-sm text-gray-600">예정된 세션</div>
              </Card>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="p-4 text-center">
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {completedSessions.length}
                </div>
                <div className="text-sm text-gray-600">완료한 세션</div>
              </Card>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.2 }}
              className="col-span-2 md:col-span-1"
            >
              <Card className="p-4 text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">
                  {completedSessions.reduce((sum, s) => sum + s.price, 0).toLocaleString()}원
                </div>
                <div className="text-sm text-gray-600">총 투자 금액</div>
              </Card>
            </motion.div>
          </div>

          {/* Upcoming Session Alert */}
          {upcomingSessions.length > 0 && getDaysUntil(upcomingSessions[0].date) === '오늘' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <Card className="p-4 bg-gradient-to-r from-indigo-500 to-blue-600 border-0">
                <div className="flex items-center gap-3 text-white">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-semibold mb-1">오늘 세션이 있어요!</div>
                    <div className="text-sm text-white/90">
                      {upcomingSessions[0].mentorName} 러너와 {upcomingSessions[0].time}에 릴레이 시작됩니다
                    </div>
                  </div>
                  <Button 
                    size="sm"
                    className="bg-white text-indigo-600 hover:bg-gray-100"
                    onClick={() => onSessionSelect(upcomingSessions[0])}
                  >
                    입장
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full grid grid-cols-2 h-12 bg-gray-100/80 backdrop-blur-sm p-1 mb-6">
              <TabsTrigger value="upcoming" className="data-[state=active]:bg-white data-[state=active]:shadow-md">
                예정 ({upcomingSessions.length})
              </TabsTrigger>
              <TabsTrigger value="completed" className="data-[state=active]:bg-white data-[state=active]:shadow-md">
                완료 ({completedSessions.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="mt-0">
              {upcomingSessions.length === 0 ? (
                <Card className="p-12 text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">예정된 세션이 없습니다</h3>
                  <p className="text-gray-600 mb-6">
                    러너를 찾아 첫 릴레이 세션을 예약해보세요
                  </p>
                  <Button 
                    onClick={onBack}
                    className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white"
                  >
                    러너 찾기
                  </Button>
                </Card>
              ) : (
                <div className="space-y-4">
                  {upcomingSessions.map((session, index) => (
                    <SessionCard key={session.id} session={session} index={index} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="completed" className="mt-0">
              {completedSessions.length === 0 ? (
                <Card className="p-12 text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">완료된 세션이 없습니다</h3>
                  <p className="text-gray-600">
                    세션을 완료하면 여기에 기록이 남습니다
                  </p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {completedSessions.map((session, index) => (
                    <SessionCard key={session.id} session={session} index={index} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}