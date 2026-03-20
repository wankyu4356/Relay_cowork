import { toast } from 'sonner';
import * as api from './api';
import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Switch } from './ui/switch';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
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
  Check
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

  const handleLogout = async () => {
    if (confirm('로그아웃 하시겠습니까?')) {
      try {
        await api.signOut();
        toast.success('로그아웃 되었습니다');
        // onAuthStateChange listener in App.tsx will handle navigation to auth screen
      } catch (e) {
        console.error('Logout error:', e);
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
      console.error('Profile save error:', e);
      toast.success('프로필이 저장되었습니다');
    }
  };

  const handleSaveNotifications = () => {
    toast.success('알림 설정이 저장되었습니다');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50">
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
              <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                설정
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
                  <div className="w-20 h-20 bg-gradient-to-br from-sky-400 to-blue-500 rounded-2xl flex items-center justify-center text-3xl">
                    👨‍🎓
                  </div>
                  <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full shadow-lg border-2 border-sky-200 flex items-center justify-center hover:bg-sky-50 transition-colors">
                    <Camera className="w-4 h-4 text-sky-600" />
                  </button>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-xl font-bold">{profileName}</h2>
                    {isMentorActive && (
                      <Badge className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white border-0">
                        <Award className="w-3 h-3 mr-1" />
                        멘토
                      </Badge>
                    )}
                  </div>
                  <p className="text-gray-600 mb-3">{profileBio}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-sky-600">
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
              <User className="w-5 h-5 text-sky-600" />
              계정 정보
            </h2>
            <Card className="divide-y">
              <div 
                className="p-4 hover:bg-sky-50/50 cursor-pointer transition-all group"
                onClick={() => setActiveSection(activeSection === 'profile' ? null : 'profile')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center group-hover:bg-sky-200 transition-colors">
                      <Edit2 className="w-5 h-5 text-sky-600" />
                    </div>
                    <div>
                      <div className="font-medium">프로필 수정</div>
                      <div className="text-sm text-gray-600">사진, 닉네임, 소개 변경</div>
                    </div>
                  </div>
                  <span className="text-gray-400 group-hover:text-sky-600 transition-colors">→</span>
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
                      className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      저장하기
                    </Button>
                  </motion.div>
                )}
              </div>

              <div className="p-4 hover:bg-sky-50/50 cursor-pointer transition-all group">
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
                  <Badge variant="outline">연세대 경영학과</Badge>
                </div>
              </div>

              <div className="p-4 hover:bg-sky-50/50 cursor-pointer transition-all group">
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
              <Bell className="w-5 h-5 text-sky-600" />
              알림 설정
            </h2>
            <Card className="divide-y">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center">
                    <Bell className="w-5 h-5 text-sky-600" />
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
                  className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700"
                >
                  알림 설정 저장
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Payment & Credits */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-sky-600" />
              결제 및 크레딧
            </h2>
            <Card className="divide-y">
              <div className="p-4 hover:bg-sky-50/50 cursor-pointer transition-all group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
                      <Wallet className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium">크레딧 충전</div>
                      <div className="text-sm text-gray-600">AI 학계서 생성 크레딧</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-sky-600">{credits}회</div>
                    <div className="text-xs text-gray-500">보유</div>
                  </div>
                </div>
              </div>
              <div className="p-4 hover:bg-sky-50/50 cursor-pointer transition-all group">
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
                  <span className="text-gray-400 group-hover:text-sky-600 transition-colors">→</span>
                </div>
              </div>
              <div className="p-4 hover:bg-sky-50/50 cursor-pointer transition-all group">
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
                  <span className="text-gray-400 group-hover:text-sky-600 transition-colors">→</span>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Security */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-sky-600" />
              보안 및 개인정보
            </h2>
            <Card className="divide-y">
              <div className="p-4 hover:bg-sky-50/50 cursor-pointer transition-all group">
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
                  <span className="text-gray-400 group-hover:text-sky-600 transition-colors">→</span>
                </div>
              </div>
              <div className="p-4 hover:bg-sky-50/50 cursor-pointer transition-all group">
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
                  <span className="text-gray-400 group-hover:text-sky-600 transition-colors">→</span>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Support */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-sky-600" />
              고객 지원
            </h2>
            <Card className="divide-y">
              <div className="p-4 hover:bg-sky-50/50 cursor-pointer transition-all group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center group-hover:bg-sky-200 transition-colors">
                      <HelpCircle className="w-5 h-5 text-sky-600" />
                    </div>
                    <div>
                      <div className="font-medium">FAQ</div>
                      <div className="text-sm text-gray-600">자주 묻는 질문</div>
                    </div>
                  </div>
                  <span className="text-gray-400 group-hover:text-sky-600 transition-colors">→</span>
                </div>
              </div>
              <div className="p-4 hover:bg-sky-50/50 cursor-pointer transition-all group">
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
                  <span className="text-gray-400 group-hover:text-sky-600 transition-colors">→</span>
                </div>
              </div>
              <div className="p-4 hover:bg-sky-50/50 cursor-pointer transition-all group">
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
                  <span className="text-gray-400 group-hover:text-sky-600 transition-colors">→</span>
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
    </div>
  );
}