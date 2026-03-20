import { useState } from 'react';
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { Label } from '../../ui/label';
import { RadioGroup, RadioGroupItem } from '../../ui/radio-group';
import { BookOpen, Target, Sparkles, ArrowRight, Clock } from 'lucide-react';
import { CERTIFICATION_CONFIG } from '../../../lib/recommendation-data/certificationData';
import type {
  CertificationFormData,
  CertificationLevel,
} from '../../../lib/recommendation-data/certificationData';

interface CertificationFormProps {
  onSubmit: (data: CertificationFormData) => void;
}

export function CertificationForm({ onSubmit }: CertificationFormProps) {
  const [formData, setFormData] = useState<CertificationFormData>({
    currentLevel: '초급',
    field: '',
    dailyStudyHours: 2,
    examDate: '',
    relatedExperience: '',
    goals: '',
  });

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <Card className="p-8 card-modern">
      <div className="flex items-start gap-4 mb-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border-2 border-indigo-200">
        <Sparkles className="w-8 h-8 text-indigo-600 flex-shrink-0 mt-1" />
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {CERTIFICATION_CONFIG.heroTitle}
          </h2>
          <p className="text-gray-700">
            {CERTIFICATION_CONFIG.heroDescription}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* 현재 수준 */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            현재 수준
          </h3>
          <RadioGroup
            value={formData.currentLevel}
            onValueChange={(value) =>
              setFormData({ ...formData, currentLevel: value as CertificationLevel })
            }
            className="flex gap-4"
          >
            {(['초급', '중급', '고급'] as CertificationLevel[]).map((level) => (
              <div key={level} className="flex items-center space-x-2">
                <RadioGroupItem value={level} id={`level-${level}`} />
                <Label htmlFor={`level-${level}`} className="cursor-pointer">
                  {level}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* 기본 정보 */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-600" />
            기본 정보
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                관심 분야
              </label>
              <input
                type="text"
                placeholder="예: IT, 회계, 어학"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors"
                value={formData.field}
                onChange={(e) => setFormData({ ...formData, field: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                <Clock className="w-4 h-4" />
                하루 공부 시간 (시간)
              </label>
              <input
                type="number"
                min={0}
                max={24}
                placeholder="예: 3"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors"
                value={formData.dailyStudyHours}
                onChange={(e) =>
                  setFormData({ ...formData, dailyStudyHours: Number(e.target.value) })
                }
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                시험 예정일
              </label>
              <input
                type="text"
                placeholder="예: 2025-12-15"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors"
                value={formData.examDate}
                onChange={(e) => setFormData({ ...formData, examDate: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* 상세 정보 */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            상세 정보
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                관련 학습/업무 경험
              </label>
              <textarea
                rows={4}
                placeholder="관련 수업, 프로젝트, 인턴, 업무 경험 등을 자유롭게 작성해주세요"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors resize-none"
                value={formData.relatedExperience}
                onChange={(e) =>
                  setFormData({ ...formData, relatedExperience: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                자격증 취득 목표
              </label>
              <textarea
                rows={4}
                placeholder="자격증을 취득하려는 이유와 목표를 작성해주세요"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors resize-none"
                value={formData.goals}
                onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <Button
          size="lg"
          className="btn-primary px-8 py-6 text-lg rounded-2xl"
          onClick={handleSubmit}
          disabled={!formData.field}
        >
          <Sparkles className="w-5 h-5 mr-2" />
          AI 분석 시작하기
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </Card>
  );
}
