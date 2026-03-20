import { useState, useEffect, useRef } from 'react';
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

function transformApiMentor(m: any): Mentor {
  return {
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
  };
}

/**
 * Hook to fetch mentors from the API with fallback to mock data.
 * @param fallbackMentors - Optional category-specific mock mentors to use when API is unavailable.
 *                          Falls back to the default MOCK_MENTORS if not provided.
 */
export function useMentors(fallbackMentors?: Mentor[]) {
  const fallback = fallbackMentors || MOCK_MENTORS;
  const [mentors, setMentors] = useState<Mentor[]>(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFromApi, setIsFromApi] = useState(false);
  // Track the fallback identity to re-fetch when category changes
  const fallbackRef = useRef(fallback);

  const fetchMentors = async (currentFallback: Mentor[]) => {
    setLoading(true);
    try {
      const data = await fetchWithFallback(
        async () => {
          const res = await api.getMentors();
          const transformed = (res.mentors || []).map(transformApiMentor);
          if (transformed.length === 0) {
            // API returned empty — treat as unavailable, use fallback
            return currentFallback;
          }
          return transformed;
        },
        currentFallback,
      );
      // Determine if we got real API data or fell back
      const gotApiData = data !== currentFallback && data.length > 0 && data[0]?.id !== currentFallback[0]?.id;
      setIsFromApi(gotApiData);
      setMentors(data);
      setError(null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fallbackRef.current = fallback;
    // Reset to fallback immediately when category changes so UI is responsive
    setMentors(fallback);
    fetchMentors(fallback);
  }, [fallback]);

  return { mentors, loading, error, isFromApi, refetch: () => fetchMentors(fallbackRef.current) };
}

export { MOCK_MENTORS };
