import { useState, useEffect } from 'react';
import * as api from '../components/api';
import { fetchWithFallback } from './useDataService';

export interface Draft {
  id: string;
  university: string;
  major: string;
  content: string;
  storyline?: any;
  ai_data?: any;
  word_count: number;
  version: number;
  status: string;
  created_at: string;
  updated_at: string;
}

const MOCK_DRAFTS: Draft[] = [
  {
    id: '1',
    university: '연세대',
    major: '경영학과',
    content: '저는 경영학을 통해 사회적 가치를 창출하고자 합니다...',
    word_count: 850,
    version: 3,
    status: 'draft',
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '2',
    university: '고려대',
    major: '경제학과',
    content: '경제학적 사고를 바탕으로 글로벌 이슈를 해결하고자...',
    word_count: 720,
    version: 1,
    status: 'draft',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
  },
];

export function useDrafts() {
  const [drafts, setDrafts] = useState<Draft[]>(MOCK_DRAFTS);
  const [loading, setLoading] = useState(true);

  const fetchDrafts = async () => {
    setLoading(true);
    try {
      const data = await fetchWithFallback(
        async () => {
          const res = await api.getDrafts();
          return res.drafts || [];
        },
        MOCK_DRAFTS,
      );
      setDrafts(data);
    } catch { /* ignore */ } finally { setLoading(false); }
  };

  const deleteDraft = async (id: string) => {
    try { await api.deleteDraft(id); } catch { /* ignore */ }
    setDrafts(prev => prev.filter(d => d.id !== id));
  };

  useEffect(() => { fetchDrafts(); }, []);

  return { drafts, loading, deleteDraft, refetch: fetchDrafts };
}
