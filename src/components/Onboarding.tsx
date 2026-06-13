import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { FadeIn, Stagger, Press } from './ui/motion';
import { Sparkles, Zap, Rocket } from 'lucide-react';
import type { UserRole } from '../App';

interface OnboardingProps {
  onComplete: (role: UserRole) => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleContinue = () => {
    if (!selectedRole) return;
    setIsTransitioning(true);
    setTimeout(() => {
      onComplete(selectedRole);
    }, 800);
  };

  const roles = [
    {
      id: 'mentee' as UserRole,
      icon: Sparkles,
      title: '멘티',
      subtitle: 'AI로 시작하는 편입 준비',
      description: 'AI 학업계획서 작성부터 합격생 릴레이 세션까지',
      gradient: 'from-zinc-900 to-iris-800',
      bgGradient: 'from-iris-50 to-iris-100',
    },
    {
      id: 'mentor' as UserRole,
      icon: Rocket,
      title: '러너',
      subtitle: '경험을 나누고 수익 창출',
      description: '편입 합격 경험을 활용한 전문 릴레이 세션',
      gradient: 'from-zinc-900 to-iris-800',
      bgGradient: 'from-iris-50 to-iris-100',
    },
    {
      id: 'admin' as UserRole,
      icon: Zap,
      title: '관리자',
      subtitle: '플랫폼 관리',
      description: '러너 승인 및 플랫폼 운영',
      gradient: 'from-zinc-900 to-iris-800',
      bgGradient: 'from-iris-50 to-iris-100',
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 relative overflow-hidden">
      {/* Subtle background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-iris-100/30 rounded-full blur-2xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-zinc-100/50 rounded-full blur-2xl" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-6xl">
          <AnimatePresence mode="wait">
            {!isTransitioning ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
              >
                {/* Header */}
                <div className="text-center mb-12">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-zinc-900 to-iris-800 mb-6 shadow-lg"
                  >
                    <Sparkles className="w-10 h-10 text-white" />
                  </motion.div>
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-5xl md:text-7xl font-semibold tracking-tight mb-4 text-zinc-900"
                  >
                    Relay
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-xl md:text-2xl text-zinc-600 max-w-2xl mx-auto"
                  >
                    AI가 만드는 학업계획서, 합격생이 완성하는 편입 스토리
                  </motion.p>
                </div>

                {/* Role Cards */}
                <Stagger delay={0.4} className="grid md:grid-cols-3 gap-6 mb-8">
                  {roles.map((role) => {
                    const Icon = role.icon;
                    const isSelected = selectedRole === role.id;

                    return (
                      <Stagger.Item key={role.id}>
                        <Press>
                          <button
                            onClick={() => setSelectedRole(role.id)}
                            className={`
                              relative w-full p-8 rounded-2xl border transition-all duration-300
                              ${isSelected
                                ? `border-transparent shadow-lg bg-gradient-to-br ${role.gradient}`
                                : 'border-zinc-200/80 bg-white hover:shadow-md'
                              }
                            `}
                          >
                            <div className="relative">
                              {/* Icon */}
                              <div className={`
                                w-16 h-16 rounded-xl flex items-center justify-center mb-6 mx-auto
                                ${isSelected
                                  ? 'bg-white/15 backdrop-blur-sm'
                                  : `bg-gradient-to-br ${role.bgGradient}`
                                }
                              `}>
                                <Icon className={`w-8 h-8 ${isSelected ? 'text-white' : 'text-iris-600'}`} />
                              </div>

                              {/* Content */}
                              <div className={`transition-colors ${isSelected ? 'text-white' : 'text-zinc-900'}`}>
                                <h3 className="text-2xl font-semibold tracking-tight mb-2">{role.title}</h3>
                                <p className={`text-sm font-medium mb-3 ${isSelected ? 'text-white/90' : 'text-zinc-600'}`}>
                                  {role.subtitle}
                                </p>
                                <p className={`text-sm ${isSelected ? 'text-white/80' : 'text-zinc-400'}`}>
                                  {role.description}
                                </p>
                              </div>

                              {/* Checkmark */}
                              <AnimatePresence>
                                {isSelected && (
                                  <motion.div
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    exit={{ scale: 0, rotate: 180 }}
                                    transition={{ type: 'spring', stiffness: 200 }}
                                    className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md"
                                  >
                                    <svg className="w-5 h-5 text-iris-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </button>
                        </Press>
                      </Stagger.Item>
                    );
                  })}
                </Stagger>

                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="text-center"
                >
                  <Button
                    onClick={handleContinue}
                    disabled={!selectedRole}
                    className={`
                      h-16 px-12 rounded-xl text-lg font-semibold
                      transition-all duration-300
                      ${selectedRole
                        ? 'bg-zinc-900 text-white hover:bg-zinc-800'
                        : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                      }
                    `}
                  >
                    {selectedRole ? '시작하기' : '역할을 선택하세요'}
                    {selectedRole && <Sparkles className="ml-2 w-5 h-5" />}
                  </Button>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20"
              >
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-zinc-900 to-iris-800 mb-6 shadow-lg animate-pulse-glow">
                  <Sparkles className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-3xl font-semibold tracking-tight text-zinc-900">환영합니다!</h2>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
