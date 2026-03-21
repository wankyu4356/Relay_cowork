import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ArrowLeft, Plus, X, Sparkles, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import type { AIData } from '../App';
import type { Category } from './GlobalNav';
import { CATEGORY_CONTENT } from '../lib/categoryContent';

interface AIExperienceInputProps {
  onBack: () => void;
  onSubmit: (data: AIData) => void;
  credits: number;
  selectedCategory?: Category;
}

export function AIExperienceInput({ onBack, onSubmit, credits, selectedCategory = 'transfer' }: AIExperienceInputProps) {
  const catContent = CATEGORY_CONTENT[selectedCategory];
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<AIData>>({
    university: '',
    major: '',
    motivation: '',
    activities: [],
    keywords: [],
    tone: 'balanced',
    wordCount: 1500,
  });
  const [newActivity, setNewActivity] = useState({
    name: '',
    role: '',
    period: '',
    achievement: '',
  });
  const [keywordInput, setKeywordInput] = useState('');

  const handleAddActivity = () => {
    if (newActivity.name && newActivity.role) {
      setFormData(prev => ({
        ...prev,
        activities: [...(prev.activities || []), newActivity],
      }));
      setNewActivity({ name: '', role: '', period: '', achievement: '' });
      toast.success('활동이 추가되었습니다');
    } else {
      toast.error('활동명과 역할은 필수입니다');
    }
  };

  const handleRemoveActivity = (index: number) => {
    setFormData(prev => ({
      ...prev,
      activities: prev.activities?.filter((_, i) => i !== index) || [],
    }));
  };

  const handleAddKeyword = () => {
    if (keywordInput.trim() && !formData.keywords?.includes(keywordInput.trim())) {
      setFormData(prev => ({
        ...prev,
        keywords: [...(prev.keywords || []), keywordInput.trim()],
      }));
      setKeywordInput('');
    }
  };

  const handleSubmit = () => {
    if (!formData.university || !formData.major) {
      toast.error('지원 대학과 학과를 입력해주세요');
      return;
    }
    if (!formData.motivation || formData.motivation.length < 50) {
      toast.error('지원 동기를 50자 이상 작성해주세요');
      return;
    }
    if (!formData.activities || formData.activities.length === 0) {
      toast.error('관련 활동을 최소 1개 이상 추가해주세요');
      return;
    }
    
    if (credits <= 0) {
      toast.error('AI 크레딧이 부족합니다');
      return;
    }

    onSubmit(formData as AIData);
  };

  const canProceed = () => {
    if (step === 1) return formData.university && formData.major;
    if (step === 2) {
      const hasMotivation = formData.motivation && formData.motivation.length >= 50;
      const hasActivities = (formData.activities?.length || 0) > 0;
      const hasFilledActivity = newActivity.name.trim() && newActivity.role.trim();
      return hasMotivation && (hasActivities || hasFilledActivity);
    }
    return true;
  };

  const handleNext = () => {
    // Step 2: auto-add filled activity before proceeding
    if (step === 2 && newActivity.name.trim() && newActivity.role.trim()) {
      setFormData(prev => ({
        ...prev,
        activities: [...(prev.activities || []), { ...newActivity }],
      }));
      setNewActivity({ name: '', role: '', period: '', achievement: '' });
    }
    setStep(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 pb-20 md:pb-0">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container-web py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">✨ {catContent.aiToolTitle}</h1>
              <p className="text-gray-600 mt-1">Step {step}/3</p>
            </div>
            <Badge className="bg-gradient-to-r from-sky-500 to-blue-600 text-white border-0 px-4 py-2">
              <Sparkles className="w-4 h-4 mr-2" />
              크레딧 {credits}회
            </Badge>
          </div>
          <Progress value={(step / 3) * 100} className="h-2" />
        </div>
      </div>

      <div className="container-web py-8">
        <div className="max-w-3xl mx-auto pb-24">
          {/* Step 1 */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <Card className="p-6 bg-gradient-to-br from-sky-50 to-blue-50 border-sky-200">
                <div className="flex gap-3">
                  <Sparkles className="w-6 h-6 text-sky-600 flex-shrink-0 mt-1" />
                  <div>
                    <h2 className="font-semibold text-lg mb-1">📌 Step 1: 내 배경 정보</h2>
                    <p className="text-gray-600">
                      내 경험을 입력하면, 지원 학과에 맞는 스토리라인과 초안을 만들어 드려요
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="space-y-6">
                  <div>
                    <Label className="text-base">{catContent.field1Label}/{catContent.field2Label} *</Label>
                    <div className="grid md:grid-cols-2 gap-4 mt-3">
                      <Input
                        placeholder={catContent.field1Placeholder}
                        value={formData.university}
                        onChange={(e) => setFormData(prev => ({ ...prev, university: e.target.value }))}
                        className="h-12"
                      />
                      <Input
                        placeholder={catContent.field2Placeholder}
                        value={formData.major}
                        onChange={(e) => setFormData(prev => ({ ...prev, major: e.target.value }))}
                        className="h-12"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-green-600 font-semibold">✅ 프로필에서 불러옴</span>
                    </div>
                    <div className="space-y-1 text-sm text-gray-700">
                      <p>• 전적대: 건국대 정치외교학과</p>
                      <p>• 학점: 3.8 / 4.5</p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <Card className="p-6 bg-gradient-to-br from-sky-50 to-blue-50 border-sky-200">
                <h2 className="font-semibold text-lg mb-1">📌 Step 2: 경험 & 소재</h2>
                <p className="text-gray-600">
                  구체적인 경험을 입력할수록 더 좋은 초안을 받을 수 있어요
                </p>
              </Card>

              <Card className="p-6 space-y-6">
                <div>
                  <Label className="text-base">{catContent.motivationLabel} (핵심 소재) *</Label>
                  <p className="text-sm text-gray-600 mt-1 mb-3">
                    왜 이 학과에 지원하나요? 핵심 경험이나 계기를 자유롭게 적어주세요 (200자 이상)
                  </p>
                  <Textarea
                    placeholder={catContent.motivationPlaceholder}
                    value={formData.motivation}
                    onChange={(e) => setFormData(prev => ({ ...prev, motivation: e.target.value }))}
                    className="min-h-40"
                  />
                  <div className={`text-right text-sm mt-2 ${(formData.motivation?.length || 0) >= 200 ? 'text-sky-600 font-medium' : 'text-gray-500'}`}>
                    {formData.motivation?.length || 0} / 200자
                  </div>
                </div>

                <div>
                  <Label className="text-base">관련 활동/경험 *</Label>
                  <Card className="p-4 mt-3 bg-gray-50 space-y-3">
                    <Input
                      placeholder="활동명"
                      value={newActivity.name}
                      onChange={(e) => setNewActivity(prev => ({ ...prev, name: e.target.value }))}
                    />
                    <Input
                      placeholder="역할"
                      value={newActivity.role}
                      onChange={(e) => setNewActivity(prev => ({ ...prev, role: e.target.value }))}
                    />
                    <Input
                      placeholder="기간 (예: 2024.03 ~ 2024.08)"
                      value={newActivity.period}
                      onChange={(e) => setNewActivity(prev => ({ ...prev, period: e.target.value }))}
                    />
                    <Textarea
                      placeholder="성과/배움"
                      value={newActivity.achievement}
                      onChange={(e) => setNewActivity(prev => ({ ...prev, achievement: e.target.value }))}
                      className="min-h-24"
                    />
                    <Button 
                      onClick={handleAddActivity}
                      className="w-full bg-sky-500 hover:bg-sky-600 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      활동 추가
                    </Button>
                  </Card>

                  {formData.activities && formData.activities.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {formData.activities.map((activity, index) => (
                        <Card key={index} className="p-4 bg-white">
                          <div className="flex justify-between items-start gap-3">
                            <div className="flex-1">
                              <h4 className="font-semibold">{activity.name}</h4>
                              <p className="text-sm text-gray-600">{activity.role} · {activity.period}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveActivity(index)}
                              className="text-red-500 hover:text-red-600 hover:bg-red-50"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <Label className="text-base">{catContent.keywordsLabel}</Label>
                  <p className="text-sm text-gray-600 mt-1 mb-3">
                    관심 분야나 수강 희망 과목을 태그로 입력해주세요
                  </p>
                  <div className="flex gap-2">
                    <Input
                      placeholder={catContent.keywordsPlaceholder}
                      value={keywordInput}
                      onChange={(e) => setKeywordInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddKeyword())}
                    />
                    <Button onClick={handleAddKeyword} className="bg-sky-500 hover:bg-sky-600 text-white">
                      추가
                    </Button>
                  </div>
                  {formData.keywords && formData.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {formData.keywords.map((keyword) => (
                        <Badge 
                          key={keyword}
                          className="bg-sky-100 text-sky-700 hover:bg-sky-200 gap-2"
                        >
                          {keyword}
                          <button onClick={() => setFormData(prev => ({ ...prev, keywords: prev.keywords?.filter(k => k !== keyword) }))}>
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <Card className="p-6 bg-gradient-to-br from-sky-50 to-blue-50 border-sky-200">
                <h2 className="font-semibold text-lg mb-1">📌 Step 3: 선호 설정</h2>
                <p className="text-gray-600">{catContent.styleDescription}</p>
              </Card>

              <Card className="p-6 space-y-6">
                <div>
                  <Label className="text-base mb-4 block">{catContent.styleLabel}</Label>
                  <RadioGroup 
                    value={formData.tone}
                    onValueChange={(value: any) => setFormData(prev => ({ ...prev, tone: value }))}
                    className="space-y-3"
                  >
                    {[
                      { value: 'sincere', title: '진정성 중심', desc: '경험 스토리 강조' },
                      { value: 'academic', title: '학업 계획 중심', desc: '구체적 계획 강조' },
                      { value: 'balanced', title: '균형형', desc: '경험 + 계획 밸런스' },
                    ].map((option) => (
                      <Card 
                        key={option.value}
                        className={`p-4 cursor-pointer transition-all ${
                          formData.tone === option.value 
                            ? 'border-2 border-sky-500 bg-sky-50' 
                            : 'border-2 border-transparent hover:border-sky-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value={option.value} id={option.value} />
                          <label htmlFor={option.value} className="cursor-pointer flex-1">
                            <div className="font-semibold">{option.title}</div>
                            <div className="text-sm text-gray-600">{option.desc}</div>
                          </label>
                        </div>
                      </Card>
                    ))}
                  </RadioGroup>
                </div>

                <div>
                  <Label className="text-base">글자 수</Label>
                  <Select 
                    value={formData.wordCount?.toString()}
                    onValueChange={(value: string) => setFormData(prev => ({ ...prev, wordCount: parseInt(value) }))}
                  >
                    <SelectTrigger className="mt-3 h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="800">800자</SelectItem>
                      <SelectItem value="1000">1,000자</SelectItem>
                      <SelectItem value="1200">1,200자</SelectItem>
                      <SelectItem value="1500">1,500자 (권장)</SelectItem>
                      <SelectItem value="2000">2,000자</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Card className="p-4 bg-amber-50 border-amber-200">
                  <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-gray-700">
                      <strong>AI 크레딧 1회</strong>가 사용됩니다. 스토리라인 제안과 초안 생성이 포함됩니다.
                    </div>
                  </div>
                </Card>
              </Card>
            </motion.div>
          )}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-10">
        <div className="container-web max-w-3xl flex gap-4">
          {step > 1 && (
            <Button
              variant="outline"
              onClick={() => setStep(prev => prev - 1)}
              size="lg"
              className="flex-1"
            >
              이전
            </Button>
          )}
          {step < 3 ? (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              size="lg"
              className="flex-1 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white"
            >
              다음
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!canProceed() || credits <= 0}
              size="lg"
              className="flex-1 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              스토리라인 생성하기
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}