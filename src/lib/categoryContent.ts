import type { Category } from '../components/GlobalNav';

export interface CategoryTheme {
  gradient: string;
  bgGradient: string;
  accent: string;
  accentLight: string;
  accentText: string;
  cardGradient1: string;
  cardGradient2: string;
  cardGradient3: string;
  buttonClass: string;
  headerGradient: string;
}

export interface SidebarExtra {
  iconName: string;
  label: string;
  screen: string;
  badge?: number;
  activeColor: string;
  activeBg: string;
  hoverBg: string;
}

export interface CardTheme {
  consultingIcon: string;
  consultingAccent: string;
  documentIcon: string;
  documentSteps: string[];
  runnerTitle: string;
  runnerAvatars: string[];
  runnerCount: number;
  runnerLabel: string;
}

export interface QuickStatConfig {
  iconName: string;
  iconColor: string;
  bgGradient: string;
  label: string;
  screen: string;
  valueKey: string;
}

export interface CategoryContent {
  label: string;
  greeting: string;
  searchPlaceholder: string;
  aiToolTitle: string;
  aiToolDescription: string;
  aiConsultingTitle: string;
  aiConsultingDescription: string;
  mentorLabel: string;
  mentorDescription: string;
  field1Label: string;
  field1Placeholder: string;
  field2Label: string;
  field2Placeholder: string;
  motivationLabel: string;
  motivationPlaceholder: string;
  keywordsLabel: string;
  keywordsPlaceholder: string;
  styleLabel: string;
  styleDescription: string;
  docLabel: string;
  successLabel: string;
  ctaBadges: string[];
  aiToolBadges: string[];
  mentorBadges: string[];
  seasonLabel: string;
  insights: string[];
  theme: CategoryTheme;
  sidebarExtras: SidebarExtra[];
  cardTheme: CardTheme;
  quickStats: QuickStatConfig[];
}

export const CATEGORY_CONTENT: Record<Category, CategoryContent> = {
  transfer: {
    label: '편입',
    greeting: '오늘의 릴레이, 어디까지 왔나요?',
    searchPlaceholder: '어떤 학교 편입을 준비하시나요?',
    aiToolTitle: 'AI 학업계획서 작성',
    aiToolDescription: '내 경험을 입력하면 AI가 합격 학계서 초안을 만들어드립니다',
    aiConsultingTitle: 'AI 맞춤 릴레이 컨설팅',
    aiConsultingDescription: '정형/비정형 정보를 분석하여 최적의 대학과 전공을 추천합니다',
    mentorLabel: '합격 러너',
    mentorDescription: 'AI가 분석한 나의 프로필에 최적화된 합격 러너를 추천합니다',
    field1Label: '지원 대학',
    field1Placeholder: '예: 연세대',
    field2Label: '학과',
    field2Placeholder: '예: 경영학과',
    motivationLabel: '편입 지원 동기',
    motivationPlaceholder: '예: 정치외교학을 전공하며 국제관계를 공부하던 중, 실제 기업의 글로벌 전략 수립에 관심이 생겼습니다...',
    keywordsLabel: '입학 후 학업 계획 키워드',
    keywordsPlaceholder: '예: 재무관리, 마케팅전략',
    styleLabel: '학계서 톤',
    styleDescription: '학업계획서 작성 스타일을 선택해주세요',
    docLabel: '내 AI 학업계획서',
    successLabel: '평균 합격률',
    ctaBadges: ['학교/학과 추천', '전형 분석', '입시 정보 제공'],
    aiToolBadges: ['5분 소요', '무료 1회', '맞춤 스토리라인'],
    mentorBadges: ['AI 기반 추천', '검증된 합격생', '실시간 매칭'],
    seasonLabel: '2025년 편입 시즌 기준',
    insights: [
      '러너와 3회 이상 세션 진행 시 합격률이 92%로 상승',
      'AI 학업계획서 + 러너 첨삭 병행 시 합격률 2.1배 증가',
      '골드 러너의 멘티 합격률이 평균 대비 8%p 높음',
      '학업계획서 3회 이상 수정 시 합격률 15%p 상승',
    ],
    theme: {
      gradient: 'from-indigo-500 to-purple-600',
      bgGradient: 'from-indigo-50 via-white to-purple-50',
      accent: 'indigo',
      accentLight: 'indigo-50',
      accentText: 'text-indigo-600',
      cardGradient1: 'from-indigo-900 via-purple-800 to-violet-900',
      cardGradient2: 'from-indigo-400 via-blue-400 to-purple-500',
      cardGradient3: 'from-purple-500 via-indigo-500 to-violet-600',
      buttonClass: 'bg-white text-indigo-700 hover:bg-indigo-50',
      headerGradient: 'from-indigo-600 via-purple-600 to-violet-600',
    },
    sidebarExtras: [
      { iconName: 'ClipboardList', label: '편입 요강', screen: 'admission-guide', activeColor: 'text-indigo-600', activeBg: 'from-indigo-50 to-indigo-50', hoverBg: 'hover:bg-indigo-50' },
      { iconName: 'BarChart3', label: '합격 예측', screen: 'grade-prediction', activeColor: 'text-purple-600', activeBg: 'from-purple-50 to-purple-50', hoverBg: 'hover:bg-purple-50' },
    ],
    cardTheme: {
      consultingIcon: 'Compass',
      consultingAccent: 'purple',
      documentIcon: 'FileEdit',
      documentSteps: ['경험 입력', '스토리라인', '학업계획서'],
      runnerTitle: '합격 선배 찾기',
      runnerAvatars: ['🎓', '👩‍🎓', '👨‍🎓'],
      runnerCount: 55,
      runnerLabel: '검증된 합격 선배',
    },
    quickStats: [
      { iconName: 'BookOpen', iconColor: 'text-purple-600', bgGradient: 'from-purple-100 to-purple-200', label: '내 AI 학업계획서', screen: 'ai-management', valueKey: 'draftCount' },
      { iconName: 'Calendar', iconColor: 'text-sky-600', bgGradient: 'from-sky-100 to-blue-200', label: '예정된 세션', screen: 'session-list', valueKey: 'sessionCount' },
      { iconName: 'ClipboardList', iconColor: 'text-indigo-600', bgGradient: 'from-indigo-100 to-indigo-200', label: '편입 요강', screen: 'admission-guide', valueKey: 'guideCount' },
      { iconName: 'TrendingUp', iconColor: 'text-green-600', bgGradient: 'from-green-100 to-green-200', label: '합격 예측', screen: 'grade-prediction', valueKey: 'successRate' },
    ],
  },
  admission: {
    label: '입시',
    greeting: '오늘의 릴레이, 어디까지 왔나요?',
    searchPlaceholder: '어떤 대학 입시를 준비하시나요?',
    aiToolTitle: 'AI 자소서 작성',
    aiToolDescription: '내 경험을 입력하면 AI가 합격 자소서 초안을 만들어드립니다',
    aiConsultingTitle: 'AI 맞춤 릴레이 컨설팅',
    aiConsultingDescription: '정형/비정형 정보를 분석하여 최적의 대학과 전공을 추천합니다',
    mentorLabel: '합격 러너',
    mentorDescription: 'AI가 분석한 나의 프로필에 최적화된 합격 러너를 추천합니다',
    field1Label: '지원 대학',
    field1Placeholder: '예: 서울대',
    field2Label: '학과',
    field2Placeholder: '예: 컴퓨터공학부',
    motivationLabel: '지원 동기',
    motivationPlaceholder: '예: 고등학교 시절부터 인공지능 분야에 깊은 관심을 가지고 있었습니다...',
    keywordsLabel: '입학 후 학업 계획 키워드',
    keywordsPlaceholder: '예: 인공지능, 알고리즘',
    styleLabel: '자소서 톤',
    styleDescription: '자기소개서 작성 스타일을 선택해주세요',
    docLabel: '내 AI 자소서',
    successLabel: '평균 합격률',
    ctaBadges: ['학교/학과 추천', '수시/정시 분석', '입시 정보 제공'],
    aiToolBadges: ['5분 소요', '무료 1회', '맞춤 스토리라인'],
    mentorBadges: ['AI 기반 추천', '검증된 합격생', '실시간 매칭'],
    seasonLabel: '2025년 입시 시즌 기준',
    insights: [
      '러너와 3회 이상 세션 진행 시 합격률이 90%로 상승',
      'AI 자소서 + 러너 첨삭 병행 시 합격률 1.8배 증가',
      '골드 러너의 멘티 합격률이 평균 대비 10%p 높음',
      '자소서 3회 이상 수정 시 합격률 12%p 상승',
    ],
    theme: {
      gradient: 'from-blue-500 to-sky-600',
      bgGradient: 'from-blue-50 via-white to-sky-50',
      accent: 'blue',
      accentLight: 'blue-50',
      accentText: 'text-blue-600',
      cardGradient1: 'from-blue-900 via-sky-800 to-blue-900',
      cardGradient2: 'from-blue-400 via-sky-400 to-cyan-500',
      cardGradient3: 'from-blue-500 via-sky-500 to-cyan-600',
      buttonClass: 'bg-white text-blue-700 hover:bg-blue-50',
      headerGradient: 'from-blue-600 via-sky-600 to-cyan-600',
    },
    sidebarExtras: [
      { iconName: 'FileText', label: '생기부 관리', screen: 'transcript-manager', activeColor: 'text-blue-600', activeBg: 'from-blue-50 to-blue-50', hoverBg: 'hover:bg-blue-50' },
      { iconName: 'Target', label: '수시/정시 전략', screen: 'admission-strategy', activeColor: 'text-sky-600', activeBg: 'from-sky-50 to-sky-50', hoverBg: 'hover:bg-sky-50' },
    ],
    cardTheme: {
      consultingIcon: 'Target',
      consultingAccent: 'sky',
      documentIcon: 'PenTool',
      documentSteps: ['활동 입력', '스토리라인', '자소서 완성'],
      runnerTitle: '입시 선배 찾기',
      runnerAvatars: ['📚', '👩‍🎓', '👨‍🎓'],
      runnerCount: 48,
      runnerLabel: '검증된 합격 선배',
    },
    quickStats: [
      { iconName: 'BookOpen', iconColor: 'text-blue-600', bgGradient: 'from-blue-100 to-blue-200', label: '내 AI 자소서', screen: 'ai-management', valueKey: 'draftCount' },
      { iconName: 'Calendar', iconColor: 'text-sky-600', bgGradient: 'from-sky-100 to-sky-200', label: '예정된 세션', screen: 'session-list', valueKey: 'sessionCount' },
      { iconName: 'FileText', iconColor: 'text-cyan-600', bgGradient: 'from-cyan-100 to-cyan-200', label: '생기부 활동', screen: 'transcript-manager', valueKey: 'activityCount' },
      { iconName: 'Target', iconColor: 'text-indigo-600', bgGradient: 'from-indigo-100 to-indigo-200', label: '수시/정시 전략', screen: 'admission-strategy', valueKey: 'strategyCount' },
    ],
  },
  career: {
    label: '취업',
    greeting: '오늘의 릴레이, 어디까지 왔나요?',
    searchPlaceholder: '어떤 회사/직무를 준비하시나요?',
    aiToolTitle: 'AI 자소서 작성',
    aiToolDescription: '내 경험을 입력하면 AI가 합격 자소서 초안을 만들어드립니다',
    aiConsultingTitle: 'AI 맞춤 릴레이 컨설팅',
    aiConsultingDescription: '정형/비정형 정보를 분석하여 최적의 기업과 직무를 추천합니다',
    mentorLabel: '현직자 러너',
    mentorDescription: 'AI가 분석한 나의 프로필에 최적화된 현직자 러너를 추천합니다',
    field1Label: '지원 회사',
    field1Placeholder: '예: 삼성전자',
    field2Label: '직무',
    field2Placeholder: '예: 소프트웨어 개발',
    motivationLabel: '입사 지원 동기',
    motivationPlaceholder: '예: 대학에서 소프트웨어 공학을 전공하며 실무 프로젝트를 통해 개발 역량을 키웠습니다...',
    keywordsLabel: '입사 후 목표 키워드',
    keywordsPlaceholder: '예: 프로젝트 매니징, 기술 리더십',
    styleLabel: '자소서 톤',
    styleDescription: '자기소개서 작성 스타일을 선택해주세요',
    docLabel: '내 AI 자소서',
    successLabel: '평균 취업률',
    ctaBadges: ['기업/직무 추천', '채용 분석', '취업 정보 제공'],
    aiToolBadges: ['5분 소요', '무료 1회', '맞춤 스토리라인'],
    mentorBadges: ['AI 기반 추천', '검증된 현직자', '실시간 매칭'],
    seasonLabel: '2025년 채용 시즌 기준',
    insights: [
      '러너와 3회 이상 세션 진행 시 취업률이 88%로 상승',
      'AI 자소서 + 러너 첨삭 병행 시 서류 통과율 2.3배 증가',
      '골드 러너의 멘티 취업률이 평균 대비 12%p 높음',
      '자소서 3회 이상 수정 시 서류 통과율 20%p 상승',
    ],
    theme: {
      gradient: 'from-slate-700 to-zinc-800',
      bgGradient: 'from-slate-50 via-white to-gray-50',
      accent: 'slate',
      accentLight: 'slate-50',
      accentText: 'text-slate-700',
      cardGradient1: 'from-slate-800 via-gray-800 to-zinc-900',
      cardGradient2: 'from-slate-500 via-gray-500 to-zinc-600',
      cardGradient3: 'from-slate-600 via-gray-600 to-zinc-700',
      buttonClass: 'bg-white text-slate-700 hover:bg-slate-50',
      headerGradient: 'from-slate-700 via-gray-700 to-zinc-700',
    },
    sidebarExtras: [
      { iconName: 'Briefcase', label: '포지션 보드', screen: 'job-board', activeColor: 'text-slate-700', activeBg: 'from-slate-50 to-slate-50', hoverBg: 'hover:bg-slate-50' },
      { iconName: 'Mic', label: '면접 연습', screen: 'mock-interview', activeColor: 'text-gray-600', activeBg: 'from-gray-50 to-gray-50', hoverBg: 'hover:bg-gray-50' },
    ],
    cardTheme: {
      consultingIcon: 'Briefcase',
      consultingAccent: 'slate',
      documentIcon: 'FileText',
      documentSteps: ['경력 입력', '역량 분석', '자소서 완성'],
      runnerTitle: '현직자 찾기',
      runnerAvatars: ['💼', '👩‍💻', '👨‍💼'],
      runnerCount: 42,
      runnerLabel: '검증된 현직자',
    },
    quickStats: [
      { iconName: 'BookOpen', iconColor: 'text-slate-600', bgGradient: 'from-slate-100 to-slate-200', label: '내 AI 자소서', screen: 'ai-management', valueKey: 'draftCount' },
      { iconName: 'Calendar', iconColor: 'text-sky-600', bgGradient: 'from-sky-100 to-blue-200', label: '예정된 세션', screen: 'session-list', valueKey: 'sessionCount' },
      { iconName: 'Briefcase', iconColor: 'text-gray-700', bgGradient: 'from-gray-100 to-gray-200', label: '채용 공고', screen: 'job-board', valueKey: 'jobCount' },
      { iconName: 'Mic', iconColor: 'text-zinc-600', bgGradient: 'from-zinc-100 to-zinc-200', label: '면접 연습', screen: 'mock-interview', valueKey: 'interviewCount' },
    ],
  },
  certification: {
    label: '자격증',
    greeting: '오늘의 릴레이, 어디까지 왔나요?',
    searchPlaceholder: '어떤 자격증/공모전을 준비하시나요?',
    aiToolTitle: 'AI 포트폴리오 작성',
    aiToolDescription: '내 경험을 입력하면 AI가 포트폴리오 초안을 만들어드립니다',
    aiConsultingTitle: 'AI 맞춤 릴레이 컨설팅',
    aiConsultingDescription: '정형/비정형 정보를 분석하여 최적의 자격증과 전략을 추천합니다',
    mentorLabel: '합격자 러너',
    mentorDescription: 'AI가 분석한 나의 프로필에 최적화된 합격자 러너를 추천합니다',
    field1Label: '자격증/공모전명',
    field1Placeholder: '예: CPA, 한국사능력검정',
    field2Label: '분야',
    field2Placeholder: '예: 회계, 역사',
    motivationLabel: '준비 동기',
    motivationPlaceholder: '예: 회계 분야에서 전문성을 인정받기 위해 CPA 시험을 준비하고 있습니다...',
    keywordsLabel: '합격 후 목표 키워드',
    keywordsPlaceholder: '예: 감사법인, 세무컨설팅',
    styleLabel: '포트폴리오 톤',
    styleDescription: '포트폴리오 작성 스타일을 선택해주세요',
    docLabel: '내 AI 포트폴리오',
    successLabel: '평균 합격률',
    ctaBadges: ['자격증 추천', '시험 분석', '학습 전략 제공'],
    aiToolBadges: ['5분 소요', '무료 1회', '맞춤 스토리라인'],
    mentorBadges: ['AI 기반 추천', '검증된 합격자', '실시간 매칭'],
    seasonLabel: '2025년 시험 시즌 기준',
    insights: [
      '러너와 3회 이상 세션 진행 시 합격률이 85%로 상승',
      'AI 포트폴리오 + 러너 피드백 병행 시 합격률 1.9배 증가',
      '골드 러너의 멘티 합격률이 평균 대비 9%p 높음',
      '학습 계획 3회 이상 수정 시 합격률 13%p 상승',
    ],
    theme: {
      gradient: 'from-amber-500 to-orange-500',
      bgGradient: 'from-amber-50 via-white to-orange-50',
      accent: 'amber',
      accentLight: 'amber-50',
      accentText: 'text-amber-600',
      cardGradient1: 'from-amber-800 via-orange-800 to-red-900',
      cardGradient2: 'from-amber-400 via-orange-400 to-yellow-500',
      cardGradient3: 'from-amber-500 via-orange-500 to-red-500',
      buttonClass: 'bg-white text-amber-700 hover:bg-amber-50',
      headerGradient: 'from-amber-600 via-orange-600 to-red-600',
    },
    sidebarExtras: [
      { iconName: 'CalendarDays', label: '시험 일정', screen: 'exam-calendar', activeColor: 'text-amber-600', activeBg: 'from-amber-50 to-amber-50', hoverBg: 'hover:bg-amber-50' },
      { iconName: 'BookMarked', label: '학습 플래너', screen: 'study-planner', activeColor: 'text-orange-600', activeBg: 'from-orange-50 to-orange-50', hoverBg: 'hover:bg-orange-50' },
    ],
    cardTheme: {
      consultingIcon: 'Award',
      consultingAccent: 'amber',
      documentIcon: 'BookOpen',
      documentSteps: ['경험 입력', '구성 분석', '포트폴리오'],
      runnerTitle: '합격자 찾기',
      runnerAvatars: ['📋', '👩‍💼', '👨‍🎓'],
      runnerCount: 38,
      runnerLabel: '검증된 합격자',
    },
    quickStats: [
      { iconName: 'BookOpen', iconColor: 'text-amber-600', bgGradient: 'from-amber-100 to-amber-200', label: '내 AI 포트폴리오', screen: 'ai-management', valueKey: 'draftCount' },
      { iconName: 'Calendar', iconColor: 'text-sky-600', bgGradient: 'from-sky-100 to-blue-200', label: '예정된 세션', screen: 'session-list', valueKey: 'sessionCount' },
      { iconName: 'CalendarDays', iconColor: 'text-orange-600', bgGradient: 'from-orange-100 to-orange-200', label: 'D-Day 시험', screen: 'exam-calendar', valueKey: 'examCount' },
      { iconName: 'BookMarked', iconColor: 'text-red-600', bgGradient: 'from-red-100 to-red-200', label: '학습 진도', screen: 'study-planner', valueKey: 'studyProgress' },
    ],
  },
  other: {
    label: '기타',
    greeting: '오늘의 릴레이, 어디까지 왔나요?',
    searchPlaceholder: '어떤 목표를 준비하시나요?',
    aiToolTitle: 'AI 문서 작성',
    aiToolDescription: '내 경험을 입력하면 AI가 맞춤 문서 초안을 만들어드립니다',
    aiConsultingTitle: 'AI 맞춤 릴레이 컨설팅',
    aiConsultingDescription: '정형/비정형 정보를 분석하여 최적의 경로를 추천합니다',
    mentorLabel: '경험자 러너',
    mentorDescription: 'AI가 분석한 나의 프로필에 최적화된 경험자 러너를 추천합니다',
    field1Label: '목표',
    field1Placeholder: '예: 유학, 대학원 진학',
    field2Label: '분야',
    field2Placeholder: '예: 경영학, 공학',
    motivationLabel: '준비 동기',
    motivationPlaceholder: '예: 해외 대학원에서 심도 있는 연구를 진행하고 싶습니다...',
    keywordsLabel: '목표 달성 후 계획 키워드',
    keywordsPlaceholder: '예: 해외취업, 연구개발',
    styleLabel: '문서 톤',
    styleDescription: '문서 작성 스타일을 선택해주세요',
    docLabel: '내 AI 문서',
    successLabel: '평균 성공률',
    ctaBadges: ['맞춤 추천', '경로 분석', '정보 제공'],
    aiToolBadges: ['5분 소요', '무료 1회', '맞춤 스토리라인'],
    mentorBadges: ['AI 기반 추천', '검증된 경험자', '실시간 매칭'],
    seasonLabel: '2025년 기준',
    insights: [
      '러너와 3회 이상 세션 진행 시 성공률이 85%로 상승',
      'AI 문서 + 러너 피드백 병행 시 성공률 1.7배 증가',
      '골드 러너의 멘티 성공률이 평균 대비 7%p 높음',
      '계획서 3회 이상 수정 시 성공률 10%p 상승',
    ],
    theme: {
      gradient: 'from-rose-500 to-pink-600',
      bgGradient: 'from-rose-50 via-white to-pink-50',
      accent: 'rose',
      accentLight: 'rose-50',
      accentText: 'text-rose-600',
      cardGradient1: 'from-rose-900 via-pink-800 to-fuchsia-900',
      cardGradient2: 'from-rose-400 via-pink-400 to-fuchsia-500',
      cardGradient3: 'from-rose-500 via-pink-500 to-fuchsia-600',
      buttonClass: 'bg-white text-rose-700 hover:bg-rose-50',
      headerGradient: 'from-rose-600 via-pink-600 to-fuchsia-600',
    },
    sidebarExtras: [
      { iconName: 'Map', label: '로드맵', screen: 'roadmap', activeColor: 'text-rose-600', activeBg: 'from-rose-50 to-rose-50', hoverBg: 'hover:bg-rose-50' },
      { iconName: 'Lightbulb', label: '경험 공유', screen: 'community', activeColor: 'text-pink-600', activeBg: 'from-pink-50 to-pink-50', hoverBg: 'hover:bg-pink-50' },
    ],
    cardTheme: {
      consultingIcon: 'MapPin',
      consultingAccent: 'rose',
      documentIcon: 'File',
      documentSteps: ['정보 입력', '분석', '문서 완성'],
      runnerTitle: '경험자 찾기',
      runnerAvatars: ['🌍', '👩‍💻', '👨‍💼'],
      runnerCount: 35,
      runnerLabel: '검증된 경험자',
    },
    quickStats: [
      { iconName: 'BookOpen', iconColor: 'text-rose-600', bgGradient: 'from-rose-100 to-rose-200', label: '내 AI 문서', screen: 'ai-management', valueKey: 'draftCount' },
      { iconName: 'Calendar', iconColor: 'text-sky-600', bgGradient: 'from-sky-100 to-blue-200', label: '예정된 세션', screen: 'session-list', valueKey: 'sessionCount' },
      { iconName: 'Map', iconColor: 'text-pink-600', bgGradient: 'from-pink-100 to-pink-200', label: '로드맵', screen: 'roadmap', valueKey: 'roadmapCount' },
      { iconName: 'Lightbulb', iconColor: 'text-fuchsia-600', bgGradient: 'from-fuchsia-100 to-fuchsia-200', label: '경험 후기', screen: 'community', valueKey: 'communityCount' },
    ],
  },
};
