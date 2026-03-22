import { useState } from 'react';
import { motion } from 'motion/react';
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

    toast.success('예약이 완료되었습니다! 🎉');
    setTimeout(() => onConfirm(), 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 pb-20 md:pb-0">
      <div className="bg-white border-b border-gray-200">
        <div className="container-web py-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">릴레이 세션 예약</h1>
              <p className="text-gray-600 mt-1">{mentor.name} 러너</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-web py-8">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr,400px] gap-6">
          {/* Main Content */}
          <div className="space-y-6">
            {/* Mentor Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-2xl flex items-center justify-center text-3xl">
                    {mentor.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-bold">{mentor.name}</h3>
                      <Badge className={mentor.badge === 'gold' ? 'badge-gold border-0' : ''}>
                        🥇 GOLD
                      </Badge>
                    </div>
                    <p className="text-gray-600">
                      {mentor.university} {mentor.major} {mentor.year}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-indigo-600">
                      ₩{(getPrice() / 1000).toFixed(0)}k
                    </div>
                    <div className="text-sm text-gray-600">{duration}분</div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Date Selection */}
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-indigo-600" />
                날짜 선택
              </h3>
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-lg border"
                  disabled={(date: Date) => date < new Date()}
                />
              </div>
            </Card>

            {/* Time & Duration */}
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-600" />
                시간 및 세션 길이
              </h3>

              <div className="mb-6">
                <Label className="mb-3 block">세션 시간</Label>
                <RadioGroup value={duration} onValueChange={(value: any) => setDuration(value)}>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card 
                      className={`p-4 cursor-pointer transition-all ${
                        duration === '30' 
                          ? 'border-2 border-indigo-500 bg-indigo-50' 
                          : 'border-2 border-transparent hover:border-indigo-200'
                      }`}
                      onClick={() => setDuration('30')}
                    >
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="30" id="30min" />
                        <label htmlFor="30min" className="cursor-pointer flex-1">
                          <div className="font-semibold">30분</div>
                          <div className="text-sm text-gray-600">
                            ₩{((mentor.price * 0.65) / 1000).toFixed(0)}k
                          </div>
                        </label>
                      </div>
                    </Card>
                    <Card 
                      className={`p-4 cursor-pointer transition-all ${
                        duration === '60' 
                          ? 'border-2 border-indigo-500 bg-indigo-50' 
                          : 'border-2 border-transparent hover:border-indigo-200'
                      }`}
                      onClick={() => setDuration('60')}
                    >
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="60" id="60min" />
                        <label htmlFor="60min" className="cursor-pointer flex-1">
                          <div className="font-semibold">60분 (권장)</div>
                          <div className="text-sm text-gray-600">
                            ₩{(mentor.price / 1000).toFixed(0)}k
                          </div>
                        </label>
                      </div>
                    </Card>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label className="mb-3 block">시간 선택</Label>
                <div className="grid grid-cols-4 gap-2">
                  {timeSlots.map((slot) => (
                    <Button
                      key={slot.time}
                      variant={selectedTime === slot.time ? 'default' : 'outline'}
                      size="sm"
                      disabled={!slot.available}
                      onClick={() => setSelectedTime(slot.time)}
                      className={selectedTime === slot.time ? 'bg-indigo-500 hover:bg-indigo-600' : ''}
                    >
                      {slot.time}
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  * 회색 시간은 이미 예약된 시간입니다
                </p>
              </div>
            </Card>

            {/* Request */}
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
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
                  <p className="text-xs text-gray-500 mt-2">
                    구체적으로 작성할수록 더 효과적인 릴레이를 진행할 수 있어요
                  </p>
                </div>

                <div className="flex items-start gap-3 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                  <Checkbox 
                    id="share"
                    checked={shareDocument}
                    onCheckedChange={(checked: boolean) => setShareDocument(checked as boolean)}
                  />
                  <label htmlFor="share" className="cursor-pointer flex-1 text-sm">
                    <div className="font-semibold mb-1">AI 학업계획서 공유하기</div>
                    <div className="text-gray-600">
                      작성한 AI 초안을 러너와 공유합니다. 릴레이 세션에서 바로 첨삭받을 수 있어요.
                    </div>
                  </label>
                </div>
              </div>
            </Card>

            {/* Payment */}
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-indigo-600" />
                결제 수단
              </h3>
              
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="space-y-3">
                  {[
                    { value: 'card', label: '신용/체크카드', desc: '즉시 결제' },
                    { value: 'kakao', label: '카카오페이', desc: '간편 결제' },
                    { value: 'toss', label: '토스페이', desc: '간편 결제' },
                  ].map((method) => (
                    <Card 
                      key={method.value}
                      className={`p-4 cursor-pointer transition-all ${
                        paymentMethod === method.value 
                          ? 'border-2 border-indigo-500 bg-indigo-50' 
                          : 'border-2 border-transparent hover:border-indigo-200'
                      }`}
                      onClick={() => setPaymentMethod(method.value)}
                    >
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value={method.value} id={method.value} />
                        <label htmlFor={method.value} className="cursor-pointer flex-1">
                          <div className="font-semibold">{method.label}</div>
                          <div className="text-sm text-gray-600">{method.desc}</div>
                        </label>
                      </div>
                    </Card>
                  ))}
                </div>
              </RadioGroup>
            </Card>

            {/* Terms */}
            <Card className="p-6 bg-amber-50 border-amber-200">
              <div className="flex items-start gap-3">
                <Checkbox 
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked: boolean) => setAgreedToTerms(checked as boolean)}
                />
                <label htmlFor="terms" className="cursor-pointer flex-1 text-sm">
                  <div className="font-semibold mb-2">환불 정책 동의 (필수)</div>
                  <ul className="space-y-1 text-gray-700">
                    <li>• 세션 24시간 전까지: 100% 환불</li>
                    <li>• 세션 24시간 이내 ~ 2시간 전: 50% 환불</li>
                    <li>• 세션 2시간 이내: 환불 불가</li>
                    <li>• 러너 불참 시: 100% 환불 및 추가 보상</li>
                  </ul>
                </label>
              </div>
            </Card>
          </div>

          {/* Summary Sidebar */}
          <div className="space-y-4">
            <Card className="p-6 sticky top-24">
              <h3 className="font-semibold text-lg mb-4">예약 요약</h3>
              
              <div className="space-y-3 mb-6 text-sm">
                <div className="flex justify-between pb-3 border-b">
                  <span className="text-gray-600">날짜</span>
                  <span className="font-medium">
                    {selectedDate ? selectedDate.toLocaleDateString('ko-KR') : '-'}
                  </span>
                </div>
                <div className="flex justify-between pb-3 border-b">
                  <span className="text-gray-600">시간</span>
                  <span className="font-medium">
                    {selectedTime || '-'}
                  </span>
                </div>
                <div className="flex justify-between pb-3 border-b">
                  <span className="text-gray-600">세션 시간</span>
                  <span className="font-medium">{duration}분</span>
                </div>
                <div className="flex justify-between pb-3 border-b">
                  <span className="text-gray-600">러너</span>
                  <span className="font-medium">{mentor.name}</span>
                </div>
              </div>

              <div className="space-y-2 mb-6 pt-4 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">세션 비용</span>
                  <span>₩{getPrice().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">플랫폼 수수료</span>
                  <span>₩0</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-3 border-t">
                  <span>총 결제금액</span>
                  <span className="text-indigo-600">₩{getPrice().toLocaleString()}</span>
                </div>
              </div>

              <Button
                className="w-full bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white mb-3"
                size="lg"
                onClick={handleConfirm}
                disabled={!selectedDate || !selectedTime || !agreedToTerms}
              >
                ₩{getPrice().toLocaleString()} 결제하기
              </Button>

              <Card className="p-4 bg-green-50 border-green-200">
                <div className="flex gap-2 text-xs text-gray-700">
                  <AlertCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    세션 비용은 에스크로로 보호됩니다. 
                    릴레이 완료 후 러너에게 전달됩니다.
                  </div>
                </div>
              </Card>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}