import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { RecommendationHeader } from '../shared/RecommendationHeader';
import { AnalyzingAnimation } from '../shared/AnalyzingAnimation';
import { CertificationForm } from './CertificationForm';
import { CertificationResults } from './CertificationResults';
import {
  CERTIFICATION_CONFIG,
  CERTIFICATION_RECOMMENDATIONS,
  CERTIFICATION_ALTERNATIVES,
} from '../../../lib/recommendation-data/certificationData';
import type { CertificationFormData } from '../../../lib/recommendation-data/certificationData';
import type { CategoryRecommendationProps } from '../../../lib/recommendation-data/types';

type Step = 'form' | 'analyzing' | 'results';

export function CertificationRecommendation({
  onBack,
  onComplete,
}: CategoryRecommendationProps) {
  const [step, setStep] = useState<Step>('form');
  const [examDate, setExamDate] = useState<string>('');

  const handleFormSubmit = (data: CertificationFormData) => {
    setExamDate(data.examDate);
    setStep('analyzing');

    setTimeout(() => {
      setStep('results');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <RecommendationHeader
        title={CERTIFICATION_CONFIG.pageTitle}
        subtitle={CERTIFICATION_CONFIG.pageSubtitle}
        onBack={onBack}
      />

      <div className="container-web py-8">
        <AnimatePresence mode="wait">
          {step === 'form' && (
            <CertificationForm onSubmit={handleFormSubmit} />
          )}

          {step === 'analyzing' && (
            <AnalyzingAnimation
              message="AI 분석 중..."
              description={
                '입력하신 정보를 바탕으로\n최적의 자격증과 학습 전략을 찾고 있습니다'
              }
              steps={CERTIFICATION_CONFIG.analyzingSteps}
            />
          )}

          {step === 'results' && (
            <CertificationResults
              recommendations={CERTIFICATION_RECOMMENDATIONS}
              alternatives={CERTIFICATION_ALTERNATIVES}
              onComplete={onComplete}
              examDate={examDate}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
