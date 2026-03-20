// 러너 ID에서 번호 추출 및 색상 매핑
export function getRunnerColor(runnerName: string): string {
  // "러너 #2847" 형식에서 숫자 추출
  const match = runnerName.match(/#(\d+)/);
  if (!match) return 'bg-gray-500'; // fallback
  
  const num = parseInt(match[1]);
  
  // 색상 팔레트 (하늘색 계열 유지하면서 구분 가능하게)
  const colors = [
    'bg-gradient-to-br from-sky-400 to-blue-500',      // 스카이블루
    'bg-gradient-to-br from-cyan-400 to-teal-500',     // 사이언
    'bg-gradient-to-br from-indigo-400 to-purple-500', // 인디고
    'bg-gradient-to-br from-blue-400 to-indigo-500',   // 블루
    'bg-gradient-to-br from-teal-400 to-cyan-500',     // 틸
    'bg-gradient-to-br from-violet-400 to-purple-500', // 바이올렛
    'bg-gradient-to-br from-emerald-400 to-teal-500',  // 에메랄드
    'bg-gradient-to-br from-rose-400 to-pink-500',     // 로즈
    'bg-gradient-to-br from-amber-400 to-orange-500',  // 앰버
    'bg-gradient-to-br from-lime-400 to-green-500',    // 라임
  ];
  
  return colors[num % colors.length];
}

// 러너 ID에서 이니셜 생성 (아바타가 없을 때 표시)
export function getRunnerInitials(runnerName: string): string {
  const match = runnerName.match(/#(\d+)/);
  if (!match) return 'R';
  
  const num = match[1];
  // 마지막 두 자리만 표시
  return '#' + num.slice(-2);
}

// 고유 아바타 이모지 생성 (번호에 따라 다양한 아바타)
export function getRunnerAvatar(runnerName: string): string {
  const match = runnerName.match(/#(\d+)/);
  if (!match) return '👤';
  
  const num = parseInt(match[1]);
  
  const avatars = [
    '👨‍🎓', '👩‍🎓', '👨‍💼', '👩‍💼', '👨‍🔬', 
    '👩‍🔬', '👨‍💻', '👩‍💻', '👨‍🎨', '👩‍🎨',
    '🧑‍🎓', '🧑‍💼', '🧑‍🔬', '🧑‍💻', '🧑‍🎨',
  ];
  
  return avatars[num % avatars.length];
}
