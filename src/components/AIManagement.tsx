import { useState, useEffect } from 'react';
import { logger } from '../utils/logger';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { 
  ArrowLeft,
  Edit,
  Trash2,
  Download,
  Users,
  Plus,
  Sparkles,
  FileText,
  Calendar,
  Eye,
  Copy,
  Share2,
  MoreVertical,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import type { AIData, Screen } from '../App';
import * as apiClient from './api';

interface AIManagementProps {
  onBack: () => void;
  onEdit: (data: AIData) => void;
  onMentorConnect: () => void;
  onNavigate?: (screen: Screen) => void;
}

interface Draft {
  id: string;
  university: string;
  major: string;
  wordCount: number;
  version: number;
  storyline: string;
  status: 'completed' | 'with-mentor' | 'draft';
  lastModified: string;
  hasSession: boolean;
  mentorName?: string;
}

const mockDrafts: Draft[] = [
  {
    id: '1',
    university: '연세대',
    major: '경영학과',
    wordCount: 1487,
    version: 3,
    storyline: 'A',
    status: 'completed',
    lastModified: '2025.02.05',
    hasSession: false,
  },
  {
    id: '2',
    university: '고려대',
    major: '경영학과',
    wordCount: 1205,
    version: 1,
    storyline: 'B',
    status: 'with-mentor',
    lastModified: '2025.02.03',
    hasSession: true,
    mentorName: '김서연',
  },
];

export function AIManagement({ onBack, onEdit, onMentorConnect, onNavigate }: AIManagementProps) {
  const [credits, setCredits] = useState(2);
  const [drafts, setDrafts] = useState<Draft[]>(mockDrafts);
  const [selectedDraft, setSelectedDraft] = useState<string | null>(null);
  const [loadingDrafts, setLoadingDrafts] = useState(true);
  const [showCreditInfoModal, setShowCreditInfoModal] = useState(false);

  // Load drafts from server on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [draftsResult, creditsResult] = await Promise.all([
          apiClient.getDrafts(),
          apiClient.getCredits(),
        ]);
        if (draftsResult.drafts && draftsResult.drafts.length > 0) {
          const serverDrafts: Draft[] = draftsResult.drafts.map((d: any) => ({
            id: d.id,
            university: d.university || '대학',
            major: d.major || '학과',
            wordCount: d.wordCount || 0,
            version: d.version || 1,
            storyline: d.storyline?.id || 'A',
            status: d.status || 'draft',
            lastModified: new Date(d.updatedAt || d.createdAt).toISOString().split('T')[0].replace(/-/g, '.'),
            hasSession: false,
          }));
          setDrafts([...serverDrafts, ...mockDrafts]);
        }
        if (creditsResult.balance !== undefined) {
          setCredits(creditsResult.balance);
        }
      } catch (e) {
        logger.log('Failed to load drafts from server, using mock data:', e);
      } finally {
        setLoadingDrafts(false);
      }
    };
    loadData();
  }, []);

  const handleDelete = async (draftId: string) => {
    if (confirm('정말로 이 AI 초안을 삭제하시겠습니까?')) {
      setDrafts(prev => prev.filter(d => d.id !== draftId));
      toast.success('AI 초안이 삭제되었습니다');
      // Also delete from server
      try {
        await apiClient.deleteDraft(draftId);
      } catch (e) {
        logger.log('Server draft delete failed:', e);
      }
    }
  };

  const handleDownloadPDF = (draft: Draft) => {
    toast.success(`${draft.university} ${draft.major} AI 초안 PDF 다운로드 시작`);
    // In real app, this would trigger PDF generation and download
  };

  const handleDuplicate = (draft: Draft) => {
    const newDraft: Draft = {
      ...draft,
      id: Date.now().toString(),
      version: 1,
      lastModified: new Date().toISOString().split('T')[0].replace(/-/g, '.'),
      status: 'draft',
      hasSession: false,
    };
    setDrafts(prev => [newDraft, ...prev]);
    toast.success('AI 초안이 복제되었습니다');
  };

  const handleShare = (draft: Draft) => {
    const shareUrl = `https://relay.app/draft/${draft.id}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success('공유 링크가 클립보드에 복사되었습니다');
  };

  const handlePurchaseCredit = () => {
    toast.success('크레딧 구매 페이지로 이동합니다');
    // Navigate to payment
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500 text-white border-0">✓ 완료</Badge>;
      case 'with-mentor':
        return <Badge className="bg-violet-500 text-white border-0">👤 러너 첨삭 중</Badge>;
      case 'draft':
        return <Badge variant="outline" className="text-gray-600">✏️ 편집 중</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50 pb-20 md:pb-0">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-10 shadow-sm">
        <div className="container-web py-6">
          <div className="flex items-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="ghost" size="icon" onClick={onBack}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </motion.div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                내 AI 초안
              </h1>
              <p className="text-gray-600 mt-1">AI로 생성한 AI 초안을 관리하세요</p>
            </div>
            <Badge className="bg-gradient-to-r from-violet-500 to-purple-600 text-white border-0 px-4 py-2 shadow-lg">
              <Sparkles className="w-4 h-4 mr-2" />
              {credits}회
            </Badge>
          </div>
        </div>
      </div>

      <div className="container-web py-8 pb-24">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Create New CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            className="cursor-pointer"
            onClick={() => onNavigate?.('ai-experience')}
          >
            <Card className="relative overflow-hidden border-0 shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-purple-600"></div>
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
              </div>
              <div className="relative p-8 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <Sparkles className="w-8 h-8 text-white" />
                    <h2 className="text-2xl font-bold text-white">새 AI 초안 만들기</h2>
                  </div>
                  <p className="text-white/90 mb-4">
                    AI가 5분 만에 AI 초안을 만들어드립니다
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm">
                      무료 {credits}회 남음
                    </Badge>
                    <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm">
                      5분 소요
                    </Badge>
                  </div>
                </div>
                <div className="hidden md:flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl backdrop-blur-sm">
                  <Plus className="w-8 h-8 text-white" />
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Credit Purchase Banner */}
          {credits === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">💡 크레딧이 부족해요</h3>
                    <p className="text-gray-600 mb-4">
                      추가 크레딧을 구매하거나 릴레이 세션 결과 보고를 작성하여 크레딧을 받으세요
                    </p>
                    <div className="flex gap-2">
                      <Button 
                        onClick={handlePurchaseCredit}
                        className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white"
                      >
                        크레딧 구매
                      </Button>
                      <Button variant="outline" onClick={() => setShowCreditInfoModal(true)}>
                        크레딧 받는 방법
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Drafts List */}
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-violet-600" />
              내 AI 초안 ({drafts.length})
            </h2>

            {drafts.length === 0 ? (
              <Card className="p-12 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">아직 AI 초안이 없어요</h3>
                <p className="text-gray-600 mb-6">
                  AI가 맞춤형 AI 초안을 만들어드립니다
                </p>
                <Button 
                  onClick={() => onNavigate?.('ai-experience')}
                  className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  첫 AI 초안 만들기
                </Button>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {drafts.map((draft, index) => (
                  <motion.div
                    key={draft.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="p-6 card-hover cursor-pointer relative">
                      {/* Menu Button */}
                      <button 
                        className="absolute top-4 right-4 w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDraft(selectedDraft === draft.id ? null : draft.id);
                        }}
                      >
                        <MoreVertical className="w-4 h-4 text-gray-500" />
                      </button>

                      {/* Dropdown Menu */}
                      {selectedDraft === draft.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="absolute top-14 right-4 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-10 min-w-[160px]"
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDuplicate(draft);
                              setSelectedDraft(null);
                            }}
                            className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-sm"
                          >
                            <Copy className="w-4 h-4" />
                            복제하기
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShare(draft);
                              setSelectedDraft(null);
                            }}
                            className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-sm"
                          >
                            <Share2 className="w-4 h-4" />
                            공유하기
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownloadPDF(draft);
                              setSelectedDraft(null);
                            }}
                            className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-sm"
                          >
                            <Download className="w-4 h-4" />
                            PDF 다운로드
                          </button>
                          <div className="border-t border-gray-100 my-1"></div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(draft.id);
                              setSelectedDraft(null);
                            }}
                            className="w-full px-4 py-2 text-left hover:bg-red-50 flex items-center gap-2 text-sm text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                            삭제하기
                          </button>
                        </motion.div>
                      )}

                      <div 
                        onClick={() => {
                          onEdit({
                            university: draft.university,
                            major: draft.major,
                            motivation: '',
                            activities: [],
                            keywords: [],
                            tone: 'balanced',
                            wordCount: draft.wordCount,
                          });
                        }}
                      >
                        {/* Header */}
                        <div className="mb-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-bold text-lg">
                              {draft.university} {draft.major}
                            </h3>
                          </div>
                          {getStatusBadge(draft.status)}
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-3 mb-4 p-3 bg-gray-50 rounded-xl">
                          <div className="text-center">
                            <div className="text-sm text-gray-600 mb-1">글자수</div>
                            <div className="font-semibold text-violet-600">{draft.wordCount}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm text-gray-600 mb-1">버전</div>
                            <div className="font-semibold">v{draft.version}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm text-gray-600 mb-1">스토리</div>
                            <div className="font-semibold">{draft.storyline}</div>
                          </div>
                        </div>

                        {/* Mentor Info */}
                        {draft.hasSession && draft.mentorName && (
                          <div className="mb-4 p-3 bg-violet-50 rounded-xl flex items-center gap-2">
                            <Users className="w-4 h-4 text-violet-600" />
                            <span className="text-sm text-gray-700">
                              <span className="font-semibold">{draft.mentorName}</span> 러너와 첨삭 중
                            </span>
                          </div>
                        )}

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Calendar className="w-4 h-4" />
                            {draft.lastModified}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                e.stopPropagation();
                                onEdit({
                                  university: draft.university,
                                  major: draft.major,
                                  motivation: '',
                                  activities: [],
                                  keywords: [],
                                  tone: 'balanced',
                                  wordCount: draft.wordCount,
                                });
                              }}
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              편집
                            </Button>
                            {!draft.hasSession && (
                              <Button
                                size="sm"
                                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                  e.stopPropagation();
                                  onMentorConnect();
                                }}
                                className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white"
                              >
                                <Users className="w-4 h-4 mr-1" />
                                러너 찾기
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Tips Section */}
          <Card className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              💡 작성 팁
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">•</span>
                <span>AI 초안을 받은 후 러너와 함께 첨삭하면 합격률이 2배 높아집니다</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">•</span>
                <span>여러 학교의 AI 초안을 작성하고 비교해보세요</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">•</span>
                <span>결과 보고를 작성하면 AI 크레딧 1회를 무료로 받을 수 있어요</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>

      {/* Credit Info Modal */}
      <AnimatePresence>
        {showCreditInfoModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowCreditInfoModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl z-50 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">크레딧 받는 방법</h2>
                <Button variant="ghost" size="icon" onClick={() => setShowCreditInfoModal(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <div className="space-y-4">
                <Card className="p-4 bg-violet-50 border-violet-200">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">📝</span>
                    <div>
                      <div className="font-semibold mb-1">결과 보고 작성</div>
                      <div className="text-sm text-gray-600">
                        릴레이 세션 후 결과 보고를 작성하면 <span className="font-semibold text-violet-600">1 크레딧</span>을 받을 수 있어요
                      </div>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 bg-blue-50 border-blue-200">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">👥</span>
                    <div>
                      <div className="font-semibold mb-1">친구 초대</div>
                      <div className="text-sm text-gray-600">
                        친구를 초대하고 가입하면 <span className="font-semibold text-blue-600">2 크레딧</span>을 받을 수 있어요
                      </div>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 bg-green-50 border-green-200">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🎉</span>
                    <div>
                      <div className="font-semibold mb-1">프로모션 이벤트</div>
                      <div className="text-sm text-gray-600">
                        시즌별 이벤트에 참여하면 추가 크레딧을 받을 수 있어요
                      </div>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 bg-amber-50 border-amber-200">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">⭐</span>
                    <div>
                      <div className="font-semibold mb-1">리뷰 작성</div>
                      <div className="text-sm text-gray-600">
                        러너 리뷰를 작성하면 <span className="font-semibold text-amber-600">1 크레딧</span>을 받을 수 있어요
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
              <div className="mt-6">
                <Button
                  className="w-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white"
                  onClick={() => setShowCreditInfoModal(false)}
                >
                  확인
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}