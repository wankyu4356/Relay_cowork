import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';

vi.mock('../components/api', () => ({
  getNotifications: vi.fn(),
  markNotificationRead: vi.fn(),
}));

import * as api from '../components/api';
import { useNotifications } from './useNotifications';

const mockedGetNotifications = vi.mocked(api.getNotifications);
const mockedMarkNotificationRead = vi.mocked(api.markNotificationRead);

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, 'warn').mockImplementation(() => {});
});

describe('useNotifications', () => {
  it('starts with empty notifications and loading true', () => {
    mockedGetNotifications.mockResolvedValue({ notifications: [] });
    const { result } = renderHook(() => useNotifications());

    expect(result.current.notifications).toEqual([]);
    expect(result.current.loading).toBe(true);
    expect(result.current.unreadCount).toBe(0);
  });

  it('fetches notifications from API on mount', async () => {
    const apiNotifications = [
      { id: 'n1', title: 'Test', message: 'Hello', type: 'info', read: false, created_at: '2025-01-01' },
      { id: 'n2', title: 'Test2', message: 'World', type: 'info', read: true, created_at: '2025-01-02' },
    ];
    mockedGetNotifications.mockResolvedValue({ notifications: apiNotifications });

    const { result } = renderHook(() => useNotifications());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.notifications).toEqual(apiNotifications);
    expect(result.current.unreadCount).toBe(1);
  });

  it('falls back to mock data when API fails', async () => {
    mockedGetNotifications.mockRejectedValue(new Error('fail'));

    const { result } = renderHook(() => useNotifications());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.notifications.length).toBe(3);
    // Mock data has 2 unread
    expect(result.current.unreadCount).toBe(2);
  });

  it('markAsRead updates local state and calls API', async () => {
    const notifications = [
      { id: 'n1', title: 'A', message: 'B', type: 'info', read: false, created_at: '2025-01-01' },
    ];
    mockedGetNotifications.mockResolvedValue({ notifications });
    mockedMarkNotificationRead.mockResolvedValue({ success: true });

    const { result } = renderHook(() => useNotifications());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.unreadCount).toBe(1);

    await act(async () => {
      await result.current.markAsRead('n1');
    });

    expect(mockedMarkNotificationRead).toHaveBeenCalledWith('n1');
    expect(result.current.notifications[0].read).toBe(true);
    expect(result.current.unreadCount).toBe(0);
  });

  it('markAsRead updates locally even if API fails', async () => {
    mockedGetNotifications.mockRejectedValue(new Error('fail'));
    mockedMarkNotificationRead.mockRejectedValue(new Error('mark fail'));

    const { result } = renderHook(() => useNotifications());
    await waitFor(() => expect(result.current.loading).toBe(false));

    const unreadBefore = result.current.unreadCount;

    await act(async () => {
      await result.current.markAsRead('1');
    });

    expect(result.current.unreadCount).toBe(unreadBefore - 1);
    expect(result.current.notifications.find(n => n.id === '1')?.read).toBe(true);
  });
});
