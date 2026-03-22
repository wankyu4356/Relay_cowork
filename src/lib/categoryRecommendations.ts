import type { Category } from '../components/GlobalNav';

export interface Recommendation {
  id: string;
  name: string;
  detail: string;
  matchScore: number;
  type: string;
  competitionRate: string;
  cost: string;
  strengths: string[];
  requirements: string[];
  recentTrends: string;
  successRate: string;
}

export interface AlternativeOption {
  name: string;
  institutions: string[] | string;
  matchScore: number;
}

export interface RecommendationConfig {
  pageTitle: string;
  pageSubtitle: string;
  heroTitle: string;
  heroDescription: string;
  formLabels: {
    field1: string;
    field1Placeholder: string;
    field2: string;
    field2Placeholder: string;
    field3: string;
    field3Placeholder: string;
    field4: string;
    field4Placeholder: string;
    freeformTitle: string;
    experiences: string;
    experiencesPlaceholder: string;
    strengths: string;
    strengthsPlaceholder: string;
    goals: string;
    goalsPlaceholder: string;
  };
  analyzingSteps: string[];
  resultSummaryUnit: string;
  alternativeTitle: string;
  nextSteps: Array<{ title: string; description: string }>;
  recommendations: Recommendation[];
  alternatives: AlternativeOption[];
}

export const CATEGORY_RECOMMENDATIONS: Record<Category, RecommendationConfig> = {
  transfer: {
    pageTitle: 'AI 맞춤 편입 추천',
    pageSubtitle: '나에게 맞는 대학과 전공을 AI가 분석합니다',
    heroTitle: 'AI가 당신의 편입 성공을 돕습니다',
    heroDescription: '입력하신 정보를 바탕으로 최적의 대학과 전공을 추천하고, 합격 가능성과 준비 전략을 제시합니다.',
    formLabels: {
      field1: '현재 대학',
      field1Placeholder: '예: 서울시립대학교',
      field2: '현재 전공',
      field2Placeholder: '예: 경영학과',
      field3: '평균 학점 (4.5 만점)',
      field3Placeholder: '예: 4.2',
      field4: '희망 분야',
      field4Placeholder: '예: 경영, 마케팅',
      freeformTitle: '자유 기술',
      experiences: '주요 경험 및 활동',
      experiencesPlaceholder: '동아리, 봉사활동, 인턴, 프로젝트 등 주요 경험을 자유롭게 작성해주세요',
      strengths: '나의 강점',
      strengthsPlaceholder: '학업, 리더십, 언어, 특기 등 자신의 강점을 작성해주세요',
      goals: '편입 목표 및 동기',
      goalsPlaceholder: '왜 편입을 준비하시나요? 어떤 목표를 가지고 계신가요?',
    },
    analyzingSteps: [
      '✓ 학업 역량 분석 완료',
      '✓ 경험 및 활동 평가 완료',
      '✓ 대학별 매칭도 계산 중...',
      '✓ 합격 전략 수립 중...',
    ],
    resultSummaryUnit: '최적 대학',
    alternativeTitle: '다른 학과 후보',
    nextSteps: [
      { title: '릴레이 러너 매칭', description: '추천 대학에 합격한 선배들과 연결되어 실제 경험을 들어보세요' },
      { title: 'AI 학업계획서 작성', description: 'AI의 도움을 받아 합격 가능성 높은 학업계획서를 작성하세요' },
      { title: '전략적 준비', description: '추천받은 정보를 바탕으로 체계적인 편입 준비를 시작하세요' },
    ],
    recommendations: [
      {
        id: '1', name: '연세대학교', detail: '경영학과', matchScore: 94,
        type: '일반편입', competitionRate: '15:1', cost: '약 450만원/학기',
        strengths: ['현재 전공과 높은 연계성', '학점 경쟁력 우수', '봉사활동 경험이 플러스 요인', '목표와 전공 방향성 일치'],
        requirements: ['학업계획서 (1,000자)', '자기소개서 (1,500자)', '영어 성적 (TOEIC 800+ 권장)', '전적대 성적증명서'],
        recentTrends: '최근 3년간 합격자 평균 학점 3.8 이상, 전공 관련 활동 경험 보유자 선호',
        successRate: '87%',
      },
      {
        id: '2', name: '고려대학교', detail: '경영학과', matchScore: 91,
        type: '일반편입', competitionRate: '18:1', cost: '약 430만원/학기',
        strengths: ['학점 우수', '리더십 경험 보유', '전공 적합성 높음', '영어 능력 우수'],
        requirements: ['학업계획서 (800자)', '자기소개서 (1,200자)', '영어 성적 (TOEIC 850+ 권장)', '전적대 성적증명서'],
        recentTrends: '글로벌 마인드와 리더십을 중시하는 경향, 인턴 경험 가산점',
        successRate: '82%',
      },
      {
        id: '3', name: '서강대학교', detail: '경영학과', matchScore: 89,
        type: '일반편입', competitionRate: '12:1', cost: '약 420만원/학기',
        strengths: ['학점 경쟁력 우수', '소규모 정예 교육', '실무 경험 보유', '목표 명확성'],
        requirements: ['학업계획서 (1,000자)', '자기소개서 (1,000자)', '영어 성적 (선택)', '전적대 성적증명서'],
        recentTrends: '학업 열정과 전공 적합성을 가장 중시, 서류 평가 비중 높음',
        successRate: '85%',
      },
      {
        id: '4', name: '성균관대학교', detail: '글로벌경영학과', matchScore: 86,
        type: '일반편입', competitionRate: '14:1', cost: '약 440만원/학기',
        strengths: ['글로벌 역량 보유', '학점 우수', '전공 다양성 확보', '실무 경험 풍부'],
        requirements: ['학업계획서 (800자)', '영어 에세이 (500단어)', 'TOEIC 900+ 또는 TOEFL 90+', '전적대 성적증명서'],
        recentTrends: '글로벌 경쟁력을 갖춘 인재 선호, 영어 능력 중요',
        successRate: '79%',
      },
    ],
    alternatives: [
      { name: '경제학과', institutions: ['연세대', '고려대', '서강대'], matchScore: 88 },
      { name: '경영정보학과', institutions: ['연세대', '성균관대'], matchScore: 85 },
      { name: '글로벌리더학부', institutions: '고려대', matchScore: 83 },
      { name: '국제경영학과', institutions: ['한양대', '중앙대'], matchScore: 81 },
    ],
  },
  admission: {
    pageTitle: 'AI 맞춤 입시 추천',
    pageSubtitle: '나에게 맞는 대학과 전공을 AI가 분석합니다',
    heroTitle: 'AI가 당신의 대학 합격을 돕습니다',
    heroDescription: '내신, 수능, 활동 정보를 바탕으로 최적의 대학과 전공을 추천하고, 합격 전략을 제시합니다.',
    formLabels: {
      field1: '고등학교',
      field1Placeholder: '예: 서울과학고등학교',
      field2: '계열',
      field2Placeholder: '예: 자연계, 인문계',
      field3: '내신 등급 (평균)',
      field3Placeholder: '예: 1.5',
      field4: '희망 전공 분야',
      field4Placeholder: '예: 컴퓨터공학, 의학',
      freeformTitle: '비교과 활동',
      experiences: '주요 비교과 활동',
      experiencesPlaceholder: '동아리, 봉사, 대회, 연구 등 비교과 활동을 자유롭게 작성해주세요',
      strengths: '나의 강점',
      strengthsPlaceholder: '학업 역량, 리더십, 탐구 역량 등 자신의 강점을 작성해주세요',
      goals: '진학 목표 및 동기',
      goalsPlaceholder: '왜 이 전공을 선택하시나요? 대학에서 무엇을 하고 싶으신가요?',
    },
    analyzingSteps: [
      '✓ 학업 역량 분석 완료',
      '✓ 비교과 활동 평가 완료',
      '✓ 대학별 매칭도 계산 중...',
      '✓ 입시 전략 수립 중...',
    ],
    resultSummaryUnit: '최적 대학',
    alternativeTitle: '다른 전공 후보',
    nextSteps: [
      { title: '합격생 러너 매칭', description: '추천 대학에 합격한 선배들과 연결되어 입시 경험을 들어보세요' },
      { title: 'AI 자소서 작성', description: 'AI의 도움을 받아 합격 가능성 높은 자기소개서를 작성하세요' },
      { title: '전략적 준비', description: '추천받은 정보를 바탕으로 체계적인 입시 준비를 시작하세요' },
    ],
    recommendations: [
      {
        id: '1', name: '서울대학교', detail: '컴퓨터공학부', matchScore: 92,
        type: '수시 일반전형', competitionRate: '8:1', cost: '약 280만원/학기',
        strengths: ['내신 경쟁력 우수', '탐구 활동 경험 풍부', '목표 명확성', '관련 비교과 활동 다수'],
        requirements: ['학생부종합전형 서류', '자기소개서 (1,500자)', '면접 (구술 면접)', '학교생활기록부'],
        recentTrends: '탐구 역량과 자기주도적 학습 경험을 중시, 교과 + 비교과 종합 평가',
        successRate: '78%',
      },
      {
        id: '2', name: '연세대학교', detail: '컴퓨터과학과', matchScore: 90,
        type: '수시 활동우수형', competitionRate: '10:1', cost: '약 450만원/학기',
        strengths: ['비교과 활동 우수', '내신 경쟁력', '영어 역량 보유', '전공 적합성 높음'],
        requirements: ['학생부종합전형 서류', '자기소개서 (1,000자)', '면접', '학교생활기록부'],
        recentTrends: '활동의 진정성과 전공 연계성 중시, 리더십 경험 가산점',
        successRate: '82%',
      },
      {
        id: '3', name: 'KAIST', detail: '전산학부', matchScore: 88,
        type: '수시 학교장추천', competitionRate: '6:1', cost: '전액 장학금',
        strengths: ['과학 역량 우수', '탐구 활동 풍부', '수학/과학 성적 우수', '자기주도 학습'],
        requirements: ['학교장 추천서', '자기소개서', '면접 (심층)', '학교생활기록부'],
        recentTrends: '과학 탐구 역량과 창의성 중시, 팀 프로젝트 경험 선호',
        successRate: '80%',
      },
      {
        id: '4', name: '고려대학교', detail: '컴퓨터학과', matchScore: 87,
        type: '수시 학업우수형', competitionRate: '12:1', cost: '약 450만원/학기',
        strengths: ['내신 우수', '전공 탐구 경험', '리더십 경험', '학업 역량 검증'],
        requirements: ['학생부종합전형 서류', '자기소개서 (1,200자)', '면접', '학교생활기록부'],
        recentTrends: '학업 역량과 전공 적합성 중시, 교과 성적 중요도 높음',
        successRate: '81%',
      },
    ],
    alternatives: [
      { name: '전기전자공학부', institutions: ['서울대', '연세대', 'KAIST'], matchScore: 87 },
      { name: '산업공학과', institutions: ['서울대', '고려대'], matchScore: 84 },
      { name: '데이터사이언스학과', institutions: ['연세대', '성균관대'], matchScore: 82 },
      { name: '정보통신공학과', institutions: ['한양대', '중앙대'], matchScore: 80 },
    ],
  },
  career: {
    pageTitle: 'AI 맞춤 취업 추천',
    pageSubtitle: '나에게 맞는 기업과 직무를 AI가 분석합니다',
    heroTitle: 'AI가 당신의 취업 성공을 돕습니다',
    heroDescription: '학력, 경력, 역량 정보를 바탕으로 최적의 기업과 직무를 추천하고, 합격 전략을 제시합니다.',
    formLabels: {
      field1: '출신 대학',
      field1Placeholder: '예: 서울대학교',
      field2: '전공',
      field2Placeholder: '예: 컴퓨터공학과',
      field3: '학점 (4.5 만점)',
      field3Placeholder: '예: 3.8',
      field4: '희망 직무',
      field4Placeholder: '예: 백엔드 개발, PM',
      freeformTitle: '경력 및 경험',
      experiences: '인턴/프로젝트 경험',
      experiencesPlaceholder: '인턴, 프로젝트, 대외활동, 자격증 등 주요 경험을 자유롭게 작성해주세요',
      strengths: '핵심 역량',
      strengthsPlaceholder: '기술 스택, 소프트 스킬, 어학 능력 등 핵심 역량을 작성해주세요',
      goals: '커리어 목표',
      goalsPlaceholder: '어떤 분야에서 어떤 역할을 하고 싶으신가요?',
    },
    analyzingSteps: [
      '✓ 역량 프로필 분석 완료',
      '✓ 경력 및 경험 평가 완료',
      '✓ 기업별 적합도 계산 중...',
      '✓ 취업 전략 수립 중...',
    ],
    resultSummaryUnit: '최적 기업',
    alternativeTitle: '다른 직무 후보',
    nextSteps: [
      { title: '현직자 러너 매칭', description: '추천 기업의 현직자와 연결되어 실제 업무 경험을 들어보세요' },
      { title: 'AI 자소서 작성', description: 'AI의 도움을 받아 합격 가능성 높은 자기소개서를 작성하세요' },
      { title: '전략적 준비', description: '추천받은 정보를 바탕으로 체계적인 취업 준비를 시작하세요' },
    ],
    recommendations: [
      {
        id: '1', name: '네이버', detail: '백엔드 개발', matchScore: 93,
        type: '신입 공채', competitionRate: '50:1', cost: '연봉 5,500만원~',
        strengths: ['기술 스택 적합', '프로젝트 경험 우수', '성장 잠재력', '전공 관련성 높음'],
        requirements: ['자기소개서', '코딩 테스트', '기술 면접 (2회)', '인성 면접'],
        recentTrends: '실무 프로젝트 경험과 문제 해결 능력 중시, 오픈소스 기여 가산점',
        successRate: '85%',
      },
      {
        id: '2', name: '카카오', detail: '서버 개발', matchScore: 91,
        type: '신입 수시', competitionRate: '40:1', cost: '연봉 5,200만원~',
        strengths: ['개발 역량 우수', '팀 협업 경험', '기술 다양성', '자기주도 학습'],
        requirements: ['이력서/포트폴리오', '코딩 테스트', '기술 면접', '컬처핏 면접'],
        recentTrends: '코드 품질과 시스템 설계 역량 중시, 기술 블로그 운영 선호',
        successRate: '82%',
      },
      {
        id: '3', name: '삼성전자', detail: 'SW 개발', matchScore: 89,
        type: 'GSAT + 면접', competitionRate: '30:1', cost: '연봉 5,800만원~',
        strengths: ['학점 우수', '전공 적합', '체계적 학습', '글로벌 역량'],
        requirements: ['자기소개서', 'GSAT', 'SW 역량 테스트', '면접 (임원 면접 포함)'],
        recentTrends: 'SW 역량 테스트 통과가 핵심, 알고리즘 역량 중요',
        successRate: '79%',
      },
      {
        id: '4', name: '토스', detail: '백엔드 엔지니어', matchScore: 87,
        type: '수시 채용', competitionRate: '35:1', cost: '연봉 6,000만원~',
        strengths: ['문제 해결력', '빠른 학습 능력', '서비스 경험', '기술적 깊이'],
        requirements: ['이력서', '과제 전형', '기술 면접 (3회)', '리더십 면접'],
        recentTrends: '서비스 이해도와 기술적 깊이 동시 중시, 스타트업 경험 가산점',
        successRate: '77%',
      },
    ],
    alternatives: [
      { name: '프론트엔드 개발', institutions: ['네이버', '카카오', '토스'], matchScore: 88 },
      { name: 'PM/기획', institutions: ['네이버', '쿠팡'], matchScore: 83 },
      { name: '데이터 엔지니어', institutions: ['카카오', '라인'], matchScore: 81 },
      { name: 'DevOps', institutions: ['토스', '배달의민족'], matchScore: 79 },
    ],
  },
  certification: {
    pageTitle: 'AI 맞춤 자격증 추천',
    pageSubtitle: '나에게 맞는 자격증과 전략을 AI가 분석합니다',
    heroTitle: 'AI가 당신의 자격증 합격을 돕습니다',
    heroDescription: '학력, 경험, 목표를 바탕으로 최적의 자격증과 학습 전략을 추천합니다.',
    formLabels: {
      field1: '학력/전공',
      field1Placeholder: '예: 경영학과 졸업',
      field2: '관심 분야',
      field2Placeholder: '예: 회계, IT',
      field3: '현재 실력 수준',
      field3Placeholder: '예: 중급, 기초',
      field4: '목표 시험일',
      field4Placeholder: '예: 2025년 하반기',
      freeformTitle: '추가 정보',
      experiences: '관련 학습/업무 경험',
      experiencesPlaceholder: '관련 과목 수강, 실무 경험, 기존 자격증 등을 자유롭게 작성해주세요',
      strengths: '나의 강점',
      strengthsPlaceholder: '관련 지식, 학습 능력, 집중력 등 강점을 작성해주세요',
      goals: '자격증 취득 목표',
      goalsPlaceholder: '자격증을 통해 어떤 목표를 달성하고 싶으신가요?',
    },
    analyzingSteps: [
      '✓ 역량 수준 분석 완료',
      '✓ 경험 및 배경 평가 완료',
      '✓ 자격증별 적합도 계산 중...',
      '✓ 학습 전략 수립 중...',
    ],
    resultSummaryUnit: '추천 자격증',
    alternativeTitle: '다른 자격증 후보',
    nextSteps: [
      { title: '합격자 러너 매칭', description: '추천 자격증 합격자와 연결되어 학습 전략을 들어보세요' },
      { title: 'AI 포트폴리오 작성', description: 'AI의 도움을 받아 체계적인 학습 계획을 수립하세요' },
      { title: '전략적 학습', description: '추천받은 정보를 바탕으로 효율적인 자격증 준비를 시작하세요' },
    ],
    recommendations: [
      {
        id: '1', name: 'CPA (공인회계사)', detail: '회계/세무 분야', matchScore: 92,
        type: '국가전문자격', competitionRate: '합격률 18%', cost: '학원비 약 300만원',
        strengths: ['전공 관련성 높음', '기초 회계 지식 보유', '꾸준한 학습 능력', '분석적 사고'],
        requirements: ['1차: 객관식 5과목', '2차: 주관식 4과목', '학점 이수 요건 (24학점)', '수험 기간 평균 2년'],
        recentTrends: '회계감사 실무 중심 출제 경향 강화, 국제회계기준(IFRS) 비중 증가',
        successRate: '72%',
      },
      {
        id: '2', name: '정보처리기사', detail: 'IT/소프트웨어 분야', matchScore: 90,
        type: '국가기술자격', competitionRate: '합격률 45%', cost: '교재비 약 5만원',
        strengths: ['IT 관심도 높음', '프로그래밍 경험', '논리적 사고력', '빠른 학습 능력'],
        requirements: ['필기: 5과목 객관식', '실기: 프로그래밍 실습', '관련학과 졸업 또는 실무경력', '수험 기간 2~3개월'],
        recentTrends: '실기 프로그래밍 비중 확대, Python/Java 출제 증가',
        successRate: '88%',
      },
      {
        id: '3', name: 'SQLD', detail: '데이터베이스 분야', matchScore: 88,
        type: '민간자격', competitionRate: '합격률 55%', cost: '교재비 약 3만원',
        strengths: ['데이터 관심 높음', 'SQL 기초 보유', '빠른 학습', '실무 연계성'],
        requirements: ['필기: 2과목 객관식', '합격 커트라인 60점', '별도 자격 요건 없음', '수험 기간 1~2개월'],
        recentTrends: 'SQL 실무 활용 문제 증가, 성능 최적화 관련 출제 비중 증가',
        successRate: '90%',
      },
      {
        id: '4', name: 'TOEIC 900+', detail: '어학 분야', matchScore: 85,
        type: '어학시험', competitionRate: '상위 10%', cost: '시험비 약 5만원',
        strengths: ['영어 기초 보유', '학습 의지 높음', '꾸준한 학습 습관', '실전 경험'],
        requirements: ['LC: 100문항', 'RC: 100문항', '시험 시간 2시간', '수험 기간 2~3개월'],
        recentTrends: '실전 비즈니스 영어 중심 출제, 파트7 지문 난이도 상승',
        successRate: '85%',
      },
    ],
    alternatives: [
      { name: '빅데이터분석기사', institutions: ['한국데이터산업진흥원'], matchScore: 86 },
      { name: 'ADsP', institutions: ['한국데이터산업진흥원'], matchScore: 84 },
      { name: '컴퓨터활용능력 1급', institutions: ['대한상공회의소'], matchScore: 82 },
      { name: '한국사능력검정 1급', institutions: ['국사편찬위원회'], matchScore: 80 },
    ],
  },
  other: {
    pageTitle: 'AI 맞춤 경로 추천',
    pageSubtitle: '나에게 맞는 목표 달성 경로를 AI가 분석합니다',
    heroTitle: 'AI가 당신의 목표 달성을 돕습니다',
    heroDescription: '배경, 역량, 목표를 바탕으로 최적의 경로와 전략을 추천합니다.',
    formLabels: {
      field1: '학력/경력',
      field1Placeholder: '예: 서울대 경영학과 졸업',
      field2: '관심 분야',
      field2Placeholder: '예: 해외 MBA, 대학원',
      field3: '현재 수준/경력',
      field3Placeholder: '예: 3년차, 석사',
      field4: '목표 시기',
      field4Placeholder: '예: 2026년 상반기',
      freeformTitle: '추가 정보',
      experiences: '관련 경험',
      experiencesPlaceholder: '목표와 관련된 경험, 활동, 성과 등을 자유롭게 작성해주세요',
      strengths: '나의 강점',
      strengthsPlaceholder: '역량, 네트워크, 특기 등 강점을 작성해주세요',
      goals: '구체적 목표',
      goalsPlaceholder: '어떤 목표를 달성하고 싶으신가요? 구체적으로 작성해주세요.',
    },
    analyzingSteps: [
      '✓ 역량 프로필 분석 완료',
      '✓ 경험 및 배경 평가 완료',
      '✓ 목표별 경로 계산 중...',
      '✓ 실행 전략 수립 중...',
    ],
    resultSummaryUnit: '추천 경로',
    alternativeTitle: '다른 경로 후보',
    nextSteps: [
      { title: '경험자 러너 매칭', description: '같은 목표를 달성한 선배와 연결되어 실제 경험을 들어보세요' },
      { title: 'AI 문서 작성', description: 'AI의 도움을 받아 필요한 서류를 체계적으로 준비하세요' },
      { title: '전략적 실행', description: '추천받은 경로를 바탕으로 단계별 실행 계획을 시작하세요' },
    ],
    recommendations: [
      {
        id: '1', name: '미국 MBA', detail: 'Top 20 비즈니스 스쿨', matchScore: 90,
        type: '해외 대학원', competitionRate: '합격률 20%', cost: '연간 약 8,000만원',
        strengths: ['경력 배경 적합', '리더십 경험 보유', '글로벌 역량', '명확한 커리어 목표'],
        requirements: ['GMAT 700+', 'TOEFL 100+', '에세이 3~5편', '추천서 2~3통'],
        recentTrends: '다양한 산업 배경 선호, 사회적 영향력과 리더십 스토리 중시',
        successRate: '82%',
      },
      {
        id: '2', name: '국내 대학원 (석사)', detail: '연구 중심 대학원', matchScore: 88,
        type: '국내 대학원', competitionRate: '합격률 40%', cost: '등록금 + 장학금',
        strengths: ['학점 우수', '연구 관심도', '교수 네트워크', '탐구 역량'],
        requirements: ['연구 계획서', '영어 성적', '면접', '교수 사전 컨택'],
        recentTrends: '연구 실적과 연구 계획의 구체성 중시, 교수 랩 매칭 중요',
        successRate: '80%',
      },
      {
        id: '3', name: '해외 취업', detail: '글로벌 IT 기업', matchScore: 85,
        type: '해외 취업', competitionRate: '높은 경쟁', cost: '비자/생활비 약 2,000만원',
        strengths: ['기술 역량 우수', '영어 능력 보유', '글로벌 마인드', '적응력'],
        requirements: ['영문 이력서', '기술 인터뷰', '비자 스폰서 확보', '현지 네트워킹'],
        recentTrends: '원격 근무 기회 확대, AI/ML 분야 수요 급증',
        successRate: '75%',
      },
      {
        id: '4', name: '창업', detail: '스타트업 창업', matchScore: 82,
        type: '창업/사업', competitionRate: '생존율 30%', cost: '초기 투자금 변동',
        strengths: ['아이디어 구체성', '기술적 실현 가능', '시장 이해도', '실행력'],
        requirements: ['사업 계획서', '프로토타입', '팀 구성', '투자/지원금 확보'],
        recentTrends: '정부 창업 지원 확대, AI 기반 스타트업 투자 증가',
        successRate: '68%',
      },
    ],
    alternatives: [
      { name: '교환학생', institutions: ['유럽', '미국', '일본'], matchScore: 84 },
      { name: '워킹홀리데이', institutions: ['호주', '캐나다', '일본'], matchScore: 78 },
      { name: '전과/복수전공', institutions: ['재학 대학'], matchScore: 86 },
      { name: '해외 봉사', institutions: ['NGO/KOICA'], matchScore: 75 },
    ],
  },
};
