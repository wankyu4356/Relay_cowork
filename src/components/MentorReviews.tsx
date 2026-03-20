import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  ArrowLeft,
  Star,
  TrendingUp,
  Award,
  ThumbsUp,
  MessageSquare,
  Calendar,
  Filter,
  BarChart3
} from 'lucide-react';
import type { Screen } from '../App';
import * as api from './api';

interface MentorReviewsProps {
  onBack: () => void;
  onNavigate: (screen: Screen) => void;
}

interface Review {
  id: string;
  menteeName: string;
  menteeAvatar: string;
  rating: number;
  date: string;
  content: string;
  tags: string[];
  university: string;
  successStatus?: 'passed' | 'pending';
  helpful: number;
}

const mockReviews: Review[] = [
  {
    id: '1',
    menteeName: '정수민',
    menteeAvatar: '👩‍💼',
    rating: 5.0,
    date: '2024.12.25',
    content: '김서연 멘토님 덕분에 성균관대 글로벌경영에 합격했습니다! 학업계획서 첨삭이 정말 꼼꼼하고 세밀했어요. 특히 제 경험을 스토리텔링하는 방법을 알려주셔서 큰 도움이 됐습니다. 면접 준비도 함께 해주셔서 자신감 있게 임할 수 있었어요. 정말 감사합니다!',
    tags: ['학계서 첨삭', '면접 준비', '친절함', '전문성'],
    university: '성균관대',
    successStatus: 'passed',
    helpful: 23,
  },
  {
    id: '2',
    menteeName: '최현우',
    menteeAvatar: '👨‍🎓',
    rating: 4.9,
    date: '2024.12.18',
    content: '한양대 경영학과 합격했습니다! 멘토님이 실제 합격생이셔서 현실적인 조언을 많이 해주셨어요. 학계서 구조를 잡는 것부터 디테일까지 하나하나 봐주셔서 좋았습니다. 특히 제 강점을 부각하는 방법을 알려주신 게 결정적이었던 것 같아요.',
    tags: ['학계서 첨삭', '전문성', '꼼꼼함'],
    university: '한양대',
    successStatus: 'passed',
    helpful: 18,
  },
  {
    id: '3',
    menteeName: '박지원',
    menteeAvatar: '👨‍🎓',
    rating: 5.0,
    date: '2025.02.18',
    content: '아직 결과는 안 나왔지만 멘토님과 준비하면서 많이 성장한 것 같아요. 세션마다 피드백이 구체적이고 실용적이어서 바로 적용할 수 있었습니다. 응답도 빠르시고 질문에 항상 친절하게 답변해주세요. 좋은 결과 있길 기대합니다!',
    tags: ['빠른 응답', '친절함', '실용적 조언'],
    university: '연세대',
    successStatus: 'pending',
    helpful: 12,
  },
  {
    id: '4',
    menteeName: '김민준',
    menteeAvatar: '👨‍💼',
    rating: 4.8,
    date: '2025.02.10',
    content: '멘토님이 정말 열정적으로 가르쳐주세요. 학계서 작성하는 법뿐만 아니라 편입 준비 전반에 대한 조언도 많이 해주셔서 큰 도움이 됐어요. 제 상황을 이해하고 맞춤형으로 피드백 주시는 점이 좋았습니다.',
    tags: ['열정적', '맞춤 피드백', '전문성'],
    university: '고려대',
    successStatus: 'pending',
    helpful: 9,
  },
  {
    id: '5',
    menteeName: '이서연',
    menteeAvatar: '👩‍🎓',
    rating: 5.0,
    date: '2025.01.28',
    content: '첫 세션부터 기대 이상이었어요! 제가 어떤 부분이 부족한지 정확히 짚어주시고, 개선 방향도 명확하게 제시해주셨습니다. 학계서 작성 노하우를 아낌없이 공유해주셔서 감사합니다.',
    tags: ['정확한 피드백', '학계서 첨삭', '친절함'],
    university: '서강대',
    successStatus: 'pending',
    helpful: 7,
  },
];

export function MentorReviews({ onBack, onNavigate }: MentorReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  const [filterSuccess, setFilterSuccess] = useState<'all' | 'passed' | 'pending'>('all');

  useEffect(() => {
    api.getMentorReviews('me').then((res: any) => {
      if (res.reviews?.length > 0) {
        setReviews(res.reviews.map((r: any) => ({
          id: r.id,
          menteeName: r.mentee_name || '멘티',
          menteeAvatar: r.mentee_avatar || '👤',
          rating: r.rating,
          date: r.date || r.created_at,
          content: r.content,
          tags: r.tags || [],
          university: r.university || '',
          successStatus: r.success_status,
          helpful: r.helpful || 0,
        })));
      }
    }).catch(() => {}); // keep mock data on failure
  }, []);

  const filteredReviews = reviews.filter(review => {
    const matchesRating = filterRating === 'all' || review.rating >= filterRating;
    const matchesSuccess = filterSuccess === 'all' || review.successStatus === filterSuccess;
    return matchesRating && matchesSuccess;
  });

  // Calculate stats
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1) : '0.0';
  const ratingDistribution = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating >= 4 && r.rating < 5).length,
    3: reviews.filter(r => r.rating >= 3 && r.rating < 4).length,
    2: reviews.filter(r => r.rating >= 2 && r.rating < 3).length,
    1: reviews.filter(r => r.rating >= 1 && r.rating < 2).length,
  };
  const passedReviews = reviews.filter(r => r.successStatus === 'passed').length;
  const totalHelpful = reviews.reduce((sum, r) => sum + r.helpful, 0);

  // Most common tags
  const allTags = reviews.flatMap(r => r.tags);
  const tagCounts = allTags.reduce((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-gray-200 text-gray-200'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen gradient-mesh pb-20">
      <div className="container-web py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">내 리뷰 & 평점</h1>
          <p className="text-gray-600">멘티들이 남긴 솔직한 후기를 확인하세요</p>
        </div>

        {/* Overview Stats */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Rating Summary */}
          <Card className="p-8 card-modern">
            <div className="text-center mb-6">
              <div className="text-6xl font-bold gradient-text mb-3">{averageRating}</div>
              <div className="flex justify-center mb-2">
                {renderStars(parseFloat(averageRating))}
              </div>
              <div className="text-gray-600">총 {totalReviews}개의 리뷰</div>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = ratingDistribution[rating as keyof typeof ratingDistribution];
                const percentage = (count / totalReviews) * 100;
                return (
                  <div key={rating} className="flex items-center gap-3">
                    <div className="w-12 text-sm text-gray-600 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      {rating}
                    </div>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="w-12 text-sm text-gray-600 text-right">{count}</div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Additional Stats */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="p-6 text-center card-modern">
                <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Award className="w-7 h-7 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-green-700 mb-1">{passedReviews}</div>
                <div className="text-sm text-gray-600">합격 멘티</div>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="p-6 text-center card-modern">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-sky-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <ThumbsUp className="w-7 h-7 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-blue-700 mb-1">{totalHelpful}</div>
                <div className="text-sm text-gray-600">도움됨 수</div>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="p-6 text-center card-modern">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-7 h-7 text-purple-600" />
                </div>
                <div className="text-3xl font-bold text-purple-700 mb-1">100%</div>
                <div className="text-sm text-gray-600">추천률</div>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card className="p-6 text-center card-modern">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Star className="w-7 h-7 text-amber-600" />
                </div>
                <div className="text-3xl font-bold text-amber-700 mb-1">{ratingDistribution[5]}</div>
                <div className="text-sm text-gray-600">5점 리뷰</div>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Top Tags */}
        <Card className="p-6 mb-8 card-modern">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-600" />
            자주 받는 칭찬
          </h3>
          <div className="flex flex-wrap gap-2">
            {topTags.map(([tag, count]) => (
              <Badge
                key={tag}
                className="bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border border-indigo-200 px-4 py-2 text-sm"
              >
                {tag} ({count})
              </Badge>
            ))}
          </div>
        </Card>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <Button
            variant={filterSuccess === 'all' ? 'default' : 'outline'}
            onClick={() => setFilterSuccess('all')}
            className={filterSuccess === 'all' ? 'btn-primary' : 'btn-secondary'}
          >
            전체 ({reviews.length})
          </Button>
          <Button
            variant={filterSuccess === 'passed' ? 'default' : 'outline'}
            onClick={() => setFilterSuccess('passed')}
            className={filterSuccess === 'passed' ? 'btn-primary' : 'btn-secondary'}
          >
            합격 ({passedReviews})
          </Button>
          <Button
            variant={filterSuccess === 'pending' ? 'default' : 'outline'}
            onClick={() => setFilterSuccess('pending')}
            className={filterSuccess === 'pending' ? 'btn-primary' : 'btn-secondary'}
          >
            준비중 ({reviews.length - passedReviews})
          </Button>
          <div className="h-8 w-px bg-gray-300 mx-2" />
          <Button
            variant={filterRating === 'all' ? 'default' : 'outline'}
            onClick={() => setFilterRating('all')}
            className={filterRating === 'all' ? 'btn-primary' : 'btn-secondary'}
          >
            전체 평점
          </Button>
          <Button
            variant={filterRating === 5 ? 'default' : 'outline'}
            onClick={() => setFilterRating(5)}
            className={filterRating === 5 ? 'btn-primary' : 'btn-secondary'}
          >
            ⭐ 5점
          </Button>
          <Button
            variant={filterRating === 4 ? 'default' : 'outline'}
            onClick={() => setFilterRating(4)}
            className={filterRating === 4 ? 'btn-primary' : 'btn-secondary'}
          >
            ⭐ 4점 이상
          </Button>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {filteredReviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-6 card-modern hover-lift">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-2xl shadow-lg">
                      {review.menteeAvatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-bold text-gray-900">{review.menteeName}</h4>
                        {review.successStatus === 'passed' && (
                          <Badge className="bg-green-500 text-white">
                            <Award className="w-3 h-3 mr-1" />
                            합격
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          {renderStars(review.rating)}
                          <span className="ml-1 font-semibold">{review.rating}</span>
                        </div>
                        <span className="text-gray-400">•</span>
                        <span>{review.university}</span>
                        <span className="text-gray-400">•</span>
                        <span>{review.date}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <p className="text-gray-700 leading-relaxed mb-4 pl-16">
                  {review.content}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4 pl-16">
                  {review.tags.map((tag) => (
                    <Badge
                      key={tag}
                      className="bg-gray-100 text-gray-700 hover:bg-gray-200"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pl-16 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <ThumbsUp className="w-4 h-4" />
                    <span>{review.helpful}명이 도움됨</span>
                  </div>
                  <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                    답글 작성
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredReviews.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="empty-state"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Star className="w-12 h-12 text-gray-300" />
            </div>
            <h3 className="empty-state-title">해당하는 리뷰가 없습니다</h3>
            <p className="empty-state-description">
              다른 필터를 선택해보세요
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}