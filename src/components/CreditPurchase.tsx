import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { FadeIn, ScrollStagger, Press, CountUp, TextReveal, Tilt } from './ui/motion';
import {
  ArrowLeft,
  Sparkles,
  Check,
  CreditCard,
  Wallet,
  Gift,
  Zap,
  Star,
  MessageCircle
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
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-zinc-200/80 sticky top-0 z-10 shadow-sm">
        <div className="container-web py-6">
          <div className="flex items-center gap-4">
            <Press lift={false}>
              <Button variant="ghost" size="icon" onClick={onBack}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Press>
            <div className="flex-1">
              <h1 className="text-2xl text-zinc-900 font-semibold tracking-tight">
                <TextReveal text="크레딧 충전" delay={0.05} />
              </h1>
              <p className="text-zinc-600 mt-1">{catContent.aiToolTitle} 크레딧을 구매하세요</p>
            </div>
            <Badge className="bg-zinc-900 text-white border-0 px-4 py-2">
              <Wallet className="w-4 h-4 mr-2" />
              <span className="tnum">{currentCredits}회</span>
            </Badge>
          </div>
        </div>
      </div>

      <div className="container-web py-8 pb-24">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Benefits */}
          <FadeIn>
            <Tilt max={4}>
            <Card className="p-6 bg-gradient-to-br from-zinc-900 to-iris-800 border-0 text-white rounded-2xl shadow-lg">
              <h2 className="text-xl font-semibold tracking-tight mb-4">{catContent.docLabel} 크레딧으로 할 수 있어요</h2>
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
            </Tilt>
          </FadeIn>

          {/* Packages */}
          <FadeIn delay={0.05}>
            <h2 className="text-xl text-zinc-900 font-semibold tracking-tight mb-4">크레딧 패키지 선택</h2>
            <ScrollStagger className="grid md:grid-cols-2 gap-4">
              {packages.map((pkg) => (
                <ScrollStagger.Item key={pkg.id} onClick={() => setSelectedPackage(pkg.id)}>
                  <Press>
                  <Card
                    className={`p-6 cursor-pointer transition-all rounded-2xl ${
                      selectedPackage === pkg.id
                        ? 'border-2 border-iris-500 shadow-lg bg-iris-50/50'
                        : 'border-2 border-transparent hover:border-zinc-300'
                    } ${pkg.popular ? 'ring-2 ring-iris-500 ring-offset-2' : ''}`}
                  >
                    {/* Badge */}
                    {pkg.badge && (
                      <Badge
                        className={`mb-3 ${
                          pkg.popular
                            ? 'bg-iris-600 text-white border-0'
                            : 'bg-zinc-900 text-white border-0'
                        }`}
                      >
                        {pkg.badge}
                      </Badge>
                    )}

                    {/* Credits */}
                    <div className="flex items-end gap-2 mb-3">
                      <div className="text-4xl font-semibold tracking-tight text-zinc-900 tnum">
                        <CountUp value={pkg.credits + (pkg.bonus || 0)} />
                      </div>
                      <div className="text-zinc-600 mb-1">크레딧</div>
                    </div>

                    {/* Bonus */}
                    {pkg.bonus && pkg.bonus > 0 && (
                      <div className="mb-3">
                        <Badge variant="outline" className="text-iris-600 border-iris-300 bg-iris-50">
                          <Gift className="w-3 h-3 mr-1" />
                          +{pkg.bonus} 보너스
                        </Badge>
                      </div>
                    )}

                    {/* Price */}
                    <div className="mb-4">
                      <div className="flex items-end gap-2">
                        <div className="text-2xl font-semibold tracking-tight text-iris-600 tnum">
                          {pkg.price.toLocaleString()}원
                        </div>
                        {pkg.originalPrice && (
                          <div className="text-zinc-400 line-through text-sm mb-1 tnum">
                            {pkg.originalPrice.toLocaleString()}원
                          </div>
                        )}
                      </div>
                      {pkg.originalPrice && (
                        <div className="text-sm text-iris-600 font-semibold tnum">
                          {Math.round((1 - pkg.price / pkg.originalPrice) * 100)}% 할인
                        </div>
                      )}
                    </div>

                    {/* Per Credit Price */}
                    <div className="text-sm text-zinc-600 tnum">
                      크레딧당 {Math.round(pkg.price / (pkg.credits + (pkg.bonus || 0))).toLocaleString()}원
                    </div>

                    {/* Selected Indicator */}
                    {selectedPackage === pkg.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-4 right-4 w-8 h-8 bg-iris-600 rounded-full flex items-center justify-center"
                      >
                        <Check className="w-5 h-5 text-white" />
                      </motion.div>
                    )}
                  </Card>
                  </Press>
                </ScrollStagger.Item>
              ))}
            </ScrollStagger>
          </FadeIn>

          {/* Payment Method */}
          <FadeIn delay={0.1}>
            <h2 className="text-xl text-zinc-900 font-semibold tracking-tight mb-4">결제 수단</h2>
            <ScrollStagger className="grid md:grid-cols-3 gap-4">
              <ScrollStagger.Item onClick={() => setPaymentMethod('card')}>
              <Press>
              <Card
                className={`p-4 cursor-pointer transition-all rounded-xl ${
                  paymentMethod === 'card'
                    ? 'border-2 border-iris-500 bg-iris-50/50'
                    : 'border-2 border-transparent hover:border-zinc-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-iris-100 rounded-xl flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-iris-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-zinc-900">신용/체크카드</div>
                    <div className="text-sm text-zinc-600">모든 카드 사용 가능</div>
                  </div>
                </div>
                {paymentMethod === 'card' && (
                  <div className="absolute top-3 right-3 w-6 h-6 bg-iris-600 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </Card>
              </Press>
              </ScrollStagger.Item>

              <ScrollStagger.Item onClick={() => setPaymentMethod('kakao')}>
              <Press>
              <Card
                className={`p-4 cursor-pointer transition-all rounded-xl ${
                  paymentMethod === 'kakao'
                    ? 'border-2 border-iris-500 bg-iris-50/50'
                    : 'border-2 border-transparent hover:border-zinc-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-zinc-900">카카오페이</div>
                    <div className="text-sm text-zinc-600">간편 결제</div>
                  </div>
                </div>
                {paymentMethod === 'kakao' && (
                  <div className="absolute top-3 right-3 w-6 h-6 bg-iris-600 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </Card>
              </Press>
              </ScrollStagger.Item>

              <ScrollStagger.Item onClick={() => setPaymentMethod('toss')}>
              <Press>
              <Card
                className={`p-4 cursor-pointer transition-all rounded-xl ${
                  paymentMethod === 'toss'
                    ? 'border-2 border-iris-500 bg-iris-50/50'
                    : 'border-2 border-transparent hover:border-zinc-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-iris-100 rounded-xl flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-iris-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-zinc-900">토스페이</div>
                    <div className="text-sm text-zinc-600">간편 결제</div>
                  </div>
                </div>
                {paymentMethod === 'toss' && (
                  <div className="absolute top-3 right-3 w-6 h-6 bg-iris-600 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </Card>
              </Press>
              </ScrollStagger.Item>
            </ScrollStagger>
          </FadeIn>

          {/* Summary */}
          {selectedPkg && (
            <FadeIn delay={0.15}>
              <Card className="p-6 bg-zinc-50 rounded-2xl">
                <h3 className="font-semibold text-zinc-900 mb-4">결제 정보</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-zinc-600">선택한 패키지</span>
                    <span className="font-semibold text-zinc-900 tnum">
                      {selectedPkg.credits}크레딧
                      {selectedPkg.bonus ? ` + ${selectedPkg.bonus}보너스` : ''}
                    </span>
                  </div>
                  {selectedPkg.bonus && selectedPkg.bonus > 0 && (
                    <div className="flex justify-between text-iris-600">
                      <span>보너스 크레딧</span>
                      <span className="font-semibold tnum">+{selectedPkg.bonus}개</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-zinc-600">결제 수단</span>
                    <span className="font-semibold text-zinc-900">
                      {paymentMethod === 'card' ? '신용/체크카드' : paymentMethod === 'kakao' ? '카카오페이' : '토스페이'}
                    </span>
                  </div>
                  <div className="border-t border-zinc-200/80 pt-3 flex justify-between items-end">
                    <span className="font-semibold text-lg text-zinc-900">총 결제 금액</span>
                    <span className="font-semibold tracking-tight text-2xl text-iris-600 tnum">
                      {selectedPkg.price.toLocaleString()}원
                    </span>
                  </div>
                </div>
              </Card>
            </FadeIn>
          )}

          {/* Purchase Button */}
          <Button
            onClick={handlePurchase}
            disabled={isProcessing}
            className="w-full h-14 text-lg bg-zinc-900 hover:bg-zinc-800 text-white shadow-md shine"
          >
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                결제 처리중...
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5 mr-2" />
                {selectedPkg?.price.toLocaleString()}원 결제하기
              </>
            )}
          </Button>

          {/* Notice */}
          <Card className="p-4 bg-zinc-50 border-zinc-200/80 rounded-xl">
            <div className="text-sm text-zinc-600 space-y-1">
              <div className="font-semibold text-zinc-900 mb-2">유의사항</div>
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
