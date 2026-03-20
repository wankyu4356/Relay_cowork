import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Progress } from './ui/progress';
import { Switch } from './ui/switch';
import { ArrowLeft, ArrowRight, Upload, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface MentorEAWizardProps {
  onBack: () => void;
  onComplete: () => void;
}

export function MentorEAWizard({ onBack, onComplete }: MentorEAWizardProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1
    fromUniversity: '',
    fromMajor: '',
    toUniversity: '',
    toMajor: '',
    admissionYear: '',
    admissionSemester: '',
    
    // Step 2
    gpa: '',
    gpaMax: '4.5',
    hasTranscript: false,
    hasCertificate: false,
    
    // Step 3
    prepDuration: '',
    studyMethod: '',
    studyTools: '',
    mentalCare: '',
    
    // Step 4
    hasEssay: false,
    essayCount: '1',
    
    // Step 5
    publicEssay: false,
    publicInterview: false,
    publicStudyMethod: true,
    publicTools: true,
  });

  const handleNext = () => {
    if (step < 5) {
      setStep(prev => prev + 1);
    } else {
      toast.success('EA 등록이 완료되었습니다! 승인 대기 중입니다.');
      setTimeout(() => onComplete(), 1500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 py-12">
      <div className="container-web max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Experience Asset 등록</h1>
            <p className="text-gray-600 mt-1">합격 경험을 체계적으로 정리해주세요</p>
          </div>
        </div>

        <Card className="p-8 shadow-xl border-0">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Step {step} / 5</span>
              <span className="text-sm font-medium text-sky-600">{Math.round((step / 5) * 100)}%</span>
            </div>
            <Progress value={(step / 5) * 100} className="h-2" />
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>합격 정보</span>
              <span>정량 데이터</span>
              <span>정성 경험</span>
              <span>자소서</span>
              <span>공개 범위</span>
            </div>
          </div>

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <div className="text-5xl mb-4">🎓</div>
                <h2 className="text-2xl font-bold mb-2">Step 1: 합격 기본 정보</h2>
                <p className="text-gray-600">편입 전후 학교와 학과를 알려주세요</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">전적대</h3>
                  <div>
                    <Label>대학명 *</Label>
                    <Input
                      placeholder="예: 건국대학교"
                      value={formData.fromUniversity}
                      onChange={(e) => setFormData(prev => ({ ...prev, fromUniversity: e.target.value }))}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>학과 *</Label>
                    <Input
                      placeholder="예: 정치외교학과"
                      value={formData.fromMajor}
                      onChange={(e) => setFormData(prev => ({ ...prev, fromMajor: e.target.value }))}
                      className="mt-2"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">합격 대학</h3>
                  <div>
                    <Label>대학명 *</Label>
                    <Input
                      placeholder="예: 연세대학교"
                      value={formData.toUniversity}
                      onChange={(e) => setFormData(prev => ({ ...prev, toUniversity: e.target.value }))}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>학과 *</Label>
                    <Input
                      placeholder="예: 경영학과"
                      value={formData.toMajor}
                      onChange={(e) => setFormData(prev => ({ ...prev, toMajor: e.target.value }))}
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>합격 연도 *</Label>
                  <Select 
                    value={formData.admissionYear}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, admissionYear: value }))}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {[2025, 2024, 2023, 2022, 2021].map(year => (
                        <SelectItem key={year} value={year.toString()}>{year}년</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>학기 *</Label>
                  <Select 
                    value={formData.admissionSemester}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, admissionSemester: value }))}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1학기</SelectItem>
                      <SelectItem value="2">2학기</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Quantitative Data */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <div className="text-5xl mb-4">📊</div>
                <h2 className="text-2xl font-bold mb-2">Step 2: 정량 데이터</h2>
                <p className="text-gray-600">학점과 증빙 서류를 등록해주세요</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>학점 *</Label>
                  <Input
                    placeholder="3.9"
                    value={formData.gpa}
                    onChange={(e) => setFormData(prev => ({ ...prev, gpa: e.target.value }))}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>만점 기준 *</Label>
                  <Select 
                    value={formData.gpaMax}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, gpaMax: value }))}
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

              <div className="space-y-4">
                <div>
                  <Label>학점이수현황표 업로드</Label>
                  <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-sky-400 hover:bg-sky-50 transition-all cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">클릭하여 파일 업로드</p>
                    <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG (최대 5MB)</p>
                  </div>
                </div>

                <div>
                  <Label>합격증 업로드 *</Label>
                  <div className="mt-2 border-2 border-dashed border-sky-300 rounded-lg p-8 text-center hover:border-sky-400 hover:bg-sky-50 transition-all cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-sky-400" />
                    <p className="text-sm font-medium text-sky-600">클릭하여 합격증 업로드</p>
                    <p className="text-xs text-gray-500 mt-1">필수 서류입니다</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Qualitative Experience */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <div className="text-5xl mb-4">✍️</div>
                <h2 className="text-2xl font-bold mb-2">Step 3: 정성 경험</h2>
                <p className="text-gray-600">실제 준비 과정과 노하우를 공유해주세요</p>
              </div>

              <div>
                <Label>준비 기간 *</Label>
                <Select 
                  value={formData.prepDuration}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, prepDuration: value }))}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3개월 이하</SelectItem>
                    <SelectItem value="6">3-6개월</SelectItem>
                    <SelectItem value="9">6-9개월</SelectItem>
                    <SelectItem value="12">9-12개월</SelectItem>
                    <SelectItem value="12+">12개월 이상</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>공부 방법 (500자 이상) *</Label>
                <Textarea
                  placeholder="어떻게 공부하셨나요? 구체적인 방법과 팁을 공유해주세요..."
                  value={formData.studyMethod}
                  onChange={(e) => setFormData(prev => ({ ...prev, studyMethod: e.target.value }))}
                  className="mt-2 min-h-40"
                />
                <div className="text-right text-sm text-gray-600 mt-1">
                  {formData.studyMethod.length} / 500자
                </div>
              </div>

              <div>
                <Label>사용한 교재/강의</Label>
                <Input
                  placeholder="예: 해커스 영어, 에듀윌 편입수학"
                  value={formData.studyTools}
                  onChange={(e) => setFormData(prev => ({ ...prev, studyTools: e.target.value }))}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>멘탈 관리 & 팁</Label>
                <Textarea
                  placeholder="힘들 때 어떻게 극복하셨나요? 준비생들에게 전하고 싶은 조언이 있다면..."
                  value={formData.mentalCare}
                  onChange={(e) => setFormData(prev => ({ ...prev, mentalCare: e.target.value }))}
                  className="mt-2 min-h-32"
                />
              </div>
            </motion.div>
          )}

          {/* Step 4: Essay */}
          {step === 4 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <div className="text-5xl mb-4">📝</div>
                <h2 className="text-2xl font-bold mb-2">Step 4: 자소서</h2>
                <p className="text-gray-600">합격 자소서를 공유하시겠어요?</p>
              </div>

              <Card className="p-6 bg-sky-50 border-sky-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">자소서 제공</h3>
                    <p className="text-sm text-gray-600">
                      자소서는 세션 내에서만 공개되며, 외부 유출이 방지됩니다
                    </p>
                  </div>
                  <Switch
                    checked={formData.hasEssay}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, hasEssay: checked }))}
                  />
                </div>
              </Card>

              {formData.hasEssay && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-4"
                >
                  <div>
                    <Label>자소서 파일 업로드</Label>
                    <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-sky-400 hover:bg-sky-50 transition-all cursor-pointer">
                      <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600">PDF 또는 DOCX 파일 업로드</p>
                      <p className="text-xs text-gray-500 mt-1">최대 10MB</p>
                    </div>
                  </div>

                  <div>
                    <Label>작성 의도 & 포인트</Label>
                    <Textarea
                      placeholder="어떤 의도로 작성했는지, 주요 포인트는 무엇인지 설명해주세요..."
                      className="mt-2 min-h-32"
                    />
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Step 5: Privacy Settings */}
          {step === 5 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <div className="text-5xl mb-4">🔒</div>
                <h2 className="text-2xl font-bold mb-2">Step 5: 공개 범위 설정</h2>
                <p className="text-gray-600">항목별로 공개 범위를 설정해주세요</p>
              </div>

              <div className="space-y-4">
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">자소서</h4>
                      <p className="text-sm text-gray-600">세션 내에서만 열람 가능 (권장)</p>
                    </div>
                    <Switch
                      checked={formData.publicEssay}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, publicEssay: checked }))}
                    />
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">면접 후기</h4>
                      <p className="text-sm text-gray-600">매칭 후 공개</p>
                    </div>
                    <Switch
                      checked={formData.publicInterview}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, publicInterview: checked }))}
                    />
                  </div>
                </Card>

                <Card className="p-4 border-sky-200 bg-sky-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">학습 방법</h4>
                      <p className="text-sm text-gray-600">전체 공개 (추천)</p>
                    </div>
                    <Switch
                      checked={formData.publicStudyMethod}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, publicStudyMethod: checked }))}
                    />
                  </div>
                </Card>

                <Card className="p-4 border-sky-200 bg-sky-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">준비 체크리스트</h4>
                      <p className="text-sm text-gray-600">전체 공개 (추천)</p>
                    </div>
                    <Switch
                      checked={formData.publicTools}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, publicTools: checked }))}
                    />
                  </div>
                </Card>
              </div>

              <Card className="p-4 bg-amber-50 border-amber-200">
                <div className="text-sm text-gray-700">
                  <strong>💡 Tip:</strong> 더 많은 정보를 공개할수록 멘티들의 신뢰도가 높아져 매칭율이 올라갑니다.
                </div>
              </Card>
            </motion.div>
          )}

          {/* Navigation */}
          <div className="flex gap-4 mt-8">
            {step > 1 && (
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
              className="flex-1 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white"
              size="lg"
            >
              {step === 5 ? '제출하기' : '다음'}
              {step < 5 && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
