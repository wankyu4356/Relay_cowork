import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
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
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-20 left-10 w-72 h-72 bg-sky-200/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -20, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-100/20 rounded-full blur-3xl"
        />
      </div>

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
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="inline-flex items-center gap-2 mb-6"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-200">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <span className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                  Relay
                </span>
              </motion.div>

              <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                성공의 경험을<br />
                <span className="bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">
                  다음 세대로 이어갑니다
                </span>
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                편입·취업·자격증·대학원까지, AI 첨삭과 선배 릴레이 세션으로<br />
                릴레이에서 당신의 성공 바톤을 이어받으세요.
              </p>
            </div>

            <div className="space-y-4">
              {[
                { icon: Sparkles, title: 'AI 바통 작성', desc: 'AI 기반 맞춤형 초안 자동 생성' },
                { icon: Users, title: '1:1 러너 매칭', desc: '검증된 합격생과 익명 기반 연결' },
                { icon: Shield, title: '프라이버시 보호', desc: '러너 #XXXX 익명 시스템 적용' },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.15 }}
                  className="flex items-start gap-3 p-3 rounded-xl bg-white/60 backdrop-blur-sm border border-white/80"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-100 to-blue-100 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-sky-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{item.title}</div>
                    <div className="text-sm text-gray-500">{item.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: Auth Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="p-8 bg-white/80 backdrop-blur-xl border border-white/60 shadow-xl shadow-sky-100/50 rounded-3xl">
              {/* Mobile logo */}
              <div className="lg:hidden flex items-center justify-center gap-2 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                  Relay
                </span>
              </div>

              {/* Tab switcher */}
              <div className="flex bg-gray-100 rounded-2xl p-1 mb-8" role="tablist" aria-label="인증 방식 선택">
                {(['login', 'signup'] as const).map((tab) => (
                  <button
                    key={tab}
                    role="tab"
                    aria-selected={mode === tab}
                    onClick={() => setMode(tab)}
                    className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all ${
                      mode === tab
                        ? 'bg-white text-sky-600 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
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
                    className="w-full h-12 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-semibold text-base shadow-lg shadow-sky-200/50"
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

              {/* Demo account hint */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-xs text-gray-400 text-center mb-3">빠른 체험</p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs rounded-lg h-9"
                    onClick={() => {
                      setMode('login');
                      setForm(prev => ({ ...prev, email: 'demo@relay.kr', password: 'demo1234' }));
                    }}
                  >
                    <Badge variant="secondary" className="mr-1 text-[10px] px-1.5">멘티</Badge>
                    데모 계정
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs rounded-lg h-9"
                    onClick={() => {
                      setMode('login');
                      setForm(prev => ({ ...prev, email: 'mentor@relay.kr', password: 'mentor1234' }));
                    }}
                  >
                    <Badge variant="secondary" className="mr-1 text-[10px] px-1.5">러너</Badge>
                    데모 계정
                  </Button>
                </div>
              </div>

              {/* Skip auth for demo */}
              <div className="mt-4 text-center">
                <button
                  onClick={() => {
                    onAuthSuccess(null, {
                      profile: { role: 'mentee', name: '게스트', onboardingCompleted: false },
                      credits: 5,
                    });
                    toast.info('게스트 모드로 접속합니다. 일부 기능이 제한됩니다.');
                  }}
                  className="text-xs text-gray-400 hover:text-gray-600 underline underline-offset-2"
                >
                  릴레이 체험하기
                </button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}