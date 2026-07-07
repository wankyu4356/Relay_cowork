import { useState } from 'react';
import { FadeIn, Stagger, ScrollReveal, Press, CountUp, TextReveal } from './ui/motion';
import { RunnerAvatar } from './ui/runner-avatar';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Calendar } from './ui/calendar';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { ArrowLeft, Calendar as CalendarIcon, Clock, CreditCard, FileText, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import type { Mentor } from '../App';
import * as api from './api';
import { logger } from '../utils/logger';

interface SessionBookingProps {
  onBack: () => void;
  onConfirm: () => void;
  mentor: Mentor;
}

const timeSlots = [
  { time: '09:00', available: true },
  { time: '10:00', available: true },
  { time: '11:00', available: false },
  { time: '13:00', available: true },
  { time: '14:00', available: true },
  { time: '15:00', available: true },
  { time: '16:00', available: false },
  { time: '17:00', available: true },
  { time: '18:00', available: true },
  { time: '19:00', available: true },
  { time: '20:00', available: true },
];

export function SessionBooking({ onBack, onConfirm, mentor }: SessionBookingProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [duration, setDuration] = useState<'30' | '60'>('60');
  const [request, setRequest] = useState('');
  const [shareDocument, setShareDocument] = useState(true);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');

  const getPrice = () => {
    if (duration === '30') return mentor.price * 0.65;
    return mentor.price;
  };

  const handleConfirm = async () => {
    if (!selectedDate || !selectedTime) {
      toast.error('날짜와 시간을 선택해주세요');
      return;
    }
    if (!agreedToTerms) {
      toast.error('환불 정책에 동의해주세요');
      return;
    }

    // Save session to backend
    try {
      await api.bookSession({
        mentorId: mentor.id,
        mentorName: mentor.name,
        mentorAvatar: mentor.avatar,
        date: selectedDate.toISOString().split('T')[0],
        time: selectedTime,
        duration: parseInt(duration),
        price: getPrice(),
        topic: request,
      });
    } catch (e) {
      logger.log('Session booking to server failed:', e);
    }

    toast.success('예약이 완료되었습니다!');
    setTimeout(() => onConfirm(), 1000);
  };

  return (
    <div className="min-h-screen bg-zinc-50 pb-20 md:pb-0">
      <div className="bg-white border-b border-zinc-200/80">
        <div className="container-web py-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl text-zinc-900 font-semibold tracking-tight"><TextReveal text="릴레이 세션 예약" delay={0.05} /></h1>
              <p className="text-zinc-600 mt-1">{mentor.name} 러너</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-web py-8">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr,400px] gap-6">
          {/* Main Content */}
          <div className="space-y-6">
            {/* Mentor Info */}
            <FadeIn>
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <RunnerAvatar name={mentor.name} size="lg" variant="runner" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl text-zinc-900 font-semibold tracking-tight">{mentor.name}</h3>
                      <Badge className={
                        mentor.badge === 'platinum' ? 'bg-gradient-to-r from-zinc-900 to-iris-800 text-white border-0' :
                        mentor.badge === 'gold' ? 'badge-gold border-0' :
                        mentor.badge === 'silver' ? 'badge-silver border-0' : 'badge-bronze border-0'
                      }>
                        {mentor.badge === 'platinum' ? '플래티넘' : mentor.badge === 'gold' ? '골드' : mentor.badge === 'silver' ? '실버' : '브론즈'}
                      </Badge>
                    </div>
                    <p className="text-zinc-600">
                      {mentor.university} {mentor.major} {mentor.year}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-semibold tracking-tight text-iris-600 tnum">
                      <CountUp value={getPrice()} suffix="원" duration={0.5} />
                    </div>
                    <div className="text-sm text-zinc-600 tnum">{duration}분</div>
                  </div>
                </div>
              </Card>
            </FadeIn>

            {/* Date Selection */}
            <ScrollReveal>
            <Card className="p-6">
              <h3 className="text-zinc-900 font-semibold tracking-tight text-lg mb-4 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-iris-600" />
                날짜 선택
              </h3>
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-lg border border-zinc-200/80"
                  disabled={(date: Date) => date < new Date()}
                />
              </div>
            </Card>
            </ScrollReveal>

            {/* Time & Duration */}
            <ScrollReveal>
            <Card className="p-6">
              <h3 className="text-zinc-900 font-semibold tracking-tight text-lg mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-iris-600" />
                시간 및 세션 길이
              </h3>

              <div className="mb-6">
                <Label className="mb-3 block">세션 시간</Label>
                <RadioGroup value={duration} onValueChange={(value: any) => setDuration(value)}>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Press lift={false}>
                    <Card
                      className={`p-4 cursor-pointer transition-all ${
                        duration === '30'
                          ? 'border-2 border-iris-500 bg-iris-50'
                          : 'border-2 border-transparent hover:border-iris-200'
                      }`}
                      onClick={() => setDuration('30')}
                    >
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="30" id="30min" />
                        <label htmlFor="30min" className="cursor-pointer flex-1">
                          <div className="text-zinc-900 font-semibold tracking-tight">30분</div>
                          <div className="text-sm text-zinc-600 tnum">
                            {Math.round(mentor.price * 0.65).toLocaleString()}원
                          </div>
                        </label>
                      </div>
                    </Card>
                    </Press>
                    <Press lift={false}>
                    <Card
                      className={`p-4 cursor-pointer transition-all ${
                        duration === '60'
                          ? 'border-2 border-iris-500 bg-iris-50'
                          : 'border-2 border-transparent hover:border-iris-200'
                      }`}
                      onClick={() => setDuration('60')}
                    >
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="60" id="60min" />
                        <label htmlFor="60min" className="cursor-pointer flex-1">
                          <div className="text-zinc-900 font-semibold tracking-tight">60분 (권장)</div>
                          <div className="text-sm text-zinc-600 tnum">
                            {mentor.price.toLocaleString()}원
                          </div>
                        </label>
                      </div>
                    </Card>
                    </Press>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label className="mb-3 block">시간 선택</Label>
                <Stagger className="grid grid-cols-4 gap-2" stagger={0.03}>
                  {timeSlots.map((slot) => (
                    <Stagger.Item key={slot.time}>
                    <Button
                      variant={selectedTime === slot.time ? 'default' : 'outline'}
                      size="sm"
                      disabled={!slot.available}
                      onClick={() => setSelectedTime(slot.time)}
                      className={`w-full tnum ${selectedTime === slot.time ? 'bg-zinc-900 hover:bg-zinc-800 text-white' : ''}`}
                    >
                      {slot.time}
                    </Button>
                    </Stagger.Item>
                  ))}
                </Stagger>
                <p className="text-xs text-zinc-400 mt-2">
                  * 회색 시간은 이미 예약된 시간입니다
                </p>
              </div>
            </Card>
            </ScrollReveal>

            {/* Request */}
            <ScrollReveal>
            <Card className="p-6">
              <h3 className="text-zinc-900 font-semibold tracking-tight text-lg mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-iris-600" />
                러너에게 전달할 내용
              </h3>

              <div className="space-y-4">
                <div>
                  <Label className="mb-2 block">요청사항 (선택)</Label>
                  <Textarea
                    placeholder="러너에게 미리 알려주고 싶은 내용이 있다면 작성해주세요&#10;예: 학업계획서 초안을 준비했습니다. 전체적인 구조와 표현을 봐주셨으면 좋겠습니다."
                    value={request}
                    onChange={(e) => setRequest(e.target.value)}
                    className="min-h-32"
                  />
                  <p className="text-xs text-zinc-400 mt-2">
                    구체적으로 작성할수록 더 효과적인 릴레이를 진행할 수 있어요
                  </p>
                </div>

                <div className="flex items-start gap-3 p-4 bg-iris-50 border border-iris-100 rounded-xl">
                  <Checkbox
                    id="share"
                    checked={shareDocument}
                    onCheckedChange={(checked: boolean) => setShareDocument(checked as boolean)}
                  />
                  <label htmlFor="share" className="cursor-pointer flex-1 text-sm">
                    <div className="text-zinc-900 font-semibold tracking-tight mb-1">AI 학업계획서 공유하기</div>
                    <div className="text-zinc-600">
                      작성한 AI 초안을 러너와 공유합니다. 릴레이 세션에서 바로 첨삭받을 수 있어요.
                    </div>
                  </label>
                </div>
              </div>
            </Card>
            </ScrollReveal>

            {/* Payment */}
            <ScrollReveal>
            <Card className="p-6">
              <h3 className="text-zinc-900 font-semibold tracking-tight text-lg mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-iris-600" />
                결제 수단
              </h3>

              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="space-y-3">
                  {[
                    { value: 'card', label: '신용/체크카드', desc: '즉시 결제' },
                    { value: 'kakao', label: '카카오페이', desc: '간편 결제' },
                    { value: 'toss', label: '토스페이', desc: '간편 결제' },
                  ].map((method) => (
                    <Press key={method.value} lift={false}>
                    <Card
                      className={`p-4 cursor-pointer transition-all ${
                        paymentMethod === method.value
                          ? 'border-2 border-iris-500 bg-iris-50'
                          : 'border-2 border-transparent hover:border-iris-200'
                      }`}
                      onClick={() => setPaymentMethod(method.value)}
                    >
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value={method.value} id={method.value} />
                        <label htmlFor={method.value} className="cursor-pointer flex-1">
                          <div className="text-zinc-900 font-semibold tracking-tight">{method.label}</div>
                          <div className="text-sm text-zinc-600">{method.desc}</div>
                        </label>
                      </div>
                    </Card>
                    </Press>
                  ))}
                </div>
              </RadioGroup>
            </Card>
            </ScrollReveal>

            {/* Terms */}
            <ScrollReveal>
            <Card className="p-6 bg-amber-50 border-amber-200">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked: boolean) => setAgreedToTerms(checked as boolean)}
                />
                <label htmlFor="terms" className="cursor-pointer flex-1 text-sm">
                  <div className="text-zinc-900 font-semibold tracking-tight mb-2">환불 정책 동의 (필수)</div>
                  <ul className="space-y-1 text-zinc-700">
                    <li>• 세션 24시간 전까지: 100% 환불</li>
                    <li>• 세션 24시간 이내 ~ 2시간 전: 50% 환불</li>
                    <li>• 세션 2시간 이내: 환불 불가</li>
                    <li>• 러너 불참 시: 100% 환불 및 추가 보상</li>
                  </ul>
                </label>
              </div>
            </Card>
            </ScrollReveal>
          </div>

          {/* Summary Sidebar */}
          <FadeIn delay={0.1} className="space-y-4">
            <Card className="p-6 sticky top-24">
              <h3 className="text-zinc-900 font-semibold tracking-tight text-lg mb-4">예약 요약</h3>

              <div className="space-y-3 mb-6 text-sm">
                <div className="flex justify-between pb-3 border-b border-zinc-200/80">
                  <span className="text-zinc-600">날짜</span>
                  <span className="font-medium text-zinc-900 tnum">
                    {selectedDate ? selectedDate.toLocaleDateString('ko-KR') : '-'}
                  </span>
                </div>
                <div className="flex justify-between pb-3 border-b border-zinc-200/80">
                  <span className="text-zinc-600">시간</span>
                  <span className="font-medium text-zinc-900 tnum">
                    {selectedTime || '-'}
                  </span>
                </div>
                <div className="flex justify-between pb-3 border-b border-zinc-200/80">
                  <span className="text-zinc-600">세션 시간</span>
                  <span className="font-medium text-zinc-900 tnum">{duration}분</span>
                </div>
                <div className="flex justify-between pb-3 border-b border-zinc-200/80">
                  <span className="text-zinc-600">러너</span>
                  <span className="font-medium text-zinc-900">{mentor.name}</span>
                </div>
              </div>

              <div className="space-y-2 mb-6 pt-4 border-t border-zinc-200/80">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-600">세션 비용</span>
                  <span className="text-zinc-900 tnum">{getPrice().toLocaleString()}원</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-600">플랫폼 수수료</span>
                  <span className="text-zinc-900 tnum">0원</span>
                </div>
                <div className="flex justify-between text-lg font-semibold tracking-tight pt-3 border-t border-zinc-200/80">
                  <span className="text-zinc-900">총 결제금액</span>
                  <span className="text-iris-600 tnum"><CountUp value={getPrice()} suffix="원" duration={0.5} /></span>
                </div>
              </div>

              <Press className="mb-3">
              <Button
                className="w-full bg-zinc-900 hover:bg-zinc-800 text-white tnum shine"
                size="lg"
                onClick={handleConfirm}
                disabled={!selectedDate || !selectedTime || !agreedToTerms}
              >
                {getPrice().toLocaleString()}원 결제하기
              </Button>
              </Press>

              <Card className="p-4 bg-emerald-50 border-emerald-200">
                <div className="flex gap-2 text-xs text-zinc-700">
                  <AlertCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    세션 비용은 에스크로로 보호됩니다.
                    릴레이 완료 후 러너에게 전달됩니다.
                  </div>
                </div>
              </Card>
            </Card>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}