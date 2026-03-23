// 다이나믹 프라이싱 제도 - 러너 티어별 가격 설정
// 러너(합격생)는 실적이 쌓일수록 더 높은 가격을 설정할 수 있음

export type TierKey = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface PricingTier {
  key: TierKey;
  name: string;
  emoji: string;
  minSessions: number;
  minReviews: number;
  minRating: number;
  minPrice: number;
  maxPrice: number;
  fee: number; // 플랫폼 수수료 (0.25 = 25%)
}

export const PRICING_TIERS: Record<TierKey, PricingTier> = {
  bronze: {
    key: 'bronze',
    name: '브론즈',
    emoji: '🥉',
    minSessions: 0,
    minReviews: 0,
    minRating: 0,
    minPrice: 15000,
    maxPrice: 30000,
    fee: 0.25,
  },
  silver: {
    key: 'silver',
    name: '실버',
    emoji: '🥈',
    minSessions: 11,
    minReviews: 8,
    minRating: 4.5,
    minPrice: 30000,
    maxPrice: 50000,
    fee: 0.22,
  },
  gold: {
    key: 'gold',
    name: '골드',
    emoji: '🥇',
    minSessions: 31,
    minReviews: 21,
    minRating: 4.7,
    minPrice: 50000,
    maxPrice: 80000,
    fee: 0.18,
  },
  platinum: {
    key: 'platinum',
    name: '플래티넘',
    emoji: '💎',
    minSessions: 61,
    minReviews: 35,
    minRating: 4.8,
    minPrice: 80000,
    maxPrice: 120000,
    fee: 0.15,
  },
};

// 티어 순서 (승급 순)
export const TIER_ORDER: TierKey[] = ['bronze', 'silver', 'gold', 'platinum'];

/**
 * 러너의 실적 기반으로 현재 티어 계산
 */
export function getTierForRunner(sessions: number, reviews: number, rating: number): TierKey {
  // 높은 티어부터 체크 (platinum → gold → silver → bronze)
  for (let i = TIER_ORDER.length - 1; i >= 0; i--) {
    const tier = PRICING_TIERS[TIER_ORDER[i]];
    if (
      sessions >= tier.minSessions &&
      reviews >= tier.minReviews &&
      (tier.minRating === 0 || rating >= tier.minRating)
    ) {
      return TIER_ORDER[i];
    }
  }
  return 'bronze';
}

/**
 * 티어의 가격 범위 반환
 */
export function getPriceRange(tier: TierKey): { min: number; max: number } {
  const t = PRICING_TIERS[tier];
  return { min: t.minPrice, max: t.maxPrice };
}

/**
 * 가격을 한국 원화 형식으로 포맷 (예: 50,000원)
 */
export function formatPrice(amount: number): string {
  return `${Math.round(amount).toLocaleString()}원`;
}

/**
 * 큰 금액을 만원 단위로 포맷 (예: 367만원)
 */
export function formatPriceInMan(amount: number): string {
  if (amount >= 10000) {
    const man = Math.round(amount / 10000);
    return `${man.toLocaleString()}만원`;
  }
  return formatPrice(amount);
}

/**
 * 해당 가격이 티어 범위 내인지 검증
 */
export function validatePrice(price: number, tier: TierKey): boolean {
  const range = getPriceRange(tier);
  return price >= range.min && price <= range.max;
}

/**
 * 다음 티어 승급까지 필요한 조건 계산
 */
export function getNextTierRequirements(
  currentTier: TierKey,
  stats: { sessions: number; reviews: number; rating: number }
): { nextTier: PricingTier; sessionsNeeded: number; reviewsNeeded: number; ratingNeeded: number } | null {
  const currentIndex = TIER_ORDER.indexOf(currentTier);
  if (currentIndex >= TIER_ORDER.length - 1) return null; // 이미 최고 티어

  const nextTier = PRICING_TIERS[TIER_ORDER[currentIndex + 1]];
  return {
    nextTier,
    sessionsNeeded: Math.max(0, nextTier.minSessions - stats.sessions),
    reviewsNeeded: Math.max(0, nextTier.minReviews - stats.reviews),
    ratingNeeded: Math.max(0, nextTier.minRating - stats.rating),
  };
}

/**
 * 30분 세션 가격 계산 (60분 가격의 65%)
 */
export function get30MinPrice(price60Min: number): number {
  return Math.round(price60Min * 0.65);
}

/**
 * 플랫폼 수수료율 반환
 */
export function getPlatformFee(tier: TierKey): number {
  return PRICING_TIERS[tier].fee;
}
