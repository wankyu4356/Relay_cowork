import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { 
  ArrowLeft, 
  Send,
  Paperclip,
  Image as ImageIcon,
  Smile,
  MoreVertical,
  Search,
  Check,
  CheckCheck
} from 'lucide-react';
import { toast } from 'sonner';
import * as api from './api';

interface MessageCenterProps {
  onBack: () => void;
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  read: boolean;
  type: 'text' | 'image' | 'file';
}

interface Conversation {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userRole: '멘토' | '멘티';
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  online: boolean;
}

const mockConversations: Conversation[] = [
  {
    id: '1',
    userId: '1',
    userName: '김서연',
    userAvatar: '👩‍🎓',
    userRole: '멘토',
    lastMessage: '학업계획서 초안 검토 완료했습니다.',
    lastMessageTime: '2분 전',
    unreadCount: 2,
    online: true,
  },
  {
    id: '2',
    userId: '2',
    userName: '이준호',
    userAvatar: '👨‍🎓',
    userRole: '멘토',
    lastMessage: '다음 세션 일정 조율하고 싶어요',
    lastMessageTime: '1시간 전',
    unreadCount: 0,
    online: false,
  },
  {
    id: '3',
    userId: '3',
    userName: '박지민',
    userAvatar: '👩‍💼',
    userRole: '멘토',
    lastMessage: '면접 준비 자료 보내드렸습니다',
    lastMessageTime: '3시간 전',
    unreadCount: 1,
    online: true,
  },
];

const mockMessages: Message[] = [
  {
    id: '1',
    senderId: '1',
    content: '안녕하세요! 학업계획서 초안 잘 받았습니다.',
    timestamp: '14:30',
    read: true,
    type: 'text',
  },
  {
    id: '2',
    senderId: 'me',
    content: '감사합니다! 어떤 부분을 수정하면 좋을까요?',
    timestamp: '14:32',
    read: true,
    type: 'text',
  },
  {
    id: '3',
    senderId: '1',
    content: '전반적으로 잘 작성하셨는데, 동기 부분을 좀 더 구체적으로 작성하면 좋을 것 같아요.',
    timestamp: '14:35',
    read: true,
    type: 'text',
  },
  {
    id: '4',
    senderId: 'me',
    content: '알겠습니다. 다음 세션 때 상세히 논의하면 될까요?',
    timestamp: '14:37',
    read: true,
    type: 'text',
  },
  {
    id: '5',
    senderId: '1',
    content: '네, 그렇게 하시죠! 다음 주 화요일 2시는 어떠신가요?',
    timestamp: '14:40',
    read: false,
    type: 'text',
  },
];

export function MessageCenter({ onBack }: MessageCenterProps) {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(conversations[0]);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);

  // Load conversations from API on mount with fallback to mock data
  useEffect(() => {
    setLoadingConversations(true);
    api.getConversations().then(res => {
      if (res.conversations?.length > 0) {
        interface ApiConversation {
          id: string;
          userId?: string;
          name?: string;
          userName?: string;
          userAvatar?: string;
          avatar?: string;
          userRole?: string;
          lastMessage?: string;
          lastMessageTime?: string;
          unreadCount?: number;
          online?: boolean;
        }
        const mapped: Conversation[] = (res.conversations as ApiConversation[]).map((c) => ({
          id: c.id,
          userId: c.userId || c.id,
          userName: c.userName || c.name || '사용자',
          userAvatar: c.userAvatar || c.avatar || '👤',
          userRole: (c.userRole === '멘토' || c.userRole === '멘티' ? c.userRole : '멘토') as '멘토' | '멘티',
          lastMessage: c.lastMessage || '',
          lastMessageTime: c.lastMessageTime || '',
          unreadCount: c.unreadCount || 0,
          online: c.online || false,
        }));
        setConversations(mapped);
        setSelectedConversation(mapped[0]);
      }
    }).catch(() => {
      // keep mock data as fallback
    }).finally(() => {
      setLoadingConversations(false);
    });
  }, []);

  // Load messages from API when a conversation is selected
  useEffect(() => {
    if (!selectedConversation) return;

    setLoadingMessages(true);
    api.getMessages(selectedConversation.id).then(res => {
      if (res.messages?.length > 0) {
        interface ApiMessage {
          id: string;
          senderId?: string;
          sender_id?: string;
          content?: string;
          timestamp?: string;
          read?: boolean;
          type?: 'text' | 'image' | 'file';
        }
        const mapped: Message[] = (res.messages as ApiMessage[]).map((m) => ({
          id: m.id,
          senderId: m.senderId || m.sender_id || 'unknown',
          content: m.content || '',
          timestamp: m.timestamp || '',
          read: m.read ?? false,
          type: m.type || 'text',
        }));
        setMessages(mapped);
      } else {
        setMessages([]);
      }
    }).catch(() => {
      // If this is the first conversation (from mock data), keep mock messages as fallback
      if (selectedConversation.id === mockConversations[0]?.id) {
        setMessages(mockMessages);
      } else {
        setMessages([]);
      }
    }).finally(() => {
      setLoadingMessages(false);
    });
  }, [selectedConversation?.id]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || sendingMessage) return;

    const optimisticMessage: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      content: newMessage,
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      read: false,
      type: 'text',
    };

    // Optimistically add the message to the UI
    setMessages(prev => [...prev, optimisticMessage]);
    const messageContent = newMessage;
    setNewMessage('');

    setSendingMessage(true);
    try {
      await api.sendMessage(
        selectedConversation.userId,
        messageContent,
        selectedConversation.id,
      );
      toast.success('메시지가 전송되었습니다');
    } catch {
      // Message already shown optimistically; notify user of send failure
      toast.error('메시지 전송에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setSendingMessage(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50">
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
              <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                메시지
              </h1>
              <p className="text-gray-600 mt-1">멘토와 실시간으로 소통하세요</p>
            </div>
            {conversations.reduce((sum, conv) => sum + conv.unreadCount, 0) > 0 && (
              <Badge className="bg-red-500 text-white border-0">
                {conversations.reduce((sum, conv) => sum + conv.unreadCount, 0)}
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="container-web py-6 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-[350px_1fr] gap-4 h-[calc(100vh-200px)]">
            {/* Conversations List */}
            <Card className="flex flex-col overflow-hidden">
              {/* Search */}
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="대화 검색"
                    className="pl-9"
                  />
                </div>
              </div>

              {/* List */}
              <div className="flex-1 overflow-y-auto">
                {loadingConversations && (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-6 h-6 border-2 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="ml-2 text-sm text-gray-500">대화 불러오는 중...</span>
                  </div>
                )}
                {filteredConversations.map((conv) => (
                  <motion.div
                    key={conv.id}
                    whileHover={{ backgroundColor: 'rgba(14, 165, 233, 0.05)' }}
                    onClick={() => setSelectedConversation(conv)}
                    className={`p-4 cursor-pointer border-b border-gray-100 transition-colors ${
                      selectedConversation?.id === conv.id ? 'bg-sky-50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center text-2xl">
                          {conv.userAvatar}
                        </div>
                        {conv.online && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold truncate">{conv.userName}</h3>
                            <Badge variant="outline" className="text-xs">
                              {conv.userRole}
                            </Badge>
                          </div>
                          <span className="text-xs text-gray-500">{conv.lastMessageTime}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                          {conv.unreadCount > 0 && (
                            <Badge className="ml-2 bg-red-500 text-white border-0 w-5 h-5 flex items-center justify-center p-0 text-xs">
                              {conv.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Chat Area */}
            {selectedConversation ? (
              <Card className="flex flex-col overflow-hidden">
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 bg-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center text-xl">
                          {selectedConversation.userAvatar}
                        </div>
                        {selectedConversation.online && (
                          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{selectedConversation.userName}</h3>
                          <Badge variant="outline" className="text-xs">
                            {selectedConversation.userRole}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          {selectedConversation.online ? '온라인' : '오프라인'}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {loadingMessages && (
                    <div className="flex items-center justify-center py-8">
                      <div className="w-6 h-6 border-2 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="ml-2 text-sm text-gray-500">메시지 불러오는 중...</span>
                    </div>
                  )}
                  <AnimatePresence>
                    {messages.map((message) => {
                      const isMe = message.senderId === 'me';
                      return (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[70%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                            <div
                              className={`rounded-2xl px-4 py-2 ${
                                isMe
                                  ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white'
                                  : 'bg-gray-100 text-gray-900'
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                            </div>
                            <div className="flex items-center gap-1 mt-1 px-2">
                              <span className="text-xs text-gray-500">{message.timestamp}</span>
                              {isMe && (
                                message.read ? (
                                  <CheckCheck className="w-3 h-3 text-sky-500" />
                                ) : (
                                  <Check className="w-3 h-3 text-gray-400" />
                                )
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-gray-200 bg-white">
                  <div className="flex items-end gap-2">
                    <Button variant="ghost" size="icon" className="flex-shrink-0">
                      <Paperclip className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="flex-shrink-0">
                      <ImageIcon className="w-5 h-5" />
                    </Button>
                    <div className="flex-1">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="메시지를 입력하세요..."
                        className="min-h-[44px]"
                      />
                    </div>
                    <Button variant="ghost" size="icon" className="flex-shrink-0">
                      <Smile className="w-5 h-5" />
                    </Button>
                    <Button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || sendingMessage}
                      className="flex-shrink-0 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white"
                    >
                      <Send className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="flex items-center justify-center p-12">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">대화를 선택하세요</h3>
                  <p className="text-gray-600">
                    왼쪽에서 대화를 선택하여 메시지를 시작하세요
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}