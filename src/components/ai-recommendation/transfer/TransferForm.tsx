import { useState } from 'react';
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { Tabs, TabsList, TabsTrigger } from '../../ui/tabs';
import { BookOpen, Target, Sparkles, ArrowRight } from 'lucide-react';
import { TRANSFER_CONFIG } from '../../../lib/recommendation-data/transferData';
import type { TransferFormData } from '../../../lib/recommendation-data/transferData';

interface TransferFormProps {
  onSubmit: (data: TransferFormData) => void;
}

export function TransferForm({ onSubmit }: TransferFormProps) {
  const [formData, setFormData] = useState<TransferFormData>({
    currentUniversity: '',
    currentMajor: '',
    gpa: '',
    targetField: '',
    experiences: '',
    strengths: '',
    goals: '',
    transferType: '일반편입',
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
            {TRANSFER_CONFIG.heroTitle}
          </h2>
          <p className="text-gray-700">
            {TRANSFER_CONFIG.heroDescription}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* 편입 유형 선택 */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            편입 유형
          </h3>
          <Tabs
            value={formData.transferType}
            onValueChange={(value) =>
              setFormData({
                ...formData,
                transferType: value as '일반편입' | '학사편입' | '기타전형',
                transferSubType: value !== '기타전형' ? undefined : formData.transferSubType,
              })
            }
          >
            <TabsList className="w-full">
              <TabsTrigger value="일반편입" className="flex-1">
                일반편입
              </TabsTrigger>
              <TabsTrigger value="학사편입" className="flex-1">
                학사편입
              </TabsTrigger>
              <TabsTrigger value="기타전형" className="flex-1">
                기타전형
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* 기타전형 세부 유형 선택 */}
          {formData.transferType === '기타전형' && (
            <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                기타전형 세부 유형
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {['군위탁', '농어촌 전형', '특성화고 전형', '재외국민 전형'].map((subType) => (
                  <button
                    key={subType}
                    type="button"
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      formData.transferSubType === subType
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white border border-gray-300 text-gray-700 hover:border-indigo-400 hover:text-indigo-600'
                    }`}
                    onClick={() => setFormData({ ...formData, transferSubType: subType })}
                  >
                    {subType}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    formData.transferSubType !== undefined &&
                    !['군위탁', '농어촌 전형', '특성화고 전형', '재외국민 전형'].includes(formData.transferSubType)
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:border-indigo-400 hover:text-indigo-600'
                  }`}
                  onClick={() => setFormData({ ...formData, transferSubType: '' })}
                >
                  기타 (직접 입력)
                </button>
                {formData.transferSubType !== undefined &&
                  !['군위탁', '농어촌 전형', '특성화고 전형', '재외국민 전형'].includes(formData.transferSubType) && (
                  <input
                    type="text"
                    placeholder="전형 유형을 입력하세요"
                    className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors text-sm"
                    value={formData.transferSubType}
                    onChange={(e) => setFormData({ ...formData, transferSubType: e.target.value })}
                  />
                )}
              </div>
            </div>
          )}
        </div>

        {/* 기본 정보 */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            기본 정보
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                현재 대학
              </label>
              <input
                type="text"
                placeholder="예: 한국대학교"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors"
                value={formData.currentUniversity}
                onChange={(e) => setFormData({ ...formData, currentUniversity: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                현재 전공
              </label>
              <input
                type="text"
                placeholder="예: 경영학과"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors"
                value={formData.currentMajor}
                onChange={(e) => setFormData({ ...formData, currentMajor: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                평균 학점
              </label>
              <input
                type="text"
                placeholder="예: 3.8/4.5"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors"
                value={formData.gpa}
                onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                희망 분야
              </label>
              <input
                type="text"
                placeholder="예: 경영학, 경제학"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors"
                value={formData.targetField}
                onChange={(e) => setFormData({ ...formData, targetField: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* 비정형 정보 */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-600" />
            상세 정보
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                주요 경험 및 활동
              </label>
              <textarea
                rows={4}
                placeholder="동아리, 봉사활동, 인턴, 공모전 등 주요 경험을 자유롭게 작성해주세요"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors resize-none"
                value={formData.experiences}
                onChange={(e) => setFormData({ ...formData, experiences: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                나의 강점
              </label>
              <textarea
                rows={3}
                placeholder="학업, 리더십, 언어 능력 등 자신의 강점을 작성해주세요"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors resize-none"
                value={formData.strengths}
                onChange={(e) => setFormData({ ...formData, strengths: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                편입 목표 및 동기
              </label>
              <textarea
                rows={4}
                placeholder="편입을 준비하는 이유와 목표를 작성해주세요"
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
          disabled={!formData.currentUniversity || !formData.gpa}
        >
          <Sparkles className="w-5 h-5 mr-2" />
          AI 분석 시작하기
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </Card>
  );
}
