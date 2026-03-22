import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';

vi.mock('../components/api', () => ({
  getDrafts: vi.fn(),
  deleteDraft: vi.fn(),
}));

import * as api from '../components/api';
import { useDrafts } from './useDrafts';

const mockedGetDrafts = vi.mocked(api.getDrafts);
const mockedDeleteDraft = vi.mocked(api.deleteDraft);

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, 'warn').mockImplementation(() => {});
});

describe('useDrafts', () => {
  it('starts with loading true', () => {
    mockedGetDrafts.mockResolvedValue({ drafts: [] });
    const { result } = renderHook(() => useDrafts());
    expect(result.current.loading).toBe(true);
  });

  it('fetches drafts from API on mount', async () => {
    const apiDrafts = [
      { id: '99', university: 'SNU', major: 'CS', content: 'test', word_count: 100, version: 1, status: 'draft', created_at: '2025-01-01', updated_at: '2025-01-02' },
    ];
    mockedGetDrafts.mockResolvedValue({ drafts: apiDrafts });

    const { result } = renderHook(() => useDrafts());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.drafts).toEqual(apiDrafts);
  });

  it('falls back to mock data when API fails', async () => {
    mockedGetDrafts.mockRejectedValue(new Error('fail'));

    const { result } = renderHook(() => useDrafts());
    await waitFor(() => expect(result.current.loading).toBe(false));

    // Should have the 2 mock drafts
    expect(result.current.drafts.length).toBe(2);
    expect(result.current.drafts[0].university).toBe('연세대');
  });

  it('deleteDraft removes draft from local state', async () => {
    mockedGetDrafts.mockRejectedValue(new Error('fail'));
    mockedDeleteDraft.mockResolvedValue({ success: true });

    const { result } = renderHook(() => useDrafts());
    await waitFor(() => expect(result.current.loading).toBe(false));

    const initialCount = result.current.drafts.length;

    await act(async () => {
      await result.current.deleteDraft('1');
    });

    expect(mockedDeleteDraft).toHaveBeenCalledWith('1');
    expect(result.current.drafts.length).toBe(initialCount - 1);
    expect(result.current.drafts.find(d => d.id === '1')).toBeUndefined();
  });

  it('deleteDraft removes locally even if API fails', async () => {
    mockedGetDrafts.mockRejectedValue(new Error('fail'));
    mockedDeleteDraft.mockRejectedValue(new Error('delete fail'));

    const { result } = renderHook(() => useDrafts());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.deleteDraft('1');
    });

    expect(result.current.drafts.find(d => d.id === '1')).toBeUndefined();
  });

  it('refetch re-fetches drafts', async () => {
    mockedGetDrafts.mockResolvedValue({ drafts: [] });

    const { result } = renderHook(() => useDrafts());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.drafts).toEqual([]);

    const newDrafts = [{ id: '50', university: 'KU', major: 'Econ', content: 'x', word_count: 10, version: 1, status: 'draft', created_at: '2025-01-01', updated_at: '2025-01-01' }];
    mockedGetDrafts.mockResolvedValue({ drafts: newDrafts });

    await act(async () => {
      await result.current.refetch();
    });

    expect(result.current.drafts).toEqual(newDrafts);
  });
});
