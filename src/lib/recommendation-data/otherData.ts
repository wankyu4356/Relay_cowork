export interface OtherFormData {
  goal: string;
  currentState: string;
  resources: string;
  timeline: string;
}

export interface OtherRecommendation {
  id: string;
  pathName: string;
  description: string;
  matchScore: number;
  type: string;
  competitionRate: string;
  cost: string;
  successRate: string;
  strengths: string[];
  requirements: string[];
  recentTrends: string;
  milestones: Array<{ month: number; title: string; description: string; isKey: boolean }>;
  successCases: Array<{ name: string; background: string; outcome: string; duration: string }>;
  resourceChecklist: Array<{ item: string; completed: boolean; category: string }>;
}

export interface OtherAlternative {
  name: string;
  institutions: string[] | string;
  matchScore: number;
}

export const OTHER_CONFIG = {
  pageTitle: 'AI 맞춤 경로 추천',
  pageSubtitle: '나에게 맞는 목표 달성 경로를 AI가 분석합니다',
  heroTitle: 'AI가 당신의 목표 달성을 돕습니다',
  heroDescription: '배경, 역량, 목표를 바탕으로 최적의 경로와 전략을 추천합니다.',
  analyzingSteps: [
    '✓ 역량 프로필 분석 완료',
    '✓ 경험 및 배경 평가 완료',
    '✓ 목표별 경로 계산 중...',
    '✓ 실행 전략 수립 중...',
  ],
  nextSteps: [
    { title: '경험자 러너 매칭', description: '같은 목표를 달성한 선배와 연결되어 실제 경험을 들어보세요' },
    { title: 'AI 문서 작성', description: 'AI의 도움을 받아 필요한 서류를 체계적으로 준비하세요' },
    { title: '전략적 실행', description: '추천받은 경로를 바탕으로 단계별 실행 계획을 시작하세요' },
  ],
};

export const OTHER_RECOMMENDATIONS: OtherRecommendation[] = [
  {
    id: '1',
    pathName: '미국 MBA',
    description: 'Top 20 비즈니스 스쿨',
    matchScore: 90,
    type: '해외 대학원',
    competitionRate: '합격률 20%',
    cost: '연간 약 8,000만원',
    successRate: '82%',
    strengths: ['경력 배경 적합', '리더십 경험 보유', '글로벌 역량', '명확한 커리어 목표'],
    requirements: ['GMAT 700+', 'TOEFL 100+', '에세이 3~5편', '추천서 2~3통'],
    recentTrends: '다양한 산업 배경 선호, 사회적 영향력과 리더십 스토리 중시',
    milestones: [
      { month: 1, title: '자료 조사 및 학교 리스트업', description: '목표 학교 10곳 선정 및 요구 조건 정리', isKey: false },
      { month: 2, title: 'GMAT/GRE 준비 시작', description: '시험 준비 학원 등록 및 학습 플랜 수립', isKey: true },
      { month: 5, title: 'GMAT/GRE 시험 응시', description: '목표 점수 700+ 달성을 위한 첫 시험', isKey: true },
      { month: 7, title: '에세이 작성 및 추천서 의뢰', description: '각 학교별 에세이 초안 작성 및 추천인 섭외', isKey: false },
      { month: 9, title: '원서 접수 (1차 라운드)', description: 'Early round 지원으로 합격 확률 극대화', isKey: true },
      { month: 12, title: '인터뷰 준비 및 합격 발표', description: '면접 준비 및 합격 결과 확인', isKey: true },
    ],
    successCases: [
      { name: '김○○', background: '대기업 마케팅 3년차, 학점 3.6/4.5', outcome: 'Michigan Ross MBA 합격, 졸업 후 컨설팅 펌 입사', duration: '준비 기간 14개월' },
      { name: '이○○', background: '스타트업 PM 4년차, 해외 교환학생 경험', outcome: 'UCLA Anderson MBA 합격, 장학금 50% 수령', duration: '준비 기간 12개월' },
    ],
    resourceChecklist: [
      { item: 'GMAT/GRE 점수 확보', completed: false, category: '시험' },
      { item: 'TOEFL/IELTS 점수 확보', completed: false, category: '시험' },
      { item: '에세이 초안 작성 (학교별)', completed: false, category: '서류' },
      { item: '추천인 2~3인 확보', completed: false, category: '네트워킹' },
      { item: '재정 계획 수립 (학비 + 생활비)', completed: false, category: '서류' },
    ],
  },
  {
    id: '2',
    pathName: '국내 대학원 석사',
    description: '연구 중심 대학원',
    matchScore: 88,
    type: '국내 대학원',
    competitionRate: '합격률 40%',
    cost: '등록금 + 장학금',
    successRate: '80%',
    strengths: ['학점 우수', '연구 관심도', '교수 네트워크', '탐구 역량'],
    requirements: ['연구 계획서', '영어 성적', '면접', '교수 사전 컨택'],
    recentTrends: '연구 실적과 연구 계획의 구체성 중시, 교수 랩 매칭 중요',
    milestones: [
      { month: 1, title: '관심 연구실 및 교수 리서치', description: '논문 검색을 통해 관심 연구 분야 교수 목록 정리', isKey: true },
      { month: 2, title: '교수 사전 컨택', description: '이메일로 연구 관심사 소개 및 면담 요청', isKey: true },
      { month: 3, title: '영어 성적 준비', description: 'TOEIC/TOEFL 등 요구 어학 성적 확보', isKey: false },
      { month: 4, title: '연구 계획서 작성', description: '지도교수 피드백 반영하여 연구 계획서 완성', isKey: true },
      { month: 5, title: '원서 접수 및 면접 준비', description: '서류 제출 및 면접 대비', isKey: false },
    ],
    successCases: [
      { name: '박○○', background: '학부 학점 4.0/4.5, 학부 연구생 경험', outcome: 'KAIST 석사 합격, 전액 장학금 + 연구 조교', duration: '준비 기간 4개월' },
      { name: '최○○', background: '학부 학점 3.7/4.5, 관련 인턴 경험 2회', outcome: '서울대 대학원 합격, BK21 장학금 수혜', duration: '준비 기간 5개월' },
    ],
    resourceChecklist: [
      { item: '관심 교수 리스트 정리', completed: false, category: '네트워킹' },
      { item: '연구 계획서 초안', completed: false, category: '서류' },
      { item: '영어 성적 (TOEIC/TOEFL)', completed: false, category: '시험' },
      { item: '성적증명서 발급', completed: false, category: '서류' },
      { item: '추천서 의뢰 (지도교수)', completed: false, category: '네트워킹' },
    ],
  },
  {
    id: '3',
    pathName: '해외 취업',
    description: '글로벌 IT 기업',
    matchScore: 85,
    type: '해외 취업',
    competitionRate: '높은 경쟁',
    cost: '비자/생활비 약 2,000만원',
    successRate: '75%',
    strengths: ['기술 역량 우수', '영어 능력 보유', '글로벌 마인드', '적응력'],
    requirements: ['영문 이력서', '기술 인터뷰', '비자 스폰서 확보', '현지 네트워킹'],
    recentTrends: '원격 근무 기회 확대, AI/ML 분야 수요 급증',
    milestones: [
      { month: 1, title: '영문 이력서 및 LinkedIn 정비', description: '글로벌 기준에 맞는 이력서 작성 및 프로필 최적화', isKey: true },
      { month: 2, title: '기술 인터뷰 준비', description: 'LeetCode, 시스템 디자인 등 기술 면접 대비', isKey: false },
      { month: 3, title: '타겟 기업 지원 시작', description: '채용 공고 모니터링 및 적극적 지원', isKey: true },
      { month: 5, title: '인터뷰 및 오퍼 협상', description: '기술/행동 면접 수행 및 보상 패키지 협상', isKey: true },
      { month: 6, title: '비자 프로세스 및 이주 준비', description: '취업 비자 신청 및 현지 생활 준비', isKey: false },
    ],
    successCases: [
      { name: '정○○', background: '국내 IT기업 백엔드 개발 5년차', outcome: 'Amazon SDE II 합격, 시애틀 이주', duration: '준비 기간 6개월' },
      { name: '한○○', background: '스타트업 풀스택 개발 3년차, 석사 졸업', outcome: 'Google 취리히 오피스 합격', duration: '준비 기간 8개월' },
    ],
    resourceChecklist: [
      { item: '영문 이력서 완성', completed: false, category: '서류' },
      { item: 'LinkedIn 프로필 최적화', completed: false, category: '네트워킹' },
      { item: '코딩 인터뷰 연습 (100문제+)', completed: false, category: '시험' },
      { item: '비자 요건 확인 (국가별)', completed: false, category: '서류' },
    ],
  },
  {
    id: '4',
    pathName: '창업',
    description: '스타트업 창업',
    matchScore: 82,
    type: '창업/사업',
    competitionRate: '생존율 30%',
    cost: '초기 투자금 변동',
    successRate: '68%',
    strengths: ['아이디어 구체성', '기술적 실현 가능', '시장 이해도', '실행력'],
    requirements: ['사업 계획서', '프로토타입', '팀 구성', '투자/지원금 확보'],
    recentTrends: '정부 창업 지원 확대, AI 기반 스타트업 투자 증가',
    milestones: [
      { month: 1, title: '아이디어 검증 및 시장 조사', description: '고객 인터뷰 30건 이상, 시장 규모 분석', isKey: true },
      { month: 2, title: 'MVP 개발', description: '핵심 기능 중심 최소 제품 개발', isKey: true },
      { month: 3, title: '초기 사용자 확보', description: 'Beta 테스터 100명 모집 및 피드백 수집', isKey: false },
      { month: 4, title: '정부 지원사업 신청', description: '예비창업패키지, 초기창업패키지 등 지원', isKey: true },
      { month: 6, title: '투자 유치 준비', description: 'IR 덱 작성 및 엔젤/시드 투자 미팅', isKey: false },
      { month: 9, title: 'PMF 달성 및 성장', description: 'Product-Market Fit 확인 후 스케일업', isKey: true },
    ],
    successCases: [
      { name: '윤○○', background: '대기업 기획팀 2년차, 사이드 프로젝트 경험', outcome: '예비창업패키지 선정, 시드 투자 3억 유치', duration: '창업 후 10개월' },
      { name: '서○○', background: '개발자 3년차, 해커톤 수상 경험 다수', outcome: 'AI 기반 서비스 런칭, MAU 1만명 달성', duration: '창업 후 8개월' },
    ],
    resourceChecklist: [
      { item: '사업 계획서 작성', completed: false, category: '서류' },
      { item: 'MVP/프로토타입 개발', completed: false, category: '시험' },
      { item: '공동 창업자 또는 초기 팀원 확보', completed: false, category: '네트워킹' },
      { item: '창업 지원사업 공고 확인', completed: false, category: '서류' },
      { item: '법인 설립 절차 파악', completed: false, category: '서류' },
    ],
  },
];

export const OTHER_ALTERNATIVES: OtherAlternative[] = [
  { name: '교환학생', institutions: ['유럽', '미국', '일본'], matchScore: 84 },
  { name: '워킹홀리데이', institutions: ['호주', '캐나다', '일본'], matchScore: 78 },
  { name: '전과/복수전공', institutions: ['재학 대학'], matchScore: 86 },
  { name: '해외 봉사', institutions: ['NGO/KOICA'], matchScore: 75 },
];
