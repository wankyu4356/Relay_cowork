import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Switch } from '../../ui/switch';
import { BookOpen, Target, Sparkles, ArrowRight } from 'lucide-react';
import type { AdmissionFormData, AdmissionMode } from '../../../lib/recommendation-data/admissionData';

interface AdmissionFormProps {
  onSubmit: (data: AdmissionFormData) => void;
}

export function AdmissionForm({ onSubmit }: AdmissionFormProps) {
  const [mode, setMode] = useState<AdmissionMode>('수시');
  const [formData, setFormData] = useState<AdmissionFormData>({ mode: '수시' });

  const handleModeToggle = (checked: boolean) => {
    const newMode: AdmissionMode = checked ? '정시' : '수시';
    setMode(newMode);
    setFormData((prev) => ({ ...prev, mode: newMode }));
  };

  const handleChange = (field: keyof AdmissionFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <motion.div
      key="form"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="container-web py-8"
    >
      <Card className="p-8 max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">입시 정보 입력</h2>
          <p className="text-gray-600">학생의 정보를 입력하면 AI가 최적의 대학과 전형을 추천합니다</p>
        </div>

        {/* 수시/정시 Toggle */}
        <div className="flex items-center justify-center gap-4 mb-8 p-4 bg-gray-50 rounded-xl">
          <span className={`text-sm font-semibold transition-colors ${mode === '수시' ? 'text-indigo-600' : 'text-gray-400'}`}>
            수시
          </span>
          <Switch
            checked={mode === '정시'}
            onCheckedChange={handleModeToggle}
            className="data-[state=checked]:bg-indigo-600"
          />
          <span className={`text-sm font-semibold transition-colors ${mode === '정시' ? 'text-indigo-600' : 'text-gray-400'}`}>
            정시
          </span>
          <Badge variant="outline" className="ml-2 text-indigo-600 border-indigo-200">
            <Target className="w-3 h-3 mr-1" />
            {mode} 전형
          </Badge>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <AnimatePresence mode="wait">
            {mode === '수시' ? (
              <motion.div
                key="susi"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">고등학교</label>
                  <input
                    type="text"
                    placeholder="예: ○○고등학교"
                    value={formData.highSchool || ''}
                    onChange={(e) => handleChange('highSchool', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">내신 평균 등급</label>
                  <input
                    type="text"
                    placeholder="예: 1.5"
                    value={formData.gpaGrade || ''}
                    onChange={(e) => handleChange('gpaGrade', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">희망 전공 분야</label>
                  <input
                    type="text"
                    placeholder="예: 컴퓨터공학, 인공지능"
                    value={formData.targetField || ''}
                    onChange={(e) => handleChange('targetField', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">주요 비교과 활동</label>
                  <textarea
                    placeholder="동아리, 봉사활동, 대회 수상 등을 자유롭게 작성해주세요"
                    value={formData.extracurriculars || ''}
                    onChange={(e) => handleChange('extracurriculars', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">자소서 핵심 키워드</label>
                  <textarea
                    placeholder="자기소개서에서 강조하고 싶은 핵심 키워드를 작성해주세요"
                    value={formData.essayKeywords || ''}
                    onChange={(e) => handleChange('essayKeywords', e.target.value)}
                    rows={2}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">나의 강점</label>
                  <textarea
                    placeholder="학업 외 자신만의 강점을 자유롭게 작성해주세요"
                    value={formData.strengths || ''}
                    onChange={(e) => handleChange('strengths', e.target.value)}
                    rows={2}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">진학 목표 및 동기</label>
                  <textarea
                    placeholder="대학 진학의 목표와 동기를 작성해주세요"
                    value={formData.goals || ''}
                    onChange={(e) => handleChange('goals', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="jeongsi"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">국어 점수</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      placeholder="0~100"
                      value={formData.koreanScore ?? ''}
                      onChange={(e) => handleChange('koreanScore', Number(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">수학 점수</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      placeholder="0~100"
                      value={formData.mathScore ?? ''}
                      onChange={(e) => handleChange('mathScore', Number(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">영어 등급</label>
                  <input
                    type="number"
                    min={1}
                    max={9}
                    placeholder="1~9"
                    value={formData.englishGrade ?? ''}
                    onChange={(e) => handleChange('englishGrade', Number(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">탐구1 점수</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      placeholder="0~100"
                      value={formData.inquiry1Score ?? ''}
                      onChange={(e) => handleChange('inquiry1Score', Number(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">탐구2 점수</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      placeholder="0~100"
                      value={formData.inquiry2Score ?? ''}
                      onChange={(e) => handleChange('inquiry2Score', Number(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">희망 전공 분야</label>
                  <input
                    type="text"
                    placeholder="예: 컴퓨터공학, 인공지능"
                    value={formData.targetField || ''}
                    onChange={(e) => handleChange('targetField', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">목표 및 동기</label>
                  <textarea
                    placeholder="대학 진학의 목표와 동기를 작성해주세요"
                    value={formData.goals || ''}
                    onChange={(e) => handleChange('goals', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <Button
            type="submit"
            size="lg"
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 rounded-xl py-6 text-lg mt-6"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            AI 맞춤 추천 받기
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </form>
      </Card>
    </motion.div>
  );
}
