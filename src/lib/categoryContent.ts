import type { Category } from '../components/GlobalNav';

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
  },
};
