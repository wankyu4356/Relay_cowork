export type CertificationLevel = '초급' | '중급' | '고급';

export interface CertificationFormData {
  currentLevel: CertificationLevel;
  field: string;
  dailyStudyHours: number;
  examDate: string;
  relatedExperience: string;
  goals: string;
}

export interface CertificationRecommendation {
  id: string;
  name: string;
  field: string;
  matchScore: number;
  difficulty: number; // 1-10
  passRate: string;
  studyPeriod: string;
  cost: string;
  strengths: string[];
  requirements: string[];
  recentTrends: string;
  studyRoadmap: Array<{ week: number; topic: string; hours: number; milestone?: string }>;
  weeklySchedule: Array<{ day: string; subject: string; hours: number }>;
}

export interface CertificationAlternative {
  name: string;
  institutions: string[] | string;
  matchScore: number;
}

export const CERTIFICATION_CONFIG = {
  pageTitle: 'AI 맞춤 자격증 추천',
  pageSubtitle: '나에게 맞는 자격증을 AI가 분석합니다',
  heroTitle: 'AI가 최적의 자격증을 추천합니다',
  heroDescription:
    '현재 역량과 목표를 분석하여 가장 적합한 자격증과 맞춤 학습 전략을 제시합니다.',
  analyzingSteps: [
    '✓ 역량 수준 분석 완료',
    '✓ 경험 배경 평가 완료',
    '✓ 자격증별 적합도 계산 중...',
    '✓ 학습 전략 수립 중...',
  ],
  nextSteps: [
    {
      title: '경험 전달자 매칭',
      description:
        '추천 자격증에 합격한 선배들과 연결되어 실제 경험을 들어보세요',
    },
    {
      title: 'AI 학습 플랜',
      description:
        'AI가 생성한 맞춤 학습 계획을 바탕으로 효율적으로 공부하세요',
    },
    {
      title: '스터디 그룹 참여',
      description:
        '같은 자격증을 준비하는 동료들과 스터디 그룹을 만들어 함께 공부하세요',
    },
  ],
};

export const CERTIFICATION_RECOMMENDATIONS: CertificationRecommendation[] = [
  {
    id: '1',
    name: 'CPA (공인회계사)',
    field: '회계/재무',
    matchScore: 92,
    difficulty: 9,
    passRate: '18%',
    studyPeriod: '평균 2년',
    cost: '학원비 약 300~500만원',
    strengths: [
      '높은 전문성과 사회적 인정',
      '안정적인 고소득 직업 보장',
      '다양한 커리어 패스 가능',
      '목표 의식과 학습 역량 부합',
    ],
    requirements: [
      '회계학 12학점 이상 이수',
      '경영학 9학점 이상 이수',
      '세법 3학점 이상 이수',
      '1차 시험 합격 후 2차 응시 가능',
    ],
    recentTrends:
      '최근 합격자 평균 연령 하락 추세, IFRS 관련 문제 비중 증가, 디지털 회계 역량 중시',
    studyRoadmap: [
      { week: 1, topic: '회계원리 기초', hours: 20, milestone: '기본 개념 완성' },
      { week: 2, topic: '중급회계 I', hours: 25 },
      { week: 3, topic: '중급회계 II', hours: 25 },
      { week: 4, topic: '세법 기초', hours: 20, milestone: '1차 과목 기초 완성' },
      { week: 5, topic: '원가관리회계', hours: 25 },
      { week: 6, topic: '모의고사 및 복습', hours: 30, milestone: '1차 대비 완료' },
    ],
    weeklySchedule: [
      { day: '월', subject: '회계학', hours: 4 },
      { day: '화', subject: '세법', hours: 3 },
      { day: '수', subject: '원가관리회계', hours: 4 },
      { day: '목', subject: '경영학', hours: 3 },
      { day: '금', subject: '재무관리', hours: 4 },
      { day: '토', subject: '모의고사', hours: 6 },
      { day: '일', subject: '복습 및 오답정리', hours: 4 },
    ],
  },
  {
    id: '2',
    name: '정보처리기사',
    field: 'IT/소프트웨어',
    matchScore: 90,
    difficulty: 5,
    passRate: '45%',
    studyPeriod: '2~3개월',
    cost: '교재비 약 3~5만원',
    strengths: [
      'IT 분야 취업 시 필수 자격증',
      '비전공자도 취득 가능',
      '실기 위주 실무 역량 증명',
      '공공기관 가산점 부여',
    ],
    requirements: [
      '관련 학과 졸업 또는 실무 경력',
      '필기 5과목 합격',
      '실기 프로그래밍 및 DB 실습',
      '연 3회 시험 기회',
    ],
    recentTrends:
      '2020년 NCS 기반 개편 이후 실무 중심 출제, 프로그래밍 비중 증가, Python 관련 문제 추가',
    studyRoadmap: [
      { week: 1, topic: '소프트웨어 설계', hours: 15, milestone: '필기 1과목 완성' },
      { week: 2, topic: '소프트웨어 개발 + DB', hours: 18 },
      { week: 3, topic: '정보시스템 + 프로그래밍', hours: 18, milestone: '필기 완성' },
      { week: 4, topic: '실기 알고리즘', hours: 20 },
      { week: 5, topic: '실기 SQL + 프로그래밍', hours: 20, milestone: '실기 대비 완료' },
    ],
    weeklySchedule: [
      { day: '월', subject: '이론 학습', hours: 3 },
      { day: '화', subject: '기출문제 풀이', hours: 2 },
      { day: '수', subject: '프로그래밍 실습', hours: 3 },
      { day: '목', subject: 'DB/SQL 학습', hours: 2 },
      { day: '금', subject: '알고리즘 풀이', hours: 3 },
      { day: '토', subject: '모의고사', hours: 4 },
      { day: '일', subject: '복습 및 오답정리', hours: 2 },
    ],
  },
  {
    id: '3',
    name: 'SQLD',
    field: '데이터베이스',
    matchScore: 88,
    difficulty: 3,
    passRate: '55%',
    studyPeriod: '1~2개월',
    cost: '교재비 약 2~3만원',
    strengths: [
      '데이터 직군 입문 자격증',
      '짧은 학습 기간으로 취득 가능',
      'IT 취업 시 기본 역량 증명',
      'SQL 실무 능력 향상',
    ],
    requirements: [
      '별도 응시 자격 없음',
      '객관식 + 단답형 필기 시험',
      'SQL 기본 문법 이해',
      '연 4회 시험 기회',
    ],
    recentTrends:
      '빅데이터 수요 증가로 응시자 급증, 실무 SQL 활용 문제 비중 확대, 데이터 모델링 중요도 상승',
    studyRoadmap: [
      { week: 1, topic: '데이터 모델링', hours: 12, milestone: '이론 기초 완성' },
      { week: 2, topic: 'SQL 기본 및 활용', hours: 15 },
      { week: 3, topic: 'SQL 활용 심화', hours: 15, milestone: 'SQL 마스터' },
      { week: 4, topic: '기출문제 및 모의고사', hours: 12, milestone: '시험 대비 완료' },
    ],
    weeklySchedule: [
      { day: '월', subject: '데이터 모델링', hours: 2 },
      { day: '화', subject: 'SQL 기본', hours: 2 },
      { day: '수', subject: 'SQL 활용', hours: 2 },
      { day: '목', subject: '기출문제', hours: 2 },
      { day: '금', subject: '오답정리', hours: 1 },
      { day: '토', subject: '모의고사', hours: 3 },
      { day: '일', subject: '휴식 및 가벼운 복습', hours: 1 },
    ],
  },
  {
    id: '4',
    name: 'TOEIC 900+',
    field: '어학',
    matchScore: 85,
    difficulty: 4,
    passRate: '상위 10%',
    studyPeriod: '2~3개월',
    cost: '교재비 약 3~5만원, 응시료 약 5만원',
    strengths: [
      '거의 모든 기업 채용 시 활용',
      '글로벌 역량 증명',
      '취업/이직 시 기본 스펙',
      '영어 실력 객관적 측정',
    ],
    requirements: [
      '별도 응시 자격 없음',
      'LC 100문항 + RC 100문항',
      '시험 시간 2시간',
      '매월 시험 기회',
    ],
    recentTrends:
      '기업 요구 점수 상향 추세, LC 파트 난이도 증가, 비즈니스 상황 중심 출제 경향 강화',
    studyRoadmap: [
      { week: 1, topic: 'LC Part 1-2 집중', hours: 12, milestone: 'LC 기초 완성' },
      { week: 2, topic: 'LC Part 3-4 + RC Part 5', hours: 15 },
      { week: 3, topic: 'RC Part 6-7 집중', hours: 15, milestone: 'RC 전략 완성' },
      { week: 4, topic: '실전 모의고사 1회', hours: 10 },
      { week: 5, topic: '취약 파트 보완 + 모의고사', hours: 15, milestone: '시험 대비 완료' },
    ],
    weeklySchedule: [
      { day: '월', subject: 'LC 듣기 훈련', hours: 2 },
      { day: '화', subject: 'RC 문법/어휘', hours: 2 },
      { day: '수', subject: 'LC 실전 연습', hours: 2 },
      { day: '목', subject: 'RC 독해', hours: 2 },
      { day: '금', subject: '기출 풀이', hours: 2 },
      { day: '토', subject: '실전 모의고사', hours: 3 },
      { day: '일', subject: '오답정리 및 단어 암기', hours: 1 },
    ],
  },
];

export const CERTIFICATION_ALTERNATIVES: CertificationAlternative[] = [
  {
    name: '빅데이터분석기사',
    institutions: ['한국데이터산업진흥원'],
    matchScore: 86,
  },
  {
    name: 'ADsP',
    institutions: ['한국데이터산업진흥원'],
    matchScore: 84,
  },
  {
    name: '컴퓨터활용능력 1급',
    institutions: ['대한상공회의소'],
    matchScore: 82,
  },
  {
    name: '한국사능력검정 1급',
    institutions: '국사편찬위원회',
    matchScore: 80,
  },
];
