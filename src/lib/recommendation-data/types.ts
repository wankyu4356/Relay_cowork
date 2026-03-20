import type { Category } from '../../components/GlobalNav';

export interface CategoryRecommendationProps {
  onBack: () => void;
  onComplete?: () => void;
}

export type { Category };
