import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  ArrowLeft,
  Search,
  Filter,
  Star,
  Calendar,
  MessageSquare,
  TrendingUp,
  Award,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  BookOpen
} from 'lucide-react';
import type { Screen } from '../App';
import * as api from './api';

interface MentorMenteeListProps {
  onBack: () => void;
  onNavigate: (screen: Screen) => void;
}

interface Mentee {
  id: string;
  name: string;
  avatar: string;
  university: string;
  major: string;
  status: 'active' | 'completed' | 'scheduled';
  sessions: number;
  lastSession: string;
  successRate?: number;
  rating?: number;
  totalPaid: number;
  joinedDate: string;
  goal: string;
}

const mockMentees: Mentee[] = [
  {
    id: '1',
    name: '강서준',
    avatar: '👨‍🎓',
    university: '연세대',
    major: '경영학과',
    status: 'active',
    sessions: 8,
    lastSession: '2025.02.18',
    rating: 5.0,
    totalPaid: 520000,
    joinedDate: '2025.01.10',
    goal: '연세대 경영학과 편입',
  },
  {
    id: '2',
    name: '조유진',
    avatar: '👨‍💼',
    university: '고려대',
    major: '경제학과',
    status: 'active',
    sessions: 5,
    lastSession: '2025.02.15',
    rating: 4.8,
    totalPaid: 325000,
    joinedDate: '2025.01.20',
    goal: '고려대 경제학과 편입',
  },
  {
    id: '3',
    name: '윤시우',
    avatar: '👩‍🎓',
    university: '서강대',
    major: '경영학과',
    status: 'scheduled',
    sessions: 2,
    lastSession: '2025.02.10',
    totalPaid: 130000,
    joinedDate: '2025.02.01',
    goal: '서강대 경영학과 편입',
  },
  {
    id: '4',
    name: '임채원',
    avatar: '👩‍💼',
    university: '성균관대',
    major: '글로벌경영',
    status: 'completed',
    sessions: 12,
    lastSession: '2024.12.20',
    successRate: 100,
    rating: 5.0,
    totalPaid: 780000,
    joinedDate: '2024.09.15',
    goal: '성균관대 글로벌경영 편입',
  },
  {
    id: '5',
    name: '한지호',
    avatar: '👨‍🎓',
    university: '한양대',
    major: '경영학과',
    status: 'active',
    sessions: 6,
    lastSession: '2025.02.16',
    rating: 4.9,
    totalPaid: 390000,
    joinedDate: '2025.01.25',
    goal: '한양대 경영학과 편입',
  },
  {
    id: '6',
    name: '오수민',
    avatar: '👩‍🎓',
    university: '중앙대',
    major: '경제학과',
    status: 'completed',
    sessions: 10,
    lastSession: '2024.12.15',
    successRate: 100,
    rating: 5.0,
    totalPaid: 650000,
    joinedDate: '2024.10.01',
    goal: '중앙대 경제학과 편입',
  },
];

export function MentorMenteeList({ onBack, onNavigate }: MentorMenteeListProps) {
  const [mentees, setMentees] = useState<Mentee[]>(mockMentees);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    const fetchMentees = async () => {
      setLoading(true);
      try {
        const res = await api.getSessions();
        if (res.sessions?.length > 0) {
          const menteeMap = new Map<string, Mentee>();
          res.sessions.forEach((s: any) => {
            if (s.mentee_id && !menteeMap.has(s.mentee_id)) {
              menteeMap.set(s.mentee_id, {
                id: s.mentee_id,
                name: s.mentee_name || '러너',
                avatar: s.mentee_avatar || '👤',
                university: s.university || '',
                major: s.major || '',
                status: s.status === 'completed' ? 'completed' : 'active',
                sessions: 1,
                lastSession: s.date,
                totalPaid: s.price || 0,
                joinedDate: s.created_at || s.date,
                goal: s.topic || '',
              });
            } else if (s.mentee_id) {
              const existing = menteeMap.get(s.mentee_id)!;
              existing.sessions += 1;
              existing.totalPaid += (s.price || 0);
            }
          });
          if (menteeMap.size > 0) {
            setMentees(Array.from(menteeMap.values()));
          }
        }
      } catch {
        // keep mock data on failure
      } finally {
        setLoading(false);
      }
    };
    fetchMentees();
  }, []);

  const filteredMentees = mentees.filter(mentee => {
    const matchesSearch = mentee.name.includes(searchQuery) ||
                         mentee.university.includes(searchQuery) ||
                         mentee.major.includes(searchQuery);
    const matchesTab = activeTab === 'all' || mentee.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const stats = {
    total: mentees.length,
    active: mentees.filter(m => m.status === 'active').length,
    completed: mentees.filter(m => m.status === 'completed').length,
    totalRevenue: mentees.reduce((sum, m) => sum + m.totalPaid, 0),
    avgSessions: mentees.length > 0 ? Math.round(mentees.reduce((sum, m) => sum + m.sessions, 0) / mentees.length) : 0,
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500 text-white">진행중</Badge>;
      case 'scheduled':
        return <Badge className="bg-blue-500 text-white">예정</Badge>;
      case 'completed':
        return <Badge className="bg-gray-500 text-white">완료</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen gradient-mesh pb-20">
      <div className="container-web py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">내 러너</h1>
          <p className="text-gray-600">릴레이를 제공한 모든 러너를 관리하세요</p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-5 gap-4 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="p-6 text-center card-modern">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stats.total}</div>
              <div className="text-sm text-gray-600">총 러너</div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="p-6 text-center card-modern">
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-green-700 mb-1">{stats.active}</div>
              <div className="text-sm text-gray-600">진행중</div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="p-6 text-center card-modern">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Award className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="text-3xl font-bold text-emerald-700 mb-1">{stats.completed}</div>
              <div className="text-sm text-gray-600">완료</div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="p-6 text-center card-modern">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stats.avgSessions}</div>
              <div className="text-sm text-gray-600">평균 세션</div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="p-6 text-center card-modern">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold gradient-text mb-1">{stats.totalRevenue.toLocaleString()}원</div>
              <div className="text-sm text-gray-600">총 수익</div>
            </Card>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="러너 이름, 학교로 검색..."
                className="pl-12 pr-4 h-12 rounded-2xl border-gray-200 focus:border-indigo-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={(v: string) => setActiveTab(v as any)} className="w-full md:w-auto">
              <TabsList className="grid grid-cols-3 h-12 bg-gray-100/80">
                <TabsTrigger value="all" className="data-[state=active]:bg-white">
                  전체 ({stats.total})
                </TabsTrigger>
                <TabsTrigger value="active" className="data-[state=active]:bg-white">
                  진행중 ({stats.active})
                </TabsTrigger>
                <TabsTrigger value="completed" className="data-[state=active]:bg-white">
                  완료 ({stats.completed})
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Mentee List */}
        <div className="space-y-4">
          {filteredMentees.map((mentee, index) => (
            <motion.div
              key={mentee.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-6 card-modern hover-lift cursor-pointer group">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Left: Avatar & Basic Info */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-3xl shadow-xl">
                        {mentee.avatar}
                      </div>
                      {mentee.status === 'active' && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{mentee.name}</h3>
                        {getStatusBadge(mentee.status)}
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="w-4 h-4 text-indigo-500" />
                        <span className="font-semibold text-indigo-700">{mentee.university}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-600">{mentee.major}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <BookOpen className="w-4 h-4" />
                        <span>{mentee.goal}</span>
                      </div>
                    </div>
                  </div>

                  {/* Center: Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-indigo-600">{mentee.sessions}</div>
                      <div className="text-xs text-gray-600">세션</div>
                    </div>
                    {mentee.rating && (
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-2xl font-bold text-gray-900">{mentee.rating}</span>
                        </div>
                        <div className="text-xs text-gray-600">평점</div>
                      </div>
                    )}
                    {mentee.successRate && (
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{mentee.successRate}%</div>
                        <div className="text-xs text-gray-600">합격</div>
                      </div>
                    )}
                    <div className="text-center">
                      <div className="text-lg font-bold gradient-text">{mentee.totalPaid.toLocaleString()}원</div>
                      <div className="text-xs text-gray-600">총 결제</div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex md:flex-col gap-2 justify-end">
                    <Button
                      variant="outline"
                      className="btn-secondary rounded-xl flex-1 md:flex-none"
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.stopPropagation();
                        onNavigate('chat');
                      }}
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      채팅
                    </Button>
                    <Button
                      className="btn-primary rounded-xl flex-1 md:flex-none"
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.stopPropagation();
                        onNavigate('session-detail');
                      }}
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      세션 관리
                    </Button>
                  </div>
                </div>

                {/* Timeline Info */}
                <div className="mt-6 pt-6 border-t border-gray-100 flex items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>가입: {mentee.joinedDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>최근 세션: {mentee.lastSession}</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredMentees.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="empty-state"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Users className="w-12 h-12 text-gray-300" />
            </div>
            <h3 className="empty-state-title">러너가 없습니다</h3>
            <p className="empty-state-description">
              검색 결과가 없거나 아직 릴레이를 시작하지 않았습니다
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}