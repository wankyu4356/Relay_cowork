import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RecommendationHeader } from '../shared/RecommendationHeader';
import { AnalyzingAnimation } from '../shared/AnalyzingAnimation';
import { OtherForm } from './OtherForm';
import { OtherResults } from './OtherResults';
import {
  OTHER_CONFIG,
  OTHER_RECOMMENDATIONS,
  OTHER_ALTERNATIVES,
} from '../../../lib/recommendation-data/otherData';
import type { CategoryRecommendationProps } from '../../../lib/recommendation-data/types';

export function OtherRecommendation({ onBack, onComplete }: CategoryRecommendationProps) {
  const [step, setStep] = useState<'input' | 'analyzing' | 'results'>('input');

  const handleSubmit = () => {
    setStep('analyzing');
    setTimeout(() => {
      setStep('results');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <RecommendationHeader
        title={OTHER_CONFIG.pageTitle}
        subtitle={OTHER_CONFIG.pageSubtitle}
        onBack={onBack}
      />

      <div className="container-web py-8">
        <div className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            {step === 'input' && (
              <motion.div
                key="input"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <OtherForm onSubmit={handleSubmit} />
              </motion.div>
            )}

            {step === 'analyzing' && (
              <AnalyzingAnimation
                steps={OTHER_CONFIG.analyzingSteps}
                description={'입력하신 정보를 바탕으로\n최적의 경로와 전략을 찾고 있습니다'}
              />
            )}

            {step === 'results' && (
              <OtherResults
                recommendations={OTHER_RECOMMENDATIONS}
                alternatives={OTHER_ALTERNATIVES}
                onComplete={onComplete}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
