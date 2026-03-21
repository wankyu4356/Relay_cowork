import { useState } from 'react';
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
                {visibleUnreadCount > 0 ? `${visibleUnreadCount}개의 읽지 않은 알림` : '모든 알림을 확인했습니다'}
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
                전체 ({visibleNotifications.length})
              </Button>
              <Button
                variant={filter === 'unread' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('unread')}
                className={filter === 'unread' ? 'bg-sky-500 hover:bg-sky-600' : ''}
              >
                읽지 않음 ({visibleUnreadCount})
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
                className="text-sky-600 hover:bg-sky-50"
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
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className="p-12 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Loader2 className="w-10 h-10 text-sky-400 animate-spin" />
                </div>
                <h3 className="text-xl font-semibold mb-2">알림을 불러오는 중...</h3>
              </Card>
            </motion.div>
          ) : filteredNotifications.length === 0 ? (
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
                              {formatRelativeTime(notification.created_at)}
                            </span>
                          </div>

                          <p className="text-gray-600 text-sm mb-3">
                            {notification.message}
                          </p>

                          <div className="flex items-center gap-2">
                            {(notification as any).actionLabel && (
                              <Button
                                size="sm"
                                className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white"
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
                                className="text-sky-600 hover:bg-sky-50"
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