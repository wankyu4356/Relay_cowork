import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { RecommendationHeader } from '../shared/RecommendationHeader';
import { AnalyzingAnimation } from '../shared/AnalyzingAnimation';
import { CareerForm } from './CareerForm';
import { CareerResults } from './CareerResults';
import {
  careerConfig,
  mockCareerRecommendations,
  mockCareerAlternatives,
  type CareerFormData,
} from '../../../lib/recommendation-data/careerData';
import type { CategoryRecommendationProps } from '../../../lib/recommendation-data/types';

type Step = 'form' | 'analyzing' | 'results';

export function CareerRecommendation({
  onBack,
  onComplete,
}: CategoryRecommendationProps) {
  const [step, setStep] = useState<Step>('form');

  const handleSubmit = (_data: CareerFormData) => {
    setStep('analyzing');
    setTimeout(() => {
      setStep('results');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <RecommendationHeader
        title={careerConfig.pageTitle}
        subtitle={careerConfig.pageSubtitle}
        onBack={onBack}
      />
      <AnimatePresence mode="wait">
        {step === 'form' && <CareerForm onSubmit={handleSubmit} />}
        {step === 'analyzing' && (
          <AnalyzingAnimation
            description={
              '입력하신 정보를 바탕으로\n최적의 기업과 직무를 찾고 있습니다'
            }
            steps={careerConfig.analyzingSteps}
          />
        )}
        {step === 'results' && (
          <CareerResults
            recommendations={mockCareerRecommendations}
            alternatives={mockCareerAlternatives}
            onComplete={onComplete}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
