import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';

vi.mock('../components/api', () => ({
  getMentors: vi.fn(),
}));

import * as api from '../components/api';
import { useMentors, MOCK_MENTORS } from './useMentors';

const mockedGetMentors = vi.mocked(api.getMentors);

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, 'warn').mockImplementation(() => {});
});

describe('useMentors', () => {
  it('initializes with default mock mentors and loading true', () => {
    mockedGetMentors.mockResolvedValue({ mentors: [] });
    const { result } = renderHook(() => useMentors());

    expect(result.current.mentors).toEqual(MOCK_MENTORS);
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.isFromApi).toBe(false);
  });

  it('uses provided fallback mentors instead of defaults', () => {
    mockedGetMentors.mockResolvedValue({ mentors: [] });
    const customFallback = [{ ...MOCK_MENTORS[0], id: 'custom-1', name: 'Custom' }];

    const { result } = renderHook(() => useMentors(customFallback));

    expect(result.current.mentors).toEqual(customFallback);
  });

  it('fetches and transforms API mentors on mount', async () => {
    const apiMentors = [
      {
        id: 'api-1',
        name: 'API Mentor',
        university: 'MIT',
        major: 'CS',
        year: '2023',
        rating: 5.0,
        review_count: 50,
        session_count: 100,
        success_rate: 95,
        response_time: '30min',
        price: 90000,
        badge: 'gold',
        verified: true,
        avatar: '🎓',
      },
    ];
    mockedGetMentors.mockResolvedValue({ mentors: apiMentors });

    const { result } = renderHook(() => useMentors());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.mentors).toEqual([
      {
        id: 'api-1',
        name: 'API Mentor',
        university: 'MIT',
        major: 'CS',
        year: '2023',
        rating: 5.0,
        reviews: 50,
        sessions: 100,
        successRate: 95,
        responseTime: '30min',
        price: 90000,
        badge: 'gold',
        verified: true,
        avatar: '🎓',
      },
    ]);
    expect(result.current.error).toBeNull();
  });

  it('falls back to mock data when API fails', async () => {
    mockedGetMentors.mockRejectedValue(new Error('fail'));

    const { result } = renderHook(() => useMentors());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.mentors).toEqual(MOCK_MENTORS);
    expect(result.current.isFromApi).toBe(false);
  });

  it('falls back when API returns empty mentors array', async () => {
    mockedGetMentors.mockResolvedValue({ mentors: [] });

    const { result } = renderHook(() => useMentors());
    await waitFor(() => expect(result.current.loading).toBe(false));

    // Empty API result should fall back
    expect(result.current.mentors).toEqual(MOCK_MENTORS);
    expect(result.current.isFromApi).toBe(false);
  });

  it('refetch re-fetches mentors', async () => {
    mockedGetMentors.mockRejectedValue(new Error('fail'));

    const { result } = renderHook(() => useMentors());
    await waitFor(() => expect(result.current.loading).toBe(false));

    const apiMentors = [
      { id: 'new-1', name: 'New', university: 'X', major: 'Y', year: '24', rating: 4, review_count: 1, session_count: 1, success_rate: 80, response_time: '1h', price: 50000, badge: 'bronze', verified: false, avatar: '👤' },
    ];
    mockedGetMentors.mockResolvedValue({ mentors: apiMentors });

    await act(async () => {
      await result.current.refetch();
    });

    expect(result.current.mentors[0].id).toBe('new-1');
  });

  it('applies default values for missing API fields', async () => {
    mockedGetMentors.mockResolvedValue({
      mentors: [{ id: 'sparse' }],
    });

    const { result } = renderHook(() => useMentors());
    await waitFor(() => expect(result.current.loading).toBe(false));

    const mentor = result.current.mentors[0];
    expect(mentor.name).toBe('멘토');
    expect(mentor.university).toBe('');
    expect(mentor.rating).toBe(0);
    expect(mentor.price).toBe(30000);
    expect(mentor.badge).toBe('bronze');
    expect(mentor.verified).toBe(false);
    expect(mentor.avatar).toBe('👨‍🎓');
  });
});
