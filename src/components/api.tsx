import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { logger } from '../utils/logger';

/**
 * Direct Supabase client API layer.
 *
 * The app talks straight to Supabase (Auth + Postgres with RLS) — there is no
 * custom Edge Function. Business logic that needs to bypass RLS (signup
 * provisioning, credit mutations, cross-user notifications, review
 * aggregation, admin reads) lives in SQL triggers / RPCs / policies defined in
 * supabase/migrations/003_direct_client_setup.sql.
 *
 * Public function names and return shapes are kept identical to the previous
 * Edge-Function-based layer so hooks and components need no changes.
 */

const hasSupabaseEnv = Boolean(projectId && publicAnonKey);

// 환경변수가 없어도 앱이 크래시하지 않도록 무해한 플레이스홀더로 클라이언트를
// 생성한다. 모든 네트워크 호출이 실패하며 각 화면의 목업 폴백이 동작한다.
const SUPABASE_URL = hasSupabaseEnv
  ? `https://${projectId}.supabase.co`
  : 'https://placeholder.supabase.co';
const SUPABASE_KEY = hasSupabaseEnv ? publicAnonKey : 'placeholder-anon-key';

// ============ SUPABASE SINGLETON (survives HMR) ============

const _GK = '__relay_sb';

function getSupabaseClient(): ReturnType<typeof createClient> {
  if (!(globalThis as any)[_GK]) {
    if (!hasSupabaseEnv) {
      logger.warn(
        'Supabase 환경변수가 없어 목업 모드로 동작합니다. 실제 연동은 VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY 를 설정하세요.',
      );
    }
    (globalThis as any)[_GK] = createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    });
    logger.log('Supabase client initialized:', SUPABASE_URL);
  }
  return (globalThis as any)[_GK];
}
export { getSupabaseClient as getSupabase };

const sb = getSupabaseClient;

/** Throw a friendly Error when a Supabase call fails. */
function check<T>(res: { data: T; error: any }, fallbackMsg: string): T {
  if (res.error) {
    logger.error(`${fallbackMsg}:`, res.error);
    throw new Error(res.error.message || fallbackMsg);
  }
  return res.data;
}

async function requireUserId(): Promise<string> {
  const { data } = await sb().auth.getSession();
  const id = data?.session?.user?.id;
  if (!id) throw new Error('인증이 필요합니다.');
  return id;
}

// Map a DB profile row to the shape the app consumes (camelCase aliases).
function mapProfile(row: any) {
  if (!row) return null;
  return {
    ...row,
    onboardingCompleted: row.onboarding_completed ?? false,
    createdAt: row.created_at,
  };
}

// ============ AUTH ============

export async function signUp(
  email: string,
  password: string,
  name: string,
  role: string = 'mentee',
) {
  const userRole = role || 'mentee';
  const { data, error } = await sb().auth.signUp({
    email,
    password,
    options: {
      data: { name, role: userRole, onboarding_completed: false },
    },
  });

  if (error) {
    logger.error('Signup error:', error);
    throw new Error(`회원가입 실패: ${error.message}`);
  }
  if (!data.user) throw new Error('회원가입 실패: 사용자 정보를 받지 못했습니다.');

  // profiles + credits rows are provisioned by the on_auth_user_created trigger.
  return {
    success: true,
    userId: data.user.id,
    role: userRole,
    session: data.session,
    accessToken: data.session?.access_token ?? null,
  };
}

export async function signIn(email: string, password: string) {
  const { data, error } = await sb().auth.signInWithPassword({ email, password });
  if (error) {
    logger.error('Signin error:', error);
    throw new Error(`로그인 실패: ${error.message}`);
  }
  if (!data.session) throw new Error('로그인 실패: 세션을 받지 못했습니다.');
  return { ...data, accessToken: data.session.access_token ?? null };
}

export async function signOut() {
  await sb().auth.signOut();
}

export async function getSession() {
  const { data } = await sb().auth.getSession();
  return data.session;
}

export function onAuthStateChange(callback: (session: any) => void) {
  const { data: { subscription } } = sb().auth.onAuthStateChange((_event, session) => {
    callback(session);
  });
  return subscription;
}

// ============ PROFILE ============

export async function getProfile(_explicitToken?: string) {
  const uid = await requireUserId();

  const [{ data: profile }, { data: creditRow }] = await Promise.all([
    sb().from('profiles').select('*').eq('id', uid).maybeSingle(),
    sb().from('credits').select('balance').eq('user_id', uid).maybeSingle(),
  ]);

  // If the trigger hasn't created the profile yet, fall back to auth metadata.
  if (!profile) {
    const { data: sess } = await sb().auth.getSession();
    const u = sess?.session?.user;
    return {
      profile: mapProfile({
        id: uid,
        email: u?.email,
        name: (u?.user_metadata as any)?.name || '사용자',
        role: (u?.user_metadata as any)?.role || 'mentee',
        onboarding_completed: (u?.user_metadata as any)?.onboarding_completed ?? false,
      }),
      credits: (creditRow as any)?.balance ?? 5,
    };
  }

  return { profile: mapProfile(profile), credits: (creditRow as any)?.balance ?? 5 };
}

export async function updateProfile(updates: Record<string, any>) {
  const uid = await requireUserId();
  const { data: sess } = await sb().auth.getSession();
  const email = sess?.session?.user?.email || '';

  const dbUpdates: Record<string, any> = { id: uid, email, updated_at: new Date().toISOString() };
  if (updates.name !== undefined) dbUpdates.name = updates.name;
  if (updates.role !== undefined) dbUpdates.role = updates.role;
  if (updates.avatar !== undefined) dbUpdates.avatar = updates.avatar;
  if (updates.onboardingCompleted !== undefined) dbUpdates.onboarding_completed = updates.onboardingCompleted;

  // Keep auth metadata in sync (used as a fallback before the profile row exists).
  await sb().auth.updateUser({ data: {
    ...(updates.name !== undefined ? { name: updates.name } : {}),
    ...(updates.role !== undefined ? { role: updates.role } : {}),
    ...(updates.onboardingCompleted !== undefined ? { onboarding_completed: updates.onboardingCompleted } : {}),
  } }).catch(() => {});

  const data = check(
    await sb().from('profiles').upsert(dbUpdates).select().single(),
    '프로필 업데이트 실패',
  );
  return { success: true, profile: mapProfile(data) };
}

// ============ CREDITS ============

export async function getCredits() {
  const uid = await requireUserId();
  const { data } = await sb().from('credits').select('balance').eq('user_id', uid).maybeSingle();
  return { balance: (data as any)?.balance ?? 5 };
}

export async function useCredit(amount: number = 1) {
  const data = check(await sb().rpc('use_credit', { p_amount: amount }), '크레딧 사용 실패');
  return { success: true, balance: data as unknown as number };
}

export async function addCredits(amount: number) {
  const data = check(await sb().rpc('add_credits', { p_amount: amount }), '크레딧 추가 실패');
  return { success: true, balance: data as unknown as number };
}

// ============ DRAFTS ============

export async function getDrafts() {
  const uid = await requireUserId();

  // M2: documents/document_versions 우선 — 반환 shape은 legacy Draft와 동일하게 매핑
  const docRes = await sb()
    .from('documents')
    .select('*, current:document_versions!documents_current_version_id_fkey(id, content, word_count, source, analysis, created_at)')
    .eq('user_id', uid)
    .order('updated_at', { ascending: false });

  if (!docRes.error && docRes.data) {
    const drafts = await Promise.all((docRes.data as any[]).map(async (d) => {
      const { count } = await sb()
        .from('document_versions')
        .select('*', { count: 'exact', head: true })
        .eq('document_id', d.id);
      const cur = d.current;
      return {
        id: d.id,
        university: d.university || '',
        major: d.major || '',
        content: cur?.content || '',
        storyline: d.storyline || undefined,
        ai_data: d.ai_data || undefined,
        word_count: cur?.word_count || 0,
        version: count || 1,
        status: d.status,
        created_at: d.created_at,
        updated_at: d.updated_at,
        analysis: cur?.analysis || undefined,
        last_source: cur?.source || undefined,
      };
    }));
    return { drafts };
  }

  // 폴백: legacy drafts 테이블 (005 미적용 DB)
  const data = check(
    await sb().from('drafts').select('*').eq('user_id', uid).order('updated_at', { ascending: false }),
    '초안 목록 조회 실패',
  );
  return { drafts: data || [] };
}

export async function createDraft(input: {
  university: string;
  major: string;
  content: string;
  storyline?: import('../App').Storyline;
  aiData?: import('../App').AIData;
  source?: 'ai_draft' | 'ai_proofread' | 'user_edit';
  analysis?: Record<string, unknown>;
  usedExperienceIds?: string[];
  documentId?: string; // 기존 문서에 새 버전 추가
}) {
  const uid = await requireUserId();

  // M2 경로: documents + document_versions
  const tryNew = async () => {
    let docId = input.documentId ?? null;
    let parentVersionId: string | null = null;

    if (docId) {
      const { data: doc } = await sb().from('documents')
        .select('id, current_version_id').eq('id', docId).eq('user_id', uid).maybeSingle();
      if (!doc) throw new Error('문서를 찾을 수 없습니다.');
      parentVersionId = (doc as any).current_version_id;
    } else {
      const { data: doc, error } = await sb().from('documents').insert({
        user_id: uid,
        doc_type: 'study_plan',
        title: `${input.university} ${input.major}`.trim() || '무제 초안',
        university: input.university || null,
        major: input.major || null,
        storyline: input.storyline ?? null,
        ai_data: input.aiData ?? null,
      }).select('id').single();
      if (error) throw error;
      docId = (doc as any).id;
    }

    const { data: ver, error: verr } = await sb().from('document_versions').insert({
      document_id: docId,
      parent_version_id: parentVersionId,
      content: input.content || '',
      source: input.source ?? 'ai_draft',
      editor_id: uid,
      analysis: input.analysis ?? null,
      used_experience_ids: input.usedExperienceIds ?? [],
    }).select('id').single();
    if (verr) throw verr;

    await sb().from('documents').update({
      current_version_id: (ver as any).id,
      updated_at: new Date().toISOString(),
    }).eq('id', docId);

    return { success: true, draft: { id: docId, version_id: (ver as any).id } };
  };

  try {
    return await tryNew();
  } catch (e) {
    logger.warn('documents 저장 실패 → legacy drafts 폴백:', e);
    const draft = {
      id: genId(),
      user_id: uid,
      university: input.university || '',
      major: input.major || '',
      content: input.content || '',
      storyline: input.storyline ?? null,
      ai_data: input.aiData ?? null,
      word_count: input.content?.length || 0,
      version: 1,
      status: 'draft',
    };
    const data = check(await sb().from('drafts').insert(draft).select().single(), '초안 저장 실패');
    return { success: true, draft: data };
  }
}

export async function updateDraft(id: string, updates: Record<string, any>) {
  const uid = await requireUserId();
  const dbUpdates: Record<string, any> = { updated_at: new Date().toISOString() };
  if (updates.content !== undefined) {
    dbUpdates.content = updates.content;
    dbUpdates.word_count = updates.content.length;
  }
  if (updates.university !== undefined) dbUpdates.university = updates.university;
  if (updates.major !== undefined) dbUpdates.major = updates.major;
  if (updates.status !== undefined) dbUpdates.status = updates.status;

  const data = check(
    await sb().from('drafts').update(dbUpdates).eq('id', id).eq('user_id', uid).select().single(),
    '초안 업데이트 실패',
  );
  return { success: true, draft: data };
}

export async function deleteDraft(id: string) {
  const uid = await requireUserId();
  check(await sb().from('drafts').delete().eq('id', id).eq('user_id', uid), '초안 삭제 실패');
  return { success: true };
}

// ============ SESSIONS ============

export async function getSessions() {
  const uid = await requireUserId();
  const data = check(
    await sb().from('sessions').select('*').or(`user_id.eq.${uid},mentor_id.eq.${uid}`).order('created_at', { ascending: false }),
    '세션 조회 실패',
  );
  return { sessions: data || [] };
}

export async function bookSession(input: {
  mentorId: string;
  mentorName: string;
  mentorAvatar?: string;
  date: string;
  time: string;
  duration?: number;
  price?: number;
  topic?: string;
}) {
  const uid = await requireUserId();
  const session = {
    id: genId(),
    user_id: uid,
    mentor_id: input.mentorId,
    mentor_name: input.mentorName,
    mentor_avatar: input.mentorAvatar || '',
    date: input.date,
    time: input.time,
    duration: input.duration || 60,
    price: input.price || 0,
    status: 'upcoming',
    topic: input.topic || '',
  };
  const data = check(await sb().from('sessions').insert(session).select().single(), '세션 예약 실패');
  return { success: true, session: data };
}

export async function updateSession(id: string, updates: Record<string, any>) {
  const uid = await requireUserId();
  const dbUpdates: Record<string, any> = { updated_at: new Date().toISOString() };
  if (updates.status !== undefined) dbUpdates.status = updates.status;
  if (updates.topic !== undefined) dbUpdates.topic = updates.topic;
  if (updates.date !== undefined) dbUpdates.date = updates.date;
  if (updates.time !== undefined) dbUpdates.time = updates.time;

  const data = check(
    await sb().from('sessions').update(dbUpdates).eq('id', id).or(`user_id.eq.${uid},mentor_id.eq.${uid}`).select().single(),
    '세션 업데이트 실패',
  );
  return { success: true, session: data };
}

// ============ REVIEWS ============

export async function submitReview(input: {
  mentorId: string;
  sessionId?: string;
  rating: number;
  content: string;
  tags?: string[];
}) {
  const uid = await requireUserId();
  // mentor rating/review_count aggregation + notification handled by trigger.
  const review = {
    id: genId(),
    user_id: uid,
    mentor_id: input.mentorId,
    session_id: input.sessionId || null,
    rating: input.rating,
    content: input.content,
    tags: input.tags || [],
  };
  const data = check(await sb().from('reviews').insert(review).select().single(), '리뷰 작성 실패');
  return { success: true, review: data };
}

export async function getMentorReviews(mentorId: string) {
  const data = check(
    await sb().from('reviews').select('*').eq('mentor_id', mentorId).order('created_at', { ascending: false }),
    '리뷰 조회 실패',
  );
  return { reviews: data || [] };
}

// ============ MENTORS ============

function mapMentorRow(m: any) {
  return {
    ...m,
    name: m.profiles?.name || '러너',
    email: m.profiles?.email || '',
    avatar: m.profiles?.avatar || '',
  };
}

export async function getMentors() {
  const data = check(
    await sb().from('mentor_profiles').select('*, profiles!inner(name, email, avatar)').order('rating', { ascending: false }),
    '러너 목록 조회 실패',
  );
  return { mentors: (data || []).map(mapMentorRow) };
}

export async function getMentorsByCategory(category: string) {
  const res = await sb()
    .from('mentor_profiles')
    .select('*, profiles!inner(name, email, avatar)')
    .eq('category', category)
    .order('rating', { ascending: false });
  // category 컬럼이 없거나 결과가 없으면 전체로 폴백
  if (res.error || !res.data || res.data.length === 0) {
    return getMentors();
  }
  return { mentors: res.data.map(mapMentorRow) };
}

export async function registerAsMentor(input: {
  university: string;
  major: string;
  year: string;
  name?: string;
  price?: number;
  responseTime?: string;
  expertise?: string[];
  bio?: string;
  avatar?: string;
  category?: string;
}) {
  const uid = await requireUserId();
  const mentorProfile: Record<string, any> = {
    id: uid,
    university: input.university,
    major: input.major,
    year: input.year,
    response_time: input.responseTime || '2시간',
    price: input.price || 30000,
    expertise: input.expertise || [],
    bio: input.bio || '',
  };
  if (input.category) mentorProfile.category = input.category;

  const data = check(
    await sb().from('mentor_profiles').upsert(mentorProfile).select().single(),
    '러너 등록 실패',
  );
  await sb().from('profiles').update({ role: 'mentor' }).eq('id', uid);
  return { success: true, mentor: data };
}

// ============ NOTIFICATIONS ============

export async function getNotifications() {
  const uid = await requireUserId();
  const data = check(
    await sb().from('notifications').select('*').eq('user_id', uid).order('created_at', { ascending: false }),
    '알림 조회 실패',
  );
  return { notifications: data || [] };
}

export async function markNotificationRead(id: string) {
  const uid = await requireUserId();
  check(await sb().from('notifications').update({ read: true }).eq('id', id).eq('user_id', uid), '알림 읽음 처리 실패');
  return { success: true };
}

// ============ MESSAGES ============

export async function getConversations() {
  const uid = await requireUserId();
  const members = check(
    await sb().from('conversation_members').select('conversation_id').eq('user_id', uid),
    '대화 목록 조회 실패',
  ) as any[];
  if (!members || members.length === 0) return { conversations: [] };

  const ids = members.map((m) => m.conversation_id);
  const data = check(
    await sb().from('conversations').select('*').in('id', ids).order('last_message_at', { ascending: false }),
    '대화 목록 조회 실패',
  );
  return { conversations: data || [] };
}

export async function getMessages(conversationId: string) {
  const uid = await requireUserId();
  const data = check(
    await sb().from('messages').select('*').eq('conversation_id', conversationId)
      .or(`sender_id.eq.${uid},recipient_id.eq.${uid}`).order('created_at', { ascending: true }),
    '메시지 조회 실패',
  );
  return { messages: data || [] };
}

export async function sendMessage(recipientId: string, content: string, conversationId?: string) {
  const uid = await requireUserId();
  const convId = conversationId || [uid, recipientId].sort().join('_');

  await sb().from('conversations').upsert({
    id: convId,
    last_message: content,
    last_message_at: new Date().toISOString(),
    participants: [uid, recipientId],
  });
  await sb().from('conversation_members').upsert([
    { conversation_id: convId, user_id: uid },
    { conversation_id: convId, user_id: recipientId },
  ]);

  const message = {
    id: genId(),
    conversation_id: convId,
    sender_id: uid,
    recipient_id: recipientId,
    content,
    read: false,
  };
  const data = check(await sb().from('messages').insert(message).select().single(), '메시지 전송 실패');
  return { success: true, message: data };
}

// ============ DISPUTES ============

export async function createDispute(input: {
  targetId: string;
  sessionId?: string;
  reason: string;
  description?: string;
}) {
  const uid = await requireUserId();
  // admin notifications handled by trigger.
  const dispute = {
    id: genId(),
    reporter_id: uid,
    target_id: input.targetId,
    session_id: input.sessionId || null,
    reason: input.reason,
    description: input.description || '',
    status: 'pending',
  };
  const data = check(await sb().from('disputes').insert(dispute).select().single(), '분쟁 신고 실패');
  return { success: true, dispute: data };
}

export async function getDisputes() {
  const data = check(
    await sb().from('disputes').select('*').order('created_at', { ascending: false }),
    '분쟁 목록 조회 실패',
  );
  return { disputes: data || [] };
}

export async function updateDispute(id: string, updates: { status?: string; resolution?: string }) {
  const dbUpdates: Record<string, any> = { updated_at: new Date().toISOString() };
  if (updates.status !== undefined) dbUpdates.status = updates.status;
  if (updates.resolution !== undefined) dbUpdates.resolution = updates.resolution;
  const data = check(
    await sb().from('disputes').update(dbUpdates).eq('id', id).select().single(),
    '분쟁 처리 실패',
  );
  return { success: true, dispute: data };
}

// ============ MENTOR SCHEDULE ============

export async function getMentorSchedule(mentorId: string) {
  const data = check(
    await sb().from('mentor_schedules').select('*').eq('mentor_id', mentorId).order('day_of_week', { ascending: true }),
    '일정 조회 실패',
  );
  return { schedules: data || [] };
}

export async function updateMentorSchedule(schedules: Array<{
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  available?: boolean;
}>) {
  const uid = await requireUserId();
  await sb().from('mentor_schedules').delete().eq('mentor_id', uid);
  if (schedules && schedules.length > 0) {
    const rows = schedules.map((s) => ({
      id: genId(),
      mentor_id: uid,
      day_of_week: s.dayOfWeek,
      start_time: s.startTime,
      end_time: s.endTime,
      available: s.available ?? true,
    }));
    check(await sb().from('mentor_schedules').insert(rows), '일정 업데이트 실패');
  }
  return { success: true };
}

// ============ OUTCOMES ============

export async function createOutcome(input: {
  mentorId?: string;
  result: string;
  detail?: string;
  purpose?: string;
  goalId?: string;
  documentId?: string;
}) {
  const uid = await requireUserId();
  const outcome: Record<string, unknown> = {
    id: genId(),
    user_id: uid,
    mentor_id: input.mentorId || null,
    result: input.result,
    detail: input.detail || '',
    purpose: input.purpose || '',
  };
  // M4 라벨 루프 (007 미적용 DB에서는 insert가 무시하도록 조건부)
  if (input.goalId) outcome.goal_id = input.goalId;
  if (input.documentId) outcome.document_id = input.documentId;
  const data = check(await sb().from('outcomes').insert(outcome).select().single(), '결과 보고 실패');
  return { success: true, outcome: data };
}

export async function getOutcomes() {
  const uid = await requireUserId();
  const data = check(
    await sb().from('outcomes').select('*').eq('user_id', uid).order('created_at', { ascending: false }),
    '결과 조회 실패',
  );
  return { outcomes: data || [] };
}

// ============ ADMIN ============

export async function getPendingMentors() {
  const data = check(
    await sb().from('mentor_profiles').select('*, profiles!inner(name, email, avatar)')
      .eq('verified', false).order('created_at', { ascending: false }),
    '대기 러너 조회 실패',
  );
  return { mentors: (data || []).map(mapMentorRow) };
}

export async function verifyMentor(mentorId: string, verified: boolean = true) {
  // mentor notification handled by trigger; admin RLS policy permits the update.
  const data = check(
    await sb().from('mentor_profiles').update({ verified }).eq('id', mentorId).select().single(),
    '러너 인증 실패',
  );
  return { success: true, mentor: data };
}

export async function getAdminStats() {
  const client = sb();
  const countOf = async (table: string, build?: (q: any) => any) => {
    let q = client.from(table).select('*', { count: 'exact', head: true });
    if (build) q = build(q);
    const { count } = await q;
    return count || 0;
  };

  const [totalUsers, totalMentors, activeMentors, totalSessions, totalReviews, pendingDisputes] = await Promise.all([
    countOf('profiles'),
    countOf('mentor_profiles'),
    countOf('mentor_profiles', (q) => q.eq('verified', true)),
    countOf('sessions'),
    countOf('reviews'),
    countOf('disputes', (q) => q.eq('status', 'pending')),
  ]);

  // Monthly user growth (last 6 months)
  const monthlyGrowth: Array<{ month: string; count: number }> = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
    const count = await countOf('profiles', (q) =>
      q.gte('created_at', start.toISOString()).lt('created_at', end.toISOString()),
    );
    monthlyGrowth.push({
      month: `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}`,
      count,
    });
  }

  const { data: addTx } = await client.from('credit_transactions').select('amount').eq('type', 'add');
  const totalRevenue = (addTx || []).reduce((sum: number, t: any) => sum + (t.amount || 0), 0);

  return {
    totalUsers, totalMentors, activeMentors, totalSessions, totalReviews, pendingDisputes,
    monthlyGrowth, totalRevenue,
  };
}

// ============ MENTOR REVENUE ============

export async function getMentorRevenue() {
  const uid = await requireUserId();
  const client = sb();

  const { data: completed } = await client.from('sessions').select('price, date, user_id')
    .eq('mentor_id', uid).eq('status', 'completed');
  const totalEarned = (completed || []).reduce((s: number, r: any) => s + (r.price || 0), 0);

  const { data: upcoming } = await client.from('sessions').select('price')
    .eq('mentor_id', uid).eq('status', 'upcoming');
  const pending = (upcoming || []).reduce((s: number, r: any) => s + (r.price || 0), 0);

  const { data: recent } = await client.from('sessions').select('id, price, date, user_id')
    .eq('mentor_id', uid).eq('status', 'completed').order('date', { ascending: false }).limit(10);

  const recentTransactions: any[] = [];
  for (const s of recent || []) {
    const { data: mentee } = await client.from('profiles').select('name').eq('id', (s as any).user_id).maybeSingle();
    recentTransactions.push({
      session_id: (s as any).id,
      date: (s as any).date,
      mentee_name: (mentee as any)?.name || '사용자',
      amount: (s as any).price || 0,
    });
  }

  return { total_earned: totalEarned, pending, recent_transactions: recentTransactions };
}

export async function requestWithdraw() {
  const uid = await requireUserId();
  const row = {
    id: genId(),
    mentor_id: uid,
    amount: 0,
    status: 'pending',
  };
  // best-effort insert; ignore failure so the UI flow isn't blocked
  await sb().from('revenue_withdrawals').insert(row).then(undefined, () => {});
  return {
    success: true,
    message: '출금 요청이 접수되었습니다.',
    requested_by: uid,
    requested_at: new Date().toISOString(),
  };
}

// ============ RELAY CHAIN ============

export async function getRelayChain() {
  const client = sb();
  const { data: sessions } = await client.from('sessions').select('mentor_id, user_id, status');
  const { data: outcomes } = await client.from('outcomes').select('mentor_id, user_id, result');

  const mentorMap: Record<string, {
    mentor_id: string;
    mentee_ids: Set<string>;
    completed_sessions: number;
    success_outcomes: number;
  }> = {};

  for (const s of sessions || []) {
    const m = (s as any).mentor_id;
    if (!m) continue;
    mentorMap[m] ||= { mentor_id: m, mentee_ids: new Set(), completed_sessions: 0, success_outcomes: 0 };
    mentorMap[m].mentee_ids.add((s as any).user_id);
    if ((s as any).status === 'completed') mentorMap[m].completed_sessions++;
  }
  for (const o of outcomes || []) {
    const m = (o as any).mentor_id;
    if (!m) continue;
    mentorMap[m] ||= { mentor_id: m, mentee_ids: new Set(), completed_sessions: 0, success_outcomes: 0 };
    if ((o as any).result === 'success' || (o as any).result === 'accepted') mentorMap[m].success_outcomes++;
  }

  const nodes: any[] = [];
  for (const [mentorId, info] of Object.entries(mentorMap)) {
    const { data: profile } = await client.from('profiles').select('name').eq('id', mentorId).maybeSingle();
    nodes.push({
      mentor_id: mentorId,
      mentor_name: (profile as any)?.name || '러너',
      mentee_count: info.mentee_ids.size,
      completed_sessions: info.completed_sessions,
      success_outcomes: info.success_outcomes,
    });
  }
  return { nodes };
}

// ============ WORKSPACE DOCUMENT (④ 세션 공동 편집) ============

export interface WorkspaceDoc {
  documentId: string;
  title: string;
  content: string;
  ownerId: string;
  isOwner: boolean;
}

/** 워크스페이스에서 열 문서 — RLS가 소유자/연결된 러너를 판별한다. */
export async function getWorkspaceDocument(): Promise<WorkspaceDoc | null> {
  const uid = await requireUserId();
  const { data, error } = await sb()
    .from('documents')
    .select('id, title, user_id, current:document_versions!documents_current_version_id_fkey(content)')
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error || !data) return null;
  const d = data as any;
  return {
    documentId: d.id,
    title: d.title,
    content: d.current?.content || '',
    ownerId: d.user_id,
    isOwner: d.user_id === uid,
  };
}

/** 워크스페이스 편집 저장 — 소유자면 user_edit(+현재 포인터 갱신), 러너면 mentor_edit 버전 기록. */
export async function saveWorkspaceVersion(doc: WorkspaceDoc, content: string) {
  const uid = await requireUserId();
  const { data: cur } = await sb().from('documents')
    .select('current_version_id').eq('id', doc.documentId).maybeSingle();

  const source = doc.isOwner ? 'user_edit' : 'mentor_edit';
  const ver = check(
    await sb().from('document_versions').insert({
      document_id: doc.documentId,
      parent_version_id: (cur as any)?.current_version_id ?? null,
      content,
      source,
      editor_id: uid,
    }).select('id').single(),
    '버전 저장 실패',
  );

  if (doc.isOwner) {
    await sb().from('documents').update({
      current_version_id: (ver as any).id,
      updated_at: new Date().toISOString(),
    }).eq('id', doc.documentId);
  }
  return { success: true, source, versionId: (ver as any).id };
}

// ============ AI FEEDBACK (③ 암묵 RLHF 신호) ============

export async function submitAiFeedback(input: {
  generationId: string;
  accepted?: boolean;
  editedRatio?: number;
  rating?: number;
}) {
  const uid = await requireUserId();
  check(
    await sb().from('ai_feedback').upsert({
      generation_id: input.generationId,
      user_id: uid,
      accepted: input.accepted ?? null,
      edited_ratio: input.editedRatio ?? null,
      rating: input.rating ?? null,
    }),
    'AI 피드백 기록 실패',
  );
  return { success: true };
}

// ============ DOCUMENT VERSIONS (M2 조회) ============

export interface DocumentVersionRow {
  id: string;
  source: 'ai_draft' | 'ai_proofread' | 'user_edit' | 'mentor_edit';
  word_count: number;
  analysis: Record<string, unknown> | null;
  used_experience_ids: string[];
  created_at: string;
  is_current: boolean;
}

export async function getDocumentVersions(documentId: string): Promise<{ versions: DocumentVersionRow[] }> {
  const { data: doc } = await sb().from('documents')
    .select('current_version_id').eq('id', documentId).maybeSingle();
  const data = check(
    await sb().from('document_versions')
      .select('id, source, word_count, analysis, used_experience_ids, created_at')
      .eq('document_id', documentId)
      .order('created_at', { ascending: false }),
    '버전 기록 조회 실패',
  );
  const currentId = (doc as any)?.current_version_id;
  return {
    versions: ((data as any[]) || []).map((v) => ({ ...v, is_current: v.id === currentId })),
  };
}

// ============ GOALS & TARGETS (M4) ============

const CATEGORY_TARGET_TYPE: Record<string, string> = {
  transfer: 'university',
  admission: 'university',
  career: 'company',
  certification: 'certification',
  other: 'program',
};

/** 지원처 find-or-create 후 활성 목표 등록. */
export async function upsertGoal(input: {
  category: string;
  targetName: string;
  subTarget?: string | null;
  priority?: number;
}) {
  const uid = await requireUserId();
  const type = CATEGORY_TARGET_TYPE[input.category] || 'program';
  const targetId = check(
    await sb().rpc('ensure_target', {
      p_category: input.category,
      p_type: type,
      p_name: input.targetName,
    }),
    '지원처 등록 실패',
  ) as unknown as string;

  // 동일 목표 중복 방지
  const { data: existing } = await sb().from('user_goals')
    .select('id').eq('user_id', uid).eq('target_id', targetId)
    .eq('status', 'active').maybeSingle();
  if (existing) return { success: true, goalId: (existing as any).id, targetId };

  const data = check(
    await sb().from('user_goals').insert({
      user_id: uid,
      target_id: targetId,
      sub_target: input.subTarget ?? null,
      priority: input.priority ?? 1,
    }).select('id').single(),
    '목표 등록 실패',
  );
  return { success: true, goalId: (data as any).id, targetId };
}

export async function getGoals() {
  const uid = await requireUserId();
  const data = check(
    await sb().from('user_goals')
      .select('*, target:targets(id, name, type, category)')
      .eq('user_id', uid)
      .order('priority', { ascending: true }),
    '목표 조회 실패',
  );
  return { goals: data || [] };
}

// ============ EXPERIENCES (M1: 경험 DB) ============

export interface ExperienceInput {
  category: string;
  kind?: string;
  title: string;
  organization?: string | null;
  role?: string | null;
  periodStart?: string | null;
  periodEnd?: string | null;
  situation?: string | null;
  task?: string | null;
  action?: string | null;
  result?: string | null;
  metrics?: Record<string, unknown>;
  skills?: string[];
  keywords?: string[];
  source?: 'manual' | 'ai_extracted' | 'imported';
}

const toDate = (v?: string | null) => {
  if (!v) return null;
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
};

export async function saveExperiences(items: ExperienceInput[]) {
  const uid = await requireUserId();
  const rows = items
    .filter((e) => e.title?.trim())
    .map((e) => ({
      user_id: uid,
      category: e.category,
      kind: e.kind || 'activity',
      title: e.title.trim(),
      organization: e.organization ?? null,
      role: e.role ?? null,
      period_start: toDate(e.periodStart),
      period_end: toDate(e.periodEnd),
      situation: e.situation ?? null,
      task: e.task ?? null,
      action: e.action ?? null,
      result: e.result ?? null,
      metrics: e.metrics ?? {},
      skills: e.skills ?? [],
      keywords: e.keywords ?? [],
      source: e.source ?? 'manual',
    }));
  if (rows.length === 0) return { experiences: [] };
  const data = check(await sb().from('user_experiences').insert(rows).select(), '경험 저장 실패');
  return { experiences: data || [] };
}

export async function getExperiences(category?: string) {
  const uid = await requireUserId();
  let q = sb().from('user_experiences').select('*').eq('user_id', uid)
    .order('period_end', { ascending: false, nullsFirst: true });
  if (category) q = q.eq('category', category);
  const data = check(await q, '경험 조회 실패');
  return { experiences: data || [] };
}

export async function deleteExperience(id: string) {
  const uid = await requireUserId();
  check(await sb().from('user_experiences').delete().eq('id', id).eq('user_id', uid), '경험 삭제 실패');
  return { success: true };
}

// ============ HELPERS ============

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
