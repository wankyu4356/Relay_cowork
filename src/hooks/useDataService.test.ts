import { describe, it, expect, vi } from 'vitest';
import { fetchWithFallback } from './useDataService';

describe('fetchWithFallback', () => {
  it('returns API data when the API call succeeds', async () => {
    const apiData = { id: 1, name: 'from-api' };
    const mockData = { id: 2, name: 'from-mock' };
    const apiFn = vi.fn().mockResolvedValue(apiData);

    const result = await fetchWithFallback(apiFn, mockData);

    expect(result).toEqual(apiData);
    expect(apiFn).toHaveBeenCalledOnce();
  });

  it('returns mock data when the API call fails', async () => {
    const mockData = { id: 2, name: 'from-mock' };
    const apiFn = vi.fn().mockRejectedValue(new Error('Network error'));
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const result = await fetchWithFallback(apiFn, mockData);

    expect(result).toEqual(mockData);
    expect(apiFn).toHaveBeenCalledOnce();
    expect(warnSpy).toHaveBeenCalledWith(
      'API unavailable, using mock data:',
      expect.any(Error),
    );
    warnSpy.mockRestore();
  });

  it('preserves generic type for arrays', async () => {
    const apiData = [1, 2, 3];
    const mockData = [4, 5, 6];
    const apiFn = vi.fn().mockResolvedValue(apiData);

    const result = await fetchWithFallback<number[]>(apiFn, mockData);

    expect(result).toEqual([1, 2, 3]);
  });

  it('returns mock data for any thrown value, not just Error instances', async () => {
    const mockData = 'fallback';
    const apiFn = vi.fn().mockRejectedValue('string error');
    vi.spyOn(console, 'warn').mockImplementation(() => {});

    const result = await fetchWithFallback(apiFn, mockData);

    expect(result).toBe('fallback');
  });
});
