import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { RecommendationHeader } from '../shared/RecommendationHeader';
import { AnalyzingAnimation } from '../shared/AnalyzingAnimation';
import { AIAdviceCard } from '../shared/AIAdviceCard';
import { TransferForm } from './TransferForm';
import { TransferResults } from './TransferResults';
import {
  TRANSFER_CONFIG,
  TRANSFER_RECOMMENDATIONS,
  TRANSFER_ALTERNATIVES,
} from '../../../lib/recommendation-data/transferData';
import type { TransferFormData } from '../../../lib/recommendation-data/transferData';
import type { CategoryRecommendationProps } from '../../../lib/recommendation-data/types';

export function TransferRecommendation({ onBack, onComplete }: CategoryRecommendationProps) {
  const [step, setStep] = useState<'input' | 'analyzing' | 'results'>('input');
  const [formData, setFormData] = useState<Record<string, unknown> | null>(null);

  const handleSubmit = (data: TransferFormData) => {
    setFormData(data);
    setStep('analyzing');
    setTimeout(() => {
      setStep('results');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <RecommendationHeader
        title={TRANSFER_CONFIG.pageTitle}
        subtitle={TRANSFER_CONFIG.pageSubtitle}
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
                <TransferForm onSubmit={handleSubmit} />
              </motion.div>
            )}

            {step === 'analyzing' && (
              <AnalyzingAnimation steps={TRANSFER_CONFIG.analyzingSteps} />
            )}

            {step === 'results' && (
              <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <AIAdviceCard context={JSON.stringify(formData ?? {})} />
              <TransferResults
                recommendations={TRANSFER_RECOMMENDATIONS}
                alternatives={TRANSFER_ALTERNATIVES}
                onComplete={onComplete}
              />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
