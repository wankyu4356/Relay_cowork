import type { Category } from './GlobalNav';
import { TransferRecommendation } from './ai-recommendation/transfer/TransferRecommendation';
import { AdmissionRecommendation } from './ai-recommendation/admission/AdmissionRecommendation';
import { CareerRecommendation } from './ai-recommendation/career/CareerRecommendation';
import { CertificationRecommendation } from './ai-recommendation/certification/CertificationRecommendation';
import { OtherRecommendation } from './ai-recommendation/other/OtherRecommendation';
import type { CategoryRecommendationProps } from '../lib/recommendation-data/types';

interface AIRecommendationProps {
  onBack: () => void;
  onComplete?: () => void;
  selectedCategory?: Category;
}

const componentMap: Record<Category, React.ComponentType<CategoryRecommendationProps>> = {
  transfer: TransferRecommendation,
  admission: AdmissionRecommendation,
  career: CareerRecommendation,
  certification: CertificationRecommendation,
  other: OtherRecommendation,
};

export function AIRecommendation({ onBack, onComplete, selectedCategory }: AIRecommendationProps) {
  const category = selectedCategory ?? 'transfer';
  const Component = componentMap[category];
  return <Component onBack={onBack} onComplete={onComplete} />;
}
