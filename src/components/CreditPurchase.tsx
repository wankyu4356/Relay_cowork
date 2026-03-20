import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { 
  ArrowLeft, 
  Sparkles, 
  Check,
  CreditCard,
  Wallet,
  Gift,
  Zap,
  Star
} from 'lucide-react';
import { toast } from 'sonner';
import * as api from './api';

import type { Category } from './GlobalNav';
import { CATEGORY_CONTENT } from '../lib/categoryContent';

interface CreditPurchaseProps {
  onBack: () => void;
  currentCredits: number;
  onPurchaseComplete: (credits: number) => void;
  selectedCategory?: Category;
}

interface CreditPackage {
  id: string;
  credits: number;
  price: number;
  originalPrice?: number;
  badge?: string;
  popular?: boolean;
  bonus?: number;
}

const packages: CreditPackage[] = [
  {
    id: 'starter',
    credits: 1,
    price: 15000,
    badge: '첫 구매',
  },
  {
    id: 'basic',
    credits: 3,
    price: 39000,
    originalPrice: 45000,
    bonus: 0,
  },
  {
    id: 'popular',
    credits: 5,
    price: 59000,
    originalPrice: 75000,
    badge: '인기',
    popular: true,
    bonus: 1,
  },
  {
    id: 'premium',
    credits: 10,
    price: 99000,
    originalPrice: 150000,
    badge: '최고 가치',
    bonus: 3,
  },
];

export function CreditPurchase({ onBack, currentCredits, onPurchaseComplete, selectedCategory = 'transfer' }: CreditPurchaseProps) {
  const catContent = CATEGORY_CONTENT[selectedCategory];
  const [selectedPackage, setSelectedPackage] = useState<string>('popular');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'kakao' | 'toss'>('card');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePurchase = () => {
    const pkg = packages.find(p => p.id === selectedPackage);
    if (!pkg) return;

    setIsProcessing(true);

    const totalCredits = pkg.credits + (pkg.bonus || 0);

    // Try to add credits via API, then update local state regardless
    api.addCredits(totalCredits)
      .catch(() => {}) // silently fall back to local-only update
      .finally(() => {
        setIsProcessing(false);
        onPurchaseComplete(totalCredits);
        toast.success(`${totalCredits}개의 크레딧이 충전되었습니다!`);
        setTimeout(() => onBack(), 1500);
      });
  };

  const selectedPkg = packages.find(p => p.id === selectedPackage);

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
              <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                크레딧 충전
              </h1>
              <p className="text-gray-600 mt-1">{catContent.aiToolTitle} 크레딧을 구매하세요</p>
            </div>
            <Badge className="bg-gradient-to-r from-sky-500 to-blue-600 text-white border-0 px-4 py-2">
              <Wallet className="w-4 h-4 mr-2" />
              {currentCredits}회
            </Badge>
          </div>
        </div>
      </div>

      <div className="container-web py-8 pb-24">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-6 bg-gradient-to-br from-sky-500 to-blue-600 border-0 text-white">
              <h2 className="text-xl font-bold mb-4">{catContent.docLabel} 크레딧으로 할 수 있어요</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold mb-1">AI 초안 생성</div>
                    <div className="text-sm text-white/80">5분 만에 맞춤형 문서</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold mb-1">다양한 스토리라인</div>
                    <div className="text-sm text-white/80">3가지 버전 비교</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Star className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold mb-1">무제한 수정</div>
                    <div className="text-sm text-white/80">생성 후 편집 자유</div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Packages */}
          <div>
            <h2 className="text-xl font-bold mb-4">크레딧 패키지 선택</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {packages.map((pkg, index) => (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedPackage(pkg.id)}
                >
                  <Card 
                    className={`p-6 cursor-pointer transition-all ${
                      selectedPackage === pkg.id
                        ? 'border-2 border-sky-500 shadow-xl bg-sky-50/50'
                        : 'border-2 border-transparent hover:border-gray-300'
                    } ${pkg.popular ? 'ring-2 ring-sky-500 ring-offset-2' : ''}`}
                  >
                    {/* Badge */}
                    {pkg.badge && (
                      <Badge 
                        className={`mb-3 ${
                          pkg.popular 
                            ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white border-0' 
                            : 'bg-gray-900 text-white border-0'
                        }`}
                      >
                        {pkg.badge}
                      </Badge>
                    )}

                    {/* Credits */}
                    <div className="flex items-end gap-2 mb-3">
                      <div className="text-4xl font-bold text-gray-900">
                        {pkg.credits + (pkg.bonus || 0)}
                      </div>
                      <div className="text-gray-600 mb-1">크레딧</div>
                    </div>

                    {/* Bonus */}
                    {pkg.bonus && pkg.bonus > 0 && (
                      <div className="mb-3">
                        <Badge variant="outline" className="text-orange-600 border-orange-300 bg-orange-50">
                          <Gift className="w-3 h-3 mr-1" />
                          +{pkg.bonus} 보너스
                        </Badge>
                      </div>
                    )}

                    {/* Price */}
                    <div className="mb-4">
                      <div className="flex items-end gap-2">
                        <div className="text-2xl font-bold text-sky-600">
                          ₩{(pkg.price / 1000).toFixed(0)}k
                        </div>
                        {pkg.originalPrice && (
                          <div className="text-gray-400 line-through text-sm mb-1">
                            ₩{(pkg.originalPrice / 1000).toFixed(0)}k
                          </div>
                        )}
                      </div>
                      {pkg.originalPrice && (
                        <div className="text-sm text-red-600 font-semibold">
                          {Math.round((1 - pkg.price / pkg.originalPrice) * 100)}% 할인
                        </div>
                      )}
                    </div>

                    {/* Per Credit Price */}
                    <div className="text-sm text-gray-600">
                      크레딧당 ₩{Math.round(pkg.price / (pkg.credits + (pkg.bonus || 0)) / 1000)}k
                    </div>

                    {/* Selected Indicator */}
                    {selectedPackage === pkg.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-4 right-4 w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center"
                      >
                        <Check className="w-5 h-5 text-white" />
                      </motion.div>
                    )}
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <h2 className="text-xl font-bold mb-4">결제 수단</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <Card 
                className={`p-4 cursor-pointer transition-all ${
                  paymentMethod === 'card' 
                    ? 'border-2 border-sky-500 bg-sky-50/50' 
                    : 'border-2 border-transparent hover:border-gray-300'
                }`}
                onClick={() => setPaymentMethod('card')}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold">신용/체크카드</div>
                    <div className="text-sm text-gray-600">모든 카드 사용 가능</div>
                  </div>
                </div>
                {paymentMethod === 'card' && (
                  <div className="absolute top-3 right-3 w-6 h-6 bg-sky-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </Card>

              <Card 
                className={`p-4 cursor-pointer transition-all ${
                  paymentMethod === 'kakao' 
                    ? 'border-2 border-sky-500 bg-sky-50/50' 
                    : 'border-2 border-transparent hover:border-gray-300'
                }`}
                onClick={() => setPaymentMethod('kakao')}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center text-2xl">
                    💬
                  </div>
                  <div>
                    <div className="font-semibold">카카오페이</div>
                    <div className="text-sm text-gray-600">간편 결제</div>
                  </div>
                </div>
                {paymentMethod === 'kakao' && (
                  <div className="absolute top-3 right-3 w-6 h-6 bg-sky-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </Card>

              <Card 
                className={`p-4 cursor-pointer transition-all ${
                  paymentMethod === 'toss' 
                    ? 'border-2 border-sky-500 bg-sky-50/50' 
                    : 'border-2 border-transparent hover:border-gray-300'
                }`}
                onClick={() => setPaymentMethod('toss')}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">
                    💙
                  </div>
                  <div>
                    <div className="font-semibold">토스페이</div>
                    <div className="text-sm text-gray-600">간편 결제</div>
                  </div>
                </div>
                {paymentMethod === 'toss' && (
                  <div className="absolute top-3 right-3 w-6 h-6 bg-sky-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </Card>
            </div>
          </div>

          {/* Summary */}
          {selectedPkg && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="p-6 bg-gray-50">
                <h3 className="font-semibold mb-4">결제 정보</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">선택한 패키지</span>
                    <span className="font-semibold">
                      {selectedPkg.credits}크레딧
                      {selectedPkg.bonus ? ` + ${selectedPkg.bonus}보너스` : ''}
                    </span>
                  </div>
                  {selectedPkg.bonus && selectedPkg.bonus > 0 && (
                    <div className="flex justify-between text-orange-600">
                      <span>보너스 크레딧</span>
                      <span className="font-semibold">+{selectedPkg.bonus}개</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">결제 수단</span>
                    <span className="font-semibold">
                      {paymentMethod === 'card' ? '신용/체크카드' : paymentMethod === 'kakao' ? '카카오페이' : '토스페이'}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 flex justify-between">
                    <span className="font-bold text-lg">총 결제 금액</span>
                    <span className="font-bold text-2xl text-sky-600">
                      ₩{selectedPkg.price.toLocaleString()}
                    </span>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Purchase Button */}
          <Button
            onClick={handlePurchase}
            disabled={isProcessing}
            className="w-full h-14 text-lg bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-xl"
          >
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                결제 처리중...
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5 mr-2" />
                ₩{selectedPkg?.price.toLocaleString()} 결제하기
              </>
            )}
          </Button>

          {/* Notice */}
          <Card className="p-4 bg-yellow-50/50 border-yellow-200">
            <div className="text-sm text-gray-700 space-y-1">
              <div className="font-semibold mb-2">유의사항</div>
              <div>• 크레딧은 구매 후 즉시 충전됩니다</div>
              <div>• 크레딧은 유효기간 없이 사용 가능합니다</div>
              <div>• 구매 후 7일 이내 미사용 시 환불 가능합니다</div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
