export type AdmissionMode = '수시' | '정시';

export interface AdmissionFormData {
  mode: AdmissionMode;
  // 수시 fields
  highSchool?: string;
  gpaGrade?: string;
  extracurriculars?: string;
  essayKeywords?: string;
  // 정시 fields
  koreanScore?: number;
  mathScore?: number;
  englishGrade?: number;
  inquiry1Score?: number;
  inquiry2Score?: number;
  // shared
  targetField?: string;
  strengths?: string;
  goals?: string;
}

export interface AdmissionRecommendation {
  id: string;
  name: string;
  department: string;
  matchScore: number;
  admissionType: string;
  group: '가군' | '나군' | '다군' | '수시';
  cutoffScore: number;
  competitionRate: string;
  successRate: string;
  strengths: string[];
  requirements: string[];
  recentTrends: string;
  historicalCutoffs: Array<{ year: string; score: number }>;
  competitionTrend: Array<{ year: string; rate: number }>;
}

export interface AdmissionAlternative {
  name: string;
  institutions: string[] | string;
  matchScore: number;
}

export const admissionConfig = {
  pageTitle: 'AI 맞춤 입시 추천',
  pageSubtitle: '학생의 역량과 성적을 분석하여 최적의 대학과 전형을 추천합니다',
  analyzingSteps: [
    '📊 학업 역량 분석 중...',
    '🎯 비교과 활동 평가 중...',
    '🏫 대학별 매칭 분석 중...',
    '📋 입시 전략 수립 중...',
  ],
};

export const mockAdmissionRecommendations: AdmissionRecommendation[] = [
  {
    id: 'snu-cse',
    name: '서울대학교',
    department: '컴퓨터공학부',
    matchScore: 92,
    admissionType: '수시 일반전형',
    group: '수시',
    cutoffScore: 1.2,
    competitionRate: '6.8:1',
    successRate: '14.7%',
    strengths: [
      '국내 최고 수준의 컴퓨터공학 교육',
      '우수한 연구 인프라 및 산학협력',
      '폭넓은 커리큘럼과 자유로운 학풍',
      '글로벌 네트워크와 교환학생 프로그램',
    ],
    requirements: [
      '내신 1등급대 권장',
      '수학/과학 교과 우수 성적',
      '정보 관련 비교과 활동 실적',
      '자기소개서 논리적 작성 필수',
    ],
    recentTrends: '최근 AI/데이터사이언스 관련 지원자 급증으로 경쟁률이 상승 추세입니다. 비교과 활동의 질적 평가가 강화되고 있습니다.',
    historicalCutoffs: [
      { year: '2023', score: 1.3 },
      { year: '2024', score: 1.25 },
      { year: '2025', score: 1.2 },
    ],
    competitionTrend: [
      { year: '2023', rate: 5.9 },
      { year: '2024', rate: 6.3 },
      { year: '2025', rate: 6.8 },
    ],
  },
  {
    id: 'yonsei-cs',
    name: '연세대학교',
    department: '컴퓨터과학과',
    matchScore: 88,
    admissionType: '정시 일반전형',
    group: '가군',
    cutoffScore: 289,
    competitionRate: '5.2:1',
    successRate: '19.2%',
    strengths: [
      '실무 중심의 교육과정 운영',
      '언더우드 국제대학과 연계 프로그램',
      '강남권 캠퍼스 접근성 우수',
      '활발한 창업 지원 및 인큐베이팅',
    ],
    requirements: [
      '국수영탐 합산 289점 이상 권장',
      '수학 영역 상위 성적 필요',
      '영어 1~2등급 유지',
      '탐구 과목 조합 전략 필요',
    ],
    recentTrends: '정시 선발 비율이 확대되면서 수능 성적 중심의 선발이 강화되고 있습니다. 수학 반영 비율이 높아 수학 성적이 핵심입니다.',
    historicalCutoffs: [
      { year: '2023', score: 285 },
      { year: '2024', score: 287 },
      { year: '2025', score: 289 },
    ],
    competitionTrend: [
      { year: '2023', rate: 4.5 },
      { year: '2024', rate: 4.8 },
      { year: '2025', rate: 5.2 },
    ],
  },
  {
    id: 'kaist-cs',
    name: 'KAIST',
    department: '전산학부',
    matchScore: 85,
    admissionType: '수시 학교장추천전형',
    group: '수시',
    cutoffScore: 1.5,
    competitionRate: '8.1:1',
    successRate: '12.3%',
    strengths: [
      '세계적 수준의 이공계 연구 환경',
      '전액 장학금 및 생활비 지원',
      '자유로운 학과 선택 및 복수전공',
      '산업계와 긴밀한 연구 협력',
    ],
    requirements: [
      '수학/과학 교과 최상위 성적',
      '학교장 추천서 필수',
      '과학 경시대회 수상 실적 우대',
      '면접 및 구술고사 대비 필요',
    ],
    recentTrends: 'AI/반도체 분야 국가 정책에 따라 정원이 확대되고 있으며, 창의적 문제 해결 능력을 중시하는 면접 비중이 높아졌습니다.',
    historicalCutoffs: [
      { year: '2023', score: 1.6 },
      { year: '2024', score: 1.55 },
      { year: '2025', score: 1.5 },
    ],
    competitionTrend: [
      { year: '2023', rate: 7.2 },
      { year: '2024', rate: 7.6 },
      { year: '2025', rate: 8.1 },
    ],
  },
  {
    id: 'korea-cs',
    name: '고려대학교',
    department: '컴퓨터학과',
    matchScore: 86,
    admissionType: '정시 일반전형',
    group: '나군',
    cutoffScore: 286,
    competitionRate: '4.9:1',
    successRate: '20.4%',
    strengths: [
      '탄탄한 동문 네트워크',
      '산업계 취업률 최상위',
      '안암 캠퍼스의 우수한 학습 환경',
      '다양한 융합 전공 프로그램',
    ],
    requirements: [
      '국수영탐 합산 286점 이상 권장',
      '수학 영역 안정적 성적 필요',
      '영어 2등급 이내 유지',
      '탐구 2과목 모두 높은 점수',
    ],
    recentTrends: '사이버보안, AI 관련 세부 트랙이 신설되면서 지원자 관심이 높아지고 있습니다. 나군 경쟁에서 유리한 포지션을 확보하고 있습니다.',
    historicalCutoffs: [
      { year: '2023', score: 282 },
      { year: '2024', score: 284 },
      { year: '2025', score: 286 },
    ],
    competitionTrend: [
      { year: '2023', rate: 4.2 },
      { year: '2024', rate: 4.5 },
      { year: '2025', rate: 4.9 },
    ],
  },
];

export const mockAdmissionAlternatives: AdmissionAlternative[] = [
  {
    name: '전기전자공학부',
    institutions: ['서울대', '연세대', 'KAIST', '성균관대'],
    matchScore: 82,
  },
  {
    name: '산업공학과',
    institutions: ['서울대', '고려대', 'KAIST', '한양대'],
    matchScore: 78,
  },
  {
    name: '데이터사이언스학과',
    institutions: ['연세대', '고려대', '서강대', '한양대'],
    matchScore: 85,
  },
  {
    name: '정보통신공학과',
    institutions: ['성균관대', '한양대', '중앙대', '경희대'],
    matchScore: 80,
  },
];

export const admissionNextSteps = [
  {
    title: '합격생 러너 매칭',
    description: '목표 대학 합격 선배와 1:1 릴레이 세션을 통해 실전 노하우를 전수받으세요.',
  },
  {
    title: 'AI 자소서 첨삭',
    description: 'AI가 자기소개서를 분석하고 개선 포인트를 제시합니다.',
  },
  {
    title: '전략적 입시 준비',
    description: '맞춤형 학습 계획과 비교과 활동 로드맵을 수립하세요.',
  },
];
