import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';

vi.mock('../components/api', () => ({
  getSessions: vi.fn(),
  updateSession: vi.fn(),
}));

import * as api from '../components/api';
import { useSessions, MOCK_SESSIONS } from './useSessions';

const mockedGetSessions = vi.mocked(api.getSessions);
const mockedUpdateSession = vi.mocked(api.updateSession);

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, 'warn').mockImplementation(() => {});
});

describe('useSessions', () => {
  it('initializes with mock sessions and loading true', () => {
    mockedGetSessions.mockResolvedValue({ sessions: [] });
    const { result } = renderHook(() => useSessions());

    expect(result.current.sessions).toEqual(MOCK_SESSIONS);
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('fetches and transforms API sessions on mount', async () => {
    const apiSessions = [
      {
        id: '10',
        mentor_id: 'm1',
        mentor_name: 'Test Mentor',
        mentor_avatar: '🧑',
        date: '2025.03.01',
        time: '10:00',
        duration: 90,
        price: 50000,
        status: 'upcoming',
      },
    ];
    mockedGetSessions.mockResolvedValue({ sessions: apiSessions });

    const { result } = renderHook(() => useSessions());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.sessions).toEqual([
      {
        id: '10',
        mentorId: 'm1',
        mentorName: 'Test Mentor',
        mentorAvatar: '🧑',
        date: '2025.03.01',
        time: '10:00',
        duration: 90,
        price: 50000,
        status: 'upcoming',
      },
    ]);
    expect(result.current.error).toBeNull();
  });

  it('falls back to mock data when API fails', async () => {
    mockedGetSessions.mockRejectedValue(new Error('fail'));

    const { result } = renderHook(() => useSessions());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.sessions).toEqual(MOCK_SESSIONS);
  });

  it('cancelSession updates local state and calls API', async () => {
    mockedGetSessions.mockResolvedValue({ sessions: [] });
    mockedUpdateSession.mockResolvedValue({ success: true });

    const { result } = renderHook(() => useSessions());
    await waitFor(() => expect(result.current.loading).toBe(false));

    // Set sessions to mock so we have something to cancel
    mockedGetSessions.mockRejectedValue(new Error('fail'));
    await act(async () => {
      await result.current.refetch();
    });

    await act(async () => {
      await result.current.cancelSession('1');
    });

    expect(mockedUpdateSession).toHaveBeenCalledWith('1', { status: 'cancelled' });
    const cancelled = result.current.sessions.find(s => s.id === '1');
    expect(cancelled?.status).toBe('cancelled');
  });

  it('cancelSession updates locally even if API call fails', async () => {
    mockedGetSessions.mockRejectedValue(new Error('fail'));
    mockedUpdateSession.mockRejectedValue(new Error('update fail'));

    const { result } = renderHook(() => useSessions());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.cancelSession('1');
    });

    const cancelled = result.current.sessions.find(s => s.id === '1');
    expect(cancelled?.status).toBe('cancelled');
  });
});
