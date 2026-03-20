import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../utils/supabase/info';

const SUPABASE_URL = `https://${projectId}.supabase.co`;
const API_BASE = `${SUPABASE_URL}/functions/v1/make-server-370ee075`;

// ============ EDGE FUNCTION STATUS ============

let edgeFunctionAvailable: boolean | null = null;

async function checkEdgeFunctionAvailability(): Promise<boolean> {
  if (edgeFunctionAvailable !== null) {
    return edgeFunctionAvailable;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    
    const res = await fetch(`${API_BASE}/health`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'apikey': publicAnonKey,
      },
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    edgeFunctionAvailable = res.ok;
  } catch (err) {
    console.warn('Edge Function not available. Using mock data mode.', err);
    edgeFunctionAvailable = false;
  }

  return edgeFunctionAvailable;
}

// ============ SUPABASE SINGLETON (survives HMR) ============

const _GK = '__relay_sb';

function getSupabaseClient(): ReturnType<typeof createClient> {
  if (!(globalThis as any)[_GK]) {
    console.log('Initializing Supabase client:', {
      url: SUPABASE_URL,
      hasAnonKey: !!publicAnonKey,
      anonKeyPrefix: publicAnonKey.substring(0, 20) + '...',
    });
    
    try {
      (globalThis as any)[_GK] = createClient(SUPABASE_URL, publicAnonKey, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false,
        },
      });
      console.log('Supabase client initialized successfully');
    } catch (err) {
      console.error('Failed to initialize Supabase client:', err);
      throw err;
    }
  }
  return (globalThis as any)[_GK];
}
export { getSupabaseClient as getSupabase };

// ============ TOKEN HELPERS ============

// Immediately-available token set right after signIn/signUp.
// Stored on globalThis so it survives HMR module re-evaluations.
function setImmediateToken(t: string | null) {
  (globalThis as any).__relay_tk = t;
}
function getImmediateToken(): string | null {
  return (globalThis as any).__relay_tk ?? null;
}

/**
 * Resolve the best available auth token.
 *  1. Immediate cache (set right after signIn / signUp)
 *  2. Supabase client session (handles refresh internally)
 *  3. publicAnonKey (for unauthenticated / public routes)
 */
async function resolveToken(): Promise<string> {
  const imm = getImmediateToken();
  if (imm) return imm;

  try {
    const sb = getSupabaseClient();
    const { data } = await sb.auth.getSession();
    if (data?.session?.access_token) {
      return data.session.access_token;
    }
  } catch {
    // session retrieval failed – fall through
  }

  return publicAnonKey;
}

/**
 * Force-refresh the session from Supabase and return the new access token
 * (or null if there is no valid session).
 */
async function forceRefreshToken(): Promise<string | null> {
  try {
    const sb = getSupabaseClient();
    // refreshSession() forces a new token exchange with the server
    const { data, error } = await sb.auth.refreshSession();
    if (!error && data?.session?.access_token) {
      setImmediateToken(data.session.access_token);
      return data.session.access_token;
    }
  } catch {
    // ignore
  }
  setImmediateToken(null);
  return null;
}

// ============ FETCH HELPERS ============

async function rawFetch(path: string, userToken: string | null, options: RequestInit = {}) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    // Always use anon key for the gateway — it validates Authorization before
    // the request reaches our Hono server.
    'Authorization': `Bearer ${publicAnonKey}`,
    'apikey': publicAnonKey,
  };

  // Pass user JWT in a custom header that the gateway ignores but our server reads.
  if (userToken && userToken !== publicAnonKey) {
    headers['x-user-token'] = userToken;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
    
    const response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    return response;
  } catch (err: any) {
    // Network error or timeout
    if (err.name === 'AbortError') {
      throw new Error('요청 시간이 초과되었습니다. Edge Function이 배포되었는지 확인해주세요.');
    }
    throw new Error('서버에 연결할 수 없습니다. Edge Function이 배포되었는지 확인해주세요.');
  }
}

async function parseResponse(res: Response) {
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) {
    return res.json();
  }
  const text = await res.text();
  return { error: text || `요청 실패 (${res.status})` };
}

/**
 * Authenticated fetch with **automatic 401 retry**.
 * If the gateway rejects the JWT (expired / invalid), we force-refresh
 * the session and retry exactly once.
 */
async function apiFetch(path: string, options: RequestInit = {}) {
  let token = await resolveToken();
  let res = await rawFetch(path, token, options);

  // Auto-retry on 401: force session refresh and try again
  if (res.status === 401) {
    const freshToken = await forceRefreshToken();
    if (freshToken) {
      token = freshToken;
      res = await rawFetch(path, token, options);
    }
  }

  const data = await parseResponse(res);
  if (!res.ok) {
    console.error(`API Error [${path}]:`, data);
    throw new Error(data.error || data.message || `요청 실패 (${res.status})`);
  }
  return data;
}

/**
 * Fetch that always uses the anon key (for public / unauthenticated routes
 * like /auth/signup).
 */
async function publicFetch(path: string, options: RequestInit = {}) {
  const res = await rawFetch(path, publicAnonKey, options);
  const data = await parseResponse(res);
  if (!res.ok) {
    console.error(`API Error [${path}]:`, data);
    throw new Error(data.error || data.message || `요청 실패 (${res.status})`);
  }
  return data;
}

/**
 * Fetch that uses a **specific** token (for the call right after signIn where
 * we already have the JWT in hand and don't want to rely on caches).
 */
async function tokenFetch(path: string, token: string, options: RequestInit = {}) {
  const res = await rawFetch(path, token, options);
  const data = await parseResponse(res);
  if (!res.ok) {
    console.error(`API Error [${path}]:`, data);
    throw new Error(data.error || data.message || `요청 실패 (${res.status})`);
  }
  return data;
}

// ============ AUTH ============

export async function signUp(
  email: string,
  password: string,
  name: string,
  role: string = 'mentee',
) {
  try {
    const sb = getSupabaseClient();
    
    console.log('Attempting signup with Supabase Auth...');
    
    // Create user with Supabase Auth (no Edge Function needed)
    const { data, error } = await sb.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role: role || 'mentee',
          onboarding_completed: false,
        },
      },
    });

    if (error) {
      console.error('Supabase Auth signup error:', error);
      throw new Error(`회원가입 실패: ${error.message}`);
    }
    
    if (!data.user) {
      throw new Error('회원가입 실패: 사용자 정보를 받지 못했습니다.');
    }
    
    console.log('Signup successful:', data.user.id);
    
    const accessToken = data.session?.access_token ?? null;
    setImmediateToken(accessToken);

    // Try to sync with Edge Function if available (non-blocking)
    try {
      await publicFetch('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ 
          email, 
          password, 
          name, 
          role,
          userId: data.user.id,
        }),
      });
      console.log('Edge Function sync successful');
    } catch (err) {
      console.warn('Edge Function sync failed (continuing anyway):', err);
    }

    return { 
      success: true, 
      userId: data.user.id, 
      role: role || 'mentee',
      session: data.session, 
      accessToken 
    };
  } catch (err: any) {
    console.error('SignUp error:', err);
    // Re-throw with more helpful message
    if (err.message?.includes('Failed to fetch')) {
      throw new Error('네트워크 연결을 확인해주세요. Supabase 프로젝트에 접근할 수 없습니다.');
    }
    throw err;
  }
}

export async function signIn(email: string, password: string) {
  try {
    const sb = getSupabaseClient();
    
    console.log('Attempting signin with Supabase Auth...');
    
    const { data, error } = await sb.auth.signInWithPassword({ email, password });
    
    if (error) {
      console.error('Supabase Auth signin error:', error);
      throw new Error(`로그인 실패: ${error.message}`);
    }
    
    if (!data.session) {
      throw new Error('로그인 실패: 세션을 받지 못했습니다.');
    }
    
    console.log('Signin successful:', data.user.id);

    const accessToken = data.session.access_token ?? null;
    setImmediateToken(accessToken);

    return { ...data, accessToken };
  } catch (err: any) {
    console.error('SignIn error:', err);
    // Re-throw with more helpful message
    if (err.message?.includes('Failed to fetch')) {
      throw new Error('네트워크 연결을 확인해주세요. Supabase 프로젝트에 접근할 수 없습니다.');
    }
    throw err;
  }
}

export async function signOut() {
  setImmediateToken(null);
  const sb = getSupabaseClient();
  await sb.auth.signOut();
}

export async function getSession() {
  const sb = getSupabaseClient();
  const { data } = await sb.auth.getSession();
  if (data?.session?.access_token) {
    setImmediateToken(data.session.access_token);
  }
  return data.session;
}

export function onAuthStateChange(callback: (session: any) => void) {
  const sb = getSupabaseClient();
  const { data: { subscription } } = sb.auth.onAuthStateChange((_event, session) => {
    setImmediateToken(session?.access_token ?? null);
    callback(session);
  });
  return subscription;
}

// ============ PROFILE ============

/**
 * Fetch profile.  Accepts an optional explicit token so that the
 * call immediately after signIn / signUp can bypass every cache.
 */
export async function getProfile(explicitToken?: string) {
  try {
    if (explicitToken) {
      return await tokenFetch('/profile', explicitToken);
    }
    return await apiFetch('/profile');
  } catch (err: any) {
    // If Edge Function is not available, construct profile from Supabase Auth
    console.warn('Edge Function profile fetch failed, using auth metadata:', err);
    
    const sb = getSupabaseClient();
    const { data } = await sb.auth.getSession();
    
    if (!data?.session?.user) {
      throw new Error('세션을 찾을 수 없습니다.');
    }
    
    const user = data.session.user;
    return {
      profile: {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || '사용자',
        role: user.user_metadata?.role || 'mentee',
        createdAt: user.created_at,
        onboardingCompleted: user.user_metadata?.onboarding_completed || false,
        profile: user.user_metadata?.profile || {},
      },
      credits: 5, // Default credits
    };
  }
}

export async function updateProfile(updates: Record<string, any>) {
  try {
    return await apiFetch('/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  } catch (err: any) {
    // If Edge Function is not available, update user metadata directly
    console.warn('Edge Function profile update failed, using auth metadata update:', err);
    
    const sb = getSupabaseClient();
    const { data, error } = await sb.auth.updateUser({
      data: {
        ...updates,
      },
    });
    
    if (error) throw new Error(`프로필 업데이트 실패: ${error.message}`);
    
    return {
      success: true,
      profile: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name || '사용자',
        role: data.user.user_metadata?.role || 'mentee',
        ...updates,
      },
    };
  }
}

// ============ CREDITS ============

export async function getCredits() {
  return apiFetch('/credits');
}

export async function useCredit(amount: number = 1) {
  return apiFetch('/credits/use', {
    method: 'POST',
    body: JSON.stringify({ amount }),
  });
}

export async function addCredits(amount: number) {
  return apiFetch('/credits/add', {
    method: 'POST',
    body: JSON.stringify({ amount }),
  });
}

// ============ DRAFTS ============

export async function getDrafts() {
  return apiFetch('/drafts');
}

export async function createDraft(data: {
  university: string;
  major: string;
  content: string;
  storyline?: any;
  aiData?: any;
}) {
  return apiFetch('/drafts', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateDraft(id: string, updates: Record<string, any>) {
  return apiFetch(`/drafts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
}

export async function deleteDraft(id: string) {
  return apiFetch(`/drafts/${id}`, { method: 'DELETE' });
}

// ============ SESSIONS ============

export async function getSessions() {
  return apiFetch('/sessions');
}

export async function bookSession(data: {
  mentorId: string;
  mentorName: string;
  mentorAvatar?: string;
  date: string;
  time: string;
  duration?: number;
  price?: number;
  topic?: string;
}) {
  return apiFetch('/sessions', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateSession(id: string, updates: Record<string, any>) {
  return apiFetch(`/sessions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
}

// ============ REVIEWS ============

export async function submitReview(data: {
  mentorId: string;
  sessionId?: string;
  rating: number;
  content: string;
  tags?: string[];
}) {
  return apiFetch('/reviews', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getMentorReviews(mentorId: string) {
  return apiFetch(`/reviews/${mentorId}`);
}

// ============ MENTORS ============

export async function getMentors() {
  return apiFetch('/mentors');
}

export async function registerAsMentor(data: {
  university: string;
  major: string;
  year: string;
  name?: string;
  price?: number;
  responseTime?: string;
  expertise?: string[];
  bio?: string;
  avatar?: string;
}) {
  return apiFetch('/mentors/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ============ NOTIFICATIONS ============

export async function getNotifications() {
  return apiFetch('/notifications');
}

export async function markNotificationRead(id: string) {
  return apiFetch(`/notifications/${id}/read`, { method: 'PUT' });
}

// ============ MESSAGES ============

export async function getConversations() {
  return apiFetch('/conversations');
}

export async function getMessages(conversationId: string) {
  return apiFetch(`/messages/${conversationId}`);
}

export async function sendMessage(
  recipientId: string,
  content: string,
  conversationId?: string,
) {
  return apiFetch('/messages', {
    method: 'POST',
    body: JSON.stringify({ recipientId, content, conversationId }),
  });
}

// ============ DISPUTES ============

export async function createDispute(data: {
  targetId: string;
  sessionId?: string;
  reason: string;
  description?: string;
}) {
  return apiFetch('/disputes', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getDisputes() {
  return apiFetch('/admin/disputes');
}

export async function updateDispute(id: string, updates: { status?: string; resolution?: string }) {
  return apiFetch(`/admin/disputes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
}

// ============ MENTOR SCHEDULE ============

export async function getMentorSchedule(mentorId: string) {
  return apiFetch(`/mentors/${mentorId}/schedule`);
}

export async function updateMentorSchedule(schedules: Array<{
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  available?: boolean;
}>) {
  return apiFetch('/mentors/schedule', {
    method: 'PUT',
    body: JSON.stringify({ schedules }),
  });
}

// ============ OUTCOMES ============

export async function createOutcome(data: {
  mentorId?: string;
  result: string;
  detail?: string;
  purpose?: string;
}) {
  return apiFetch('/outcomes', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getOutcomes() {
  return apiFetch('/outcomes');
}

// ============ ADMIN ============

export async function getPendingMentors() {
  return apiFetch('/admin/mentors/pending');
}

export async function verifyMentor(mentorId: string, verified: boolean = true) {
  return apiFetch(`/mentors/${mentorId}/verify`, {
    method: 'PUT',
    body: JSON.stringify({ verified }),
  });
}

export async function getAdminStats() {
  return apiFetch('/admin/stats');
}

// ============ MENTOR REVENUE ============

export async function getMentorRevenue() {
  return apiFetch('/mentors/revenue');
}

export async function requestWithdraw() {
  return apiFetch('/mentors/revenue/withdraw', { method: 'POST' });
}

// ============ RELAY CHAIN ============

export async function getRelayChain() {
  return apiFetch('/relay-chain');
}

// ============ MENTORS (with category filter) ============

export async function getMentorsByCategory(category: string) {
  return apiFetch(`/mentors?category=${encodeURIComponent(category)}`);
}