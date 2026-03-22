import type { Category } from '../components/GlobalNav';
import type { Mentor } from '../App';

export interface CategoryMentorConfig {
  filterOptions: string[];
  mentors: Mentor[];
}

const transferMentors: Mentor[] = [
  { id: 't1', name: '러너 #2847', university: '연세대', major: '경영학과', year: '22학번', rating: 4.9, reviews: 23, sessions: 35, successRate: 87, responseTime: '2시간', price: 65000, badge: 'gold', verified: true, avatar: '👩‍🎓' },
  { id: 't2', name: '러너 #1923', university: '고려대', major: '경제학과', year: '23학번', rating: 4.8, reviews: 18, sessions: 22, successRate: 82, responseTime: '1시간', price: 45000, badge: 'silver', verified: true, avatar: '👨‍🎓' },
  { id: 't3', name: '러너 #5621', university: '성균관대', major: '경영학과', year: '23학번', rating: 4.7, reviews: 12, sessions: 15, successRate: 80, responseTime: '3시간', price: 38000, badge: 'silver', verified: true, avatar: '👩‍💼' },
  { id: 't4', name: '러너 #3142', university: '서강대', major: '경영학과', year: '21학번', rating: 4.9, reviews: 31, sessions: 48, successRate: 91, responseTime: '1시간', price: 75000, badge: 'gold', verified: true, avatar: '👨‍💼' },
  { id: 't5', name: '러너 #7834', university: '한양대', major: '경영학과', year: '22학번', rating: 4.6, reviews: 9, sessions: 12, successRate: 75, responseTime: '4시간', price: 25000, badge: 'bronze', verified: true, avatar: '👨‍🎓' },
  { id: 't6', name: '러너 #4521', university: '중앙대', major: '경제학과', year: '21학번', rating: 4.8, reviews: 27, sessions: 42, successRate: 88, responseTime: '2시간', price: 70000, badge: 'gold', verified: true, avatar: '👩‍💼' },
  { id: 't7', name: '러너 #9234', university: '경희대', major: '글로벌경영', year: '22학번', rating: 4.7, reviews: 15, sessions: 20, successRate: 81, responseTime: '3시간', price: 42000, badge: 'silver', verified: true, avatar: '👨‍💼' },
  { id: 't8', name: '러너 #6712', university: '연세대', major: '경영학과', year: '23학번', rating: 4.9, reviews: 34, sessions: 51, successRate: 92, responseTime: '1시간', price: 80000, badge: 'gold', verified: true, avatar: '👩‍🎓' },
  { id: 't9', name: '러너 #2156', university: '이화여대', major: '경제학과', year: '22학번', rating: 4.6, reviews: 11, sessions: 14, successRate: 77, responseTime: '5시간', price: 30000, badge: 'silver', verified: true, avatar: '👨‍🎓' },
  { id: 't10', name: '러너 #8945', university: '고려대', major: '경영학과', year: '21학번', rating: 4.8, reviews: 29, sessions: 44, successRate: 89, responseTime: '2시간', price: 72000, badge: 'gold', verified: true, avatar: '👩‍💼' },
  { id: 't11', name: '러너 #3678', university: '서강대', major: '글로벌경영', year: '23학번', rating: 4.7, reviews: 16, sessions: 21, successRate: 83, responseTime: '3시간', price: 45000, badge: 'silver', verified: true, avatar: '👨‍💼' },
  { id: 't12', name: '러너 #5289', university: '성균관대', major: '경영학과', year: '22학번', rating: 4.5, reviews: 8, sessions: 10, successRate: 72, responseTime: '6시간', price: 20000, badge: 'bronze', verified: true, avatar: '👩‍🎓' },
];

const admissionMentors: Mentor[] = [
  { id: 'a1', name: '러너 #4210', university: '서울대', major: '컴퓨터공학부', year: '23학번', rating: 4.9, reviews: 42, sessions: 58, successRate: 90, responseTime: '2시간', price: 75000, badge: 'gold', verified: true, avatar: '👨‍🎓' },
  { id: 'a2', name: '러너 #3891', university: '연세대', major: '경영학과', year: '22학번', rating: 4.8, reviews: 31, sessions: 45, successRate: 88, responseTime: '1시간', price: 68000, badge: 'gold', verified: true, avatar: '👩‍🎓' },
  { id: 'a3', name: '러너 #7543', university: 'KAIST', major: '전산학부', year: '23학번', rating: 4.9, reviews: 28, sessions: 38, successRate: 92, responseTime: '3시간', price: 72000, badge: 'gold', verified: true, avatar: '👨‍💼' },
  { id: 'a4', name: '러너 #2187', university: '고려대', major: '전기전자', year: '22학번', rating: 4.7, reviews: 19, sessions: 25, successRate: 84, responseTime: '2시간', price: 48000, badge: 'silver', verified: true, avatar: '👩‍💼' },
  { id: 'a5', name: '러너 #6329', university: '서울대', major: '의예과', year: '21학번', rating: 4.9, reviews: 52, sessions: 71, successRate: 85, responseTime: '4시간', price: 100000, badge: 'platinum', verified: true, avatar: '👨‍🎓' },
  { id: 'a6', name: '러너 #8412', university: '연세대', major: '전기전자', year: '23학번', rating: 4.6, reviews: 14, sessions: 18, successRate: 79, responseTime: '3시간', price: 40000, badge: 'silver', verified: true, avatar: '👩‍🎓' },
  { id: 'a7', name: '러너 #1534', university: '고려대', major: '경영학과', year: '22학번', rating: 4.8, reviews: 25, sessions: 35, successRate: 86, responseTime: '2시간', price: 60000, badge: 'gold', verified: true, avatar: '👨‍💼' },
  { id: 'a8', name: '러너 #9876', university: '성균관대', major: '소프트웨어', year: '23학번', rating: 4.5, reviews: 10, sessions: 13, successRate: 76, responseTime: '5시간', price: 30000, badge: 'silver', verified: true, avatar: '👩‍💼' },
  { id: 'a9', name: '러너 #3245', university: '한양대', major: '기계공학', year: '22학번', rating: 4.7, reviews: 17, sessions: 22, successRate: 82, responseTime: '3시간', price: 45000, badge: 'silver', verified: true, avatar: '👨‍🎓' },
  { id: 'a10', name: '러너 #5678', university: '서울대', major: '경제학과', year: '21학번', rating: 4.8, reviews: 36, sessions: 50, successRate: 89, responseTime: '2시간', price: 78000, badge: 'gold', verified: true, avatar: '👩‍🎓' },
  { id: 'a11', name: '러너 #7891', university: 'POSTECH', major: '화학공학', year: '23학번', rating: 4.6, reviews: 12, sessions: 16, successRate: 80, responseTime: '4시간', price: 38000, badge: 'silver', verified: true, avatar: '👨‍💼' },
  { id: 'a12', name: '러너 #4567', university: '연세대', major: '심리학과', year: '22학번', rating: 4.5, reviews: 9, sessions: 11, successRate: 74, responseTime: '6시간', price: 25000, badge: 'bronze', verified: true, avatar: '👩‍💼' },
];

const careerMentors: Mentor[] = [
  { id: 'c1', name: '러너 #5210', university: '네이버', major: '백엔드 개발', year: '3년차', rating: 4.9, reviews: 38, sessions: 52, successRate: 91, responseTime: '2시간', price: 78000, badge: 'gold', verified: true, avatar: '👨‍💻' },
  { id: 'c2', name: '러너 #3421', university: '카카오', major: '프론트엔드', year: '4년차', rating: 4.8, reviews: 29, sessions: 40, successRate: 87, responseTime: '1시간', price: 68000, badge: 'gold', verified: true, avatar: '👩‍💻' },
  { id: 'c3', name: '러너 #7812', university: '삼성전자', major: 'SW 개발', year: '5년차', rating: 4.7, reviews: 22, sessions: 30, successRate: 83, responseTime: '3시간', price: 48000, badge: 'silver', verified: true, avatar: '👨‍💼' },
  { id: 'c4', name: '러너 #2345', university: '토스', major: '서버 엔지니어', year: '3년차', rating: 4.9, reviews: 35, sessions: 48, successRate: 90, responseTime: '2시간', price: 80000, badge: 'gold', verified: true, avatar: '👩‍💼' },
  { id: 'c5', name: '러너 #6789', university: 'LG전자', major: '마케팅', year: '6년차', rating: 4.6, reviews: 15, sessions: 19, successRate: 78, responseTime: '4시간', price: 42000, badge: 'silver', verified: true, avatar: '👨‍🎓' },
  { id: 'c6', name: '러너 #8901', university: '현대자동차', major: '기획/PM', year: '4년차', rating: 4.8, reviews: 26, sessions: 36, successRate: 85, responseTime: '2시간', price: 65000, badge: 'gold', verified: true, avatar: '👩‍🎓' },
  { id: 'c7', name: '러너 #1234', university: '쿠팡', major: '데이터 분석', year: '3년차', rating: 4.7, reviews: 18, sessions: 24, successRate: 82, responseTime: '3시간', price: 50000, badge: 'silver', verified: true, avatar: '👨‍💻' },
  { id: 'c8', name: '러너 #4567', university: '네이버', major: 'PM/기획', year: '5년차', rating: 4.5, reviews: 11, sessions: 14, successRate: 76, responseTime: '5시간', price: 30000, badge: 'silver', verified: true, avatar: '👩‍💻' },
  { id: 'c9', name: '러너 #9012', university: 'SK하이닉스', major: '반도체 설계', year: '4년차', rating: 4.8, reviews: 24, sessions: 33, successRate: 86, responseTime: '3시간', price: 60000, badge: 'gold', verified: true, avatar: '👨‍💼' },
  { id: 'c10', name: '러너 #3456', university: '카카오', major: '디자인', year: '3년차', rating: 4.6, reviews: 13, sessions: 17, successRate: 79, responseTime: '4시간', price: 40000, badge: 'silver', verified: true, avatar: '👩‍💼' },
  { id: 'c11', name: '러너 #7890', university: '배달의민족', major: '백엔드 개발', year: '2년차', rating: 4.5, reviews: 8, sessions: 10, successRate: 73, responseTime: '6시간', price: 22000, badge: 'bronze', verified: true, avatar: '👨‍🎓' },
  { id: 'c12', name: '러너 #2109', university: '라인', major: '프론트엔드', year: '4년차', rating: 4.9, reviews: 41, sessions: 57, successRate: 93, responseTime: '1시간', price: 95000, badge: 'platinum', verified: true, avatar: '👩‍🎓' },
];

const certificationMentors: Mentor[] = [
  { id: 'ce1', name: '러너 #4312', university: 'CPA 합격', major: '회계/세무', year: '2024합격', rating: 4.9, reviews: 32, sessions: 44, successRate: 88, responseTime: '2시간', price: 70000, badge: 'gold', verified: true, avatar: '👨‍💼' },
  { id: 'ce2', name: '러너 #8765', university: '변호사시험', major: '법률', year: '2024합격', rating: 4.8, reviews: 25, sessions: 35, successRate: 82, responseTime: '3시간', price: 75000, badge: 'gold', verified: true, avatar: '👩‍💼' },
  { id: 'ce3', name: '러너 #2198', university: '정보처리기사', major: 'IT', year: '2024합격', rating: 4.7, reviews: 19, sessions: 26, successRate: 90, responseTime: '2시간', price: 42000, badge: 'silver', verified: true, avatar: '👨‍🎓' },
  { id: 'ce4', name: '러너 #5432', university: 'SQLD', major: '데이터', year: '2024합격', rating: 4.6, reviews: 14, sessions: 18, successRate: 92, responseTime: '4시간', price: 35000, badge: 'silver', verified: true, avatar: '👩‍🎓' },
  { id: 'ce5', name: '러너 #7654', university: 'TOEIC 990', major: '어학', year: '2024취득', rating: 4.9, reviews: 45, sessions: 62, successRate: 94, responseTime: '1시간', price: 90000, badge: 'platinum', verified: true, avatar: '👨‍💻' },
  { id: 'ce6', name: '러너 #3210', university: '한국사 1급', major: '인문', year: '2024합격', rating: 4.5, reviews: 10, sessions: 13, successRate: 95, responseTime: '5시간', price: 28000, badge: 'silver', verified: true, avatar: '👩‍💻' },
  { id: 'ce7', name: '러너 #9871', university: 'CPA 합격', major: '회계/세무', year: '2023합격', rating: 4.8, reviews: 28, sessions: 39, successRate: 85, responseTime: '2시간', price: 65000, badge: 'gold', verified: true, avatar: '👨‍💼' },
  { id: 'ce8', name: '러너 #6543', university: '빅데이터분석기사', major: '데이터', year: '2024합격', rating: 4.7, reviews: 16, sessions: 21, successRate: 87, responseTime: '3시간', price: 45000, badge: 'silver', verified: true, avatar: '👩‍💼' },
  { id: 'ce9', name: '러너 #1098', university: 'OPIC AL', major: '어학', year: '2024취득', rating: 4.6, reviews: 12, sessions: 15, successRate: 86, responseTime: '4시간', price: 35000, badge: 'silver', verified: true, avatar: '👨‍🎓' },
  { id: 'ce10', name: '러너 #8321', university: '감정평가사', major: '부동산', year: '2023합격', rating: 4.9, reviews: 37, sessions: 50, successRate: 78, responseTime: '2시간', price: 80000, badge: 'gold', verified: true, avatar: '👩‍🎓' },
  { id: 'ce11', name: '러너 #4789', university: 'AWS SAA', major: 'IT/클라우드', year: '2024취득', rating: 4.5, reviews: 9, sessions: 11, successRate: 91, responseTime: '6시간', price: 25000, badge: 'bronze', verified: true, avatar: '👨‍💻' },
  { id: 'ce12', name: '러너 #2567', university: '정보보안기사', major: 'IT/보안', year: '2024합격', rating: 4.8, reviews: 22, sessions: 30, successRate: 84, responseTime: '3시간', price: 50000, badge: 'silver', verified: true, avatar: '👩‍💻' },
];

const otherMentors: Mentor[] = [
  { id: 'o1', name: '러너 #6234', university: '미국 MBA', major: '해외 유학', year: '하버드 졸업', rating: 4.9, reviews: 48, sessions: 65, successRate: 88, responseTime: '3시간', price: 100000, badge: 'platinum', verified: true, avatar: '👨‍💼' },
  { id: 'o2', name: '러너 #8912', university: '서울대 대학원', major: '대학원 진학', year: '석사 졸업', rating: 4.8, reviews: 30, sessions: 42, successRate: 85, responseTime: '2시간', price: 68000, badge: 'gold', verified: true, avatar: '👩‍🎓' },
  { id: 'o3', name: '러너 #3456', university: '실리콘밸리', major: '해외 취업', year: '구글 재직', rating: 4.9, reviews: 55, sessions: 72, successRate: 82, responseTime: '4시간', price: 120000, badge: 'platinum', verified: true, avatar: '👨‍💻' },
  { id: 'o4', name: '러너 #7189', university: '스타트업 CEO', major: '창업', year: '시리즈A', rating: 4.7, reviews: 20, sessions: 28, successRate: 70, responseTime: '5시간', price: 48000, badge: 'silver', verified: true, avatar: '👩‍💻' },
  { id: 'o5', name: '러너 #2345', university: '일본 워홀', major: '워킹홀리데이', year: '경험 2년', rating: 4.6, reviews: 15, sessions: 19, successRate: 90, responseTime: '3시간', price: 35000, badge: 'silver', verified: true, avatar: '👨‍🎓' },
  { id: 'o6', name: '러너 #5678', university: 'KAIST 대학원', major: '대학원 진학', year: '박사과정', rating: 4.8, reviews: 26, sessions: 36, successRate: 84, responseTime: '4시간', price: 70000, badge: 'gold', verified: true, avatar: '👩‍💼' },
  { id: 'o7', name: '러너 #9012', university: '영국 유학', major: '해외 유학', year: '옥스포드', rating: 4.7, reviews: 18, sessions: 24, successRate: 80, responseTime: '6시간', price: 50000, badge: 'silver', verified: true, avatar: '👨‍💼' },
  { id: 'o8', name: '러너 #1234', university: '전과 성공', major: '전과/복수전공', year: '공학→경영', rating: 4.5, reviews: 11, sessions: 14, successRate: 92, responseTime: '3시간', price: 28000, badge: 'silver', verified: true, avatar: '👩‍🎓' },
  { id: 'o9', name: '러너 #4567', university: '호주 워홀', major: '워킹홀리데이', year: '경험 1년', rating: 4.6, reviews: 13, sessions: 17, successRate: 88, responseTime: '4시간', price: 38000, badge: 'silver', verified: true, avatar: '👨‍🎓' },
  { id: 'o10', name: '러너 #7890', university: '독일 대학원', major: '해외 유학', year: '석사 졸업', rating: 4.8, reviews: 22, sessions: 31, successRate: 83, responseTime: '5시간', price: 55000, badge: 'gold', verified: true, avatar: '👩‍💻' },
  { id: 'o11', name: '러너 #3789', university: 'NGO 활동', major: '해외 봉사', year: 'KOICA', rating: 4.5, reviews: 9, sessions: 12, successRate: 86, responseTime: '6시간', price: 20000, badge: 'bronze', verified: true, avatar: '👨‍💼' },
  { id: 'o12', name: '러너 #6012', university: '이직 성공', major: '이직/전직', year: '대기업→스타트업', rating: 4.7, reviews: 17, sessions: 23, successRate: 81, responseTime: '3시간', price: 45000, badge: 'silver', verified: true, avatar: '👩‍💼' },
];

export const CATEGORY_MENTORS: Record<Category, CategoryMentorConfig> = {
  transfer: {
    filterOptions: ['all', '연세대', '고려대', '서강대', '성균관대'],
    mentors: transferMentors,
  },
  admission: {
    filterOptions: ['all', '서울대', '연세대', '고려대', 'KAIST'],
    mentors: admissionMentors,
  },
  career: {
    filterOptions: ['all', '네이버', '카카오', '삼성전자', '토스'],
    mentors: careerMentors,
  },
  certification: {
    filterOptions: ['all', 'CPA 합격', '정보처리기사', 'TOEIC 990', '변호사시험'],
    mentors: certificationMentors,
  },
  other: {
    filterOptions: ['all', '미국 MBA', '서울대 대학원', '실리콘밸리', '스타트업 CEO'],
    mentors: otherMentors,
  },
};
