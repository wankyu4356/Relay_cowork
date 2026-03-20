import { useState, useEffect } from 'react';
import * as api from '../components/api';
import { fetchWithFallback } from './useDataService';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: '1', title: '세션 알림', message: '내일 14:00에 이서연 멘토와의 세션이 있습니다.', type: 'session', read: false, created_at: new Date().toISOString() },
  { id: '2', title: '리뷰 요청', message: '지난 세션에 대한 리뷰를 작성해주세요.', type: 'review', read: false, created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: '3', title: '크레딧 충전', message: '5 크레딧이 충전되었습니다.', type: 'credit', read: true, created_at: new Date(Date.now() - 172800000).toISOString() },
];

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await fetchWithFallback(
        async () => {
          const res = await api.getNotifications();
          return res.notifications || [];
        },
        MOCK_NOTIFICATIONS,
      );
      setNotifications(data);
    } catch { /* ignore */ } finally { setLoading(false); }
  };

  const markAsRead = async (id: string) => {
    try { await api.markNotificationRead(id); } catch { /* ignore */ }
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => { fetchNotifications(); }, []);

  return { notifications, loading, unreadCount, markAsRead, refetch: fetchNotifications };
}
