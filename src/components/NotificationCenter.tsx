import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { FadeIn, Stagger, Press } from './ui/motion';
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
  Check,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { useNotifications } from '../hooks/useNotifications';

interface NotificationCenterProps {
  onBack: () => void;
}

function formatRelativeTime(dateString: string): string {
  const now = Date.now();
  const date = new Date(dateString).getTime();
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return '방금 전';
  if (diffMin < 60) return `${diffMin}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays < 30) return `${diffDays}일 전`;
  return `${Math.floor(diffDays / 30)}개월 전`;
}

export function NotificationCenter({ onBack }: NotificationCenterProps) {
  const { notifications, loading, unreadCount, markAsRead, refetch } = useNotifications();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());
  const [clearedAll, setClearedAll] = useState(false);

  const visibleNotifications = clearedAll
    ? []
    : notifications.filter(n => !deletedIds.has(n.id));

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
      case 'session': return 'bg-iris-50 text-iris-600';
      case 'message': return 'bg-iris-50 text-iris-600';
      case 'ai': return 'bg-iris-100 text-iris-600';
      case 'payment': return 'bg-zinc-100 text-zinc-600';
      case 'review': return 'bg-zinc-100 text-zinc-600';
      case 'system': return 'bg-zinc-100 text-zinc-600';
      default: return 'bg-zinc-100 text-zinc-600';
    }
  };

  const filteredNotifications = filter === 'unread'
    ? visibleNotifications.filter(n => !n.read)
    : visibleNotifications;

  const visibleUnreadCount = visibleNotifications.filter(n => !n.read).length;

  const handleMarkAsRead = (id: string) => {
    markAsRead(id);
    toast.success('읽음으로 표시했습니다');
  };

  const handleMarkAllAsRead = () => {
    visibleNotifications.filter(n => !n.read).forEach(n => markAsRead(n.id));
    toast.success('모든 알림을 읽음으로 표시했습니다');
  };

  const handleDelete = (id: string) => {
    setDeletedIds(prev => new Set(prev).add(id));
    toast.success('알림을 삭제했습니다');
  };

  const handleClearAll = () => {
    if (confirm('모든 알림을 삭제하시겠습니까?')) {
      setClearedAll(true);
      toast.success('모든 알림을 삭제했습니다');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-zinc-200/80 sticky top-0 z-10 shadow-sm">
        <div className="container-web py-6">
          <div className="flex items-center gap-4 mb-4">
            <Press lift={false}>
              <Button variant="ghost" size="icon" onClick={onBack} aria-label="뒤로 가기">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Press>
            <div className="flex-1">
              <h1 className="text-2xl text-zinc-900 font-semibold tracking-tight">
                알림
              </h1>
              <p className="text-zinc-600 mt-1">
                {visibleUnreadCount > 0 ? `${visibleUnreadCount}개의 읽지 않은 알림` : '모든 알림을 확인했습니다'}
              </p>
            </div>
            <Press lift={false}>
              <Button
                variant={showFilters ? 'default' : 'outline'}
                size="icon"
                onClick={() => setShowFilters(!showFilters)}
                className={showFilters ? 'bg-zinc-900 hover:bg-zinc-800' : ''}
                aria-label="필터"
                aria-expanded={showFilters}
              >
                <Filter className="w-5 h-5" />
              </Button>
            </Press>
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
                className={filter === 'all' ? 'bg-zinc-900 hover:bg-zinc-800' : ''}
              >
                전체 (<span className="tnum">{visibleNotifications.length}</span>)
              </Button>
              <Button
                variant={filter === 'unread' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('unread')}
                className={filter === 'unread' ? 'bg-zinc-900 hover:bg-zinc-800' : ''}
              >
                읽지 않음 (<span className="tnum">{visibleUnreadCount}</span>)
              </Button>
            </motion.div>
          )}

          {/* Action Bar */}
          {visibleNotifications.length > 0 && (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllAsRead}
                className="text-iris-600 hover:bg-iris-50"
                disabled={visibleUnreadCount === 0}
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
          {loading ? (
            <FadeIn>
              <Card className="p-12 text-center rounded-2xl">
                <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Loader2 className="w-10 h-10 text-iris-400 animate-spin" />
                </div>
                <h3 className="text-xl text-zinc-900 font-semibold tracking-tight mb-2">알림을 불러오는 중...</h3>
              </Card>
            </FadeIn>
          ) : filteredNotifications.length === 0 ? (
            <FadeIn>
              <Card className="p-12 text-center rounded-2xl">
                <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bell className="w-10 h-10 text-zinc-400" />
                </div>
                <h3 className="text-xl text-zinc-900 font-semibold tracking-tight mb-2">알림이 없습니다</h3>
                <p className="text-zinc-600">
                  {filter === 'unread'
                    ? '모든 알림을 확인했습니다'
                    : '새로운 알림이 도착하면 여기에 표시됩니다'}
                </p>
              </Card>
            </FadeIn>
          ) : (
            <Stagger className="space-y-3" aria-live="polite" aria-label="알림 목록">
              {filteredNotifications.map((notification) => {
                const Icon = getIcon(notification.type);
                const iconColor = getIconColor(notification.type);

                return (
                  <Stagger.Item key={notification.id}>
                    <Press lift={false} scale={0.99}>
                    <Card
                      className={`p-4 cursor-pointer card-hover rounded-2xl ${
                        !notification.read ? 'bg-iris-50/50 border-iris-200' : ''
                      }`}
                    >
                      <div className="flex gap-4">
                        <div className={`w-12 h-12 rounded-xl ${iconColor} flex items-center justify-center flex-shrink-0`}>
                          <Icon className="w-6 h-6" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <div className="flex items-center gap-2">
                              <h3 className="text-zinc-900 font-semibold tracking-tight">{notification.title}</h3>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-iris-500 rounded-full"></div>
                              )}
                            </div>
                            <span className="text-xs text-zinc-400 whitespace-nowrap">
                              {formatRelativeTime(notification.created_at)}
                            </span>
                          </div>

                          <p className="text-zinc-600 text-sm mb-3">
                            {notification.message}
                          </p>

                          <div className="flex items-center gap-2">
                            {(notification as any).actionLabel && (
                              <Button
                                size="sm"
                                className="bg-zinc-900 hover:bg-zinc-800 text-white"
                              >
                                {(notification as any).actionLabel}
                              </Button>
                            )}

                            {!notification.read && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                  e.stopPropagation();
                                  handleMarkAsRead(notification.id);
                                }}
                                className="text-iris-600 hover:bg-iris-50"
                              >
                                <Check className="w-4 h-4 mr-1" />
                                읽음
                              </Button>
                            )}

                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                e.stopPropagation();
                                handleDelete(notification.id);
                              }}
                              className="text-red-600 hover:bg-red-50 ml-auto"
                              aria-label="알림 삭제"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                    </Press>
                  </Stagger.Item>
                );
              })}
            </Stagger>
          )}
        </div>
      </div>
    </div>
  );
}