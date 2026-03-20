import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  ArrowLeft, 
  Star, 
  TrendingUp, 
  Clock, 
  Award,
  Calendar,
  MessageSquare,
  CheckCircle,
  FileText,
  Network,
  Users
} from 'lucide-react';
import type { Mentor } from '../App';

interface MentorProfileProps {
  onBack: () => void;
  onBook: () => void;
  mentor: Mentor;
  networkDistance?: number;
  connectionPath?: string[];
  onNavigate?: (screen: string) => void;
}

const mockReviews = [
  {
    id: '1',
    author: '박지원',
    rating: 5,
    date: '2025.02.10',
    content: '정말 친절하고 상세하게 첨삭해주셨어요. 제 경험을 어떻게 풀어내야 할지 막막했는데, 구체적인 예시와 함께 설명해주셔서 큰 도움이 되었습니다.',
    tags: ['친절함', '전문적', '상세한피드백'],
  },
  {
    id: '2',
    author: '김민준',
    rating: 5,
    date: '2025.02.05',
    content: '실제 합격 경험을 바탕으로 조언해주셔서 신뢰가 갔습니다. 면접 준비까지 꼼꼼하게 봐주셨어요.',
    tags: ['경험기반', '체계적'],
  },
  {
    id: '3',
    author: '이��연',
    rating: 4,
    date: '2025.01.28',
    content: '첨삭이 매우 구체적이고 실용적이었습니다. 다만 조금 더 빠르게 답변 주시면 더 좋을 것 같아요.',
    tags: ['실전적', '전문적'],
  },
];

const mockTimeline = [
  { period: '2023.03 ~ 2024.02', title: '전적대 재학', desc: '건국대 정치외교학과' },
  { period: '2023.09 ~ 2023.12', title: '편입 준비', desc: '토익 900점, 편입영어 학원' },
  { period: '2024.01', title: '학업계획서 작성', desc: '3회 수정 후 완성' },
  { period: '2024.02', title: '면접 준비', desc: '예상 질문 30개 준비' },
  { period: '2024.03', title: '합격', desc: '연세대 경영학과 22학번' },
];

const availableTimes = [
  { date: '2월 20일 (목)', slots: ['14:00', '15:00', '16:00'] },
  { date: '2월 21일 (금)', slots: ['10:00', '11:00', '14:00', '15:00'] },
  { date: '2월 22일 (토)', slots: ['09:00', '10:00', '11:00', '13:00'] },
];

export function MentorProfile({ onBack, onBook, mentor, networkDistance, connectionPath, onNavigate }: MentorProfileProps) {
  const [selectedTab, setSelectedTab] = useState('about');

  const getBadgeStyle = (badge: string) => {
    switch (badge) {
      case 'gold': return 'badge-gold';
      case 'silver': return 'badge-silver';
      case 'bronze': return 'badge-bronze';
      default: return '';
    }
  };

  const getBadgeIcon = (badge: string) => {
    switch (badge) {
      case 'gold': return '🥇';
      case 'silver': return '🥈';
      case 'bronze': return '🥉';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 pb-20 md:pb-0">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-web py-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold">멘토 프로필</h1>
          </div>
        </div>
      </div>

      <div className="container-web py-8">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr,360px] gap-6">
          {/* Main Content */}
          <div className="space-y-6">
            {/* Profile Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="p-8">
                <div className="flex gap-6 mb-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-sky-400 to-blue-500 rounded-3xl flex items-center justify-center text-5xl flex-shrink-0 shadow-xl">
                    {mentor.avatar}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-3xl font-bold">{mentor.name}</h2>
                      <Badge className={`${getBadgeStyle(mentor.badge)} border-0`}>
                        {getBadgeIcon(mentor.badge)} {mentor.badge.toUpperCase()}
                      </Badge>
                      {mentor.verified && (
                        <Badge className="bg-blue-500 text-white">
                          ✅ 합격증 인증
                        </Badge>
                      )}
                    </div>
                    <p className="text-xl text-gray-700 mb-4">
                      {mentor.university} {mentor.major} {mentor.year}
                    </p>

                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        <span className="text-2xl font-bold">{mentor.rating}</span>
                        <span className="text-gray-600">({mentor.reviews}개 리뷰)</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                        <span className="font-semibold">합격률 {mentor.successRate}%</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-5 h-5" />
                        <span>평균 응답 {mentor.responseTime}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button 
                    className="flex-1 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white"
                    size="lg"
                    onClick={onBook}
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    세션 예약하기
                  </Button>
                  <Button variant="outline" size="lg" onClick={() => onNavigate?.('message-center')}>
                    <MessageSquare className="w-5 h-5 mr-2" />
                    문의하기
                  </Button>
                </div>
              </Card>
            </motion.div>

            {/* Network Distance Badge */}
            {networkDistance && (
              <Card className="p-4 bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200 mb-4">
                <div className="flex items-start gap-3">
                  <Network className="w-6 h-6 text-purple-600 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-semibold text-purple-900 mb-1">
                      {networkDistance === 1 && '🔗 1촌 멘토 (직접 연결)'}
                      {networkDistance === 2 && '🔗 2촌 멘토 (친구의 친구)'}
                      {networkDistance === 3 && '🔗 3촌 멘토 (간접 연결)'}
                    </div>
                    {connectionPath && connectionPath.length > 0 && (
                      <div className="text-sm text-purple-700">
                        연결 경로: {connectionPath.join(' → ')}
                      </div>
                    )}
                    {networkDistance === 1 && (
                      <div className="text-sm text-purple-600 mt-2">
                        ✓ 즉시 메시지 가능 • 기본 수수료 (20%)
                      </div>
                    )}
                    {networkDistance === 2 && (
                      <div className="text-sm text-purple-600 mt-2">
                        ✓ 소개 요청 가능 • 소개비 +5%
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            )}
            {!networkDistance && (
              <Card className="p-4 bg-gray-50 border-gray-200 mb-4">
                <div className="flex items-start gap-3">
                  <Users className="w-6 h-6 text-gray-400 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-700 mb-1">
                      직접 연결이 없습니다
                    </div>
                    <div className="text-sm text-gray-600">
                      연결 요청 시 멘토가 수락하면 세션 예약이 가능합니다
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Tabs */}
            <Card className="p-6">
              <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                <TabsList className="grid w-full grid-cols-4 mb-6">
                  <TabsTrigger value="about">소개</TabsTrigger>
                  <TabsTrigger value="experience">경험</TabsTrigger>
                  <TabsTrigger value="reviews">리뷰</TabsTrigger>
                  <TabsTrigger value="schedule">일정</TabsTrigger>
                </TabsList>

                {/* About */}
                <TabsContent value="about" className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-3">📝 자기소개</h3>
                    <p className="text-gray-700 leading-relaxed">
                      안녕하세요! 건국대 정치외교학과에서 연세대 경영학과로 편입한 김서연입니다. 
                      저도 편입 준비하면서 학업계획서를 어떻게 써야 할지 정말 막막했어요. 
                      특히 전공이 다른 경우 어떻게 연결고리를 만들어야 할지 고민이 많았습니다.
                      <br /><br />
                      제 경험을 바탕으로 여러분의 스토리를 가장 효과적으로 풀어내는 방법을 알려드리겠습니다. 
                      학업계획서 첨삭뿐만 아니라 면접 준비까지 함께 도와드려요!
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-3">💪 강점</h3>
                    <div className="grid md:grid-cols-2 gap-3">
                      {[
                        { icon: '✍️', title: '학업계획서 전문', desc: '35건 이상 첨삭 경험' },
                        { icon: '🎯', title: '전공전환 노하우', desc: '다른 전공 → 경영 합격' },
                        { icon: '⚡', title: '빠른 피드백', desc: '평균 2시간 이내 응답' },
                        { icon: '🤝', title: '진심 어린 멘토링', desc: '합격까지 끝까지 함께' },
                      ].map((item, index) => (
                        <Card key={index} className="p-4 bg-sky-50 border-sky-200">
                          <div className="flex items-start gap-3">
                            <span className="text-3xl">{item.icon}</span>
                            <div>
                              <div className="font-semibold mb-1">{item.title}</div>
                              <div className="text-sm text-gray-600">{item.desc}</div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-3">📚 제공 서비스</h3>
                    <div className="space-y-2">
                      {[
                        '학업계획서 1:1 첨삭 (구조, 내용, 표현)',
                        '전공 연결 스토리 구성 컨설팅',
                        '면접 예상 질문 및 답변 준비',
                        '합격 학업계획서 열람 (세션 내)',
                        '실시간 질의응답 (세션 중)',
                        '무제한 수정 피드백 (세션 후 1주일)',
                      ].map((service, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                          <span className="text-gray-700">{service}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                {/* Experience */}
                <TabsContent value="experience" className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-4">🎓 편입 타임라인</h3>
                    <div className="space-y-3">
                      {mockTimeline.map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex gap-4"
                        >
                          <div className="w-1 bg-gradient-to-b from-sky-400 to-blue-500 rounded-full flex-shrink-0" />
                          <div className="flex-1 pb-6">
                            <div className="text-sm text-gray-600 mb-1">{item.period}</div>
                            <div className="font-semibold mb-1">{item.title}</div>
                            <div className="text-gray-600">{item.desc}</div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-3">📊 성과</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <Card className="p-4 text-center bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                        <div className="text-3xl font-bold text-green-600 mb-1">87%</div>
                        <div className="text-sm text-gray-700">멘티 합격률</div>
                      </Card>
                      <Card className="p-4 text-center bg-gradient-to-br from-blue-50 to-sky-50 border-blue-200">
                        <div className="text-3xl font-bold text-blue-600 mb-1">35건</div>
                        <div className="text-sm text-gray-700">총 세션 수</div>
                      </Card>
                      <Card className="p-4 text-center bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
                        <div className="text-3xl font-bold text-purple-600 mb-1">4.9</div>
                        <div className="text-sm text-gray-700">평균 평점</div>
                      </Card>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-3">🏆 합격 대학 (멘티)</h3>
                    <div className="flex flex-wrap gap-2">
                      {['연세대 경영 12명', '고려대 경영 8명', '서강대 경영 5명', '성균관대 경영 6명', '한양대 경영 4명'].map((achievement, index) => (
                        <Badge key={index} variant="outline" className="text-sm px-3 py-1">
                          {achievement}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                {/* Reviews */}
                <TabsContent value="reviews" className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-4xl font-bold">{mentor.rating}</span>
                        <div>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star 
                                key={star}
                                className={`w-5 h-5 ${star <= Math.floor(mentor.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                          <div className="text-sm text-gray-600">{mentor.reviews}개의 리뷰</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {mockReviews.map((review, index) => (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="p-5 bg-gray-50">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="font-semibold mb-1">{review.author}</div>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-0.5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star 
                                    key={star}
                                    className={`w-4 h-4 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-gray-500">{review.date}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700 mb-3 leading-relaxed">{review.content}</p>
                        <div className="flex gap-2">
                          {review.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </TabsContent>

                {/* Schedule */}
                <TabsContent value="schedule" className="space-y-4">
                  <Card className="p-4 bg-sky-50 border-sky-200">
                    <div className="flex gap-3">
                      <Calendar className="w-6 h-6 text-sky-600 flex-shrink-0" />
                      <div>
                        <div className="font-semibold mb-1">예약 가능 시간</div>
                        <div className="text-sm text-gray-600">
                          아래 시간 중 원하는 시간을 선택하여 예약하세요
                        </div>
                      </div>
                    </div>
                  </Card>

                  {availableTimes.map((day, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="p-5">
                        <div className="font-semibold mb-3">{day.date}</div>
                        <div className="grid grid-cols-3 gap-2">
                          {day.slots.map((slot) => (
                            <Button
                              key={slot}
                              variant="outline"
                              size="sm"
                              className="hover:bg-sky-50 hover:border-sky-400"
                            >
                              {slot}
                            </Button>
                          ))}
                        </div>
                      </Card>
                    </motion.div>
                  ))}

                  <Button 
                    className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white"
                    size="lg"
                    onClick={onBook}
                  >
                    예약하기
                  </Button>
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Price Card */}
            <Card className="p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="text-sm text-gray-600 mb-2">60분 세션</div>
                <div className="text-4xl font-bold text-sky-600 mb-1">
                  ₩{mentor.price.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">VAT 포함</div>
              </div>

              <div className="space-y-3 mb-6 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">세션 시간</span>
                  <span className="font-medium">60분</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">평균 응답</span>
                  <span className="font-medium">{mentor.responseTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">총 세션</span>
                  <span className="font-medium">{mentor.sessions}건</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">합격률</span>
                  <span className="font-medium text-green-600">{mentor.successRate}%</span>
                </div>
              </div>

              <Button 
                className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white mb-3"
                size="lg"
                onClick={onBook}
              >
                <Calendar className="w-5 h-5 mr-2" />
                세션 예약하기
              </Button>

              <Button variant="outline" className="w-full" onClick={() => onNavigate?.('message-center')}>
                <MessageSquare className="w-5 h-5 mr-2" />
                문의하기
              </Button>

              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex gap-2 text-sm">
                  <Award className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <div className="text-gray-700">
                    <strong>환불 정책:</strong> 세션 24시간 전까지 100% 환불 가능
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}