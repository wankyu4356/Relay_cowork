import { GraduationCap, User, ShieldCheck } from 'lucide-react';
import { getRunnerColor, getRunnerInitials } from '../../lib/runnerUtils';

/**
 * RELAY · 아바타 타일 (이모지 대체)
 *
 * 러너/사용자를 절제된 그라데이션 타일 + 아이콘/모노그램으로 표현한다.
 * 이름(러너 #XXXX)에서 틴트가 결정되므로 같은 러너는 항상 같은 색.
 */

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const SIZE: Record<Size, { box: string; icon: string; text: string; radius: string }> = {
  xs: { box: 'w-8 h-8',   icon: 'w-4 h-4',   text: 'text-[10px]', radius: 'rounded-lg' },
  sm: { box: 'w-10 h-10', icon: 'w-5 h-5',   text: 'text-[11px]', radius: 'rounded-xl' },
  md: { box: 'w-12 h-12', icon: 'w-6 h-6',   text: 'text-xs',     radius: 'rounded-xl' },
  lg: { box: 'w-16 h-16', icon: 'w-7 h-7',   text: 'text-sm',     radius: 'rounded-2xl' },
  xl: { box: 'w-20 h-20', icon: 'w-9 h-9',   text: 'text-base',   radius: 'rounded-2xl' },
};

interface RunnerAvatarProps {
  /** 표시 대상 이름 — "러너 #2847" 형식이면 번호 기반 틴트/모노그램 */
  name?: string;
  size?: Size;
  /** runner: 학사모 아이콘 · user: 사람 아이콘 · admin: 방패 · monogram: 번호 모노그램 */
  variant?: 'runner' | 'user' | 'admin' | 'monogram';
  className?: string;
}

export function RunnerAvatar({ name = '', size = 'md', variant = 'runner', className = '' }: RunnerAvatarProps) {
  const s = SIZE[size];
  const tint = getRunnerColor(name);

  return (
    <div
      aria-hidden
      className={`${s.box} ${s.radius} ${tint} flex items-center justify-center text-white shadow-sm ring-1 ring-black/5 flex-shrink-0 ${className}`}
    >
      {variant === 'monogram' ? (
        <span className={`${s.text} font-semibold tracking-wide tnum`}>{getRunnerInitials(name)}</span>
      ) : variant === 'user' ? (
        <User className={s.icon} strokeWidth={1.75} />
      ) : variant === 'admin' ? (
        <ShieldCheck className={s.icon} strokeWidth={1.75} />
      ) : (
        <GraduationCap className={s.icon} strokeWidth={1.75} />
      )}
    </div>
  );
}
