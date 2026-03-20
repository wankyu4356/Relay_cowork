import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { ArrowLeft, ArrowRight, Sparkles, Target } from 'lucide-react';
import type { OtherFormData } from '../../../lib/recommendation-data/otherData';

interface OtherFormProps {
  onSubmit: (data: OtherFormData) => void;
}

const STEP_LABELS = ['목표 설정', '현재 상태', '보유 리소스', '희망 기간'];

export function OtherForm({ onSubmit }: OtherFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [formData, setFormData] = useState<OtherFormData>({
    goal: '',
    currentState: '',
    resources: '',
    timeline: '',
  });
  const [interestField, setInterestField] = useState('');

  const handleNext = () => {
    if (currentStep < 3) {
      setDirection(1);
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const progressPercent = ((currentStep + 1) / 4) * 100;

  return (
    <Card className="p-8 card-modern">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-3">
          {STEP_LABELS.map((label, index) => (
            <div
              key={index}
              className={`text-sm font-medium transition-colors ${
                index <= currentStep ? 'text-indigo-600' : 'text-gray-400'
              }`}
            >
              {index + 1}. {label}
            </div>
          ))}
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-indigo-500 rounded-full"
            initial={{ width: '25%' }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="min-h-[300px] relative overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          {currentStep === 0 && (
            <motion.div
              key="step-0"
              custom={direction}
              initial={{ opacity: 0, x: direction * 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -100 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-start gap-3 mb-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
                <Target className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">구체적 목표</h3>
                  <p className="text-sm text-gray-600">어떤 목표를 달성하고 싶으신가요?</p>
                </div>
              </div>
              <textarea
                rows={6}
                placeholder="예: 미국 Top 20 MBA에 진학하여 전략 컨설팅 커리어를 시작하고 싶습니다."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors resize-none"
                value={formData.goal}
                onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
              />
            </motion.div>
          )}

          {currentStep === 1 && (
            <motion.div
              key="step-1"
              custom={direction}
              initial={{ opacity: 0, x: direction * 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -100 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-start gap-3 mb-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
                <Target className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">현재 상태</h3>
                  <p className="text-sm text-gray-600">현재 어떤 상황인가요? 학력, 경력, 역량 등</p>
                </div>
              </div>
              <textarea
                rows={6}
                placeholder="예: 서울대 경영학과 졸업, 대기업 마케팅팀 3년차, TOEIC 920점, 학점 3.8/4.5"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors resize-none"
                value={formData.currentState}
                onChange={(e) => setFormData({ ...formData, currentState: e.target.value })}
              />
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step-2"
              custom={direction}
              initial={{ opacity: 0, x: direction * 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -100 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-start gap-3 mb-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
                <Target className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">보유 리소스</h3>
                  <p className="text-sm text-gray-600">시간, 자금, 네트워크 등 활용 가능한 리소스</p>
                </div>
              </div>
              <textarea
                rows={6}
                placeholder="예: 준비 기간 1년, 예산 5,000만원, MBA 졸업 선배 3명 네트워크 보유"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors resize-none"
                value={formData.resources}
                onChange={(e) => setFormData({ ...formData, resources: e.target.value })}
              />
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step-3"
              custom={direction}
              initial={{ opacity: 0, x: direction * 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -100 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-start gap-3 mb-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
                <Target className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">희망 기간 및 관심 분야</h3>
                  <p className="text-sm text-gray-600">목표 달성 시기와 관심 분야를 알려주세요</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">희망 기간</label>
                  <textarea
                    rows={3}
                    placeholder="예: 2027년 상반기까지 MBA 입학, 1년 내 준비 완료 목표"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors resize-none"
                    value={formData.timeline}
                    onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">관심 분야</label>
                  <input
                    type="text"
                    placeholder="예: MBA, 해외 취업, 창업, 대학원"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors"
                    value={interestField}
                    onChange={(e) => setInterestField(e.target.value)}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <div className="mt-8 flex justify-between">
        <Button
          variant="outline"
          size="lg"
          className="rounded-xl px-6"
          onClick={handleBack}
          disabled={currentStep === 0}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          이전
        </Button>

        {currentStep < 3 ? (
          <Button
            size="lg"
            className="btn-primary rounded-xl px-6"
            onClick={handleNext}
          >
            다음
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        ) : (
          <Button
            size="lg"
            className="btn-primary px-8 py-6 text-lg rounded-2xl"
            onClick={handleSubmit}
            disabled={!formData.goal || !formData.currentState}
          >
            <Sparkles className="w-5 h-5 mr-2" />
            AI 분석 시작하기
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        )}
      </div>
    </Card>
  );
}
