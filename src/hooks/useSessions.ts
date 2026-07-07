import { useState, useEffect } from 'react';
import * as api from '../components/api';
import { fetchWithFallback } from './useDataService';
import type { Session } from '../App';

// 목업 날짜는 항상 오늘 기준 상대값으로 생성한다
// (과거 날짜에 '예정' 배지가 붙는 모순 방지)
const daysFromNow = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}.${mm}.${dd}`;
};

// 러너는 익명 번호로만 노출한다 (러너 #XXXX 익명 시스템)
const MOCK_SESSIONS: Session[] = [
  { id: '1', mentorId: '1', mentorName: '러너 #2847', mentorAvatar: '', date: daysFromNow(3), time: '14:00', duration: 60, price: 65000, status: 'upcoming' },
  { id: '2', mentorId: '1', mentorName: '러너 #2847', mentorAvatar: '', date: daysFromNow(8), time: '16:00', duration: 60, price: 65000, status: 'upcoming' },
  { id: '3', mentorId: '2', mentorName: '러너 #1923', mentorAvatar: '', date: daysFromNow(0), time: '10:00', duration: 60, price: 45000, status: 'ongoing' },
  { id: '4', mentorId: '3', mentorName: '러너 #5621', mentorAvatar: '', date: daysFromNow(-21), time: '15:00', duration: 60, price: 38000, status: 'completed' },
  { id: '5', mentorId: '4', mentorName: '러너 #3142', mentorAvatar: '', date: daysFromNow(-26), time: '11:00', duration: 60, price: 50000, status: 'completed' },
];

export function useSessions() {
  const [sessions, setSessions] = useState<Session[]>(MOCK_SESSIONS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const data = await fetchWithFallback(
        async () => {
          const res = await api.getSessions();
          interface ApiSession {
            id: string;
            mentor_id: string;
            mentor_name?: string;
            mentor_avatar?: string;
            date: string;
            time: string;
            duration?: number;
            price?: number;
            status?: string;
          }
          return (res.sessions || []).map((s: ApiSession) => ({
            id: s.id,
            mentorId: s.mentor_id,
            mentorName: s.mentor_name || '러너',
            mentorAvatar: s.mentor_avatar || '',
            date: s.date,
            time: s.time,
            duration: s.duration || 60,
            price: s.price || 0,
            status: s.status || 'upcoming',
          }));
        },
        MOCK_SESSIONS,
      );
      setSessions(data);
      setError(null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  const cancelSession = async (sessionId: string) => {
    try {
      await api.updateSession(sessionId, { status: 'cancelled' });
    } catch {
      // fallback: update locally
    }
    setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, status: 'cancelled' as const } : s));
  };

  useEffect(() => { fetchSessions(); }, []);

  return { sessions, loading, error, refetch: fetchSessions, cancelSession };
}

export { MOCK_SESSIONS };
