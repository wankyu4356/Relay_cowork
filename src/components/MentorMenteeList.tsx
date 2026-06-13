import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { FadeIn, Stagger, Press, CountUp } from './ui/motion';
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
        return <Badge className="bg-iris-600 text-white">진행중</Badge>;
      case 'scheduled':
        return <Badge className="bg-zinc-700 text-white">예정</Badge>;
      case 'completed':
        return <Badge className="bg-zinc-400 text-white">완료</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 pb-20">
      <div className="container-web py-8">
        {/* Header */}
        <FadeIn className="mb-8">
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 mb-2">내 러너</h1>
          <p className="text-zinc-600">릴레이를 제공한 모든 러너를 관리하세요</p>
        </FadeIn>

        {/* Stats Overview */}
        <Stagger className="grid md:grid-cols-5 gap-4 mb-8">
          <Stagger.Item>
            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-iris-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-iris-600" />
              </div>
              <div className="text-3xl font-semibold tracking-tight text-zinc-900 mb-1"><CountUp value={stats.total} /></div>
              <div className="text-sm text-zinc-600">총 러너</div>
            </Card>
          </Stagger.Item>

          <Stagger.Item>
            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-iris-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-6 h-6 text-iris-600" />
              </div>
              <div className="text-3xl font-semibold tracking-tight text-zinc-900 mb-1"><CountUp value={stats.active} /></div>
              <div className="text-sm text-zinc-600">진행중</div>
            </Card>
          </Stagger.Item>

          <Stagger.Item>
            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Award className="w-6 h-6 text-zinc-700" />
              </div>
              <div className="text-3xl font-semibold tracking-tight text-zinc-900 mb-1"><CountUp value={stats.completed} /></div>
              <div className="text-sm text-zinc-600">완료</div>
            </Card>
          </Stagger.Item>

          <Stagger.Item>
            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6 text-zinc-700" />
              </div>
              <div className="text-3xl font-semibold tracking-tight text-zinc-900 mb-1"><CountUp value={stats.avgSessions} /></div>
              <div className="text-sm text-zinc-600">평균 세션</div>
            </Card>
          </Stagger.Item>

          <Stagger.Item>
            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-iris-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-iris-600" />
              </div>
              <div className="text-2xl font-semibold tracking-tight text-zinc-900 mb-1"><CountUp value={stats.totalRevenue} />원</div>
              <div className="text-sm text-zinc-600">총 수익</div>
            </Card>
          </Stagger.Item>
        </Stagger>

        {/* Filters */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
              <Input
                placeholder="러너 이름, 학교로 검색..."
                className="pl-12 pr-4 h-12 rounded-xl border-zinc-200/80 focus:border-iris-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={(v: string) => setActiveTab(v as any)} className="w-full md:w-auto">
              <TabsList className="grid grid-cols-3 h-12 bg-zinc-100">
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
        <Stagger className="space-y-4">
          {filteredMentees.map((mentee) => (
            <Stagger.Item key={mentee.id}>
              <Press>
              <Card className="p-6 cursor-pointer group">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Left: Avatar & Basic Info */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className="relative">
                      <div className="w-16 h-16 bg-iris-100 rounded-2xl flex items-center justify-center text-3xl">
                        {mentee.avatar}
                      </div>
                      {mentee.status === 'active' && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-iris-600 rounded-full border-2 border-white" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold tracking-tight text-zinc-900">{mentee.name}</h3>
                        {getStatusBadge(mentee.status)}
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="w-4 h-4 text-iris-600" />
                        <span className="font-semibold text-iris-700">{mentee.university}</span>
                        <span className="text-zinc-400">•</span>
                        <span className="text-zinc-600">{mentee.major}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-zinc-600">
                        <BookOpen className="w-4 h-4" />
                        <span>{mentee.goal}</span>
                      </div>
                    </div>
                  </div>

                  {/* Center: Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-semibold tracking-tight text-iris-600 tnum">{mentee.sessions}</div>
                      <div className="text-xs text-zinc-600">세션</div>
                    </div>
                    {mentee.rating && (
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          <span className="text-2xl font-semibold tracking-tight text-zinc-900 tnum">{mentee.rating}</span>
                        </div>
                        <div className="text-xs text-zinc-600">평점</div>
                      </div>
                    )}
                    {mentee.successRate && (
                      <div className="text-center">
                        <div className="text-2xl font-semibold tracking-tight text-iris-600 tnum">{mentee.successRate}%</div>
                        <div className="text-xs text-zinc-600">합격</div>
                      </div>
                    )}
                    <div className="text-center">
                      <div className="text-lg font-semibold tracking-tight text-zinc-900 tnum">{mentee.totalPaid.toLocaleString()}원</div>
                      <div className="text-xs text-zinc-600">총 결제</div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex md:flex-col gap-2 justify-end">
                    <Button
                      variant="outline"
                      className="rounded-xl flex-1 md:flex-none"
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.stopPropagation();
                        onNavigate('chat');
                      }}
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      채팅
                    </Button>
                    <Button
                      className="rounded-xl flex-1 md:flex-none"
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
                <div className="mt-6 pt-6 border-t border-zinc-200/80 flex items-center gap-6 text-sm text-zinc-600">
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
              </Press>
            </Stagger.Item>
          ))}
        </Stagger>

        {/* Empty State */}
        {filteredMentees.length === 0 && (
          <FadeIn className="empty-state">
            <div className="w-24 h-24 bg-zinc-100 rounded-full flex items-center justify-center mb-6">
              <Users className="w-12 h-12 text-zinc-300" />
            </div>
            <h3 className="empty-state-title">러너가 없습니다</h3>
            <p className="empty-state-description">
              검색 결과가 없거나 아직 릴레이를 시작하지 않았습니다
            </p>
          </FadeIn>
        )}
      </div>
    </div>
  );
}