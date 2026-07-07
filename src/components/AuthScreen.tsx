import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { TextReveal, Aurora, Marquee } from './ui/motion';
import { Sparkles, Mail, Lock, User, ArrowRight, Loader2, Eye, EyeOff, Zap, Shield, Users } from 'lucide-react';
import { toast } from 'sonner';
import * as api from './api';
import { logger } from '../utils/logger';
import type { AuthSession, ProfileData } from '../App';

interface AuthScreenProps {
  onAuthSuccess: (session: AuthSession | null, profile: ProfileData) => void;
}

export function AuthScreen({ onAuthSuccess }: AuthScreenProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login'); // 로그인이 기본값
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
    name: '',
    role: 'mentee' as 'mentee' | 'mentor',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (!form.email || !form.password) {
      toast.error('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    if (mode === 'signup' && !form.name) {
      toast.error('이름을 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'signup') {
        const result = await api.signUp(form.email, form.password, form.name, form.role);
        toast.success('가입 완료! 환영합니다.');
        // Pass the freshly-obtained JWT directly — bypasses every cache/session race
        const profile = await api.getProfile(result.accessToken!);
        onAuthSuccess(result.session, profile);
      } else {
        const data = await api.signIn(form.email, form.password);
        toast.success('로그인 성공!');
        const profile = await api.getProfile(data.accessToken!);
        onAuthSuccess(data.session, profile);
      }
    } catch (err: any) {
      logger.error('Auth error:', err);
      toast.error(err.message || '인증에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4 gradient-mesh">
      {/* Ambient aurora backdrop */}
      <Aurora />

      <div className="w-full max-w-[1000px] relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left: Branding */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden lg:block"
          >
            <div className="mb-8">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="inline-flex items-center gap-2.5 mb-8"
              >
                <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center">
                  <Zap className="w-[22px] h-[22px] text-white" />
                </div>
                <span className="text-2xl font-semibold tracking-tight text-zinc-900">
                  Relay
                </span>
              </motion.div>

              <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 mb-5 leading-[1.15]">
                <TextReveal text="성공의 경험을" delay={0.15} />
                <br />
                <span className="text-zinc-400">
                  <TextReveal text="다음 세대로 이어갑니다" delay={0.3} />
                </span>
              </h1>
              <p className="text-[15px] leading-relaxed text-zinc-500 mb-9">
                편입·취업·자격증·대학원까지, AI 첨삭과 선배 릴레이 세션으로<br />
                당신의 성공 바톤을 이어받으세요.
              </p>
            </div>

            <div className="space-y-4">
              {[
                { icon: Sparkles, title: 'AI 초안 작성', desc: 'AI 기반 맞춤형 초안 자동 생성' },
                { icon: Users, title: '1:1 러너 매칭', desc: '검증된 합격생과 익명 기반 연결' },
                { icon: Shield, title: '프라이버시 보호', desc: '러너 #XXXX 익명 시스템 적용' },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  whileHover={{ x: 3 }}
                  className="flex items-start gap-3 p-3.5 rounded-xl bg-white/70 backdrop-blur-sm border border-zinc-200/70"
                >
                  <div className="w-9 h-9 rounded-lg bg-zinc-900 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-[18px] h-[18px] text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-[14px] text-zinc-900">{item.title}</div>
                    <div className="text-[13px] text-zinc-500">{item.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* 합격 릴레이 marquee */}
            <div className="mt-10">
              <p className="text-[11px] font-medium tracking-[0.14em] text-zinc-400 uppercase mb-3">
                합격 릴레이가 이어지는 학교
              </p>
              <Marquee duration={28}>
                {['연세대학교', '고려대학교', '성균관대학교', '서강대학교', '한양대학교', '중앙대학교', '경희대학교', '이화여자대학교', '서울시립대학교', '건국대학교'].map((u) => (
                  <span key={u} className="mx-6 text-[15px] font-semibold text-zinc-300 whitespace-nowrap select-none">
                    {u}
                  </span>
                ))}
              </Marquee>
            </div>
          </motion.div>

          {/* Right: Auth Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="p-8 bg-white shadow-xl rounded-2xl border-zinc-200/80">
              {/* Mobile logo */}
              <div className="lg:hidden flex items-center justify-center gap-2 mb-6">
                <div className="w-9 h-9 rounded-xl bg-zinc-900 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-semibold tracking-tight text-zinc-900">
                  Relay
                </span>
              </div>

              {/* Tab switcher */}
              <div className="flex bg-zinc-100 rounded-xl p-1 mb-8" role="tablist" aria-label="인증 방식 선택">
                {(['login', 'signup'] as const).map((tab) => (
                  <button
                    key={tab}
                    role="tab"
                    aria-selected={mode === tab}
                    onClick={() => setMode(tab)}
                    className={`flex-1 py-2.5 px-4 rounded-lg text-[13px] font-semibold transition-all ${
                      mode === tab
                        ? 'bg-white text-zinc-900 shadow-sm'
                        : 'text-zinc-500 hover:text-zinc-700'
                    }`}
                  >
                    {tab === 'login' ? '로그인' : '회원가입'}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.form
                  key={mode}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleSubmit}
                  className="space-y-5"
                  role="form"
                  aria-label={mode === 'login' ? '로그인 양식' : '회원가입 양식'}
                >
                  {mode === 'signup' && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">이름</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          placeholder="홍길동"
                          value={form.name}
                          onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                          className="pl-10 h-12 rounded-xl border-gray-200 focus:border-sky-400 focus:ring-sky-400/20"
                          aria-label="이름"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">이메일</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        type="email"
                        placeholder="email@example.com"
                        value={form.email}
                        onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                        className="pl-10 h-12 rounded-xl border-gray-200 focus:border-sky-400 focus:ring-sky-400/20"
                        aria-label="이메일"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">비밀번호</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="6자 이상 입력"
                        value={form.password}
                        onChange={(e) => setForm(prev => ({ ...prev, password: e.target.value }))}
                        className="pl-10 pr-10 h-12 rounded-xl border-gray-200 focus:border-sky-400 focus:ring-sky-400/20"
                        aria-label="비밀번호"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {mode === 'signup' && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">가입 유형</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { value: 'mentee', label: '멘티', desc: '편입 준비생', icon: Sparkles },
                          { value: 'mentor', label: '러너', desc: '편입 합격생', icon: Users },
                        ].map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => setForm(prev => ({ ...prev, role: option.value as any }))}
                            className={`p-4 rounded-xl border-2 transition-all text-left ${
                              form.role === option.value
                                ? 'border-sky-400 bg-sky-50'
                                : 'border-gray-200 bg-white hover:border-gray-300'
                            }`}
                            aria-pressed={form.role === option.value}
                            aria-label={`${option.label} (${option.desc})`}
                          >
                            <option.icon className={`w-5 h-5 mb-2 ${
                              form.role === option.value ? 'text-sky-600' : 'text-gray-400'
                            }`} />
                            <div className={`font-semibold text-sm ${
                              form.role === option.value ? 'text-sky-700' : 'text-gray-700'
                            }`}>
                              {option.label}
                            </div>
                            <div className="text-xs text-gray-500">{option.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={loading}
                    className="shine w-full h-12 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-[15px] shadow-sm"
                    aria-label={mode === 'login' ? '로그인' : '회원가입'}
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <span className="flex items-center gap-2">
                        {mode === 'login' ? '로그인' : '회원가입'}
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    )}
                  </Button>
                </motion.form>
              </AnimatePresence>

              {/* Guest mode — 가장 빠른 체험 경로를 보조 버튼으로 노출 */}
              <div className="mt-6 pt-6 border-t border-zinc-100">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-11 rounded-xl text-zinc-700"
                  onClick={() => {
                    onAuthSuccess(null, {
                      profile: { role: 'mentee', name: '게스트', onboardingCompleted: false },
                      credits: 5,
                    });
                    toast.info('게스트 모드로 접속합니다. 일부 기능이 제한됩니다.');
                  }}
                >
                  릴레이 체험하기
                </Button>
                <p className="text-[11px] text-zinc-400 text-center mt-2">
                  가입 없이 둘러보기 · 데이터는 저장되지 않아요
                </p>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}