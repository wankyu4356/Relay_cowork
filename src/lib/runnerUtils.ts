// 러너 ID 기반 아바타 타일 유틸 — 이모지 없이 절제된 프리미엄 팔레트로 표현
// 렌더링은 src/components/ui/runner-avatar.tsx 의 <RunnerAvatar> 를 사용한다.

function runnerNum(runnerName: string): number {
  const match = runnerName?.match(/#(\d+)/);
  if (match) return parseInt(match[1], 10);
  // 이름 문자열 해시 (러너 번호가 없는 일반 사용자용)
  let h = 0;
  for (const ch of runnerName || '') h = (h * 31 + ch.charCodeAt(0)) | 0;
  return Math.abs(h);
}

// 절제된 프리미엄 틴트 — iris 중심의 딥 그라데이션 4종
export function getRunnerColor(runnerName: string): string {
  const palettes = [
    'bg-gradient-to-br from-zinc-900 to-iris-700',
    'bg-gradient-to-br from-iris-800 to-iris-600',
    'bg-gradient-to-br from-zinc-800 to-zinc-600',
    'bg-gradient-to-br from-iris-900 to-zinc-700',
  ];
  return palettes[runnerNum(runnerName) % palettes.length];
}

// 러너 번호 마지막 두 자리 모노그램 (예: "러너 #2847" → "47")
export function getRunnerInitials(runnerName: string): string {
  const match = runnerName?.match(/#(\d+)/);
  if (match) return match[1].slice(-2);
  return (runnerName || 'R').trim().charAt(0).toUpperCase() || 'R';
}

/** @deprecated 이모지 아바타는 폐지됨 — <RunnerAvatar> 컴포넌트를 사용하세요. */
export function getRunnerAvatar(_runnerName: string): string {
  return '';
}
