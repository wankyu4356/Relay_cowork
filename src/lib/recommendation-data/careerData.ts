export interface CareerFormData {
  skills: string[];
  university?: string;
  major?: string;
  gpa?: string;
  yearsOfExperience: number;
  desiredSalaryMin: number;
  desiredSalaryMax: number;
  preferredIndustry?: string;
  experiences?: string;
  goals?: string;
}

export interface CareerRecommendation {
  id: string;
  companyName: string;
  position: string;
  matchScore: number;
  type: string;
  salaryRange: string;
  competitionRate: string;
  successRate: string;
  jobFitScores: {
    technicalFit: number;
    cultureFit: number;
    growthPotential: number;
    salaryFit: number;
    workLifeBalance: number;
    careerPath: number;
  };
  strengths: string[];
  requirements: string[];
  recentTrends: string;
  interviewTips: string[];
  benefits: string[];
}

export interface CareerAlternative {
  name: string;
  institutions: string[] | string;
  matchScore: number;
}

export const careerConfig = {
  pageTitle: 'AI 맞춤 취업 추천',
  pageSubtitle: '역량과 경험을 분석하여 최적의 기업과 직무를 추천합니다',
  analyzingSteps: [
    '역량 프로필 분석 중...',
    '경력 경험 평가 중...',
    '기업별 적합도 계산 중...',
    '취업 전략 수립 중...',
  ],
};

export const SKILL_SUGGESTIONS: string[] = [
  'JavaScript',
  'TypeScript',
  'React',
  'Python',
  'Java',
  'Spring',
  'Node.js',
  'SQL',
  'AWS',
  'Docker',
  'Kubernetes',
  'Git',
  'REST API',
  'GraphQL',
  'MongoDB',
  'Redis',
];

export const mockCareerRecommendations: CareerRecommendation[] = [
  {
    id: 'career-1',
    companyName: '네이버',
    position: '프론트엔드 개발자',
    matchScore: 92,
    type: 'IT/플랫폼',
    salaryRange: '5,500~7,500만원',
    competitionRate: '약 120:1',
    successRate: '상위 15%',
    jobFitScores: {
      technicalFit: 93,
      cultureFit: 88,
      growthPotential: 90,
      salaryFit: 85,
      workLifeBalance: 82,
      careerPath: 91,
    },
    strengths: [
      'React/TypeScript 기반 대규모 서비스 경험 가능',
      '자율적인 개발 문화와 기술 공유 활발',
      '국내 최대 트래픽 처리 경험',
      '사내 기술 세미나 및 컨퍼런스 지원',
    ],
    requirements: [
      'React, TypeScript 실무 경험 2년 이상',
      '웹 성능 최적화 경험',
      'CI/CD 파이프라인 구축 경험 우대',
      '오픈소스 기여 경험 우대',
    ],
    recentTrends:
      '네이버는 최근 AI 기반 서비스 확장과 글로벌 진출에 집중하고 있으며, 프론트엔드 개발자의 채용을 대폭 확대하고 있습니다.',
    interviewTips: [
      '코딩 테스트는 알고리즘 + 프론트엔드 구현 문제 병행',
      '기술 면접에서 React 렌더링 최적화 관련 질문 빈출',
      '프로젝트 포트폴리오에 성능 개선 사례 포함 권장',
      '네이버 서비스 사용 경험과 개선점을 준비할 것',
    ],
    benefits: [
      '연 2회 성과 보너스 (최대 연봉의 50%)',
      '자기개발비 연 200만원 지원',
      '유연근무제 및 원격근무 가능',
      '사내 카페테리아 및 헬스장 무료 이용',
    ],
  },
  {
    id: 'career-2',
    companyName: '카카오',
    position: '백엔드 개발자',
    matchScore: 88,
    type: 'IT/플랫폼',
    salaryRange: '5,000~7,000만원',
    competitionRate: '약 100:1',
    successRate: '상위 20%',
    jobFitScores: {
      technicalFit: 87,
      cultureFit: 91,
      growthPotential: 85,
      salaryFit: 82,
      workLifeBalance: 88,
      careerPath: 84,
    },
    strengths: [
      '다양한 서비스 포트폴리오로 폭넓은 경험',
      '수평적이고 자유로운 조직 문화',
      '대규모 분산 시스템 운영 경험',
      '카카오 계열사 간 이동 및 성장 기회',
    ],
    requirements: [
      'Java/Kotlin 또는 Python 실무 경험',
      'Spring Boot 기반 API 개발 경험',
      '대용량 데이터 처리 경험 우대',
      'MSA 아키텍처 이해',
    ],
    recentTrends:
      '카카오는 AI 챗봇, 모빌리티, 핀테크 등 다양한 분야로 사업을 확장하며 기술 인력을 적극 채용하고 있습니다.',
    interviewTips: [
      '코딩 테스트 난이도 중상, 자료구조/알고리즘 필수',
      '시스템 디자인 면접 비중이 높아지는 추세',
      '카카오 서비스 관련 기술 블로그 사전 학습 권장',
    ],
    benefits: [
      '연봉 외 RSU(제한조건부주식) 지급',
      '자율 출퇴근제 및 원격근무',
      '연 최대 30일 유급 휴가',
      '교육비 및 도서 구입비 전액 지원',
    ],
  },
  {
    id: 'career-3',
    companyName: '삼성전자',
    position: '소프트웨어 엔지니어',
    matchScore: 83,
    type: '대기업/제조',
    salaryRange: '5,500~8,000만원',
    competitionRate: '약 80:1',
    successRate: '상위 25%',
    jobFitScores: {
      technicalFit: 80,
      cultureFit: 75,
      growthPotential: 88,
      salaryFit: 92,
      workLifeBalance: 70,
      careerPath: 85,
    },
    strengths: [
      '글로벌 수준의 기술력과 R&D 투자',
      '체계적인 교육 및 역량 개발 프로그램',
      '안정적인 고연봉 및 복리후생',
      '해외 근무 및 파견 기회',
    ],
    requirements: [
      'C/C++ 또는 Java 프로그래밍 능력',
      'OS, 네트워크 등 CS 기초 탄탄',
      'SWEA(삼성 소프트웨어 역량 테스트) 통과',
      '관련 분야 석사 학위 우대',
    ],
    recentTrends:
      '삼성전자는 반도체, 디스플레이, 모바일 외에도 AI/ML 분야 인력을 대폭 확충하고 있으며, 소프트웨어 직군 처우를 지속 개선하고 있습니다.',
    interviewTips: [
      'GSAT + SW 역량 테스트 2단계 필기 준비 필수',
      '임원 면접에서 지원동기와 삼성 가치관 연계 중요',
      '직무 면접에서 프로젝트 경험 기반 기술 심화 질문',
      '인성 면접에서 팀워크/리더십 경험 사례 준비',
    ],
    benefits: [
      '업계 최고 수준 초봉 및 성과급',
      '사내 어린이집 및 가족 복지 프로그램',
      '글로벌 연수 및 MBA 지원',
    ],
  },
  {
    id: 'career-4',
    companyName: '토스',
    position: '풀스택 개발자',
    matchScore: 79,
    type: '핀테크/스타트업',
    salaryRange: '5,000~7,500만원',
    competitionRate: '약 150:1',
    successRate: '상위 10%',
    jobFitScores: {
      technicalFit: 85,
      cultureFit: 92,
      growthPotential: 88,
      salaryFit: 78,
      workLifeBalance: 65,
      careerPath: 80,
    },
    strengths: [
      '빠른 성장과 혁신적인 개발 문화',
      '높은 자율성과 의사결정 권한',
      '핀테크 도메인 전문성 확보 가능',
      '스톡옵션 등 보상 체계 매력적',
    ],
    requirements: [
      'React + Node.js 풀스택 개발 경험',
      '금융 서비스 개발 경험 우대',
      '빠른 프로토타이핑 및 MVP 개발 능력',
      '데이터 기반 의사결정 경험',
    ],
    recentTrends:
      '토스는 은행, 증권, 보험 등 금융 전 영역으로 확장하며 유니콘 기업으로 성장했고, 기술 인력에 대한 적극적인 투자를 이어가고 있습니다.',
    interviewTips: [
      '문화 적합성(Culture Fit) 면접 비중이 매우 높음',
      '과제 테스트로 실제 프로덕트 구현 능력 평가',
      '토스 제품 사용 경험과 개선 아이디어 준비 필수',
    ],
    benefits: [
      '스톡옵션 지급 (4년 베스팅)',
      '최신 장비 및 개발 환경 지원',
      '무제한 도서 구입비',
      '팀 단위 워케이션 프로그램',
    ],
  },
];

export const mockCareerAlternatives: CareerAlternative[] = [
  {
    name: '프론트엔드 개발',
    institutions: ['네이버', '카카오', '라인', '쿠팡'],
    matchScore: 90,
  },
  {
    name: 'PM/기획',
    institutions: ['카카오', '배달의민족', '당근마켓', '토스'],
    matchScore: 78,
  },
  {
    name: '데이터 엔지니어',
    institutions: ['네이버', '삼성SDS', 'SK하이닉스', '카카오'],
    matchScore: 74,
  },
  {
    name: 'DevOps',
    institutions: ['AWS 코리아', '네이버클라우드', '카카오', 'NHN'],
    matchScore: 70,
  },
];

export const careerNextSteps = [
  {
    title: '현직자 멘토 연결',
    description:
      '추천된 기업의 현직자 멘토와 1:1 상담을 통해 실제 업무 환경과 입사 준비 전략을 들어보세요.',
  },
  {
    title: 'AI 자소서 첨삭',
    description:
      'AI가 지원 기업별 맞춤 자기소개서를 분석하고 개선점을 제안합니다.',
  },
  {
    title: '전략적 준비 시작',
    description:
      '코딩 테스트, 기술 면접, 포트폴리오 등 체계적인 취업 준비 로드맵을 제공합니다.',
  },
];
