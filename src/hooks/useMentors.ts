import { useState, useEffect } from 'react';
import * as api from '../components/api';
import { fetchWithFallback } from './useDataService';
import type { Mentor } from '../App';

const MOCK_MENTORS: Mentor[] = [
  { id: '1', name: '러너 #2847', university: '연세대', major: '경영학과', year: '22학번', rating: 4.9, reviews: 23, sessions: 35, successRate: 87, responseTime: '2시간', price: 80000, badge: 'gold', verified: true, avatar: '👩‍🎓' },
  { id: '2', name: '러너 #1923', university: '고려대', major: '경제학과', year: '23학번', rating: 4.8, reviews: 18, sessions: 22, successRate: 82, responseTime: '1시간', price: 70000, badge: 'silver', verified: true, avatar: '👨‍🎓' },
  { id: '3', name: '러너 #5621', university: '성균관대', major: '경영학과', year: '23학번', rating: 4.7, reviews: 12, sessions: 15, successRate: 80, responseTime: '3시간', price: 60000, badge: 'silver', verified: true, avatar: '👩‍💼' },
  { id: '4', name: '러너 #3142', university: '서강대', major: '경영학과', year: '21학번', rating: 4.9, reviews: 31, sessions: 48, successRate: 91, responseTime: '1시간', price: 100000, badge: 'gold', verified: true, avatar: '👨‍💼' },
  { id: '5', name: '러너 #7834', university: '한양대', major: '경영학과', year: '22학번', rating: 4.6, reviews: 9, sessions: 12, successRate: 75, responseTime: '4시간', price: 50000, badge: 'bronze', verified: true, avatar: '👨‍🎓' },
  { id: '6', name: '러너 #4521', university: '중앙대', major: '경제학과', year: '22학번', rating: 4.5, reviews: 7, sessions: 10, successRate: 70, responseTime: '2시간', price: 55000, badge: 'bronze', verified: true, avatar: '👩‍🎓' },
];

export function useMentors() {
  const [mentors, setMentors] = useState<Mentor[]>(MOCK_MENTORS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMentors = async () => {
    setLoading(true);
    try {
      const data = await fetchWithFallback(
        async () => {
          const res = await api.getMentors();
          // Transform API response to Mentor type
          return (res.mentors || []).map((m: any) => ({
            id: m.id,
            name: m.name || '멘토',
            university: m.university || '',
            major: m.major || '',
            year: m.year || '',
            rating: m.rating || 0,
            reviews: m.review_count || 0,
            sessions: m.session_count || 0,
            successRate: m.success_rate || 0,
            responseTime: m.response_time || '2시간',
            price: m.price || 30000,
            badge: m.badge || 'bronze',
            verified: m.verified || false,
            avatar: m.avatar || '👨‍🎓',
          }));
        },
        MOCK_MENTORS,
      );
      setMentors(data);
      setError(null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMentors(); }, []);

  return { mentors, loading, error, refetch: fetchMentors };
}

export { MOCK_MENTORS };
