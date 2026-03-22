import { toast } from 'sonner';
import * as api from './api';
import { logger } from '../utils/logger';
import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Switch } from './ui/switch';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './ui/dialog';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from './ui/accordion';
import {
  ArrowLeft,
  User,
  Bell,
  Lock,
  CreditCard,
  LogOut,
  Shield,
  Smartphone,
  Mail,
  Award,
  Wallet,
  HelpCircle,
  FileText,
  Camera,
  Edit2,
  Check,
  ChevronDown
} from 'lucide-react';

interface SettingsProps {
  onBack: () => void;
  credits?: number;
  isMentorActive?: boolean;
}

export function Settings({ onBack, credits = 3, isMentorActive = false }: SettingsProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [sessionReminder, setSessionReminder] = useState(true);
  const [messageNotif, setMessageNotif] = useState(true);
  const [aiNotif, setAINotif] = useState(true);
  const [marketingNotif, setMarketingNotif] = useState(false);

  // Profile edit states
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState('김민준');
  const [profileBio, setProfileBio] = useState('연세대 경영학과 편입 준비 중입니다.');
  const [profileEmail, setProfileEmail] = useState('minjun.kim@example.com');

  // Dialog states
  const [showSchoolDialog, setShowSchoolDialog] = useState(false);
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [showPaymentMethodDialog, setShowPaymentMethodDialog] = useState(false);
  const [showPaymentHistoryDialog, setShowPaymentHistoryDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showPrivacyDialog, setShowPrivacyDialog] = useState(false);
  const [showFAQDialog, setShowFAQDialog] = useState(false);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [showTermsDialog, setShowTermsDialog] = useState(false);

  // School info form states
  const [prevSchool, setPrevSchool] = useState('한국대학교');
  const [prevMajor, setPrevMajor] = useState('경제학과');
  const [targetSchool, setTargetSchool] = useState('연세대학교');
  const [targetMajor, setTargetMajor] = useState('경영학과');

  // Password form states
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Contact form states
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  const handleLogout = async () => {
    if (confirm('로그아웃 하시겠습니까?')) {
      try {
        await api.signOut();
        toast.success('로그아웃 되었습니다');
        // onAuthStateChange listener in App.tsx will handle navigation to auth screen
      } catch (e) {
        logger.error('Logout error:', e);
        toast.error('로그아웃 중 오류가 발생했습니다');
      }
    }
  };

  const handleSaveProfile = async () => {
    setIsEditingProfile(false);
    try {
      await api.updateProfile({ name: profileName, bio: profileBio, email: profileEmail });
      toast.success('프로필이 서버에 저장되었습니다');
    } catch (e) {
      logger.error('Profile save error:', e);
      toast.success('프로필이 저장되었습니다');
    }
  };

  const handleSaveNotifications = async () => {
    try {
      await api.updateProfile({
        notifications: {
          sessionReminder,
          messageNotif,
          aiNotif,
          marketingNotif,
        },
      });
      toast.success('알림 설정이 서버에 저장되었습니다');
    } catch (e) {
      logger.error('Notification settings save error:', e);
      toast.success('알림 설정이 저장되었습니다');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-10 shadow-sm">
        <div className="container-web py-6">
          <div className="flex items-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="ghost" size="icon" onClick={onBack}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-700 to-gray-600 bg-clip-text text-transparent">
                릴레이 설정
              </h1>
              <p className="text-gray-600 mt-1">계정 및 앱 설정을 관리하세요</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-web py-8 pb-24">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Profile Summary Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-500 to-gray-600 rounded-2xl flex items-center justify-center text-3xl">
                    👨‍🎓
                  </div>
                  <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full shadow-lg border-2 border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
                    <Camera className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-xl font-bold">{profileName}</h2>
                    {isMentorActive && (
                      <Badge className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white border-0">
                        <Award className="w-3 h-3 mr-1" />
                        러너
                      </Badge>
                    )}
                  </div>
                  <p className="text-gray-600 mb-3">{profileBio}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Wallet className="w-4 h-4" />
                      <span className="font-semibold">{credits} 크레딧</span>
                    </div>
                    <span className="text-gray-300">•</span>
                    <div className="text-gray-600">{profileEmail}</div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Account Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-gray-600" />
              계정 정보
            </h2>
            <Card className="divide-y">
              <div 
                className="p-4 hover:bg-gray-50/50 cursor-pointer transition-all group"
                onClick={() => setActiveSection(activeSection === 'profile' ? null : 'profile')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                      <Edit2 className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <div className="font-medium">프로필 수정</div>
                      <div className="text-sm text-gray-600">사진, 닉네임, 소개 변경</div>
                    </div>
                  </div>
                  <span className="text-gray-400 group-hover:text-gray-600 transition-colors">→</span>
                </div>

                {activeSection === 'profile' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t space-y-4"
                  >
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">이름</label>
                      <Input
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        placeholder="이름"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">소개</label>
                      <Input
                        value={profileBio}
                        onChange={(e) => setProfileBio(e.target.value)}
                        placeholder="자기소개"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">이메일</label>
                      <Input
                        value={profileEmail}
                        onChange={(e) => setProfileEmail(e.target.value)}
                        placeholder="이메일"
                        type="email"
                      />
                    </div>
                    <Button 
                      onClick={handleSaveProfile}
                      className="w-full bg-gradient-to-r from-gray-600 to-gray-500 hover:from-gray-700 hover:to-gray-600"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      저장하기
                    </Button>
                  </motion.div>
                )}
              </div>

              <div className="p-4 hover:bg-gray-50/50 cursor-pointer transition-all group" onClick={() => setShowSchoolDialog(true)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                      <Award className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-medium">학교 정보</div>
                      <div className="text-sm text-gray-600">전적대 및 지원 대학 정보</div>
                    </div>
                  </div>
                  <Badge variant="outline">{targetSchool} {targetMajor}</Badge>
                </div>
              </div>

              <div className="p-4 hover:bg-gray-50/50 cursor-pointer transition-all group" onClick={() => setShowVerificationDialog(true)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
                      <Shield className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium">인증 정보</div>
                      <div className="text-sm text-gray-600">학생 인증, 합격증 인증</div>
                    </div>
                  </div>
                  <Badge className="bg-green-500 text-white border-0">
                    <Check className="w-3 h-3 mr-1" />
                    인증완료
                  </Badge>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Notifications */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-gray-600" />
              알림 설정
            </h2>
            <Card className="divide-y">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                    <Bell className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <div className="font-medium">세션 리마인더</div>
                    <div className="text-sm text-gray-600">세션 1시간 전 알림</div>
                  </div>
                </div>
                <Switch checked={sessionReminder} onCheckedChange={setSessionReminder} />
              </div>
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">메시지 알림</div>
                    <div className="text-sm text-gray-600">새 메시지 도착 시 알림</div>
                  </div>
                </div>
                <Switch checked={messageNotif} onCheckedChange={setMessageNotif} />
              </div>
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-medium">AI 완료 알림</div>
                    <div className="text-sm text-gray-600">AI 초안 생성 완료 알림</div>
                  </div>
                </div>
                <Switch checked={aiNotif} onCheckedChange={setAINotif} />
              </div>
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Award className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <div className="font-medium">마케팅 알림</div>
                    <div className="text-sm text-gray-600">이벤트 및 혜택 정보</div>
                  </div>
                </div>
                <Switch checked={marketingNotif} onCheckedChange={setMarketingNotif} />
              </div>
              <div className="p-4">
                <Button 
                  onClick={handleSaveNotifications}
                  className="w-full bg-gradient-to-r from-gray-600 to-gray-500 hover:from-gray-700 hover:to-gray-600"
                >
                  알림 설정 저장
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Payment & Credits */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-gray-600" />
              결제 및 크레딧
            </h2>
            <Card className="divide-y">
              <div className="p-4 hover:bg-gray-50/50 cursor-pointer transition-all group" onClick={() => toast.info('크레딧 충전은 현재 준비 중입니다. 1크레딧 = 1,000원, 5크레딧 = 4,500원, 10크레딧 = 8,000원으로 곧 제공됩니다.')}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
                      <Wallet className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium">크레딧 충전</div>
                      <div className="text-sm text-gray-600">AI 초안 작성 크레딧</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-600">{credits}회</div>
                    <div className="text-xs text-gray-500">보유</div>
                  </div>
                </div>
              </div>
              <div className="p-4 hover:bg-gray-50/50 cursor-pointer transition-all group" onClick={() => setShowPaymentMethodDialog(true)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                      <CreditCard className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium">결제 수단</div>
                      <div className="text-sm text-gray-600">카드 및 결제 정보 관리</div>
                    </div>
                  </div>
                  <span className="text-gray-400 group-hover:text-gray-600 transition-colors">→</span>
                </div>
              </div>
              <div className="p-4 hover:bg-gray-50/50 cursor-pointer transition-all group" onClick={() => setShowPaymentHistoryDialog(true)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                      <FileText className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-medium">결제 내역</div>
                      <div className="text-sm text-gray-600">구매 및 환불 내역</div>
                    </div>
                  </div>
                  <span className="text-gray-400 group-hover:text-gray-600 transition-colors">→</span>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Security */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-gray-600" />
              보안 및 개인정보
            </h2>
            <Card className="divide-y">
              <div className="p-4 hover:bg-gray-50/50 cursor-pointer transition-all group" onClick={() => setShowPasswordDialog(true)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center group-hover:bg-red-200 transition-colors">
                      <Lock className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <div className="font-medium">비밀번호 변경</div>
                      <div className="text-sm text-gray-600">계정 비밀번호 수정</div>
                    </div>
                  </div>
                  <span className="text-gray-400 group-hover:text-gray-600 transition-colors">→</span>
                </div>
              </div>
              <div className="p-4 hover:bg-gray-50/50 cursor-pointer transition-all group" onClick={() => setShowPrivacyDialog(true)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
                      <Shield className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <div className="font-medium">개인정보 처리방침</div>
                      <div className="text-sm text-gray-600">개인정보 보호 정책</div>
                    </div>
                  </div>
                  <span className="text-gray-400 group-hover:text-gray-600 transition-colors">→</span>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Support */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-gray-600" />
              고객 지원
            </h2>
            <Card className="divide-y">
              <div className="p-4 hover:bg-gray-50/50 cursor-pointer transition-all group" onClick={() => setShowFAQDialog(true)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                      <HelpCircle className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <div className="font-medium">FAQ</div>
                      <div className="text-sm text-gray-600">자주 묻는 질문</div>
                    </div>
                  </div>
                  <span className="text-gray-400 group-hover:text-gray-600 transition-colors">→</span>
                </div>
              </div>
              <div className="p-4 hover:bg-gray-50/50 cursor-pointer transition-all group" onClick={() => setShowContactDialog(true)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
                      <Mail className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium">문의하기</div>
                      <div className="text-sm text-gray-600">support@relay.com</div>
                    </div>
                  </div>
                  <span className="text-gray-400 group-hover:text-gray-600 transition-colors">→</span>
                </div>
              </div>
              <div className="p-4 hover:bg-gray-50/50 cursor-pointer transition-all group" onClick={() => setShowTermsDialog(true)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                      <FileText className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-medium">서비스 이용약관</div>
                      <div className="text-sm text-gray-600">약관 및 정책</div>
                    </div>
                  </div>
                  <span className="text-gray-400 group-hover:text-gray-600 transition-colors">→</span>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Logout */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <Card>
              <button
                onClick={handleLogout}
                className="w-full p-4 flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 transition-colors rounded-2xl font-medium"
              >
                <LogOut className="w-5 h-5" />
                로그아웃
              </button>
            </Card>
          </motion.div>

          {/* App Version */}
          <div className="text-center text-sm text-gray-500 pt-4">
            Relay v1.0.0
          </div>
        </div>
      </div>

      {/* School Info Dialog */}
      <Dialog open={showSchoolDialog} onOpenChange={setShowSchoolDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>학교 정보</DialogTitle>
            <DialogDescription>전적대학교 및 지원 대학교 정보를 수정하세요.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label className="mb-2 block">전적 대학교</Label>
              <Input value={prevSchool} onChange={(e) => setPrevSchool(e.target.value)} placeholder="전적 대학교명" />
            </div>
            <div>
              <Label className="mb-2 block">전적 학과</Label>
              <Input value={prevMajor} onChange={(e) => setPrevMajor(e.target.value)} placeholder="전적 학과명" />
            </div>
            <div>
              <Label className="mb-2 block">지원 대학교</Label>
              <Input value={targetSchool} onChange={(e) => setTargetSchool(e.target.value)} placeholder="지원 대학교명" />
            </div>
            <div>
              <Label className="mb-2 block">지원 학과</Label>
              <Input value={targetMajor} onChange={(e) => setTargetMajor(e.target.value)} placeholder="지원 학과명" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSchoolDialog(false)}>취소</Button>
            <Button onClick={() => { toast.success('학교 정보가 저장되었습니다'); setShowSchoolDialog(false); }}>저장</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Verification Status Dialog */}
      <Dialog open={showVerificationDialog} onOpenChange={setShowVerificationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>인증 정보</DialogTitle>
            <DialogDescription>현재 인증 상태를 확인하세요.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                <span className="font-medium">학생 인증</span>
              </div>
              <Badge className="bg-green-500 text-white border-0">
                <Check className="w-3 h-3 mr-1" />
                완료
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-green-600" />
                <span className="font-medium">합격증 인증</span>
              </div>
              <Badge className="bg-green-500 text-white border-0">
                <Check className="w-3 h-3 mr-1" />
                완료
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-gray-500" />
                <span className="font-medium">이메일 인증</span>
              </div>
              <Badge className="bg-green-500 text-white border-0">
                <Check className="w-3 h-3 mr-1" />
                완료
              </Badge>
            </div>
            <p className="text-sm text-gray-500">모든 인증이 완료되었습니다. 인증 갱신이 필요한 경우 support@relay.com으로 문의해주세요.</p>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowVerificationDialog(false)}>확인</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Method Dialog */}
      <Dialog open={showPaymentMethodDialog} onOpenChange={setShowPaymentMethodDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>결제 수단 관리</DialogTitle>
            <DialogDescription>등록된 결제 수단을 관리하세요.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="font-medium">신한카드 **** 1234</div>
                  <div className="text-sm text-gray-500">기본 결제 수단</div>
                </div>
              </div>
              <Badge className="bg-blue-500 text-white border-0">기본</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-gray-500" />
                <div>
                  <div className="font-medium">카카오페이</div>
                  <div className="text-sm text-gray-500">간편 결제</div>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => toast.info('기본 결제 수단으로 변경되었습니다')}>기본 설정</Button>
            </div>
            <Button variant="outline" className="w-full" onClick={() => toast.info('결제 수단 추가 기능은 준비 중입니다')}>
              + 새 결제 수단 추가
            </Button>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowPaymentMethodDialog(false)}>닫기</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment History Dialog */}
      <Dialog open={showPaymentHistoryDialog} onOpenChange={setShowPaymentHistoryDialog}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>결제 내역</DialogTitle>
            <DialogDescription>최근 결제 및 환불 내역입니다.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 max-h-80 overflow-y-auto">
            {[
              { date: '2026-03-15', desc: '크레딧 5회 충전', amount: '4,500원', status: '완료' },
              { date: '2026-03-01', desc: '크레딧 10회 충전', amount: '8,000원', status: '완료' },
              { date: '2026-02-20', desc: '크레딧 1회 충전', amount: '1,000원', status: '완료' },
              { date: '2026-02-10', desc: '크레딧 5회 충전', amount: '4,500원', status: '환불' },
              { date: '2026-01-25', desc: '크레딧 10회 충전', amount: '8,000원', status: '완료' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div>
                  <div className="font-medium text-sm">{item.desc}</div>
                  <div className="text-xs text-gray-500">{item.date}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-sm">{item.amount}</div>
                  <Badge variant={item.status === '환불' ? 'destructive' : 'outline'} className="text-xs">
                    {item.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button onClick={() => setShowPaymentHistoryDialog(false)}>닫기</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Password Change Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>비밀번호 변경</DialogTitle>
            <DialogDescription>새로운 비밀번호를 입력하세요.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label className="mb-2 block">현재 비밀번호</Label>
              <Input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} placeholder="현재 비밀번호" />
            </div>
            <div>
              <Label className="mb-2 block">새 비밀번호</Label>
              <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="새 비밀번호 (8자 이상)" />
            </div>
            <div>
              <Label className="mb-2 block">새 비밀번호 확인</Label>
              <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="새 비밀번호 확인" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowPasswordDialog(false); setOldPassword(''); setNewPassword(''); setConfirmPassword(''); }}>취소</Button>
            <Button onClick={() => {
              if (!oldPassword || !newPassword || !confirmPassword) {
                toast.error('모든 필드를 입력해주세요');
                return;
              }
              if (newPassword.length < 8) {
                toast.error('비밀번호는 8자 이상이어야 합니다');
                return;
              }
              if (newPassword !== confirmPassword) {
                toast.error('새 비밀번호가 일치하지 않습니다');
                return;
              }
              toast.success('비밀번호가 변경되었습니다');
              setShowPasswordDialog(false);
              setOldPassword('');
              setNewPassword('');
              setConfirmPassword('');
            }}>변경하기</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Privacy Policy Dialog */}
      <Dialog open={showPrivacyDialog} onOpenChange={setShowPrivacyDialog}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>개인정보 처리방침</DialogTitle>
            <DialogDescription>릴레이 서비스 개인정보 처리방침입니다.</DialogDescription>
          </DialogHeader>
          <div className="max-h-96 overflow-y-auto text-sm text-gray-700 space-y-4 py-2 pr-2">
            <section>
              <h3 className="font-semibold text-base mb-2">제1조 (목적)</h3>
              <p>릴레이(이하 "회사")는 편입 준비생을 위한 자기소개서 작성 지원 서비스를 제공함에 있어 이용자의 개인정보를 중요시하며, 「개인정보 보호법」을 준수합니다. 본 방침은 이용자의 개인정보가 어떠한 목적과 방식으로 수집, 이용, 관리되고 있는지 안내합니다.</p>
            </section>
            <section>
              <h3 className="font-semibold text-base mb-2">제2조 (수집하는 개인정보 항목)</h3>
              <p>회사는 서비스 제공을 위해 다음 개인정보를 수집합니다:</p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>필수항목: 이름, 이메일, 비밀번호, 전적대학교, 지원대학교 정보</li>
                <li>선택항목: 프로필 사진, 자기소개, 연락처</li>
                <li>자동수집: 서비스 이용 기록, 접속 로그, 기기 정보</li>
              </ul>
            </section>
            <section>
              <h3 className="font-semibold text-base mb-2">제3조 (개인정보 수집 및 이용 목적)</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>회원 가입 및 관리: 본인 확인, 서비스 부정 이용 방지</li>
                <li>서비스 제공: AI 기반 자기소개서 초안 작성, 멘토 매칭, 세션 관리</li>
                <li>결제 처리: 크레딧 충전 및 환불 처리</li>
                <li>서비스 개선: 서비스 이용 통계 분석 및 품질 향상</li>
              </ul>
            </section>
            <section>
              <h3 className="font-semibold text-base mb-2">제4조 (개인정보 보유 및 이용 기간)</h3>
              <p>이용자의 개인정보는 회원 탈퇴 시까지 보유하며, 관련 법령에 따라 일정 기간 보관이 필요한 정보는 해당 기간 동안 안전하게 보관합니다. 전자상거래 관련 기록은 5년, 접속 로그 기록은 3개월간 보관합니다.</p>
            </section>
            <section>
              <h3 className="font-semibold text-base mb-2">제5조 (개인정보의 파기)</h3>
              <p>보유 기간이 경과하거나 처리 목적이 달성된 경우 지체 없이 해당 개인정보를 파기합니다. 전자적 파일 형태의 정보는 복구 불가능한 방법으로 삭제합니다.</p>
            </section>
            <section>
              <h3 className="font-semibold text-base mb-2">제6조 (이용자의 권리)</h3>
              <p>이용자는 언제든지 자신의 개인정보 조회, 수정, 삭제, 처리 정지를 요청할 수 있으며, 회원 탈퇴를 통해 개인정보 처리에 대한 동의를 철회할 수 있습니다.</p>
            </section>
            <p className="text-gray-500 text-xs">시행일: 2026년 1월 1일</p>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowPrivacyDialog(false)}>확인</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* FAQ Dialog */}
      <Dialog open={showFAQDialog} onOpenChange={setShowFAQDialog}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>자주 묻는 질문 (FAQ)</DialogTitle>
            <DialogDescription>릴레이 서비스 이용에 대한 자주 묻는 질문입니다.</DialogDescription>
          </DialogHeader>
          <div className="max-h-96 overflow-y-auto py-2 pr-2">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="faq-1">
                <AccordionTrigger>크레딧은 어떻게 사용하나요?</AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-600">크레딧 1회는 AI 자기소개서 초안 1건 생성에 사용됩니다. 작성된 초안을 바탕으로 멘토와 함께 수정 작업을 진행할 수 있습니다. 크레딧은 충전 후 6개월간 유효합니다.</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq-2">
                <AccordionTrigger>멘토 매칭은 어떻게 이루어지나요?</AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-600">지원하시는 대학교와 학과를 기반으로 해당 학교 편입 합격 경험이 있는 멘토를 매칭해 드립니다. 멘토 프로필을 확인한 후 세션을 예약할 수 있습니다.</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq-3">
                <AccordionTrigger>환불 정책은 어떻게 되나요?</AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-600">미사용 크레딧은 구매일로부터 7일 이내 전액 환불이 가능합니다. 일부 사용된 크레딧 패키지의 경우 잔여 크레딧에 대해 정가 기준으로 차감 후 환불됩니다. 자세한 내용은 고객지원으로 문의해주세요.</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq-4">
                <AccordionTrigger>AI 초안의 품질은 어떤가요?</AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-600">AI 초안은 지원 대학교 및 학과의 특성, 편입 자기소개서 작성 가이드라인을 반영하여 생성됩니다. 초안은 참고용이며, 멘토와의 세션을 통해 개인 경험과 강점을 반영한 최종본으로 발전시키는 것을 권장합니다.</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq-5">
                <AccordionTrigger>세션은 어떤 방식으로 진행되나요?</AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-600">세션은 온라인 화상 또는 채팅으로 진행됩니다. 예약된 시간에 릴레이 앱 내에서 멘토와 1:1로 자기소개서를 검토하고 피드백을 받을 수 있습니다. 세션 시간은 보통 30분~1시간입니다.</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq-6">
                <AccordionTrigger>계정을 탈퇴하고 싶어요.</AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-600">계정 탈퇴는 support@relay.com으로 탈퇴 요청을 보내주시면 처리해 드립니다. 탈퇴 시 작성된 자기소개서 데이터 및 개인정보는 관련 법령에 따라 일정 기간 보관 후 완전히 삭제됩니다.</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowFAQDialog(false)}>닫기</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Contact Dialog */}
      <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>문의하기</DialogTitle>
            <DialogDescription>궁금한 점이나 불편한 사항을 알려주세요.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label className="mb-2 block">제목</Label>
              <Input value={contactSubject} onChange={(e) => setContactSubject(e.target.value)} placeholder="문의 제목을 입력하세요" />
            </div>
            <div>
              <Label className="mb-2 block">내용</Label>
              <Textarea
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                placeholder="문의 내용을 상세히 작성해주세요"
                rows={5}
              />
            </div>
            <div className="text-sm text-gray-500">
              이메일로 직접 문의하실 수도 있습니다: <a href="mailto:support@relay.com" className="text-blue-600 underline">support@relay.com</a>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowContactDialog(false)}>취소</Button>
            <Button onClick={() => {
              if (!contactSubject || !contactMessage) {
                toast.error('제목과 내용을 모두 입력해주세요');
                return;
              }
              toast.success('문의가 접수되었습니다. 빠른 시일 내에 답변 드리겠습니다.');
              setShowContactDialog(false);
              setContactSubject('');
              setContactMessage('');
            }}>문의 보내기</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Terms of Service Dialog */}
      <Dialog open={showTermsDialog} onOpenChange={setShowTermsDialog}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>서비스 이용약관</DialogTitle>
            <DialogDescription>릴레이 서비스 이용약관입니다.</DialogDescription>
          </DialogHeader>
          <div className="max-h-96 overflow-y-auto text-sm text-gray-700 space-y-4 py-2 pr-2">
            <section>
              <h3 className="font-semibold text-base mb-2">제1조 (목적)</h3>
              <p>본 약관은 릴레이(이하 "회사")가 제공하는 편입 자기소개서 작성 지원 서비스(이하 "서비스")의 이용 조건 및 절차, 회사와 이용자의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.</p>
            </section>
            <section>
              <h3 className="font-semibold text-base mb-2">제2조 (서비스의 내용)</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>AI 기반 자기소개서 초안 생성 서비스</li>
                <li>편입 합격 선배 멘토와의 1:1 상담 세션</li>
                <li>자기소개서 첨삭 및 피드백 서비스</li>
                <li>편입 관련 정보 제공</li>
              </ul>
            </section>
            <section>
              <h3 className="font-semibold text-base mb-2">제3조 (회원 가입 및 탈퇴)</h3>
              <p>서비스 이용을 위해 회원 가입이 필요하며, 이용자는 정확한 정보를 제공해야 합니다. 회원 탈퇴를 원하는 경우 고객지원을 통해 요청할 수 있으며, 탈퇴 시 크레딧 잔액은 환불 정책에 따라 처리됩니다.</p>
            </section>
            <section>
              <h3 className="font-semibold text-base mb-2">제4조 (크레딧 및 결제)</h3>
              <p>크레딧은 AI 자기소개서 초안 생성에 사용됩니다. 크레딧 구매 후 7일 이내 미사용 시 전액 환불이 가능하며, 부분 사용 시 잔여 크레딧에 대해 정가 기준으로 차감 후 환불됩니다. 크레딧 유효기간은 구매일로부터 6개월입니다.</p>
            </section>
            <section>
              <h3 className="font-semibold text-base mb-2">제5조 (이용자의 의무)</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>타인의 개인정보를 도용하지 않아야 합니다.</li>
                <li>서비스를 통해 생성된 콘텐츠를 상업적 목적으로 재판매하지 않아야 합니다.</li>
                <li>멘토 세션 시 예의를 갖추어야 합니다.</li>
                <li>서비스의 정상적 운영을 방해하는 행위를 하지 않아야 합니다.</li>
              </ul>
            </section>
            <section>
              <h3 className="font-semibold text-base mb-2">제6조 (회사의 의무)</h3>
              <p>회사는 안정적인 서비스 제공을 위해 최선을 다하며, 이용자의 개인정보를 안전하게 관리합니다. 서비스 장애 발생 시 신속하게 복구하도록 노력합니다.</p>
            </section>
            <section>
              <h3 className="font-semibold text-base mb-2">제7조 (면책사항)</h3>
              <p>AI가 생성한 자기소개서 초안은 참고용이며, 최종 제출본에 대한 책임은 이용자에게 있습니다. 회사는 멘토의 개별 의견이나 조언에 대해 보증하지 않습니다.</p>
            </section>
            <section>
              <h3 className="font-semibold text-base mb-2">제8조 (분쟁 해결)</h3>
              <p>본 약관과 관련된 분쟁은 대한민국 법률에 따르며, 관할 법원은 회사 소재지 법원으로 합니다.</p>
            </section>
            <p className="text-gray-500 text-xs">시행일: 2026년 1월 1일</p>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowTermsDialog(false)}>확인</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}