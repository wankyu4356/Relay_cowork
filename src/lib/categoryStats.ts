import type { Category } from '../components/GlobalNav';

export interface InstitutionStat {
  name: string;
  rate: number;
  count: number;
  color: string;
}

export interface FieldStat {
  name: string;
  rate: number;
  icon: string;
}

export interface MonthlyTrend {
  month: string;
  rate: number;
}

export interface CategoryStats {
  overallRate: number;
  totalMentees: number;
  successCount: number;
  reportTitle: string;
  institutionLabel: string;
  institutionIcon: string;
  fieldLabel: string;
  institutions: InstitutionStat[];
  fields: FieldStat[];
  monthlyTrend: MonthlyTrend[];
}

export const CATEGORY_STATS: Record<Category, CategoryStats> = {
  transfer: {
    overallRate: 87,
    totalMentees: 324,
    successCount: 282,
    reportTitle: '릴레이 합격률 리포트',
    institutionLabel: '대학별 합격률',
    institutionIcon: 'graduation',
    fieldLabel: '인기 학과별 합격률',
    institutions: [
      { name: '연세대', rate: 91, count: 42, color: 'bg-blue-500' },
      { name: '고려대', rate: 89, count: 38, color: 'bg-red-500' },
      { name: '성균관대', rate: 88, count: 35, color: 'bg-green-600' },
      { name: '한양대', rate: 86, count: 31, color: 'bg-sky-500' },
      { name: '중앙대', rate: 85, count: 28, color: 'bg-indigo-500' },
      { name: '경희대', rate: 84, count: 25, color: 'bg-purple-500' },
    ],
    fields: [
      { name: '경영학과', rate: 90, icon: '📊' },
      { name: '경제학과', rate: 88, icon: '📈' },
      { name: '심리학과', rate: 87, icon: '🧠' },
      { name: '미디어학과', rate: 85, icon: '📱' },
      { name: '컴퓨터공학과', rate: 83, icon: '💻' },
      { name: '간호학과', rate: 82, icon: '🏥' },
    ],
    monthlyTrend: [
      { month: '9월', rate: 78 },
      { month: '10월', rate: 81 },
      { month: '11월', rate: 83 },
      { month: '12월', rate: 85 },
      { month: '1월', rate: 87 },
      { month: '2월', rate: 87 },
    ],
  },
  admission: {
    overallRate: 84,
    totalMentees: 512,
    successCount: 430,
    reportTitle: '릴레이 입시 합격률 리포트',
    institutionLabel: '대학별 합격률',
    institutionIcon: 'graduation',
    fieldLabel: '인기 학과별 합격률',
    institutions: [
      { name: '서울대', rate: 82, count: 45, color: 'bg-blue-700' },
      { name: '연세대', rate: 88, count: 62, color: 'bg-blue-500' },
      { name: '고려대', rate: 87, count: 58, color: 'bg-red-500' },
      { name: '서강대', rate: 86, count: 34, color: 'bg-red-400' },
      { name: '성균관대', rate: 85, count: 41, color: 'bg-green-600' },
      { name: '한양대', rate: 84, count: 38, color: 'bg-sky-500' },
    ],
    fields: [
      { name: '컴퓨터공학부', rate: 86, icon: '💻' },
      { name: '경영학과', rate: 88, icon: '📊' },
      { name: '의예과', rate: 78, icon: '🏥' },
      { name: '전기전자공학부', rate: 85, icon: '⚡' },
      { name: '경제학과', rate: 87, icon: '📈' },
      { name: '심리학과', rate: 84, icon: '🧠' },
    ],
    monthlyTrend: [
      { month: '6월', rate: 75 },
      { month: '7월', rate: 78 },
      { month: '8월', rate: 80 },
      { month: '9월', rate: 82 },
      { month: '10월', rate: 84 },
      { month: '11월', rate: 84 },
    ],
  },
  career: {
    overallRate: 81,
    totalMentees: 456,
    successCount: 369,
    reportTitle: '릴레이 취업 성공률 리포트',
    institutionLabel: '기업별 취업률',
    institutionIcon: 'building',
    fieldLabel: '직무별 취업률',
    institutions: [
      { name: '삼성전자', rate: 79, count: 52, color: 'bg-blue-600' },
      { name: 'LG전자', rate: 82, count: 38, color: 'bg-red-500' },
      { name: 'SK하이닉스', rate: 80, count: 29, color: 'bg-orange-500' },
      { name: '현대자동차', rate: 81, count: 35, color: 'bg-sky-600' },
      { name: '네이버', rate: 85, count: 41, color: 'bg-green-600' },
      { name: '카카오', rate: 83, count: 33, color: 'bg-yellow-500' },
    ],
    fields: [
      { name: '소프트웨어 개발', rate: 86, icon: '💻' },
      { name: '마케팅', rate: 82, icon: '📢' },
      { name: '재무/회계', rate: 80, icon: '💰' },
      { name: 'PM/기획', rate: 84, icon: '📋' },
      { name: '데이터 분석', rate: 85, icon: '📊' },
      { name: '디자인', rate: 81, icon: '🎨' },
    ],
    monthlyTrend: [
      { month: '상반기', rate: 74 },
      { month: '7월', rate: 76 },
      { month: '8월', rate: 78 },
      { month: '9월', rate: 80 },
      { month: '10월', rate: 81 },
      { month: '하반기', rate: 81 },
    ],
  },
  certification: {
    overallRate: 78,
    totalMentees: 289,
    successCount: 225,
    reportTitle: '릴레이 자격증 합격률 리포트',
    institutionLabel: '자격증별 합격률',
    institutionIcon: 'award',
    fieldLabel: '분야별 합격률',
    institutions: [
      { name: 'CPA', rate: 72, count: 34, color: 'bg-blue-600' },
      { name: '변호사시험', rate: 68, count: 21, color: 'bg-indigo-600' },
      { name: '정보처리기사', rate: 88, count: 45, color: 'bg-green-500' },
      { name: 'SQLD', rate: 90, count: 38, color: 'bg-teal-500' },
      { name: '한국사능력검정', rate: 92, count: 52, color: 'bg-orange-500' },
      { name: 'TOEIC 900+', rate: 85, count: 41, color: 'bg-purple-500' },
    ],
    fields: [
      { name: 'IT/정보통신', rate: 86, icon: '💻' },
      { name: '회계/세무', rate: 74, icon: '💰' },
      { name: '법률', rate: 70, icon: '⚖️' },
      { name: '어학', rate: 85, icon: '🌐' },
      { name: '의료/보건', rate: 76, icon: '🏥' },
      { name: '디자인/미디어', rate: 82, icon: '🎨' },
    ],
    monthlyTrend: [
      { month: '1월', rate: 70 },
      { month: '3월', rate: 73 },
      { month: '5월', rate: 75 },
      { month: '7월', rate: 77 },
      { month: '9월', rate: 78 },
      { month: '11월', rate: 78 },
    ],
  },
  other: {
    overallRate: 76,
    totalMentees: 187,
    successCount: 142,
    reportTitle: '릴레이 목표 달성률 리포트',
    institutionLabel: '목표별 성공률',
    institutionIcon: 'target',
    fieldLabel: '분야별 성공률',
    institutions: [
      { name: '해외 유학', rate: 82, count: 28, color: 'bg-blue-500' },
      { name: '대학원 진학', rate: 80, count: 35, color: 'bg-indigo-500' },
      { name: '창업', rate: 68, count: 18, color: 'bg-orange-500' },
      { name: '해외 취업', rate: 75, count: 22, color: 'bg-green-500' },
      { name: '이직', rate: 79, count: 31, color: 'bg-purple-500' },
      { name: '전과/복수전공', rate: 85, count: 24, color: 'bg-teal-500' },
    ],
    fields: [
      { name: '경영/경제', rate: 80, icon: '📊' },
      { name: '공학', rate: 78, icon: '⚙️' },
      { name: '인문/사회', rate: 76, icon: '📚' },
      { name: '자연과학', rate: 74, icon: '🔬' },
      { name: '예체능', rate: 72, icon: '🎨' },
      { name: '의약학', rate: 70, icon: '🏥' },
    ],
    monthlyTrend: [
      { month: '1분기', rate: 68 },
      { month: '4월', rate: 71 },
      { month: '6월', rate: 73 },
      { month: '8월', rate: 75 },
      { month: '10월', rate: 76 },
      { month: '4분기', rate: 76 },
    ],
  },
};
