import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import {
  Sparkles,
  Search,
  Calendar,
  MessageSquare,
  Star,
  TrendingUp,
  Users,
  Award,
  Bell,
  Settings as SettingsIcon,
  ArrowRight,
  DollarSign,
  BarChart3,
  Clock,
  BookOpen,
  X,
  GraduationCap,
  Target,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';
import type { Screen, Mentor } from '../App';
import type { Category } from './GlobalNav';
import { CATEGORY_CONTENT } from '../lib/categoryContent';
import { CATEGORY_STATS } from '../lib/categoryStats';
import { useMentors } from '../hooks/useMentors';
import * as api from './api';

interface UnifiedHomeProps {
  onNavigate: (screen: Screen) => void;
  onMentorSelect: (mentor: Mentor) => void;
  credits?: number;
  isMentorActive?: boolean;
  onRoleChange?: (role: 'mentee' | 'mentor') => void;
  selectedCategory?: Category;
}

export function UnifiedHome({
  onNavigate,
  onMentorSelect,
  credits = 3,
  isMentorActive: initialMentorActive = false,
  onRoleChange,
  selectedCategory = 'transfer'
}: UnifiedHomeProps) {
  const content = CATEGORY_CONTENT[selectedCategory];
  const stats = CATEGORY_STATS[selectedCategory];
  const [activeTab, setActiveTab] = useState<'mentee' | 'mentor'>('mentee');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMentorActive, setIsMentorActive] = useState(initialMentorActive);
  const [showMentorOnboarding, setShowMentorOnboarding] = useState(false);
  const [showSuccessRateModal, setShowSuccessRateModal] = useState(false);
  const { mentors: recommendedMentors, loading: mentorsLoading } = useMentors();

  // Dashboard stats fetched from API with mock fallbacks
  const [draftCount, setDraftCount] = useState(2);
  const [upcomingSessionCount, setUpcomingSessionCount] = useState(3);
  const [notificationCount, setNotificationCount] = useState(0);
  const [creditBalance, setCreditBalance] = useState(credits);
  const [mentorNetworkCount, setMentorNetworkCount] = useState(12);
  const [dashboardLoading, setDashboardLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchDashboardData() {
      setDashboardLoading(true);

      // Fetch all data in parallel, each with its own try/catch
      const [draftsResult, sessionsResult, notificationsResult, creditsResult, mentorsResult] = await Promise.allSettled([
        api.getDrafts(),
        api.getSessions(),
        api.getNotifications(),
        api.getCredits(),
        api.getMentors(),
      ]);

      if (cancelled) return;

      // Drafts count
      if (draftsResult.status === 'fulfilled') {
        const drafts = draftsResult.value?.drafts;
        if (Array.isArray(drafts)) {
          setDraftCount(drafts.length);
        }
      }

      // Upcoming sessions count
      if (sessionsResult.status === 'fulfilled') {
        const sessions = sessionsResult.value?.sessions;
        if (Array.isArray(sessions)) {
          const upcoming = sessions.filter((s: { status?: string }) => s.status === 'upcoming');
          setUpcomingSessionCount(upcoming.length);
        }
      }

      // Notifications count
      if (notificationsResult.status === 'fulfilled') {
        const notifications = notificationsResult.value?.notifications;
        if (Array.isArray(notifications)) {
          const unread = notifications.filter((n: { read?: boolean }) => !n.read);
          setNotificationCount(unread.length);
        }
      }

      // Credit balance
      if (creditsResult.status === 'fulfilled') {
        const creditsData = creditsResult.value;
        if (typeof creditsData?.balance === 'number') {
          setCreditBalance(creditsData.balance);
        } else if (typeof creditsData?.credits === 'number') {
          setCreditBalance(creditsData.credits);
        }
      }

      // Mentor network count
      if (mentorsResult.status === 'fulfilled') {
        const mentors = mentorsResult.value?.mentors;
        if (Array.isArray(mentors)) {
          setMentorNetworkCount(mentors.length);
        }
      }

      setDashboardLoading(false);
    }

    fetchDashboardData();

    return () => { cancelled = true; };
  }, []);

  const handleTabChange = (tab: 'mentee' | 'mentor') => {
    if (tab === 'mentor' && !isMentorActive) {
      // 멘토 인증이 필요한 경우 인증 화면으로
      onNavigate('mentor-verification');
      return;
    }
    setActiveTab(tab);
    if (tab === 'mentor') {
      onRoleChange?.('mentor');
      onNavigate('mentor-dashboard');
    } else {
      onRoleChange?.('mentee');
    }
  };

  const handleStartMentorVerification = () => {
    setShowMentorOnboarding(false);
    onNavigate('mentor-verification');
  };

  const handleSkipMentorOnboarding = () => {
    setShowMentorOnboarding(false);
    setIsMentorActive(true);
    setActiveTab('mentor');
    onRoleChange?.('mentor');
    onNavigate('mentor-dashboard');
  };

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
      {/* Welcome Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-10 shadow-sm">
        <div className="container-web py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-1">
                안녕하세요 👋
              </h1>
              <p className="text-gray-600">
                {activeTab === 'mentee' ? content.greeting : '러너 활동을 시작하세요'}
              </p>
            </div>
            <div className="flex gap-2">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" size="icon" onClick={() => onNavigate('notifications')} className="relative">
                  <Bell className="w-5 h-5" />
                  {notificationCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" size="icon" onClick={() => onNavigate('settings')}>
                  <SettingsIcon className="w-5 h-5" />
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Role Tabs */}
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="w-full grid grid-cols-2 h-14 bg-gray-100/80 backdrop-blur-sm p-1">
              <TabsTrigger value="mentee" className="text-base font-semibold data-[state=active]:bg-white data-[state=active]:shadow-md">
                <span className="mr-2">🎯</span> 경험 받기
              </TabsTrigger>
              <TabsTrigger 
                value="mentor" 
                className="text-base font-semibold relative data-[state=active]:bg-white data-[state=active]:shadow-md"
              >
                <span className="mr-2">⚡</span> 경험 전달하기
                {!isMentorActive && (
                  <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-sky-500 to-blue-600 text-white text-xs border-0 shadow-lg">
                    시작하기
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            {/* Mentee Content */}
            <TabsContent value="mentee" className="mt-6">
              {/* Search Bar */}
              <div className="relative max-w-2xl mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder={content.searchPlaceholder}
                  className="pl-12 pr-4 py-6 text-lg bg-gray-50 border-gray-200 focus:bg-white focus:border-sky-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onClick={() => onNavigate('ai-recommendation')}
                />
              </div>

              {/* AI Recommendation CTA - 최상단으로 이동 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                className="cursor-pointer mb-6"
                onClick={() => onNavigate('ai-recommendation')}
              >
                <Card className="relative overflow-hidden border-0 shadow-xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600"></div>
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 -translate-x-1/2"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-y-1/2 translate-x-1/2"></div>
                  </div>
                  <div className="relative p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <Award className="w-8 h-8 text-white" />
                          <h2 className="text-2xl font-bold text-white">{content.aiConsultingTitle} <span className="text-lg">(무료)</span></h2>
                        </div>
                        <p className="text-white/90 text-lg mb-4">
                          {content.aiConsultingDescription}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-6">
                          {content.ctaBadges.map((badge) => (
                            <Badge key={badge} className="bg-white/20 text-white border-0">{badge}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <Button 
                      size="lg"
                      className="bg-white text-indigo-600 hover:bg-indigo-50 w-full md:w-auto"
                    >
                      AI 추천 받기
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </Card>
              </motion.div>

              {/* AI CTA - AI 학업계획서 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="cursor-pointer mb-6"
                onClick={() => onNavigate('ai-experience')}
              >
                <Card className="relative overflow-hidden border-0 shadow-xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-sky-500 to-blue-600"></div>
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
                  </div>
                  <div className="relative p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <Sparkles className="w-8 h-8 text-white" />
                          <h2 className="text-2xl font-bold text-white">{content.aiToolTitle}</h2>
                        </div>
                        <p className="text-white/90 text-lg mb-4">
                          {content.aiToolDescription}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-6">
                          {content.aiToolBadges.map((badge) => (
                            <Badge key={badge} className="bg-white/20 text-white border-0">{badge}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <Button 
                      size="lg"
                      className="bg-white text-sky-600 hover:bg-gray-50 w-full md:w-auto"
                    >
                      지금 시작하기
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                    <div className="mt-4 flex items-center gap-2 text-white/80 text-sm">
                      <Sparkles className="w-4 h-4" />
                      <span>남은 크레딧: {dashboardLoading ? '...' : `${creditBalance}회`}</span>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* 멘토 찾기 CTA 추가 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.02 }}
                className="cursor-pointer mb-8"
                onClick={() => onNavigate('mentor-search')}
              >
                <Card className="relative overflow-hidden border-0 shadow-xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600"></div>
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
                  </div>
                  <div className="relative p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <Users className="w-8 h-8 text-white" />
                          <h2 className="text-2xl font-bold text-white">나에게 맞는 러너 찾기</h2>
                        </div>
                        <p className="text-white/90 text-lg mb-4">
                          {content.mentorDescription}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-6">
                          {content.mentorBadges.map((badge) => (
                            <Badge key={badge} className="bg-white/20 text-white border-0">{badge}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <Button 
                      size="lg"
                      className="bg-white text-emerald-600 hover:bg-emerald-50 w-full md:w-auto"
                    >
                      러너 찾아보기
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </Card>
              </motion.div>

              {/* Quick Stats */}
              <div className="grid md:grid-cols-4 gap-4 mb-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  <Card className="p-6 text-center card-hover cursor-pointer" onClick={() => onNavigate('ai-management')}>
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <BookOpen className="w-7 h-7 text-purple-600" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">{dashboardLoading ? <span className="inline-block w-8 h-8 bg-gray-200 rounded animate-pulse" /> : draftCount}</div>
                    <div className="text-sm text-gray-600">{content.docLabel}</div>
                  </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                  <Card className="p-6 text-center card-hover cursor-pointer" onClick={() => onNavigate('session-list')}>
                    <div className="w-14 h-14 bg-gradient-to-br from-sky-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <Calendar className="w-7 h-7 text-sky-600" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">{dashboardLoading ? <span className="inline-block w-8 h-8 bg-gray-200 rounded animate-pulse" /> : upcomingSessionCount}</div>
                    <div className="text-sm text-gray-600">예정된 세션</div>
                  </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                  <Card className="p-6 text-center card-hover cursor-pointer" onClick={() => onNavigate('mentor-network')}>
                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <Users className="w-7 h-7 text-indigo-600" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">{dashboardLoading ? <span className="inline-block w-8 h-8 bg-gray-200 rounded animate-pulse" /> : mentorNetworkCount}</div>
                    <div className="text-sm text-gray-600">내 인맥 러너</div>
                  </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                  <Card className="p-6 text-center card-hover cursor-pointer" onClick={() => setShowSuccessRateModal(true)}>
                    <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <TrendingUp className="w-7 h-7 text-green-600" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">87%</div>
                    <div className="text-sm text-gray-600">{content.successLabel}</div>
                  </Card>
                </motion.div>
              </div>

              {/* Recommended Mentors */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">⭐ 추천 러너</h2>
                  <Button 
                    variant="ghost"
                    onClick={() => onNavigate('mentor-search')}
                    className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-xl font-semibold"
                  >
                    전체보기 →
                  </Button>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {recommendedMentors.slice(0, 4).map((mentor, index) => {
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
                        case 'gold': return '골드 러너';
                        case 'silver': return '실버 러너';
                        case 'bronze': return '브론즈 러너';
                        default: return '';
                      }
                    };

                    return (
                      <motion.div
                        key={mentor.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card 
                          className="relative overflow-hidden card-modern hover-lift cursor-pointer group"
                          onClick={() => onMentorSelect(mentor)}
                        >
                          {/* Badge Ribbon */}
                          {mentor.badge === 'gold' && (
                            <div className="absolute top-4 -right-12 rotate-45 bg-gradient-to-r from-amber-400 to-yellow-500 text-white text-xs font-bold px-16 py-1 shadow-lg z-10">
                              BEST
                            </div>
                          )}

                          <div className="p-6">
                            {/* Header */}
                            <div className="flex items-start gap-4 mb-5">
                              {/* Avatar with gradient border */}
                              <div className="relative">
                                <div className={`absolute inset-0 bg-gradient-to-br ${getBadgeColor(mentor.badge)} rounded-2xl blur-lg opacity-50`}></div>
                                <div className="relative w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-3xl shadow-xl">
                                  {mentor.avatar}
                                </div>
                                {mentor.verified && (
                                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                  </div>
                                )}
                              </div>

                              {/* Info */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="text-lg font-bold text-gray-900">{mentor.name}</h3>
                                  <Badge className={`bg-gradient-to-r ${getBadgeColor(mentor.badge)} text-white border-0 shadow-md text-xs px-2 py-0`}>
                                    {getBadgeName(mentor.badge)}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-1 mb-1">
                                  <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                  </svg>
                                  <span className="font-semibold text-indigo-700 text-sm">{mentor.university}</span>
                                </div>
                                <div className="text-xs text-gray-600">{mentor.major}</div>
                              </div>

                              {/* Price */}
                              <div className="text-right">
                                <div className="text-xl font-bold gradient-text">
                                  ₩{(mentor.price / 1000).toFixed(0)}k
                                </div>
                                <div className="text-xs text-gray-500">60분</div>
                              </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-3 gap-2 mb-4">
                              {/* Rating */}
                              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-3 border border-yellow-100">
                                <div className="flex items-center gap-1 mb-1">
                                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                  <span className="text-xs text-gray-600">평점</span>
                                </div>
                                <div className="text-lg font-bold text-gray-900">{mentor.rating}</div>
                              </div>

                              {/* Success Rate */}
                              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-3 border border-green-100">
                                <div className="flex items-center gap-1 mb-1">
                                  <TrendingUp className="w-3 h-3 text-green-600" />
                                  <span className="text-xs text-gray-600">{content.successLabel.replace('평균 ', '')}</span>
                                </div>
                                <div className="text-lg font-bold text-green-700">{mentor.successRate}%</div>
                              </div>

                              {/* Sessions */}
                              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-3 border border-indigo-100">
                                <div className="flex items-center gap-1 mb-1">
                                  <Users className="w-3 h-3 text-indigo-600" />
                                  <span className="text-xs text-gray-600">세션</span>
                                </div>
                                <div className="text-lg font-bold text-indigo-700">{mentor.sessions}</div>
                              </div>
                            </div>

                            {/* Action Button */}
                            <Button 
                              className="w-full btn-primary rounded-xl h-11 font-semibold group-hover:shadow-2xl transition-all"
                              onClick={(e) => {
                                e.stopPropagation();
                                onMentorSelect(mentor);
                              }}
                            >
                              <Calendar className="w-4 h-4 mr-2" />
                              예약하기
                            </Button>
                          </div>

                          {/* Hover Glow Effect */}
                          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/5 group-hover:to-purple-500/5 transition-all duration-300 pointer-events-none rounded-2xl" />
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </TabsContent>

            {/* Mentor Content */}
            <TabsContent value="mentor" className="mt-6">
              {showMentorOnboarding ? (
                /* Mentor Onboarding CTA */
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="relative overflow-hidden border-0 shadow-xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-indigo-600"></div>
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
                    </div>
                    <div className="relative p-12 text-center">
                      <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <Award className="w-10 h-10 text-white" />
                      </div>
                      <h2 className="text-3xl font-bold text-white mb-4">
                        러너가 되어보세요
                      </h2>
                      <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                        합격 경험을 공유하고 월 30~100만 원의 부수입을 얻으세요.<br />
                        후배들을 도우면서 나의 영향력도 키울 수 있습니다.
                      </p>
                      <div className="grid md:grid-cols-3 gap-4 mb-8 max-w-3xl mx-auto">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                          <DollarSign className="w-8 h-8 text-white mx-auto mb-2" />
                          <div className="text-white font-semibold mb-1">경제적 보상</div>
                          <div className="text-white/80 text-sm">시간당 5~10만원</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                          <Users className="w-8 h-8 text-white mx-auto mb-2" />
                          <div className="text-white font-semibold mb-1">사회적 인정</div>
                          <div className="text-white/80 text-sm">영향력 점수</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                          <Award className="w-8 h-8 text-white mx-auto mb-2" />
                          <div className="text-white font-semibold mb-1">의미 있는 활동</div>
                          <div className="text-white/80 text-sm">후배 성장 지원</div>
                        </div>
                      </div>
                      <Button 
                        size="lg"
                        className="bg-white text-purple-600 hover:bg-gray-50"
                        onClick={handleStartMentorVerification}
                      >
                        러너 등록하기
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                      <p className="text-white/70 text-sm mt-4">
                        5분 소요 • 합격증 인증 필요 • 승인 후 활동 시작
                      </p>
                    </div>
                  </Card>
                </motion.div>
              ) : (
                /* Active Mentor Dashboard */
                <div className="space-y-6">
                  {/* Mentor Stats */}
                  <div className="grid md:grid-cols-4 gap-4">
                    <Card className="p-6 card-hover cursor-pointer" onClick={() => onNavigate('mentor-revenue')}>
                      <div className="flex items-center gap-3 mb-2">
                        <DollarSign className="w-5 h-5 text-green-600" />
                        <span className="text-sm text-gray-600">이번 달 수익</span>
                      </div>
                      <div className="text-3xl font-bold">₩420k</div>
                    </Card>

                    <Card className="p-6 card-hover cursor-pointer" onClick={() => onNavigate('session-list')}>
                      <div className="flex items-center gap-3 mb-2">
                        <Calendar className="w-5 h-5 text-sky-600" />
                        <span className="text-sm text-gray-600">이번 주 세션</span>
                      </div>
                      <div className="text-3xl font-bold">5건</div>
                    </Card>

                    <Card className="p-6 card-hover">
                      <div className="flex items-center gap-3 mb-2">
                        <Star className="w-5 h-5 text-yellow-500" />
                        <span className="text-sm text-gray-600">평점</span>
                      </div>
                      <div className="text-3xl font-bold">4.9</div>
                    </Card>

                    <Card className="p-6 card-hover">
                      <div className="flex items-center gap-3 mb-2">
                        <TrendingUp className="w-5 h-5 text-purple-600" />
                        <span className="text-sm text-gray-600">성공률</span>
                      </div>
                      <div className="text-3xl font-bold">87%</div>
                    </Card>
                  </div>

                  {/* Quick Actions */}
                  <Card className="p-6">
                    <h3 className="font-semibold mb-4">빠른 작업</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <Button 
                        variant="outline" 
                        className="h-auto py-4 justify-start"
                        onClick={() => onNavigate('mentor-schedule')}
                      >
                        <Clock className="w-5 h-5 mr-3" />
                        <div className="text-left">
                          <div className="font-semibold">일정 관리</div>
                          <div className="text-sm text-gray-500">가능한 시간 설정</div>
                        </div>
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="h-auto py-4 justify-start"
                        onClick={() => onNavigate('mentor-revenue')}
                      >
                        <BarChart3 className="w-5 h-5 mr-3" />
                        <div className="text-left">
                          <div className="font-semibold">수익 관리</div>
                          <div className="text-sm text-gray-500">정산 및 출금</div>
                        </div>
                      </Button>
                    </div>
                  </Card>

                  {/* Recent Requests */}
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">최근 릴레이 요청</h3>
                      <Button variant="ghost" size="sm">전체보기</Button>
                    </div>
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center text-xl">
                            👨‍🎓
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold">학업계획서 첨삭</div>
                            <div className="text-sm text-gray-600">박지원 • 연세대 경영 지원</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-sky-600">₩80,000</div>
                            <div className="text-xs text-gray-500">2시간 전</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Success Rate Detail Modal */}
      <AnimatePresence>
        {showSuccessRateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowSuccessRateModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-green-500 to-emerald-600 rounded-t-2xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">{stats.reportTitle}</h2>
                      <p className="text-white/80 text-sm">{content.seasonLabel}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowSuccessRateModal(false)}
                    className="text-white hover:bg-white/20 rounded-xl"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Overall Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
                    <div className="text-3xl font-bold text-green-600 mb-1">{stats.overallRate}%</div>
                    <div className="text-xs text-gray-600">전체 합격률</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl border border-sky-100">
                    <div className="text-3xl font-bold text-sky-600 mb-1">{stats.totalMentees}</div>
                    <div className="text-xs text-gray-600">총 멘티 수</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-100">
                    <div className="text-3xl font-bold text-purple-600 mb-1">{stats.successCount}</div>
                    <div className="text-xs text-gray-600">합격자 수</div>
                  </div>
                </div>

                {/* University Breakdown */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <GraduationCap className="w-5 h-5 text-gray-700" />
                    <h3 className="font-semibold text-gray-900">{stats.institutionLabel}</h3>
                  </div>
                  <div className="space-y-3">
                    {stats.institutions.map((uni) => (
                      <div key={uni.name} className="group">
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-800">{uni.name}</span>
                            <span className="text-xs text-gray-500">{uni.count}명 지원</span>
                          </div>
                          <span className="font-bold text-green-600">{uni.rate}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${uni.rate}%` }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className={`h-full rounded-full ${uni.color}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Major Breakdown */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Target className="w-5 h-5 text-gray-700" />
                    <h3 className="font-semibold text-gray-900">{stats.fieldLabel}</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {stats.fields.map((item) => (
                      <div key={item.name} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                        <span className="text-xl">{item.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-800 text-sm truncate">{item.name}</div>
                        </div>
                        <Badge className="bg-green-100 text-green-700 border-green-200 text-xs shrink-0">
                          {item.rate}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Monthly Trend */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <BarChart3 className="w-5 h-5 text-gray-700" />
                    <h3 className="font-semibold text-gray-900">월별 합격률 추이</h3>
                  </div>
                  <div className="flex items-end gap-2 h-32 px-2">
                    {stats.monthlyTrend.map((item, idx) => (
                      <div key={item.month} className="flex-1 flex flex-col items-center gap-1">
                        <span className="text-xs font-semibold text-green-600">{item.rate}%</span>
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${(item.rate / 100) * 90}%` }}
                          transition={{ duration: 0.6, delay: idx * 0.1 }}
                          className="w-full bg-gradient-to-t from-green-500 to-emerald-400 rounded-t-lg min-h-[4px]"
                        />
                        <span className="text-xs text-gray-500">{item.month}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Insights */}
                <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl p-5 border border-sky-100">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-5 h-5 text-sky-600" />
                    <h3 className="font-semibold text-gray-900">핵심 인사이트</h3>
                  </div>
                  <div className="space-y-2.5">
                    {content.insights.map((insight, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 text-sky-500 mt-0.5 shrink-0" />
                        <span className="text-sm text-gray-700">{insight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="flex gap-3">
                  <Button
                    className="flex-1 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white rounded-xl h-12"
                    onClick={() => {
                      setShowSuccessRateModal(false);
                      onNavigate('mentor-search');
                    }}
                  >
                    <Search className="w-4 h-4 mr-2" />
                    러너 찾기
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 rounded-xl h-12 border-sky-200 text-sky-700 hover:bg-sky-50"
                    onClick={() => {
                      setShowSuccessRateModal(false);
                      onNavigate('ai-experience');
                    }}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    {content.docLabel} 작성
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}