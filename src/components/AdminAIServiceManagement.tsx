import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  ArrowLeft,
  Sparkles,
  DollarSign,
  Zap,
  TrendingUp,
  Settings,
  Save,
  Package,
  Gift,
  Percent,
  Users,
  BarChart3,
  AlertCircle,
  CheckCircle2,
  Clock,
  Edit3,
  Cpu,
  FileText,
  Shield,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface AdminAIServiceManagementProps {
  onBack: () => void;
}

interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  originalPrice?: number;
  discount?: number;
  popular: boolean;
  active: boolean;
  description: string;
}

interface PromotionConfig {
  id: string;
  name: string;
  type: 'signup_bonus' | 'referral' | 'event' | 'seasonal';
  credits: number;
  active: boolean;
  startDate: string;
  endDate: string;
  usage: number;
  maxUsage: number;
}

interface AIModelConfig {
  id: string;
  name: string;
  version: string;
  creditCost: number;
  active: boolean;
  description: string;
  avgResponseTime: string;
  successRate: number;
}

const usageChartData = [
  { date: '1/1', usage: 423, revenue: 2150000 },
  { date: '1/8', usage: 512, revenue: 2680000 },
  { date: '1/15', usage: 578, revenue: 3020000 },
  { date: '1/22', usage: 645, revenue: 3450000 },
  { date: '1/29', usage: 701, revenue: 3780000 },
  { date: '2/1', usage: 756, revenue: 4120000 },
  { date: '2/5', usage: 847, revenue: 4590000 },
];

const usageByTypeData = [
  { name: '학업계획서 초안', value: 45, color: '#0EA5E9' },
  { name: '학업계획서 첨삭', value: 30, color: '#38BDF8' },
  { name: '자기소개서', value: 15, color: '#7DD3FC' },
  { name: '면접 준비', value: 10, color: '#BAE6FD' },
];

const hourlyUsageData = [
  { hour: '0시', count: 12 },
  { hour: '3시', count: 5 },
  { hour: '6시', count: 8 },
  { hour: '9시', count: 45 },
  { hour: '12시', count: 67 },
  { hour: '15시', count: 89 },
  { hour: '18시', count: 112 },
  { hour: '21시', count: 95 },
  { hour: '24시', count: 43 },
];

export function AdminAIServiceManagement({ onBack }: AdminAIServiceManagementProps) {
  const [activeTab, setActiveTab] = useState('pricing');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Credit Packages
  const [creditPackages, setCreditPackages] = useState<CreditPackage[]>([
    {
      id: '1',
      name: '체험팩',
      credits: 1,
      price: 3900,
      popular: false,
      active: true,
      description: 'AI 학업계획서 1회 체험',
    },
    {
      id: '2',
      name: '기본팩',
      credits: 3,
      price: 9900,
      originalPrice: 11700,
      discount: 15,
      popular: false,
      active: true,
      description: '가벼운 시작을 위한 기본 패키지',
    },
    {
      id: '3',
      name: '인기팩',
      credits: 5,
      price: 14900,
      originalPrice: 19500,
      discount: 24,
      popular: true,
      active: true,
      description: '가장 많이 선택하는 인기 패키지',
    },
    {
      id: '4',
      name: '프리미엄팩',
      credits: 10,
      price: 24900,
      originalPrice: 39000,
      discount: 36,
      popular: false,
      active: true,
      description: '본격적인 편입 준비를 위한 패키지',
    },
    {
      id: '5',
      name: '무제한팩',
      credits: 30,
      price: 59900,
      originalPrice: 117000,
      discount: 49,
      popular: false,
      active: true,
      description: '30일간 최대 30회 이용 가능',
    },
  ]);

  // Promotions
  const [promotions, setPromotions] = useState<PromotionConfig[]>([
    {
      id: '1',
      name: '신규 가입 보너스',
      type: 'signup_bonus',
      credits: 3,
      active: true,
      startDate: '2026.01.01',
      endDate: '2026.12.31',
      usage: 1847,
      maxUsage: 0,
    },
    {
      id: '2',
      name: '친구 초대 보너스',
      type: 'referral',
      credits: 2,
      active: true,
      startDate: '2026.01.01',
      endDate: '2026.12.31',
      usage: 523,
      maxUsage: 0,
    },
    {
      id: '3',
      name: '2월 편입 시즌 이벤트',
      type: 'seasonal',
      credits: 5,
      active: true,
      startDate: '2026.02.01',
      endDate: '2026.02.28',
      usage: 312,
      maxUsage: 1000,
    },
    {
      id: '4',
      name: '설날 특별 이벤트',
      type: 'event',
      credits: 3,
      active: false,
      startDate: '2026.01.25',
      endDate: '2026.01.31',
      usage: 189,
      maxUsage: 500,
    },
  ]);

  // AI Model configs
  const [aiModels, setAIModels] = useState<AIModelConfig[]>([
    {
      id: '1',
      name: '학업계획서 생성 AI',
      version: 'v2.4.1',
      creditCost: 1,
      active: true,
      description: '편입 학업계획서 초안을 생성하는 핵심 AI 모델',
      avgResponseTime: '12초',
      successRate: 98.7,
    },
    {
      id: '2',
      name: '스토리라인 추천 AI',
      version: 'v1.8.0',
      creditCost: 0,
      active: true,
      description: '사용자 정보 기반 최적 스토리라인 추천 (무료)',
      avgResponseTime: '3초',
      successRate: 99.2,
    },
    {
      id: '3',
      name: '첨삭 AI',
      version: 'v2.1.3',
      creditCost: 1,
      active: true,
      description: '작성된 학업계획서 교정 및 개선 제안',
      avgResponseTime: '18초',
      successRate: 97.5,
    },
    {
      id: '4',
      name: '면접 시뮬레이션 AI',
      version: 'v1.2.0',
      creditCost: 2,
      active: false,
      description: '편입 면접 예상 질문 및 모의 면접 (베타)',
      avgResponseTime: '8초',
      successRate: 94.3,
    },
  ]);

  // General settings
  const [generalSettings, setGeneralSettings] = useState({
    maxFreeCredits: 3,
    creditExpireDays: 365,
    dailyUsageLimit: 10,
    concurrentRequestLimit: 3,
    maintenanceMode: false,
    autoRefundOnFailure: true,
    minCreditAlert: 1,
  });

  const handlePackageChange = (id: string, field: string, value: number | boolean | string) => {
    setCreditPackages(prev =>
      prev.map(p => (p.id === id ? { ...p, [field]: value } : p))
    );
    setHasUnsavedChanges(true);
  };

  const handlePromotionToggle = (id: string) => {
    setPromotions(prev =>
      prev.map(p => (p.id === id ? { ...p, active: !p.active } : p))
    );
    setHasUnsavedChanges(true);
  };

  const handleModelToggle = (id: string) => {
    setAIModels(prev =>
      prev.map(m => (m.id === id ? { ...m, active: !m.active } : m))
    );
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    setHasUnsavedChanges(false);
    toast.success('설정이 저장되었습니다');
  };

  // Stats
  const totalRevenue = 4590000;
  const totalUsage = 847;
  const avgRevenuePerUser = Math.round(totalRevenue / totalUsage);
  const activeModels = aiModels.filter(m => m.active).length;

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
            <div className="flex-1">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                AI 서비스 관리
              </h1>
              <p className="text-gray-600 mt-1">크레딧 가격, 프로모션, AI 모델을 설정합니다</p>
            </div>
            {hasUnsavedChanges && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                <Button
                  className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white"
                  onClick={handleSave}
                >
                  <Save className="w-4 h-4 mr-2" />
                  변경사항 저장
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <div className="container-web py-8">
        <div className="space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">월간 AI 이용</div>
                    <div className="text-xl font-bold">{totalUsage}건</div>
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-2 text-xs">
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  <span className="text-green-600 font-medium">+23%</span>
                  <span className="text-gray-500">전월 대비</span>
                </div>
              </Card>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">크레딧 매출</div>
                    <div className="text-xl font-bold">{(totalRevenue / 10000).toFixed(0)}만원</div>
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-2 text-xs">
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  <span className="text-green-600 font-medium">+18%</span>
                  <span className="text-gray-500">전월 대비</span>
                </div>
              </Card>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-sky-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">건당 평균 매출</div>
                    <div className="text-xl font-bold">{avgRevenuePerUser.toLocaleString()}원</div>
                  </div>
                </div>
              </Card>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Cpu className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">활성 AI 모델</div>
                    <div className="text-xl font-bold">{activeModels}개</div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="pricing">
                <Package className="w-4 h-4 mr-1.5" />
                크레딧 가격
              </TabsTrigger>
              <TabsTrigger value="promotions">
                <Gift className="w-4 h-4 mr-1.5" />
                프로모션
              </TabsTrigger>
              <TabsTrigger value="models">
                <Cpu className="w-4 h-4 mr-1.5" />
                AI 모델
              </TabsTrigger>
              <TabsTrigger value="analytics">
                <BarChart3 className="w-4 h-4 mr-1.5" />
                분석
              </TabsTrigger>
            </TabsList>

            {/* Credit Pricing Tab */}
            <TabsContent value="pricing" className="mt-6 space-y-6">
              {/* General Settings */}
              <Card className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-gray-600" />
                  일반 설정
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="text-sm text-gray-600 mb-1.5 block">신규 가입 무료 크레딧</label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={generalSettings.maxFreeCredits}
                        onChange={(e) => {
                          setGeneralSettings(prev => ({ ...prev, maxFreeCredits: parseInt(e.target.value) || 0 }));
                          setHasUnsavedChanges(true);
                        }}
                        className="w-24"
                      />
                      <span className="text-sm text-gray-500">크레딧</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 mb-1.5 block">크레딧 만료 기간</label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={generalSettings.creditExpireDays}
                        onChange={(e) => {
                          setGeneralSettings(prev => ({ ...prev, creditExpireDays: parseInt(e.target.value) || 0 }));
                          setHasUnsavedChanges(true);
                        }}
                        className="w-24"
                      />
                      <span className="text-sm text-gray-500">일</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 mb-1.5 block">일일 사용 제한</label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={generalSettings.dailyUsageLimit}
                        onChange={(e) => {
                          setGeneralSettings(prev => ({ ...prev, dailyUsageLimit: parseInt(e.target.value) || 0 }));
                          setHasUnsavedChanges(true);
                        }}
                        className="w-24"
                      />
                      <span className="text-sm text-gray-500">회/일</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 mb-1.5 block">동시 요청 제한</label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={generalSettings.concurrentRequestLimit}
                        onChange={(e) => {
                          setGeneralSettings(prev => ({ ...prev, concurrentRequestLimit: parseInt(e.target.value) || 0 }));
                          setHasUnsavedChanges(true);
                        }}
                        className="w-24"
                      />
                      <span className="text-sm text-gray-500">건</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-600">실패 시 자동 환불</div>
                      <div className="text-xs text-gray-400 mt-0.5">AI 응답 실패 시 크레딧 자동 환불</div>
                    </div>
                    <Switch
                      checked={generalSettings.autoRefundOnFailure}
                      onCheckedChange={(checked) => {
                        setGeneralSettings(prev => ({ ...prev, autoRefundOnFailure: checked }));
                        setHasUnsavedChanges(true);
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-600">점검 모드</div>
                      <div className="text-xs text-gray-400 mt-0.5">AI 서비스 일시 중단</div>
                    </div>
                    <Switch
                      checked={generalSettings.maintenanceMode}
                      onCheckedChange={(checked) => {
                        setGeneralSettings(prev => ({ ...prev, maintenanceMode: checked }));
                        setHasUnsavedChanges(true);
                      }}
                    />
                  </div>
                </div>
              </Card>

              {/* Package Cards */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-gray-600" />
                  크레딧 패키지 ({creditPackages.length}개)
                </h3>
                <div className="space-y-4">
                  {creditPackages.map((pkg, idx) => (
                    <motion.div
                      key={pkg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <Card className={`p-5 ${pkg.popular ? 'border-sky-300 bg-sky-50/30 ring-1 ring-sky-200' : ''} ${!pkg.active ? 'opacity-60' : ''}`}>
                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                          <div className="flex items-center gap-3 md:w-48">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              pkg.popular
                                ? 'bg-gradient-to-br from-sky-500 to-blue-600'
                                : 'bg-gray-100'
                            }`}>
                              <Zap className={`w-5 h-5 ${pkg.popular ? 'text-white' : 'text-gray-600'}`} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">{pkg.name}</span>
                                {pkg.popular && <Badge className="bg-sky-500 text-white border-0 text-xs">인기</Badge>}
                              </div>
                              <div className="text-xs text-gray-500">{pkg.description}</div>
                            </div>
                          </div>

                          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div>
                              <label className="text-xs text-gray-500 block mb-1">크레딧 수</label>
                              <Input
                                type="number"
                                value={pkg.credits}
                                onChange={(e) => handlePackageChange(pkg.id, 'credits', parseInt(e.target.value) || 0)}
                                className="h-9"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-gray-500 block mb-1">판매가 (원)</label>
                              <Input
                                type="number"
                                value={pkg.price}
                                onChange={(e) => handlePackageChange(pkg.id, 'price', parseInt(e.target.value) || 0)}
                                className="h-9"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-gray-500 block mb-1">정가 (원)</label>
                              <Input
                                type="number"
                                value={pkg.originalPrice || ''}
                                onChange={(e) => handlePackageChange(pkg.id, 'originalPrice', parseInt(e.target.value) || 0)}
                                placeholder="할인 전"
                                className="h-9"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-gray-500 block mb-1">건당 단가</label>
                              <div className="h-9 flex items-center text-sm font-medium text-sky-600">
                                {Math.round(pkg.price / pkg.credits).toLocaleString()}원/건
                                {pkg.discount && (
                                  <Badge className="ml-1.5 bg-red-100 text-red-600 border-0 text-xs">
                                    -{pkg.discount}%
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 md:w-32 justify-end">
                            <Switch
                              checked={pkg.active}
                              onCheckedChange={(checked) => handlePackageChange(pkg.id, 'active', checked)}
                            />
                            <span className="text-xs text-gray-500 w-8">
                              {pkg.active ? '활성' : '비활성'}
                            </span>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Promotions Tab */}
            <TabsContent value="promotions" className="mt-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Gift className="w-5 h-5 text-gray-600" />
                  프로모션 관리
                </h3>
                <Button
                  className="bg-gradient-to-r from-sky-500 to-blue-600 text-white"
                  onClick={() => toast.info('프로모션 생성 기능 준비 중입니다')}
                >
                  <Gift className="w-4 h-4 mr-2" />
                  새 프로모션
                </Button>
              </div>

              <div className="space-y-4">
                {promotions.map((promo, idx) => {
                  const typeLabel: Record<string, { label: string; color: string; icon: typeof Gift }> = {
                    signup_bonus: { label: '가입 보너스', color: 'bg-green-100 text-green-700', icon: Users },
                    referral: { label: '추천 보너스', color: 'bg-blue-100 text-blue-700', icon: Users },
                    event: { label: '이벤트', color: 'bg-purple-100 text-purple-700', icon: Sparkles },
                    seasonal: { label: '시즌 이벤트', color: 'bg-orange-100 text-orange-700', icon: Gift },
                  };
                  const cfg = typeLabel[promo.type];
                  const PromoIcon = cfg.icon;
                  const usagePercent = promo.maxUsage > 0 ? Math.round((promo.usage / promo.maxUsage) * 100) : null;

                  return (
                    <motion.div
                      key={promo.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <Card className={`p-5 ${!promo.active ? 'opacity-60' : ''}`}>
                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="w-10 h-10 bg-gradient-to-br from-sky-100 to-blue-100 rounded-lg flex items-center justify-center">
                              <PromoIcon className="w-5 h-5 text-sky-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-semibold">{promo.name}</span>
                                <Badge variant="outline" className={`${cfg.color} border-0 text-xs`}>
                                  {cfg.label}
                                </Badge>
                                {promo.active ? (
                                  <Badge className="bg-green-100 text-green-700 border-0 text-xs">활성</Badge>
                                ) : (
                                  <Badge className="bg-gray-100 text-gray-500 border-0 text-xs">비활성</Badge>
                                )}
                              </div>
                              <div className="text-sm text-gray-500 mt-1">
                                {promo.startDate} ~ {promo.endDate} · 보너스: {promo.credits}크레딧
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-6">
                            <div className="text-center">
                              <div className="text-xs text-gray-500">사용 현황</div>
                              <div className="font-semibold">
                                {promo.usage.toLocaleString()}
                                {promo.maxUsage > 0 && (
                                  <span className="text-gray-400 font-normal">/{promo.maxUsage.toLocaleString()}</span>
                                )}
                              </div>
                              {usagePercent !== null && (
                                <div className="w-24 h-1.5 bg-gray-200 rounded-full mt-1">
                                  <div
                                    className={`h-full rounded-full ${
                                      usagePercent > 80 ? 'bg-red-500' : usagePercent > 50 ? 'bg-yellow-500' : 'bg-green-500'
                                    }`}
                                    style={{ width: `${Math.min(usagePercent, 100)}%` }}
                                  />
                                </div>
                              )}
                            </div>
                            <Switch
                              checked={promo.active}
                              onCheckedChange={() => handlePromotionToggle(promo.id)}
                            />
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </TabsContent>

            {/* AI Models Tab */}
            <TabsContent value="models" className="mt-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-gray-600" />
                  AI 모델 설정
                </h3>
                {generalSettings.maintenanceMode && (
                  <Badge className="bg-red-500 text-white border-0 px-3 py-1">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    점검 모드 활성화됨
                  </Badge>
                )}
              </div>

              <div className="space-y-4">
                {aiModels.map((model, idx) => (
                  <motion.div
                    key={model.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Card className={`p-5 ${!model.active ? 'opacity-60 bg-gray-50' : ''}`}>
                      <div className="flex flex-col md:flex-row md:items-start gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            model.active ? 'bg-gradient-to-br from-purple-500 to-blue-500' : 'bg-gray-200'
                          }`}>
                            <Cpu className={`w-5 h-5 ${model.active ? 'text-white' : 'text-gray-500'}`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-semibold">{model.name}</span>
                              <Badge variant="outline" className="text-xs font-mono">{model.version}</Badge>
                              {model.active ? (
                                <Badge className="bg-green-100 text-green-700 border-0 text-xs">
                                  <CheckCircle2 className="w-3 h-3 mr-0.5" /> 운영 중
                                </Badge>
                              ) : (
                                <Badge className="bg-gray-100 text-gray-500 border-0 text-xs">비활성</Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-500 mt-1">{model.description}</p>

                            <div className="flex items-center gap-4 mt-3 flex-wrap">
                              <div className="flex items-center gap-1.5 text-sm">
                                <Zap className="w-3.5 h-3.5 text-sky-500" />
                                <span className="text-gray-600">
                                  {model.creditCost === 0 ? '무료' : `${model.creditCost}크레딧/회`}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 text-sm">
                                <Clock className="w-3.5 h-3.5 text-gray-400" />
                                <span className="text-gray-600">평균 {model.avgResponseTime}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-sm">
                                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                                <span className="text-gray-600">성공률 {model.successRate}%</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <label className="text-xs text-gray-500">크레딧</label>
                            <Input
                              type="number"
                              value={model.creditCost}
                              onChange={(e) => {
                                setAIModels(prev =>
                                  prev.map(m =>
                                    m.id === model.id
                                      ? { ...m, creditCost: parseInt(e.target.value) || 0 }
                                      : m
                                  )
                                );
                                setHasUnsavedChanges(true);
                              }}
                              className="w-16 h-9"
                            />
                          </div>
                          <Switch
                            checked={model.active}
                            onCheckedChange={() => handleModelToggle(model.id)}
                          />
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* System Status */}
              <Card className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-gray-600" />
                  시스템 상태
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-sm text-gray-600">API 서버</span>
                    </div>
                    <div className="text-lg font-semibold text-green-600">정상</div>
                    <div className="text-xs text-gray-500 mt-1">응답 시간: 45ms</div>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-sm text-gray-600">AI 엔진</span>
                    </div>
                    <div className="text-lg font-semibold text-green-600">정상</div>
                    <div className="text-xs text-gray-500 mt-1">GPU 사용률: 67%</div>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-sm text-gray-600">크레딧 시스템</span>
                    </div>
                    <div className="text-lg font-semibold text-green-600">정상</div>
                    <div className="text-xs text-gray-500 mt-1">대기 큐: 3건</div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="mt-6 space-y-6">
              {/* Usage Trend */}
              <Card className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-gray-600" />
                  AI 이용 및 매출 추이
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={usageChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" tickFormatter={(v) => `${(v / 10000).toFixed(0)}만`} />
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb' }}
                      formatter={(value: number, name: string) => {
                        if (name === '매출') return [`${(value / 10000).toFixed(0)}만원`, name];
                        return [`${value}건`, name];
                      }}
                    />
                    <Line yAxisId="left" type="monotone" dataKey="usage" stroke="#8B5CF6" strokeWidth={2} name="이용건수" dot={{ fill: '#8B5CF6' }} />
                    <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} name="매출" dot={{ fill: '#10B981' }} />
                  </LineChart>
                </ResponsiveContainer>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Usage By Type */}
                <Card className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-gray-600" />
                    서비스별 이용 비중
                  </h3>
                  <div className="flex items-center gap-6">
                    <ResponsiveContainer width="50%" height={200}>
                      <PieChart>
                        <Pie
                          data={usageByTypeData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {usageByTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex-1 space-y-3">
                      {usageByTypeData.map((item) => (
                        <div key={item.name} className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-sm text-gray-700 flex-1">{item.name}</span>
                          <span className="text-sm font-medium">{item.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>

                {/* Hourly Usage */}
                <Card className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-600" />
                    시간대별 이용 현황
                  </h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={hourlyUsageData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="hour" tick={{ fontSize: 11 }} />
                      <YAxis />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb' }} />
                      <Bar dataKey="count" fill="#0EA5E9" radius={[4, 4, 0, 0]} name="이용 건수" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </div>

              {/* Key Metrics */}
              <Card className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-gray-600" />
                  핵심 지표
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-purple-50 rounded-xl p-4">
                    <div className="text-sm text-purple-600 mb-1">AI → 멘토 전환율</div>
                    <div className="text-2xl font-bold text-purple-700">36.8%</div>
                    <div className="text-xs text-purple-500 mt-1">AI 이용 → 멘토 프로필 클릭</div>
                  </div>
                  <div className="bg-sky-50 rounded-xl p-4">
                    <div className="text-sm text-sky-600 mb-1">세션 전환율</div>
                    <div className="text-2xl font-bold text-sky-700">62.5%</div>
                    <div className="text-xs text-sky-500 mt-1">프로필 클릭 → 세션 예약</div>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4">
                    <div className="text-sm text-green-600 mb-1">결제 전환율</div>
                    <div className="text-2xl font-bold text-green-700">81.0%</div>
                    <div className="text-xs text-green-500 mt-1">세션 예약 → 결제 완료</div>
                  </div>
                  <div className="bg-orange-50 rounded-xl p-4">
                    <div className="text-sm text-orange-600 mb-1">전체 퍼널 전환율</div>
                    <div className="text-2xl font-bold text-orange-700">18.7%</div>
                    <div className="text-xs text-orange-500 mt-1">AI 이용 → 결제 완료</div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
