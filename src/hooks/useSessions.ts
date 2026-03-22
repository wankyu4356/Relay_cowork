import { useState, useEffect } from 'react';
import * as api from '../components/api';
import { fetchWithFallback } from './useDataService';
import type { Session } from '../App';

const MOCK_SESSIONS: Session[] = [
  { id: '1', mentorId: '1', mentorName: '이서연', mentorAvatar: '👩‍🎓', date: '2025.02.20', time: '14:00', duration: 60, price: 80000, status: 'upcoming' },
  { id: '2', mentorId: '1', mentorName: '이서연', mentorAvatar: '👩‍🎓', date: '2025.02.25', time: '16:00', duration: 60, price: 80000, status: 'upcoming' },
  { id: '3', mentorId: '2', mentorName: '김민준', mentorAvatar: '👨‍🎓', date: '2025.02.18', time: '10:00', duration: 90, price: 120000, status: 'ongoing' },
  { id: '4', mentorId: '3', mentorName: '박지우', mentorAvatar: '👨‍💼', date: '2025.01.15', time: '15:00', duration: 60, price: 70000, status: 'completed' },
  { id: '5', mentorId: '4', mentorName: '최예은', mentorAvatar: '👩‍💼', date: '2025.01.10', time: '11:00', duration: 60, price: 75000, status: 'completed' },
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
            mentorName: s.mentor_name || '멘토',
            mentorAvatar: s.mentor_avatar || '👨‍🎓',
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
