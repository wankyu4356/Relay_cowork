// Helper to call API with fallback to mock data
export async function fetchWithFallback<T>(apiFn: () => Promise<T>, mockData: T): Promise<T> {
  try {
    return await apiFn();
  } catch (e) {
    console.warn('API unavailable, using mock data:', e);
    return mockData;
  }
}
