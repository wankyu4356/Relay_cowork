import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Progress } from './ui/progress';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import * as api from './api';
import { logger } from '../utils/logger';
import type { Category } from './GlobalNav';
import { CATEGORY_CONTENT } from '../lib/categoryContent';

interface MenteeOnboardingProps {
  onComplete: () => void;
  selectedCategory?: Category;
}

const STEP1_CONFIG: Record<Category, { title: string; description: string; field1Label: string; field1Placeholder: string; field2Label: string; field2Placeholder: string }> = {
  transfer: {
    title: '현재 재학 정보',
    description: '현재 다니고 계신 학교와 전공을 알려주세요',
    field1Label: '전적대학 *',
    field1Placeholder: '예: 건국대학교',
    field2Label: '전공 *',
    field2Placeholder: '예: 정치외교학과',
  },
  admission: {
    title: '현재 재학 정보',
    description: '현재 다니고 계신 학교 정보를 알려주세요',
    field1Label: '고등학교 *',
    field1Placeholder: '예: 서울고등학교',
    field2Label: '전공 *',
    field2Placeholder: '예: 자연계열',
  },
  career: {
    title: '학력 정보',
    description: '출신 학교와 전공을 알려주세요',
    field1Label: '출신 대학 *',
    field1Placeholder: '예: 서울대학교',
    field2Label: '전공 *',
    field2Placeholder: '예: 컴퓨터공학과',
  },
  certification: {
    title: '학력/경력 정보',
    description: '학력 또는 경력 정보를 알려주세요',
    field1Label: '학력 *',
    field1Placeholder: '예: 서울대학교',
    field2Label: '전공/분야 *',
    field2Placeholder: '예: 회계학과',
  },
  other: {
    title: '기본 정보',
    description: '학력 또는 경력 정보를 알려주세요',
    field1Label: '학력 *',
    field1Placeholder: '예: 서울대학교',
    field2Label: '전공/분야 *',
    field2Placeholder: '예: 경영학과',
  },
};

const STEP1_SUMMARY_LABEL: Record<Category, string> = {
  transfer: '전적대',
  admission: '고등학교',
  career: '출신 대학',
  certification: '학력',
  other: '학력',
};

const STEP2_DESCRIPTION: Record<Category, string> = {
  transfer: '편입하고 싶은 학교와 학과를 알려주세요',
  admission: '입학하고 싶은 학교와 학과를 알려주세요',
  career: '취업하고 싶은 회사와 직무를 알려주세요',
  certification: '취득하고 싶은 자격증과 분야를 알려주세요',
  other: '목표와 분야를 알려주세요',
};

export function MenteeOnboarding({ onComplete, selectedCategory = 'transfer' }: MenteeOnboardingProps) {
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    currentUniversity: '',
    currentMajor: '',
    targetUniversity: '',
    targetMajor: '',
    gpa: '',
    gpaMax: '4.5',
  });

  const content = CATEGORY_CONTENT[selectedCategory ?? 'transfer'];
  const step1 = STEP1_CONFIG[selectedCategory ?? 'transfer'];

  const handleNext = async () => {
    if (step === 1) {
      if (!formData.currentUniversity || !formData.currentMajor) {
        toast.error(`${step1.title} 정보를 입력해주세요`);
        return;
      }
    } else if (step === 2) {
      if (!formData.targetUniversity || !formData.targetMajor) {
        toast.error(`${content.field1Label} 정보를 입력해주세요`);
        return;
      }
    }

    if (step < 3) {
      setStep(prev => prev + 1);
    } else {
      // Save profile to server
      setSaving(true);
      try {
        await api.updateProfile({
          onboardingCompleted: true,
          profile: {
            currentUniversity: formData.currentUniversity,
            currentMajor: formData.currentMajor,
            targetUniversity: formData.targetUniversity,
            targetMajor: formData.targetMajor,
            gpa: formData.gpa,
            gpaMax: formData.gpaMax,
          },
        });
        toast.success('프로필이 저장되었습니다! 🎉');
      } catch (e) {
        logger.log('Profile save during onboarding failed (guest mode?):', e);
        toast.success('릴레이에 오신 것을 환영합니다! 🎉');
      } finally {
        setSaving(false);
      }
      setTimeout(() => onComplete(), 800);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 py-12">
      <div className="container-web max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-4">
              릴레이 시작하기
            </h1>
            <p className="text-xl text-gray-600">
              맞춤 멘토 추천을 위한 정보를 입력해주세요
            </p>
          </div>

          <Card className="p-8 shadow-xl border-0">
            {/* Progress */}
            <div className="mb-8">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Step {step} / 3</span>
                <span className="text-sm font-medium text-pink-600">{Math.round((step / 3) * 100)}%</span>
              </div>
              <Progress value={(step / 3) * 100} className="h-2" />
            </div>

            {/* Step 1: Current Info */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <div className="text-5xl mb-4">🎓</div>
                  <h2 className="text-2xl font-bold mb-2">{step1.title}</h2>
                  <p className="text-gray-600">{step1.description}</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>{step1.field1Label}</Label>
                    <Input
                      placeholder={step1.field1Placeholder}
                      value={formData.currentUniversity}
                      onChange={(e) => setFormData(prev => ({ ...prev, currentUniversity: e.target.value }))}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>{step1.field2Label}</Label>
                    <Input
                      placeholder={step1.field2Placeholder}
                      value={formData.currentMajor}
                      onChange={(e) => setFormData(prev => ({ ...prev, currentMajor: e.target.value }))}
                      className="mt-2"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>학점</Label>
                      <Input
                        placeholder="3.8"
                        value={formData.gpa}
                        onChange={(e) => setFormData(prev => ({ ...prev, gpa: e.target.value }))}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label>만점 기준</Label>
                      <Select
                        value={formData.gpaMax}
                        onValueChange={(value: string) => setFormData(prev => ({ ...prev, gpaMax: value }))}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="4.0">4.0</SelectItem>
                          <SelectItem value="4.3">4.3</SelectItem>
                          <SelectItem value="4.5">4.5</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Target Info */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <div className="text-5xl mb-4">🎯</div>
                  <h2 className="text-2xl font-bold mb-2">{content.field1Label} 정보</h2>
                  <p className="text-gray-600">{STEP2_DESCRIPTION[selectedCategory ?? 'transfer']}</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>{content.field1Label} *</Label>
                    <Input
                      placeholder={content.field1Placeholder}
                      value={formData.targetUniversity}
                      onChange={(e) => setFormData(prev => ({ ...prev, targetUniversity: e.target.value }))}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>{content.field2Label} *</Label>
                    <Input
                      placeholder={content.field2Placeholder}
                      value={formData.targetMajor}
                      onChange={(e) => setFormData(prev => ({ ...prev, targetMajor: e.target.value }))}
                      className="mt-2"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Complete */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 1 }}
                  className="text-8xl mb-6"
                >
                  🎉
                </motion.div>
                <h2 className="text-3xl font-bold mb-4">릴레이 준비 완료!</h2>
                <p className="text-xl text-gray-600 mb-8">
                  {formData.targetUniversity} {formData.targetMajor} {content.label}을 위한<br />
                  맞춤 멘토를 추천해드릴게요
                </p>
                <Card className="p-6 bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200 max-w-md mx-auto">
                  <div className="space-y-3 text-left">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{STEP1_SUMMARY_LABEL[selectedCategory ?? 'transfer']}</span>
                      <span className="font-medium">{formData.currentUniversity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">전공</span>
                      <span className="font-medium">{formData.currentMajor}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">학점</span>
                      <span className="font-medium">{formData.gpa} / {formData.gpaMax}</span>
                    </div>
                    <div className="border-t border-pink-200 pt-3 mt-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">{content.label} 목표</span>
                        <span className="font-medium text-pink-600">
                          {formData.targetUniversity} {formData.targetMajor}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Navigation */}
            <div className="flex gap-4 mt-8">
              {step > 1 && step < 3 && (
                <Button
                  variant="outline"
                  onClick={() => setStep(prev => prev - 1)}
                  className="flex-1"
                  size="lg"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  이전
                </Button>
              )}
              <Button
                onClick={handleNext}
                disabled={saving}
                className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white"
                size="lg"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : step === 3 ? '릴레이 시작하기' : '다음'}
                {step < 3 && !saving && <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}