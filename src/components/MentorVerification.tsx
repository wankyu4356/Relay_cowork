import { toast } from 'sonner';
import * as api from './api';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { 
  ArrowLeft, 
  Upload, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  GraduationCap,
  Award,
  Camera,
  X,
  Loader2,
  Info,
  ShieldCheck
} from 'lucide-react';

interface MentorVerificationProps {
  onBack: () => void;
  onComplete: () => void;
}

type VerificationStep = 'student' | 'admission' | 'review';
type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

interface UploadedFile {
  name: string;
  size: number;
  preview?: string;
}

export function MentorVerification({ onBack, onComplete }: MentorVerificationProps) {
  const [currentStep, setCurrentStep] = useState<VerificationStep>('student');
  const [studentIdFile, setStudentIdFile] = useState<UploadedFile | null>(null);
  const [admissionFile, setAdmissionFile] = useState<UploadedFile | null>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
  
  // Form data
  const [studentId, setStudentId] = useState('');
  const [university, setUniversity] = useState('');
  const [major, setMajor] = useState('');
  const [admissionYear, setAdmissionYear] = useState('');
  const [previousUniversity, setPreviousUniversity] = useState('');

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'student' | 'admission'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('파일 크기는 5MB 이하여야 합니다');
      return;
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('JPG, PNG, PDF 파일만 업로드 가능합니다');
      return;
    }

    setUploadStatus('uploading');

    // Simulate upload
    setTimeout(() => {
      const uploadedFile: UploadedFile = {
        name: file.name,
        size: file.size,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      };

      if (type === 'student') {
        setStudentIdFile(uploadedFile);
      } else {
        setAdmissionFile(uploadedFile);
      }

      setUploadStatus('success');
      toast.success('파일이 업로드되었습니다');
      
      setTimeout(() => setUploadStatus('idle'), 2000);
    }, 1500);
  };

  const handleRemoveFile = (type: 'student' | 'admission') => {
    if (type === 'student') {
      setStudentIdFile(null);
    } else {
      setAdmissionFile(null);
    }
    toast.success('파일이 삭제되었습니다');
  };

  const handleNext = async () => {
    if (currentStep === 'student') {
      if (!studentIdFile || !studentId || !university || !major) {
        toast.error('모든 필수 정보를 입력해주세요');
        return;
      }
      setCurrentStep('admission');
    } else if (currentStep === 'admission') {
      if (!admissionFile || !admissionYear || !previousUniversity) {
        toast.error('모든 필수 정보를 입력해주세요');
        return;
      }
      setCurrentStep('review');
    } else {
      // Submit for admin review + register as mentor
      toast.success('인증 요청이 제출되었습니다');

      try {
        await api.registerAsMentor({
          university,
          major,
          year: `${admissionYear}학번`,
          expertise: ['학업계획서', '편입 상담'],
        });
      } catch (e) {
        console.log('Mentor registration failed (may be guest):', e);
      }
      
      setTimeout(() => {
        toast.info('관리자 검토 중입니다. 1-2일 내 결과를 알려드립니다', {
          duration: 5000,
        });
        setTimeout(() => {
          onComplete();
        }, 1000);
      }, 1500);
    }
  };

  const handleBack = () => {
    if (currentStep === 'admission') {
      setCurrentStep('student');
    } else if (currentStep === 'review') {
      setCurrentStep('admission');
    } else {
      onBack();
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const steps = [
    { id: 'student', label: '학생 인증', icon: GraduationCap },
    { id: 'admission', label: '합격증 인증', icon: Award },
    { id: 'review', label: '검토', icon: ShieldCheck },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-10 shadow-sm">
        <div className="container-web py-6">
          <div className="flex items-center gap-4 mb-6">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="ghost" size="icon" onClick={handleBack}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </motion.div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                멘토 인증
              </h1>
              <p className="text-gray-600 mt-1">편입 합격을 인증하고 멘토로 활동하세요</p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStepIndex;
              const isCompleted = index < currentStepIndex;

              return (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <motion.div
                      className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all ${
                        isCompleted
                          ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                          : isActive
                          ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                      animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ duration: 0.5 }}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : (
                        <Icon className="w-6 h-6" />
                      )}
                    </motion.div>
                    <span className={`text-xs font-medium text-center ${isActive ? 'text-sky-600' : 'text-gray-600'}`}>
                      {step.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`h-0.5 flex-1 mx-2 mb-8 transition-all ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-200'
                    }`}></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="container-web py-8 pb-24">
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {/* Step 1: Student Verification */}
            {currentStep === 'student' && (
              <motion.div
                key="student"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <Card className="p-6 bg-sky-50/50 border-sky-200">
                  <div className="flex gap-3">
                    <Info className="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-sky-900 mb-1">학생 인증이란?</h3>
                      <p className="text-sm text-sky-700">
                        현재 재학 중인 대학의 학생증 또는 재학증명서를 통해 신원을 확인합니다.
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-sky-600" />
                    학생 정보
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">
                        대학교 <span className="text-red-500">*</span>
                      </label>
                      <Input
                        value={university}
                        onChange={(e) => setUniversity(e.target.value)}
                        placeholder="예: 연세대학교"
                        className="h-12"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">
                        학과 <span className="text-red-500">*</span>
                      </label>
                      <Input
                        value={major}
                        onChange={(e) => setMajor(e.target.value)}
                        placeholder="예: 경영학과"
                        className="h-12"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">
                        학번 <span className="text-red-500">*</span>
                      </label>
                      <Input
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        placeholder="예: 2023123456"
                        className="h-12"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">
                        학생증 또는 재학증명서 <span className="text-red-500">*</span>
                      </label>
                      
                      {!studentIdFile ? (
                        <label className="block">
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => handleFileUpload(e, 'student')}
                            className="hidden"
                            disabled={uploadStatus === 'uploading'}
                          />
                          <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center cursor-pointer hover:border-sky-400 hover:bg-sky-50/50 transition-all group">
                            {uploadStatus === 'uploading' ? (
                              <div className="flex flex-col items-center gap-3">
                                <Loader2 className="w-12 h-12 text-sky-500 animate-spin" />
                                <p className="text-sm text-gray-600">업로드 중...</p>
                              </div>
                            ) : (
                              <>
                                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3 group-hover:text-sky-500 transition-colors" />
                                <p className="font-medium text-gray-700 mb-1">파일을 선택하거나 드래그하세요</p>
                                <p className="text-sm text-gray-500">JPG, PNG, PDF (최대 5MB)</p>
                              </>
                            )}
                          </div>
                        </label>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="border border-gray-200 rounded-2xl p-4 bg-gray-50"
                        >
                          <div className="flex items-start gap-4">
                            {studentIdFile.preview ? (
                              <img 
                                src={studentIdFile.preview} 
                                alt="Preview"
                                className="w-20 h-20 rounded-xl object-cover"
                              />
                            ) : (
                              <div className="w-20 h-20 bg-sky-100 rounded-xl flex items-center justify-center">
                                <FileText className="w-10 h-10 text-sky-600" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <p className="font-medium text-gray-900 truncate">{studentIdFile.name}</p>
                                  <p className="text-sm text-gray-500">{formatFileSize(studentIdFile.size)}</p>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleRemoveFile('student')}
                                  className="text-red-600 hover:bg-red-50"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                              <div className="flex items-center gap-1 mt-2">
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                                <span className="text-sm text-green-600">업로드 완료</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </Card>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    className="flex-1"
                  >
                    이전
                  </Button>
                  <Button
                    onClick={handleNext}
                    className="flex-1 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white"
                    disabled={!studentIdFile || !studentId || !university || !major}
                  >
                    다음
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Admission Verification */}
            {currentStep === 'admission' && (
              <motion.div
                key="admission"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <Card className="p-6 bg-purple-50/50 border-purple-200">
                  <div className="flex gap-3">
                    <Info className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-purple-900 mb-1">합격증 인증이란?</h3>
                      <p className="text-sm text-purple-700">
                        편입 합격증 또는 입학 허가서를 통해 편입 합격을 증명합니다.
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <Award className="w-5 h-5 text-purple-600" />
                    편입 정보
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">
                        편입 연도 <span className="text-red-500">*</span>
                      </label>
                      <Input
                        value={admissionYear}
                        onChange={(e) => setAdmissionYear(e.target.value)}
                        placeholder="예: 2023"
                        className="h-12"
                        type="number"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">
                        전적대학교 <span className="text-red-500">*</span>
                      </label>
                      <Input
                        value={previousUniversity}
                        onChange={(e) => setPreviousUniversity(e.target.value)}
                        placeholder="예: 서울대학교"
                        className="h-12"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">
                        합격증 또는 입학 허가서 <span className="text-red-500">*</span>
                      </label>
                      
                      {!admissionFile ? (
                        <label className="block">
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => handleFileUpload(e, 'admission')}
                            className="hidden"
                            disabled={uploadStatus === 'uploading'}
                          />
                          <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center cursor-pointer hover:border-purple-400 hover:bg-purple-50/50 transition-all group">
                            {uploadStatus === 'uploading' ? (
                              <div className="flex flex-col items-center gap-3">
                                <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
                                <p className="text-sm text-gray-600">업로드 중...</p>
                              </div>
                            ) : (
                              <>
                                <Camera className="w-12 h-12 text-gray-400 mx-auto mb-3 group-hover:text-purple-500 transition-colors" />
                                <p className="font-medium text-gray-700 mb-1">합격증 사진 업로드</p>
                                <p className="text-sm text-gray-500">JPG, PNG, PDF (최대 5MB)</p>
                              </>
                            )}
                          </div>
                        </label>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="border border-gray-200 rounded-2xl p-4 bg-gray-50"
                        >
                          <div className="flex items-start gap-4">
                            {admissionFile.preview ? (
                              <img 
                                src={admissionFile.preview} 
                                alt="Preview"
                                className="w-20 h-20 rounded-xl object-cover"
                              />
                            ) : (
                              <div className="w-20 h-20 bg-purple-100 rounded-xl flex items-center justify-center">
                                <FileText className="w-10 h-10 text-purple-600" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <p className="font-medium text-gray-900 truncate">{admissionFile.name}</p>
                                  <p className="text-sm text-gray-500">{formatFileSize(admissionFile.size)}</p>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleRemoveFile('admission')}
                                  className="text-red-600 hover:bg-red-50"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                              <div className="flex items-center gap-1 mt-2">
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                                <span className="text-sm text-green-600">업로드 완료</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </Card>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    className="flex-1"
                  >
                    이전
                  </Button>
                  <Button
                    onClick={handleNext}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white"
                    disabled={!admissionFile || !admissionYear || !previousUniversity}
                  >
                    다음
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Review */}
            {currentStep === 'review' && (
              <motion.div
                key="review"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <Card className="p-6 bg-green-50/50 border-green-200">
                  <div className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-green-900 mb-1">제출 전 확인</h3>
                      <p className="text-sm text-green-700">
                        입력하신 정보를 다시 한번 확인해주세요.
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-green-600" />
                    제출 내용 확인
                  </h2>

                  <div className="space-y-6">
                    {/* Student Info */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <GraduationCap className="w-5 h-5 text-sky-600" />
                        <h3 className="font-semibold">학생 정보</h3>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">대학교</span>
                          <span className="font-medium">{university}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">학과</span>
                          <span className="font-medium">{major}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">학번</span>
                          <span className="font-medium">{studentId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">학생증</span>
                          <span className="font-medium text-green-600 flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" />
                            제출완료
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Admission Info */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Award className="w-5 h-5 text-purple-600" />
                        <h3 className="font-semibold">편입 정보</h3>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">편입 연도</span>
                          <span className="font-medium">{admissionYear}년</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">전적대</span>
                          <span className="font-medium">{previousUniversity}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">합격증</span>
                          <span className="font-medium text-green-600 flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" />
                            제출완료
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-yellow-50/50 border-yellow-200">
                  <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-yellow-900 mb-2">안내사항</h3>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        <li>• 제출하신 서류는 관리자가 1-2일 내 검토합니다</li>
                        <li>• 인증이 승인되면 알림으로 안내드립니다</li>
                        <li>• 허위 정보 제출 시 계정이 정지될 수 있습니다</li>
                      </ul>
                    </div>
                  </div>
                </Card>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    className="flex-1"
                  >
                    이전
                  </Button>
                  <Button
                    onClick={handleNext}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                  >
                    제출하기
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}