import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Search,
  SlidersHorizontal,
  Star,
  TrendingUp,
  Clock,
  X,
  Network,
  Users,
  Award,
  Zap,
  CheckCircle2,
  MessageCircle,
  DollarSign,
  Calendar,
  Target,
  Sparkles
} from 'lucide-react';
import type { Mentor, Screen } from '../App';
import { getRunnerColor, getRunnerAvatar } from '../lib/runnerUtils';
import { useMentors } from '../hooks/useMentors';

interface MentorSearchProps {
  onBack: () => void;
  onMentorSelect: (mentor: Mentor) => void;
  onNavigate?: (screen: Screen) => void;
}

const LOCAL_MENTORS: Mentor[] = [
  {
    id: '1',
    name: '러너 #2847',
    university: '연세대',
    major: '경영학과',
    year: '22학번',
    rating: 4.9,
    reviews: 23,
    sessions: 35,
    successRate: 87,
    responseTime: '2시간',
    price: 80000,
    badge: 'gold',
    verified: true,
    avatar: '👩‍🎓',
  },
  {
    id: '2',
    name: '러너 #1923',
    university: '고려대',
    major: '경제학과',
    year: '23학번',
    rating: 4.8,
    reviews: 18,
    sessions: 22,
    successRate: 82,
    responseTime: '1시간',
    price: 70000,
    badge: 'silver',
    verified: true,
    avatar: '👨‍🎓',
  },
  {
    id: '3',
    name: '러너 #5621',
    university: '성균관대',
    major: '경영학과',
    year: '23학번',
    rating: 4.7,
    reviews: 12,
    sessions: 15,
    successRate: 80,
    responseTime: '3시간',
    price: 60000,
    badge: 'silver',
    verified: true,
    avatar: '👩‍💼',
  },
  {
    id: '4',
    name: '러너 #3142',
    university: '서강대',
    major: '경영학과',
    year: '21학번',
    rating: 4.9,
    reviews: 31,
    sessions: 48,
    successRate: 91,
    responseTime: '1시간',
    price: 100000,
    badge: 'gold',
    verified: true,
    avatar: '👨‍💼',
  },
  {
    id: '5',
    name: '러너 #7834',
    university: '한양대',
    major: '경영학과',
    year: '22학번',
    rating: 4.6,
    reviews: 9,
    sessions: 12,
    successRate: 75,
    responseTime: '4시간',
    price: 50000,
    badge: 'bronze',
    verified: true,
    avatar: '👨‍🎓',
  },
  {
    id: '6',
    name: '러너 #4521',
    university: '중앙대',
    major: '경제학과',
    year: '21학번',
    rating: 4.8,
    reviews: 27,
    sessions: 42,
    successRate: 88,
    responseTime: '2시간',
    price: 90000,
    badge: 'gold',
    verified: true,
    avatar: '👩‍💼',
  },
  {
    id: '7',
    name: '러너 #9234',
    university: '경희대',
    major: '글로벌경영',
    year: '22학번',
    rating: 4.7,
    reviews: 15,
    sessions: 20,
    successRate: 81,
    responseTime: '3시간',
    price: 65000,
    badge: 'silver',
    verified: true,
    avatar: '👨‍💼',
  },
  {
    id: '8',
    name: '러너 #6712',
    university: '연세대',
    major: '경영학과',
    year: '23학번',
    rating: 4.9,
    reviews: 34,
    sessions: 51,
    successRate: 92,
    responseTime: '1시간',
    price: 110000,
    badge: 'gold',
    verified: true,
    avatar: '👩‍🎓',
  },
  {
    id: '9',
    name: '러너 #2156',
    university: '이화여대',
    major: '경제학과',
    year: '22학번',
    rating: 4.6,
    reviews: 11,
    sessions: 14,
    successRate: 77,
    responseTime: '5시간',
    price: 55000,
    badge: 'bronze',
    verified: true,
    avatar: '👨‍🎓',
  },
  {
    id: '10',
    name: '러너 #8945',
    university: '고려대',
    major: '경영학과',
    year: '21학번',
    rating: 4.8,
    reviews: 29,
    sessions: 44,
    successRate: 89,
    responseTime: '2시간',
    price: 95000,
    badge: 'gold',
    verified: true,
    avatar: '👩‍💼',
  },
  {
    id: '11',
    name: '러너 #3678',
    university: '서강대',
    major: '글로벌경영',
    year: '23학번',
    rating: 4.7,
    reviews: 16,
    sessions: 21,
    successRate: 83,
    responseTime: '3시간',
    price: 68000,
    badge: 'silver',
    verified: true,
    avatar: '👨‍💼',
  },
  {
    id: '12',
    name: '러너 #5289',
    university: '성균관대',
    major: '경영학과',
    year: '22학번',
    rating: 4.5,
    reviews: 8,
    sessions: 10,
    successRate: 72,
    responseTime: '6시간',
    price: 48000,
    badge: 'bronze',
    verified: true,
    avatar: '👩‍🎓',
  },
  {
    id: '13',
    name: '러너 #7123',
    university: '한양대',
    major: '경제학과',
    year: '21학번',
    rating: 4.9,
    reviews: 38,
    sessions: 56,
    successRate: 93,
    responseTime: '1시간',
    price: 120000,
    badge: 'gold',
    verified: true,
    avatar: '👨‍🎓',
  },
  {
    id: '14',
    name: '러너 #4892',
    university: '중앙대',
    major: '경영학과',
    year: '23학번',
    rating: 4.7,
    reviews: 19,
    sessions: 25,
    successRate: 84,
    responseTime: '2시간',
    price: 72000,
    badge: 'silver',
    verified: true,
    avatar: '👩‍💼',
  },
  {
    id: '15',
    name: '러너 #1567',
    university: '경희대',
    major: '글로벌경영',
    year: '22학번',
    rating: 4.8,
    reviews: 24,
    sessions: 36,
    successRate: 86,
    responseTime: '2시간',
    price: 82000,
    badge: 'gold',
    verified: true,
    avatar: '👨‍💼',
  },
  {
    id: '16',
    name: '러너 #9431',
    university: '연세대',
    major: '경영학과',
    year: '21학번',
    rating: 4.6,
    reviews: 13,
    sessions: 17,
    successRate: 78,
    responseTime: '4시간',
    price: 58000,
    badge: 'silver',
    verified: true,
    avatar: '👩‍🎓',
  },
  {
    id: '17',
    name: '러너 #6254',
    university: '이화여대',
    major: '경제학과',
    year: '22학번',
    rating: 4.9,
    reviews: 41,
    sessions: 62,
    successRate: 94,
    responseTime: '1시간',
    price: 130000,
    badge: 'gold',
    verified: true,
    avatar: '👨‍💼',
  },
  {
    id: '18',
    name: '러너 #3789',
    university: '고려대',
    major: '경영학과',
    year: '23학번',
    rating: 4.7,
    reviews: 17,
    sessions: 23,
    successRate: 82,
    responseTime: '3시간',
    price: 67000,
    badge: 'silver',
    verified: true,
    avatar: '👩‍💼',
  },
  {
    id: '19',
    name: '러너 #8123',
    university: '서강대',
    major: '글로벌경영',
    year: '21학번',
    rating: 4.8,
    reviews: 32,
    sessions: 49,
    successRate: 90,
    responseTime: '2시간',
    price: 98000,
    badge: 'gold',
    verified: true,
    avatar: '👨‍🎓',
  },
  {
    id: '20',
    name: '러너 #2945',
    university: '성균관대',
    major: '경영학과',
    year: '22학번',
    rating: 4.6,
    reviews: 14,
    sessions: 18,
    successRate: 79,
    responseTime: '4시간',
    price: 62000,
    badge: 'silver',
    verified: true,
    avatar: '👩‍🎓',
  },
  {
    id: '21',
    name: '러너 #5678',
    university: '한양대',
    major: '경제학과',
    year: '23학번',
    rating: 4.5,
    reviews: 10,
    sessions: 13,
    successRate: 74,
    responseTime: '5시간',
    price: 52000,
    badge: 'bronze',
    verified: true,
    avatar: '👨‍💼',
  },
  {
    id: '22',
    name: '러너 #7891',
    university: '중앙대',
    major: '경영학과',
    year: '21학번',
    rating: 4.9,
    reviews: 45,
    sessions: 68,
    successRate: 95,
    responseTime: '1시간',
    price: 140000,
    badge: 'gold',
    verified: true,
    avatar: '👩‍💼',
  },
  {
    id: '23',
    name: '러너 #4234',
    university: '경희대',
    major: '글로벌경영',
    year: '22학번',
    rating: 4.7,
    reviews: 20,
    sessions: 28,
    successRate: 85,
    responseTime: '3시간',
    price: 75000,
    badge: 'silver',
    verified: true,
    avatar: '👨‍🎓',
  },
  {
    id: '24',
    name: '러너 #9567',
    university: '연세대',
    major: '경영학과',
    year: '23학번',
    rating: 4.8,
    reviews: 26,
    sessions: 39,
    successRate: 87,
    responseTime: '2시간',
    price: 85000,
    badge: 'gold',
    verified: true,
    avatar: '👩‍🎓',
  },
  {
    id: '25',
    name: '러너 #1289',
    university: '이화여대',
    major: '경제학과',
    year: '21학번',
    rating: 4.6,
    reviews: 15,
    sessions: 19,
    successRate: 80,
    responseTime: '4시간',
    price: 60000,
    badge: 'silver',
    verified: true,
    avatar: '👨‍💼',
  },
];

export function MentorSearch({ onBack, onMentorSelect, onNavigate }: MentorSearchProps) {
  const { mentors: apiMentors, loading: mentorsLoading } = useMentors();
  // Use API mentors when available (more than default 6), otherwise use large local set
  const allMentors = apiMentors.length > 6 ? apiMentors : LOCAL_MENTORS;
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState<string>('all');
  const [selectedBadge, setSelectedBadge] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'rating' | 'price' | 'successRate'>('rating');

  const universities = ['all', '연세대', '고려대', '서강대', '성균관대'];
  const badges = ['all', 'gold', 'silver', 'bronze'];
  const priceRanges = [
    { value: 'all', label: '전체 가격' },
    { value: 'low', label: '5만원 이하' },
    { value: 'mid', label: '5-8만원' },
    { value: 'high', label: '8만원 이상' },
  ];

  const filteredMentors = allMentors
    .filter(mentor => {
      if (selectedUniversity !== 'all' && mentor.university !== selectedUniversity) return false;
      if (selectedBadge !== 'all' && mentor.badge !== selectedBadge) return false;
      if (priceRange === 'low' && mentor.price > 50000) return false;
      if (priceRange === 'mid' && (mentor.price <= 50000 || mentor.price > 80000)) return false;
      if (priceRange === 'high' && mentor.price <= 80000) return false;
      if (searchQuery && !mentor.name.includes(searchQuery) && !mentor.university.includes(searchQuery)) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'successRate') return b.successRate - a.successRate;
      return 0;
    });

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'gold': return 'from-amber-400 to-yellow-500';
      case 'silver': return 'from-gray-300 to-gray-400';
      case 'bronze': return 'from-orange-400 to-orange-500';
      default: return 'from-gray-300 to-gray-400';
    }
  };

  const getBadgeName = (badge: string) => {
    switch (badge) {
      case 'gold': return '골드 멘토';
      case 'silver': return '실버 멘토';
      case 'bronze': return '브론즈 멘토';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen gradient-mesh pb-20">
      <div className="container-web py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-4xl font-bold gradient-text">경험 전달자 찾기</h1>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => onNavigate?.('mentor-network')}
                className="hidden md:flex gap-2 btn-secondary rounded-xl"
              >
                <Network className="w-4 h-4" />
                릴레이 네트워크
              </Button>
              <Button 
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className={`gap-2 rounded-xl transition-all ${showFilters ? 'bg-indigo-50 border-indigo-300 text-indigo-700' : 'btn-secondary'}`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                필터
                {showFilters && <X className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-3xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="학교, 전공, 경험으로 검색..."
              className="pl-12 pr-4 h-14 text-lg rounded-2xl border-gray-200 focus:border-indigo-400 focus:ring-indigo-400/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8"
            >
              <Card className="p-6 card-modern">
                <div className="grid md:grid-cols-4 gap-6">
                  {/* University Filter */}
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-3 block">학교</label>
                    <div className="space-y-2">
                      {universities.map(uni => (
                        <button
                          key={uni}
                          onClick={() => setSelectedUniversity(uni)}
                          className={`w-full text-left px-4 py-2 rounded-xl transition-all ${
                            selectedUniversity === uni 
                              ? 'bg-indigo-100 text-indigo-700 font-semibold' 
                              : 'hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          {uni === 'all' ? '전체' : uni}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Badge Filter */}
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-3 block">등급</label>
                    <div className="space-y-2">
                      {badges.map(badge => (
                        <button
                          key={badge}
                          onClick={() => setSelectedBadge(badge)}
                          className={`w-full text-left px-4 py-2 rounded-xl transition-all ${
                            selectedBadge === badge 
                              ? 'bg-indigo-100 text-indigo-700 font-semibold' 
                              : 'hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          {badge === 'all' ? '전체' : getBadgeName(badge)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price Filter */}
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-3 block">가격대</label>
                    <div className="space-y-2">
                      {priceRanges.map(range => (
                        <button
                          key={range.value}
                          onClick={() => setPriceRange(range.value)}
                          className={`w-full text-left px-4 py-2 rounded-xl transition-all ${
                            priceRange === range.value 
                              ? 'bg-indigo-100 text-indigo-700 font-semibold' 
                              : 'hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          {range.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sort Filter */}
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-3 block">정렬</label>
                    <div className="space-y-2">
                      <button
                        onClick={() => setSortBy('rating')}
                        className={`w-full text-left px-4 py-2 rounded-xl transition-all ${
                          sortBy === 'rating' 
                            ? 'bg-indigo-100 text-indigo-700 font-semibold' 
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        평점 높은 순
                      </button>
                      <button
                        onClick={() => setSortBy('price')}
                        className={`w-full text-left px-4 py-2 rounded-xl transition-all ${
                          sortBy === 'price' 
                            ? 'bg-indigo-100 text-indigo-700 font-semibold' 
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        가격 낮은 순
                      </button>
                      <button
                        onClick={() => setSortBy('successRate')}
                        className={`w-full text-left px-4 py-2 rounded-xl transition-all ${
                          sortBy === 'successRate' 
                            ? 'bg-indigo-100 text-indigo-700 font-semibold' 
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        합격률 높은 순
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-gray-600">
            <span className="text-2xl font-bold text-gray-900">{filteredMentors.length}</span>명의 멘토
          </div>
          <div className="flex gap-2">
            <Badge className="badge-primary text-sm px-3 py-1">
              <Sparkles className="w-3 h-3 mr-1" />
              AI 추천
            </Badge>
          </div>
        </div>

        {/* Mentor Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredMentors.map((mentor, index) => (
            <motion.div
              key={mentor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card 
                className="relative overflow-hidden card-modern hover-lift cursor-pointer group"
                onClick={() => onMentorSelect(mentor)}
              >
                {/* Badge Ribbon */}
                {mentor.badge === 'gold' && (
                  <div className="absolute top-4 -right-12 rotate-45 bg-gradient-to-r from-amber-400 to-yellow-500 text-white text-xs font-bold px-16 py-1 shadow-lg">
                    BEST
                  </div>
                )}

                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start gap-4 mb-6">
                    {/* Avatar with gradient border */}
                    <div className="relative">
                      <div className={`absolute inset-0 bg-gradient-to-br ${getBadgeColor(mentor.badge)} rounded-2xl blur-lg opacity-50`}></div>
                      <div className={`relative w-20 h-20 ${getRunnerColor(mentor.name)} rounded-2xl flex items-center justify-center text-4xl shadow-xl`}>
                        {getRunnerAvatar(mentor.name)}
                      </div>
                      {mentor.verified && (
                        <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{mentor.name}</h3>
                        <Badge className={`bg-gradient-to-r ${getBadgeColor(mentor.badge)} text-white border-0 shadow-md text-xs px-2 py-0.5`}>
                          {getBadgeName(mentor.badge)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <Award className="w-4 h-4 text-indigo-500" />
                        <span className="font-semibold text-indigo-700">{mentor.university}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {mentor.major} • {mentor.year}
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <div className="text-2xl font-bold gradient-text">
                        ₩{(mentor.price / 1000).toFixed(0)}k
                      </div>
                      <div className="text-xs text-gray-500">60분 기준</div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {/* Rating */}
                    <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-3 border border-yellow-100">
                      <div className="flex items-center gap-1 mb-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs text-gray-600">평점</span>
                      </div>
                      <div className="text-xl font-bold text-gray-900">{mentor.rating}</div>
                      <div className="text-xs text-gray-500">{mentor.reviews}개 리뷰</div>
                    </div>

                    {/* Success Rate */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-3 border border-green-100">
                      <div className="flex items-center gap-1 mb-1">
                        <Target className="w-4 h-4 text-green-600" />
                        <span className="text-xs text-gray-600">합격률</span>
                      </div>
                      <div className="text-xl font-bold text-green-700">{mentor.successRate}%</div>
                      {/* Progress bar */}
                      <div className="w-full h-1 bg-green-100 rounded-full mt-1 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                          style={{ width: `${mentor.successRate}%` }}
                        />
                      </div>
                    </div>

                    {/* Sessions */}
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-3 border border-indigo-100">
                      <div className="flex items-center gap-1 mb-1">
                        <Users className="w-4 h-4 text-indigo-600" />
                        <span className="text-xs text-gray-600">세션</span>
                      </div>
                      <div className="text-xl font-bold text-indigo-700">{mentor.sessions}</div>
                      <div className="text-xs text-gray-500">완료</div>
                    </div>
                  </div>

                  {/* Quick Info */}
                  <div className="flex items-center gap-4 mb-6 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-4 h-4 text-cyan-600" />
                      <span>응답 {mentor.responseTime}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MessageCircle className="w-4 h-4 text-purple-600" />
                      <span>즉시 채팅</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button 
                      className="flex-1 btn-primary rounded-xl h-12 font-semibold group-hover:shadow-2xl transition-all"
                      onClick={(e) => {
                        e.stopPropagation();
                        onMentorSelect(mentor);
                      }}
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      예약하기
                    </Button>
                    <Button 
                      variant="outline"
                      className="btn-secondary rounded-xl h-12 px-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        onMentorSelect(mentor);
                      }}
                    >
                      상세보기
                    </Button>
                  </div>
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/5 group-hover:to-purple-500/5 transition-all duration-300 pointer-events-none rounded-2xl" />
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredMentors.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="empty-state"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Search className="w-12 h-12 text-gray-300" />
            </div>
            <h3 className="empty-state-title">검색 결과가 없습니다</h3>
            <p className="empty-state-description">
              다른 검색어나 필터를 사용해보세요
            </p>
            <Button 
              onClick={() => {
                setSearchQuery('');
                setSelectedUniversity('all');
                setSelectedBadge('all');
                setPriceRange('all');
              }}
              className="mt-6 btn-secondary rounded-xl"
            >
              필터 초기화
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}