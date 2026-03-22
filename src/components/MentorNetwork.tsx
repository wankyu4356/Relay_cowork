import { useState } from 'react';
import { logger } from '../utils/logger';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { RelayChainVisualization } from './RelayChainVisualization';
import { 
  ArrowLeft, 
  Network, 
  Star, 
  TrendingUp, 
  Users,
  Zap,
  Award,
  Target,
  BookOpen,
  Calendar
} from 'lucide-react';
import type { Mentor } from '../App';

interface MentorNetworkProps {
  onBack: () => void;
  onMentorSelect: (mentor: Mentor) => void;
  onStartMentoring?: () => void;
}

// Mock data for connected runners
const connectedRunners: Array<{
  id: string;
  name: string;
  avatar: string;
  university: string;
  major: string;
  connectionType: 'mentor' | 'peer' | 'mentee';
  distance: number;
  connectionPath: string[];
  sharedExperiences: string[];
  successRate?: number;
  rating?: number;
  sessions?: number;
}> = [
  {
    id: '1',
    name: '김민준',
    avatar: '👨‍🎓',
    university: '연세대',
    major: '경영학과',
    connectionType: 'mentor',
    distance: 1,
    connectionPath: ['나', '김민준'],
    sharedExperiences: ['학생회', '창업동아리', '해외인턴'],
    successRate: 92,
    rating: 4.9,
    sessions: 48,
  },
  {
    id: '2',
    name: '박지우',
    avatar: '👨‍🎓',
    university: '고려대',
    major: '경영학과',
    connectionType: 'mentee',
    distance: 1,
    connectionPath: ['나', '박지우'],
    sharedExperiences: ['마케팅 동아리', '봉사활동'],
    successRate: 0,
  },
  {
    id: '3',
    name: '최예은',
    avatar: '👨‍💼',
    university: '성균관대',
    major: '경영학과',
    connectionType: 'peer',
    distance: 2,
    connectionPath: ['나', '김민준', '최예은'],
    sharedExperiences: ['학생회', 'IT 동아리'],
    successRate: 88,
    rating: 4.8,
    sessions: 35,
  },
  {
    id: '4',
    name: '정도윤',
    avatar: '👩‍💼',
    university: '서강대',
    major: '글로벌경영',
    connectionType: 'mentee',
    distance: 1,
    connectionPath: ['나', '정도윤'],
    sharedExperiences: ['해외봉사', '창업경진대회'],
    successRate: 100,
  },
];

export function MentorNetwork({ onBack, onMentorSelect, onStartMentoring }: MentorNetworkProps) {
  const [activeTab, setActiveTab] = useState<'chain' | 'connections'>('chain');

  const getConnectionTypeText = (type: string) => {
    switch (type) {
      case 'mentor':
        return '선배 러너';
      case 'peer':
        return '동료 러너';
      case 'mentee':
        return '후배 러너';
      default:
        return '';
    }
  };

  const getConnectionTypeColor = (type: string) => {
    switch (type) {
      case 'mentor':
        return 'from-purple-400 to-indigo-500';
      case 'peer':
        return 'from-blue-400 to-green-500';
      case 'mentee':
        return 'from-green-400 to-emerald-500';
      default:
        return 'from-gray-400 to-gray-500';
    }
  };

  const mentorConnections = connectedRunners.filter(r => r.connectionType === 'mentor');
  const peerConnections = connectedRunners.filter(r => r.connectionType === 'peer');
  const menteeConnections = connectedRunners.filter(r => r.connectionType === 'mentee');

  return (
    <div className="min-h-screen gradient-mesh pb-20">
      <div className="container-web py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onBack}
            className="hover:bg-white/50 rounded-xl"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-4xl font-bold gradient-text mb-2">릴레이 네트워크</h1>
            <p className="text-gray-600">경험으로 연결된 러너들의 관계를 확인하세요</p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="p-6 text-center card-modern">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Network className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-3xl font-bold gradient-text mb-1">{connectedRunners.length}</div>
              <div className="text-sm text-gray-600">연결된 러너</div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="p-6 text-center card-modern">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-purple-700 mb-1">{mentorConnections.length}</div>
              <div className="text-sm text-gray-600">선배 러너</div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="p-6 text-center card-modern">
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Award className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-green-700 mb-1">{menteeConnections.length}</div>
              <div className="text-sm text-gray-600">후배 러너</div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="p-6 text-center card-modern">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-blue-700 mb-1">{peerConnections.length}</div>
              <div className="text-sm text-gray-600">동료 러너</div>
            </Card>
          </motion.div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v: string) => setActiveTab(v as any)} className="space-y-6">
          <TabsList className="grid grid-cols-2 h-14 bg-white/50 backdrop-blur-sm shadow-sm">
            <TabsTrigger value="chain" className="data-[state=active]:bg-white text-base font-semibold">
              <Zap className="w-4 h-4 mr-2" />
              릴레이 체인
            </TabsTrigger>
            <TabsTrigger value="connections" className="data-[state=active]:bg-white text-base font-semibold">
              <Network className="w-4 h-4 mr-2" />
              연결 목록
            </TabsTrigger>
          </TabsList>

          {/* Relay Chain Tab */}
          <TabsContent value="chain" className="mt-6">
            <RelayChainVisualization 
              currentUserName="러너 #2847"
              onNodeClick={(node) => {
                logger.log('Node clicked:', node);
              }}
              onStartMentoring={onStartMentoring}
            />
          </TabsContent>

          {/* Connections Tab */}
          <TabsContent value="connections" className="mt-6 space-y-6">
            {/* Mentors Section */}
            {mentorConnections.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-purple-600" />
                  </div>
                  선배 러너 ({mentorConnections.length})
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {mentorConnections.map((runner, index) => (
                    <motion.div
                      key={runner.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="p-6 card-modern hover-lift cursor-pointer">
                        <div className="flex items-start gap-4 mb-4">
                          <div className={`relative w-14 h-14 bg-gradient-to-br ${getConnectionTypeColor(runner.connectionType)} rounded-xl flex items-center justify-center text-2xl shadow-lg`}>
                            {runner.avatar}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-bold text-gray-900">러너 #{runner.id}</h4>
                              <Badge className={`bg-gradient-to-r ${getConnectionTypeColor(runner.connectionType)} text-white border-0 text-xs`}>
                                {getConnectionTypeText(runner.connectionType)}
                              </Badge>
                            </div>
                            <div className="text-sm text-gray-600">
                              {runner.university} • {runner.major}
                            </div>
                          </div>
                        </div>

                        {/* Connection Path */}
                        <div className="mb-4 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
                          <div className="text-xs text-gray-600 mb-1">경험 연결 경로</div>
                          <div className="flex items-center gap-2 text-sm font-medium text-indigo-700">
                            {runner.connectionPath.map((name, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <span>{name}</span>
                                {i < runner.connectionPath.length - 1 && (
                                  <Zap className="w-3 h-3 text-purple-500" />
                                )}
                              </div>
                            ))}
                          </div>
                          <div className="text-xs text-purple-600 mt-1">
                            {runner.distance}단계 연결
                          </div>
                        </div>

                        {/* Shared Experiences */}
                        <div className="mb-4">
                          <div className="text-xs text-gray-600 mb-2">공유된 경험</div>
                          <div className="flex flex-wrap gap-2">
                            {runner.sharedExperiences.map((exp, i) => (
                              <Badge
                                key={i}
                                className="bg-white border border-indigo-200 text-indigo-700 text-xs"
                              >
                                {exp}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Stats */}
                        {runner.sessions && (
                          <div className="grid grid-cols-3 gap-2 mb-4">
                            <div className="text-center p-2 bg-yellow-50 rounded-lg">
                              <div className="flex items-center justify-center gap-1 mb-1">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm font-bold">{runner.rating}</span>
                              </div>
                              <div className="text-xs text-gray-600">평점</div>
                            </div>
                            <div className="text-center p-2 bg-green-50 rounded-lg">
                              <div className="text-sm font-bold text-green-700">{runner.successRate}%</div>
                              <div className="text-xs text-gray-600">성공률</div>
                            </div>
                            <div className="text-center p-2 bg-blue-50 rounded-lg">
                              <div className="text-sm font-bold text-blue-700">{runner.sessions}</div>
                              <div className="text-xs text-gray-600">전달</div>
                            </div>
                          </div>
                        )}

                        <Button className="w-full btn-primary rounded-xl" size="sm">
                          <Calendar className="w-4 h-4 mr-2" />
                          릴레이 세션 예약
                        </Button>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Peers Section */}
            {peerConnections.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  동료 러너 ({peerConnections.length})
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {peerConnections.map((runner, index) => (
                    <motion.div
                      key={runner.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="p-6 card-modern hover-lift cursor-pointer">
                        <div className="flex items-start gap-4 mb-4">
                          <div className={`relative w-14 h-14 bg-gradient-to-br ${getConnectionTypeColor(runner.connectionType)} rounded-xl flex items-center justify-center text-2xl shadow-lg`}>
                            {runner.avatar}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-bold text-gray-900">러너 #{runner.id}</h4>
                              <Badge className={`bg-gradient-to-r ${getConnectionTypeColor(runner.connectionType)} text-white border-0 text-xs`}>
                                {getConnectionTypeText(runner.connectionType)}
                              </Badge>
                            </div>
                            <div className="text-sm text-gray-600">
                              {runner.university} • {runner.major}
                            </div>
                          </div>
                        </div>

                        {/* Connection Path */}
                        <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl">
                          <div className="text-xs text-gray-600 mb-1">경험 연결 경로</div>
                          <div className="flex items-center gap-2 text-sm font-medium text-blue-700">
                            {runner.connectionPath.map((name, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <span className="truncate max-w-[80px]">{name}</span>
                                {i < runner.connectionPath.length - 1 && (
                                  <Zap className="w-3 h-3 text-green-500" />
                                )}
                              </div>
                            ))}
                          </div>
                          <div className="text-xs text-green-600 mt-1">
                            {runner.distance}단계 연결
                          </div>
                        </div>

                        {/* Shared Experiences */}
                        <div className="mb-4">
                          <div className="text-xs text-gray-600 mb-2">공유된 경험</div>
                          <div className="flex flex-wrap gap-2">
                            {runner.sharedExperiences.map((exp, i) => (
                              <Badge
                                key={i}
                                className="bg-white border border-blue-200 text-blue-700 text-xs"
                              >
                                {exp}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {runner.sessions && (
                          <div className="grid grid-cols-3 gap-2 mb-4">
                            <div className="text-center p-2 bg-yellow-50 rounded-lg">
                              <div className="flex items-center justify-center gap-1 mb-1">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm font-bold">{runner.rating}</span>
                              </div>
                              <div className="text-xs text-gray-600">평점</div>
                            </div>
                            <div className="text-center p-2 bg-green-50 rounded-lg">
                              <div className="text-sm font-bold text-green-700">{runner.successRate}%</div>
                              <div className="text-xs text-gray-600">성공률</div>
                            </div>
                            <div className="text-center p-2 bg-blue-50 rounded-lg">
                              <div className="text-sm font-bold text-blue-700">{runner.sessions}</div>
                              <div className="text-xs text-gray-600">전달</div>
                            </div>
                          </div>
                        )}

                        <Button className="w-full btn-secondary rounded-xl" size="sm">
                          <Network className="w-4 h-4 mr-2" />
                          정보 교류하기
                        </Button>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Mentees Section */}
            {menteeConnections.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
                    <Award className="w-4 h-4 text-green-600" />
                  </div>
                  후배 러너 ({menteeConnections.length})
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {menteeConnections.map((runner, index) => (
                    <motion.div
                      key={runner.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="p-6 card-modern hover-lift cursor-pointer">
                        <div className="flex items-start gap-4 mb-4">
                          <div className={`relative w-14 h-14 bg-gradient-to-br ${getConnectionTypeColor(runner.connectionType)} rounded-xl flex items-center justify-center text-2xl shadow-lg`}>
                            {runner.avatar}
                            {runner.successRate === 100 && (
                              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                                <Award className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-bold text-gray-900">{runner.name}</h4>
                              <Badge className={`bg-gradient-to-r ${getConnectionTypeColor(runner.connectionType)} text-white border-0 text-xs`}>
                                {getConnectionTypeText(runner.connectionType)}
                              </Badge>
                            </div>
                            <div className="text-sm text-gray-600">
                              {runner.university} • {runner.major}
                            </div>
                          </div>
                        </div>

                        {/* Connection Path */}
                        <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                          <div className="text-xs text-gray-600 mb-1">경험 전달 경로</div>
                          <div className="flex items-center gap-2 text-sm font-medium text-green-700">
                            {runner.connectionPath.map((name, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <span>{name}</span>
                                {i < runner.connectionPath.length - 1 && (
                                  <Zap className="w-3 h-3 text-emerald-500" />
                                )}
                              </div>
                            ))}
                          </div>
                          <div className="text-xs text-emerald-600 mt-1">
                            내가 직접 전달
                          </div>
                        </div>

                        {/* Shared Experiences */}
                        <div className="mb-4">
                          <div className="text-xs text-gray-600 mb-2">전달한 경험</div>
                          <div className="flex flex-wrap gap-2">
                            {runner.sharedExperiences.map((exp, i) => (
                              <Badge
                                key={i}
                                className="bg-white border border-green-200 text-green-700 text-xs"
                              >
                                {exp}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Success Badge */}
                        {runner.successRate === 100 && (
                          <div className="mb-4 p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl text-white text-center">
                            <Award className="w-6 h-6 mx-auto mb-1" />
                            <div className="text-sm font-bold">합격 완료! 🎉</div>
                            <div className="text-xs opacity-90">릴레이 성공</div>
                          </div>
                        )}

                        <Button className="w-full btn-primary rounded-xl" size="sm" variant={runner.successRate === 100 ? 'outline' : 'default'}>
                          {runner.successRate === 100 ? (
                            <>
                              <Award className="w-4 h-4 mr-2" />
                              축하 메시지 보내기
                            </>
                          ) : (
                            <>
                              <Target className="w-4 h-4 mr-2" />
                              계속 응원하기
                            </>
                          )}
                        </Button>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}