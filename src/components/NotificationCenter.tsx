import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { 
  ArrowLeft, 
  Bell, 
  Calendar, 
  MessageSquare, 
  Sparkles,
  Award,
  DollarSign,
  CheckCheck,
  Trash2,
  Filter,
  Check
} from 'lucide-react';
import { toast } from 'sonner';
import * as api from './api';

interface NotificationCenterProps {
  onBack: () => void;
}

interface Notification {
  id: string;
  type: 'session' | 'message' | 'ai' | 'payment' | 'review' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
  actionLabel?: string;
  actionUrl?: string;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'session',
    title: '세션 리마인더',
    message: '김서연 멘토와의 세션이 1시간 후 시작됩니다.',
    time: '1시간 전',
    read: false,
    actionLabel: '세션 입장',
  },
  {
    id: '2',
    type: 'message',
    title: '새 메시지',
    message: '이준호 멘토가 메시지를 보냈습니다: "학계서 초안 검토 완료했습니다."',
    time: '2시간 전',
    read: false,
    actionLabel: '메시지 보기',
  },
  {
    id: '3',
    type: 'ai',
    title: 'AI 학계서 생성 완료',
    message: '연세대 경영학과 학업계획서 초안이 생성되었습니다.',
    time: '3시간 전',
    read: true,
    actionLabel: '결과 보기',
  },
  {
    id: '4',
    type: 'payment',
    title: '결제 완료',
    message: '₩80,000 멘토링 세션 결제가 완료되었습니다.',
    time: '5시간 전',
    read: true,
  },
  {
    id: '5',
    type: 'review',
    title: '리뷰 작성 요청',
    message: '박지민 멘토와의 세션이 종료되었습니다. 리뷰를 작성해주세요.',
    time: '1일 전',
    read: true,
    actionLabel: '리뷰 쓰기',
  },
  {
    id: '6',
    type: 'system',
    title: '크레딧 지급',
    message: '결과 보고 작성으로 1 크레딧이 지급되었습니다.',
    time: '2일 전',
    read: true,
  },
  {
    id: '7',
    type: 'session',
    title: '세션 예약 확정',
    message: '최민수 멘토가 세션 예약을 승인했습니다.',
    time: '2일 전',
    read: true,
    actionLabel: '세션 보기',
  },
  {
    id: '8',
    type: 'message',
    title: '새 메시지',
    message: '강태양 멘토가 메시지를 보냈습니다.',
    time: '3일 전',
    read: true,
  },
];

export function NotificationCenter({ onBack }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Load notifications from server (fallback to mock)
  useEffect(() => {
    api.getNotifications()
      .then((data) => {
        if (data.notifications && data.notifications.length > 0) {
          setNotifications(data.notifications);
        }
      })
      .catch((e) => console.log('Using mock notifications:', e));
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'session': return Calendar;
      case 'message': return MessageSquare;
      case 'ai': return Sparkles;
      case 'payment': return DollarSign;
      case 'review': return Award;
      case 'system': return Bell;
      default: return Bell;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'session': return 'bg-sky-100 text-sky-600';
      case 'message': return 'bg-blue-100 text-blue-600';
      case 'ai': return 'bg-purple-100 text-purple-600';
      case 'payment': return 'bg-green-100 text-green-600';
      case 'review': return 'bg-yellow-100 text-yellow-600';
      case 'system': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications;

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    api.markNotificationRead(id).catch(e => console.log('Mark read failed:', e));
    toast.success('읽음으로 표시했습니다');
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success('모든 알림을 읽음으로 표시했습니다');
  };

  const handleDelete = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast.success('알림을 삭제했습니다');
  };

  const handleClearAll = () => {
    if (confirm('모든 알림을 삭제하시겠습니까?')) {
      setNotifications([]);
      toast.success('모든 알림을 삭제했습니다');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-10 shadow-sm">
        <div className="container-web py-6">
          <div className="flex items-center gap-4 mb-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="ghost" size="icon" onClick={onBack}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </motion.div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                알림
              </h1>
              <p className="text-gray-600 mt-1">
                {unreadCount > 0 ? `${unreadCount}개의 읽지 않은 알림` : '모든 알림을 확인했습니다'}
              </p>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant={showFilters ? 'default' : 'outline'}
                size="icon"
                onClick={() => setShowFilters(!showFilters)}
                className={showFilters ? 'bg-sky-500 hover:bg-sky-600' : ''}
              >
                <Filter className="w-5 h-5" />
              </Button>
            </motion.div>
          </div>

          {/* Filter Bar */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex gap-2 mb-4"
            >
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
                className={filter === 'all' ? 'bg-sky-500 hover:bg-sky-600' : ''}
              >
                전체 ({notifications.length})
              </Button>
              <Button
                variant={filter === 'unread' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('unread')}
                className={filter === 'unread' ? 'bg-sky-500 hover:bg-sky-600' : ''}
              >
                읽지 않음 ({unreadCount})
              </Button>
            </motion.div>
          )}

          {/* Action Bar */}
          {notifications.length > 0 && (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllAsRead}
                className="text-sky-600 hover:bg-sky-50"
                disabled={unreadCount === 0}
              >
                <CheckCheck className="w-4 h-4 mr-2" />
                모두 읽음
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                className="text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                모두 삭제
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="container-web py-8 pb-24">
        <div className="max-w-3xl mx-auto">
          {filteredNotifications.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className="p-12 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bell className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">알림이 없습니다</h3>
                <p className="text-gray-600">
                  {filter === 'unread' 
                    ? '모든 알림을 확인했습니다'
                    : '새로운 알림이 도착하면 여기에 표시됩니다'}
                </p>
              </Card>
            </motion.div>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notification, index) => {
                const Icon = getIcon(notification.type);
                const iconColor = getIconColor(notification.type);

                return (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card 
                      className={`p-4 cursor-pointer card-hover ${
                        !notification.read ? 'bg-sky-50/50 border-sky-200' : ''
                      }`}
                    >
                      <div className="flex gap-4">
                        <div className={`w-12 h-12 rounded-xl ${iconColor} flex items-center justify-center flex-shrink-0`}>
                          <Icon className="w-6 h-6" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{notification.title}</h3>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-sky-500 rounded-full"></div>
                              )}
                            </div>
                            <span className="text-xs text-gray-500 whitespace-nowrap">
                              {notification.time}
                            </span>
                          </div>

                          <p className="text-gray-600 text-sm mb-3">
                            {notification.message}
                          </p>

                          <div className="flex items-center gap-2">
                            {notification.actionLabel && (
                              <Button 
                                size="sm"
                                className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white"
                              >
                                {notification.actionLabel}
                              </Button>
                            )}
                            
                            {!notification.read && (
                              <Button 
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMarkAsRead(notification.id);
                                }}
                                className="text-sky-600 hover:bg-sky-50"
                              >
                                <Check className="w-4 h-4 mr-1" />
                                읽음
                              </Button>
                            )}

                            <Button 
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(notification.id);
                              }}
                              className="text-red-600 hover:bg-red-50 ml-auto"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}