import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";

const app = new Hono();

app.use('*', logger(console.log));

app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization", "apikey", "x-user-token"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// ============ HELPERS ============

function getServiceClient() {
  return createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );
}

async function getAuthUser(c: any) {
  const supabase = getServiceClient();

  let accessToken = c.req.header('x-user-token') || '';
  if (!accessToken) {
    const authHeader = c.req.header('Authorization') || '';
    accessToken = authHeader.split(' ')[1] || '';
  }

  if (!accessToken) return null;

  const { data, error } = await supabase.auth.getUser(accessToken);
  if (error || !data?.user?.id) return null;
  return data.user;
}

async function requireAuth(c: any) {
  const user = await getAuthUser(c);
  if (!user) return { user: null, error: c.json({ error: "인증 필요" }, 401) };
  return { user, error: null };
}

async function requireAdmin(c: any) {
  const { user, error } = await requireAuth(c);
  if (error) return { user: null, error };

  const db = getServiceClient();
  const { data: profile } = await db.from('profiles').select('role').eq('id', user!.id).single();
  if (profile?.role !== 'admin') {
    return { user: null, error: c.json({ error: "관리자 권한 필요" }, 403) };
  }
  return { user, error: null };
}

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

async function createNotification(
  userId: string,
  title: string,
  message: string,
  type: string = 'info',
) {
  const db = getServiceClient();
  const notifId = genId();
  await db.from('notifications').insert({
    id: notifId,
    user_id: userId,
    title,
    message,
    type,
    read: false,
  });
}

const PREFIX = "/make-server-370ee075";

// ============================
// Health Check
// ============================
app.get(`${PREFIX}/health`, (c) => {
  return c.json({ status: "ok" });
});

// ============================
// AUTH: Sign Up
// ============================
app.post(`${PREFIX}/auth/signup`, async (c) => {
  try {
    const { email, password, name, role, userId } = await c.req.json();
    if (!email || !password || !name) {
      return c.json({ error: "이메일, 비밀번호, 이름은 필수입니다." }, 400);
    }

    const db = getServiceClient();
    const userRole = role || 'mentee';

    // If userId provided (from client-side Supabase Auth signup), just create profile
    if (userId) {
      await db.from('profiles').upsert({
        id: userId,
        email,
        name,
        role: userRole,
        onboarding_completed: false,
      });
      await db.from('credits').upsert({ user_id: userId, balance: 5 });
      return c.json({ success: true, userId, role: userRole });
    }

    // Server-side signup
    const { data, error } = await db.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, role: userRole },
      email_confirm: true,
    });

    if (error) return c.json({ error: `회원가입 실패: ${error.message}` }, 400);

    const newUserId = data.user.id;

    await db.from('profiles').insert({
      id: newUserId,
      email,
      name,
      role: userRole,
      onboarding_completed: false,
    });

    await db.from('credits').insert({ user_id: newUserId, balance: 5 });

    return c.json({ success: true, userId: newUserId, role: userRole });
  } catch (e) {
    return c.json({ error: `서버 오류: ${e}` }, 500);
  }
});

// ============================
// PROFILE: Get
// ============================
app.get(`${PREFIX}/profile`, async (c) => {
  try {
    const { user, error } = await requireAuth(c);
    if (error) return error;

    const db = getServiceClient();
    const { data: profile } = await db.from('profiles').select('*').eq('id', user!.id).single();
    const { data: creditData } = await db.from('credits').select('balance').eq('user_id', user!.id).single();

    return c.json({
      profile: profile || {
        id: user!.id,
        email: user!.email,
        name: user!.user_metadata?.name || '사용자',
        role: user!.user_metadata?.role || 'mentee',
        onboarding_completed: false,
      },
      credits: creditData?.balance ?? 5,
    });
  } catch (e) {
    return c.json({ error: `프로필 조회 실패: ${e}` }, 500);
  }
});

// ============================
// PROFILE: Update
// ============================
app.put(`${PREFIX}/profile`, async (c) => {
  try {
    const { user, error } = await requireAuth(c);
    if (error) return error;

    const updates = await c.req.json();
    const db = getServiceClient();

    const dbUpdates: Record<string, any> = { updated_at: new Date().toISOString() };
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.role !== undefined) dbUpdates.role = updates.role;
    if (updates.avatar !== undefined) dbUpdates.avatar = updates.avatar;
    if (updates.onboardingCompleted !== undefined) dbUpdates.onboarding_completed = updates.onboardingCompleted;

    const { data, error: dbError } = await db
      .from('profiles')
      .upsert({ id: user!.id, email: user!.email || '', ...dbUpdates })
      .select()
      .single();

    if (dbError) return c.json({ error: `프로필 업데이트 실패: ${dbError.message}` }, 500);
    return c.json({ success: true, profile: data });
  } catch (e) {
    return c.json({ error: `프로필 업데이트 실패: ${e}` }, 500);
  }
});

// ============================
// CREDITS: Get Balance
// ============================
app.get(`${PREFIX}/credits`, async (c) => {
  try {
    const { user, error } = await requireAuth(c);
    if (error) return error;

    const db = getServiceClient();
    const { data } = await db.from('credits').select('balance').eq('user_id', user!.id).single();
    return c.json({ balance: data?.balance ?? 5 });
  } catch (e) {
    return c.json({ error: `크레딧 조회 실패: ${e}` }, 500);
  }
});

// ============================
// CREDITS: Use
// ============================
app.post(`${PREFIX}/credits/use`, async (c) => {
  try {
    const { user, error } = await requireAuth(c);
    if (error) return error;

    const { amount } = await c.req.json();
    const db = getServiceClient();

    const { data: creditData } = await db.from('credits').select('balance').eq('user_id', user!.id).single();
    const currentBalance = creditData?.balance ?? 5;
    const useAmount = amount || 1;

    if (currentBalance < useAmount) {
      return c.json({ error: "크레딧이 부족합니다." }, 400);
    }

    const newBalance = currentBalance - useAmount;
    await db.from('credits').update({ balance: newBalance }).eq('user_id', user!.id);

    const txId = genId();
    await db.from('credit_transactions').insert({
      id: txId,
      user_id: user!.id,
      type: 'use',
      amount: useAmount,
      balance_after: newBalance,
    });

    return c.json({ success: true, balance: newBalance });
  } catch (e) {
    return c.json({ error: `크레딧 사용 실패: ${e}` }, 500);
  }
});

// ============================
// CREDITS: Add (Purchase)
// ============================
app.post(`${PREFIX}/credits/add`, async (c) => {
  try {
    const { user, error } = await requireAuth(c);
    if (error) return error;

    const { amount } = await c.req.json();
    const db = getServiceClient();

    const { data: creditData } = await db.from('credits').select('balance').eq('user_id', user!.id).single();
    const currentBalance = creditData?.balance ?? 0;
    const addAmount = amount || 1;
    const newBalance = currentBalance + addAmount;

    await db.from('credits').upsert({ user_id: user!.id, balance: newBalance });

    const txId = genId();
    await db.from('credit_transactions').insert({
      id: txId,
      user_id: user!.id,
      type: 'add',
      amount: addAmount,
      balance_after: newBalance,
    });

    return c.json({ success: true, balance: newBalance });
  } catch (e) {
    return c.json({ error: `크레딧 추가 실패: ${e}` }, 500);
  }
});

// ============================
// DRAFTS: List
// ============================
app.get(`${PREFIX}/drafts`, async (c) => {
  try {
    const { user, error } = await requireAuth(c);
    if (error) return error;

    const db = getServiceClient();
    const { data: drafts } = await db
      .from('drafts')
      .select('*')
      .eq('user_id', user!.id)
      .order('updated_at', { ascending: false });

    return c.json({ drafts: drafts || [] });
  } catch (e) {
    return c.json({ error: `초안 목록 조회 실패: ${e}` }, 500);
  }
});

// ============================
// DRAFTS: Create
// ============================
app.post(`${PREFIX}/drafts`, async (c) => {
  try {
    const { user, error } = await requireAuth(c);
    if (error) return error;

    const body = await c.req.json();
    const db = getServiceClient();
    const draftId = genId();

    const draft = {
      id: draftId,
      user_id: user!.id,
      university: body.university || '',
      major: body.major || '',
      content: body.content || '',
      storyline: body.storyline || null,
      ai_data: body.aiData || null,
      word_count: body.content?.length || 0,
      version: 1,
      status: 'draft',
    };

    const { data, error: dbError } = await db.from('drafts').insert(draft).select().single();
    if (dbError) return c.json({ error: `초안 저장 실패: ${dbError.message}` }, 500);

    return c.json({ success: true, draft: data });
  } catch (e) {
    return c.json({ error: `초안 저장 실패: ${e}` }, 500);
  }
});

// ============================
// DRAFTS: Update
// ============================
app.put(`${PREFIX}/drafts/:id`, async (c) => {
  try {
    const { user, error } = await requireAuth(c);
    if (error) return error;

    const draftId = c.req.param('id');
    const updates = await c.req.json();
    const db = getServiceClient();

    const { data: existing } = await db.from('drafts').select('*').eq('id', draftId).eq('user_id', user!.id).single();
    if (!existing) return c.json({ error: "초안을 찾을 수 없습니다." }, 404);

    const dbUpdates: Record<string, any> = { updated_at: new Date().toISOString() };
    if (updates.content !== undefined) {
      dbUpdates.content = updates.content;
      dbUpdates.word_count = updates.content.length;
    }
    if (updates.university !== undefined) dbUpdates.university = updates.university;
    if (updates.major !== undefined) dbUpdates.major = updates.major;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    dbUpdates.version = (existing.version || 1) + 1;

    const { data, error: dbError } = await db
      .from('drafts')
      .update(dbUpdates)
      .eq('id', draftId)
      .eq('user_id', user!.id)
      .select()
      .single();

    if (dbError) return c.json({ error: `초안 업데이트 실패: ${dbError.message}` }, 500);
    return c.json({ success: true, draft: data });
  } catch (e) {
    return c.json({ error: `초안 업데이트 실패: ${e}` }, 500);
  }
});

// ============================
// DRAFTS: Delete
// ============================
app.delete(`${PREFIX}/drafts/:id`, async (c) => {
  try {
    const { user, error } = await requireAuth(c);
    if (error) return error;

    const db = getServiceClient();
    await db.from('drafts').delete().eq('id', c.req.param('id')).eq('user_id', user!.id);
    return c.json({ success: true });
  } catch (e) {
    return c.json({ error: `초안 삭제 실패: ${e}` }, 500);
  }
});

// ============================
// SESSIONS: List
// ============================
app.get(`${PREFIX}/sessions`, async (c) => {
  try {
    const { user, error } = await requireAuth(c);
    if (error) return error;

    const db = getServiceClient();
    const { data: sessions } = await db
      .from('sessions')
      .select('*')
      .or(`user_id.eq.${user!.id},mentor_id.eq.${user!.id}`)
      .order('created_at', { ascending: false });

    return c.json({ sessions: sessions || [] });
  } catch (e) {
    return c.json({ error: `세션 조회 실패: ${e}` }, 500);
  }
});

// ============================
// SESSIONS: Book
// ============================
app.post(`${PREFIX}/sessions`, async (c) => {
  try {
    const { user, error } = await requireAuth(c);
    if (error) return error;

    const body = await c.req.json();
    const db = getServiceClient();
    const sessionId = genId();

    const session = {
      id: sessionId,
      user_id: user!.id,
      mentor_id: body.mentorId,
      mentor_name: body.mentorName,
      mentor_avatar: body.mentorAvatar || '',
      date: body.date,
      time: body.time,
      duration: body.duration || 60,
      price: body.price || 0,
      status: 'upcoming',
      topic: body.topic || '',
    };

    const { data, error: dbError } = await db.from('sessions').insert(session).select().single();
    if (dbError) return c.json({ error: `세션 예약 실패: ${dbError.message}` }, 500);

    // Notify the mentor about the new session booking
    if (body.mentorId) {
      await createNotification(
        body.mentorId,
        '새 세션 예약',
        `새 세션 예약: ${body.topic || '(주제 없음)'}`,
        'session',
      );
    }

    return c.json({ success: true, session: data });
  } catch (e) {
    return c.json({ error: `세션 예약 실패: ${e}` }, 500);
  }
});

// ============================
// SESSIONS: Update
// ============================
app.put(`${PREFIX}/sessions/:id`, async (c) => {
  try {
    const { user, error } = await requireAuth(c);
    if (error) return error;

    const sessionId = c.req.param('id');
    const updates = await c.req.json();
    const db = getServiceClient();

    const dbUpdates: Record<string, any> = { updated_at: new Date().toISOString() };
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.topic !== undefined) dbUpdates.topic = updates.topic;
    if (updates.date !== undefined) dbUpdates.date = updates.date;
    if (updates.time !== undefined) dbUpdates.time = updates.time;

    const { data, error: dbError } = await db
      .from('sessions')
      .update(dbUpdates)
      .eq('id', sessionId)
      .or(`user_id.eq.${user!.id},mentor_id.eq.${user!.id}`)
      .select()
      .single();

    if (dbError) return c.json({ error: `세션 업데이트 실패: ${dbError.message}` }, 500);
    return c.json({ success: true, session: data });
  } catch (e) {
    return c.json({ error: `세션 업데이트 실패: ${e}` }, 500);
  }
});

// ============================
// REVIEWS: Submit
// ============================
app.post(`${PREFIX}/reviews`, async (c) => {
  try {
    const { user, error } = await requireAuth(c);
    if (error) return error;

    const body = await c.req.json();
    const db = getServiceClient();
    const reviewId = genId();

    const review = {
      id: reviewId,
      user_id: user!.id,
      mentor_id: body.mentorId,
      session_id: body.sessionId || null,
      rating: body.rating,
      content: body.content,
      tags: body.tags || [],
    };

    const { data, error: dbError } = await db.from('reviews').insert(review).select().single();
    if (dbError) return c.json({ error: `리뷰 작성 실패: ${dbError.message}` }, 500);

    // Update mentor review_count and rating
    const { data: allReviews } = await db.from('reviews').select('rating').eq('mentor_id', body.mentorId);
    if (allReviews && allReviews.length > 0) {
      const avgRating = allReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / allReviews.length;
      await db.from('mentor_profiles').update({
        review_count: allReviews.length,
        rating: Math.round(avgRating * 100) / 100,
      }).eq('id', body.mentorId);
    }

    // Notify the mentor about the new review
    if (body.mentorId) {
      await createNotification(
        body.mentorId,
        '새 리뷰',
        '새 리뷰가 등록되었습니다',
        'review',
      );
    }

    return c.json({ success: true, review: data });
  } catch (e) {
    return c.json({ error: `리뷰 작성 실패: ${e}` }, 500);
  }
});

// ============================
// REVIEWS: Get Mentor Reviews
// ============================
app.get(`${PREFIX}/reviews/:mentorId`, async (c) => {
  try {
    const mentorId = c.req.param('mentorId');
    const db = getServiceClient();

    const { data: reviews } = await db
      .from('reviews')
      .select('*')
      .eq('mentor_id', mentorId)
      .order('created_at', { ascending: false });

    return c.json({ reviews: reviews || [] });
  } catch (e) {
    return c.json({ error: `리뷰 조회 실패: ${e}` }, 500);
  }
});

// ============================
// MENTORS: List
// ============================
app.get(`${PREFIX}/mentors`, async (c) => {
  try {
    const db = getServiceClient();
    const category = c.req.query('category');

    let query = db
      .from('mentor_profiles')
      .select('*, profiles!inner(name, email, avatar)')
      .order('rating', { ascending: false });

    if (category) {
      query = query.eq('category', category);
    }

    const { data: mentors, error: dbError } = await query;

    // If category column doesn't exist, fall back to unfiltered query
    let finalMentors = mentors;
    if (dbError && category) {
      const { data: allMentors } = await db
        .from('mentor_profiles')
        .select('*, profiles!inner(name, email, avatar)')
        .order('rating', { ascending: false });
      finalMentors = allMentors;
    }

    const result = (finalMentors || []).map((m: any) => ({
      ...m,
      name: m.profiles?.name || '러너',
      email: m.profiles?.email || '',
      avatar: m.profiles?.avatar || '👨‍🎓',
    }));

    return c.json({ mentors: result });
  } catch (e) {
    return c.json({ error: `러너 목록 조회 실패: ${e}` }, 500);
  }
});

// ============================
// MENTORS: Register
// ============================
app.post(`${PREFIX}/mentors/register`, async (c) => {
  try {
    const { user, error } = await requireAuth(c);
    if (error) return error;

    const body = await c.req.json();
    const db = getServiceClient();

    const mentorProfile = {
      id: user!.id,
      university: body.university,
      major: body.major,
      year: body.year,
      response_time: body.responseTime || '2시간',
      price: body.price || 30000,
      expertise: body.expertise || [],
      bio: body.bio || '',
    };

    const { data, error: dbError } = await db
      .from('mentor_profiles')
      .upsert(mentorProfile)
      .select()
      .single();

    if (dbError) return c.json({ error: `러너 등록 실패: ${dbError.message}` }, 500);

    await db.from('profiles').update({ role: 'mentor' }).eq('id', user!.id);

    return c.json({ success: true, mentor: data });
  } catch (e) {
    return c.json({ error: `러너 등록 실패: ${e}` }, 500);
  }
});

// ============================
// MENTORS: Verify (Admin only)
// ============================
app.put(`${PREFIX}/mentors/:id/verify`, async (c) => {
  try {
    const { error } = await requireAdmin(c);
    if (error) return error;

    const mentorId = c.req.param('id');
    const { verified } = await c.req.json();
    const db = getServiceClient();

    const isVerified = verified ?? true;
    const { data, error: dbError } = await db
      .from('mentor_profiles')
      .update({ verified: isVerified })
      .eq('id', mentorId)
      .select()
      .single();

    if (dbError) return c.json({ error: `러너 인증 실패: ${dbError.message}` }, 500);

    // Notify the mentor about verification result
    await createNotification(
      mentorId,
      '러너 인증 결과',
      isVerified ? '러너 인증이 완료되었습니다' : '러너 인증이 거부되었습니다',
      'verification',
    );

    return c.json({ success: true, mentor: data });
  } catch (e) {
    return c.json({ error: `러너 인증 실패: ${e}` }, 500);
  }
});

// ============================
// ADMIN: Pending Mentors
// ============================
app.get(`${PREFIX}/admin/mentors/pending`, async (c) => {
  try {
    const { error } = await requireAdmin(c);
    if (error) return error;

    const db = getServiceClient();
    const { data: mentors } = await db
      .from('mentor_profiles')
      .select('*, profiles!inner(name, email, avatar)')
      .eq('verified', false)
      .order('created_at', { ascending: false });

    const result = (mentors || []).map((m: any) => ({
      ...m,
      name: m.profiles?.name || '러너',
      email: m.profiles?.email || '',
      avatar: m.profiles?.avatar || '👨‍🎓',
    }));

    return c.json({ mentors: result });
  } catch (e) {
    return c.json({ error: `대기 러너 조회 실패: ${e}` }, 500);
  }
});

// ============================
// MENTORS: Schedule - Get
// ============================
app.get(`${PREFIX}/mentors/:id/schedule`, async (c) => {
  try {
    const mentorId = c.req.param('id');
    const db = getServiceClient();

    const { data: schedules } = await db
      .from('mentor_schedules')
      .select('*')
      .eq('mentor_id', mentorId)
      .order('day_of_week', { ascending: true });

    return c.json({ schedules: schedules || [] });
  } catch (e) {
    return c.json({ error: `일정 조회 실패: ${e}` }, 500);
  }
});

// ============================
// MENTORS: Schedule - Update
// ============================
app.put(`${PREFIX}/mentors/schedule`, async (c) => {
  try {
    const { user, error } = await requireAuth(c);
    if (error) return error;

    const { schedules } = await c.req.json();
    const db = getServiceClient();

    await db.from('mentor_schedules').delete().eq('mentor_id', user!.id);

    if (schedules && schedules.length > 0) {
      const rows = schedules.map((s: any) => ({
        id: genId(),
        mentor_id: user!.id,
        day_of_week: s.dayOfWeek,
        start_time: s.startTime,
        end_time: s.endTime,
        available: s.available ?? true,
      }));

      const { error: dbError } = await db.from('mentor_schedules').insert(rows);
      if (dbError) return c.json({ error: `일정 업데이트 실패: ${dbError.message}` }, 500);
    }

    return c.json({ success: true });
  } catch (e) {
    return c.json({ error: `일정 업데이트 실패: ${e}` }, 500);
  }
});

// ============================
// NOTIFICATIONS: List
// ============================
app.get(`${PREFIX}/notifications`, async (c) => {
  try {
    const { user, error } = await requireAuth(c);
    if (error) return error;

    const db = getServiceClient();
    const { data: notifications } = await db
      .from('notifications')
      .select('*')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false });

    return c.json({ notifications: notifications || [] });
  } catch (e) {
    return c.json({ error: `알림 조회 실패: ${e}` }, 500);
  }
});

// ============================
// NOTIFICATIONS: Mark Read
// ============================
app.put(`${PREFIX}/notifications/:id/read`, async (c) => {
  try {
    const { user, error } = await requireAuth(c);
    if (error) return error;

    const db = getServiceClient();
    await db.from('notifications').update({ read: true }).eq('id', c.req.param('id')).eq('user_id', user!.id);
    return c.json({ success: true });
  } catch (e) {
    return c.json({ error: `알림 읽음 처리 실패: ${e}` }, 500);
  }
});

// ============================
// MESSAGES: Send
// ============================
app.post(`${PREFIX}/messages`, async (c) => {
  try {
    const { user, error } = await requireAuth(c);
    if (error) return error;

    const body = await c.req.json();
    const db = getServiceClient();
    const msgId = genId();
    const convId = body.conversationId || [user!.id, body.recipientId].sort().join('_');

    await db.from('conversations').upsert({
      id: convId,
      last_message: body.content,
      last_message_at: new Date().toISOString(),
      participants: [user!.id, body.recipientId],
    });

    await db.from('conversation_members').upsert([
      { conversation_id: convId, user_id: user!.id },
      { conversation_id: convId, user_id: body.recipientId },
    ]);

    const message = {
      id: msgId,
      conversation_id: convId,
      sender_id: user!.id,
      recipient_id: body.recipientId,
      content: body.content,
      read: false,
    };

    const { data, error: dbError } = await db.from('messages').insert(message).select().single();
    if (dbError) return c.json({ error: `메시지 전송 실패: ${dbError.message}` }, 500);

    return c.json({ success: true, message: data });
  } catch (e) {
    return c.json({ error: `메시지 전송 실패: ${e}` }, 500);
  }
});

// ============================
// MESSAGES: Get Conversations
// ============================
app.get(`${PREFIX}/conversations`, async (c) => {
  try {
    const { user, error } = await requireAuth(c);
    if (error) return error;

    const db = getServiceClient();
    const { data: members } = await db
      .from('conversation_members')
      .select('conversation_id')
      .eq('user_id', user!.id);

    if (!members || members.length === 0) return c.json({ conversations: [] });

    const convIds = members.map((m: any) => m.conversation_id);
    const { data: conversations } = await db
      .from('conversations')
      .select('*')
      .in('id', convIds)
      .order('last_message_at', { ascending: false });

    return c.json({ conversations: conversations || [] });
  } catch (e) {
    return c.json({ error: `대화 목록 조회 실패: ${e}` }, 500);
  }
});

// ============================
// MESSAGES: Get Messages in Conversation
// ============================
app.get(`${PREFIX}/messages/:conversationId`, async (c) => {
  try {
    const { user, error } = await requireAuth(c);
    if (error) return error;

    const convId = c.req.param('conversationId');
    const db = getServiceClient();

    const { data: messages } = await db
      .from('messages')
      .select('*')
      .eq('conversation_id', convId)
      .or(`sender_id.eq.${user!.id},recipient_id.eq.${user!.id}`)
      .order('created_at', { ascending: true });

    return c.json({ messages: messages || [] });
  } catch (e) {
    return c.json({ error: `메시지 조회 실패: ${e}` }, 500);
  }
});

// ============================
// DISPUTES: Create
// ============================
app.post(`${PREFIX}/disputes`, async (c) => {
  try {
    const { user, error } = await requireAuth(c);
    if (error) return error;

    const body = await c.req.json();
    const db = getServiceClient();
    const disputeId = genId();

    const dispute = {
      id: disputeId,
      reporter_id: user!.id,
      target_id: body.targetId,
      session_id: body.sessionId || null,
      reason: body.reason,
      description: body.description || '',
      status: 'pending',
    };

    const { data, error: dbError } = await db.from('disputes').insert(dispute).select().single();
    if (dbError) return c.json({ error: `분쟁 신고 실패: ${dbError.message}` }, 500);

    // Notify all admins about the new dispute
    const { data: admins } = await db.from('profiles').select('id').eq('role', 'admin');
    if (admins && admins.length > 0) {
      for (const admin of admins) {
        await createNotification(
          admin.id,
          '새 분쟁 신고',
          `새로운 분쟁이 접수되었습니다: ${body.reason}`,
          'dispute',
        );
      }
    }

    return c.json({ success: true, dispute: data });
  } catch (e) {
    return c.json({ error: `분쟁 신고 실패: ${e}` }, 500);
  }
});

// ============================
// ADMIN: Disputes List
// ============================
app.get(`${PREFIX}/admin/disputes`, async (c) => {
  try {
    const { error } = await requireAdmin(c);
    if (error) return error;

    const db = getServiceClient();
    const { data: disputes } = await db
      .from('disputes')
      .select('*')
      .order('created_at', { ascending: false });

    return c.json({ disputes: disputes || [] });
  } catch (e) {
    return c.json({ error: `분쟁 목록 조회 실패: ${e}` }, 500);
  }
});

// ============================
// ADMIN: Update Dispute
// ============================
app.put(`${PREFIX}/admin/disputes/:id`, async (c) => {
  try {
    const { error } = await requireAdmin(c);
    if (error) return error;

    const disputeId = c.req.param('id');
    const updates = await c.req.json();
    const db = getServiceClient();

    const dbUpdates: Record<string, any> = { updated_at: new Date().toISOString() };
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.resolution !== undefined) dbUpdates.resolution = updates.resolution;

    const { data, error: dbError } = await db
      .from('disputes')
      .update(dbUpdates)
      .eq('id', disputeId)
      .select()
      .single();

    if (dbError) return c.json({ error: `분쟁 처리 실패: ${dbError.message}` }, 500);
    return c.json({ success: true, dispute: data });
  } catch (e) {
    return c.json({ error: `분쟁 처리 실패: ${e}` }, 500);
  }
});

// ============================
// OUTCOMES: Create
// ============================
app.post(`${PREFIX}/outcomes`, async (c) => {
  try {
    const { user, error } = await requireAuth(c);
    if (error) return error;

    const body = await c.req.json();
    const db = getServiceClient();
    const outcomeId = genId();

    const outcome = {
      id: outcomeId,
      user_id: user!.id,
      mentor_id: body.mentorId || null,
      result: body.result,
      detail: body.detail || '',
      purpose: body.purpose || '',
    };

    const { data, error: dbError } = await db.from('outcomes').insert(outcome).select().single();
    if (dbError) return c.json({ error: `결과 보고 실패: ${dbError.message}` }, 500);

    return c.json({ success: true, outcome: data });
  } catch (e) {
    return c.json({ error: `결과 보고 실패: ${e}` }, 500);
  }
});

// ============================
// OUTCOMES: List
// ============================
app.get(`${PREFIX}/outcomes`, async (c) => {
  try {
    const { user, error } = await requireAuth(c);
    if (error) return error;

    const db = getServiceClient();
    const { data: outcomes } = await db
      .from('outcomes')
      .select('*')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false });

    return c.json({ outcomes: outcomes || [] });
  } catch (e) {
    return c.json({ error: `결과 조회 실패: ${e}` }, 500);
  }
});

// ============================
// ADMIN: Platform Stats
// ============================
app.get(`${PREFIX}/admin/stats`, async (c) => {
  try {
    const { error } = await requireAdmin(c);
    if (error) return error;

    const db = getServiceClient();
    const { count: totalUsers } = await db.from('profiles').select('*', { count: 'exact', head: true });
    const { count: totalMentors } = await db.from('mentor_profiles').select('*', { count: 'exact', head: true });
    const { count: activeMentors } = await db.from('mentor_profiles').select('*', { count: 'exact', head: true }).eq('verified', true);
    const { count: totalSessions } = await db.from('sessions').select('*', { count: 'exact', head: true });
    const { count: totalReviews } = await db.from('reviews').select('*', { count: 'exact', head: true });
    const { count: pendingDisputes } = await db.from('disputes').select('*', { count: 'exact', head: true }).eq('status', 'pending');

    // Monthly user growth (last 6 months)
    const monthlyGrowth: Array<{ month: string; count: number }> = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      const { count: monthCount } = await db
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', start.toISOString())
        .lt('created_at', end.toISOString());
      monthlyGrowth.push({
        month: `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}`,
        count: monthCount || 0,
      });
    }

    // Total revenue from credit_transactions where type='add'
    const { data: addTransactions } = await db
      .from('credit_transactions')
      .select('amount')
      .eq('type', 'add');
    const totalRevenue = (addTransactions || []).reduce((sum: number, t: any) => sum + (t.amount || 0), 0);

    return c.json({
      totalUsers: totalUsers || 0,
      totalMentors: totalMentors || 0,
      activeMentors: activeMentors || 0,
      totalSessions: totalSessions || 0,
      totalReviews: totalReviews || 0,
      pendingDisputes: pendingDisputes || 0,
      monthlyGrowth,
      totalRevenue,
    });
  } catch (e) {
    return c.json({ error: `통계 조회 실패: ${e}` }, 500);
  }
});

// ============================
// MENTORS: Revenue Summary
// ============================
app.get(`${PREFIX}/mentors/revenue`, async (c) => {
  try {
    const { user, error } = await requireAuth(c);
    if (error) return error;

    const db = getServiceClient();

    // Total earned from completed sessions
    const { data: completedSessions } = await db
      .from('sessions')
      .select('price, date, user_id')
      .eq('mentor_id', user!.id)
      .eq('status', 'completed');

    const totalEarned = (completedSessions || []).reduce(
      (sum: number, s: any) => sum + (s.price || 0), 0,
    );

    // Pending from upcoming sessions
    const { data: upcomingSessions } = await db
      .from('sessions')
      .select('price')
      .eq('mentor_id', user!.id)
      .eq('status', 'upcoming');

    const pending = (upcomingSessions || []).reduce(
      (sum: number, s: any) => sum + (s.price || 0), 0,
    );

    // Recent 10 completed sessions with mentee name
    const { data: recentSessions } = await db
      .from('sessions')
      .select('id, price, date, user_id')
      .eq('mentor_id', user!.id)
      .eq('status', 'completed')
      .order('date', { ascending: false })
      .limit(10);

    const recentTransactions = [];
    for (const s of recentSessions || []) {
      const { data: menteeProfile } = await db
        .from('profiles')
        .select('name')
        .eq('id', s.user_id)
        .single();
      recentTransactions.push({
        session_id: s.id,
        date: s.date,
        mentee_name: menteeProfile?.name || '사용자',
        amount: s.price || 0,
      });
    }

    return c.json({
      total_earned: totalEarned,
      pending,
      recent_transactions: recentTransactions,
    });
  } catch (e) {
    return c.json({ error: `수익 조회 실패: ${e}` }, 500);
  }
});

// ============================
// MENTORS: Revenue Withdraw
// ============================
app.post(`${PREFIX}/mentors/revenue/withdraw`, async (c) => {
  try {
    const { user, error } = await requireAuth(c);
    if (error) return error;

    // For now, just return success as a placeholder
    return c.json({
      success: true,
      message: '출금 요청이 접수되었습니다.',
      requested_by: user!.id,
      requested_at: new Date().toISOString(),
    });
  } catch (e) {
    return c.json({ error: `출금 요청 실패: ${e}` }, 500);
  }
});

// ============================
// RELAY CHAIN: Connection Graph
// ============================
app.get(`${PREFIX}/relay-chain`, async (c) => {
  try {
    const { user, error } = await requireAuth(c);
    if (error) return error;

    const db = getServiceClient();

    // Get all sessions grouped by mentor
    const { data: sessions } = await db
      .from('sessions')
      .select('mentor_id, user_id, status');

    // Get all outcomes
    const { data: outcomes } = await db
      .from('outcomes')
      .select('mentor_id, user_id, result');

    // Build mentor nodes with unique mentee counts
    const mentorMap: Record<string, {
      mentor_id: string;
      mentee_ids: Set<string>;
      completed_sessions: number;
      success_outcomes: number;
    }> = {};

    for (const s of sessions || []) {
      if (!s.mentor_id) continue;
      if (!mentorMap[s.mentor_id]) {
        mentorMap[s.mentor_id] = {
          mentor_id: s.mentor_id,
          mentee_ids: new Set(),
          completed_sessions: 0,
          success_outcomes: 0,
        };
      }
      mentorMap[s.mentor_id].mentee_ids.add(s.user_id);
      if (s.status === 'completed') {
        mentorMap[s.mentor_id].completed_sessions++;
      }
    }

    // Count success outcomes per mentor
    for (const o of outcomes || []) {
      if (!o.mentor_id) continue;
      if (!mentorMap[o.mentor_id]) {
        mentorMap[o.mentor_id] = {
          mentor_id: o.mentor_id,
          mentee_ids: new Set(),
          completed_sessions: 0,
          success_outcomes: 0,
        };
      }
      if (o.result === 'success' || o.result === 'accepted') {
        mentorMap[o.mentor_id].success_outcomes++;
      }
    }

    // Fetch mentor names and build final result
    const nodes = [];
    for (const [mentorId, info] of Object.entries(mentorMap)) {
      const { data: profile } = await db
        .from('profiles')
        .select('name')
        .eq('id', mentorId)
        .single();
      nodes.push({
        mentor_id: mentorId,
        mentor_name: profile?.name || '러너',
        mentee_count: info.mentee_ids.size,
        completed_sessions: info.completed_sessions,
        success_outcomes: info.success_outcomes,
      });
    }

    return c.json({ nodes });
  } catch (e) {
    return c.json({ error: `릴레이 체인 조회 실패: ${e}` }, 500);
  }
});

Deno.serve(app.fetch);
