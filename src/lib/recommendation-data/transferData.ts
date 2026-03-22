export interface TransferFormData {
  currentUniversity: string;
  currentMajor: string;
  gpa: string;
  targetField: string;
  experiences: string;
  strengths: string;
  goals: string;
  transferType: '일반편입' | '학사편입' | '기타전형';
  transferSubType?: string;
}

export interface TransferRecommendation {
  id: string;
  name: string;
  department: string;
  matchScore: number;
  transferType: '일반편입' | '학사편입' | '기타전형';
  competitionRate: string;
  successRate: string;
  tuitionPerSemester: string;
  strengths: string[];
  requirements: string[];
  recentTrends: string;
}

export interface TransferAlternative {
  name: string;
  institutions: string[] | string;
  matchScore: number;
}

export const TRANSFER_CONFIG = {
  pageTitle: 'AI 맞춤 편입 추천',
  pageSubtitle: '나에게 맞는 대학과 전공을 AI가 분석합니다',
  heroTitle: 'AI가 당신의 편입 성공을 돕습니다',
  heroDescription: '입력하신 정보를 바탕으로 최적의 대학과 전공을 추천하고, 합격 가능성과 준비 전략을 제시합니다.',
  analyzingSteps: [
    '✓ 학업 역량 분석 완료',
    '✓ 경험 및 활동 평가 완료',
    '✓ 대학별 매칭도 계산 중...',
    '✓ 합격 전략 수립 중...',
  ],
  nextSteps: [
    { title: '릴레이 러너 매칭', description: '추천 대학에 합격한 선배들과 연결되어 실제 경험을 들어보세요' },
    { title: 'AI 학업계획서 작성', description: 'AI의 도움을 받아 합격 가능성 높은 학업계획서를 작성하세요' },
    { title: '전략적 준비', description: '추천받은 정보를 바탕으로 체계적인 편입 준비를 시작하세요' },
  ],
};

export const TRANSFER_RECOMMENDATIONS: TransferRecommendation[] = [
  {
    id: '1', name: '연세대학교', department: '경영학과', matchScore: 94,
    transferType: '일반편입', competitionRate: '15:1', successRate: '87%',
    tuitionPerSemester: '약 450만원/학기',
    strengths: ['현재 전공과 높은 연계성', '학점 경쟁력 우수', '봉사활동 경험이 플러스 요인', '목표와 전공 방향성 일치'],
    requirements: ['학업계획서 (1,000자)', '자기소개서 (1,500자)', '영어 성적 (TOEIC 800+ 권장)', '전적대 성적증명서'],
    recentTrends: '최근 3년간 합격자 평균 학점 3.8 이상, 전공 관련 활동 경험 보유자 선호',
  },
  {
    id: '2', name: '고려대학교', department: '경영학과', matchScore: 91,
    transferType: '일반편입', competitionRate: '18:1', successRate: '82%',
    tuitionPerSemester: '약 430만원/학기',
    strengths: ['학점 우수', '리더십 경험 보유', '전공 적합성 높음', '영어 능력 우수'],
    requirements: ['학업계획서 (800자)', '자기소개서 (1,200자)', '영어 성적 (TOEIC 850+ 권장)', '전적대 성적증명서'],
    recentTrends: '글로벌 마인드와 리더십을 중시하는 경향, 인턴 경험 가산점',
  },
  {
    id: '3', name: '서강대학교', department: '경영학과', matchScore: 89,
    transferType: '학사편입', competitionRate: '12:1', successRate: '85%',
    tuitionPerSemester: '약 420만원/학기',
    strengths: ['학점 경쟁력 우수', '소규모 정예 교육', '실무 경험 보유', '목표 명확성'],
    requirements: ['학업계획서 (1,000자)', '자기소개서 (1,000자)', '영어 성적 (선택)', '전적대 성적증명서'],
    recentTrends: '학업 열정과 전공 적합성을 가장 중시, 서류 평가 비중 높음',
  },
  {
    id: '4', name: '성균관대학교', department: '글로벌경영학과', matchScore: 86,
    transferType: '학사편입', competitionRate: '14:1', successRate: '79%',
    tuitionPerSemester: '약 440만원/학기',
    strengths: ['글로벌 역량 보유', '학점 우수', '전공 다양성 확보', '실무 경험 풍부'],
    requirements: ['학업계획서 (800자)', '영어 에세이 (500단어)', 'TOEIC 900+ 또는 TOEFL 90+', '전적대 성적증명서'],
    recentTrends: '글로벌 경쟁력을 갖춘 인재 선호, 영어 능력 중요',
  },
  {
    id: '5', name: '한양대학교', department: '경영학과', matchScore: 84,
    transferType: '기타전형', competitionRate: '8:1', successRate: '78%',
    tuitionPerSemester: '약 410만원/학기',
    strengths: ['농어촌 전형 지원 가능', '경쟁률 상대적 낮음', '학점 경쟁력 우수', '전공 적합성 높음'],
    requirements: ['농어촌 거주 증빙서류', '학업계획서 (800자)', '자기소개서 (1,000자)', '전적대 성적증명서'],
    recentTrends: '농어촌 전형 지원자격 엄격 심사, 서류 충실성 중시',
  },
  {
    id: '6', name: '중앙대학교', department: '경영학부', matchScore: 82,
    transferType: '기타전형', competitionRate: '6:1', successRate: '81%',
    tuitionPerSemester: '약 400만원/학기',
    strengths: ['특성화고 전형 활용 가능', '낮은 경쟁률', '실무 경험 가산점', '전공 연계성 우수'],
    requirements: ['특성화고 졸업증명서', '학업계획서 (800자)', '경력기술서', '전적대 성적증명서'],
    recentTrends: '특성화고 출신 실무 경험자 우대, 전공 연계 활동 중시',
  },
];

export const TRANSFER_ALTERNATIVES: TransferAlternative[] = [
  { name: '경제학과', institutions: ['연세대', '고려대', '서강대'], matchScore: 88 },
  { name: '경영정보학과', institutions: ['연세대', '성균관대'], matchScore: 85 },
  { name: '글로벌리더학부', institutions: '고려대', matchScore: 83 },
  { name: '국제경영학과', institutions: ['한양대', '중앙대'], matchScore: 81 },
];
