import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { ArrowLeft, Star } from 'lucide-react';
import { toast } from 'sonner';
import type { Mentor } from '../App';
import * as api from './api';
import { logger } from '../utils/logger';

interface ReviewWriteProps {
  onBack: () => void;
  onSubmit: () => void;
  mentor: Mentor;
}

const predefinedTags = [
  '친절함', '전문적', '상세한피드백', '실전적', '격려',
  '경험기반', '체계적', '빠른응답', '열정적'
];

export function ReviewWrite({ onBack, onSubmit, mentor }: ReviewWriteProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error('별점을 선택해주세요');
      return;
    }
    if (reviewText.length < 30) {
      toast.error('후기를 30자 이상 작성해주세요');
      return;
    }

    // Save review to server
    try {
      await api.submitReview({
        mentorId: mentor.id,
        rating,
        content: reviewText,
        tags: selectedTags,
      });
    } catch (e) {
      logger.log('Review save to server failed:', e);
    }

    toast.success('릴레이 후기가 등록되었습니다! 🎉');
    setTimeout(() => onSubmit(), 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-yellow-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-web py-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">릴레이 후기 작성</h1>
              <p className="text-gray-600 mt-1">멘토링 경험을 공유해주세요</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-web py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Mentor Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center text-3xl">
                  {mentor.avatar}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-1">{mentor.name} 멘토</h3>
                  <p className="text-gray-600">
                    {mentor.university} {mentor.major} {mentor.year}
                  </p>
                </div>
                <Badge className="badge-gold border-0">🥇 Gold</Badge>
              </div>
            </Card>
          </motion.div>

          {/* Rating */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-8">
              <h3 className="text-lg font-semibold mb-2 text-center">
                멘토링이 어떠셨나요?
              </h3>
              <p className="text-gray-600 text-center mb-6">
                별점을 선택해주세요
              </p>

              <div className="flex justify-center gap-3 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    className="focus:outline-none"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Star
                      className={`w-12 h-12 transition-colors ${
                        star <= (hoverRating || rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </motion.button>
                ))}
              </div>

              {rating > 0 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-xl font-semibold text-amber-600"
                >
                  {rating === 5 && '정말 훌륭했어요! ⭐'}
                  {rating === 4 && '만족스러웠어요! 😊'}
                  {rating === 3 && '괜찮았어요 👍'}
                  {rating === 2 && '아쉬웠어요 😐'}
                  {rating === 1 && '별로였어요 😞'}
                </motion.p>
              )}
            </Card>
          </motion.div>

          {/* Review Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">상세 후기</h3>
              <Textarea
                placeholder="멘토링에서 좋았던 점, 개선이 필요한 점 등을 자유롭게 작성해주세요 (최소 30자)"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="min-h-40 mb-2"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>최소 30자 이상</span>
                <span className={reviewText.length >= 30 ? 'text-amber-600 font-medium' : ''}>
                  {reviewText.length}자
                </span>
              </div>
            </Card>
          </motion.div>

          {/* Tags */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                태그 선택 <span className="text-sm font-normal text-gray-600">(선택사항)</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {predefinedTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                    className={`cursor-pointer transition-all ${
                      selectedTags.includes(tag)
                        ? 'bg-amber-500 text-white hover:bg-amber-600'
                        : 'hover:border-amber-400 hover:text-amber-600'
                    }`}
                    onClick={() => handleTagToggle(tag)}
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Notice */}
          <Card className="p-4 bg-amber-50 border-amber-200">
            <div className="flex gap-2 text-sm text-gray-700">
              <span className="text-amber-600">💡</span>
              <div>
                <strong>후기 공개 안내</strong>
                <p className="mt-1">
                  후기는 5개 이상 모이면 일괄 공개됩니다.
                  작성 후 수정이 불가하니 신중하게 작성해주세요.
                </p>
              </div>
            </div>
          </Card>

          {/* Submit */}
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={onBack}
              className="flex-1"
              size="lg"
            >
              나중에 작성하기
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white"
              size="lg"
              disabled={rating === 0 || reviewText.length < 30}
            >
              후기 등록하기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}