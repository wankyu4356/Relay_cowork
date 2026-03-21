import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { 
  ArrowLeft, 
  Video, 
  Mic, 
  MicOff,
  VideoOff,
  Monitor,
  MessageSquare,
  FileText,
  Send,
  Download,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import type { Mentor } from '../App';

interface SessionWorkspaceProps {
  onBack: () => void;
  onComplete: () => void;
  mentor: Mentor;
}

const mockMessages = [
  {
    id: '1',
    sender: 'mentor',
    text: '안녕하세요! AI로 작성하신 학업계획서 잘 받았습니다.',
    time: '14:02',
  },
  {
    id: '2',
    sender: 'mentee',
    text: '네 감사합니다! 전체적인 구조가 괜찮은지 봐주시면 감사하겠습니다.',
    time: '14:03',
  },
  {
    id: '3',
    sender: 'mentor',
    text: '네, 지금부터 함께 보면서 하나씩 개선해보겠습니다. 먼저 1번 문단부터 볼까요?',
    time: '14:04',
  },
];

export function SessionWorkspace({ onBack, onComplete, mentor }: SessionWorkspaceProps) {
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showDocument, setShowDocument] = useState(true);
  const [showChat, setShowChat] = useState(true);
  const [messages, setMessages] = useState(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [sessionTime, setSessionTime] = useState('14:32');
  const [documentContent, setDocumentContent] = useState(`1. 지원 동기

정치외교학을 전공하며 국제관계의 복잡한 역학을 분석하는 과정에서, 이론적 분석력과 실무적 전략 수립 능력의 간극을 경험했습니다. 특히 학회 활동에서 글로벌 기업의 시장 진입 전략을 연구하면서, 정치학적 통찰을 경영학적 의사결정으로 연결하는 과정에 깊은 흥미를 느꼈습니다.

2. 학업 배경

3학년 동안 정치경제학과 국제정치론을 수강하며 국가 간 경제 협력의 메커니즘을 학습했습니다. 이 과정에서 기업의 국제화 전략에 대한 관심이 깊어졌고, 컨설팅 인턴십을 통해 실제 기업 전략 수립 과정을 경험했습니다.`);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, {
        id: Date.now().toString(),
        sender: 'mentee',
        text: newMessage,
        time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      }]);
      setNewMessage('');
    }
  };

  const handleEndSession = () => {
    if (confirm('세션을 종료하시겠습니까? 세션 기록이 자동 저장됩니다.')) {
      toast.success('세션이 종료되었습니다');
      setTimeout(() => onComplete(), 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Top Bar */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="container-web py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                className="text-white hover:bg-gray-700"
                aria-label="뒤로 가기"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-white font-semibold">세션 진행 중</h1>
                  <Badge className="bg-red-500 text-white animate-pulse">● LIVE</Badge>
                </div>
                <p className="text-gray-400 text-sm mt-1">
                  {mentor.name} 멘토 · 경과 시간 {sessionTime}
                </p>
              </div>
            </div>
            
            <Button
              onClick={handleEndSession}
              className="bg-red-600 hover:bg-red-700 text-white"
              aria-label="세션 종료"
            >
              세션 종료
            </Button>
          </div>
        </div>
      </div>

      <div className="container-web py-4">
        <div className="grid lg:grid-cols-[1fr,400px] gap-4 h-[calc(100vh-120px)]">
          {/* Main Area */}
          <div className="space-y-4 flex flex-col">
            {/* Video Area */}
            <div className="grid grid-cols-2 gap-4">
              {/* Mentor Video */}
              <Card className="bg-gray-800 border-gray-700 overflow-hidden relative aspect-video">
                <div className="absolute inset-0 bg-gradient-to-br from-sky-900 to-blue-900 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 bg-gradient-to-br from-sky-400 to-blue-500 rounded-full flex items-center justify-center text-6xl mb-4 mx-auto">
                      {mentor.avatar}
                    </div>
                    <div className="text-white font-semibold text-lg">{mentor.name} 멘토</div>
                    <Badge className="bg-green-500 text-white mt-2">
                      <Mic className="w-3 h-3 mr-1" />
                      말하는 중
                    </Badge>
                  </div>
                </div>
              </Card>

              {/* My Video */}
              <Card className="bg-gray-800 border-gray-700 overflow-hidden relative aspect-video">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900 to-pink-900 flex items-center justify-center">
                  <div className="text-center">
                    {isCameraOn ? (
                      <>
                        <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-4xl mb-3 mx-auto">
                          👤
                        </div>
                        <div className="text-white font-semibold">나</div>
                      </>
                    ) : (
                      <>
                        <VideoOff className="w-16 h-16 text-white/50 mb-3 mx-auto" />
                        <div className="text-white/70">카메라 꺼짐</div>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            </div>

            {/* Controls */}
            <Card className="bg-gray-800 border-gray-700 p-4">
              <div className="flex items-center justify-center gap-3">
                <Button
                  variant={isMicOn ? 'default' : 'destructive'}
                  size="lg"
                  className="rounded-full w-14 h-14"
                  onClick={() => setIsMicOn(!isMicOn)}
                  aria-label={isMicOn ? '마이크 끄기' : '마이크 켜기'}
                  aria-pressed={isMicOn}
                >
                  {isMicOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
                </Button>
                <Button
                  variant={isCameraOn ? 'default' : 'destructive'}
                  size="lg"
                  className="rounded-full w-14 h-14"
                  onClick={() => setIsCameraOn(!isCameraOn)}
                  aria-label={isCameraOn ? '카메라 끄기' : '카메라 켜기'}
                  aria-pressed={isCameraOn}
                >
                  {isCameraOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
                </Button>
                <Button
                  variant={isScreenSharing ? 'default' : 'outline'}
                  size="lg"
                  className="rounded-full w-14 h-14"
                  onClick={() => {
                    setIsScreenSharing(!isScreenSharing);
                    toast.info(isScreenSharing ? '화면 공유 종료' : '화면 공유 시작');
                  }}
                  aria-label={isScreenSharing ? '화면 공유 종료' : '화면 공유 시작'}
                  aria-pressed={isScreenSharing}
                >
                  <Monitor className="w-6 h-6" />
                </Button>
                <Button
                  variant={showDocument ? 'default' : 'outline'}
                  size="lg"
                  className="rounded-full w-14 h-14"
                  onClick={() => setShowDocument(!showDocument)}
                  aria-label={showDocument ? '문서 숨기기' : '문서 보기'}
                  aria-pressed={showDocument}
                >
                  <FileText className="w-6 h-6" />
                </Button>
                <Button
                  variant={showChat ? 'default' : 'outline'}
                  size="lg"
                  className="rounded-full w-14 h-14"
                  onClick={() => setShowChat(!showChat)}
                  aria-label={showChat ? '채팅 숨기기' : '채팅 보기'}
                  aria-pressed={showChat}
                >
                  <MessageSquare className="w-6 h-6" />
                </Button>
              </div>
            </Card>

            {/* Document Editor */}
            {showDocument && (
              <Card className="bg-white flex-1 overflow-hidden flex flex-col">
                <div className="p-4 border-b flex items-center justify-between bg-gray-50">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-sky-600" />
                    <h3 className="font-semibold">학업계획서 (공동 편집)</h3>
                    <Badge className="bg-green-100 text-green-700">실시간 동기화</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      다운로드
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => setShowDocument(false)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex-1 overflow-auto p-6">
                  <Textarea
                    value={documentContent}
                    onChange={(e) => setDocumentContent(e.target.value)}
                    className="min-h-full font-serif text-base leading-relaxed border-0 focus-visible:ring-0"
                  />
                </div>
              </Card>
            )}
          </div>

          {/* Chat Sidebar */}
          {showChat && (
            <Card className="bg-gray-800 border-gray-700 flex flex-col">
              <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  채팅
                </h3>
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => setShowChat(false)}
                  className="text-white hover:bg-gray-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex-1 overflow-auto p-4 space-y-3" role="log" aria-label="채팅 메시지">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.sender === 'mentee' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] ${message.sender === 'mentee' ? 'bg-sky-600' : 'bg-gray-700'} text-white rounded-lg p-3`}>
                      <div className="text-sm">{message.text}</div>
                      <div className="text-xs opacity-70 mt-1">{message.time}</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="p-4 border-t border-gray-700">
                <div className="flex gap-2">
                  <Textarea
                    placeholder="메시지 입력..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className="min-h-[60px] bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                    aria-label="채팅 메시지 입력"
                  />
                  <Button
                    onClick={handleSendMessage}
                    className="bg-sky-600 hover:bg-sky-700"
                    aria-label="메시지 보내기"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
