import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { RecommendationHeader } from '../shared/RecommendationHeader';
import { AnalyzingAnimation } from '../shared/AnalyzingAnimation';
import { AdmissionForm } from './AdmissionForm';
import { AdmissionResults } from './AdmissionResults';
import {
  admissionConfig,
  mockAdmissionRecommendations,
  mockAdmissionAlternatives,
} from '../../../lib/recommendation-data/admissionData';
import type { AdmissionFormData } from '../../../lib/recommendation-data/admissionData';
import type { CategoryRecommendationProps } from '../../../lib/recommendation-data/types';

type Step = 'form' | 'analyzing' | 'results';

export function AdmissionRecommendation({ onBack, onComplete }: CategoryRecommendationProps) {
  const [step, setStep] = useState<Step>('form');
  const [, setFormData] = useState<AdmissionFormData | null>(null);

  const handleFormSubmit = (data: AdmissionFormData) => {
    setFormData(data);
    setStep('analyzing');

    setTimeout(() => {
      setStep('results');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <RecommendationHeader
        title={admissionConfig.pageTitle}
        subtitle={admissionConfig.pageSubtitle}
        onBack={onBack}
      />

      <AnimatePresence mode="wait">
        {step === 'form' && <AdmissionForm onSubmit={handleFormSubmit} />}

        {step === 'analyzing' && (
          <AnalyzingAnimation
            description={'입력하신 정보를 바탕으로\n최적의 대학과 전공을 찾고 있습니다'}
            steps={admissionConfig.analyzingSteps}
          />
        )}

        {step === 'results' && (
          <AdmissionResults
            recommendations={mockAdmissionRecommendations}
            alternatives={mockAdmissionAlternatives}
            onComplete={onComplete}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
